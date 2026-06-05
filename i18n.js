/* ============================================================================
   Puccettoni — lightweight i18n (EN base, + ES / IT / PT)
   - Auto-detects the visitor's browser language on first visit
   - Remembers the manual choice (localStorage)
   - Translates content automatically by matching each element's English
     innerHTML against DICT (no per-element tagging needed). Inline markup
     (<em>, icons/<svg>, <br>) is preserved because the dictionary value is the
     full translated innerHTML.
   - Also handles explicit data-i18n / data-i18n-attr (used by the nav) and
     common attributes (placeholder, aria-label, title).
   - A MutationObserver re-translates nodes added later (nav, form thanks…).

   English is the source of truth. Missing translations fall back to English.
   PucI18n.__extract() dumps the page's translatable strings (used to build DICT).
   ========================================================================== */
(function () {
  "use strict";

  var LANGS = ["en", "es", "it", "pt"];
  var INLINE = { EM:1,B:1,I:1,STRONG:1,SPAN:1,SMALL:1,SUP:1,SUB:1,U:1,A:1,BR:1,svg:1,SVG:1,MARK:1 };
  var SKIP_TAG = { SCRIPT:1,STYLE:1,NOSCRIPT:1,svg:1,SVG:1,IMG:1,INPUT:1,TEXTAREA:1,SELECT:1,HEAD:1,META:1,LINK:1 };
  var ATTRS = ["placeholder", "aria-label", "title"];

  function norm(s){ return (s || "").replace(/\s+/g, " ").trim(); }

  // ---- DICT: key = normalized English innerHTML (or attribute value) ----
  // value = { es, it, pt }. Filled by build below; extend freely.
  var DICT = window.__PUC_DICT__ || {};

  function detect(){
    try { var s = localStorage.getItem("puc_lang"); if (s && LANGS.indexOf(s) >= 0) return s; } catch(e){}
    var n = (navigator.language || navigator.userLanguage || "en").slice(0,2).toLowerCase();
    return LANGS.indexOf(n) >= 0 ? n : "en";
  }
  var current = detect();

  function tr(key){ var e = DICT[norm(key)]; return e && e[current] ? e[current] : null; }

  var origHTML = new WeakMap();
  var origAttr = new WeakMap();

  // An element is a translation "unit" if it holds text directly and has no
  // block-level element children (only inline/icons), so its whole innerHTML
  // is one translatable phrase.
  function isUnit(el){
    if (SKIP_TAG[el.nodeName]) return false;
    var hasText = false;
    for (var n = el.firstChild; n; n = n.nextSibling){
      if (n.nodeType === 3){ if (norm(n.nodeValue)) hasText = true; }
      else if (n.nodeType === 1){ if (!INLINE[n.nodeName]) return false; }
    }
    return hasText;
  }

  function insideSkippable(el){
    for (var p = el; p; p = p.parentElement){
      if (p.nodeName === "SCRIPT" || p.nodeName === "STYLE") return true;
      if (p.classList && (p.classList.contains("sitenav") || p.classList.contains("puc-lang"))) return true;
      if (p.hasAttribute && p.hasAttribute("data-i18n")) return true;
    }
    return false;
  }

  function translateUnits(root){
    var all = root.querySelectorAll ? root.querySelectorAll("*") : [];
    var done = [];
    for (var i = 0; i < all.length; i++){
      var el = all[i];
      if (SKIP_TAG[el.nodeName]) continue;
      if (insideSkippable(el)) continue;
      if (!isUnit(el)) continue;
      // skip if a translated unit is an ancestor (avoid double work)
      var skip = false;
      for (var d = 0; d < done.length; d++){ if (done[d].contains(el) && done[d] !== el){ skip = true; break; } }
      if (skip) continue;
      if (!origHTML.has(el)) origHTML.set(el, el.innerHTML);
      var en = origHTML.get(el);
      if (current === "en"){ if (el.innerHTML !== en) el.innerHTML = en; }
      else { var t = tr(en); el.innerHTML = (t != null) ? t : en; }
      done.push(el);
    }
  }

  function translateExplicit(root){
    var els = root.querySelectorAll ? root.querySelectorAll("[data-i18n]") : [];
    for (var i = 0; i < els.length; i++){
      var el = els[i];
      if (!origHTML.has(el)) origHTML.set(el, el.innerHTML);
      var en = origHTML.get(el);
      var key = el.getAttribute("data-i18n") || en;
      if (current === "en"){ if (el.innerHTML !== en) el.innerHTML = en; }
      else { var t = tr(key); el.innerHTML = (t != null) ? t : en; }
    }
  }

  function translateAttrs(root){
    var sel = ATTRS.map(function(a){ return "[" + a + "]"; }).join(",");
    var els = root.querySelectorAll ? root.querySelectorAll(sel) : [];
    for (var i = 0; i < els.length; i++){
      var el = els[i];
      var store = origAttr.get(el) || {};
      for (var j = 0; j < ATTRS.length; j++){
        var a = ATTRS[j];
        if (!el.hasAttribute(a)) continue;
        if (!(a in store)) store[a] = el.getAttribute(a);
        var en = store[a];
        var t = current === "en" ? en : (tr(en) || en);
        if (el.getAttribute(a) !== t) el.setAttribute(a, t);
      }
      origAttr.set(el, store);
    }
  }

  function apply(root){
    root = root || document.body;
    if (root.nodeType !== 1 && root.nodeType !== 9) root = document.body;
    translateExplicit(root.nodeType === 9 ? root.documentElement : root);
    translateUnits(root.nodeType === 9 ? document.body : root);
    translateAttrs(root.nodeType === 9 ? document.body : root);
    document.documentElement.lang = current;
    updateSwitcher();
  }

  function set(lang){
    if (LANGS.indexOf(lang) < 0) return;
    current = lang;
    try { localStorage.setItem("puc_lang", lang); } catch(e){}
    apply(document.body);
  }

  // ---- debug: collect every translatable English string on the page ----
  function __extract(){
    var units = {}, attrs = {};
    var all = document.body.querySelectorAll("*");
    var done = [];
    for (var i = 0; i < all.length; i++){
      var el = all[i];
      if (SKIP_TAG[el.nodeName] || insideSkippable(el) || !isUnit(el)) continue;
      var skip = false;
      for (var d = 0; d < done.length; d++){ if (done[d].contains(el) && done[d] !== el){ skip = true; break; } }
      if (skip) continue;
      var k = norm(el.innerHTML);
      if (k) units[k] = true;
      done.push(el);
    }
    var withAttr = document.body.querySelectorAll(ATTRS.map(function(a){return "["+a+"]";}).join(","));
    for (var j = 0; j < withAttr.length; j++){
      for (var a = 0; a < ATTRS.length; a++){
        var v = norm(withAttr[j].getAttribute(ATTRS[a]) || "");
        if (v) attrs[v] = true;
      }
    }
    return { units: Object.keys(units), attrs: Object.keys(attrs) };
  }

  window.PucI18n = { set: set, get: function(){ return current; }, apply: apply, dict: DICT, __extract: __extract };

  // ---- language switcher ----
  function updateSwitcher(){
    var bs = document.querySelectorAll(".puc-lang button");
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute("aria-current", bs[i].dataset.lang === current ? "true" : "false");
  }
  function wireSwitcher(el){
    el.addEventListener("click", function(e){
      var b = e.target.closest("button[data-lang]");
      if (b) set(b.dataset.lang);
    });
  }
  function ensureFallbackSwitcher(){
    if (document.querySelector(".puc-lang")) return;
    var style = document.createElement("style");
    style.textContent =
      ".puc-lang--float{position:fixed;top:12px;right:12px;z-index:1500;display:inline-flex;gap:1px;" +
      "background:rgba(255,244,227,.92);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);" +
      "border:1px solid rgba(193,121,19,.28);border-radius:22px;padding:3px}" +
      ".puc-lang--float button{font-family:'Cinzel',serif;font-size:10px;letter-spacing:.08em;font-weight:700;color:#5b4d3c;" +
      "background:none;border:none;border-radius:18px;padding:5px 8px;cursor:pointer}" +
      ".puc-lang--float button[aria-current='true']{background:#C17913;color:#fff}";
    document.head.appendChild(style);
    var box = document.createElement("div");
    box.className = "puc-lang puc-lang--float";
    box.setAttribute("aria-label", "Choose language");
    box.innerHTML = LANGS.map(function(l){ return '<button type="button" data-lang="'+l+'">'+l.toUpperCase()+"</button>"; }).join("");
    wireSwitcher(box);
    document.body.appendChild(box);
  }

  function init(){
    apply(document.body);
    ensureFallbackSwitcher();
    var ls = document.querySelectorAll(".puc-lang");
    for (var i = 0; i < ls.length; i++) wireSwitcher(ls[i]);
    var mo = new MutationObserver(function(muts){
      for (var m = 0; m < muts.length; m++){
        for (var n = 0; n < muts[m].addedNodes.length; n++){
          var node = muts[m].addedNodes[n];
          if (node.nodeType === 1){
            if (node.classList && node.classList.contains("puc-lang")) wireSwitcher(node);
            apply(node);
          }
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    updateSwitcher();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

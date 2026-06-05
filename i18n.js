/* ============================================================================
   Puccettoni — lightweight i18n (EN base, + ES / IT / PT)
   - Auto-detects the visitor's browser language on first visit
   - Remembers the manual choice (localStorage)
   - Translates any element marked  data-i18n  (innerHTML, keeps inline markup)
   - Translates attributes via  data-i18n-attr="placeholder,aria-label,alt,title"
   - A MutationObserver re-translates nodes added later (e.g. the nav, form thanks)

   English is the source of truth: the key is the element's English innerHTML
   (or the data-i18n value if set). Missing translations fall back to English.
   Add new strings to DICT below — coordinate validation (IT = Marco).
   ========================================================================== */
(function () {
  "use strict";

  var LANGS = ["en", "es", "it", "pt"];

  // key (English text/HTML, trimmed) -> { es, it, pt }
  var DICT = {
    // ---- Global navigation (shared on every page) ----
    "Home":        { es: "Inicio",          it: "Home",            pt: "Início" },
    "Locations":   { es: "Ubicaciones",     it: "Sedi",            pt: "Localização" },
    "Our History": { es: "Nuestra Historia",it: "La Nostra Storia",pt: "Nossa História" },
    "Catering":    { es: "Catering",        it: "Catering",        pt: "Catering" },
    "Franchise":   { es: "Franquicias",     it: "Franchising",     pt: "Franquias" },
    "Open menu":   { es: "Abrir menú",      it: "Apri menu",       pt: "Abrir menu" },
    "Close menu":  { es: "Cerrar menú",     it: "Chiudi menu",     pt: "Fechar menu" },
    "Choose language": { es: "Elegir idioma", it: "Scegli lingua", pt: "Escolher idioma" }
  };

  function norm(s) { return (s || "").replace(/\s+/g, " ").trim(); }

  function detect() {
    try {
      var saved = localStorage.getItem("puc_lang");
      if (saved && LANGS.indexOf(saved) >= 0) return saved;
    } catch (e) {}
    var n = (navigator.language || navigator.userLanguage || "en").slice(0, 2).toLowerCase();
    return LANGS.indexOf(n) >= 0 ? n : "en";
  }

  var current = detect();
  var origHTML = new WeakMap(); // el -> English innerHTML
  var origAttr = new WeakMap(); // el -> { attr: englishValue }

  function lookup(key) {
    var e = DICT[norm(key)];
    if (!e) return null;
    return e[current] || null;
  }

  function applyEl(el) {
    // innerHTML translation
    if (el.hasAttribute("data-i18n")) {
      if (!origHTML.has(el)) origHTML.set(el, el.innerHTML);
      var enHTML = origHTML.get(el);
      var key = el.getAttribute("data-i18n") || enHTML;
      if (current === "en") {
        if (el.innerHTML !== enHTML) el.innerHTML = enHTML;
      } else {
        var t = lookup(key);
        el.innerHTML = (t != null) ? t : enHTML;
      }
    }
    // attribute translation
    if (el.hasAttribute("data-i18n-attr")) {
      var attrs = el.getAttribute("data-i18n-attr").split(",");
      var store = origAttr.get(el) || {};
      attrs.forEach(function (a) {
        a = a.trim(); if (!a || !el.hasAttribute(a)) return;
        if (!(a in store)) store[a] = el.getAttribute(a);
        var en = store[a];
        var t = current === "en" ? en : (lookup(en) || en);
        el.setAttribute(a, t);
      });
      origAttr.set(el, store);
    }
  }

  function apply(root) {
    root = root || document;
    if (root.nodeType === 1 && (root.hasAttribute("data-i18n") || root.hasAttribute("data-i18n-attr"))) applyEl(root);
    var els = root.querySelectorAll ? root.querySelectorAll("[data-i18n],[data-i18n-attr]") : [];
    for (var i = 0; i < els.length; i++) applyEl(els[i]);
    document.documentElement.lang = current;
    updateSwitcher();
  }

  function set(lang) {
    if (LANGS.indexOf(lang) < 0) return;
    current = lang;
    try { localStorage.setItem("puc_lang", lang); } catch (e) {}
    apply(document);
  }

  window.PucI18n = { set: set, get: function () { return current; }, apply: apply, dict: DICT };

  // ---- Language switcher (fallback floating control for pages without the nav) ----
  function updateSwitcher() {
    document.querySelectorAll(".puc-lang button").forEach(function (b) {
      b.setAttribute("aria-current", b.dataset.lang === current ? "true" : "false");
    });
  }

  function switcherHTML() {
    return LANGS.map(function (l) {
      return '<button type="button" data-lang="' + l + '">' + l.toUpperCase() + "</button>";
    }).join("");
  }

  function wireSwitcher(el) {
    el.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-lang]");
      if (b) set(b.dataset.lang);
    });
  }

  function ensureFallbackSwitcher() {
    // If the global nav rendered its own switcher, do nothing.
    if (document.querySelector(".sitenav .puc-lang") || document.querySelector(".puc-lang")) return;
    var style = document.createElement("style");
    style.textContent =
      ".puc-lang--float{position:fixed;top:12px;right:12px;z-index:1500;display:inline-flex;gap:2px;" +
      "background:rgba(255,244,227,.92);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);" +
      "border:1px solid rgba(193,121,19,.28);border-radius:22px;padding:3px}" +
      ".puc-lang button{font-family:'Cinzel',serif;font-size:10px;letter-spacing:.1em;font-weight:700;color:#5b4d3c;" +
      "background:none;border:none;border-radius:18px;padding:5px 9px;cursor:pointer;transition:background .15s,color .15s}" +
      ".puc-lang button[aria-current='true']{background:#C17913;color:#fff}" +
      ".puc-lang button:hover{color:#C17913}.puc-lang button[aria-current='true']:hover{color:#fff}";
    document.head.appendChild(style);
    var nav = document.createElement("div");
    nav.className = "puc-lang puc-lang--float";
    nav.setAttribute("aria-label", "Choose language");
    nav.innerHTML = switcherHTML();
    wireSwitcher(nav);
    document.body.appendChild(nav);
  }

  function init() {
    apply(document);
    ensureFallbackSwitcher();
    // Wire any switcher the nav injected, and re-translate dynamically added nodes.
    document.querySelectorAll(".puc-lang").forEach(wireSwitcher);
    var mo = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        for (var i = 0; i < m.addedNodes.length; i++) {
          var node = m.addedNodes[i];
          if (node.nodeType === 1) {
            if (node.classList && node.classList.contains("puc-lang")) wireSwitcher(node);
            apply(node);
          }
        }
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    updateSwitcher();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

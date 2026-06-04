/* ============================================================================
   Puccettoni — shared sticky site navigation
   Injects one consistent top bar (fixed, follows scroll) into every page.
   Edit links / styling here only — all pages pick it up via <script src="nav.js" defer>.
   ========================================================================== */
(function () {
  "use strict";

  // --- Site pages (single source of truth) ---
  // "Localização" is a dropdown: as franchises open there will be many
  // locations, so the bar shows one entry that lists the live stores.
  var LINKS = [
    { label: "Home",        href: "index.html" },
    { label: "Localização", children: [
      { label: "Fort Lauderdale", href: "fortlauderdale.html" },
      { label: "Pompano Beach",   href: "pompano.html" }
    ] },
    { label: "Our History", href: "history.html" },
    { label: "Catering",    href: "catering.html" },
    { label: "Franchise",   href: "franchise.html" }
  ];
  var NAV_H = 88; // px

  // --- Which page are we on? (filename, default index.html) ---
  var path = location.pathname.split("/").pop().toLowerCase();
  if (!path) path = "index.html";

  // --- Styles (self-contained so it works on every page regardless of its CSS) ---
  var css = [
    ":root{--sitenav-h:" + NAV_H + "px}",
    "body{padding-top:var(--sitenav-h)!important}",
    // Bar is static (absolute at page top) per Marco — it scrolls away with the page,
    // so no scroll-padding or sticky-side-panel offset is needed.

    ".sitenav{position:absolute;top:0;left:0;right:0;z-index:200;height:var(--sitenav-h);" +
      "display:flex;align-items:center;font-family:'Manrope',sans-serif;" +
      "background:rgba(255,244,227,.82);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);" +
      "border-bottom:1px solid rgba(193,121,19,.16);transition:background .25s,box-shadow .25s,border-color .25s}",
    ".sitenav.is-scrolled{background:rgba(255,244,227,.96);box-shadow:0 10px 30px -18px rgba(40,24,8,.5);border-bottom-color:rgba(193,121,19,.28)}",
    ".sitenav__inner{width:100%;max-width:1320px;margin:0 auto;padding:0 clamp(16px,4vw,28px);" +
      "display:flex;align-items:center;gap:18px}",

    ".sitenav__brand{display:inline-flex;align-items:center;text-decoration:none;flex:0 0 auto;margin-right:auto}",
    ".sitenav__logo{height:64px;width:auto;display:block}",
    "@media(max-width:520px){.sitenav__logo{height:48px}}",

    ".sitenav__links{display:flex;align-items:center;gap:clamp(14px,1.8vw,26px);list-style:none;margin:0;padding:0}",
    ".sitenav__link{font-family:'Cinzel',serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase;" +
      "font-weight:600;color:#5b4d3c;text-decoration:none;white-space:nowrap;position:relative;padding:6px 0;" +
      "background:none;border:none;cursor:pointer;transition:color .2s;display:inline-flex;align-items:center;gap:5px}",
    ".sitenav__link::after{content:'';position:absolute;left:0;right:0;bottom:0;height:1.5px;background:#C17913;" +
      "transform:scaleX(0);transform-origin:left center;transition:transform .25s}",
    ".sitenav__link:hover,.sitenav__link:focus-visible{color:#C17913;outline:none}",
    ".sitenav__link:hover::after,.sitenav__link:focus-visible::after{transform:scaleX(1)}",
    ".sitenav__link.is-active{color:#C17913}",
    ".sitenav__link.is-active::after{transform:scaleX(1);opacity:.55}",

    // dropdown (Localização)
    ".sitenav__item{position:relative;display:inline-flex;align-items:center}",
    ".sitenav__caret{width:10px;height:10px;transition:transform .22s}",
    ".sitenav__dropdown{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(8px);" +
      "min-width:184px;background:#fff;border:1px solid rgba(193,121,19,.18);border-radius:12px;padding:6px;" +
      "box-shadow:0 20px 44px -18px rgba(40,24,8,.5);opacity:0;visibility:hidden;" +
      "transition:opacity .2s,visibility .2s,transform .2s;z-index:10}",
    // invisible bridge so hover survives the gap between button and panel
    ".sitenav__dropdown::before{content:'';position:absolute;top:-12px;left:0;right:0;height:12px}",
    ".sitenav__item:hover .sitenav__dropdown,.sitenav__item:focus-within .sitenav__dropdown,.sitenav__dropdown.is-open{" +
      "opacity:1;visibility:visible;transform:translateX(-50%) translateY(2px)}",
    ".sitenav__item:hover .sitenav__caret,.sitenav__item:focus-within .sitenav__caret,.sitenav__menubtn[aria-expanded='true'] .sitenav__caret{transform:rotate(180deg)}",
    ".sitenav__dropdown a{display:block;padding:11px 14px;border-radius:8px;font-family:'Cinzel',serif;font-size:11px;" +
      "letter-spacing:.12em;text-transform:uppercase;font-weight:600;color:#5b4d3c;text-decoration:none;white-space:nowrap;" +
      "transition:background .15s,color .15s}",
    ".sitenav__dropdown a:hover,.sitenav__dropdown a:focus-visible{background:rgba(193,121,19,.1);color:#C17913;outline:none}",
    ".sitenav__dropdown a.is-active-sub{color:#C17913;background:rgba(193,121,19,.08)}",

    // hamburger (hidden on desktop)
    ".sitenav__toggle{display:none;flex:0 0 auto;width:42px;height:42px;border:1px solid rgba(193,121,19,.3);" +
      "border-radius:12px;background:transparent;cursor:pointer;align-items:center;justify-content:center;color:#C17913}",
    ".sitenav__toggle svg{width:22px;height:22px}",

    // mobile dropdown panel
    ".sitenav__panel{position:absolute;top:100%;left:0;right:0;z-index:199;" +
      "background:rgba(255,244,227,.98);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);" +
      "border-bottom:1px solid rgba(193,121,19,.22);box-shadow:0 18px 40px -24px rgba(40,24,8,.5);" +
      "transform:translateY(-12px);opacity:0;visibility:hidden;transition:transform .26s,opacity .26s,visibility .26s}",
    ".sitenav__panel.is-open{transform:translateY(0);opacity:1;visibility:visible}",
    ".sitenav__panel ul{list-style:none;margin:0;padding:8px clamp(16px,5vw,28px) 18px;display:flex;flex-direction:column}",
    ".sitenav__panel a{display:block;padding:13px 4px;font-family:'Cinzel',serif;font-size:13px;letter-spacing:.12em;" +
      "text-transform:uppercase;font-weight:600;color:#5b4d3c;text-decoration:none;border-bottom:1px solid rgba(193,121,19,.12)}",
    ".sitenav__panel a.is-active{color:#C17913}",
    ".sitenav__panel a.sub{padding-left:18px;font-size:12px;color:#7a6c5a}",
    ".sitenav__panel .grp{padding:14px 4px 6px;font-family:'Cinzel',serif;font-size:11px;letter-spacing:.16em;" +
      "text-transform:uppercase;font-weight:700;color:#C17913}",
    ".sitenav__panel li:last-child a{border-bottom:none}",

    "@media(max-width:980px){.sitenav__links{display:none}.sitenav__toggle{display:inline-flex}}",
    "@media(prefers-reduced-motion:reduce){.sitenav,.sitenav__link::after,.sitenav__panel,.sitenav__dropdown{transition:none}}"
  ].join("\n");

  var styleEl = document.createElement("style");
  styleEl.id = "sitenav-style";
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // --- Helpers ---
  function isActive(href) { return href && href.toLowerCase() === path; }
  var caret = '<svg class="sitenav__caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  function ext(item) { return item.external ? ' target="_blank" rel="noopener"' : ""; }

  // --- Desktop links markup ---
  var linksHtml = LINKS.map(function (l) {
    if (l.children) {
      var anyActive = l.children.some(function (c) { return isActive(c.href); });
      var sub = l.children.map(function (c) {
        var ca = isActive(c.href) ? ' class="is-active-sub" aria-current="page"' : "";
        return "<a" + ca + ' href="' + c.href + '"' + ext(c) + ">" + c.label + "</a>";
      }).join("");
      return '<div class="sitenav__item">' +
        '<button type="button" class="sitenav__link sitenav__menubtn' + (anyActive ? " is-active" : "") + '" aria-haspopup="true" aria-expanded="false">' +
          l.label + caret +
        "</button>" +
        '<div class="sitenav__dropdown">' + sub + "</div>" +
      "</div>";
    }
    var active = isActive(l.href) ? " is-active" : "";
    var aria = isActive(l.href) ? ' aria-current="page"' : "";
    return '<a class="sitenav__link' + active + '" href="' + l.href + '"' + aria + ">" + l.label + "</a>";
  }).join("");

  // --- Mobile panel markup ---
  var panelHtml = "<ul>" + LINKS.map(function (l) {
    if (l.children) {
      return '<li class="grp">' + l.label + "</li>" + l.children.map(function (c) {
        var ca = isActive(c.href) ? "sub is-active" : "sub";
        return '<li><a class="' + ca + '" href="' + c.href + '"' + ext(c) + ">" + c.label + "</a></li>";
      }).join("");
    }
    var active = isActive(l.href) ? " is-active" : "";
    var aria = isActive(l.href) ? ' aria-current="page"' : "";
    return '<li><a class="' + active.trim() + '" href="' + l.href + '"' + aria + ">" + l.label + "</a></li>";
  }).join("") + "</ul>";

  var nav = document.createElement("header");
  nav.className = "sitenav";
  nav.innerHTML =
    '<div class="sitenav__inner">' +
      '<a class="sitenav__brand" href="index.html" aria-label="Puccettoni home">' +
        '<img class="sitenav__logo" src="Images/logo.png" alt="Puccettoni">' +
      "</a>" +
      '<nav class="sitenav__links" aria-label="Primary">' + linksHtml + "</nav>" +
      '<button class="sitenav__toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="sitenavPanel">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>' +
      "</button>" +
    "</div>";

  var panel = document.createElement("div");
  panel.className = "sitenav__panel";
  panel.id = "sitenavPanel";
  panel.innerHTML = panelHtml;

  function mount() {
    document.body.insertBefore(panel, document.body.firstChild);
    document.body.insertBefore(nav, document.body.firstChild);

    // mobile hamburger
    var toggle = nav.querySelector(".sitenav__toggle");
    function setOpen(open) {
      panel.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    toggle.addEventListener("click", function () {
      setOpen(!panel.classList.contains("is-open"));
    });
    panel.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });

    // desktop dropdown (click for touch; CSS handles hover/focus)
    var menuBtns = nav.querySelectorAll(".sitenav__menubtn");
    menuBtns.forEach(function (btn) {
      var dd = btn.nextElementSibling;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var open = !dd.classList.contains("is-open");
        dd.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target)) {
        nav.querySelectorAll(".sitenav__dropdown.is-open").forEach(function (dd) {
          dd.classList.remove("is-open");
          var b = dd.previousElementSibling;
          if (b) b.setAttribute("aria-expanded", "false");
        });
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setOpen(false);
        nav.querySelectorAll(".sitenav__dropdown.is-open").forEach(function (dd) { dd.classList.remove("is-open"); });
      }
    });

    // shadow once scrolled
    function onScroll() {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();

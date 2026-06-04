/* ============================================================================
   Puccettoni — shared sticky site navigation
   Injects one consistent top bar (fixed, follows scroll) into every page.
   Edit links / styling here only — all pages pick it up via <script src="nav.js" defer>.
   ========================================================================== */
(function () {
  "use strict";

  // --- Site pages (single source of truth) ---
  var LINKS = [
    { label: "Home",            href: "index.html" },
    { label: "Pompano Beach",   href: "pompano.html" },
    { label: "Fort Lauderdale", href: "fortlauderdale.html" },
    { label: "Menu",            href: "products.html" },
    { label: "Catering",        href: "catering.html" },
    { label: "Franchise",       href: "franchise.html" }
  ];
  var PHONE_TEL = "tel:7543074992";
  var PHONE_LABEL = "Order Direct (754) 30-PIZZA";
  var NAV_H = 60; // px

  // --- Which page are we on? (filename, default index.html) ---
  var path = location.pathname.split("/").pop().toLowerCase();
  if (!path) path = "index.html";

  // --- Styles (self-contained so it works on every page regardless of its CSS) ---
  var css = [
    ":root{--sitenav-h:" + NAV_H + "px}",
    "body{padding-top:var(--sitenav-h)!important}",
    "html{scroll-padding-top:calc(var(--sitenav-h) + 12px)}",
    // keep index.html sticky side panels clear of the bar
    "@media(min-width:1140px){.side-panel{top:calc(var(--sitenav-h) + 18px)!important}}",

    ".sitenav{position:fixed;top:0;left:0;right:0;z-index:200;height:var(--sitenav-h);" +
      "display:flex;align-items:center;font-family:'Manrope',sans-serif;" +
      "background:rgba(255,244,227,.82);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);" +
      "border-bottom:1px solid rgba(193,121,19,.16);transition:background .25s,box-shadow .25s,border-color .25s}",
    ".sitenav.is-scrolled{background:rgba(255,244,227,.96);box-shadow:0 10px 30px -18px rgba(40,24,8,.5);border-bottom-color:rgba(193,121,19,.28)}",
    ".sitenav__inner{width:100%;max-width:1320px;margin:0 auto;padding:0 clamp(16px,4vw,28px);" +
      "display:flex;align-items:center;gap:18px}",

    ".sitenav__brand{display:inline-flex;align-items:center;text-decoration:none;flex:0 0 auto;margin-right:auto}",
    ".sitenav__wordmark{font-family:'Cinzel',serif;font-weight:700;font-size:clamp(15px,2.2vw,18px);" +
      "letter-spacing:.16em;color:#1E1E1E;line-height:1;white-space:nowrap}",
    ".sitenav__wordmark span{color:#C17913}",

    ".sitenav__links{display:flex;align-items:center;gap:clamp(14px,1.8vw,26px);list-style:none;margin:0;padding:0}",
    ".sitenav__link{font-family:'Cinzel',serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase;" +
      "font-weight:600;color:#5b4d3c;text-decoration:none;white-space:nowrap;position:relative;padding:6px 0;" +
      "transition:color .2s}",
    ".sitenav__link::after{content:'';position:absolute;left:0;right:0;bottom:0;height:1.5px;background:#C17913;" +
      "transform:scaleX(0);transform-origin:left center;transition:transform .25s}",
    ".sitenav__link:hover,.sitenav__link:focus-visible{color:#C17913;outline:none}",
    ".sitenav__link:hover::after,.sitenav__link:focus-visible::after{transform:scaleX(1)}",
    ".sitenav__link.is-active{color:#C17913}",
    ".sitenav__link.is-active::after{transform:scaleX(1);opacity:.55}",

    ".sitenav__cta{display:inline-flex;align-items:center;gap:8px;flex:0 0 auto;text-decoration:none;" +
      "font-family:'Cinzel',serif;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;" +
      "color:#fff;background:#C17913;padding:10px 18px;border-radius:24px;white-space:nowrap;" +
      "box-shadow:0 12px 26px -14px rgba(193,121,19,.8);transition:background .22s,transform .22s,gap .22s}",
    ".sitenav__cta:hover,.sitenav__cta:focus-visible{background:#A5650E;transform:translateY(-1px);gap:11px;outline:none}",
    ".sitenav__cta svg{width:13px;height:13px}",

    // hamburger (hidden on desktop)
    ".sitenav__toggle{display:none;flex:0 0 auto;width:42px;height:42px;border:1px solid rgba(193,121,19,.3);" +
      "border-radius:12px;background:transparent;cursor:pointer;align-items:center;justify-content:center;color:#C17913}",
    ".sitenav__toggle svg{width:22px;height:22px}",

    // mobile dropdown
    ".sitenav__panel{position:fixed;top:var(--sitenav-h);left:0;right:0;z-index:199;" +
      "background:rgba(255,244,227,.98);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);" +
      "border-bottom:1px solid rgba(193,121,19,.22);box-shadow:0 18px 40px -24px rgba(40,24,8,.5);" +
      "transform:translateY(-12px);opacity:0;visibility:hidden;transition:transform .26s,opacity .26s,visibility .26s}",
    ".sitenav__panel.is-open{transform:translateY(0);opacity:1;visibility:visible}",
    ".sitenav__panel ul{list-style:none;margin:0;padding:8px clamp(16px,5vw,28px) 18px;display:flex;flex-direction:column}",
    ".sitenav__panel a{display:block;padding:13px 4px;font-family:'Cinzel',serif;font-size:13px;letter-spacing:.12em;" +
      "text-transform:uppercase;font-weight:600;color:#5b4d3c;text-decoration:none;border-bottom:1px solid rgba(193,121,19,.12)}",
    ".sitenav__panel a:last-child{border-bottom:none}",
    ".sitenav__panel a.is-active{color:#C17913}",

    "@media(max-width:980px){.sitenav__links{display:none}.sitenav__toggle{display:inline-flex}}",
    "@media(max-width:520px){.sitenav__cta span{display:none}.sitenav__cta{padding:10px 12px}}",
    "@media(prefers-reduced-motion:reduce){.sitenav,.sitenav__link::after,.sitenav__panel,.sitenav__cta{transition:none}}"
  ].join("\n");

  var styleEl = document.createElement("style");
  styleEl.id = "sitenav-style";
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // --- Markup ---
  var phoneIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';

  var nav = document.createElement("header");
  nav.className = "sitenav";
  nav.innerHTML =
    '<div class="sitenav__inner">' +
      '<a class="sitenav__brand" href="index.html" aria-label="Puccettoni home">' +
        '<span class="sitenav__wordmark">PUCCET<span>T</span>ONI</span>' +
      "</a>" +
      '<nav class="sitenav__links" aria-label="Primary">' +
        LINKS.map(function (l) {
          var active = (l.href.toLowerCase() === path) ? " is-active" : "";
          var aria = active ? ' aria-current="page"' : "";
          return '<a class="sitenav__link' + active + '" href="' + l.href + '"' + aria + ">" + l.label + "</a>";
        }).join("") +
      "</nav>" +
      '<a class="sitenav__cta" href="' + PHONE_TEL + '" aria-label="' + PHONE_LABEL + '">' +
        phoneIcon + "<span>Order Direct</span>" +
      "</a>" +
      '<button class="sitenav__toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="sitenavPanel">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>' +
      "</button>" +
    "</div>";

  var panel = document.createElement("div");
  panel.className = "sitenav__panel";
  panel.id = "sitenavPanel";
  panel.innerHTML = "<ul>" + LINKS.map(function (l) {
    var active = (l.href.toLowerCase() === path) ? " is-active" : "";
    var aria = active ? ' aria-current="page"' : "";
    return '<li><a class="' + active.trim() + '" href="' + l.href + '"' + aria + ">" + l.label + "</a></li>";
  }).join("") + "</ul>";

  function mount() {
    document.body.insertBefore(panel, document.body.firstChild);
    document.body.insertBefore(nav, document.body.firstChild);

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
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
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

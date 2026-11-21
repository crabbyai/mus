/* ============================================================
   Pyramid and eye emblem, always beneath "Allah" and "la hawla wa la
   quwwata illa billah": the eye stands for Allah's knowledge (Al-Basir),
   Qur'an 40:19. A soft golden glow pulses once when a visitor takes an
   action or starts to leave, and a gentle shimmer passes now and then.
   Safety: no strobing (one slow pulse, never more than once every 3 s),
   low intensity, and fully off with prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SVG = '<svg viewBox="0 0 240 250" role="img" aria-label="Allah above a pyramid with an eye: Allah sees all">' +
    '<defs><linearGradient id="pyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3dc9f"/><stop offset=".6" stop-color="#c9a45c"/><stop offset="1" stop-color="#6b5426"/></linearGradient>' +
    '<radialGradient id="eyG"><stop offset="0" stop-color="#fff6d8"/><stop offset=".5" stop-color="#e8c87e" stop-opacity=".55"/><stop offset="1" stop-color="#e8c87e" stop-opacity="0"/></radialGradient></defs>' +
    '<text x="120" y="38" text-anchor="middle" font-family="Noto Naskh Arabic, serif" font-size="40" fill="#e8c87e">ٱللَّه</text>' +
    '<g class="eye-rays" stroke="#e8c87e" stroke-opacity=".35" stroke-width="1.2">' +
    [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(function (a) {
      var r = a * Math.PI / 180, x1 = 120 + Math.cos(r) * 46, y1 = 118 + Math.sin(r) * 46, x2 = 120 + Math.cos(r) * 70, y2 = 118 + Math.sin(r) * 70;
      return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>';
    }).join("") + "</g>" +
    '<polygon points="120,62 214,226 26,226" fill="none" stroke="url(#pyG)" stroke-width="3"/>' +
    '<g stroke="#c9a45c" stroke-opacity=".45" stroke-width="1"><line x1="62" y1="164" x2="178" y2="164"/><line x1="44" y1="195" x2="196" y2="195"/><line x1="88" y1="164" x2="80" y2="195"/><line x1="152" y1="164" x2="160" y2="195"/><line x1="120" y1="195" x2="120" y2="226"/><line x1="70" y1="195" x2="66" y2="226"/><line x1="170" y1="195" x2="174" y2="226"/></g>' +
    '<circle class="eye-glow" cx="120" cy="118" r="40" fill="url(#eyG)"/>' +
    '<path d="M88 118 Q120 92 152 118 Q120 144 88 118Z" fill="#0a0f1e" stroke="#e8c87e" stroke-width="2.4"/>' +
    '<circle cx="120" cy="118" r="10" fill="url(#pyG)"/><circle class="eye-pupil" cx="120" cy="118" r="4.2" fill="#0a0f1e"/>' +
    '<text x="120" y="246" text-anchor="middle" font-family="Noto Naskh Arabic, serif" font-size="15" fill="#e8c87e">لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّهِ</text></svg>';

  var css = document.createElement("style");
  css.textContent =
    ".eyemb{display:block;margin:0 auto;width:min(240px,62vw);filter:drop-shadow(0 0 18px rgba(232,200,126,.25));transition:filter .6s ease}" +
    ".eyemb .eye-glow{opacity:.55;transform-origin:120px 118px;transition:opacity .6s ease}" +
    ".eyemb.pulse{filter:drop-shadow(0 0 34px rgba(232,200,126,.65))}" +
    ".eyemb.pulse .eye-glow{opacity:1}" +
    ".eyemb .eye-pupil{transition:transform .5s ease}" +
    ".eyemb.shimmer .eye-rays{animation:raysIn 2.4s ease-in-out}" +
    "@keyframes raysIn{0%,100%{stroke-opacity:.35}50%{stroke-opacity:.8}}" +
    ".eyeglow-screen{position:fixed;inset:0;z-index:105;pointer-events:none;background:radial-gradient(circle at 50% 40%,rgba(232,200,126,.28),rgba(232,200,126,0) 60%);opacity:0;transition:opacity .5s ease}" +
    ".eyeglow-screen.on{opacity:1}" +
    ".eye-sec{margin-top:2.6rem;padding:1.8rem 1.3rem 1.4rem;border-radius:24px;text-align:center;border:1px solid #c9a45c;background:radial-gradient(circle at 50% 30%,rgba(232,200,126,.14),transparent 60%),linear-gradient(180deg,#0f1a36,#0a0f1e)}" +
    ".eye-sec h3{margin:1rem 0 .6rem}" +
    ".eye-mini{width:64px;display:inline-block;vertical-align:middle}" +
    "@media (prefers-reduced-motion: reduce){.eyemb,.eyemb *{transition:none!important;animation:none!important}}";
  document.head.appendChild(css);

  // Fill placeholders
  [].forEach.call(document.querySelectorAll("[data-eye]"), function (el) { el.innerHTML = SVG.replace('<svg ', '<svg class="eyemb' + (el.getAttribute("data-eye") === "mini" ? " eye-mini" : "") + '" '); });
  var screen = document.createElement("div"); screen.className = "eyeglow-screen"; screen.setAttribute("aria-hidden", "true"); document.body.appendChild(screen);
  if (reduce) return;

  var last = 0;
  function pulse(full) {
    var now = Date.now(); if (now - last < 3000) return; last = now;   // one slow pulse at most every 3 seconds
    var ems = document.querySelectorAll(".eyemb");
    [].forEach.call(ems, function (e) { e.classList.add("pulse"); });
    if (full) screen.classList.add("on");
    setTimeout(function () { [].forEach.call(ems, function (e) { e.classList.remove("pulse"); }); screen.classList.remove("on"); }, 1100);
  }
  window.coachEyePulse = pulse;
  // Actions: any call-to-action, offer, PayPal, WhatsApp or chat button
  document.addEventListener("click", function (e) {
    if (e.target.closest(".cta, .btn2, .wa-big, .js-know, .fab-wa, .chat__send, .js-want, .js-offer")) pulse(true);
  }, true);
  // Leaving: pointer exits through the top of the window
  document.addEventListener("mouseout", function (e) { if (!e.relatedTarget && e.clientY <= 0) pulse(true); });
  // The eye follows the pointer gently
  document.addEventListener("pointermove", function (e) {
    [].forEach.call(document.querySelectorAll(".eyemb .eye-pupil"), function (p) {
      var r = p.ownerSVGElement.getBoundingClientRect(); if (!r.width) return;
      var dx = (e.clientX - (r.left + r.width / 2)) / innerWidth, dy = (e.clientY - (r.top + r.height * .47)) / innerHeight;
      p.style.transform = "translate(" + (dx * 9).toFixed(1) + "px," + (dy * 6).toFixed(1) + "px)";
    });
  }, { passive: true });
  // An occasional gentle shimmer, every 25 to 45 seconds
  (function shimmer() {
    setTimeout(function () {
      [].forEach.call(document.querySelectorAll(".eyemb"), function (e) { e.classList.add("shimmer"); setTimeout(function () { e.classList.remove("shimmer"); }, 2500); });
      shimmer();
    }, 25000 + Math.random() * 20000);
  })();
})();

/* ============================================================
   Fading numbers: 13, 15, 34, 622, 1111, 2222, 88888888 drift softly
   in gold behind the page and fade in and out at random spots. Purely
   decorative (aria-hidden, no pointer events, behind all content), and
   still for visitors who prefer reduced motion.
   ============================================================ */
(function () {
  "use strict";
  var NUMS = ["13", "15", "34", "622", "1111", "2222", "88888888"];
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var css = document.createElement("style");
  css.textContent =
    ".numfx{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}" +
    ".numfx span{position:absolute;font-family:'Playfair Display',Georgia,serif;font-weight:500;white-space:nowrap;letter-spacing:.06em;" +
    "background:linear-gradient(135deg,#f3dc9f,#c9a45c 60%,#8a6a2e);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:0;" +
    "will-change:opacity,transform;animation:numfade var(--d,12s) ease-in-out forwards}" +
    "@keyframes numfade{0%{opacity:0;transform:translateY(12px) scale(.96)}35%,65%{opacity:var(--o,.12)}100%{opacity:0;transform:translateY(-16px) scale(1.02)}}" +
    ".numfx.still span{animation:none;opacity:var(--o,.08)}";
  document.head.appendChild(css);
  var layer = document.createElement("div");
  layer.className = "numfx" + (reduce ? " still" : ""); layer.setAttribute("aria-hidden", "true");
  document.body.insertBefore(layer, document.body.firstChild);

  var small = innerWidth < 700, COUNT = small ? 8 : 14;
  function place(el) {
    var n = NUMS[Math.floor(Math.random() * NUMS.length)], big = Math.random() < .25;
    var size = n.length > 6 ? (small ? 1.1 : 1.6) : (big ? (small ? 3.2 : 5.2) : (small ? 1.6 : 2.4));
    el.textContent = n;
    el.style.fontSize = (size * (0.8 + Math.random() * 0.5)).toFixed(2) + "rem";
    el.style.left = (Math.random() * 88).toFixed(1) + "vw";
    el.style.top = (6 + Math.random() * 86).toFixed(1) + "vh";
    el.style.setProperty("--o", (big ? 0.12 : 0.2 + Math.random() * 0.08).toFixed(2));
    el.style.setProperty("--d", (9 + Math.random() * 9).toFixed(1) + "s");
    if (Math.random() < .3) el.style.transform = "rotate(" + (Math.random() * 16 - 8).toFixed(1) + "deg)";
  }
  for (var i = 0; i < COUNT; i++) {
    (function (k) {
      var el = document.createElement("span"); layer.appendChild(el); place(el);
      if (reduce) return;
      el.style.animationDelay = (k * 1.3).toFixed(1) + "s";
      el.addEventListener("animationend", function () {          // fade out, move somewhere new, fade in again
        el.style.animation = "none"; void el.offsetWidth; place(el); el.style.animationDelay = (Math.random() * 3).toFixed(1) + "s"; el.style.animation = "";
      });
    })(i);
  }
})();

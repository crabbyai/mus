/* ============================================================
   SOCIAL PROOF — quiet activity toasts, capped at 3 per session.
   Click-through goes to the free valuation; dismiss sticks for
   the whole session. Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  if (sessionStorage.getItem("spDismissed")) return;
  var shown = +(sessionStorage.getItem("spCount") || 0);
  if (shown >= 3) return;

  var MESSAGES = [
    { ico: "🏠", txt: "An overseas buyer in <strong>Dubai</strong> requested the Buyer's Checklist" },
    { ico: "📈", txt: "A seller in <strong>DHA Phase 2</strong> booked a free valuation" },
    { ico: "🔑", txt: "A family in <strong>Bahria Town</strong> scheduled a private consultation" },
    { ico: "🌍", txt: "A client in <strong>London</strong> asked for a live video tour" },
    { ico: "📊", txt: "A buyer in <strong>Lahore</strong> is comparing payment plans with the EMI calculator" },
    { ico: "🏠", txt: "An investor in <strong>Jeddah</strong> asked about rental yields in B-17" }
  ];
  // rotate the starting point per session so repeat visits vary
  var offset = Math.floor(Math.random() * MESSAGES.length);

  var el = document.createElement("aside");
  el.className = "sp-toast";
  el.setAttribute("role", "status");
  document.body.appendChild(el);

  var hideTimer = null;

  function show(i) {
    var m = MESSAGES[(offset + i) % MESSAGES.length];
    el.innerHTML =
      '<span class="sp-toast__ico">' + m.ico + "</span>" +
      '<span class="sp-toast__txt">' + m.txt + '<em>Want the same? Free valuation →</em></span>' +
      '<button class="sp-toast__x" aria-label="Dismiss">✕</button>';
    el.querySelector(".sp-toast__x").addEventListener("click", function (e) {
      e.stopPropagation();
      sessionStorage.setItem("spDismissed", "1");
      hide();
    });
    el.addEventListener("click", go);
    el.classList.add("is-on");
    hideTimer = setTimeout(hide, 8000);
  }
  function hide() {
    clearTimeout(hideTimer);
    el.classList.remove("is-on");
  }
  function go() {
    hide();
    var t = document.getElementById("valuation");
    if (t) t.scrollIntoView({ behavior: "smooth" });
  }

  function schedule(i, delay) {
    if (shown >= 3) return;
    setTimeout(function () {
      if (sessionStorage.getItem("spDismissed")) return;
      show(i);
      shown++;
      sessionStorage.setItem("spCount", String(shown));
      schedule(i + 1, 55000);
    }, delay);
  }
  schedule(0, 22000);
})();

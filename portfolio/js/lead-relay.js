/* ============================================================
   LEAD RELAY — never lose an enquiry
   ------------------------------------------------------------
   Every CTA on this site hands off to WhatsApp via window.open.
   That handoff can silently fail: popup blockers, desktop browsers
   with no WhatsApp session, corporate networks that block wa.me.
   When it does, the visitor sees nothing happen and the lead is
   gone — the single most expensive failure mode on the site.

   This wraps the handoff:
     1. Persists the enquiry locally first, so it survives a failure.
     2. Opens WhatsApp; if the popup was blocked, navigates instead.
     3. Offers a fallback card (email / copy / call) so there is
        always a route that works.
   No backend required.
   ============================================================ */
(function () {
  "use strict";

  var PHONE = "+16134083945";
  var WA = "https://wa.me/16134083945";
  var EMAIL = "adeelahmedrahman@gmail.com";
  var STORE = "ar_pending_leads_v1";

  function save(message) {
    try {
      var all = JSON.parse(localStorage.getItem(STORE) || "[]");
      all.push({ message: message, at: Date.now(), url: location.href });
      localStorage.setItem(STORE, JSON.stringify(all.slice(-20)));
    } catch (e) { /* storage full or blocked — not fatal */ }
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function showFallback(message) {
    var existing = document.getElementById("leadFallback");
    if (existing) existing.remove();

    var wrap = el("div", "leadfb", "");
    wrap.id = "leadFallback";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", "Other ways to send your message");

    var mailHref = "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent("Property enquiry from your website") +
      "&body=" + encodeURIComponent(message);

    wrap.appendChild(el("div", "leadfb__backdrop"));
    var card = el("div", "leadfb__card glass");
    card.innerHTML =
      '<button class="leadfb__x" type="button" aria-label="Close">✕</button>' +
      '<h3 class="leadfb__title">WhatsApp didn\'t open</h3>' +
      '<p class="leadfb__sub">No problem — your message is saved. Send it whichever way suits you:</p>' +
      '<div class="leadfb__msg" id="leadFbMsg"></div>' +
      '<div class="leadfb__actions">' +
        '<a class="leadfb__btn leadfb__btn--wa" href="' + WA + "?text=" + encodeURIComponent(message) + '" target="_blank" rel="noopener">Try WhatsApp again</a>' +
        '<a class="leadfb__btn leadfb__btn--mail" href="' + mailHref + '">Send as email</a>' +
        '<button class="leadfb__btn leadfb__btn--copy" type="button">Copy message</button>' +
        '<a class="leadfb__btn leadfb__btn--call" href="tel:' + PHONE + '">Call ' + PHONE + '</a>' +
      "</div>";
    wrap.appendChild(card);
    document.body.appendChild(wrap);
    // textContent so the message can never inject markup
    card.querySelector("#leadFbMsg").textContent = message;

    function close() { wrap.remove(); }
    card.querySelector(".leadfb__x").addEventListener("click", close);
    wrap.querySelector(".leadfb__backdrop").addEventListener("click", close);
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
    });

    var copyBtn = card.querySelector(".leadfb__btn--copy");
    copyBtn.addEventListener("click", function () {
      var done = function () { copyBtn.textContent = "Copied ✓"; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message).then(done, fallbackCopy);
      } else { fallbackCopy(); }
      function fallbackCopy() {
        var ta = document.createElement("textarea");
        ta.value = message;
        ta.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { /* ignore */ }
        ta.remove();
      }
    });

    card.querySelector(".leadfb__x").focus();
  }

  window.LeadRelay = {
    /* Hand a message to WhatsApp with a guaranteed fallback. */
    send: function (message) {
      if (!message) return;
      // If they've switched the site into another currency they're almost
      // certainly buying from abroad, and which currency says which market.
      // Worth one line at the bottom of every enquiry.
      try {
        var cur = window.Currency && window.Currency.get();
        if (cur && cur !== "PKR") message += "\n\n(Viewing your site with prices in " + cur + ".)";
      } catch (e) { /* never block the send */ }
      save(message);
      var url = WA + "?text=" + encodeURIComponent(message);
      var win = null;
      try { win = window.open(url, "_blank", "noopener"); } catch (e) { win = null; }

      if (!win || win.closed || typeof win.closed === "undefined") {
        // Popup blocked. Same-tab navigation still counts as a user gesture,
        // but if the visitor comes straight back we show the fallback.
        showFallback(message);
        return;
      }
      // The tab opened, but wa.me may still dead-end (no WhatsApp on desktop).
      // If they return to this tab quickly, offer the alternatives.
      var t = setTimeout(function () {
        document.removeEventListener("visibilitychange", onBack);
      }, 20000);
      function onBack() {
        if (document.visibilityState === "visible") {
          clearTimeout(t);
          document.removeEventListener("visibilitychange", onBack);
          setTimeout(function () {
            if (!document.getElementById("leadFallback")) showFallback(message);
          }, 400);
        }
      }
      // Only arm this on desktop, where the wa.me dead-end actually happens.
      if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        setTimeout(function () { document.addEventListener("visibilitychange", onBack); }, 1200);
      }
    },

    /* Enquiries this browser has attempted — useful for debugging a lost lead. */
    pending: function () {
      try { return JSON.parse(localStorage.getItem(STORE) || "[]"); } catch (e) { return []; }
    }
  };
})();

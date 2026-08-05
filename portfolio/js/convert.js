/* ============================================================
   CONVERSION LAYER
   ------------------------------------------------------------
   Two jobs, both about making it easy — and honest — to reach out.

   1. LIVE PRESENCE. The hero used to claim "Online now" around the
      clock, including at 4am Islamabad time. Overseas buyers are the
      ones most likely to be reading then, and a promise that isn't
      true is worse than no promise. This works out the real time in
      Pakistan and says what will actually happen.

   2. CONTEXTUAL CALL TO ACTION. The page is long, and the right ask
      changes as you move down it — someone reading the finance
      calculator wants a different conversation from someone looking
      at sold homes. A small rail tracks the section in view and
      offers the next step that fits it.

   Vanilla, no dependencies, self-contained.
   ============================================================ */
(function () {
  "use strict";

  var WA = "16134083945";

  /* ============================================================
     1 · LIVE PRESENCE (Pakistan Standard Time, UTC+5, no DST)
     ============================================================ */
  function pktNow() {
    var now = new Date();
    // Build PKT from UTC directly — never trust the visitor's clock offset.
    return new Date(now.getTime() + (now.getTimezoneOffset() + 300) * 60000);
  }

  function presence() {
    var t = pktNow();
    var h = t.getHours(), m = t.getMinutes();
    var clock = ((h % 12) || 12) + ":" + (m < 10 ? "0" : "") + m + (h < 12 ? "am" : "pm");

    if (h >= 9 && h < 23) {
      return { state: "on", label: "Online now", detail: "WhatsApp replies usually within minutes" };
    }
    if (h >= 7 && h < 9) {
      return { state: "soon", label: "Just starting the day", detail: "I'll reply within the hour" };
    }
    return {
      state: "off",
      label: "It's " + clock + " in Islamabad",
      detail: "message me anyway and you'll have a reply by morning"
    };
  }

  function paintPresence() {
    var p = presence();
    var nodes = document.querySelectorAll("[data-presence]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      el.setAttribute("data-state", p.state);
      var dot = el.querySelector("[data-presence-dot]");
      var txt = el.querySelector("[data-presence-text]");
      if (dot) dot.setAttribute("data-state", p.state);
      if (txt) {
        txt.innerHTML = "<strong>" + p.label + "</strong>" +
          (el.hasAttribute("data-presence-short") ? "" : " — " + p.detail);
      }
    }
  }

  paintPresence();
  setInterval(paintPresence, 60000);

  /* ============================================================
     2 · CONTEXTUAL CTA RAIL
     ============================================================ */

  // What to offer while each part of the page is on screen. Sections that
  // already ARE the ask (booking, contact) deliberately have no entry — the
  // rail steps aside rather than competing with the form in front of you.
  var ASKS = {
    marketwatch: { t: "See a listing you like?", c: "Ask me about it",
                   m: "Hello Adeel — I've been looking at the live listings on your site. Can you tell me more?" },
    about:       { t: "Want my read on your situation?", c: "Ask me anything",
                   m: "Hello Adeel — I have a question about buying/selling in Islamabad or Lahore." },
    credentials: { t: "Put the credentials to work", c: "Get my free valuation", go: "#valuation" },
    tools:       { t: "Numbers not adding up?", c: "Ask me about financing",
                   m: "Hello Adeel — I've been using your finance calculator and I'd like help understanding my options." },
    valuation:   { t: "Want the exact figure?", c: "Get a proper valuation",
                   m: "Hello Adeel — I'd like a proper valuation of my property. Here are the details:" },
    services:    { t: "Not sure which you need?", c: "Talk it through",
                   m: "Hello Adeel — I'm not sure which service fits me. Can we talk it through?" },
    compare:     { t: "Still deciding between areas?", c: "Get my shortlist", go: "#finder" },
    finder:      { t: "Want this done properly?", c: "Send me your brief",
                   m: "Hello Adeel — I used your home finder and I'd like your recommendation." },
    featured:    { t: "Interested in this one?", c: "Ask about this listing",
                   m: "Hello Adeel — I'm interested in the featured listing on your site." },
    portfolio:   { t: "Want one like these?", c: "Build me one like this", go: "#likethis" },
    likethis:    { t: "Happy with your design?", c: "Send it to my builders", go: "#likethis" },
    areas:       { t: "Which area actually suits you?", c: "Find out in 60 seconds", go: "#finder" },
    map:         { t: "Know where you want to be?", c: "Ask what's available there",
                   m: "Hello Adeel — I'm looking in a specific area. What do you have available?" },
    insights:    { t: "Want this month's real numbers?", c: "Get the market brief",
                   m: "Hello Adeel — please send me your latest market brief for Islamabad / Lahore." },
    portals:     { t: "Seen something elsewhere?", c: "Have me check it",
                   m: "Hello Adeel — I found a listing on another portal. Could you check whether it's genuine?" },
    testimonials:{ t: "Want the same experience?", c: "Start a conversation",
                   m: "Hello Adeel — I'd like to work with you on a property in Pakistan." },
    guides:      { t: "Question the guide didn't answer?", c: "Ask me directly",
                   m: "Hello Adeel — I read your guides and still have a question:" },
    faq:         { t: "Still have a question?", c: "Ask me directly",
                   m: "Hello Adeel — I have a question that wasn't in your FAQ:" },
    forum:       { t: "Prefer to ask privately?", c: "Message me instead",
                   m: "Hello Adeel — I'd rather ask this privately:" }
  };

  var rail = null, railTitle, railBtn, current = null;

  function buildRail() {
    rail = document.createElement("aside");
    rail.className = "cta-rail";
    rail.setAttribute("aria-label", "Quick contact");
    rail.innerHTML =
      '<button class="cta-rail__x" type="button" aria-label="Hide quick contact">✕</button>' +
      '<p class="cta-rail__title"></p>' +
      '<button class="cta-rail__btn btn btn--wa" type="button">Message me on WhatsApp</button>' +
      '<p class="cta-rail__presence" data-presence data-presence-short>' +
        '<span class="online-dot" data-presence-dot></span>' +
        '<span data-presence-text></span>' +
      '</p>';
    document.body.appendChild(rail);

    railTitle = rail.querySelector(".cta-rail__title");
    railBtn = rail.querySelector(".cta-rail__btn");
    // Starts hidden, so keep it out of the accessibility tree until it has an
    // ask — otherwise a screen reader meets an offscreen button with no
    // context, and axe rightly calls the empty one a nameless control.
    setA11y(false);

    rail.querySelector(".cta-rail__x").addEventListener("click", function () {
      showRail(false);
      try { sessionStorage.setItem("ctaRailOff", "1"); } catch (e) { /* ignore */ }
    });

    railBtn.addEventListener("click", function () {
      var ask = ASKS[current];
      if (!ask) return;
      if (ask.go) {
        var target = document.querySelector(ask.go);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (window.LeadRelay) window.LeadRelay.send(ask.m);
      else window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(ask.m), "_blank", "noopener");
    });

    paintPresence();
  }

  function setAsk(id) {
    if (id === current) return;
    current = id;
    var ask = ASKS[id];
    if (!ask) { showRail(false); return; }
    // Re-trigger the swap animation without rebuilding the node.
    rail.classList.remove("is-swapping");
    void rail.offsetWidth;
    rail.classList.add("is-swapping");
    railTitle.textContent = ask.t;
    railBtn.textContent = ask.c;
    showRail(true);
  }

  /* The WhatsApp bubble shares this corner. The rail is appended last, so it
     can't reach the bubble with a sibling selector — flag it on <body>. */
  function showRail(on) {
    rail.classList.toggle("is-on", on);
    document.body.classList.toggle("has-cta-rail", on);
    setA11y(on);
  }

  function setA11y(on) {
    if (on) { rail.removeAttribute("aria-hidden"); rail.inert = false; }
    else { rail.setAttribute("aria-hidden", "true"); rail.inert = true; }
  }

  function startRail() {
    try { if (sessionStorage.getItem("ctaRailOff")) return; } catch (e) { /* ignore */ }
    // Desktop only: phones already carry the fixed call/WhatsApp/book bar.
    if (!window.matchMedia || !window.matchMedia("(min-width: 1100px)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    buildRail();

    var ids = Object.keys(ASKS);
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      // Whichever tracked section owns the most of the viewport wins.
      var best = null, bestR = 0;
      for (var k in visible) if (visible[k] > bestR) { bestR = visible[k]; best = k; }
      setAsk(bestR > 0.12 ? best : null);
    }, { threshold: [0, 0.12, 0.3, 0.6, 0.9] });

    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });

    // Never float over the footer CTAs — they're the stronger ask down there.
    var tail = document.getElementById("book");
    if (tail) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          rail.classList.toggle("is-parked", e.isIntersecting);
          var live = !e.isIntersecting && rail.classList.contains("is-on");
          document.body.classList.toggle("has-cta-rail", live);
          setA11y(live);
        });
      }, { rootMargin: "0px 0px -40% 0px" }).observe(tail);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startRail);
  } else {
    startRail();
  }
})();

/* ============================================================
   BUDGET MATCHER — "so what does my money actually buy?"
   ------------------------------------------------------------
   The valuation widget answers "what is my house worth". The
   calculator answers "what are the instalments". Neither answers
   the question people arrive with, which is the other way round:
   I have this much — where can I live, and how big?

   Drag a number and every area/plot combination the site tracks
   sorts itself into what's comfortably in reach, what's a stretch
   at the top of the range, and what isn't happening. It reads the
   same dataset as the market dashboard (window.MarketData), so
   the two can never quote different prices.

   The whole thing is a lead magnet with the answer given away
   first: by the time the CTA appears, the visitor has a shortlist
   and a reason to send it.
   ============================================================ */
(function () {
  "use strict";

  var BANDS = ["5m", "10m", "1k"];
  var els = {};
  var budget = 8;          // crore
  var city = "all";

  function $(id) { return document.getElementById(id); }

  /* "12–18" → { lo: 12, hi: 18 } in crore */
  function range(text) {
    if (!text) return null;
    var p = String(text).split(/[–-]/);
    var lo = parseFloat(p[0]), hi = parseFloat(p[1] || p[0]);
    if (!isFinite(lo) || !isFinite(hi)) return null;
    return { lo: lo, hi: hi };
  }

  function fmtCr(v) {
    if (v >= 100) return (v / 100).toFixed(2).replace(/\.?0+$/, "") + " Arab";
    return (v % 1 === 0 ? v : v.toFixed(1)) + " Crore";
  }

  /* Every area × plot-size combination the dataset knows about, scored
     against the budget. Three verdicts rather than a yes/no, because the
     honest answer for most people sits in the middle. */
  function matches() {
    var md = window.MarketData;
    if (!md) return [];
    var out = [];
    md.areas.forEach(function (a) {
      if (city !== "all" && a.city.toLowerCase().indexOf(city) < 0) return;
      BANDS.forEach(function (b) {
        var r = range(a.bands[b]);
        if (!r) return;
        var verdict;
        if (budget >= r.hi) verdict = "comfort";        // the whole range is open
        else if (budget >= r.lo) verdict = "stretch";   // in at the lower end
        else return;                                    // not this one
        out.push({
          area: a, band: b, lo: r.lo, hi: r.hi, verdict: verdict,
          yield: a.yield, days: a.days,
          headroom: budget - r.lo
        });
      });
    });
    // Biggest plot first, not safest first. Sorting every comfortable option
    // ahead of every stretch buried the interesting answer: at 8 Crore the
    // 1 Kanal you could just about reach is the thing worth knowing about,
    // and it was landing below a dozen 10 Marlas you could easily afford.
    var rank = { "1k": 3, "10m": 2, "5m": 1 };
    out.sort(function (x, y) {
      if (rank[x.band] !== rank[y.band]) return rank[y.band] - rank[x.band];
      if (x.verdict !== y.verdict) return x.verdict === "comfort" ? -1 : 1;
      return y.hi - x.hi;
    });
    return out;
  }

  function render() {
    var list = matches();
    var md = window.MarketData;
    var label = md ? md.bandLabel : { "5m": "5 Marla", "10m": "10 Marla", "1k": "1 Kanal" };

    els.value.textContent = "PKR " + fmtCr(budget);

    if (!list.length) {
      els.results.innerHTML =
        '<p class="bud-empty">Nothing in the areas I cover comes in under this yet — the entry point is ' +
        'around PKR 1.4 Crore for a 5 Marla in B-17. Tell me your timeline and I\'ll tell you what it ' +
        'takes to get there.</p>';
      els.count.textContent = "0 options";
      return;
    }

    var comfort = list.filter(function (m) { return m.verdict === "comfort"; }).length;
    els.count.textContent = list.length + (list.length === 1 ? " option" : " options") +
      (comfort ? " · " + comfort + " comfortably in reach" : "");

    els.results.innerHTML = list.slice(0, 12).map(function (m) {
      return '<button class="bud-card' + (m.verdict === "stretch" ? " is-stretch" : "") +
        '" type="button" data-area="' + m.area.id + '">' +
        '<span class="bud-card__tag">' + (m.verdict === "comfort" ? "In reach" : "Top of your range") + "</span>" +
        '<span class="bud-card__band">' + label[m.band] + "</span>" +
        '<span class="bud-card__area">' + m.area.name + ' <em>' + m.area.city + "</em></span>" +
        '<span class="bud-card__price">PKR ' + m.lo + "–" + m.hi + " Cr</span>" +
        '<span class="bud-card__meta">' + m.yield.toFixed(1) + "% yield · sells in ~" + m.days + " days</span>" +
        "</button>";
    }).join("");

    els.results.querySelectorAll("[data-area]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (window.MarketData) window.MarketData.focus(b.getAttribute("data-area"));
      });
    });

    els.more.hidden = list.length <= 12;
    els.more.textContent = "+ " + (list.length - 12) + " more once we talk";
  }

  function send() {
    var list = matches();
    var label = (window.MarketData || {}).bandLabel || {};
    // Say which of these are a stretch. Listing a 8–14 Cr range as "in reach"
    // on an 8 Crore budget would be the site overselling on Adeel's behalf.
    var top = list.slice(0, 5).map(function (m) {
      return "• " + (label[m.band] || m.band) + " in " + m.area.name + ", " + m.area.city +
        " (PKR " + m.lo + "–" + m.hi + " Cr)" + (m.verdict === "stretch" ? " — top of my range" : "");
    }).join("\n");
    var msg = "Hello Adeel — my budget is around PKR " + fmtCr(budget) + ".\n\n" +
      (city === "all" ? "Open to both cities.\n\n" : "Looking in " + (city === "islamabad" ? "Islamabad" : "Lahore") + ".\n\n") +
      (top ? "Your site suggested these:\n" + top + "\n\n" : "") +
      "What's actually available right now, and what would you recommend?";
    if (window.LeadRelay) window.LeadRelay.send(msg);
    else window.open("https://wa.me/16134083945?text=" + encodeURIComponent(msg), "_blank", "noopener");
  }

  function init() {
    els.slider = $("budSlider");
    if (!els.slider) return;
    els.value = $("budValue");
    els.count = $("budCount");
    els.results = $("budResults");
    els.more = $("budMore");

    els.slider.addEventListener("input", function () {
      budget = +els.slider.value;
      render();
    });

    $("budCity").querySelectorAll("[data-city]").forEach(function (b) {
      b.addEventListener("click", function () {
        city = b.getAttribute("data-city");
        $("budCity").querySelectorAll("[data-city]").forEach(function (o) {
          var on = o === b;
          o.classList.toggle("is-active", on);
          o.setAttribute("aria-pressed", String(on));
        });
        render();
      });
    });

    $("budCta").addEventListener("click", send);

    // MarketData is published by js/market.js, which is a sibling deferred
    // script — wait for it rather than assuming an order.
    (function wait() {
      if (!window.MarketData) { setTimeout(wait, 60); return; }
      render();
    })();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

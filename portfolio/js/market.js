/* ============================================================
   MARKET INTELLIGENCE
   ------------------------------------------------------------
   The site could tell you what Adeel has sold and what a house
   costs to build, but nothing about what the market itself is
   doing — which is the first question every serious buyer and
   every seller actually has.

   Per-marla history, the twelve-month and five-year move, gross
   yield, how long stock is taking to shift, and where each area
   sits against the others. Drawn as SVG rather than pulled from a
   chart library: it's a line, an area fill and a row of bars, and
   this way there's no third-party payload on the page.

   Figures are indicative — compiled from Adeel's own closings and
   area comparables, not a live index — and the section says so.
   Per-marla values are derived from the same 1 Kanal ranges the
   valuation widget quotes, so the two can never contradict.
   ============================================================ */
(function () {
  "use strict";

  var YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

  /* series: PKR millions per marla, 2021 → 2026
     bands:  total price in crore, matching js/main.js VALDATA
     yield:  indicative gross rental yield, %
     days:   median days from listing to agreed sale */
  var AREAS = [
    { id: "f7f8_isb", name: "F-7 / F-8", city: "Islamabad",
      series: [12.4, 14.8, 14.1, 15.6, 17.2, 18.25],
      bands: { "10m": "14–20", "1k": "28–45" }, yield: 2.6, days: 46,
      note: "The tightest supply in the country. Almost nothing new is built here, so price is set by how rarely a good plot changes hands rather than by demand alone." },
    { id: "gulberg3_lhr", name: "Gulberg III", city: "Lahore",
      series: [12.1, 14.6, 13.9, 15.4, 17.1, 18.25],
      bands: { "1k": "28–45" }, yield: 3.1, days: 52,
      note: "Lahore's prestige address, and increasingly a commercial one — a slice of the demand here is offices and clinics, not families, which props up the floor." },
    { id: "dha5_lhr", name: "DHA Phase 5", city: "Lahore",
      series: [8.9, 11.2, 10.6, 11.9, 13.2, 14.25],
      bands: { "5m": "3.5–5", "10m": "8–14", "1k": "22–35" }, yield: 3.4, days: 34,
      note: "The most liquid luxury market in Lahore. Well-priced stock moves in weeks here, which makes it the safest place to be a seller." },
    { id: "modeltown_lhr", name: "Model Town", city: "Lahore",
      series: [9.4, 11.0, 10.4, 11.4, 12.5, 13.25],
      bands: { "1k": "18–35" }, yield: 3.0, days: 61,
      note: "Old money and enormous plots. Sales are slower because buyers are few and specific, but the ones who want Model Town will not accept a substitute." },
    { id: "e11_isb", name: "E-11", city: "Islamabad",
      series: [6.9, 8.4, 8.1, 9.1, 10.1, 10.75],
      bands: { "5m": "3.5–5", "10m": "8–12", "1k": "18–25" }, yield: 3.8, days: 38,
      note: "The best-connected sector in Islamabad for the money, and the strongest rental demand on this list — which is why investors keep coming back to it." },
    { id: "dha6_lhr", name: "DHA Phase 6", city: "Lahore",
      series: [5.2, 6.6, 6.3, 7.1, 7.8, 8.25],
      bands: { "5m": "2.5–4", "10m": "5.5–9", "1k": "13–20" }, yield: 3.6, days: 37,
      note: "Where most of Lahore's new designer builds are going up. Buy the elevation you actually want here rather than paying to renovate somebody else's taste." },
    { id: "dha2_isb", name: "DHA Phase 2", city: "Islamabad",
      series: [4.6, 5.8, 5.5, 6.2, 6.9, 7.25],
      bands: { "5m": "2.4–3.2", "10m": "4.5–6", "1k": "13–16" }, yield: 3.5, days: 33,
      note: "The steadiest performer I track. No spectacular years, no bad ones — the sort of curve that suits a family buying to live rather than to trade." },
    { id: "bahria_lhr", name: "Bahria Town", city: "Lahore",
      series: [3.6, 4.7, 4.4, 5.1, 5.7, 6.0],
      bands: { "5m": "2–3.5", "10m": "4–7", "1k": "9–15" }, yield: 4.1, days: 41,
      note: "Ready utilities and real security from day one, which is why it rents so well. Blocks matter enormously here — two streets apart can be a 20% difference." },
    { id: "lakecity_lhr", name: "Lake City", city: "Lahore",
      series: [3.3, 4.3, 4.1, 4.8, 5.4, 5.75],
      bands: { "5m": "2.5–3.5", "10m": "4–6", "1k": "9–14" }, yield: 4.3, days: 44,
      note: "The strongest yield on this list. Younger buyers and a genuine rental pool, so it behaves more like an income asset than a trophy one." },
    { id: "bahria_enc_isb", name: "Bahria Enclave", city: "Islamabad",
      series: [2.5, 3.3, 3.1, 3.6, 4.0, 4.25],
      bands: { "5m": "1.8–2.5", "10m": "3.5–5.5", "1k": "7–10" }, yield: 4.0, days: 39,
      note: "Margalla views at a fraction of sector prices. The catch is that some zones are still filling in — I'd only buy where the neighbours have already moved in." },
    { id: "b17_isb", name: "B-17", city: "Islamabad",
      series: [2.0, 2.8, 2.6, 3.1, 3.5, 3.75],
      bands: { "5m": "1.4–2", "10m": "2.8–4", "1k": "6–9" }, yield: 4.4, days: 47,
      note: "The strongest five-year growth I track, from the lowest base. Entry-level money, motorway access, and the most upside left — with the most patience required." }
  ];

  var BAND_LABEL = { "5m": "5 Marla", "10m": "10 Marla", "1k": "1 Kanal" };

  var current = AREAS[0];
  var drawn = false;

  var $ = function (id) { return document.getElementById(id); };
  function reduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------- numbers ---------- */
  /* Crore is how prices are actually spoken here, so it leads; under a crore
     reads better in lac than as a fraction of one. Input is PKR millions. */
  function pkrM(v) {
    var cr = v / 10;
    if (cr >= 1) return "PKR " + (cr >= 10 ? cr.toFixed(1) : cr.toFixed(2)).replace(/\.?0+$/, "") + " Crore";
    return "PKR " + (v * 10).toFixed(v * 10 < 10 ? 1 : 0) + " Lac";
  }
  function pct(a, b) {
    var d = ((b - a) / a) * 100;
    return (d >= 0 ? "+" : "") + d.toFixed(d >= 10 || d <= -10 ? 0 : 1) + "%";
  }

  /* ---------- the trend chart ----------
     Hand-built SVG. A catmull-ish smoothing would look prettier but would
     imply intra-year data we don't have, so the line stays straight between
     the points it actually knows. */
  var W = 640, H = 260, PAD_L = 62, PAD_R = 18, PAD_T = 22, PAD_B = 34;

  function scale(series) {
    var lo = Math.min.apply(null, series), hi = Math.max.apply(null, series);
    var span = hi - lo || 1;
    lo -= span * 0.35; hi += span * 0.22;
    return {
      x: function (i) { return PAD_L + (i / (series.length - 1)) * (W - PAD_L - PAD_R); },
      y: function (v) { return PAD_T + (1 - (v - lo) / (hi - lo)) * (H - PAD_T - PAD_B); },
      lo: lo, hi: hi
    };
  }

  function chart(a) {
    var s = a.series, sc = scale(s), i;
    var pts = s.map(function (v, k) { return [sc.x(k), sc.y(v)] });
    var line = pts.map(function (p, k) { return (k ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
    var area = line + " L" + pts[pts.length - 1][0].toFixed(1) + " " + (H - PAD_B) +
               " L" + pts[0][0].toFixed(1) + " " + (H - PAD_B) + " Z";

    // four gridlines with real values on them
    var grid = "";
    for (i = 0; i <= 3; i++) {
      var v = sc.lo + ((sc.hi - sc.lo) * i) / 3;
      var y = sc.y(v);
      grid += '<line x1="' + PAD_L + '" y1="' + y.toFixed(1) + '" x2="' + (W - PAD_R) +
              '" y2="' + y.toFixed(1) + '" class="mkt-grid"/>' +
              '<text x="' + (PAD_L - 10) + '" y="' + (y + 5).toFixed(1) +
              '" class="mkt-axis" text-anchor="end">' + (v / 10).toFixed(2) + ' Cr</text>';
    }

    var xlab = YEARS.map(function (y, k) {
      return '<text x="' + sc.x(k).toFixed(1) + '" y="' + (H - 10) +
             '" class="mkt-axis" text-anchor="middle">' + y + "</text>";
    }).join("");

    var dots = pts.map(function (p, k) {
      return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) +
             '" r="4.5" class="mkt-dot" data-i="' + k + '"/>';
    }).join("");

    return '<svg viewBox="0 0 ' + W + " " + H + '" class="mkt-svg" role="img" ' +
      'aria-label="Price per marla in ' + a.name + ' from 2021 to 2026, ' +
      pkrM(s[0]) + ' rising to ' + pkrM(s[s.length - 1]) + '">' +
      '<defs><linearGradient id="mktFill" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#c9a45c" stop-opacity="0.42"/>' +
      '<stop offset="100%" stop-color="#c9a45c" stop-opacity="0"/></linearGradient></defs>' +
      grid +
      '<path d="' + area + '" class="mkt-area"/>' +
      '<path d="' + line + '" class="mkt-line"/>' +
      dots + xlab +
      '<line class="mkt-cross" x1="0" y1="' + PAD_T + '" x2="0" y2="' + (H - PAD_B) + '" opacity="0"/>' +
      "</svg>";
  }

  /* Animate the stroke in, then let the fill follow it. */
  function animateChart(wrap) {
    if (reduced()) return;
    var path = wrap.querySelector(".mkt-line");
    var fill = wrap.querySelector(".mkt-area");
    var dots = wrap.querySelectorAll(".mkt-dot");
    if (!path) return;
    var len = path.getTotalLength();
    path.style.transition = "none";
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    fill.style.opacity = "0";
    for (var i = 0; i < dots.length; i++) { dots[i].style.opacity = "0"; }
    // next frame, so the reset above is committed before the transition
    requestAnimationFrame(function () {
      path.style.transition = "stroke-dashoffset 1.15s cubic-bezier(0.65,0,0.35,1)";
      path.style.strokeDashoffset = "0";
      fill.style.transition = "opacity 0.9s ease 0.35s";
      fill.style.opacity = "1";
      for (var i = 0; i < dots.length; i++) {
        dots[i].style.transition = "opacity 0.35s ease " + (0.35 + i * 0.1) + "s";
        dots[i].style.opacity = "1";
      }
    });
  }

  /* ---------- hover readout ---------- */
  function wireTooltip(wrap, a) {
    var svg = wrap.querySelector(".mkt-svg");
    var tip = wrap.querySelector(".mkt-tip");
    var cross = wrap.querySelector(".mkt-cross");
    if (!svg || !tip) return;
    var sc = scale(a.series);

    function at(clientX) {
      var r = svg.getBoundingClientRect();
      var x = ((clientX - r.left) / r.width) * W;
      var best = 0, bd = Infinity;
      for (var k = 0; k < a.series.length; k++) {
        var d = Math.abs(sc.x(k) - x);
        if (d < bd) { bd = d; best = k; }
      }
      var px = sc.x(best), py = sc.y(a.series[best]);
      cross.setAttribute("x1", px); cross.setAttribute("x2", px);
      cross.setAttribute("opacity", "1");
      tip.innerHTML = "<b>" + YEARS[best] + "</b>" + pkrM(a.series[best]) + "<em>per marla</em>";
      tip.style.left = ((px / W) * 100) + "%";
      tip.style.top = ((py / H) * 100) + "%";
      tip.classList.add("is-on");
    }
    function off() { tip.classList.remove("is-on"); cross.setAttribute("opacity", "0"); }

    svg.addEventListener("mousemove", function (e) { at(e.clientX); });
    svg.addEventListener("mouseleave", off);
    svg.addEventListener("touchstart", function (e) { at(e.touches[0].clientX); }, { passive: true });
    svg.addEventListener("touchmove", function (e) { at(e.touches[0].clientX); }, { passive: true });
    svg.addEventListener("touchend", off);
  }

  /* ---------- the comparison bars ---------- */
  function bars() {
    var max = Math.max.apply(null, AREAS.map(function (a) { return a.series[a.series.length - 1]; }));
    return AREAS.map(function (a) {
      var v = a.series[a.series.length - 1];
      return '<button class="mkt-bar' + (a.id === current.id ? " is-on" : "") + '" type="button" data-area="' + a.id + '">' +
        '<span class="mkt-bar__name">' + a.name + ' <em>' + a.city + '</em></span>' +
        '<span class="mkt-bar__track"><i style="--w:' + ((v / max) * 100).toFixed(1) + '%"></i></span>' +
        '<span class="mkt-bar__val">' + (v / 10).toFixed(2) + " Cr</span>" +
        "</button>";
    }).join("");
  }

  /* A short count-up on the headline figure. Switching areas is the main
     interaction here, and a number that snaps reads as a page reload while a
     number that travels reads as the same chart re-scaling. */
  function countTo(el, target) {
    if (reduced() || !el.dataset.v) { el.dataset.v = target; el.textContent = pkrM(target); return; }
    var from = parseFloat(el.dataset.v) || 0;
    el.dataset.v = target;
    var t0 = performance.now(), dur = 480;
    (function step(t) {
      var k = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = pkrM(from + (target - from) * e);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- render ---------- */
  function render(animate) {
    var a = current, s = a.series, last = s[s.length - 1];

    countTo($("mktNow"), last);
    $("mktWhere").textContent = a.name + ", " + a.city;

    var d1 = pct(s[s.length - 2], last);
    var d5 = pct(s[0], last);
    var delta = $("mktDelta");
    delta.textContent = d1 + " in 12 months";
    delta.className = "market__delta " + (d1.charAt(0) === "-" ? "is-down" : "is-up");

    $("mkt5y").textContent = d5;
    $("mktYield").textContent = a.yield.toFixed(1) + "%";
    $("mktDays").textContent = a.days + " days";
    $("mktNote").textContent = a.note;

    $("mktBands").innerHTML = Object.keys(BAND_LABEL)
      .filter(function (k) { return a.bands[k]; })
      .map(function (k) {
        return '<div class="mkt-band"><span>' + BAND_LABEL[k] + "</span><strong>PKR " +
          a.bands[k] + " Cr</strong></div>";
      }).join("") ||
      '<div class="mkt-band"><span>Plots</span><strong>1 Kanal and above</strong></div>';

    var wrap = $("mktChart");
    wrap.innerHTML = chart(a) + '<div class="mkt-tip"></div>';
    wireTooltip(wrap, a);
    if (animate) animateChart(wrap);

    $("mktBars").innerHTML = bars();
    $("mktBars").querySelectorAll("[data-area]").forEach(function (b) {
      b.addEventListener("click", function () { select(b.getAttribute("data-area")); });
    });

    document.querySelectorAll("#mktAreas [data-area]").forEach(function (c) {
      var on = c.getAttribute("data-area") === a.id;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-selected", String(on));
    });

    $("mktCta").textContent = "Send me the " + a.name + " brief";
  }

  function select(id) {
    var found = AREAS.filter(function (a) { return a.id === id; })[0];
    if (!found || found.id === current.id) return;
    current = found;
    render(true);
  }

  /* ---------- boot ---------- */
  function init() {
    var host = $("mktAreas");
    if (!host) return;

    host.innerHTML = AREAS.map(function (a) {
      return '<button class="chip" role="tab" type="button" data-area="' + a.id +
        '" aria-selected="false">' + a.name + "</button>";
    }).join("");
    host.querySelectorAll("[data-area]").forEach(function (c) {
      c.addEventListener("click", function () { select(c.getAttribute("data-area")); });
    });

    $("mktCta").addEventListener("click", function () {
      var msg = "Hello Adeel — please send me your current market brief for " +
        current.name + ", " + current.city + ".\n\n" +
        "I saw " + pkrM(current.series[current.series.length - 1]) + " per marla on your site (" +
        pct(current.series[0], current.series[current.series.length - 1]) + " over five years) " +
        "and I'd like your read on whether now is the right time.";
      if (window.LeadRelay) window.LeadRelay.send(msg);
      else window.open("https://wa.me/16134083945?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });

    render(false);

    // Hold the draw-in until the chart is actually looked at.
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !drawn) { drawn = true; animateChart($("mktChart")); io.disconnect(); }
        });
      }, { threshold: 0.25 });
      io.observe($("mktChart"));
    }

    var stamp = $("mktStamp");
    if (stamp) {
      stamp.textContent = new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  /* The budget matcher runs off exactly these numbers — one dataset, so the
     two sections can never disagree about what an area costs. */
  window.MarketData = {
    areas: AREAS,
    bandLabel: BAND_LABEL,
    select: select,
    focus: function (id) {
      select(id);
      var el = document.getElementById("market");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
})();

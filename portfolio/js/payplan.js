/* ============================================================
   INSTALMENT PLANNER
   ------------------------------------------------------------
   Almost nothing here is bought outright. Bahria, DHA, Capital
   Smart City, Lake City — they all sell on a plan: something
   down, quarterly instalments over three or four years, and a
   lump on possession that people forget about until it lands.

   Buyers work out whether they can afford the down payment and
   stop there. The question that actually matters is whether
   they can afford month fourteen, when a quarterly instalment
   and a half-yearly balloon fall in the same month. So this
   lays the whole schedule out on a timeline, marks the months
   that hurt, and gives the honest total — including the part
   that isn't the price.

   No rates are asserted anywhere: every number is the visitor's
   own, and the arithmetic is arithmetic.
   ============================================================ */
(function () {
  "use strict";

  var S = {
    price: 12000000,      // PKR — a 10 Marla in a good society
    downPct: 20,
    years: 3,
    perYear: 4,           // quarterly
    balloonPct: 0,        // half-yearly extras, as a share of the price
    possessionPct: 10,
    startMonth: new Date().getMonth(),
    startYear: new Date().getFullYear()
  };

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function $(id) { return document.getElementById(id); }

  /* Crore and lac, because that's how the money is spoken about here. */
  function pkr(v) {
    if (!isFinite(v)) return "—";
    var a = Math.abs(v);
    if (a >= 10000000) {
      var cr = v / 10000000;
      return (cr >= 100 ? cr.toFixed(0) : cr >= 10 ? cr.toFixed(1) : cr.toFixed(2))
        .replace(/\.?0+$/, "") + " Cr";
    }
    if (a >= 100000) return (v / 100000).toFixed(a >= 1000000 ? 0 : 1).replace(/\.?0+$/, "") + " Lac";
    return Math.round(v).toLocaleString("en-US");
  }

  /* The whole schedule, month by month. Everything downstream — the timeline,
     the totals, the worst month, the message — reads this one array, so the
     picture and the numbers can never disagree. */
  function schedule() {
    var months = S.years * 12;
    var down = S.price * S.downPct / 100;
    var possession = S.price * S.possessionPct / 100;
    var balloonEach = S.price * S.balloonPct / 100;

    var every = Math.max(1, Math.round(12 / S.perYear));
    var instalments = [];
    for (var m = every; m <= months; m += every) instalments.push(m);

    var balloons = [];
    if (balloonEach > 0) for (var b = 6; b < months; b += 6) balloons.push(b);

    // Whatever the down payment, the balloons and the possession lump don't
    // cover is spread across the instalments.
    var spread = S.price - down - possession - balloonEach * balloons.length;
    var each = instalments.length ? spread / instalments.length : 0;

    var rows = [];
    for (var i = 0; i <= months; i++) {
      var amt = 0, parts = [];
      if (i === 0) { amt += down; parts.push("Down payment"); }
      if (instalments.indexOf(i) >= 0) { amt += each; parts.push("Instalment"); }
      if (balloons.indexOf(i) >= 0) { amt += balloonEach; parts.push("Half-yearly"); }
      if (i === months) { amt += possession; parts.push("On possession"); }
      if (amt > 0) rows.push({ m: i, amt: amt, parts: parts });
    }
    return {
      rows: rows, months: months, down: down, possession: possession,
      each: each, count: instalments.length, balloonEach: balloonEach,
      balloonCount: balloons.length, spread: spread
    };
  }

  /* "Aug 26" read as the 26th of August. Full year, no ambiguity. */
  function label(m) {
    var t = S.startMonth + m;
    return MONTHS[((t % 12) + 12) % 12] + " " + (S.startYear + Math.floor(t / 12));
  }

  function render() {
    var s = schedule();
    var max = s.rows.reduce(function (a, r) { return Math.max(a, r.amt); }, 0) || 1;
    var total = s.rows.reduce(function (a, r) { return a + r.amt; }, 0);
    var worst = s.rows.reduce(function (a, r) { return r.amt > a.amt ? r : a; }, s.rows[0]);

    $("ppPrice").textContent = "PKR " + pkr(S.price);
    $("ppDownVal").textContent = S.downPct + "% · PKR " + pkr(s.down);
    $("ppPossVal").textContent = S.possessionPct + "% · PKR " + pkr(s.possession);
    $("ppBalloonVal").textContent = S.balloonPct
      ? S.balloonPct + "% · PKR " + pkr(s.balloonEach) + " every 6 months"
      : "None";
    $("ppYearsVal").textContent = S.years + (S.years === 1 ? " year" : " years");

    // Under a plan the price is the price — but if the pieces don't add up to
    // it, say so rather than quietly rescaling something.
    var warn = $("ppWarn");
    if (s.spread < 0) {
      warn.hidden = false;
      warn.textContent = "Down payment, half-yearly extras and the possession lump already come to more " +
        "than the price — there's nothing left to spread across the instalments. Ease one of them off.";
    } else {
      warn.hidden = true;
    }

    // With the lumps already over the price there is no instalment to quote;
    // "PKR 0" would read as good news rather than as a broken plan.
    $("ppEach").textContent = s.spread < 0 ? "—" : "PKR " + pkr(s.each);
    $("ppEachNote").textContent = s.spread < 0 ? "nothing left to spread"
      : s.count + " × " + (S.perYear === 12 ? "monthly" : S.perYear === 4 ? "quarterly" :
        S.perYear === 2 ? "half-yearly" : "yearly");
    $("ppTotal").textContent = "PKR " + pkr(total);
    $("ppWorst").textContent = "PKR " + pkr(worst.amt);
    $("ppWorstWhen").textContent = worst.m === 0 ? "at booking" : label(worst.m);

    // first-year outflow, which is the number that actually decides it
    var y1 = s.rows.filter(function (r) { return r.m <= 12; })
      .reduce(function (a, r) { return a + r.amt; }, 0);
    $("ppYear1").textContent = "PKR " + pkr(y1);

    $("ppBars").innerHTML = s.rows.map(function (r) {
      var h = Math.max(4, Math.round(r.amt / max * 100));
      var kind = r.m === 0 ? "is-down" : r.m === s.months ? "is-poss"
        : r.parts.length > 1 ? "is-heavy" : "";
      return '<div class="pp-bar ' + kind + '" style="--h:' + h + '%">' +
        '<span class="pp-bar__tip">' + r.parts.join(" + ") + "<br>PKR " + pkr(r.amt) +
        "<br>" + (r.m === 0 ? "At booking" : label(r.m)) + "</span></div>";
    }).join("");

    $("ppAxis").innerHTML = "<span>" + label(0) + "</span><span>" + label(s.months) + "</span>";
  }

  function send() {
    var s = schedule();
    var total = s.rows.reduce(function (a, r) { return a + r.amt; }, 0);
    var msg = "Hello Adeel — I've been through the instalment planner on your site.\n\n" +
      "• Property around PKR " + pkr(S.price) + "\n" +
      "• " + S.downPct + "% down (PKR " + pkr(s.down) + ")\n" +
      "• " + s.count + " instalments of about PKR " + pkr(s.each) + " over " + S.years + " years\n" +
      (s.balloonCount ? "• " + s.balloonCount + " half-yearly payments of PKR " + pkr(s.balloonEach) + "\n" : "") +
      "• PKR " + pkr(s.possession) + " on possession\n" +
      "• First twelve months: PKR " + pkr(s.rows.filter(function (r) { return r.m <= 12; })
        .reduce(function (a, r) { return a + r.amt; }, 0)) + "\n\n" +
      "Which societies are actually offering a plan like this right now, and what's the " +
      "total if I pay it down faster?";
    if (window.LeadRelay) window.LeadRelay.send(msg);
    else window.open("https://wa.me/16134083945?text=" + encodeURIComponent(msg), "_blank", "noopener");
  }

  function bindRange(id, key, fmt) {
    var el = $(id);
    if (!el) return;
    el.value = S[key];
    el.addEventListener("input", function () { S[key] = +el.value; render(); });
  }

  function init() {
    if (!$("ppBars")) return;
    bindRange("ppPriceR", "price");
    bindRange("ppDown", "downPct");
    bindRange("ppYears", "years");
    bindRange("ppBalloon", "balloonPct");
    bindRange("ppPoss", "possessionPct");

    var freq = $("ppFreq");
    if (freq) freq.querySelectorAll("[data-v]").forEach(function (b) {
      b.addEventListener("click", function () {
        freq.querySelectorAll("[data-v]").forEach(function (o) {
          var on = o === b;
          o.classList.toggle("is-active", on);
          o.setAttribute("aria-pressed", String(on));
        });
        S.perYear = +b.getAttribute("data-v");
        render();
      });
    });

    var cta = $("ppCta");
    if (cta) cta.addEventListener("click", send);
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

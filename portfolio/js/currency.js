/* ============================================================
   CURRENCY — show every price in the visitor's own money
   ------------------------------------------------------------
   Most of the buying here is overseas Pakistani money: London,
   Dubai, Toronto, Jeddah. "PKR 14.5 Crore" is not a number those
   buyers can feel, and mentally converting crore into pounds is
   exactly the kind of friction that ends a visit.

   Picking a currency annotates every price on the page — sold
   homes, live listings, the featured slider, the lightbox, the
   build estimate — with an approximate figure underneath.

   Deliberately lazy: no rate is fetched until someone actually
   asks for a currency, so the default PKR visit costs nothing.
   Prices are read from the rendered text rather than a parallel
   data field, which means listings injected later by the YouTube
   feed are handled by the same code.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "prefCurrency";
  // PKR per 1 unit. Indicative fallbacks; replaced by live rates on first use.
  var RATES = { USD: 278, GBP: 355, AED: 75.7, CAD: 204, SAR: 74, EUR: 300 };
  var SYM = { USD: "$", GBP: "£", AED: "AED ", CAD: "C$", SAR: "SAR ", EUR: "€" };
  var NAMES = { PKR: "PKR ₨", USD: "USD $", GBP: "GBP £", AED: "AED", CAD: "CAD C$", SAR: "SAR", EUR: "EUR €" };

  var cur = "PKR";
  try { cur = localStorage.getItem(KEY) || "PKR"; } catch (e) { /* ignore */ }
  if (!NAMES[cur]) cur = "PKR";

  var fetched = false, fetching = null;

  /* Where prices live. Each entry is a selector whose text is a PKR amount. */
  var PRICE_SELECTORS = [
    ".card__price",            // sold-home cards
    ".deal__price strong",     // live listing cards
    "#lbPrice",                // lightbox
    "#spotPrice",              // featured slider
    "#ltCost",                 // build estimate
    "[data-pkr-price]"         // anything opting in explicitly
  ];

  /* ---------- parsing ----------
     Handles the forms actually used on the page: "PKR 38 Crore",
     "PKR 14.5 Crore", "PKR 95 Lac", "PKR 9.4 Arab", "PKR 1,25,00,000". */
  function parsePKR(text) {
    if (!text) return 0;
    var t = String(text).replace(/ /g, " ").toLowerCase();

    // Be strict about what counts as money. The featured slider is rewritten
    // by the live YouTube feed and can hold "26.6K views" where a price used
    // to sit — turning that into pounds is worse than showing nothing. Require
    // an explicit currency mark or a subcontinental unit, and refuse anything
    // that reads like a different kind of number.
    if (/view|sq\s?ft|bed|bath|\bday|%|marla|kanal/.test(t)) return 0;
    if (!/pkr|rs\.?\s|₨|crore|\bcr\b|lakh|lac|arab/.test(t)) return 0;
    var m = t.match(/([\d.,]+)\s*(arab|crore|cr\b|lakh|lac|k\b)?/);
    if (!m) return 0;
    var n = parseFloat(m[1].replace(/,/g, ""));
    if (!isFinite(n)) return 0;
    var unit = m[2] || "";
    if (unit === "arab") return n * 1e9;
    if (unit === "crore" || unit === "cr") return n * 1e7;
    if (unit === "lakh" || unit === "lac") return n * 1e5;
    if (unit === "k") return n * 1e3;
    return n;
  }

  function fmt(v) {
    if (v >= 1e6) return (v / 1e6).toFixed(v >= 1e7 ? 0 : 2).replace(/\.00$/, "") + "M";
    if (v >= 1000) return Math.round(v).toLocaleString("en-US");
    return v.toFixed(0);
  }

  /* ---------- painting ---------- */
  function clear(el) {
    var old = el.querySelector(".fx-alt");
    if (old) old.remove();
  }

  function paintOne(el) {
    clear(el);
    if (cur === "PKR") return;
    // The converted line is our own — never read it back as a price.
    var pkr = parsePKR(el.getAttribute("data-pkr-raw") || el.textContent);
    if (!pkr) return;
    el.setAttribute("data-pkr-raw", el.getAttribute("data-pkr-raw") || el.textContent.trim());
    var span = document.createElement("span");
    span.className = "fx-alt";
    span.textContent = "≈ " + SYM[cur] + fmt(pkr / RATES[cur]);
    el.appendChild(span);
  }

  function paintAll() {
    var nodes = document.querySelectorAll(PRICE_SELECTORS.join(","));
    for (var i = 0; i < nodes.length; i++) paintOne(nodes[i]);
    var pill = document.getElementById("fxPick");
    if (pill) pill.value = cur;
    document.documentElement.setAttribute("data-currency", cur);
  }

  /* Live rates, fetched once and only when a foreign currency is chosen. */
  function ensureRates() {
    if (fetched) return Promise.resolve();
    if (fetching) return fetching;
    fetching = fetch("https://open.er-api.com/v6/latest/PKR")
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (d) {
        if (d && d.rates) {
          Object.keys(RATES).forEach(function (c) {
            var perPkr = d.rates[c];
            if (perPkr && perPkr > 0) RATES[c] = 1 / perPkr;
          });
        }
        fetched = true;
      })
      // Offline or API down: the indicative fallbacks are still useful, and
      // every figure is labelled approximate anyway.
      .catch(function () { fetched = true; });
    return fetching;
  }

  function setCurrency(next) {
    cur = NAMES[next] ? next : "PKR";
    try { localStorage.setItem(KEY, cur); } catch (e) { /* ignore */ }
    if (cur === "PKR") { paintAll(); return; }
    ensureRates().then(paintAll);
  }

  /* ---------- the control ---------- */
  function mount() {
    // Lives in the sold-homes toolbar rather than the nav: the nav is already
    // full at 1440px and another control there wrapped the logo. This is also
    // where a visitor first meets a price, and it inherits the toolbar's own
    // input styling for free. The setting is global once chosen.
    var host = document.querySelector(".portfolio__toolbar");
    if (!host) return;

    var wrap = document.createElement("label");
    wrap.className = "fx-pick";
    wrap.innerHTML =
      '<span class="fx-pick__label">Prices in</span>' +
      '<select id="fxPick" aria-label="Show prices in">' +
      Object.keys(NAMES).map(function (c) {
        return '<option value="' + c + '"' + (c === cur ? " selected" : "") + ">" + NAMES[c] + "</option>";
      }).join("") +
      "</select>";
    host.appendChild(wrap);

    wrap.querySelector("select").addEventListener("change", function (e) {
      setCurrency(e.target.value);
    });

    // Cards for sold homes and live listings arrive after this runs, and the
    // feed re-renders them later — repaint whenever the grids change.
    if ("MutationObserver" in window) {
      var mo = new MutationObserver(function () {
        clearTimeout(mo._t);
        mo._t = setTimeout(paintAll, 120);
      });
      ["grid", "dealsGrid", "lightbox"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) mo.observe(el, { childList: true, subtree: true, characterData: true });
      });
    }

    if (cur === "PKR") paintAll();
    else ensureRates().then(paintAll);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();

  window.Currency = { set: setCurrency, get: function () { return cur; }, repaint: paintAll };
})();

/* ============================================================
   FINANCE TOOLS — EMI calculator + currency converter
   Vanilla JS, no dependencies. Self-contained.
   ============================================================ */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const tools = $("tools");
  if (!tools) return;

  /* ---------- formatting helpers ---------- */
  // Large round amounts -> Crore / Lakh (South-Asian convention)
  function fmtShort(v) {
    v = Math.max(0, Math.round(v));
    if (v >= 1e7) return "PKR " + (v / 1e7).toFixed(2) + " Crore";
    if (v >= 1e5) return "PKR " + (v / 1e5).toFixed(2) + " Lakh";
    return "PKR " + v.toLocaleString("en-US");
  }
  // Precise amount with South-Asian digit grouping (e.g. 3,24,500)
  function fmtMoney(v) {
    return "PKR " + Math.round(Math.max(0, v)).toLocaleString("en-IN");
  }

  /* ---------- EMI / mortgage calculator ---------- */
  const emi = {
    price: $("emiPrice"), down: $("emiDown"), rate: $("emiRate"), years: $("emiYears"),
    priceOut: $("emiPriceOut"), downOut: $("emiDownOut"), rateOut: $("emiRateOut"), yearsOut: $("emiYearsOut"),
    monthly: $("emiMonthly"), loan: $("emiLoan"), downAmt: $("emiDownAmt"),
    interest: $("emiInterest"), total: $("emiTotal")
  };

  function calcEmi() {
    if (!emi.price) return;
    const price = +emi.price.value;
    const downPct = +emi.down.value;
    const annualRate = +emi.rate.value;
    const years = +emi.years.value;

    const downAmt = price * downPct / 100;
    const loan = price - downAmt;
    const n = years * 12;
    const r = annualRate / 100 / 12;

    let monthly;
    if (r === 0) monthly = loan / n;
    else monthly = loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

    const totalPaid = monthly * n;
    const totalInterest = totalPaid - loan;

    emi.priceOut.textContent = fmtShort(price);
    emi.downOut.textContent = downPct + "%";
    emi.rateOut.textContent = annualRate.toFixed(1) + "% p.a.";
    emi.yearsOut.textContent = years + (years === 1 ? " year" : " years");

    emi.monthly.textContent = fmtMoney(monthly) + " /mo";
    emi.loan.textContent = fmtShort(loan);
    emi.downAmt.textContent = fmtShort(downAmt);
    emi.interest.textContent = fmtShort(totalInterest);
    emi.total.textContent = fmtShort(totalPaid + downAmt);
  }

  ["price", "down", "rate", "years"].forEach((k) => {
    if (emi[k]) emi[k].addEventListener("input", calcEmi);
  });
  calcEmi();

  /* ---------- Rental yield / ROI calculator ---------- */
  const roi = {
    price: $("roiPrice"), rent: $("roiRent"), appreciation: $("roiAppreciation"),
    priceOut: $("roiPriceOut"), rentOut: $("roiRentOut"), appreciationOut: $("roiApprecOut"),
    yieldEl: $("roiYield"), annualRent: $("roiAnnualRent"),
    breakeven: $("roiBreakeven"), fiveYr: $("roi5yr"), gain: $("roiGain")
  };

  function calcRoi() {
    if (!roi.price) return;
    const price = +roi.price.value;
    const monthlyRent = +roi.rent.value;
    const appreciationRate = +roi.appreciation.value / 100;

    const annualRent = monthlyRent * 12;
    const yieldPct = price > 0 ? (annualRent / price) * 100 : 0;
    const fiveYrValue = price * Math.pow(1 + appreciationRate, 5);
    const totalRent5yr = annualRent * 5;
    const gain = fiveYrValue - price + totalRent5yr;
    const breakeven = (annualRent + price * appreciationRate) > 0
      ? price / (annualRent + price * appreciationRate)
      : 99;

    roi.priceOut.textContent = fmtShort(price);
    roi.rentOut.textContent = fmtShort(monthlyRent);
    roi.appreciationOut.textContent = roi.appreciation.value + "%";

    roi.yieldEl.textContent = yieldPct.toFixed(2) + "% p.a.";
    roi.annualRent.textContent = fmtShort(annualRent);
    roi.breakeven.textContent = breakeven.toFixed(1) + " yrs";
    roi.fiveYr.textContent = fmtShort(fiveYrValue);
    roi.gain.textContent = fmtShort(gain);
  }

  ["price", "rent", "appreciation"].forEach((k) => {
    if (roi[k]) roi[k].addEventListener("input", calcRoi);
  });
  calcRoi();

  /* ---------- currency converter ---------- */
  // PKR per 1 unit of foreign currency — seeded with indicative fallbacks.
  const RATES = { USD: 278, GBP: 355, AED: 75.7, CAD: 204, SAR: 74, EUR: 300 };
  const SYM = { USD: "$", GBP: "£", AED: "AED ", CAD: "C$", SAR: "SAR ", EUR: "€" };

  function fmtFx(v) {
    if (v >= 1e6) return (v / 1e6).toFixed(2) + "M";
    if (v >= 1000) return Math.round(v).toLocaleString("en-US");
    return v.toFixed(2);
  }

  const fxInput = $("fxPkr");
  const fxOut = $("fxPkrOut");
  const fxCells = document.querySelectorAll("#fxGrid [data-fx]");
  const fxNote = $("fxNote");

  function calcFx() {
    if (!fxInput) return;
    const pkr = +fxInput.value;
    fxOut.textContent = fmtShort(pkr);
    fxCells.forEach((el) => {
      const cur = el.getAttribute("data-fx");
      el.textContent = SYM[cur] + fmtFx(pkr / RATES[cur]);
    });
  }

  // Fetch live PKR rates from open.er-api.com (free tier, no key required).
  // Response: { rates: { USD: 0.003597, GBP: ..., ... } } (units: 1 PKR = X foreign)
  // We store the inverse (PKR per 1 foreign unit) to match our RATES convention.
  (function loadLiveRates() {
    fetch("https://open.er-api.com/v6/latest/PKR")
      .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
      .then(function (data) {
        if (!data || !data.rates) return;
        Object.keys(RATES).forEach(function (cur) {
          const ratePerPkr = data.rates[cur]; // 1 PKR = ratePerPkr units of cur
          if (ratePerPkr && ratePerPkr > 0) RATES[cur] = 1 / ratePerPkr;
        });
        calcFx();
        if (fxNote) {
          const now = new Date();
          fxNote.textContent = "Rates live as of " +
            now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + " today.";
        }
      })
      .catch(function () {
        // Network failure or API down — silently keep fallback rates.
        if (fxNote) fxNote.textContent = "Using approximate rates (live fetch unavailable).";
      });
  })();

  if (fxInput) fxInput.addEventListener("input", calcFx);
  calcFx();

  /* ---------- Transfer & closing cost estimator ----------
     Indicative 2025-26 rates. FBR advance tax (236K) is the big
     filer/non-filer swing; stamp+registration and society transfer
     fees are area-dependent, held here as sensible flat defaults. */
  const RATES_TX = {
    filer:    { fbr: 0.03,  stamp: 0.02, transfer: 0.01 },
    nonfiler: { fbr: 0.105, stamp: 0.02, transfer: 0.01 }
  };
  const tx = {
    price: $("txPrice"), priceOut: $("txPriceOut"), filer: $("txFiler"),
    total: $("txTotal"), fbr: $("txFbr"), stamp: $("txStamp"),
    transfer: $("txTransfer"), allIn: $("txAllIn"), note: $("txNote")
  };
  let txStatus = "filer";

  function calcTx() {
    if (!tx.price) return;
    const price = +tx.price.value;
    const r = RATES_TX[txStatus];
    const fbr = price * r.fbr;
    const stamp = price * r.stamp;
    const transfer = price * r.transfer;
    const total = fbr + stamp + transfer;

    tx.priceOut.textContent = fmtShort(price);
    tx.total.textContent = fmtShort(total);
    tx.fbr.textContent = fmtShort(fbr);
    tx.stamp.textContent = fmtShort(stamp);
    tx.transfer.textContent = fmtShort(transfer);
    tx.allIn.textContent = fmtShort(price + total);

    if (tx.note) {
      if (txStatus === "nonfiler") {
        const saving = price * (RATES_TX.nonfiler.fbr - RATES_TX.filer.fbr);
        tx.note.innerHTML = "As a <strong>non-filer you're paying about " + fmtShort(saving) +
          " extra</strong> in advance tax alone. Becoming a filer before you transact usually pays for itself many times over — ask me how.";
      } else {
        tx.note.textContent = "Indicative rates for 2025–26; exact figures depend on area, DC/FBR value and the latest Finance Act. I confirm every number before your bayana is signed.";
      }
    }
  }

  if (tx.price) tx.price.addEventListener("input", calcTx);
  if (tx.filer) {
    tx.filer.addEventListener("click", function (e) {
      const btn = e.target.closest(".seg__btn");
      if (!btn) return;
      txStatus = btn.getAttribute("data-val");
      tx.filer.querySelectorAll(".seg__btn").forEach(function (b) {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      calcTx();
    });
  }
  calcTx();
})();

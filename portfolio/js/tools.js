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

  /* ---------- currency converter ---------- */
  // Indicative PKR per 1 unit of foreign currency.
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

  function calcFx() {
    if (!fxInput) return;
    const pkr = +fxInput.value;
    fxOut.textContent = fmtShort(pkr);
    fxCells.forEach((el) => {
      const cur = el.getAttribute("data-fx");
      el.textContent = SYM[cur] + fmtFx(pkr / RATES[cur]);
    });
  }

  if (fxInput) fxInput.addEventListener("input", calcFx);
  calcFx();
})();

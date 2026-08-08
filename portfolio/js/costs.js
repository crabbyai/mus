/* ============================================================
   WHAT IT COSTS TO TRANSFER
   ------------------------------------------------------------
   The price is never the price. Between agreeing a number and
   holding the file you pay advance income tax, stamp duty, a
   registration fee, CVT or town tax depending on where you are,
   the society's own transfer schedule and the agent. Buyers
   routinely find this out in the week they can least afford to.

   Two rules shaped this file.

   First: not one rate is written into the code. Everything is
   read from data/tax-rates.json, so there is exactly one place
   to change when the Finance Act moves, and a scheduled job can
   watch the sources without touching any logic.

   Second: it refuses to sound more certain than it is. The data
   carries a 'verified' flag and a per-line confidence. Until a
   human has checked those lines against FBR and the provincial
   board, the page says so in amber at the top and every low
   confidence line is marked. If the rates predate the most
   recent 1 July — when a Finance Act takes effect — the page
   works that out on its own and warns, with no network call and
   nobody having to remember.
   ============================================================ */
(function () {
  "use strict";

  var D = null;                     // the rates file, once it loads
  var S = { price: 25000000, side: "buy", status: "filer", region: "isb",
            marlas: 10, society: 0, commission: null, gainPct: 25 };

  function $(id) { return document.getElementById(id); }

  /* Drop a trailing ".0" or ".50" but never touch a whole number: /\.?0+$/
     turned "20" into "2" and "100" into "1", so 20 Lac was displayed as 2 Lac
     and a 100 Crore deal as 1 Crore. */
  function trimZeros(s) {
    return s.indexOf(".") < 0 ? s : s.replace(/0+$/, "").replace(/\.$/, "");
  }

  function pkr(v) {
    if (!isFinite(v)) return "—";
    var a = Math.abs(v);
    if (a >= 10000000) {
      var cr = v / 10000000;
      return trimZeros(cr >= 100 ? cr.toFixed(0) : cr >= 10 ? cr.toFixed(1) : cr.toFixed(2)) + " Cr";
    }
    if (a >= 100000) return trimZeros((v / 100000).toFixed(a >= 1000000 ? 0 : 1)) + " Lac";
    return Math.round(v).toLocaleString("en-US");
  }

  /* Which slab a price lands in. Slabs are ordered and the last has upTo null,
     which means "everything above". */
  function slabFor(slabs, price) {
    for (var i = 0; i < slabs.length; i++) {
      if (slabs[i].upTo === null || price <= slabs[i].upTo) return slabs[i];
    }
    return slabs[slabs.length - 1];
  }

  /* A Finance Act takes effect on 1 July. If the rates on file were written
     before the most recent one, they are out of date whatever anyone remembers
     — this works that out from the date alone, offline, every time the page
     opens. */
  function lastJuly(now) {
    var y = now.getUTCFullYear();
    var j = new Date(Date.UTC(y, 6, 1));
    if (now < j) j = new Date(Date.UTC(y - 1, 6, 1));
    return j;
  }
  function staleness() {
    if (!D || !D.effectiveFrom) return null;
    var eff = new Date(D.effectiveFrom + "T00:00:00Z");
    var cut = lastJuly(new Date());
    if (eff >= cut) return null;
    return { since: cut.getUTCFullYear(), act: D.financeAct };
  }

  /* Every line either side pays, from the data. */
  function lines() {
    if (!D) return [];
    var out = [], p = S.price, st = S.status;
    var reg = D.regions[S.region] || { lines: [] };

    if (S.side === "buy") {
      var k = D.federal["236K"];
      if (k) {
        var sl = slabFor(k.slabs, p);
        out.push({ id: "236K", label: k.label + " (" + k.section + ")",
                   path: "federal.236K.slabs.0." + st,
                   pct: sl[st], amt: p * sl[st] / 100, note: k.note,
                   conf: k.confidence, adjustable: st !== "non" });
      }
      reg.lines.filter(function (l) { return l.paidBy === "buyer"; }).forEach(function (l, i) {
        out.push({ id: l.id, label: l.label + " · " + reg.n, pct: l.pct,
                   path: "regions." + S.region + ".lines." + reg.lines.indexOf(l) + ".pct",
                   amt: p * l.pct / 100, conf: l.confidence });
      });
    } else {
      var c = D.federal["236C"];
      if (c) {
        var sc = slabFor(c.slabs, p);
        out.push({ id: "236C", label: c.label + " (" + c.section + ")",
                   path: "federal.236C.slabs.0." + st,
                   pct: sc[st], amt: p * sc[st] / 100, note: c.note,
                   conf: c.confidence, adjustable: st !== "non" });
      }
      var g = D.federal.cgt;
      if (g && S.gainPct > 0) {
        var gain = p * S.gainPct / 100;
        var rate = g.flatOnGain[st];
        out.push({ id: "cgt", label: g.label + " (" + g.section + ")", pct: rate,
                   amt: gain * rate / 100, note: g.note, conf: g.confidence,
                   basis: "on an assumed gain of PKR " + pkr(gain) });
      }
    }

    // society and agent apply to both sides
    var soc = S.society * S.marlas;
    if (soc > 0) out.push({ id: "society", label: "Society transfer fee",
                            amt: soc, conf: "input",
                            basis: S.marlas + " marla × PKR " + pkr(S.society) });
    var comPct = S.commission === null
      ? ((D.other.filter(function (o) { return o.id === "commission"; })[0] || {}).pct || 0)
      : S.commission;
    if (comPct > 0) out.push({ id: "commission", label: "Agent commission",
                               pct: comPct, amt: p * comPct / 100, conf: "input" });
    return out;
  }

  function render() {
    if (!D) return;
    var L = lines();
    var total = L.reduce(function (a, l) { return a + l.amt; }, 0);
    var adjustable = L.filter(function (l) { return l.adjustable; })
      .reduce(function (a, l) { return a + l.amt; }, 0);

    $("cxPrice").textContent = "PKR " + pkr(S.price);
    $("cxMarlas").textContent = S.marlas + (S.marlas === 1 ? " marla" : " marlas");
    $("cxSociety").textContent = S.society ? "PKR " + pkr(S.society) + " / marla" : "None";
    $("cxGainWrap").hidden = S.side !== "sell";
    $("cxGain").textContent = S.gainPct + "% of the price";

    $("cxRows").innerHTML = L.map(function (l) {
      var seen = l.path && D.audit && D.audit.status ? D.audit.status[l.path] : null;
      var badge = seen && seen.ok
        ? ' <i class="cx-flag is-ok" title="Found on the source page on ' + seen.lastSeen +
          '">checked ' + seen.lastSeen + "</i>"
        : (l.conf === "low"
            ? ' <i class="cx-flag" title="Not yet confirmed against the current Act">unconfirmed</i>'
            : "");
      return '<div class="cx-row' + (l.conf === "low" && !(seen && seen.ok) ? " is-unsure" : "") + '">' +
        '<span class="cx-row__label">' +
          '<span class="cx-row__title">' + l.label + badge +
          "</span>" +
          (l.basis ? '<em>' + l.basis + "</em>" : "") +
          (l.note ? '<em class="cx-row__note">' + l.note + "</em>" : "") +
        "</span>" +
        '<span class="cx-row__pct">' + (l.pct !== undefined ? l.pct + "%" : "—") + "</span>" +
        '<span class="cx-row__amt">PKR ' + pkr(l.amt) + "</span>" +
      "</div>";
    }).join("");

    $("cxTotal").textContent = "PKR " + pkr(total);
    $("cxPctOf").textContent = (total / S.price * 100).toFixed(1) + "% of the price";
    $("cxAll").textContent = "PKR " + pkr(S.side === "buy" ? S.price + total : S.price - total);
    $("cxAllLabel").textContent = S.side === "buy" ? "You need in hand" : "You walk away with";
    $("cxAdjust").textContent = adjustable > 0 ? "PKR " + pkr(adjustable) : "—";
    $("cxAdjustNote").textContent = adjustable > 0
      ? "adjustable against your income tax if you file"
      : "nothing here comes back if you don't file";
  }

  /* Two separate warnings, because they mean different things: nobody has
     checked these yet, and these are from before the current Act. */
  function banners() {
    var box = $("cxBanner");
    if (!box) return;
    var msgs = [];
    if (!D.verified) {
      msgs.push("<strong>Not yet confirmed.</strong> These figures were seeded from the " +
        D.financeAct + " and haven't been checked line by line against FBR and the " +
        "provincial board. Lines marked <i>unconfirmed</i> are the ones I'd least " +
        "want you to rely on. Ask me before you budget on any of it.");
    }
    var st = staleness();
    if (st) {
      msgs.push("<strong>These predate the current Finance Act.</strong> They are dated " +
        D.effectiveFrom + ", and a Finance Act has taken effect since (1 July " + st.since +
        "). Message me for the current schedule.");
    }
    if (D.verified && !st && D.verifiedOn) {
      box.className = "cx-banner is-ok";
      box.innerHTML = "Checked against FBR and the provincial board on " + D.verifiedOn +
        (D.verifiedBy ? " by " + D.verifiedBy : "") + ". Still worth confirming on your own file — " +
        "societies and sub-registrars vary.";
      box.hidden = false;
      return;
    }
    box.className = "cx-banner";
    box.innerHTML = msgs.join("<br><br>");
    box.hidden = !msgs.length;
  }

  /* What the scheduled job found, said plainly. This is the part that makes
     the automation worth having: not "we check sometimes" but "four of these
     six figures were still on the FBR page on this date". */
  function audit() {
    var el = $("cxAudit");
    if (!el) return;
    var a = D.audit && D.audit.lastRun;
    if (!a) {
      el.textContent = "These rates haven't been machine-checked against the source yet.";
      return;
    }
    el.innerHTML = "Re-read from FBR and the provincial boards on <b>" + a.at + "</b> — <b>" +
      a.confirmed + " of " + a.total + "</b> figures were still on the source page" +
      (a.unreachable ? ", " + a.unreachable + " source" + (a.unreachable > 1 ? "s" : "") +
        " unreachable" : "") + ". A rate that changes opens a pull request; nothing goes live " +
      "until it's reviewed.";
  }

  function send() {
    var L = lines();
    var total = L.reduce(function (a, l) { return a + l.amt; }, 0);
    var msg = "Hello Adeel — I've been through the transfer cost calculator on your site.\n\n" +
      "• " + (S.side === "buy" ? "Buying" : "Selling") + " at around PKR " + pkr(S.price) +
        " in " + (D.regions[S.region] || {}).n + "\n" +
      "• " + (D.statuses.filter(function (s) { return s.id === S.status; })[0] || {}).short + "\n" +
      L.map(function (l) { return "• " + l.label + ": PKR " + pkr(l.amt); }).join("\n") + "\n" +
      "• Total on top: PKR " + pkr(total) + "\n\n" +
      "Can you confirm the current rates and what the society charges on this one?";
    if (window.LeadRelay) window.LeadRelay.send(msg);
    else window.open("https://wa.me/16134083945?text=" + encodeURIComponent(msg), "_blank", "noopener");
  }

  function chips(id, list, cur, onPick) {
    var box = $(id);
    if (!box) return;
    box.innerHTML = list.map(function (o) {
      return '<button class="chip' + (o.id === cur ? " is-active" : "") + '" type="button" ' +
        'data-v="' + o.id + '" aria-pressed="' + (o.id === cur) + '">' + o.n + "</button>";
    }).join("");
    box.querySelectorAll("[data-v]").forEach(function (b) {
      b.addEventListener("click", function () {
        box.querySelectorAll("[data-v]").forEach(function (o) {
          var on = o === b;
          o.classList.toggle("is-active", on);
          o.setAttribute("aria-pressed", String(on));
        });
        onPick(b.getAttribute("data-v"));
      });
    });
  }

  function boot() {
    if (!$("cxRows")) return;
    fetch("data/tax-rates.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) {
        D = j;
        chips("cxSide", [{ id: "buy", n: "I'm buying" }, { id: "sell", n: "I'm selling" }],
          S.side, function (v) { S.side = v; render(); });
        chips("cxRegion", Object.keys(D.regions).map(function (k) {
          return { id: k, n: D.regions[k].n };
        }), S.region, function (v) { S.region = v; render(); });
        chips("cxStatus", D.statuses.map(function (s) { return { id: s.id, n: s.short }; }),
          S.status, function (v) { S.status = v; render(); });

        [["cxPriceR", "price"], ["cxMarlasR", "marlas"], ["cxSocietyR", "society"],
         ["cxGainR", "gainPct"]].forEach(function (p) {
          var el = $(p[0]);
          if (!el) return;
          el.value = S[p[1]];
          el.addEventListener("input", function () { S[p[1]] = +el.value; render(); });
        });

        var cta = $("cxCta");
        if (cta) cta.addEventListener("click", send);

        banners();
        audit();
        render();
      })
      .catch(function () {
        var box = $("cxBanner");
        if (box) {
          box.hidden = false;
          box.className = "cx-banner";
          box.innerHTML = "<strong>Couldn't load the current rates.</strong> Rather than show you " +
            "numbers I can't stand behind, this stays blank — message me and I'll send the " +
            "schedule for your transaction.";
        }
        var shell = document.querySelector(".costs__grid");
        if (shell) shell.hidden = true;
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

/* ============================================================
   COMPARE HOMES — side by side, with the arithmetic done
   ------------------------------------------------------------
   Realtor.ca, Zillow and every serious brokerage site let you
   put listings next to each other, because that is how the
   decision actually gets made: not "is this house nice" but
   "is this one better value than that one".

   The gallery of closings is a price book — twelve real numbers
   against twelve real plots. Ticking two or three and seeing
   them in a column turns it into the thing a buyer wants: what
   does a marla cost in F-7 versus Bahria Enclave, and what did
   the extra crore actually buy.

   Price per marla is computed here rather than quoted, so the
   comparison holds even for the odd sizes (4 Kanal, 2 Kanal).
   The cheapest per marla, the largest covered area and the
   fastest sale each get marked — the three questions people
   ask of a table like this.

   Vanilla JS, no dependencies. Selection survives a reload.
   ============================================================ */
(function () {
  "use strict";

  var HOMES = (window.SoldHomes && window.SoldHomes.PROPERTIES) || [];
  var grid = document.getElementById("grid");
  if (!grid || !HOMES.length) return;

  var MAX = 3;
  var KEY = "ar_compare_v1";
  var picked = [];
  try { picked = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { picked = []; }
  if (!Array.isArray(picked)) picked = [];
  picked = picked.filter(function (i) { return typeof i === "number" && HOMES[i]; }).slice(0, MAX);

  function save() { try { localStorage.setItem(KEY, JSON.stringify(picked)); } catch (e) {} }
  function esc(t) { var d = document.createElement("div"); d.textContent = t == null ? "" : t; return d.innerHTML; }

  /* ---------- the arithmetic ----------
     "PKR 38 Crore" → 380,000,000 · "2 Kanal" → 40 marla · both → per marla */
  function toRupees(price) {
    var m = String(price || "").replace(/,/g, "").match(/([\d.]+)\s*(crore|cr|lakh|lac)?/i);
    if (!m) return 0;
    var n = parseFloat(m[1]);
    if (!isFinite(n)) return 0;
    var unit = (m[2] || "crore").toLowerCase();
    return unit.indexOf("l") === 0 ? n * 100000 : n * 10000000;
  }
  function toMarla(sizeLabel) {
    var m = String(sizeLabel || "").match(/([\d.]+)\s*(kanal|marla)/i);
    if (!m) return 0;
    var n = parseFloat(m[1]);
    return /kanal/i.test(m[2]) ? n * 20 : n;
  }
  function toSqft(area) {
    var m = String(area || "").replace(/,/g, "").match(/(\d+)/);
    return m ? +m[1] : 0;
  }
  /* Crore reads wrong below a crore, and lakh reads wrong above one. */
  function money(rupees) {
    if (!rupees) return "—";
    if (rupees >= 10000000) return "PKR " + (rupees / 10000000).toFixed(rupees >= 100000000 ? 1 : 2).replace(/\.0+$/, "") + " Cr";
    return "PKR " + Math.round(rupees / 100000) + " Lakh";
  }
  function perMarla(p) {
    var marla = toMarla(p.sizeLabel);
    return marla ? toRupees(p.price) / marla : 0;
  }

  /* The per-marla rate is the number that actually compares two addresses,
     so it belongs on the card as well as in the table — and the gallery's
     sort menu needs the same maths to offer a "best value" order. */
  window.Marla = { perMarla: perMarla, money: money, toMarla: toMarla, toRupees: toRupees };

  /* ---------- card checkboxes + the rate on each card ---------- */
  var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));
  cards.forEach(function (card, i) {
    var rate = perMarla(HOMES[i]);
    var foot = card.querySelector(".card__price");
    if (rate && foot) {
      var tag = document.createElement("span");
      tag.className = "card__marla";
      tag.textContent = money(rate) + " / marla";
      foot.appendChild(tag);
    }
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card__cmp";
    btn.dataset.cmp = i;
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = '<span class="card__cmp-box" aria-hidden="true"></span><span class="card__cmp-txt">Compare</span>';
    btn.title = "Add this home to the comparison";
    btn.addEventListener("click", function (e) { e.stopPropagation(); toggle(i); });
    var media = card.querySelector(".card__media");
    (media || card).appendChild(btn);
  });

  function syncCards() {
    grid.querySelectorAll("[data-cmp]").forEach(function (b) {
      var on = picked.indexOf(+b.dataset.cmp) > -1;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.querySelector(".card__cmp-txt").textContent = on ? "Added" : "Compare";
      // At the cap, the un-ticked cards say so rather than silently refusing.
      var full = picked.length >= MAX && !on;
      b.classList.toggle("is-full", full);
      b.title = full ? "Comparing " + MAX + " already — remove one first" : "Add this home to the comparison";
    });
  }

  function toggle(i) {
    var at = picked.indexOf(i);
    if (at > -1) picked.splice(at, 1);
    else if (picked.length >= MAX) {
      if (window.toast) window.toast("Comparing " + MAX + " homes already — remove one first.");
      pulseTray();
      return;
    } else picked.push(i);
    save(); syncCards(); renderTray();
  }

  /* ---------- the docked tray ---------- */
  var tray = document.createElement("div");
  tray.className = "cmp-tray";
  tray.id = "cmpTray";
  tray.setAttribute("aria-live", "polite");
  tray.innerHTML =
    '<div class="cmp-tray__inner">' +
      '<div class="cmp-tray__slots" id="cmpSlots"></div>' +
      '<div class="cmp-tray__act">' +
        '<button type="button" class="cmp-tray__clear" id="cmpClear">Clear</button>' +
        '<button type="button" class="btn btn--gold cmp-tray__go" id="cmpGo">Compare <span class="btn__arrow">→</span></button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(tray);

  function pulseTray() {
    tray.classList.remove("is-pulse");
    void tray.offsetWidth;
    tray.classList.add("is-pulse");
  }

  function renderTray() {
    var slots = document.getElementById("cmpSlots");
    var go = document.getElementById("cmpGo");
    tray.classList.toggle("is-open", picked.length > 0);
    if (!picked.length) return;
    var html = picked.map(function (i) {
      var p = HOMES[i];
      var img = (cards[i] && cards[i].querySelector(".card__media img")) || null;
      return '<div class="cmp-slot" title="' + esc(p.title) + '">' +
        '<img src="' + esc(img ? img.src : p.img) + '" alt="" />' +
        '<span class="cmp-slot__label">' + esc(p.sizeLabel) + '</span>' +
        '<button type="button" class="cmp-slot__rm" data-rm="' + i + '" aria-label="Remove ' + esc(p.title) + ' from comparison">✕</button>' +
        '</div>';
    }).join("");
    for (var n = picked.length; n < MAX; n++) html += '<div class="cmp-slot cmp-slot--empty"><span>+</span></div>';
    slots.innerHTML = html;
    slots.querySelectorAll("[data-rm]").forEach(function (b) {
      b.addEventListener("click", function () { toggle(+b.dataset.rm); });
    });
    go.disabled = picked.length < 2;
    go.firstChild.nodeValue = picked.length < 2 ? "Pick one more " : "Compare " + picked.length + " homes ";
  }

  document.getElementById("cmpClear").addEventListener("click", function () {
    picked = []; save(); syncCards(); renderTray();
  });
  document.getElementById("cmpGo").addEventListener("click", open);

  /* ---------- the comparison itself ---------- */
  var modal = document.createElement("div");
  modal.className = "cmp-modal";
  modal.id = "cmpModal";
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Side-by-side comparison");
  modal.innerHTML =
    '<div class="cmp-modal__backdrop" id="cmpBackdrop"></div>' +
    '<div class="cmp-modal__panel glass">' +
      '<button class="cmp-modal__close" id="cmpClose" aria-label="Close comparison">✕</button>' +
      '<div class="cmp-modal__head">' +
        '<p class="section-eyebrow">Side by side</p>' +
        '<h2 class="section-title">What the money <em class="gold-italic">actually bought</em></h2>' +
        '<p class="cmp-modal__lead">Closed prices, not asking prices — and the per-marla rate worked out for you, ' +
        'which is the only number that compares a 5 Marla in E-11 to a Kanal in DHA.</p>' +
      '</div>' +
      '<div class="cmp-modal__scroll"><table class="cmp-table" id="cmpTable"></table></div>' +
      '<div class="cmp-modal__foot">' +
        '<button class="btn btn--wa" type="button" id="cmpWa">Ask Adeel which one to buy</button>' +
        '<button class="btn btn--ghost" type="button" id="cmpPrint">⎙ Print / Save PDF</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);

  function best(vals, dir) {
    // dir -1 = lowest wins, 1 = highest wins. Ties mark nothing — a tie is
    // not an advantage and a table full of gold says nothing at all.
    var live = vals.filter(function (v) { return v > 0; });
    if (live.length < 2) return -1;
    var target = dir < 0 ? Math.min.apply(null, live) : Math.max.apply(null, live);
    var hits = vals.filter(function (v) { return v === target; }).length;
    return hits === 1 ? vals.indexOf(target) : -1;
  }

  function buildTable() {
    var sel = picked.map(function (i) { return HOMES[i]; });
    var pm = sel.map(perMarla);
    var sq = sel.map(function (p) { return toSqft(p.area); });
    var days = sel.map(function (p) { return p.soldIn || 0; });
    var rupees = sel.map(function (p) { return toRupees(p.price); });

    var bestPm = best(pm, -1);           // cheapest land rate
    var bestSq = best(sq, 1);            // most house
    var bestDay = best(days, -1);        // fastest sale
    var bestTot = best(rupees, -1);      // smallest cheque

    /* Every feature either home has, so the ✓ / — column means something. */
    var allFeat = [];
    sel.forEach(function (p) {
      (p.features || []).forEach(function (f) { if (allFeat.indexOf(f) === -1) allFeat.push(f); });
    });

    function row(label, cells, winner, note) {
      return '<tr><th scope="row">' + esc(label) +
        (note ? '<em class="cmp-note">' + esc(note) + '</em>' : "") + '</th>' +
        cells.map(function (c, i) {
          return '<td' + (i === winner ? ' class="is-best"' : "") + '>' + c +
            (i === winner ? '<span class="cmp-badge">best</span>' : "") + '</td>';
        }).join("") + '</tr>';
    }

    var head = '<thead><tr><th scope="row" class="cmp-corner">' + sel.length + ' homes</th>' +
      sel.map(function (p, n) {
        var img = (cards[picked[n]] && cards[picked[n]].querySelector(".card__media img")) || null;
        return '<td class="cmp-head">' +
          '<img src="' + esc(img ? img.src : p.img) + '" alt="' + esc(p.title) + '" />' +
          '<strong>' + esc(p.title) + '</strong>' +
          '<span>' + esc(p.loc) + '</span></td>';
      }).join("") + '</tr></thead>';

    var body = "<tbody>" +
      row("Closed at", sel.map(function (p) { return "<b>" + esc(p.price) + "</b>"; }), bestTot, "smallest cheque") +
      row("Price per marla", pm.map(function (v) { return v ? money(v) : "—"; }), bestPm, "the true land rate") +
      row("Plot size", sel.map(function (p) { return esc(p.sizeLabel) + '<em class="cmp-sub">' + toMarla(p.sizeLabel) + " marla</em>"; }), -1) +
      row("Covered area", sel.map(function (p) { return esc(p.area); }), bestSq, "most house") +
      row("Bedrooms", sel.map(function (p) { return p.beds; }), best(sel.map(function (p) { return p.beds; }), 1)) +
      row("Bathrooms", sel.map(function (p) { return p.baths; }), -1) +
      row("Built / sold", sel.map(function (p) { return p.year; }), -1) +
      row("Days on market", days.map(function (d) { return d ? d + " days" : "—"; }), bestDay, "how fast it moved") +
      row("City", sel.map(function (p) { return p.city === "lahore" ? "Lahore" : "Islamabad"; }), -1) +
      '<tr class="cmp-split"><th scope="row" colspan="' + (sel.length + 1) + '">What each one has</th></tr>' +
      allFeat.map(function (f) {
        return row(f, sel.map(function (p) {
          return (p.features || []).indexOf(f) > -1
            ? '<span class="cmp-yes">✓</span>' : '<span class="cmp-no">—</span>';
        }), -1);
      }).join("") +
      '</tbody>';

    return head + body;
  }

  function open() {
    if (picked.length < 2) return;
    document.getElementById("cmpTable").innerHTML = buildTable();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    if (typeof lenis !== "undefined" && lenis) lenis.stop();
    var c = document.getElementById("cmpClose");
    if (c) c.focus();
  }
  function close() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (typeof lenis !== "undefined" && lenis) lenis.start();
  }

  document.getElementById("cmpClose").addEventListener("click", close);
  document.getElementById("cmpBackdrop").addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
  document.getElementById("cmpPrint").addEventListener("click", function () {
    document.documentElement.classList.add("cmp-printing-ready");
    window.print();
  });
  document.getElementById("cmpWa").addEventListener("click", function () {
    var lines = picked.map(function (i) {
      var p = HOMES[i];
      var v = perMarla(p);
      return "• " + p.title + " — " + p.loc + " · " + p.sizeLabel + " · " + p.price +
             (v ? " (" + money(v) + "/marla)" : "");
    });
    var msg = "Hello Adeel, I've compared these homes on your site and I'd like your read on which is the " +
              "better buy today — and whether you can find me something similar:\n\n" + lines.join("\n");
    if (window.LeadRelay && window.LeadRelay.send) window.LeadRelay.send(msg);
    else window.open("https://wa.me/16134083945?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });

  syncCards();
  renderTray();
})();

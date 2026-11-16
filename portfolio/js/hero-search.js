/* ============================================================
   HERO OMNI-SEARCH
   ------------------------------------------------------------
   Every portal a Pakistani buyer already uses — Zameen, Graana —
   and every top agent site in Toronto or Los Angeles opens the
   same way: one search bar, above the fold, before anything else.
   It is the first thing a visitor's eye looks for, and this site
   was making them scroll past nine sections to find the finder.

   So the finder moves up here. The visitor types where they want
   to live, picks a size and a budget, and the bar routes them to
   whichever part of this site actually answers that question:

     Buy / Rent → the property finder, chips already set
     Sell       → the valuation tool, their area already chosen
     Invest     → the market data panel, their area already loaded

   Nothing here is a dead end. If the typed place isn't one of the
   areas Adeel works, the search still lands somewhere useful and
   offers WhatsApp with the query written out.

   Vanilla JS, no dependencies, keyboard-complete (↑ ↓ Enter Esc).
   ============================================================ */
(function () {
  "use strict";

  var form = document.getElementById("heroSearch");
  if (!form) return;

  var input   = document.getElementById("hsWhere");
  var list    = document.getElementById("hsList");
  var sizeSel = document.getElementById("hsSize");
  var budSel  = document.getElementById("hsBudget");
  var goTxt   = document.getElementById("hsGoTxt");
  var whereLbl = document.getElementById("hsWhereLbl");
  var tabs    = Array.prototype.slice.call(form.querySelectorAll(".hsearch__tab"));

  var intent = "buy";
  var active = -1;      // highlighted suggestion
  var shown  = [];      // suggestions currently rendered

  /* ---------- the places, and what each one maps onto ----------
     The valuation tool and the market panel already speak the same area
     vocabulary (see VALDATA in main.js and AREAS in market.js), so one id
     per place drives both. `approx` is set where the nearest published
     series belongs to a neighbouring address rather than this one — the
     search says so out loud instead of quietly answering a different
     question.

     finder: the chip value in #finderArea · city: #finderCity            */
  var PLACES = [
    { label: "DHA Phase 1, Islamabad",    city: "islamabad", finder: "dha",     id: "dha1_isb",       hint: "Islamabad · 5 Marla – 2 Kanal" },
    { label: "DHA Phase 2, Islamabad",    city: "islamabad", finder: "dha",     id: "dha2_isb",       hint: "Islamabad · most liquid resale" },
    { label: "DHA Phase 5, Lahore",       city: "lahore",    finder: "dha",     id: "dha5_lhr",       hint: "Lahore · prime kanal belt" },
    { label: "DHA Phase 6, Lahore",       city: "lahore",    finder: "dha",     id: "dha6_lhr",       hint: "Lahore · new designer builds" },
    { label: "Bahria Town, Rawalpindi",   city: "islamabad", finder: "bahria",  id: "bahria_enc_isb", hint: "Rawalpindi · resort amenities", approx: "Bahria Enclave, Islamabad" },
    { label: "Bahria Enclave, Islamabad", city: "islamabad", finder: "bahria",  id: "bahria_enc_isb", hint: "Islamabad · hills, gated" },
    { label: "Bahria Town, Lahore",       city: "lahore",    finder: "bahria",  id: "bahria_lhr",     hint: "Lahore · family-first planning" },
    { label: "Bahria Orchard, Lahore",    city: "lahore",    finder: "bahria",  id: "bahria_lhr",     hint: "Lahore · entry-friendly", approx: "Bahria Town, Lahore" },
    { label: "Gulberg Greens, Islamabad", city: "islamabad", finder: "gulberg", id: "gulberg_isb",    hint: "Islamabad · farmhouse plots" },
    { label: "Gulberg III, Lahore",       city: "lahore",    finder: "gulberg", id: "gulberg3_lhr",   hint: "Lahore · heritage prestige" },
    { label: "F-7, Islamabad",            city: "islamabad", finder: "f7",      id: "f7f8_isb",       hint: "Islamabad · Margalla views" },
    { label: "F-8, Islamabad",            city: "islamabad", finder: "f7",      id: "f7f8_isb",       hint: "Islamabad · central sectors" },
    { label: "E-11, Islamabad",           city: "islamabad", finder: "e11",     id: "e11_isb",        hint: "Islamabad · apartments & houses" },
    { label: "B-17 Multi Gardens",        city: "islamabad", finder: "e11",     id: "b17_isb",        hint: "Islamabad · appreciation runway" },
    { label: "Model Town, Lahore",        city: "lahore",    finder: "model",   id: "modeltown_lhr",  hint: "Lahore · legacy kanal estates" },
    { label: "Lake City, Lahore",         city: "lahore",    finder: "model",   id: "lakecity_lhr",   hint: "Lahore · modern, entry rates" },
    { label: "Islamabad \u2014 anywhere",  city: "islamabad", finder: "any",     id: "dha2_isb",       hint: "Show me the whole capital", approx: "DHA Phase 2, Islamabad" },
    { label: "Lahore \u2014 anywhere",     city: "lahore",    finder: "any",     id: "dha5_lhr",       hint: "Show me the whole city", approx: "DHA Phase 5, Lahore" }
  ];

  /* Words people actually type that should still find the place. */
  var ALIAS = {
    "DHA Phase 1, Islamabad": "dha isb defence phase1 ph1",
    "DHA Phase 2, Islamabad": "dha isb defence phase2 ph2",
    "DHA Phase 5, Lahore": "dha lhr lahore defence phase5 ph5",
    "DHA Phase 6, Lahore": "dha lhr lahore defence phase6 ph6",
    "Bahria Town, Rawalpindi": "bahria pindi rawalpindi safari",
    "Bahria Enclave, Islamabad": "bahria enclave isb",
    "Bahria Town, Lahore": "bahria lhr lahore sector",
    "Bahria Orchard, Lahore": "bahria orchard lhr lahore",
    "Gulberg Greens, Islamabad": "gulberg greens isb farmhouse",
    "Gulberg III, Lahore": "gulberg 3 iii lhr lahore",
    "F-7, Islamabad": "f7 f-7 markaz isb margalla",
    "F-8, Islamabad": "f8 f-8 isb",
    "E-11, Islamabad": "e11 e-11 isb multi gardens",
    "B-17 Multi Gardens": "b17 b-17 multi gardens isb",
    "Model Town, Lahore": "model town lhr lahore colonial",
    "Lake City, Lahore": "lake city lhr lahore raiwind",
    "Islamabad — anywhere": "islamabad isb capital anywhere any",
    "Lahore — anywhere": "lahore lhr anywhere any"
  };

  var SIZE_TO_FINDER = { any: "any", "5-marla": "5marla", "10-marla": "10marla", kanal: "1kanal" };
  var SIZE_TO_VAL    = { any: "10m", "5-marla": "5m", "10-marla": "10m", kanal: "1k" };
  var SIZE_WORD      = { any: "any size", "5-marla": "5 Marla", "10-marla": "10 Marla", kanal: "1 Kanal or larger" };
  var BUDGET_WORD    = { any: "", "0-3": " under PKR 3 Crore", "3-6": " between PKR 3 and 6 Crore",
                         "6-12": " between PKR 6 and 12 Crore", "12-99": " above PKR 12 Crore" };

  /* ---------- helpers ---------- */
  function esc(t) { var d = document.createElement("div"); d.textContent = t == null ? "" : t; return d.innerHTML; }

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    if (typeof lenis !== "undefined" && lenis) lenis.scrollTo(el, { offset: -70 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
    return el;
  }

  /* A short gold pulse on whatever the search just answered with, so the
     visitor's eye lands on the thing that changed rather than hunting. */
  function flash(el) {
    if (!el) return;
    el.classList.remove("hsearch-landed");
    void el.offsetWidth;
    el.classList.add("hsearch-landed");
    setTimeout(function () { el.classList.remove("hsearch-landed"); }, 2200);
  }

  function clickChip(groupId, val) {
    var wrap = document.getElementById(groupId);
    if (!wrap) return;
    var chip = wrap.querySelector('[data-val="' + val + '"]');
    if (chip && !chip.classList.contains("is-active")) chip.click();
  }

  function setSelect(id, value) {
    var s = document.getElementById(id);
    if (!s) return;
    var ok = Array.prototype.some.call(s.options, function (o) { return o.value === value; });
    if (!ok) return;
    s.value = value;
    s.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function whatsapp(msg) {
    if (window.LeadRelay && window.LeadRelay.send) window.LeadRelay.send(msg);
    else window.open("https://wa.me/16134083945?text=" + encodeURIComponent(msg), "_blank", "noopener");
  }

  /* ---------- matching ---------- */
  function match(q) {
    q = (q || "").trim().toLowerCase();
    if (!q) return PLACES.slice(0, 6);
    var terms = q.split(/[\s,]+/).filter(Boolean);
    return PLACES.map(function (p) {
      var hay = (p.label + " " + (ALIAS[p.label] || "")).toLowerCase();
      var score = 0;
      for (var i = 0; i < terms.length; i++) {
        var at = hay.indexOf(terms[i]);
        if (at === -1) return null;
        score += at === 0 ? 3 : 1;                       // prefix beats mid-word
        if (p.label.toLowerCase().indexOf(terms[i]) === 0) score += 2;
      }
      return { p: p, score: score };
    }).filter(Boolean)
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 6)
      .map(function (r) { return r.p; });
  }

  function render(q) {
    shown = match(q);
    active = -1;
    if (!shown.length) { hide(); return; }
    list.innerHTML = shown.map(function (p, i) {
      return '<li role="option" id="hsOpt' + i + '" aria-selected="false" data-i="' + i + '">' +
             '<span class="hsearch__pin" aria-hidden="true">◈</span>' +
             '<span class="hsearch__opt"><strong>' + esc(p.label) + '</strong>' +
             '<em>' + esc(p.hint) + '</em></span></li>';
    }).join("");
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function hide() {
    list.hidden = true;
    list.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    active = -1;
  }

  function highlight(i) {
    var items = list.querySelectorAll("li");
    if (!items.length) return;
    if (i < 0) i = items.length - 1;
    if (i >= items.length) i = 0;
    active = i;
    for (var n = 0; n < items.length; n++) {
      var on = n === i;
      items[n].classList.toggle("is-on", on);
      items[n].setAttribute("aria-selected", on ? "true" : "false");
    }
    input.setAttribute("aria-activedescendant", "hsOpt" + i);
    items[i].scrollIntoView({ block: "nearest" });
  }

  /* ---------- the four destinations ---------- */

  /* The market panel publishes a per-marla series for most, but not all, of
     the areas the finder covers. Saying "no series for Gulberg Greens yet"
     is worth more than silently loading somebody else's chart. */
  function marketTab(id) {
    var host = document.getElementById("mktAreas");
    return host ? host.querySelector('[data-area="' + id + '"]') : null;
  }

  function go(place) {
    var size = sizeSel.value;
    var bud  = budSel.value;
    var typed = input.value.trim();
    var where = place ? place.label : typed;

    if (intent === "sell") {
      var vs = scrollToId("valuation");
      if (place) {
        setSelect("valCity", place.city === "lahore" ? "lhr" : "isb");
        setSelect("valArea", place.id);
      }
      setSelect("valSize", SIZE_TO_VAL[size] || "10m");
      flash(document.querySelector(".valuation__tool") || vs);
      if (place && place.approx) {
        note(".valuation__tool",
             "The nearest range I publish for " + place.label + " is " + place.approx +
             " — close, but your street is worth its own number.",
             "Get the exact figure",
             function () {
               whatsapp("Hello Adeel, I'd like a precise valuation for my " + (SIZE_WORD[size] || "home") +
                        " in " + place.label + ".");
             });
      } else if (!place && typed) {
        note(".valuation__tool",
             "I don't publish a range for \u201c" + typed + "\u201d yet — send it over and I'll value it properly.",
             "Value " + typed,
             function () { whatsapp("Hello Adeel, I'd like a valuation for my property in " + typed + "."); });
      }
      return;
    }

    if (intent === "invest") {
      var ms = scrollToId("market");
      var tab = place ? marketTab(place.id) : null;
      if (tab) {
        // The panel is built by market.js on its own boot; give it a beat.
        setTimeout(function () { tab.click(); }, 350);
      }
      flash(document.querySelector(".market__panel") || ms);
      if (place && !tab) {
        note(".market__panel",
             "I don't publish a per-marla series for " + place.label + " yet — the chart above is the " +
             "closest area I do. Ask me and I'll pull the comparables by hand.",
             "Get the " + place.label + " brief",
             function () {
               whatsapp("Hello Adeel, could you send me your market read on " + place.label +
                        " — per-marla rates, where they've moved, and whether now is the time?");
             });
      } else if (!place && typed) {
        note(".market__panel",
             "\u201c" + typed + "\u201d isn't one of the areas I track here. I'll still pull its numbers for you.",
             "Ask about " + typed,
             function () {
               whatsapp("Hello Adeel, could you send me your market read on " + typed + "?");
             });
      }
      return;
    }

    /* Buy and Rent both land on the finder with every chip already set. */
    var fs = scrollToId("finder");
    clickChip("finderPurpose", intent === "rent" ? "rent" : "buy");
    if (place) {
      clickChip("finderCity", place.city);
      clickChip("finderArea", place.finder);
    }
    clickChip("finderSize", SIZE_TO_FINDER[size] || "any");
    flash(document.querySelector(".finder__card") || fs);

    /* A budget, or a place with no chip of its own, is exactly the part only
       Adeel can answer — so hand over the message already written. */
    var verb = intent === "rent" ? "rent" : "buy";
    if (!place && typed) {
      note(".finder__card",
           "\u201c" + typed + "\u201d isn't one of my preset areas — send it to me and I'll search it by hand.",
           "Ask about " + typed,
           function () {
             whatsapp("Hello Adeel, I'm looking to " + verb + " a " + (SIZE_WORD[size] || "home") +
                      " in " + typed + BUDGET_WORD[bud] + ". What do you have?");
           });
    } else if (bud !== "any") {
      note(".finder__card",
           "Chips set for " + (where || "your search") + ". Budget isn't a filter here — send it over and " +
           "I'll match it against off-market stock too.",
           "Send my brief",
           function () {
             whatsapp("Hello Adeel, I'm looking to " + verb + " a " + (SIZE_WORD[size] || "home") +
                      " in " + (where || "Islamabad or Lahore") + BUDGET_WORD[bud] +
                      ". Could you share what's available, including off-market?");
           });
    } else {
      var stale = document.getElementById("hsNote");
      if (stale) stale.remove();
    }
  }

  /* One note at a time, wherever the search just landed — never a stack of
     them, and never left behind on a section the visitor has moved on from. */
  function note(hostSel, text, cta, fn) {
    var old = document.getElementById("hsNote");
    if (old) old.remove();
    var host = document.querySelector(hostSel);
    if (!host) return;
    var el = document.createElement("p");
    el.id = "hsNote";
    el.className = "hsearch__note";
    var span = document.createElement("span");
    span.textContent = text;
    el.appendChild(span);
    if (cta && fn) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "hsearch__note-cta";
      b.textContent = cta;
      b.addEventListener("click", fn);
      el.appendChild(b);
    }
    host.appendChild(el);
  }

  /* ---------- wiring ---------- */
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      intent = t.dataset.intent;
      tabs.forEach(function (o) {
        var on = o === t;
        o.classList.toggle("is-active", on);
        o.setAttribute("aria-pressed", on ? "true" : "false");
      });
      form.dataset.intent = intent;
      goTxt.textContent = intent === "sell" ? "Value my home"
                        : intent === "invest" ? "See the numbers"
                        : "Search";
      whereLbl.textContent = intent === "sell" ? "Where's your home?" : "Where";
      input.placeholder = intent === "sell"
        ? "The area your property is in…"
        : intent === "invest"
          ? "An area you're thinking of putting money into…"
          : "DHA Phase 2, Bahria, F-7, Gulberg…";
    });
  });

  input.addEventListener("input", function () { render(input.value); });
  input.addEventListener("focus", function () { render(input.value); });

  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); if (list.hidden) render(input.value); highlight(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); highlight(active - 1); }
    else if (e.key === "Escape") { hide(); }
    else if (e.key === "Enter" && active > -1) {
      e.preventDefault();
      input.value = shown[active].label;
      var chosen = shown[active];
      hide();
      go(chosen);
    }
  });

  list.addEventListener("mousedown", function (e) {
    // mousedown, not click: blur would close the list first
    var li = e.target.closest("li[data-i]");
    if (!li) return;
    e.preventDefault();
    var p = shown[+li.dataset.i];
    input.value = p.label;
    hide();
    go(p);
  });

  document.addEventListener("click", function (e) {
    if (!form.contains(e.target)) hide();
  });

  form.querySelectorAll("[data-quick]").forEach(function (b) {
    b.addEventListener("click", function () {
      input.value = b.dataset.quick;
      hide();
      var hit = match(b.dataset.quick)[0] || null;
      go(hit);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hide();
    var hit = active > -1 ? shown[active] : match(input.value)[0] || null;
    // An empty box with a place typed nowhere still has an intent worth serving.
    go(input.value.trim() ? hit : null);
  });
})();

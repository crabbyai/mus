/* ============================================================
   QUICK JUMP — one keystroke to anywhere on the site
   ------------------------------------------------------------
   There are thirty-odd destinations now, spread over five pages,
   and the menu is a list you have to read. Someone who already
   knows they want the instalment planner shouldn't have to hunt
   for it, and someone who half-remembers "that thing with the
   sun" should be able to find it by typing "sun".

   ⌘K, Ctrl-K or / opens it. Type, arrow, enter. Entries carry
   the words people actually use — "marla", "tax", "kanal",
   "commission" — not just their headings, so the search finds
   things by what they're for rather than what they're called.

   It works the same on the tool pages, where a hit on a main
   page section becomes a normal navigation rather than a scroll.
   ============================================================ */
(function () {
  "use strict";

  /* keys are the searchable synonyms — what someone would type, not the
     heading. "What's my house worth" is looked for as "valuation", "price",
     "worth", "free". */
  var ITEMS = [
    { t: "Which way does it face?", s: "Sun study · plot orientation", u: "sun-study.html",
      k: "sun orientation east west facing shade lawn shadow marla kanal plot daylight" },
    { t: "Instalment planner", s: "Society payment plans", u: "payment-plan.html",
      k: "instalment installment payment plan down payment quarterly possession bahria dha schedule" },
    { t: "What it costs to transfer", s: "Taxes, stamp duty & fees", u: "transfer-costs.html",
      k: "tax transfer cost stamp duty cvt registration 236k 236c filer non-filer capital gains commission fbr" },
    { t: "All tools", s: "Every calculator in one place", u: "tools.html",
      k: "tools calculators utilities" },

    { t: "Live listings", s: "What's on the market now", u: "index.html#marketwatch",
      k: "listings available market watch for sale current stock" },
    { t: "About Adeel", s: "Who you're dealing with", u: "index.html#about",
      k: "about bio who adeel rahman mba story" },
    { t: "Credentials", s: "MBA, track record", u: "index.html#credentials",
      k: "credentials mba carleton qualifications experience track record" },
    { t: "Services", s: "Buying, selling, overseas", u: "index.html#services",
      k: "services buy sell rent overseas power of attorney poa management" },
    { t: "Finance calculator", s: "Instalments on a bank facility", u: "index.html#tools",
      k: "calculator emi mortgage loan finance bank instalment interest markup" },
    { t: "Free valuation", s: "What is mine worth?", u: "index.html#valuation",
      k: "valuation value worth price my house appraisal free estimate" },
    { t: "How I work", s: "The process, step by step", u: "index.html#process",
      k: "process how it works steps timeline what happens commission fee" },
    { t: "Compare areas", s: "Side by side", u: "index.html#compare",
      k: "compare comparison versus areas side by side" },
    { t: "Find a home", s: "Tell me what you want", u: "index.html#finder",
      k: "finder find search requirement wishlist brief" },
    { t: "Featured listing", s: "This month's pick", u: "index.html#featured",
      k: "featured spotlight highlight pick of the month" },
    { t: "Sold portfolio", s: "120+ closed homes", u: "index.html#portfolio",
      k: "sold portfolio closed past deals track record homes gallery" },
    { t: "Build one like this", s: "Design studio", u: "index.html#likethis",
      k: "build design studio configure house custom architect elevation model 3d" },
    { t: "Neighbourhood guides", s: "DHA, Bahria, Gulberg…", u: "index.html#areas",
      k: "areas guides neighbourhood dha bahria gulberg model town f-7 b-17 emerging" },
    { t: "Budget matcher", s: "What your money reaches", u: "index.html#budget",
      k: "budget afford affordability what can i buy money range crore lac" },
    { t: "Market data", s: "Six years of prices", u: "index.html#market",
      k: "market data prices trend per marla appreciation yield chart history" },
    { t: "The city in 3D", s: "Islamabad & Lahore by sector", u: "index.html#city3d",
      k: "3d city map sector islamabad lahore price per marla model explore" },
    { t: "Where I work", s: "Coverage map", u: "index.html#map",
      k: "map coverage where areas served location" },
    { t: "Insights", s: "Notes on the market", u: "index.html#insights",
      k: "insights blog articles notes analysis writing" },
    { t: "Community", s: "Questions & answers", u: "index.html#forum",
      k: "community forum questions answers ask discussion reddit" },
    { t: "Guides", s: "How-to for buyers & sellers", u: "index.html#guides",
      k: "guides how to advice buyer seller checklist overseas" },
    { t: "FAQ", s: "Common questions", u: "index.html#faq",
      k: "faq questions common answers help" },
    { t: "Book a call", s: "Pick a time", u: "index.html#book",
      k: "book call appointment meeting schedule time consultation" },
    { t: "Work with me", s: "Get in touch", u: "index.html#contact",
      k: "contact work with me hire get in touch whatsapp call email reach" }
  ];

  var el = {}, open = false, results = [], active = 0, lastFocus = null;

  function build() {
    var wrap = document.createElement("div");
    wrap.className = "qj";
    wrap.id = "quickJump";
    wrap.hidden = true;
    wrap.innerHTML =
      '<div class="qj__backdrop" data-qj-close></div>' +
      '<div class="qj__panel" role="dialog" aria-modal="true" aria-labelledby="qjLabel">' +
        '<label class="qj__label" id="qjLabel" for="qjInput">Jump to anything on the site</label>' +
        '<input class="qj__input" id="qjInput" type="text" autocomplete="off" spellcheck="false" ' +
          'placeholder="Try “tax”, “marla”, “sun”, “valuation”…" ' +
          'role="combobox" aria-expanded="true" aria-controls="qjList" aria-autocomplete="list" />' +
        '<ul class="qj__list" id="qjList" role="listbox" aria-label="Results"></ul>' +
        '<p class="qj__hint"><kbd>↑</kbd><kbd>↓</kbd> to move · <kbd>Enter</kbd> to go · <kbd>Esc</kbd> to close</p>' +
      "</div>";
    document.body.appendChild(wrap);
    el.wrap = wrap;
    el.input = wrap.querySelector("#qjInput");
    el.list = wrap.querySelector("#qjList");

    wrap.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-qj-close")) close();
    });
    el.input.addEventListener("input", function () { search(el.input.value); });
    el.input.addEventListener("keydown", key);
  }

  /* Word-start hits outrank hits buried mid-word, and the title outranks the
     synonyms, so typing "tax" puts the transfer-cost page first rather than
     whatever happens to mention tax. */
  function score(item, q) {
    var t = item.t.toLowerCase(), s = (item.s || "").toLowerCase(), k = item.k;
    if (t === q) return 1000;
    var n = 0;
    if (t.indexOf(q) === 0) n += 500;
    else if (t.indexOf(q) > 0) n += 200;
    if (new RegExp("\\b" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(k)) n += 120;
    else if (k.indexOf(q) >= 0) n += 60;
    if (s.indexOf(q) >= 0) n += 40;
    return n;
  }

  function search(raw) {
    var q = (raw || "").trim().toLowerCase();
    if (!q) {
      results = ITEMS.slice(0, 6);
    } else {
      results = ITEMS.map(function (i) { return { i: i, n: score(i, q) }; })
        .filter(function (r) { return r.n > 0; })
        .sort(function (a, b) { return b.n - a.n; })
        .slice(0, 8)
        .map(function (r) { return r.i; });
    }
    active = 0;
    paint();
  }

  function paint() {
    if (!results.length) {
      el.list.innerHTML = '<li class="qj__none">Nothing matches that. Try “tax”, “sold”, “3d”.</li>';
      el.input.setAttribute("aria-activedescendant", "");
      return;
    }
    el.list.innerHTML = results.map(function (r, i) {
      return '<li class="qj__item' + (i === active ? " is-active" : "") + '" role="option" ' +
        'id="qjOpt' + i + '" aria-selected="' + (i === active) + '" data-i="' + i + '">' +
        "<strong>" + r.t + "</strong><span>" + (r.s || "") + "</span></li>";
    }).join("");
    el.input.setAttribute("aria-activedescendant", "qjOpt" + active);
    el.list.querySelectorAll("[data-i]").forEach(function (li) {
      li.addEventListener("click", function () { go(results[+li.getAttribute("data-i")]); });
      li.addEventListener("mousemove", function () {
        var i = +li.getAttribute("data-i");
        if (i !== active) { active = i; paint(); }
      });
    });
    var on = el.list.querySelector(".is-active");
    if (on && on.scrollIntoView) on.scrollIntoView({ block: "nearest" });
  }

  function key(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); active = (active + 1) % results.length; paint(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); active = (active - 1 + results.length) % results.length; paint(); }
    else if (e.key === "Enter") { e.preventDefault(); if (results[active]) go(results[active]); }
    else if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "Tab") {
      // the panel is the only thing on screen; keep focus inside it
      e.preventDefault();
    }
  }

  /* A hash on the page we're already on is a scroll; anything else is a
     navigation. Working that out here means the same index serves every page. */
  function go(item) {
    var here = location.pathname.replace(/\/$/, "").split("/").pop() || "index.html";
    var parts = item.u.split("#");
    var page = parts[0], hash = parts[1];
    close();
    if (page === here && hash) {
      var target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", "#" + hash);
        return;
      }
    }
    location.href = item.u;
  }

  function show() {
    if (open) return;
    if (!el.wrap) build();
    lastFocus = document.activeElement;
    open = true;
    el.wrap.hidden = false;
    requestAnimationFrame(function () { el.wrap.classList.add("is-open"); });
    el.input.value = "";
    search("");
    el.input.focus();
    document.documentElement.style.overflow = "hidden";
  }

  function close() {
    if (!open) return;
    open = false;
    el.wrap.classList.remove("is-open");
    document.documentElement.style.overflow = "";
    setTimeout(function () { if (!open) el.wrap.hidden = true; }, 220);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function typing(t) {
    return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" ||
                 t.isContentEditable);
  }

  document.addEventListener("keydown", function (e) {
    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open ? close() : show();
      return;
    }
    // "/" is the other convention, but not while someone is filling in a field
    if (e.key === "/" && !open && !typing(e.target)) { e.preventDefault(); show(); }
  });

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-quickjump]");
    if (trigger) { e.preventDefault(); show(); }
  });

  window.QuickJump = { open: show, close: close };
})();

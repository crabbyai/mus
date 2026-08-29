/* ============================================================
   اردو — the translation engine
   ------------------------------------------------------------
   A large part of the buying and almost all of the selling in
   this market is done by people who read Urdu first. Making
   them work in English to find out what their own house is
   worth is the sort of friction that quietly costs listings.

   How it works
   ------------
   The dictionary in data/ur.json is keyed on the *whole visible
   text of a block* — a paragraph, a heading, a button — never on
   individual words or on the fragments an inline <strong> splits
   a sentence into. That matters: Urdu is verb-final and reads
   right to left, so a sentence translated piece by piece comes
   out as rubble. One block in, one block out, and the emphasis
   is re-applied inside the Urdu rather than mapped onto it.

   Because the key is the element's own text, the pass is
   idempotent — once a block is Urdu it no longer matches an
   English key — and self-healing: any script on this site that
   re-renders a card, a chart panel or a lightbox writes English
   back into the DOM, a MutationObserver notices, and that block
   alone is translated again. Nothing needs to know this file
   exists.

   Everything is restorable. The English innerHTML is parked on
   the element before it is overwritten, so switching back is a
   restore rather than a reverse-translation.

   Vanilla JS. No dependencies. Choice persists in localStorage.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "ar_lang_v1";        // "ur" | "en"
  var ASKED = "ar_lang_asked_v1";
  var DICT = null;
  var loading = null;
  var on = false;
  var busy = false;
  var observer = null;
  var pending = 0;

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Blocks worth translating. Anything not in here (a <section>, a wrapper
     <div> with children) is a container, and containers are walked into,
     not replaced. */
  var SEL = "p,h1,h2,h3,h4,h5,h6,li,button,a,td,th,cite,figcaption,label," +
            "option,small,blockquote,summary,dt,dd,span,strong,em,div,time,b,i";

  /* The language furniture itself is never translated — the switch has to
     keep saying "English / اردو" in both directions, or you cannot get back. */
  var EXEMPT = ".langswitch,.langorb,.langgate,.langveil,script,style,canvas,svg,code,pre";

  var ATTRS = ["placeholder", "aria-label", "title", "alt"];

  function norm(s) { return (s || "").replace(/\s+/g, " ").trim(); }

  /* ============================================================
     DICTIONARY
     ============================================================ */
  function load() {
    if (DICT) return Promise.resolve(DICT);
    if (loading) return loading;
    loading = fetch("data/ur.json", { cache: "force-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { DICT = j; return j; })
      .catch(function () { loading = null; return null; });
    return loading;
  }

  /* ============================================================
     THE PASS
     ============================================================ */
  /* Inline decoration — <strong>, <em>, a link — does NOT stop its parent
     being translated as one unit. That is the whole point: the emphasis is
     rewritten inside the Urdu sentence, not mapped onto English word order. */
  var INLINE = /^(SPAN|STRONG|EM|B|I|U|SMALL|CITE|ABBR|TIME|SUP|SUB|MARK|BR|A|WBR|S|Q|VAR|SAMP|KBD)$/;
  var CONTROL = /^(SELECT|INPUT|TEXTAREA|IFRAME|VIDEO|AUDIO|CANVAS|SVG|IMG)$/;

  /* Elements another script owns the innards of. Replacing one of these
     wholesale destroys the hooks that script re-renders through — the
     presence line's [data-presence-text] span is rewritten every minute by
     convert.js, and if the translation pass wins the race against the first
     paint the span is gone and the line freezes on its fallback forever.
     Walk into them; never replace them. */
  var OWNED = "[data-presence]";

  function leafKind(el) {
    if (el.matches && el.matches(OWNED)) return "container";
    var kids = el.children;
    for (var i = 0; i < kids.length; i++) {
      var tag = kids[i].tagName;
      if (CONTROL.test(tag)) return "control";        // a label wrapped round a <select>
      if (!INLINE.test(tag) && norm(kids[i].textContent)) return "container";
    }
    return "leaf";
  }

  /* A <label>Area <select>…</select></label> cannot have its innerHTML
     replaced — the control would go with it. Its own loose words are
     translated in place instead. */
  function translateOwnText(el) {
    var frags = DICT.frags || {};
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType !== 3) continue;
      var v = norm(n.nodeValue);
      if (!v) continue;
      var ur = frags[v];
      if (!ur) continue;
      if (typeof n.__urEn !== "string") n.__urEn = n.nodeValue;
      n.nodeValue = n.nodeValue.replace(v, ur);
      el.setAttribute("data-ur-f", "1");
    }
  }

  function translateAttrs(el) {
    var map = DICT.attrs;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (!el.hasAttribute(a)) continue;
      var v = norm(el.getAttribute(a));
      var ur = map[v];
      if (!ur) continue;
      if (!el.__urAttr) el.__urAttr = {};
      el.__urAttr[a] = el.getAttribute(a);
      el.setAttribute(a, ur);
      el.setAttribute("data-ur-a", "1");
    }
  }

  /* Some strings are assembled at run time around a number that changes —
     "18 options · 13 comfortably in reach", "Send me the DHA Phase 2 brief".
     Enumerating every value would be absurd, so the dictionary may carry
     regex rules alongside its literal keys. Compiled once, tried only when
     the literal lookup misses. */
  var RULES = null;
  function byPattern(key) {
    if (RULES === null) {
      RULES = (DICT.patterns || []).map(function (r) {
        try { return [new RegExp(r[0]), r[1]]; } catch (e) { return null; }
      }).filter(Boolean);
    }
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(key)) return key.replace(RULES[i][0], RULES[i][1]);
    }
    return null;
  }

  var ATTR_SEL = "[placeholder],[aria-label],[title],[alt]";

  function pass(root) {
    if (!DICT) return;
    var scope = root && root.querySelectorAll ? root : document.body;

    /* Attributes get their own sweep. An <input>'s placeholder, an <img>'s alt
       and an icon button's aria-label all live on elements that never match
       the block selector, so folding this into the loop below silently left
       every form field in English. */
    var withAttrs = scope.querySelectorAll(ATTR_SEL);
    for (var a = 0; a < withAttrs.length; a++) {
      if (withAttrs[a].closest(EXEMPT)) continue;
      translateAttrs(withAttrs[a]);
    }

    var els = scope.querySelectorAll(SEL);
    var blocks = DICT.blocks;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.closest(EXEMPT)) continue;
      var kind = leafKind(el);
      if (kind === "control") { translateOwnText(el); continue; }
      if (kind === "container") continue;
      var key = norm(el.textContent);
      if (!key) continue;
      var ur = blocks[key];
      if (!ur) ur = byPattern(key);
      if (!ur) {
        /* No translation for the block as a whole — but a block like
           <span>Price <strong>PKR 1.2 Cr</strong></span> is a label wrapped
           round a live figure. The figure is its own element and gets picked
           up on its own; the loose label beside it is handled here. */
        translateOwnText(el);
        continue;
      }
      // Re-stored every time, so a block a script has just re-rendered in
      // English can never restore to a stale copy of something older.
      el.__urEn = el.innerHTML;
      el.innerHTML = ur;
      el.setAttribute("data-ur-t", "1");
    }
  }

  function restore() {
    var els = document.querySelectorAll("[data-ur-t]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (typeof el.__urEn === "string") el.innerHTML = el.__urEn;
      el.removeAttribute("data-ur-t");
    }
    var fs = document.querySelectorAll("[data-ur-f]");
    for (var f = 0; f < fs.length; f++) {
      for (var n = fs[f].firstChild; n; n = n.nextSibling) {
        if (n.nodeType === 3 && typeof n.__urEn === "string") { n.nodeValue = n.__urEn; delete n.__urEn; }
      }
      fs[f].removeAttribute("data-ur-f");
    }
    var as = document.querySelectorAll("[data-ur-a]");
    for (var j = 0; j < as.length; j++) {
      var e = as[j];
      if (e.__urAttr) {
        for (var a in e.__urAttr) if (e.__urAttr.hasOwnProperty(a)) e.setAttribute(a, e.__urAttr[a]);
        delete e.__urAttr;
      }
      e.removeAttribute("data-ur-a");
    }
  }

  /* ============================================================
     KEEPING UP WITH THE REST OF THE SITE
     ------------------------------------------------------------
     A dozen scripts on this page rewrite their own sections —
     the market panel, the spotlight slider, the live feed, the
     lightbox, the comparison table. They all write English. The
     observer catches that and re-runs the pass over what moved.
     ============================================================ */
  function watch() {
    if (observer || typeof MutationObserver === "undefined") return;
    observer = new MutationObserver(function (records) {
      if (busy || !on) return;
      var touched = false;
      for (var i = 0; i < records.length; i++) {
        var t = records[i].target;
        if (t && t.closest && t.closest(EXEMPT)) continue;
        touched = true;
        break;
      }
      if (!touched) return;
      if (pending) return;
      pending = requestAnimationFrame(function () {
        pending = 0;
        if (!on) return;
        busy = true;
        try { pass(document.body); } finally { busy = false; }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  /* ============================================================
     APPLY
     ============================================================ */
  function apply(next) {
    var html = document.documentElement;
    busy = true;
    try {
      if (next) {
        html.classList.add("ur");
        html.setAttribute("lang", "ur");
        html.setAttribute("dir", "rtl");
        pass(document.body);
        if (DICT.meta && DICT.meta.title) {
          if (!document.__urTitle) document.__urTitle = document.title;
          document.title = DICT.meta.title;
        }
        watch();
      } else {
        restore();
        html.classList.remove("ur");
        html.setAttribute("lang", "en");
        html.setAttribute("dir", "ltr");
        if (document.__urTitle) document.title = document.__urTitle;
      }
    } finally { busy = false; }
    on = next;
    try { localStorage.setItem(KEY, next ? "ur" : "en"); } catch (e) {}
    syncControls();
    // Pinned scroll animations measure the page; Urdu changes every height.
    if (window.ScrollTrigger && window.ScrollTrigger.refresh) {
      setTimeout(function () { window.ScrollTrigger.refresh(); }, 60);
    }
  }

  /* ============================================================
     THE TRANSITION
     ============================================================ */
  var veil = null;
  function buildVeil() {
    if (veil) return veil;
    veil = document.createElement("div");
    veil.className = "langveil";
    veil.setAttribute("aria-hidden", "true");
    var sparks = "";
    for (var i = 0; i < 14; i++) {
      var left = Math.round(4 + Math.random() * 92);
      var delay = (0.25 + Math.random() * 0.5).toFixed(2);
      var dur = (0.9 + Math.random() * 0.5).toFixed(2);
      sparks += '<i style="left:' + left + '%;animation-delay:' + delay + 's;animation-duration:' + dur + 's"></i>';
    }
    veil.innerHTML =
      '<div class="langveil__sheet"></div>' +
      '<div class="langveil__spark">' + sparks + '</div>' +
      '<div class="langveil__glyph" id="langVeilGlyph">اردو</div>' +
      '<div class="langveil__rule"></div>';
    document.body.appendChild(veil);
    return veil;
  }

  function run(next) {
    if (REDUCED) { apply(next); return; }
    var v = buildVeil();
    var glyph = document.getElementById("langVeilGlyph");
    glyph.textContent = next ? "اردو" : "English";
    v.classList.toggle("to-en", !next);
    v.classList.remove("is-run");
    void v.offsetWidth;
    v.classList.add("is-run");

    // Swapped while the sheet has the screen covered — the reader sees the
    // new language arrive, never the rewrite happening.
    setTimeout(function () { apply(next); }, 460);

    var sheet = v.querySelector(".langveil__sheet");
    var done = function () {
      v.classList.remove("is-run");
      sheet.removeEventListener("animationend", done);
    };
    sheet.addEventListener("animationend", done);
    setTimeout(done, 1600);       // belt and braces if the event is missed
  }

  function set(next) {
    if (next === on) return;
    if (next) {
      load().then(function (d) {
        if (!d) { toast("Urdu could not be loaded — please try again."); return; }
        run(true);
      });
    } else run(false);
  }

  function toast(m) { if (window.toast) window.toast(m); }

  /* ============================================================
     CONTROLS — the switch, the orb, the invitation
     ============================================================ */
  /* Three sizes of the same control:

       hero — the large one, under the search bar, where nobody can miss it
       nav  — compact, so it can ride along without crushing the logo
       menu — full width at the head of the mobile menu

     All three are the same switch and stay in sync; only the labels and the
     scale differ. */
  function makeSwitch(size) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "langswitch langswitch--" + size;
    b.setAttribute("role", "switch");
    b.setAttribute("aria-checked", "false");
    b.setAttribute("aria-label", "Switch the site to Urdu — سائٹ کو اردو میں دیکھیں");
    var en = size === "nav" ? "EN" : "English";
    b.innerHTML =
      '<span class="langswitch__thumb" aria-hidden="true"></span>' +
      '<span class="langswitch__opt langswitch__opt--en">' + en + '</span>' +
      '<span class="langswitch__opt langswitch__opt--ur" lang="ur">اردو</span>';
    b.addEventListener("click", function () { set(!on); });
    return b;
  }

  /* The hero switch gets a line of copy either side of it, in both languages,
     so the offer is legible to a reader of either one. */
  function makeHeroSwitch() {
    var wrap = document.createElement("div");
    wrap.className = "langhero";
    var lead = document.createElement("p");
    lead.className = "langhero__lead";
    lead.innerHTML = '<span class="langhero__ur" lang="ur">پوری سائٹ اردو میں پڑھیں</span>' +
                     '<span class="langhero__en">Read this entire site in Urdu — every page, price and tool</span>';
    wrap.appendChild(lead);
    wrap.appendChild(makeSwitch("hero"));
    return wrap;
  }

  function syncControls() {
    document.querySelectorAll(".langswitch").forEach(function (b) {
      b.setAttribute("aria-checked", on ? "true" : "false");

      b.setAttribute("aria-label", on
        ? "Switch the site back to English"
        : "Switch the site to Urdu — سائٹ کو اردو میں دیکھیں");
    });
    /* The invitation is always the language you are NOT in, said in that
       language first — otherwise an Urdu reader is being offered Urdu. */
    var lead = document.querySelector(".langhero__lead");
    if (lead) {
      lead.classList.toggle("is-ur", on);
      var lu = lead.querySelector(".langhero__ur");
      var le = lead.querySelector(".langhero__en");
      if (on) {
        lu.textContent = "یہ سائٹ اِس وقت مکمل اردو میں ہے";
        le.textContent = "Read this site in English";
      } else {
        lu.textContent = "پوری سائٹ اردو میں پڑھیں";
        le.textContent = "Read this entire site in Urdu — every page, price and tool";
      }
    }

    var orb = document.getElementById("langOrb");
    if (orb) {
      orb.querySelector(".langorb__glyph").textContent = on ? "EN" : "اردو";
      orb.querySelector(".langorb__label").textContent = on
        ? "Read in English" : "یہ سائٹ اردو میں پڑھیں";
      orb.setAttribute("aria-label", on ? "Switch the site back to English" : "سائٹ کو اردو میں دیکھیں");
    }
  }

  function mountControls() {
    // 1 · the large one, in the hero, directly under the search bar
    var hero = document.getElementById("heroSearch");
    if (hero && hero.parentNode) hero.parentNode.insertBefore(makeHeroSwitch(), hero.nextSibling);

    // 2 · the compact one in the nav, next to the saved-homes heart. The tool
    //     pages carry a slimmer nav with no heart, so fall back to the end.
    var nav = document.getElementById("nav") || document.querySelector(".nav");
    if (nav) {
      var fav = document.getElementById("navFav");
      var burger = document.getElementById("navBurger");
      var before = fav || burger || null;
      if (before) nav.insertBefore(makeSwitch("nav"), before);
      else nav.appendChild(makeSwitch("nav"));
    }

    // 3 · full width at the head of the mobile menu
    var menu = document.getElementById("mobileMenu");
    if (menu) menu.insertBefore(makeSwitch("menu"), menu.firstChild);

    // 4 · the orb, which follows you the whole way down
    var orb = document.createElement("button");
    orb.type = "button";
    orb.id = "langOrb";
    orb.className = "langorb";
    orb.innerHTML = '<span class="langorb__glyph" aria-hidden="true">اردو</span>' +
                    '<span class="langorb__label"></span>';
    orb.addEventListener("click", function () { set(!on); });
    document.body.appendChild(orb);
    setTimeout(function () { orb.classList.add("is-ready"); }, 1400);
  }

  /* ---------- the invitation, once, on a first visit ---------- */
  function mountGate() {
    var seen;
    try { seen = localStorage.getItem(ASKED) || localStorage.getItem(KEY); } catch (e) { seen = "1"; }
    if (seen) return;

    var gate = document.createElement("div");
    gate.className = "langgate";
    gate.id = "langGate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-label", "Choose a language — زبان منتخب کریں");
    gate.innerHTML =
      '<div class="langgate__backdrop"></div>' +
      '<div class="langgate__aurora" aria-hidden="true"><span></span><span></span><span></span></div>' +
      '<div class="langgate__card">' +
        '<div class="langgate__glyph" aria-hidden="true">اردو</div>' +
        '<p class="langgate__ur" lang="ur">کیا آپ یہ ویب سائٹ اردو میں دیکھنا پسند کریں گے؟</p>' +
        '<p class="langgate__en">Would you rather read this site in Urdu? Every page, every price and ' +
        'every tool — translated, and written right to left.</p>' +
        '<div class="langgate__actions">' +
          '<button type="button" class="langgate__yes" id="langGateYes" lang="ur">جی ہاں، اردو میں دکھائیں</button>' +
          '<button type="button" class="langgate__no" id="langGateNo">No thanks, keep English</button>' +
        '</div>' +
        '<p class="langgate__foot">You can switch at any moment — the <b>English / اردو</b> button ' +
        'sits in the corner of every page.</p>' +
      '</div>';
    document.body.appendChild(gate);

    function close(remember) {
      gate.classList.remove("is-open");
      try { localStorage.setItem(ASKED, "1"); } catch (e) {}
      setTimeout(function () { gate.remove(); }, 700);
      if (remember) set(true);
    }
    document.getElementById("langGateYes").addEventListener("click", function () { close(true); });
    document.getElementById("langGateNo").addEventListener("click", function () { close(false); });
    gate.querySelector(".langgate__backdrop").addEventListener("click", function () { close(false); });
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape" && gate.isConnected) { close(false); document.removeEventListener("keydown", esc); }
    });

    // After the preloader has cleared, not on top of it.
    var wait = setInterval(function () {
      var pre = document.getElementById("preloader");
      if (pre && pre.offsetParent !== null) return;
      clearInterval(wait);
      setTimeout(function () {
        gate.classList.add("is-open");
        var yes = document.getElementById("langGateYes");
        if (yes) yes.focus();
      }, 650);
    }, 250);
    setTimeout(function () { clearInterval(wait); }, 15000);
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    mountControls();
    syncControls();

    var saved;
    try { saved = localStorage.getItem(KEY); } catch (e) { saved = null; }

    if (saved === "ur") {
      // A returning Urdu reader should never see the English page flash past.
      document.documentElement.classList.add("ur-swapping");
      load().then(function (d) {
        document.documentElement.classList.remove("ur-swapping");
        if (d) apply(true);
      });
    } else if (!saved) {
      mountGate();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.Urdu = {
    set: set,
    toggle: function () { set(!on); },
    isOn: function () { return on; },
    /* Exposed so a page that builds content late can ask for a pass without
       waiting on the observer. */
    refresh: function () { if (on && DICT) { busy = true; try { pass(document.body); } finally { busy = false; } } }
  };
})();

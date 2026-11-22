/* ============================================================
   Smart pop-up manager for the coach page.
   Every automatic pop-up asks here first, so visitors are never
   flooded. The rules:
   - one pop-up at a time, and a calm gap after each one closes
   - at most 3 automatic pop-ups per visit
   - timers count only time the tab is actually visible
   - wait for a natural pause: not while scrolling, typing, playing
     a game, watching a cutscene or chatting
   - each pop-up has its own frequency cap across visits
   - once someone has contacted Adeel (WhatsApp, email, PayPal),
     the sales pop-ups stay away for a week
   Add ?welcome, ?more, ?offer, ?reminder or ?exit to the address to force one.
   ============================================================ */
(function () {
  "use strict";
  var GAP = 45000;                 // quiet time after any pop-up closes
  var MAX_PER_VISIT = 3;
  var DAY = 864e5;
  var RULES = {
    welcome:  { every: Infinity },  // once, ever (until a language is picked)
    reminder: { every: DAY },       // at most once a day
    more:     { every: DAY },       // "One more thing…" (realtor, actor, mangoes), at most once a day
    offer:    { every: 3 * DAY, sales: true, maxIgnored: 3 },
    exit:     { every: 2 * DAY, sales: true }
  };

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---- what the visitor is doing ---- */
  var visibleMs = 0, lastTick = Date.now(), lastActive = 0, depth = 0, lastClosed = 0;
  setInterval(function () { var n = Date.now(); if (!document.hidden) visibleMs += n - lastTick; lastTick = n; }, 500);
  function active() { lastActive = Date.now(); }
  window.addEventListener("scroll", function () {
    active();
    var h = document.documentElement.scrollHeight - innerHeight;
    if (h > 0) depth = Math.max(depth, window.scrollY / h);
  }, { passive: true });
  ["keydown", "pointerdown", "touchmove", "wheel"].forEach(function (ev) { window.addEventListener(ev, active, { passive: true }); });

  // someone who already reached out shouldn't be sold to again for a while
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]"); if (!a) return;
    if (/wa\.me|mailto:|paypal\.me|snapchat|tiktok/.test(a.getAttribute("href"))) ls("coach-contacted", String(Date.now()));
  }, true);
  function contactedRecently() { return Date.now() - Number(ls("coach-contacted") || 0) < 7 * DAY; }

  function popupOpen() {
    return !!document.querySelector(".welcome:not([hidden]), .xit:not([hidden]), .rmd:not([hidden]), .ct, .chat:not([hidden])");
  }
  function inView(sel) { var el = document.querySelector(sel); if (!el) return false; var r = el.getBoundingClientRect(); return r.bottom > innerHeight * 0.25 && r.top < innerHeight * 0.75; }
  function busyDoing() {
    var a = document.activeElement;
    if (a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable)) return "typing";
    if (window.getSelection && String(window.getSelection()).length > 20) return "reading";
    if (inView("#scorpion-street-3d") && window.__g3 && window.__g3.st && window.__g3.st.playing) return "playing";
    if (inView("#scorpion-street")) return "playing";
    if (popupOpen()) return "popup";
    return "";
  }

  /* ---- notice every pop-up opening and closing, whoever opened it ---- */
  var watched = new WeakSet();
  function watch(el) {
    if (watched.has(el)) return; watched.add(el);
    new MutationObserver(function () { if (el.hidden) lastClosed = Date.now(); }).observe(el, { attributes: true, attributeFilter: ["hidden"] });
  }
  function scan() { [].forEach.call(document.querySelectorAll(".welcome, .xit, .rmd"), watch); }
  new MutationObserver(function (m) {
    scan();
    m.forEach(function (r) { [].forEach.call(r.removedNodes, function (n) { if (n.classList && n.classList.contains("ct")) lastClosed = Date.now(); }); });
  }).observe(document.body, { childList: true });
  scan();

  /* ---- caps ---- */
  function shownThisVisit() { return Number(ss("coach-pop-count") || 0); }
  function allowed(name) {
    var r = RULES[name] || {};
    if (shownThisVisit() >= MAX_PER_VISIT) return false;
    if (ss("coach-pop-" + name)) return false;                                 // once per visit each
    var last = Number(ls("coach-pop-" + name) || 0);
    if (last && Date.now() - last < (r.every || 0)) return false;
    if (r.sales && contactedRecently()) return false;
    if (r.maxIgnored && Number(ls("coach-pop-" + name + "-n") || 0) >= r.maxIgnored && !contactedRecently()) return false;
    if (Date.now() - lastClosed < GAP) return false;
    return true;
  }
  function record(name) {
    ss("coach-pop-" + name, "1"); ss("coach-pop-count", String(shownThisVisit() + 1));
    ls("coach-pop-" + name, String(Date.now()));
    ls("coach-pop-" + name + "-n", String(Number(ls("coach-pop-" + name + "-n") || 0) + 1));
  }

  /* ---- the scheduler ---- */
  var queue = [];
  // when(name, { after: visible ms, cond: fn, priority }, open)
  function when(name, cfg, open) {
    if (/[?&]/.test(location.search) && new RegExp("[?&]" + name + "\\b").test(location.search)) { setTimeout(open, 400); return; }
    queue.push({ name: name, after: cfg.after || 0, cond: cfg.cond, priority: cfg.priority || 0, open: open });
    queue.sort(function (a, b) { return b.priority - a.priority; });
  }
  setInterval(function () {
    if (!queue.length || document.hidden) return;
    if (Date.now() - lastActive < 1500) return;          // wait for a pause in scrolling and tapping
    if (busyDoing()) return;
    for (var i = 0; i < queue.length; i++) {
      var q = queue[i];
      if (visibleMs < q.after) continue;
      if (q.cond && !q.cond()) continue;
      if (!allowed(q.name)) { if (shownThisVisit() >= MAX_PER_VISIT || RULES[q.name] && ss("coach-pop-" + q.name)) queue.splice(i--, 1); continue; }
      queue.splice(i, 1); record(q.name); q.open();
      return;
    }
  }, 700);

  window.coachPop = {
    when: when,
    // event-driven pop-ups (exit intent) ask right before opening
    ask: function (name) { if (busyDoing() === "typing" || popupOpen() || !allowed(name)) return false; record(name); return true; },
    // in-game cutscenes: at least a minute apart
    cutsceneOk: function () { return Date.now() - lastClosed > 60000 && !popupOpen(); },
    depth: function () { return depth; },
    visible: function () { return visibleMs; }
  };
})();

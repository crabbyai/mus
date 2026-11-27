/* ============================================================
   Extras for the coach page:
   1. Today's Hijri date under the featured hadith, with Jumu'ah,
      White Days and Ramadan reminders when they apply.
   2. A digital tasbih: tap to count 33 SubhanAllah, 33 Alhamdulillah,
      34 Allahu Akbar, with gentle vibration. Kept on this device only.
   3. "Someone from Karachi just arrived" notices, from the same live
      visitor data (no names, no IP), at most 4 per visit.
   ============================================================ */
(function () {
  "use strict";
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var css = document.createElement("style");
  css.textContent =
    /* Hijri line */
    ".hj{max-width:1120px;margin:.7rem auto 0;padding:0 16px;display:flex;flex-wrap:wrap;justify-content:center;gap:.35rem .8rem;font:600 .82rem system-ui,sans-serif;color:#e8c87e;text-align:center;position:relative;z-index:2}" +
    ".hj__ar{font-family:'Noto Naskh Arabic',serif;font-size:.95rem;color:#f3eee3}" +
    ".hj__x{flex-basis:100%;color:#f3eee3;font-weight:700}" +
    ".hj__x a{color:#e8c87e;border-bottom:1px solid rgba(232,200,126,.4)}" +
    /* tasbih button and sheet */
    ".tsb-fab{position:fixed;z-index:25;inset-inline-start:16px;bottom:calc(84px + env(safe-area-inset-bottom));width:52px;height:52px;border-radius:50%;border:1px solid #c9a45c;background:radial-gradient(circle at 35% 30%,#2a2440,#0a0f1e);color:#fff;font-size:1.5rem;cursor:pointer;box-shadow:0 14px 34px -10px rgba(0,0,0,.7),0 0 18px rgba(232,200,126,.25);transition:transform .15s;touch-action:manipulation}" +
    ".tsb-fab:hover{transform:scale(1.08)}.tsb-fab b{position:absolute;top:-4px;inset-inline-end:-4px;min-width:20px;padding:0 5px;border-radius:999px;background:#e8c87e;color:#1a1206;font:800 .62rem/18px system-ui,sans-serif}" +
    ".tsb{position:fixed;inset:0;z-index:110;display:flex;align-items:flex-end;justify-content:center;background:rgba(5,8,18,.6)}" +
    ".tsb[hidden]{display:none}" +
    ".tsb__card{width:min(420px,100%);margin:0 auto;padding:1.1rem 1.2rem calc(1.2rem + env(safe-area-inset-bottom));border-radius:26px 26px 0 0;border:1px solid #c9a45c;border-bottom:0;background:linear-gradient(180deg,#141d36,#0a0f1e);color:#f3eee3;text-align:center;font-family:system-ui,sans-serif;animation:tsbUp .22s ease-out}" +
    "@keyframes tsbUp{from{transform:translateY(40px);opacity:0}}" +
    ".tsb__top{display:flex;justify-content:space-between;align-items:center;font:700 .7rem system-ui;letter-spacing:.16em;text-transform:uppercase;color:#e8c87e}" +
    ".tsb__top button{background:none;border:0;color:#f3eee3;font-size:1.4rem;cursor:pointer;padding:0 .3rem}" +
    ".tsb__ar{font:700 1.7rem/1.6 'Noto Naskh Arabic',serif;color:#e8c87e;margin:.5rem 0 0}" +
    ".tsb__tr{margin:0;font-weight:700}.tsb__mn{margin:.1rem 0 .6rem;font-size:.8rem;color:#8b93a7}" +
    ".tsb__tap{position:relative;width:200px;height:200px;margin:.2rem auto .6rem;border-radius:50%;border:0;background:radial-gradient(circle at 40% 35%,#2b3a66,#0d1428);color:#fff;cursor:pointer;display:grid;place-items:center;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;box-shadow:inset 0 0 0 1px rgba(232,200,126,.35),0 0 40px rgba(232,200,126,.12);transition:transform .06s}" +
    ".tsb__tap:active,.tsb__tap.hit{transform:scale(.96)}" +
    ".tsb__tap svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}" +
    ".tsb__tap circle{fill:none;stroke-width:8}.tsb__tap .bg{stroke:rgba(255,255,255,.08)}.tsb__tap .fg{stroke:#e8c87e;stroke-linecap:round;transition:stroke-dashoffset .15s}" +
    ".tsb__n{font:900 3.2rem/1 system-ui,sans-serif}.tsb__n small{display:block;font-size:.8rem;font-weight:700;color:#8b93a7;margin-top:.3rem}" +
    ".tsb__steps{display:flex;justify-content:center;gap:6px;margin-bottom:.6rem}.tsb__steps i{width:34px;height:5px;border-radius:3px;background:rgba(255,255,255,.12)}.tsb__steps i.on{background:#e8c87e}" +
    ".tsb__row{display:flex;justify-content:space-between;align-items:center;font-size:.78rem;color:#8b93a7}" +
    ".tsb__row button{background:none;border:1px solid rgba(201,164,92,.5);border-radius:999px;padding:.35rem .8rem;color:#f3eee3;font:600 .78rem system-ui;cursor:pointer}" +
    ".tsb__done{margin:.2rem 0 .6rem;font-weight:800;color:#3dff7a}" +
    /* arrival notices */
    ".arv{position:fixed;z-index:90;left:50%;top:calc(70px + env(safe-area-inset-top));transform:translateX(-50%);display:flex;align-items:center;gap:.5rem;max-width:calc(100vw - 32px);padding:.5rem .9rem;border-radius:999px;border:1px solid rgba(110,230,140,.45);background:rgba(6,22,14,.92);color:#e9fff0;font:600 .8rem system-ui,sans-serif;box-shadow:0 14px 30px -12px rgba(0,0,0,.8);animation:arvIn .3s ease-out;pointer-events:none}" +
    ".arv.out{opacity:0;transform:translate(-50%,-8px);transition:opacity .3s,transform .3s}" +
    ".arv i{width:8px;height:8px;border-radius:50%;background:#3dff7a;box-shadow:0 0 8px #3dff7a;flex:none}" +
    "@keyframes arvIn{from{opacity:0;transform:translate(-50%,-10px)}}" +
    /* big beads button on computers, the same on every page */
    "@media(min-width:900px){.tsb-fab{width:78px;height:78px;font-size:2.4rem;inset-inline-start:24px;bottom:calc(96px + env(safe-area-inset-bottom));box-shadow:0 16px 40px -10px rgba(0,0,0,.75),0 0 28px rgba(232,200,126,.45);animation:tsbGlow 2.4s ease-in-out infinite alternate}.tsb-fab b{min-width:24px;font-size:.72rem;line-height:22px}}" +
    "@keyframes tsbGlow{to{box-shadow:0 16px 40px -10px rgba(0,0,0,.75),0 0 44px rgba(232,200,126,.8)}}" +
    ".tsb-fab::after{content:'Tasbih';position:absolute;left:50%;bottom:-1.35em;transform:translateX(-50%);font:700 .62rem system-ui,sans-serif;letter-spacing:.08em;color:#e8c87e;text-transform:uppercase;white-space:nowrap;pointer-events:none}" +
    "@media(prefers-reduced-motion:reduce){.tsb__card,.arv,.tsb-fab{animation:none}}";
  document.head.appendChild(css);

  (function () {   // Apple-style emojis on every device
    var me = document.querySelector('script[src*="coach/extras.js"]'); if (!me || document.querySelector('script[src*="apple-emoji.js"]')) return;
    var s = document.createElement("script"); s.src = me.src.replace(/extras\.js.*$/, "apple-emoji.js?v=1"); document.head.appendChild(s);
  })();

  /* ---------- 0. Site-wide: one big WhatsApp button, a reading-progress bar, no sideways wobble ---------- */
  (function () {
    var css2 = document.createElement("style");
    css2.textContent =
      "html,body{overflow-x:clip}" +
      ".fab-wa,.wa-fab,.float-wa,.whatsapp-fab{display:none!important}" +
      ".wab{position:fixed;z-index:940;right:16px;bottom:calc(18px + var(--wab-lift,0px) + env(safe-area-inset-bottom));display:flex;align-items:center;gap:.6rem;padding:.75rem 1.25rem .75rem .85rem;border-radius:999px;background:linear-gradient(135deg,#2be06f,#128c4a);color:#fff!important;text-decoration:none;font:800 1.08rem/1 system-ui,sans-serif;box-shadow:0 14px 34px -10px rgba(0,0,0,.7),0 0 0 3px rgba(255,255,255,.18);animation:wabPulse 2.4s ease-in-out infinite;transition:transform .2s}" +
      ".wab:hover{transform:translateY(-3px) scale(1.04)}" +
      ".wab svg{width:36px;height:36px;flex:none;fill:#fff}" +
      ".wab small{display:block;font:600 .68rem system-ui,sans-serif;opacity:.9;margin-top:2px}" +
      ".wab i{position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:#ff3b4a;border:2px solid #fff;animation:wabDot 1.4s ease-in-out infinite}" +
      "@keyframes wabPulse{0%,100%{box-shadow:0 14px 34px -10px rgba(0,0,0,.7),0 0 0 0 rgba(43,224,111,.55)}50%{box-shadow:0 14px 34px -10px rgba(0,0,0,.7),0 0 0 14px rgba(43,224,111,0)}}" +
      "@keyframes wabDot{50%{transform:scale(1.25)}}" +
      "@media(max-width:700px){.wab{padding:.7rem;right:12px}.wab span{display:none}.wab svg{width:40px;height:40px}}" +
      ".jg-playing .wab{display:none!important}" +
      ".sprog{position:fixed;left:0;top:0;height:3px;width:100%;z-index:960;transform-origin:0 50%;transform:scaleX(0);background:linear-gradient(90deg,#c9a45c,#ffe7a3,#c48bff);pointer-events:none}" +
      "@media(prefers-reduced-motion:reduce){.wab,.wab i{animation:none}}";
    document.head.appendChild(css2);
    var old = document.querySelector(".whatsapp-fab,.wa-fab,.fab-wa,.float-wa");
    var a = document.createElement("a");
    a.className = "wab"; a.target = "_blank"; a.rel = "noopener"; a.setAttribute("aria-label", "Chat with Adeel on WhatsApp");
    a.href = (old && old.getAttribute("href")) || "https://wa.me/16134083945?text=" + encodeURIComponent("Assalam-o-alaikum Adeel, I found your website.");
    if (old) { var keepSync = function () { var h = old.getAttribute("href"); if (h && h !== a.href) a.href = h; }; setTimeout(keepSync, 1500); }   // pages that build a message in the visitor's language
    a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.1-1.2-.2-.2-.5-.3Z"/></svg><span>WhatsApp<small>+1 613 408 3945</small></span><i aria-hidden="true"></i>';
    document.body.appendChild(a);
    // stay above any bar fixed along the bottom of the screen (the phone CTA rails)
    function lift() {
      var h = 0; [].forEach.call(document.body.children, function (el) {
        if (el === a || el.classList.contains("tsb") || el.classList.contains("tsb-fab")) return;
        var cs = getComputedStyle(el); if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden") return;
        var r = el.getBoundingClientRect(); if (r.width > innerWidth * 0.8 && r.bottom >= innerHeight - 2 && r.height < 140 && r.height > 20) h = Math.max(h, r.height);
      });
      a.style.setProperty("--wab-lift", h + "px");
    }
    lift(); setTimeout(lift, 1200); setTimeout(lift, 4000); addEventListener("resize", lift); addEventListener("scroll", function () { clearTimeout(lift.t); lift.t = setTimeout(lift, 300); }, { passive: true });
    // thin reading-progress bar across the very top
    var bar = document.createElement("div"); bar.className = "sprog"; bar.setAttribute("aria-hidden", "true"); document.body.appendChild(bar);
    function prog() { var m = document.documentElement.scrollHeight - innerHeight; bar.style.transform = "scaleX(" + (m > 0 ? Math.min(1, scrollY / m) : 0) + ")"; }
    addEventListener("scroll", prog, { passive: true }); prog();
  })();

  /* ---------- 1. Hijri date ---------- */
  (function () {
    var strip = document.querySelector(".fh-strip"); if (!strip) return;
    var d = new Date(), en = "", ar = "", day = 0, month = 0;
    try {
      en = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(d);
      ar = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(d);
      var parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", { day: "numeric", month: "numeric" }).formatToParts(d);
      parts.forEach(function (p) { if (p.type === "day") day = +p.value; if (p.type === "month") month = +p.value; });
    } catch (e) { return; }
    if (!en || en.indexOf("AH") < 0 && !/14\d\d/.test(en)) return;   // calendar not supported
    var notes = [];
    if (d.getDay() === 5) notes.push('🕌 Jumu’ah Mubarak: read <a href="https://quran.com/18" target="_blank" rel="noopener">Surah Al-Kahf</a> and send salawat on the Prophet ﷺ');
    if (month === 9) notes.push("🌙 Ramadan Mubarak: may Allah accept your fasts and your duas");
    else if (day >= 13 && day <= 15) notes.push("🤍 The White Days (13th–15th): a Sunnah day to fast");
    if (month === 12 && day >= 1 && day <= 10) notes.push("🕋 The best ten days of the year: increase your dhikr, takbir and dua");
    var el = document.createElement("div");
    el.className = "hj";
    el.innerHTML = "<span>🌙 " + esc(en) + '</span><span class="hj__ar" lang="ar" dir="rtl">' + esc(ar) + "</span>" + notes.map(function (n) { return '<span class="hj__x">' + n + "</span>"; }).join("");
    strip.parentNode.insertBefore(el, strip.nextSibling);
  })();

  /* ---------- 2. Tasbih ---------- */
  (function () {
    var STEPS = [
      { ar: "سُبْحَانَ ٱللَّٰهِ", tr: "SubhanAllah", mn: "Glory be to Allah", n: 33 },
      { ar: "ٱلْحَمْدُ لِلَّٰهِ", tr: "Alhamdulillah", mn: "All praise is for Allah", n: 33 },
      { ar: "ٱللَّٰهُ أَكْبَرُ", tr: "Allahu Akbar", mn: "Allah is the Greatest", n: 34 }
    ];
    var today = new Date().toDateString(), saved = {};
    try { saved = JSON.parse(store("coach-tasbih") || "{}") || {}; } catch (e) {}
    if (saved.d !== today) { saved = { d: today, step: 0, n: 0, day: 0, all: saved.all || 0 }; }
    function save() { store("coach-tasbih", JSON.stringify(saved)); }

    var fab = document.createElement("button");
    fab.type = "button"; fab.className = "tsb-fab"; fab.setAttribute("aria-label", "Open tasbih counter");
    fab.innerHTML = '📿<b hidden></b>';
    var sheet = document.createElement("div");
    sheet.className = "tsb"; sheet.hidden = true; sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true"); sheet.setAttribute("aria-label", "Tasbih counter");
    var R = 90, C = 2 * Math.PI * R;
    sheet.innerHTML = '<div class="tsb__card"><div class="tsb__top"><span>📿 Tasbih</span><button type="button" data-x aria-label="Close">×</button></div>' +
      '<p class="tsb__ar" lang="ar" dir="rtl"></p><p class="tsb__tr"></p><p class="tsb__mn"></p>' +
      '<button type="button" class="tsb__tap" aria-label="Count"><svg viewBox="0 0 200 200" aria-hidden="true"><circle class="bg" cx="100" cy="100" r="' + R + '"/><circle class="fg" cx="100" cy="100" r="' + R + '" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/></svg><span class="tsb__n" aria-live="polite"></span></button>' +
      '<div class="tsb__steps"><i></i><i></i><i></i></div><p class="tsb__done" hidden>✨ MashaAllah! 100 complete. SubhanAllahi wa bihamdihi 🤍</p>' +
      '<div class="tsb__row"><span class="tsb__tot"></span><button type="button" data-r>Start again</button></div></div>';
    document.body.appendChild(fab); document.body.appendChild(sheet);
    var $ = function (s) { return sheet.querySelector(s); }, tap = $(".tsb__tap"), badge = fab.querySelector("b");

    function paint() {
      var s = STEPS[Math.min(saved.step, 2)], done = saved.step > 2;
      $(".tsb__ar").textContent = done ? "سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ" : s.ar;
      $(".tsb__tr").textContent = done ? "SubhanAllahi wa bihamdihi" : s.tr;
      $(".tsb__mn").textContent = done ? "Glory be to Allah and all praise is His" : s.mn;
      $(".tsb__n").innerHTML = (done ? 100 : saved.n) + "<small>" + (done ? "complete" : "of " + s.n) + "</small>";
      $(".fg").setAttribute("stroke-dashoffset", String(done ? 0 : C * (1 - saved.n / s.n)));
      [].forEach.call($(".tsb__steps").children, function (i, k) { i.classList.toggle("on", k < saved.step || (k === saved.step && saved.n > 0)); });
      $(".tsb__done").hidden = !done;
      $(".tsb__tot").textContent = "Today " + saved.day + " · all time " + saved.all;
      badge.hidden = !saved.day; badge.textContent = saved.day > 999 ? "999+" : saved.day;
    }
    function buzz(p) { if (navigator.vibrate) try { navigator.vibrate(p); } catch (e) {} }
    function count() {
      if (saved.step > 2) return;
      saved.n++; saved.day++; saved.all++;
      if (saved.n >= STEPS[saved.step].n) { saved.step++; saved.n = 0; buzz(saved.step > 2 ? [120, 60, 120, 60, 200] : 180); }
      else buzz(12);
      if (!reduce) { tap.classList.add("hit"); setTimeout(function () { tap.classList.remove("hit"); }, 70); }
      save(); paint();
    }
    var back = null;
    function open() { back = document.activeElement; sheet.hidden = false; paint(); tap.focus(); }
    function close() { sheet.hidden = true; if (back && back.focus) back.focus(); }
    fab.addEventListener("click", open);
    tap.addEventListener("pointerdown", function (e) { e.preventDefault(); count(); });
    tap.addEventListener("click", function (e) { if (e.detail === 0) count(); });   // keyboard Enter / Space
    $("[data-x]").addEventListener("click", close);
    $("[data-r]").addEventListener("click", function () { saved.step = 0; saved.n = 0; save(); paint(); tap.focus(); });
    sheet.addEventListener("click", function (e) { if (e.target === sheet) close(); });
    document.addEventListener("keydown", function (e) { if (!sheet.hidden && e.key === "Escape") close(); });
    paint();
  })();

  /* ---------- 3. Arrival notices ---------- */
  (function () {
    var DB = ((window.COACH && window.COACH.live && window.COACH.live.databaseURL) || "").replace(/\/+$/, "");
    if (!DB || !window.fetch || !document.getElementById("liveNow")) return;   // the coach page only
    var known = null, shown = 0, MAX = 4, offset = 0;   // newest entry stands in for the server clock
    function flag(c) { return c && /^[A-Z]{2}$/.test(c) ? c.replace(/./g, function (ch) { return String.fromCodePoint(127397 + ch.charCodeAt(0)); }) : "🌍"; }
    function cname(c) { try { return new Intl.DisplayNames(["en"], { type: "region" }).of(c); } catch (e) { return c; } }
    function toast(txt) {
      if (document.querySelector(".welcome:not([hidden]),.rmd:not([hidden]),.xit:not([hidden]),.tsb:not([hidden]),.lko")) return false;
      var t = document.createElement("div"); t.className = "arv"; t.setAttribute("role", "status");
      t.innerHTML = "<i></i><span>" + txt + "</span>";
      document.body.appendChild(t);
      setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, 350); }, 4500);
      return true;
    }
    function poll() {
      if (document.hidden || shown >= MAX) return;
      fetch(DB + "/presence.json").then(function (r) { return r.json(); }).then(function (all) {
        all = all || {};
        var newest = 0; Object.keys(all).forEach(function (k) { newest = Math.max(newest, (all[k] && all[k].t) || 0); });
        var now = Math.max(newest, Date.now() + offset), live = Object.keys(all).filter(function (k) { return all[k] && now - (all[k].t || 0) < 70000; });
        if (known === null) { known = {}; live.forEach(function (k) { known[k] = 1; }); return; }   // only announce people who arrive after us
        var me = window.__coachPid;
        live.forEach(function (k) {
          if (known[k]) return; known[k] = 1;
          if (k === me || shown >= MAX) return;
          var v = all[k]; if (v.o) return; var where = v.ci ? esc(v.ci) + (v.c ? ", " + esc(cname(v.c)) : "") : v.z ? esc(v.z) + (v.c ? ", " + esc(cname(v.c)) : "") : (v.c ? esc(cname(v.c)) : "somewhere");
          if (toast(flag(v.c) + " Someone from " + where + " just arrived · " + live.length + " online")) shown++;
        });
      }).catch(function () {});
    }
    setTimeout(poll, 6000); setInterval(poll, 20000);
  })();
})();

/* Home page behaviour: welcome pop-up, Pakistan-friendly WhatsApp buttons,
   prayer requests, offer buttons and the Pakistan / Canada clock. */
(function () {
  "use strict";
  var WA = "16134083945";
  function wa(msg) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---- WhatsApp messages, written the way people in Pakistan actually text ---- */
  var MSG = {
    ur: "السلام علیکم عدیل بھائی! میں پاکستان سے ہوں۔ مجھے آپ کی رہنمائی اور دعا چاہیے۔ I want this so badly.",
    roman: "Assalam o Alaikum Adeel bhai! Mujhe aap ki rehnumai aur dua chahiye. I want this so badly.",
    voice: "Assalam o Alaikum Adeel bhai! Main aap ko voice note bhej raha/rahi hoon."
  };
  [].forEach.call(document.querySelectorAll(".js-wa"), function (a) {
    a.href = wa(MSG[a.getAttribute("data-wa")] || MSG.roman);
  });
  [].forEach.call(document.querySelectorAll(".js-offer"), function (a) {
    var item = a.getAttribute("data-item"), price = a.getAttribute("data-price").replace(/<[^>]+>/g, "");
    a.href = wa("Assalamu alaikum Adeel Ahmed Rahman! I want this so badly: " + item + " (" + price + "). Please tell me how to start.");
  });


  /* ---- PayPal receipts → WhatsApp ---- */
  [].forEach.call(document.querySelectorAll(".js-receipt"), function (a) {
    var item = a.getAttribute("data-item"), amt = a.getAttribute("data-amt");
    a.href = wa("Assalamu alaikum Adeel Ahmed Rahman! I've paid on PayPal (paypal.me/adeelrahman)" +
      (item ? " for: " + item + (amt ? " ($" + Number(amt).toLocaleString("en-US", { minimumFractionDigits: amt.indexOf(".") >= 0 ? 2 : 0 }) + ")" : "") : "") +
      ". My receipt screenshot is attached.\nName: ");
  });

  /* ---- free salah lessons ---- */
  [].forEach.call(document.querySelectorAll(".js-salah"), function (a) {
    a.href = wa("Assalamu alaikum Adeel Ahmed Rahman! I'd like your free salah lessons. Please teach me how to pray.");
  });

  /* ---- free 7-day plan ---- */
  [].forEach.call(document.querySelectorAll(".js-gift"), function (a) {
    a.href = wa("Assalamu alaikum Adeel Ahmed Rahman! Please send me the free 7-Day Dua Plan.");
  });

  /* ---- program filters ---- */
  var filt = document.querySelector(".filters");
  if (filt) filt.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-f]"); if (!b) return;
    var f = b.getAttribute("data-f");
    [].forEach.call(filt.children, function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    [].forEach.call(document.querySelectorAll(".offers .of"), function (o) { o.hidden = !(f === "all" || o.getAttribute("data-cat") === f); });
  });

  /* ---- Ramadan countdown (expected start; depends on the moon) ---- */
  var rd = document.getElementById("ramDays");
  if (rd) {
    var start = new Date("2027-02-08T00:00:00"), days = Math.ceil((start - new Date()) / 864e5);
    if (days > 0) rd.textContent = days;
    else { var box = document.getElementById("ramadan"); if (box) box.hidden = true; }
  }

  /* ---- Find your path quiz ---- */
  var quiz = document.getElementById("path");
  if (quiz) {
    var ans = {}, res = document.getElementById("qres");
    var AMT = { circle: "11.11", istikhara: "88.88", clarity: "111.11", protect: "222.22", rizq: "444.44", hijra: "555.55", biz: "999.99", king: "1111", couples: "777.77" };
    function pick(a) {
      var need = a.s, want = a.w;
      if (want === "salah") return need === "life" ? "king" : "salah";
      if (need === "life") return "king";
      if (want === "decide") return need === "program" ? "clarity" : "istikhara";
      if (need === "start") return "circle";
      if (need === "few") return "clarity";
      return { marriage: "rizq", rizq: "biz", healing: "protect", close: "hijra" }[want] || "clarity";
    }
    function txt(sel) { var el = document.querySelector(sel); return el ? el.innerHTML : ""; }
    function show() {
      if (!ans.w || !ans.s) return;
      var k = pick(ans), card = document.querySelector('.offers [data-i18n="of.' + k + '.t"]');
      var name = card ? card.textContent : k, price = card ? card.closest(".of").querySelector(".pr").textContent : "";
      document.getElementById("qName").textContent = name;
      document.getElementById("qPrice").textContent = price;
      document.getElementById("qDesc").innerHTML = txt('.offers [data-i18n="of.' + k + '.d"]');
      document.getElementById("qWant").href = wa("Assalamu alaikum Adeel Ahmed Rahman! I took the Find-your-path quiz and I want this so badly: " + name + " (" + price + ").");
      var free = !AMT[k], bar = document.getElementById("qPay").parentNode;
      bar.hidden = free;
      if (free) document.getElementById("qWant").href = wa("Assalamu alaikum Adeel Ahmed Rahman! I took the Find-your-path quiz and I'd like your free salah lessons.");
      else document.getElementById("qPay").href = "https://paypal.me/adeelrahman/" + AMT[k] + "USD";
      document.getElementById("qRc").href = wa("Assalamu alaikum Adeel Ahmed Rahman! I've paid on PayPal for: " + name + " (" + price + "). My receipt screenshot is attached.\nName: ");
      res.hidden = false;
      res.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    [["q1", "w"], ["q2", "s"]].forEach(function (q) {
      var box = document.getElementById(q[0]);
      box.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-v]"); if (!b) return;
        ans[q[1]] = b.getAttribute("data-v");
        [].forEach.call(box.querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        show();
      });
    });
    document.getElementById("qAgain").addEventListener("click", function () {
      ans = {}; res.hidden = true;
      [].forEach.call(quiz.querySelectorAll(".qopts button"), function (x) { x.setAttribute("aria-pressed", "false"); });
      document.getElementById("q1").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ---- verse & hadith of the day (from the library) ---- */
  var LIB = window.LIBRARY || [];
  if (LIB.length && document.getElementById("vday")) {
    var esc = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5);
    var qs = LIB.filter(function (x) { return x.k === "q" && x.a; }), hs = LIB.filter(function (x) { return x.k === "h"; });
    var v = qs[day % qs.length], h = hs[(day * 7) % hs.length], m = v.r.match(/^(\d+):(\d+)/);
    document.querySelector("#vday .tbody").innerHTML = '<span class="ar" lang="ar">' + esc(v.a) + "</span><p>" + esc(v.e) +
      '</p><a href="https://quran.com/' + m[1] + "/" + m[2] + '" target="_blank" rel="noopener">Qur\'an ' + esc(v.r) + " ↗</a>";
    document.querySelector("#hday .tbody").innerHTML = "<p><strong>" + esc(h.r) + ".</strong> " + esc(h.e) +
      '</p><a href="https://sunnah.com/search?q=' + encodeURIComponent(h.e.replace(/[“”"…]/g, "").split(/\s+/).slice(0, 8).join(" ")) + '" target="_blank" rel="noopener">' + esc(h.s) + " ↗</a>";
  }

  /* ---- free mango gift ---- */
  [].forEach.call(document.querySelectorAll(".js-mango"), function (a) {
    var m = "Assalamu alaikum Adeel Ahmed Rahman! I want it badly now: the free Chaunsa Multani mango gift 🥭. Please send it to:\nName: \nAddress: \nCountry: ";
    if (a.getAttribute("data-ch") === "wa") a.href = wa(m);
    else a.href = "mailto:siradeelahmedrahman@yahoo.ca?subject=" + encodeURIComponent("I want it badly now: free Chaunsa mango gift 🥭") + "&body=" + encodeURIComponent(m);
  });

  /* ---- Scorpion Street: road width and the final boss ---- */
  var road = document.getElementById("road");
  if (road) {
    var setW = function () { road.style.setProperty("--w", road.clientWidth + "px"); [].forEach.call(road.querySelectorAll(".scorp"), function (sc) { sc.style.setProperty("--w", road.clientWidth + "px"); }); };
    setW(); window.addEventListener("resize", setW);
    var hp = 100, crab = 1, scale = 1, round = 0, boss = document.getElementById("boss"), bar = document.getElementById("bossHp"), win = document.getElementById("bossWin");
    var MAXCRAB = 4;   // keeps the crab on screen after a couple of doublings
    function pop(text, near, kind, sub) {
      var el = document.createElement("span"), r = road.getBoundingClientRect(), n = near.getBoundingClientRect();
      el.className = "dmg2 dmg2--" + kind; el.textContent = text;
      if (sub) { var sm = document.createElement("small"); sm.textContent = sub; el.appendChild(sm); }
      el.style.left = (n.left - r.left + n.width / 2 + (Math.random() - 0.5) * 30) + "px"; el.style.top = Math.max(0, n.top - r.top + n.height * 0.2) + "px";
      road.appendChild(el); setTimeout(function () { el.remove(); }, 1300);
    }
    window.coachCrabHit = function (list) {   // the crab hits a scorpion for a huge number: AL-ADL, justice
      var live = lanes(); if (!live.length) return;
      pop(list[Math.floor(Math.random() * list.length)], live[Math.floor(Math.random() * live.length)], "crab", "⚖️ AL-ʿADL");
      rampage();
    };
    if (!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) (function hit() {
      setTimeout(function () { if (road.getBoundingClientRect().bottom > 0) window.coachCrabHit(["2222", "222", "222222", "88888888", "622"]); hit(); }, 2600 + Math.random() * 3500);
    })();
    // the crab's rampage: diamonds rain down fast and DIAMOND DIGGER shines over the road
    var dd = document.createElement("span"); dd.className = "dd2"; dd.setAttribute("aria-hidden", "true"); dd.textContent = "💎 DIAMOND DIGGER 💎"; road.appendChild(dd);
    var ddT = 0;
    function rampage() {
      dd.classList.add("on"); clearTimeout(ddT); ddT = setTimeout(function () { dd.classList.remove("on"); }, 2600);
      var w = road.clientWidth;
      for (var i = 0; i < 16; i++) {
        var g = document.createElement("span"); g.className = "gem2"; g.textContent = "💎";
        g.style.left = Math.round(Math.random() * (w - 20)) + "px";
        g.style.animationDelay = (Math.random() * 0.9).toFixed(2) + "s"; g.style.animationDuration = (0.55 + Math.random() * 0.45).toFixed(2) + "s";
        g.style.fontSize = (0.8 + Math.random() * 0.9).toFixed(2) + "rem";
        road.appendChild(g); setTimeout(function (el) { el.remove(); }.bind(null, g), 2200);
      }
    }
    function lanes() { return [].slice.call(road.querySelectorAll(".scorp:not(.gone)")); }
    boss.addEventListener("click", function () {
      // the scorpion only ever MISSES or does 1 damage (the crab has 7)
      if (Math.random() < 0.3) { pop("MISS", boss, "miss"); return; }
      pop("1", boss, "one");
      hp = Math.max(0, hp - 100 / 7);
      bar.style.width = hp + "%";
      if (hp > 0) return;
      // "Nice try": the crab doubles, one scorpion leaves, the rest shrink 34%, a new one is born
      round++;
      crab = Math.min(MAXCRAB, crab * 2);
      road.style.setProperty("--cs", crab); boss.style.setProperty("--cs", crab);
      road.style.setProperty("--rh", Math.max(150, Math.round(67 * 1.3 * crab + 40)) + "px");
      boss.classList.add("grow"); setTimeout(function () { boss.classList.remove("grow"); }, 900);
      var live = lanes();
      if (live.length) { var out = live[Math.floor(Math.random() * live.length)]; out.classList.add("gone"); setTimeout(function () { out.remove(); }, 600); }
      scale = Math.max(0.15, scale * 0.66);
      lanes().forEach(function (sc) { sc.style.setProperty("--s", scale.toFixed(3)); });
      var baby = document.createElement("span");
      var h = road.clientHeight || 150;
      baby.className = "scorp born";
      baby.style.top = Math.round(10 + Math.random() * Math.max(20, h - 50)) + "px";
      baby.style.setProperty("--t", (8 + Math.random() * 6).toFixed(1) + "s");
      baby.style.setProperty("--w", road.clientWidth + "px");
      baby.innerHTML = "<i>🦂</i>";
      road.insertBefore(baby, boss);
      var crown = document.getElementById("bossCrown");   // a bigger crown every round
      crown.classList.add("on"); boss.style.setProperty("--cr", Math.min(round, 5));
      win.hidden = false;
      setTimeout(function () { hp = 100; bar.style.width = "100%"; }, 700);
    });
  }
  /* ---- Scorpion Street: now and then the crab pulls out a sword or a gun ---- */
  var weapon = document.getElementById("bossWeapon");
  if (weapon && !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    (function draw() {
      setTimeout(function () {
        var sword = Math.random() < 0.5;
        weapon.textContent = sword ? "🗡️" : "🔫";
        weapon.classList.add("on"); if (sword) weapon.classList.add("swing");
        setTimeout(function () { if (window.coachCrabHit) window.coachCrabHit(["6226228", "1111", "333", "3333", "333333"]); }, 700);
        setTimeout(function () { weapon.classList.remove("on", "swing"); draw(); }, 2600);
      }, 5000 + Math.random() * 7000);
    })();
  }
  /* ---- prayer request ---- */
  var pray = document.getElementById("prayForm");
  if (pray) pray.addEventListener("submit", function (e) {
    e.preventDefault();
    var n = pray.n.value.trim(), d = pray.d.value.trim();
    if (!d) { pray.d.focus(); return; }
    window.open(wa("Assalamu alaikum Adeel bhai, please make dua for me." + (n ? "\nName: " + n : "") + "\nPlease pray for: " + d), "_blank", "noopener");
  });

  /* ---- Pakistan / Canada clock ---- */
  var clock = document.getElementById("pkTime");
  function tick() {
    if (!clock) return;
    try {
      var o = { hour: "numeric", minute: "2-digit", hour12: true };
      var pk = new Date().toLocaleTimeString("en-US", Object.assign({ timeZone: "Asia/Karachi" }, o));
      var ca = new Date().toLocaleTimeString("en-US", Object.assign({ timeZone: "America/Toronto" }, o));
      clock.textContent = "Pakistan " + pk + " · Canada " + ca;
    } catch (e) { clock.textContent = "Pakistan (PKT) · Canada (ET)"; }
  }
  tick(); setInterval(tick, 30000);


  /* ---- "I want to know badly": private teachings → choose WhatsApp, email or Snapchat ---- */
  var know = document.getElementById("know");
  if (know) {
    var kWa = document.getElementById("kWa"), kMail = document.getElementById("kMail"), kBack = null;
    function kOpen(topic) {
      kBack = document.activeElement;
      var line = "Assalamu alaikum Adeel Ahmed Rahman! I want to know badly: " + topic + ".";
      kWa.href = wa(line);
      kMail.href = "mailto:adeel.rahman@uwaterloo.ca?subject=" + encodeURIComponent("I want to know badly: " + topic) + "&body=" + encodeURIComponent(line + "\n\n");
      know.hidden = false; document.body.style.overflow = "hidden"; kWa.focus();
    }
    function kClose() { know.hidden = true; document.body.style.overflow = ""; if (kBack && kBack.focus) kBack.focus(); }
    [].forEach.call(document.querySelectorAll(".js-know"), function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); kOpen(b.getAttribute("data-topic") || "the private teachings"); });
    });
    know.querySelector("[data-close]").addEventListener("click", kClose);
    know.addEventListener("click", function (e) { if (e.target === know) kClose(); });
    document.addEventListener("keydown", function (e) { if (!know.hidden && e.key === "Escape") kClose(); });
  }

  /* ---- welcome pop-up ---- */
  var box = document.getElementById("welcome");
  if (!box) return;
  var langs = document.getElementById("wLangs");
  var LIST = [["en", "English", "EN"], ["ur", "اردو", "UR"], ["ar", "العربية", "AR"], ["fr", "Français", "FR"],
              ["es", "Español", "ES"], ["ja", "日本語", "JA"], ["zh", "中文", "ZH"], ["ko", "한국어", "KO"]];
  langs.innerHTML = LIST.map(function (x) {
    return '<button type="button" data-l="' + x[0] + '" lang="' + x[0] + '">' + x[1] + "<small>" + x[2] + "</small></button>";
  }).join("");
  function mark() {
    var cur = document.documentElement.lang;
    [].forEach.call(langs.querySelectorAll("button"), function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-l") === cur ? "true" : "false"); });
  }
  langs.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-l]"); if (!b) return;
    if (window.coachSetLang) window.coachSetLang(b.getAttribute("data-l"));
    mark();
  });
  var lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    box.hidden = false; document.body.style.overflow = "hidden"; mark();
    var c = langs.querySelector('[aria-pressed="true"]') || langs.querySelector("button");
    if (c) c.focus();
  }
  function close() {
    box.hidden = true; document.body.style.overflow = "";
    store("coach-welcomed", "1");
    if (!store("coach-lang") && window.coachSetLang) window.coachSetLang(document.documentElement.lang);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.getElementById("wClose").addEventListener("click", close);
  document.getElementById("wGo").addEventListener("click", close);
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key === "Tab") {           // keep focus inside the pop-up
      var f = box.querySelectorAll("button, a[href]"), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  var force = /[?&]welcome\b/.test(location.search);
  // Opens 11 seconds after the page loads (straight away with ?welcome), unless another pop-up is up
  if (force || !store("coach-welcomed")) setTimeout(function () {
    var other = document.getElementById("know");
    if (other && !other.hidden) return;
    open();
  }, force ? 350 : 11000);
  window.coachOpenWelcome = open;

  /* ---- the "I want this so badly" pop-up, 69 seconds after the page loads ---- */
  var offer = document.getElementById("offer");
  if (offer) {
    var oBack = null;
    var oOpen = function () { oBack = document.activeElement; offer.hidden = false; document.body.style.overflow = "hidden"; store("coach-offer-shown", "1"); var c = offer.querySelector(".js-want"); if (c) c.focus(); };
    var oClose = function () { offer.hidden = true; document.body.style.overflow = ""; if (oBack && oBack.focus) oBack.focus(); };
    [].forEach.call(offer.querySelectorAll("[data-close]"), function (b) { b.addEventListener("click", oClose); });
    offer.addEventListener("click", function (e) { if (e.target === offer) oClose(); });
    document.addEventListener("keydown", function (e) { if (!offer.hidden && e.key === "Escape") oClose(); });
    var oForce = /[?&]offer\b/.test(location.search);
    var oTry = function () { if (document.querySelector(".welcome:not([hidden]), .xit:not([hidden]), .rmd:not([hidden]), .chat:not([hidden])")) setTimeout(oTry, 5000); else oOpen(); };
    if (oForce || !store("coach-offer-shown")) setTimeout(oTry, oForce ? 400 : 69000);
  }
})();

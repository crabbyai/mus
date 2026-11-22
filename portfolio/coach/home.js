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
    function loveStruck2(sc) {   // hearts float up, a rose and petals drop, and the scorpion spins dizzy
      var r = road.getBoundingClientRect(), n = sc.getBoundingClientRect(), x = n.left - r.left + n.width / 2, y = n.top - r.top;
      sc.classList.remove("dizzy"); void sc.offsetWidth; sc.classList.add("dizzy"); setTimeout(function () { sc.classList.remove("dizzy"); }, 2400);
      ["❤️", "💕", "💘", "💗"].forEach(function (h, k) {
        var el = document.createElement("span"); el.className = "love2"; el.textContent = h; el.style.left = (x + (k - 1.5) * 12) + "px"; el.style.top = y + "px"; el.style.animationDelay = (k * 0.15) + "s";
        road.appendChild(el); setTimeout(function () { el.remove(); }, 2000);
      });
      var orbit = document.createElement("span"); orbit.className = "orbit2"; orbit.innerHTML = "<i>💕</i><i>💫</i><i>❤️</i>"; orbit.style.left = x + "px"; orbit.style.top = (y - 4) + "px"; road.appendChild(orbit); setTimeout(function () { orbit.remove(); }, 2400);
      for (var k = 0; k < 9; k++) { var pt = document.createElement("span"); pt.className = "petal2"; pt.style.left = (x + (Math.random() - 0.5) * 50) + "px"; pt.style.top = (y + Math.random() * 10) + "px"; pt.style.setProperty("--dx", ((Math.random() - 0.5) * 50).toFixed(0) + "px"); pt.style.animationDelay = (Math.random() * 0.5).toFixed(2) + "s"; road.appendChild(pt); setTimeout(function (el) { el.remove(); }.bind(null, pt), 3200); }
      var rose = document.createElement("span"); rose.className = "rose2"; rose.textContent = "🌹"; rose.style.left = x + "px"; rose.style.top = (n.bottom - r.top - 10) + "px"; road.appendChild(rose); setTimeout(function () { rose.remove(); }, 9000);
    }
    window.coachCrabHit = function (list) {   // the crab hits a scorpion for a huge number: AL-ADL, justice
      var live = lanes(); if (!live.length) return;
      var victim = live[Math.floor(Math.random() * live.length)];
      pop(list[Math.floor(Math.random() * list.length)], victim, "crab", "⚖️ AL-ʿADL");
      if (Math.random() < 0.65) loveStruck2(victim);
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
    // the Hammer of Justice: AL-ʿADL or AL-ḤAKAM. Every scorpion goes flying, they survive, and the case goes to court.
    var hammer = document.getElementById("bossHammer");
    if (hammer && !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) (function swing() {
      setTimeout(function () {
        var r = road.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight || (window.coachCourt && window.coachCourt.busy())) { swing(); return; }
        hammer.querySelector("em").textContent = Math.random() < 0.5 ? "AL-ʿADL" : "AL-ḤAKAM";
        hammer.classList.add("up");
        setTimeout(function () {
          hammer.classList.add("slam");
          road.classList.remove("quake"); void road.offsetWidth; road.classList.add("quake");
          window.coachCrabHit(["88888888", "622", "222222"]);
          setTimeout(function () {
            hammer.classList.remove("up", "slam"); road.classList.remove("quake");
            var seen = false; try { seen = sessionStorage.getItem("coach-court-seen"); } catch (e) {}
            if (window.coachCourt && !seen && (!window.coachPop || window.coachPop.cutsceneOk())) { window.coachCourt.play(); }
            swing();
          }, 1700);
        }, 1100);
      }, 22000 + Math.random() * 16000);
    })();
    // the 12 lakh wedding ring -> AL-MUDHILL -> AL-GHANI -> everything sucked into the crab and his mansion
    // the scorpions keep begging to be the crab's wife
    var mallLevel = 0;
    if (!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) (function beg() {
      setTimeout(function () {
        var live = lanes(), rr = road.getBoundingClientRect();
        if (live.length && window.coachBeg && rr.bottom > 0 && rr.top < innerHeight && !road.querySelector(".beg2")) {
          var sc = live[Math.floor(Math.random() * live.length)], n = sc.getBoundingClientRect();
          var b = document.createElement("span"); b.className = "beg2"; b.textContent = window.coachBeg();
          road.appendChild(b); var half = b.offsetWidth / 2 + 6;
          if (window.coachJaan && b.textContent === window.coachJaan.ask) setTimeout(function () {   // the crab answers
            var bb = boss.getBoundingClientRect(), rep = document.createElement("span"); rep.className = "beg2 beg2--crab"; rep.textContent = window.coachJaan.reply; road.appendChild(rep);
            var hw = rep.offsetWidth / 2 + 6; rep.style.left = Math.max(hw, Math.min(road.clientWidth - hw, bb.left - rr.left + bb.width / 2)) + "px"; rep.style.top = Math.max(rep.offsetHeight + 4, bb.top - rr.top + 10) + "px";
            setTimeout(function () { rep.remove(); }, 3000);
          }, 1300);
          b.style.left = Math.max(half, Math.min(road.clientWidth - half, n.left - rr.left + n.width / 2)) + "px"; b.style.top = Math.max(b.offsetHeight + 4, n.top - rr.top - 6) + "px"; setTimeout(function () { b.remove(); }, 3400);
        }
        beg();
      }, 4500 + Math.random() * 4000);
    })();
    // round 2: the crab reveals he is a Gemini too, and becomes Gemini-Cancer
    var gcDone = false;
    function geminiReveal() { if (gcDone) return; gcDone = true;
      var rr = road.getBoundingClientRect(), bb = boss.getBoundingClientRect();
      var rep = document.createElement("span"); rep.className = "beg2 beg2--crab gc2__say"; rep.textContent = "You are not a rare energy. Scorpio is the most common sign. I, however, am rare: I was born on the cusp of magic. I have TWO signs!!! I am a Gemini too ♊";
      road.appendChild(rep); var hw = rep.offsetWidth / 2 + 6; rep.style.left = Math.max(hw, Math.min(road.clientWidth - hw, bb.left - rr.left + bb.width / 2)) + "px"; rep.style.top = Math.max(rep.offsetHeight + 4, bb.top - rr.top + 6) + "px"; setTimeout(function () { rep.remove(); }, 6000);
      setTimeout(function () {
        var body = boss.querySelector(".boss__body"); ["l", "r"].forEach(function (sd) { var t2 = document.createElement("span"); t2.className = "gc2 gc2--" + sd; t2.setAttribute("aria-hidden", "true"); t2.innerHTML = "<i>" + (sd === "l" ? "🧚‍♂️" : "🧚‍♀️") + "</i><b>✨</b>"; body.appendChild(t2); });
        var arc = document.createElement("span"); arc.className = "gc2__arc"; arc.setAttribute("aria-hidden", "true"); body.appendChild(arc);
        var nm = boss.querySelector(".boss__name"); nm.removeAttribute("data-i18n"); nm.textContent = "♊ Gemini-Cancer ♋";
        var tg = boss.querySelector(".boss__tag"); tg.removeAttribute("data-i18n"); tg.textContent = "Final boss · Gemini-Cancer ♊♋";
        boss.setAttribute("aria-label", "Final boss: Gemini-Cancer, the crab. Tap to defeat it.");
        var note = document.createElement("span"); note.className = "sadqa2"; note.textContent = "♊ Gemini comes to the crab's aid! He is now GEMINI-CANCER ♋"; road.appendChild(note); setTimeout(function () { note.remove(); }, 4000);
      }, 2600); }
    var taps = [], ringBusy = false, ringCool = 0, omen = 0, gb = 1, mk = 1;
    var castle = document.getElementById("castle2");
    function banner2(en, ar, meaning) {
      var b = document.createElement("div"); b.className = "nm2"; b.innerHTML = "<b>" + en + '</b><span lang="ar">' + ar + "</span><em>" + meaning + "</em>";
      road.appendChild(b); void b.offsetWidth; b.classList.add("on"); setTimeout(function () { b.remove(); }, 2700);
    }
    function L2() { var M = { en: ["THE HUMILIATOR", "THE RICH ONE"], ur: ["ذلیل کرنے والا", "بے نیاز، غنی"], ar: ["المُذِلّ", "الغنيّ"], fr: ["CELUI QUI HUMILIE", "LE RICHE"], es: ["EL QUE HUMILLA", "EL RICO"], ja: ["辱める御方", "富める御方"], zh: ["使人卑贱者", "富足者"], ko: ["낮추시는 분", "부유하신 분"] }; return M[(document.documentElement.lang || "en").slice(0, 2)] || M.en; }
    function ringSeq() {
      ringBusy = true;
      var r = road.getBoundingClientRect(), bb = boss.querySelector(".boss__crab").getBoundingClientRect();
      var cx = Math.min(road.clientWidth - 70, Math.max(70, bb.left - r.left + bb.width / 2)), cy = bb.top - r.top + bb.height * 0.25;
      var ring = document.createElement("span"); ring.className = "ring2"; ring.innerHTML = "💍<small>₨ 1200000</small>";
      ring.style.left = cx + "px"; ring.style.top = "-40px"; road.appendChild(ring);
      requestAnimationFrame(function () { requestAnimationFrame(function () { ring.style.top = cy + "px"; }); });
      setTimeout(function () {   // it lands: AL-MUDHILL
        road.classList.remove("quake"); void road.offsetWidth; road.classList.add("quake");
        banner2("AL-MUDHILL", "المُذِلّ", L2()[0]);
        setTimeout(function () {   // AL-GHANI: gold and diamonds everywhere
          road.classList.remove("quake");
          banner2("AL-GHANI", "الغَنِيّ", L2()[1]);
          var w = road.clientWidth, h = road.clientHeight, loot = [];
          for (var i = 0; i < 46; i++) {
            var g = document.createElement("span"); g.className = "loot2"; g.textContent = i % 2 ? "💎" : "🪙";
            g.style.left = Math.round(Math.random() * (w - 24)) + "px"; g.style.top = Math.round(Math.random() * (h - 24)) + "px";
            g.style.fontSize = (0.9 + Math.random() * 0.8).toFixed(2) + "rem"; g.style.opacity = "0"; g.style.transform = "scale(.2)";
            road.appendChild(g); loot.push(g);
            (function (el, d) { setTimeout(function () { el.style.opacity = "1"; el.style.transform = "scale(1) rotate(" + Math.round(Math.random() * 360) + "deg)"; }, d); })(g, Math.random() * 600);
          }
          setTimeout(function () {   // everything is sucked into the crab and his mansion
            var cr = castle.getBoundingClientRect();
            var mx = cr.left - r.left + cr.width / 2, my = cr.top - r.top + cr.height / 2;
            loot.forEach(function (el, i) { el.style.left = (i % 2 ? cx : mx) + "px"; el.style.top = (i % 2 ? cy + 20 : my) + "px"; el.style.transform = "scale(0) rotate(720deg)"; el.style.opacity = "0"; });
            ring.style.transform = "translate(-50%,-50%) scale(0)"; ring.style.opacity = "0";
            setTimeout(function () {
              loot.forEach(function (el) { el.remove(); }); ring.remove();
              gb = Math.min(1.3, gb * 1.07); boss.style.setProperty("--gb", gb.toFixed(3));
              mk = Math.min(2.2, mk * 1.15); road.style.setProperty("--mk", mk.toFixed(3));
              scale = Math.max(0.15, scale * 0.95); lanes().forEach(function (sc) { sc.style.setProperty("--s", scale.toFixed(3)); });
              omen = Math.min(6, omen + 1); road.style.setProperty("--om", omen);
              wolves2();
              window.coachCrabHit(["88888888", "622", "222222"]);
              ringBusy = false; ringCool = Date.now() + 20000;
            }, 950);
          }, 2600);
        }, 2600);
      }, 1700);
    }
    function wolves2() {   // the wolves creep in toward the scorpions, a little closer every time
      var want = Math.min(6, omen), have = road.querySelectorAll(".wolf2"), h = road.clientHeight;
      for (var i = have.length; i < want; i++) {
        var wf = document.createElement("span"); wf.className = "wolf2"; wf.textContent = "🐺";
        wf.style.top = Math.round(8 + (i * 37) % Math.max(30, h - 40)) + "px"; wf.style.left = "-40px"; road.appendChild(wf);
      }
      [].forEach.call(road.querySelectorAll(".wolf2"), function (wf, i) {
        requestAnimationFrame(function () { wf.style.left = Math.round(Math.min(road.clientWidth * 0.55, 10 + omen * 28 + (i % 3) * 14)) + "px"; });
      });
    }
    // 13 and 15 flicker across the road, horror style
    if (!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) (function horror() {
      setTimeout(function () {
        var rr = road.getBoundingClientRect();
        if (rr.bottom > 0 && rr.top < innerHeight) {
          var el = document.createElement("span"); el.className = "h1315"; el.textContent = Math.random() < 0.5 ? "13" : "15";
          el.style.left = (10 + Math.random() * 80) + "%"; el.style.top = (15 + Math.random() * 70) + "%";
          el.style.setProperty("--r", ((Math.random() - 0.5) * 30).toFixed(1) + "deg"); el.style.fontSize = (1.8 + Math.random() * 2.2).toFixed(1) + "rem";
          road.appendChild(el); setTimeout(function () { el.remove(); }, 1500);
          setTimeout(function () { if (window.coachWhisper) window.coachWhisper(road); }, 1100);
        }
        horror();
      }, 8000 + Math.random() * 6000);
    })();
    // red superbikes line up behind the crab, more (and flashier) as he keeps winning
    var bikes2 = document.createElement("span"); bikes2.className = "bikes2"; bikes2.setAttribute("aria-hidden", "true"); road.appendChild(bikes2);
    function bikesUp() {
      var want = Math.min(10, 2 + round * 2 + (omen || 0) * 2);
      while (bikes2.children.length < want) { var bk = document.createElement("i"); bk.textContent = "🏍️"; bikes2.appendChild(bk); }
      bikes2.className = "bikes2 bikes2--t" + Math.min(3, round + ((omen || 0) >= 3 ? 1 : 0));
    }
    bikesUp(); setInterval(bikesUp, 1500);
    // the crab flips his carpet: underneath, a Pakistani flag, and the pind appears with goats and cows
    var caCarpet = road.querySelector(".carpet2--ca"), pind2 = road.querySelector(".pind2"), flipped = false;
    if (caCarpet && pind2 && !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) (function flipLoop() {
      setTimeout(function () {
        var rr = road.getBoundingClientRect();
        if (rr.bottom > 0 && rr.top < innerHeight) {
          caCarpet.classList.add("flipping");
          setTimeout(function () {
            flipped = !flipped; caCarpet.classList.toggle("pk", flipped); caCarpet.classList.remove("flipping");
            pind2.classList.toggle("on", flipped);
            var P = window.coachPind && window.coachPind();
            if (flipped && P) {
              var note = document.createElement("span"); note.className = "sadqa2"; note.textContent = P.flip; road.appendChild(note); setTimeout(function () { note.remove(); }, 2800);
              var bg = pind2.querySelector(".goat2--black"); bg.classList.remove("gone"); bg.style.left = "24%"; bg.style.bottom = "6%"; bg.style.top = "";
              setTimeout(function () {   // sadqa: the black goat walks to the crab and vanishes in light
                bg.classList.add("goat2--walk"); bg.style.left = "64%";
                setTimeout(function () {
                  bg.classList.remove("goat2--walk"); bg.classList.add("gone");
                  var n2 = document.createElement("span"); n2.className = "sadqa2"; n2.textContent = "✨ " + P.sadqa; road.appendChild(n2); setTimeout(function () { n2.remove(); }, 3600);
                }, 3100);
              }, 1800);
            }
          }, 460);
        }
        flipLoop();
      }, flipped ? 22000 : 30000 + Math.random() * 15000);
    })();
    // 2D: the 99 Names dhikr now and then, and a Pray button
    var street = document.getElementById("scorpion-street");
    function dhikr2() { if (!window.coachDhikr) return; var cap = document.createElement("span"); cap.className = "sadqa2"; cap.textContent = "📿 The crab begins his dhikr: the 99 Names of Allah"; road.appendChild(cap); setTimeout(function () { cap.remove(); }, 3000);
      window.coachDhikr(street, function (kind) { var live = lanes(); if (!live.length) return; var sc = live[Math.floor(Math.random() * live.length)];
          pop(kind === "heal" ? "+12" : kind === "push" ? "💥" : kind === "gold" ? "🪙" : kind === "light" ? "✨" : "🤍", sc, kind === "push" || kind === "gold" ? "crab" : "miss"); },
        function () { road.classList.remove("quake"); void road.offsetWidth; road.classList.add("quake"); var b2 = document.createElement("span"); b2.className = "nm2 on"; b2.innerHTML = '<b>Subḥān Allāh</b><span lang="ar">سُبْحَانَ اللّٰه</span><em>99 NAMES</em>'; road.appendChild(b2); setTimeout(function () { b2.remove(); road.classList.remove("quake"); }, 2700); }); }
    if (!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) (function dz() { setTimeout(function () { var rr = road.getBoundingClientRect(); if (rr.bottom > 0 && rr.top < innerHeight && !(window.coachCourt && window.coachCourt.busy())) dhikr2(); dz(); }, 70000 + Math.random() * 40000); })();
    var prayBtn = document.getElementById("pray2");
    if (prayBtn) prayBtn.addEventListener("click", function () { if (!window.coachPrayCard) return; window.coachPrayCard(street, function () {
      lanes().forEach(function (sc) { pop("🤲", sc, "miss"); }); pop("✨ BARAKAH", boss, "crab"); }); });
    function lanes() { return [].slice.call(road.querySelectorAll(".scorp:not(.gone)")); }
    boss.addEventListener("click", function () {
      taps.push(Date.now()); taps = taps.filter(function (t) { return Date.now() - t < 6000; });
      if (taps.length >= 8 && !ringBusy && Date.now() > ringCool) { taps = []; ringSeq(); }
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
      if (round >= 2) setTimeout(geminiReveal, 2400);
      // the shopping-spree joke: a bigger mall every round
      setTimeout(function () { var rr = road.getBoundingClientRect(); if (!(rr.bottom > 0 && rr.top < innerHeight) || (window.coachCourt && window.coachCourt.busy())) return;
        if (round % 3 === 0 && window.coachQiyamah) window.coachQiyamah.play();          // every third round: the Day of Judgement and Jannat al-Firdaus
        else if (window.coachMall && (!window.coachPop || window.coachPop.cutsceneOk())) window.coachMall.play(mallLevel++); }, 1400);
      setTimeout(function () { if (window.coachAyah) window.coachAyah(street); }, 600);
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
    if (!store("coach-lang")) { var navL = ((navigator.languages && navigator.languages[0]) || navigator.language || "en").slice(0, 2).toLowerCase(); var nb = langs.querySelector('[data-l="' + navL + '"]'); if (nb) { c = nb; nb.classList.add("suggest"); } }
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
  // The language pop-up comes at the first calm moment: sooner for visitors whose browser isn't in English
  var nav = ((navigator.languages && navigator.languages[0]) || navigator.language || "en").slice(0, 2).toLowerCase();
  var otherLang = nav !== "en" && LIST.some(function (x) { return x[0] === nav; });
  if (window.coachPop && (!store("coach-welcomed") || /[?&]welcome\b/.test(location.search))) {
    window.coachPop.when("welcome", { after: otherLang ? 3500 : 8000, priority: 3, cond: function () { var k = document.getElementById("know"); return !k || k.hidden; } }, open);
  }
  window.coachOpenWelcome = open;

  /* ---- "One more thing…": the realtor, actor and mango links, 2 minutes into the visit ---- */
  var more = document.getElementById("more");
  if (more) {
    var mBack = null;
    var mOpen = function () { mBack = document.activeElement; more.hidden = false; document.body.style.overflow = "hidden"; var c = more.querySelector(".hire"); if (c) c.focus(); };
    var mClose = function () { more.hidden = true; document.body.style.overflow = ""; if (mBack && mBack.focus) mBack.focus(); };
    [].forEach.call(more.querySelectorAll("[data-close]"), function (b) { b.addEventListener("click", mClose); });
    more.addEventListener("click", function (e) { if (e.target === more) mClose(); });
    document.addEventListener("keydown", function (e) { if (!more.hidden && e.key === "Escape") mClose(); });
    if (window.coachPop) window.coachPop.when("more", { after: 120000, priority: 2.5 }, mOpen);
  }

  /* ---- the "I want this so badly" pop-up, 69 seconds after the page loads ---- */
  var offer = document.getElementById("offer");
  if (offer) {
    var oBack = null;
    var oOpen = function () { oBack = document.activeElement; offer.hidden = false; document.body.style.overflow = "hidden"; store("coach-offer-shown", "1"); var c = offer.querySelector(".js-want"); if (c) c.focus(); };
    var oClose = function () { offer.hidden = true; document.body.style.overflow = ""; if (oBack && oBack.focus) oBack.focus(); };
    [].forEach.call(offer.querySelectorAll("[data-close]"), function (b) { b.addEventListener("click", oClose); });
    offer.addEventListener("click", function (e) { if (e.target === offer) oClose(); });
    document.addEventListener("keydown", function (e) { if (!offer.hidden && e.key === "Escape") oClose(); });
    // after 69 seconds of real reading, once they've seen a good part of the page (or stayed two minutes)
    if (window.coachPop) window.coachPop.when("offer", { after: 69000, priority: 2, cond: function () { return window.coachPop.depth() > 0.3 || window.coachPop.visible() > 120000; } }, oOpen);
  }
})();

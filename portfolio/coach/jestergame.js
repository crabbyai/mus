/* ============================================================
   The Jester's Court: a small arcade game in the spirit of
   Scorpion Street, with the jester in the crab's place.
   You are the scorpion. Sting the jester, catch his diamonds,
   dodge his cards, and beware the masks (false weaknesses).
   The twist: every hit is a fall he lets you have. The only true
   win is to refuse his game: catch 10 diamonds without striking him.
   ============================================================ */
(function () {
  "use strict";
  var box = document.getElementById("jg"); if (!box) return;
  var cv = box.querySelector("canvas"), ctx = cv.getContext("2d");
  var ov = box.querySelector(".jg__ov"), hud = box.querySelector(".jg__hud"), sting = box.querySelector(".jg__sting");
  var img = new Image(); img.src = "coach/assets/jester.png";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  var W = 0, H = 0, dpr = 1;
  function size() {
    var r = box.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(280, r.width); H = W < 560 ? Math.min(600, Math.max(420, W * 1.3)) : Math.max(380, Math.min(520, W * 0.66));
    box.style.height = H + "px"; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size(); window.addEventListener("resize", function () { size(); if (!G.playing) draw(0); });

  /* ---------- sound: tiny synth blips, no files ---------- */
  var AC = null, muted = store("jg-mute") === "1";
  function tone(f, d, type, vol, slide) {
    if (muted) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume();
      var o = AC.createOscillator(), g = AC.createGain(), n = AC.currentTime; o.type = type || "sine"; o.frequency.setValueAtTime(f, n);
      if (slide) o.frequency.exponentialRampToValueAtTime(slide, n + d);
      g.gain.setValueAtTime(vol || 0.07, n); g.gain.exponentialRampToValueAtTime(0.0001, n + d); o.connect(g); g.connect(AC.destination); o.start(n); o.stop(n + d + 0.02);
    } catch (e) {}
  }
  function seq(fs, gap, d, type, vol) { fs.forEach(function (f, i) { setTimeout(function () { tone(f, d, type, vol); }, i * gap); }); }
  var SFX = {
    gem: function (c) { tone(660 * Math.pow(1.06, Math.min(c, 14)), 0.12, "triangle", 0.07); },
    sting: function () { tone(1000, 0.07, "square", 0.025, 350); },
    hurt: function () { tone(170, 0.28, "sawtooth", 0.06, 70); },
    hit: function () { tone(320, 0.14, "square", 0.045, 640); },
    power: function () { seq([523, 659, 784, 1046], 60, 0.12, "triangle", 0.06); },
    king: function () { seq([392, 523, 659, 784, 1046], 110, 0.22, "sawtooth", 0.04); },
    manic: function () { seq([520, 620, 540, 700, 560, 760], 70, 0.07, "square", 0.035); },
    lasso: function () { tone(760, 0.5, "sine", 0.06, 110); },
    tick: function () { tone(440, 0.1, "triangle", 0.06); },
    go: function () { tone(880, 0.25, "triangle", 0.07); },
    gavel: function () { tone(130, 0.35, "square", 0.08, 55); }
  };
  var snd = document.createElement("button"), pz = document.createElement("button");
  snd.type = pz.type = "button"; snd.className = "jg__btn jg__snd"; pz.className = "jg__btn jg__pz"; pz.hidden = true;
  function paintSnd() { snd.textContent = muted ? "🔇" : "🔊"; snd.setAttribute("aria-label", muted ? "Turn sound on" : "Turn sound off"); }
  pz.textContent = "⏸"; pz.setAttribute("aria-label", "Pause");
  snd.onclick = function () { muted = !muted; store("jg-mute", muted ? "1" : "0"); paintSnd(); if (!muted) tone(660, 0.1, "triangle", 0.06); };
  pz.onclick = function () { if (G.paused) resume(); else pause(); };
  box.appendChild(snd); box.appendChild(pz); paintSnd();

  var HIT = ["Ouch! You got me 🤡", "Haaye, main haar gaya! 😵", "Too strong for me 🙈", "Wah! Kya baat hai! 👏", "Bas karo, I'm just a fool 🥴", "You win, you win! 🏳️", "Oh no, my hat! 🎩"];
  var TAUNT = ["Come on, hit the fool 🤡", "Catch my diamonds if you can 💎", "Am I a threat? Never 😇", "Mera mazaaq urao, I don't mind 🙃"];
  var MANIC = ["HAHAHAHA! 🤪", "Catch THIS! 🃏🃏🃏", "Hee hee hee! 😵‍💫", "Pagal ho gaya hoon! 🤪"];
  var KINGL = ["Kneel before the King 👑", "Bow, little scorpion ⚔️", "The fool was only a costume 🛡️"];
  var G = { playing: false, paused: false };
  window.__jg = G;

  function reset() {
    G.t = 0; G.left = 45; G.gems = 0; G.hits = 0; G.secrets = 0; G.conf = 0; G.shake = 0;
    G.px = W / 2; G.tx = W / 2; G.sx = []; G.drops = []; G.parts = []; G.bubbles = [];
    G.jx = W / 2; G.jv = 90; G.jflash = 0; G.jfall = 0; G.nextDrop = 0.8; G.nextTaunt = 3; G.cool = 0; G.end = null;
    G.score = 0; G.combo = 0; G.comboT = 0; G.mag = 0; G.slow = 0; G.shield = 0; G.floats = []; G.count = 3.2; G.lastTick = 4;
    G.mode = "jester"; G.modeT = 0; G.nextManic = 6; G.nextKing = 13; G.slip = 0; G.lasso = 0; G.rope = 0; G.thrown = false; G.humil = 0; G.burstT = 0;
  }
  reset();

  /* ---------- input ---------- */
  var keys = {};
  window.addEventListener("keydown", function (e) {
    if (!G.playing || G.paused) return;
    if (!inView()) return;
    if (/^(ArrowLeft|ArrowRight|a|d|A|D)$/.test(e.key)) { keys[e.key.toLowerCase()] = 1; e.preventDefault(); }
    if (e.key === " " || e.key === "ArrowUp" || e.key === "w") { fire(); e.preventDefault(); }
    if (e.key === "p" || e.key === "P" || e.key === "Escape") { pause(); e.preventDefault(); }
  });
  window.addEventListener("keyup", function (e) { delete keys[e.key.toLowerCase()]; });
  window.addEventListener("keydown", function (e) { if ((e.key === "m" || e.key === "M") && inView() && !/INPUT|TEXTAREA/.test((document.activeElement || {}).tagName || "")) snd.onclick(); if (G.paused && (e.key === "p" || e.key === "P" || e.key === " ") && inView()) { resume(); e.preventDefault(); } });
  var dragOff = 0;
  var downX = 0, downT = 0;
  cv.addEventListener("pointerdown", function (e) {
    if (!G.playing) return;
    if (G.paused) { resume(); return; }
    var r = cv.getBoundingClientRect(); downX = e.clientX; downT = Date.now();
    if (e.pointerType === "mouse") G.tx = e.clientX - r.left; else dragOff = G.px - (e.clientX - r.left);   // fingers drag from wherever they land
    cv.setPointerCapture && cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener("pointermove", function (e) {
    if (!G.playing || G.paused) return; var r = cv.getBoundingClientRect(), x = e.clientX - r.left;
    if (e.pointerType === "mouse") G.tx = x;   // on a computer the scorpion simply follows the mouse
    else if (e.buttons || e.pressure) G.tx = x + dragOff;
  });
  cv.addEventListener("pointerup", function (e) { if (e.pointerType === "mouse" && G.playing && !G.paused && Math.abs(e.clientX - downX) < 12 && Date.now() - downT < 300) fire(); });   /* on phones only the Sting button stings, so moving never fires by mistake */
  var auto = 0;
  sting.addEventListener("pointerdown", function (e) { e.preventDefault(); e.stopPropagation(); if (G.paused) { resume(); return; } fire(); sting.classList.add("on"); clearInterval(auto); auto = setInterval(fire, 280); if (sting.setPointerCapture) try { sting.setPointerCapture(e.pointerId); } catch (er) {} });   /* hold to keep stinging */
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (ev) { sting.addEventListener(ev, function () { clearInterval(auto); sting.classList.remove("on"); }); });
  sting.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  sting.addEventListener("click", function (e) { if (e.detail === 0) fire(); });
  // phones: hold ◀ ▶ to walk
  var pad = document.createElement("div"); pad.className = "jg__pad"; pad.hidden = true;
  pad.innerHTML = '<button type="button" data-dir="arrowleft" aria-label="Move left">◀</button><button type="button" data-dir="arrowright" aria-label="Move right">▶</button>';
  box.appendChild(pad);
  if (navigator.maxTouchPoints > 0 || "ontouchstart" in window) box.classList.add("touch");   /* show ◀ ▶ on touch screens */
  [].forEach.call(pad.querySelectorAll("button"), function (b) {
    var k2 = b.getAttribute("data-dir");
    function on(e) { e.preventDefault(); if (G.paused) return; keys[k2] = 1; b.classList.add("on"); }
    function off() { delete keys[k2]; b.classList.remove("on"); }
    b.addEventListener("pointerdown", on); ["pointerup", "pointerleave", "pointercancel", "lostpointercapture"].forEach(function (ev) { b.addEventListener(ev, off); });
    b.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  });

  function fire() {
    if (!G.playing || G.paused || G.cool > 0) return;
    if (G.lasso > 0) return;
    if (G.count > 0) return;
    G.cool = 0.26; G.sx.push({ x: G.px, y: (PY() - 18) }); SFX.sting();
    if (navigator.vibrate) try { navigator.vibrate(8); } catch (e) {}
  }

  /* ---------- game loop ---------- */
  var last = 0, raf = 0, vis = false;
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    var dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    if (!vis) return;
    if (G.playing && !G.paused) {
      if (G.count > 0) { G.count -= dt; var c = Math.ceil(G.count); if (c !== G.lastTick && c > 0) { G.lastTick = c; SFX.tick(); } if (G.count <= 0) SFX.go(); G.px += (Math.max(24, Math.min(W - 24, G.tx)) - G.px) * Math.min(1, dt * 12); draw(dt); drawCount(); return; }
      step(dt); draw(dt);
    }
    else if (!G.playing && !G.end) draw(0);   // title screen: the court idles
  }
  function step(dt) {
    G.t += dt; G.left -= dt; G.cool -= dt; G.conf -= dt; G.jflash -= dt; G.jfall -= dt; G.shake = Math.max(0, G.shake - dt * 30);
    // player
    var k = (keys.arrowleft || keys.a ? -1 : 0) + (keys.arrowright || keys.d ? 1 : 0);
    if (k) G.tx = G.px + k * 680 * dt * (G.conf > 0 ? -1 : 1);
    var target = G.conf > 0 && !k ? W - G.tx : G.tx;
    if (G.lasso > 0) { G.lasso -= dt; target = G.jx; G.tx = G.px; }
    G.px += (Math.max(24, Math.min(W - 24, target)) - G.px) * Math.min(1, dt * (G.lasso > 0 ? 3 : 24));   /* snappy: the scorpion goes where you point */
    G.slip -= dt; G.rope -= dt; G.mag -= dt; G.slow -= dt; G.comboT -= dt; if (G.comboT <= 0) G.combo = 0;
    G.floats = G.floats.filter(function (f) { f.life -= dt; f.y -= 40 * dt; return f.life > 0; });
    // moods: the fool, the manic fool, and the King underneath
    if (G.mode === "jester") {
      G.nextManic -= dt; G.nextKing -= dt;
      if (G.nextKing <= 0) { G.mode = "king"; G.modeT = 7; G.slip = 0.7; G.thrown = false; G.shake = 12; G.drops = []; say("…the suit slips! Behold, the King 👑", G.jx, H * 0.12); SFX.king(); burst(G.jx, H * 0.3, "🃏", 6); burst(G.jx, H * 0.3, "✨", 6); }
      else if (G.nextManic <= 0) { G.mode = "manic"; G.modeT = 2.8; G.burstT = 0; SFX.manic(); say(MANIC[Math.floor(Math.random() * MANIC.length)], G.jx, H * 0.06); }
    } else {
      G.modeT -= dt;
      if (G.mode === "king" && !G.thrown && G.modeT < 4.6) { G.thrown = true; G.rope = 0.5; }
      if (G.mode === "king" && G.thrown === true && G.rope <= 0 && G.rope > -dt * 1.5 && G.lasso <= 0 && G.shield > 0) { G.shield = 0; G.thrown = "blocked"; say("🛡️ Your shield snapped the lasso!", G.px, (PY() - 50), 1); SFX.power(); }
      if (G.mode === "king" && G.thrown === true && G.rope <= 0 && G.rope > -dt * 1.5 && G.lasso <= 0) {
        G.lasso = 2.4; G.combo = 0; SFX.lasso(); G.humil++; G.gems = Math.max(0, G.gems - 2); G.shake = 10;
        say("😳 Lassoed and humiliated! −2 💎", G.px, (PY() - 50), 1); say(KINGL[G.humil % KINGL.length], G.jx, H * 0.2);
        if (navigator.vibrate) try { navigator.vibrate([80, 40, 160]); } catch (e) {}
      }
      if (G.modeT <= 0) {
        if (G.mode === "king") { G.slip = 0.6; G.nextKing = 15 + Math.random() * 6; say("…and back into the fool's suit 🤡", G.jx, H * 0.12); burst(G.jx, H * 0.3, "👑", 4); }
        else G.nextManic = 6 + Math.random() * 4;
        G.mode = "jester";
      }
    }
    // jester glides and dodges a little
    var js = jsize(), lvl = 1 + G.t / 20;
    var spd = G.mode === "manic" ? 2.6 : G.mode === "king" ? 0.7 : 1;
    G.jx += G.jv * lvl * spd * dt; if (G.jx < js * 0.6 || G.jx > W - js * 0.6) { G.jv *= -1; G.jx = Math.max(js * 0.6, Math.min(W - js * 0.6, G.jx)); }
    if (Math.random() < dt * (G.mode === "manic" ? 3 : 0.6)) G.jv *= -1;
    if (G.mode === "king") { var kl = Math.min(W / 2, js * 1.45); if (G.jx < kl || G.jx > W - kl) { G.jx = Math.max(kl, Math.min(W - kl, G.jx)); G.jv = (G.jx < W / 2 ? 1 : -1) * Math.abs(G.jv); } }   /* room for his four wives */
    var jy = jyNow();
    if (G.mode === "manic") { G.burstT -= dt; if (G.burstT <= 0) { G.burstT = 0.28; for (var q = -1; q <= 1; q++) G.drops.push({ x: G.jx, y: jy + js * 0.3, vy: 170 + G.t * 2, vx: q * 90 + (Math.random() - 0.5) * 30, type: Math.random() < 0.75 ? "card" : "gem", rot: 0 }); } }
    // drops
    if (G.mode === "jester") G.nextDrop -= dt;
    if (G.nextDrop <= 0) {
      G.nextDrop = Math.max(0.35, 1.1 - G.t / 60) * (0.6 + Math.random() * 0.8);
      var r = Math.random(), type = r < 0.07 ? ["magnet", "shield", "slow"][Math.floor(Math.random() * 3)] : r < 0.55 ? "gem" : r < 0.75 ? "card" : r < 0.92 ? "mask" : "crown";
      G.drops.push({ x: Math.max(30, Math.min(W - 30, G.jx + (Math.random() - 0.5) * js * 0.6)), y: jy + js * 0.3, vy: 110 + Math.random() * 60 + G.t * 2.2, vx: (Math.random() - 0.5) * 60, type: type, rot: 0 });
    }
    // stingers
    for (var i = G.sx.length - 1; i >= 0; i--) {
      var s = G.sx[i]; s.y -= 520 * dt;
      if (Math.abs(s.x - G.jx) < js * 0.42 && Math.abs(s.y - jy) < js * 0.45) {
        G.sx.splice(i, 1);
        if (G.mode === "king") { say("🛡️ Blocked by the King's shield", G.jx, jy - js * 0.7, 1); burst(s.x, s.y, "✨", 3); continue; } G.hits++; G.secrets += 3; SFX.hit(); G.jflash = 0.25; G.jfall = 0.6; G.shake = 6;
        say(HIT[G.hits % HIT.length], G.jx, jy - js * 0.6);
        burst(G.jx, jy, "💎", 3);
        continue;
      }
      if (s.y < -10) G.sx.splice(i, 1);
    }
    // falling things
    var py = PY();
    for (i = G.drops.length - 1; i >= 0; i--) {
      var d = G.drops[i], sl = G.slow > 0 ? 0.45 : 1; d.y += d.vy * dt * sl; d.x += d.vx * dt * sl; d.rot += dt * 3;
      if (G.mag > 0 && (d.type === "gem" || d.type === "crown") && d.y > H * 0.35) d.x += (G.px - d.x) * Math.min(1, dt * 5);
      if (Math.abs(d.x - G.px) < 48 && Math.abs(d.y - py) < 40) {
        G.drops.splice(i, 1);
        if (d.type === "gem" || d.type === "crown") {
          G.combo = G.comboT > 0 ? G.combo + 1 : 1; G.comboT = 2.6;
          var mult = Math.min(5, 1 + Math.floor((G.combo - 1) / 3)), worth = d.type === "crown" ? 5 : 1;
          G.gems += worth; G.score += worth * mult; SFX.gem(G.combo);
          floatTxt("+" + worth * mult + (mult > 1 ? "  🔥×" + mult : ""), d.x, d.y - 20, mult > 1 ? "#ffb347" : "#bfe6ff");
          burst(d.x, d.y, d.type === "crown" ? "👑" : "✦", 4); if (d.type === "crown") say("+5 💎 royal treasure!", d.x, d.y - 30, 1);
          if (G.combo === 6 || G.combo === 12) say(G.combo === 6 ? "🔥 On fire! ×3" : "🔥🔥 Unstoppable! ×5", G.px, (PY() - 60), 1);
        }
        else if (d.type === "card") {
          if (G.shield > 0) { G.shield = 0; say("🛡️ Shield blocked the card", d.x, d.y - 30, 1); SFX.power(); }
          else { G.gems = Math.max(0, G.gems - 1); G.combo = 0; G.shake = 10; SFX.hurt(); say("🃏 The card cut you! −1 💎", d.x, d.y - 30, 1); if (navigator.vibrate) try { navigator.vibrate(60); } catch (e) {} }
        }
        else if (d.type === "magnet") { G.mag = 6; SFX.power(); say("🧲 Magnet! Diamonds fly to you", d.x, d.y - 30, 1); }
        else if (d.type === "shield") { G.shield = 1; SFX.power(); say("🛡️ Shield up: blocks one card or lasso", d.x, d.y - 30, 1); }
        else if (d.type === "slow") { G.slow = 5; SFX.power(); say("⏳ Slow motion!", d.x, d.y - 30, 1); }
        else { G.conf = 2; SFX.hurt(); say("🎭 A false weakness! Controls flipped", d.x, d.y - 30, 1); }
        continue;
      }
      if (d.y > H + 30) G.drops.splice(i, 1);
    }
    // taunts when you hold back
    G.nextTaunt -= dt; if (G.nextTaunt <= 0) { G.nextTaunt = 5 + Math.random() * 4; say(TAUNT[Math.floor(Math.random() * TAUNT.length)], G.jx, jy - js * 0.6); }
    // particles and bubbles
    G.parts = G.parts.filter(function (p) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 200 * dt; return p.life > 0; });
    G.bubbles = G.bubbles.filter(function (b) { b.life -= dt; b.y -= 14 * dt; return b.life > 0; });
    paintHud();
    if (G.left <= 0) finish();
  }
  function PY() { return box.classList.contains("touch") ? H - 140 : H - 50; }   /* above the ◀ ▶ and Sting buttons on touch screens */
  function jyNow() { return G.mode === "king" ? H * 0.44 + Math.sin(G.t * 9) * 3 : H * 0.2 + Math.sin((G.t || 0) * 2) * 8; }
  function jsize() { return Math.min(W * 0.26, H * 0.3, 150); }
  function say(t, x, y, small) { G.bubbles = G.bubbles.filter(function (b) { return b.small !== !!small; }); /* one jester line and one game note at a time */ G.bubbles.push({ t: t, x: x, y: y, life: 2, small: !!small }); }
  function floatTxt(t, x, y, col) { G.floats.push({ t: t, x: x, y: y, life: 0.9, col: col }); }
  function drawCount() {
    var c = Math.ceil(G.count); ctx.save(); ctx.fillStyle = "rgba(5,2,6,.45)"; ctx.fillRect(0, 0, W, H);
    ctx.font = "900 " + Math.round(Math.min(W, H) * 0.28) + "px 'Cinzel Decorative',Georgia,serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffe7a3"; ctx.shadowColor = "rgba(220,20,50,.9)"; ctx.shadowBlur = 30; var k = 1 + (G.count - Math.floor(G.count)) * 0.3; ctx.translate(W / 2, H * 0.45); ctx.scale(k, k); ctx.fillText(c > 0 ? String(c) : "GO!", 0, 0); ctx.restore();
    ctx.save(); ctx.font = "700 14px system-ui,sans-serif"; ctx.fillStyle = "#f3eee3"; ctx.textAlign = "center"; ctx.fillText(window.matchMedia && matchMedia("(pointer:fine)").matches ? "Move the mouse · click or Space to sting" : "Drag anywhere to move · tap to sting", W / 2, H * 0.62); ctx.restore();
  }
  function burst(x, y, ch, n) { for (var i = 0; i < n; i++) G.parts.push({ x: x, y: y, vx: (Math.random() - 0.5) * 220, vy: -80 - Math.random() * 160, life: 0.9, ch: ch }); }

  /* ---------- drawing ---------- */
  function emoji(ch, x, y, s, rot) { ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.font = s + "px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(ch, 0, 0); ctx.restore(); }
  function draw() {
    var t = G.t || performance.now() / 1000;
    ctx.save();
    if (G.shake && !reduce) ctx.translate((Math.random() - 0.5) * G.shake, (Math.random() - 0.5) * G.shake);
    // the hall
    var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1a0610"); g.addColorStop(0.62, "#0b0309"); g.addColorStop(1, "#050206");
    ctx.fillStyle = g; ctx.fillRect(-10, -10, W + 20, H + 20);
    var rg = ctx.createRadialGradient(W / 2, 0, 10, W / 2, 0, H * 0.9); rg.addColorStop(0, "rgba(200,20,40,.35)"); rg.addColorStop(1, "rgba(200,20,40,0)");
    ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    // columns
    for (var c = 0; c < 6; c++) { var cx = (c + 0.5) * W / 6; ctx.fillStyle = "rgba(201,164,92,.07)"; ctx.fillRect(cx - 10, 0, 20, H * 0.66); ctx.fillStyle = "rgba(201,164,92,.18)"; ctx.fillRect(cx - 14, H * 0.66 - 6, 28, 6); }
    // floor tiles
    var fy = H * 0.66;
    for (var row = 0; row < 6; row++) for (var col = -2; col < 14; col++) {
      var y0 = fy + row * (H - fy) / 6; ctx.fillStyle = (row + col) % 2 ? "rgba(201,164,92,.10)" : "rgba(80,10,25,.25)";
      ctx.fillRect(col * W / 10 + (row % 2) * W / 20, y0, W / 10, (H - fy) / 6);
    }
    // curtains
    [0, 1].forEach(function (s) { var x = s ? W : 0, dir = s ? -1 : 1; var cg = ctx.createLinearGradient(x, 0, x + dir * W * 0.12, 0); cg.addColorStop(0, "#7a0c1c"); cg.addColorStop(1, "rgba(90,8,20,0)");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + dir * W * 0.14, 0); ctx.quadraticCurveTo(x + dir * W * 0.05, H * 0.4, x + dir * W * 0.02, H); ctx.lineTo(x, H); ctx.fill(); });
    // candles and scales
    var fl = 0.8 + Math.sin(t * 13) * 0.1 + Math.random() * 0.1;
    ctx.globalAlpha = fl; emoji("🕯️", W * 0.08, H * 0.6, 22); emoji("🕯️", W * 0.92, H * 0.6, 22); ctx.globalAlpha = 1;
    emoji("⚖️", W * 0.08, H * 0.12, 24, Math.sin(t * 1.7) * 0.15); emoji("⚖️", W * 0.92, H * 0.12, 24, -Math.sin(t * 1.7) * 0.15);
    // the jester, diamonds circling him (one for each secret he gathers)
    var js = jsize(), jx = G.playing || G.end ? G.jx : W / 2, king = G.mode === "king" && (G.playing || G.end), manic = G.mode === "manic";
    var jy = G.playing || G.end ? jyNow() : H * 0.2 + Math.sin(t * 2) * 8;
    var spot = ctx.createLinearGradient(0, 0, 0, jy + js); spot.addColorStop(0, king ? "rgba(255,215,120,.32)" : manic ? "rgba(255,60,60,.3)" : "rgba(255,240,200,.25)"); spot.addColorStop(1, "rgba(255,240,200,0)");
    ctx.fillStyle = spot; ctx.beginPath(); ctx.moveTo(jx - 14, 0); ctx.lineTo(jx + 14, 0); ctx.lineTo(jx + js * 0.9, jy + js * 0.7); ctx.lineTo(jx - js * 0.9, jy + js * 0.7); ctx.fill();
    if (king) drawKing(jx, jy, js, t);
    else {
      var orbit = Math.min(14, 4 + Math.floor((G.secrets || 0) / 2));
      for (var o = 0; o < orbit; o++) { var a = t * (manic ? 4 : 1.4) + o / orbit * Math.PI * 2; emoji("💎", jx + Math.cos(a) * js * 0.62, jy + Math.sin(a) * js * 0.5, 13 + (G.secrets > 20 ? 4 : 0)); }
      ctx.save(); ctx.translate(jx, jy);
      var fall = G.jfall > 0 ? Math.sin((0.6 - G.jfall) / 0.6 * Math.PI) : 0;
      if (manic && !reduce) { ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8); ctx.rotate(Math.sin(t * 30) * 0.25); ctx.scale(1 + Math.sin(t * 18) * 0.06, 1 + Math.cos(t * 18) * 0.06); }
      else ctx.rotate(Math.sin(t * 2.6) * 0.08 + fall * 0.5);
      ctx.translate(0, fall * 10);
      if (img.complete && img.naturalWidth) { ctx.imageSmoothingEnabled = false; ctx.shadowColor = manic || G.jflash > 0 ? "rgba(255,40,40,.95)" : "rgba(180,90,255,.8)"; ctx.shadowBlur = manic ? 28 : 18; ctx.drawImage(img, -js / 2, -js / 2, js, js * img.naturalHeight / img.naturalWidth); ctx.shadowBlur = 0; }
      else emoji("🃏", 0, 0, js * 0.7);
      drawArms(js, t, manic);
      ctx.restore();
      if (manic) { ctx.globalAlpha = 0.9; ctx.font = "900 " + Math.round(js * 0.16) + "px system-ui,sans-serif"; ctx.fillStyle = "#ff3a4a"; ctx.textAlign = "center"; ctx.fillText("HA", jx - js * 0.55 + Math.sin(t * 20) * 4, jy - js * 0.45); ctx.fillText("HA", jx + js * 0.55 + Math.cos(t * 22) * 4, jy - js * 0.3); ctx.globalAlpha = 1; }
    }
    if (G.slip > 0) { ctx.globalAlpha = Math.min(1, G.slip * 1.6); var fg = ctx.createRadialGradient(jx, jy, 2, jx, jy, js * 1.4); fg.addColorStop(0, "rgba(255,250,230,.95)"); fg.addColorStop(1, "rgba(255,215,120,0)"); ctx.fillStyle = fg; ctx.fillRect(jx - js * 1.5, jy - js * 1.5, js * 3, js * 3); ctx.globalAlpha = 1; }
    // the lasso
    if (king && (G.rope > 0 || G.lasso > 0)) {
      var hx = jx + (G.jv > 0 ? 1 : -1) * js * 0.35, hy = jy - js * 0.35, k2 = G.rope > 0 ? 1 - G.rope / 0.5 : 1;
      var ex = hx + (G.px - hx) * k2, ey = hy + (PY() - hy) * k2;
      ctx.strokeStyle = "#d8b27a"; ctx.lineWidth = 3; ctx.setLineDash([7, 4]); ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo((hx + ex) / 2, Math.min(hy, ey) - 50, ex, ey); ctx.stroke(); ctx.setLineDash([]);
      if (G.lasso > 0) { ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(G.px, PY(), 30, 16, 0, 0, Math.PI * 2); ctx.stroke(); }
    }
    // falling things
    (G.drops || []).forEach(function (d) { var pw = d.type === "magnet" || d.type === "shield" || d.type === "slow"; if (pw) { ctx.fillStyle = "rgba(120,200,255,.25)"; ctx.beginPath(); ctx.arc(d.x, d.y, 19 + Math.sin(t * 8) * 2, 0, Math.PI * 2); ctx.fill(); }
      emoji({ gem: "💎", card: "🃏", mask: "🎭", crown: "👑", magnet: "🧲", shield: "🛡️", slow: "⏳" }[d.type], d.x, d.y, d.type === "crown" ? 26 : 24, d.type === "card" ? d.rot : 0); });
    // stingers
    ctx.strokeStyle = "#ffe7a3"; ctx.lineWidth = 3; ctx.shadowColor = "#ffd77a"; ctx.shadowBlur = 10;
    (G.sx || []).forEach(function (s) { ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x, s.y + 14); ctx.stroke(); });
    ctx.shadowBlur = 0;
    // the scorpion
    if (G.playing || G.end) { ctx.save(); if (G.conf > 0) { ctx.globalAlpha = 0.7 + Math.sin(t * 20) * 0.3; } if (G.lasso > 0) { drawScorp(G.px, PY(), 54, Math.PI + Math.sin(t * 14) * 0.3); ctx.restore(); emoji("😳", G.px, (PY() - 36), 20); } else { drawScorp(G.px, PY(), 64); ctx.restore(); } if (G.conf > 0) emoji("🎭", G.px + 22, (PY() - 24), 16); }
    if (G.playing && G.shield > 0) { ctx.strokeStyle = "rgba(140,210,255,.85)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(G.px, PY(), 32 + Math.sin(t * 6) * 2, 0, Math.PI * 2); ctx.stroke(); }
    if (G.playing && G.mag > 0) { ctx.strokeStyle = "rgba(255,90,90,.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(G.px, PY(), 46 + (t * 60) % 40, 0, Math.PI * 2); ctx.stroke(); }
    (G.floats || []).forEach(function (f) { ctx.globalAlpha = Math.min(1, f.life * 2); ctx.font = "900 16px system-ui,sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = f.col; ctx.strokeStyle = "rgba(0,0,0,.7)"; ctx.lineWidth = 3; ctx.strokeText(f.t, f.x, f.y); ctx.fillText(f.t, f.x, f.y); }); ctx.globalAlpha = 1;
    // particles and speech
    (G.parts || []).forEach(function (p) { ctx.globalAlpha = Math.max(0, p.life); emoji(p.ch, p.x, p.y, 16); }); ctx.globalAlpha = 1;
    (G.bubbles || []).forEach(function (b) {
      ctx.globalAlpha = Math.min(1, b.life * 2); ctx.font = (b.small ? 600 : 700) + " " + (b.small ? 12 : 14) + "px system-ui,sans-serif";
      var w = ctx.measureText(b.t).width + 18, bx = Math.max(w / 2 + 6, Math.min(W - w / 2 - 6, b.x));
      ctx.fillStyle = b.small ? "rgba(10,4,8,.85)" : "rgba(255,243,214,.95)"; ctx.strokeStyle = "#c9a45c"; ctx.lineWidth = 1;
      roundRect(bx - w / 2, b.y - 13, w, 26, 13); ctx.fill(); ctx.stroke();
      ctx.fillStyle = b.small ? "#ffe7a3" : "#3a0610"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(b.t, bx, b.y);
    }); ctx.globalAlpha = 1;
    ctx.restore();
  }
  // his arms: right wrist a silver watch with a black dial, "13" inked on the arm and palm; left wrist silver with a blue dial, "15"
  function drawArms(js, t, manic) {
    [[-1, "#111318", "13", "#7b3fb8"], [1, "#1d4fd6", "15", "#e8892a"]].forEach(function (A) {
      var sd = A[0], sw = manic ? Math.sin(t * 25 + sd) * 0.9 : Math.sin(t * 2.4 + sd) * 0.25;
      ctx.save(); ctx.translate(sd * js * 0.36, js * 0.08); ctx.rotate(-sd * (0.75 + sw));
      var L = js * 0.5, wdt = Math.max(11, js * 0.13);
      ctx.fillStyle = A[3]; roundRect(-wdt / 2, 0, wdt, L * 0.45, wdt / 2); ctx.fill();   // sleeve
      ctx.fillStyle = "#e9c6a0"; roundRect(-wdt * 0.42, L * 0.4, wdt * 0.84, L * 0.48, wdt * 0.4); ctx.fill();   // forearm
      ctx.save(); ctx.translate(0, L * 0.6); ctx.rotate(sd * (0.75 + sw)); ctx.fillStyle = "#1a1a2a"; ctx.font = "800 " + Math.max(7, Math.round(js * 0.075)) + "px system-ui,sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(A[2], 0, 0); ctx.restore();   // arm tattoo
      var wy = L * 0.82, band = ctx.createLinearGradient(-wdt, 0, wdt, 0); band.addColorStop(0, "#8d939c"); band.addColorStop(0.5, "#ffffff"); band.addColorStop(1, "#9aa1aa");
      ctx.fillStyle = band; ctx.fillRect(-wdt * 0.6, wy - wdt * 0.25, wdt * 1.2, wdt * 0.5);   // silver bracelet
      ctx.beginPath(); ctx.arc(0, wy, wdt * 0.62, 0, Math.PI * 2); ctx.fill();   // silver case
      ctx.fillStyle = A[1]; ctx.beginPath(); ctx.arc(0, wy, wdt * 0.45, 0, Math.PI * 2); ctx.fill();   // dial
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, wy); ctx.lineTo(Math.cos(t) * wdt * 0.35, wy + Math.sin(t) * wdt * 0.35); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.beginPath(); ctx.arc(-wdt * 0.2, wy - wdt * 0.2, 1.2, 0, Math.PI * 2); ctx.fill();   // glint
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, L + wdt * 0.2, wdt * 0.62, 0, Math.PI * 2); ctx.fill();   // open palm
      ctx.fillStyle = "#1a1a2a"; ctx.font = "800 " + Math.max(6, Math.round(js * 0.06)) + "px system-ui,sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(A[2], 0, L + wdt * 0.2);   // palm tattoo
      ctx.restore();
    });
  }
  var scorp = null;
  function purpleScorpion() {   // the scorpion emoji tinted royal purple, keeping its shading
    if (scorp) return scorp;
    scorp = document.createElement("canvas"); scorp.width = scorp.height = 160; var c = scorp.getContext("2d");
    c.font = "130px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("🦂", 80, 86);
    c.globalCompositeOperation = "source-atop"; var g = c.createLinearGradient(0, 0, 160, 160); g.addColorStop(0, "rgba(200,120,255,.78)"); g.addColorStop(1, "rgba(110,40,200,.78)"); c.fillStyle = g; c.fillRect(0, 0, 160, 160);
    return scorp;
  }
  function drawScorp(x, y, size, rot) { ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.shadowColor = "rgba(190,110,255,.9)"; ctx.shadowBlur = 16; ctx.drawImage(purpleScorpion(), -size / 2, -size / 2, size, size); ctx.restore(); }
  var horse = null;
  function blackHorse() {
    if (horse) return horse;
    horse = document.createElement("canvas"); horse.width = horse.height = 160; var h = horse.getContext("2d");
    h.font = "130px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif"; h.textAlign = "center"; h.textBaseline = "middle"; h.fillText("🐎", 80, 86);
    h.globalCompositeOperation = "source-atop"; var g = h.createLinearGradient(0, 20, 0, 150); g.addColorStop(0, "#3a3a46"); g.addColorStop(0.5, "#0e0e14"); g.addColorStop(1, "#050507"); h.fillStyle = g; h.fillRect(0, 0, 160, 160);
    return horse;
  }
  function drawKing(x, y, js, t) {
    var dir = G.jv > 0 ? 1 : -1, hs = js * 1.25, gal = Math.sin(t * 9);
    // four wives, royal and happy, close beside him, hearts rising
    var Q = ["👸🏻", "👸🏽", "👸🏾", "👸"], pos = [-1.2, -0.62, 0.62, 1.2];
    var GOWN = [["#ff6fae", "#b0145e"], ["#6fc7ff", "#1e5fb0"], ["#ffd36b", "#c07a10"], ["#b98cff", "#5a2bb0"]];
    function wives(inner) { pos.forEach(function (p, i) { if ((Math.abs(p) < 1) !== inner) return;
      var hs2 = js * 0.36, qx = Math.max(js * 0.24, Math.min(W - js * 0.24, x + p * js)), qy = y + js * 0.32 + Math.sin(t * 5 + i) * 3;
      // royal gown (full figure, not just a face)
      var gw = hs2 * 1.25, gh = hs2 * 1.35, top = qy + hs2 * 0.32, gg = ctx.createLinearGradient(0, top, 0, top + gh); gg.addColorStop(0, GOWN[i][0]); gg.addColorStop(1, GOWN[i][1]);
      ctx.save(); ctx.shadowColor = "rgba(255,230,170,.75)"; ctx.shadowBlur = 14; ctx.fillStyle = gg;
      ctx.beginPath(); ctx.moveTo(qx - gw * 0.22, top); ctx.lineTo(qx + gw * 0.22, top); ctx.quadraticCurveTo(qx + gw * 0.3, top + gh * 0.5, qx + gw * 0.55, top + gh); ctx.lineTo(qx - gw * 0.55, top + gh); ctx.quadraticCurveTo(qx - gw * 0.3, top + gh * 0.5, qx - gw * 0.22, top); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "#ffe7a3"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(qx - gw * 0.55, top + gh - 3); ctx.lineTo(qx + gw * 0.55, top + gh - 3); ctx.stroke();   // gold hem
      ctx.beginPath(); ctx.moveTo(qx - gw * 0.18, top + gh * 0.22); ctx.lineTo(qx + gw * 0.18, top + gh * 0.22); ctx.stroke();   // gold sash
      ctx.save(); ctx.globalAlpha = 0.9; var lg = ctx.createRadialGradient(qx, qy, 1, qx, qy, hs2 * 0.75); lg.addColorStop(0, "rgba(255,248,225,.95)"); lg.addColorStop(1, "rgba(255,248,225,0)"); ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(qx, qy, hs2 * 0.75, 0, Math.PI * 2); ctx.fill(); ctx.restore();   // soft light on her face
      emoji(Q[i], qx, qy, hs2); emoji("💎", qx, top + gh * 0.22, hs2 * 0.28);
      var hh = (t * 0.8 + i * 0.25) % 1; ctx.globalAlpha = 1 - hh; emoji("💕", qx + hs2 * 0.45, qy - hs2 * 0.5 - hh * js * 0.4, js * 0.13); ctx.globalAlpha = 1; }); }
    wives(false);
    // the black horse
    ctx.save(); ctx.translate(x, y + js * 0.3 + gal * 2); ctx.scale(-dir, 1); ctx.rotate(gal * 0.05);
    ctx.shadowColor = "rgba(255,215,120,.6)"; ctx.shadowBlur = 14; ctx.drawImage(blackHorse(), -hs / 2, -hs / 2, hs, hs); ctx.restore(); ctx.shadowBlur = 0;
    // the armoured King
    var ky = y - js * 0.12 + gal * 2;
    ctx.fillStyle = "#8a0f1f"; ctx.beginPath(); ctx.moveTo(x - js * 0.16, ky); ctx.lineTo(x + js * 0.16, ky); ctx.lineTo(x - dir * js * 0.32, ky + js * 0.38); ctx.closePath(); ctx.fill();   // cape
    var ar = ctx.createLinearGradient(x - js * 0.14, 0, x + js * 0.14, 0); ar.addColorStop(0, "#7d8590"); ar.addColorStop(0.5, "#f4f6fa"); ar.addColorStop(1, "#7d8590");
    ctx.fillStyle = ar; roundRect(x - js * 0.14, ky - js * 0.04, js * 0.28, js * 0.3, js * 0.06); ctx.fill();   // breastplate
    ctx.strokeStyle = "#c9a45c"; ctx.lineWidth = 1.5; ctx.stroke();
    emoji("🤴", x, ky - js * 0.17, js * 0.32);
    emoji("🛡️", x - dir * js * 0.22, ky + js * 0.1, js * 0.24);
    emoji("🗡️", x + dir * js * 0.26, ky - js * 0.14, js * 0.24, dir * (-0.6 + Math.sin(t * 4) * 0.2));
    wives(true);   // the two closest lean in against him
    // rearing sparkle trail
    for (var i = 0; i < 3; i++) { ctx.globalAlpha = 0.5 - i * 0.15; emoji("✨", x - dir * js * (0.6 + i * 0.2), y + js * 0.55, js * 0.12); } ctx.globalAlpha = 1;
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  function paintHud() {
    hud.innerHTML = "<span>⭐ <b>" + G.score + "</b></span>" + (G.combo >= 3 ? '<span class="jg__fire">🔥 ×' + Math.min(5, 1 + Math.floor((G.combo - 1) / 3)) + " combo " + G.combo + "</span>" : "") + (G.mag > 0 ? "<span>🧲 " + Math.ceil(G.mag) + "s</span>" : "") + (G.slow > 0 ? "<span>⏳ " + Math.ceil(G.slow) + "s</span>" : "") + (G.shield > 0 ? "<span>🛡️ ready</span>" : "") + "<span>💎 <b>" + G.gems + "</b></span><span>🗡️ hits <b>" + G.hits + "</b></span><span>⏱ <b>" + Math.max(0, Math.ceil(G.left)) + "</b>s</span>" + (G.conf > 0 ? '<span class="jg__conf">🎭 flipped!</span>' : "") + (G.mode === "king" ? '<span class="jg__king">👑 KING MODE</span>' : G.mode === "manic" ? '<span class="jg__manic">🤪 MANIC</span>' : "") + (G.humil ? "<span>😳 lassoed <b>" + G.humil + "</b></span>" : "");
  }

  /* ---------- start, pause, verdict ---------- */
  function start() {
    reset(); G.end = null; G.playing = true; G.paused = false; ov.hidden = true; box.classList.add("on"); hud.hidden = false; sting.hidden = false; pz.hidden = false; pad.hidden = false; document.body.classList.add("jg-playing"); pz.textContent = "⏸";
    var rb = box.getBoundingClientRect(); if (rb.top < 0 || rb.bottom > innerHeight) box.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); AC.resume(); } catch (e) {}   // unlock sound on this tap
    paintHud(); last = 0; G.end = null;
  }
  function pause() { if (!G.playing || G.paused) return; G.paused = true; pz.textContent = "▶"; show('<b class="jg__t">⏸ Court adjourned</b><p>Press ▶, P or Space to resume.</p>', "▶ Resume", resume); }
  function resume() { if (!G.paused) return; G.paused = false; ov.hidden = true; last = 0; pz.textContent = "⏸"; }
  function finish() {
    G.playing = false; box.classList.remove("on"); document.body.classList.remove("jg-playing"); sting.hidden = true; pz.hidden = true; pad.hidden = true; keys = {}; SFX.gavel();
    var best = Number(store("jg-best2") || 0), won = G.hits === 0 && G.gems >= 10, newBest = G.score > best;
    if (newBest) { best = G.score; store("jg-best2", String(best)); }
    var stars = G.score >= 45 ? 3 : G.score >= 25 ? 2 : G.score >= 10 ? 1 : 0;
    if (won) { var w = Number(store("jg-wins") || 0) + 1; store("jg-wins", String(w)); }
    G.end = true; draw(0);
    var html = '<div class="jg__gavel" aria-hidden="true">🔨</div><b class="jg__t">⚖️ The Verdict · فیصلہ</b><div class="jg__stars" aria-label="' + stars + ' of 3 stars">' + [0, 1, 2].map(function (i) { return '<i class="' + (i < stars ? "on" : "") + '" style="animation-delay:' + (0.3 + i * 0.25) + 's">★</i>'; }).join("") + "</div>";
    if (won) html += "<p>👑 <b>You refused to fight on his terms.</b> You caught " + G.gems + " diamonds and never struck the fool. You beat the jester at his own game.</p><p class='jg__ur' lang='ur' dir='rtl'>تم نے اس کی شرطوں پر لڑنے سے انکار کیا، اور مسخرے کو اسی کے کھیل میں ہرا دیا۔</p>";
    else if (G.hits) html += "<p>You struck the jester <b>" + G.hits + "</b> " + (G.hits === 1 ? "time" : "times") + ", and he let you. While you celebrated, he quietly gathered <b>" + G.secrets + " secrets 💎</b> about you.</p><p><b>The jester wins.</b> 🤡</p><p class='jg__ur' lang='ur' dir='rtl'>تم جیت کا جشن مناتے رہے، اور مسخرہ خاموشی سے تمہارے راز جمع کرتا رہا۔</p><p class='jg__hint'>Hint: the truest power belongs to the one who knows exactly when to lose.</p>";
    else html += "<p>You held back and never struck him. Wise. But you caught only <b>" + G.gems + "</b> diamonds. Catch <b>10</b> without striking the fool to win.</p>";
    if (G.humil) html += "<p>🐎 The King rode out on his black horse and lassoed you <b>" + G.humil + "</b> " + (G.humil === 1 ? "time" : "times") + ", in front of his four queens. 😳</p>";
    html += "<p class='jg__best'>⭐ Score <b>" + G.score + "</b>" + (newBest ? " · 🏆 new best!" : " · best " + best) + " · 💎 " + G.gems + " diamonds</p>";
    show(html, "↻ Play again", start);
  }
  function show(html, label, fn) {
    ov.innerHTML = '<div class="jg__card">' + html + '<button type="button" class="jg__go">' + label + "</button></div>";
    ov.hidden = false; ov.querySelector(".jg__go").onclick = fn;
  }
  box.querySelector(".jg__go").onclick = start;

  // pause when the game scrolls away or the tab is hidden
  function inView() { var r = box.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (!vis) setTimeout(function () { if (!inView()) pause(); }, 700); }, { threshold: 0.2 }).observe(box);   /* ignore brief layout shifts */
  else vis = true;
  document.addEventListener("visibilitychange", function () { if (document.hidden) pause(); });
  img.onload = function () { if (!G.playing) draw(0); };
  draw(0); raf = requestAnimationFrame(loop);
})();

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
  });
  window.addEventListener("keyup", function (e) { delete keys[e.key.toLowerCase()]; });
  var downX = 0, downT = 0;
  cv.addEventListener("pointerdown", function (e) {
    if (!G.playing) return;
    if (G.paused) { resume(); return; }
    var r = cv.getBoundingClientRect(); downX = e.clientX; downT = Date.now(); G.tx = e.clientX - r.left;
    cv.setPointerCapture && cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener("pointermove", function (e) { if (!G.playing || G.paused || !e.buttons && e.pointerType === "mouse") return; var r = cv.getBoundingClientRect(); G.tx = e.clientX - r.left; });
  cv.addEventListener("pointerup", function (e) { if (G.playing && !G.paused && Math.abs(e.clientX - downX) < 12 && Date.now() - downT < 300) fire(); });
  sting.addEventListener("pointerdown", function (e) { e.preventDefault(); if (G.paused) resume(); else fire(); });
  sting.addEventListener("click", function (e) { if (e.detail === 0) fire(); });

  function fire() {
    if (!G.playing || G.paused || G.cool > 0) return;
    if (G.lasso > 0) return;
    G.cool = 0.28; G.sx.push({ x: G.px, y: H - 58 });
    if (navigator.vibrate) try { navigator.vibrate(8); } catch (e) {}
  }

  /* ---------- game loop ---------- */
  var last = 0, raf = 0, vis = false;
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    var dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    if (!vis) return;
    if (G.playing && !G.paused) { step(dt); draw(dt); }
    else if (!G.playing && !G.end) draw(0);   // title screen: the court idles
  }
  function step(dt) {
    G.t += dt; G.left -= dt; G.cool -= dt; G.conf -= dt; G.jflash -= dt; G.jfall -= dt; G.shake = Math.max(0, G.shake - dt * 30);
    // player
    var k = (keys.arrowleft || keys.a ? -1 : 0) + (keys.arrowright || keys.d ? 1 : 0);
    if (k) G.tx = G.px + k * 400 * dt * (G.conf > 0 ? -1 : 1);
    var target = G.conf > 0 && !k ? W - G.tx : G.tx;
    if (G.lasso > 0) { G.lasso -= dt; target = G.jx; G.tx = G.px; }
    G.px += (Math.max(24, Math.min(W - 24, target)) - G.px) * Math.min(1, dt * (G.lasso > 0 ? 3 : 12));
    G.slip -= dt; G.rope -= dt;
    // moods: the fool, the manic fool, and the King underneath
    if (G.mode === "jester") {
      G.nextManic -= dt; G.nextKing -= dt;
      if (G.nextKing <= 0) { G.mode = "king"; G.modeT = 7; G.slip = 0.7; G.thrown = false; G.shake = 12; G.drops = []; say("…the suit slips! Behold, the King 👑", G.jx, H * 0.12); burst(G.jx, H * 0.3, "🃏", 6); burst(G.jx, H * 0.3, "✨", 6); }
      else if (G.nextManic <= 0) { G.mode = "manic"; G.modeT = 2.8; G.burstT = 0; say(MANIC[Math.floor(Math.random() * MANIC.length)], G.jx, H * 0.06); }
    } else {
      G.modeT -= dt;
      if (G.mode === "king" && !G.thrown && G.modeT < 4.6) { G.thrown = true; G.rope = 0.5; }
      if (G.mode === "king" && G.thrown && G.rope <= 0 && G.rope > -dt * 1.5 && G.lasso <= 0) {
        G.lasso = 2.4; G.humil++; G.gems = Math.max(0, G.gems - 2); G.shake = 10;
        say("😳 Lassoed and humiliated! −2 💎", G.px, H - 90, 1); say(KINGL[G.humil % KINGL.length], G.jx, H * 0.2);
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
      var r = Math.random(), type = r < 0.5 ? "gem" : r < 0.72 ? "card" : r < 0.92 ? "mask" : "crown";
      G.drops.push({ x: G.jx + (Math.random() - 0.5) * js * 0.6, y: jy + js * 0.3, vy: 110 + Math.random() * 60 + G.t * 2.2, vx: (Math.random() - 0.5) * 60, type: type, rot: 0 });
    }
    // stingers
    for (var i = G.sx.length - 1; i >= 0; i--) {
      var s = G.sx[i]; s.y -= 520 * dt;
      if (Math.abs(s.x - G.jx) < js * 0.42 && Math.abs(s.y - jy) < js * 0.45) {
        G.sx.splice(i, 1);
        if (G.mode === "king") { say("🛡️ Blocked by the King's shield", G.jx, jy - js * 0.7, 1); burst(s.x, s.y, "✨", 3); continue; } G.hits++; G.secrets += 3; G.jflash = 0.25; G.jfall = 0.6; G.shake = 6;
        say(HIT[G.hits % HIT.length], G.jx, jy - js * 0.6);
        burst(G.jx, jy, "💎", 3);
        continue;
      }
      if (s.y < -10) G.sx.splice(i, 1);
    }
    // falling things
    var py = H - 40;
    for (i = G.drops.length - 1; i >= 0; i--) {
      var d = G.drops[i]; d.y += d.vy * dt; d.x += d.vx * dt; d.rot += dt * 3;
      if (Math.abs(d.x - G.px) < 30 && Math.abs(d.y - py) < 28) {
        G.drops.splice(i, 1);
        if (d.type === "gem") { G.gems++; burst(d.x, d.y, "✦", 4); }
        else if (d.type === "crown") { G.gems += 5; burst(d.x, d.y, "👑", 3); say("+5 💎 royal treasure!", d.x, d.y - 30, 1); }
        else if (d.type === "card") { G.gems = Math.max(0, G.gems - 1); G.shake = 10; say("🃏 The card cut you! −1 💎", d.x, d.y - 30, 1); if (navigator.vibrate) try { navigator.vibrate(60); } catch (e) {} }
        else { G.conf = 3; say("🎭 A false weakness! Controls flipped", d.x, d.y - 30, 1); }
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
  function jyNow() { return G.mode === "king" ? H * 0.44 + Math.sin(G.t * 9) * 3 : H * 0.2 + Math.sin((G.t || 0) * 2) * 8; }
  function jsize() { return Math.min(W * 0.26, H * 0.3, 150); }
  function say(t, x, y, small) { G.bubbles = G.bubbles.filter(function (b) { return b.small !== !!small; }); /* one jester line and one game note at a time */ G.bubbles.push({ t: t, x: x, y: y, life: 2, small: !!small }); }
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
      var ex = hx + (G.px - hx) * k2, ey = hy + (H - 40 - hy) * k2;
      ctx.strokeStyle = "#d8b27a"; ctx.lineWidth = 3; ctx.setLineDash([7, 4]); ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo((hx + ex) / 2, Math.min(hy, ey) - 50, ex, ey); ctx.stroke(); ctx.setLineDash([]);
      if (G.lasso > 0) { ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(G.px, H - 40, 30, 16, 0, 0, Math.PI * 2); ctx.stroke(); }
    }
    // falling things
    (G.drops || []).forEach(function (d) { emoji({ gem: "💎", card: "🃏", mask: "🎭", crown: "👑" }[d.type], d.x, d.y, d.type === "crown" ? 26 : 24, d.type === "card" ? d.rot : 0); });
    // stingers
    ctx.strokeStyle = "#ffe7a3"; ctx.lineWidth = 3; ctx.shadowColor = "#ffd77a"; ctx.shadowBlur = 10;
    (G.sx || []).forEach(function (s) { ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x, s.y + 14); ctx.stroke(); });
    ctx.shadowBlur = 0;
    // the scorpion
    if (G.playing || G.end) { ctx.save(); if (G.conf > 0) { ctx.globalAlpha = 0.7 + Math.sin(t * 20) * 0.3; } if (G.lasso > 0) { emoji("🦂", G.px, H - 40, 34, Math.PI + Math.sin(t * 14) * 0.3); ctx.restore(); emoji("😳", G.px, H - 76, 20); } else { emoji("🦂", G.px, H - 40, 40); ctx.restore(); } if (G.conf > 0) emoji("🎭", G.px + 22, H - 64, 16); }
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
    function wives(inner) { pos.forEach(function (p, i) { if ((Math.abs(p) < 1) !== inner) return; var qx = Math.max(js * 0.18, Math.min(W - js * 0.18, x + p * js)), qy = y + js * 0.5 + Math.sin(t * 5 + i) * 3; emoji(Q[i], qx, qy, js * 0.3); emoji("💎", qx + js * 0.1, qy - js * 0.2, js * 0.1); var hh = (t * 0.8 + i * 0.25) % 1; ctx.globalAlpha = 1 - hh; emoji("💕", qx, qy - js * 0.25 - hh * js * 0.4, js * 0.13); ctx.globalAlpha = 1; }); }
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
    hud.innerHTML = "<span>💎 <b>" + G.gems + "</b></span><span>🗡️ hits <b>" + G.hits + "</b></span><span>⏱ <b>" + Math.max(0, Math.ceil(G.left)) + "</b>s</span>" + (G.conf > 0 ? '<span class="jg__conf">🎭 flipped!</span>' : "") + (G.mode === "king" ? '<span class="jg__king">👑 KING MODE</span>' : G.mode === "manic" ? '<span class="jg__manic">🤪 MANIC</span>' : "") + (G.humil ? "<span>😳 lassoed <b>" + G.humil + "</b></span>" : "");
  }

  /* ---------- start, pause, verdict ---------- */
  function start() {
    reset(); G.end = null; G.playing = true; G.paused = false; ov.hidden = true; box.classList.add("on"); hud.hidden = false; sting.hidden = false;
    paintHud(); last = 0; G.end = null;
  }
  function pause() { if (!G.playing || G.paused) return; G.paused = true; show('<b class="jg__t">⏸ Court adjourned</b><p>Tap to resume.</p>', "▶ Resume", resume); }
  function resume() { if (!G.paused) return; G.paused = false; ov.hidden = true; last = 0; }
  function finish() {
    G.playing = false; box.classList.remove("on"); sting.hidden = true;
    var best = Number(store("jg-best") || 0), won = G.hits === 0 && G.gems >= 10;
    if (G.gems > best) { best = G.gems; store("jg-best", String(best)); }
    if (won) { var w = Number(store("jg-wins") || 0) + 1; store("jg-wins", String(w)); }
    G.end = true; draw(0);
    var html = '<div class="jg__gavel" aria-hidden="true">🔨</div><b class="jg__t">⚖️ The Verdict · فیصلہ</b>';
    if (won) html += "<p>👑 <b>You refused to fight on his terms.</b> You caught " + G.gems + " diamonds and never struck the fool. You beat the jester at his own game.</p><p class='jg__ur' lang='ur' dir='rtl'>تم نے اس کی شرطوں پر لڑنے سے انکار کیا، اور مسخرے کو اسی کے کھیل میں ہرا دیا۔</p>";
    else if (G.hits) html += "<p>You struck the jester <b>" + G.hits + "</b> " + (G.hits === 1 ? "time" : "times") + ", and he let you. While you celebrated, he quietly gathered <b>" + G.secrets + " secrets 💎</b> about you.</p><p><b>The jester wins.</b> 🤡</p><p class='jg__ur' lang='ur' dir='rtl'>تم جیت کا جشن مناتے رہے، اور مسخرہ خاموشی سے تمہارے راز جمع کرتا رہا۔</p><p class='jg__hint'>Hint: the truest power belongs to the one who knows exactly when to lose.</p>";
    else html += "<p>You held back and never struck him. Wise. But you caught only <b>" + G.gems + "</b> diamonds. Catch <b>10</b> without striking the fool to win.</p>";
    if (G.humil) html += "<p>🐎 The King rode out on his black horse and lassoed you <b>" + G.humil + "</b> " + (G.humil === 1 ? "time" : "times") + ", in front of his four queens. 😳</p>";
    html += "<p class='jg__best'>💎 This round " + G.gems + " · best " + best + "</p>";
    show(html, "↻ Play again", start);
  }
  function show(html, label, fn) {
    ov.innerHTML = '<div class="jg__card">' + html + '<button type="button" class="jg__go">' + label + "</button></div>";
    ov.hidden = false; ov.querySelector(".jg__go").onclick = fn;
  }
  box.querySelector(".jg__go").onclick = start;

  // pause when the game scrolls away or the tab is hidden
  function inView() { var r = box.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (!vis) pause(); }, { threshold: 0.2 }).observe(box);
  else vis = true;
  document.addEventListener("visibilitychange", function () { if (document.hidden) pause(); });
  img.onload = function () { if (!G.playing) draw(0); };
  draw(0); raf = requestAnimationFrame(loop);
})();

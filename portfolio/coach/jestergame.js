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
  var G = { playing: false, paused: false };
  window.__jg = G;

  function reset() {
    G.t = 0; G.left = 45; G.gems = 0; G.hits = 0; G.secrets = 0; G.conf = 0; G.shake = 0;
    G.px = W / 2; G.tx = W / 2; G.sx = []; G.drops = []; G.parts = []; G.bubbles = [];
    G.jx = W / 2; G.jv = 90; G.jflash = 0; G.jfall = 0; G.nextDrop = 0.8; G.nextTaunt = 3; G.cool = 0; G.end = null;
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
    G.px += (Math.max(24, Math.min(W - 24, target)) - G.px) * Math.min(1, dt * 12);
    // jester glides and dodges a little
    var js = jsize(), lvl = 1 + G.t / 20;
    G.jx += G.jv * lvl * dt; if (G.jx < js * 0.6 || G.jx > W - js * 0.6) { G.jv *= -1; G.jx = Math.max(js * 0.6, Math.min(W - js * 0.6, G.jx)); }
    if (Math.random() < dt * 0.6) G.jv *= -1;
    var jy = H * 0.2 + Math.sin(G.t * 2) * 8;
    // drops
    G.nextDrop -= dt;
    if (G.nextDrop <= 0) {
      G.nextDrop = Math.max(0.35, 1.1 - G.t / 60) * (0.6 + Math.random() * 0.8);
      var r = Math.random(), type = r < 0.5 ? "gem" : r < 0.72 ? "card" : r < 0.92 ? "mask" : "crown";
      G.drops.push({ x: G.jx + (Math.random() - 0.5) * js * 0.6, y: jy + js * 0.3, vy: 110 + Math.random() * 60 + G.t * 2.2, vx: (Math.random() - 0.5) * 60, type: type, rot: 0 });
    }
    // stingers
    for (var i = G.sx.length - 1; i >= 0; i--) {
      var s = G.sx[i]; s.y -= 520 * dt;
      if (Math.abs(s.x - G.jx) < js * 0.42 && Math.abs(s.y - jy) < js * 0.45) {
        G.sx.splice(i, 1); G.hits++; G.secrets += 3; G.jflash = 0.25; G.jfall = 0.6; G.shake = 6;
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
    var js = jsize(), jy = H * 0.2 + Math.sin(t * 2) * 8, jx = G.playing || G.end ? G.jx : W / 2;
    var spot = ctx.createLinearGradient(0, 0, 0, jy + js); spot.addColorStop(0, "rgba(255,240,200,.25)"); spot.addColorStop(1, "rgba(255,240,200,0)");
    ctx.fillStyle = spot; ctx.beginPath(); ctx.moveTo(jx - 14, 0); ctx.lineTo(jx + 14, 0); ctx.lineTo(jx + js * 0.8, jy + js * 0.7); ctx.lineTo(jx - js * 0.8, jy + js * 0.7); ctx.fill();
    var orbit = Math.min(14, 4 + Math.floor((G.secrets || 0) / 2));
    for (var o = 0; o < orbit; o++) { var a = t * 1.4 + o / orbit * Math.PI * 2; emoji("💎", jx + Math.cos(a) * js * 0.62, jy + Math.sin(a) * js * 0.5, 13 + (G.secrets > 20 ? 4 : 0)); }
    ctx.save(); ctx.translate(jx, jy);
    var fall = G.jfall > 0 ? Math.sin((0.6 - G.jfall) / 0.6 * Math.PI) : 0;
    ctx.rotate(Math.sin(t * 2.6) * 0.08 + fall * 0.5); ctx.translate(0, fall * 10);
    if (img.complete && img.naturalWidth) { ctx.imageSmoothingEnabled = false; ctx.shadowColor = G.jflash > 0 ? "rgba(255,60,60,.95)" : "rgba(180,90,255,.8)"; ctx.shadowBlur = 18; ctx.drawImage(img, -js / 2, -js / 2, js, js * img.naturalHeight / img.naturalWidth); }
    else emoji("🃏", 0, 0, js * 0.7);
    ctx.restore();
    // falling things
    (G.drops || []).forEach(function (d) { emoji({ gem: "💎", card: "🃏", mask: "🎭", crown: "👑" }[d.type], d.x, d.y, d.type === "crown" ? 26 : 24, d.type === "card" ? d.rot : 0); });
    // stingers
    ctx.strokeStyle = "#ffe7a3"; ctx.lineWidth = 3; ctx.shadowColor = "#ffd77a"; ctx.shadowBlur = 10;
    (G.sx || []).forEach(function (s) { ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x, s.y + 14); ctx.stroke(); });
    ctx.shadowBlur = 0;
    // the scorpion
    if (G.playing || G.end) { ctx.save(); if (G.conf > 0) { ctx.globalAlpha = 0.7 + Math.sin(t * 20) * 0.3; } emoji("🦂", G.px, H - 40, 40); ctx.restore(); if (G.conf > 0) emoji("🎭", G.px + 22, H - 64, 16); }
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
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  function paintHud() {
    hud.innerHTML = "<span>💎 <b>" + G.gems + "</b></span><span>🗡️ hits <b>" + G.hits + "</b></span><span>⏱ <b>" + Math.max(0, Math.ceil(G.left)) + "</b>s</span>" + (G.conf > 0 ? '<span class="jg__conf">🎭 flipped!</span>' : "");
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

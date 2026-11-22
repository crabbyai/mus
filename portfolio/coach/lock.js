/* Passcode lock for the visitor stats: an iPhone-style keypad plus a keyboard option.
   Usage: coachLock(container, onUnlock). Remembers the unlock on this device. */
(function () {
  "use strict";
  var KEY = "coach-vk";
  var T9 = { 2: "ABC", 3: "DEF", 4: "GHI", 5: "JKL", 6: "MNO", 7: "PQRS", 8: "TUV", 9: "WXYZ", 0: "+" };
  function h(s) { var x = 0x811c9dc5; s = unescape(encodeURIComponent(s)); for (var i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; } return x; }
  function ok(s) { var v = h(String(s).trim().toLowerCase()); return v === 443645419 || v === 3827109980; }
  function t9(ch) { ch = ch.toUpperCase(); if (/\d/.test(ch)) return ch; for (var d in T9) if (T9[d].indexOf(ch) > -1) return d; return ""; }
  function unlocked() { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } }

  var css = document.createElement("style");
  css.textContent =
    ".lk{display:flex;justify-content:center;margin:14px auto 0;padding:0 16px;position:relative;z-index:2}" +
    ".lk{margin-top:10px}.lk__field{touch-action:manipulation;display:flex;align-items:center;gap:.5rem;width:min(340px,100%);padding:.55rem .9rem;border-radius:999px;border:1px solid rgba(110,230,140,.45);background:rgba(8,20,14,.75);color:#cfeedd;font:600 .85rem system-ui,sans-serif;cursor:pointer;text-align:left}" +
    ".lk__field:hover,.lk__field:focus-visible{border-color:#3dff7a;outline:none;box-shadow:0 0 0 3px rgba(61,255,122,.2)}" +
    ".lk__field span{flex:1;color:#8fb8a0}" +
    ".lko{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:24px 16px;background:rgba(6,10,12,.9);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);touch-action:manipulation;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',system-ui,sans-serif;animation:lkIn .14s ease-out}" +
    "@keyframes lkIn{from{opacity:0}}" +
    ".lko__ic{font-size:1.6rem}.lko__t{font-size:1.15rem;font-weight:500;margin:0}" +
    ".lko__dots{display:flex;gap:18px;height:14px}.lko__dots i{width:13px;height:13px;border-radius:50%;border:1.5px solid #fff;transition:background .12s}.lko__dots i.on{background:#fff}" +
    ".lko__dots.bad,.lko__kb.bad{animation:lkShake .3s}@keyframes lkShake{20%,60%{transform:translateX(-12px)}40%,80%{transform:translateX(12px)}}" +
    ".lko__pad{display:grid;grid-template-columns:repeat(3,78px);gap:16px 24px;margin-top:10px}" +
    ".lko__pad button{width:78px;height:78px;border-radius:50%;border:0;background:rgba(255,255,255,.16);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font:400 2rem/1 inherit;-webkit-tap-highlight-color:transparent;transition:background .08s;touch-action:manipulation;user-select:none;-webkit-user-select:none}" +
    ".lko__pad button:active,.lko__pad button.hit{background:rgba(255,255,255,.45)}" +
    ".lko__pad small{font-size:.6rem;font-weight:700;letter-spacing:.18em;margin-top:2px;opacity:.9}" +
    ".lko__pad .z{grid-column:2}" +
    ".lko__kb{display:none;width:min(300px,100%);gap:8px}.lko.kb .lko__kb{display:flex}.lko.kb .lko__pad,.lko.kb .lko__dots{display:none}" +
    ".lko__kb input{flex:1;min-width:0;padding:.7rem 1rem;border-radius:12px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.12);color:#fff;font:500 1rem inherit;outline:none}" +
    ".lko__kb button{padding:0 1rem;border-radius:12px;border:0;background:#fff;color:#000;font:600 .95rem inherit;cursor:pointer}" +
    ".lko__bar{display:flex;justify-content:space-between;width:min(300px,100%);margin-top:6px}" +
    ".lko__bar button{background:none;border:0;color:#fff;font:500 1rem inherit;cursor:pointer;padding:6px}" +
    "@media(max-height:640px){.lko__pad{grid-template-columns:repeat(3,64px);gap:10px 20px}.lko__pad button{width:64px;height:64px;font-size:1.6rem}}" +
    "@media(prefers-reduced-motion:reduce){.lko,.lko__dots.bad,.lko__kb.bad{animation:none}}";
  document.head.appendChild(css);

  function open(done) {
    if (document.querySelector(".lko")) return;
    var code = "", last = document.activeElement;
    var o = document.createElement("div");
    o.className = "lko"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Enter passcode");
    var keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(function (d) { return '<button type="button" data-d="' + d + '"' + (d === 0 ? ' class="z"' : "") + ">" + d + "<small>" + (T9[d] || "&nbsp;") + "</small></button>"; }).join("");
    o.innerHTML = '<div class="lko__ic" aria-hidden="true">🔒</div><p class="lko__t">Enter Passcode</p>' +
      '<div class="lko__dots" aria-hidden="true">' + "<i></i><i></i><i></i><i></i><i></i><i></i></div>" +
      '<div class="lko__pad">' + keys + "</div>" +
      '<form class="lko__kb"><input type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Password" aria-label="Password"><button>Unlock</button></form>' +
      '<div class="lko__bar"><button type="button" data-a="kb">Keyboard</button><button type="button" data-a="x">Cancel</button></div>';
    document.body.appendChild(o);
    var dots = o.querySelector(".lko__dots"), kb = o.querySelector(".lko__kb"), inp = kb.querySelector("input");
    function paint() { [].forEach.call(dots.children, function (d, i) { d.classList.toggle("on", i < code.length); }); }
    function fail(el) { el.classList.remove("bad"); void el.offsetWidth; el.classList.add("bad"); if (navigator.vibrate) navigator.vibrate(200); }
    function win() { try { localStorage.setItem(KEY, "1"); } catch (e) {} close(); done(); }
    function close() { document.removeEventListener("keydown", onKey, true); o.remove(); if (last && last.focus) last.focus(); }
    function press(d) {
      if (code.length >= 6) return;
      code += d; paint();
      if (code.length === 6) requestAnimationFrame(function () { if (ok(code)) win(); else { fail(dots); code = ""; setTimeout(paint, 200); } });
    }
    function onKey(e) {
      if (e.key === "Escape") { close(); return; }
      if (o.classList.contains("kb")) return;
      if (e.key === "Backspace") { code = code.slice(0, -1); paint(); e.preventDefault(); return; }
      var d = e.key.length === 1 ? t9(e.key) : "";
      if (d) { e.preventDefault(); press(d); var b = o.querySelector('[data-d="' + d + '"]'); if (b) { b.classList.add("hit"); setTimeout(function () { b.classList.remove("hit"); }, 120); } }
    }
    document.addEventListener("keydown", onKey, true);
    o.addEventListener("pointerdown", function (e) {
      var b = e.target.closest("[data-d]"); if (!b) return;
      e.preventDefault(); press(b.dataset.d);
    });
    o.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.d != null) { if (e.detail === 0) press(b.dataset.d); }   // keyboard Enter/Space on a key
      else if (b.dataset.a === "x") close();
      else if (b.dataset.a === "kb") { var on = o.classList.toggle("kb"); b.textContent = on ? "Keypad" : "Keyboard"; if (on) inp.focus(); }
    });
    kb.addEventListener("submit", function (e) { e.preventDefault(); if (ok(inp.value)) win(); else { fail(kb); inp.value = ""; inp.focus(); } });
    var first = o.querySelector(".lko__pad button"); if (first) first.focus();
  }

  window.coachLock = function (mount, onUnlock) {
    if (unlocked()) { onUnlock(); return; }
    var wrap = document.createElement("div");
    wrap.className = "lk";
    wrap.innerHTML = '<button type="button" class="lk__field" aria-label="Unlock visitor stats"><b aria-hidden="true">🔒</b><span>Enter passcode to view live visitors</span><b aria-hidden="true">⌨️</b></button>';
    mount.parentNode.insertBefore(wrap, mount);
    wrap.firstChild.addEventListener("click", function () { open(function () { wrap.remove(); onUnlock(); }); });
    wrap.firstChild.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") { e.preventDefault(); open(function () { wrap.remove(); onUnlock(); }); } });
  };
  window.coachLock.open = open;
})();

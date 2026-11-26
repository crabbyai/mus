/* Apple-style emojis for everyone.
   iPhones and Macs already show Apple emojis. On Android, Windows and other devices this swaps
   each emoji on the page for the matching Apple emoji image (self-hosted in assets/emoji),
   including text added later and emojis drawn in the canvas games (window.appleEmoji). */
(function () {
  "use strict";
  var me = document.currentScript || document.querySelector('script[src*="apple-emoji.js"]');
  var base = me ? me.src.replace(/coach\/apple-emoji\.js.*$/, "assets/emoji/") : "assets/emoji/";
  var force = /[?&]appleemoji\b/.test(location.search);
  var apple = /iPhone|iPad|iPod|Macintosh|Mac OS X/.test(navigator.userAgent) && !force;
  var cache = {};
  window.appleEmoji = function () { return null; };   // canvas helper: an <img> once loaded, otherwise null
  if (apple) return;

  var SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION|SELECT|TITLE|NOSCRIPT|CANVAS|svg|SVG|CODE|PRE)$/;
  var map = null, rx = null;
  var css = document.createElement("style");
  css.textContent = "img.ae{width:1.18em;height:1.18em;vertical-align:-.22em;display:inline-block;margin:0 .02em;object-fit:contain}" +
    ".ae-ic::before{content:none!important}.ae-ic>img.ae{width:1.3em;height:1.3em}" +
    "@media(max-width:700px){.sites--main a.ae-ic>img.ae{width:1.45rem;height:1.45rem}}";
  document.head.appendChild(css);

  function img(ch) {
    var f = map[ch]; if (!f) return null;
    var i = document.createElement("img"); i.className = "ae"; i.alt = ch; i.draggable = false; i.decoding = "async"; i.src = base + f + ".png";
    i.onerror = function () { i.replaceWith(document.createTextNode(ch)); };
    return i;
  }
  function skip(el) {
    for (var n = el; n && n !== document.body; n = n.parentNode) {
      if (n.nodeType !== 1) continue;
      if (SKIP.test(n.nodeName) || n.isContentEditable || (n.classList && (n.classList.contains("lk__ic") || n.classList.contains("lko__ic") || n.classList.contains("no-ae")))) return true;
    }
    return false;
  }
  function swapText(node) {
    var t = node.nodeValue; rx.lastIndex = 0; if (!rx.test(t)) return;
    if (skip(node.parentNode)) return;
    rx.lastIndex = 0; var frag = document.createDocumentFragment(), last = 0, m;
    while ((m = rx.exec(t))) { if (m.index > last) frag.appendChild(document.createTextNode(t.slice(last, m.index))); frag.appendChild(img(m[0]) || document.createTextNode(m[0])); last = m.index + m[0].length; }
    if (last < t.length) frag.appendChild(document.createTextNode(t.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }
  function walk(root) {
    if (!root || root.nodeType === 3) { if (root && root.parentNode) swapText(root); return; }
    if (root.nodeType !== 1 || skip(root)) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), list = [], n;
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (x) { if (x.parentNode) swapText(x); });
    // icons drawn with CSS ::before content (the big site buttons)
    [].forEach.call(root.querySelectorAll ? root.querySelectorAll("[data-ic]:not(.ae-ic)") : [], function (el) { var i = img(el.getAttribute("data-ic")); if (i) { el.classList.add("ae-ic"); el.insertBefore(i, el.firstChild); } });
  }
  function start() {
    var keys = Object.keys(map).sort(function (a, b) { return b.length - a.length; });
    rx = new RegExp(keys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|"), "g");
    window.appleEmoji = function (ch) {
      var c = cache[ch]; if (c) return c.complete && c.naturalWidth ? c : null;
      if (!map[ch]) return null;
      c = cache[ch] = new Image(); c.src = base + map[ch] + ".png"; return null;
    };
    walk(document.body);
    var queued = [], t = 0;
    new MutationObserver(function (ms) {
      ms.forEach(function (m) { if (m.type === "characterData") queued.push(m.target); else [].forEach.call(m.addedNodes, function (n) { if (!(n.nodeType === 1 && n.classList && n.classList.contains("ae"))) queued.push(n); }); });
      if (!t) t = requestAnimationFrame(function () { t = 0; var q = queued; queued = []; q.forEach(walk); });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  fetch(base + "map.json").then(function (r) { return r.json(); }).then(function (j) { map = j; if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start(); }).catch(function () {});
})();

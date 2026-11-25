/* ============================================================
   Live viewers: how many people are on the page right now, and
   which countries they're in. Real numbers only.

   How it works (no server needed): each open tab reports in to a
   free Firebase Realtime Database every 25 seconds; a tab counts as
   "viewing" if it reported in during the last 70 seconds. The country
   comes from the visitor's own time zone, so no IP address is sent
   to any outside service.

   Turn it on: put your database link in coach/config.js
   (COACH.live.databaseURL). Setup steps are in HOSTING.md.
   Until then the widget stays hidden.
   ============================================================ */
(function () {
  "use strict";
  var cfg = (window.COACH && window.COACH.live) || {};
  var DB = (cfg.databaseURL || "").replace(/\/+$/, "");
  var box = document.getElementById("liveNow");
  if (!DB || !window.fetch) return;   // with no #liveNow panel (other pages) it still records the visit

  var TZ = { "Asia/Karachi": "PK", "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Dubai": "AE", "Asia/Riyadh": "SA", "Asia/Qatar": "QA", "Asia/Kuwait": "KW",
    "Asia/Bahrain": "BH", "Asia/Muscat": "OM", "Asia/Dhaka": "BD", "Asia/Jakarta": "ID", "Asia/Kuala_Lumpur": "MY", "Asia/Singapore": "SG", "Asia/Tehran": "IR",
    "Asia/Baghdad": "IQ", "Asia/Amman": "JO", "Asia/Kabul": "AF", "Asia/Tokyo": "JP", "Asia/Shanghai": "CN", "Asia/Seoul": "KR", "Asia/Manila": "PH",
    "Europe/Istanbul": "TR", "Africa/Cairo": "EG", "Africa/Casablanca": "MA", "Africa/Lagos": "NG", "Africa/Johannesburg": "ZA", "Africa/Nairobi": "KE",
    "Europe/London": "GB", "Europe/Dublin": "IE", "Europe/Paris": "FR", "Europe/Berlin": "DE", "Europe/Madrid": "ES", "Europe/Rome": "IT", "Europe/Amsterdam": "NL",
    "Europe/Brussels": "BE", "Europe/Stockholm": "SE", "Europe/Oslo": "NO", "Europe/Copenhagen": "DK", "Europe/Zurich": "CH", "Europe/Vienna": "AT",
    "America/Toronto": "CA", "America/Vancouver": "CA", "America/Edmonton": "CA", "America/Winnipeg": "CA", "America/Halifax": "CA", "America/Regina": "CA", "America/St_Johns": "CA",
    "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US", "America/Los_Angeles": "US", "America/Phoenix": "US", "America/Anchorage": "US", "Pacific/Honolulu": "US",
    "America/Mexico_City": "MX", "America/Sao_Paulo": "BR", "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Perth": "AU", "Australia/Brisbane": "AU", "Pacific/Auckland": "NZ" };
  var tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
  var generic = !tz || /^(Etc\/|UTC|GMT|Universal|Zulu)/i.test(tz);   // privacy browsers and in-app browsers often report plain UTC
  var langRegion = ((navigator.languages && navigator.languages.join(",")) || navigator.language || "").match(/-([A-Z]{2})\b/);
  var cc = TZ[tz] || (langRegion ? langRegion[1] : "");
  var zone = generic ? "" : (tz.split("/").pop() || "").replace(/_/g, " ").slice(0, 30);   // e.g. "Karachi", "Toronto"
  var ua = navigator.userAgent || "", dev = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android|iPhone/i.test(ua) ? "phone" : "computer";
  var app = /Instagram/i.test(ua) ? "Instagram" : /FBAN|FBAV/i.test(ua) ? "Facebook" : /TikTok|musical_ly|BytedanceWebview/i.test(ua) ? "TikTok" : /Snapchat/i.test(ua) ? "Snapchat" : /WhatsApp/i.test(ua) ? "WhatsApp" : "";
  // what this visitor is really doing right now
  var lastContact = 0;
  document.addEventListener("click", function (e) { var a = e.target.closest && e.target.closest('a[href*="wa.me"],a[href^="mailto:"],a[href*="paypal.me"]'); if (a) { lastContact = Date.now(); report(); } }, true);
  document.addEventListener("focusin", function (e) { if (e.target.closest && e.target.closest("form")) { lastContact = Date.now(); report(); } }, true);
  function inView(sel) { var el = document.querySelector(sel); if (!el) return false; var r = el.getBoundingClientRect(); return r.bottom > innerHeight * 0.3 && r.top < innerHeight * 0.7; }
  function activity() {
    if (Date.now() - lastContact < 90000 || inView("#pray") || inView("#checkout")) return "contact";
    if (inView("#scorpion-street-3d") || inView("#scorpion-street")) return "game";
    if (inView("#angel-numbers")) return "angel";
    return "";
  }
  var lastAct = ""; setInterval(function () { var a2 = activity(); if (a2 !== lastAct) { lastAct = a2; report(); } }, 4000);
  var id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);   // this page view
  var pid = id;   // this device: every tab and refresh shares one "online" entry, so nobody is counted twice
  try { pid = localStorage.getItem("coach-pid") || ""; if (!/^[a-z0-9]{8,24}$/.test(pid)) { pid = "d" + id; localStorage.setItem("coach-pid", pid); } } catch (e) { pid = id; }
  window.__coachPid = pid;
  var offset = 0, timer = 0, beat = 0;

  function flag(code) { return code ? code.replace(/./g, function (ch) { return String.fromCodePoint(127397 + ch.charCodeAt(0)); }) : "🌍"; }
  function countryName(code) {
    if (!code) return "";
    try { return new Intl.DisplayNames([document.documentElement.lang || "en"], { type: "region" }).of(code); } catch (e) { return code; }
  }
  // anonymous visit record for the public stats page (no IP, no name)
  var osName = /Windows/i.test(ua) ? "Windows" : /iPhone|iPad|iPod/i.test(ua) ? "iOS" : /Mac OS X/i.test(ua) ? "macOS" : /Android/i.test(ua) ? "Android" : /Linux/i.test(ua) ? "Linux" : "Other";
  var brName = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /SamsungBrowser/.test(ua) ? "Samsung" : /CriOS|Chrome\//.test(ua) ? "Chrome" : /FxiOS|Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Other";
  var refHost = ""; try { refHost = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : ""; if (refHost === location.hostname) refHost = ""; } catch (e) {}
  var returning = false; try { returning = !!localStorage.getItem("coach-seen"); localStorage.setItem("coach-seen", "1"); } catch (e) {}
  var started = Date.now(), seen = { g: 0, an: 0, ct: 0 }, visitSent = false;
  /* ---- more detail, still anonymous: which page, how far they scrolled, what they looked at and tapped ---- */
  var path = location.pathname, pg = (path.match(/\/(actor|realtor|stats|saleem|mangoes)\//) || [])[1] || ((path.match(/\/([a-z0-9-]+)\.html$/) || [])[1] || "").replace(/^index$/, "") || "coach";
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var sp = Number(ss("coach-sp") || 0) + 1; ss("coach-sp", String(sp));                         // pages seen this visit
  var entry = ss("coach-entry") || pg; ss("coach-entry", entry);                                // where this visit started
  var vc = Number(ls("coach-vc") || 0) + (ss("coach-counted") ? 0 : 1); ls("coach-vc", String(vc)); ss("coach-counted", "1");   // visit number on this device
  var fs = ls("coach-fs") || String(Date.now()); ls("coach-fs", fs);                               // first seen on this device
  var qs = location.search, src = (qs.match(/[?&]utm_source=([^&]+)/) || [])[1] || (/[?&]fbclid=/.test(qs) ? "facebook ad/link" : /[?&]gclid=/.test(qs) ? "google ads" : /[?&]ttclid=/.test(qs) ? "tiktok ad" : "");
  try { src = decodeURIComponent(src).slice(0, 30); } catch (e) {}
  var md = (ua.match(/Android [\d.]+; ([^;)]+?)(?: Build|\))/) || [])[1] || (/iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) ? "iPad" : /Macintosh/.test(ua) ? "Mac" : /Windows/.test(ua) ? "Windows PC" : "");
  var net = (navigator.connection && navigator.connection.effectiveType) || "";
  var sd = 0, sec = [], clicks = {};
  function onScroll() { var h = document.documentElement.scrollHeight - innerHeight; if (h > 0) sd = Math.max(sd, Math.min(100, Math.round(scrollY / h * 100))); }
  window.addEventListener("scroll", onScroll, { passive: true });
  if ("IntersectionObserver" in window) {
    var secIO = new IntersectionObserver(function (es) { es.forEach(function (e) { var id = e.target.id; if (e.isIntersecting && id && sec.indexOf(id) < 0) sec.push(id); }); }, { threshold: 0.35 });
    var watchSecs = function () { [].forEach.call(document.querySelectorAll("section[id],[data-track]"), function (el) { if (el.id) secIO.observe(el); }); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watchSecs); else watchSecs();
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href],button"); if (!a) return;
    var href = a.getAttribute("href") || "", k = /wa\.me|whatsapp/i.test(href) ? "wa" : /paypal/i.test(href) ? "pp" : /^mailto:/i.test(href) ? "em" : /^tel:|^sms:/i.test(href) ? "tel" : /tiktok|snapchat|instagram|facebook|youtube/i.test(href) ? "soc" : a.closest("#jg,#g3,#road") ? "game" : "";
    if (k) { clicks[k] = (clicks[k] || 0) + 1; visit(); }
  }, true);
  function visit() {
    var a2 = activity(); if (a2 === "game") seen.g = 1; if (a2 === "angel") seen.an = 1; if (a2 === "contact") seen.ct = 1;
    onScroll();
    var body = { c: cc, z: zone, d: dev, a: app, os: osName, br: brName, r: refHost.slice(0, 40), lg: (navigator.language || "").slice(0, 8), sw: screen.width || 0, rt: returning ? 1 : 0, p: pid,
      pg: pg, en: entry, sp: sp, vc: vc, fs: Number(fs), src: src, md: md.slice(0, 30), net: net, tz: tz.slice(0, 40), lh: new Date().getHours(), wd: new Date().getDay(),
      vw: innerWidth + "x" + innerHeight, sh: screen.height || 0, dk: window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? 1 : 0,
      sd: sd, sc: sec.join(",").slice(0, 400), ck: clicks, jg: Number(ls("jg-best2") || 0), du: Math.round((Date.now() - started) / 1000), g: seen.g, an: seen.an, ct: seen.ct, t: { ".sv": "timestamp" } };
    if (visitSent) delete body.t;
    fetch(DB + "/visits/" + id + ".json", { method: visitSent ? "PATCH" : "PUT", body: JSON.stringify(body), keepalive: true }).catch(function () {}); visitSent = true;
  }
  function report() {
    visit();
    if (document.hidden) return;
    fetch(DB + "/presence/" + pid + ".json", { method: "PUT", body: JSON.stringify({ vid: id, c: cc, z: zone, d: dev, a: app, os: osName, br: brName, r: refHost.slice(0, 40), x: activity(), t: { ".sv": "timestamp" } }) })
      .then(function (r) { return r.json(); })
      .then(function (v) { if (v && typeof v.t === "number") offset = v.t - Date.now(); })   // server clock minus ours
      .catch(function () {});
  }
  function leave() { if (visitSent) visit(); }   // save the final time on site, scroll depth and taps as they leave (entries stay for "recently connected")
  function refresh() {
    Promise.all([fetch(DB + "/presence.json").then(function (r) { return r.json(); }), fetch(DB + "/visits.json").then(function (r) { return r.json(); }).catch(function () { return {}; })]).then(function (res) {
      var all = res[0] || {}, visits = res[1] || {};
      var now = Date.now() + offset, live = [], by = {}, stale = {}, recent = [], acts = { game: 0, contact: 0, angel: 0 };
      Object.keys(all).forEach(function (k) {
        var v = all[k] || {}, age = now - (v.t || 0), vi = visits[v.vid || k] || {};
        if (age < 70000) { live.push({ v: v, vi: vi, me: k === pid }); var c = v.c || ""; by[c] = (by[c] || 0) + 1; if (acts[v.x] !== undefined) acts[v.x]++; }
        else if (age < 86400000) recent.push({ c: v.c || "", z: /^(UTC|GMT|Universal|Zulu)$/i.test(v.z || "") ? "" : (v.z || ""), d: v.d || "", a: v.a || "", age: age });
        else stale[k] = null;   // forget visits older than a day
      });
      if (Object.keys(stale).length) fetch(DB + "/presence.json", { method: "PATCH", body: JSON.stringify(stale) }).catch(function () {});
      // viewers per minute over the last hour, and visits per hour over the last day
      var V = Object.keys(visits).map(function (k) { return visits[k] || {}; }).filter(function (v) { return v.t && now - v.t < 3 * 864e5; });   // three days of visits
      var V1 = V.filter(function (v) { return now - v.t < 864e5; });
      // viewers in 5-minute steps over the last 3 hours (one per device)
      var mins = []; for (var m = 35; m >= 0; m--) { var b0 = now - (m + 1) * 3e5, b1 = now - m * 3e5, seenP = {}; V.forEach(function (v) { if (v.t <= b1 && v.t + Math.max(60, v.du || 0) * 1000 >= b0) seenP[v.p || v.t] = 1; }); mins.push(Object.keys(seenP).length); }
      mins[35] = Math.max(mins[35], live.length);
      // everyone from the last 3 hours, newest first, one row per device
      var liveP = {}; Object.keys(all).forEach(function (k) { if (now - ((all[k] || {}).t || 0) < 70000) liveP[k] = 1; });
      var last3 = [], gotP = {}; V.filter(function (v) { return now - v.t < 108e5; }).sort(function (a, b) { return b.t - a.t; }).forEach(function (v) {
        var key = v.p || ("t" + v.t); if (gotP[key]) { gotP[key].n++; gotP[key].du += v.du || 0; gotP[key].g |= v.g; gotP[key].an |= v.an; gotP[key].ct |= v.ct; return; }
        gotP[key] = { v: v, n: 1, du: v.du || 0, g: v.g, an: v.an, ct: v.ct, live: !!liveP[v.p], me: v.p === pid }; last3.push(gotP[key]); });
      var hrs = []; for (var h2 = 71; h2 >= 0; h2--) { var c0 = now - (h2 + 1) * 36e5, c1 = now - h2 * 36e5, uq = {}; V.forEach(function (v) { if (v.t >= c0 && v.t < c1) uq[v.p || v.t] = 1; }); hrs.push(Object.keys(uq).length); }
      recent.sort(function (a, b) { return a.age - b.age; }); var ctry = {}; V1.forEach(function (v) { if (v.c) ctry[v.c] = 1; });
      var uniq = function (arr) { var o = {}; arr.forEach(function (v) { o[v.p || ("t" + v.t)] = 1; }); return Object.keys(o).length; };
      var day = { d3: uniq(V), n: uniq(V1), countries: Object.keys(ctry).length, avg: V1.length ? V1.reduce(function (a2, v) { return a2 + Math.min(v.du || 0, 3600); }, 0) / V1.length : 0, peak: Math.max.apply(null, mins), pk: uniq(V1.filter(function (v) { return v.c === "PK"; })) };
      render(live, by, last3, acts, mins, hrs, now, day);
    }).catch(function () {});
  }
  function ago(ms) { var m = Math.round(ms / 60000); return m < 1 ? "just now" : m < 60 ? m + " min ago" : Math.round(m / 60) + " h ago"; }
  function esc(x) { return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function dur(sec) { sec = Math.max(0, Math.round(sec)); return sec < 60 ? sec + "s" : Math.floor(sec / 60) + "m " + (sec % 60) + "s"; }
  function spark(data, now, title, step) {
    step = step || 60000;   // smooth area line with the peak marked
    var W = 260, H = 90, max = Math.max(1, Math.max.apply(null, data)), n = data.length;
    var pts = data.map(function (d, i) { return [i / (n - 1) * W, H - 8 - d / max * (H - 22)]; });
    var line = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
    var pk = data.indexOf(max);
    var when = new Date(now - (n - 1 - pk) * step).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return '<div class="lv__chart"><b>' + title + '</b><svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="lvg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3dff7a" stop-opacity=".55"/><stop offset="1" stop-color="#3dff7a" stop-opacity="0"/></linearGradient></defs>' +
      '<path d="' + line + " L" + W + " " + H + " L0 " + H + ' Z" fill="url(#lvg)"/><path class="lv__line" d="' + line + '" fill="none" stroke="#3dff7a" stroke-width="2.2"/>' +
      '</svg><small>Peak <b>' + max + "</b> at " + when + " · now <b>" + data[n - 1] + "</b></small></div>";
  }
  function bars24(data, now) {   // 72 hourly bars (unique visitors), with day breaks and spikes
    var max = Math.max(1, Math.max.apply(null, data)), tot = data.reduce(function (a, b) { return a + b; }, 0), avg = tot / data.length, n = data.length, marks = "";
    var bars = data.map(function (d, i) { var t0 = new Date(now - (n - i) * 36e5), mid = t0.getHours() === 0; return '<i class="' + (d > avg * 1.8 && d > 1 ? "spike" : "") + (mid ? " mid" : "") + '" style="height:' + Math.max(2, d / max * 100) + '%" title="' + t0.toLocaleString([], { weekday: "short", hour: "numeric" }) + ": " + d + '"></i>'; }).join("");
    var days = [2, 1, 0].map(function (k) { var d0 = new Date(now - k * 864e5); return k === 0 ? "Today" : k === 1 ? "Yesterday" : d0.toLocaleDateString([], { weekday: "short" }); });
    var dayTot = [0, 1, 2].map(function (k) { return data.slice(k * 24, k * 24 + 24).reduce(function (a, b) { return a + b; }, 0); });
    return '<div class="lv__chart"><b>Visitors · last 3 days</b><div class="lv__bars lv__bars--72">' + bars + '</div><div class="lv__days">' + days.map(function (d, k) { return "<span>" + d + " <b>" + dayTot[k] + "</b></span>"; }).join("") + "</div>" +
      '<small>' + tot + " visitor-hours · busiest hour <b>" + max + "</b>" + (data.some(function (d) { return d > avg * 1.8 && d > 1; }) ? ' · <span class="lv__sp">▲ spike</span>' : "") + "</small></div>";
  }
  var DOING = { game: "🎮 playing the game", contact: "💬 on WhatsApp / contact form", angel: "✦ exploring angel numbers" };
  var DEV = { phone: "📱 Phone", tablet: "📱 Tablet", computer: "💻 Computer" };
  function render(live, by, recent, acts, mins, hrs, now, day) {
    day = day || {};
    if (!live.length && !recent.length && !hrs.some(Boolean)) { box.hidden = true; return; }
    var top = Object.keys(by).sort(function (a, b) { return by[b] - by[a]; }).slice(0, 5);
    acts = acts || {}; var doing = [acts.game ? "🎮 " + acts.game + " playing the game" : "", acts.contact ? "💬 " + acts.contact + " on WhatsApp or the contact form" : "", acts.angel ? "✦ " + acts.angel + " exploring angel numbers" : ""].filter(Boolean);
    var n = live.length;
    var people = live.map(function (o) { var v = o.v, vi = o.vi;
      return '<li class="lv__p lv__p--' + (v.x || "browse") + '"><span class="lv__av" aria-hidden="true">' + flag(v.c) + '</span><div class="lv__pb"><span class="lv__who"><b>' + esc(v.z ? v.z + " area" : (countryName(v.c) || "Somewhere")) + "</b>" + (v.c ? ", " + esc(countryName(v.c)) : "") + (o.me ? ' <span class="lv__me">you</span>' : "") + "</span>" +
        '<span class="lv__tags">' + [DEV[v.d] || "", v.os || vi.os || "", v.br || vi.br || "", (v.a || vi.a) ? "via " + (v.a || vi.a) : "", (v.r || vi.r) ? "from " + (v.r || vi.r) : "direct", vi.lg ? "🗣 " + vi.lg : "", vi.sw ? "🖥 " + vi.sw + "px" : "", vi.rt ? "↩ returning" : "✨ new visitor", vi.t ? "⏱ " + dur((now - vi.t) / 1000) + " on site" : "", vi.pg && vi.pg !== "coach" ? "📄 " + vi.pg + " page" : "", vi.sp > 1 ? "📑 " + vi.sp + " pages" : "", vi.vc > 1 ? "#" + vi.vc + " visit" : "", vi.lh != null ? "🕐 their time " + ((vi.lh % 12) || 12) + (vi.lh < 12 ? "am" : "pm") : "", vi.sd ? "📜 scrolled " + vi.sd + "%" : "", vi.md ? "📱 " + vi.md : "", vi.net ? "📶 " + vi.net : "", vi.src ? "🔗 " + vi.src : "", vi.ck && vi.ck.wa ? "💬 tapped WhatsApp ×" + vi.ck.wa : "", vi.ck && vi.ck.pp ? "💳 tapped PayPal" : "", vi.jg ? "🃏 jester best " + vi.jg : ""].filter(Boolean).map(function (t2) { return "<i>" + esc(t2) + "</i>"; }).join("") + "</span>" +
        '<span class="lv__doing">' + (DOING[v.x] || "👀 browsing") + (vi.g ? " · played the game" : "") + (vi.an ? " · saw angel numbers" : "") + (vi.ct ? " · contacted" : "") + "</span></div></li>"; }).join("");
    box.innerHTML =
      '<div class="lv__side">' + spark(mins, now, "Viewers · last 3 hours", 3e5) + "</div>" +
      '<div class="lv__mid"><div class="lv__head"><span class="lv__badge"><span class="live__dot" aria-hidden="true"></span>LIVE</span><b class="lv__big">' + n + '</b><span>' + (n === 1 ? "person" : "people") + " viewing now</span></div>" +
        '<div class="lv__kpis"><span><b>' + (day.n || 0) + "</b>visitors today</span><span><b>" + (day.d3 || 0) + "</b>3 days</span><span><b>" + (day.peak || 0) + "</b>peak · 3 h</span><span><b>" + (day.countries || 0) + "</b>countries today</span><span><b>" + dur(day.avg || 0) + "</b>avg time</span><span><b>🇵🇰 " + (day.pk || 0) + "</b>from Pakistan</span></div>" +
        (doing.length ? '<span class="live__doing">' + doing.join(" · ") + "</span>" : "") +
        '<span class="live__ur" lang="ur" dir="rtl">' + n + " لوگ ابھی دیکھ رہے ہیں" + (acts.game ? " · " + acts.game + " گیم کھیل رہے ہیں" : "") + (acts.contact ? " · " + acts.contact + " واٹس ایپ پر رابطہ کر رہے ہیں" : "") + "</span>" +
        '<span class="live__where">' + top.map(function (c) { return '<span title="' + (countryName(c) || "Elsewhere") + '">' + flag(c) + " " + (countryName(c) || "Elsewhere") + " " + by[c] + "</span>"; }).join("") + "</span>" +
        (n ? '<ul class="lv__people">' + people + "</ul>" : "") +
        (recent.length ? '<div class="lv__l3"><b class="lv__l3h">🕒 Last 3 hours · ' + recent.length + (recent.length === 1 ? " visitor" : " visitors") + '</b><ul>' + recent.map(function (r) { var v = r.v;
          return "<li>" + (r.live ? '<i class="lv__on" title="online now"></i>' : "") + flag(v.c) + " <b>" + esc(v.z ? v.z : (countryName(v.c) || "Somewhere")) + "</b>" + (r.me ? ' <span class="lv__me">you</span>' : "") +
            '<span class="lv__l3m">' + [({ phone: "📱", tablet: "📱", computer: "💻" }[v.d] || ""), v.a ? "via " + esc(v.a) : "", "⏱ " + dur(r.du), r.n > 1 ? r.n + " visits" : "", r.g ? "🎮" : "", r.an ? "✦" : "", r.ct ? "💬" : ""].filter(Boolean).join(" · ") + "</span>" +
            "<em>" + (r.live ? "online now" : ago(now - v.t)) + "</em></li>"; }).join("") + "</ul></div>" : "") +
        '<span class="live__links"><a href="stats/">📊 Live stats</a><a href="stats/#guest">🤲 Make dua for Adeel</a><a href="mangoes/ping.html" data-pingok>🥭 Mango list</a></span></div>' +
      '<div class="lv__side">' + bars24(hrs, now) + "</div>";
    box.hidden = false;
  }

  document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("[data-pingok]")) { try { sessionStorage.setItem("ping-ok", String(Date.now())); } catch (er) {} } });   // already unlocked here, so skip the second passcode
  var open = false;   // the panel stays behind the passcode lock until unlocked
  function start() { open = true; box.innerHTML = '<div class="lv__mid"><div class="lv__head"><span class="lv__badge"><span class="live__dot"></span>LIVE</span><span>Loading live visitors…</span></div></div>'; box.hidden = false; refresh(); setTimeout(refresh, 1200); timer = setInterval(refresh, 10000); }
  report();
  beat = setInterval(report, 25000);
  if (box && window.coachLock) window.coachLock(box, start);
  document.addEventListener("visibilitychange", function () { if (document.hidden) leave(); else { report(); if (open) refresh(); } });
  window.addEventListener("pagehide", leave);
})();

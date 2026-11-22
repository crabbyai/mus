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
  if (!DB || !box || !window.fetch) return;

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
  var id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
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
  function visit() {
    var a2 = activity(); if (a2 === "game") seen.g = 1; if (a2 === "angel") seen.an = 1; if (a2 === "contact") seen.ct = 1;
    var body = { c: cc, z: zone, d: dev, a: app, os: osName, br: brName, r: refHost.slice(0, 40), lg: (navigator.language || "").slice(0, 8), sw: screen.width || 0, rt: returning ? 1 : 0, du: Math.round((Date.now() - started) / 1000), g: seen.g, an: seen.an, ct: seen.ct, t: { ".sv": "timestamp" } };
    if (visitSent) delete body.t;
    fetch(DB + "/visits/" + id + ".json", { method: visitSent ? "PATCH" : "PUT", body: JSON.stringify(body) }).catch(function () {}); visitSent = true;
  }
  function report() {
    visit();
    if (document.hidden) return;
    fetch(DB + "/presence/" + id + ".json", { method: "PUT", body: JSON.stringify({ c: cc, z: zone, d: dev, a: app, os: osName, br: brName, r: refHost.slice(0, 40), x: activity(), t: { ".sv": "timestamp" } }) })
      .then(function (r) { return r.json(); })
      .then(function (v) { if (v && typeof v.t === "number") offset = v.t - Date.now(); })   // server clock minus ours
      .catch(function () {});
  }
  function leave() {}   // entries stay so they can appear under "recently connected"
  function refresh() {
    Promise.all([fetch(DB + "/presence.json").then(function (r) { return r.json(); }), fetch(DB + "/visits.json").then(function (r) { return r.json(); }).catch(function () { return {}; })]).then(function (res) {
      var all = res[0] || {}, visits = res[1] || {};
      var now = Date.now() + offset, live = [], by = {}, stale = {}, recent = [], acts = { game: 0, contact: 0, angel: 0 };
      Object.keys(all).forEach(function (k) {
        var v = all[k] || {}, age = now - (v.t || 0), vi = visits[k] || {};
        if (age < 70000) { live.push({ v: v, vi: vi, me: k === id }); var c = v.c || ""; by[c] = (by[c] || 0) + 1; if (acts[v.x] !== undefined) acts[v.x]++; }
        else if (age < 86400000) recent.push({ c: v.c || "", z: /^(UTC|GMT|Universal|Zulu)$/i.test(v.z || "") ? "" : (v.z || ""), d: v.d || "", a: v.a || "", age: age });
        else stale[k] = null;   // forget visits older than a day
      });
      if (Object.keys(stale).length) fetch(DB + "/presence.json", { method: "PATCH", body: JSON.stringify(stale) }).catch(function () {});
      // viewers per minute over the last hour, and visits per hour over the last day
      var V = Object.keys(visits).map(function (k) { return visits[k] || {}; }).filter(function (v) { return v.t && now - v.t < 864e5; });
      var mins = []; for (var m = 59; m >= 0; m--) { var b0 = now - (m + 1) * 60000, b1 = now - m * 60000; mins.push(V.filter(function (v) { return v.t <= b1 && v.t + Math.max(60, v.du || 0) * 1000 >= b0; }).length); }
      mins[59] = Math.max(mins[59], live.length);
      var hrs = []; for (var h2 = 23; h2 >= 0; h2--) { var c0 = now - (h2 + 1) * 36e5, c1 = now - h2 * 36e5; hrs.push(V.filter(function (v) { return v.t >= c0 && v.t < c1; }).length); }
      recent.sort(function (a, b) { return a.age - b.age; }); render(live, by, recent.slice(0, 8), acts, mins, hrs, now);
    }).catch(function () {});
  }
  function ago(ms) { var m = Math.round(ms / 60000); return m < 1 ? "just now" : m < 60 ? m + " min ago" : Math.round(m / 60) + " h ago"; }
  function esc(x) { return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function dur(sec) { sec = Math.max(0, Math.round(sec)); return sec < 60 ? sec + "s" : Math.floor(sec / 60) + "m " + (sec % 60) + "s"; }
  function spark(data, now, title) {   // smooth area line with the peak marked
    var W = 260, H = 90, max = Math.max(1, Math.max.apply(null, data)), n = data.length;
    var pts = data.map(function (d, i) { return [i / (n - 1) * W, H - 8 - d / max * (H - 22)]; });
    var line = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
    var pk = data.indexOf(max);
    var when = new Date(now - (n - 1 - pk) * 60000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return '<div class="lv__chart"><b>' + title + '</b><svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="lvg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3dff7a" stop-opacity=".55"/><stop offset="1" stop-color="#3dff7a" stop-opacity="0"/></linearGradient></defs>' +
      '<path d="' + line + " L" + W + " " + H + " L0 " + H + ' Z" fill="url(#lvg)"/><path class="lv__line" d="' + line + '" fill="none" stroke="#3dff7a" stroke-width="2.2"/>' +
      '</svg><small>Peak <b>' + max + "</b> at " + when + " · now <b>" + data[n - 1] + "</b></small></div>";
  }
  function bars24(data) {
    var max = Math.max(1, Math.max.apply(null, data)), avg = data.reduce(function (a, b) { return a + b; }, 0) / data.length;
    return '<div class="lv__chart"><b>Visits · last 24 hours</b><div class="lv__bars">' + data.map(function (d, i) { return '<i class="' + (d > avg * 1.8 && d > 1 ? "spike" : "") + '" style="height:' + Math.max(2, d / max * 100) + '%" title="' + d + '"></i>'; }).join("") +
      '</div><small>' + data.reduce(function (a, b) { return a + b; }, 0) + " visits · busiest hour <b>" + max + "</b>" + (data.some(function (d) { return d > avg * 1.8 && d > 1; }) ? ' · <span class="lv__sp">▲ spike</span>' : "") + "</small></div>";
  }
  var DOING = { game: "🎮 playing the game", contact: "💬 on WhatsApp / contact form", angel: "✦ exploring angel numbers" };
  var DEV = { phone: "📱 Phone", tablet: "📱 Tablet", computer: "💻 Computer" };
  function render(live, by, recent, acts, mins, hrs, now) {
    if (!live.length && !recent.length && !hrs.some(Boolean)) { box.hidden = true; return; }
    var top = Object.keys(by).sort(function (a, b) { return by[b] - by[a]; }).slice(0, 5);
    acts = acts || {}; var doing = [acts.game ? "🎮 " + acts.game + " playing the game" : "", acts.contact ? "💬 " + acts.contact + " on WhatsApp or the contact form" : "", acts.angel ? "✦ " + acts.angel + " exploring angel numbers" : ""].filter(Boolean);
    var n = live.length;
    var people = live.map(function (o) { var v = o.v, vi = o.vi;
      return '<li><span class="lv__who">' + flag(v.c) + " <b>" + esc(v.z ? v.z + " area" : (countryName(v.c) || "Somewhere")) + "</b>" + (v.c ? ", " + esc(countryName(v.c)) : "") + (o.me ? ' <span class="lv__me">you</span>' : "") + "</span>" +
        '<span class="lv__tags">' + [DEV[v.d] || "", v.os || vi.os || "", v.br || vi.br || "", (v.a || vi.a) ? "via " + (v.a || vi.a) : "", (v.r || vi.r) ? "from " + (v.r || vi.r) : "direct", vi.lg ? "🗣 " + vi.lg : "", vi.sw ? "🖥 " + vi.sw + "px" : "", vi.rt ? "↩ returning" : "✨ new visitor", vi.t ? "⏱ " + dur((now - vi.t) / 1000) + " on site" : ""].filter(Boolean).map(function (t2) { return "<i>" + esc(t2) + "</i>"; }).join("") + "</span>" +
        '<span class="lv__doing">' + (DOING[v.x] || "👀 browsing") + (vi.g ? " · played the game" : "") + (vi.an ? " · saw angel numbers" : "") + (vi.ct ? " · contacted" : "") + "</span></li>"; }).join("");
    box.innerHTML =
      '<div class="lv__side">' + spark(mins, now, "Viewers · last 60 min") + "</div>" +
      '<div class="lv__mid"><div class="lv__head"><span class="live__dot" aria-hidden="true"></span><b>' + n + "</b> " + (n === 1 ? "person" : "people") + " viewing now</div>" +
        (doing.length ? '<span class="live__doing">' + doing.join(" · ") + "</span>" : "") +
        '<span class="live__ur" lang="ur" dir="rtl">' + n + " لوگ ابھی دیکھ رہے ہیں" + (acts.game ? " · " + acts.game + " گیم کھیل رہے ہیں" : "") + (acts.contact ? " · " + acts.contact + " واٹس ایپ پر رابطہ کر رہے ہیں" : "") + "</span>" +
        '<span class="live__where">' + top.map(function (c) { return '<span title="' + (countryName(c) || "Elsewhere") + '">' + flag(c) + " " + (countryName(c) || "Elsewhere") + " " + by[c] + "</span>"; }).join("") + "</span>" +
        (n ? '<ul class="lv__people">' + people + "</ul>" : "") +
        (recent.length ? '<details class="live__recent"><summary>Recently connected</summary><ul>' + recent.map(function (r) { return "<li>" + flag(r.c) + " " + (r.z ? esc(r.z) + " area" : (countryName(r.c) || "Somewhere")) + (r.d ? " · " + ({ phone: "📱", tablet: "📱", computer: "💻" }[r.d] || "") : "") + (r.a ? " via " + esc(r.a) : "") + " · <i>" + ago(r.age) + "</i></li>"; }).join("") + "</ul></details>" : "") +
        '<span class="live__links"><a href="stats/">📊 Live stats</a><a href="stats/#guest">🤲 Make dua for Adeel</a></span></div>' +
      '<div class="lv__side">' + bars24(hrs) + "</div>";
    box.hidden = false;
  }

  report(); refresh(); setTimeout(refresh, 1500);   // show immediately, then again once this visit is counted
  beat = setInterval(report, 25000);
  timer = setInterval(refresh, 10000);
  document.addEventListener("visibilitychange", function () { if (document.hidden) leave(); else { report(); refresh(); } });
  window.addEventListener("pagehide", leave);
})();

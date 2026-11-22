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
    fetch(DB + "/presence.json").then(function (r) { return r.json(); }).then(function (all) {
      all = all || {};
      var now = Date.now() + offset, live = 0, by = {}, stale = {}, recent = [], acts = { game: 0, contact: 0, angel: 0 };
      Object.keys(all).forEach(function (k) {
        var v = all[k] || {}, age = now - (v.t || 0);
        if (age < 70000) { live++; var c = v.c || ""; by[c] = (by[c] || 0) + 1; if (acts[v.x] !== undefined) acts[v.x]++; }
        else if (age < 86400000) recent.push({ c: v.c || "", z: /^(UTC|GMT|Universal|Zulu)$/i.test(v.z || "") ? "" : (v.z || ""), d: v.d || "", a: v.a || "", age: age });
        else stale[k] = null;   // forget visits older than a day
      });
      if (Object.keys(stale).length) fetch(DB + "/presence.json", { method: "PATCH", body: JSON.stringify(stale) }).catch(function () {});
      recent.sort(function (a, b) { return a.age - b.age; }); render(live, by, recent.slice(0, 8), acts);
    }).catch(function () {});
  }
  function ago(ms) { var m = Math.round(ms / 60000); return m < 1 ? "just now" : m < 60 ? m + " min ago" : Math.round(m / 60) + " h ago"; }
  function render(live, by, recent, acts) {
    if (!live && !recent.length) { box.hidden = true; return; }
    var top = Object.keys(by).sort(function (a, b) { return by[b] - by[a]; }).slice(0, 5);
    acts = acts || {}; var doing = [acts.game ? "🎮 " + acts.game + " playing the game" : "", acts.contact ? "💬 " + acts.contact + " on WhatsApp or the contact form" : "", acts.angel ? "✦ " + acts.angel + " exploring angel numbers" : ""].filter(Boolean);
    box.innerHTML = '<span class="live__dot" aria-hidden="true"></span><b>' + live + "</b> " + (live === 1 ? "person" : "people") + " viewing now" +
      (doing.length ? '<span class="live__doing">' + doing.join(" · ") + "</span>" : "") +
      '<span class="live__ur" lang="ur" dir="rtl">' + live + " لوگ ابھی دیکھ رہے ہیں" + (acts.game ? " · " + acts.game + " گیم کھیل رہے ہیں" : "") + (acts.contact ? " · " + acts.contact + " واٹس ایپ پر رابطہ کر رہے ہیں" : "") + "</span>" +
      '<span class="live__pa" lang="pa-Arab" dir="rtl">' + live + " لوک ہُݨ ویکھ رہے نیں" + (acts.game ? " · " + acts.game + " گیم کھیڈ رہے نیں" : "") + (acts.contact ? " · " + acts.contact + " واٹس ایپ تے گل کر رہے نیں" : "") + "</span>" +
      '<span class="live__where">' + top.map(function (c) { return '<span title="' + (countryName(c) || "Elsewhere") + '">' + flag(c) + " " + (countryName(c) || "Elsewhere") + " " + by[c] + "</span>"; }).join("") + "</span>" +
      (recent.length ? '<details class="live__recent"><summary>Recently connected</summary><ul>' + recent.map(function (r) { return "<li>" + flag(r.c) + " " + (r.z ? r.z.replace(/</g, "") + " area" : (countryName(r.c) || "Somewhere")) + (r.d ? " · " + ({ phone: "📱", tablet: "📱", computer: "💻" }[r.d] || "") : "") + (r.a ? " via " + String(r.a).replace(/</g, "") : "") + " · <i>" + ago(r.age) + "</i></li>"; }).join("") + "</ul></details>" : "");
    box.innerHTML += '<span class="live__links"><a href="stats/">📊 Live stats</a><a href="stats/#guest">📍 Check in on the map</a></span>';
    box.hidden = false;
  }

  report(); setTimeout(refresh, 1200);
  beat = setInterval(report, 25000);
  timer = setInterval(refresh, 15000);
  document.addEventListener("visibilitychange", function () { if (document.hidden) leave(); else { report(); refresh(); } });
  window.addEventListener("pagehide", leave);
})();

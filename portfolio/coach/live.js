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
  var cc = TZ[tz] || "";
  var zone = (tz.split("/").pop() || "").replace(/_/g, " ").slice(0, 30);   // e.g. "Karachi", "Toronto"
  var id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  var offset = 0, timer = 0, beat = 0;

  function flag(code) { return code ? code.replace(/./g, function (ch) { return String.fromCodePoint(127397 + ch.charCodeAt(0)); }) : "🌍"; }
  function countryName(code) {
    if (!code) return "";
    try { return new Intl.DisplayNames([document.documentElement.lang || "en"], { type: "region" }).of(code); } catch (e) { return code; }
  }
  function report() {
    if (document.hidden) return;
    fetch(DB + "/presence/" + id + ".json", { method: "PUT", body: JSON.stringify({ c: cc, z: zone, t: { ".sv": "timestamp" } }) })
      .then(function (r) { return r.json(); })
      .then(function (v) { if (v && typeof v.t === "number") offset = v.t - Date.now(); })   // server clock minus ours
      .catch(function () {});
  }
  function leave() {}   // entries stay so they can appear under "recently connected"
  function refresh() {
    fetch(DB + "/presence.json").then(function (r) { return r.json(); }).then(function (all) {
      all = all || {};
      var now = Date.now() + offset, live = 0, by = {}, stale = {}, recent = [];
      Object.keys(all).forEach(function (k) {
        var v = all[k] || {}, age = now - (v.t || 0);
        if (age < 70000) { live++; var c = v.c || ""; by[c] = (by[c] || 0) + 1; }
        else if (age < 86400000) recent.push({ c: v.c || "", z: v.z || "", age: age });
        else stale[k] = null;   // forget visits older than a day
      });
      if (Object.keys(stale).length) fetch(DB + "/presence.json", { method: "PATCH", body: JSON.stringify(stale) }).catch(function () {});
      recent.sort(function (a, b) { return a.age - b.age; }); render(live, by, recent.slice(0, 8));
    }).catch(function () {});
  }
  function ago(ms) { var m = Math.round(ms / 60000); return m < 1 ? "just now" : m < 60 ? m + " min ago" : Math.round(m / 60) + " h ago"; }
  function render(live, by, recent) {
    if (!live && !recent.length) { box.hidden = true; return; }
    var top = Object.keys(by).sort(function (a, b) { return by[b] - by[a]; }).slice(0, 5);
    box.innerHTML = '<span class="live__dot" aria-hidden="true"></span><b>' + live + "</b> " + (live === 1 ? "person" : "people") + " viewing now" +
      '<span class="live__where">' + top.map(function (c) { return '<span title="' + (countryName(c) || "Elsewhere") + '">' + flag(c) + " " + (countryName(c) || "Elsewhere") + " " + by[c] + "</span>"; }).join("") + "</span>" +
      (recent.length ? '<details class="live__recent"><summary>Recently connected</summary><ul>' + recent.map(function (r) { return "<li>" + flag(r.c) + " " + (r.z ? r.z.replace(/</g, "") + " area" : (countryName(r.c) || "Somewhere")) + " · <i>" + ago(r.age) + "</i></li>"; }).join("") + "</ul></details>" : "");
    box.hidden = false;
  }

  report(); setTimeout(refresh, 1200);
  beat = setInterval(report, 25000);
  timer = setInterval(refresh, 15000);
  document.addEventListener("visibilitychange", function () { if (document.hidden) leave(); else { report(); refresh(); } });
  window.addEventListener("pagehide", leave);
})();

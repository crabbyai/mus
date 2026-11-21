/* ============================================================
   ADMIN — private inbox, files and stats for every site.
   Talks only to the inbox Worker. The session token lives in this
   browser's localStorage; the password never does.
   ============================================================ */
(function () {
  "use strict";

  // Set once the Worker is deployed (same value as in shared/inbox.js).
  var API = "";

  var $ = function (id) { return document.getElementById(id); };
  var TOKEN_KEY = "ar-admin-token";
  var SITE_NAMES = { actor: "Actor", coach: "Coach", realtor: "Realtor", mangoes: "Mangoes", other: "Other" };
  var state = { site: "", status: "new", days: 7, items: [] };

  function token() { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; } }
  function setToken(t) { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch (e) { /* private mode */ } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function notice(msg, bad) {
    var n = $("notice"); n.textContent = msg; n.classList.toggle("is-bad", !!bad); n.hidden = false;
    clearTimeout(notice.t); notice.t = setTimeout(function () { n.hidden = true; }, 3500);
  }
  function ago(ms) {
    var s = (Date.now() - ms) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return Math.round(s / 60) + " min ago";
    if (s < 86400) return Math.round(s / 3600) + " h ago";
    return new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  function size(b) { return b > 1e9 ? (b / 1e9).toFixed(1) + " GB" : b > 1e6 ? (b / 1e6).toFixed(1) + " MB" : Math.round(b / 1e3) + " KB"; }

  function api(path, opts) {
    opts = opts || {};
    var headers = opts.headers || {};
    if (token()) headers.authorization = "Bearer " + token();
    if (opts.json !== undefined) { headers["content-type"] = "application/json"; opts.body = JSON.stringify(opts.json); }
    return fetch(API + path, { method: opts.method || "GET", headers: headers, body: opts.body }).then(function (r) {
      if (r.status === 401) { setToken(""); show("login"); throw new Error("Please sign in again"); }
      var ct = r.headers.get("content-type") || "";
      if (!ct.includes("json")) return r.ok ? r : Promise.reject(new Error("HTTP " + r.status));
      return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || ("HTTP " + r.status)); return d; });
    });
  }

  /* ---------- screens ---------- */
  var SCREENS = ["unconfigured", "setupForm", "loginForm", "inbox", "files", "stats", "settings"];
  function show(name) {
    SCREENS.forEach(function (s) { $(s).hidden = true; });
    var signedIn = ["inbox", "files", "stats", "settings"].indexOf(name) >= 0;
    $("tabs").hidden = !signedIn;
    if (name === "login") name = "loginForm";
    if (name === "setup") name = "setupForm";
    $(name).hidden = false;
    document.querySelectorAll("#tabs [data-tab]").forEach(function (b) {
      var on = b.dataset.tab === name; b.classList.toggle("is-on", on); b.setAttribute("aria-selected", on);
    });
    if (name === "inbox") loadInbox();
    if (name === "files") loadFiles();
    if (name === "stats") loadStats();
  }
  $("tabs").addEventListener("click", function (e) { var b = e.target.closest("[data-tab]"); if (b) show(b.dataset.tab); });

  /* ---------- sign in ---------- */
  $("setupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = new FormData(e.target);
    if (f.get("password") !== f.get("password2")) return notice("The passwords don't match", true);
    api("/api/admin/setup", { method: "POST", json: { code: f.get("code"), password: f.get("password") } })
      .then(function (d) { setToken(d.token); e.target.reset(); notice("Password set — you're in"); show("inbox"); })
      .catch(function (err) { notice(err.message, true); });
  });
  $("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    api("/api/admin/login", { method: "POST", json: { password: new FormData(e.target).get("password") } })
      .then(function (d) { setToken(d.token); e.target.reset(); show("inbox"); })
      .catch(function (err) { notice(err.message, true); });
  });
  $("pwForm").addEventListener("submit", function (e) {
    e.preventDefault();
    api("/api/admin/password", { method: "POST", json: { password: new FormData(e.target).get("password") } })
      .then(function (d) { setToken(d.token); e.target.reset(); notice("Password changed. Other devices are signed out."); })
      .catch(function (err) { notice(err.message, true); });
  });
  $("logout").addEventListener("click", function () { setToken(""); show("login"); });

  /* ---------- inbox ---------- */
  function loadInbox() {
    var q = [];
    if (state.site) q.push("site=" + state.site);
    if (state.status) q.push("status=" + state.status);
    api("/api/admin/enquiries" + (q.length ? "?" + q.join("&") : "")).then(function (d) {
      state.items = d.items;
      var fresh = 0, totals = {};
      d.counts.forEach(function (c) { fresh += c.fresh || 0; totals[c.site] = c; });
      $("newCount").textContent = fresh ? fresh : "";
      document.title = (fresh ? "(" + fresh + ") " : "") + "Admin — Adeel Rahman";
      $("siteChips").innerHTML = '<button type="button" class="chip' + (state.site ? "" : " is-on") + '" data-site="">All sites</button>' +
        Object.keys(SITE_NAMES).filter(function (k) { return totals[k]; }).map(function (k) {
          return '<button type="button" class="chip' + (state.site === k ? " is-on" : "") + '" data-site="' + k + '">' + SITE_NAMES[k] +
            (totals[k].fresh ? " <small>" + totals[k].fresh + " new</small>" : "") + "</button>";
        }).join("");
      renderInbox();
    }).catch(function (err) { notice(err.message, true); });
  }
  function waLink(contact, name) {
    var digits = String(contact || "").replace(/[^\d+]/g, "");
    if (digits.replace(/\D/g, "").length < 9) return "";
    return "https://wa.me/" + digits.replace(/^\+/, "").replace(/^00/, "") + "?text=" + encodeURIComponent("Hello " + (name || "") + ", Adeel Rahman here — thank you for getting in touch.");
  }
  function renderInbox() {
    var list = $("list");
    $("empty").hidden = state.items.length > 0;
    list.innerHTML = state.items.map(function (it) {
      var fields = Object.keys(it.data).filter(function (k) { return it.data[k] && k !== "page"; }).map(function (k) {
        return "<dt>" + esc(k.replace(/_/g, " ")) + "</dt><dd>" + esc(it.data[k]) + "</dd>";
      }).join("");
      var wa = waLink(it.contact, it.name);
      var mail = /@/.test(it.contact) ? "mailto:" + encodeURIComponent(it.contact) : "";
      return '<article class="item' + (it.status === "new" ? " is-new" : "") + '">' +
        '<div class="item__top">' + (it.status === "new" ? '<span class="dot-new" title="New"></span>' : "") +
        '<span class="badge badge--' + esc(it.site) + '">' + esc(SITE_NAMES[it.site] || it.site) + "</span>" +
        "<span>" + esc(it.kind) + "</span><span>· " + ago(it.created) + "</span>" +
        (it.city || it.country ? "<span>· " + esc([it.city, it.country].filter(Boolean).join(", ")) + "</span>" : "") + "</div>" +
        '<p class="item__name">' + esc(it.name || "No name given") + "</p>" +
        (it.contact ? '<p class="item__contact">' + esc(it.contact) + "</p>" : "") +
        (fields ? '<dl class="fields">' + fields + "</dl>" : "") +
        '<div class="item__actions">' +
        (wa ? '<a class="btn btn--wa btn--sm" href="' + wa + '" target="_blank" rel="noopener">Reply on WhatsApp</a>' : "") +
        (mail ? '<a class="btn btn--ghost btn--sm" href="' + mail + '">Email</a>' : "") +
        (it.file_key ? '<button type="button" class="btn btn--ghost btn--sm" data-file="' + esc(it.id) + '">⬇ ' + esc(it.file_name) + " (" + size(it.file_size) + ")</button>" : "") +
        '<button type="button" class="btn btn--ghost btn--sm" data-mark="' + esc(it.id) + '" data-to="' + (it.status === "new" ? "done" : "new") + '">' + (it.status === "new" ? "✓ Mark done" : "Mark new") + "</button>" +
        '<button type="button" class="btn btn--bad btn--sm" data-del="' + esc(it.id) + '">Delete</button></div></article>';
    }).join("");
  }
  document.addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-site]"))) { state.site = t.dataset.site; loadInbox(); return; }
    if ((t = e.target.closest("[data-status]"))) {
      state.status = t.dataset.status;
      document.querySelectorAll("[data-status]").forEach(function (b) { b.classList.toggle("is-on", b === t); });
      loadInbox(); return;
    }
    if ((t = e.target.closest("[data-mark]"))) {
      api("/api/admin/enquiries/" + t.dataset.mark, { method: "POST", json: { status: t.dataset.to } }).then(loadInbox).catch(function (err) { notice(err.message, true); });
      return;
    }
    if ((t = e.target.closest("[data-del]"))) {
      if (!confirm("Delete this enquiry and any attached file? This can't be undone.")) return;
      api("/api/admin/enquiries/" + t.dataset.del, { method: "DELETE" }).then(loadInbox).catch(function (err) { notice(err.message, true); });
      return;
    }
    if ((t = e.target.closest("[data-file]"))) {
      api("/api/admin/enquiries/" + t.dataset.file + "/file").then(function (r) {
        var name = ((r.headers.get("content-disposition") || "").match(/filename="([^"]+)"/) || [])[1] || "attachment";
        return r.blob().then(function (b) { var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000); });
      }).catch(function (err) { notice(err.message, true); });
    }
  });
  $("refresh").addEventListener("click", loadInbox);

  /* ---------- files: chunked upload, expiring links ---------- */
  var CHUNK = 20 * 1024 * 1024;
  $("uploadForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target, file = form.file.files[0], title = form.title.value;
    if (!file) return;
    var btn = $("uploadBtn"), bar = $("progressBar"), txt = $("progressText");
    btn.disabled = true; $("progress").hidden = false; bar.style.width = "0"; txt.textContent = "Starting…";
    var total = Math.max(1, Math.ceil(file.size / CHUNK)), parts = [], id;
    api("/api/admin/files", { method: "POST", json: { title: title, name: file.name, type: file.type || "application/octet-stream", size: file.size } })
      .then(function (d) {
        id = d.id;
        var n = 0;
        function next() {
          if (n >= total) return Promise.resolve();
          var chunk = file.slice(n * CHUNK, (n + 1) * CHUNK);
          n++;
          return api("/api/admin/files/" + id + "/part/" + n, { method: "PUT", body: chunk }).then(function (p) {
            parts.push(p);
            var pct = Math.round((n / total) * 100);
            bar.style.width = pct + "%"; txt.textContent = pct + "% · " + size(Math.min(n * CHUNK, file.size)) + " of " + size(file.size);
            return next();
          });
        }
        return next();
      })
      .then(function () { return api("/api/admin/files/" + id + "/complete", { method: "POST", json: { parts: parts } }); })
      .then(function () { txt.textContent = "Uploaded ✓"; form.reset(); notice("Uploaded — make a link below"); loadFiles(); })
      .catch(function (err) {
        notice("Upload failed: " + err.message, true); txt.textContent = "Failed";
        if (id) api("/api/admin/files/" + id, { method: "DELETE" }).catch(function () {});
      })
      .then(function () { btn.disabled = false; });
  });
  function loadFiles() {
    api("/api/admin/files").then(function (d) {
      $("fileList").innerHTML = d.items.length ? d.items.map(function (f) {
        return '<article class="item" data-fid="' + esc(f.id) + '"><div class="item__top"><span class="badge badge--other">' + esc((f.type || "").split("/")[0]) + "</span><span>" + size(f.size) + " · " + ago(f.created) + "</span></div>" +
          '<p class="item__name">' + esc(f.title) + "</p>" +
          '<div class="item__actions"><select aria-label="Link lasts" data-days><option value="3">Link lasts 3 days</option><option value="7" selected>7 days</option><option value="30">30 days</option><option value="90">90 days</option></select>' +
          '<button type="button" class="btn btn--gold btn--sm" data-link="' + esc(f.id) + '">Make private link</button>' +
          '<button type="button" class="btn btn--bad btn--sm" data-fdel="' + esc(f.id) + '">Delete</button></div><div class="linkbox" hidden></div></article>';
      }).join("") : '<p class="empty">No uploads yet.</p>';
    }).catch(function (err) { notice(err.message, true); });
  }
  $("fileList").addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-link]"))) {
      var card = t.closest("[data-fid]"), days = card.querySelector("[data-days]").value;
      api("/api/admin/files/" + t.dataset.link + "/link", { method: "POST", json: { days: Number(days) } }).then(function (d) {
        var box = card.querySelector(".linkbox"), until = new Date(d.expires).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        box.hidden = false;
        box.innerHTML = '<input readonly value="' + esc(d.url) + '" aria-label="Private link" /><button type="button" class="btn btn--ghost btn--sm" data-copy>Copy</button>' +
          '<a class="btn btn--wa btn--sm" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(card.querySelector(".item__name").textContent + " — " + d.url) + '">Send on WhatsApp</a><span class="muted">valid until ' + until + "</span>";
      }).catch(function (err) { notice(err.message, true); });
      return;
    }
    if ((t = e.target.closest("[data-copy]"))) {
      var inp = t.parentNode.querySelector("input");
      (navigator.clipboard ? navigator.clipboard.writeText(inp.value) : Promise.reject()).then(function () { t.textContent = "Copied ✓"; }, function () { inp.select(); });
      return;
    }
    if ((t = e.target.closest("[data-fdel]"))) {
      if (!confirm("Delete this file? Links to it stop working.")) return;
      api("/api/admin/files/" + t.dataset.fdel, { method: "DELETE" }).then(loadFiles).catch(function (err) { notice(err.message, true); });
    }
  });

  /* ---------- stats ---------- */
  function siteOf(path) {
    if (/^\/mus\/actor/.test(path)) return "Actor";
    if (/^\/mus\/realtor/.test(path)) return "Realtor";
    if (/^\/mus\/mangoes/.test(path)) return "Mangoes";
    if (/^\/mus\/admin/.test(path)) return null;
    return "Coach & home";
  }
  function rows(id, list, key, val) {
    var max = Math.max.apply(null, list.map(function (x) { return x[val]; }).concat([1]));
    $(id).innerHTML = list.length ? list.map(function (x) {
      return '<li><i style="width:' + Math.round((x[val] / max) * 100) + '%"></i><span>' + esc(x[key]) + "</span><b>" + x[val] + "</b></li>";
    }).join("") : '<li><span class="muted">No data yet</span></li>';
  }
  function loadStats() {
    api("/api/admin/status").then(function (s) {
      $("statsConnect").hidden = s.statsConnected; $("statsView").hidden = !s.statsConnected;
      if (!s.statsConnected) return;
      return api("/api/admin/stats?days=" + state.days).then(function (d) {
        if (d.error) throw new Error(d.error);
        $("kpis").innerHTML = '<div class="kpi"><strong>' + d.visits + "</strong><span>Visits</span></div>" +
          '<div class="kpi"><strong>' + d.views + "</strong><span>Page views</span></div>" +
          '<div class="kpi"><strong>' + (d.countries.length) + "</strong><span>Countries</span></div>";
        var max = Math.max.apply(null, d.daily.map(function (x) { return x.visits; }).concat([1]));
        $("daily").innerHTML = d.daily.map(function (x) {
          return '<div style="height:' + Math.max(3, Math.round((x.visits / max) * 100)) + '%" data-label="' + esc(x.date + ": " + x.visits + " visits") + '"></div>';
        }).join("") || '<p class="muted">No visits in this period yet.</p>';
        var by = {};
        d.pages.forEach(function (p) { var s = siteOf(p.path); if (s) by[s] = (by[s] || 0) + p.views; });
        rows("bySite", Object.keys(by).map(function (k) { return { k: k, v: by[k] }; }).sort(function (a, b) { return b.v - a.v; }), "k", "v");
        rows("countries", d.countries, "name", "visits");
        rows("referrers", d.referrers, "host", "visits");
        rows("devices", d.devices, "type", "views");
        rows("pages", d.pages.filter(function (p) { return siteOf(p.path); }), "path", "views");
      });
    }).catch(function (err) { notice(err.message, true); });
  }
  $("dayChips").addEventListener("click", function (e) {
    var b = e.target.closest("[data-days]"); if (!b) return;
    state.days = Number(b.dataset.days);
    document.querySelectorAll("#dayChips .chip").forEach(function (c) { c.classList.toggle("is-on", c === b); });
    loadStats();
  });
  $("statsConnect").addEventListener("submit", function (e) {
    e.preventDefault();
    api("/api/admin/stats-token", { method: "POST", json: { token: new FormData(e.target).get("token") } })
      .then(function () { e.target.reset(); notice("Stats connected"); loadStats(); })
      .catch(function (err) { notice(err.message, true); });
  });

  /* ---------- start ---------- */
  if (!API) { show("unconfigured"); return; }
  api("/api/admin/status").then(function (s) {
    if (!s.hasPassword) show("setup");
    else if (token()) show("inbox");
    else show("login");
  }).catch(function () { show("unconfigured"); notice("Can't reach the inbox server right now", true); });
  // Keep the inbox fresh while the page is open.
  setInterval(function () { if (!document.hidden && !$("inbox").hidden) loadInbox(); }, 60000);
})();

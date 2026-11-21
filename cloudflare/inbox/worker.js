/* ============================================================
   ADEEL RAHMAN — SHARED INBOX & FILES (Cloudflare Worker)

   One small server for every site (actor, coach, realtor, mangoes):
     • POST /api/enquiry        any site's form → saved to the inbox,
                                with an optional attached file (≤15 MB)
     • /api/admin/*             the private admin page: login, inbox,
                                files, private video links, stats
     • GET  /t/<id>?e=&s=       a shared video page (link expires)
     • GET  /v/<id>?e=&s=       the video itself, with seeking

   Storage: D1 (database "DB") for enquiries and settings, R2 (bucket
   "FILES") for uploaded files. Secrets: LINK_KEY (signs links and
   sessions), SETUP_CODE (one-time code to set the admin password).
   Plain vars: ALLOWED_ORIGINS (comma list), ACCOUNT_ID, SITE_TAG.

   No secret ever reaches the browser. The admin password is stored as
   a PBKDF2 hash; sessions are signed, expiring tokens.
   ============================================================ */

const SITES = ["actor", "coach", "realtor", "mangoes", "other"];
const MAX_FILE = 15 * 1024 * 1024;
const FILE_TYPES = /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|text\/plain|image\/(jpeg|png|webp))$/;
const MAX_FIELDS_BYTES = 8 * 1024;
const RATE_PER_HOUR = 20;
const SESSION_DAYS = 30;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    try {
      await ensureSchema(env);
      const p = url.pathname;
      if (p === "/" || p === "/health") return json({ ok: true, service: "adeel-inbox" }, 200, cors);
      if (p === "/api/enquiry" && request.method === "POST") return await enquiry(request, env, cors);
      if (p.startsWith("/t/")) return await tapePage(url, env);
      if (p.startsWith("/v/")) return await tapeStream(request, url, env);
      if (p.startsWith("/api/admin/")) return await admin(request, url, env, cors);
      return json({ error: "not found" }, 404, cors);
    } catch (err) {
      console.error(err && err.stack || err);
      return json({ error: "server error" }, 500, cors);
    }
  }
};

/* ---------------- helpers ---------------- */
function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...(headers || {}) } });
}
function corsHeaders(request, env) {
  const origin = request.headers.get("origin") || "";
  const allowed = String(env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const ok = allowed.includes(origin);
  return ok ? {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "authorization, content-type",
    "access-control-max-age": "86400",
    "access-control-expose-headers": "content-disposition",
    "vary": "origin"
  } : { "vary": "origin" };
}
const enc = new TextEncoder();
function b64url(buf) {
  let s = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function hmac(env, msg) {
  const key = await crypto.subtle.importKey("raw", enc.encode(env.LINK_KEY), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(msg)));
}
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
async function hashPassword(pw, saltB64) {
  const salt = saltB64 ? Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0)) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 }, key, 256);
  return { salt: btoa(String.fromCharCode(...salt)), hash: b64url(bits) };
}
function newId() {
  const b = crypto.getRandomValues(new Uint8Array(9));
  return Date.now().toString(36) + "-" + b64url(b);
}
const clip = (v, n) => String(v == null ? "" : v).slice(0, n);

/* ---------------- schema ---------------- */
let schemaReady = false;
async function ensureSchema(env) {
  if (schemaReady) return;
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY, created INTEGER NOT NULL, site TEXT NOT NULL, kind TEXT NOT NULL,
      name TEXT, contact TEXT, data TEXT NOT NULL, file_key TEXT, file_name TEXT, file_type TEXT, file_size INTEGER,
      country TEXT, city TEXT, status TEXT NOT NULL DEFAULT 'new')`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS enq_created ON enquiries (created DESC)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS rate (bucket TEXT PRIMARY KEY, n INTEGER NOT NULL, exp INTEGER NOT NULL)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY, created INTEGER NOT NULL, title TEXT, file_key TEXT NOT NULL, type TEXT, size INTEGER,
      upload_id TEXT, done INTEGER NOT NULL DEFAULT 0)`)
  ]);
  schemaReady = true;
}
async function getSetting(env, k) {
  const r = await env.DB.prepare("SELECT v FROM settings WHERE k = ?").bind(k).first();
  return r ? r.v : null;
}
async function setSetting(env, k, v) {
  await env.DB.prepare("INSERT INTO settings (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(k, v).run();
}

/* ---------------- rate limiting ---------------- */
async function rateLimited(env, key, limit, windowSec) {
  const now = Math.floor(Date.now() / 1000);
  const bucket = key + ":" + Math.floor(now / windowSec);
  await env.DB.prepare("DELETE FROM rate WHERE exp < ?").bind(now).run();
  const r = await env.DB.prepare("INSERT INTO rate (bucket, n, exp) VALUES (?, 1, ?) ON CONFLICT(bucket) DO UPDATE SET n = n + 1 RETURNING n")
    .bind(bucket, now + windowSec).first();
  return r && r.n > limit;
}

/* ---------------- public: form enquiries ---------------- */
async function enquiry(request, env, cors) {
  if (!cors["access-control-allow-origin"]) return json({ error: "origin not allowed" }, 403, cors);
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  if (await rateLimited(env, "enq:" + ip, RATE_PER_HOUR, 3600)) return json({ error: "too many requests, try again later" }, 429, cors);

  const type = request.headers.get("content-type") || "";
  let fields = {}, file = null;
  if (type.startsWith("multipart/form-data")) {
    const form = await request.formData();
    for (const [k, v] of form.entries()) {
      if (typeof v === "string") fields[k] = fields[k] ? fields[k] + ", " + v : v;
      else if (k === "file" && v && v.size) file = v;
    }
  } else if (type.startsWith("application/json")) {
    fields = await request.json();
  } else {
    return json({ error: "unsupported content type" }, 415, cors);
  }
  // Honeypot: a hidden field real people never fill in.
  if (fields.website) return json({ ok: true }, 200, cors);

  const site = SITES.includes(fields._site) ? fields._site : "other";
  const kind = clip(fields._kind || "enquiry", 40);
  const name = clip(fields.name || fields.full_name || "", 120);
  const contact = clip(fields.phone || fields.whatsapp || fields.email || fields.contact || "", 160);
  const data = {};
  for (const [k, v] of Object.entries(fields)) {
    if (k.startsWith("_") || k === "website") continue;
    data[clip(k, 40)] = clip(v, 2000);
  }
  const dataJson = JSON.stringify(data);
  if (dataJson.length > MAX_FIELDS_BYTES) return json({ error: "message too long" }, 413, cors);
  if (!Object.values(data).some((v) => String(v).trim())) return json({ error: "empty form" }, 400, cors);

  const id = newId();
  let fileKey = null, fileName = null, fileType = null, fileSize = null;
  if (file) {
    if (file.size > MAX_FILE) return json({ error: "file larger than 15 MB" }, 413, cors);
    if (!FILE_TYPES.test(file.type || "")) return json({ error: "file type not allowed (PDF, Word, text or image)" }, 415, cors);
    fileName = clip((file.name || "attachment").replace(/[^\w.\- ]+/g, "_"), 120);
    fileKey = `enquiries/${site}/${id}/${fileName}`;
    fileType = file.type;
    fileSize = file.size;
    await env.FILES.put(fileKey, file.stream(), { httpMetadata: { contentType: fileType } });
  }
  const cf = request.cf || {};
  await env.DB.prepare(`INSERT INTO enquiries (id, created, site, kind, name, contact, data, file_key, file_name, file_type, file_size, country, city)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, Date.now(), site, kind, name, contact, dataJson, fileKey, fileName, fileType, fileSize, clip(cf.country || "", 4), clip(cf.city || "", 80)).run();
  return json({ ok: true, id }, 200, cors);
}

/* ---------------- admin ---------------- */
async function sessionOk(request, env) {
  const auth = request.headers.get("authorization") || "";
  const tok = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const [exp, sig] = tok.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const ver = (await getSetting(env, "pw_ver")) || "0";
  return safeEqual(sig, await hmac(env, `session:${exp}:${ver}`));
}
async function newSession(env) {
  const exp = Date.now() + SESSION_DAYS * 864e5;
  const ver = (await getSetting(env, "pw_ver")) || "0";
  return `${exp}.${await hmac(env, `session:${exp}:${ver}`)}`;
}

async function admin(request, url, env, cors) {
  const p = url.pathname.replace("/api/admin", "");
  const ip = request.headers.get("cf-connecting-ip") || "unknown";

  if (p === "/status" && request.method === "GET") {
    return json({ hasPassword: !!(await getSetting(env, "pw")), statsConnected: !!(await getSetting(env, "stats_token")) }, 200, cors);
  }
  if (p === "/setup" && request.method === "POST") {
    if (await rateLimited(env, "login:" + ip, 10, 900)) return json({ error: "too many attempts, wait 15 minutes" }, 429, cors);
    if (await getSetting(env, "pw")) return json({ error: "password already set" }, 409, cors);
    const { code, password } = await request.json();
    if (!env.SETUP_CODE || !safeEqual(String(code || "").trim(), env.SETUP_CODE)) return json({ error: "wrong setup code" }, 403, cors);
    if (!password || String(password).length < 10) return json({ error: "use at least 10 characters" }, 400, cors);
    const h = await hashPassword(String(password));
    await setSetting(env, "pw", JSON.stringify(h));
    await setSetting(env, "pw_ver", String(Date.now()));
    return json({ token: await newSession(env) }, 200, cors);
  }
  if (p === "/login" && request.method === "POST") {
    if (await rateLimited(env, "login:" + ip, 10, 900)) return json({ error: "too many attempts, wait 15 minutes" }, 429, cors);
    const stored = await getSetting(env, "pw");
    if (!stored) return json({ error: "no password set yet" }, 409, cors);
    const { password } = await request.json();
    const { salt, hash } = JSON.parse(stored);
    const h = await hashPassword(String(password || ""), salt);
    if (!safeEqual(h.hash, hash)) return json({ error: "wrong password" }, 403, cors);
    return json({ token: await newSession(env) }, 200, cors);
  }

  if (!(await sessionOk(request, env))) return json({ error: "please log in" }, 401, cors);

  if (p === "/password" && request.method === "POST") {
    const { password } = await request.json();
    if (!password || String(password).length < 10) return json({ error: "use at least 10 characters" }, 400, cors);
    await setSetting(env, "pw", JSON.stringify(await hashPassword(String(password))));
    await setSetting(env, "pw_ver", String(Date.now())); // signs out every other device
    return json({ token: await newSession(env) }, 200, cors);
  }

  /* inbox */
  if (p === "/enquiries" && request.method === "GET") {
    const site = url.searchParams.get("site");
    const status = url.searchParams.get("status");
    let sql = "SELECT * FROM enquiries", where = [], args = [];
    if (site && SITES.includes(site)) { where.push("site = ?"); args.push(site); }
    if (status === "new" || status === "done") { where.push("status = ?"); args.push(status); }
    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY created DESC LIMIT 300";
    const { results } = await env.DB.prepare(sql).bind(...args).all();
    const counts = (await env.DB.prepare("SELECT site, SUM(status = 'new') AS fresh, COUNT(*) AS total FROM enquiries GROUP BY site").all()).results;
    return json({ items: results.map((r) => ({ ...r, data: JSON.parse(r.data) })), counts }, 200, cors);
  }
  let m = p.match(/^\/enquiries\/([\w-]+)$/);
  if (m && request.method === "POST") {
    const { status } = await request.json();
    if (!["new", "done"].includes(status)) return json({ error: "bad status" }, 400, cors);
    await env.DB.prepare("UPDATE enquiries SET status = ? WHERE id = ?").bind(status, m[1]).run();
    return json({ ok: true }, 200, cors);
  }
  if (m && request.method === "DELETE") {
    const r = await env.DB.prepare("SELECT file_key FROM enquiries WHERE id = ?").bind(m[1]).first();
    if (r && r.file_key) await env.FILES.delete(r.file_key);
    await env.DB.prepare("DELETE FROM enquiries WHERE id = ?").bind(m[1]).run();
    return json({ ok: true }, 200, cors);
  }
  m = p.match(/^\/enquiries\/([\w-]+)\/file$/);
  if (m && request.method === "GET") {
    const r = await env.DB.prepare("SELECT file_key, file_name, file_type FROM enquiries WHERE id = ?").bind(m[1]).first();
    if (!r || !r.file_key) return json({ error: "no file" }, 404, cors);
    const obj = await env.FILES.get(r.file_key);
    if (!obj) return json({ error: "file missing" }, 404, cors);
    return new Response(obj.body, { headers: { ...cors, "content-type": r.file_type || "application/octet-stream", "content-disposition": `attachment; filename="${r.file_name}"`, "cache-control": "no-store" } });
  }

  /* private videos & files (multipart, so big self-tapes work) */
  if (p === "/files" && request.method === "GET") {
    const { results } = await env.DB.prepare("SELECT id, created, title, type, size FROM files WHERE done = 1 ORDER BY created DESC LIMIT 200").all();
    return json({ items: results }, 200, cors);
  }
  if (p === "/files" && request.method === "POST") {
    const { title, name, type, size } = await request.json();
    if (!/^video\/|^application\/pdf$|^image\//.test(type || "")) return json({ error: "videos, images or PDFs only" }, 415, cors);
    if (!(size > 0) || size > 5 * 1024 * 1024 * 1024) return json({ error: "file must be under 5 GB" }, 413, cors);
    const id = newId();
    const key = `files/${id}/${clip(String(name || "file").replace(/[^\w.\- ]+/g, "_"), 120)}`;
    const up = await env.FILES.createMultipartUpload(key, { httpMetadata: { contentType: type } });
    await env.DB.prepare("INSERT INTO files (id, created, title, file_key, type, size, upload_id) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(id, Date.now(), clip(title || name, 160), key, type, size, up.uploadId).run();
    return json({ id }, 200, cors);
  }
  m = p.match(/^\/files\/([\w-]+)\/part\/(\d+)$/);
  if (m && request.method === "PUT") {
    const f = await env.DB.prepare("SELECT file_key, upload_id, done FROM files WHERE id = ?").bind(m[1]).first();
    if (!f || f.done) return json({ error: "no such upload" }, 404, cors);
    const part = await env.FILES.resumeMultipartUpload(f.file_key, f.upload_id).uploadPart(Number(m[2]), request.body);
    return json({ partNumber: part.partNumber, etag: part.etag }, 200, cors);
  }
  m = p.match(/^\/files\/([\w-]+)\/complete$/);
  if (m && request.method === "POST") {
    const f = await env.DB.prepare("SELECT file_key, upload_id FROM files WHERE id = ?").bind(m[1]).first();
    if (!f) return json({ error: "no such upload" }, 404, cors);
    const { parts } = await request.json();
    await env.FILES.resumeMultipartUpload(f.file_key, f.upload_id).complete(parts);
    await env.DB.prepare("UPDATE files SET done = 1, upload_id = NULL WHERE id = ?").bind(m[1]).run();
    return json({ ok: true }, 200, cors);
  }
  m = p.match(/^\/files\/([\w-]+)\/link$/);
  if (m && request.method === "POST") {
    const f = await env.DB.prepare("SELECT id FROM files WHERE id = ? AND done = 1").bind(m[1]).first();
    if (!f) return json({ error: "no such file" }, 404, cors);
    const { days } = await request.json();
    const d = Math.min(Math.max(Number(days) || 7, 1), 90);
    const exp = Date.now() + d * 864e5;
    const sig = await hmac(env, `file:${f.id}:${exp}`);
    return json({ url: `${url.origin}/t/${f.id}?e=${exp}&s=${sig}`, expires: exp }, 200, cors);
  }
  m = p.match(/^\/files\/([\w-]+)$/);
  if (m && request.method === "DELETE") {
    const f = await env.DB.prepare("SELECT file_key, upload_id, done FROM files WHERE id = ?").bind(m[1]).first();
    if (f) {
      if (!f.done && f.upload_id) { try { await env.FILES.resumeMultipartUpload(f.file_key, f.upload_id).abort(); } catch (e) { /* already gone */ } }
      await env.FILES.delete(f.file_key);
      await env.DB.prepare("DELETE FROM files WHERE id = ?").bind(m[1]).run();
    }
    return json({ ok: true }, 200, cors);
  }

  /* stats from Cloudflare Web Analytics */
  if (p === "/stats-token" && request.method === "POST") {
    const { token } = await request.json();
    if (!token || String(token).length < 20) return json({ error: "that doesn't look like a token" }, 400, cors);
    const test = await analytics(env, String(token).trim(), 1);
    if (test.error) return json({ error: "Cloudflare rejected that token: " + test.error }, 400, cors);
    await setSetting(env, "stats_token", String(token).trim());
    return json({ ok: true }, 200, cors);
  }
  if (p === "/stats" && request.method === "GET") {
    const token = await getSetting(env, "stats_token");
    if (!token) return json({ error: "stats not connected" }, 409, cors);
    const days = Math.min(Math.max(Number(url.searchParams.get("days")) || 7, 1), 30);
    return json(await analytics(env, token, days), 200, cors);
  }

  return json({ error: "not found" }, 404, cors);
}

async function analytics(env, token, days) {
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const f = `{ siteTag: $site, datetime_geq: $since }`;
  const query = `query($account: String!, $site: String!, $since: Time!) { viewer { accounts(filter: { accountTag: $account }) {
    total: rumPageloadEventsAdaptiveGroups(limit: 1, filter: ${f}) { count sum { visits } }
    daily: rumPageloadEventsAdaptiveGroups(limit: 40, filter: ${f}, orderBy: [date_ASC]) { count sum { visits } dimensions { date } }
    countries: rumPageloadEventsAdaptiveGroups(limit: 12, filter: ${f}, orderBy: [sum_visits_DESC]) { count sum { visits } dimensions { countryName } }
    pages: rumPageloadEventsAdaptiveGroups(limit: 15, filter: ${f}, orderBy: [count_DESC]) { count dimensions { requestPath } }
    referrers: rumPageloadEventsAdaptiveGroups(limit: 10, filter: ${f}, orderBy: [sum_visits_DESC]) { count sum { visits } dimensions { refererHost } }
    devices: rumPageloadEventsAdaptiveGroups(limit: 5, filter: ${f}, orderBy: [count_DESC]) { count dimensions { deviceType } }
  } } }`;
  const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer " + token },
    body: JSON.stringify({ query, variables: { account: env.ACCOUNT_ID, site: env.SITE_TAG, since } })
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || out.errors) return { error: ((out.errors || [])[0] || {}).message || ("HTTP " + res.status) };
  const a = ((out.data || {}).viewer || {}).accounts || [];
  if (!a.length) return { error: "no access to this account" };
  const g = a[0];
  const total = (g.total || [])[0] || { count: 0, sum: { visits: 0 } };
  return {
    days,
    views: total.count, visits: total.sum.visits,
    daily: (g.daily || []).map((r) => ({ date: r.dimensions.date, views: r.count, visits: r.sum.visits })),
    countries: (g.countries || []).map((r) => ({ name: r.dimensions.countryName || "Unknown", visits: r.sum.visits })),
    pages: (g.pages || []).map((r) => ({ path: r.dimensions.requestPath, views: r.count })),
    referrers: (g.referrers || []).map((r) => ({ host: r.dimensions.refererHost || "Direct / app", visits: r.sum.visits })),
    devices: (g.devices || []).map((r) => ({ type: r.dimensions.deviceType || "Other", views: r.count }))
  };
}

/* ---------------- public: shared videos ---------------- */
async function checkLink(url, env, prefix) {
  const id = decodeURIComponent(url.pathname.slice(prefix.length));
  const exp = Number(url.searchParams.get("e"));
  const sig = url.searchParams.get("s") || "";
  if (!/^[\w-]+$/.test(id) || !exp || exp < Date.now()) return null;
  if (!safeEqual(sig, await hmac(env, `file:${id}:${exp}`))) return null;
  return await env.DB.prepare("SELECT id, title, file_key, type, size FROM files WHERE id = ? AND done = 1").bind(id).first();
}
const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
async function tapePage(url, env) {
  const f = await checkLink(url, env, "/t/");
  const head = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<style>body{margin:0;background:#0a0f1e;color:#f3eee3;font:16px/1.6 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;padding:16px;box-sizing:border-box}
main{width:min(960px,100%)}h1{font:500 1.5rem Georgia,serif;margin:0 0 .3rem}p{color:#8b93a7;margin:.3rem 0 1rem}
video,img,iframe{width:100%;border-radius:12px;background:#000;border:1px solid rgba(201,164,92,.35)}a{color:#e8c87e}</style>`;
  if (!f) return new Response(head + `<main><h1>This link has expired</h1><p>Ask Adeel Rahman for a fresh one on WhatsApp: <a href="https://wa.me/16134083945">+1 613 408 3945</a>.</p></main>`, { status: 410, headers: { "content-type": "text/html; charset=utf-8" } });
  const src = `/v/${f.id}?e=${url.searchParams.get("e")}&s=${encodeURIComponent(url.searchParams.get("s"))}`;
  const media = /^video\//.test(f.type) ? `<video src="${src}" controls playsinline preload="metadata"></video>`
    : /^image\//.test(f.type) ? `<img src="${src}" alt="${esc(f.title)}">` : `<iframe src="${src}" style="height:80vh"></iframe>`;
  const until = new Date(Number(url.searchParams.get("e"))).toUTCString().replace(/:\d\d GMT/, " GMT");
  return new Response(head + `<title>${esc(f.title)} — Adeel Rahman</title><main><h1>${esc(f.title)}</h1><p>Shared privately by Adeel Rahman · link valid until ${until}</p>${media}
<p><a href="${src}&dl=1">Download</a> · <a href="https://crabbyai.github.io/mus/actor/">Adeel Rahman — profile</a></p></main>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
}
async function tapeStream(request, url, env) {
  const f = await checkLink(url, env, "/v/");
  if (!f) return new Response("Link expired", { status: 410 });
  const range = request.headers.get("range");
  let opts = {}, start = 0, end = f.size - 1, partial = false;
  const m = range && range.match(/^bytes=(\d*)-(\d*)$/);
  if (m && (m[1] || m[2])) {
    if (m[1]) { start = Number(m[1]); end = m[2] ? Math.min(Number(m[2]), f.size - 1) : f.size - 1; }
    else { start = Math.max(f.size - Number(m[2]), 0); }
    if (start > end || start >= f.size) return new Response(null, { status: 416, headers: { "content-range": `bytes */${f.size}` } });
    opts.range = { offset: start, length: end - start + 1 };
    partial = true;
  }
  const obj = await env.FILES.get(f.file_key, opts);
  if (!obj) return new Response("Missing", { status: 404 });
  const name = f.file_key.split("/").pop();
  const h = { "content-type": f.type || "application/octet-stream", "accept-ranges": "bytes", "cache-control": "private, no-store", "x-robots-tag": "noindex",
    "content-disposition": `${url.searchParams.get("dl") ? "attachment" : "inline"}; filename="${name}"` };
  if (partial) { h["content-range"] = `bytes ${start}-${end}/${f.size}`; h["content-length"] = String(end - start + 1); }
  else h["content-length"] = String(f.size);
  return new Response(obj.body, { status: partial ? 206 : 200, headers: h });
}

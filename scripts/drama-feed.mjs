#!/usr/bin/env node
/* ============================================================
   DRAMA FEED — builds portfolio/actor/data/dramas.json

   Every episode in the feed is an upload on the broadcaster's OWN
   YouTube channel. Nothing is taken from re-uploaders: the only pages
   read are a channel's uploads list (to see what is on air) and that
   same channel's own search (to list a drama's episodes), so a video
   can only get in if the broadcaster published it.

   What it does on each run
     1. Reads each channel's newest uploads and works out which dramas
        are on air from titles like "Rutba Episode 12 | Promo".
     2. Adds the evergreen picks from portfolio/actor/data/drama-picks.json.
     3. For every drama, searches the broadcaster's channel and keeps
        the full-length episodes (clips, promos, highlights dropped).
     4. Merges with the previous file, so one bad run never loses data.
     5. Writes one plain HTML page per drama (portfolio/actor/watch/) and a
        sitemap, so search engines can find "<drama> all episodes".

   No API key, no dependencies. Node 20+.
     node scripts/drama-feed.mjs
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "portfolio/actor");
const OUT = path.join(SITE, "data/dramas.json");
const PICKS = path.join(SITE, "data/drama-picks.json");
const SITE_URL = "https://crabbyai.github.io/mus/actor/";

const CHANNELS = [
  { key: "ary",   name: "ARY Digital",         handle: "@ARYDigitalasia",       id: "UC4JCksJF76g_MdzPVBJoC3Q" },
  { key: "hum",   name: "HUM TV",              handle: "@HUMTV",                id: "UCEeEQxm6qc_qaTE7qTV5aLQ" },
  { key: "geo",   name: "Har Pal Geo",         handle: "@HarPalGeoOfficial",    id: "UCe9JSDmyqNgA_l2BzGHq1Ug" },
  { key: "green", name: "Green Entertainment", handle: "@GreenEntertainmentTV", id: "UCF2ltLX1dnPa6-L1paPaMzw" },
  { key: "express", name: "Express TV",        handle: "@expressentertainment", id: "UCU1r97baEf3JJI5fY6NtMpA" }
];

const ON_AIR_PER_CHANNEL = 7;   // most-mentioned running dramas kept per channel
const MAX_QUERIES_NEW = 8;      // searches spent on a drama seen for the first time
// Searches spent topping up a drama already in the file. FEED_BUDGET=12 fills gaps faster on a manual run.
const MAX_QUERIES_KNOWN = parseInt(process.env.FEED_BUDGET, 10) || 4;
const MIN_MINUTES = 17;         // shorter than this is a clip, not an episode
const MAX_MINUTES = 110;
const VIEWS_FRESH_DAYS = 14;     // view counts are refreshed only while an episode is this new
const OFF_AIR_AFTER_DAYS = 21;  // no new episode for this long → no longer "on air"

const HEADERS = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
  "accept-language": "en-US,en;q=0.9",
  // Datacentre IPs get a consent interstitial without these.
  cookie: "SOCS=CAI; CONSENT=YES+1"
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);

/* ---------- fetching ---------- */
async function getInitialData(url) {
  let lastErr;
  for (const delay of [0, 2500, 7000]) {
    if (delay) await sleep(delay);
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const m = html.match(/ytInitialData\s*=\s*({.+?});\s*<\/script>/s);
      if (!m) throw new Error(`no ytInitialData (${html.length}b)`);
      return JSON.parse(m[1]);
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}

const text = (o) => (o && (o.simpleText || (o.runs && o.runs.map((r) => r.text).join("")))) || "";

/* Every video on a page, whichever of YouTube's two card formats it uses. */
function videosIn(data) {
  const out = [];
  const seen = new Set();
  (function walk(n) {
    if (!n || typeof n !== "object") return;
    const v = n.videoRenderer;
    if (v && v.videoId) {
      if (!seen.has(v.videoId)) {
        seen.add(v.videoId);
        out.push({ id: v.videoId, title: text(v.title), dur: text(v.lengthText), ago: text(v.publishedTimeText), views: text(v.viewCountText) });
      }
      return;
    }
    const l = n.lockupViewModel;
    if (l && l.contentType === "LOCKUP_CONTENT_TYPE_VIDEO" && l.contentId) {
      if (!seen.has(l.contentId)) {
        seen.add(l.contentId);
        const s = JSON.stringify(l);
        const dur = (s.match(/"thumbnailBadgeViewModel":\{[^}]*?"text":"([\d:]+)"/) || [])[1] || "";
        const ago = (s.match(/"content":"([^"]*\bago)"/) || [])[1] || "";
        const title = (l.metadata && l.metadata.lockupMetadataViewModel && l.metadata.lockupMetadataViewModel.title &&
          l.metadata.lockupMetadataViewModel.title.content) || "";
        out.push({ id: l.contentId, title, dur, ago, views: "" });
      }
      return;
    }
    for (const k in n) walk(n[k]);
  })(data);
  return out;
}

/* ---------- title parsing ---------- */
const NOT_AN_EPISODE = /\b(promo|teaser|trailer|highlights?|recap|best\s*(scene|moment)s?|scenes?|moments?|ost|bts|behind the scenes|review|shorts?|clip|mashup|interview|turning point|coming up)\b/i;
// "Episode 12", "Ep 05", "EP-3", "Last Episode 58", "Mega Last Episode", "2nd Last Ep 57"
const EP_TOKEN = /((?:2nd\s+|second\s+)?(?:(?:mega|last|grand)\s+){0,3})(?:episode|epi|ep)\b[\s.#:-]*(\d{1,3})?/i;

const key = (s) => (s || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "");

/* "Lagan Lagi Episode 17 | Unforgettable Moment" → { name: "Lagan Lagi", n: 17 } */
export function parseTitle(title) {
  const t = (title || "").normalize("NFKC");
  const m = t.match(EP_TOKEN);
  if (!m) return null;
  const head = t.slice(0, m.index);
  const parts = head.split("|").map((p) => p.trim()).filter(Boolean);
  let name = (parts[parts.length - 1] || "")
    .replace(/\b(highlights?|full|new|drama|serial|eng(lish)?\s*sub(titles?)?)\b/gi, " ")
    .replace(/[\[\(][^\]\)]*[\]\)]/g, " ")
    .replace(/[\s\-–—:·.,]+$/g, "").replace(/^[\s\-–—:·.,]+/g, "")
    .replace(/\s{2,}/g, " ").trim();
  if (!name || name.length > 48) return null;
  const mod = (m[1] || "").toLowerCase();
  const secondLast = /last/.test(mod) && /2nd|second/.test(mod);
  const last = /last/.test(mod) && !secondLast;
  // A finale split in two: "Last Mega Ep [Part 2]".
  const pm = t.slice(m.index).match(/\bpart[\s-]*(\d)\b/i);
  return { name, n: m[2] ? parseInt(m[2], 10) : null, last, secondLast, part: pm ? parseInt(pm[1], 10) : undefined };
}

function minutes(dur) {
  const p = (dur || "").split(":").map((x) => parseInt(x, 10));
  if (p.some(isNaN) || p.length < 2) return 0;
  return p.length === 3 ? p[0] * 60 + p[1] + p[2] / 60 : p[0] + p[1] / 60;
}

function agoToIso(ago, now = Date.now()) {
  const m = (ago || "").match(/(\d+)\s*(second|minute|min|hour|h|day|d|week|w|month|mo|year|y)s?\b/i);
  if (!m) return null;
  const unit = m[2].toLowerCase();
  const ms = { second: 1e3, minute: 6e4, min: 6e4, hour: 36e5, h: 36e5, day: 864e5, d: 864e5, week: 6048e5, w: 6048e5,
    month: 2592e6, mo: 2592e6, year: 31536e6, y: 31536e6 }[unit];
  return new Date(now - parseInt(m[1], 10) * ms).toISOString();
}

/* "65,123,456 views" → 65000000. Two significant figures, so the file
   doesn't change every hour over a handful of extra views. */
function parseViews(txt) {
  const m = (txt || "").replace(/,/g, "").match(/([\d.]+)\s*([KMB]?)\s*views/i);
  if (!m) return undefined;
  const n = parseFloat(m[1]) * ({ K: 1e3, M: 1e6, B: 1e9 }[m[2].toUpperCase()] || 1);
  return n > 0 ? Number(n.toPrecision(2)) : undefined;
}

/* ---------- step 1: what is on air ---------- */
async function discoverOnAir(ch) {
  // UULF<id> is the channel's long-form uploads list (no Shorts), newest first.
  const data = await getInitialData(`https://www.youtube.com/playlist?list=UULF${ch.id.slice(2)}&hl=en&gl=US`);
  const tally = new Map();
  for (const v of videosIn(data)) {
    const p = parseTitle(v.title);
    if (!p || !p.n) continue;
    const k = key(p.name);
    if (k.length < 3) continue;
    const t = tally.get(k) || { name: p.name, count: 0, latest: 0 };
    t.count++;
    if (p.n > t.latest) t.latest = p.n;
    tally.set(k, t);
  }
  return [...tally.values()].filter((t) => t.count >= 2)
    .sort((a, b) => b.count - a.count).slice(0, ON_AIR_PER_CHANNEL);
}

/* ---------- step 3: a drama's episodes, from its broadcaster's own channel ---------- */
async function searchChannel(ch, query) {
  const data = await getInitialData(`https://www.youtube.com/${ch.handle}/search?hl=en&gl=US&query=${encodeURIComponent(query)}`);
  return videosIn(data);
}

function harvest(found, dramaKey, eps) {
  let added = 0;
  for (const v of found) {
    const p = parseTitle(v.title);
    if (!p || key(p.name) !== dramaKey) continue;
    if (NOT_AN_EPISODE.test(v.title)) continue;
    const mins = minutes(v.dur);
    if (mins < MIN_MINUTES || mins > MAX_MINUTES) continue;
    if (p.n == null && !p.last && !p.secondLast) continue;
    const had = [...eps.values()].find((e) => e.id === v.id);
    if (had) {
      const views = parseViews(v.views);
      const fresh = !had.p || Date.now() - Date.parse(had.p) < VIEWS_FRESH_DAYS * 864e5;
      if (views && (had.v == null || fresh)) had.v = views;
      continue;
    }
    const slot = (p.n != null ? String(p.n) : p.last ? "last" : "2ndlast") + (p.part ? "p" + p.part : "");
    if (eps.has(slot)) continue; // first upload found for a number wins; keeps the list stable
    eps.set(slot, { n: p.n, id: v.id, d: v.dur, p: agoToIso(v.ago), v: parseViews(v.views), last: p.last || undefined,
      part: p.part, pending: p.n == null ? (p.last ? "last" : "2ndlast") : undefined });
    added++;
  }
  return added;
}

async function collectEpisodes(ch, drama, known) {
  const dramaKey = key(drama.title);
  const eps = new Map();
  for (const e of known || []) eps.set(String(e.n) + (e.part ? "p" + e.part : ""), e);
  const budget = known && known.length ? MAX_QUERIES_KNOWN : MAX_QUERIES_NEW;
  const asked = new Set();
  const ask = async (q) => {
    if (asked.has(q) || asked.size >= budget) return 0;
    asked.add(q);
    await sleep(600);
    try { return harvest(await searchChannel(ch, q), dramaKey, eps); }
    catch (e) { log(`    ! "${q}": ${e.message}`); return 0; }
  };

  if (drama.latestHint) await ask(`${drama.title} Episode ${drama.latestHint}`);
  if (!eps.size || !known || !known.length) {
    await ask(`${drama.title} Episode`);
    await ask(`${drama.title} last episode`);
  }
  // Fill gaps: ask for the lowest missing number until the budget runs out.
  while (asked.size < budget) {
    const nums = [...eps.values()].map((e) => e.n).filter((n) => n != null);
    const top = Math.max(drama.latestHint || 0, ...nums, 0);
    if (!top) break;
    const have = new Set(nums);
    const gaps = [];
    for (let i = 1; i <= top; i++) if (!have.has(i) && !asked.has(`${drama.title} Episode ${i}`)) gaps.push(i);
    if (!gaps.length) break;
    // Random rather than lowest: an episode the channel never uploaded would
    // otherwise soak up every run's searches and starve the other gaps.
    await ask(`${drama.title} Episode ${gaps[Math.floor(Math.random() * gaps.length)]}`);
  }

  // Un-numbered finales ("2nd Last Ep", "Mega Last Episode") take the numbers after the highest one.
  const list = [...eps.values()];
  const top = Math.max(0, ...list.map((e) => e.n || 0));
  const has2nd = list.some((e) => e.pending === "2ndlast");
  for (const e of list) {
    if (e.pending === "2ndlast") e.n = top + 1;
    else if (e.pending === "last") e.n = top + (has2nd ? 2 : 1);
    delete e.pending;
  }
  list.sort((a, b) => a.n - b.n || (a.part || 0) - (b.part || 0));
  return list;
}

/* ---------- step 5: one crawlable page per drama ---------- */
const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function dramaPage(d, ch) {
  const count = new Set(d.episodes.map((e) => e.n)).size;
  const state = d.status === "on-air" ? "new episodes added as they air" : d.complete ? "complete, first episode to last" : "finished serial";
  const title = `${d.title} — all ${count} episodes | Watch free on Adeel Rahman`;
  const desc = `Watch ${d.title}${d.cast ? " (" + d.cast.replace(/ · /g, ", ") + ")" : ""} — ${count} full episodes from ${ch.name}'s official YouTube channel, ${state}. Free, no sign-up.`;
  const label = (e) => (e.last ? "Last Episode " : "Episode ") + e.n + (e.part ? " · Part " + e.part : "");
  const ld = {
    "@context": "https://schema.org", "@type": "TVSeries", name: d.title, numberOfEpisodes: count,
    url: `${SITE_URL}watch/${d.id}.html`, image: `https://i.ytimg.com/vi/${d.episodes[0].id}/hqdefault.jpg`,
    productionCompany: { "@type": "Organization", name: ch.name }, inLanguage: "ur",
    ...(d.cast ? { actor: d.cast.split(" · ").map((n) => ({ "@type": "Person", name: n })) } : {})
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${SITE_URL}watch/${d.id}.html" />
<meta property="og:title" content="${esc(d.title)} — all ${count} episodes" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:image" content="https://i.ytimg.com/vi/${d.episodes[0].id}/hqdefault.jpg" />
<meta name="theme-color" content="#0a0f1e" />
<link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg" />
<link rel="stylesheet" href="../../css/fonts.css" />
<link rel="stylesheet" href="../css/watch.css" />
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
</head>
<body>
<header class="w-nav"><a href="../">← Adeel Rahman · Actor</a><a href="../#dramas">All dramas</a></header>
<main class="w-main">
  <p class="w-eyebrow">${esc(ch.name)}${d.status === "on-air" ? " · On air now" : ""}</p>
  <h1>${esc(d.title)} <em>— all ${count} episodes</em></h1>
  ${d.cast ? `<p class="w-cast">${esc(d.cast)}</p>` : ""}
  <p class="w-lead">Every episode plays from ${esc(ch.name)}'s official YouTube upload — ${esc(state)}. Pick an episode to start watching.</p>
  <a class="w-cta" href="../#watch/${d.id}/${d.episodes[0].n}">▶ Start with Episode ${d.episodes[0].n}</a>
  <ol class="w-eps">
${d.episodes.map((e) => `    <li><a href="../#watch/${d.id}/${e.n}"><img src="https://i.ytimg.com/vi/${e.id}/mqdefault.jpg" alt="" loading="lazy" width="320" height="180" /><span>${esc(d.title)} ${esc(label(e))}</span>${e.d ? `<small>${esc(e.d)}</small>` : ""}</a></li>`).join("\n")}
  </ol>
  <p class="w-note">${esc(d.title)} belongs to ${esc(ch.name)}. Episodes are shown through YouTube's embedded player from the official channel; this site hosts no video. <a href="${esc(d.more)}" rel="noopener">${esc(ch.name)} on YouTube</a>.</p>
</main>
</body>
</html>
`;
}

function writePages(dramas, byKey) {
  const dir = path.join(SITE, "watch");
  fs.mkdirSync(dir, { recursive: true });
  const keep = new Set();
  for (const d of dramas) {
    const file = `${d.id}.html`;
    keep.add(file);
    const html = dramaPage(d, byKey[d.channel]);
    const full = path.join(dir, file);
    let old = ""; try { old = fs.readFileSync(full, "utf8"); } catch {}
    if (old !== html) fs.writeFileSync(full, html);
  }
  for (const f of fs.readdirSync(dir)) if (f.endsWith(".html") && !keep.has(f)) fs.unlinkSync(path.join(dir, f));
  const urls = [SITE_URL, ...dramas.map((d) => `${SITE_URL}watch/${d.id}.html`)];
  const map = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc><changefreq>daily</changefreq></url>`).join("\n") + `\n</urlset>\n`;
  const mapFile = path.join(SITE, "sitemap.xml");
  let oldMap = ""; try { oldMap = fs.readFileSync(mapFile, "utf8"); } catch {}
  if (oldMap !== map) fs.writeFileSync(mapFile, map);
}

/* ---------- main ---------- */
async function main() {
  let prev = { dramas: [] };
  try { prev = JSON.parse(fs.readFileSync(OUT, "utf8")); } catch {}
  const prevByKey = new Map((prev.dramas || []).map((d) => [d.channel + ":" + key(d.title), d]));

  let picks = [];
  try { picks = JSON.parse(fs.readFileSync(PICKS, "utf8")).picks || []; } catch (e) { log("no picks file:", e.message); }

  const byKey = Object.fromEntries(CHANNELS.map((c) => [c.key, c]));
  const wanted = new Map(); // "channel:key" → { title, channel, pick, latestHint }

  for (const p of picks) {
    if (!byKey[p.channel]) continue;
    wanted.set(p.channel + ":" + key(p.title), { title: p.title, channel: p.channel, pick: true, cast: p.cast || "" });
  }

  let discovered = 0;
  for (const ch of CHANNELS) {
    try {
      const on = await discoverOnAir(ch);
      log(`${ch.name}: on air → ${on.map((d) => `${d.name} (ep ${d.latest})`).join(", ") || "nothing recognised"}`);
      for (const d of on) {
        const k = ch.key + ":" + key(d.name);
        const cur = wanted.get(k) || { title: d.name, channel: ch.key };
        cur.latestHint = d.latest;
        wanted.set(k, cur);
        discovered++;
      }
    } catch (e) { log(`WARN ${ch.name}: could not read uploads (${e.message})`); }
    await sleep(800);
  }

  // Dramas already in the file stay in it (a finished serial doesn't vanish).
  for (const [k, d] of prevByKey) if (!wanted.has(k)) wanted.set(k, { title: d.title, channel: d.channel, pick: d.pick, cast: d.cast, stale: true });

  const now = Date.now();
  const dramas = [];
  let fetched = 0;
  for (const [k, w] of wanted) {
    const ch = byKey[w.channel];
    const old = prevByKey.get(k);
    let episodes = (old && old.episodes) || [];
    // Finished and complete, or simply not airing any more: nothing new to find.
    const settled = old && episodes.length && (old.complete || w.stale) && !w.latestHint;
    if (!settled) {
      log(`  ${ch.name} · ${w.title}`);
      try { episodes = await collectEpisodes(ch, w, episodes); fetched++; }
      catch (e) { log(`    ! kept previous (${e.message})`); }
    }
    if (episodes.length < (w.pick ? 1 : 2)) continue;

    // Dates from "3 days ago" drift a little each run; keep the first one we saw.
    const oldById = new Map(((old && old.episodes) || []).map((e) => [e.id, e]));
    for (const e of episodes) { const o = oldById.get(e.id); if (o && o.p) e.p = o.p; if (!e.p) e.p = null; }

    const nums = new Set(episodes.map((e) => e.n));
    const top = episodes[episodes.length - 1];
    let contiguous = true;
    for (let i = 1; i <= top.n; i++) if (!nums.has(i)) { contiguous = false; break; }
    const newest = episodes.reduce((a, e) => (e.p && (!a || e.p > a) ? e.p : a), null);
    const fresh = newest && now - Date.parse(newest) < OFF_AIR_AFTER_DAYS * 864e5;
    dramas.push({
      id: w.channel + "-" + key(w.title),
      title: w.title,
      channel: w.channel,
      cast: w.cast || (old && old.cast) || "",
      pick: !!w.pick,
      status: fresh && !top.last ? "on-air" : "complete",
      complete: !!(top.last && contiguous),
      latest: newest,
      more: `https://www.youtube.com/${ch.handle}/search?query=${encodeURIComponent(w.title + " Episode")}`,
      episodes
    });
  }

  if (!dramas.length) { log("Nothing collected — keeping the previous file."); return; }
  if (!discovered && !fetched && prev.dramas && prev.dramas.length) { log("YouTube unreachable — keeping the previous file."); return; }

  dramas.sort((a, b) => (b.latest || "").localeCompare(a.latest || ""));
  writePages(dramas, byKey);
  // Nothing new: leave the file alone, so an idle hour doesn't cost a commit and a redeploy.
  if (JSON.stringify(dramas) === JSON.stringify(prev.dramas || [])) { log("No change."); return; }
  const out = {
    updated: new Date().toISOString(),
    channels: Object.fromEntries(CHANNELS.map((c) => [c.key, { name: c.name, url: `https://www.youtube.com/${c.handle}` }])),
    dramas
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out) + "\n");
  const total = dramas.reduce((s, d) => s + d.episodes.length, 0);
  log(`Wrote ${dramas.length} dramas, ${total} episodes.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(e); process.exit(1); });
}

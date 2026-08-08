/* ============================================================
   TAX WATCH — read the rates off the source, every week
   ------------------------------------------------------------
   The job is to answer one question automatically: does the rate
   we are showing buyers still appear on the government page it
   came from?

   It does that by fetching each source, reducing it to visible
   text, and looking for the percentages that sit near the words
   that identify a rate — "236K" and "purchase", "stamp duty" and
   "urban". If the figure we hold is in there, the rate is
   confirmed and stamped with the date. If it isn't, every
   percentage that WAS found nearby is reported, and when exactly
   one plausible candidate turns up it's written into a proposal.

   What it never does is edit a live rate. A proposal lands as a
   pull request with a table of held-versus-found, and a person
   merges it. That is the Dependabot bargain and it is the right
   one here: the finding is automatic, the publishing is not,
   because these numbers end up in front of someone deciding what
   they can afford.

   Deep links on government sites rot — two FBR category URLs
   started returning HTTP 500 within a week of being written down
   — so a source that fails is re-discovered by crawling its own
   site root for a link whose text matches what we're after, and
   the working URL is written back.

   Everything above the runner() at the bottom is a pure function
   with no network, which is what scripts/tax-watch.test.mjs
   exercises against fixtures.
   ============================================================ */

/* ---------- pure helpers ---------- */

/** Visible text only, lowercased and whitespace-collapsed. Scripts, styles
 *  and markup carry no rates and change constantly. */
export function textOf(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** Percentages that belong to one rate.
 *
 *  A plain character window round a keyword is not good enough on these pages.
 *  The 236C table and the 236K table sit a few lines apart, so a 320-character
 *  window round either one swallowed the other's figures, and a "save 30%"
 *  banner further up leaked in too. The fixtures caught both before any of it
 *  could reach a proposal.
 *
 *  The window is therefore bounded by the section it sits in: it begins after
 *  the last competing marker before the keyword and ends at the first one
 *  after it. `boundaries` are the other rates' markers, which on a rate card
 *  is exactly where one row's meaning stops and the next starts.
 */
export function ratesNear(text, keywords, opts = {}) {
  if (!keywords || !keywords.length) return [];
  const window = opts.window || 320;
  const back = opts.back == null ? 160 : opts.back;
  const own = keywords.map((k) => k.toLowerCase());
  const bounds = (opts.boundaries || [])
    .map((b) => b.toLowerCase())
    .filter((b) => !own.includes(b));
  const [first, ...rest] = own;
  const out = new Set();
  let i = 0;
  while ((i = text.indexOf(first, i)) !== -1) {
    // Anchor the start on our own heading rather than a blind character
    // count. On a rate card the heading ("advance tax on purchase … 236K")
    // runs straight into its own table, so the nearest of our other keywords
    // before the marker is exactly where this rate's section begins — and
    // starting there leaves the previous table's figures outside the window.
    let from = i;
    rest.forEach((k) => {
      const p = text.lastIndexOf(k, i);
      if (p !== -1 && p >= i - back) from = Math.min(from, p);
    });
    let to = Math.min(text.length, i + window);
    bounds.forEach((b) => {
      // never reach back across another rate's marker
      const before = text.lastIndexOf(b, i - 1);
      if (before !== -1 && before >= from && before < i) from = before + b.length;
      const after = text.indexOf(b, i + first.length);
      if (after !== -1 && after < to) to = after;
    });
    const slice = text.slice(from, to);
    if (rest.every((k) => slice.includes(k))) {
      const m = slice.match(/(\d{1,3}(?:\.\d{1,2})?)\s*(?:%|per\s?cent)/g) || [];
      m.forEach((s) => {
        const v = parseFloat(s);
        // A property tax rate is a small percentage. Anything above 40 is a
        // year, a section number or a percentage of something else entirely.
        if (isFinite(v) && v >= 0 && v <= 40) out.add(v);
      });
    }
    i += first.length;
  }
  return [...out].sort((a, b) => a - b);
}

export function getPath(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}

export function setPath(obj, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const target = keys.reduce((o, k) => (o[k] = o[k] ?? {}), obj);
  target[last] = value;
  return obj;
}

/** One rule against one page. Returns what we hold, what the page shows,
 *  and whether the two still agree. */
export function checkRule(text, rule, held, boundaries) {
  const found = ratesNear(text, rule.keywords,
    { window: rule.window, back: rule.back, boundaries: boundaries || rule.boundaries });
  const ok = found.includes(held);
  // Only ever propose when the page is unambiguous. Two candidates is a
  // table we have misread, not a rate change.
  const propose = !ok && found.length === 1 ? found[0] : null;
  return { path: rule.path, label: rule.label, held, found, ok, propose };
}

/** Sign-in pages, portals and file downloads are never the rate card. The
 *  first live run proved the point: hunting "income tax" from the FBR home
 *  page landed on the IRIS login screen, which matches the words and contains
 *  no rates at all. */
export function looksLikePortal(url) {
  return /login|signin|sign-in|txplogin|\biris\b|logout|\.zip$|\.xlsx?$/i.test(url);
}

/** Absolute links whose anchor text matches every keyword — used to find a
 *  page again after its URL has rotted. */
export function discoverLinks(html, baseUrl, keywords) {
  const out = [];
  const re = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const want = keywords.map((k) => k.toLowerCase());
  let m;
  while ((m = re.exec(html))) {
    const label = textOf(m[2]);
    if (!label || !want.every((k) => label.includes(k))) continue;
    try {
      const u = new URL(m[1], baseUrl).toString();
      if (/^https?:/.test(u) && !looksLikePortal(u) && !out.includes(u)) out.push(u);
    } catch { /* a malformed href is not worth a crash */ }
  }
  return out;
}

/** A Finance Act takes effect on 1 July. */
export function lastJuly(now = new Date()) {
  const y = now.getUTCFullYear();
  const j = new Date(Date.UTC(y, 6, 1));
  return now < j ? new Date(Date.UTC(y - 1, 6, 1)) : j;
}

export function isStale(effectiveFrom, now = new Date()) {
  return new Date(effectiveFrom + "T00:00:00Z") < lastJuly(now);
}

/** The markdown a human actually reads. */
export function report(results, meta) {
  const L = [];
  const bad = results.filter((r) => !r.ok);
  const good = results.filter((r) => r.ok);

  L.push("| Rate | We show | Found on the source | |");
  L.push("| --- | --- | --- | --- |");
  results.forEach((r) => {
    L.push("| " + r.label + " | " + r.held + "% | " +
      (r.found.length ? r.found.map((f) => f + "%").join(", ") : "_nothing nearby_") +
      " | " + (r.ok ? "✅" : r.propose !== null ? "⚠️ proposes " + r.propose + "%" : "❌") + " |");
  });
  L.push("");
  L.push(good.length + " of " + results.length + " confirmed against the live page.");
  if (bad.length) {
    L.push("");
    L.push("**" + bad.length + " could not be confirmed.** A rate that isn't found may have " +
      "changed, or the page may simply word it differently — check before changing anything.");
  }
  if (meta.unreachable.length) {
    L.push("");
    L.push("Could not reach:");
    meta.unreachable.forEach((u) => L.push("- " + u));
  }
  if (meta.rediscovered.length) {
    L.push("");
    L.push("Found a new URL for:");
    meta.rediscovered.forEach((u) => L.push("- " + u.id + " → " + u.url));
  }
  if (meta.rejected && meta.rejected.length) {
    L.push("");
    L.push("Rejected while hunting for a replacement page:");
    meta.rejected.forEach((u) => L.push("- " + u));
  }
  if (meta.diagnostics && meta.diagnostics.length) {
    L.push("");
    L.push("<details><summary>Why nothing was found (" + meta.diagnostics.length + ")</summary>");
    L.push("");
    meta.diagnostics.forEach((d) => {
      L.push("**" + d.label + "** — page has " + d.chars + " characters of text.");
      L.push("- keywords present: " + (d.present.length ? "`" + d.present.join("`, `") + "`" : "_none_"));
      L.push("- keywords missing: " + (d.missing.length ? "`" + d.missing.join("`, `") + "`" : "_none_"));
      if (d.snippet) L.push("- around the first hit: `" + d.snippet.replace(/`/g, "'") + "`");
      L.push("");
    });
    L.push("</details>");
  }
  if (meta.stale) {
    L.push("");
    L.push("The rates on file are dated **" + meta.effectiveFrom + "**, before 1 July " +
      meta.staleYear + ". A Finance Act has taken effect since.");
  }
  return L.join("\n");
}

/* ---------- the run ---------- */

async function get(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": "Mozilla/5.0 (tax-rate watcher; adeelrahman.estates)" },
        signal: AbortSignal.timeout(30000)
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.text();
    } catch (err) {
      if (i === tries - 1) return { error: err.message };
      await new Promise((r) => setTimeout(r, 4000 * (i + 1)));
    }
  }
}

export async function run({ fs, path, now = new Date() }) {
  const FILE = path;
  const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
  const meta = { unreachable: [], rediscovered: [], rejected: [], diagnostics: [], stale: false,
                 effectiveFrom: data.effectiveFrom, staleYear: lastJuly(now).getUTCFullYear() };
  const pages = {};

  for (const src of data.sources) {
    let html = await get(src.url);
    // A rotted deep link is the normal failure. Go back to the site root and
    // look for the page by the words on the link rather than its address.
    if (html && html.error && src.root && src.find) {
      const rootHtml = await get(src.root);
      if (rootHtml && !rootHtml.error) {
        // A page only replaces the old URL if it actually talks about the
        // thing we came for. Without this the crawl happily adopts any page
        // that loads, and a login screen loads perfectly.
        const wanted = ((data.audit && data.audit.rules) || [])
          .filter((r) => r.source === src.id)
          .map((r) => r.keywords[0].toLowerCase());
        const candidates = discoverLinks(rootHtml, src.root, src.find);
        for (const c of candidates.slice(0, 5)) {
          const attempt = await get(c, 1);
          if (!attempt || attempt.error) continue;
          const t = textOf(attempt);
          if (wanted.length && !wanted.some((k) => t.includes(k))) {
            meta.rejected.push(src.id + " → " + c + " (loads, but mentions none of: " +
              wanted.join(", ") + ")");
            continue;
          }
          html = attempt;
          src.url = c;
          meta.rediscovered.push({ id: src.id, url: c });
          break;
        }
      }
    }
    if (!html || html.error) {
      meta.unreachable.push(src.label + " (" + src.url + "): " + (html ? html.error : "no response"));
      continue;
    }
    pages[src.id] = textOf(html);
    src.lastFetched = now.toISOString().slice(0, 10);
  }

  // Every rule's marker bounds every other rule sharing the same page.
  const allRules = (data.audit && data.audit.rules) || [];
  const bounds = {};
  allRules.forEach((r) => {
    bounds[r.source] = bounds[r.source] || [];
    if (r.keywords && r.keywords[0]) bounds[r.source].push(r.keywords[0]);
  });

  const today = now.toISOString().slice(0, 10);
  const prevStatus = (data.audit && data.audit.status) || {};
  const status = {};
  const results = [];
  for (const rule of allRules) {
    const text = pages[rule.source];
    if (!text) continue;
    const held = getPath(data, rule.path);
    if (typeof held !== "number") continue;
    const r = checkRule(text, rule, held, bounds[rule.source] || []);
    results.push(r);
    // A rule that finds nothing is the interesting case, and the only way to
    // fix it is to know what the page actually says. Report which of its
    // keywords appeared at all, and the text around the first one.
    if (!r.found.length) {
      const present = rule.keywords.filter((k) => text.includes(k.toLowerCase()));
      const at = present.length ? text.indexOf(present[0].toLowerCase()) : -1;
      meta.diagnostics.push({
        label: rule.label, chars: text.length,
        present, missing: rule.keywords.filter((k) => !present.includes(k)),
        snippet: at >= 0 ? text.slice(Math.max(0, at - 90), at + 210) : null
      });
    }
    // Kept in one audit map rather than sprinkled through the rate data, so
    // the site can say which lines were actually seen on the source and when
    // — and so the rates themselves stay clean enough to hand-edit.
    status[rule.path] = {
      label: rule.label, ok: r.ok, found: r.found,
      lastSeen: r.ok ? today : (prevStatus[rule.path] || {}).lastSeen || null
    };
  }

  meta.stale = isStale(data.effectiveFrom, now);
  data.checkedAt = today;
  if (data.audit) {
    data.audit.status = status;
    data.audit.lastRun = { at: today, confirmed: results.filter((r) => r.ok).length,
                           total: results.length,
                           unreachable: meta.unreachable.length };
  }

  const proposals = results.filter((r) => r.propose !== null);
  data.proposed = proposals.length
    ? { at: data.checkedAt, note: "Found on the source but NOT applied. Review and merge to publish.",
        changes: proposals.map((p) => ({ path: p.path, from: p.held, to: p.propose, label: p.label })) }
    : null;

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
  return { results, meta, proposals, data };
}

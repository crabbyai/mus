/* ============================================================
   DRAMA FEED
   Renders data/dramas.json (rebuilt hourly by
   .github/workflows/drama-feed.yml) three ways, mirroring the
   live-listings feed on the property site:
     1. Live Drama Watch  — the newest episodes, as feed cards
     2. This week's most watched — a spotlight carousel
     3. The library       — every serial, searchable, with a player
   Episodes play through YouTube's own embedded player from the
   broadcaster's official upload. Nothing is hosted here.
   ============================================================ */
(function () {
  "use strict";

  const hub = document.getElementById("dramas");
  if (!hub) return;

  const FEED = "data/dramas.json";
  const RECHECK_MS = 10 * 60 * 1000;
  const NEW_HOURS = 48;
  const SEEN_KEY = "ar-drama-seen", FAV_KEY = "ar-drama-favs", AUTO_KEY = "ar-drama-autonext";
  const YT_ORIGIN = "https://www.youtube-nocookie.com";
  const WATCH_STEP = 8;

  const el = (id) => document.getElementById(id);
  const watchSec = el("watch"), feedGrid = el("feedGrid"), feedUpdated = el("feedUpdated"), feedMore = el("feedMore");
  const spotSec = el("featured"), spotStage = el("spotStage");
  const stamp = el("dramaStamp"), search = el("dramaSearch"), chips = el("dramaChips"), empty = el("dramaEmpty");
  const player = el("dramaPlayer"), frame = el("dramaFrame");

  let feed = null, channel = "all", query = "", watchShown = WATCH_STEP;
  let current = null;   // { drama, index } while the player is open
  let lastFocus = null, spotIdx = 0, spotTop = [];

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const thumb = (id, size) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/${size || "mqdefault"}.jpg`;
  const chName = (d) => (feed.channels[d.channel] && feed.channels[d.channel].name) || "";
  const SHORT = { ary: "ARY", hum: "HUM TV", geo: "GEO", green: "GREEN", express: "EXPRESS" };

  function ago(iso) {
    if (!iso) return "";
    const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + " min ago";
    if (s < 86400) return Math.round(s / 3600) + (Math.round(s / 3600) === 1 ? " hr ago" : " hrs ago");
    const days = Math.round(s / 86400);
    if (days === 1) return "yesterday";
    if (days < 30) return days + " days ago";
    if (days < 365) return Math.round(days / 30) + " mo ago";
    return Math.round(days / 365) + " yr ago";
  }
  function views(n) {
    n = +n || 0;
    if (!n) return "";
    if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, "") + "M views";
    if (n >= 1e3) return Math.round(n / 1e3) + "K views";
    return n + " views";
  }
  const isNew = (iso) => iso && Date.now() - Date.parse(iso) < NEW_HOURS * 3600e3;
  const epLabel = (e) => (e.last ? "Last Episode " + e.n : "Episode " + e.n) + (e.part ? " · Part " + e.part : "");
  const epCount = (d) => d.episodes[d.episodes.length - 1].n;
  const link = (d, e) => "#watch/" + d.id + (e ? "/" + e.n : "");

  /* ---------- this browser's memory: watched, saved, autoplay ---------- */
  function read(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; } }
  function write(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* private mode: still works, just isn't remembered */ } }
  const seen = () => read(SEEN_KEY, {});
  const favs = () => read(FAV_KEY, []);
  const isFav = (id) => favs().indexOf(id) >= 0;
  function markSeen(dramaId, n) {
    const s = seen(), d = s[dramaId] || { eps: [] };
    if (d.eps.indexOf(n) < 0) d.eps.push(n);
    d.last = n; d.t = Date.now();
    s[dramaId] = d;
    write(SEEN_KEY, s);
  }
  function toggleFav(id) {
    const f = favs(), i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1); else f.unshift(id);
    write(FAV_KEY, f);
    return i < 0;
  }
  const favBtn = (d, cls) => {
    const on = isFav(d.id);
    return `<button type="button" class="${cls}${on ? " is-fav" : ""}" data-fav="${esc(d.id)}" aria-pressed="${on}"
      aria-label="${on ? "Remove " : "Save "}${esc(d.title)} ${on ? "from" : "to"} my list">♥</button>`;
  };

  /* ---------- 1. Live Drama Watch ---------- */
  function newestPerDrama() {
    const out = [];
    feed.dramas.forEach((d) => {
      let best = -1;
      d.episodes.forEach((e, i) => { if (e.p && (best < 0 || e.p >= d.episodes[best].p)) best = i; });
      if (best >= 0) out.push({ d, i: best, e: d.episodes[best] });
    });
    return out.sort((a, b) => (a.e.p < b.e.p ? 1 : -1));
  }
  function feedCard(x) {
    const d = x.d, e = x.e;
    const meta = [e.d, views(e.v)].filter(Boolean).join(" · ");
    return `<article class="feedcard glass">
      ${favBtn(d, "feedcard__fav")}
      <a class="feedcard__media" href="${link(d, e)}" data-drama="${esc(d.id)}" data-index="${x.i}" aria-label="Watch ${esc(d.title)} ${esc(epLabel(e))}">
        <img src="${thumb(e.id)}" alt="" loading="lazy" decoding="async" width="320" height="180" />
        ${isNew(e.p) ? '<span class="feedcard__new">New</span>' : ""}
        <span class="feedcard__play">▶</span>
      </a>
      <div class="feedcard__body">
        <div class="feedcard__meta">
          <span class="feedcard__badge feedcard__badge--${esc(d.channel)}">${esc(SHORT[d.channel] || chName(d))}</span>
          <span class="feedcard__time">${esc(ago(e.p))}</span>
        </div>
        <h3 class="feedcard__title"><a href="${link(d, e)}" data-drama="${esc(d.id)}" data-index="${x.i}">${esc(d.title)} — ${esc(epLabel(e))}</a></h3>
        ${meta ? `<p class="feedcard__sub">${esc(meta)}${d.cast ? " · " + esc(d.cast) : ""}</p>` : ""}
        <a class="feedcard__vet" href="watch/${esc(d.id)}.html" data-drama="${esc(d.id)}">All ${epCount(d)} episodes →</a>
      </div>
    </article>`;
  }
  function renderWatch() {
    const items = newestPerDrama().filter((x) => Date.now() - Date.parse(x.e.p) < 30 * 86400e3);
    if (!items.length) { watchSec.hidden = true; return; }
    watchSec.hidden = false;
    feedGrid.innerHTML = items.slice(0, watchShown).map(feedCard).join("");
    feedMore.hidden = items.length <= watchShown;
    const total = feed.dramas.reduce((s, d) => s + d.episodes.length, 0);
    feedUpdated.textContent = `Feed updated ${ago(feed.updated)} · ${feed.dramas.length} dramas · ${total} episodes · re-checked every hour`;
  }

  /* ---------- 2. This week's most watched ---------- */
  function renderSpot() {
    const week = [];
    feed.dramas.forEach((d) => d.episodes.forEach((e, i) => {
      if (e.p && Date.now() - Date.parse(e.p) < 7 * 86400e3) week.push({ d, i, e });
    }));
    const byViews = week.some((x) => x.e.v > 0);
    week.sort((a, b) => (byViews ? (b.e.v || 0) - (a.e.v || 0) : (a.e.p < b.e.p ? 1 : -1)));
    // One entry per drama, so the top five are five different serials.
    const used = {};
    spotTop = week.filter((x) => (used[x.d.id] ? false : (used[x.d.id] = true))).slice(0, 5);
    if (!spotTop.length) { spotSec.hidden = true; return; }
    spotSec.hidden = false;
    if (spotIdx >= spotTop.length) spotIdx = 0;
    const x = spotTop[spotIdx], d = x.d, e = x.e;
    spotStage.innerHTML = `
      <div class="spotlight__media">
        <a class="spotlight__vlink" href="${link(d, e)}" data-drama="${esc(d.id)}" data-index="${x.i}" aria-label="Watch ${esc(d.title)} ${esc(epLabel(e))}">
          <img src="${thumb(e.id, "maxresdefault")}" data-fallback="${thumb(e.id, "hqdefault")}" alt="" />
          <span class="spotlight__play">▶</span>
        </a>
        <span class="spotlight__badge">${byViews ? (spotIdx === 0 ? "🔥 #1 most watched" : "#" + (spotIdx + 1) + " this week") : "🆕 Latest episode"}</span>
        ${spotTop.length > 1 ? `<button class="spotlight__nav spotlight__nav--prev" type="button" data-spot="-1" aria-label="Previous">←</button>
        <button class="spotlight__nav spotlight__nav--next" type="button" data-spot="1" aria-label="Next">→</button>` : ""}
      </div>
      <div class="spotlight__info">
        <p class="spotlight__loc">${esc(chName(d))} · ${esc(ago(e.p))}</p>
        <h3 class="spotlight__title">${esc(d.title)} — ${esc(epLabel(e))}</h3>
        <div class="spotlight__tags">${d.cast ? d.cast.split(" · ").map((n) => `<span>${esc(n)}</span>`).join("") : ""}${e.d ? `<span>${esc(e.d)}</span>` : ""}<span>${d.status === "on-air" ? "On air" : "Complete"}</span></div>
        <div class="spotlight__price"><span>${byViews && e.v ? "Watched so far" : "Uploaded"}</span><strong>${byViews && e.v ? esc(views(e.v)) : esc(ago(e.p))}</strong></div>
        <div class="spotlight__actions">
          <a class="btn btn--gold" href="${link(d, e)}" data-drama="${esc(d.id)}" data-index="${x.i}">▶ Watch ${esc(epLabel(e))} <span class="btn__arrow">→</span></a>
          <a class="btn btn--ghost" href="watch/${esc(d.id)}.html" data-drama="${esc(d.id)}" data-index="0">From Episode 1</a>
        </div>
        <div class="spotlight__dots">${spotTop.map((_, i) => `<button type="button" class="spotlight__dot${i === spotIdx ? " is-active" : ""}" data-spot-go="${i}" aria-label="Show number ${i + 1}"></button>`).join("")}</div>
      </div>`;
  }

  /* ---------- 3. The library ---------- */
  function dramaCard(d, resumeN) {
    const first = d.episodes[0], top = d.episodes[d.episodes.length - 1];
    let line, href = link(d), idx = "";
    if (resumeN) {
      const at = d.episodes.findIndex((e) => e.n === resumeN);
      const next = at >= 0 && at < d.episodes.length - 1 ? d.episodes[at + 1] : null;
      line = next ? "Up next: " + epLabel(next) : "Watched to " + epLabel(d.episodes[Math.max(0, at)]);
      idx = ` data-index="${next ? at + 1 : Math.max(0, at)}"`;
    } else {
      line = d.status === "on-air" ? "Latest: " + epLabel(top) + (top.p ? " · " + ago(top.p) : "") : epCount(d) + " episodes";
      href = "watch/" + d.id + ".html";
    }
    const cover = resumeN && idx ? d.episodes[parseInt(idx.match(/\d+/)[0], 10)] : first;
    return `<article class="dcard">
      ${favBtn(d, "dcard__fav")}
      <a class="dcard__link" href="${esc(href)}" data-drama="${esc(d.id)}"${idx}>
        <span class="dcard__thumb"><img src="${thumb(cover.id)}" alt="" loading="lazy" decoding="async" width="320" height="180" />
          ${d.status === "on-air" ? '<span class="dcard__tag">On air</span>' : (d.complete ? '<span class="dcard__tag dcard__tag--gold">Complete</span>' : "")}</span>
        <span class="dcard__body"><span class="dcard__title">${esc(d.title)}</span>
          <span class="dcard__ep">${esc(line)}</span>
          <span class="dcard__meta">${esc(chName(d))}${d.cast ? " · " + esc(d.cast) : ""}</span></span>
      </a></article>`;
  }
  function block(name, list, html) {
    el("drama" + name + "Block").hidden = !list.length;
    el("drama" + name).innerHTML = html;
    const c = el("drama" + name + "Count");
    if (c) c.textContent = list.length + (list.length === 1 ? " serial" : " serials");
  }
  function renderHub() {
    const q = query.trim().toLowerCase();
    const list = feed.dramas.filter((d) =>
      (channel === "all" || d.channel === channel) &&
      (!q || d.title.toLowerCase().indexOf(q) >= 0 || (d.cast || "").toLowerCase().indexOf(q) >= 0));
    const s = seen(), f = favs();
    const cont = list.filter((d) => s[d.id] && s[d.id].last).sort((a, b) => (s[b.id].t || 0) - (s[a.id].t || 0)).slice(0, 8);
    const mine = f.map((id) => list.find((d) => d.id === id)).filter(Boolean);
    const onAir = list.filter((d) => d.status === "on-air");
    const lib = list.filter((d) => d.status !== "on-air").sort((a, b) => (b.pick - a.pick) || a.title.localeCompare(b.title));

    block("Continue", q ? [] : cont, cont.map((d) => dramaCard(d, s[d.id].last)).join(""));
    block("Fav", q ? [] : mine, mine.map((d) => dramaCard(d)).join(""));
    block("OnAir", onAir, onAir.map((d) => dramaCard(d)).join(""));
    block("Library", lib, lib.map((d) => dramaCard(d)).join(""));
    empty.hidden = list.length > 0;
    const total = feed.dramas.reduce((n, d) => n + d.episodes.length, 0);
    stamp.textContent = `${feed.dramas.length} dramas · ${total} episodes · updated ${ago(feed.updated)}`;
  }
  function renderAll() { if (!feed) return; renderWatch(); renderSpot(); renderHub(); }

  /* ---------- player ---------- */
  function open(dramaId, index, keepHash) {
    const d = feed && feed.dramas.find((x) => x.id === dramaId);
    if (!d) return false;
    if (index == null || isNaN(index)) {
      // Resume where this visitor left off; otherwise a running serial opens on its newest episode, a finished one on episode 1.
      const s = seen()[d.id];
      const at = s && s.last ? d.episodes.findIndex((e) => e.n === s.last) : -1;
      index = at >= 0 ? at : (d.status === "on-air" ? d.episodes.length - 1 : 0);
    }
    index = Math.min(Math.max(0, index), d.episodes.length - 1);
    const e = d.episodes[index];
    if (!player.classList.contains("is-open")) lastFocus = document.activeElement;
    current = { drama: d, index };

    el("dramaTitle").innerHTML = `${esc(d.title)} <em>— ${esc(epLabel(e))}</em>`;
    el("dramaSub").textContent = [chName(d), d.cast, views(e.v), e.p ? "uploaded " + ago(e.p) : ""].filter(Boolean).join(" · ");
    frame.innerHTML = `<iframe id="dramaIframe" src="${YT_ORIGIN}/embed/${encodeURIComponent(e.id)}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(location.origin)}"
      title="${esc(d.title)} ${esc(epLabel(e))}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    listenToPlayer(el("dramaIframe"));
    el("dramaPrev").disabled = index === 0;
    el("dramaNext").disabled = index === d.episodes.length - 1;
    el("dramaYT").href = "https://www.youtube.com/watch?v=" + encodeURIComponent(e.id);

    const share = location.origin + location.pathname + link(d, e);
    el("dramaShare").href = "https://wa.me/?text=" + encodeURIComponent(`${d.title} ${epLabel(e)} — watch free: ${share}`);
    el("dramaCopy").dataset.url = share;
    el("dramaCopy").textContent = "Copy link";
    const fb = el("dramaFavBtn"), on = isFav(d.id);
    fb.dataset.fav = d.id; fb.classList.toggle("is-fav", on); fb.setAttribute("aria-pressed", on);
    fb.textContent = on ? "♥ In my list" : "♡ Add to my list";

    markSeen(d.id, e.n);
    const watched = (seen()[d.id] || { eps: [] }).eps;
    el("dramaEps").innerHTML = d.episodes.map((x, i) =>
      `<button type="button" class="dep${i === index ? " is-current" : (watched.indexOf(x.n) >= 0 ? " is-seen" : "")}" data-index="${i}"
        aria-label="${esc(epLabel(x))}"${i === index ? ' aria-current="true"' : ""}>${x.n}${x.part ? "·" + x.part : ""}</button>`).join("");
    el("dramaEpsTitle").textContent = epCount(d) + " episodes · " + chName(d) + "’s official channel";

    // Say so plainly when the list has holes rather than letting a visitor hunt for a missing number.
    const have = {}; d.episodes.forEach((x) => { have[x.n] = 1; });
    let missing = 0; for (let n = 1; n <= epCount(d); n++) if (!have[n]) missing++;
    const gap = el("dramaGap");
    gap.hidden = !missing;
    gap.innerHTML = missing ? `${missing} episode${missing === 1 ? " isn’t" : "s aren’t"} in the feed yet — <a href="${esc(d.more)}" target="_blank" rel="noopener">find ${missing === 1 ? "it" : "them"} on ${esc(chName(d))}’s channel</a>.` : "";

    player.classList.add("is-open");
    player.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
    if (!keepHash) history.replaceState(null, "", link(d, e));
    document.title = `${d.title} ${epLabel(e)} — watch free | Adeel Rahman`;
    el("dramaClose").focus({ preventScroll: true });
    player.scrollTop = 0;
    return true;
  }

  function close() {
    if (!player.classList.contains("is-open")) return;
    player.classList.remove("is-open");
    player.setAttribute("aria-hidden", "true");
    frame.innerHTML = ""; // stops playback
    document.documentElement.style.overflow = "";
    if (window.__lenis) window.__lenis.start();
    history.replaceState(null, "", location.pathname + location.search);
    document.title = hub.dataset.title || document.title;
    current = null;
    renderAll(); // continue-watching row, hearts
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  /* Autoplay the next episode. YouTube's embed reports its state over
     postMessage once asked; state 0 means the video ended. If the player
     never answers, nothing happens and the Next button still works. */
  function listenToPlayer(iframe) {
    iframe.addEventListener("load", () => {
      const say = (o) => { try { iframe.contentWindow.postMessage(JSON.stringify(o), YT_ORIGIN); } catch (e) { /* not ready */ } };
      say({ event: "listening", id: 1, channel: "widget" });
      say({ event: "command", func: "addEventListener", args: ["onStateChange"], id: 1, channel: "widget" });
    });
  }
  window.addEventListener("message", (ev) => {
    if (ev.origin !== YT_ORIGIN || !current) return;
    const iframe = el("dramaIframe");
    if (!iframe || ev.source !== iframe.contentWindow) return;
    let data; try { data = typeof ev.data === "string" ? JSON.parse(ev.data) : ev.data; } catch (e) { return; }
    if (!data) return;
    const state = data.event === "onStateChange" ? data.info : (data.event === "infoDelivery" && data.info ? data.info.playerState : undefined);
    if (state === 0 && el("dramaAuto").checked && current.index < current.drama.episodes.length - 1) {
      open(current.drama.id, current.index + 1);
    }
  });

  /* A shared link like …/#watch/hum-parizaad/12 opens straight on that episode. */
  function openFromHash() {
    const m = location.hash.match(/^#watch\/([a-z0-9-]+)(?:\/(\d+))?/);
    if (!m || !feed) return;
    const d = feed.dramas.find((x) => x.id === m[1]);
    if (!d) return;
    const idx = m[2] ? d.episodes.findIndex((e) => e.n === parseInt(m[2], 10)) : -1;
    open(d.id, idx >= 0 ? idx : null, true);
  }

  /* ---------- events (delegated: the cards are re-rendered) ---------- */
  document.addEventListener("click", (ev) => {
    const fav = ev.target.closest("[data-fav]");
    if (fav) {
      ev.preventDefault();
      toggleFav(fav.dataset.fav);
      if (player.classList.contains("is-open") && current) {
        const on = isFav(current.drama.id), fb = el("dramaFavBtn");
        fb.classList.toggle("is-fav", on); fb.setAttribute("aria-pressed", on);
        fb.textContent = on ? "♥ In my list" : "♡ Add to my list";
      } else renderAll();
      return;
    }
    const spot = ev.target.closest("[data-spot], [data-spot-go]");
    if (spot && spotTop.length) {
      spotIdx = spot.dataset.spotGo != null ? +spot.dataset.spotGo : (spotIdx + +spot.dataset.spot + spotTop.length) % spotTop.length;
      renderSpot();
      return;
    }
    const a = ev.target.closest("[data-drama]");
    if (a && !player.contains(a)) {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return; // let people open the drama's own page in a new tab
      ev.preventDefault();
      open(a.dataset.drama, a.dataset.index != null ? parseInt(a.dataset.index, 10) : null);
      return;
    }
    const chip = ev.target.closest(".dchip");
    if (chip) {
      channel = chip.dataset.channel;
      chips.querySelectorAll(".dchip").forEach((c) => {
        c.classList.toggle("is-active", c === chip);
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });
      renderHub();
    }
  });
  feedMore.addEventListener("click", () => { watchShown += WATCH_STEP; renderWatch(); });
  search.addEventListener("input", () => { query = search.value; renderHub(); });
  player.addEventListener("click", (ev) => {
    if (ev.target === player || ev.target.closest("#dramaClose")) { close(); return; }
    if (!current) return;
    const ep = ev.target.closest(".dep");
    if (ep) { open(current.drama.id, parseInt(ep.dataset.index, 10)); return; }
    if (ev.target.closest("#dramaPrev")) open(current.drama.id, current.index - 1);
    else if (ev.target.closest("#dramaNext")) open(current.drama.id, current.index + 1);
    else if (ev.target.closest("#dramaCopy")) {
      const b = el("dramaCopy");
      const done = () => { b.textContent = "Link copied ✓"; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(b.dataset.url).then(done, () => { b.textContent = b.dataset.url; });
      else b.textContent = b.dataset.url;
    }
  });
  const auto = el("dramaAuto");
  auto.checked = read(AUTO_KEY, true) !== false;
  auto.addEventListener("change", () => write(AUTO_KEY, auto.checked));
  document.addEventListener("keydown", (ev) => {
    if (!player.classList.contains("is-open")) return;
    if (ev.key === "Escape") { close(); return; }
    if (ev.key === "Tab") { // keep focus inside the dialog
      const f = player.querySelectorAll("button:not(:disabled), a[href], input, iframe");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener("hashchange", openFromHash);
  // A thumbnail YouTube won't serve: try the smaller size once, then leave the card's dark panel.
  document.addEventListener("error", (ev) => {
    const img = ev.target;
    if (!img || img.tagName !== "IMG" || !/i\.ytimg\.com/.test(img.src)) return;
    if (img.dataset.fallback) { const f = img.dataset.fallback; img.removeAttribute("data-fallback"); img.src = f; }
    else img.style.visibility = "hidden";
  }, true);

  /* ---------- loading + live refresh ---------- */
  async function load(first) {
    try {
      const res = await fetch(FEED + "?t=" + Math.floor(Date.now() / 60000), { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const next = await res.json();
      if (!next || !Array.isArray(next.dramas)) throw new Error("bad feed");
      feed = next;
      // Never re-render under someone mid-episode; the page catches up when they close the player.
      if (!player.classList.contains("is-open")) renderAll();
      if (first) openFromHash();
    } catch (e) {
      if (first) {
        stamp.textContent = "The drama feed couldn’t load just now.";
        empty.hidden = false;
        empty.textContent = "The feed couldn’t load. Check your connection and refresh.";
      }
    }
  }
  hub.dataset.title = document.title;
  load(true);
  setInterval(() => { if (!document.hidden) load(false); }, RECHECK_MS);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && feed && Date.now() - Date.parse(feed.updated) > 3600e3) load(false); });
})();

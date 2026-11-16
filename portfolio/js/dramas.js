/* ============================================================
   DRAMA FEED — renders data/dramas.json (rebuilt hourly by
   .github/workflows/drama-feed.yml) and plays episodes in place
   through YouTube's own embedded player, from the broadcaster's
   official upload. Re-checks the feed while the tab stays open.
   ============================================================ */
(function () {
  "use strict";

  const root = document.getElementById("dramas");
  if (!root) return;

  const FEED = "data/dramas.json";
  const RECHECK_MS = 10 * 60 * 1000;
  const NEW_HOURS = 48;
  const SEEN_KEY = "ar-drama-seen";

  const el = (id) => document.getElementById(id);
  const latestBox = el("dramaLatest"), onAirBox = el("dramaOnAir"), libBox = el("dramaLibrary");
  const latestBlock = el("dramaLatestBlock"), onAirBlock = el("dramaOnAirBlock"), libBlock = el("dramaLibraryBlock");
  const stamp = el("dramaStamp"), search = el("dramaSearch"), chips = el("dramaChips"), empty = el("dramaEmpty");
  const player = el("dramaPlayer"), frame = el("dramaFrame");

  let feed = null, channel = "all", query = "";
  let current = null; // { drama, index }
  let lastFocus = null;

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const thumb = (id) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/mqdefault.jpg`;
  const chName = (d) => (feed.channels[d.channel] && feed.channels[d.channel].name) || "";

  function ago(iso) {
    if (!iso) return "";
    const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + " min ago";
    if (s < 86400) return Math.round(s / 3600) + " hr ago";
    if (s < 86400 * 30) return Math.round(s / 86400) + (Math.round(s / 86400) === 1 ? " day ago" : " days ago");
    if (s < 86400 * 365) return Math.round(s / (86400 * 30)) + " mo ago";
    return Math.round(s / (86400 * 365)) + " yr ago";
  }
  const isNew = (iso) => iso && Date.now() - Date.parse(iso) < NEW_HOURS * 3600e3;
  const epLabel = (e) => (e.last ? "Last Episode " + e.n : "Episode " + e.n) + (e.part ? " · Part " + e.part : "");

  /* ---------- watched memory (this browser only) ---------- */
  function seen() { try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || {}; } catch (e) { return {}; } }
  function markSeen(dramaId, n) {
    try {
      const s = seen();
      const d = s[dramaId] || { eps: [] };
      if (d.eps.indexOf(n) < 0) d.eps.push(n);
      d.last = n;
      s[dramaId] = d;
      localStorage.setItem(SEEN_KEY, JSON.stringify(s));
    } catch (e) { /* private mode: watching still works, it just isn't remembered */ }
  }

  /* ---------- cards ---------- */
  function episodeCard(d, i) {
    const e = d.episodes[i];
    return `<button type="button" class="dcard" data-drama="${esc(d.id)}" data-index="${i}">
      <span class="dcard__thumb"><img src="${thumb(e.id)}" alt="" loading="lazy" decoding="async" width="320" height="180" />
        ${isNew(e.p) ? '<span class="dcard__tag">New</span>' : ""}${e.d ? `<span class="dcard__len">${esc(e.d)}</span>` : ""}</span>
      <span class="dcard__body"><span class="dcard__title">${esc(d.title)}</span>
        <span class="dcard__ep">${esc(epLabel(e))}</span>
        <span class="dcard__meta">${esc(chName(d))}${e.p ? " · " + ago(e.p) : ""}</span></span></button>`;
  }
  function dramaCard(d) {
    const first = d.episodes[0], top = d.episodes[d.episodes.length - 1];
    const s = seen()[d.id];
    const resume = s && s.last ? "Continue from Episode " + s.last : (d.status === "on-air" ? "Latest: " + epLabel(top) : d.episodes.length + " episodes");
    return `<button type="button" class="dcard" data-drama="${esc(d.id)}">
      <span class="dcard__thumb"><img src="${thumb(first.id)}" alt="" loading="lazy" decoding="async" width="320" height="180" />
        ${d.status === "on-air" ? '<span class="dcard__tag">On air</span>' : (d.complete ? '<span class="dcard__tag dcard__tag--gold">Complete</span>' : "")}</span>
      <span class="dcard__body"><span class="dcard__title">${esc(d.title)}</span>
        <span class="dcard__ep">${esc(resume)}</span>
        <span class="dcard__meta">${esc(chName(d))}${d.cast ? " · " + esc(d.cast) : ""}</span></span></button>`;
  }

  function render() {
    if (!feed) return;
    const q = query.trim().toLowerCase();
    const list = feed.dramas.filter((d) =>
      (channel === "all" || d.channel === channel) &&
      (!q || d.title.toLowerCase().indexOf(q) >= 0 || (d.cast || "").toLowerCase().indexOf(q) >= 0));

    // Newest episodes across everything that matches, two at most per drama so one serial can't fill the rail.
    const latest = [];
    list.forEach((d) => {
      const dated = d.episodes.map((e, i) => ({ d, i, p: e.p })).filter((x) => x.p).sort((a, b) => (a.p < b.p ? 1 : -1));
      latest.push.apply(latest, dated.slice(0, 2));
    });
    latest.sort((a, b) => (a.p < b.p ? 1 : -1));
    const fresh = latest.filter((x) => Date.now() - Date.parse(x.p) < 14 * 86400e3).slice(0, 14);

    const onAir = list.filter((d) => d.status === "on-air");
    const lib = list.filter((d) => d.status !== "on-air")
      .sort((a, b) => (b.pick - a.pick) || a.title.localeCompare(b.title));

    latestBox.innerHTML = fresh.map((x) => episodeCard(x.d, x.i)).join("");
    onAirBox.innerHTML = onAir.map(dramaCard).join("");
    libBox.innerHTML = lib.map(dramaCard).join("");
    latestBlock.hidden = !fresh.length || !!q;
    onAirBlock.hidden = !onAir.length;
    libBlock.hidden = !lib.length;
    empty.hidden = list.length > 0;
    el("dramaOnAirCount").textContent = onAir.length + (onAir.length === 1 ? " serial" : " serials");
    el("dramaLibraryCount").textContent = lib.length + (lib.length === 1 ? " serial" : " serials");

    const total = feed.dramas.reduce((s, d) => s + d.episodes.length, 0);
    stamp.textContent = `Updated ${ago(feed.updated)} · ${feed.dramas.length} dramas · ${total} episodes`;
  }

  /* ---------- player ---------- */
  function open(dramaId, index, pushHash) {
    const d = feed && feed.dramas.find((x) => x.id === dramaId);
    if (!d) return false;
    if (index == null) {
      // Resume where this visitor left off; otherwise a running serial opens on its newest episode, a finished one on episode 1.
      const s = seen()[d.id];
      const resumeAt = s && s.last ? d.episodes.findIndex((e) => e.n === s.last) : -1;
      index = resumeAt >= 0 ? resumeAt : (d.status === "on-air" ? d.episodes.length - 1 : 0);
    }
    index = Math.min(Math.max(0, index), d.episodes.length - 1);
    const e = d.episodes[index];
    if (!player.classList.contains("is-open")) lastFocus = document.activeElement;
    current = { drama: d, index };

    el("dramaTitle").innerHTML = `${esc(d.title)} <em>— ${esc(epLabel(e))}</em>`;
    el("dramaSub").textContent = [chName(d), d.cast, e.p ? "uploaded " + ago(e.p) : ""].filter(Boolean).join(" · ");
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(e.id)}?autoplay=1&rel=0&modestbranding=1"
      title="${esc(d.title)} ${esc(epLabel(e))}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    el("dramaPrev").disabled = index === 0;
    el("dramaNext").disabled = index === d.episodes.length - 1;
    el("dramaYT").href = "https://www.youtube.com/watch?v=" + encodeURIComponent(e.id);

    markSeen(d.id, e.n);
    const watched = (seen()[d.id] || { eps: [] }).eps;
    el("dramaEps").innerHTML = d.episodes.map((x, i) =>
      `<button type="button" class="dep${i === index ? " is-current" : (watched.indexOf(x.n) >= 0 ? " is-seen" : "")}" data-index="${i}"
        aria-label="${esc(epLabel(x))}"${i === index ? ' aria-current="true"' : ""}>${x.n}${x.part ? "·" + x.part : ""}</button>`).join("");
    el("dramaEpsTitle").textContent = d.episodes.length + " episodes on " + chName(d) + "’s official channel";

    // Say so plainly when the list has holes rather than letting a visitor hunt for a missing number.
    const have = {}; d.episodes.forEach((x) => { have[x.n] = 1; });
    const top = d.episodes[d.episodes.length - 1].n;
    let missing = 0; for (let n = 1; n <= top; n++) if (!have[n]) missing++;
    const gap = el("dramaGap");
    gap.hidden = !missing;
    gap.innerHTML = missing ? `${missing} earlier episode${missing === 1 ? " isn’t" : "s aren’t"} in the feed yet — <a href="${esc(d.more)}" target="_blank" rel="noopener">find ${missing === 1 ? "it" : "them"} on ${esc(chName(d))}’s channel</a>.` : "";

    player.classList.add("is-open");
    player.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
    if (pushHash !== false) history.replaceState(null, "", "#watch/" + d.id + "/" + e.n);
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
    history.replaceState(null, "", location.pathname + location.search + "#dramas");
    document.title = root.dataset.title || document.title;
    current = null;
    render(); // "Continue from Episode N" labels
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* A shared link like …/#watch/hum-parizaad/12 opens straight on that episode. */
  function openFromHash() {
    const m = location.hash.match(/^#watch\/([a-z0-9-]+)(?:\/(\d+))?/);
    if (!m || !feed) return;
    const d = feed.dramas.find((x) => x.id === m[1]);
    if (!d) return;
    const idx = m[2] ? d.episodes.findIndex((e) => e.n === parseInt(m[2], 10)) : -1;
    open(d.id, idx >= 0 ? idx : null, false);
  }

  /* ---------- events ---------- */
  root.addEventListener("click", (ev) => {
    const card = ev.target.closest(".dcard");
    if (card) { open(card.dataset.drama, card.dataset.index != null ? parseInt(card.dataset.index, 10) : null); return; }
    const chip = ev.target.closest(".dchip");
    if (chip) {
      channel = chip.dataset.channel;
      chips.querySelectorAll(".dchip").forEach((c) => {
        const on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      render();
    }
  });
  search.addEventListener("input", () => { query = search.value; render(); });
  player.addEventListener("click", (ev) => {
    if (ev.target === player || ev.target.closest("#dramaClose")) { close(); return; }
    const ep = ev.target.closest(".dep");
    if (ep && current) { open(current.drama.id, parseInt(ep.dataset.index, 10)); return; }
    if (ev.target.closest("#dramaPrev") && current) open(current.drama.id, current.index - 1);
    if (ev.target.closest("#dramaNext") && current) open(current.drama.id, current.index + 1);
  });
  document.addEventListener("keydown", (ev) => {
    if (!player.classList.contains("is-open")) return;
    if (ev.key === "Escape") { close(); return; }
    if (ev.key === "Tab") { // keep focus inside the dialog
      const f = player.querySelectorAll("button:not(:disabled), a[href], iframe");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener("hashchange", openFromHash);
  // A thumbnail YouTube won't serve leaves the card's dark panel, not a broken-image icon.
  root.addEventListener("error", (ev) => { if (ev.target.tagName === "IMG") ev.target.style.visibility = "hidden"; }, true);

  /* ---------- loading + live refresh ---------- */
  async function load(first) {
    try {
      const res = await fetch(FEED + "?t=" + Math.floor(Date.now() / 60000), { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const next = await res.json();
      if (!next || !Array.isArray(next.dramas)) throw new Error("bad feed");
      const changed = !feed || feed.updated !== next.updated;
      feed = next;
      // Never re-render under someone mid-episode; the open player keeps its own list.
      if (changed && !player.classList.contains("is-open")) render();
      else if (!changed) render(); // refreshes the "x min ago" labels
      if (first) openFromHash();
    } catch (e) {
      if (first) {
        stamp.textContent = "The drama feed couldn’t load just now.";
        empty.hidden = false;
        empty.textContent = "The feed couldn’t load. Check your connection and refresh — the episodes themselves are on the official ARY Digital, HUM TV and Har Pal Geo YouTube channels.";
      }
    }
  }
  root.dataset.title = document.title;
  load(true);
  setInterval(() => { if (!document.hidden) load(false); }, RECHECK_MS);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && feed && Date.now() - Date.parse(feed.updated) > 3600e3) load(false); });
})();

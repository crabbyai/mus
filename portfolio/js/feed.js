/* ============================================================
   LIVE MARKET WATCH — latest videos from MSJ Real Estate and
   OREAL Properties, refreshed by a scheduled GitHub Action into
   data/market-feed.json. Renders nothing (hides the section)
   until the feed has real items.
   ============================================================ */
(function () {
  "use strict";

  const section = document.getElementById("marketwatch");
  const grid = document.getElementById("feedGrid");
  const stamp = document.getElementById("feedUpdated");
  if (!section || !grid) return;

  const BADGE = { msj: "MSJ", oreal: "OREAL", zameen: "ZAMEEN" };

  function timeAgo(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const s = (Date.now() - d.getTime()) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + " min ago";
    if (s < 86400) return Math.round(s / 3600) + " hrs ago";
    const days = Math.round(s / 86400);
    if (days === 1) return "yesterday";
    if (days < 30) return days + " days ago";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  function esc(t) {
    const div = document.createElement("div");
    div.textContent = t;
    return div.innerHTML;
  }

  function card(item) {
    const badge = BADGE[item.channel] || item.channelName || "";
    const wa = "https://wa.me/16134083945?text=" + encodeURIComponent(
      "Hello Adeel — I found this listing. What's it really worth, and can you get me a better price? " + item.url
    );
    return `
      <article class="feedcard glass">
        <button class="feedcard__fav" type="button" aria-label="Save to favourites" aria-pressed="false"
                data-id="${esc(item.videoId || item.url)}" data-title="${esc(item.title)}"
                data-url="${esc(item.url)}" data-thumb="${esc(item.thumb || "")}" data-channel="${esc(item.channel || "")}">♥</button>
        <a class="feedcard__media" href="${esc(item.url)}" target="_blank" rel="noopener" aria-label="Watch on YouTube">
          <img src="${esc(item.thumb || "")}" alt="" loading="lazy"
               onerror="this.parentElement.classList.add('is-noimg'); this.remove();" />
          <span class="feedcard__play">▶</span>
        </a>
        <div class="feedcard__body">
          <div class="feedcard__meta">
            <span class="feedcard__badge feedcard__badge--${esc(item.channel)}">${esc(badge)}</span>
            <span class="feedcard__time">${esc(timeAgo(item.published))}</span>
          </div>
          <h3 class="feedcard__title"><a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.title)}</a></h3>
          <a class="feedcard__vet" href="${wa}" target="_blank" rel="noopener">Get me a better price on this →</a>
        </div>
      </article>`;
  }

  const LISTING_RE = /\b(marla|kanal|\d+\s*bed(?:room)?s?|\d+\s*bhk|for sale|\bplot\b|farmhouse|duplex|villa|kothi|apartment|penthouse)\b/i;

  // "Live Market Watch" is the latest-activity feed across every channel
  // (MSJ + OREAL + Zameen). Round-robin the newest post from each channel so
  // one prolific channel can't crowd the others out — this is where Zameen's
  // market commentary surfaces, while the Available Listings grid stays
  // listings-only. Items arrive already sorted newest-first.
  function diversify(items) {
    const byCh = {};
    items.forEach((it) => { (byCh[it.channel] = byCh[it.channel] || []).push(it); });
    const chans = Object.keys(byCh);
    const out = [];
    for (let i = 0; out.length < items.length; i++) {
      let any = false;
      for (const c of chans) { if (byCh[c][i]) { out.push(byCh[c][i]); any = true; } }
      if (!any) break;
    }
    return out;
  }

  /* ---------- "This week's standout": best-performing live video ----------
     Picks the top property video by real YouTube view count (embedded in
     the RSS feed). Until view counts land in the JSON it falls back to the
     newest listing, so the section is always populated. Rebuilds the
     existing spotlight stage, replacing the static-listing carousel. */
  function fmtViews(n) {
    n = +n || 0;
    if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace(/\.0$/, "") + "K";
    return n.toLocaleString("en-US");
  }
  function areaOf(title) {
    const AREAS = ["DHA", "Bahria Town", "Bahria", "Gulberg", "F-7", "F-8", "E-11",
      "B-17", "Model Town", "Lake City", "Jinnah Garden", "Top City", "i-9", "Overseas Sector"];
    const t = title || "";
    for (const a of AREAS) if (new RegExp("\\b" + a.replace(/[-/]/g, "\\$&"), "i").test(t)) return a;
    if (/islamabad/i.test(t)) return "Islamabad";
    if (/lahore/i.test(t)) return "Lahore";
    if (/rawalpindi/i.test(t)) return "Rawalpindi";
    return "Islamabad & Lahore";
  }

  function renderStandout(allItems, updated) {
    const stage = document.querySelector(".spotlight__stage");
    if (!stage) return;
    const listings = allItems.filter((it) => LISTING_RE.test(it.title || ""));
    const pool = (listings.length ? listings : allItems).slice();
    const byViews = pool.some((it) => +it.views > 0);
    pool.sort((a, b) => byViews
      ? (+b.views || 0) - (+a.views || 0)
      : new Date(b.published) - new Date(a.published));
    const top = pool.slice(0, 5);
    if (!top.length) return;

    const waFor = (it) => "https://wa.me/16134083945?text=" + encodeURIComponent(
      "Hello Adeel — this is the standout listing this week: " + it.title +
      ". What's it really worth, and can you get me a better price? " + it.url);

    stage.innerHTML =
      '<div class="spotlight__media">' +
        '<a class="spotlight__vlink" id="soLink" href="#" target="_blank" rel="noopener" aria-label="Watch on YouTube">' +
          '<img id="soImg" src="" alt="" />' +
          '<span class="spotlight__play">▶</span>' +
        '</a>' +
        '<span class="spotlight__badge" id="soBadge"></span>' +
        (top.length > 1 ? '<button class="spotlight__nav spotlight__nav--prev" id="soPrev" aria-label="Previous">←</button>' +
        '<button class="spotlight__nav spotlight__nav--next" id="soNext" aria-label="Next">→</button>' : '') +
      '</div>' +
      '<div class="spotlight__info">' +
        '<p class="spotlight__loc" id="soLoc"></p>' +
        '<h3 class="spotlight__title" id="soTitle"></h3>' +
        '<div class="spotlight__tags" id="soTags"></div>' +
        '<div class="spotlight__price"><span id="soPriceLbl"></span><strong id="soViews"></strong></div>' +
        '<div class="spotlight__actions">' +
          '<a class="btn btn--gold" id="soWatch" href="#" target="_blank" rel="noopener">▶ Watch Full Tour <span class="btn__arrow">→</span></a>' +
          '<a class="btn btn--wa" id="soWa" href="#" target="_blank" rel="noopener">Get me a better price</a>' +
        '</div>' +
        '<div class="spotlight__dots" id="soDots"></div>' +
      '</div>';

    const $s = (id) => document.getElementById(id);
    const dotsWrap = $s("soDots");
    top.forEach((_, i) => {
      const d = document.createElement("button");
      d.className = "spotlight__dot" + (i === 0 ? " is-active" : "");
      d.setAttribute("aria-label", "Standout " + (i + 1));
      d.addEventListener("click", () => go(i));
      dotsWrap.appendChild(d);
    });

    let idx = 0;
    function draw() {
      const it = top[idx];
      const badgeName = BADGE[it.channel] || it.channelName || "";
      $s("soLink").href = it.url; $s("soWatch").href = it.url; $s("soWa").href = waFor(it);
      const im = $s("soImg");
      im.src = it.thumb || ""; im.alt = it.title || "";
      im.onerror = function () { im.style.display = "none"; };
      $s("soBadge").textContent = byViews ? (idx === 0 ? "🔥 #1 Most-Watched" : "#" + (idx + 1) + " This Week") : "🆕 Latest Listing";
      $s("soLoc").textContent = areaOf(it.title) + " · " + timeAgo(it.published);
      $s("soTitle").textContent = it.title || "";
      $s("soTags").innerHTML = '<span>' + esc(badgeName) + '</span>' + (byViews ? '<span>🔥 Trending</span>' : '<span>New</span>');
      $s("soPriceLbl").textContent = byViews ? "Views this week" : "Freshly listed";
      $s("soViews").textContent = byViews ? fmtViews(it.views) + " views" : timeAgo(it.published);
      dotsWrap.querySelectorAll(".spotlight__dot").forEach((x, i) => x.classList.toggle("is-active", i === idx));
    }
    function go(i) { idx = (i + top.length) % top.length; draw(); }
    if (top.length > 1) {
      $s("soPrev").addEventListener("click", () => go(idx - 1));
      $s("soNext").addEventListener("click", () => go(idx + 1));
    }
    draw();
  }

  fetch("data/market-feed.json", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((data) => {
      // Blacklist Karachi listings — outside the areas Adeel covers
      // (Islamabad, Rawalpindi, Lahore).
      const raw = ((data && data.items) || []).filter((it) => !/karachi/i.test(it.title || ""));
      const items = diversify(raw);
      if (!items.length) return; // section stays hidden until first refresh lands
      const shown = items.slice(0, 8);
      grid.innerHTML = shown.map((it) => card(it)).join("");
      // wire up the favourite hearts and reflect any saved state
      grid.querySelectorAll(".feedcard__fav").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault(); e.stopPropagation();
          if (window.Favorites) window.Favorites.toggle({
            id: btn.dataset.id, title: btn.dataset.title, url: btn.dataset.url,
            thumb: btn.dataset.thumb, channel: btn.dataset.channel
          }, btn);
        });
      });
      if (window.Favorites && window.Favorites.sync) window.Favorites.sync();
      if (stamp && data.updated) {
        stamp.textContent = "Feed refreshed " + timeAgo(data.updated) + " · auto-updates every 6 hours";
      }
      section.hidden = false;
      renderStandout(raw, data.updated);
      // let the reveal system pick the cards up if GSAP is present
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    })
    .catch(() => { /* keep section hidden on failure */ });
})();

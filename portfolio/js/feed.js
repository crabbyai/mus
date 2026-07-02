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

  const BADGE = { msj: "MSJ", oreal: "OREAL" };

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

  fetch("data/market-feed.json", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((data) => {
      const items = (data && data.items) || [];
      if (!items.length) return; // section stays hidden until first refresh lands
      grid.innerHTML = items.slice(0, 8).map(card).join("");
      if (stamp && data.updated) {
        stamp.textContent = "Feed refreshed " + timeAgo(data.updated) + " · auto-updates every 6 hours";
      }
      section.hidden = false;
      // let the reveal system pick the cards up if GSAP is present
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    })
    .catch(() => { /* keep section hidden on failure */ });
})();

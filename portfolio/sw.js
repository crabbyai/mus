/* ============================================================
   SERVICE WORKER — offline support + instant repeat visits
   ------------------------------------------------------------
   Strategy per resource type:
     • App shell (HTML)   → network-first, cache fallback. Visitors always
                            get fresh copy when online, and the site still
                            opens on a dropped/slow connection.
     • Static assets      → stale-while-revalidate. Instant paint from cache,
                            refreshed quietly in the background.
     • Feed JSON          → network-first with a short cache fallback, so
                            listings/questions are current but never blank.
     • Cross-origin       → never cached (YouTube thumbs, maps, fonts).

   Bump VERSION to invalidate every cache after a deploy.
   ============================================================ */
const VERSION = "v23";
const SHELL_CACHE = `ar-shell-${VERSION}`;
const ASSET_CACHE = `ar-assets-${VERSION}`;
const DATA_CACHE = `ar-data-${VERSION}`;
const KEEP = [SHELL_CACHE, ASSET_CACHE, DATA_CACHE];

// Kept deliberately small: only what's needed to render a useful first screen
// offline. Everything else is cached lazily as visitors browse.
const PRECACHE = [
  "./",
  "./index.html",
  "./offline.html",
  "./css/style.css",
  "./js/main.js",
  "./assets/adeel-portrait.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      // addAll is atomic — one 404 would abort the whole install, so add
      // individually and tolerate misses (e.g. a renamed cache-busted file).
      .then((cache) => Promise.all(PRECACHE.map((url) =>
        cache.add(new Request(url, { cache: "reload" })).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => (KEEP.includes(k) ? null : caches.delete(k)))))
      .then(() => self.clients.claim())
  );
});

/* Code and media are cached differently on purpose.

   Stylesheets and scripts used to be stale-while-revalidate like everything
   else, which meant a deploy only reached a returning visitor on their SECOND
   load — and if a release changed style.css without changing its ?v= query,
   never. That shipped a build where the JS was current and the CSS was a
   release behind. Code now goes network-first: current whenever there's a
   connection, still served from cache when there isn't.

   Media stays stale-while-revalidate — it's heavy, it rarely changes, and an
   image one version behind costs nothing. */
const isCode = (p) => /\.(css|js)$/i.test(p);
const isMedia = (p) => /\.(webp|jpg|jpeg|png|svg|woff2?|ico)$/i.test(p);
const isData = (p) => p.includes("/data/") && p.endsWith(".json");

async function networkFirst(request, cacheName, fallback) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const hit = await cache.match(request);
    if (hit) return hit;
    if (fallback) {
      const shell = await caches.open(SHELL_CACHE);
      const off = await shell.match(fallback);
      if (off) return off;
    }
    throw err;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  const network = fetch(request)
    .then((res) => { if (res && res.ok) cache.put(request, res.clone()); return res; })
    .catch(() => null);
  return hit || network.then((res) => res || Promise.reject(new Error("offline")));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Only handle our own origin — YouTube thumbnails, Google Maps embeds and
  // WhatsApp links must always go straight to the network.
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req, SHELL_CACHE, "./offline.html"));
    return;
  }
  if (isData(url.pathname)) {
    event.respondWith(networkFirst(req, DATA_CACHE));
    return;
  }
  if (isCode(url.pathname)) {
    event.respondWith(networkFirst(req, ASSET_CACHE));
    return;
  }
  if (isMedia(url.pathname)) {
    event.respondWith(staleWhileRevalidate(req, ASSET_CACHE));
  }
});

// Lets the page trigger an immediate update after a new deploy.
self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

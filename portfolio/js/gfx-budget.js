/* ============================================================
   GRAPHICS BUDGET — how much this device can actually carry
   ------------------------------------------------------------
   Several WebGL scenes share this site: the scroll showcase, the city
   model, the design stage and the size comparer. Each used to pick its
   own quality from a hardcoded screen-width test, which is a bad proxy
   twice over — it treats a 2021 phone with eight cores and a fast GPU
   exactly like a 2016 budget handset, and it treats a small laptop
   window as a phone.

   So: ask the device. Cores, reported memory, the GPU's own limits,
   and how many pixels it wants to draw. A tier comes out, and the
   scenes read their settings off it.

   The tiers are deliberately generous. The tab crashes that prompted
   this were not caused by a shadow map being 4096 instead of 1024 —
   they were caused by several WebGL contexts rendering at once and
   none of them being released. This file exists so a capable device
   gets the graphics it paid for.
   ============================================================ */

let cached = null;

/* One probe context, read once and thrown away. Creating it is cheap and
   it answers the only question a feature test can't: what the GPU will
   actually allow. */
function probe() {
  const c = document.createElement("canvas");
  let gl = null;
  try { gl = c.getContext("webgl2") || c.getContext("webgl"); } catch (err) { /* no WebGL */ }
  if (!gl) return { maxTex: 0, sw: true };
  let name = "";
  try {
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    if (dbg) name = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "");
  } catch (err) { /* blocked by the browser, which is fine */ }
  const out = {
    maxTex: gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0,
    // A software rasteriser will happily claim a 16k texture limit and then
    // take a second a frame to draw it. Don't hand it postprocessing.
    sw: /swiftshader|llvmpipe|software|microsoft basic/i.test(name)
  };
  const lose = gl.getExtension("WEBGL_lose_context");
  if (lose) lose.loseContext();
  return out;
}

export function budget() {
  if (cached) return cached;

  const gpu = probe();
  const cores = navigator.hardwareConcurrency || 4;
  // Chrome only, and rounded down to 0.25/0.5/1/2/4/8. Absent on Safari and
  // Firefox, so it can raise the tier but must never be required for one.
  const mem = navigator.deviceMemory || 0;
  const dpr = window.devicePixelRatio || 1;
  const px = window.innerWidth * window.innerHeight * dpr * dpr;
  const calm = !matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* A phone asked for the desktop site is still a phone. In that mode the
     layout viewport reports 980-1400px while the device pixel ratio stays at
     2 or 3, so width-based tests read it as a laptop and hand it a laptop's
     buffers — which is how the tab ends up dying rather than the page looking
     rough. Touch and a coarse pointer give it away whatever the width says. */
  const handheld = (navigator.maxTouchPoints || 0) >= 1 &&
                   matchMedia("(pointer: coarse)").matches;

  let tier;
  if (!gpu.maxTex) tier = "none";
  else if (gpu.sw || cores <= 2 || (mem && mem <= 2) || gpu.maxTex < 4096) tier = "low";
  else if (!handheld && cores >= 8 && (!mem || mem >= 8) && gpu.maxTex >= 8192 && px < 9e6) tier = "high";
  else tier = "mid";

  /* shadow    — square map edge. VSM stores two float channels and needs a
                 blur target beside it, so this is the largest single number
                 any of these scenes allocates.
     dpr       — cap, not a target; a 3x phone still renders below native.
     bloom/ao  — postprocessing passes each cost a full-screen buffer.
     Reduced motion turns the passes off: they are the animated part. */
  const table = {
    none: { tier: "none", shadow: 0, dpr: 1, bloom: false, ao: false, shadows: false },
    low:  { tier: "low",  shadow: 1024, dpr: Math.min(dpr, 1.5),  bloom: false,     ao: false, shadows: true },
    mid:  { tier: "mid",  shadow: 2048, dpr: Math.min(dpr, 1.85), bloom: calm,      ao: false, shadows: true },
    high: { tier: "high", shadow: 4096, dpr: Math.min(dpr, 2),    bloom: calm,      ao: calm,  shadows: true }
  };
  cached = table[tier];
  cached.handheld = handheld;
  return cached;
}

/* Hard ceiling on the drawing buffer, in pixels, per tier. Every one of these
   scenes used to size itself as css-size x devicePixelRatio with no upper
   bound. Ask a phone for the desktop site and the layout viewport jumps to
   ~1400px while the ratio stays at 3, so a full-width canvas asks the driver
   for something like 4200 x 9000 — 38 megapixels, several times over, because
   more than one scene does it. That is not a slow page, it is a dead tab. */
const MAX_PIXELS = { none: 0, low: 1.1e6, mid: 2.3e6, high: 4.2e6 };

/** The pixel ratio a canvas of this CSS size may actually use. */
export function pixelRatioFor(cssW, cssH, share) {
  const b = budget();
  const cap = (MAX_PIXELS[b.tier] || 1.1e6) * (share && share < 1 ? 0.8 : 1);
  const area = Math.max(1, cssW * cssH);
  // never below 0.75: a soft canvas beats a crashed one, but only just
  return Math.max(0.75, Math.min(b.dpr, Math.sqrt(cap / area)));
}

/* One coalesced resize signal. Pinch-zoom fires resize continuously — on
   Android in desktop mode it fires for every frame of the gesture — and each
   one of those used to run straight into setSize() on a renderer, a composer
   and two passes, every one of which allocates fresh render targets and drops
   the old ones. Dozens a second of that is what actually exhausts the GPU
   process. Callers still have to no-op when the size hasn't changed; this only
   guarantees they are asked at most once a frame. */
export function onResize(fn) {
  let raf = 0;
  const run = () => { raf = 0; fn(); };
  const queue = () => { if (!raf) raf = requestAnimationFrame(run); };
  addEventListener("resize", queue, { passive: true });
  addEventListener("orientationchange", queue, { passive: true });
  if (window.visualViewport) {
    // pinch-zoom moves this without touching window.resize on iOS
    visualViewport.addEventListener("resize", queue, { passive: true });
  }
  return queue;
}

/* Lets a scene ask for less than the device could give — a scene sharing a
   scrolling page with other work takes a share, one that owns the whole
   viewport passes 1 and spends everything. */
export function scaled(share) {
  const b = budget();
  return {
    tier: b.tier,
    shadow: b.shadow ? Math.max(1024, Math.round((b.shadow * share) / 1024) * 1024) : 0,
    dpr: Math.max(1, b.dpr * (share < 1 ? 0.92 : 1)),
    bloom: b.bloom,
    /* Ambient occlusion only where a scene owns the whole frame. The showcase
       and the size comparer both draw onto a transparent canvas over a CSS
       gradient, and SSAO has no real background to occlude against there — it
       lifts the blacks and flattens the very contrast it is supposed to add. */
    ao: b.ao && share >= 1,
    shadows: b.shadows
  };
}

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

  let tier;
  if (!gpu.maxTex) tier = "none";
  else if (gpu.sw || cores <= 2 || (mem && mem <= 2) || gpu.maxTex < 4096) tier = "low";
  else if (cores >= 8 && (!mem || mem >= 8) && gpu.maxTex >= 8192 && px < 9e6) tier = "high";
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
  return cached;
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

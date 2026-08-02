/* ============================================================
   BUILD ME ONE LIKE THIS
   ------------------------------------------------------------
   Replaces the walkable tour of the sold homes. A tour could only
   ever show someone a house that is already gone; this turns the
   same twelve closings into the strongest thing they can be — a
   catalogue of things Adeel's builders have proved they can build.

   Visitor picks a sold home, the brief pre-fills from that home's
   real spec, they adjust whatever they want, and the whole thing
   leaves as a costed construction request on WhatsApp.

   Costing, plot sizes, finishes and add-ons are imported from the
   Design Studio so the two never quote different numbers, and the
   "fine-tune in 3D" button hands the exact same spec across.
   ============================================================ */
import * as THREE from "three";
import { PLOTS, STYLES, FINISHES, KITCHENS, FEATURES, estimate, fmtPKR,
  buildHouse, starfield } from "./house-builder.js?v=10";

const WA = "16134083945";

/* Where they'd build. Grouped the way people actually say it. */
const AREAS = [
  ["", "Choose an area…"],
  ["DHA Phase 2, Islamabad", "DHA Phase 2, Islamabad"],
  ["DHA Phase 5, Islamabad", "DHA Phase 5, Islamabad"],
  ["Bahria Town, Islamabad", "Bahria Town, Islamabad"],
  ["Bahria Enclave, Islamabad", "Bahria Enclave, Islamabad"],
  ["Gulberg Greens, Islamabad", "Gulberg Greens, Islamabad"],
  ["B-17 / Multi Gardens, Islamabad", "B-17 / Multi Gardens, Islamabad"],
  ["E-11 / F-11, Islamabad", "E-11 / F-11, Islamabad"],
  ["Bahria Town, Rawalpindi", "Bahria Town, Rawalpindi"],
  ["DHA Phase 6, Lahore", "DHA Phase 6, Lahore"],
  ["DHA Phase 7 / 8, Lahore", "DHA Phase 7 / 8, Lahore"],
  ["Bahria Orchard, Lahore", "Bahria Orchard, Lahore"],
  ["Model Town, Lahore", "Model Town, Lahore"],
  ["Lake City, Lahore", "Lake City, Lahore"],
  ["Johar Town, Lahore", "Johar Town, Lahore"],
  ["Somewhere else", "Somewhere else — I'll explain"]
];

const PLOT_STATUS = [
  ["own", "I own the plot"],
  ["buying", "Buying it now"],
  ["need", "Need help finding land"]
];

const TIMING = [
  ["now", "Ready to start"],
  ["3m", "Within 3 months"],
  ["6m", "6–12 months"],
  ["explore", "Just exploring"]
];

/* Brief state. Seeded from whichever sold home is selected. */
const brief = {
  ref: 0,
  plot: "10m", storeys: 2, style: "dha", finish: "greyWhite",
  roof: "flat", kitchen: "closed",
  features: {},
  area: "", status: "own", timing: "3m",
  night: false, spin: true
};

let mounted = false;


/* ============================================================
   LIVE MODEL — the brief you're building, rotating on its podium
   ------------------------------------------------------------
   A still photograph of a sold house can't answer "what does 2
   Kanal look like instead of 10 Marla?". This renders the actual
   brief, so every chip you tap changes the thing you're looking at.

   Same geometry and lighting rig as the Design Studio (buildHouse
   is imported, not reimplemented), kept to one scene that boots
   lazily and pauses whenever it's off-screen or the tab is hidden.
   ============================================================ */
let renderer, scene, camera, rig, house, sun, hemi, stars = null;
let composer = null, bloomPass = null;
let ready = false, running = false, raf = 0, flickerWins = [];
let yaw = -0.7, targetYaw = -0.7, pitch = 0.24, dist = 30;
let dragging = false, lastX = 0, lastY = 0, pinchStart = 0;

const cv = () => document.getElementById("ltCanvas");
const sky = (night) => (night ? 0x05070f : 0x0a0f1e);

function initScene() {
  const c = cv();
  if (!c) return false;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: false,
      powerPreference: "high-performance" });
  } catch (e) { return false; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(sky(false));
  scene.fog = new THREE.Fog(sky(false), 34, 88);

  camera = new THREE.PerspectiveCamera(38, 1, 0.5, 220);
  rig = new THREE.Group();
  scene.add(rig);

  hemi = new THREE.HemisphereLight(0x9aa8c4, 0x3a4030, 1.35);
  scene.add(hemi);
  scene.add(new THREE.AmbientLight(0x5a6a96, 0.85));

  sun = new THREE.DirectionalLight(0xffd9a0, 3.1);
  sun.position.set(16, 22, 15);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const s = 30;
  sun.shadow.camera.left = -s; sun.shadow.camera.right = s;
  sun.shadow.camera.top = s; sun.shadow.camera.bottom = -s;
  sun.shadow.camera.far = 90;
  sun.shadow.bias = -0.0006;
  scene.add(sun);

  const rim = new THREE.DirectionalLight(0x4466cc, 1.15);
  rim.position.set(-18, 11, -17);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xbcd0ff, 0.5);
  fill.position.set(0, 9, 34);
  scene.add(fill);

  // Bloom is what makes the gold strips and lit windows glow. Loaded on
  // demand, and skipped where the extra pass isn't worth the frame budget.
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches &&
      innerWidth > 640 && (navigator.hardwareConcurrency || 4) >= 4) {
    Promise.all([
      import("./vendor/three/postprocessing/EffectComposer.js"),
      import("./vendor/three/postprocessing/RenderPass.js"),
      import("./vendor/three/postprocessing/UnrealBloomPass.js"),
      import("./vendor/three/postprocessing/OutputPass.js")
    ]).then(([EC, RP, UB, OP]) => {
      const w = cv().clientWidth, h = cv().clientHeight;
      composer = new EC.EffectComposer(renderer);
      composer.addPass(new RP.RenderPass(scene, camera));
      bloomPass = new UB.UnrealBloomPass(new THREE.Vector2(w, h), 0.55, 0.7, 0.85);
      composer.addPass(bloomPass);
      composer.addPass(new OP.OutputPass());
      resize();
    }).catch(() => { composer = null; });
  }

  // Reveal before the first resize — a hidden canvas measures 0×0, which
  // would leave the renderer stuck at its 300×150 default.
  c.hidden = false;
  const img = document.getElementById("ltRefImg");
  if (img) img.style.display = "none";
  ["ltTools", "ltHint"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = false;
  });
  const badge = document.getElementById("ltBadge");
  if (badge) badge.textContent = "Your build · live 3D";

  bindPointer(c);
  wireStageTools();
  resize();
  addEventListener("resize", resize, { passive: true });
  ready = true;
  return true;
}

function resize() {
  if (!renderer) return;
  const c = cv();
  const w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  if (composer) composer.setSize(w, h);
  if (bloomPass) bloomPass.resolution.set(w, h);
}

function bindPointer(c) {
  const down = (x, y) => { dragging = true; lastX = x; lastY = y; setSpin(false); };
  const move = (x, y) => {
    if (!dragging) return;
    targetYaw -= (x - lastX) * 0.008;
    pitch = Math.max(0.04, Math.min(0.72, pitch + (y - lastY) * 0.004));
    lastX = x; lastY = y;
  };
  const up = () => { dragging = false; };

  c.addEventListener("pointerdown", (e) => { c.setPointerCapture(e.pointerId); down(e.clientX, e.clientY); });
  c.addEventListener("pointermove", (e) => move(e.clientX, e.clientY));
  c.addEventListener("pointerup", up);
  c.addEventListener("pointercancel", up);
  c.addEventListener("wheel", (e) => {
    e.preventDefault();
    dist = Math.max(12, Math.min(90, dist + e.deltaY * 0.03));
  }, { passive: false });

  // Two-finger pinch to zoom; one finger already orbits via pointer events.
  c.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) pinchStart = touchGap(e) || 1;
  }, { passive: true });
  c.addEventListener("touchmove", (e) => {
    if (e.touches.length !== 2) return;
    const g = touchGap(e);
    if (g && pinchStart) { dist = Math.max(12, Math.min(90, dist * (pinchStart / g))); pinchStart = g; }
  }, { passive: true });
  function touchGap(e) {
    const [a, b] = e.touches;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }
}

function setSpin(on) {
  brief.spin = on;
  const b = document.getElementById("ltSpin");
  if (b) { b.setAttribute("aria-pressed", String(on)); b.style.opacity = on ? "1" : "0.5"; }
}

function wireStageTools() {
  const dn = document.getElementById("ltDayNight");
  if (dn) dn.addEventListener("click", () => {
    brief.night = !brief.night;
    dn.setAttribute("aria-pressed", String(brief.night));
    dn.textContent = brief.night ? "☀" : "🌙";
    rebuild3d();
  });
  const sp = document.getElementById("ltSpin");
  if (sp) sp.addEventListener("click", () => setSpin(!brief.spin));
}

/* Names what's on screen, so a size change is unmistakable even at a glance. */
function stampSpec() {
  const el = document.getElementById("ltStamp");
  if (!el) return;
  const storeys = ["", "Single storey", "Double storey", "Triple storey"][brief.storeys] || "";
  el.textContent = [PLOTS[brief.plot].label, storeys, STYLES[brief.style]].filter(Boolean).join(" · ");
}

function disposeTree(obj) {
  obj.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) {
      const list = Array.isArray(o.material) ? o.material : [o.material];
      list.forEach((m) => m.dispose());   // cached textures are shared, not disposed
    }
  });
}

/* Called on every option change — this is the whole point of the section. */
function rebuild3d() {
  if (!ready) return;
  if (house) { rig.remove(house); disposeTree(house); }
  house = buildHouse(brief);
  house.scale.setScalar(0.001);
  rig.add(house);

  flickerWins = [];
  house.traverse((o) => {
    const m = o.material;
    if (m && m.emissiveIntensity > 0.6 && m.emissive && m.emissive.r > 0.5) {
      m.userData.base = m.emissiveIntensity;
      flickerWins.push(m);
    }
  });

  const night = brief.night;
  if (night && !stars) { stars = starfield(); scene.add(stars); }
  if (stars) stars.visible = night;
  scene.background.setHex(sky(night));
  scene.fog.color.setHex(sky(night));
  sun.intensity = night ? 0.55 : 3.1;
  sun.color.setHex(night ? 0x7e9ae0 : 0xffd9a0);
  hemi.intensity = night ? 0.55 : 1.25;

  // Framing is the whole trick here. Backing off in proportion to the plot
  // (what the Design Studio does) makes every size fill the frame identically,
  // so 5 Marla and 2 Kanal look the same. Backing off sub-linearly instead
  // keeps the lot in shot while letting a bigger plot actually read bigger —
  // 2 Kanal comes out roughly 1.4× the on-screen size of 5 Marla.
  const lot = house.userData.footprint;
  const span = Math.max(lot.lw, lot.ld);
  dist = 42 * Math.pow(span / 22, 0.42);

  stampSpec();

  const t0 = performance.now();
  (function grow() {
    const k = Math.min(1, (performance.now() - t0) / 480);
    house.scale.setScalar(0.001 + (1 - Math.pow(1 - k, 3)) * 0.999);
    if (k < 1) requestAnimationFrame(grow);
  })();
}

function loop() {
  if (!running) return;
  raf = requestAnimationFrame(loop);
  if (brief.spin && !dragging) targetYaw += 0.0022;
  yaw += (targetYaw - yaw) * 0.08;

  camera.position.set(Math.sin(yaw) * dist * Math.cos(pitch),
                      Math.sin(pitch) * dist + 3,
                      Math.cos(yaw) * dist * Math.cos(pitch));
  camera.lookAt(0, 3.2, 0);

  if (flickerWins.length) {
    const t = performance.now() * 0.001;
    for (let i = 0; i < flickerWins.length; i++) {
      const m = flickerWins[i];
      m.emissiveIntensity = m.userData.base * (1 + Math.sin(t * 1.6 + i * 2.1) * 0.06);
    }
  }
  if (stars) stars.rotation.y += 0.00012;

  if (composer) composer.render();
  else renderer.render(scene, camera);
}
function startLoop() { if (!running && ready) { running = true; loop(); } }
function stopLoop() { running = false; cancelAnimationFrame(raf); }

/* ---------- the reference homes ---------- */
function homes() {
  const s = window.SoldHomes;
  return s && s.PROPERTIES ? s.PROPERTIES : [];
}
function specFor(i) {
  const s = window.SoldHomes;
  const t = s && s.SOLD_SPECS && s.SOLD_SPECS[i];
  return t || { plot: "10m", storeys: 2, style: "dha", finish: "greyWhite",
                roof: "flat", kitchen: "closed", features: {} };
}

/* Pull the reference home's spec into the brief. Anything the visitor has
   already changed is discarded on purpose — they picked a new starting
   point, so they expect a new starting point. */
function seedFrom(i) {
  const t = specFor(i);
  brief.ref = i;
  brief.plot = PLOTS[t.plot] ? t.plot : "10m";
  brief.storeys = Math.min(3, Math.max(1, t.storeys || 2));
  brief.style = STYLES[t.style] ? t.style : "dha";
  brief.finish = FINISHES[t.finish] ? t.finish : "greyWhite";
  brief.roof = t.roof === "hip" ? "hip" : "flat";
  brief.kitchen = KITCHENS[t.kitchen] ? t.kitchen : "closed";
  brief.features = {};
  for (const k in FEATURES) brief.features[k] = !!(t.features && t.features[k]);
  // The area field is the visitor's own answer — never overwrite it, but do
  // offer the reference home's neighbourhood the first time round.
  if (!brief.area) {
    const loc = (homes()[i] || {}).loc || "";
    const hit = AREAS.find(([v]) => v && loc && (v.indexOf(loc.split(",")[0]) === 0));
    if (hit) brief.area = hit[0];
  }
}

/* ---------- rendering ---------- */
function renderReel() {
  const reel = document.getElementById("ltReel");
  if (!reel) return;
  reel.innerHTML = homes().map((p, i) => `
    <button class="lt-ref${i === brief.ref ? " is-on" : ""}" type="button" role="tab"
      aria-selected="${i === brief.ref}" data-ref="${i}">
      <img src="${p.img}" alt="" loading="lazy" />
      <span class="lt-ref__name">${p.title}</span>
      <span class="lt-ref__meta">${p.sizeLabel} · ${p.beds} bed</span>
    </button>`).join("");
  reel.querySelectorAll("[data-ref]").forEach((b) => {
    b.addEventListener("click", () => select(+b.dataset.ref, false));
  });
}

/* When the jump came from a portfolio card rather than the reel itself, slide
   the matching thumbnail into view so it's obvious what's selected. */
function revealSelected() {
  const reel = document.getElementById("ltReel");
  const on = reel && reel.querySelector(".lt-ref.is-on");
  if (!on) return;
  const left = on.offsetLeft - (reel.clientWidth - on.offsetWidth) / 2;
  reel.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
}

function renderRef() {
  const p = homes()[brief.ref];
  if (!p) return;
  const img = document.getElementById("ltRefImg");
  // Reuse whatever the portfolio card ended up showing, so a photo that
  // failed to load doesn't come back as a broken image here.
  const card = document.querySelectorAll(".card__media img")[brief.ref];
  img.src = card && card.currentSrc ? card.currentSrc : p.img;
  img.alt = p.title;
  document.getElementById("ltRefLoc").textContent = p.loc + " · Sold " + p.year;
  document.getElementById("ltRefTitle").textContent = p.title;
  document.getElementById("ltRefDesc").textContent = p.desc;
  document.getElementById("ltRefList").innerHTML =
    (p.features || []).slice(0, 5).map((f) => `<li>✓ ${f}</li>`).join("");
}

function chipRow(title, key, options, isFeature) {
  return `<div class="bld-group">
    <p class="bld-group__label">${title}</p>
    <div class="bld-chips">${options.map(([val, label]) => {
      const on = isFeature ? !!brief.features[val] : String(brief[key]) === String(val);
      return `<button type="button" class="bld-chip${on ? " is-on" : ""}"
        data-${isFeature ? "ltfeature" : "ltset"}="${isFeature ? val : key}"
        ${isFeature ? "" : `data-value="${val}"`}
        aria-pressed="${on}">${label}</button>`;
    }).join("")}</div>
  </div>`;
}

function renderControls() {
  const el = document.getElementById("ltControls");
  if (!el) return;
  el.innerHTML =
    chipRow("Plot size", "plot", Object.entries(PLOTS).map(([k, v]) => [k, v.label])) +
    chipRow("Storeys", "storeys", [["1", "Single"], ["2", "Double"], ["3", "Triple"]]) +
    chipRow("Elevation", "style", Object.entries(STYLES)) +
    chipRow("Finish", "finish", Object.entries(FINISHES).map(([k, v]) => [k, v.label])) +
    chipRow("Roof", "roof", [["flat", "Flat parapet"], ["hip", "Tiled hip"]]) +
    chipRow("Kitchen", "kitchen", Object.entries(KITCHENS)) +
    chipRow("Add-ons", "features", Object.entries(FEATURES).map(([k, v]) => [k, v.label]), true) +
    `<div class="bld-group">
      <p class="bld-group__label"><label for="ltArea2">Where are you building?</label></p>
      <select class="lt-select" id="ltArea2">
        ${AREAS.map(([v, l]) => `<option value="${v}"${brief.area === v ? " selected" : ""}>${l}</option>`).join("")}
      </select>
    </div>` +
    chipRow("The plot", "status", PLOT_STATUS) +
    chipRow("Timing", "timing", TIMING);

  el.querySelectorAll("[data-ltset]").forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.ltset;
    brief[k] = k === "storeys" ? +b.dataset.value : b.dataset.value;
    renderControls(); updateSummary(); rebuild3d();
  }));
  el.querySelectorAll("[data-ltfeature]").forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.ltfeature;
    brief.features[k] = !brief.features[k];
    renderControls(); updateSummary(); rebuild3d();
  }));
  const sel = document.getElementById("ltArea2");
  if (sel) sel.addEventListener("change", () => { brief.area = sel.value; });
}

/* Build time tracks covered area more than anything else — a grey-structure
   crew moves at a fairly fixed pace per floor, and finishing is what stretches. */
function buildMonths(area) {
  const m = Math.round(7 + area / 900);
  const lo = Math.max(8, m - 2);
  return lo + "–" + (lo + 4) + " months";
}

function updateSummary() {
  const { area, cost } = estimate(brief);
  document.getElementById("ltArea").textContent = area.toLocaleString("en-US") + " sq ft";
  document.getElementById("ltCost").textContent = fmtPKR(cost);
  document.getElementById("ltTime").textContent = buildMonths(area);
}

/* ---------- the message that actually leaves ---------- */
function briefText() {
  const { area, cost } = estimate(brief);
  const p = homes()[brief.ref] || {};
  const on = Object.keys(brief.features).filter((k) => brief.features[k])
    .map((k) => FEATURES[k].label);
  const status = (PLOT_STATUS.find(([v]) => v === brief.status) || [, ""])[1];
  const timing = (TIMING.find(([v]) => v === brief.timing) || [, ""])[1];
  return "Hello Adeel — I'd like your builders to quote me a house like one you've sold.\n\n" +
    "Reference home: " + (p.title || "—") + (p.loc ? " (" + p.loc + ")" : "") + "\n\n" +
    "MY BRIEF\n" +
    "• Plot: " + PLOTS[brief.plot].label + "\n" +
    "• Storeys: " + brief.storeys + "\n" +
    "• Elevation: " + STYLES[brief.style] + "\n" +
    "• Finish: " + FINISHES[brief.finish].label + "\n" +
    "• Roof: " + (brief.roof === "hip" ? "Tiled hip" : "Flat parapet") + "\n" +
    "• Kitchen: " + KITCHENS[brief.kitchen] + "\n" +
    "• Add-ons: " + (on.length ? on.join(", ") : "none") + "\n" +
    "• Area to build in: " + (brief.area || "not decided yet") + "\n" +
    "• Plot status: " + status + "\n" +
    "• Timing: " + timing + "\n\n" +
    "• Approx covered area: " + area.toLocaleString("en-US") + " sq ft\n" +
    "• Indicative cost shown on your site: " + fmtPKR(cost) + "\n" +
    "• Expected build time: " + buildMonths(area) + "\n\n" +
    "Please put me in touch with your builders for a firm quote.";
}

function send() {
  const msg = briefText();
  if (window.LeadRelay) window.LeadRelay.send(msg);
  else window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
}

/* ---------- selection / entry points ---------- */
function select(i, scroll) {
  const list = homes();
  if (!list.length) return;
  seedFrom(Math.max(0, Math.min(list.length - 1, i | 0)));
  mount();
  renderReel(); renderRef(); renderControls(); updateSummary(); rebuild3d();
  if (scroll) {
    const s = document.getElementById("likethis");
    if (s) s.scrollIntoView({ behavior: "smooth", block: "start" });
    revealSelected();
    // Move focus to the brief so keyboard and screen-reader users land on the
    // thing that just changed, not back at the top of the page.
    const t = document.getElementById("ltRefTitle");
    if (t) { t.setAttribute("tabindex", "-1"); setTimeout(() => t.focus({ preventScroll: true }), 600); }
  }
}

/* Live YouTube listings have no stored spec — read one out of the title the
   same way the rest of the site does, then seed the brief from that. */
function selectFromText(text, label) {
  const t = (text || "").toLowerCase();
  const plot = /2\s*kanal/.test(t) ? "2k"
    : /kanal/.test(t) ? "1k"
    : (() => { const m = t.match(/(\d+(?:\.\d+)?)\s*marla/); return m ? (parseFloat(m[1]) <= 6 ? "5m" : "10m") : "10m"; })();

  // Start from the sold home nearest in size, so the reference panel still
  // shows something real, then override with what the listing tells us.
  const list = homes();
  let best = 0;
  for (let i = 0; i < list.length; i++) if (specFor(i).plot === plot) { best = i; break; }
  select(best, true);

  brief.plot = plot;
  brief.storeys = /triple|3\s*storey/.test(t) ? 3 : /single/.test(t) ? 1 : 2;
  if (/spanish|mehal/.test(t)) brief.style = "spanish";
  else if (/kothi|colonial|heritage|palazzo|classic/.test(t)) brief.style = "colonial";
  else if (/glass|corner/.test(t)) brief.style = "glass";
  if (/brick|gultex/.test(t)) brief.finish = "brick";
  else if (/marble|travertine|palazzo/.test(t)) brief.finish = "travertine";
  else if (/white/.test(t)) brief.finish = "whiteWood";
  brief.roof = /spanish|kothi|colonial|heritage/.test(t) ? "hip" : "flat";
  brief.features.pool = /pool|swimming/.test(t);

  const loc = label || "";
  const hit = AREAS.find(([v]) => v && loc && loc.toLowerCase().indexOf(v.split(",")[0].toLowerCase()) >= 0);
  if (hit) brief.area = hit[0];

  renderControls(); updateSummary(); rebuild3d();
}

/* ---------- wiring ---------- */
function mount() {
  if (mounted) return;
  mounted = true;
  const send$ = document.getElementById("ltSend");
  if (send$) send$.addEventListener("click", send);
  const tune = document.getElementById("ltTune");
  if (tune) tune.addEventListener("click", () => {
    if (!window.HouseBuilder) return;
    window.HouseBuilder.openFrom({
      plot: brief.plot, storeys: brief.storeys, style: brief.style,
      finish: brief.finish, roof: brief.roof, kitchen: brief.kitchen,
      features: brief.features, inside: false
    });
  });
}

window.LikeThis = {
  open: (i) => select(i || 0, true),
  openFromText: (text, label) => selectFromText(text, label),
  /* so other modules can read the current brief without importing this file */
  brief: () => Object.assign({}, brief)
};

/* First paint. main.js is a classic script so it has already run, but guard
   anyway in case the deferred order ever changes. */
function boot() {
  if (!homes().length) { setTimeout(boot, 120); return; }
  select(0, false);
}
boot();

/* The scene costs nothing until the section is nearly in view, and the render
   loop stops the moment it scrolls away or the tab is hidden. */
(function bootScene() {
  const section = document.getElementById("likethis");
  if (!section || !cv()) return;
  let tried = false;

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) { stopLoop(); continue; }
      if (!tried) {
        tried = true;
        if (!initScene()) { io.disconnect(); return; }   // no WebGL — static art stays
        rebuild3d();
      }
      startLoop();
    }
  }, { rootMargin: "260px" });
  io.observe(section);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopLoop();
    else if (ready && section.getBoundingClientRect().top < innerHeight) startLoop();
  });
})();

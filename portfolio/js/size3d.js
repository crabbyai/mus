/* ============================================================
   HOW BIG IS IT, REALLY — two homes side by side, to scale
   ------------------------------------------------------------
   "1 Kanal" is a unit almost nobody outside Pakistan can picture,
   and plenty of people inside it only know it as a number on a
   listing. Every other tool here answers a money question. This
   one answers the question people are too embarrassed to ask:
   how big is that, next to the one I already know?

   So: pick any two of the twelve closings and stand them on the
   same ground, at their real relative size, with a car and a
   person beside them for reference. The models are the same ones
   the showcase renders — the part of this site that already looks
   the way it should.

   One thing that has to be right or the whole thing lies. The
   archetypes in js/estate3d.js are display pieces: they are
   modelled at whatever size looks good on a plinth, not at the
   size of the house they represent. A 2 Kanal manor and a 5 Marla
   cube come out of there within a couple of metres of each other,
   which is exactly the misconception this page exists to correct.
   Each model is therefore measured and rescaled to the real
   footprint of its plot before it goes on the ground.
   ============================================================ */
import * as THREE from "three";
import { ARCHETYPES, skyEnv } from "./estate3d.js?v=27";
import { scaled, pixelRatioFor, onResize } from "./gfx-budget.js?v=4";

/* Covered footprint a house of each plot size actually occupies, in metres.
   Matches PLOTS in js/house-builder.js — kept as a copy rather than an import
   because that module boots a WebGL renderer of its own on load, and this page
   does not need a second one. */
const PLOTS = {
  "5m":  { label: "5 Marla",  w: 7.5,  d: 10,   marla: 5,  lot: [11, 18] },
  "10m": { label: "10 Marla", w: 10,   d: 12.5, marla: 10, lot: [15, 22] },
  "1k":  { label: "1 Kanal",  w: 13.5, d: 16,   marla: 20, lot: [20, 28] },
  "2k":  { label: "2 Kanal",  w: 18,   d: 20,   marla: 40, lot: [26, 34] }
};
const MARLA_SQFT = 225;

/* ---------- ground ---------- */
function gridTex() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#121a2e";
  g.fillRect(0, 0, 512, 512);
  // one square per metre, every fifth line brighter
  for (let i = 0; i <= 10; i++) {
    const p = i * 51.2;
    g.strokeStyle = i % 5 === 0 ? "rgba(201,164,92,0.34)" : "rgba(160,180,220,0.11)";
    g.lineWidth = i % 5 === 0 ? 2.5 : 1;
    g.beginPath(); g.moveTo(p, 0); g.lineTo(p, 512); g.stroke();
    g.beginPath(); g.moveTo(0, p); g.lineTo(512, p); g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ---------- scale references ----------
   A saloon car and a person, at the sizes they really are. They are the whole
   point: a house is only "big" relative to something you have stood next to. */
function car() {
  const g = new THREE.Group();
  const paint = new THREE.MeshStandardMaterial({ color: 0x9aa3b4, roughness: 0.35, metalness: 0.5 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x1b2436, roughness: 0.1, metalness: 0.6 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.62, 4.45), paint);
  body.position.y = 0.62;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.56, 2.3), glass);
  cabin.position.set(0, 1.18, -0.15);
  g.add(body, cabin);
  const wheel = new THREE.CylinderGeometry(0.33, 0.33, 0.22, 16);
  wheel.rotateZ(Math.PI / 2);
  const rubber = new THREE.MeshStandardMaterial({ color: 0x14161c, roughness: 0.85 });
  [[-0.86, 1.4], [0.86, 1.4], [-0.86, -1.4], [0.86, -1.4]].forEach(([x, z]) => {
    const w = new THREE.Mesh(wheel, rubber);
    w.position.set(x, 0.33, z);
    g.add(w);
  });
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}
function person() {
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0xd9c3a5, roughness: 0.8 });
  const cloth = new THREE.MeshStandardMaterial({ color: 0x2b3d5e, roughness: 0.9 });
  const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 0.86, 10), cloth);
  legs.position.y = 0.43;
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 0.62, 10), cloth);
  torso.position.y = 1.16;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 14, 12), skin);
  head.position.y = 1.6;
  g.add(legs, torso, head);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;   // 1.72m to the crown, which is about a grown man
}

/* The plot size, written on the ground in front of its own lot. Without it the
   comparison is honest but mute — you can see one is bigger and still have to
   look away to find out what either of them is called. */
function groundLabel(text, width) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 128;
  const g = c.getContext("2d");
  g.clearRect(0, 0, 512, 128);
  g.font = "600 68px Georgia, 'Times New Roman', serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "rgba(201,164,92,0.92)";
  g.fillText(text, 256, 66);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(width, width / 4),
    new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false })
  );
  m.rotation.x = -Math.PI / 2;
  return m;
}

/* ---------- one house, rescaled to its real footprint ---------- */
function houseAt(type, plotKey, x) {
  const grp = new THREE.Group();
  const model = ARCHETYPES[type] ? ARCHETYPES[type]() : ARCHETYPES.modern();
  // the plinth and the boundary wall are display furniture; the grid is the
  // ground here and the lot line is drawn separately
  model.children.slice().forEach((c) => { if (c.userData.tourOmit) model.remove(c); });
  model.updateMatrixWorld(true);

  const b = new THREE.Box3().setFromObject(model);
  const built = Math.max(b.max.x - b.min.x, 0.001);
  const target = (PLOTS[plotKey] || PLOTS["10m"]).w;
  const k = target / built;
  model.scale.setScalar(k);
  model.updateMatrixWorld(true);

  const b2 = new THREE.Box3().setFromObject(model);
  model.position.x -= (b2.min.x + b2.max.x) / 2;
  model.position.z -= (b2.min.z + b2.max.z) / 2;
  model.position.y -= b2.min.y;
  model.traverse((o) => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
  grp.add(model);

  // the plot boundary, drawn on the ground at the real lot size
  const lot = (PLOTS[plotKey] || PLOTS["10m"]).lot;
  const line = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-lot[0] / 2, 0.02, -lot[1] / 2),
      new THREE.Vector3(lot[0] / 2, 0.02, -lot[1] / 2),
      new THREE.Vector3(lot[0] / 2, 0.02, lot[1] / 2),
      new THREE.Vector3(-lot[0] / 2, 0.02, lot[1] / 2)
    ]),
    new THREE.LineBasicMaterial({ color: 0xc9a45c, transparent: true, opacity: 0.75 })
  );
  grp.add(line);

  const tag = groundLabel((PLOTS[plotKey] || PLOTS["10m"]).label, lot[0] * 0.62);
  // just inside its own boundary, so the label can never drift out of frame
  // the way one sitting beyond the lot line does at an oblique camera angle
  tag.position.set(0, 0.03, lot[1] / 2 - lot[0] * 0.1);
  grp.add(tag);

  grp.position.x = x;
  grp.userData.lot = lot;
  return grp;
}

function init() {
  const canvas = document.getElementById("sizeCanvas");
  const stage = document.getElementById("sizeStage");
  if (!canvas || !stage) return;
  const homes = (window.SoldHomes && window.SoldHomes.PROPERTIES) || [];
  const specs = (window.SoldHomes && window.SoldHomes.SOLD_SPECS) || [];
  const types = (window.SoldHomes && window.SoldHomes.SOLD_ARCHETYPES) || [];
  if (!homes.length) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (err) {
    stage.classList.add("is-dead");
    return;
  }
  const gfx = scaled(0.5);
  renderer.shadowMap.enabled = gfx.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();
  scene.environment = skyEnv(renderer);
  scene.fog = new THREE.Fog(0x0a0f1e, 80, 260);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.5, 400);

  scene.add(new THREE.AmbientLight(0x8a8ea6, 1.4));
  const key = new THREE.DirectionalLight(0xffd9a0, 2.8);
  key.position.set(24, 34, 20);
  key.castShadow = gfx.shadows;
  if (gfx.shadows) {
    key.shadow.mapSize.set(gfx.shadow || 1024, gfx.shadow || 1024);
    const s = 42;
    key.shadow.camera.left = -s; key.shadow.camera.right = s;
    key.shadow.camera.top = s; key.shadow.camera.bottom = -s;
    key.shadow.camera.near = 1; key.shadow.camera.far = 130;
    key.shadow.bias = -0.0008;
  }
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5573c8, 0.85);
  rim.position.set(-20, 14, -18);
  scene.add(rim);

  const grid = gridTex();
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300),
    new THREE.MeshStandardMaterial({ map: grid, roughness: 0.95, metalness: 0 }));
  grid.repeat.set(30, 30);           // one texture tile = 10m, so one square = 1m
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const world = new THREE.Group();
  scene.add(world);

  const refs = new THREE.Group();
  scene.add(refs);

  let left = null, right = null, gap = 0;

  function place(aIdx, bIdx) {
    [left, right].forEach((g) => { if (g) world.remove(g); });
    const aPlot = (specs[aIdx] || {}).plot || "10m";
    const bPlot = (specs[bIdx] || {}).plot || "10m";
    const aLot = PLOTS[aPlot].lot, bLot = PLOTS[bPlot].lot;
    gap = aLot[0] / 2 + bLot[0] / 2 + 7;
    left = houseAt(types[aIdx], aPlot, -gap / 2);
    right = houseAt(types[bIdx], bPlot, gap / 2);
    world.add(left, right);

    /* The car and the person go in the gap between the two lots, not out in
       front of them: they only do their job if the eye can take one of them
       and a wall of each house in at the same time. */
    refs.clear();
    const c = car();
    c.position.set(-1.7, 0, 1.2);
    c.rotation.y = 0.32;
    refs.add(c);
    const p = person();
    p.position.set(1.3, 0, 2.4);
    refs.add(p);

    frame(Math.max(aLot[0], bLot[0]), Math.max(aLot[1], bLot[1]));
    say(aIdx, bIdx);
  }

  let dist = 50, az = -0.5, el = 0.27, tAz = -0.5;
  function frame(w, d) {
    /* The content is wide and shallow — two lots side by side is 50m across
       and 12m tall — so the limit is always horizontal. Fit that, and let the
       ground fill what is left rather than backing off to fit a height that
       isn't there. */
    dist = Math.max(30, (gap + w) * 0.8 + d * 0.28);
  }
  let lastW = 0, lastH = 0;
  function size() {
    const r = stage.getBoundingClientRect();
    const w = Math.round(r.width), h = Math.round(r.height);
    // A zoom gesture fires resize without resizing this element; reallocating
    // the buffer for each of those is what exhausts the GPU process.
    if (w === lastW && h === lastH) return;
    lastW = w; lastH = h;
    renderer.setPixelRatio(pixelRatioFor(w, h, 0.5));
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }

  /* readout ------------------------------------------------------------- */
  function fmtLot(k) {
    const p = PLOTS[k];
    return p.lot[0] + "m × " + p.lot[1] + "m";
  }
  function say(aIdx, bIdx) {
    [["A", aIdx], ["B", bIdx]].forEach(([side, i]) => {
      const h = homes[i] || {}, sp = specs[i] || {};
      const plot = PLOTS[sp.plot || "10m"];
      const set = (id, v) => { const el2 = document.getElementById(id); if (el2) el2.textContent = v; };
      set("size" + side + "Name", h.title || "—");
      set("size" + side + "Loc", h.loc || "");
      set("size" + side + "Plot", plot.label);
      set("size" + side + "Lot", fmtLot(sp.plot || "10m"));
      set("size" + side + "Area", h.area || "—");
      set("size" + side + "Beds", (h.beds || "—") + " bed · " + (h.baths || "—") + " bath");
      set("size" + side + "Price", h.price || "");
    });
    const a = PLOTS[(specs[aIdx] || {}).plot || "10m"];
    const b = PLOTS[(specs[bIdx] || {}).plot || "10m"];
    const verdict = document.getElementById("sizeVerdict");
    if (!verdict) return;
    if (a.marla === b.marla) {
      verdict.textContent = "Same plot size — the difference is all in how it is built.";
    } else {
      const big = a.marla > b.marla ? a : b, small = a.marla > b.marla ? b : a;
      const times = (big.marla / small.marla);
      const nice = times % 1 === 0 ? times.toFixed(0) : times.toFixed(1);
      verdict.textContent = `${big.label} is ${nice}× the ground of ${small.label} — ` +
        `${(big.marla - small.marla) * MARLA_SQFT} sq ft more plot, before anything is built on it.`;
    }
  }

  /* drag to turn --------------------------------------------------------- */
  let dragging = false, lastX = 0;
  canvas.addEventListener("pointerdown", (e) => {
    dragging = true; lastX = e.clientX;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* fine */ }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    tAz -= (e.clientX - lastX) * 0.006;
    lastX = e.clientX;
  });
  ["pointerup", "pointercancel"].forEach((ev) =>
    canvas.addEventListener(ev, () => { dragging = false; }));

  /* controls ------------------------------------------------------------- */
  const selA = document.getElementById("sizeA"), selB = document.getElementById("sizeB");
  homes.forEach((h, i) => {
    [selA, selB].forEach((sel) => {
      if (!sel) return;
      const o = document.createElement("option");
      o.value = String(i);
      o.textContent = h.title + " — " + PLOTS[(specs[i] || {}).plot || "10m"].label;
      sel.appendChild(o);
    });
  });
  if (selA) selA.value = "3";    // Casa Blanca, 5 Marla
  if (selB) selB.value = "0";    // Margalla View Manor, 2 Kanal
  const reselect = () => place(parseInt(selA.value, 10) || 0, parseInt(selB.value, 10) || 0);
  if (selA) selA.addEventListener("change", reselect);
  if (selB) selB.addEventListener("change", reselect);

  const cta = document.getElementById("sizeCta");
  if (cta) cta.addEventListener("click", () => {
    const a = homes[parseInt(selA.value, 10) || 0] || {};
    const b = homes[parseInt(selB.value, 10) || 0] || {};
    const msg = `Hello Adeel — I've been comparing ${a.title} against ${b.title} on your size tool.\n\n` +
      `I'd like to understand what that difference costs in the area I'm looking at, ` +
      `and what you have around that size at the moment.`;
    if (window.LeadRelay) window.LeadRelay.send(msg);
    else window.open("https://wa.me/16134083945?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });

  size();
  onResize(size);
  place(3, 0);

  let inView = true;
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; }).observe(stage);

  function loop() {
    requestAnimationFrame(loop);
    if (!inView) return;
    if (!dragging) tAz += 0.0016;
    az += (tAz - az) * 0.08;
    camera.position.set(
      Math.sin(az) * Math.cos(el) * dist,
      Math.sin(el) * dist,
      Math.cos(az) * Math.cos(el) * dist);
    camera.lookAt(0, 2.4, 0);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(loop);
}

if (document.readyState === "loading") addEventListener("DOMContentLoaded", init);
else init();

/* ============================================================
   WHICH WAY DOES IT FACE — plot orientation and sun study
   ------------------------------------------------------------
   Every buyer in Islamabad and Lahore asks whether a plot is
   east-facing, and almost nobody can say what that actually
   buys them. Agents quote it as a price attribute and leave it
   there. It isn't an attribute — it's the difference between a
   lawn you can sit on at six in the evening and one that's
   still radiating heat at nine.

   So this puts a real house on a real plot at real Pakistani
   dimensions, computes where the sun genuinely is over
   Islamabad or Lahore on a given date, and drops the shadows
   where they actually fall. Drag the time and watch them sweep.

   The numbers underneath aren't adjectives. The share of the
   lawn in shade is measured by sampling the lawn on a grid and
   testing each point against the house and the boundary wall;
   the hours of sun on the front elevation are counted by
   stepping the whole day. Change the facing and they change,
   because the geometry changed — not because a lookup table
   said east is nice.
   ============================================================ */
import * as THREE from "three";

const FT = 0.3048;                       // Pakistani plots are quoted in feet

/* Standard plot sizes as they're actually sold here, with the front lawn and
   rear setback a builder would leave. 1 Marla is 225 sq ft in Punjab and the
   capital, so a Kanal is twenty of them — 50 × 90 is the classic. */
const PLOTS = [
  { id: "5m",  n: "5 Marla",  w: 25, d: 45,  lawn: 8,  rear: 5,  h: 30, sqft: 1125 },
  { id: "10m", n: "10 Marla", w: 35, d: 65,  lawn: 15, rear: 7,  h: 30, sqft: 2250 },
  { id: "1k",  n: "1 Kanal",  w: 50, d: 90,  lawn: 25, rear: 10, h: 32, sqft: 4500 },
  { id: "2k",  n: "2 Kanal",  w: 75, d: 120, lawn: 35, rear: 12, h: 34, sqft: 9000 }
];

/* Azimuth of the direction the front of the plot points, measured from north
   and going clockwise, the way a compass does. */
const FACES = [
  { id: "N", n: "North", az: 0 },
  { id: "E", n: "East",  az: 90 },
  { id: "S", n: "South", az: 180 },
  { id: "W", n: "West",  az: 270 }
];

const CITIES = {
  isb: { n: "Islamabad", lat: 33.68, lon: 73.05 },
  lhr: { n: "Lahore",    lat: 31.55, lon: 74.34 }
};
// UTC+5, so the clock is set to the 75°E meridian
const STD_MERIDIAN = 75;

const SEASONS = [
  { id: "jun", n: "21 June",     day: 172, note: "longest day" },
  { id: "mar", n: "21 March",    day: 80,  note: "equinox" },
  { id: "dec", n: "21 December", day: 355, note: "shortest day" }
];

/* ---------- where the sun actually is ---------- */
const RAD = Math.PI / 180;

/* Solar declination — how far the sun is north or south of the equator on a
   given day of the year. */
function declination(day) {
  return 23.45 * Math.sin(RAD * (360 / 365) * (284 + day));
}

/* The equation of time, in minutes: the sun is not a good clock, and over a
   year it runs up to about a quarter of an hour fast or slow against one. */
function eqOfTime(day) {
  const B = RAD * (360 * (day - 81) / 365);
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

/* Minutes to add to the clock to get solar time at this longitude. */
function timeCorrection(day, lon) {
  return 4 * (lon - STD_MERIDIAN) + eqOfTime(day);
}

/* Altitude above the horizon and azimuth from north, both in degrees, for a
   given solar hour. */
function sunAngles(solarHour, day, lat) {
  const d = declination(day) * RAD;
  const p = lat * RAD;
  const H = (solarHour - 12) * 15 * RAD;                 // hour angle
  const sinAlt = Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.cos(H);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const cosAlt = Math.cos(alt);
  // atan2 form, so the azimuth is right on both sides of noon without a fixup
  const sinAz = -Math.cos(d) * Math.sin(H) / (cosAlt || 1e-6);
  const cosAz = (Math.sin(d) - Math.sin(alt) * Math.sin(p)) / ((cosAlt * Math.cos(p)) || 1e-6);
  let az = Math.atan2(sinAz, cosAz) / RAD;
  if (az < 0) az += 360;
  return { alt: alt / RAD, az: az };
}

/* Sunrise and sunset in solar hours. Returns null when the sun never sets or
   never rises — which never happens at these latitudes, but the maths should
   still say so rather than produce a NaN. */
function dayLength(day, lat) {
  const c = -Math.tan(lat * RAD) * Math.tan(declination(day) * RAD);
  if (c <= -1 || c >= 1) return null;
  const H0 = Math.acos(c) / RAD / 15;
  return { rise: 12 - H0, set: 12 + H0 };
}

function clockFromSolar(solarHour, day, lon) {
  return solarHour - timeCorrection(day, lon) / 60;
}
function solarFromClock(clockHour, day, lon) {
  return clockHour + timeCorrection(day, lon) / 60;
}
function hhmm(h) {
  if (!isFinite(h)) return "—";
  let m = Math.round(h * 60);
  m = ((m % 1440) + 1440) % 1440;
  return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
}

/* Sun direction in scene space. The plot is drawn fixed with its frontage
   toward the camera whichever way it faces, so it is the world that turns:
   rotating by the facing azimuth brings that facing round to face us, and the
   compass rose turns with it. Keeping the house still and moving the sun is
   what makes two orientations comparable at a glance. */
function sunVector(alt, az, facingAz) {
  const a = alt * RAD, z = az * RAD;
  const x = Math.sin(z) * Math.cos(a);
  const y = Math.sin(a);
  const zz = -Math.cos(z) * Math.cos(a);
  const f = facingAz * RAD;
  return new THREE.Vector3(
    x * Math.cos(f) + zz * Math.sin(f),
    y,
    -x * Math.sin(f) + zz * Math.cos(f)
  );
}

/* ---------- how much is actually in shade ---------- */
/* Slab test: does the ray from p toward the sun run into this box? */
function rayHitsBox(px, py, pz, dx, dy, dz, b) {
  let t0 = 0.0001, t1 = 1e6;
  const lo = [b.x0, b.y0, b.z0], hi = [b.x1, b.y1, b.z1];
  const o = [px, py, pz], d = [dx, dy, dz];
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-9) {
      if (o[i] < lo[i] || o[i] > hi[i]) return false;
    } else {
      let ta = (lo[i] - o[i]) / d[i], tb = (hi[i] - o[i]) / d[i];
      if (ta > tb) { const s = ta; ta = tb; tb = s; }
      if (ta > t0) t0 = ta;
      if (tb < t1) t1 = tb;
      if (t0 > t1) return false;
    }
  }
  return true;
}

/* Share of the lawn standing in shadow right now, sampled on a grid. Cheap,
   exact enough to quote, and honest: if the sun is down it's all of it. */
function lawnShade(lawn, boxes, sun) {
  if (sun.y <= 0.02) return 1;
  const N = 22;
  let shaded = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const x = lawn.x0 + (lawn.x1 - lawn.x0) * ((i + 0.5) / N);
      const z = lawn.z0 + (lawn.z1 - lawn.z0) * ((j + 0.5) / N);
      let hit = false;
      for (let k = 0; k < boxes.length && !hit; k++) {
        hit = rayHitsBox(x, 0.02, z, sun.x, sun.y, sun.z, boxes[k]);
      }
      if (hit) shaded++;
    }
  }
  return shaded / (N * N);
}

/* Hours the front elevation is in direct sun over the whole day: the sun has
   to be up, and it has to be on the same side of the wall as the street. */
function facadeHours(day, lat, facingAz) {
  let hrs = 0;
  for (let h = 0; h < 24; h += 0.1) {
    const s = sunAngles(h, day, lat);
    if (s.alt <= 0) continue;
    // diff is how far the sun is off straight-on; past 90° it has gone round
    // behind the wall and stops lighting it.
    const diff = Math.abs(((s.az - facingAz + 540) % 360) - 180);
    if (diff < 90) hrs += 0.1;
  }
  return hrs;
}

/* ============================================================
   SCENE
   ============================================================ */
let renderer, scene, camera, root, sunLight, sunMesh, sunGlow, arc, fill;
let compass = null, plotGroup = null;
let ready = false, running = false, raf = 0;
let boxes = [], lawnRect = null;

let plot = PLOTS[2], face = FACES[1], city = "isb", season = SEASONS[0];
let clockHour = 9, playing = false, lastT = 0;
// The street is on the -Z side, so the opening view is from the kerb looking
// in, the way you'd first see the house. Tilted well up, because the whole
// point is the shadows on the ground rather than the elevation.
let yaw = Math.PI, targetYaw = Math.PI, pitch = 0.74, dist = 0, targetDist = 0;
let dragging = false, lastX = 0, lastY = 0, pinch = 0;
let skyKey = "";

const cv = () => document.getElementById("sunCanvas");
const $ = (id) => document.getElementById(id);

function rnd(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/* Sky colour follows the sun down: full daylight blue overhead, and the warm
   band low on the horizon that makes a six-o'clock render look like six
   o'clock. */
function skyTexture(alt) {
  const c = document.createElement("canvas");
  c.width = 8; c.height = 256;
  const g = c.getContext("2d");
  const t = Math.max(0, Math.min(1, (alt + 6) / 34));      // 0 at dusk, 1 high
  const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
  const rgb = (a) => "rgb(" + a[0] + "," + a[1] + "," + a[2] + ")";
  const top = mix([16, 26, 54], [38, 110, 190], t);
  const mid = mix([72, 60, 84], [126, 178, 226], t);
  const low = mix([226, 122, 62], [206, 226, 238], t);
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, rgb(top));
  grd.addColorStop(0.55, rgb(mid));
  grd.addColorStop(1, rgb(low));
  g.fillStyle = grd; g.fillRect(0, 0, 8, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function grassTexture() {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  g.fillStyle = "#4e7a3a"; g.fillRect(0, 0, S, S);
  const r = rnd(77);
  for (let i = 0; i < 5000; i++) {
    g.fillStyle = r() > 0.5 ? "rgba(104,150,72,0.5)" : "rgba(52,88,40,0.5)";
    g.fillRect(r() * S, r() * S, 2, 3);
  }
  // the mown stripes every lawn in DHA has
  for (let i = 0; i < 8; i++) {
    g.fillStyle = i % 2 ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.045)";
    g.fillRect(0, (S / 8) * i, S, S / 8);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* Sand-render stucco. Flat colour on a big blank elevation reads as cardboard,
   and this section lives or dies on being able to see where the light lands. */
function stuccoTexture() {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  g.fillStyle = "#e6dece"; g.fillRect(0, 0, S, S);
  const r = rnd(313);
  for (let i = 0; i < 9000; i++) {
    const v = r();
    g.fillStyle = v > 0.5 ? "rgba(255,252,244,0.5)" : "rgba(176,166,148,0.4)";
    g.fillRect(r() * S, r() * S, 1.6, 1.6);
  }
  for (let i = 0; i < 40; i++) {
    g.strokeStyle = "rgba(190,180,160,0.16)";
    g.lineWidth = 1 + r() * 2;
    g.beginPath();
    g.moveTo(r() * S, r() * S);
    g.lineTo(r() * S, r() * S);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function paverTexture() {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  g.fillStyle = "#9d8f7d"; g.fillRect(0, 0, S, S);
  const r = rnd(191);
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      g.fillStyle = "rgba(" + (150 + r() * 40 | 0) + "," + (136 + r() * 36 | 0) + "," +
        (118 + r() * 30 | 0) + ",1)";
      const off = (y % 2) * 16;
      g.fillRect(x * 32 + off, y * 32, 30, 30);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function labelSprite(text, colour) {
  const c = document.createElement("canvas");
  c.width = 128; c.height = 128;
  const g = c.getContext("2d");
  g.font = "700 76px Inter, system-ui, sans-serif";
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = "rgba(8,12,22,0.55)";
  g.beginPath(); g.arc(64, 64, 46, 0, 6.2832); g.fill();
  g.fillStyle = colour;
  g.fillText(text, 64, 70);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  sp.renderOrder = 12;
  return sp;
}

function initScene() {
  const c = cv();
  if (!c) return false;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, powerPreference: "high-performance" });
  } catch (e) { return false; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, 1, 0.4, 900);
  root = new THREE.Group();
  scene.add(root);

  // The sun casts every shadow in here, so it's the only light that matters;
  // the other two exist so the north side of the house isn't solid black.
  sunLight = new THREE.DirectionalLight(0xfff0d4, 3.2);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(innerWidth >= 1024 ? 2048 : 1024, innerWidth >= 1024 ? 2048 : 1024);
  sunLight.shadow.bias = -0.0006;
  sunLight.shadow.normalBias = 0.02;
  scene.add(sunLight);
  scene.add(sunLight.target);
  fill = new THREE.HemisphereLight(0xbcd9f5, 0x6b6350, 0.85);
  scene.add(fill);

  // The sun itself, so you can see where the light is coming from
  sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 20, 14),
    new THREE.MeshBasicMaterial({ color: 0xfff3d0, toneMapped: false })
  );
  scene.add(sunMesh);
  const gc = document.createElement("canvas");
  gc.width = gc.height = 128;
  const gg = gc.getContext("2d");
  const rg = gg.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, "rgba(255,236,190,0.95)");
  rg.addColorStop(0.35, "rgba(255,208,130,0.35)");
  rg.addColorStop(1, "rgba(255,190,110,0)");
  gg.fillStyle = rg; gg.fillRect(0, 0, 128, 128);
  const gt = new THREE.CanvasTexture(gc);
  gt.colorSpace = THREE.SRGBColorSpace;
  sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: gt, transparent: true, depthWrite: false, toneMapped: false,
    blending: THREE.AdditiveBlending
  }));
  sunGlow.scale.set(22, 22, 1);
  scene.add(sunGlow);

  bind(c);
  resize();
  addEventListener("resize", resize, { passive: true });
  ready = true;
  return true;
}

function resize() {
  if (!renderer) return;
  const c = cv(), w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

/* ---------- the plot ---------- */
function clearPlot() {
  if (!plotGroup) return;
  root.remove(plotGroup);
  plotGroup.traverse((n) => {
    if (n.geometry) n.geometry.dispose();
    if (n.material) (Array.isArray(n.material) ? n.material : [n.material]).forEach((m) => {
      if (m.map) m.map.dispose();
      m.dispose();
    });
  });
  plotGroup = null;
}

function buildPlot() {
  clearPlot();
  const g = new THREE.Group();
  const W = plot.w * FT, D = plot.d * FT;
  const lawnD = plot.lawn * FT, rearD = plot.rear * FT;
  const houseD = D - lawnD - rearD;
  const houseW = W - 4 * FT;                 // a couple of feet of side passage
  const H = plot.h * FT;
  const wallH = 7 * FT;

  // Local layout: the street is at -Z, the plot runs back toward +Z.
  const zFront = -D / 2, zBack = D / 2;
  const houseZ0 = zFront + lawnD, houseZ1 = houseZ0 + houseD;

  const grass = grassTexture();
  grass.repeat.set(plot.w / 12, plot.d / 12);
  const paver = paverTexture();
  paver.repeat.set(2, 6);

  // ground: the plot, then the street in front of it
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D),
    new THREE.MeshStandardMaterial({ map: grass, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  g.add(ground);

  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(W * 4, 30 * FT),
    new THREE.MeshStandardMaterial({ color: 0x3b3b40, roughness: 0.95 })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, -0.02, zFront - 15 * FT - 0.5);
  road.receiveShadow = true;
  g.add(road);
  const kerb = new THREE.Mesh(
    new THREE.BoxGeometry(W * 4, 0.34, 0.9),
    new THREE.MeshStandardMaterial({ color: 0xcfc7b4, roughness: 0.9 })
  );
  kerb.position.set(0, 0.14, zFront - 0.5);
  kerb.receiveShadow = true;
  g.add(kerb);

  // driveway from the gate to the porch
  const drive = new THREE.Mesh(
    new THREE.PlaneGeometry(Math.min(W * 0.4, 5.2), lawnD + 0.4),
    new THREE.MeshStandardMaterial({ map: paver, roughness: 0.95 })
  );
  drive.rotation.x = -Math.PI / 2;
  drive.position.set(-W * 0.24, 0.01, zFront + lawnD / 2);
  drive.receiveShadow = true;
  g.add(drive);

  // boundary wall — it shades the lawn early and late, which is why it's in
  // the shading calculation as well as the picture
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xd8cfba, roughness: 0.92 });
  const wallT = 0.6;
  const walls = [
    { w: W, h: wallH, d: wallT, x: 0, z: zFront },            // street wall
    { w: W, h: wallH, d: wallT, x: 0, z: zBack },
    { w: wallT, h: wallH, d: D, x: -W / 2, z: 0 },
    { w: wallT, h: wallH, d: D, x: W / 2, z: 0 }
  ];
  const copeMat = new THREE.MeshStandardMaterial({ color: 0x8f8776, roughness: 0.9 });
  walls.forEach((s) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(s.w, s.h, s.d), wallMat);
    m.position.set(s.x, s.h / 2, s.z);
    m.castShadow = true; m.receiveShadow = true;
    g.add(m);
    // coping course along the top, which is what every boundary wall here has
    const cap = new THREE.Mesh(new THREE.BoxGeometry(s.w + 0.16, 0.14, s.d + 0.16), copeMat);
    cap.position.set(s.x, s.h + 0.07, s.z);
    cap.castShadow = true;
    g.add(cap);
  });
  // gate
  const gate = new THREE.Mesh(
    new THREE.BoxGeometry(Math.min(W * 0.4, 5.2), wallH * 0.86, 0.24),
    new THREE.MeshStandardMaterial({ color: 0x2b2f38, roughness: 0.5, metalness: 0.55 })
  );
  gate.position.set(-W * 0.24, wallH * 0.43, zFront + 0.1);
  gate.castShadow = true;
  g.add(gate);

  // the house
  const stucco = stuccoTexture();
  stucco.repeat.set(houseW / 3, H / 3);
  const wallCream = new THREE.MeshStandardMaterial({ map: stucco, roughness: 0.88 });
  const house = new THREE.Mesh(new THREE.BoxGeometry(houseW, H, houseD), wallCream);
  house.position.set(0, H / 2, (houseZ0 + houseZ1) / 2);
  house.castShadow = true; house.receiveShadow = true;
  g.add(house);

  // a slab roof with a lip, which is what throws the shadow line you see on
  // the front elevation in the afternoon
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xcac2ae, roughness: 0.95 });
  const roof = new THREE.Mesh(new THREE.BoxGeometry(houseW + 0.7, 0.45, houseD + 0.7), roofMat);
  roof.position.set(0, H + 0.2, house.position.z);
  roof.castShadow = true; roof.receiveShadow = true;
  g.add(roof);

  // Parapet. Roofs here are flat and used — you don't see a bare slab edge,
  // you see a low wall round it, and it throws its own shadow across the roof.
  const pT = 0.24, pH = 1.1;
  [[houseW + 0.7, pT, 0, (houseD + 0.7) / 2], [houseW + 0.7, pT, 0, -(houseD + 0.7) / 2],
   [pT, houseD + 0.7, (houseW + 0.7) / 2, 0], [pT, houseD + 0.7, -(houseW + 0.7) / 2, 0]]
    .forEach(([w, d, x, z]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, pH, d), roofMat);
      m.position.set(x, H + 0.42 + pH / 2, house.position.z + z);
      m.castShadow = true; m.receiveShadow = true;
      g.add(m);
    });

  // Stair block and water tanks. Every roof in Islamabad has them, they break
  // up what was otherwise a blank grey lid, and their shadows across the slab
  // are a good read on where the sun is.
  const mumty = new THREE.Mesh(
    new THREE.BoxGeometry(houseW * 0.26, 2.7, houseD * 0.2), wallCream
  );
  mumty.position.set(houseW * 0.24, H + 0.42 + 1.35, house.position.z + houseD * 0.22);
  mumty.castShadow = true; mumty.receiveShadow = true;
  g.add(mumty);
  const tankMat = new THREE.MeshStandardMaterial({ color: 0x2f6f8c, roughness: 0.55 });
  [-0.2, -0.04].forEach((o, i) => {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.15, 12), tankMat);
    t.position.set(-houseW * 0.26 + i * 1.6, H + 0.42 + 0.58, house.position.z + houseD * o);
    t.castShadow = true;
    g.add(t);
  });

  // glazing on all four elevations, so you can see which windows the sun is on
  const glass = new THREE.MeshStandardMaterial({
    color: 0x2c4a63, roughness: 0.12, metalness: 0.5,
    emissive: 0x0d1b28, emissiveIntensity: 0.5
  });
  // Windows sit in a surround that stands proud of the wall — the reveal is
  // what casts the little shadow that tells you the sun is off to one side.
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xbcae95, roughness: 0.8 });
  // Ground plus one. Dividing by a 11ft floor gave three rows of windows and
  // the thing read as an apartment block rather than a house.
  const floors = Math.max(2, Math.round(H / (14 * FT)));
  const win = (w, h, x, y, z, rotY) => {
    const fr = new THREE.Mesh(new THREE.BoxGeometry(w + 0.34, h + 0.34, 0.18), frameMat);
    fr.position.set(x, y, z);
    fr.rotation.y = rotY;
    fr.castShadow = true; fr.receiveShadow = true;
    g.add(fr);
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glass);
    pane.position.set(x + Math.sin(rotY) * 0.1, y, z + Math.cos(rotY) * 0.1);
    pane.rotation.y = rotY;
    g.add(pane);
  };
  for (let f = 0; f < floors; f++) {
    const y = (H / floors) * (f + 0.55);
    const n = Math.max(2, Math.round(houseW / (7 * FT)));
    for (let i = 0; i < n; i++) {
      const x = -houseW / 2 + (houseW / n) * (i + 0.5);
      const w = houseW / n * 0.55, h = H / floors * 0.44;
      win(w, h, x, y, houseZ0 - 0.06, Math.PI);          // street elevation
      win(w, h, x, y, houseZ1 + 0.06, 0);                // rear
    }
    const nd = Math.max(2, Math.round(houseD / (8 * FT)));
    for (let i = 0; i < nd; i++) {
      const z = houseZ0 + (houseD / nd) * (i + 0.5);
      const w = houseD / nd * 0.5, h = H / floors * 0.44;
      win(w, h, -(houseW / 2 + 0.06), y, z, -Math.PI / 2);
      win(w, h, houseW / 2 + 0.06, y, z, Math.PI / 2);
    }
  }

  // front door under the porch, with a step
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2.5, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x4a3524, roughness: 0.55 })
  );
  door.position.set(W * 0.12, 1.25, houseZ0 - 0.08);
  door.castShadow = true;
  g.add(door);
  const step = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.18, 1.1),
    new THREE.MeshStandardMaterial({ color: 0xc4bba6, roughness: 0.9 })
  );
  step.position.set(W * 0.12, 0.09, houseZ0 - 0.62);
  step.castShadow = true; step.receiveShadow = true;
  g.add(step);

  // porch slab over the driveway side — the bit everyone parks under
  const porch = new THREE.Mesh(
    new THREE.BoxGeometry(Math.min(W * 0.42, 5.6), 0.35, 4.2),
    new THREE.MeshStandardMaterial({ color: 0x8e8779, roughness: 0.95 })
  );
  porch.position.set(-W * 0.24, H / floors - 0.2, houseZ0 - 2);
  porch.castShadow = true;
  g.add(porch);
  [-1, 1].forEach((s) => {
    const col = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, H / floors - 0.2, 0.34),
      new THREE.MeshStandardMaterial({ color: 0xd8cfba, roughness: 0.9 })
    );
    col.position.set(-W * 0.24 + s * Math.min(W * 0.19, 2.5), (H / floors - 0.2) / 2, houseZ0 - 3.8);
    col.castShadow = true;
    g.add(col);
  });

  // a couple of trees and a car, for scale as much as anything — "1 Kanal"
  // means nothing to someone who has never stood on one
  const r = rnd(404);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a4128, roughness: 1 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x3f6b32, roughness: 1, flatShading: true });
  for (let i = 0; i < 4; i++) {
    const th = 3 + r() * 1.8;
    const t = new THREE.Group();
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, th, 6), trunkMat);
    tr.position.y = th / 2; tr.castShadow = true;
    const lf = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1 + r() * 0.5, 0), leafMat);
    lf.position.y = th + 0.5; lf.castShadow = true;
    t.add(tr); t.add(lf);
    const side = i % 2 ? 1 : -1;
    t.position.set(side * (W / 2 - 1.4), 0, zFront + 1.6 + (i > 1 ? lawnD - 2.6 : 1.2));
    g.add(t);
  }
  const car = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.7, 4.3),
    new THREE.MeshStandardMaterial({ color: 0x1d222b, roughness: 0.3, metalness: 0.6 })
  );
  body.position.y = 0.62; body.castShadow = true;
  const cab = new THREE.Mesh(
    new THREE.BoxGeometry(1.62, 0.56, 2.1),
    new THREE.MeshStandardMaterial({ color: 0x121722, roughness: 0.16, metalness: 0.5 })
  );
  cab.position.set(0, 1.2, 0.1); cab.castShadow = true;
  car.add(body); car.add(cab);
  car.position.set(-W * 0.24, 0, houseZ0 - 2.2);
  g.add(car);

  root.add(g);
  plotGroup = g;

  // What the shading maths sees: the house, its roof lip, the porch and the
  // four walls. Same numbers as the picture, because it is the same geometry.
  const box = (o, w, h, d) => ({
    x0: o.position.x - w / 2, x1: o.position.x + w / 2,
    y0: o.position.y - h / 2, y1: o.position.y + h / 2,
    z0: o.position.z - d / 2, z1: o.position.z + d / 2
  });
  boxes = [
    box(house, houseW, H, houseD),
    box(roof, houseW + 0.7, 0.45, houseD + 0.7),
    box(porch, Math.min(W * 0.42, 5.6), 0.35, 4.2)
  ].concat(walls.map((s) => ({
    x0: s.x - s.w / 2, x1: s.x + s.w / 2,
    y0: 0, y1: s.h,
    z0: s.z - s.d / 2, z1: s.z + s.d / 2
  })));
  lawnRect = { x0: -W / 2 + 0.4, x1: W / 2 - 0.4, z0: zFront + 0.4, z1: houseZ0 - 0.3 };

  buildCompass(W, D);

  // frame it: far enough back to hold the whole plot, tilted so you can read
  // the shadows on the ground rather than just the front wall
  const span = Math.sqrt(W * W + D * D);
  // Far enough back to hold the street and the gate as well as the plot —
  // the kerb is where the shadow of the boundary wall lands first thing.
  // Purely proportional: a fixed term on top left a 5 Marla plot stranded in
  // the middle of the frame with a screen of empty road under it.
  targetDist = dist = span * 2;
  sunLight.shadow.camera.left = -span * 0.8;
  sunLight.shadow.camera.right = span * 0.8;
  sunLight.shadow.camera.top = span * 0.8;
  sunLight.shadow.camera.bottom = -span * 0.8;
  sunLight.shadow.camera.far = span * 4 + 60;
  sunLight.shadow.camera.updateProjectionMatrix();
}

/* A compass that turns with the facing, so "east-facing" is a thing you can
   see rather than a label you have to take on trust. */
function buildCompass(W, D) {
  if (compass) { root.remove(compass); compass = null; }
  compass = new THREE.Group();
  const r = Math.max(W, D) * 0.62;
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(r, r + 0.28, 96),
    new THREE.MeshBasicMaterial({ color: 0xc9a45c, transparent: true, opacity: 0.5,
      side: THREE.DoubleSide, depthWrite: false })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.03;
  compass.add(ring);
  [["N", 0, "#ffd9a0"], ["E", 90, "#f3eee3"], ["S", 180, "#f3eee3"], ["W", 270, "#f3eee3"]]
    .forEach(([t, az, col]) => {
      const sp = labelSprite(t, col);
      sp.scale.set(3.2, 3.2, 1);
      sp.userData.az = az;
      compass.add(sp);
    });
  compass.userData.r = r + 1.6;
  root.add(compass);
  placeCompass();
}

function placeCompass() {
  if (!compass) return;
  const f = face.az * RAD, r = compass.userData.r;
  compass.children.forEach((ch) => {
    if (ch.userData.az === undefined) return;
    const a = ch.userData.az * RAD;
    // world direction of this cardinal, then rotated into scene space
    const x = Math.sin(a), z = -Math.cos(a);
    ch.position.set(
      (x * Math.cos(f) + z * Math.sin(f)) * r, 1.4,
      (-x * Math.sin(f) + z * Math.cos(f)) * r
    );
  });
}

/* The sun's whole path for the chosen day, drawn as an arc you can see the
   current position sliding along. */
function buildArc() {
  if (arc) { scene.remove(arc); arc.geometry.dispose(); arc.material.dispose(); arc = null; }
  const lat = CITIES[city].lat;
  const R = dist * 1.5 + 30;
  const pts = [];
  for (let h = 0; h <= 24; h += 0.15) {
    const s = sunAngles(h, season.day, lat);
    if (s.alt < -1) continue;
    const v = sunVector(s.alt, s.az, face.az).multiplyScalar(R);
    pts.push(v);
  }
  if (pts.length < 2) return;
  arc = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: 0xffd8a0, transparent: true, opacity: 0.5 })
  );
  scene.add(arc);
}

/* ---------- readouts ---------- */
function refresh() {
  const C = CITIES[city], lat = C.lat;
  const solar = solarFromClock(clockHour, season.day, C.lon);
  const s = sunAngles(solar, season.day, lat);
  const sun = sunVector(s.alt, s.az, face.az);

  // light
  const R = dist * 1.5 + 30;
  sunLight.position.copy(sun).multiplyScalar(R * 0.6);
  sunLight.target.position.set(0, 0, 0);
  sunLight.target.updateMatrixWorld();
  const up = Math.max(0, s.alt);
  sunLight.intensity = s.alt > 0 ? 0.7 + Math.min(1, up / 42) * 3.6 : 0;
  // warm at the ends of the day, white in the middle
  const warm = 1 - Math.min(1, up / 30);
  sunLight.color.setRGB(1, 0.94 - warm * 0.18, 0.83 - warm * 0.33);
  // Deliberately low. A generous sky fill flatters the render and destroys the
  // one thing this section exists to show — where the shadow actually falls.
  fill.intensity = s.alt > 0 ? 0.28 + Math.min(1, up / 40) * 0.34 : 0.3;

  // Scaled with its distance so it reads as the sun at any zoom rather than
  // shrinking to a speck as you pull back.
  sunMesh.position.copy(sun).multiplyScalar(R);
  sunMesh.scale.setScalar(R * 0.02);
  sunGlow.position.copy(sunMesh.position);
  sunGlow.scale.setScalar(R * 0.3);
  sunMesh.visible = sunGlow.visible = s.alt > -2;

  const key = Math.round(s.alt / 3) + "";
  if (key !== skyKey) {
    skyKey = key;
    if (scene.background) scene.background.dispose();
    scene.background = skyTexture(s.alt);
  }

  // numbers
  const shade = lawnRect ? lawnShade(lawnRect, boxes, sun) : 1;
  const dl = dayLength(season.day, lat);
  const rise = dl ? clockFromSolar(dl.rise, season.day, C.lon) : NaN;
  const set = dl ? clockFromSolar(dl.set, season.day, C.lon) : NaN;
  const fh = facadeHours(season.day, lat, face.az);

  const set$ = (id, v) => { const e = $(id); if (e && e.textContent !== v) e.textContent = v; };
  set$("sunClock", hhmm(clockHour));
  set$("sunAlt", s.alt > 0 ? Math.round(s.alt) + "°" : "below the horizon");
  set$("sunShade", s.alt > 0 ? Math.round(shade * 100) + "%" : "100%");
  set$("sunFacade", fh.toFixed(1) + " hrs");
  set$("sunRise", hhmm(rise));
  set$("sunSet", hhmm(set));
  set$("sunPlotSize", plot.sqft.toLocaleString("en-US") + " sq ft · " + plot.w + " × " + plot.d + " ft");

  const bar = $("sunShadeBar");
  if (bar) bar.style.setProperty("--v", Math.round(shade * 100) + "%");

  verdict(fh, lat);
}

/* Said in terms of what it costs you, not what it's called. */
function verdict(fh, lat) {
  const el = $("sunVerdict");
  if (!el) return;
  const C = CITIES[city];
  // when is the lawn actually usable — measured, not asserted
  let firstShaded = null, sunnyEvening = 0;
  for (let h = 12; h <= 19.5; h += 0.25) {
    const solar = solarFromClock(h, season.day, C.lon);
    const s = sunAngles(solar, season.day, lat);
    if (s.alt <= 0) break;
    const sh = lawnShade(lawnRect, boxes, sunVector(s.alt, s.az, face.az));
    if (sh > 0.6 && firstShaded === null) firstShaded = h;
    if (sh < 0.6) sunnyEvening += 0.25;
  }
  const notes = {
    E: "The front rooms and the lawn get the morning, and the house itself puts the " +
       "lawn into shade through the worst of the afternoon. This is the orientation " +
       "buyers here ask for by name, and it usually carries a premium on resale.",
    W: "The lawn and the front elevation take the full afternoon sun — the hottest " +
       "part of the day through the summer. Cheaper to buy for exactly that reason, " +
       "and worth spending some of the difference on deep chajjas, shaded glazing or " +
       "heavy planting along the west wall.",
    N: "Even, indirect light on the front all year and very little direct heat load. " +
       "Comfortable in summer; the lawn stays shaded for much of a winter day, which " +
       "some people love and some find cold.",
    S: "The front takes sun through the middle of the day all year. Warm and bright in " +
       "December, hard work in June without a deep verandah."
  };
  const usable = firstShaded
    ? "Shade covers most of the lawn from about " + hhmm(firstShaded) + "."
    : "The lawn stays largely in sun right through to sunset.";
  el.innerHTML =
    "<strong>" + face.n + "-facing " + plot.n + " in " + C.n + ", " + season.n + ".</strong> " +
    notes[face.id] + " " + usable +
    " The front elevation takes " + fh.toFixed(1) + " hours of direct sun today.";
}

/* ---------- interaction ---------- */
function bind(c) {
  c.addEventListener("pointerdown", (e) => {
    try { c.setPointerCapture(e.pointerId); } catch (err) { /* not fatal */ }
    dragging = true; lastX = e.clientX; lastY = e.clientY;
  });
  c.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    targetYaw -= (e.clientX - lastX) * 0.006;
    pitch = Math.max(0.16, Math.min(1.4, pitch + (e.clientY - lastY) * 0.004));
    lastX = e.clientX; lastY = e.clientY;
  });
  ["pointerup", "pointercancel"].forEach((ev) =>
    c.addEventListener(ev, () => { dragging = false; }));
  c.addEventListener("wheel", (e) => {
    e.preventDefault();
    const span = Math.sqrt((plot.w * FT) ** 2 + (plot.d * FT) ** 2);
    targetDist = Math.max(span * 0.55, Math.min(span * 2.4 + 30, targetDist + e.deltaY * 0.05));
  }, { passive: false });
  c.addEventListener("touchstart", (e) => { if (e.touches.length === 2) pinch = gap(e); }, { passive: true });
  c.addEventListener("touchmove", (e) => {
    if (e.touches.length !== 2) return;
    const g2 = gap(e);
    const span = Math.sqrt((plot.w * FT) ** 2 + (plot.d * FT) ** 2);
    if (g2 && pinch) {
      targetDist = Math.max(span * 0.55, Math.min(span * 2.4 + 30, targetDist * (pinch / g2)));
      pinch = g2;
    }
  }, { passive: true });
  function gap(e) {
    const [a, b] = e.touches;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }
}

function loop(now) {
  if (!running) return;
  raf = requestAnimationFrame(loop);
  const ms = now || performance.now();
  const dt = Math.min(0.05, lastT ? (ms - lastT) / 1000 : 0.016);
  lastT = ms;

  if (playing) {
    // sunrise to sunset in about ten seconds
    clockHour += dt * 1.5;
    if (clockHour > 19.5) clockHour = 5;
    const sl = $("sunTime");
    if (sl) sl.value = String(clockHour);
    refresh();
  }

  yaw += (targetYaw - yaw) * 0.09;
  dist += (targetDist - dist) * 0.09;
  camera.position.set(
    Math.sin(yaw) * dist * Math.cos(pitch),
    Math.max(2, Math.sin(pitch) * dist),
    Math.cos(yaw) * dist * Math.cos(pitch)
  );
  // Aimed a little forward of centre so the plot rides above the time
  // scrubber sitting across the bottom of the stage.
  camera.lookAt(0, 3.2, -2);
  renderer.render(scene, camera);
}

function start() { if (!running && ready) { running = true; lastT = 0; loop(); } }
function stop() { running = false; cancelAnimationFrame(raf); }

function rebuild() {
  buildPlot();
  buildArc();
  placeCompass();
  refresh();
}

/* ---------- chrome ---------- */
function chips(id, list, current, onPick) {
  const box = $(id);
  if (!box) return;
  box.innerHTML = list.map((o) =>
    '<button class="chip' + (o.id === current ? " is-active" : "") + '" type="button" ' +
    'data-v="' + o.id + '" aria-pressed="' + (o.id === current) + '">' + o.n + "</button>").join("");
  box.querySelectorAll("[data-v]").forEach((b) => {
    b.addEventListener("click", () => {
      box.querySelectorAll("[data-v]").forEach((o) => {
        const on = o === b;
        o.classList.toggle("is-active", on);
        o.setAttribute("aria-pressed", String(on));
      });
      onPick(b.getAttribute("data-v"));
    });
  });
}

function send() {
  const C = CITIES[city];
  const msg = "Hello Adeel — I'm after a " + face.n.toLowerCase() + "-facing " + plot.n +
    " in " + C.n + ".\n\nI used the sun study on your site to work out the orientation " +
    "I want. What have you got, and what's the premium on " + face.n.toLowerCase() +
    "-facing over the others right now?";
  if (window.LeadRelay) window.LeadRelay.send(msg);
  else window.open("https://wa.me/16134083945?text=" + encodeURIComponent(msg), "_blank", "noopener");
}

(function boot() {
  const section = document.getElementById("sunstudy");
  if (!section || !cv()) return;

  chips("sunPlot", PLOTS, plot.id, (v) => { plot = PLOTS.filter((p) => p.id === v)[0]; rebuild(); });
  chips("sunFace", FACES, face.id, (v) => { face = FACES.filter((f) => f.id === v)[0]; rebuild(); });
  chips("sunSeason", SEASONS, season.id, (v) => { season = SEASONS.filter((s) => s.id === v)[0]; rebuild(); });
  chips("sunCity", [{ id: "isb", n: "Islamabad" }, { id: "lhr", n: "Lahore" }], city,
    (v) => { city = v; rebuild(); });

  const slider = $("sunTime");
  if (slider) slider.addEventListener("input", () => {
    clockHour = +slider.value;
    playing = false;
    setPlay(false);
    refresh();
  });

  const play = $("sunPlay");
  function setPlay(on) {
    playing = on;
    if (play) {
      play.textContent = on ? "❚❚ Pause" : "▶ Run the day";
      play.setAttribute("aria-pressed", String(on));
    }
  }
  if (play) play.addEventListener("click", () => setPlay(!playing));

  const cta = $("sunCta");
  if (cta) cta.addEventListener("click", send);

  let booted = false;
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) { stop(); return; }
      if (!booted) {
        booted = true;
        if (!initScene()) { section.classList.add("sun--no3d"); io.disconnect(); return; }
        rebuild();
        const l = $("sunLoading");
        if (l) l.remove();
      }
      start();
    });
  }, { rootMargin: "220px" });
  io.observe(section);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (ready && section.getBoundingClientRect().top < innerHeight) start();
  });
})();

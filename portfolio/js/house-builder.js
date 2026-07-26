/* ============================================================
   HOUSE BUILDER — interactive 3D home configurator
   ------------------------------------------------------------
   Visitors design a house (plot, storeys, elevation, finish,
   features), see it rebuild live in 3D, get an indicative build
   cost, then send the full spec to Adeel's builder network.

   Self-contained on purpose: it shares no code with estate3d.js
   so the existing showcase can't regress. Everything is
   procedural — no model downloads, no extra network weight.

   Performance: nothing initialises until the section is near the
   viewport, and the render loop pauses whenever it scrolls out
   of view or the tab is hidden.
   ============================================================ */
import * as THREE from "three";

/* ---------- palette ---------- */
const GOLD = 0xc9a45c;
const GLASS_TINT = 0x121a2c;

/* Finishes double as the cost tier — order matters, cheapest first. */
const FINISHES = {
  charcoal: { label: "Charcoal render", wall: 0x3a3f4a, trim: 0xd9d0bc, rate: 5200 },
  cream:    { label: "Cream stucco",    wall: 0xd9d0bc, trim: 0x8a7350, rate: 5000 },
  stone:    { label: "Grey stone",      wall: 0x6d7178, trim: 0xd9d0bc, rate: 6400 },
  brick:    { label: "Exposed brick",   wall: 0x8d4a34, trim: 0xd9d0bc, rate: 5800 },
  white:    { label: "Modern white",    wall: 0xe8e6e1, trim: 0x3a3f4a, rate: 5600 }
};

const PLOTS = {
  "5m":  { label: "5 Marla",  w: 7.5,  d: 10,   sqft: 1125, lot: [11, 18] },
  "10m": { label: "10 Marla", w: 10,   d: 12.5, sqft: 2250, lot: [15, 22] },
  "1k":  { label: "1 Kanal",  w: 13.5, d: 16,   sqft: 4500, lot: [20, 28] },
  "2k":  { label: "2 Kanal",  w: 18,   d: 20,   sqft: 9000, lot: [26, 34] }
};

const STYLES = {
  modern:  "Modern",
  classic: "Classic columns",
  spanish: "Spanish villa",
  glass:   "Glass contemporary"
};

const FEATURES = {
  pool:     { label: "Swimming pool", cost: 3500000 },
  lawn:     { label: "Landscaped lawn", cost: 450000 },
  wall:     { label: "Boundary wall & gate", cost: 1200000 },
  porch:    { label: "Car porch", cost: 900000 },
  solar:    { label: "Solar system", cost: 1800000 },
  basement: { label: "Basement", cost: 0 },  // priced by area below
  balcony:  { label: "Balconies", cost: 600000 }
};

const state = {
  plot: "10m",
  storeys: 2,
  style: "modern",
  finish: "charcoal",
  roof: "flat",
  features: { lawn: true, wall: true, porch: true, balcony: true, pool: false, solar: false, basement: false },
  night: false,
  spin: true
};

/* ============================================================
   Procedural textures — drawn once, cached
   ============================================================ */
const texCache = new Map();
function tex(key, draw, repeat = [2, 2], size = 256) {
  if (texCache.has(key)) return texCache.get(key);
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d"), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 4;
  texCache.set(key, t);
  return t;
}
const css = (h) => "#" + h.toString(16).padStart(6, "0");

function stuccoTex(color) {
  return tex("stucco" + color, (g, s) => {
    g.fillStyle = css(color); g.fillRect(0, 0, s, s);
    for (let i = 0; i < 5200; i++) {
      g.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
      g.fillRect(Math.random() * s, Math.random() * s, 1.4, 1.4);
    }
  });
}
function brickTex(color) {
  return tex("brick" + color, (g, s) => {
    g.fillStyle = "#6d3a29"; g.fillRect(0, 0, s, s);
    const bh = s / 14;
    for (let r = 0; r < 14; r++) {
      const off = (r % 2) * (s / 12);
      for (let c = -1; c < 13; c++) {
        g.fillStyle = `hsl(14, ${28 + Math.random() * 14}%, ${26 + Math.random() * 12}%)`;
        g.fillRect(c * (s / 6) + off + 1.5, r * bh + 1.5, s / 6 - 3, bh - 3);
      }
    }
  }, [3, 3]);
}
function tileTex() {
  return tex("roofTile", (g, s) => {
    g.fillStyle = "#7d3b2a"; g.fillRect(0, 0, s, s);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      g.fillStyle = `hsl(${12 + Math.random() * 8}, 45%, ${26 + Math.random() * 10}%)`;
      g.beginPath();
      g.arc(x * s / 8 + s / 16, y * s / 8 + s / 16, s / 17, Math.PI, 0);
      g.fill();
    }
  }, [6, 4]);
}
function paverTex() {
  return tex("paver", (g, s) => {
    g.fillStyle = "#8f6249"; g.fillRect(0, 0, s, s);
    for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) {
      g.fillStyle = `hsl(20, 26%, ${38 + Math.random() * 12}%)`;
      g.fillRect(x * s / 10 + 1, y * s / 10 + 1, s / 10 - 2, s / 10 - 2);
    }
  }, [5, 5]);
}
function grassTex() {
  return tex("grass", (g, s) => {
    g.fillStyle = "#3f7742"; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 6000; i++) {
      g.fillStyle = `hsl(${95 + Math.random() * 35}, ${34 + Math.random() * 26}%, ${30 + Math.random() * 22}%)`;
      g.fillRect(Math.random() * s, Math.random() * s, 2, 3);
    }
  }, [8, 8]);
}

/* ---------- material + mesh helpers ---------- */
function mat(color, rough = 0.85, metal = 0.05, map = null) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, map });
}
function box(w, h, d, material) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.castShadow = m.receiveShadow = true;
  return m;
}
function glassMat(emissive) {
  return new THREE.MeshStandardMaterial({
    color: GLASS_TINT, roughness: 0.06, metalness: 0.35,
    emissive: new THREE.Color(emissive ? 0xffca7a : 0x2d4a7a),
    emissiveIntensity: emissive ? 1.35 : 0.55
  });
}

/* ============================================================
   House generation
   ============================================================ */
function buildHouse(cfg) {
  const g = new THREE.Group();
  const plot = PLOTS[cfg.plot];
  const fin = FINISHES[cfg.finish];
  const W = plot.w, D = plot.d;
  const floorH = 3.2;
  const storeys = cfg.storeys;
  const night = cfg.night;

  const wallMap = cfg.finish === "brick" ? brickTex(fin.wall) : stuccoTex(fin.wall);
  const wallMat = mat(fin.wall, 0.9, 0.03, wallMap);
  const trimMat = mat(fin.trim, 0.8, 0.04);

  /* ---- plinth ---- */
  const plinth = box(W + 1.2, 0.45, D + 1.2, mat(0x55504a, 0.95));
  plinth.position.y = 0.22;
  g.add(plinth);

  /* ---- storeys ---- */
  for (let s = 0; s < storeys; s++) {
    const y = 0.45 + s * floorH;
    // slightly stepped upper floors read as designed, not extruded
    const inset = cfg.style === "modern" || cfg.style === "glass" ? s * 0.35 : 0;
    const bw = W - inset * 2, bd = D - inset * 2;

    const body = box(bw, floorH, bd, wallMat);
    body.position.set(0, y + floorH / 2, 0);
    g.add(body);

    // feature band in trim colour
    const band = box(bw + 0.12, 0.22, bd + 0.12, trimMat);
    band.position.set(0, y + floorH - 0.11, 0);
    g.add(band);

    // windows across the front
    const cols = Math.max(2, Math.round(bw / 2.6));
    const wW = cfg.style === "glass" ? bw / cols * 0.82 : bw / cols * 0.55;
    const wH = cfg.style === "glass" ? floorH * 0.72 : 1.35;
    for (let c = 0; c < cols; c++) {
      const x = -bw / 2 + bw / cols * (c + 0.5);
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(wW, wH), glassMat(night));
      pane.position.set(x, y + floorH * 0.52, bd / 2 + 0.03);
      g.add(pane);
      // side windows
      const side = new THREE.Mesh(new THREE.PlaneGeometry(wW * 0.7, wH * 0.8), glassMat(night));
      side.rotation.y = Math.PI / 2;
      side.position.set(-bw / 2 - 0.03, y + floorH * 0.52, -bd / 2 + bd / cols * (c + 0.5));
      g.add(side);
    }

    // classic columns on the ground floor
    if (cfg.style === "classic" && s === 0) {
      for (let i = 0; i < 4; i++) {
        const col = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.26, floorH, 16), trimMat);
        col.castShadow = true;
        col.position.set(-bw / 2 + 0.9 + i * ((bw - 1.8) / 3), y + floorH / 2, bd / 2 + 0.9);
        g.add(col);
      }
      const canopy = box(bw * 0.9, 0.25, 2.2, trimMat);
      canopy.position.set(0, y + floorH, bd / 2 + 0.9);
      g.add(canopy);
    }

    // balconies on upper floors
    if (cfg.features.balcony && s > 0) {
      const slab = box(bw * 0.55, 0.16, 1.5, trimMat);
      slab.position.set(0, y + 0.08, bd / 2 + 0.75);
      g.add(slab);
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(bw * 0.55, 0.85, 0.06),
        new THREE.MeshStandardMaterial({ color: 0x9fc4e8, roughness: 0.1, metalness: 0.3,
          transparent: true, opacity: 0.42 }));
      rail.position.set(0, y + 0.5, bd / 2 + 1.48);
      g.add(rail);
    }
  }

  const topY = 0.45 + storeys * floorH;

  /* ---- roof ---- */
  if (cfg.roof === "hip") {
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(Math.max(W, D) * 0.78, 2.4, 4),
      mat(0x7d3b2a, 0.9, 0.02, tileTex()));
    roof.rotation.y = Math.PI / 4;
    roof.position.y = topY + 1.2;
    roof.castShadow = true;
    g.add(roof);
  } else {
    const par = box(W + 0.3, 0.85, D + 0.3, trimMat);
    par.position.y = topY + 0.42;
    g.add(par);
    const inner = box(W - 0.5, 0.9, D - 0.5, mat(0x3d4550, 0.95));
    inner.position.y = topY + 0.45;
    g.add(inner);
  }

  /* ---- door ---- */
  const door = box(1.5, 2.5, 0.14, mat(0x4a2f1c, 0.65, 0.08));
  door.position.set(0, 0.45 + 1.25, D / 2 + 0.06);
  g.add(door);
  const doorLight = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.9), glassMat(night));
  doorLight.position.set(1.1, 0.45 + 1.6, D / 2 + 0.07);
  g.add(doorLight);

  /* ---- solar ---- */
  if (cfg.features.solar && cfg.roof === "flat") {
    for (let i = 0; i < 3; i++) {
      const p = box(W * 0.26, 0.08, D * 0.3,
        new THREE.MeshStandardMaterial({ color: 0x16203a, roughness: 0.25, metalness: 0.7 }));
      p.position.set(-W * 0.3 + i * W * 0.3, topY + 0.95, -D * 0.1);
      p.rotation.x = -0.32;
      g.add(p);
    }
  }

  /* ---- grounds ---- */
  const [lw, ld] = plot.lot;
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(lw, ld),
    mat(cfg.features.lawn ? 0x4a8a4e : 0x6d675e, 1, 0,
        cfg.features.lawn ? grassTex() : paverTex()));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  g.add(ground);

  // driveway
  const drive = new THREE.Mesh(new THREE.PlaneGeometry(4.2, (ld - D) / 2 + 1),
    mat(0x8f6249, 0.95, 0, paverTex()));
  drive.rotation.x = -Math.PI / 2;
  drive.position.set(0, 0.02, D / 2 + (ld - D) / 4);
  drive.receiveShadow = true;
  g.add(drive);

  if (cfg.features.porch) {
    const roofSlab = box(5, 0.2, 4.4, trimMat);
    roofSlab.position.set(-W / 2 - 1.6, 3.0, D / 2 - 1.2);
    g.add(roofSlab);
    for (const dx of [-2.2, 2.2]) for (const dz of [-1.9, 1.9]) {
      const post = box(0.2, 3, 0.2, trimMat);
      post.position.set(-W / 2 - 1.6 + dx, 1.5, D / 2 - 1.2 + dz);
      g.add(post);
    }
  }

  if (cfg.features.pool) {
    const water = box(5.2, 0.3, 3.2, new THREE.MeshStandardMaterial({
      color: 0x1d6f8f, roughness: 0.05, metalness: 0.55,
      emissive: new THREE.Color(night ? 0x0a4a63 : 0x000000), emissiveIntensity: night ? 0.7 : 0
    }));
    water.position.set(W / 2 + 2.4, 0.16, -D / 4);
    g.add(water);
    const lip = box(5.8, 0.14, 3.8, trimMat);
    lip.position.set(W / 2 + 2.4, 0.06, -D / 4);
    g.add(lip);
  }

  if (cfg.features.wall) {
    const h = 1.9, t = 0.22;
    const wallM = mat(fin.trim, 0.92, 0.02, stuccoTex(fin.trim));
    const north = box(lw, h, t, wallM); north.position.set(0, h / 2, -ld / 2); g.add(north);
    const east = box(t, h, ld, wallM); east.position.set(lw / 2, h / 2, 0); g.add(east);
    const west = box(t, h, ld, wallM); west.position.set(-lw / 2, h / 2, 0); g.add(west);
    // front wall with a gate gap
    const seg = (lw - 4.4) / 2;
    for (const sx of [-1, 1]) {
      const f = box(seg, h, t, wallM);
      f.position.set(sx * (4.4 / 2 + seg / 2), h / 2, ld / 2);
      g.add(f);
    }
    const gate = box(4.2, 1.7, 0.1, new THREE.MeshStandardMaterial({
      color: 0x14171d, roughness: 0.45, metalness: 0.75 }));
    gate.position.set(0, 0.85, ld / 2);
    g.add(gate);
    for (const sx of [-1, 1]) {
      const pil = box(0.5, h + 0.35, 0.5, trimMat);
      pil.position.set(sx * 2.35, (h + 0.35) / 2, ld / 2);
      g.add(pil);
    }
  }

  if (cfg.features.lawn) {
    for (const [tx, tz] of [[-lw / 2 + 1.6, ld / 2 - 2.4], [lw / 2 - 1.6, ld / 2 - 2.4],
                            [-lw / 2 + 1.6, -ld / 2 + 2.4]]) {
      const trunk = box(0.22, 1.1, 0.22, mat(0x4a3524, 0.95));
      trunk.position.set(tx, 0.55, tz);
      g.add(trunk);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.95, 12, 10), mat(0x24512c, 0.95));
      crown.position.set(tx, 1.8, tz);
      crown.castShadow = true;
      g.add(crown);
    }
  }

  // warm spill from the porch at night
  if (night) {
    const lamp = new THREE.PointLight(0xffb765, 2.4, 16, 2);
    lamp.position.set(0, 3, D / 2 + 2.2);
    g.add(lamp);
  }

  g.userData.footprint = { W, D, lw, ld };
  return g;
}

/* ============================================================
   Costing — indicative only, and labelled as such in the UI
   ============================================================ */
function estimate(cfg) {
  const plot = PLOTS[cfg.plot];
  const fin = FINISHES[cfg.finish];
  // Covered area: ~65% ground coverage is typical, upper floors similar.
  const perFloor = Math.round(plot.sqft * 0.62);
  let area = perFloor * cfg.storeys;
  if (cfg.features.basement) area += Math.round(perFloor * 0.85);

  let cost = area * fin.rate;
  if (cfg.roof === "hip") cost += area * 220;
  for (const k in cfg.features) {
    if (!cfg.features[k]) continue;
    if (k === "basement") continue; // already in area
    cost += FEATURES[k] ? FEATURES[k].cost : 0;
  }
  // bigger plots carry proportionally bigger boundary/landscape works
  cost *= cfg.plot === "2k" ? 1.12 : cfg.plot === "1k" ? 1.06 : 1;
  return { area, cost: Math.round(cost / 100000) * 100000 };
}

function fmtPKR(n) {
  if (n >= 1e7) return "PKR " + (n / 1e7).toFixed(2).replace(/\.?0+$/, "") + " Crore";
  return "PKR " + (n / 1e5).toFixed(0) + " Lac";
}

/* ============================================================
   Scene
   ============================================================ */
let renderer, scene, camera, house, sun, hemi, rig;
let running = false, initialised = false, raf = 0;
let yaw = -0.7, pitch = 0.26, dist = 34, targetYaw = -0.7;
let dragging = false, lastX = 0, lastY = 0, pinchStart = 0;

const canvas = () => document.getElementById("builderCanvas");

function skyColor(night) { return night ? 0x0a1024 : 0x2c4372; }

function initScene() {
  const cv = canvas();
  try {
    renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false,
      powerPreference: "high-performance", preserveDrawingBuffer: true });
  } catch (e) { return false; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.42;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(skyColor(false));
  scene.fog = new THREE.Fog(skyColor(false), 46, 96);

  camera = new THREE.PerspectiveCamera(38, 1, 0.5, 220);
  rig = new THREE.Group();
  scene.add(rig);

  hemi = new THREE.HemisphereLight(0xcfe0ff, 0x6a7a58, 1.9);
  scene.add(hemi);

  sun = new THREE.DirectionalLight(0xfff0d6, 3.4);
  sun.position.set(16, 24, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const s = 30;
  sun.shadow.camera.left = -s; sun.shadow.camera.right = s;
  sun.shadow.camera.top = s; sun.shadow.camera.bottom = -s;
  sun.shadow.camera.far = 90;
  sun.shadow.bias = -0.0006;
  scene.add(sun);

  const rim = new THREE.DirectionalLight(0x7f9fe8, 1.15);
  rim.position.set(-18, 12, -16);
  scene.add(rim);

  // Facade fill — without this the front elevation reads as a black slab.
  const fill = new THREE.DirectionalLight(0xffffff, 0.75);
  fill.position.set(0, 10, 34);
  scene.add(fill);

  bindPointer(cv);
  resize();
  addEventListener("resize", resize, { passive: true });
  initialised = true;
  return true;
}

function resize() {
  if (!renderer) return;
  const cv = canvas();
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function bindPointer(cv) {
  const down = (x, y) => { dragging = true; lastX = x; lastY = y; state.spin = false; syncSpinBtn(); };
  const move = (x, y) => {
    if (!dragging) return;
    targetYaw += (x - lastX) * 0.007;
    pitch = Math.max(0.06, Math.min(0.85, pitch - (y - lastY) * 0.005));
    lastX = x; lastY = y;
  };
  cv.addEventListener("mousedown", (e) => down(e.clientX, e.clientY));
  addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
  addEventListener("mouseup", () => { dragging = false; });
  cv.addEventListener("wheel", (e) => {
    e.preventDefault();
    dist = Math.max(16, Math.min(70, dist + Math.sign(e.deltaY) * 2.2));
  }, { passive: false });
  cv.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) down(e.touches[0].clientX, e.touches[0].clientY);
    else if (e.touches.length === 2) pinchStart = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  }, { passive: true });
  cv.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1) move(e.touches[0].clientX, e.touches[0].clientY);
    else if (e.touches.length === 2 && pinchStart) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX,
                           e.touches[0].clientY - e.touches[1].clientY);
      dist = Math.max(16, Math.min(70, dist - (d - pinchStart) * 0.06));
      pinchStart = d;
    }
  }, { passive: true });
  addEventListener("touchend", () => { dragging = false; pinchStart = 0; });
}

/* Rebuild the model, animating the new one in. */
function rebuild() {
  if (!initialised) return;
  if (house) { rig.remove(house); disposeTree(house); }
  house = buildHouse(state);
  house.scale.setScalar(0.001);
  rig.add(house);

  const night = state.night;
  scene.background.setHex(skyColor(night));
  scene.fog.color.setHex(skyColor(night));
  sun.intensity = night ? 0.5 : 3.4;
  sun.color.setHex(night ? 0x8fa8e8 : 0xffe6c2);
  hemi.intensity = night ? 0.6 : 1.9;

  // frame the whole lot regardless of plot size
  const lot = house.userData.footprint;
  dist = Math.max(lot.lw, lot.ld) * 1.62;

  const t0 = performance.now();
  (function grow() {
    const k = Math.min(1, (performance.now() - t0) / 480);
    const e = 1 - Math.pow(1 - k, 3);
    house.scale.setScalar(0.001 + e * 0.999);
    if (k < 1) requestAnimationFrame(grow);
  })();
}

function disposeTree(obj) {
  obj.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) {
      const list = Array.isArray(o.material) ? o.material : [o.material];
      // shared cached textures are reused across rebuilds — don't dispose them
      list.forEach((m) => m.dispose());
    }
  });
}

function loop() {
  if (!running) return;
  raf = requestAnimationFrame(loop);
  if (state.spin && !dragging) targetYaw += 0.0022;
  yaw += (targetYaw - yaw) * 0.08;
  const r = dist;
  camera.position.set(Math.sin(yaw) * r * Math.cos(pitch),
                      Math.sin(pitch) * r + 3,
                      Math.cos(yaw) * r * Math.cos(pitch));
  camera.lookAt(0, 3.2, 0);
  renderer.render(scene, camera);
}
function start() { if (!running && initialised) { running = true; loop(); } }
function stop() { running = false; cancelAnimationFrame(raf); }

/* ============================================================
   UI
   ============================================================ */
function optionRow(title, name, options, current, isFeature) {
  return `<div class="bld-group">
    <p class="bld-group__label">${title}</p>
    <div class="bld-chips">${options.map(([val, label]) => {
      const on = isFeature ? state.features[val] : current === val;
      return `<button type="button" class="bld-chip${on ? " is-on" : ""}"
        data-${isFeature ? "feature" : "set"}="${isFeature ? val : name}"
        ${isFeature ? "" : `data-value="${val}"`}
        aria-pressed="${on}">${label}</button>`;
    }).join("")}</div>
  </div>`;
}

function renderControls() {
  const el = document.getElementById("builderControls");
  el.innerHTML =
    optionRow("Plot size", "plot", Object.entries(PLOTS).map(([k, v]) => [k, v.label]), state.plot) +
    optionRow("Storeys", "storeys", [["1", "Single"], ["2", "Double"], ["3", "Triple"]], String(state.storeys)) +
    optionRow("Elevation", "style", Object.entries(STYLES), state.style) +
    optionRow("Finish", "finish", Object.entries(FINISHES).map(([k, v]) => [k, v.label]), state.finish) +
    optionRow("Roof", "roof", [["flat", "Flat parapet"], ["hip", "Tiled hip"]], state.roof) +
    optionRow("Add-ons", "features", Object.entries(FEATURES).map(([k, v]) => [k, v.label]), null, true);

  el.querySelectorAll("[data-set]").forEach((b) => b.addEventListener("click", () => {
    const key = b.dataset.set, val = b.dataset.value;
    state[key] = key === "storeys" ? +val : val;
    renderControls(); rebuild(); updateSummary();
  }));
  el.querySelectorAll("[data-feature]").forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.feature;
    state.features[k] = !state.features[k];
    renderControls(); rebuild(); updateSummary();
  }));
}

function updateSummary() {
  const { area, cost } = estimate(state);
  document.getElementById("bldArea").textContent = area.toLocaleString("en-US") + " sq ft";
  document.getElementById("bldCost").textContent = fmtPKR(cost);
}

function specText() {
  const { area, cost } = estimate(state);
  const on = Object.keys(state.features).filter((k) => state.features[k]).map((k) => FEATURES[k].label);
  return "Hello Adeel — I designed a house on your website and I'd like a builder quote.\n\n" +
    "• Plot: " + PLOTS[state.plot].label + "\n" +
    "• Storeys: " + state.storeys + "\n" +
    "• Elevation: " + STYLES[state.style] + "\n" +
    "• Finish: " + FINISHES[state.finish].label + "\n" +
    "• Roof: " + (state.roof === "hip" ? "Tiled hip" : "Flat parapet") + "\n" +
    "• Add-ons: " + (on.length ? on.join(", ") : "none") + "\n" +
    "• Approx covered area: " + area.toLocaleString("en-US") + " sq ft\n" +
    "• Indicative build cost shown on site: " + fmtPKR(cost) + "\n\n" +
    "Please connect me with your builders for an exact quote.";
}

function wireChrome() {
  const dn = document.getElementById("builderDayNight");
  dn.addEventListener("click", () => {
    state.night = !state.night;
    dn.textContent = state.night ? "☀" : "🌙";
    dn.setAttribute("aria-pressed", String(state.night));
    rebuild();
  });

  const spin = document.getElementById("builderSpin");
  spin.addEventListener("click", () => { state.spin = !state.spin; syncSpinBtn(); });

  document.getElementById("builderShot").addEventListener("click", () => {
    if (!renderer) return;
    renderer.render(scene, camera);
    const a = document.createElement("a");
    a.download = "my-home-design.png";
    a.href = renderer.domElement.toDataURL("image/png");
    a.click();
  });

  document.getElementById("bldRequest").addEventListener("click", () => {
    const msg = specText();
    if (window.LeadRelay) window.LeadRelay.send(msg);
    else window.open("https://wa.me/16134083945?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });
}
function syncSpinBtn() {
  const b = document.getElementById("builderSpin");
  if (b) { b.setAttribute("aria-pressed", String(state.spin)); b.style.opacity = state.spin ? "1" : "0.5"; }
}

/* ============================================================
   Lazy boot — nothing runs until the section is close to view
   ============================================================ */
(function boot() {
  const section = document.getElementById("builder");
  if (!section || !canvas()) return;

  renderControls();
  updateSummary();

  let booted = false;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        if (!booted) {
          booted = true;
          if (!initScene()) {   // no WebGL — leave the configurator usable without 3D
            section.classList.add("builder--no3d");
            const l = document.getElementById("builderLoading");
            if (l) l.textContent = "3D preview unavailable on this device — the designer still works.";
            io.disconnect();
            return;
          }
          wireChrome();
          syncSpinBtn();
          rebuild();
          const l = document.getElementById("builderLoading");
          if (l) l.remove();
        }
        start();
      } else {
        stop();   // don't burn battery/GPU while off-screen
      }
    }
  }, { rootMargin: "220px" });
  io.observe(section);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (booted && section.getBoundingClientRect().top < innerHeight) start();
  });
})();

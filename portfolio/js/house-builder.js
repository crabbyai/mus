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
  greyWhite:  { label: "Grey & white plaster", wall: 0x7d838c, trim: 0xeceae5, rate: 5200 },
  travertine: { label: "Travertine cladding",  wall: 0xd8cbb2, trim: 0xb9a888, rate: 6800 },
  whiteWood:  { label: "White & wood",         wall: 0xeceae5, trim: 0x8d8579, rate: 5600 },
  sandstone:  { label: "Sandstone & grey",     wall: 0xc2a678, trim: 0x6d7178, rate: 6200 },
  brick:      { label: "Gultex & brick",       wall: 0x8d4a34, trim: 0xeceae5, rate: 5400 }
};

const PLOTS = {
  "5m":  { label: "5 Marla",  w: 7.5,  d: 10,   sqft: 1125, lot: [11, 18] },
  "10m": { label: "10 Marla", w: 10,   d: 12.5, sqft: 2250, lot: [15, 22] },
  "1k":  { label: "1 Kanal",  w: 13.5, d: 16,   sqft: 4500, lot: [20, 28] },
  "2k":  { label: "2 Kanal",  w: 18,   d: 20,   sqft: 9000, lot: [26, 34] }
};

/* Elevation styles as they're actually described here. */
const STYLES = {
  dha:      "DHA Modern",
  glass:    "Contemporary Glass",
  spanish:  "Bahria Spanish",
  colonial: "Lahore Kothi"
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
  style: "dha",
  finish: "greyWhite",
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

/* Smooth grey/white plaster — the base finish on nearly every DHA elevation. */
function plasterTex(color) {
  return tex("plaster" + color, (g, s) => {
    g.fillStyle = css(color); g.fillRect(0, 0, s, s);
    for (let i = 0; i < 4200; i++) {
      g.fillStyle = `rgba(0,0,0,${Math.random() * 0.035})`;
      g.fillRect(Math.random() * s, Math.random() * s, 1.6, 1.6);
    }
  });
}

/* Travertine / marble cladding — the cream stone banding you see all over
   Bahria and DHA facades, laid in wide horizontal courses. */
function travertineTex() {
  return tex("travertine", (g, s) => {
    g.fillStyle = "#d8cbb2"; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = `rgba(150,130,100,${Math.random() * 0.18})`;
      g.fillRect(Math.random() * s, Math.random() * s, 6 + Math.random() * 16, 1.5);
    }
    g.strokeStyle = "rgba(120,104,80,0.5)"; g.lineWidth = 1.5;
    for (let r = 1; r < 4; r++) {
      g.beginPath(); g.moveTo(0, r * s / 4); g.lineTo(s, r * s / 4); g.stroke();
    }
  }, [2, 2]);
}

/* WPC / wood-look cladding panels — the warm vertical slats used as feature
   panels around entrances and on projecting boxes. */
function woodCladTex() {
  return tex("woodclad", (g, s) => {
    g.fillStyle = "#6b4526"; g.fillRect(0, 0, s, s);
    const n = 10;
    for (let i = 0; i < n; i++) {
      g.fillStyle = `hsl(${24 + Math.random() * 8}, ${38 + Math.random() * 12}%, ${24 + Math.random() * 12}%)`;
      g.fillRect(i * s / n + 1.5, 0, s / n - 3, s);
      for (let k = 0; k < 26; k++) {
        g.fillStyle = `rgba(0,0,0,${Math.random() * 0.16})`;
        g.fillRect(i * s / n + 2, Math.random() * s, s / n - 4, 1);
      }
    }
  }, [1, 1]);
}

function brickTex() {
  return tex("brick", (g, s) => {
    g.fillStyle = "#6d3a29"; g.fillRect(0, 0, s, s);
    const bh = s / 14;
    for (let r = 0; r < 14; r++) {
      const off = (r % 2) * (s / 12);
      for (let c = -1; c < 13; c++) {
        g.fillStyle = `hsl(14, ${28 + Math.random() * 14}%, ${30 + Math.random() * 12}%)`;
        g.fillRect(c * (s / 6) + off + 1.5, r * bh + 1.5, s / 6 - 3, bh - 3);
      }
    }
  }, [3, 3]);
}
function tileTex() {
  return tex("roofTile", (g, s) => {
    g.fillStyle = "#8d4530"; g.fillRect(0, 0, s, s);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      g.fillStyle = `hsl(${12 + Math.random() * 8}, 48%, ${32 + Math.random() * 12}%)`;
      g.beginPath();
      g.arc(x * s / 8 + s / 16, y * s / 8 + s / 16, s / 17, Math.PI, 0);
      g.fill();
    }
  }, [6, 4]);
}
function paverTex() {
  return tex("paver", (g, s) => {
    g.fillStyle = "#9a8b76"; g.fillRect(0, 0, s, s);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      g.fillStyle = `hsl(34, 16%, ${52 + Math.random() * 14}%)`;
      g.fillRect(x * s / 8 + 1.5, y * s / 8 + 1.5, s / 8 - 3, s / 8 - 3);
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
function glassMat(night) {
  return new THREE.MeshStandardMaterial({
    color: 0x1a2740, roughness: 0.05, metalness: 0.55,
    emissive: new THREE.Color(night ? 0xffc074 : 0x39628f),
    emissiveIntensity: night ? 1.5 : 0.7
  });
}
/* Black aluminium — window frames, railings, gate. Ubiquitous here. */
function frameMat() { return mat(0x191c22, 0.4, 0.65); }

/* A glazed opening with the black frame that defines these elevations. */
function window3d(g, { w, h, x, y, z, rotY = 0, night }) {
  const grp = new THREE.Group();
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMat(night));
  pane.position.z = 0.04;
  grp.add(pane);
  const t = 0.09;
  const fm = frameMat();
  for (const [bw, bh, bx, by] of [[w + t * 2, t, 0, h / 2], [w + t * 2, t, 0, -h / 2],
                                  [t, h, -w / 2, 0], [t, h, w / 2, 0]]) {
    const b = box(bw, bh, 0.1, fm);
    b.position.set(bx, by, 0.04);
    grp.add(b);
  }
  // mullion — these windows are almost always divided
  const mull = box(0.07, h, 0.1, fm);
  mull.position.z = 0.05;
  grp.add(mull);
  grp.position.set(x, y, z);
  grp.rotation.y = rotY;
  g.add(grp);
}

/* Vertical fins/louvers — the single most recognisable feature of a modern
   DHA elevation. Runs full height across part of the facade. */
function louvers(g, { w, h, x, y, z, count, material }) {
  for (let i = 0; i < count; i++) {
    const f = box(0.1, h, 0.32, material);
    f.position.set(x - w / 2 + (w / (count - 1)) * i, y, z);
    g.add(f);
  }
}

/* Mumty (roof stair enclosure) + water tanks — every real house here has
   them, and their absence is exactly why a render looks foreign. */
function roofFurniture(g, { W, D, topY, wallMat, trimMat, night }) {
  const mumty = box(W * 0.3, 2.5, D * 0.26, wallMat);
  mumty.position.set(-W * 0.26, topY + 1.25, -D * 0.24);
  g.add(mumty);
  const mCap = box(W * 0.3 + 0.25, 0.16, D * 0.26 + 0.25, trimMat);
  mCap.position.set(-W * 0.26, topY + 2.55, -D * 0.24);
  g.add(mCap);
  window3d(g, { w: 0.8, h: 1, x: -W * 0.26, y: topY + 1.5, z: -D * 0.24 + D * 0.13 + 0.02, night });

  // black poly water tanks
  for (let i = 0; i < 2; i++) {
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.95, 12),
      mat(0x23262b, 0.75, 0.05));
    tank.castShadow = true;
    tank.position.set(-W * 0.34 + i * 0.75, topY + 3.1, -D * 0.24);
    g.add(tank);
  }
  // stair-block handrail run
  const rail = box(W * 0.3, 0.06, 0.06, frameMat());
  rail.position.set(-W * 0.26, topY + 0.95, -D * 0.24 + D * 0.13 + 0.3);
  g.add(rail);
}

/* Boundary wall with capped pillars and lamps — the street face of the house. */
function boundary(g, { lw, ld, wallMat, trimMat, night }) {
  const h = 2.0, t = 0.24;
  const seg = (lw - 4.6) / 2;
  const add = (w, hh, d, x, y, z, m) => { const b = box(w, hh, d, m); b.position.set(x, y, z); g.add(b); };

  add(lw, h, t, 0, h / 2, -ld / 2, wallMat);
  add(t, h, ld, lw / 2, h / 2, 0, wallMat);
  add(t, h, ld, -lw / 2, h / 2, 0, wallMat);
  // capping band along the top — always present, reads as "finished"
  add(lw + 0.1, 0.12, t + 0.14, 0, h + 0.06, -ld / 2, trimMat);
  add(t + 0.14, 0.12, ld, lw / 2, h + 0.06, 0, trimMat);
  add(t + 0.14, 0.12, ld, -lw / 2, h + 0.06, 0, trimMat);

  for (const sx of [-1, 1]) {
    add(seg, h, t, sx * (2.3 + seg / 2), h / 2, ld / 2, wallMat);
    add(seg + 0.1, 0.12, t + 0.14, sx * (2.3 + seg / 2), h + 0.06, ld / 2, trimMat);
    // gate pillars, clad and lamp-topped
    add(0.62, h + 0.5, 0.62, sx * 2.3, (h + 0.5) / 2, ld / 2, trimMat);
    const lamp = box(0.3, 0.3, 0.3, glassMat(night));
    lamp.position.set(sx * 2.3, h + 0.72, ld / 2);
    g.add(lamp);
    if (night) {
      const pl = new THREE.PointLight(0xffb765, 16, 10, 2);
      pl.position.set(sx * 2.3, h + 0.72, ld / 2);
      g.add(pl);
    }
  }

  // steel gate with vertical wood-look battens
  const gate = box(4.4, 1.85, 0.1, mat(0x1b1e24, 0.45, 0.7));
  gate.position.set(0, 0.95, ld / 2);
  g.add(gate);
  const battenMat = mat(0x6b4526, 0.75, 0.05, woodCladTex());
  for (let i = 0; i < 9; i++) {
    const b = box(0.32, 1.6, 0.06, battenMat);
    b.position.set(-1.9 + i * 0.48, 0.95, ld / 2 + 0.08);
    g.add(b);
  }
}


/* ---------- fake bloom ----------
   A real bloom pass needs EffectComposer (more weight, more GPU). An additive
   radial sprite at each light source reads almost identically at this scale
   and costs nothing — this is what gives the scene its game-like glow. */
function glowTex() {
  return tex("glow", (g, s) => {
    const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, "rgba(255,225,170,1)");
    grd.addColorStop(0.28, "rgba(255,196,120,0.55)");
    grd.addColorStop(1, "rgba(255,180,90,0)");
    g.fillStyle = grd; g.fillRect(0, 0, s, s);
  }, [1, 1], 128);
}
function glow(g, x, y, z, size = 2.4, color = 0xffc98a) {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex(), color, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.85
  }));
  sp.scale.setScalar(size);
  sp.position.set(x, y, z);
  g.add(sp);
  return sp;
}

/* Gold vertical light strips — the signature accent on the showcase models. */
function goldStrip(g, x, y, z, h, night) {
  const m = new THREE.MeshStandardMaterial({
    color: 0xffe0a8, emissive: new THREE.Color(0xffc98a),
    emissiveIntensity: night ? 2.6 : 1.5, roughness: 0.3, metalness: 0.2
  });
  const strip = new THREE.Mesh(new THREE.BoxGeometry(0.09, h, 0.09), m);
  strip.position.set(x, y + h / 2, z);
  g.add(strip);
  glow(g, x, y + h / 2, z + 0.1, night ? 1.5 : 0.9);
}

/* Bollard lights down the driveway — cheap, and they make the ground read. */
function bollard(g, x, z, night) {
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.85, 8),
    mat(0x23262b, 0.5, 0.4));
  post.castShadow = true;
  post.position.set(x, 0.42, z);
  g.add(post);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0xffe0a8,
      emissive: new THREE.Color(0xffc074), emissiveIntensity: night ? 3 : 1.4 }));
  cap.position.set(x, 0.9, z);
  g.add(cap);
  glow(g, x, 0.9, z, night ? 1.5 : 0.8);
  if (night) {
    const pl = new THREE.PointLight(0xffb765, 9, 6, 2);
    pl.position.set(x, 0.95, z);
    g.add(pl);
  }
}


/* A parked car under the porch — instantly gives the scene scale and life. */
function car(g, x, z, rotY, night) {
  const grp = new THREE.Group();
  const bodyMat = mat(0x2b3a52, 0.3, 0.75);
  const body = box(1.85, 0.52, 4.3, bodyMat);
  body.position.y = 0.68;
  grp.add(body);
  const cabin = box(1.62, 0.5, 2.2, mat(0x0e1420, 0.15, 0.6));
  cabin.position.set(0, 1.16, -0.15);
  grp.add(cabin);
  const glassM = new THREE.MeshStandardMaterial({ color: 0x22364f, roughness: 0.06,
    metalness: 0.6, transparent: true, opacity: 0.65 });
  const wind = box(1.5, 0.42, 0.08, glassM);
  wind.position.set(0, 1.16, 0.95);
  grp.add(wind);
  for (const [wx, wz] of [[-0.86, 1.35], [0.86, 1.35], [-0.86, -1.35], [0.86, -1.35]]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 14),
      mat(0x121417, 0.85, 0.1));
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(wx, 0.34, wz);
    wheel.castShadow = true;
    grp.add(wheel);
  }
  // headlamps
  for (const lx of [-0.62, 0.62]) {
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.13, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xfff2d0,
        emissive: new THREE.Color(0xffe0a8), emissiveIntensity: night ? 2.4 : 0.9 }));
    lamp.position.set(lx, 0.78, 2.16);
    grp.add(lamp);
    if (night) glow(grp, lx, 0.78, 2.3, 1.1);
  }
  grp.position.set(x, 0, z);
  grp.rotation.y = rotY;
  g.add(grp);
}

/* Night sky — a shell of points. Costs one draw call. */
function starfield() {
  const n = 900, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 120 + Math.random() * 40;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(Math.random() * 0.85 + 0.1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = Math.abs(r * Math.cos(ph)) * 0.75;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({
    color: 0xcfe0ff, size: 0.9, sizeAttenuation: true,
    transparent: true, opacity: 0.9, depthWrite: false,
    fog: false          // they sit beyond the fog's far plane
  }));
}

/* Showcase podium — the dark disc with a gold ring the tour models sit on.
   It frames the design and hides the horizon, which is what makes it read as
   a presentation piece rather than a floating box. */
function podium(r) {
  const grp = new THREE.Group();
  const baseGeo = new THREE.CylinderGeometry(r, r * 1.03, 0.3, 64);
  baseGeo.translate(0, -0.15, 0);
  const base = new THREE.Mesh(baseGeo,
    new THREE.MeshStandardMaterial({ color: 0x0d1730, roughness: 0.18, metalness: 0.85 }));
  base.receiveShadow = true;
  grp.add(base);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.03, 8, 96),
    new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.35, metalness: 0.85,
      emissive: new THREE.Color(0x6a4f1e), emissiveIntensity: 0.8 }));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.005;
  grp.add(ring);
  return grp;
}

/* ============================================================
   House generation — modelled on DHA / Bahria elevations
   ============================================================ */
function buildHouse(cfg) {
  const g = new THREE.Group();
  const plot = PLOTS[cfg.plot];
  const fin = FINISHES[cfg.finish];
  const W = plot.w, D = plot.d;
  const floorH = 3.3;
  const storeys = cfg.storeys;
  const night = cfg.night;
  const style = cfg.style;

  const wallMap = cfg.finish === "brick" ? brickTex()
    : cfg.finish === "travertine" ? travertineTex()
    : plasterTex(fin.wall);
  const wallMat = mat(fin.wall, 0.88, 0.03, wallMap);
  const trimMat = mat(fin.trim, 0.8, 0.04, plasterTex(fin.trim));
  const stoneMat = mat(0xd8cbb2, 0.8, 0.03, travertineTex());
  const woodMat = mat(0x6b4526, 0.72, 0.04, woodCladTex());
  const accentMat = style === "colonial" || style === "spanish" ? stoneMat : woodMat;

  /* ---- plinth: houses here sit on a raised base above the driveway ---- */
  const plinth = box(W + 1.0, 0.5, D + 1.0, mat(0x8d8579, 0.92, 0.02, plasterTex(0x8d8579)));
  plinth.position.y = 0.25;
  g.add(plinth);

  /* ---- storeys ---- */
  for (let s = 0; s < storeys; s++) {
    const y = 0.5 + s * floorH;
    const bw = W, bd = D;

    const body = box(bw, floorH, bd, wallMat);
    body.position.set(0, y + floorH / 2, 0);
    g.add(body);

    // floor-level banding, a defining horizontal line on these elevations
    const band = box(bw + 0.16, 0.26, bd + 0.16, trimMat);
    band.position.set(0, y + floorH - 0.13, 0);
    g.add(band);

    /* Cantilevered projecting box over the porch side — extremely common on
       upper floors here, and what stops the massing reading as a plain cube. */
    if (s > 0 && style !== "colonial") {
      const proj = box(bw * 0.42, floorH * 0.82, 1.0, accentMat);
      proj.position.set(bw * 0.22, y + floorH * 0.5, bd / 2 + 0.5);
      g.add(proj);
      window3d(g, { w: bw * 0.3, h: floorH * 0.5, x: bw * 0.22,
                    y: y + floorH * 0.52, z: bd / 2 + 1.02, night });
    }

    // front windows
    const cols = Math.max(2, Math.round(bw / 3.0));
    for (let c = 0; c < cols; c++) {
      const x = -bw / 2 + bw / cols * (c + 0.5);
      if (s > 0 && style !== "colonial" && x > bw * 0.04) continue; // behind the projection
      window3d(g, { w: bw / cols * 0.62, h: style === "glass" ? floorH * 0.66 : 1.5,
                    x, y: y + floorH * 0.53, z: bd / 2 + 0.02, night });
    }
    // side windows
    for (let c = 0; c < Math.max(2, Math.round(bd / 3.4)); c++) {
      window3d(g, { w: 1.1, h: 1.4, x: -bw / 2 - 0.02,
                    y: y + floorH * 0.53,
                    z: -bd / 2 + bd / Math.max(2, Math.round(bd / 3.4)) * (c + 0.5),
                    rotY: -Math.PI / 2, night });
    }

    /* Double-height entrance feature: a tall clad panel with slim glazing
       beside the door, running through both floors. */
    if (s === 0 && storeys > 1 && style !== "colonial") {
      const feat = box(2.6, floorH * 2 - 0.3, 0.34, accentMat);
      feat.position.set(-bw * 0.22, y + floorH - 0.15, bd / 2 + 0.17);
      g.add(feat);
      for (let k = 0; k < 3; k++) {
        window3d(g, { w: 0.42, h: floorH * 0.52, x: -bw * 0.22 - 0.75 + k * 0.75,
                      y: y + floorH * 0.85 + k * 0.06, z: bd / 2 + 0.36, night });
      }
    }

    // vertical louvers — signature DHA detail
    if (style === "dha" && s === storeys - 1) {
      louvers(g, { w: bw * 0.34, h: floorH * 0.84, x: -bw * 0.02,
                   y: y + floorH * 0.52, z: bd / 2 + 0.2,
                   count: 9, material: accentMat });
    }

    // classic columns for the colonial kothi
    if (style === "colonial" && s === 0) {
      for (let i = 0; i < 4; i++) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, floorH, 16), stoneMat);
        col.castShadow = true;
        col.position.set(-bw / 2 + 1.0 + i * ((bw - 2.0) / 3), y + floorH / 2, bd / 2 + 1.1);
        g.add(col);
      }
      const canopy = box(bw * 0.92, 0.3, 2.5, stoneMat);
      canopy.position.set(0, y + floorH + 0.15, bd / 2 + 1.1);
      g.add(canopy);
    }

    // arched openings for the Spanish/Bahria villa
    if (style === "spanish" && s === 0) {
      for (let i = 0; i < 3; i++) {
        const arch = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.13, 8, 18, Math.PI), stoneMat);
        arch.position.set(-bw * 0.28 + i * 1.5, y + floorH * 0.62, bd / 2 + 0.1);
        g.add(arch);
      }
    }

    // balcony with glass railing
    if (cfg.features.balcony && s > 0) {
      const slab = box(bw * 0.44, 0.18, 1.5, trimMat);
      slab.position.set(-bw * 0.24, y + 0.09, bd / 2 + 0.75);
      g.add(slab);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.44, 0.95, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x9fc4e8, roughness: 0.08,
          metalness: 0.3, transparent: true, opacity: 0.34 }));
      rail.position.set(-bw * 0.24, y + 0.57, bd / 2 + 1.48);
      g.add(rail);
      const cap = box(bw * 0.44, 0.07, 0.09, frameMat());
      cap.position.set(-bw * 0.24, y + 1.06, bd / 2 + 1.48);
      g.add(cap);
    }
  }

  const topY = 0.5 + storeys * floorH;

  /* ---- roof ---- */
  if (cfg.roof === "hip") {
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(Math.max(W, D) * 0.80, 2.6, 4),
      mat(0x8d4530, 0.9, 0.02, tileTex()));
    roof.rotation.y = Math.PI / 4;
    roof.position.y = topY + 1.3;
    roof.castShadow = true;
    g.add(roof);
  } else {
    // parapet with a contrasting coping — never a bare slab edge here
    const par = box(W + 0.2, 1.0, D + 0.2, wallMat);
    par.position.y = topY + 0.5;
    g.add(par);
    const cope = box(W + 0.42, 0.14, D + 0.42, trimMat);
    cope.position.y = topY + 1.02;
    g.add(cope);
    const inner = box(W - 0.6, 1.05, D - 0.6, mat(0x8d8579, 0.95));
    inner.position.y = topY + 0.5;
    g.add(inner);
    roofFurniture(g, { W, D, topY, wallMat, trimMat, night });
  }

  /* ---- main door ---- */
  const door = box(1.6, 2.6, 0.16, mat(0x3a2617, 0.6, 0.1, woodCladTex()));
  door.position.set(-W * 0.22, 0.5 + 1.3, D / 2 + 0.22);
  g.add(door);

  /* ---- solar ---- */
  if (cfg.features.solar && cfg.roof === "flat") {
    for (let i = 0; i < 3; i++) {
      const p = box(W * 0.24, 0.08, D * 0.26,
        new THREE.MeshStandardMaterial({ color: 0x16203a, roughness: 0.22, metalness: 0.7 }));
      p.position.set(-W * 0.05 + i * W * 0.26, topY + 1.35, D * 0.16);
      p.rotation.x = -0.34;
      g.add(p);
    }
  }

  /* ---- grounds ---- */
  const [lw, ld] = plot.lot;
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(lw * 0.99, ld * 0.99),
    mat(cfg.features.lawn ? 0x4a8a4e : 0x9a8b76, 1, 0,
        cfg.features.lawn ? grassTex() : paverTex()));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  g.add(ground);

  // paved driveway from the gate to the porch, with a kerb
  const driveL = (ld - D) / 2 + 1.4;
  const drive = new THREE.Mesh(new THREE.PlaneGeometry(5.0, driveL),
    mat(0x9a8b76, 0.95, 0, paverTex()));
  drive.rotation.x = -Math.PI / 2;
  drive.position.set(W * 0.12, 0.02, D / 2 + driveL / 2 - 0.6);
  drive.receiveShadow = true;
  g.add(drive);

  /* ---- car porch: attached cantilever slab, not a free-standing gazebo ---- */
  if (cfg.features.porch) {
    const px = W * 0.14, pz = D / 2 + 2.3;
    const slab = box(5.4, 0.26, 4.6, trimMat);
    slab.position.set(px, 3.05, pz);
    g.add(slab);
    const fascia = box(5.6, 0.12, 0.14, accentMat);
    fascia.position.set(px, 2.9, pz + 2.3);
    g.add(fascia);
    for (const dx of [-2.3, 2.3]) {
      const post = box(0.26, 3.05, 0.26, trimMat);
      post.position.set(px + dx, 1.52, pz + 2.0);
      g.add(post);
    }
    if (night) {
      const pl = new THREE.PointLight(0xffc98a, 24, 13, 2);
      pl.position.set(px, 2.8, pz);
      g.add(pl);
    }
    car(g, px, pz + 0.55, Math.PI, night);
  }

  if (cfg.features.pool) {
    const water = box(5.4, 0.34, 3.2, new THREE.MeshStandardMaterial({
      color: 0x1d7fa0, roughness: 0.04, metalness: 0.5,
      emissive: new THREE.Color(night ? 0x0d5f7d : 0x0a3a4a),
      emissiveIntensity: night ? 1.1 : 0.28
    }));
    water.position.set(-W / 2 - 2.7, 0.18, -D / 5);
    g.add(water);
    const lip = box(6.1, 0.16, 3.9, stoneMat);
    lip.position.set(-W / 2 - 2.7, 0.07, -D / 5);
    g.add(lip);
  }

  if (cfg.features.wall) boundary(g, { lw, ld, wallMat: trimMat, trimMat: stoneMat, night });

  if (cfg.features.lawn) {
    // clipped hedging along the wall + a couple of palms, as per local landscaping
    for (const sx of [-1, 1]) {
      const hedge = box(0.7, 0.75, ld * 0.5, mat(0x2f6b34, 0.95));
      hedge.position.set(sx * (lw / 2 - 0.75), 0.38, -ld * 0.12);
      g.add(hedge);
    }
    for (const [tx, tz] of [[-lw / 2 + 1.5, ld / 2 - 2.2], [lw / 2 - 1.5, -ld / 2 + 2.4]]) {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 2.1, 8),
        mat(0x6b5638, 0.95));
      trunk.castShadow = true;
      trunk.position.set(tx, 1.05, tz);
      g.add(trunk);
      for (let f = 0; f < 7; f++) {
        const frond = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.07, 0.3),
          mat(0x2f6b34, 0.9));
        frond.geometry.translate(0.58, 0, 0);   // pivot at the crown, not the centre
        frond.castShadow = true;
        frond.position.set(tx, 2.12, tz);
        frond.rotation.y = (f / 7) * Math.PI * 2;
        frond.rotation.z = -0.45;               // droop outward and down
        g.add(frond);
      }
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), mat(0x3b5a2c, 0.95));
      crown.position.set(tx, 2.14, tz);
      g.add(crown);
    }
  }

  if (night) {
    const spill = new THREE.PointLight(0xffb765, 22, 16, 2);
    spill.position.set(-W * 0.22, 3.2, D / 2 + 1.8);
    g.add(spill);
  }

  // showcase podium + accent lighting
  g.add(podium(Math.max(lw, ld) * 0.66));

  const stripH = storeys * floorH * 0.82;
  goldStrip(g, -W / 2 - 0.06, 0.6, D / 2 + 0.06, stripH, night);
  goldStrip(g, W / 2 + 0.06, 0.6, D / 2 + 0.06, stripH, night);

  for (let i = 0; i < 4; i++) {
    const dz = D / 2 + 1.4 + i * 1.7;
    if (dz > ld / 2 - 0.8) break;
    bollard(g, W * 0.12 - 2.9, dz, night);
    bollard(g, W * 0.12 + 2.9, dz, night);
  }

  g.userData.footprint = { W, D, lw, ld };
  return g;
}


/* ============================================================
   Shareable designs — the whole config round-trips through the
   URL hash, so a couple can send each other a design before they
   ever contact anyone, and Adeel can open the exact house.
   ============================================================ */
const FEATURE_KEYS = Object.keys(FEATURES);

function encodeDesign() {
  const on = FEATURE_KEYS.filter((k) => state.features[k]).join(".");
  return [state.plot, state.storeys, state.style, state.finish, state.roof, on || "-"].join("~");
}
function applyDesign(str) {
  if (!str) return false;
  const [plot, storeys, style, finish, roof, feats] = String(str).split("~");
  if (!PLOTS[plot] || !STYLES[style] || !FINISHES[finish]) return false;
  state.plot = plot;
  state.storeys = Math.min(3, Math.max(1, parseInt(storeys, 10) || 2));
  state.style = style;
  state.finish = finish;
  state.roof = roof === "hip" ? "hip" : "flat";
  const set = new Set((feats || "").split("."));
  FEATURE_KEYS.forEach((k) => { state.features[k] = set.has(k); });
  return true;
}
function designUrl() {
  const u = new URL(location.href);
  u.hash = "design=" + encodeDesign();
  return u.toString();
}
function readDesignFromUrl() {
  const m = location.hash.match(/design=([^&]+)/);
  return m ? applyDesign(decodeURIComponent(m[1])) : false;
}
/* Keep the address bar in step without spamming history. */
function syncUrl() {
  try { history.replaceState(null, "", "#design=" + encodeDesign()); } catch (e) { /* ignore */ }
}


/* ============================================================
   INTERIOR — "step inside your design"
   A furnished ground floor generated from the same config, so what
   you walk into is the house you just specified: bigger plots get
   more rooms, the finish drives the palette.
   ============================================================ */
function furnitureMat(c, r = 0.8) { return mat(c, r, 0.04); }

function sofa(g, x, z, rotY, c) {
  const grp = new THREE.Group();
  const base = box(2.3, 0.42, 0.95, furnitureMat(c));
  base.position.y = 0.28;
  grp.add(base);
  const back = box(2.3, 0.62, 0.22, furnitureMat(c));
  back.position.set(0, 0.68, -0.37);
  grp.add(back);
  for (const ax of [-1.04, 1.04]) {
    const arm = box(0.22, 0.34, 0.95, furnitureMat(c));
    arm.position.set(ax, 0.6, 0);
    grp.add(arm);
  }
  grp.position.set(x, 0, z); grp.rotation.y = rotY;
  g.add(grp);
}
function table(g, x, z, w, d, c) {
  const top = box(w, 0.09, d, furnitureMat(c, 0.5));
  top.position.set(x, 0.74, z);
  g.add(top);
  for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const leg = box(0.09, 0.74, 0.09, furnitureMat(0x2c2118));
    leg.position.set(x + dx * (w / 2 - 0.12), 0.37, z + dz * (d / 2 - 0.12));
    g.add(leg);
  }
}
function rug(g, x, z, w, d, c) {
  const r = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(c, 0.95));
  r.rotation.x = -Math.PI / 2;
  r.position.set(x, 0.012, z);
  r.receiveShadow = true;
  g.add(r);
}
function tvWall(g, x, z, night) {
  const panel = box(2.6, 1.5, 0.12, furnitureMat(0x2a2118, 0.6));
  panel.position.set(x, 1.35, z);
  g.add(panel);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.05),
    new THREE.MeshStandardMaterial({ color: 0x0b0f18, roughness: 0.1, metalness: 0.4,
      emissive: new THREE.Color(0x2a4a7a), emissiveIntensity: night ? 1.1 : 0.5 }));
  screen.position.set(x, 1.42, z + 0.07);
  g.add(screen);
  const unit = box(2.8, 0.42, 0.45, furnitureMat(0x3a2c1f, 0.7));
  unit.position.set(x, 0.21, z + 0.2);
  g.add(unit);
}
function kitchen(g, x, z, w, night) {
  const counter = box(w, 0.9, 0.65, furnitureMat(0x2f3540, 0.55));
  counter.position.set(x, 0.45, z);
  g.add(counter);
  const top = box(w + 0.08, 0.07, 0.72, furnitureMat(0xd8cbb2, 0.35));
  top.position.set(x, 0.93, z);
  g.add(top);
  const uppers = box(w * 0.8, 0.7, 0.35, furnitureMat(0x39404d, 0.6));
  uppers.position.set(x, 1.95, z - 0.14);
  g.add(uppers);
  // under-cabinet strip, the detail that makes a kitchen read as modern
  const strip = new THREE.Mesh(new THREE.BoxGeometry(w * 0.78, 0.04, 0.06),
    new THREE.MeshStandardMaterial({ color: 0xfff0d0,
      emissive: new THREE.Color(0xffd9a0), emissiveIntensity: night ? 2.2 : 1.1 }));
  strip.position.set(x, 1.58, z + 0.02);
  g.add(strip);
}
function pendant(g, x, y, z, night) {
  const cord = box(0.03, 0.7, 0.03, furnitureMat(0x1a1a1a));
  cord.position.set(x, y + 0.35, z);
  g.add(cord);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.3, 14, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xc9a45c, roughness: 0.3, metalness: 0.7,
      side: THREE.DoubleSide }));
  shade.position.set(x, y, z);
  g.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0xfff0d0,
      emissive: new THREE.Color(0xffd9a0), emissiveIntensity: night ? 3 : 1.8 }));
  bulb.position.set(x, y - 0.12, z);
  g.add(bulb);
  glow(g, x, y - 0.12, z, night ? 1.8 : 1.1);
  const pl = new THREE.PointLight(0xffd9a0, night ? 26 : 12, 9, 2);
  pl.position.set(x, y - 0.15, z);
  g.add(pl);
}

function buildInterior(cfg) {
  const g = new THREE.Group();
  const plot = PLOTS[cfg.plot];
  const fin = FINISHES[cfg.finish];
  const W = plot.w, D = plot.d, night = cfg.night;
  const H = 3.0;
  const inset = 0.18;               // wall thickness
  const iw = W - inset * 2, id = D - inset * 2;

  // floor: polished tile, which is what almost every house here uses
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(iw, id),
    new THREE.MeshStandardMaterial({ color: 0xd7d2c8, roughness: 0.14, metalness: 0.35 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  g.add(floor);

  const ceilMat = mat(0xf2efe9, 0.95); ceilMat.side = THREE.DoubleSide;
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(iw, id), ceilMat);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = H;
  g.add(ceil);

  // shell walls (front wall omitted so the camera can see in from outside)
  const wallM = mat(0xece7dd, 0.92, 0.02, plasterTex(0xece7dd));
  const back = box(iw, H, 0.12, wallM); back.position.set(0, H / 2, -id / 2); g.add(back);
  const left = box(0.12, H, id, wallM); left.position.set(-iw / 2, H / 2, 0); g.add(left);
  const right = box(0.12, H, id, wallM); right.position.set(iw / 2, H / 2, 0); g.add(right);

  // feature wall in the finish's accent, behind the lounge
  const featM = cfg.finish === "brick" ? mat(0x8d4a34, 0.9, 0.02, brickTex())
                                       : mat(0x6b4526, 0.7, 0.05, woodCladTex());
  const feat = box(iw * 0.5, H, 0.08, featM);
  feat.position.set(-iw * 0.2, H / 2, -id / 2 + 0.08);
  g.add(feat);

  // glazing on the front opening so you see the lawn from inside
  const glassW = iw * 0.62;
  const view = new THREE.Mesh(new THREE.PlaneGeometry(glassW, H * 0.72),
    new THREE.MeshStandardMaterial({ color: 0x9fc4e8, roughness: 0.03, metalness: 0.4,
      transparent: true, opacity: 0.22,
      emissive: new THREE.Color(night ? 0x0a1428 : 0x5f86b8),
      emissiveIntensity: night ? 0.4 : 0.75 }));
  view.position.set(iw * 0.14, H * 0.44, id / 2 - 0.04);
  g.add(view);
  for (let i = 0; i < 4; i++) {
    const mull = box(0.06, H * 0.72, 0.08, frameMat());
    mull.position.set(iw * 0.14 - glassW / 2 + (glassW / 3) * i, H * 0.44, id / 2 - 0.02);
    g.add(mull);
  }

  // skirting — small detail, big realism payoff
  const skirtM = mat(0xbdb6a8, 0.7);
  const sk1 = box(iw, 0.11, 0.05, skirtM); sk1.position.set(0, 0.055, -id / 2 + 0.07); g.add(sk1);
  const sk2 = box(0.05, 0.11, id, skirtM); sk2.position.set(-iw / 2 + 0.07, 0.055, 0); g.add(sk2);
  const sk3 = box(0.05, 0.11, id, skirtM); sk3.position.set(iw / 2 - 0.07, 0.055, 0); g.add(sk3);

  /* ---- furnishing, scaled to the plot ---- */
  const lounge = -id * 0.18;
  rug(g, -iw * 0.18, lounge, iw * 0.5, id * 0.3, 0x5b4636);
  sofa(g, -iw * 0.18, lounge + id * 0.14, 0, 0x4a5364);
  if (W > 8) sofa(g, -iw * 0.42, lounge, Math.PI / 2, 0x4a5364);
  table(g, -iw * 0.18, lounge, 1.2, 0.66, 0x6b4526);
  tvWall(g, -iw * 0.2, -id / 2 + 0.2, night);
  pendant(g, -iw * 0.18, H - 0.55, lounge, night);

  // dining + kitchen along the other side once there's room
  if (W > 8) {
    table(g, iw * 0.27, -id * 0.05, 1.7, 0.95, 0x5a3f27);
    for (const [cx, cz] of [[-0.75, 0], [0.75, 0], [0, -0.72], [0, 0.72]]) {
      const chair = box(0.42, 0.5, 0.42, furnitureMat(0x3d4450));
      chair.position.set(iw * 0.27 + cx, 0.3, -id * 0.05 + cz);
      g.add(chair);
      const cb = box(0.42, 0.5, 0.08, furnitureMat(0x3d4450));
      cb.position.set(iw * 0.27 + cx, 0.72, -id * 0.05 + cz - (cz ? Math.sign(cz) * 0.17 : 0.17));
      g.add(cb);
    }
    pendant(g, iw * 0.27, H - 0.6, -id * 0.05, night);
    kitchen(g, iw * 0.26, -id / 2 + 0.42, iw * 0.4, night);
  }

  // plant in the corner
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.4, 12), furnitureMat(0x8a6a4a));
  pot.position.set(iw / 2 - 0.6, 0.2, id / 2 - 0.7);
  g.add(pot);
  for (let i = 0; i < 5; i++) {
    const leaf = box(0.6, 0.05, 0.2, furnitureMat(0x2f6b34, 0.9));
    leaf.geometry.translate(0.3, 0, 0);
    leaf.position.set(iw / 2 - 0.6, 0.62, id / 2 - 0.7);
    leaf.rotation.y = (i / 5) * Math.PI * 2;
    leaf.rotation.z = -0.5;
    g.add(leaf);
  }

  // ambient interior light so it never goes pitch black
  const amb = new THREE.PointLight(night ? 0xffcf9a : 0xdfe8ff, night ? 60 : 34, 34, 2);
  amb.position.set(0, H - 0.35, 0);
  g.add(amb);
  // second source toward the front so the room doesn't fall off into black
  const fillL = new THREE.PointLight(night ? 0xffd9a8 : 0xe8f0ff, night ? 42 : 22, 26, 2);
  fillL.position.set(0, H - 0.5, id * 0.28);
  g.add(fillL);
  // a soft ambient floor so nothing is ever unreadable
  g.add(new THREE.HemisphereLight(night ? 0x6a5a48 : 0xbcd0ff, 0x2a2620, night ? 1.1 : 1.4));

  g.userData.interior = { W: iw, D: id, H };
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


/* Smoothly fly the camera between the exterior orbit and standing inside. */
function animateCamera(toInside) {
  const from = { yaw, pitch, dist };
  const to = toInside
    ? { yaw: 0, pitch: 0.16, dist: 0 }
    : { yaw: -0.7, pitch: 0.26, dist: Math.max(PLOTS[state.plot].lot[0], PLOTS[state.plot].lot[1]) * 1.92 };
  const t0 = performance.now();
  camAnim = () => {
    const k = Math.min(1, (performance.now() - t0) / 900);
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;   // ease-in-out
    yaw = targetYaw = from.yaw + (to.yaw - from.yaw) * e;
    pitch = from.pitch + (to.pitch - from.pitch) * e;
    dist = from.dist + (to.dist - from.dist) * e;
    if (k >= 1) camAnim = null;
  };
}

function setInside(on) {
  if (!initialised || inside === on) return;
  inside = on;
  state.spin = false; syncSpinBtn();

  if (on) {
    interior = buildInterior(state);
    rig.add(interior);
    if (house) house.visible = false;
    if (stars) stars.visible = false;
    scene.fog.near = 6; scene.fog.far = 42;
  } else {
    if (interior) { rig.remove(interior); disposeTree(interior); interior = null; }
    if (house) house.visible = true;
    if (stars) stars.visible = state.night;
    scene.fog.near = 34; scene.fog.far = 88;
  }
  animateCamera(on);

  const btn = document.getElementById("builderInside");
  if (btn) {
    btn.setAttribute("aria-pressed", String(on));
    btn.textContent = on ? "⤢" : "⌂";
    btn.title = on ? "Back to the exterior" : "Step inside your design";
  }
  const hint = document.querySelector(".builder__hint");
  if (hint) hint.textContent = on ? "Drag to look around · scroll to move"
                                  : "Drag to orbit · scroll to zoom";
}

/* ============================================================
   Scene
   ============================================================ */
let renderer, scene, camera, house, sun, hemi, rig;
let composer = null, bloomPass = null, ssaoPass = null, stars = null, flickerWins = [];
let interior = null, inside = false, camAnim = null;
let running = false, initialised = false, raf = 0;
let yaw = -0.7, pitch = 0.26, dist = 34, targetYaw = -0.7;
let dragging = false, lastX = 0, lastY = 0, pinchStart = 0;

const canvas = () => document.getElementById("builderCanvas");

function skyColor(night) { return night ? 0x05070f : 0x0a0f1e; }

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
  renderer.toneMappingExposure = 1.25;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(skyColor(false));
  // Tight fog like the tour models — the house emerges from darkness rather
  // than sitting on a flat blue card. This is what sells the diorama look.
  scene.fog = new THREE.Fog(skyColor(false), 34, 88);

  camera = new THREE.PerspectiveCamera(38, 1, 0.5, 220);
  rig = new THREE.Group();
  scene.add(rig);

  // Cool blue ambient + warm key + blue rim: the three-light rig the estate
  // showcase uses, which is what gives those renders their depth.
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

  // Facade fill — without this the front elevation reads as a black slab.
  const fill = new THREE.DirectionalLight(0xbcd0ff, 0.5);
  fill.position.set(0, 9, 34);
  scene.add(fill);

  // Real bloom, loaded on demand so it never touches initial page weight.
  // Skipped on low-end/small devices where the extra pass isn't worth it.
  const wantsBloom = !matchMedia("(prefers-reduced-motion: reduce)").matches &&
                     innerWidth > 640 && (navigator.hardwareConcurrency || 4) >= 4;
  // SSAO costs real GPU time, so it's desktop-with-headroom only.
  const wantsSSAO = wantsBloom && innerWidth >= 1024 &&
                    (navigator.hardwareConcurrency || 4) >= 8;

  if (wantsBloom) {
    const mods = [
      import("./vendor/three/postprocessing/EffectComposer.js"),
      import("./vendor/three/postprocessing/RenderPass.js"),
      import("./vendor/three/postprocessing/UnrealBloomPass.js"),
      import("./vendor/three/postprocessing/OutputPass.js"),
      wantsSSAO ? import("./vendor/three/postprocessing/SSAOPass.js") : Promise.resolve(null)
    ];
    Promise.all(mods).then(([EC, RP, UB, OP, SS]) => {
      const w = canvas().clientWidth, h = canvas().clientHeight;
      composer = new EC.EffectComposer(renderer);
      composer.addPass(new RP.RenderPass(scene, camera));

      // Ambient occlusion: contact shadows in corners, under eaves and where
      // the house meets the ground. Subtle radius — large values look muddy
      // at this scale.
      if (SS) {
        ssaoPass = new SS.SSAOPass(scene, camera, w, h);
        ssaoPass.kernelRadius = 0.6;
        ssaoPass.minDistance = 0.0012;
        ssaoPass.maxDistance = 0.12;
        composer.addPass(ssaoPass);
      }

      bloomPass = new UB.UnrealBloomPass(new THREE.Vector2(w, h),
        0.55,   // strength — enough to bleed the gold strips and windows
        0.7,    // radius
        0.85    // threshold: only genuinely bright things bloom
      );
      composer.addPass(bloomPass);
      composer.addPass(new OP.OutputPass());
      resize();
    }).catch(() => { composer = null; ssaoPass = null; });   // plain render still works
  }

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
  if (composer) composer.setSize(w, h);
  if (bloomPass) bloomPass.resolution.set(w, h);
  if (ssaoPass) ssaoPass.setSize(w, h);
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
    dist = inside ? Math.max(-2.2, Math.min(3.2, dist + Math.sign(e.deltaY) * 0.4))
                  : Math.max(16, Math.min(70, dist + Math.sign(e.deltaY) * 2.2));
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

  // Collect the emissive window materials so the loop can breathe them.
  flickerWins = [];
  house.traverse((o) => {
    const m = o.material;
    if (m && m.emissiveIntensity > 0.6 && m.emissive && m.emissive.r > 0.5) {
      m.userData.base = m.emissiveIntensity;
      flickerWins.push(m);
    }
  });

  // Stars only at night.
  if (night && !stars) { stars = starfield(); scene.add(stars); }
  if (!night && stars) { scene.remove(stars); stars.geometry.dispose(); stars.material.dispose(); stars = null; }
  if (stars) stars.visible = night;

  scene.background.setHex(skyColor(night));
  scene.fog.color.setHex(skyColor(night));
  sun.intensity = night ? 0.55 : 3.1;
  sun.color.setHex(night ? 0x7e9ae0 : 0xffd9a0);
  hemi.intensity = night ? 0.55 : 1.25;

  // frame the whole lot regardless of plot size
  const lot = house.userData.footprint;
  dist = Math.max(lot.lw, lot.ld) * 1.92;

  if (inside) {
    if (interior) { rig.remove(interior); disposeTree(interior); }
    interior = buildInterior(state);
    rig.add(interior);
    house.visible = false;
  }

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
  if (camAnim) camAnim();
  if (state.spin && !dragging && !inside) targetYaw += 0.0022;
  yaw += (targetYaw - yaw) * 0.08;

  if (inside) {
    // Stand back near the glazing and look into the room; "dist" walks you
    // forward and back along the view direction.
    const eye = 1.62;
    const room = interior ? interior.userData.interior : { D: 10 };
    const walk = Math.max(-2.2, Math.min(3.2, dist));
    const baseZ = room.D * 0.34 - walk;
    camera.position.set(Math.sin(yaw) * walk * 0.6, eye, baseZ);
    camera.lookAt(camera.position.x - Math.sin(yaw) * 8,
                  eye - pitch * 2.6 + 0.05,
                  camera.position.z - Math.cos(yaw) * 8);
    if (composer) composer.render(); else renderer.render(scene, camera);
    return;
  }

  const r = dist;
  camera.position.set(Math.sin(yaw) * r * Math.cos(pitch),
                      Math.sin(pitch) * r + 3,
                      Math.cos(yaw) * r * Math.cos(pitch));
  camera.lookAt(0, 3.2, 0);

  // Warm windows breathe slightly — stops the night scene feeling static.
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
    renderControls(); rebuild(); updateSummary(); syncUrl();
  }));
  el.querySelectorAll("[data-feature]").forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.feature;
    state.features[k] = !state.features[k];
    renderControls(); rebuild(); updateSummary(); syncUrl();
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
    "Please connect me with your builders for an exact quote.\n\n" +
    "My design: " + designUrl();
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
    if (composer) composer.render(); else renderer.render(scene, camera);
    const a = document.createElement("a");
    a.download = "my-home-design.png";
    a.href = renderer.domElement.toDataURL("image/png");
    a.click();
  });

  const insideBtn = document.getElementById("builderInside");
  if (insideBtn) insideBtn.addEventListener("click", () => setInside(!inside));

  const share = document.getElementById("builderShare");
  if (share) share.addEventListener("click", () => {
    const url = designUrl();
    const done = () => {
      const old = share.textContent;
      share.textContent = "✓";
      setTimeout(() => { share.textContent = old; }, 1600);
    };
    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      navigator.share({ title: "My home design", url }).then(done, () => copy(url, done));
    } else { copy(url, done); }
  });
  function copy(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { /* ignore */ }
      ta.remove();
    }
  }

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

  readDesignFromUrl();   // a shared link wins over the defaults
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

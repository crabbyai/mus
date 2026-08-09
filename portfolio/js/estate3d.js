/* ============================================================
   ESTATE 3D — procedural Pakistani designer houses (Three.js)
   Styled after modern DHA/Bahria elevations: charcoal render,
   cream feature frames, vertical gold light strips, glass
   balcony railings, steel gate, paver driveway.
   ============================================================ */
import * as THREE from "three";
import { scaled } from "./gfx-budget.js?v=2";

const GOLD = 0xc9a45c;
const CHARCOAL = 0x3a3f4a;
const CHARCOAL_DARK = 0x272c36;
const CREAM = 0xd9d0bc;
const WOOD = 0x8a5a33;
const GATE_BLACK = 0x14171d;
const PAVER = 0xa3674a;
const PLINTH = 0x141f3a;
const GREEN_DARK = 0x12241a;
const STRIP_WARM = 0xffd98e;

/* ---------- procedural textures (no external assets) ---------- */
const texCache = {};
function canvasTex(key, draw, repeat = [2, 2], size = 256) {
  if (texCache[key]) return texCache[key];
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d"), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.colorSpace = THREE.SRGBColorSpace;
  return (texCache[key] = t);
}
const hexCss = (h) => `#${h.toString(16).padStart(6, "0")}`;
// stucco / render: base colour + fine speckle + faint trowel streaks
function stuccoTex(color) {
  return canvasTex(`stucco-${color}`, (ctx, s) => {
    ctx.fillStyle = hexCss(color);
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 5200; i++) {
      const v = Math.random();
      ctx.fillStyle = v > 0.5 ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.06)";
      ctx.fillRect(Math.random() * s, Math.random() * s, 1.4, 1.4);
    }
    ctx.strokeStyle = "rgba(0,0,0,0.04)";
    for (let i = 0; i < 26; i++) {
      ctx.beginPath();
      const y = Math.random() * s;
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(s * 0.3, y + 9, s * 0.6, y - 9, s, y + 4);
      ctx.stroke();
    }
  });
}
// running-bond brick courses with light mortar
function brickTex(color) {
  return canvasTex(`brick-${color}`, (ctx, s) => {
    ctx.fillStyle = "#cfc4ad";
    ctx.fillRect(0, 0, s, s);
    const bh = 18, bw = 52, m = 3;
    for (let row = 0; row * bh < s + bh; row++) {
      const off = row % 2 ? -bw / 2 : 0;
      for (let col = 0; col * bw + off < s + bw; col++) {
        const shade = 0.86 + Math.random() * 0.26;
        const r = ((color >> 16) & 255) * shade, g = ((color >> 8) & 255) * shade, b = (color & 255) * shade;
        ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
        ctx.fillRect(col * bw + off + m, row * bh + m, bw - m * 2, bh - m * 2);
      }
    }
  }, [2.4, 2.4]);
}
// terracotta paver grid
function paverTex(color) {
  return canvasTex(`paver-${color}`, (ctx, s) => {
    ctx.fillStyle = hexCss(color);
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 2600; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,235,200,0.05)" : "rgba(0,0,0,0.08)";
      ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
    }
    ctx.strokeStyle = "rgba(20,10,6,0.65)";
    ctx.lineWidth = 3;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(0, i * s / 4); ctx.lineTo(s, i * s / 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(i * s / 4, 0); ctx.lineTo(i * s / 4, s); ctx.stroke();
    }
  }, [3, 2]);
}
// roof tiles: horizontal courses
function tileTex(color) {
  return canvasTex(`tile-${color}`, (ctx, s) => {
    ctx.fillStyle = hexCss(color);
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 2.5;
    for (let y = 0; y < s; y += 16) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s, y); ctx.stroke();
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      for (let x = (y / 16) % 2 ? 14 : 0; x < s; x += 28) {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 16); ctx.stroke();
      }
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
    }
  }, [3, 3]);
}

/* ---------- material / geometry helpers ---------- */
const WALL_COLORS = new Set([0x3a3f4a, 0xd9d0bc, 0xe6dfcd, 0xe2dccb, 0x4d5360, 0x4d5460, 0x272c36, 0x2a2e38]);
const matCache = {};
function mat(color, rough = 0.85, metal = 0.12) {
  const key = `${color}-${rough}-${metal}`;
  if (matCache[key]) return matCache[key];
  const params = { color, roughness: rough, metalness: metal };
  if (color === 0x8e4f38) { params.map = brickTex(color); params.color = 0xffffff; }
  else if (color === 0xa3674a) { params.map = paverTex(color); params.color = 0xffffff; }
  else if (color === 0x9c4f33) { params.map = tileTex(color); params.color = 0xffffff; }
  else if (WALL_COLORS.has(color)) { params.map = stuccoTex(color); params.color = 0xffffff; }
  const m = new THREE.MeshStandardMaterial(params);
  /* Cached, so one material is shared by the scroll showcase, the lightbox
     viewer and every model the walkable tour borrows. Anything tearing a scene
     down has to leave these alone — js/house-tour.js used to dispose the whole
     world on exit, which reached in here and freed the GPU resources the other
     two were still drawing with. */
  m.userData.shared = true;
  return (matCache[key] = m);
}
const winMat = new THREE.MeshBasicMaterial({ color: STRIP_WARM });
const glassMat = new THREE.MeshStandardMaterial({
  color: 0x9fc4e8, roughness: 0.1, metalness: 0.4, transparent: true, opacity: 0.32
});
const edgeMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.4 });
// Module-level singletons, shared by every model this file makes — same rule
// as the cache in mat(): a scene teardown must not dispose them.
[winMat, glassMat, edgeMat].forEach((m) => { m.userData.shared = true; });

function edged(geo, color = CHARCOAL, rough = 0.85, metal = 0.12) {
  const m = new THREE.Mesh(geo, mat(color, rough, metal));
  m.castShadow = m.receiveShadow = true;
  m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), edgeMat));
  return m;
}
function box(w, h, d, color = CHARCOAL) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(0, h / 2, 0);
  return edged(g, color);
}
// A window used to be two flat planes stuck on the render, which is why the
// elevations read as painted-on rectangles rather than openings. It is now a
// head, a sill and two jambs standing proud of the wall with the glass set
// back inside them, so the key light throws a real reveal shadow down one side
// and the opening keeps its depth from every angle on the orbit.
function windowPane(w, h) {
  const g = new THREE.Group();
  const m = mat(0x11151c, 0.7, 0.2);
  const t = 0.07, dep = 0.1;
  const bar = (bw, bh, x, y) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, dep), m);
    b.position.set(x, y, dep / 2 - 0.02);
    b.castShadow = b.receiveShadow = true;
    g.add(b);
  };
  bar(w + t * 2, t, 0, (h + t) / 2);    // head
  bar(w + t * 2, t, 0, -(h + t) / 2);   // sill
  bar(t, h, -(w + t) / 2, 0);           // jambs
  bar(t, h, (w + t) / 2, 0);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(w + t * 2, h + t * 2), m);
  back.position.z = -0.012;
  g.add(back);
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), winMat);
  pane.position.z = 0.006;   // set back inside the frame, not painted over it
  g.add(pane);
  return g;
}
function windowGrid(parent, { cols, rows, w = 0.42, h = 0.5, gx = 0.3, gy = 0.42, x = 0, y = 1, z = 0, rotY = 0 }) {
  const g = new THREE.Group();
  const totW = cols * w + (cols - 1) * gx;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const p = windowPane(w, h);
      p.position.set(-totW / 2 + w / 2 + c * (w + gx), r * (h + gy) + h / 2, 0);
      g.add(p);
    }
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  parent.add(g);
  return g;
}
// signature vertical gold light strip (like OREAL-style elevations)
function lightStrip(x, y, z, h = 2.6) {
  const s = new THREE.Mesh(new THREE.BoxGeometry(0.07, h, 0.07), winMat);
  s.position.set(x, y + h / 2, z);
  return s;
}
// vertical wood-slat feature panel
function woodSlats(w, h, n = 7) {
  const g = new THREE.Group();
  const sw = w / (n * 1.7);
  for (let i = 0; i < n; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(sw, h, 0.06), mat(WOOD, 0.75, 0.05));
    slat.position.set(-w / 2 + sw / 2 + i * (w / n) + (w / n - sw) / 2, h / 2, 0);
    g.add(slat);
  }
  return g;
}
// glass-railing balcony with cream slab (dark=true → wrought-iron style)
function balcony(w, d = 0.85, dark = false) {
  const g = new THREE.Group();
  const slabGeo = new THREE.BoxGeometry(w, 0.12, d);
  slabGeo.translate(0, 0.06, 0);
  g.add(edged(slabGeo, dark ? CHARCOAL_DARK : CREAM));
  if (dark) {
    for (let i = 0; i <= Math.round(w / 0.22); i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.42, 0.025), mat(GATE_BLACK, 0.6, 0.4));
      bar.position.set(-w / 2 + i * 0.22, 0.12 + 0.21, d / 2 - 0.02);
      g.add(bar);
    }
  } else {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(w, 0.42, 0.04), glassMat);
    rail.position.set(0, 0.12 + 0.21, d / 2 - 0.02);
    g.add(rail);
  }
  const railTop = new THREE.Mesh(new THREE.BoxGeometry(w, 0.035, 0.05), mat(GOLD, 0.45, 0.7));
  railTop.position.set(0, 0.12 + 0.44, d / 2 - 0.02);
  g.add(railTop);
  return g;
}
function parapet(w, d, color = CREAM) {
  const g = new THREE.Group();
  const lip = (len, x, z, rot) => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(len, 0.22, 0.12), mat(color, 0.85, 0.08));
    p.position.set(x, 0.11, z);
    p.rotation.y = rot;
    g.add(p);
  };
  lip(w, 0, d / 2 - 0.06, 0); lip(w, 0, -d / 2 + 0.06, 0);
  lip(d, w / 2 - 0.06, 0, Math.PI / 2); lip(d, -w / 2 + 0.06, 0, Math.PI / 2);
  return g;
}
// boundary wall + black steel gate + pillar lamps + paver driveway
function frontage({ width = 8.4, gateX = 0.9, z = 3.2 } = {}) {
  const g = new THREE.Group();
  // Dropped in the walkable tour too — that world builds its own boundary wall
  // at the edge of the plot, and you'd otherwise meet a second gate two metres
  // from the front door.
  g.userData.tourOmit = true;
  const wallH = 0.78;
  const mkWall = (len, x) => {
    const w = box(len, wallH, 0.16, CREAM);
    w.position.set(x, 0, z);
    g.add(w);
  };
  const side = (width / 2 - gateX - 0.28);
  mkWall(side, -(gateX + 0.28 + side / 2));
  mkWall(side, gateX + 0.28 + side / 2);
  [-1, 1].forEach((s) => {
    const pillar = box(0.34, wallH + 0.34, 0.34, CHARCOAL_DARK);
    pillar.position.set(s * (gateX + 0.11), 0, z);
    g.add(pillar);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), winMat);
    bulb.position.set(s * (gateX + 0.11), wallH + 0.45, z);
    g.add(bulb);
  });
  const gate = new THREE.Group();
  const panel = box(gateX * 2 - 0.1, wallH + 0.22, 0.07, GATE_BLACK);
  gate.add(panel);
  for (let i = 0; i < 6; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.03, wallH + 0.18, 0.1), mat(GOLD, 0.5, 0.65));
    bar.position.set(-gateX + 0.32 + i * ((gateX * 2 - 0.6) / 5), (wallH + 0.18) / 2, 0);
    gate.add(bar);
  }
  gate.position.set(0, 0, z);
  g.add(gate);
  // terracotta paver driveway from gate to porch
  const driveGeo = new THREE.BoxGeometry(gateX * 2 + 0.5, 0.05, z - 1.4);
  driveGeo.translate(0, 0.025, 0);
  const drive = edged(driveGeo, PAVER, 0.95, 0.02);
  drive.position.set(0, 0.22, 1.4 + (z - 1.4) / 2 - 0.7);
  g.add(drive);
  // lawn pads either side of the driveway
  [-1, 1].forEach((s) => {
    const lawnGeo = new THREE.BoxGeometry(side - 0.3, 0.04, z - 1.6);
    lawnGeo.translate(0, 0.02, 0);
    const lawn = new THREE.Mesh(lawnGeo, mat(GREEN_DARK, 0.98, 0));
    lawn.position.set(s * (gateX + 0.5 + (side - 0.3) / 2), 0.22, 1.5 + (z - 1.6) / 2 - 0.8);
    g.add(lawn);
  });
  return g;
}
function cypress(x, z, s = 1) {
  const g = new THREE.ConeGeometry(0.26 * s, 1.6 * s, 8);
  g.translate(0, 0.8 * s, 0);
  const m = edged(g, GREEN_DARK);
  m.position.set(x, 0.22, z);
  return m;
}
function tree(x, z, s = 1) {
  const grp = new THREE.Group();
  const trunkGeo = new THREE.CylinderGeometry(0.07 * s, 0.1 * s, 0.7 * s, 6);
  trunkGeo.translate(0, 0.35 * s, 0);
  grp.add(new THREE.Mesh(trunkGeo, mat(0x2c2620)));
  [[0, 1.05, 0, 0.55], [-0.35, 0.8, 0.1, 0.38], [0.33, 0.85, -0.08, 0.4]].forEach(([dx, dy, dz, r]) => {
    const c = new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(GREEN_DARK, 0.95, 0.02));
    c.position.set(dx * s, dy * s, dz * s);
    grp.add(c);
  });
  grp.position.set(x, 0.22, z);
  return grp;
}
function planter(x, z) {
  const g = new THREE.Group();
  const potGeo = new THREE.BoxGeometry(0.5, 0.32, 0.5);
  potGeo.translate(0, 0.16, 0);
  g.add(edged(potGeo, CREAM));
  const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.24, 1), mat(GREEN_DARK, 0.95, 0));
  bush.position.y = 0.48;
  g.add(bush);
  g.position.set(x, 0.22, z);
  return g;
}
function pool(w, d, x, z) {
  const waterGeo = new THREE.BoxGeometry(w, 0.1, d);
  waterGeo.translate(0, 0.05, 0);
  const water = edged(waterGeo, 0x1d4066, 0.15, 0.85);
  water.position.set(x, 0.24, z);
  return water;
}
/* The gold trim used to be a torus sitting ON the rim of the plinth. It stood
   proud of the edge, so at the exact radius where the boundary wall meets the
   plinth it passed straight through the wall and through the tree canopies —
   which is most of what made the sequence look broken. It is now an inlay:
   a flat ring engraved a few millimetres above the plinth surface and set
   inside the edge, where nothing can intersect it. */
function plinth(r) {
  const grp = new THREE.Group();
  // A display device, not a building. js/house-tour.js drops it when it walks
  // you up to one of these models, or the house stands on a black dais in the
  // middle of the lawn.
  grp.userData.tourOmit = true;
  const baseGeo = new THREE.CylinderGeometry(r, r * 1.02, 0.22, 56);
  baseGeo.translate(0, 0.11, 0);
  const base = new THREE.Mesh(baseGeo, mat(PLINTH, 0.95, 0.05));
  base.receiveShadow = true;
  grp.add(base);
  const inlay = new THREE.Mesh(
    new THREE.RingGeometry(r * 0.958, r * 0.978, 84),
    new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.55,
      side: THREE.DoubleSide, depthWrite: false })
  );
  inlay.rotation.x = -Math.PI / 2;
  inlay.position.y = 0.2215;
  grp.add(inlay);
  return grp;
}
function hipRoof(w, d, tw, td, h, color = CHARCOAL_DARK) {
  const [x, z, tx, tz] = [w / 2, d / 2, tw / 2, td / 2];
  const v = [
    [-x, 0, -z], [x, 0, -z], [x, 0, z], [-x, 0, z],
    [-tx, h, -tz], [tx, h, -tz], [tx, h, tz], [-tx, h, tz]
  ];
  const faces = [
    [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5],
    [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7],
    [4, 5, 6], [4, 6, 7]
  ];
  const pos = [];
  faces.forEach((f) => f.forEach((i) => pos.push(...v[i])));
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1, flatShading: true }));
  m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g, 20), edgeMat));
  return m;
}

/* ---------- part registration for staggered assembly ---------- */
function part(group, obj, order, lift = 0) {
  obj.userData.order = order;
  obj.userData.lift = lift;
  obj.userData.baseY = obj.position.y;
  group.add(obj);
  return obj;
}

/* ---------- archetypes ---------- */
// The signature: modern charcoal designer house with cream entrance
// frame, gold light strips, balcony and gated frontage.
function buildDesigner({ grand = true, cream = false, withPool = false } = {}) {
  const g = new THREE.Group();
  const BODY = cream ? CREAM : CHARCOAL;
  const ACCENT = cream ? CHARCOAL : CREAM;
  part(g, plinth(grand ? 5.9 : 5.1), 0);

  // left double-storey volume
  const volA = box(grand ? 3.4 : 2.9, 3.5, 3.3, BODY);
  volA.position.set(grand ? -1.6 : -1.35, 0.22, -0.6);
  part(g, volA, 0.1, 0.7);
  windowGrid(volA, { cols: 2, rows: 2, w: 0.62, h: 0.72, gx: 0.4, gy: 0.7, y: 0.55, z: 1.66 });

  // right volume with balcony
  const volB = box(grand ? 3 : 2.5, 2.8, 3.1, BODY);
  volB.position.set(grand ? 1.75 : 1.45, 0.22, -0.5);
  part(g, volB, 0.2, 0.7);
  windowGrid(volB, { cols: 2, rows: 1, w: 0.85, h: 0.8, gx: 0.3, y: 0.5, z: 1.56 });

  // narrower + nudged right so the left end clears the entrance tower (x ≤ 0.775)
  const bal = balcony(grand ? 2.2 : 1.9);
  bal.position.set(volB.position.x + 0.3, 1.95, 1.18);
  part(g, bal, 0.36, 0.4);
  windowGrid(volB, { cols: 2, rows: 1, w: 0.7, h: 0.85, gx: 0.5, y: 1.85, z: 1.56 });

  // cream double-height entrance frame between volumes
  const tower = box(1.45, 3.9, 0.62, ACCENT);
  tower.position.set(0.05, 0.22, 1.05);
  part(g, tower, 0.3, 0.9);
  const doorPane = windowPane(0.62, 1.5);
  doorPane.position.set(0.05, 1, 1.37);
  part(g, doorPane, 0.4);
  // signature gold strips flanking the entrance + on volA
  part(g, lightStrip(-0.62, 0.35, 1.37, 3.4), 0.46);
  part(g, lightStrip(0.72, 0.35, 1.37, 3.4), 0.48);
  part(g, lightStrip(volA.position.x - (grand ? 1.55 : 1.3), 0.4, 1.06, 2.9), 0.5);

  // wood-slat feature panel on left volume
  const slats = woodSlats(1.5, 2.7, 6);
  slats.position.set(volA.position.x + 0.65, 0.55, 1.06);
  part(g, slats, 0.42, 0.4);

  // parapets
  const parA = parapet(grand ? 3.5 : 3, 3.4, ACCENT);
  parA.position.set(volA.position.x, 3.72, -0.6);
  part(g, parA, 0.54, 0.5);
  const parB = parapet(grand ? 3.1 : 2.6, 3.2, ACCENT);
  parB.position.set(volB.position.x, 3.02, -0.5);
  part(g, parB, 0.58, 0.5);

  // gated frontage with driveway + lawns
  const front = frontage({ width: grand ? 9.4 : 7.6, z: 3.3 });
  front.position.y = 0.22;
  part(g, front, 0.66, 0.3);

  part(g, planter(-1.15, 1.75), 0.74);
  part(g, planter(1.3, 1.75), 0.76);
  // pool sits fully beside the house — volB ends at x 3.25 (grand) / 2.7
  // Pulled in: its far corner used to reach past the edge of the plinth and
  // hang in mid-air once the camera came round to that side.
  if (withPool) part(g, pool(2, 1, grand ? 4.2 : 3.6, 1), 0.8);
  part(g, tree(grand ? -4.3 : -3.8, 1.4, 0.95), 0.84);
  part(g, cypress(grand ? 4.6 : 4, -0.6, 1), 0.88);
  return g;
}
function buildPalazzo() {
  const g = new THREE.Group();
  part(g, plinth(5.6), 0);
  const main = box(5.6, 3, 3.8, CREAM);
  main.position.y = 0.22;
  part(g, main, 0.12, 0.7);
  windowGrid(main, { cols: 2, rows: 2, w: 0.5, h: 0.62, gx: 2.6, gy: 0.6, y: 0.6, z: 1.91 });
  const doorArch = windowPane(0.7, 1.3);
  doorArch.position.set(0, 0.88, 1.92);
  part(g, doorArch, 0.3);
  for (let i = 0; i < 4; i++) {
    // columns must reach the pediment underside (y 3.24), not float below it
    const colGeo = new THREE.CylinderGeometry(0.14, 0.16, 3.0, 12);
    colGeo.translate(0, 1.5, 0);
    const col = edged(colGeo, CREAM);
    col.position.set(-1.8 + i * 1.2, 0.24, 2.2);
    part(g, col, 0.34 + i * 0.05, 0.4);
  }
  /* The pediment used to be a triangular prism extruded through the whole
     4.4m depth of the house, so it came out as a black tent twice the width
     of the walls it sat on — the single ugliest thing in the sequence. A
     palazzo has a low hipped roof over the body and a shallow pediment over
     the portico only; that is what this is now. */
  const roof = hipRoof(6.1, 4.3, 2.6, 1.6, 0.75);
  roof.position.y = 3.22;
  part(g, roof, 0.56, 0.7);
  const entab = box(4.9, 0.3, 0.8, CREAM);
  entab.position.set(0, 2.94, 2.2);
  part(g, entab, 0.54, 0.4);
  // Cream against the charcoal roof, and standing a head above the ridge —
  // dark-on-dark at the same height just merged into the roofline.
  const shape = new THREE.Shape();
  shape.moveTo(-2.45, 0); shape.lineTo(2.45, 0); shape.lineTo(0, 1.05); shape.closePath();
  const pedGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: false });
  pedGeo.translate(0, 0, -0.25);
  const pediment = edged(pedGeo, CREAM);
  pediment.position.set(0, 3.24, 2.3);
  part(g, pediment, 0.58, 0.7);
  const front = frontage({ width: 8.4, z: 3.4 });
  front.position.y = 0.22;
  part(g, front, 0.68, 0.3);
  part(g, cypress(-3.7, 1.4, 1.1), 0.78);
  part(g, cypress(3.7, 1.4, 1.1), 0.82);
  return g;
}
function buildColonial({ atrium = false } = {}) {
  const g = new THREE.Group();
  part(g, plinth(6), 0);
  const main = box(6, 2.7, 4, CREAM);
  main.position.y = 0.22;
  part(g, main, 0.12, 0.7);
  for (let i = 0; i < 3; i++) {
    const arch = windowPane(0.95, 1.35);
    arch.position.set(-1.9 + i * 1.9, 0.95, 2.21);
    part(g, arch, 0.28 + i * 0.04);
  }
  // veranda colonnade
  for (let i = 0; i < 4; i++) {
    // veranda columns rise to the roof base (y 2.92) so they actually support it
    const cGeo = new THREE.CylinderGeometry(0.09, 0.1, 2.7, 10);
    cGeo.translate(0, 1.35, 0);
    const c = edged(cGeo, CREAM);
    c.position.set(-2.85 + i * 1.9, 0.22, 2.2);
    part(g, c, 0.34 + i * 0.04, 0.3);
  }
  windowGrid(main, { cols: 3, rows: 1, w: 0.6, h: 0.5, gx: 1.3, y: 1.95, z: 2.01 });
  const roof = hipRoof(6.9, 4.8, 2.6, 1.4, 1.3);
  roof.position.y = 2.92;
  part(g, roof, 0.52, 0.7);
  if (atrium) {
    const glass = box(2, 1.9, 2, 0x21385c);
    glass.position.set(4.1, 0.22, 0.4);
    part(g, glass, 0.62, 0.5);
    windowGrid(glass, { cols: 3, rows: 2, w: 0.44, h: 0.55, gx: 0.14, gy: 0.2, y: 0.25, z: 1.01 });
  } else {
    part(g, tree(4.4, 1.2, 1.15), 0.64);
  }
  part(g, tree(-4.3, 1, 1.3), 0.72);
  const front = frontage({ width: 9, z: 3.6 });
  front.position.y = 0.22;
  part(g, front, 0.8, 0.3);
  return g;
}
function buildFarmhouse({ linear = false } = {}) {
  const g = new THREE.Group();
  part(g, plinth(6.4), 0);
  const main = box(linear ? 7.2 : 6.6, linear ? 1.9 : 2.2, 3.4, linear ? CHARCOAL : CREAM);
  main.position.y = 0.22;
  part(g, main, 0.12, 0.6);
  windowGrid(main, { cols: linear ? 5 : 4, rows: 1, w: 0.85, h: 1.05, gx: 0.35, y: 0.55, z: 1.71 });
  const slabGeo = new THREE.BoxGeometry(linear ? 7.9 : 7.3, 0.16, 4);
  slabGeo.translate(0, 0.08, 0);
  const slab = edged(slabGeo, CHARCOAL_DARK);
  slab.position.y = 0.22 + (linear ? 1.9 : 2.2);
  part(g, slab, 0.36, 0.5);
  const slats = woodSlats(2.2, linear ? 1.8 : 2.1, 8);
  slats.position.set(linear ? -2.4 : -2.1, 0.28, 1.73);
  part(g, slats, 0.42, 0.3);
  for (let i = 0; i < 4; i++) {
    const postGeo = new THREE.CylinderGeometry(0.05, 0.05, linear ? 1.9 : 2.2, 8);
    postGeo.translate(0, (linear ? 1.9 : 2.2) / 2, 0);
    const post = new THREE.Mesh(postGeo, mat(WOOD, 0.7, 0.1));
    post.position.set(-0.6 + i * 1.5, 0.22, 2.1);
    part(g, post, 0.46 + i * 0.04, 0.3);
  }
  part(g, tree(-4.8, 1.6, 1.1), 0.6);
  part(g, tree(4.9, 1.8, 0.95), 0.66);
  part(g, tree(5.6, 0.6, 0.75), 0.7);
  if (linear) part(g, pool(2.2, 1.2, 2.6, 2.9), 0.78); // clear of the veranda posts
  part(g, planter(-3.4, 2.6), 0.84);
  return g;
}

// Spanish villa — white render, twin terracotta hip roofs, wrought balcony
function buildSpanish() {
  const g = new THREE.Group();
  const WHITE = 0xe6dfcd, TERRA = 0x9c4f33;
  part(g, plinth(5.4), 0);
  const main = box(4.6, 2.5, 3.5, WHITE);
  main.position.set(-0.7, 0.22, 0);
  part(g, main, 0.1, 0.7);
  windowGrid(main, { cols: 3, rows: 1, w: 0.55, h: 0.95, gx: 0.55, y: 0.6, z: 1.76 });
  const roofMain = hipRoof(5.2, 4.1, 2.4, 1.5, 1.1, TERRA);
  roofMain.position.set(-0.7, 2.72, 0);
  part(g, roofMain, 0.42, 0.6);
  const tower = box(2, 3.5, 2.2, WHITE);
  tower.position.set(2.1, 0.22, 0.3);
  part(g, tower, 0.22, 0.8);
  windowGrid(tower, { cols: 1, rows: 1, w: 0.7, h: 1, y: 2.1, z: 1.11 });
  const roofTower = hipRoof(2.5, 2.7, 1, 1, 0.85, TERRA);
  roofTower.position.set(2.1, 3.72, 0.3);
  part(g, roofTower, 0.52, 0.6);
  const bal = balcony(1.7, 0.8, true);
  bal.position.set(2.1, 1.95, 1.5);
  part(g, bal, 0.36, 0.4);
  const doorPane = windowPane(0.6, 1.4);
  doorPane.position.set(-0.7, 0.95, 1.77);
  part(g, doorPane, 0.3);
  part(g, lightStrip(-2.6, 0.35, 1.77, 2.1), 0.46);
  const front = frontage({ width: 8.6, z: 3.2 });
  front.position.y = 0.22;
  part(g, front, 0.62, 0.3);
  part(g, planter(-1.7, 2), 0.7);
  part(g, planter(0.3, 2), 0.72);
  part(g, tree(-4, 1.2, 1.05), 0.78);
  part(g, cypress(4.2, 0.4, 0.95), 0.84);
  return g;
}
// grey graphite-texture elevation with wide glazing + wood slats
function buildGreyTexture() {
  const g = new THREE.Group();
  const GREY = 0x4d5360, GRAPHITE = 0x2a2e38;
  part(g, plinth(5.3), 0);
  const main = box(4.9, 3.4, 3.4, GREY);
  main.position.set(-0.4, 0.22, -0.2);
  part(g, main, 0.1, 0.7);
  const band = box(1.25, 3.6, 0.18, GRAPHITE);
  band.position.set(-2, 0.22, 1.55);
  part(g, band, 0.24, 0.6);
  part(g, lightStrip(-1.32, 0.3, 1.68, 3.2), 0.3);
  windowGrid(main, { cols: 2, rows: 1, w: 1, h: 0.95, gx: 0.35, y: 0.55, z: 1.71, x: 0.5 });
  windowGrid(main, { cols: 2, rows: 1, w: 0.8, h: 0.8, gx: 0.55, y: 2.2, z: 1.71, x: 0.5 });
  const bal = balcony(2.5, 0.85);
  bal.position.set(0.55, 1.95, 1.95);
  part(g, bal, 0.4, 0.4);
  const slats = woodSlats(1.4, 2.9, 6);
  slats.position.set(1.95, 0.42, 1.56); // proud of the facade (was buried at 1.42)
  part(g, slats, 0.46, 0.4);
  const par = parapet(4.9, 3.4, GRAPHITE);
  par.position.set(-0.4, 3.62, -0.2);
  part(g, par, 0.54, 0.5);
  const front = frontage({ width: 8.2, z: 3.3 });
  front.position.y = 0.22;
  part(g, front, 0.64, 0.3);
  part(g, planter(1.5, 2.2), 0.74);
  part(g, cypress(-4.1, 1, 1.05), 0.8);
  part(g, tree(4.3, 0.8, 0.95), 0.86);
  return g;
}
// narrow 5-marla with stacked balconies (classic Bahria street house)
function buildCube5Marla() {
  const g = new THREE.Group();
  const WHITE = 0xe2dccb;
  part(g, plinth(4.4), 0);
  const main = box(2.9, 4.1, 3.3, WHITE);
  main.position.set(-0.4, 0.22, 0);
  part(g, main, 0.1, 0.9);
  const accent = box(0.85, 4.3, 0.2, CHARCOAL_DARK);
  accent.position.set(1.35, 0.22, 1.6);
  part(g, accent, 0.24, 0.7);
  part(g, lightStrip(1.82, 0.3, 1.7, 3.9), 0.3); // hugs the entrance fin edge
  windowGrid(main, { cols: 2, rows: 1, w: 0.62, h: 0.85, gx: 0.4, y: 0.55, z: 1.66 });
  [1.62, 2.96].forEach((y, i) => {
    const bal = balcony(2.3, 0.75);
    bal.position.set(-0.4, y, 1.95);
    part(g, bal, 0.36 + i * 0.1, 0.4);
    windowGrid(main, { cols: 2, rows: 1, w: 0.55, h: 0.7, gx: 0.5, y: y - 0.12, z: 1.66 });
  });
  const par = parapet(2.9, 3.3, CHARCOAL_DARK);
  par.position.set(-0.4, 4.32, 0);
  part(g, par, 0.56, 0.5);
  const front = frontage({ width: 6.2, gateX: 0.8, z: 3.1 });
  front.position.y = 0.22;
  part(g, front, 0.64, 0.3);
  part(g, planter(-1.75, 2), 0.74);
  part(g, cypress(3.4, 0.6, 0.85), 0.8);
  return g;
}
// corner plot with wraparound glass balcony on two faces
function buildCornerGlass() {
  const g = new THREE.Group();
  part(g, plinth(5.5), 0);
  const volA = box(4.4, 3.3, 3.2, CHARCOAL);
  volA.position.set(-0.6, 0.22, -0.3);
  part(g, volA, 0.1, 0.7);
  const volB = box(2.4, 2.7, 2.6, CREAM);
  volB.position.set(2.1, 0.22, 0.6);
  part(g, volB, 0.2, 0.7);
  windowGrid(volA, { cols: 3, rows: 1, w: 0.72, h: 0.95, gx: 0.34, y: 0.5, z: 1.61 });
  windowGrid(volA, { cols: 3, rows: 1, w: 0.62, h: 0.8, gx: 0.45, y: 2.1, z: 1.61 });
  windowGrid(volB, { cols: 2, rows: 2, w: 0.5, h: 0.6, gx: 0.3, gy: 0.5, y: 0.4, z: 1.31 });
  // narrowed + shifted west so its end clears volB (which starts at x 0.9)
  const balFront = balcony(3.0, 0.8);
  balFront.position.set(-0.9, 1.92, 1.7);
  part(g, balFront, 0.36, 0.4);
  const balSide = balcony(2.6, 0.8);
  balSide.position.set(-3.2, 1.92, 0);
  balSide.rotation.y = Math.PI / 2;
  part(g, balSide, 0.42, 0.4);
  part(g, lightStrip(1.1, 0.3, 1.95, 2.5), 0.3); // on volB's face, was buried inside it
  const par = parapet(4.4, 3.2, CREAM);
  par.position.set(-0.6, 3.52, -0.3);
  part(g, par, 0.52, 0.5);
  const front = frontage({ width: 8.6, z: 3.2 });
  front.position.y = 0.22;
  part(g, front, 0.62, 0.3);
  part(g, planter(0.9, 2.1), 0.72);
  part(g, tree(4.4, 1.6, 1), 0.78);
  part(g, cypress(-4.4, 1.2, 1), 0.84);
  return g;
}
// face-brick modern with cream banding
function buildBrick() {
  const g = new THREE.Group();
  const BRICK = 0x8e4f38;
  part(g, plinth(5), 0);
  const main = box(4.5, 3.1, 3.4, BRICK);
  main.position.set(-0.3, 0.22, 0);
  part(g, main, 0.1, 0.7);
  [1.35, 2.55].forEach((y, i) => {
    const bandGeo = new THREE.BoxGeometry(4.7, 0.14, 3.6);
    bandGeo.translate(0, 0.07, 0);
    const band = edged(bandGeo, CREAM);
    band.position.set(-0.3, y, 0);
    part(g, band, 0.26 + i * 0.08, 0.4);
  });
  windowGrid(main, { cols: 3, rows: 1, w: 0.6, h: 0.85, gx: 0.5, y: 0.45, z: 1.71 });
  windowGrid(main, { cols: 3, rows: 1, w: 0.55, h: 0.75, gx: 0.55, y: 1.75, z: 1.71 });
  const doorPane = windowPane(0.6, 1.1);
  doorPane.position.set(1.6, 0.77, 1.72);
  part(g, doorPane, 0.34);
  part(g, lightStrip(-2.55, 0.3, 1.72, 2.7), 0.4);
  const par = parapet(4.5, 3.4, CREAM);
  par.position.set(-0.3, 3.32, 0);
  part(g, par, 0.5, 0.5);
  const front = frontage({ width: 7.8, z: 3.1 });
  front.position.y = 0.22;
  part(g, front, 0.6, 0.3);
  part(g, planter(1.6, 2.1), 0.7);
  part(g, tree(-3.9, 1.3, 1), 0.78);
  return g;
}

const ARCHETYPES = {
  manor: () => buildDesigner({ grand: true, withPool: true }),
  modern: () => buildDesigner({ grand: false }),
  modernWhite: () => buildDesigner({ grand: false, cream: true }),
  palazzo: () => buildPalazzo(),
  colonial: () => buildColonial(),
  colonialAtrium: () => buildColonial({ atrium: true }),
  farmhouse: () => buildFarmhouse(),
  linear: () => buildFarmhouse({ linear: true }),
  spanish: () => buildSpanish(),
  greyTexture: () => buildGreyTexture(),
  cube5: () => buildCube5Marla(),
  corner: () => buildCornerGlass(),
  brick: () => buildBrick()
};

// property index (matches PROPERTIES in main.js) -> archetype
// every sold home gets a distinct model
const PROPERTY_MODELS = [
  "manor", "modern", "greyTexture", "cube5", "farmhouse", "corner",
  "palazzo", "colonialAtrium", "modernWhite", "colonial", "linear", "brick"
];

/* ---------- image-based lighting ----------
   Three lights and an ambient tell a surface how bright it is, but they can't
   tell it what it is looking at — so the gold trim, the glass balcony rail and
   the brass gate bars came out as flat coloured plastic, because a metal with
   nothing to reflect has nothing to be. This builds a small environment for
   them to reflect: dusk sky above, a warm band at the horizon on the key
   light's side, dark ground below. Cheap — one 256x128 canvas, prefiltered
   once — and it is the difference between "gold-coloured" and "gold".

   Keyed by renderer: a prefiltered map lives in one WebGL context, so the
   showcase and the lightbox viewer each get their own. */
const envMaps = new WeakMap();
function skyEnv(renderer) {
  if (envMaps.has(renderer)) return envMaps.get(renderer);
  const c = document.createElement("canvas");
  c.width = 256; c.height = 128;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0.00, "#141d38");   // zenith
  g.addColorStop(0.40, "#4c5878");
  g.addColorStop(0.50, "#c9b189");   // horizon
  g.addColorStop(0.60, "#38383f");
  g.addColorStop(1.00, "#101218");   // ground
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 128);
  // the sun, roughly where the key light is, so highlights agree with shadows
  const sun = ctx.createRadialGradient(196, 50, 1, 196, 50, 42);
  sun.addColorStop(0, "rgba(255,228,182,0.95)");
  sun.addColorStop(1, "rgba(255,228,182,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(150, 6, 96, 92);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  let map = null;
  try {
    const pmrem = new THREE.PMREMGenerator(renderer);
    map = pmrem.fromEquirectangular(tex).texture;
    pmrem.dispose();
  } catch (err) { map = null; }
  tex.dispose();
  envMaps.set(renderer, map);
  return map;
}

/* ---------- scene factory ---------- */
function makeScene() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0f1e, 17, 36);
  /* Lower than it looks: scene.environment now supplies most of the fill, and
     leaving the flat ambient where it was turned the charcoal render grey. */
  const amb = new THREE.AmbientLight(0x8a8ea6, 1.15);
  scene.add(amb);
  const key = new THREE.DirectionalLight(0xffd9a0, 2.9);
  key.position.set(6, 9, 5);
  key.castShadow = true;
  // Sized to the device, not fixed — see js/gfx-budget.js. The showcase shares
  // the page with other work, so it asks for a share rather than the lot.
  const sres = scaled(0.5).shadow || 1024;
  key.shadow.mapSize.set(sres, sres);
  key.shadow.camera.left = key.shadow.camera.bottom = -11;
  key.shadow.camera.right = key.shadow.camera.top = 11;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 32;
  key.shadow.bias = -0.0008;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5573c8, 1.15);
  rim.position.set(-7, 5, -6);
  scene.add(rim);
  // A low bounce off the plinth. Without it the ground-floor elevation and the
  // underside of every roof and balcony fell to pure black at dusk, which is
  // what made the models read as flat cut-outs rather than buildings.
  const bounce = new THREE.DirectionalLight(0x8899bb, 0.55);
  bounce.position.set(1, -4, 6);
  scene.add(bounce);
  // Kept so the showcase can be switched between dusk and daylight, the way
  // the city model and the design studio both can. The gold light strips and
  // window glow are modelled as emissive, so they simply stop reading as lit
  // once there's a real sun on the elevation — which is the point.
  scene.userData.rig = { amb: amb, key: key, rim: rim, bounce: bounce };
  return scene;
}

/* Dusk is the default because it flatters the elevations, but a buyer wants to
   know what a house looks like at two in the afternoon. */
const ESTATE_LOOKS = {
  dusk: { fog: 0x0a0f1e, near: 17, far: 36,
          amb: [0x8a8ea6, 1.15], key: [0xffd9a0, 3.0], rim: [0x5573c8, 0.85],
          bounce: [0x8899bb, 0.55], exposure: 1.25, bloom: [0.52, 0.72, 0.82] },
  day:  { fog: 0xa8c2dc, near: 22, far: 52,
          amb: [0xcfe0f2, 1.85], key: [0xfff4dc, 3.6], rim: [0x9fc0e8, 0.6],
          // Daylight washes glow out; a sun this bright doesn't need help.
          bounce: [0xc7d6e8, 0.5], exposure: 1.0, bloom: [0.16, 0.6, 0.95] }
};
function setEstateLook(scene, renderer, name, bloom) {
  const L = ESTATE_LOOKS[name] || ESTATE_LOOKS.dusk;
  const r = scene.userData.rig;
  if (!r) return;
  scene.fog.color.setHex(L.fog);
  scene.fog.near = L.near;
  scene.fog.far = L.far;
  r.amb.color.setHex(L.amb[0]); r.amb.intensity = L.amb[1];
  r.key.color.setHex(L.key[0]); r.key.intensity = L.key[1];
  r.rim.color.setHex(L.rim[0]); r.rim.intensity = L.rim[1];
  if (r.bounce && L.bounce) { r.bounce.color.setHex(L.bounce[0]); r.bounce.intensity = L.bounce[1]; }
  if (renderer) renderer.toneMappingExposure = L.exposure;
  if (bloom && L.bloom) {
    bloom.strength = L.bloom[0]; bloom.radius = L.bloom[1]; bloom.threshold = L.bloom[2];
  }
}
function cinematic(renderer) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
}

/* Bloom, on the section that most needs it.
   Everything signature about these elevations is emissive — the gold light
   strips down the entrance, the warm windows, the gate's brass bars, the
   inlay round the plinth. Without a bloom pass they are flat cream rectangles
   that happen to be bright; with one they read as lit, which at dusk is the
   whole picture. The city model and the walkable tour have had this since
   they were built; the showcase, which is the one section of the site that
   exists purely to be looked at, never did.

   Loaded on demand and only where there's headroom, so a slow device gets the
   plain render rather than a slideshow. */
function addBloom(renderer, scene, camera, gfx, onReady) {
  if (!gfx.bloom) return;
  Promise.all([
    import("./vendor/three/postprocessing/EffectComposer.js"),
    import("./vendor/three/postprocessing/RenderPass.js"),
    import("./vendor/three/postprocessing/UnrealBloomPass.js"),
    import("./vendor/three/postprocessing/OutputPass.js"),
    gfx.ao ? import("./vendor/three/postprocessing/SSAOPass.js") : Promise.resolve(null)
  ]).then(([EC, RP, UB, OP, SS]) => {
    const composer = new EC.EffectComposer(renderer);
    composer.addPass(new RP.RenderPass(scene, camera));
    let ssao = null;
    if (SS) {
      // Tight radius: this is a model on a plinth, not a street. It puts the
      // shade back under the eaves, the balcony and the parapet.
      ssao = new SS.SSAOPass(scene, camera, 1, 1);
      ssao.kernelRadius = 0.5;
      ssao.minDistance = 0.0012;
      ssao.maxDistance = 0.1;
      composer.addPass(ssao);
    }
    const bloom = new UB.UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.72, 0.86);
    composer.addPass(bloom);
    composer.addPass(new OP.OutputPass());
    onReady({ composer, bloom, ssao });
  }).catch(() => { /* plain render, which is still the real model */ });
}
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/* ---------- framing ----------
   The showcase used to sit the camera at a fixed radius of 14.5 for every
   house. The three of them are not the same size — the Palazzo's pediment is
   a metre taller than the Manor's parapet and the Colonial's plinth is wider
   than either — so at that one distance the tall one had its roof cut off by
   the section title while the small one floated in the middle of the frame.

   Instead: measure each house once, then solve for the distance that keeps
   every corner of it inside the part of the viewport that isn't covered by
   the title, the caption or the buttons. Solving beats a formula here because
   the safe area is asymmetric (more chrome at the bottom than the top) and
   changes with the viewport, and because a perspective camera's silhouette
   isn't a simple function of the bounding box once you orbit it. */
/* A bounding box is the wrong shape to frame these with. Every house stands on
   a round plinth, so its box is square and its diagonal is 40% longer than the
   thing actually is — fit to the box corners and the camera backs off far
   enough to keep two empty corners on screen, leaving the house small in the
   middle. Measure the real silhouette instead: the largest distance any vertex
   reaches from the centre line, and the true top and bottom. That gives a
   cylinder, which is what the composition is, and it is the same width from
   every angle, so the framing holds all the way round the orbit. */
function measure(house) {
  applyAssembly(house, 1);
  house.rotation.set(0, 0, 0);
  house.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(house.matrixWorld).invert();
  const local = new THREE.Matrix4();
  const v = new THREE.Vector3();
  let radius = 0.01, lo = Infinity, hi = -Infinity;
  house.traverse((o) => {
    if (o.isLineSegments || !o.geometry || !o.geometry.attributes.position) return;
    const pos = o.geometry.attributes.position;
    local.multiplyMatrices(inv, o.matrixWorld);
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(local);
      const d = Math.hypot(v.x, v.z);
      if (d > radius) radius = d;
      if (v.y < lo) lo = v.y;
      if (v.y > hi) hi = v.y;
    }
  });
  // A ring top and bottom is enough to pin the silhouette from any azimuth.
  const probes = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    probes.push(new THREE.Vector3(Math.cos(a) * radius, lo, Math.sin(a) * radius));
    probes.push(new THREE.Vector3(Math.cos(a) * radius, hi, Math.sin(a) * radius));
  }
  return { probes, radius, centre: new THREE.Vector3(0, (lo + hi) / 2, 0) };
}
const _p = new THREE.Vector3();
// Place the camera on the orbit at distance d and look at the centre.
function orbit(camera, fit, az, el, d) {
  camera.position.set(
    Math.sin(az) * Math.cos(el) * d,
    fit.centre.y + Math.sin(el) * d,
    Math.cos(az) * Math.cos(el) * d);
  camera.lookAt(fit.centre);
  camera.updateMatrixWorld(true);
  camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
}
// Smallest distance at which every corner lands inside the safe area, in NDC.
function fitDistance(camera, fit, az, el, safe) {
  let lo = fit.radius * 1.05, hi = fit.radius * 9;
  for (let i = 0; i < 15; i++) {
    const d = (lo + hi) / 2;
    orbit(camera, fit, az, el, d);
    let fits = true;
    for (let c = 0; c < fit.probes.length; c++) {
      _p.copy(fit.probes[c]).project(camera);
      if (Math.abs(_p.x) > safe.x || _p.y > safe.top || _p.y < -safe.bottom) { fits = false; break; }
    }
    if (fits) hi = d; else lo = d;
  }
  return hi;
}
function applyAssembly(house, p) {
  house.traverse((o) => {
    if (o.userData.order === undefined) return;
    const k = Math.min(Math.max((p * 1.45 - o.userData.order * 0.62) / 0.32, 0), 1);
    const e = easeOutCubic(k);
    const s = Math.max(e, 0.0001);
    o.scale.setScalar(s);
    o.position.y = o.userData.baseY + (1 - e) * (o.userData.lift || 0);
    o.visible = k > 0.001;
  });
}

/* ============================================================
   SCROLL SHOWCASE
   ============================================================ */
function initShowcase() {
  const section = document.getElementById("showcase3d");
  const canvas = document.getElementById("estateCanvas");
  if (!section || !canvas || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    if (section) section.style.display = "none";
    return;
  }
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    section.style.display = "none";
    return;
  }
  const gfx = scaled(0.5);
  renderer.setPixelRatio(gfx.dpr);
  cinematic(renderer);

  const scene = makeScene();
  scene.environment = skyEnv(renderer);
  // far was 60 with the camera pinned at 14.5. Now the camera backs off as far
  // as the framing needs, so give it room rather than clipping the plinth.
  const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 400);
  let composer = null, bloom = null, ssao = null;
  addBloom(renderer, scene, camera, gfx, (fx) => {
    composer = fx.composer; bloom = fx.bloom; ssao = fx.ssao;
    size();
  });
  const rig = new THREE.Group();
  scene.add(rig);

  const SHOWCASE_TYPES = ["manor", "palazzo", "colonial"];
  const houses = SHOWCASE_TYPES.map((t) => {
    const h = ARCHETYPES[t]();
    rig.add(h);
    h.userData.fit = measure(h);
    h.visible = false;
    return h;
  });

  const captions = Array.from(section.querySelectorAll(".showcase3d__caption"));
  const counter = section.querySelector(".showcase3d__counter");

  // Dusk / daylight, matching the switch on the city model and the studio.
  const lookBtn = document.getElementById("showcaseLook");
  if (lookBtn) {
    let day = false;
    lookBtn.addEventListener("click", () => {
      day = !day;
      setEstateLook(scene, renderer, day ? "day" : "dusk", bloom);
      lookBtn.textContent = day ? "☾" : "☀";
      lookBtn.setAttribute("aria-pressed", String(day));
      lookBtn.title = day ? "Switch to dusk" : "Switch to daylight";
    });
  }

  // Three homes at tens of crore each, and nothing to press. Each caption now
  // opens WhatsApp naming the house on screen, so the message arrives with
  // the context already in it rather than "hi, saw your site".
  /* "Walk around them in 3D" stopped at the front gate. The walkable interior
     already exists for all twelve sold homes — js/house-tour.js — so the
     caption now opens it for the house on screen. window.HouseTour lives in
     main.js, which is a plain script, hence the global rather than an import. */
  section.querySelectorAll("[data-showcase-walk]").forEach((b) => {
    b.addEventListener("click", () => {
      const i = parseInt(b.getAttribute("data-showcase-walk"), 10);
      const name = b.closest(".showcase3d__caption");
      const title = name && name.querySelector("strong") ? name.querySelector("strong").textContent : "";
      if (window.HouseTour) window.HouseTour.openProperty(i, title);
    });
  });

  section.querySelectorAll("[data-showcase-cta]").forEach((b) => {
    b.addEventListener("click", () => {
      const [title, where] = (b.getAttribute("data-showcase-cta") || "").split("|");
      const msg = "Hello Adeel — I've just been looking at " + title + " in " + where +
        " on your site.\n\nI'd like something like it. What have you got at the moment, " +
        "and what would one cost to build from scratch?";
      if (window.LeadRelay) window.LeadRelay.send(msg);
      else window.open("https://wa.me/16134083945?text=" + encodeURIComponent(msg),
        "_blank", "noopener");
    });
  });

  // How much of the frame the overlay chrome owns, in NDC. The title sits at
  // the top, the caption and the counter along the bottom, and on a phone the
  // caption is taller and the fixed contact dock eats another 78px — so the
  // model is fitted into what's left rather than drawn over the lot.
  const safe = { x: 0.92, top: 0.5, bottom: 0.6 };
  function size() {
    const w = section.clientWidth, h = section.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (composer) composer.setSize(w, h);
    if (bloom) bloom.resolution.set(w, h);
    if (ssao) ssao.setSize(w, h);
    const phone = w < 700;
    safe.x = phone ? 0.96 : 0.94;
    safe.top = phone ? 0.52 : 0.5;
    safe.bottom = phone ? 0.34 : 0.72;
  }
  size();
  window.addEventListener("resize", size);

  let progress = 0, inView = true, lastSeg = -1;
  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "+=2800",
    pin: true,
    scrub: true,
    onUpdate(self) { progress = self.progress; }
  });
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    // Stands the fixed back-to-top button down while this section owns the
    // screen — it sits on top of the caption's buttons on a phone.
    document.body.classList.toggle("showcase-live", inView);
  }).observe(section);

  /* Scrub is tied 1:1 to the scroll position, and the smooth-scroll library
     delivers that in wheel-sized steps — so the model used to jump a few
     degrees per notch instead of turning. Easing a shown value toward the
     real one turns those steps back into a continuous move, and costs a few
     frames of lag that nobody can see. */
  let shown = 0;
  function frame() {
    // Nobody can see this behind the walkable tour's overlay, and on a phone
    // five WebGL contexts rendering at once is what tips it over.
    if (!inView || window.__tour3dActive) return;
    shown += (progress - shown) * 0.13;
    if (Math.abs(progress - shown) < 0.0004) shown = progress;
    const segF = Math.min(shown * 3, 2.999);
    const seg = Math.floor(segF);
    const local = segF - seg;

    if (seg !== lastSeg) {
      houses.forEach((h, i) => (h.visible = i === seg));
      captions.forEach((c, i) => c.classList.toggle("is-active", i === seg));
      if (counter) counter.textContent = `0${seg + 1} / 03`;
      lastSeg = seg;
    }
    const house = houses[seg];
    applyAssembly(house, Math.min(0.12 + local * 1.9, 1));

    /* The house used to spin on the spot while the camera barely moved, which
       is a turntable, not "walk around them". The house now stands still and
       the camera walks an 85° arc across its frontage, dropping from a raised
       three-quarter view down towards eye level as it goes. */
    const az = -0.55 + local * 1.5;
    const el = 0.21 - local * 0.1;   // raised three-quarter view down to near eye level
    const fit = house.userData.fit;
    const d = fitDistance(camera, fit, az, el, safe);
    orbit(camera, fit, az, el, d);
    // Fog is set from the camera distance rather than fixed, so the haze always
    // sits behind the house instead of washing it out when the camera backs off.
    scene.fog.near = d - fit.radius * 1.3;
    scene.fog.far = d + fit.radius * 4.5;
    if (composer) composer.render(); else renderer.render(scene, camera);
  }
  gsap.ticker.add(frame);
}

/* ============================================================
   LIGHTBOX VIEWER (drag to rotate, auto-spin)
   ============================================================ */
let viewer = null;
function ensureViewer(container) {
  if (viewer) return viewer;
  const canvas = document.createElement("canvas");
  canvas.className = "lightbox__3d";
  container.appendChild(canvas);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  const gfx = scaled(0.5);
  renderer.setPixelRatio(gfx.dpr);
  cinematic(renderer);
  const scene = makeScene();
  scene.environment = skyEnv(renderer);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.5, 400);
  camera.position.set(0, 4.6, 12.8);
  camera.lookAt(0, 1.4, 0);

  viewer = { renderer, scene, camera, canvas, house: null, rotY: 0, targetRotY: 0, dragging: false, open: false, built: 0, type: null };

  canvas.addEventListener("pointerdown", (e) => {
    viewer.dragging = true;
    viewer.lastX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!viewer.dragging) return;
    viewer.targetRotY += (e.clientX - viewer.lastX) * 0.012;
    viewer.lastX = e.clientX;
  });
  ["pointerup", "pointercancel"].forEach((ev) =>
    canvas.addEventListener(ev, () => (viewer.dragging = false)));

  function loop() {
    if (!viewer.open) return;
    requestAnimationFrame(loop);
    if (window.__tour3dActive) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * renderer.getPixelRatio()) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      viewer.framed = false;
    }
    /* Same fixed-distance mistake as the scroll showcase had: a camera parked
       at 12.8 cropped the plinth off the bottom of the taller models. Frame to
       whatever this panel is, once, leaving room for the "drag to rotate" hint
       along the bottom edge. The house turns rather than the camera, and the
       fit is a cylinder, so one solve holds for every angle. */
    if (!viewer.framed && viewer.house && viewer.house.userData.fit) {
      const fit = viewer.house.userData.fit;
      const safe = { x: 0.94, top: 0.9, bottom: 0.82 };
      const d = fitDistance(camera, fit, 0, 0.3, safe);
      orbit(camera, fit, 0, 0.3, d);
      scene.fog.near = d - fit.radius * 1.3;
      scene.fog.far = d + fit.radius * 4.5;
      viewer.framed = true;
    }
    if (!viewer.dragging) viewer.targetRotY += 0.0035;
    viewer.rotY += (viewer.targetRotY - viewer.rotY) * 0.08;
    if (viewer.house) {
      viewer.house.rotation.y = viewer.rotY;
      viewer.built = Math.min(viewer.built + 0.016, 1);
      applyAssembly(viewer.house, easeOutCubic(viewer.built));
    }
    renderer.render(scene, camera);
  }
  viewer.loop = loop;
  return viewer;
}

/* ---------- LIVE LISTING → 3D MASSING ----------
   Derive an architectural archetype straight from a live YouTube listing's
   own title. Deterministic: the same listing always maps to the same model,
   so every card in the live feed gets a massing that reflects *its* plot
   size, storeys, and style — generated automatically, no manual table. */
function archetypeForListing(title) {
  const t = (title || "").toLowerCase();
  const kanal = /\bkanal\b/.test(t);
  const marlaM = t.match(/(\d+(?:\.\d+)?)\s*marla/);
  const marla = marlaM ? parseFloat(marlaM[1]) : 0;
  const small = marla > 0 && marla <= 6;
  if (/farm\s*-?\s*house|orchard/.test(t)) return "farmhouse";
  if (/palazzo|palace|mansion/.test(t)) return "palazzo";
  if (/spanish/.test(t)) return "spanish";
  if (/colonial|heritage|classic|traditional/.test(t)) return "colonial";
  if (/corner/.test(t)) return "corner";
  if (/brick/.test(t)) return "brick";
  if (/grey|gray|stone|concrete/.test(t)) return "greyTexture";
  if (/designer|luxury|deluxe|elegant/.test(t)) return kanal ? "manor" : "modernWhite";
  if (kanal || /villa/.test(t)) return "manor";
  if (small) return "cube5";
  if (/single\s*(?:storey|story)/.test(t)) return "linear";
  return "modern";
}

function openViewer(index, container) {
  return openViewerByType(PROPERTY_MODELS[index] || "modern", container);
}
function openViewerForListing(title, container) {
  return openViewerByType(archetypeForListing(title), container);
}
function openViewerByType(type, container) {
  const v = ensureViewer(container);
  if (!v) return false;
  if (!ARCHETYPES[type]) type = "modern";
  if (v.type !== type) {
    if (v.house) v.scene.remove(v.house);
    v.house = ARCHETYPES[type]();
    v.scene.add(v.house);
    v.house.userData.fit = measure(v.house);
    v.type = type;
  }
  v.framed = false;   // re-fit on open: the panel's size depends on the viewport
  v.built = 0;
  v.rotY = v.targetRotY = -0.4;
  v.open = true;
  v.canvas.style.display = "block";
  requestAnimationFrame(v.loop);
  return true;
}
function closeViewer() {
  if (viewer) viewer.open = false;
}

window.Estate3D = { openViewer, openViewerByType, openViewerForListing, archetypeForListing, closeViewer };

/* Run the showcase once per page, however many times this file gets evaluated.
   A module is keyed by its full URL including the query string, so the moment
   index.html's <script src="js/estate3d.js?v=6"> and house-tour.js's
   import "./estate3d.js?v=5" disagreed, the browser loaded two separate copies
   of this module and ran initShowcase twice. Two pinned ScrollTriggers on the
   same section means the pin spacer reserves the scroll distance twice over,
   and the second 2800px is empty — a screen-and-a-half of nothing below the
   houses, plus a second WebGL renderer fighting for the same canvas.

   The two version strings are back in step, but they are edited by hand in two
   files and will drift again. This makes that harmless. */
if (!window.__estate3dShowcase) {
  window.__estate3dShowcase = true;
  initShowcase();
}

/* Shared with js/house-tour.js so a sold-home tour can show the exact same
   model the lightbox thumbnail does, rather than an approximation of it. */
export { ARCHETYPES, PROPERTY_MODELS, skyEnv };

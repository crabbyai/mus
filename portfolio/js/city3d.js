/* ============================================================
   CITY IN 3D — Islamabad and Lahore, sector by sector
   ------------------------------------------------------------
   A map tells you where a sector is. It doesn't tell you what
   living there costs, what's around the corner, or where you'd
   eat on a Friday night. This does all three at once: every
   sector is a block whose height and colour carry its price,
   labelled, clickable, with the landmarks and the restaurants
   people actually name when they describe the area.

   Islamabad is drawn on its real lettered grid — rows D to I,
   columns numbered east to west — with the Margallas along the
   north edge and the off-grid schemes (Bahria, DHA, B-17) sitting
   out past the sectors where they really are. Lahore has no grid,
   so it's laid out by district position instead.

   Everything is procedural: no model downloads, no map tiles, no
   API key. Buildings are one instanced mesh so the whole city is
   a couple of draw calls. Boots only when scrolled to, sleeps
   when it isn't.
   ============================================================ */
import * as THREE from "three";

/* ============================================================
   DATA
   tier drives colour and tower height. p = PKR per marla, in
   millions, consistent with js/market.js. band = 1 Kanal range
   in crore, consistent with the valuation widget.
   ============================================================ */
const ISB = [
  // grid sectors — col runs east(5) to west(17), row D=0 … I=5
  { id: "E-7", n: "E-7", col: 7, row: 1, p: 20, band: "32–55", tier: 5,
    tag: "Diplomatic quarter",
    marks: ["Diplomatic Enclave", "Margalla foothills", "Serena Hotel"],
    eats: ["Monal, up at Pir Sohawa", "Des Pardes in Saidpur Village"] },
  { id: "E-11", n: "E-11", col: 11, row: 1, p: 10.75, band: "18–25", tier: 4,
    tag: "Best-connected value",
    marks: ["E-11 Markaz", "Kashmir Highway", "Faisal Mosque, ten minutes"],
    eats: ["E-11 Markaz food strip", "Tehzeeb Bakers"] },
  { id: "F-6", n: "F-6", col: 6, row: 2, p: 18.5, band: "30–48", tier: 5,
    tag: "The oldest money",
    marks: ["Kohsar Market", "Super Market", "Islamabad Club"],
    eats: ["Chaaye Khana, Kohsar", "Street 1 Café", "Burning Brownie"] },
  { id: "F-7", n: "F-7", col: 7, row: 2, p: 18.25, band: "28–45", tier: 5,
    tag: "The address everyone knows",
    marks: ["Jinnah Super Market", "F-7 Markaz", "Margalla trail head"],
    eats: ["Monal", "Tuscany Courtyard", "Kabul Restaurant", "Howdy"] },
  { id: "F-8", n: "F-8", col: 8, row: 2, p: 15.5, band: "24–38", tier: 5,
    tag: "Central and quiet",
    marks: ["F-8 Markaz", "Ayub Market", "District Courts"],
    eats: ["F-8 Markaz strip", "Tehzeeb Bakers"] },
  { id: "F-10", n: "F-10", col: 10, row: 2, p: 12.5, band: "20–30", tier: 4,
    tag: "Family sector",
    marks: ["F-10 Markaz", "Fatima Jinnah Park next door"],
    eats: ["F-10 Markaz restaurants"] },
  { id: "F-11", n: "F-11", col: 11, row: 2, p: 11.5, band: "18–28", tier: 4,
    tag: "Newest of the F sectors",
    marks: ["F-11 Markaz", "Centaurus Mall, nearby"],
    eats: ["F-11 Markaz food court"] },
  { id: "BLUE", n: "Blue Area", col: 8.6, row: 2.72, p: 0, band: null, tier: 6,
    tag: "The commercial spine", commercial: true,
    marks: ["Jinnah Avenue", "Centaurus Mall", "Head offices and banks"],
    eats: ["Jinnah Avenue restaurants"] },
  { id: "F-9", n: "F-9 Park", col: 9, row: 2, p: 0, band: null, tier: 7,
    tag: "Fatima Jinnah Park", park: true,
    marks: ["Fatima Jinnah Park — the city's green lung"], eats: [] },
  { id: "G-6", n: "G-6", col: 6, row: 3, p: 8, band: "12–20", tier: 3,
    tag: "Aabpara and Melody",
    marks: ["Aabpara Market", "Melody Food Park"],
    eats: ["Melody Food Park", "Savour Foods"] },
  { id: "G-9", n: "G-9", col: 9, row: 3, p: 7.2, band: "11–18", tier: 3,
    tag: "Karachi Company",
    marks: ["Karachi Company market", "Central location"], eats: ["G-9 Markaz"] },
  { id: "G-10", n: "G-10", col: 10, row: 3, p: 7.8, band: "12–19", tier: 3,
    tag: "Settled and central",
    marks: ["G-10 Markaz", "Peshawar Mor Metro"], eats: ["G-10 Markaz"] },
  { id: "G-11", n: "G-11", col: 11, row: 3, p: 8, band: "12–20", tier: 3,
    tag: "Well-planned G sector",
    marks: ["G-11 Markaz", "Metro bus corridor"], eats: ["G-11 Markaz"] },
  { id: "G-13", n: "G-13", col: 13, row: 3, p: 5.2, band: "8–13", tier: 2,
    tag: "Younger families",
    marks: ["G-13 Markaz", "Kashmir Highway access"], eats: ["G-13 Markaz"] },
  { id: "G-15", n: "G-15", col: 15, row: 3, p: 3.5, band: "5–9", tier: 1,
    tag: "Entry point on the grid",
    marks: ["Motorway access", "Still filling in"], eats: [] },
  { id: "H-8", n: "H-8", col: 8, row: 4, p: 0, band: null, tier: 6,
    tag: "Institutional", commercial: true,
    marks: ["Federal offices", "H-8 graveyard and colleges"], eats: [] },
  { id: "H-11", n: "H-11", col: 11, row: 4, p: 0, band: null, tier: 6,
    tag: "Universities", commercial: true,
    marks: ["NUST", "Air University", "Student housing demand"], eats: [] },
  { id: "I-8", n: "I-8", col: 8, row: 5, p: 6.5, band: "10–16", tier: 2,
    tag: "Central, well priced",
    marks: ["I-8 Markaz", "Faizabad interchange"],
    eats: ["Savour Foods", "I-8 Markaz"] },
  { id: "D-12", n: "D-12", col: 12, row: 0, p: 6.6, band: "10–16", tier: 2,
    tag: "Against the hills",
    marks: ["D-12 Markaz", "Margalla views"], eats: ["D-12 Markaz"] },
  // off-grid schemes, placed roughly where they sit relative to the sectors
  { id: "DHA2", n: "DHA Phase 2", col: 5.6, row: 5.2, p: 7.25, band: "13–16", tier: 3,
    tag: "Expressway side",
    marks: ["Islamabad Expressway", "DHA Phase 2 commercial", "Giga Mall nearby"],
    eats: ["Giga Mall food court", "DHA commercial strip"] },
  { id: "BAHRIA", n: "Bahria Town", col: 4.6, row: 6.2, p: 4.4, band: "7–12", tier: 2,
    tag: "Self-contained living",
    marks: ["Bahria Phase 1–8", "Own power and security", "Safari Villas"],
    eats: ["Bahria commercial", "Cinepax food court"] },
  { id: "ENCLAVE", n: "Bahria Enclave", col: 7.4, row: 6.4, p: 4.25, band: "7–10", tier: 2,
    tag: "Margalla views, half the price",
    marks: ["Bahria Enclave", "Park Enclave next door", "Hill views"], eats: ["Enclave commercial"] },
  { id: "GULBERG", n: "Gulberg Greens", col: 6.0, row: 7.1, p: 3.6, band: "5.5–9", tier: 1,
    tag: "Farmhouse plots",
    marks: ["Gulberg Greens", "Gulberg Residencia", "Big open plots"], eats: ["Gulberg commercial"] },
  { id: "B17", n: "B-17", col: 15.6, row: 1.4, p: 3.75, band: "6–9", tier: 1,
    tag: "Most upside left",
    marks: ["Multi Gardens B-17", "M-1 motorway", "New commercial"], eats: ["B-17 Markaz"] }
];

const LHR = [
  { id: "GULBERG3", n: "Gulberg III", x: 0.4, z: -0.6, p: 18.25, band: "28–45", tier: 5,
    tag: "Lahore's prestige address",
    marks: ["MM Alam Road", "Liberty Market", "Main Boulevard"],
    eats: ["Cafe Aylanto", "Cosa Nostra", "Butt Karahi", "Freddy's Cafe"] },
  { id: "CANTT", n: "Cantt", x: 1.5, z: 0.1, p: 11, band: "16–28", tier: 4,
    tag: "Old Lahore establishment",
    marks: ["Fortress Stadium", "Gaddafi Stadium", "Lahore Gymkhana"],
    eats: ["Cafe Zouk", "Fortress food strip"] },
  { id: "MODEL", n: "Model Town", x: 0.1, z: 1.0, p: 13.25, band: "18–35", tier: 4,
    tag: "Enormous plots, old money",
    marks: ["Model Town Park", "Model Town Link Road", "Central Lahore"],
    eats: ["Model Town Link Road restaurants"] },
  { id: "DHA5", n: "DHA Phase 5", x: 2.5, z: 0.9, p: 14.25, band: "22–35", tier: 5,
    tag: "The most liquid market here",
    marks: ["Y-Block Commercial", "H-Block", "Phase 5 park belt"],
    eats: ["Y-Block restaurants", "Broadway Pizza"] },
  { id: "DHA6", n: "DHA Phase 6", x: 3.3, z: 1.4, p: 8.25, band: "13–20", tier: 3,
    tag: "Where the designer builds are",
    marks: ["Sector C Commercial", "New builds everywhere"],
    eats: ["Phase 6 commercial", "Kababjees"] },
  { id: "DHA8", n: "DHA Phase 7 / 8", x: 4.0, z: 2.1, p: 6.5, band: "10–16", tier: 3,
    tag: "Newer, greener, further",
    marks: ["Air Avenue", "Phase 8 Commercial", "Ring Road access"],
    eats: ["Air Avenue restaurants"] },
  { id: "ASKARI", n: "Askari", x: 2.0, z: -0.3, p: 6.5, band: "10–16", tier: 3,
    tag: "Secure and settled",
    marks: ["Askari X and XI", "Army-managed", "Walk-to-school living"], eats: ["Askari commercial"] },
  { id: "GARDEN", n: "Garden / Faisal Town", x: -0.7, z: 0.6, p: 8, band: "12–20", tier: 3,
    tag: "Central and mature",
    marks: ["Garden Town", "Faisal Town", "Kalma Chowk"], eats: ["Faisal Town food street"] },
  { id: "JOHAR", n: "Johar Town", x: -1.6, z: 0.9, p: 6, band: "9–15", tier: 2,
    tag: "Everything within reach",
    marks: ["Emporium Mall", "Expo Centre", "Doctors Hospital"],
    eats: ["Emporium food court", "Johar Town commercial"] },
  { id: "WAPDA", n: "Wapda Town", x: -2.2, z: 1.7, p: 5, band: "8–13", tier: 2,
    tag: "Solid family value",
    marks: ["Wapda Town roundabouts", "Valencia next door"], eats: ["Wapda Town commercial"] },
  { id: "BAHRIA_L", n: "Bahria Town", x: -3.2, z: 2.6, p: 6, band: "9–15", tier: 2,
    tag: "A city inside the city",
    marks: ["Grand Jamia Mosque", "Eiffel Tower replica", "Takht-e-Lahore"],
    eats: ["Bahria commercial", "Cinegold food court"] },
  { id: "LAKECITY", n: "Lake City", x: -2.6, z: 3.4, p: 5.75, band: "9–14", tier: 2,
    tag: "Best yield in Lahore",
    marks: ["Lake City Golf & Country Club", "Raiwind Road"], eats: ["Lake City commercial"] },
  { id: "EME", n: "EME / Raiwind Rd", x: -3.6, z: 1.6, p: 4.8, band: "8–12", tier: 1,
    tag: "Motorway side",
    marks: ["EME Society", "Motorway access", "Ring Road"], eats: ["EME commercial"] },
  { id: "WALLED", n: "Walled City", x: 0.8, z: -2.4, p: 0, band: null, tier: 7,
    tag: "Where Lahore began", park: true,
    marks: ["Badshahi Mosque", "Lahore Fort", "Fort Road Food Street"],
    eats: ["Cuckoo's Den", "Andaaz", "Haveli Restaurant"] }
];

/* Tier → colour. Deliberately a single warm ramp rather than a rainbow: the
   point is "how expensive", and a hue scale would read as "different kinds". */
const TIER = {
  1: { c: 0x2f4460, label: "Under PKR 4M / marla" },
  2: { c: 0x4a5c72, label: "PKR 4–7M / marla" },
  3: { c: 0x7d7357, label: "PKR 7–10M / marla" },
  4: { c: 0xb08b45, label: "PKR 10–15M / marla" },
  5: { c: 0xdfae55, label: "PKR 15M+ / marla" },
  6: { c: 0x39435a, label: "Commercial / institutional" },
  7: { c: 0x2c5241, label: "Park / heritage" }
};

const WA = "16134083945";
const SP = 7.2;          // grid spacing, world units

/* ============================================================
   SCENE
   ============================================================ */
let renderer, scene, camera, root, composer, bloom;
let tiles = [], labels = [], buildings = null, ray, pointer = new THREE.Vector2();
let city = "isb", selected = null, hovered = null;
let running = false, raf = 0, ready = false;
// A steeper pitch shows more of the plan inside the same vertical field of
// view, which is what a city laid out flat needs.
let yaw = -0.62, targetYaw = -0.62, pitch = 0.82, dist = 78, targetDist = 78;
let dragging = false, lastX = 0, lastY = 0, moved = 0, pinch = 0;

const cv = () => document.getElementById("cityCanvas");

function rnd(seed) {            // deterministic, so the skyline never reshuffles
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
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
  renderer.toneMappingExposure = 1.16;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070b16);
  scene.fog = new THREE.Fog(0x070b16, 95, 210);

  camera = new THREE.PerspectiveCamera(40, 1, 0.5, 400);
  root = new THREE.Group();
  scene.add(root);

  scene.add(new THREE.HemisphereLight(0x8ea2c8, 0x1a1e2c, 1.1));
  scene.add(new THREE.AmbientLight(0x51608c, 0.7));

  const key = new THREE.DirectionalLight(0xffd9a0, 2.5);
  key.position.set(38, 60, 26);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const s = 78;
  key.shadow.camera.left = -s; key.shadow.camera.right = s;
  key.shadow.camera.top = s; key.shadow.camera.bottom = -s;
  key.shadow.camera.far = 220;
  key.shadow.bias = -0.0009;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x4d6fd0, 1.0);
  rim.position.set(-44, 26, -40);
  scene.add(rim);

  ray = new THREE.Raycaster();
  bind(c);
  resize();
  addEventListener("resize", resize, { passive: true });

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && innerWidth > 700) {
    Promise.all([
      import("./vendor/three/postprocessing/EffectComposer.js"),
      import("./vendor/three/postprocessing/RenderPass.js"),
      import("./vendor/three/postprocessing/UnrealBloomPass.js"),
      import("./vendor/three/postprocessing/OutputPass.js")
    ]).then(([EC, RP, UB, OP]) => {
      const w = cv().clientWidth, h = cv().clientHeight;
      composer = new EC.EffectComposer(renderer);
      composer.addPass(new RP.RenderPass(scene, camera));
      bloom = new UB.UnrealBloomPass(new THREE.Vector2(w, h), 0.7, 0.8, 0.72);
      composer.addPass(bloom);
      composer.addPass(new OP.OutputPass());
      resize();
    }).catch(() => { composer = null; });
  }

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
  if (composer) composer.setSize(w, h);
  if (bloom) bloom.resolution.set(w, h);
}

/* ---------- labels ---------- */
function labelSprite(text, tier) {
  const pad = 18, fs = 46;
  const cvs = document.createElement("canvas");
  const g = cvs.getContext("2d");
  g.font = "600 " + fs + "px Inter, system-ui, sans-serif";
  const w = Math.ceil(g.measureText(text).width) + pad * 2;
  cvs.width = w; cvs.height = fs + pad * 2;
  const g2 = cvs.getContext("2d");
  g2.font = "600 " + fs + "px Inter, system-ui, sans-serif";
  g2.textBaseline = "middle";
  g2.fillStyle = "rgba(8,12,24,0.82)";
  g2.beginPath();
  g2.roundRect(0, 0, cvs.width, cvs.height, 26);
  g2.fill();
  g2.strokeStyle = "rgba(201,164,92,0.55)"; g2.lineWidth = 3; g2.stroke();
  g2.fillStyle = tier >= 4 ? "#f0d79a" : "#dfe3ee";
  g2.fillText(text, pad, cvs.height / 2 + 2);

  const tex = new THREE.CanvasTexture(cvs);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  sp.scale.set((cvs.width / cvs.height) * 2.0, 2.0, 1);
  sp.renderOrder = 10;
  return sp;
}

/* ---------- build a city ---------- */
function clearCity() {
  while (root.children.length) {
    const o = root.children.pop();
    o.traverse && o.traverse((n) => {
      if (n.geometry) n.geometry.dispose();
      if (n.material) {
        (Array.isArray(n.material) ? n.material : [n.material]).forEach((m) => {
          if (m.map) m.map.dispose();
          m.dispose();
        });
      }
    });
  }
  tiles = []; labels = []; buildings = null;
}

function place(d) {
  // Islamabad rides its lettered grid; Lahore is positioned by district.
  if (city === "isb") return { x: (11 - d.col) * SP, z: (d.row - 2.6) * SP, w: SP * 0.86, h: SP * 0.86 };
  // Lahore's districts run on a long north-east diagonal; flattening the
  // depth axis keeps that shape readable without the far end walking out of
  // the bottom of the frame.
  return { x: d.x * SP * 0.95, z: d.z * SP * 0.8, w: SP * 0.9, h: SP * 0.9 };
}

function buildCity() {
  clearCity();
  const data = city === "isb" ? ISB : LHR;

  // ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(420, 420),
    new THREE.MeshStandardMaterial({ color: 0x0a0f1c, roughness: 1, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.35;
  ground.receiveShadow = true;
  root.add(ground);

  // the Margallas along Islamabad's north edge — the single most recognisable
  // thing about the city's shape, and it orients the whole model
  if (city === "isb") {
    const ridge = new THREE.Group();
    const r = rnd(7);
    for (let i = 0; i < 26; i++) {
      const h = 7 + r() * 13;
      const m = new THREE.Mesh(
        new THREE.ConeGeometry(6 + r() * 7, h, 5),
        new THREE.MeshStandardMaterial({ color: 0x1d2740, roughness: 0.98, flatShading: true })
      );
      m.position.set(-58 + i * 6.4 + r() * 3, h / 2 - 1, -36 - r() * 9);
      m.rotation.y = r() * 3;
      m.castShadow = true;
      ridge.add(m);
    }
    root.add(ridge);
  }

  // buildings: one instanced mesh for the entire city
  const boxes = [];
  data.forEach((d, di) => {
    const pos = place(d);
    const seed = rnd(di * 977 + 13);
    const tier = TIER[d.tier];

    // the sector tile
    const tile = new THREE.Mesh(
      new THREE.BoxGeometry(pos.w, 0.7, pos.h),
      new THREE.MeshStandardMaterial({
        color: tier.c, roughness: 0.82, metalness: 0.05,
        emissive: new THREE.Color(tier.c).multiplyScalar(0.16)
      })
    );
    tile.position.set(pos.x, 0, pos.z);
    tile.receiveShadow = true;
    tile.castShadow = true;
    tile.userData = { d: d, baseY: 0 };
    root.add(tile);
    tiles.push(tile);

    // gold outline so the grid reads even at a distance
    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(pos.w, 0.7, pos.h)),
      new THREE.LineBasicMaterial({ color: 0xc9a45c, transparent: true, opacity: 0.34 })
    );
    edge.position.copy(tile.position);
    tile.userData.edge = edge;
    root.add(edge);

    // skyline: denser and taller where it costs more
    if (!d.park) {
      const n = d.commercial ? 22 : 10 + d.tier * 4;
      for (let i = 0; i < n; i++) {
        const bw = 0.5 + seed() * 0.9;
        const bd = 0.5 + seed() * 0.9;
        const base = d.commercial ? 3.2 : 0.9 + d.tier * 0.62;
        const bh = base * (0.45 + seed() * 1.5);
        boxes.push({
          x: pos.x + (seed() - 0.5) * pos.w * 0.82,
          z: pos.z + (seed() - 0.5) * pos.h * 0.82,
          w: bw, d: bd, h: bh,
          lit: seed() > (d.commercial ? 0.35 : 0.62),
          tier: d.tier
        });
      }
    }

    // Stagger the height by row so adjacent sectors' labels don't sit on top
    // of each other in the tight F/G block.
    const sp = labelSprite(d.n, d.tier);
    sp.userData.lift = 4.4 + ((di % 2) ? 2.8 : 0);
    sp.position.set(pos.x, sp.userData.lift, pos.z);
    root.add(sp);
    labels.push(sp);
  });

  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.62, metalness: 0.12, vertexColors: false });
  buildings = new THREE.InstancedMesh(geo, mat, boxes.length);
  buildings.castShadow = true;
  buildings.receiveShadow = true;
  buildings.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(boxes.length * 3), 3);
  const m4 = new THREE.Matrix4(), col = new THREE.Color();
  boxes.forEach((b, i) => {
    m4.makeScale(b.w, b.h, b.d);
    m4.setPosition(b.x, 0.35 + b.h / 2, b.z);
    buildings.setMatrixAt(i, m4);
    // lit windows read as gold; the rest take the sector's own tone
    col.setHex(b.lit ? 0xffd9a0 : TIER[b.tier].c).multiplyScalar(b.lit ? 1 : 0.75);
    buildings.setColorAt(i, col);
  });
  buildings.instanceMatrix.needsUpdate = true;
  if (buildings.instanceColor) buildings.instanceColor.needsUpdate = true;
  // Emissive on the shared material would light every block; the gold ones are
  // bright enough in colour alone for the bloom pass to find them.
  root.add(buildings);

  // Centre on what was actually built. Islamabad's off-grid schemes sit well
  // south-east of the lettered grid, so a fixed origin left the city hanging
  // in one corner of the frame.
  const bb = new THREE.Box3();
  tiles.forEach((t) => bb.expandByObject(t));
  const mid = bb.getCenter(new THREE.Vector3());
  root.position.set(-mid.x, 0, -mid.z);

  root.rotation.y = city === "isb" ? 0.16 : 0;
  // Fit the diagonal, not the widest side: the view rotates, so the longest
  // silhouette the city can present has to clear the frame or districts swing
  // off the edge as it turns. Labels overhang their tiles, hence the margin.
  const w = bb.max.x - bb.min.x, d2 = bb.max.z - bb.min.z;
  const diag = Math.sqrt(w * w + d2 * d2);
  const vHalf = (40 * Math.PI / 180) / 2;
  targetDist = dist = Math.min(200, (diag / 2) / Math.tan(vHalf) * 1.12);
  selected = null;

  // Never open on an empty panel — lead with the sector everyone knows.
  select(data.filter(function (x) { return x.id === (city === "isb" ? "F-7" : "GULBERG3"); })[0] || data[0]);
}

/* ---------- interaction ---------- */
function bind(c) {
  c.addEventListener("pointerdown", (e) => {
    c.setPointerCapture(e.pointerId);
    dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY;
  });
  c.addEventListener("pointermove", (e) => {
    const r = c.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    moved += Math.abs(dx) + Math.abs(dy);
    targetYaw -= dx * 0.006;
    pitch = Math.max(0.28, Math.min(1.35, pitch + dy * 0.004));
    lastX = e.clientX; lastY = e.clientY;
  });
  const up = (e) => {
    if (dragging && moved < 6) pick();      // a click, not a drag
    dragging = false;
  };
  c.addEventListener("pointerup", up);
  c.addEventListener("pointercancel", () => { dragging = false; });
  c.addEventListener("wheel", (e) => {
    e.preventDefault();
    targetDist = Math.max(34, Math.min(180, targetDist + e.deltaY * 0.09));
  }, { passive: false });
  c.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) pinch = gap(e);
  }, { passive: true });
  c.addEventListener("touchmove", (e) => {
    if (e.touches.length !== 2) return;
    const g = gap(e);
    if (g && pinch) { targetDist = Math.max(34, Math.min(180, targetDist * (pinch / g))); pinch = g; }
  }, { passive: true });
  function gap(e) {
    const [a, b] = e.touches;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }
}

function pick() {
  ray.setFromCamera(pointer, camera);
  const hit = ray.intersectObjects(tiles, false)[0];
  if (hit) select(hit.object.userData.d);
}

function select(d) {
  selected = d;
  paintPanel(d);
  const t = tiles.filter((x) => x.userData.d.id === d.id)[0];
  if (t) targetDist = Math.max(46, Math.min(targetDist, 74));
}

/* ---------- the info panel ---------- */
function paintPanel(d) {
  const box = document.getElementById("cityInfo");
  if (!box) return;
  const priced = d.p > 0;
  box.innerHTML =
    '<p class="city-info__tag">' + d.tag + "</p>" +
    "<h3>" + d.n + (city === "isb" ? ", Islamabad" : ", Lahore") + "</h3>" +
    (priced
      ? '<div class="city-info__price"><span>1 Kanal</span><strong>PKR ' + d.band + " Crore</strong></div>" +
        '<div class="city-info__price"><span>Per marla</span><strong>PKR ' + d.p.toFixed(2) + "M</strong></div>"
      : '<p class="city-info__none">Not a residential sector — but it shapes what the ones around it are worth.</p>') +
    (d.marks.length ? '<p class="city-info__h">Around here</p><ul>' +
      d.marks.map((m) => "<li>" + m + "</li>").join("") + "</ul>" : "") +
    (d.eats.length ? '<p class="city-info__h">Where you\'d eat</p><ul class="city-info__eats">' +
      d.eats.map((m) => "<li>" + m + "</li>").join("") + "</ul>" : "") +
    '<button class="btn btn--wa city-info__cta" type="button" id="cityWant">' +
      "I want to live here <span class=\"btn__arrow\">→</span></button>";

  document.getElementById("cityWant").addEventListener("click", () => {
    const where = d.n + (city === "isb" ? ", Islamabad" : ", Lahore");
    let msg = "Hello Adeel — I want to live in " + where + ".\n\n";
    if (priced) msg += "Your site shows 1 Kanal there at PKR " + d.band + " Crore (about PKR " +
      d.p.toFixed(2) + "M per marla).\n\n";
    msg += "What's actually available right now, and what would you recommend for someone " +
      "looking at this area?";
    if (window.LeadRelay) window.LeadRelay.send(msg);
    else window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });
  box.classList.add("is-on");
}

/* ---------- loop ---------- */
function loop() {
  if (!running) return;
  raf = requestAnimationFrame(loop);

  if (!dragging) targetYaw += 0.0008;
  yaw += (targetYaw - yaw) * 0.07;
  dist += (targetDist - dist) * 0.08;

  camera.position.set(Math.sin(yaw) * dist * Math.cos(pitch),
                      Math.sin(pitch) * dist,
                      Math.cos(yaw) * dist * Math.cos(pitch));
  camera.lookAt(0, 0, 0);

  // hover: raycast only while the pointer is actually over something
  if (!dragging) {
    ray.setFromCamera(pointer, camera);
    const hit = ray.intersectObjects(tiles, false)[0];
    const next = hit ? hit.object : null;
    if (next !== hovered) {
      if (hovered) hovered.material.emissiveIntensity = 1;
      hovered = next;
      cv().style.cursor = hovered ? "pointer" : "grab";
    }
  }
  const t = performance.now() * 0.001;
  tiles.forEach((tile) => {
    const on = tile === hovered || (selected && tile.userData.d.id === selected.id);
    const want = on ? 1.1 : 0;
    tile.position.y += (want - tile.position.y) * 0.16;
    if (tile.userData.edge) {
      tile.userData.edge.position.y = tile.position.y;
      tile.userData.edge.material.opacity = on ? 0.85 : 0.34;
    }
    tile.material.emissive.setHex(TIER[tile.userData.d.tier].c);
    tile.material.emissive.multiplyScalar(on ? 0.55 + Math.sin(t * 3) * 0.08 : 0.16);
  });
  labels.forEach((sp, i) => {
    const tile = tiles[i];
    if (tile) sp.position.y = sp.userData.lift + tile.position.y;
  });

  if (composer) composer.render(); else renderer.render(scene, camera);
}

function start() { if (!running && ready) { running = true; loop(); } }
function stop() { running = false; cancelAnimationFrame(raf); }

/* ---------- chrome ---------- */
function legend() {
  const el = document.getElementById("cityLegend");
  if (!el) return;
  el.innerHTML = [5, 4, 3, 2, 1].map((k) =>
    '<span class="city-key"><i style="background:#' +
    TIER[k].c.toString(16).padStart(6, "0") + '"></i>' + TIER[k].label + "</span>").join("");
}

function setCity(next) {
  if (next === city) return;
  city = next;
  document.querySelectorAll("[data-city3d]").forEach((b) => {
    const on = b.getAttribute("data-city3d") === next;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", String(on));
  });
  const info = document.getElementById("cityInfo");
  if (info) { info.classList.remove("is-on"); info.innerHTML = ""; }
  const hint = document.getElementById("cityHint");
  if (hint) hint.textContent = next === "isb"
    ? "Drag to orbit · scroll to zoom · tap any sector"
    : "Drag to orbit · scroll to zoom · tap any district";
  buildCity();
}

/* ---------- boot ---------- */
(function boot() {
  const section = document.getElementById("city3d");
  if (!section || !cv()) return;

  document.querySelectorAll("[data-city3d]").forEach((b) => {
    b.addEventListener("click", () => setCity(b.getAttribute("data-city3d")));
  });

  let booted = false;
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) { stop(); return; }
      if (!booted) {
        booted = true;
        if (!initScene()) {
          section.classList.add("city--no3d");
          io.disconnect();
          return;
        }
        buildCity();
        legend();
        const l = document.getElementById("cityLoading");
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

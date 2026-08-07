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
  { id: "E-7", n: "E-7", col: 7, row: 1, p: 20, band: "32–55",
    tag: "Diplomatic quarter",
    marks: ["Diplomatic Enclave", "Margalla foothills", "Serena Hotel"],
    eats: ["Monal, up at Pir Sohawa", "Des Pardes in Saidpur Village"] },
  { id: "E-11", n: "E-11", col: 11, row: 1, p: 10.75, band: "18–25",
    tag: "Best-connected value",
    marks: ["E-11 Markaz", "Kashmir Highway", "Faisal Mosque, ten minutes"],
    eats: ["E-11 Markaz food strip", "Tehzeeb Bakers"] },
  { id: "F-6", n: "F-6", col: 6, row: 2, p: 18.5, band: "30–48",
    tag: "The oldest money",
    marks: ["Kohsar Market", "Super Market", "Islamabad Club"],
    eats: ["Chaaye Khana, Kohsar", "Street 1 Café", "Burning Brownie"] },
  { id: "F-7", n: "F-7", col: 7, row: 2, p: 18.25, band: "28–45",
    tag: "The address everyone knows",
    marks: ["Jinnah Super Market", "F-7 Markaz", "Margalla trail head"],
    eats: ["Monal", "Tuscany Courtyard", "Kabul Restaurant", "Howdy"] },
  { id: "F-8", n: "F-8", col: 8, row: 2, p: 15.5, band: "24–38",
    tag: "Central and quiet",
    marks: ["F-8 Markaz", "Ayub Market", "District Courts"],
    eats: ["F-8 Markaz strip", "Tehzeeb Bakers"] },
  { id: "F-10", n: "F-10", col: 10, row: 2, p: 12.5, band: "20–30",
    tag: "Family sector",
    marks: ["F-10 Markaz", "Fatima Jinnah Park next door"],
    eats: ["F-10 Markaz restaurants"] },
  { id: "F-11", n: "F-11", col: 11, row: 2, p: 11.5, band: "18–28",
    tag: "Newest of the F sectors",
    marks: ["F-11 Markaz", "Centaurus Mall, nearby"],
    eats: ["F-11 Markaz food court"] },
  { id: "BLUE", n: "Blue Area", col: 8.6, row: 2.72, p: 0, band: null,
    tag: "The commercial spine", commercial: true,
    marks: ["Jinnah Avenue", "Centaurus Mall", "Head offices and banks"],
    eats: ["Jinnah Avenue restaurants"] },
  { id: "F-9", n: "F-9 Park", col: 9, row: 2, p: 0, band: null,
    tag: "Fatima Jinnah Park", park: true,
    marks: ["Fatima Jinnah Park — the city's green lung"], eats: [] },
  { id: "G-6", n: "G-6", col: 6, row: 3, p: 8, band: "12–20",
    tag: "Aabpara and Melody",
    marks: ["Aabpara Market", "Melody Food Park"],
    eats: ["Melody Food Park", "Savour Foods"] },
  { id: "G-9", n: "G-9", col: 9, row: 3, p: 7.2, band: "11–18",
    tag: "Karachi Company",
    marks: ["Karachi Company market", "Central location"], eats: ["G-9 Markaz"] },
  { id: "G-10", n: "G-10", col: 10, row: 3, p: 7.8, band: "12–19",
    tag: "Settled and central",
    marks: ["G-10 Markaz", "Peshawar Mor Metro"], eats: ["G-10 Markaz"] },
  { id: "G-11", n: "G-11", col: 11, row: 3, p: 8, band: "12–20",
    tag: "Well-planned G sector",
    marks: ["G-11 Markaz", "Metro bus corridor"], eats: ["G-11 Markaz"] },
  { id: "G-13", n: "G-13", col: 13, row: 3, p: 5.2, band: "8–13",
    tag: "Younger families",
    marks: ["G-13 Markaz", "Kashmir Highway access"], eats: ["G-13 Markaz"] },
  { id: "G-15", n: "G-15", col: 14.2, row: 3, p: 3.5, band: "5–9",
    tag: "Entry point on the grid",
    marks: ["Motorway access", "Still filling in"], eats: [] },
  { id: "H-8", n: "H-8", col: 8, row: 4, p: 0, band: null,
    tag: "Institutional", commercial: true,
    marks: ["Federal offices", "H-8 graveyard and colleges"], eats: [] },
  { id: "H-11", n: "H-11", col: 11, row: 4, p: 0, band: null,
    tag: "Universities", commercial: true,
    marks: ["NUST", "Air University", "Student housing demand"], eats: [] },
  { id: "I-8", n: "I-8", col: 8, row: 5, p: 6.5, band: "10–16",
    tag: "Central, well priced",
    marks: ["I-8 Markaz", "Faizabad interchange"],
    eats: ["Savour Foods", "I-8 Markaz"] },
  { id: "D-12", n: "D-12", col: 12, row: 0, p: 6.6, band: "10–16",
    tag: "Against the hills",
    marks: ["D-12 Markaz", "Margalla views"], eats: ["D-12 Markaz"] },
  // off-grid schemes, placed roughly where they sit relative to the sectors
  { id: "DHA2", n: "DHA Phase 2", col: 5.6, row: 5.2, p: 7.25, band: "13–16", plots: "5 & 10 Marla · 1 & 2 Kanal", by: "Defence Housing Authority",
    tag: "Expressway side",
    marks: ["Islamabad Expressway", "DHA Phase 2 commercial", "Giga Mall nearby"],
    eats: ["Giga Mall food court", "DHA commercial strip"] },
  { id: "BAHRIA", n: "Bahria Town", col: 4.6, row: 6.2, p: 4.4, band: "7–12", plots: "5, 8 & 10 Marla · 1 & 2 Kanal", by: "Bahria Town",
    tag: "Self-contained living",
    marks: ["Bahria Phase 1–8", "Own power and security", "Safari Villas"],
    eats: ["Bahria commercial", "Cinepax food court"] },
  { id: "ENCLAVE", n: "Bahria Enclave", col: 7.4, row: 6.4, p: 4.25, band: "7–10", plots: "5, 8 & 10 Marla · 1 & 2 Kanal", by: "Bahria Town",
    tag: "Margalla views, half the price",
    marks: ["Bahria Enclave", "Park Enclave next door", "Hill views"], eats: ["Enclave commercial"] },
  { id: "GULBERG", n: "Gulberg Greens", col: 6.0, row: 7.1, p: 3.6, band: "5.5–9", plots: "1, 2 & 4 Kanal farmhouse plots", by: "Intelligence Bureau Employees Society",
    tag: "Farmhouse plots",
    marks: ["Gulberg Greens", "Gulberg Residencia", "Big open plots"], eats: ["Gulberg commercial"] },
  { id: "B17", n: "B-17", col: 14.4, row: 1.5, p: 3.75, band: "6–9", plots: "5, 8 & 10 Marla · 1 & 2 Kanal", by: "Multi Professionals Cooperative",
    tag: "Most upside left",
    marks: ["Multi Gardens B-17", "M-1 motorway", "New commercial"], eats: ["B-17 Markaz"] },
  // ---- the private schemes ringing the city ----------------------------
  // These are where most Islamabad buying actually happens now; the lettered
  // sectors are largely built out. Positions are relative, not surveyed.
  { id: "DHA5I", n: "DHA Phase 5", col: 4.0, row: 4.6, p: 5.8, band: "9–14", plots: "5 & 10 Marla · 1 & 2 Kanal", by: "Defence Housing Authority",
    tag: "The newer DHA",
    marks: ["Islamabad Expressway", "Airport corridor", "DHA commercial"],
    eats: ["DHA Phase 5 commercial"] },
  { id: "NAVAL", n: "Naval Anchorage", col: 4.4, row: 5.8, p: 3.3, band: "5–8", plots: "10 Marla · 1 Kanal", by: "Pakistan Navy",
    tag: "Quiet and fully built",
    marks: ["Islamabad Expressway", "Navy-managed", "Mature trees"],
    eats: ["Anchorage commercial"] },
  { id: "PARKVIEW", n: "Park View City", col: 6.5, row: 7.7, p: 2.9, band: "4.5–7", plots: "5, 8 & 10 Marla · 1 & 2 Kanal", by: "Vision Group",
    tag: "Against the national park",
    marks: ["Malot Road", "Bani Gala side", "Hill and lake views"],
    eats: ["Park View commercial"] },
  { id: "TAJ", n: "Taj Residencia", col: 10.0, row: 6.6, p: 2.5, band: "4–6", plots: "5, 7 & 10 Marla · 1 Kanal", by: "Sardar Group",
    tag: "Fast-building, well placed",
    marks: ["Near I-14 / I-15", "Kuri Road", "Centaurus developer"],
    eats: ["Taj commercial"] },
  { id: "FAISALT", n: "Faisal Town", col: 13.4, row: 0.6, p: 2.3, band: "3.5–5.5", plots: "5, 8 & 10 Marla · 1 & 2 Kanal", by: "Zedem International",
    tag: "North-west, near the hills",
    marks: ["Near Tarnol", "M-1 access", "Faisal Hills next door"], eats: ["Faisal Town commercial"] },
  { id: "SMART", n: "Capital Smart City", col: 12.6, row: 8.0, p: 2.3, band: "3.5–5.5", plots: "5, 7, 10 & 12 Marla · 1 & 2 Kanal", by: "Future Development Holdings",
    tag: "The big M-2 project",
    marks: ["Dedicated M-2 interchange", "Lahore-side of the motorway"], eats: ["Smart City commercial"] },
  { id: "TOPCITY", n: "Top City-1", col: 14.8, row: 4.8, p: 2.0, band: "3–5", plots: "4, 5, 8 & 10 Marla · 1 Kanal",
    tag: "Airport-side",
    marks: ["Minutes from Islamabad Airport", "M-1 / M-2 access"], eats: ["Top City commercial"] },
  { id: "MUMTAZ", n: "Mumtaz City", col: 14.2, row: 5.9, p: 1.9, band: "3–4.5", plots: "5, 8 & 10 Marla · 1 Kanal",
    tag: "Airport-side, established",
    marks: ["Near Islamabad Airport", "Srinagar Highway"], eats: ["Mumtaz City commercial"] },
  { id: "NOVA", n: "Nova City", col: 3.2, row: 7.5, p: 1.6, band: "2.5–4", plots: "3.5, 5, 8 & 10 Marla · 1 Kanal",
    tag: "Rawalpindi side",
    marks: ["Near Rawalpindi Ring Road", "Chakri interchange"], eats: ["Nova commercial"] },
  { id: "BLUEW", n: "Blue World City", col: 15.4, row: 8.4, p: 1.2, band: "1.8–3", plots: "5, 8 & 10 Marla · 1 Kanal", by: "Blue Group of Companies",
    tag: "Cheapest entry on the map",
    marks: ["Chakri Road", "Rawalpindi Ring Road", "Longest horizon"], eats: ["Blue World commercial"] },
  { id: "RUDN", n: "Rudn Enclave", col: 11.0, row: 8.4, p: 1.1, band: "1.6–2.8", plots: "5, 7 & 10 Marla · 1 Kanal",
    tag: "Adyala side, early stage",
    marks: ["Adyala Road", "Rawalpindi Ring Road", "Long-hold play"], eats: ["Rudn commercial"] }
];

const LHR = [
  { id: "GULBERG3", n: "Gulberg III", x: 0.4, z: -0.6, p: 18.25, band: "28–45",
    tag: "Lahore's prestige address",
    marks: ["MM Alam Road", "Liberty Market", "Main Boulevard"],
    eats: ["Cafe Aylanto", "Cosa Nostra", "Butt Karahi", "Freddy's Cafe"] },
  { id: "CANTT", n: "Cantt", x: 1.5, z: 0.1, p: 11, band: "16–28",
    tag: "Old Lahore establishment",
    marks: ["Fortress Stadium", "Gaddafi Stadium", "Lahore Gymkhana"],
    eats: ["Cafe Zouk", "Fortress food strip"] },
  { id: "MODEL", n: "Model Town", x: 0.1, z: 1.0, p: 13.25, band: "18–35",
    tag: "Enormous plots, old money",
    marks: ["Model Town Park", "Model Town Link Road", "Central Lahore"],
    eats: ["Model Town Link Road restaurants"] },
  { id: "DHA5", n: "DHA Phase 5", x: 2.5, z: 0.9, p: 14.25, band: "22–35",
    tag: "The most liquid market here",
    marks: ["Y-Block Commercial", "H-Block", "Phase 5 park belt"],
    eats: ["Y-Block restaurants", "Broadway Pizza"] },
  { id: "DHA6", n: "DHA Phase 6", x: 3.3, z: 1.4, p: 8.25, band: "13–20",
    tag: "Where the designer builds are",
    marks: ["Sector C Commercial", "New builds everywhere"],
    eats: ["Phase 6 commercial", "Kababjees"] },
  { id: "DHA8", n: "DHA Phase 7 / 8", x: 4.0, z: 2.1, p: 6.5, band: "10–16",
    tag: "Newer, greener, further",
    marks: ["Air Avenue", "Phase 8 Commercial", "Ring Road access"],
    eats: ["Air Avenue restaurants"] },
  { id: "ASKARI", n: "Askari", x: 2.0, z: -0.3, p: 6.5, band: "10–16",
    tag: "Secure and settled",
    marks: ["Askari X and XI", "Army-managed", "Walk-to-school living"], eats: ["Askari commercial"] },
  { id: "GARDEN", n: "Garden / Faisal Town", x: -0.7, z: 0.6, p: 8, band: "12–20",
    tag: "Central and mature",
    marks: ["Garden Town", "Faisal Town", "Kalma Chowk"], eats: ["Faisal Town food street"] },
  { id: "JOHAR", n: "Johar Town", x: -1.6, z: 0.9, p: 6, band: "9–15",
    tag: "Everything within reach",
    marks: ["Emporium Mall", "Expo Centre", "Doctors Hospital"],
    eats: ["Emporium food court", "Johar Town commercial"] },
  { id: "WAPDA", n: "Wapda Town", x: -2.2, z: 1.7, p: 5, band: "8–13",
    tag: "Solid family value",
    marks: ["Wapda Town roundabouts", "Valencia next door"], eats: ["Wapda Town commercial"] },
  { id: "BAHRIA_L", n: "Bahria Town", x: -3.2, z: 2.6, p: 6, band: "9–15",
    tag: "A city inside the city",
    marks: ["Grand Jamia Mosque", "Eiffel Tower replica", "Takht-e-Lahore"],
    eats: ["Bahria commercial", "Cinegold food court"] },
  { id: "LAKECITY", n: "Lake City", x: -2.6, z: 3.4, p: 5.75, band: "9–14",
    tag: "Best yield in Lahore",
    marks: ["Lake City Golf & Country Club", "Raiwind Road"], eats: ["Lake City commercial"] },
  { id: "EME", n: "EME / Raiwind Rd", x: -3.6, z: 1.6, p: 4.8, band: "8–12",
    tag: "Motorway side",
    marks: ["EME Society", "Motorway access", "Ring Road"], eats: ["EME commercial"] },
  { id: "WALLED", n: "Walled City", x: 0.8, z: -2.4, p: 0, band: null,
    tag: "Where Lahore began", park: true,
    marks: ["Badshahi Mosque", "Lahore Fort", "Fort Road Food Street"],
    eats: ["Cuckoo's Den", "Andaaz", "Haveli Restaurant"] }
];

/* Tier → colour. Deliberately a single warm ramp rather than a rainbow: the
   point is "how expensive", and a hue scale would read as "different kinds". */
const TIER = {
  1: { c: 0x3d6fa8, label: "Under PKR 2M / marla" },
  2: { c: 0x3f9e9e, label: "PKR 2–4M / marla" },
  3: { c: 0x6fae5c, label: "PKR 4–7M / marla" },
  4: { c: 0xd9b23c, label: "PKR 7–11M / marla" },
  5: { c: 0xe08a3c, label: "PKR 11–16M / marla" },
  6: { c: 0xd8503f, label: "PKR 16M+ / marla" },
  7: { c: 0x8d8fa3, label: "Commercial / institutional" },
  8: { c: 0x4e9b5f, label: "Park / heritage" }
};

/* Band is derived from the price rather than stored beside it, so the colour
   on the map can never drift out of step with the figure in the panel. */
function tierOf(d) {
  if (d.park) return 8;
  if (d.commercial || !d.p) return 7;
  if (d.p < 2) return 1;
  if (d.p < 4) return 2;
  if (d.p < 7) return 3;
  if (d.p < 11) return 4;
  if (d.p < 16) return 5;
  return 6;
}
const WA = "16134083945";
const SP = 7.2;          // grid spacing, world units

/* ============================================================

/* ============================================================
   RENDERER — a map seen from the air
   ------------------------------------------------------------
   The first version put each sector on its own floating slab over
   a black void, which read as a chart rather than a city. This
   draws the whole thing as one continuous piece of ground: a map
   painted into a canvas texture (terrain, parks, water, the road
   network, and a price tint per sector) with real buildings and
   trees standing on top of it, lit like daylight and viewed from
   the air.
   ============================================================ */
let renderer, scene, camera, root, composer, bloom;
let ground = null, hi = null, labels = [], rects = [], ray;
let pointer = new THREE.Vector2();
let city = "isb", selected = null, hovered = null;
let running = false, raf = 0, ready = false;
let yaw = -0.5, targetYaw = -0.5, pitch = 0.98, dist = 120, targetDist = 120;
let dragging = false, lastX = 0, lastY = 0, moved = 0, pinch = 0;

const cv = () => document.getElementById("cityCanvas");

function rnd(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/* Where each area sits, in world units. */
function place(d) {
  if (city === "isb") return { x: (11 - d.col) * SP, z: (d.row - 2.6) * SP, w: SP * 0.88, h: SP * 0.88 };
  return { x: d.x * SP * 0.95, z: d.z * SP * 0.8, w: SP * 0.95, h: SP * 0.95 };
}

/* ============================================================
   THE MAP TEXTURE
   Painted in world coordinates so the ground, the buildings and
   the hit testing all agree about where things are.
   ============================================================ */
const PAL = {
  land:  "#e3dcc7",
  land2: "#d2c9ae",
  green: "#9fc084",
  green2:"#77a45f",
  crop:  "#c3cf94",
  crop2: "#aebf7d",
  water: "#4f97c4",
  road:  "#ffffff",
  roadc: "#b8ae94",
  arter: "#ffd977",
  arterc:"#c9a04a"
};
const TINT = {
  1: "rgba(61,111,168,0.62)",
  2: "rgba(63,158,158,0.62)",
  3: "rgba(111,174,92,0.62)",
  4: "rgba(217,178,60,0.70)",
  5: "rgba(224,138,60,0.76)",
  6: "rgba(216,80,63,0.80)",
  7: "rgba(141,143,163,0.52)",
  8: "rgba(78,155,95,0.80)"
};

let MAP = null;   // { minX, minZ, w, h, px }

function worldBounds(data) {
  let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
  data.forEach((d) => {
    const p = place(d);
    minX = Math.min(minX, p.x - p.w); maxX = Math.max(maxX, p.x + p.w);
    minZ = Math.min(minZ, p.z - p.h); maxZ = Math.max(maxZ, p.z + p.h);
  });
  const pad = SP * 4.5;
  return { minX: minX - pad, maxX: maxX + pad, minZ: minZ - pad, maxZ: maxZ + pad };
}

function mapTexture(data) {
  const b = worldBounds(data);
  const w = b.maxX - b.minX, h = b.maxZ - b.minZ;
  const px = Math.min(2048 / Math.max(w, h), 26);       // pixels per world unit
  const W = Math.round(w * px), H = Math.round(h * px);
  MAP = { minX: b.minX, minZ: b.minZ, w: w, h: h, px: px };

  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  const X = (x) => (x - b.minX) * px;
  const Z = (z) => (z - b.minZ) * px;
  const r = rnd(city === "isb" ? 91 : 47);

  // --- land, with enough mottling that it doesn't read as flat paper ---
  g.fillStyle = PAL.land; g.fillRect(0, 0, W, H);

  // Scrub and tree cover first, farmland over it — drawn the other way round
  // the fields disappeared under 600 soft green blobs.
  for (let i = 0; i < 520; i++) {
    g.fillStyle = r() > 0.45 ? PAL.green : PAL.green2;
    g.globalAlpha = 0.10 + r() * 0.2;
    g.beginPath();
    g.arc(r() * W, r() * H, 14 + r() * 90, 0, 6.2832);
    g.fill();
  }
  // Farmland: the country around both cities is a patchwork of small fields,
  // and blocks of crop colour do far more for the aerial read than soft blur.
  for (let i = 0; i < 340; i++) {
    g.save();
    g.translate(r() * W, r() * H);
    g.rotate(r() * 1.6 - 0.8);
    g.globalAlpha = 0.5 + r() * 0.4;
    const pick = r();
    g.fillStyle = pick > 0.66 ? PAL.crop : pick > 0.33 ? PAL.crop2 : PAL.land2;
    g.fillRect(0, 0, (14 + r() * 46) * px * 0.4, (10 + r() * 30) * px * 0.4);
    g.restore();
  }
  g.globalAlpha = 1;

  // --- terrain features ---
  if (city === "isb") {
    // Margalla foothills along the north edge
    const grad = g.createLinearGradient(0, 0, 0, Z(-SP * 3.4));
    grad.addColorStop(0, "#5f8f4c"); grad.addColorStop(1, "rgba(119,164,95,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, W, Z(-SP * 3.4));
    // Rawal Lake, out to the east
    g.fillStyle = PAL.water;
    g.beginPath();
    g.ellipse(X(52), Z(2), 46 * px * 0.34, 20 * px * 0.34, -0.5, 0, 6.2832);
    g.fill();
  } else {
    // The Ravi runs north-west of the city, and the canal is a thin diagonal
    // through it. The first version had both several times too wide, crossing
    // in a blue X straight over the middle of Lahore.
    g.fillStyle = PAL.water;
    g.save();
    g.translate(X(-38), Z(-8)); g.rotate(-0.4);
    g.fillRect(-3.2 * px, -55 * px, 6.4 * px, 110 * px);
    g.restore();
    g.strokeStyle = PAL.water; g.lineWidth = 1.5 * px; g.lineCap = "round";
    g.beginPath();
    g.moveTo(X(-26), Z(22)); g.quadraticCurveTo(X(0), Z(5), X(28), Z(-11));
    g.stroke();
  }

  // --- the road network -------------------------------------------------
  // Each area is joined to the two nearest others. On Islamabad's grid that
  // reproduces the avenues almost exactly; in Lahore it gives the organic
  // web the city actually has.
  const pts = data.map((d) => { const p = place(d); return { x: p.x, z: p.z, t: tierOf(d), d: d }; });
  const links = [];
  pts.forEach((a, i) => {
    const near = pts.map((b2, j) => ({ j: j, dd: (a.x - b2.x) ** 2 + (a.z - b2.z) ** 2 }))
      .filter((o) => o.j !== i).sort((p1, p2) => p1.dd - p2.dd).slice(0, 3);
    near.forEach((o) => {
      const key = i < o.j ? i + "-" + o.j : o.j + "-" + i;
      if (!links.some((l) => l.key === key)) links.push({ key: key, a: a, b: pts[o.j] });
    });
  });
  const drawLinks = (colour, width) => {
    g.strokeStyle = colour; g.lineWidth = width * px; g.lineCap = "round"; g.lineJoin = "round";
    links.forEach((l) => {
      g.beginPath(); g.moveTo(X(l.a.x), Z(l.a.z)); g.lineTo(X(l.b.x), Z(l.b.z)); g.stroke();
    });
  };
  drawLinks(PAL.roadc, 1.5);     // casing
  drawLinks(PAL.road, 1.0);      // carriageway

  // one named arterial across each city, drawn heavier
  g.strokeStyle = PAL.arterc; g.lineWidth = 3.0 * px;
  g.beginPath();
  if (city === "isb") { g.moveTo(X(-40), Z(-4)); g.lineTo(X(48), Z(10)); }
  else { g.moveTo(X(-40), Z(20)); g.lineTo(X(40), Z(-14)); }
  g.stroke();
  g.strokeStyle = PAL.arter; g.lineWidth = 2.2 * px; g.stroke();

  // --- sector plots, tinted by price ---
  data.forEach((d) => {
    const p = place(d);
    const x0 = X(p.x - p.w / 2), z0 = Z(p.z - p.h / 2);
    const ww = p.w * px, hh = p.h * px;
    g.save();
    g.beginPath();
    g.roundRect(x0, z0, ww, hh, 6 * px * 0.5);
    if (d.park) g.fillStyle = PAL.green2;
    else { g.fillStyle = PAL.land; g.fill(); g.fillStyle = TINT[tierOf(d)]; }
    g.fill();
    // plot grain: the fine street pattern inside a sector
    if (!d.park) {
      g.clip();
      g.strokeStyle = "rgba(255,255,255,0.26)"; g.lineWidth = 0.24 * px;
      for (let k = 1; k < 7; k++) {
        g.beginPath(); g.moveTo(x0 + (ww / 7) * k, z0); g.lineTo(x0 + (ww / 7) * k, z0 + hh); g.stroke();
        g.beginPath(); g.moveTo(x0, z0 + (hh / 7) * k); g.lineTo(x0 + ww, z0 + (hh / 7) * k); g.stroke();
      }
    }
    g.restore();
    g.strokeStyle = "rgba(120,110,90,0.35)"; g.lineWidth = 0.5 * px;
    g.beginPath(); g.roundRect(x0, z0, ww, hh, 6 * px * 0.5); g.stroke();
  });

  // Feather the outer band back to flat land so the sheet dissolves into the
  // country around it instead of ending on a visible seam.
  const fade = Math.round(Math.min(W, H) * 0.16);
  const edges = [
    [0, 0, fade, H, "l"], [W - fade, 0, fade, H, "r"],
    [0, 0, W, fade, "t"], [0, H - fade, W, fade, "b"]
  ];
  edges.forEach(([x, y, w2, h2, side]) => {
    const gr = side === "l" ? g.createLinearGradient(x + w2, 0, x, 0)
             : side === "r" ? g.createLinearGradient(x, 0, x + w2, 0)
             : side === "t" ? g.createLinearGradient(0, y + h2, 0, y)
             : g.createLinearGradient(0, y, 0, y + h2);
    gr.addColorStop(0, "rgba(223,216,198,0)");
    gr.addColorStop(1, "rgba(223,216,198,1)");
    g.fillStyle = gr;
    g.fillRect(x, y, w2, h2);
  });

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ============================================================
   SCENE
   ============================================================ */
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
  renderer.toneMappingExposure = 1.12;

  scene = new THREE.Scene();
  // A gradient sky rather than a flat fill — the horizon is what tells you
  // you're looking at ground from the air.
  const sky = document.createElement("canvas");
  sky.width = 8; sky.height = 256;
  const sg = sky.getContext("2d");
  const grd = sg.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, "#4b86c4");
  grd.addColorStop(0.55, "#9dc4e2");
  grd.addColorStop(1, "#e6ddc8");
  sg.fillStyle = grd; sg.fillRect(0, 0, 8, 256);
  const skyTex = new THREE.CanvasTexture(sky);
  skyTex.colorSpace = THREE.SRGBColorSpace;
  scene.background = skyTex;
  scene.fog = new THREE.Fog(0xd7dfd4, 320, 620);

  camera = new THREE.PerspectiveCamera(38, 1, 0.5, 700);
  root = new THREE.Group();
  scene.add(root);

  // Daylight: a strong warm sun with a cool sky fill is what makes an aerial
  // read as a photograph rather than a diagram.
  scene.add(new THREE.HemisphereLight(0xdfeaf7, 0x9a9a8d, 1.15));
  const sun = new THREE.DirectionalLight(0xfff0cf, 2.9);
  sun.position.set(60, 110, 48);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const s = 120;
  sun.shadow.camera.left = -s; sun.shadow.camera.right = s;
  sun.shadow.camera.top = s; sun.shadow.camera.bottom = -s;
  sun.shadow.camera.far = 320;
  sun.shadow.bias = -0.0007;
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0xcfe0f0, 0.55));

  ray = new THREE.Raycaster();
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
  if (composer) composer.setSize(w, h);
  if (bloom) bloom.resolution.set(w, h);
}

/* ---------- map-style labels ---------- */
function labelSprite(text, tier, sub) {
  const fs = 44, sf = 30, pad = 20;
  const c = document.createElement("canvas");
  let g = c.getContext("2d");
  g.font = "700 " + fs + "px Inter, system-ui, sans-serif";
  const w1 = g.measureText(text).width;
  g.font = "500 " + sf + "px Inter, system-ui, sans-serif";
  const w2 = sub ? g.measureText(sub).width : 0;
  c.width = Math.ceil(Math.max(w1, w2)) + pad * 2;
  c.height = fs + (sub ? sf + 8 : 0) + pad * 2;
  g = c.getContext("2d");

  g.fillStyle = "rgba(255,255,255,0.93)";
  g.beginPath(); g.roundRect(0, 0, c.width, c.height, 18); g.fill();
  g.strokeStyle = tier >= 4 ? "rgba(191,140,40,0.85)" : "rgba(90,100,120,0.35)";
  g.lineWidth = 3; g.stroke();

  g.textAlign = "center";
  g.fillStyle = "#20262f";
  g.font = "700 " + fs + "px Inter, system-ui, sans-serif";
  g.textBaseline = "top";
  g.fillText(text, c.width / 2, pad - 2);
  if (sub) {
    g.fillStyle = tier >= 4 ? "#8a6114" : "#5c6674";
    g.font = "500 " + sf + "px Inter, system-ui, sans-serif";
    g.fillText(sub, c.width / 2, pad + fs + 4);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  sp.scale.set((c.width / c.height) * 3.4, 3.4, 1);
  sp.renderOrder = 20;
  return sp;
}

/* ---------- build ---------- */
function clearCity() {
  while (root.children.length) {
    const o = root.children.pop();
    o.traverse && o.traverse((n) => {
      if (n.geometry) n.geometry.dispose();
      if (n.material) (Array.isArray(n.material) ? n.material : [n.material]).forEach((m) => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
    });
  }
  labels = []; rects = []; ground = null; hi = null;
}

function buildCity() {
  clearCity();
  const data = city === "isb" ? ISB : LHR;

  // --- the ground, wearing the map ---
  const tex = mapTexture(data);
  ground = new THREE.Mesh(
    new THREE.PlaneGeometry(MAP.w, MAP.h),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.96, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(MAP.minX + MAP.w / 2, 0, MAP.minZ + MAP.h / 2);
  ground.receiveShadow = true;
  root.add(ground);

  // The map is a finite sheet; without country around it you can see it end
  // in mid-air. This runs the land out past the horizon, where the fog takes
  // over, and sits a hair lower so it never z-fights the map.
  const around = new THREE.Mesh(
    new THREE.PlaneGeometry(MAP.w * 6, MAP.h * 6),
    new THREE.MeshStandardMaterial({ color: 0xdfd8c6, roughness: 1, metalness: 0 })
  );
  around.rotation.x = -Math.PI / 2;
  around.position.set(ground.position.x, -0.06, ground.position.z);
  around.receiveShadow = true;
  root.add(around);

  // --- relief: the Margallas actually rise out of the map ---
  if (city === "isb") {
    // A band of foothills, not a mountain range: at full height they swallowed
    // the city they're supposed to sit behind.
    const hills = new THREE.Group();
    const r = rnd(11);
    for (let i = 0; i < 30; i++) {
      const hgt = 3.5 + r() * 7;
      const m = new THREE.Mesh(
        new THREE.ConeGeometry(4 + r() * 5, hgt, 6),
        new THREE.MeshStandardMaterial({ color: 0x8fa877, roughness: 1, flatShading: true })
      );
      m.position.set(MAP.minX + 4 + i * (MAP.w / 30) + r() * 4,
                     hgt / 2 - 1.2,
                     MAP.minZ + 3 + r() * 7);
      m.rotation.y = r() * 3;
      m.castShadow = true; m.receiveShadow = true;
      hills.add(m);
    }
    root.add(hills);
  }

  // --- buildings and trees, both instanced ---
  const boxes = [], trees = [];
  data.forEach((d, di) => {
    const p = place(d);
    const seed = rnd(di * 733 + 29);
    rects.push({ d: d, x: p.x, z: p.z, w: p.w, h: p.h });

    if (d.park) {
      for (let i = 0; i < 46; i++) {
        trees.push({ x: p.x + (seed() - 0.5) * p.w * 0.92,
                     z: p.z + (seed() - 0.5) * p.h * 0.92,
                     s: 0.7 + seed() * 0.7 });
      }
      return;
    }

    // Density and height both rise with price, which is what makes the
    // expensive parts of the city legible from the air.
    const n = d.commercial ? 46 : 26 + tierOf(d) * 9;
    for (let i = 0; i < n; i++) {
      const base = d.commercial ? 3.6 : 0.85 + tierOf(d) * 0.44;
      boxes.push({
        x: p.x + (seed() - 0.5) * p.w * 0.86,
        z: p.z + (seed() - 0.5) * p.h * 0.86,
        w: 0.42 + seed() * 0.72,
        d: 0.42 + seed() * 0.72,
        h: base * (0.5 + seed() * 1.35),
        tone: seed()
      });
    }
    for (let i = 0; i < 12; i++) {
      trees.push({ x: p.x + (seed() - 0.5) * p.w * 0.95,
                   z: p.z + (seed() - 0.5) * p.h * 0.95,
                   s: 0.5 + seed() * 0.5 });
    }
  });

  const bMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ roughness: 0.78, metalness: 0.04 }),
    boxes.length
  );
  bMesh.castShadow = true; bMesh.receiveShadow = true;
  const m4 = new THREE.Matrix4(), col = new THREE.Color();
  boxes.forEach((b, i) => {
    m4.makeScale(b.w, b.h, b.d);
    m4.setPosition(b.x, b.h / 2, b.z);
    bMesh.setMatrixAt(i, m4);
    // Sand, cream, grey and the occasional painted block — a flat off-white
    // city reads as polystyrene from this height.
    if (b.tone > 0.86) col.setHSL(0.55, 0.16, 0.66);        // cool grey-blue
    else if (b.tone > 0.72) col.setHSL(0.11, 0.30, 0.70);   // warm sand
    else col.setHSL(0.09 + b.tone * 0.05, 0.10 + b.tone * 0.18, 0.66 + b.tone * 0.22);
    bMesh.setColorAt(i, col);
  });
  bMesh.instanceMatrix.needsUpdate = true;
  if (bMesh.instanceColor) bMesh.instanceColor.needsUpdate = true;
  root.add(bMesh);

  // Terracotta roofs on the low-rise. Almost all of both cities is two and
  // three storey, and from the air the roofs are most of the colour you see.
  const lows = boxes.filter((b) => b.h < 3.4);
  const rMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0 }),
    lows.length
  );
  rMesh.castShadow = true;
  lows.forEach((b, i) => {
    m4.makeScale(b.w * 1.1, 0.16, b.d * 1.1);
    m4.setPosition(b.x, b.h + 0.06, b.z);
    rMesh.setMatrixAt(i, m4);
    col.setHSL(0.045 + b.tone * 0.02, 0.42 + b.tone * 0.2, 0.38 + b.tone * 0.14);
    rMesh.setColorAt(i, col);
  });
  rMesh.instanceMatrix.needsUpdate = true;
  if (rMesh.instanceColor) rMesh.instanceColor.needsUpdate = true;
  root.add(rMesh);

  const tMesh = new THREE.InstancedMesh(
    new THREE.ConeGeometry(0.5, 1.3, 6),
    new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }),
    trees.length
  );
  tMesh.castShadow = true;
  trees.forEach((t, i) => {
    m4.makeScale(t.s, t.s * (1 + t.s * 0.4), t.s);
    m4.setPosition(t.x, t.s * 0.7, t.z);
    tMesh.setMatrixAt(i, m4);
    col.setHSL(0.24 + t.s * 0.06, 0.34 + t.s * 0.18, 0.26 + t.s * 0.14);
    tMesh.setColorAt(i, col);
  });
  tMesh.instanceMatrix.needsUpdate = true;
  if (tMesh.instanceColor) tMesh.instanceColor.needsUpdate = true;
  root.add(tMesh);

  // --- selection ring, one mesh moved around ---
  hi = new THREE.Mesh(
    new THREE.RingGeometry(0.86, 1, 48),
    new THREE.MeshBasicMaterial({ color: 0xc9a45c, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  hi.rotation.x = -Math.PI / 2;
  hi.renderOrder = 5;
  root.add(hi);

  // --- labels ---
  data.forEach((d, di) => {
    const p = place(d);
    const sp = labelSprite(d.n, tierOf(d), d.p > 0 ? "PKR " + d.p.toFixed(1) + "M / marla" : null);
    sp.userData.lift = 7.2 + (di % 3) * 3.1;   // three levels: two weren't enough in the DHA run
    sp.position.set(p.x, sp.userData.lift, p.z);
    root.add(sp);
    labels.push(sp);
  });

  root.rotation.y = 0;

  // Frame the built-up area, not the sheet of ground it sits on — fitting the
  // whole plane shrank the city to a smudge in the middle of a field.
  let bx0 = 1e9, bx1 = -1e9, bz0 = 1e9, bz1 = -1e9;
  rects.forEach((r) => {
    bx0 = Math.min(bx0, r.x - r.w); bx1 = Math.max(bx1, r.x + r.w);
    bz0 = Math.min(bz0, r.z - r.h); bz1 = Math.max(bz1, r.z + r.h);
  });
  const bw = bx1 - bx0, bh = bz1 - bz0;
  const diag = Math.sqrt(bw * bw + bh * bh);
  targetDist = dist = Math.min(230, (diag / 2) / Math.tan((38 * Math.PI / 180) / 2) * 0.94);
  // …and look at the middle of the city rather than the middle of the plane.
  root.position.set(-(bx0 + bw / 2), 0, -(bz0 + bh / 2));
  selected = null;
  select(data.filter((x) => x.id === (city === "isb" ? "F-7" : "GULBERG3"))[0] || data[0]);
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
    pitch = Math.max(0.42, Math.min(1.45, pitch + dy * 0.004));
    lastX = e.clientX; lastY = e.clientY;
  });
  c.addEventListener("pointerup", () => { if (dragging && moved < 6) pick(); dragging = false; });
  c.addEventListener("pointercancel", () => { dragging = false; });
  c.addEventListener("wheel", (e) => {
    e.preventDefault();
    targetDist = Math.max(38, Math.min(260, targetDist + e.deltaY * 0.12));
  }, { passive: false });
  c.addEventListener("touchstart", (e) => { if (e.touches.length === 2) pinch = gap(e); }, { passive: true });
  c.addEventListener("touchmove", (e) => {
    if (e.touches.length !== 2) return;
    const g2 = gap(e);
    if (g2 && pinch) { targetDist = Math.max(38, Math.min(260, targetDist * (pinch / g2))); pinch = g2; }
  }, { passive: true });
  function gap(e) {
    const [a, b] = e.touches;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }
}

/* The ground is one mesh now, so a hit is resolved by asking which sector
   rectangle contains the point rather than by hitting a per-sector object. */
function atPointer() {
  if (!ground) return null;
  ray.setFromCamera(pointer, camera);
  const hit = ray.intersectObject(ground, false)[0];
  if (!hit) return null;
  const lp = root.worldToLocal(hit.point.clone());
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    if (Math.abs(lp.x - r.x) <= r.w / 2 && Math.abs(lp.z - r.z) <= r.h / 2) return r;
  }
  return null;
}

function pick() {
  const r = atPointer();
  if (r) select(r.d);
}

function select(d) {
  selected = d;
  paintPanel(d);
}

/* ---------- panel ---------- */
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
    (d.plots ? '<div class="city-info__price"><span>Typically sold in</span><strong>' +
        d.plots + "</strong></div>" : "") +
    (d.by ? '<div class="city-info__price"><span>Developer</span><strong>' + d.by + "</strong></div>" : "") +
    (d.marks.length ? '<p class="city-info__h">Around here</p><ul>' +
      d.marks.map((m) => "<li>" + m + "</li>").join("") + "</ul>" : "") +
    (d.eats.length ? '<p class="city-info__h">Where you\'d eat</p><ul class="city-info__eats">' +
      d.eats.map((m) => "<li>" + m + "</li>").join("") + "</ul>" : "") +
    '<button class="btn btn--wa city-info__cta" type="button" id="cityWant">' +
      'I want to live here <span class="btn__arrow">→</span></button>';

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

  if (!dragging) targetYaw += 0.0006;
  yaw += (targetYaw - yaw) * 0.07;
  dist += (targetDist - dist) * 0.08;

  camera.position.set(Math.sin(yaw) * dist * Math.cos(pitch),
                      Math.sin(pitch) * dist,
                      Math.cos(yaw) * dist * Math.cos(pitch));
  camera.lookAt(0, 0, 0);

  if (!dragging) {
    const r = atPointer();
    if (r !== hovered) {
      hovered = r;
      cv().style.cursor = hovered ? "pointer" : "grab";
    }
  }

  const mark = hovered || (selected && rects.filter((r) => r.d.id === selected.id)[0]);
  if (hi) {
    if (mark) {
      const s = Math.max(mark.w, mark.h) * 0.78;
      hi.position.set(mark.x, 0.12, mark.z);
      hi.scale.set(s, s, 1);
      hi.material.opacity += (0.95 - hi.material.opacity) * 0.16;
    } else {
      hi.material.opacity += (0 - hi.material.opacity) * 0.16;
    }
  }

  // Labels thin out as you pull back, the way map labels do, so the dense
  // middle of the city doesn't turn into a wall of pills.
  const k = Math.max(0, Math.min(1, (200 - dist) / 90));
  labels.forEach((sp, i) => {
    const r = rects[i];
    const keep = r && (tierOf(r.d) >= 4 || r.d.commercial || k > 0.45 ||
                       (selected && r.d.id === selected.id));
    const want = keep ? Math.min(1, 0.35 + k) : 0;
    sp.material.opacity += (want - sp.material.opacity) * 0.12;
    sp.visible = sp.material.opacity > 0.03;
  });

  renderer.render(scene, camera);
}

function start() { if (!running && ready) { running = true; loop(); } }
function stop() { running = false; cancelAnimationFrame(raf); }

/* ---------- chrome ---------- */
function legend() {
  const el = document.getElementById("cityLegend");
  if (!el) return;
  el.innerHTML = [6, 5, 4, 3, 2, 1].map((k) =>
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
        if (!initScene()) { section.classList.add("city--no3d"); io.disconnect(); return; }
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

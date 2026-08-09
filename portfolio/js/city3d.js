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
  { id: "GULBERG3", n: "Gulberg III", x: 0.6, z: -0.4, p: 18.25, band: "28–45",
    tag: "Lahore's prestige address",
    marks: ["MM Alam Road", "Liberty Market", "Main Boulevard"],
    eats: ["Cafe Aylanto", "Cosa Nostra", "Butt Karahi", "Freddy's Cafe"] },
  { id: "CANTT", n: "Cantt", x: 1.8, z: 0.2, p: 11, band: "16–28",
    tag: "Old Lahore establishment",
    marks: ["Fortress Stadium", "Gaddafi Stadium", "Lahore Gymkhana"],
    eats: ["Cafe Zouk", "Fortress food strip"] },
  { id: "MODEL", n: "Model Town", x: 0.2, z: 1.2, p: 13.25, band: "18–35",
    tag: "Enormous plots, old money",
    marks: ["Model Town Park", "Model Town Link Road", "Central Lahore"],
    eats: ["Model Town Link Road restaurants"] },
  { id: "DHA5", n: "DHA Phase 5", x: 2.6, z: 1.5, p: 14.25, band: "22–35",
    tag: "The most liquid market here",
    marks: ["Y-Block Commercial", "H-Block", "Phase 5 park belt"],
    eats: ["Y-Block restaurants", "Broadway Pizza"] },
  { id: "DHA6", n: "DHA Phase 6", x: 3.6, z: 2.3, p: 8.25, band: "13–20",
    tag: "Where the designer builds are",
    marks: ["Sector C Commercial", "New builds everywhere"],
    eats: ["Phase 6 commercial", "Kababjees"] },
  { id: "DHA8", n: "DHA Phase 7 / 8", x: 4.4, z: 3.2, p: 6.5, band: "10–16",
    tag: "Newer, greener, further",
    marks: ["Air Avenue", "Phase 8 Commercial", "Ring Road access"],
    eats: ["Air Avenue restaurants"] },
  { id: "ASKARI", n: "Askari", x: 2.9, z: -0.9, p: 6.5, band: "10–16",
    tag: "Secure and settled",
    marks: ["Askari X and XI", "Army-managed", "Walk-to-school living"], eats: ["Askari commercial"] },
  { id: "GARDEN", n: "Garden / Faisal Town", x: -0.9, z: 0.7, p: 8, band: "12–20",
    tag: "Central and mature",
    marks: ["Garden Town", "Faisal Town", "Kalma Chowk"], eats: ["Faisal Town food street"] },
  { id: "JOHAR", n: "Johar Town", x: -2.0, z: 0.9, p: 6, band: "9–15",
    tag: "Everything within reach",
    marks: ["Emporium Mall", "Expo Centre", "Doctors Hospital"],
    eats: ["Emporium food court", "Johar Town commercial"] },
  { id: "WAPDA", n: "Wapda Town", x: -2.2, z: 2.0, p: 5, band: "8–13",
    tag: "Solid family value",
    marks: ["Wapda Town roundabouts", "Valencia next door"], eats: ["Wapda Town commercial"] },
  { id: "BAHRIA_L", n: "Bahria Town", x: -2.8, z: 4.0, p: 6, band: "9–15",
    tag: "A city inside the city",
    marks: ["Grand Jamia Mosque", "Eiffel Tower replica", "Takht-e-Lahore"],
    eats: ["Bahria commercial", "Cinegold food court"] },
  { id: "LAKECITY", n: "Lake City", x: -1.6, z: 3.4, p: 5.75, band: "9–14",
    tag: "Best yield in Lahore",
    marks: ["Lake City Golf & Country Club", "Raiwind Road"], eats: ["Lake City commercial"] },
  { id: "EME", n: "EME / Raiwind Rd", x: -3.4, z: 1.3, p: 4.8, band: "8–12",
    tag: "Motorway side",
    marks: ["EME Society", "Motorway access", "Ring Road"], eats: ["EME commercial"] },
  { id: "WALLED", n: "Walled City", x: 0.2, z: -3.0, p: 0, band: null,
    tag: "Where Lahore began", park: true,
    marks: ["Badshahi Mosque", "Lahore Fort", "Fort Road Food Street"],
    eats: ["Cuckoo's Den", "Andaaz", "Haveli Restaurant"] }
];

/* Tier → colour. Deliberately a single warm ramp rather than a rainbow: the
   point is "how expensive", and a hue scale would read as "different kinds". */
const TIER = {
  1: { c: 0x3d6fa8, label: "Under 20 Lac / marla" },
  2: { c: 0x3f9e9e, label: "20–40 Lac / marla" },
  3: { c: 0x6fae5c, label: "40–70 Lac / marla" },
  4: { c: 0xd9b23c, label: "70 Lac–1.1 Cr / marla" },
  5: { c: 0xe08a3c, label: "1.1–1.6 Cr / marla" },
  6: { c: 0xd8503f, label: "1.6 Cr+ / marla" },
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

/* Crore is how prices are actually spoken here, so it leads. Anything under a
   crore reads better in lac than as a fraction of one. Input is PKR millions. */
function pkr(m) {
  const cr = m / 10;
  if (cr >= 1) return "PKR " + (cr >= 10 ? cr.toFixed(1) : cr.toFixed(2)).replace(/\.?0+$/, "") + " Crore";
  return "PKR " + (m * 10).toFixed(m * 10 < 10 ? 1 : 0) + " Lac";
}
const SP = 7.2;          // grid spacing, world units

/* ============================================================
   RENDERER — a city seen from the air
   ------------------------------------------------------------
   Two things drive every decision below.

   First, selection has to be unmistakable. Ray-casting a 3D scene
   is the obvious way to answer "what did they tap", and it is the
   wrong one here: the sectors are flat plates seen at a slant, so
   a ray aimed at one plate passes over its neighbours and the
   answer depends on invisible geometry. Picking is done in screen
   space instead — each sector's footprint is projected to the
   pixels it actually occupies and the tap is tested against that.
   What you see is what you hit, by construction.

   Second, a still picture of coloured blocks is a chart. Traffic
   on the roads, cloud shadow crossing the ground, the sector you
   are pointing at rising out of the map: those are what make it
   read as a place.
   ============================================================ */
let renderer, scene, camera, root, composer, bloom, ssao, sun;
let ground = null, sectors = [], ray, cars = null, clouds = null;
let city = "isb", selected = null, hovered = null, pressed = null;
let running = false, raf = 0, ready = false;
let yaw = -0.5, targetYaw = -0.5, pitch = 0.98, dist = 120, targetDist = 120;
let dragging = false, lastX = 0, lastY = 0, moved = 0, pinch = 0;
let fitDist = 120;            // the distance the city was framed at
let drift = true;             // slow auto-orbit, until the visitor takes over
let clock = 0;                // seconds since boot — the animation clock
let hoverNDC = null;          // last mouse position, null on touch
let frame = 0;

const cv = () => document.getElementById("cityCanvas");
const hasHover = () => matchMedia("(hover: hover) and (pointer: fine)").matches;

function rnd(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/* Where each area sits, in world units. */
function place(d) {
  if (city === "isb") return { x: (11 - d.col) * SP, z: (d.row - 2.6) * SP, w: SP * 0.88, h: SP * 0.88 };
  // Districts sit closer together than Islamabad's sectors do, so the plates
  // are drawn smaller than their spacing — touching, they hid the road network
  // between them and left the whole city reading as one undifferentiated mass.
  return { x: d.x * SP * 1.02, z: d.z * SP * 0.86, w: SP * 0.8, h: SP * 0.8 };
}

/* ============================================================
   THE MAP TEXTURE
   Painted in world coordinates so the ground, the buildings and
   the hit testing all agree about where things are.
   ============================================================ */
/* Two looks, because they answer different questions.

   Daylight is the survey: where the sectors are, what the land between them
   does, how the grid actually sits under the Margallas. Night is the one
   people remember — the price bands stop being a legend and become the colour
   the ground is glowing, every block lights its windows, and the traffic turns
   into a river of light down the avenues. The section lives on a near-black
   page, and a bright noon aerial was always fighting it. */
const LOOKS = {
  day: {
    land: "#ded5bb", land2: "#c9bf9f",
    green: "#8fb872", green2: "#5f9550",
    crop: "#b9cd85", crop2: "#9db86a",
    built: "#cfc7b2", water: "#2f86bd",
    road: "#fdfcf8", roadc: "#a89c7e",
    arter: "#ffcf5e", arterc: "#b98d2f",
    ridge: "#4a783e",
    tint: {
      1: "rgba(45,105,175,0.72)", 2: "rgba(38,160,160,0.72)",
      3: "rgba(96,180,78,0.72)",  4: "rgba(228,181,40,0.80)",
      5: "rgba(238,133,38,0.84)", 6: "rgba(226,64,46,0.88)",
      7: "rgba(132,136,160,0.60)", 8: "rgba(60,152,78,0.88)"
    },
    sky: [[0, "#1d5fa8"], [0.42, "#5f9ed2"], [0.78, "#b7d3e6"], [1, "#efe4cc"]],
    fog: 0xc3d6e4, fogNear: 300, fogFar: 900,
    hemi: [0xbcd9f5, 0x7a7255, 0.72],
    sun: [0xfff2d2, 3.4, 72, 96, 40],
    amb: [0xbdd2e6, 0.26],
    exposure: 1.02,
    bloom: [0.3, 0.65, 0.9],
    surround: 0xd8d0bb,
    glow: 0,            // how much the ground emits its own light
    windows: 0,         // lit windows
    plinthIdle: 0.08, plinthHover: 0.28, plinthSel: 0.5,
    carLight: false, clouds: true,
    treeL: [0.25, 0.4, 0.2], hillL: [0.25, 0.3, 0.2]
  },
  night: {
    land: "#12151d", land2: "#0e1119",
    green: "#0d1712", green2: "#091310",
    crop: "#141a16", crop2: "#101511",
    built: "#1e2331", water: "#050e1c",
    road: "#ffe6ad", roadc: "#241d10",
    arter: "#ffd15e", arterc: "#332510",
    ridge: "#0a1410",
    tint: {
      1: "rgba(52,120,224,0.92)", 2: "rgba(34,196,196,0.92)",
      3: "rgba(104,214,86,0.92)", 4: "rgba(255,201,44,0.95)",
      5: "rgba(255,140,36,0.96)", 6: "rgba(255,64,46,0.98)",
      7: "rgba(150,158,200,0.72)", 8: "rgba(46,150,80,0.9)"
    },
    sky: [[0, "#03050c"], [0.5, "#0a1226"], [0.85, "#1d2742"], [1, "#3a3145"]],
    fog: 0x0a1120, fogNear: 240, fogFar: 860,
    hemi: [0x2b3d63, 0x05070d, 0.5],
    sun: [0x9db6e4, 0.5, 60, 120, 30],
    amb: [0x16203a, 0.34],
    exposure: 1.3,
    bloom: [0.82, 0.72, 0.5],
    surround: 0x0b0e16,
    glow: 0.95,
    windows: 2.2,
    plinthIdle: 0.55, plinthHover: 0.85, plinthSel: 1.25,
    carLight: true, clouds: false,
    treeL: [0.3, 0.35, 0.07], hillL: [0.3, 0.2, 0.1]
  }
};
let look = "day";
const L = () => LOOKS[look];

let MAP = null;   // { minX, minZ, w, h, px, links, cx, cz, r }

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

/* The road network. Every area is joined to its three nearest neighbours,
   which on Islamabad's grid reproduces the avenues almost exactly and in
   Lahore gives the organic web the city actually has. Computed once and kept,
   because the traffic drives along the same segments the map is painted with. */
function roadLinks(data) {
  const pts = data.map((d) => { const p = place(d); return { x: p.x, z: p.z, d: d }; });
  const links = [];
  pts.forEach((a, i) => {
    pts.map((b, j) => ({ j: j, dd: (a.x - b.x) ** 2 + (a.z - b.z) ** 2 }))
      .filter((o) => o.j !== i).sort((p1, p2) => p1.dd - p2.dd).slice(0, 3)
      .forEach((o) => {
        const key = i < o.j ? i + "-" + o.j : o.j + "-" + i;
        if (!links.some((l) => l.key === key)) links.push({ key: key, a: a, b: pts[o.j] });
      });
  });
  return links;
}

function mapTexture(data) {
  const P = L();
  const b = worldBounds(data);
  const w = b.maxX - b.minX, h = b.maxZ - b.minZ;
  const px = Math.min(2048 / Math.max(w, h), 26);       // pixels per world unit
  const W = Math.round(w * px), H = Math.round(h * px);
  const links = roadLinks(data);

  // Centre and radius of the built-up area — used to fade the city out into
  // countryside rather than ending it on a line.
  let cx = 0, cz = 0;
  data.forEach((d) => { const p = place(d); cx += p.x; cz += p.z; });
  cx /= data.length; cz /= data.length;
  let rad = 0;
  data.forEach((d) => { const p = place(d); rad = Math.max(rad, Math.hypot(p.x - cx, p.z - cz)); });

  MAP = { minX: b.minX, minZ: b.minZ, w: w, h: h, px: px, links: links, cx: cx, cz: cz, r: rad };

  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  const X = (x) => (x - b.minX) * px;
  const Z = (z) => (z - b.minZ) * px;
  const r = rnd(city === "isb" ? 91 : 47);

  g.fillStyle = P.land; g.fillRect(0, 0, W, H);

  // Scrub and tree cover first, farmland over it — drawn the other way round
  // the fields disappear under 600 soft green blobs.
  for (let i = 0; i < 520; i++) {
    g.fillStyle = r() > 0.45 ? P.green : P.green2;
    g.globalAlpha = 0.12 + r() * 0.24;
    g.beginPath();
    g.arc(r() * W, r() * H, 14 + r() * 90, 0, 6.2832);
    g.fill();
  }
  // Farmland: the country around both cities is a patchwork of small fields,
  // and blocks of crop colour do far more for the aerial read than soft blur.
  for (let i = 0; i < 420; i++) {
    g.save();
    g.translate(r() * W, r() * H);
    g.rotate(r() * 1.6 - 0.8);
    g.globalAlpha = 0.55 + r() * 0.4;
    const pick = r();
    g.fillStyle = pick > 0.66 ? P.crop : pick > 0.33 ? P.crop2 : P.land2;
    g.fillRect(0, 0, (14 + r() * 46) * px * 0.4, (10 + r() * 30) * px * 0.4);
    g.restore();
  }
  g.globalAlpha = 1;

  // The built-up wash. Cities don't stop at the edge of a numbered sector —
  // without this the sectors read as islands floating in farmland, which is
  // exactly what the first version looked like from above.
  const bu = g.createRadialGradient(X(cx), Z(cz), rad * px * 0.15, X(cx), Z(cz), rad * px * 1.02);
  const wash = look === "day" ? "207,199,178" : "38,44,60";
  bu.addColorStop(0, "rgba(" + wash + ",0.55)");
  bu.addColorStop(0.62, "rgba(" + wash + ",0.3)");
  bu.addColorStop(1, "rgba(" + wash + ",0)");
  g.fillStyle = bu;
  g.fillRect(0, 0, W, H);

  // --- terrain features ---
  if (city === "isb") {
    // Margalla foothills along the north edge
    // Only a hint on the map — the ridge itself is geometry, and painting it
    // solid as well left a flat green wedge sitting behind real hills.
    const grad = g.createLinearGradient(0, 0, 0, Z(-SP * 2.8));
    const rg = look === "day" ? ["74,120,62", "123,166,98", "143,184,114"]
                              : ["8,14,12", "12,20,16", "14,24,18"];
    grad.addColorStop(0, "rgba(" + rg[0] + ",0.85)");
    grad.addColorStop(0.55, "rgba(" + rg[1] + ",0.5)");
    grad.addColorStop(1, "rgba(" + rg[2] + ",0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, W, Z(-SP * 3.6));
    // Rawal Lake, east of the city. It used to be an ellipse the size of a
    // sector; it's a reservoir in a valley, so it's drawn long and narrow.
    g.fillStyle = P.water;
    g.save();
    g.translate(X(46), Z(6)); g.rotate(-0.7);
    g.beginPath(); g.ellipse(0, 0, 9 * px, 2.6 * px, 0, 0, 6.2832); g.fill();
    g.beginPath(); g.ellipse(7 * px, 3 * px, 5 * px, 1.8 * px, 0.6, 0, 6.2832); g.fill();
    g.restore();
  } else {
    // The Ravi curls round the north-west of the city, just beyond the Walled
    // City — which is why the old city is where it is. Drawn as a bowed band
    // running north-east to south-west rather than a straight rule.
    g.strokeStyle = P.water; g.lineWidth = 2.4 * px; g.lineCap = "round";
    g.beginPath();
    g.moveTo(X(26), Z(-46));
    g.bezierCurveTo(X(2), Z(-34), X(-16), Z(-32), X(-44), Z(-14));
    g.stroke();
    // The BRB canal cuts the other way, north-east to south-west across the
    // city — Jallo down to Thokar, past Gulberg and Model Town.
    g.strokeStyle = P.water; g.lineWidth = 1.4 * px;
    g.beginPath();
    g.moveTo(X(34), Z(-22));
    g.quadraticCurveTo(X(4), Z(0), X(-30), Z(16));
    g.stroke();
  }

  // --- the road network ---
  const drawLinks = (colour, width) => {
    g.strokeStyle = colour; g.lineWidth = width * px; g.lineCap = "round"; g.lineJoin = "round";
    links.forEach((l) => {
      g.beginPath(); g.moveTo(X(l.a.x), Z(l.a.z)); g.lineTo(X(l.b.x), Z(l.b.z)); g.stroke();
    });
  };
  drawLinks(P.roadc, 1.35);    // casing
  drawLinks(P.road, 0.85);     // carriageway

  // one named arterial across each city, drawn heavier — but a road, not a
  // runway: the first version laid a yellow band a sector wide over the city.
  g.strokeStyle = P.arterc; g.lineWidth = 1.9 * px; g.lineCap = "round";
  g.beginPath();
  if (city === "isb") { g.moveTo(X(-40), Z(-4)); g.lineTo(X(48), Z(10)); }
  // Lahore's is Ferozepur Road: out of the old city, south past Model Town.
  else { g.moveTo(X(4), Z(-22)); g.lineTo(X(-14), Z(30)); }
  g.stroke();
  g.strokeStyle = P.arter; g.lineWidth = 1.25 * px; g.stroke();

  // --- sector plots, tinted by price ---
  data.forEach((d) => {
    const p = place(d);
    const x0 = X(p.x - p.w / 2), z0 = Z(p.z - p.h / 2);
    const ww = p.w * px, hh = p.h * px;
    g.save();
    g.beginPath();
    g.roundRect(x0, z0, ww, hh, 3 * px);
    if (d.park) g.fillStyle = P.green2;
    else { g.fillStyle = P.built; g.fill(); g.fillStyle = P.tint[tierOf(d)]; }
    g.fill();
    // plot grain: the fine street pattern inside a sector
    if (!d.park) {
      g.clip();
      // At night the streets inside a sector are the lit part, not the plots
      g.strokeStyle = look === "day" ? "rgba(255,255,255,0.3)" : "rgba(255,226,168,0.5)";
      g.lineWidth = 0.22 * px;
      for (let k = 1; k < 7; k++) {
        g.beginPath(); g.moveTo(x0 + (ww / 7) * k, z0); g.lineTo(x0 + (ww / 7) * k, z0 + hh); g.stroke();
        g.beginPath(); g.moveTo(x0, z0 + (hh / 7) * k); g.lineTo(x0 + ww, z0 + (hh / 7) * k); g.stroke();
      }
    }
    g.restore();
    g.strokeStyle = look === "day" ? "rgba(60,54,40,0.4)" : "rgba(255,226,168,0.34)";
    g.lineWidth = 0.45 * px;
    g.beginPath(); g.roundRect(x0, z0, ww, hh, 3 * px); g.stroke();
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
    const edge = look === "day" ? "216,208,187" : "10,13,21";
    gr.addColorStop(0, "rgba(" + edge + ",0)");
    gr.addColorStop(1, "rgba(" + edge + ",1)");
    g.fillStyle = gr;
    g.fillRect(x, y, w2, h2);
  });

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* A soft, tiling cloud field. Used as the alpha of a plane high over the city
   so real shadow drifts across the ground — the single cheapest thing that
   makes an aerial look like it was filmed rather than drawn. */
function cloudTexture() {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const g = c.getContext("2d");
  g.fillStyle = "#000"; g.fillRect(0, 0, S, S);
  const r = rnd(613);
  g.globalCompositeOperation = "lighter";
  // Few and large, with real gaps between them. Dense small ones average out
  // into an even grey film over the whole map, which is haze, not weather.
  for (let i = 0; i < 26; i++) {
    const x = r() * S, y = r() * S, rad = 40 + r() * 88;
    // drawn nine times on a 3×3 wrap so the texture tiles without a seam
    for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
      const gr = g.createRadialGradient(x + ox * S, y + oy * S, 0, x + ox * S, y + oy * S, rad);
      gr.addColorStop(0, "rgba(255,255,255,0.55)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr;
      g.fillRect(x + ox * S - rad, y + oy * S - rad, rad * 2, rad * 2);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/* Rows of lit windows, used as the emissive map on every block. One texture
   for the whole city: the boxes are all the same geometry, so the pattern
   stretches to whatever shape a building is, which at this height is exactly
   what a lit tower looks like. Two thirds of the windows are dark, because a
   building with every light on reads as a lightbox. */
let winTex = null;
function windowTexture() {
  if (winTex) return winTex;
  const W = 64, H = 128, cols = 4, rows = 9;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  // Not black: a block from a mile up is mostly its own facade catching the
  // glow off the street, with windows picked out of it.
  g.fillStyle = "#1a1408"; g.fillRect(0, 0, W, H);
  const r = rnd(2207);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    if (r() > 0.6) continue;
    g.fillStyle = "rgba(255," + Math.round(196 + r() * 46) + "," + Math.round(126 + r() * 80) +
      "," + (0.7 + r() * 0.3).toFixed(2) + ")";
    g.fillRect((x + 0.15) * W / cols, (y + 0.2) * H / rows, (W / cols) * 0.7, (H / rows) * 0.56);
  }
  winTex = new THREE.CanvasTexture(c);
  winTex.colorSpace = THREE.SRGBColorSpace;
  return winTex;
}

function skyTexture() {
  const sky = document.createElement("canvas");
  sky.width = 8; sky.height = 256;
  const sg = sky.getContext("2d");
  const grd = sg.createLinearGradient(0, 0, 0, 256);
  L().sky.forEach(([at, col]) => grd.addColorStop(at, col));
  sg.fillStyle = grd; sg.fillRect(0, 0, 8, 256);
  const t = new THREE.CanvasTexture(sky);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* Everything that changes between day and night but doesn't need the city
   rebuilding: sky, haze, the three lights, exposure and bloom. */
function applyLook() {
  const P = L();
  if (scene.background) scene.background.dispose();
  scene.background = skyTexture();
  scene.fog.color.setHex(P.fog);
  scene.fog.near = P.fogNear;
  scene.fog.far = P.fogFar;
  hemi.color.setHex(P.hemi[0]); hemi.groundColor.setHex(P.hemi[1]); hemi.intensity = P.hemi[2];
  sun.color.setHex(P.sun[0]); sun.intensity = P.sun[1];
  sun.position.set(P.sun[2], P.sun[3], P.sun[4]);
  amb.color.setHex(P.amb[0]); amb.intensity = P.amb[1];
  renderer.toneMappingExposure = P.exposure;
  if (bloom) { bloom.strength = P.bloom[0]; bloom.radius = P.bloom[1]; bloom.threshold = P.bloom[2]; }
}

/* ============================================================
   SCENE
   ============================================================ */
let hemi, amb;
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
  renderer.toneMappingExposure = 1.02;

  scene = new THREE.Scene();
  // Haze, not milk. The previous fog started close enough to drain the colour
  // out of half the city.
  scene.fog = new THREE.Fog(0xc3d6e4, 300, 900);

  camera = new THREE.PerspectiveCamera(38, 1, 0.5, 1400);
  root = new THREE.Group();
  scene.add(root);

  // Late-afternoon light: one hard warm sun, a cool sky fill, and very little
  // else. Flat ambient is what made the first pass look like a paper model.
  // At night all three drop away and the city lights its own windows.
  hemi = new THREE.HemisphereLight(0xbcd9f5, 0x7a7255, 0.72);
  scene.add(hemi);
  sun = new THREE.DirectionalLight(0xfff2d2, 3.4);
  sun.position.set(72, 96, 40);
  sun.castShadow = true;
  const sm = innerWidth >= 1024 ? 4096 : 2048;
  sun.shadow.mapSize.set(sm, sm);
  const s = 130;
  sun.shadow.camera.left = -s; sun.shadow.camera.right = s;
  sun.shadow.camera.top = s; sun.shadow.camera.bottom = -s;
  sun.shadow.camera.far = 340;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  amb = new THREE.AmbientLight(0xbdd2e6, 0.26);
  scene.add(amb);
  applyLook();

  // Bloom and ambient occlusion. AO is what stops a procedural city looking
  // like a pile of clean boxes — it puts real shade down every street and in
  // every corner. Desktop only; on a phone the passes cost more than they add.
  const beefy = innerWidth >= 1024 && (navigator.hardwareConcurrency || 4) >= 4;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && innerWidth > 700) {
    Promise.all([
      import("./vendor/three/postprocessing/EffectComposer.js"),
      import("./vendor/three/postprocessing/RenderPass.js"),
      import("./vendor/three/postprocessing/UnrealBloomPass.js"),
      import("./vendor/three/postprocessing/OutputPass.js"),
      beefy ? import("./vendor/three/postprocessing/SSAOPass.js") : Promise.resolve(null)
    ]).then(([EC, RP, UB, OP, SS]) => {
      const w = cv().clientWidth, h = cv().clientHeight;
      composer = new EC.EffectComposer(renderer);
      composer.addPass(new RP.RenderPass(scene, camera));
      if (SS) {
        ssao = new SS.SSAOPass(scene, camera, w, h);
        ssao.kernelRadius = 1.6;
        ssao.minDistance = 0.0018;
        ssao.maxDistance = 0.14;
        composer.addPass(ssao);
      }
      const bp = L().bloom;
      bloom = new UB.UnrealBloomPass(new THREE.Vector2(w, h), bp[0], bp[1], bp[2]);
      composer.addPass(bloom);
      composer.addPass(new OP.OutputPass());
      resize();
    }).catch(() => { composer = null; ssao = null; });
  }

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
  if (ssao) ssao.setSize(w, h);
}

/* ---------- map-style labels ---------- */
function labelSprite(text, tier, sub) {
  const fs = 46, sf = 30, pad = 20;
  // White map pills are right in daylight and wrong at night, where three
  // dozen of them become the brightest thing on screen and bury the city.
  const dark = look === "night";
  const c = document.createElement("canvas");
  let g = c.getContext("2d");
  g.font = "800 " + fs + "px Inter, system-ui, sans-serif";
  const w1 = g.measureText(text).width;
  g.font = "600 " + sf + "px Inter, system-ui, sans-serif";
  const w2 = sub ? g.measureText(sub).width : 0;
  c.width = Math.ceil(Math.max(w1, w2)) + pad * 2;
  c.height = fs + (sub ? sf + 8 : 0) + pad * 2;
  g = c.getContext("2d");

  g.fillStyle = dark ? "rgba(9,13,22,0.86)" : "rgba(255,255,255,0.96)";
  g.beginPath(); g.roundRect(0, 0, c.width, c.height, 16); g.fill();
  g.strokeStyle = dark ? (tier >= 4 ? "rgba(255,206,110,0.75)" : "rgba(170,190,220,0.35)")
                       : (tier >= 4 ? "rgba(176,124,26,0.9)" : "rgba(60,72,92,0.4)");
  g.lineWidth = 3; g.stroke();

  g.textAlign = "center";
  g.fillStyle = dark ? "#f3eee3" : "#141a22";
  g.font = "800 " + fs + "px Inter, system-ui, sans-serif";
  g.textBaseline = "top";
  g.fillText(text, c.width / 2, pad - 2);
  if (sub) {
    g.fillStyle = dark ? (tier >= 4 ? "#ffcf76" : "#a8b6c8")
                       : (tier >= 4 ? "#8a6114" : "#4a5666");
    g.font = "600 " + sf + "px Inter, system-ui, sans-serif";
    g.fillText(sub, c.width / 2, pad + fs + 4);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  // On a phone these were bigger than the sectors they name, covering the
  // very thing you were trying to tap.
  const k = innerWidth < 700 ? 2.1 : 2.7;
  sp.scale.set((c.width / c.height) * k, k, 1);
  sp.renderOrder = 20;
  sp.userData.aspect = c.width / c.height;
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
  sectors = []; ground = null; cars = null; clouds = null;
}

/* One sector, built as its own group standing at the origin of its plot.
   Grouping matters: it is what lets a sector rise out of the map with its
   buildings, its trees and its label all together when you point at it. */
function buildSector(d, di) {
  const p = place(d);
  const seed = rnd(di * 733 + 29);
  const tier = tierOf(d);
  const P = L();
  const g = new THREE.Group();
  g.position.set(p.x, 0, p.z);

  const base = new THREE.Color(TIER[tier].c);
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(p.w, 0.6, p.h),
    new THREE.MeshStandardMaterial({
      color: base, roughness: 0.85, metalness: 0.05,
      emissive: base.clone().multiplyScalar(P.plinthIdle)
    })
  );
  plinth.position.y = 0.28;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  g.add(plinth);

  // A thin gold edge that lights up on the chosen sector. Sitting just proud
  // of the plinth, it draws the outline of the actual plot rather than a ring
  // around it, so there is never a question about which one is live.
  const rim = new THREE.Mesh(
    new THREE.BoxGeometry(p.w * 1.06, 0.78, p.h * 1.06),
    new THREE.MeshBasicMaterial({ color: 0xffd483, transparent: true, opacity: 0,
      depthWrite: false, toneMapped: false })
  );
  rim.position.y = 0.3;
  rim.renderOrder = 3;
  rim.visible = false;
  g.add(rim);

  // The shaft of light over the chosen sector: built into every sector and
  // faded up on the live one, rather than a single marker repositioned each
  // frame. Owned by the plot, it has no coordinates to get wrong. Hidden
  // outright at zero opacity, so the thirty-five that aren't lit cost nothing.
  //
  // There was a gold ring on the ground here too, and it's gone on purpose:
  // the site draws its own gold ring for the mouse cursor, so a second one
  // lying on the map was the same shape in the same colour meaning something
  // completely different. The rim above traces the actual plot, which says
  // what the ring said and says it about the right shape.
  const sc = Math.max(p.w, p.h) * 0.66;
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 1, 13, 28, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xffc659, transparent: true, opacity: 0,
      side: THREE.DoubleSide, depthWrite: false, toneMapped: false,
      blending: THREE.AdditiveBlending })
  );
  beam.position.y = 7.1;
  beam.scale.set(sc * 0.42, 1, sc * 0.42);
  beam.visible = false;
  g.add(beam);

  const boxes = [], trees = [];
  if (d.park) {
    for (let i = 0; i < 46; i++) {
      trees.push({ x: (seed() - 0.5) * p.w * 0.92, z: (seed() - 0.5) * p.h * 0.92, s: 0.7 + seed() * 0.7 });
    }
  } else {
    // Density and height both rise with price, which is what makes the
    // expensive parts of the city legible from the air.
    const n = d.commercial ? 52 : 30 + tier * 10;
    for (let i = 0; i < n; i++) {
      const bh = d.commercial ? 3.8 : 0.85 + tier * 0.46;
      boxes.push({
        x: (seed() - 0.5) * p.w * 0.86,
        z: (seed() - 0.5) * p.h * 0.86,
        w: 0.42 + seed() * 0.72,
        d: 0.42 + seed() * 0.72,
        h: bh * (0.5 + seed() * 1.35),
        tone: seed()
      });
    }
    for (let i = 0; i < 12; i++) {
      trees.push({ x: (seed() - 0.5) * p.w * 0.95, z: (seed() - 0.5) * p.h * 0.95, s: 0.5 + seed() * 0.5 });
    }
  }

  const m4 = new THREE.Matrix4(), col = new THREE.Color();
  if (boxes.length) {
    const bMesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        roughness: 0.76, metalness: 0.05,
        emissive: P.windows ? 0xffffff : 0x000000,
        emissiveMap: P.windows ? windowTexture() : null,
        emissiveIntensity: P.windows
      }),
      boxes.length
    );
    bMesh.castShadow = true; bMesh.receiveShadow = true;
    boxes.forEach((b, i) => {
      m4.makeScale(b.w, b.h, b.d);
      m4.setPosition(b.x, 0.58 + b.h / 2, b.z);
      bMesh.setMatrixAt(i, m4);
      // Sand, cream, grey and the occasional painted block — a flat off-white
      // city reads as polystyrene from this height. After dark the concrete
      // goes almost black so the lit windows are the only thing you read.
      if (P.windows) col.setHSL(0.6, 0.22, 0.05 + b.tone * 0.05);
      else if (b.tone > 0.86) col.setHSL(0.55, 0.18, 0.62);
      else if (b.tone > 0.72) col.setHSL(0.11, 0.34, 0.66);
      else col.setHSL(0.09 + b.tone * 0.05, 0.12 + b.tone * 0.2, 0.6 + b.tone * 0.24);
      bMesh.setColorAt(i, col);
    });
    bMesh.instanceMatrix.needsUpdate = true;
    if (bMesh.instanceColor) bMesh.instanceColor.needsUpdate = true;
    g.add(bMesh);

    // Terracotta roofs on the low-rise. Almost all of both cities is two and
    // three storey, and from the air the roofs are most of the colour you see.
    // Daylight only: after dark an unlit roof cap over every building is a
    // black lid on the one surface the window light was coming from, and the
    // sectors went darker than the countryside around them.
    const lows = P.windows ? [] : boxes.filter((b) => b.h < 3.4);
    if (lows.length) {
      const rMesh = new THREE.InstancedMesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0 }),
        lows.length
      );
      rMesh.castShadow = true;
      lows.forEach((b, i) => {
        m4.makeScale(b.w * 1.1, 0.16, b.d * 1.1);
        m4.setPosition(b.x, 0.58 + b.h + 0.06, b.z);
        rMesh.setMatrixAt(i, m4);
        if (P.windows) col.setHSL(0.04, 0.3, 0.06 + b.tone * 0.04);
        else col.setHSL(0.038 + b.tone * 0.02, 0.5 + b.tone * 0.2, 0.36 + b.tone * 0.14);
        rMesh.setColorAt(i, col);
      });
      rMesh.instanceMatrix.needsUpdate = true;
      if (rMesh.instanceColor) rMesh.instanceColor.needsUpdate = true;
      g.add(rMesh);
    }
  }

  if (trees.length) {
    const tMesh = new THREE.InstancedMesh(
      new THREE.ConeGeometry(0.5, 1.3, 6),
      new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }),
      trees.length
    );
    tMesh.castShadow = true;
    trees.forEach((t, i) => {
      m4.makeScale(t.s, t.s * (1 + t.s * 0.4), t.s);
      m4.setPosition(t.x, 0.58 + t.s * 0.7, t.z);
      tMesh.setMatrixAt(i, m4);
      col.setHSL(P.treeL[0] + t.s * 0.06, P.treeL[1] + t.s * 0.2, P.treeL[2] + t.s * 0.12);
      tMesh.setColorAt(i, col);
    });
    tMesh.instanceMatrix.needsUpdate = true;
    if (tMesh.instanceColor) tMesh.instanceColor.needsUpdate = true;
    g.add(tMesh);
  }

  const label = labelSprite(d.n, tier, d.p > 0 ? pkr(d.p) + " / marla" : null);
  // Low, just clear of the rooftops. They used to float seven to thirteen
  // units up — further above the plot than the plot is wide — so at this
  // camera angle a sector's name appeared over its neighbour's land, and
  // tapping the name you could see selected somewhere else. That alone
  // explains a good part of "something else gets clicked".
  label.position.set(0, 4.1 + (di % 3) * 1.5, 0);
  g.add(label);

  root.add(g);
  return {
    d: d, g: g, rim: rim, plinth: plinth, label: label, base: base,
    beam: beam,
    x: p.x, z: p.z, w: p.w, h: p.h,
    lift: 0, want: 0
  };
}

/* The country between the sectors. Real cities are continuous; without built
   ground outside the plots, thirty-six coloured plates sit in an empty field
   and the whole thing reads as a board game.

   Scattered evenly it read as debris — a uniform pepper of dark specks over
   a green field. Land gets developed in patches, so this places villages and
   fills them: clumps with edges, which is what the eye expects from the air. */
function buildFill() {
  const r = rnd(city === "isb" ? 5501 : 7717);
  const m4 = new THREE.Matrix4(), col = new THREE.Color();
  const out = [];
  const clumps = 54;
  for (let ci = 0; ci < clumps; ci++) {
    const a = r() * 6.2832;
    // biased inwards, so settlement thins out with distance from the centre
    const rr = (0.34 + Math.pow(r(), 0.65) * 0.78) * MAP.r;
    const cx2 = MAP.cx + Math.cos(a) * rr, cz2 = MAP.cz + Math.sin(a) * rr;
    if (city === "isb" && cz2 < -SP * 2.2) continue;      // that's the Margallas
    const near = 1 - Math.min(1, rr / (MAP.r * 1.12));    // 1 in town, 0 out in the fields
    const spread = 2.2 + r() * 3.4;
    const n = Math.round(10 + near * 34 + r() * 10);
    for (let i = 0; i < n; i++) {
      const x = cx2 + (r() - 0.5) * spread * 2, z = cz2 + (r() - 0.5) * spread * 2;
      if (sectors.some((s) => Math.abs(x - s.x) < s.w * 0.6 && Math.abs(z - s.z) < s.h * 0.6)) continue;
      out.push({ x: x, z: z, w: 0.4 + r() * 0.46, d: 0.4 + r() * 0.46,
                 h: 0.42 + r() * (0.5 + near * 1.1), tone: r() });
    }
  }
  const P = L();
  const mesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
      roughness: 0.88, metalness: 0,
      emissive: P.windows ? 0xffffff : 0x000000,
      emissiveMap: P.windows ? windowTexture() : null,
      emissiveIntensity: P.windows * 0.42
    }),
    out.length
  );
  // They receive shadow but don't cast it: two thousand tiny shadow casters
  // cost real time and only add speckle at this distance.
  mesh.receiveShadow = true;
  out.forEach((b, i) => {
    m4.makeScale(b.w, b.h, b.d);
    m4.setPosition(b.x, b.h / 2, b.z);
    mesh.setMatrixAt(i, m4);
    // Warm brick and whitewash, not snow. At 0.6+ lightness across the board
    // these read as scattered white grit over a green field.
    if (P.windows) col.setHSL(0.6, 0.2, 0.05);
    else if (b.tone > 0.62) col.setHSL(0.045, 0.44, 0.36 + b.tone * 0.1);   // terracotta
    else col.setHSL(0.1 + b.tone * 0.04, 0.18 + b.tone * 0.14, 0.48 + b.tone * 0.24);
    mesh.setColorAt(i, col);
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  root.add(mesh);
}

/* Traffic. A few hundred cars running the same segments the roads were
   painted along — at this scale they're specks, and they're the difference
   between a model of a city and a city. */
function buildTraffic() {
  const links = MAP.links.filter((l) => Math.hypot(l.a.x - l.b.x, l.a.z - l.b.z) > 2);
  if (!links.length) return;
  const r = rnd(3307);
  const N = innerWidth < 700 ? 120 : 260;
  const list = [];
  for (let i = 0; i < N; i++) {
    const l = links[Math.floor(r() * links.length)];
    list.push({ l: l, u: r(), v: (0.04 + r() * 0.05) / Math.hypot(l.a.x - l.b.x, l.a.z - l.b.z),
                dir: r() > 0.5 ? 1 : -1, off: (r() > 0.5 ? 1 : -1) * 0.26 });
  }
  const P = L();
  // After dark you don't see cars from a mile up, you see headlights and tail
  // lights — so they become unlit emissive specks and the bloom pass turns
  // the avenues into streams of white going one way and red coming back.
  const mesh = new THREE.InstancedMesh(
    P.carLight ? new THREE.BoxGeometry(0.8, 0.16, 0.3)
               : new THREE.BoxGeometry(0.52, 0.2, 0.26),
    P.carLight ? new THREE.MeshBasicMaterial({ toneMapped: false })
               : new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.35 }),
    N
  );
  const col = new THREE.Color();
  list.forEach((c, i) => {
    const t = r();
    if (P.carLight) {
      // which way it's going decides the colour, the way it does from the air
      if (c.dir > 0) col.setRGB(1.5, 1.4, 1.0); else col.setRGB(1.6, 0.24, 0.14);
    } else if (t > 0.9) col.setHSL(0.02, 0.75, 0.48);   // the odd red one
    else if (t > 0.78) col.setHSL(0.6, 0.4, 0.34);      // dark blue
    else if (t > 0.5) col.setHSL(0, 0, 0.22);           // black
    else col.setHSL(0.1, 0.08, 0.86);                   // white and silver
    mesh.setColorAt(i, col);
  });
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.castShadow = !P.carLight;
  root.add(mesh);
  cars = { mesh: mesh, list: list, m4: new THREE.Matrix4(),
           q: new THREE.Quaternion(), up: new THREE.Vector3(0, 1, 0),
           v3: new THREE.Vector3(), sc: new THREE.Vector3(1, 1, 1) };
}

/* Cloud shadow, laid on the ground rather than hung in the air. Flown as a
   plane above the city it veiled the whole view in grey haze — from this
   angle you were looking through it, not down at what it darkened. On the
   deck it does the one job it's there for: soft shade drifting across the
   map, which is what tells you the light is real. */
function buildClouds() {
  if (!L().clouds) return;
  const tex = cloudTexture();
  tex.repeat.set(3.2, 3.2);
  clouds = new THREE.Mesh(
    new THREE.PlaneGeometry(MAP.w * 1.6, MAP.h * 1.6),
    new THREE.MeshBasicMaterial({
      color: 0x1e3b57, alphaMap: tex, transparent: true, opacity: 0.22,
      depthWrite: false, fog: true
    })
  );
  clouds.rotation.x = -Math.PI / 2;
  clouds.position.set(MAP.minX + MAP.w / 2, 0.07, MAP.minZ + MAP.h / 2);
  clouds.renderOrder = 2;
  root.add(clouds);
}

function buildCity() {
  clearCity();
  const data = city === "isb" ? ISB : LHR;

  // --- the ground, wearing the map ---
  const P = L();
  const tex = mapTexture(data);
  // At night the map lights itself: the same texture drives emission, so the
  // roads, the markaz streets and the price bands glow while the fields stay
  // dark. It's the cheapest way to get a real city-lights read, and the bloom
  // pass does the rest.
  ground = new THREE.Mesh(
    new THREE.PlaneGeometry(MAP.w, MAP.h),
    new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.95, metalness: 0,
      emissive: P.glow ? 0xffffff : 0x000000,
      emissiveMap: P.glow ? tex : null,
      emissiveIntensity: P.glow
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(MAP.minX + MAP.w / 2, 0, MAP.minZ + MAP.h / 2);
  ground.receiveShadow = true;
  root.add(ground);

  // The map is a finite sheet; without country around it you can see it end
  // in mid-air. This runs the land out past the horizon, where the haze takes
  // over, and sits a hair lower so it never z-fights the map.
  const around = new THREE.Mesh(
    new THREE.PlaneGeometry(MAP.w * 8, MAP.h * 8),
    new THREE.MeshStandardMaterial({ color: P.surround, roughness: 1, metalness: 0 })
  );
  around.rotation.x = -Math.PI / 2;
  around.position.set(ground.position.x, -0.06, ground.position.z);
  around.receiveShadow = true;
  root.add(around);

  // --- relief: the Margallas actually rise out of the map ---
  if (city === "isb") {
    // A ridge, not a row of cones. Three overlapping ranks, the back one
    // taller and hazier, is what reads as depth — a single line of separate
    // green pyramids reads as a hedge. One instanced mesh, so it's free.
    const r = rnd(11);
    const N = 150;
    const hills = new THREE.InstancedMesh(
      new THREE.ConeGeometry(1, 1, 7, 1),
      new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }),
      N
    );
    hills.castShadow = true; hills.receiveShadow = true;
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(),
          up = new THREE.Vector3(0, 1, 0), v3 = new THREE.Vector3(),
          sc = new THREE.Vector3(), col = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const rank = i % 3;                       // 0 nearest the city, 2 furthest back
      const hgt = 5 + rank * 5 + r() * (7 + rank * 5);
      const rad = 4.5 + r() * 5 + rank * 1.5;
      sc.set(rad, hgt, rad * (0.7 + r() * 0.6));
      v3.set(MAP.minX + 2 + (i / N) * (MAP.w - 4) + (r() - 0.5) * 7,
             hgt / 2 - 2.2,
             MAP.minZ + 1 - rank * 5.5 + (r() - 0.5) * 5);
      q.setFromAxisAngle(up, r() * 3);
      m4.compose(v3, q, sc);
      hills.setMatrixAt(i, m4);
      // green on the slopes facing the city, greyer and hazier further back
      col.setHSL(P.hillL[0] - rank * 0.02, P.hillL[1] - rank * 0.09 + r() * 0.1,
                 P.hillL[2] + rank * 0.09 * (P.glow ? 0.4 : 1) + r() * 0.1);
      hills.setColorAt(i, col);
    }
    hills.instanceMatrix.needsUpdate = true;
    if (hills.instanceColor) hills.instanceColor.needsUpdate = true;
    root.add(hills);
  }

  data.forEach((d, di) => sectors.push(buildSector(d, di)));
  buildFill();
  buildTraffic();
  buildClouds();

  root.rotation.y = 0;

  // Frame the built-up area, not the sheet of ground it sits on — fitting the
  // whole plane shrinks the city to a smudge in the middle of a field.
  let bx0 = 1e9, bx1 = -1e9, bz0 = 1e9, bz1 = -1e9;
  sectors.forEach((r) => {
    bx0 = Math.min(bx0, r.x - r.w); bx1 = Math.max(bx1, r.x + r.w);
    bz0 = Math.min(bz0, r.z - r.h); bz1 = Math.max(bz1, r.z + r.h);
  });
  const bw = bx1 - bx0, bh = bz1 - bz0;
  const diag = Math.sqrt(bw * bw + bh * bh);
  // Closer on a phone. The field of view is vertical, so on a tall narrow
  // canvas the same distance leaves the city as a small island with empty
  // ground all round it — and a small sector is a hard sector to hit.
  const tight = innerWidth < 700 ? 0.62 : 0.8;
  targetDist = dist = fitDist =
    Math.min(230, (diag / 2) / Math.tan((38 * Math.PI / 180) / 2) * tight);
  // …and look at the middle of the city rather than the middle of the plane.
  root.position.set(-(bx0 + bw / 2), 0, -(bz0 + bh / 2));
  selected = null;
  select(data.filter((x) => x.id === (city === "isb" ? "F-7" : "GULBERG3"))[0] || data[0]);
}

/* ============================================================
   PICKING — in screen space, on purpose
   ------------------------------------------------------------
   Ray-casting was the wrong tool. Sectors are flat plates viewed
   at about 55°, so an invisible volume tall enough to cover one
   sector's skyline also covers most of the sector behind it, and
   the ray finds whichever it meets first. That is the "something
   else gets clicked" — geometry you can't see winning over the
   thing you aimed at.

   So: project the four corners of each sector's footprint to the
   pixels it occupies on screen and test the tap against that
   polygon. There is no hidden geometry to get in the way, the
   answer is exactly the shape you can see, and ties go to
   whichever plate is nearer the camera.
   ============================================================ */
const _v = new THREE.Vector3();

function ndcOf(sx, sy, sz) {
  _v.set(sx, sy, sz);
  root.localToWorld(_v);
  _v.project(camera);
  return { x: _v.x, y: _v.y, z: _v.z };
}

/* Standard even-odd crossing test. Four points, so this is nothing. */
function inside(poly, x, y) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    if ((poly[i].y > y) !== (poly[j].y > y) &&
        x < (poly[j].x - poly[i].x) * (y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) hit = !hit;
  }
  return hit;
}

/* The label pill is the biggest, clearest thing on screen. Tapping "F-10"
   picks F-10, which on a phone is most of the fiddliness gone by itself.
   Sprites are screen-aligned, so their box is worked out in screen space too
   rather than raycast — same reasoning as the plates. */
function labelBox(s) {
  const c = ndcOf(s.x, s.g.position.y + s.label.position.y, s.z);
  if (c.z > 1) return null;
  // sprite half-height in NDC: world half-height over the view height at that depth
  const dc = camera.position.distanceTo(_v.set(s.x, s.g.position.y + s.label.position.y, s.z)
    .applyMatrix4(root.matrixWorld));
  const hh = (s.label.scale.y / 2) / (Math.tan((camera.fov * Math.PI / 180) / 2) * dc);
  const hw = hh * s.label.userData.aspect / camera.aspect;
  return { x0: c.x - hw, x1: c.x + hw, y0: c.y - hh, y1: c.y + hh };
}

/* nx, ny are NDC. Returns the sector under that point, or null. */
function hitAt(nx, ny, forgiving) {
  if (!sectors.length) return null;
  root.updateWorldMatrix(true, false);
  camera.updateMatrixWorld();

  // labels first — they sit on top of everything and they're what people aim at
  let bestLabel = null, bestLabelZ = 2;
  for (const s of sectors) {
    if (s.label.material.opacity < 0.35 || !s.label.visible) continue;
    const b = labelBox(s);
    if (!b) continue;
    if (nx >= b.x0 && nx <= b.x1 && ny >= b.y0 && ny <= b.y1) {
      const c = ndcOf(s.x, 0, s.z);
      if (c.z < bestLabelZ) { bestLabelZ = c.z; bestLabel = s; }
    }
  }
  if (bestLabel) return bestLabel;

  // then the plates themselves, nearest to camera winning
  let best = null, bestZ = 2, nearest = null, nearD = Infinity;
  for (const s of sectors) {
    const y = s.g.position.y + 0.6;
    const p = [
      ndcOf(s.x - s.w / 2, y, s.z - s.h / 2),
      ndcOf(s.x + s.w / 2, y, s.z - s.h / 2),
      ndcOf(s.x + s.w / 2, y, s.z + s.h / 2),
      ndcOf(s.x - s.w / 2, y, s.z + s.h / 2)
    ];
    if (p.some((q) => q.z > 1)) continue;                 // behind the camera
    const cz = (p[0].z + p[1].z + p[2].z + p[3].z) / 4;
    if (inside(p, nx, ny)) {
      if (cz < bestZ) { bestZ = cz; best = s; }
      continue;
    }
    // how far off, measured to the centre of the plate on screen
    const c = ndcOf(s.x, y, s.z);
    const d = Math.hypot((nx - c.x) * camera.aspect, ny - c.y);
    if (d < nearD) { nearD = d; nearest = s; }
  }
  if (best) return best;

  // A tap that lands in the street between two plates almost certainly meant
  // one of them — but the reach is in pixels, not world units, so it can never
  // grab a sector on the far side of the map just because the map is tilted.
  if (forgiving && nearest && nearD < 0.055) return nearest;
  return null;
}

function ndcFromEvent(e) {
  const c = cv(), r = c.getBoundingClientRect();
  return { x: ((e.clientX - r.left) / r.width) * 2 - 1,
           y: -((e.clientY - r.top) / r.height) * 2 + 1 };
}

/* ---------- interaction ---------- */
function bind(c) {
  c.addEventListener("pointerdown", (e) => {
    // Capture keeps a drag alive when the finger leaves the canvas. It throws
    // if the pointer isn't active, which must not take the tap down with it.
    try { c.setPointerCapture(e.pointerId); } catch (err) { /* not fatal */ }
    dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY;
    drift = false;                       // the visitor is steering now
    // Answer immediately, against the camera as it is under their finger.
    // Waiting for pointerup meant the answer came from a camera that had
    // drifted since they aimed, and there was no sign anything had happened.
    const n = ndcFromEvent(e);
    pressed = hitAt(n.x, n.y, true);
    hovered = pressed;
  });
  c.addEventListener("pointermove", (e) => {
    if (!dragging) {
      if (hasHover()) hoverNDC = ndcFromEvent(e);
      return;
    }
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    moved += Math.abs(dx) + Math.abs(dy);
    if (moved > 7) pressed = null;       // it's a drag, not a tap
    targetYaw -= dx * 0.006;
    pitch = Math.max(0.42, Math.min(1.45, pitch + dy * 0.004));
    lastX = e.clientX; lastY = e.clientY;
  });
  c.addEventListener("pointerup", (e) => {
    // Re-test at the release point rather than trusting the press: a thumb
    // rolls a few pixels, and the release is where the visitor thinks they hit.
    if (dragging && moved < 7) {
      const n = ndcFromEvent(e);
      const s = hitAt(n.x, n.y, true) || pressed;
      if (s) select(s.d);
    }
    dragging = false; pressed = null;
    if (!hasHover()) hoverNDC = null;    // touch has no hover to leave behind
  });
  c.addEventListener("pointercancel", () => { dragging = false; pressed = null; });
  c.addEventListener("pointerleave", () => { hoverNDC = null; hovered = null; });
  c.addEventListener("wheel", (e) => {
    e.preventDefault();
    drift = false;
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

function select(d, turn) {
  selected = d;
  paintPanel(d);
  const sel = document.getElementById("cityPick");
  if (sel && sel.value !== d.id) sel.value = d.id;
  // Bring the chosen sector to the front of the view if it's a long way round
  // — picking Blue World City from the list and being left staring at F-7 is
  // the sort of thing that reads as the control not working.
  //
  // Only from the list, never from a tap. A sector you tapped is by definition
  // already in front of you, and swinging the camera afterwards moved the map
  // out from under the next tap.
  const s = turn && sectors.filter((x) => x.d.id === d.id)[0];
  if (s && !dragging) {
    const want = Math.atan2(s.x + root.position.x, s.z + root.position.z);
    let turn = (want - targetYaw + Math.PI) % 6.2832;
    if (turn < 0) turn += 6.2832;
    turn -= Math.PI;
    if (Math.abs(turn) > 2.2) targetYaw += turn;
  }
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
        '<div class="city-info__price"><span>Per marla</span><strong>' + pkr(d.p) + "</strong></div>"
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
    if (priced) msg += "Your site shows 1 Kanal there at PKR " + d.band + " Crore (about " +
      pkr(d.p) + " per marla).\n\n";
    msg += "What's actually available right now, and what would you recommend for someone " +
      "looking at this area?";
    if (window.LeadRelay) window.LeadRelay.send(msg);
    else window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });
  box.classList.add("is-on");
}

/* The name and the price under the cursor, before you commit to clicking.
   A 3D scene with no hover state feels dead however good it looks. */
function paintTip(s) {
  const tip = document.getElementById("cityTip");
  if (!tip) return;
  if (!s) { tip.hidden = true; return; }
  root.updateWorldMatrix(true, false);
  const c = ndcOf(s.x, s.g.position.y + 1.6, s.z);
  const el = cv();
  tip.hidden = false;
  tip.style.left = ((c.x * 0.5 + 0.5) * el.clientWidth) + "px";
  tip.style.top = ((-c.y * 0.5 + 0.5) * el.clientHeight) + "px";
  const txt = s.d.n + (s.d.p > 0 ? " · " + pkr(s.d.p) + " / marla" : "");
  if (tip.textContent !== txt) tip.textContent = txt;
}

/* ---------- loop ---------- */
let lastT = 0;
function loop(now) {
  if (!running) return;
  raf = requestAnimationFrame(loop);
  // Parked while the walkable tour holds the screen: that's a fifth WebGL
  // context on this page and nobody can see this one behind the overlay.
  if (window.__tour3dActive) return;
  const ms = now || performance.now();
  const dt = Math.min(0.05, lastT ? (ms - lastT) / 1000 : 0.016);
  lastT = ms;
  clock += dt;
  frame++;

  if (drift && !dragging) targetYaw += dt * 0.036;
  yaw += (targetYaw - yaw) * 0.07;
  dist += (targetDist - dist) * 0.08;

  camera.position.set(Math.sin(yaw) * dist * Math.cos(pitch),
                      Math.sin(pitch) * dist,
                      Math.cos(yaw) * dist * Math.cos(pitch));
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();

  if (!dragging && hoverNDC) {
    const s = hitAt(hoverNDC.x, hoverNDC.y, false);
    if (s !== hovered) {
      hovered = s;
      cv().style.cursor = s ? "pointer" : "grab";
      paintTip(s);
    } else if (s) paintTip(s);
  } else if (!hoverNDC && hovered && !dragging) {
    hovered = null; paintTip(null);
  }

  // Sectors rise when you point at one and stay up while it's the chosen one.
  // This is the response the whole section was missing: something physical
  // happens under your finger the instant you touch it.
  const selId = selected && selected.id;
  sectors.forEach((s) => {
    const isSel = s.d.id === selId;
    const isHov = hovered === s;
    s.want = pressed === s ? 2.4 : isSel ? 1.7 : isHov ? 0.9 : 0;
    s.lift += (s.want - s.lift) * (pressed === s ? 0.4 : 0.16);
    s.g.position.y = s.lift;
    // The gold kerb round the plot is now the whole of the selection mark, so
    // it has to be unambiguous — it breathes on the chosen sector and comes up
    // halfway under the cursor.
    const rimWant = isSel ? 0.92 + Math.sin(clock * 2.4) * 0.08 : isHov ? 0.5 : 0;
    s.rim.material.opacity += (rimWant - s.rim.material.opacity) * 0.2;
    s.rim.visible = s.rim.material.opacity > 0.01;
    const P = L();
    const em = isSel ? P.plinthSel : isHov ? P.plinthHover : P.plinthIdle;
    s.plinth.material.emissive.lerp(s.base.clone().multiplyScalar(em), 0.16);

    // the shaft of light on the live sector
    s.beam.material.opacity +=
      ((isSel ? 0.22 + Math.sin(clock * 2.4) * 0.08 : 0) - s.beam.material.opacity) * 0.16;
    s.beam.visible = s.beam.material.opacity > 0.01;
  });


  // traffic
  if (cars) {
    cars.list.forEach((c, i) => {
      c.u += c.v * c.dir * dt * 12;
      if (c.u > 1) { c.u = 0; } else if (c.u < 0) { c.u = 1; }
      const ax = c.l.a.x, az = c.l.a.z, bx = c.l.b.x, bz = c.l.b.z;
      const dx = bx - ax, dz = bz - az, len = Math.hypot(dx, dz) || 1;
      // sit in the correct lane rather than straddling the centre line
      const nx2 = -dz / len * c.off, nz2 = dx / len * c.off;
      cars.v3.set(ax + dx * c.u + nx2, 0.68, az + dz * c.u + nz2);
      cars.q.setFromAxisAngle(cars.up, Math.atan2(dx * c.dir, dz * c.dir));
      cars.m4.compose(cars.v3, cars.q, cars.sc);
      cars.mesh.setMatrixAt(i, cars.m4);
    });
    cars.mesh.instanceMatrix.needsUpdate = true;
    cars.mesh.visible = dist < 170;      // specks at full zoom-out, so don't pay for them
  }

  if (clouds) {
    const am = clouds.material.alphaMap;
    if (am) { am.offset.x = clock * 0.004; am.offset.y = clock * 0.0022; }
  }

  // Labels thin out as you pull back, the way map labels do, and any label
  // that would land on top of one already placed is dropped. Without the
  // declutter the middle of Islamabad is an unreadable stack of pills.
  const k = Math.max(0, Math.min(1, (fitDist * 1.06 - dist) / (fitDist * 0.5)));
  if (frame % 4 === 0) {
    const placedBoxes = [];
    // most expensive first, so when two collide the one that survives is the
    // one a buyer is more likely to be looking for
    const order = sectors.map((s, i) => ({ s: s, i: i }))
      .sort((a, b) => (b.s.d.id === selId ? 1e6 : tierOf(b.s.d)) - (a.s.d.id === selId ? 1e6 : tierOf(a.s.d)));
    order.forEach(({ s }) => {
      const isSel = s.d.id === selId;
      let keep = isSel || tierOf(s.d) >= 4 || s.d.commercial || k > 0.35;
      if (keep) {
        const b = labelBox(s);
        if (!b) keep = false;
        else if (!isSel && placedBoxes.some((o) =>
          b.x0 < o.x1 && b.x1 > o.x0 && b.y0 < o.y1 && b.y1 > o.y0)) keep = false;
        else placedBoxes.push(b);
      }
      s.label.userData.want = keep ? Math.min(1, 0.8 + k) : 0;
    });
  }
  sectors.forEach((s) => {
    const want = s.label.userData.want || 0;
    // Fast enough that a label is readable or gone. Easing at 0.14 left a
    // dozen of them permanently half-faded and illegible as the view drifted.
    s.label.material.opacity += (want - s.label.material.opacity) * 0.3;
    s.label.visible = s.label.material.opacity > 0.05;
  });

  if (composer) composer.render(); else renderer.render(scene, camera);
}

function start() { if (!running && ready) { running = true; lastT = 0; loop(); } }
function stop() { running = false; cancelAnimationFrame(raf); }

/* ---------- chrome ---------- */
function legend() {
  const el = document.getElementById("cityLegend");
  if (!el) return;
  el.innerHTML = [6, 5, 4, 3, 2, 1].map((k) =>
    '<span class="city-key"><i style="background:#' +
    TIER[k].c.toString(16).padStart(6, "0") + '"></i>' + TIER[k].label + "</span>").join("");
}

/* Populate the jump-to list. Clicking a 3D canvas is not something a keyboard
   or a screen reader can do, and on a phone it's fiddly even with a mouse-free
   thumb — this is the dependable path to any of the 35 areas. */
function fillPicker() {
  const sel = document.getElementById("cityPick");
  if (!sel) return;
  const data = city === "isb" ? ISB : LHR;
  const sorted = data.slice().sort((a, b) => (b.p || 0) - (a.p || 0));
  sel.innerHTML = '<option value="">Jump to an area…</option>' +
    sorted.map((d) => '<option value="' + d.id + '">' + d.n +
      (d.p > 0 ? " — " + pkr(d.p) + " / marla" : "") + "</option>").join("");
}

function setLook(next) {
  if (next === look || !ready) return;
  look = next;
  document.querySelectorAll("[data-city3dlook]").forEach((b) => {
    const on = b.getAttribute("data-city3dlook") === next;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", String(on));
  });
  applyLook();
  // Materials and the map texture are baked per look, so the city is rebuilt —
  // but switching the lights on shouldn't throw away where you were standing
  // or which sector you were reading about.
  const was = selected, y = yaw, ty = targetYaw, pi = pitch, dd = dist, td = targetDist;
  buildCity();
  yaw = y; targetYaw = ty; pitch = pi; dist = dd; targetDist = td;
  if (was) select(was);
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
  hovered = null; pressed = null; hoverNDC = null;
  paintTip(null);
  buildCity();
  fillPicker();
}

/* ---------- boot ---------- */
/* The rest of the page drives the model through this. The neighbourhood
   guides describe six addresses in prose and the model holds thirty-five of
   them in 3D; until now the two didn't know about each other, so a visitor
   reading about DHA had no way through to the block itself. A jump can arrive
   before the section has booted — it lazy-boots on scroll — so it's held and
   applied on the first frame. */
let pending = null;
function jumpTo(which, id) {
  if (which && which !== city) setCity(which);
  const data = city === "isb" ? ISB : LHR;
  const d = data.filter((x) => x.id === id)[0];
  if (d) { drift = false; select(d, true); }
}
window.City3D = {
  show: function (which, id) {
    const section = document.getElementById("city3d");
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    if (ready) jumpTo(which, id);
    else pending = { which: which, id: id };
  }
};

(function boot() {
  const section = document.getElementById("city3d");
  if (!section || !cv()) return;

  document.querySelectorAll("[data-city3d-go]").forEach((b) => {
    const [which, id] = (b.getAttribute("data-city3d-go") || "").split(":");
    b.addEventListener("click", () => window.City3D.show(which, id));
  });

  document.querySelectorAll("[data-city3d]").forEach((b) => {
    b.addEventListener("click", () => setCity(b.getAttribute("data-city3d")));
  });
  document.querySelectorAll("[data-city3dlook]").forEach((b) => {
    b.addEventListener("click", () => setLook(b.getAttribute("data-city3dlook")));
  });

  const sel = document.getElementById("cityPick");
  if (sel) sel.addEventListener("change", () => {
    const data = city === "isb" ? ISB : LHR;
    const d = data.filter((x) => x.id === sel.value)[0];
    if (d) { drift = false; select(d, true); }
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
        fillPicker();
        const l = document.getElementById("cityLoading");
        if (l) l.remove();
      }
      start();
      if (pending) { jumpTo(pending.which, pending.id); pending = null; }
    });
  }, { rootMargin: "220px" });
  io.observe(section);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (ready && section.getBoundingClientRect().top < innerHeight) start();
  });
})();

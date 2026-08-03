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
import { PLOTS, STYLES, FINISHES, KITCHENS, FEATURES, estimate, fmtPKR }
  from "./house-builder.js?v=12";

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
  area: "", status: "own", timing: "3m"
};

let mounted = false;

/* The 3D model, the day/night and spin toggles, "step inside", the virtual
   tour, the share link and the screenshot are all the Design Studio engine in
   js/house-builder.js, rendering into the canvas in this section. This file
   owns the brief; that file owns the picture. Pushing the brief across on
   every change is the only thing that keeps them one design. */
function pushToStudio() {
  stampSpec();
  if (window.HouseBuilder) window.HouseBuilder.apply(brief);
}

/* Names what's on screen, so a size change is unmistakable even at a glance. */
function stampSpec() {
  const el = document.getElementById("ltStamp");
  if (!el) return;
  const storeys = ["", "Single storey", "Double storey", "Triple storey"][brief.storeys] || "";
  el.textContent = [PLOTS[brief.plot].label, storeys, STYLES[brief.style]].filter(Boolean).join(" · ");
}

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
    renderControls(); updateSummary(); pushToStudio();
  }));
  el.querySelectorAll("[data-ltfeature]").forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.ltfeature;
    brief.features[k] = !brief.features[k];
    renderControls(); updateSummary(); pushToStudio();
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
  renderReel(); renderRef(); renderControls(); updateSummary(); pushToStudio();
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

  renderControls(); updateSummary(); pushToStudio();
}

/* ---------- wiring ---------- */
function mount() {
  if (mounted) return;
  mounted = true;
  const send$ = document.getElementById("ltSend");
  if (send$) send$.addEventListener("click", send);
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

  // A shared #design= link is read by the studio at module load. Seeding from
  // reference home 0 would stomp it, so copy it back over the brief instead.
  if (/design=/.test(location.hash) && window.HouseBuilder) {
    const st = window.HouseBuilder.state();
    ["plot", "storeys", "style", "finish", "roof", "kitchen"].forEach((k) => { brief[k] = st[k]; });
    for (const k in FEATURES) brief.features[k] = !!st.features[k];
    renderControls(); updateSummary(); stampSpec();
  }
}
boot();

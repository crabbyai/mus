/* ============================================================
   ADEEL AHMED RAHMAN — LUXURY REAL ESTATE PORTFOLIO
   ============================================================ */

/* Respect the OS "reduce motion" setting: route the whole experience through
   the static (no-anim) path — no smooth-scroll, parallax, cursor or timelines. */
const REDUCED = typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const HAS_GSAP = typeof gsap !== "undefined" && !REDUCED;
const HAS_ST = HAS_GSAP && typeof ScrollTrigger !== "undefined";
const HAS_LENIS = typeof Lenis !== "undefined" && !REDUCED;
if (!HAS_GSAP) document.documentElement.classList.add("no-anim");

/* ---------- SOLD PROPERTIES ---------- */
const PROPERTIES = [
  {
    title: "The Margalla View Manor",
    loc: "F-7/2, Islamabad", city: "islamabad", size: "kanal", sizeLabel: "2 Kanal",
    beds: 7, baths: 8, area: "10,890 sq ft", year: 2025, price: "PKR 38 Crore",
    img: "assets/villas/01-margalla-manor.svg",
    desc: "A landmark double-kanal estate beneath the Margalla Hills — imported Italian marble, a glass-walled drawing room, and a heated infinity pool overlooking Sector F-7's greenest avenue.",
    soldIn: 18, tags: ["Designer Build", "Margalla View", "Basement Theater"],
    features: ["7 Beds Attached Baths", "Heated Infinity Pool", "Imported Italian Marble", "Smart Home", "Servant Quarter", "4-Car Parking"]
  },
  {
    title: "Villa Serena",
    loc: "DHA Phase 2, Islamabad", city: "islamabad", size: "kanal", sizeLabel: "1 Kanal",
    beds: 6, baths: 7, area: "5,400 sq ft", year: 2025, price: "PKR 14.5 Crore",
    img: "assets/villas/02-villa-serena.svg",
    desc: "Contemporary 1 Kanal masterpiece with a floating staircase, home cinema, and a landscaped courtyard that brings golden-hour light into every room. Sold above asking in eleven days.",
    soldIn: 11, tags: ["Brand New", "Double Unit", "Solar Installed"],
    features: ["6 Beds Attached Baths", "Floating Staircase", "Home Cinema", "Solar System Installed", "Double Unit", "Landscaped Courtyard"]
  },
  {
    title: "The Enclave Residence",
    loc: "Bahria Enclave, Islamabad", city: "islamabad", size: "10-marla", sizeLabel: "10 Marla",
    beds: 5, baths: 6, area: "3,250 sq ft", year: 2024, price: "PKR 5.8 Crore",
    img: "assets/villas/03-enclave-residence.svg",
    desc: "A designer 10 Marla with double-height lounge, smart-home automation throughout, and a rooftop terrace framing the Enclave's signature hills.",
    soldIn: 23, tags: ["Designer Build", "Park Face"],
    features: ["5 Beds Attached Baths", "Double-Height Lounge", "Smart Home Automation", "Rooftop Terrace", "Park Face", "Gas Water Electricity"]
  },
  {
    title: "Casa Blanca E-11",
    loc: "E-11/3, Islamabad", city: "islamabad", size: "5-marla", sizeLabel: "5 Marla",
    beds: 4, baths: 4, area: "2,100 sq ft", year: 2024, price: "PKR 3.2 Crore",
    img: "assets/villas/04-casa-blanca.svg",
    desc: "Proof that 5 Marla can feel limitless — white-render façade, Spanish porcelain floors, and a sunken lounge a young diplomat couple fell for at first viewing.",
    soldIn: 9, tags: ["Brand New", "Sun Face", "Investor Rate"],
    features: ["4 Beds Attached Baths", "Spanish Porcelain Floors", "Sunken Lounge", "Brand New", "Near Park & Masjid", "Water Boring"]
  },
  {
    title: "Gulberg Greens Farmhouse",
    loc: "Gulberg Greens, Islamabad", city: "islamabad", size: "kanal", sizeLabel: "4 Kanal",
    beds: 6, baths: 7, area: "9,000 sq ft", year: 2023, price: "PKR 22 Crore",
    img: "assets/villas/05-gulberg-farmhouse.svg",
    desc: "A resort-style farmhouse estate — orchard of forty fruit trees, guest annexe, and an open-plan living pavilion built for three generations under one roof.",
    soldIn: 35, tags: ["Farmhouse", "Orchard", "Gated Community"],
    features: ["6 Beds Attached Baths", "40-Tree Orchard", "Guest Annexe", "Staff Wing", "Bore Water + Solar", "Event Lawn"]
  },
  {
    title: "The Hilltop Modern",
    loc: "B-17 Multi Gardens, Islamabad", city: "islamabad", size: "10-marla", sizeLabel: "10 Marla",
    beds: 5, baths: 5, area: "3,100 sq ft", year: 2023, price: "PKR 3.9 Crore",
    img: "assets/villas/06-hilltop-modern.svg",
    desc: "Sharp modernist lines and full-height glazing on B-17's highest street — sold to an overseas family entirely over video walkthroughs.",
    soldIn: 27, tags: ["Hilltop", "Corner", "Overseas Deal"],
    features: ["5 Beds Attached Baths", "Full-Height Glazing", "Corner Plot", "Sold via Video Tour", "Possession Ready", "50 Ft Road"]
  },
  {
    title: "Phase 6 Palazzo",
    loc: "DHA Phase 6, Lahore", city: "lahore", size: "kanal", sizeLabel: "1 Kanal",
    beds: 6, baths: 7, area: "5,800 sq ft", year: 2025, price: "PKR 13 Crore",
    img: "assets/villas/07-phase6-palazzo.svg",
    desc: "Classical façade, contemporary heart. Twin kitchens, a cigar lounge, and Lahore's most photographed front elevation of 2025.",
    soldIn: 16, tags: ["Designer Build", "Double Unit"],
    features: ["6 Beds Attached Baths", "Twin Kitchens", "Cigar Lounge", "Double Unit", "Solid Construction", "2-Car Garage"]
  },
  {
    title: "The Gulberg Heritage House",
    loc: "Gulberg III, Lahore", city: "lahore", size: "kanal", sizeLabel: "2 Kanal",
    beds: 7, baths: 8, area: "11,200 sq ft", year: 2024, price: "PKR 34 Crore",
    img: "assets/villas/08-gulberg-heritage.svg",
    desc: "A storied Gulberg address reimagined — original 1970s bones restored around a new glass atrium, pool pavilion, and staff wing. A legacy sale handled in complete discretion.",
    soldIn: 41, tags: ["Legacy Estate", "Discreet Sale"],
    features: ["7 Beds Attached Baths", "Glass Atrium", "Pool Pavilion", "Staff Wing", "Mature Gardens", "Original 1970s Restored"]
  },
  {
    title: "Bahria Orchard Villa",
    loc: "Bahria Town Sector C, Lahore", city: "lahore", size: "10-marla", sizeLabel: "10 Marla",
    beds: 5, baths: 6, area: "3,400 sq ft", year: 2024, price: "PKR 4.65 Crore",
    img: "assets/villas/09-bahria-orchard.svg",
    desc: "Crisp white contemporary with a courtyard olive tree at its centre. Listed at 4 crore by others — closed at 4.65 after a two-week bidding strategy.",
    soldIn: 14, tags: ["Brand New", "Courtyard", "Above Demand"],
    features: ["5 Beds Attached Baths", "Courtyard Olive Tree", "Brand New Designer", "Closed Above Demand", "Tiled Flooring", "Solar Ready"]
  },
  {
    title: "Model Town Estate",
    loc: "Model Town Block C, Lahore", city: "lahore", size: "kanal", sizeLabel: "1 Kanal",
    beds: 6, baths: 6, area: "6,100 sq ft", year: 2023, price: "PKR 16 Crore",
    img: "assets/villas/10-model-town.svg",
    desc: "One of Model Town's coveted corner kanals — mature gardens, colonial verandas, and a library that smells of old Lahore. Passed to its next custodian family.",
    soldIn: 30, tags: ["Corner Kanal", "Mature Gardens"],
    features: ["6 Beds Attached Baths", "Colonial Verandas", "Library", "Corner Plot", "Mature Gardens", "Servant Quarters"]
  },
  {
    title: "Lake City Linear House",
    loc: "Lake City M-3, Lahore", city: "lahore", size: "10-marla", sizeLabel: "10 Marla",
    beds: 5, baths: 5, area: "3,300 sq ft", year: 2025, price: "PKR 4.2 Crore",
    img: "assets/villas/11-lake-city.svg",
    desc: "Long, low and luminous — a golf-course-facing modern with cedar screens and a double-height gallery that sold at first open house.",
    soldIn: 6, tags: ["Golf Facing", "Brand New"],
    features: ["5 Beds Attached Baths", "Golf Course Facing", "Cedar Screens", "Double-Height Gallery", "Sold at First Open House", "Possession Ready"]
  },
  {
    title: "The Phase 5 Courtyard",
    loc: "DHA Phase 5, Lahore", city: "lahore", size: "5-marla", sizeLabel: "5 Marla",
    beds: 3, baths: 4, area: "1,950 sq ft", year: 2024, price: "PKR 2.85 Crore",
    img: "assets/villas/12-phase5-courtyard.svg",
    desc: "A jewel-box 5 Marla wrapped around a private courtyard — terrazzo floors, brass details, and the highest per-marla price on its street that year.",
    soldIn: 19, tags: ["Jewel Box", "Record Price"],
    features: ["3 Beds Attached Baths", "Private Courtyard", "Terrazzo Floors", "Brass Details", "Highest Per-Marla on Street", "Near Markaz"]
  }
];

/* ---------- FALLBACK ART ----------
   If a remote photo can't load (offline, blocked CDN), swap in an
   elegant gold line-art villa so the gallery never shows a broken image. */
const VILLA_PATHS = [
  // modern flat-roof villa
  `<path d="M120 420 L120 300 L300 300 L300 250 L520 250 L520 420 Z" fill="none" stroke="#c9a45c" stroke-width="3"/>
   <rect x="150" y="330" width="60" height="90" fill="#c9a45c" opacity="0.55"/>
   <rect x="330" y="280" width="50" height="60" fill="#c9a45c" opacity="0.4"/>
   <rect x="410" y="280" width="50" height="60" fill="#c9a45c" opacity="0.4"/>
   <line x1="60" y1="420" x2="740" y2="420" stroke="#c9a45c" stroke-width="2"/>
   <rect x="560" y="340" width="110" height="80" fill="none" stroke="#c9a45c" stroke-width="2.4" opacity="0.7"/>
   <circle cx="640" cy="170" r="34" fill="none" stroke="#c9a45c" stroke-width="2" opacity="0.6"/>`,
  // two-storey with arched entrance
  `<path d="M140 420 L140 240 L400 170 L660 240 L660 420 Z" fill="none" stroke="#c9a45c" stroke-width="3"/>
   <path d="M360 420 L360 330 Q400 290 440 330 L440 420" fill="none" stroke="#c9a45c" stroke-width="3"/>
   <rect x="190" y="280" width="55" height="55" fill="#c9a45c" opacity="0.45"/>
   <rect x="555" y="280" width="55" height="55" fill="#c9a45c" opacity="0.45"/>
   <rect x="190" y="355" width="55" height="55" fill="#c9a45c" opacity="0.3"/>
   <rect x="555" y="355" width="55" height="55" fill="#c9a45c" opacity="0.3"/>
   <line x1="70" y1="420" x2="730" y2="420" stroke="#c9a45c" stroke-width="2"/>
   <circle cx="160" cy="150" r="28" fill="none" stroke="#c9a45c" stroke-width="2" opacity="0.6"/>`,
  // gated kanal estate
  `<path d="M100 420 L100 310 L260 310 L260 230 L480 230 L480 310 L700 310 L700 420 Z" fill="none" stroke="#c9a45c" stroke-width="3"/>
   <rect x="300" y="260" width="44" height="44" fill="#c9a45c" opacity="0.5"/>
   <rect x="396" y="260" width="44" height="44" fill="#c9a45c" opacity="0.5"/>
   <rect x="140" y="340" width="80" height="80" fill="none" stroke="#c9a45c" stroke-width="2.4" opacity="0.8"/>
   <rect x="580" y="340" width="80" height="80" fill="none" stroke="#c9a45c" stroke-width="2.4" opacity="0.8"/>
   <line x1="50" y1="420" x2="750" y2="420" stroke="#c9a45c" stroke-width="2"/>
   <path d="M540 200 q20 -40 40 0 q20 -36 40 0" fill="none" stroke="#c9a45c" stroke-width="2" opacity="0.5"/>`
];
function fallbackArt(i, label) {
  const villa = VILLA_PATHS[i % VILLA_PATHS.length];
  const hue = ["#0c1226", "#101a30", "#0e1322"][i % 3];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${hue}"/><stop offset="1" stop-color="#070b16"/>
    </linearGradient></defs>
    <rect width="800" height="560" fill="url(#g)"/>
    ${villa}
    <text x="400" y="500" text-anchor="middle" fill="#c9a45c" opacity="0.85"
      font-family="Georgia, serif" font-style="italic" font-size="26">${label}</text>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
function guardImage(img, i, label) {
  img.addEventListener("error", () => { img.src = fallbackArt(i, label); }, { once: true });
  if (img.complete && img.naturalWidth === 0 && img.src.startsWith("http")) img.src = fallbackArt(i, label);
}


/* Bind a listener only if the element is there. main.js is shared with the
   standalone tool pages, which have the nav, the menu and the footer but none
   of the main page's sections, and an unguarded getElementById(...).addEventListener
   throws at load and takes the rest of this file down with it. */
function onId(id, ev, fn, opts) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(ev, fn, opts);
  return el;
}

/* ---------- RENDER CARDS ---------- */
// This file is shared with the standalone tool pages, which carry the nav, the
// menu and the footer but none of the main page's sections. Everything from
// here on has to tolerate its container being absent.
const grid = document.getElementById("grid");
if (grid) PROPERTIES.forEach((p, i) => {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.city = p.city;
  card.dataset.size = p.size;
  card.innerHTML = `
    <div class="card__media">
      <img src="${p.img}" alt="${p.title}" loading="lazy" />
      <span class="card__sold">SOLD${p.soldIn ? ` · ${p.soldIn} DAYS` : ""}</span>
      <span class="card__size">${p.sizeLabel}</span>
    </div>
    <div class="card__body">
      <p class="card__loc">${p.loc}</p>
      <h3 class="card__title">${p.title}</h3>
      <div class="card__tags">${(p.tags || []).map((t) => `<span>${t}</span>`).join("")}</div>
      <div class="card__meta">
        <span>🛏 ${p.beds} Beds</span><span>🛁 ${p.baths} Baths</span><span>📐 ${p.area}</span>
      </div>
      <div class="card__foot">
        <span class="card__price"><em>Closed at</em>${p.price}</span>
        <span class="card__view">View Story →</span>
      </div>
      <button class="card__tour-btn" type="button">⌂ Build Me One Like This</button>
    </div>`;
  card.addEventListener("click", () => openLightbox(i));
  card.querySelector(".card__tour-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    if (window.LikeThis) window.LikeThis.open(i);
  });
  guardImage(card.querySelector(".card__media img"), i, p.title);
  grid.appendChild(card);
});

// Background hero/contact photos: fade out gracefully if unreachable
document.querySelectorAll(".hero__bg img, .contact__bg img").forEach((img) => {
  img.addEventListener("error", () => { img.style.display = "none"; }, { once: true });
});

/* ---------- PRELOADER ---------- */
const preloader = document.getElementById("preloader");
const preloaderBar = document.getElementById("preloaderBar");
const preloaderCount = document.getElementById("preloaderCount");
let preloaderDone = false;

function dismissPreloader() {
  if (preloaderDone) return;
  preloaderDone = true;
  if (HAS_GSAP) {
    gsap.to(preloader, {
      yPercent: -100, duration: 1, ease: "power4.inOut", delay: 0.2,
      onComplete: () => { preloader.style.display = "none"; }
    });
    heroIntro();
  } else {
    preloader.style.display = "none";
  }
}

function startPreloader() {
  // The tool pages share this file but carry no preloader — there's nothing
  // heavy to wait for on them.
  if (!preloader || !preloaderBar || !preloaderCount) { preloaderDone = true; return; }
  if (!HAS_GSAP) {
    preloaderBar.style.width = "100%";
    preloaderCount.textContent = "100";
    dismissPreloader();
    return;
  }
  const progress = { v: 0 };
  gsap.to(progress, {
    v: 100, duration: 1.6, ease: "power2.inOut",
    onUpdate() {
      preloaderBar.style.width = progress.v + "%";
      preloaderCount.textContent = Math.round(progress.v);
    },
    onComplete: dismissPreloader
  });
}

if (document.readyState === "complete") startPreloader();
else window.addEventListener("load", startPreloader);
// Safety net: never trap the user behind the preloader, even if a CDN stalls.
setTimeout(() => { if (!preloaderDone) { startPreloader(); setTimeout(dismissPreloader, 800); } }, 2500);

/* ---------- SMOOTH SCROLL (LENIS) ---------- */
let lenis = null;
if (HAS_ST) gsap.registerPlugin(ScrollTrigger);
if (HAS_LENIS && HAS_GSAP) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  if (HAS_ST) lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
}

/* ---------- HERO INTRO ---------- */
function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl.to(".hero__title .line > span", { y: 0, duration: 1.3, stagger: 0.12 })
    .fromTo(".hero__portrait", { opacity: 0, y: 60, rotate: 2 }, { opacity: 1, y: 0, rotate: 0, duration: 1.4 }, 0.3)
    .to(".hero__eyebrow, .hero__sub, .hero__actions", { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 0.6)
    .to(".hero__stat", { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, onComplete: runCounters }, 0.9);
}

/* ---------- SCROLL REVEALS / PARALLAX / CARD ENTRANCES ---------- */
if (HAS_ST) {
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    if (el.closest(".hero")) return; // hero handled by intro timeline
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  document.querySelectorAll("[data-speed]").forEach((el) => {
    const speed = parseFloat(el.dataset.speed);
    gsap.to(el, {
      yPercent: (1 - speed) * 30, ease: "none",
      scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  gsap.utils.toArray(".card").forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 70, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 92%" },
      delay: (i % 3) * 0.08
    });
  });
}

/* ---------- COUNTERS ---------- */
function runCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (!HAS_GSAP) { el.textContent = end + suffix; return; }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 2.2, ease: "power2.out",
      onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; }
    });
  });
}
if (!HAS_GSAP) runCounters();

/* ---------- ANCHOR LINKS ---------- */
const burger = document.getElementById("navBurger");
const mobileMenu = document.getElementById("mobileMenu");
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -70 });
      else target.scrollIntoView({ behavior: "smooth" });
    }
    mobileMenu.classList.remove("is-open");
    burger.classList.remove("is-open");
  });
});

/* ---------- NAV / PROGRESS ---------- */
const nav = document.getElementById("nav");
const scrollProgress = document.getElementById("scrollProgress");
window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 60);
  const h = document.documentElement;
  scrollProgress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
}, { passive: true });

burger.addEventListener("click", () => {
  burger.classList.toggle("is-open");
  mobileMenu.classList.toggle("is-open");
});

/* ---------- SCROLLSPY (highlight the nav link for the section in view) ---------- */
const spyTargets = ["about", "credentials", "services", "featured", "deals", "portfolio", "faq", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
if ("IntersectionObserver" in window && spyTargets.length) {
  const navLinks = document.querySelectorAll(".nav__links a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const href = "#" + e.target.id;
      navLinks.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === href));
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  spyTargets.forEach((t) => spy.observe(t));
}

/* ---------- FAQ ACCORDION (open one at a time) ---------- */
const faqItems = document.querySelectorAll(".faq__item");
faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    faqItems.forEach((other) => { if (other !== item) other.open = false; });
  });
});

/* ---------- FILTERS ---------- */
onId("filters", "click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
  btn.classList.add("is-active");
  const f = btn.dataset.filter;
  const cards = Array.from(document.querySelectorAll(".card"));
  const apply = () => cards.forEach((card) => {
    const show = f === "all" || card.dataset.city === f || card.dataset.size === f;
    card.classList.toggle("is-hidden", !show);
  });

  if (!HAS_GSAP) { apply(); return; }
  gsap.to(cards, {
    opacity: 0, y: 24, scale: 0.97, duration: 0.28, stagger: 0.015, ease: "power2.in",
    onComplete() {
      apply();
      gsap.to(cards.filter((c) => !c.classList.contains("is-hidden")), {
        opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: "power3.out"
      });
      if (HAS_ST) ScrollTrigger.refresh();
    }
  });
});

/* ---------- LIGHTBOX ---------- */
const lightbox = document.getElementById("lightbox");
function openLightbox(i) {
  const p = PROPERTIES[i];
  const lbImg = document.getElementById("lbImg");
  const cardImg = document.querySelectorAll(".card__media img")[i];
  lbImg.src = cardImg && cardImg.src ? cardImg.src : p.img; // reuse fallback art if photo failed
  guardImage(lbImg, i, p.title);
  document.getElementById("lbLoc").textContent = p.loc + " · Sold " + p.year;
  document.getElementById("lbTitle").textContent = p.title;
  document.getElementById("lbDesc").textContent = p.desc;
  document.getElementById("lbPrice").textContent = p.price;
  document.getElementById("lbSpecs").innerHTML = `
    <div><span>Plot Size</span><strong>${p.sizeLabel}</strong></div>
    <div><span>Covered Area</span><strong>${p.area}</strong></div>
    <div><span>Bedrooms</span><strong>${p.beds}</strong></div>
    <div><span>Bathrooms</span><strong>${p.baths}</strong></div>`;
  document.getElementById("lbFeatures").innerHTML =
    (p.features || []).map((f) => `<li>✓ ${f}</li>`).join("");
  document.getElementById("lbPriceLabel").textContent = "Closed at";
  document.getElementById("lbSold").style.display = "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  if (lenis) lenis.stop();

  // interactive 3D model (estate3d.js); falls back to the illustration
  const media = lightbox.querySelector(".lightbox__media");
  const hint = document.getElementById("lbDragHint");
  const has3d = window.Estate3D && window.Estate3D.openViewer(i, media);
  if (hint) hint.style.display = has3d ? "block" : "none";
  // The illustration sits behind the canvas as the fallback. The canvas is
  // transparent, so leaving it up put the flat artwork's own driveway and sky
  // behind the model — two pictures of a house at once. Only one at a time.
  lbImg.style.visibility = has3d ? "hidden" : "visible";

  // this house is sold — the useful offer is another one exactly like it
  const tourBtn = document.getElementById("lbTourBtn");
  if (tourBtn) {
    tourBtn.innerHTML = '<span class="lightbox__tour-ico">⌂</span> Build Me One Like This';
    tourBtn.onclick = () => {
      closeLightbox();
      if (window.LikeThis) window.LikeThis.open(i);
    };
  }
}
function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  if (lenis) lenis.start();
  if (window.Estate3D) window.Estate3D.closeViewer();
}
onId("lightboxClose", "click", closeLightbox);
onId("lightboxBackdrop", "click", closeLightbox);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

/* Live YouTube listings (Available Listings + Market Watch) link straight to
   the real video tour — no 3D preview. The interactive 3D models are reserved
   for the sold-house showcase below. */

/* ---------- TESTIMONIAL SLIDER ---------- */
const slides = document.querySelectorAll(".testimonial");
const dotsWrap = document.getElementById("dots");
let slideIdx = 0, slideTimer;
slides.forEach((_, i) => {
  const dot = document.createElement("i");
  if (i === 0) dot.classList.add("is-active");
  dot.addEventListener("click", () => goSlide(i));
  dotsWrap.appendChild(dot);
});
function goSlide(i) {
  if (!slides.length || !dotsWrap) return;
  slideIdx = (i + slides.length) % slides.length;
  slides.forEach((s, j) => s.classList.toggle("is-active", j === slideIdx));
  dotsWrap.querySelectorAll("i").forEach((d, j) => d.classList.toggle("is-active", j === slideIdx));
  restartAuto();
}
function restartAuto() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => goSlide(slideIdx + 1), 6000);
}
onId("prevT", "click", () => goSlide(slideIdx - 1));
onId("nextT", "click", () => goSlide(slideIdx + 1));
// Only where there are testimonials to rotate. Started unconditionally, the
// six-second timer fired on the tool pages and threw once a page.
if (slides.length && dotsWrap) restartAuto();

/* ---------- CUSTOM CURSOR & MAGNETIC (pointer devices, gsap only) ---------- */
if (HAS_GSAP && window.matchMedia("(hover: hover)").matches) {
  const cursor = document.getElementById("cursor");
  const cursorDot = document.getElementById("cursorDot");
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const mouse = { ...pos };
  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  gsap.ticker.add(() => {
    pos.x += (mouse.x - pos.x) * 0.16;
    pos.y += (mouse.y - pos.y) * 0.16;
    cursor.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
    cursorDot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%,-50%)`;
  });
  document.querySelectorAll("a, button, .card").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });

  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * 0.25,
        y: (e.clientY - r.top - r.height / 2) * 0.25,
        duration: 0.4, ease: "power3.out"
      });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ---------- HOT DEALS — Real available listings ---------- */
const HOT_DEALS = [
  /* ---- ISLAMABAD ---- */
  {
    title: "10 Marla Brand New — DHA Phase 2",
    loc: "DHA Phase 2, Islamabad",
    city: "islamabad",
    demand: "PKR 4.45 Crore",
    tags: ["Brand New", "Possession Ready", "Gas & Solar"],
    specs: "5 Beds Attached Baths · 2-Car Porch · Double Storey · Tiles Throughout",
    img: "assets/villas/02-villa-serena.svg",
    badge: "DHA ISB"
  },
  {
    title: "1 Kanal Corner Kanal Villa",
    loc: "DHA Phase 1, Islamabad",
    city: "islamabad",
    demand: "PKR 16.5 Crore",
    tags: ["Corner Plot", "Basement", "Solar Installed"],
    specs: "6 Beds Attached Baths · Home Cinema · Servant Block · Mature Garden",
    img: "assets/villas/01-margalla-manor.svg",
    badge: "PRIME"
  },
  {
    title: "10 Marla Modern — Bahria Enclave",
    loc: "Bahria Enclave Sector A, Islamabad",
    city: "islamabad",
    demand: "PKR 5.2 Crore",
    tags: ["Park Face", "Gated", "Brand New"],
    specs: "5 Beds Attached Baths · Double Storey · Rooftop Terrace · Smart Home",
    img: "assets/villas/03-enclave-residence.svg",
    badge: "HOT DEAL"
  },
  {
    title: "5 Marla Investor Rate — B-17",
    loc: "B-17 Multi Gardens Sector C, Islamabad",
    city: "islamabad",
    demand: "PKR 2.15 Crore",
    tags: ["Investor Rate", "Near Expressway", "Possession Ready"],
    specs: "4 Beds Attached Baths · Tiled · Sun Face · Near Park & Masjid",
    img: "assets/villas/04-casa-blanca.svg",
    badge: "INVESTOR RATE"
  },
  /* ---- LAHORE ---- */
  {
    title: "10 Marla Modern — DHA Phase 6",
    loc: "DHA Phase 6, Lahore",
    city: "lahore",
    demand: "PKR 5.8 Crore",
    tags: ["Brand New", "Possession Ready", "Gas Available"],
    specs: "5 Beds Attached Baths · 2-Car Garage · Solid Construction",
    img: "assets/villas/07-phase6-palazzo.svg",
    badge: "DHA LHR"
  },
  {
    title: "1 Kanal — Bahria Town Sector C",
    loc: "Bahria Town Sector C, Lahore",
    city: "lahore",
    demand: "PKR 9.5 Crore",
    tags: ["Corner", "Designer Built", "Gated"],
    specs: "6 Beds Attached Baths · Double Unit · Basement · Servant Quarter",
    img: "assets/villas/09-bahria-orchard.svg",
    badge: "HOT DEAL"
  },
  {
    title: "10 Marla — DHA Phase 5",
    loc: "DHA Phase 5, Lahore",
    city: "lahore",
    demand: "PKR 8.75 Crore",
    tags: ["50 Ft Road", "Near Commercial", "Solid"],
    specs: "5 Beds Attached Baths · Tiled · Marble Floor · Gas & Electricity",
    img: "assets/villas/11-lake-city.svg",
    badge: "PRIME LHR"
  },
  {
    title: "5 Marla — Lake City M-3",
    loc: "Lake City Sector M-3, Lahore",
    city: "lahore",
    demand: "PKR 2.75 Crore",
    tags: ["Golf Facing", "Brand New", "Investor Rate"],
    specs: "4 Beds Attached Baths · Cedar Screens · Sun Face · Ready to Move",
    img: "assets/villas/12-phase5-courtyard.svg",
    badge: "NEW"
  }
];
// 3D archetype per deal — matched to the sold property that shares each
// listing's SVG so the model in the lightbox and the walkable tour agree
// (see estate3d.js ARCHETYPES / interior.js DEAL_TO_SOLD).
const DEAL_MODELS = [
  "modern",      // 0 · villa-serena
  "manor",       // 1 · margalla-manor
  "greyTexture", // 2 · enclave-residence
  "cube5",       // 3 · casa-blanca
  "palazzo",     // 4 · phase6-palazzo
  "modernWhite", // 5 · bahria-orchard
  "linear",      // 6 · lake-city
  "brick"        // 7 · phase5-courtyard
];

function openDealLightbox(d, i) {
  document.getElementById("lbImg").src = d.img;
  document.getElementById("lbLoc").textContent = d.loc + " · Available Now";
  document.getElementById("lbTitle").textContent = d.title;
  document.getElementById("lbDesc").textContent = d.specs;
  document.getElementById("lbPrice").textContent = d.demand;
  document.getElementById("lbPriceLabel").textContent = "Demand";
  document.getElementById("lbSold").style.display = "none";
  document.getElementById("lbSpecs").innerHTML = "";
  document.getElementById("lbFeatures").innerHTML =
    d.tags.map((t) => `<li>✓ ${t}</li>`).join("");
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  if (lenis) lenis.stop();
  const media = lightbox.querySelector(".lightbox__media");
  const hint = document.getElementById("lbDragHint");
  const has3d = window.Estate3D && window.Estate3D.openViewerByType(DEAL_MODELS[i] || "modern", media);
  if (hint) hint.style.display = has3d ? "block" : "none";

  const tourBtn = document.getElementById("lbTourBtn");
  if (tourBtn) {
    tourBtn.innerHTML = '<span class="lightbox__tour-ico">⌂</span> Build Me One Like This';
    tourBtn.onclick = () => {
      closeLightbox();
      if (window.LikeThis) window.LikeThis.openFromText(d.title + " " + (d.specs || ""), d.loc || d.title);
    };
  }
}

const dealsGrid = document.getElementById("dealsGrid");

/* ---------- AVAILABLE LISTINGS (live) ----------
   The "Hot deals" grid is now driven by the same live YouTube feed as Market
   Watch (MSJ + OREAL + Zameen). Each card leads with an auto-generated 3D
   model and the real video tour. Falls back to the curated static list only
   if the feed can't be fetched, so the section is never empty. */
const DEAL_BADGE = { msj: "MSJ", oreal: "OREAL", zameen: "ZAMEEN" };
// Property-specific signals only — bare "house"/"home" match commentary
// videos (e.g. Zameen's podcasts), so a real listing must state a size,
// bed count, sale status or a property type.
const DEAL_LISTING_RE = /\b(marla|kanal|\d+\s*bed(?:room)?s?|\d+\s*bhk|for sale|\bplot\b|farmhouse|duplex|villa|kothi|apartment|penthouse)\b/i;
function dealCity(t) {
  t = (t || "").toLowerCase();
  if (/rawalpindi|pindi/.test(t)) return "rawalpindi";
  if (/lahore|dha lhr/.test(t)) return "lahore";
  if (/islamabad|\bisb\b|bahria enclave|b-?17|gulberg islamabad|e-?11|\bf-?\d/.test(t)) return "islamabad";
  return "";
}
function dealCityLabel(c) {
  return { islamabad: "Islamabad", lahore: "Lahore", rawalpindi: "Rawalpindi" }[c] || "Islamabad & Lahore";
}
function dealTags(t) {
  const rules = [
    [/brand\s*new/i, "Brand New"], [/corner/i, "Corner"], [/designer/i, "Designer"],
    [/possession|ready to move|ready to live|\bready\b/i, "Possession Ready"], [/basement/i, "Basement"],
    [/solar/i, "Solar"], [/park\s*fac/i, "Park Face"], [/investor/i, "Investor Rate"],
    [/luxury|deluxe/i, "Luxury"], [/furnished/i, "Furnished"], [/urgent/i, "Urgent Sale"]
  ];
  const out = [];
  for (const [re, label] of rules) { if (out.length >= 3) break; if (re.test(t)) out.push(label); }
  return out;
}
function dealPrice(t) {
  let m = (t || "").match(/(?:pkr|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:crore|cr\b|kror|karor)/i);
  if (m) return "PKR " + m[1] + " Crore";
  m = (t || "").match(/(?:pkr|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:lac|lakh|lakhs)\b/i);
  if (m) return "PKR " + m[1] + " Lac";
  return "";
}
function dealSpecs(t) {
  const size = ((t || "").match(/(\d+(?:\.\d+)?)\s*(?:marla|kanal)/i) || [])[0];
  const beds = ((t || "").match(/(\d+)\s*(?:bed|bedroom|bhk)/i) || [])[1];
  const parts = [];
  if (size) parts.push(size.replace(/\s+/g, " ").trim());
  if (beds) parts.push(beds + " Beds");
  parts.push("Full video walkthrough");
  return parts.join(" · ");
}
function renderLiveDeals(items) {
  dealsGrid.innerHTML = "";
  items.forEach((item) => {
    const city = dealCity(item.title);
    const price = dealPrice(item.title);
    const tags = dealTags(item.title);
    const badge = DEAL_BADGE[item.channel] || item.channelName || "LIVE";
    const wa = `https://wa.me/16134083945?text=${encodeURIComponent(
      `Hello Adeel, I'm interested in this listing: ${item.title}. Is it still available and what's the best price? ${item.url}`)}`;
    const el = document.createElement("article");
    el.className = "deal deal--live";
    if (city) el.dataset.city = city;
    el.innerHTML = `
      <div class="deal__media">
        <img src="${item.thumb || ""}" alt="${item.title}" loading="lazy" />
        <span class="deal__badge">${badge}</span>
        <span class="deal__live">● LIVE</span>
        <span class="deal__watch">▶ Watch Tour</span>
      </div>
      <div class="deal__body">
        <p class="card__loc">${dealCityLabel(city)} · Live Listing</p>
        <h3 class="card__title">${item.title}</h3>
        <div class="card__tags">${tags.map((t) => `<span>${t}</span>`).join("")}</div>
        <p class="deal__specs">${dealSpecs(item.title)}</p>
        <div class="deal__price"><span>${price ? "Demand" : "Best price"}</span><strong>${price || "Ask me →"}</strong></div>
        <div class="deal__actions">
          <a class="btn btn--wa" href="${wa}" target="_blank" rel="noopener">WhatsApp Now</a>
          <a class="btn btn--ghost btn--sm" href="tel:+16134083945">Call</a>
        </div>
        <button class="card__tour-btn deal__tour-btn" type="button">▶ Watch Video Tour</button>
      </div>`;
    dealsGrid.appendChild(el);
    const watch = () => window.open(item.url, "_blank", "noopener");
    el.querySelector(".deal__media").addEventListener("click", watch);
    el.querySelector(".deal__tour-btn").addEventListener("click", watch);
    el.querySelector(".deal__media img").addEventListener("error", function () {
      this.closest(".deal__media").classList.add("is-noimg");
      this.style.display = "none";
    }, { once: true });
  });
  // Only show city chips that actually have live listings, so filtering
  // never lands on an empty grid.
  const present = new Set(items.map((it) => dealCity(it.title)).filter(Boolean));
  document.querySelectorAll("#dealsCityFilter .chip").forEach((chip) => {
    const c = chip.dataset.city;
    chip.style.display = (c === "all" || present.has(c)) ? "" : "none";
  });
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}
function renderStaticDeals() {
  dealsGrid.innerHTML = "";
  HOT_DEALS.forEach((d, di) => {
    const el = document.createElement("article");
    el.className = "deal";
    if (d.city) el.dataset.city = d.city;
    const wa = `https://wa.me/16134083945?text=${encodeURIComponent(
      `Hello Adeel, I'm interested in: ${d.title} (${d.loc}) — Demand ${d.demand}. Please share details.`)}`;
    el.innerHTML = `
      <div class="deal__media">
        <img src="${d.img}" alt="${d.title}" loading="lazy" />
        <span class="deal__badge">${d.badge}</span>
        <span class="deal__3d">View in 3D</span>
      </div>
      <div class="deal__body">
        <p class="card__loc">${d.loc}</p>
        <h3 class="card__title">${d.title}</h3>
        <div class="card__tags">${d.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        <p class="deal__specs">${d.specs}</p>
        <div class="deal__price"><span>Demand</span><strong>${d.demand}</strong></div>
        <div class="deal__actions">
          <a class="btn btn--wa" href="${wa}" target="_blank" rel="noopener">WhatsApp Now</a>
          <a class="btn btn--ghost btn--sm" href="tel:+16134083945">Call</a>
        </div>
        <button class="card__tour-btn deal__tour-btn" type="button">⌂ Build Me One Like This</button>
      </div>`;
    dealsGrid.appendChild(el);
    el.querySelector(".deal__media").addEventListener("click", () => openDealLightbox(d, di));
    el.querySelector(".deal__tour-btn").addEventListener("click", () => {
      if (window.LikeThis) window.LikeThis.openFromText(d.title + " " + (d.specs || ""), d.loc || d.title);
    });
    el.querySelector(".deal__media img").addEventListener("error", function () {
      this.style.display = "none";
    }, { once: true });
  });
}
// Round-robin the newest listing from each channel so one high-volume
// channel can't crowd the others out — every agency gets representation.
function diversifyByChannel(items) {
  const byCh = {};
  items.forEach((it) => { (byCh[it.channel] = byCh[it.channel] || []).push(it); });
  const chans = Object.keys(byCh);
  const out = [];
  for (let i = 0; out.length < items.length; i++) {
    let any = false;
    for (const c of chans) { if (byCh[c][i]) { out.push(byCh[c][i]); any = true; } }
    if (!any) break;
  }
  return out;
}
if (dealsGrid) {
  fetch("data/market-feed.json", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((data) => {
      const listings = ((data && data.items) || []).filter((it) => DEAL_LISTING_RE.test(it.title || ""));
      const items = diversifyByChannel(listings);
      if (items.length) renderLiveDeals(items.slice(0, 9));
      else renderStaticDeals();
    })
    .catch(() => renderStaticDeals());
}

/* ---------- GALLERY SEARCH + SORT ---------- */
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

function activeChipFilter() {
  const c = document.querySelector(".chip.is-active");
  return c ? c.dataset.filter : "all";
}
function applySearch() {
  const q = (searchInput.value || "").trim().toLowerCase();
  const f = activeChipFilter();
  document.querySelectorAll(".card").forEach((card, i) => {
    const p = PROPERTIES[i];
    const hay = `${p.title} ${p.loc} ${p.sizeLabel} ${(p.tags || []).join(" ")} ${(p.features || []).join(" ")}`.toLowerCase();
    const passChip = f === "all" || card.dataset.city === f || card.dataset.size === f;
    card.classList.toggle("is-hidden", !(passChip && (!q || hay.includes(q))));
  });
  if (HAS_ST) ScrollTrigger.refresh();
}
function applySort() {
  const v = sortSelect.value;
  const cards = Array.from(grid.children);
  const num = (p) => parseFloat(p.price.replace(/[^\d.]/g, "")) || 0;
  const keyFns = {
    "price-desc": (i) => -num(PROPERTIES[i]),
    "price-asc": (i) => num(PROPERTIES[i]),
    "year-desc": (i) => -PROPERTIES[i].year,
    "days-asc": (i) => PROPERTIES[i].soldIn || 999
  };
  const orig = cards.map((c, idx) => ({ c, i: idx }));
  // dataset order survives reordering; store original index once
  cards.forEach((c, idx) => { if (!c.dataset.idx) c.dataset.idx = idx; });
  const sorted = cards.slice().sort((a, b) => {
    if (v === "default") return a.dataset.idx - b.dataset.idx;
    const k = keyFns[v];
    return k(+a.dataset.idx) - k(+b.dataset.idx);
  });
  sorted.forEach((c) => grid.appendChild(c));
  if (HAS_GSAP) gsap.from(sorted.filter((c) => !c.classList.contains("is-hidden")),
    { opacity: 0, y: 18, duration: 0.4, stagger: 0.04, ease: "power2.out", overwrite: true });
  if (HAS_ST) ScrollTrigger.refresh();
  void orig;
}
if (searchInput) searchInput.addEventListener("input", applySearch);
if (sortSelect) sortSelect.addEventListener("change", applySort);

/* ---------- SMART PROPERTY FINDER ---------- */
(function () {
  // Zameen.com canonical city IDs: Islamabad = 3, Lahore = 1
  const ZAMEEN_CITY = { islamabad: { name: "Islamabad", id: 3 }, lahore: { name: "Lahore", id: 1 } };
  const TYPE_MAP = { buy: "Houses", rent: "Rentals" };

  let sel = { city: "islamabad", area: "any", size: "any", purpose: "buy" };

  function pickOne(groupId, key) {
    const wrap = document.getElementById(groupId);
    if (!wrap) return;
    wrap.querySelectorAll(".chip").forEach((b) => b.classList.toggle("is-active", b.dataset.val === sel[key]));
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-val]");
      if (!b) return;
      sel[key] = b.dataset.val;
      wrap.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c.dataset.val === sel[key]));
      // F-7 / Model Town not in Lahore — hide those chips when city switches
      if (key === "city") {
        const areaWrap = document.getElementById("finderArea");
        if (areaWrap) {
          const f7 = areaWrap.querySelector("[data-val='f7']");
          const mt = areaWrap.querySelector("[data-val='model']");
          if (f7) f7.style.display = sel.city === "islamabad" ? "" : "none";
          if (mt) mt.style.display = sel.city === "lahore" ? "" : "none";
          if (sel.city === "lahore" && sel.area === "f7") {
            sel.area = "any";
            areaWrap.querySelector("[data-val='any']").classList.add("is-active");
            areaWrap.querySelector("[data-val='f7']").classList.remove("is-active");
          }
          if (sel.city === "islamabad" && sel.area === "model") {
            sel.area = "any";
            areaWrap.querySelector("[data-val='any']").classList.add("is-active");
            areaWrap.querySelector("[data-val='model']").classList.remove("is-active");
          }
        }
      }
    });
  }
  pickOne("finderCity",    "city");
  pickOne("finderArea",    "area");
  pickOne("finderSize",    "size");
  pickOne("finderPurpose", "purpose");

  // Hide city-specific area chips on load
  const areaWrap = document.getElementById("finderArea");
  if (areaWrap) {
    const mt = areaWrap.querySelector("[data-val='model']");
    if (mt) mt.style.display = "none";
  }

  const SIZE_LABEL = { any:"", "5marla":"5 Marla", "10marla":"10 Marla", "1kanal":"1 Kanal", "2kanal":"2 Kanal +" };

  const zBtn = document.getElementById("finderZameen");
  if (zBtn) {
    zBtn.addEventListener("click", () => {
      const c = ZAMEEN_CITY[sel.city] || ZAMEEN_CITY.islamabad;
      const type = TYPE_MAP[sel.purpose] || "Houses";
      const url = `https://www.zameen.com/${type}/${c.name}-${c.id}-1.html`;
      window.open(url, "_blank", "noopener");
    });
  }

  const waBtn = document.getElementById("finderWhatsApp");
  if (waBtn) {
    waBtn.addEventListener("click", () => {
      const city = sel.city === "islamabad" ? "Islamabad" : "Lahore";
      const area = sel.area === "any" ? "any area" : sel.area.replace("dha","DHA").replace("bahria","Bahria Town").replace("gulberg","Gulberg").replace("f7","F-7/F-8").replace("e11","E-11/B-17").replace("model","Model Town");
      const size = SIZE_LABEL[sel.size] || "any size";
      const purpose = sel.purpose === "buy" ? "purchase" : "rental";
      const msg = `Hello Adeel, I'm looking to ${purpose} a ${size} home in ${area}, ${city}. Could you share available listings?`;
      (window.LeadRelay ? window.LeadRelay.send(msg) : window.open(`https://wa.me/16134083945?text=${encodeURIComponent(msg)}`, "_blank", "noopener"));
    });
  }
})();


/* ---------- BUILDABLE SPEC FOR EACH SOLD HOME ----------
   A sold house can't be toured into a sale — it's gone. What it can do is
   act as a reference build: "one like this, on my plot". These are the twelve
   closings written as construction briefs, so js/like-this.js can pre-fill a
   builder request from whichever one the visitor points at.

   Index matches PROPERTIES in this file and PROPERTY_MODELS in estate3d.js,
   so the model in the lightbox and the spec you brief from are one design. */
const SOLD_SPECS = [
  // 0 · The Margalla View Manor — 2 Kanal, 7 bed, grand modern manor
  { plot: "2k", storeys: 2, style: "dha", finish: "greyWhite", roof: "flat",
    kitchen: "closed", features: { pool: true, lawn: true, wall: true, porch: true,
    balcony: true, guestRoom: true, servantQtr: true, powderRoom: true, solar: false } },
  // 1 · Villa Serena — 1 Kanal, 6 bed, designer
  { plot: "1k", storeys: 2, style: "dha", finish: "whiteWood", roof: "flat",
    kitchen: "closed", features: { pool: true, lawn: true, wall: true, porch: true,
    balcony: true, guestRoom: true, servantQtr: true, powderRoom: true } },
  // 2 · The Enclave Residence — 10 Marla, grey structure
  { plot: "10m", storeys: 2, style: "dha", finish: "greyWhite", roof: "flat",
    kitchen: "closed", features: { lawn: true, wall: true, porch: true, balcony: true,
    guestRoom: true, powderRoom: true, servantQtr: false, pool: false } },
  // 3 · Casa Blanca E-11 — 5 Marla, compact white
  { plot: "5m", storeys: 2, style: "glass", finish: "whiteWood", roof: "flat",
    kitchen: "open", features: { lawn: true, wall: true, porch: true, balcony: true,
    guestRoom: false, servantQtr: false, powderRoom: true, pool: false } },
  // 4 · Gulberg Greens Farmhouse — 4 Kanal, sprawling, tiled roof
  { plot: "2k", storeys: 1, style: "spanish", finish: "sandstone", roof: "hip",
    kitchen: "closed", features: { pool: true, lawn: true, wall: true, porch: true,
    balcony: false, guestRoom: true, servantQtr: true, powderRoom: true } },
  // 5 · The Hilltop Modern — 10 Marla, glass-forward
  { plot: "10m", storeys: 2, style: "glass", finish: "greyWhite", roof: "flat",
    kitchen: "open", features: { lawn: true, wall: true, porch: true, balcony: true,
    guestRoom: false, servantQtr: false, powderRoom: true, pool: false } },
  // 6 · Phase 6 Palazzo — 1 Kanal, classical, travertine
  { plot: "1k", storeys: 2, style: "colonial", finish: "travertine", roof: "hip",
    kitchen: "closed", features: { pool: true, lawn: true, wall: true, porch: true,
    balcony: true, guestRoom: true, servantQtr: true, powderRoom: true } },
  // 7 · The Gulberg Heritage House — 2 Kanal, brick, colonial
  { plot: "2k", storeys: 2, style: "colonial", finish: "brick", roof: "hip",
    kitchen: "closed", features: { lawn: true, wall: true, porch: true, balcony: true,
    guestRoom: true, servantQtr: true, powderRoom: true, pool: false } },
  // 8 · Bahria Orchard Villa — 10 Marla, modern white
  { plot: "10m", storeys: 2, style: "dha", finish: "whiteWood", roof: "flat",
    kitchen: "closed", features: { lawn: true, wall: true, porch: true, balcony: true,
    guestRoom: true, powderRoom: true, servantQtr: false, pool: false } },
  // 9 · Model Town Estate — 1 Kanal, colonial kothi
  { plot: "1k", storeys: 2, style: "colonial", finish: "sandstone", roof: "hip",
    kitchen: "closed", features: { lawn: true, wall: true, porch: true, balcony: false,
    guestRoom: true, servantQtr: true, powderRoom: true, pool: false } },
  // 10 · Lake City Linear House — 10 Marla, linear modern
  { plot: "10m", storeys: 2, style: "dha", finish: "greyWhite", roof: "flat",
    kitchen: "open", features: { lawn: true, wall: true, porch: true, balcony: true,
    guestRoom: false, servantQtr: false, powderRoom: true, pool: false } },
  // 11 · The Phase 5 Courtyard — 5 Marla, brick courtyard
  { plot: "5m", storeys: 2, style: "spanish", finish: "brick", roof: "flat",
    kitchen: "closed", features: { lawn: true, wall: true, porch: true, balcony: false,
    guestRoom: false, servantQtr: false, powderRoom: true, pool: false } }
];

/* Handed to js/like-this.js, which is a module and can't reach these
   script-scoped consts directly. The sold homes are the reference builds
   the "build me one like this" section works from. */
window.SoldHomes = { PROPERTIES, SOLD_SPECS };

/* ---------- WHATSAPP LEAD FORM ---------- */
const leadForm = document.getElementById("leadForm");
if (leadForm) {
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(leadForm);
    const msg = `Hello Adeel! I'm ${d.get("name") || "a visitor"} — interested in ${d.get("intent")} ` +
      `(${d.get("area")}, budget: ${d.get("budget") || "flexible"}). Found you via your portfolio site.`;
    (window.LeadRelay ? window.LeadRelay.send(msg) : window.open(`https://wa.me/16134083945?text=${encodeURIComponent(msg)}`, "_blank", "noopener"));
  });
}

/* ---------- BACK TO TOP ---------- */
const toTop = document.getElementById("toTop");
if (toTop) {
  window.addEventListener("scroll", () => {
    toTop.classList.toggle("is-visible", window.scrollY > 900);
  }, { passive: true });
  toTop.addEventListener("click", () => {
    if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- TOAST ---------- */
const toastEl = document.getElementById("toast");
let toastTimer;
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2600);
}


/* ---------- FAVORITES / SHORTLIST (localStorage) ---------- */
window.Favorites = (function () {
  // Favourites are live listings (from the OREAL/MSJ feed), stored by
  // videoId/url with just enough data to render them in the drawer.
  let favs = [];
  try { favs = JSON.parse(localStorage.getItem("ar_favs_v2") || "[]"); } catch (e) { favs = []; }
  if (!Array.isArray(favs)) favs = [];
  const save = () => { try { localStorage.setItem("ar_favs_v2", JSON.stringify(favs)); } catch (e) {} };

  const countEl = document.getElementById("favCount");
  const navFav = document.getElementById("navFav");
  const drawer = document.getElementById("shortlist");
  const listEl = document.getElementById("shortlistList");
  const sCount = document.getElementById("shortlistCount");
  const sendBtn = document.getElementById("shortlistSend");

  const keyOf = (l) => l && (l.id || l.url);
  const esc = (t) => { const d = document.createElement("div"); d.textContent = t == null ? "" : t; return d.innerHTML; };
  function isFav(id) { return favs.some((f) => f.id === id); }
  function updateCount() {
    if (countEl) countEl.textContent = favs.length;
    if (navFav) navFav.classList.toggle("has-favs", favs.length > 0);
  }
  // reflect saved state on any favourite hearts currently in the DOM
  function sync() {
    document.querySelectorAll(".feedcard__fav").forEach((btn) => {
      const on = isFav(btn.dataset.id);
      btn.classList.toggle("is-fav", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  function removeById(id) {
    const at = favs.findIndex((f) => f.id === id);
    if (at > -1) { favs.splice(at, 1); save(); updateCount(); sync(); renderDrawer(); }
  }
  function toggle(listing, btn) {
    const id = keyOf(listing);
    if (!id) return;
    const at = favs.findIndex((f) => f.id === id);
    if (at === -1) {
      favs.push({ id: id, title: listing.title || "", url: listing.url || "",
                  thumb: listing.thumb || "", channel: listing.channel || "" });
      toast("Saved to your favourites ♥");
    } else { favs.splice(at, 1); }
    save(); updateCount(); sync();
    if (btn) {
      const on = isFav(id);
      btn.classList.toggle("is-fav", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      if (on) { btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop"); }
    }
    if (drawer && drawer.classList.contains("is-open")) renderDrawer();
  }
  function waLink() {
    if (!favs.length) return "#";
    const lines = favs.map((f) => `• ${f.title}\n  ${f.url}`);
    const msg = `Hello Adeel, I've saved these listings on your site — what are they really worth, and can you get me a better price?\n\n${lines.join("\n\n")}`;
    return `https://wa.me/16134083945?text=${encodeURIComponent(msg)}`;
  }
  function renderDrawer() {
    if (sCount) sCount.textContent = favs.length;
    if (sendBtn) {
      sendBtn.href = waLink();
      sendBtn.classList.toggle("is-disabled", favs.length === 0);
    }
    if (!listEl) return;
    if (!favs.length) {
      listEl.innerHTML = `<p class="shortlist__empty">No saved listings yet. Tap the ♥ on any live listing in "Live Market Watch" to save it here.</p>`;
      return;
    }
    listEl.innerHTML = favs.map((f) => `<div class="sl-item">
        <a class="sl-item__thumb" href="${esc(f.url)}" target="_blank" rel="noopener"><img src="${esc(f.thumb)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'" /></a>
        <div class="sl-item__body">
          <strong>${esc(f.title)}</strong>
          <span>${esc((f.channel || "").toUpperCase())}</span>
          <a class="sl-item__watch" href="${esc(f.url)}" target="_blank" rel="noopener">Watch on YouTube ↗</a>
        </div>
        <button class="sl-item__rm" type="button" data-rm="${esc(f.id)}" aria-label="Remove">✕</button>
      </div>`).join("");
    listEl.querySelectorAll("[data-rm]").forEach((b) =>
      b.addEventListener("click", () => removeById(b.dataset.rm)));
  }
  function open() {
    if (!drawer) return;
    renderDrawer();
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    if (typeof lenis !== "undefined" && lenis) lenis.stop();
  }
  function close() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    if (typeof lenis !== "undefined" && lenis) lenis.start();
  }

  if (navFav) navFav.addEventListener("click", open);
  const sb = document.getElementById("shortlistBackdrop");
  const sc = document.getElementById("shortlistClose");
  const scl = document.getElementById("shortlistClear");
  if (sb) sb.addEventListener("click", close);
  if (sc) sc.addEventListener("click", close);
  if (scl) scl.addEventListener("click", () => { favs = []; save(); updateCount(); sync(); renderDrawer(); });
  if (sendBtn) sendBtn.addEventListener("click", (e) => { if (!favs.length) e.preventDefault(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  updateCount(); sync();
  return { toggle, isFav, sync };
})();

/* ---------- MARKET INSIGHTS (animate bars + numbers on view) ---------- */
(function () {
  const bars = document.querySelectorAll("[data-bar]");
  const vals = document.querySelectorAll("[data-bar-val]");
  if (!bars.length) return;
  const animateVal = (el) => {
    const end = parseFloat(el.dataset.barVal);
    const suffix = el.dataset.suffix || "";
    if (!HAS_GSAP) { el.textContent = end + suffix; return; }
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: () => { el.textContent = Math.round(o.v) + suffix; } });
  };
  const fire = () => {
    bars.forEach((b) => { b.style.width = b.dataset.bar + "%"; });
    vals.forEach(animateVal);
  };
  const section = document.getElementById("insights");
  if ("IntersectionObserver" in window && section) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => { if (e.isIntersecting) { fire(); obs.disconnect(); } });
    }, { threshold: 0.25 });
    io.observe(section);
  } else { fire(); }
})();

/* ---------- BOOK A CONSULTATION ---------- */
const bookForm = document.getElementById("bookForm");
if (bookForm) {
  const dateInput = bookForm.querySelector('input[name="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];
  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(bookForm);
    const msg =
      `Hello Adeel, I'd like to book a consultation.\n\n` +
      `Name: ${d.get("name") || "—"}\n` +
      `Phone: ${d.get("phone") || "—"}\n` +
      `Date: ${d.get("date") || "—"}\n` +
      `Time: ${d.get("time")}\n` +
      `Purpose: ${d.get("intent")}\n` +
      `Meet by: ${d.get("mode")}`;
    (window.LeadRelay ? window.LeadRelay.send(msg) : window.open(`https://wa.me/16134083945?text=${encodeURIComponent(msg)}`, "_blank", "noopener"));
    toast("Opening WhatsApp to confirm your slot…");
  });
}

/* ---------- MARKET PULSE TABS ---------- */
(function () {
  const tabs = document.getElementById("pulseTabs");
  const isbPanel = document.getElementById("pulseIsb");
  const lhrPanel = document.getElementById("pulseLhr");
  if (!tabs || !isbPanel || !lhrPanel) return;
  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-city]");
    if (!btn) return;
    const city = btn.dataset.city;
    tabs.querySelectorAll(".chip").forEach((b) => b.classList.toggle("is-active", b.dataset.city === city));
    isbPanel.classList.toggle("is-active", city === "isb");
    lhrPanel.classList.toggle("is-active", city === "lhr");
  });

  // Clicking a price row asks me about that area on WhatsApp
  document.querySelectorAll(".pulse__row").forEach((row) => {
    row.addEventListener("click", () => {
      const area = (row.querySelector("strong") || {}).textContent || "";
      const cityName = isbPanel.classList.contains("is-active") ? "Islamabad" : "Lahore";
      const msg = `Hello Adeel, I saw the price guide on your site — what's currently available in ${area.trim()}, ${cityName}?`;
      (window.LeadRelay ? window.LeadRelay.send(msg) : window.open(`https://wa.me/16134083945?text=${encodeURIComponent(msg)}`, "_blank", "noopener"));
    });
  });
})();

/* ---------- PROPERTY ALERTS ---------- */
const alertForm = document.getElementById("alertForm");
if (alertForm) {
  alertForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(alertForm);
    const msg =
      `Hello Adeel, please add me to your new-listing alerts.\n\n` +
      `Name: ${d.get("name") || "—"}\n` +
      `City: ${d.get("city")}\n` +
      `Area: ${d.get("area") || "any"}\n` +
      `Plot size: ${d.get("size")}\n` +
      `Budget: ${d.get("budget") || "flexible"} Crore\n` +
      `Purpose: ${d.get("purpose")}`;
    (window.LeadRelay ? window.LeadRelay.send(msg) : window.open(`https://wa.me/16134083945?text=${encodeURIComponent(msg)}`, "_blank", "noopener"));
    toast("Opening WhatsApp to set up your alerts…");
  });
}

/* ---------- DEALS CITY FILTER ---------- */
(function () {
  const wrap = document.getElementById("dealsCityFilter");
  if (!wrap) return;
  wrap.addEventListener("click", (e) => {
    const b = e.target.closest("[data-city]");
    if (!b) return;
    const city = b.dataset.city;
    wrap.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c.dataset.city === city));
    document.querySelectorAll(".deal").forEach((d) => {
      d.classList.toggle("is-hidden", city !== "all" && d.dataset.city !== city);
    });
  });
})();

/* ---------- AREA GUIDE → GOOGLE MAPS ---------- */
(function () {
  document.querySelectorAll(".areas .area").forEach((area) => {
    const h3 = area.querySelector(".area__top h3");
    const sub = area.querySelector(".area__top span");
    if (!h3) return;
    const query = `${h3.textContent.trim()} ${sub ? sub.textContent.trim() : ""} Pakistan`.replace(/\s+/g, " ");
    const a = document.createElement("a");
    a.className = "area__map";
    a.href = "https://www.google.com/maps/search/" + encodeURIComponent(query);
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML = "📍 View on map <span>↗</span>";
    area.appendChild(a);
  });
})();

/* ---------- AREA MAP (Google Maps embed switcher) ---------- */
(function () {
  const tabs = document.getElementById("mapTabs");
  const frame = document.getElementById("mapFrame");
  if (!tabs || !frame) return;
  tabs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-q]");
    if (!b) return;
    tabs.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c === b));
    frame.src = `https://maps.google.com/maps?q=${encodeURIComponent(b.dataset.q)}&z=12&output=embed`;
  });
})();

/* ---------- FEATURED LISTING SPOTLIGHT ----------
   Cinematic showcase that rotates through the real available listings
   (HOT_DEALS). Reuses the deal lightbox for the 3D model and virtual tour. */
(function () {
  const img = document.getElementById("spotImg");
  if (!img || typeof HOT_DEALS === "undefined" || !HOT_DEALS.length) return;
  const el = (id) => document.getElementById(id);
  const badge = el("spotBadge"), loc = el("spotLoc"), title = el("spotTitle"),
    tags = el("spotTags"), specs = el("spotSpecs"), price = el("spotPrice"),
    wa = el("spotWa"), tourBtn = el("spotTour"), threeBtn = el("spot3d"),
    dots = el("spotDots"), prev = el("spotPrev"), next = el("spotNext");
  let idx = 0;

  HOT_DEALS.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "spotlight__dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", "Listing " + (i + 1));
    dot.addEventListener("click", () => go(i));
    dots.appendChild(dot);
  });

  function render() {
    const d = HOT_DEALS[idx];
    img.src = d.img; img.alt = d.title;
    guardImage(img, idx, d.title);
    badge.textContent = d.badge || "Available";
    loc.textContent = d.loc;
    title.textContent = d.title;
    tags.innerHTML = (d.tags || []).map((t) => `<span>${t}</span>`).join("");
    specs.textContent = d.specs;
    price.textContent = d.demand;
    wa.href = `https://wa.me/16134083945?text=${encodeURIComponent(
      `Hello Adeel, I'm interested in the featured listing: ${d.title} (${d.loc}) — Demand ${d.demand}. Please share details.`)}`;
    dots.querySelectorAll(".spotlight__dot").forEach((x, i) => x.classList.toggle("is-active", i === idx));
  }
  function go(i) { idx = (i + HOT_DEALS.length) % HOT_DEALS.length; render(); }

  prev.addEventListener("click", () => go(idx - 1));
  next.addEventListener("click", () => go(idx + 1));
  tourBtn.addEventListener("click", () => {
    const d = HOT_DEALS[idx];
    if (window.LikeThis) window.LikeThis.openFromText(d.title + " " + (d.specs || ""), d.loc || d.title);
  });
  threeBtn.addEventListener("click", () => openDealLightbox(HOT_DEALS[idx], idx));

  render();
})();

/* ============================================================
   INSTANT VALUATION WIDGET
   ============================================================ */
(function () {
  const VALDATA = {
    dha1_isb:       { "5m": "2.8–3.5", "10m": "5–7",    "1k": "12–18" },
    dha2_isb:       { "5m": "2.4–3.2", "10m": "4.5–6",  "1k": "13–16" },
    f7f8_isb:       { "5m": null,       "10m": "14–20",  "1k": "28–45" },
    e11_isb:        { "5m": "3.5–5",   "10m": "8–12",   "1k": "18–25" },
    bahria_enc_isb: { "5m": "1.8–2.5", "10m": "3.5–5.5","1k": "7–10"  },
    b17_isb:        { "5m": "1.4–2",   "10m": "2.8–4",  "1k": "6–9"   },
    gulberg_isb:    { "5m": null,       "10m": null,     "1k": "5.5–9" },
    dha5_lhr:       { "5m": "3.5–5",   "10m": "8–14",   "1k": "22–35" },
    dha6_lhr:       { "5m": "2.5–4",   "10m": "5.5–9",  "1k": "13–20" },
    bahria_lhr:     { "5m": "2–3.5",   "10m": "4–7",    "1k": "9–15"  },
    gulberg3_lhr:   { "5m": null,       "10m": null,     "1k": "28–45" },
    modeltown_lhr:  { "5m": null,       "10m": null,     "1k": "18–35" },
    lakecity_lhr:   { "5m": "2.5–3.5", "10m": "4–6",    "1k": "9–14"  }
  };
  const ISB_AREAS = ["dha1_isb","dha2_isb","f7f8_isb","e11_isb","bahria_enc_isb","b17_isb","gulberg_isb"];
  const LHR_AREAS = ["dha5_lhr","dha6_lhr","bahria_lhr","gulberg3_lhr","modeltown_lhr","lakecity_lhr"];
  const LABELS = {
    dha1_isb:"DHA Phase 1, Islamabad", dha2_isb:"DHA Phase 2, Islamabad",
    f7f8_isb:"F-7 / F-8, Islamabad",  e11_isb:"E-11, Islamabad",
    bahria_enc_isb:"Bahria Enclave, Islamabad", b17_isb:"B-17 Multi Gardens",
    gulberg_isb:"Gulberg Greens",
    dha5_lhr:"DHA Phase 5, Lahore",   dha6_lhr:"DHA Phase 6, Lahore",
    bahria_lhr:"Bahria Town, Lahore", gulberg3_lhr:"Gulberg III, Lahore",
    modeltown_lhr:"Model Town, Lahore", lakecity_lhr:"Lake City, Lahore"
  };
  const SIZE_LBL = { "5m":"5 Marla", "10m":"10 Marla", "1k":"1 Kanal" };

  const valCity   = document.getElementById("valCity");
  const valArea   = document.getElementById("valArea");
  const valSize   = document.getElementById("valSize");
  const valResult = document.getElementById("valResult");
  const valWA     = document.getElementById("valWA");
  if (!valCity) return;

  function syncAreaOptions() {
    var list = valCity.value === "isb" ? ISB_AREAS : LHR_AREAS;
    valArea.innerHTML = list.map(function (k) {
      return '<option value="' + k + '">' + LABELS[k] + '</option>';
    }).join("");
    updateResult();
  }

  function updateResult() {
    var area  = valArea.value;
    var size  = valSize.value;
    var range = (VALDATA[area] || {})[size];
    var aLbl  = LABELS[area] || area;
    var sLbl  = SIZE_LBL[size];
    if (!range) {
      valResult.innerHTML = '<p class="val-result__msg">No current data for ' + sLbl + ' in ' + aLbl + '. <a href="#contact">Contact me</a> for a precise valuation.</p>';
    } else {
      valResult.innerHTML = '<div class="val-result"><div class="val-result__label">Estimated Market Range</div><div class="val-result__range">' + range + ' <span>Crore PKR</span></div><div class="val-result__sub">' + sLbl + ' · ' + aLbl + ' · Active listings Q2 2026</div></div>';
    }
    var msg = "Hello Adeel, I'd like a precise valuation for my " + sLbl + " in " + aLbl + ". The market estimate shows " + (range || "unknown") + " Crore PKR.";
    if (valWA) valWA.href = "https://wa.me/16134083945?text=" + encodeURIComponent(msg);
  }

  valCity.addEventListener("change", syncAreaOptions);
  valArea.addEventListener("change", updateResult);
  valSize.addEventListener("change", updateResult);
  syncAreaOptions();
})();

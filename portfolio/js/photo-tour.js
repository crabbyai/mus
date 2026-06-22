/* ============================================================
   PHOTO TOUR — real house walkthrough from extracted video frames
   Replaces the PlayCanvas procedural interior with actual footage.
   API mirrors interior.js: window.HouseTour.open / openProperty / openDeal
   ============================================================ */
(function () {

  /* ---------- room labels (one per extracted frame) ---------- */
  const ROOMS = [
    "Front Facade",
    "Entrance Gate",
    "Front Lawn",
    "Garden & Lawn",
    "Porch & Driveway",
    "Main Entrance",
    "Reception Foyer",
    "Drawing Room",
    "Formal Lounge",
    "Sitting Area",
    "Dining Room",
    "Dining Area",
    "Kitchen",
    "Open Kitchen",
    "Utility Area",
    "Master Bedroom",
    "Master Suite",
    "Bedroom 2",
    "Bedroom 3",
    "Attached Bathroom",
    "Upper Hallway",
    "Roof Terrace",
    "Rear Garden",
    "Aerial Overview"
  ];

  const TOTAL = 24;
  let current = 0;
  let isOpen  = false;
  let propTitle = "12 Marla — Bahria Town, Islamabad";
  let touchStartX = 0;
  const imgs = [];   // preloaded Image objects

  /* ---------- DOM (reuse existing .tour overlay) ---------- */
  const overlay  = document.getElementById("tour");
  const titleEl  = document.getElementById("tourName");
  const subEl    = document.getElementById("tourSub");
  const loaderEl = document.getElementById("tourLoader");
  const closeBtn = document.getElementById("tourClose");

  /* ---------- inject photo-tour UI into the overlay ---------- */
  const bg = document.createElement("div");
  bg.id = "ptBg";
  bg.className = "pt-bg";
  overlay.insertBefore(bg, overlay.firstChild);

  const bgNext = document.createElement("div");
  bgNext.className = "pt-bg pt-bg--next";
  overlay.insertBefore(bgNext, overlay.firstChild);

  const prevBtn = document.createElement("button");
  prevBtn.className = "pt-nav pt-nav--prev";
  prevBtn.setAttribute("aria-label", "Previous room");
  prevBtn.innerHTML = "&#8592;";
  overlay.appendChild(prevBtn);

  const nextBtn = document.createElement("button");
  nextBtn.className = "pt-nav pt-nav--next";
  nextBtn.setAttribute("aria-label", "Next room");
  nextBtn.innerHTML = "&#8594;";
  overlay.appendChild(nextBtn);

  const label = document.createElement("div");
  label.className = "pt-label";
  overlay.appendChild(label);

  const strip = document.createElement("div");
  strip.className = "pt-strip";
  overlay.appendChild(strip);

  /* build dot strip */
  for (let i = 0; i < TOTAL; i++) {
    const d = document.createElement("button");
    d.className = "pt-dot";
    d.setAttribute("aria-label", "Go to " + ROOMS[i]);
    d.addEventListener("click", () => goTo(i));
    strip.appendChild(d);
  }
  const dots = strip.querySelectorAll(".pt-dot");

  /* ---------- hide canvas + PlayCanvas-specific chrome ---------- */
  const canvas = document.getElementById("tourCanvas");
  if (canvas) canvas.style.display = "none";
  const joy    = document.getElementById("tourJoy");
  if (joy)    joy.style.display = "none";
  const legend = overlay.querySelector(".tour__legend");
  if (legend) legend.style.display = "none";

  /* ---------- image path helper ---------- */
  function src(i) {
    return "assets/tour/room-" + String(i + 1).padStart(2, "0") + ".jpg";
  }

  /* ---------- preload all images ---------- */
  function preload() {
    for (let i = 0; i < TOTAL; i++) {
      const im = new Image();
      im.src = src(i);
      imgs[i] = im;
    }
  }

  /* ---------- navigate ---------- */
  function goTo(idx, instant) {
    const prev = current;
    current = (idx + TOTAL) % TOTAL;

    if (!instant && prev !== current) {
      bgNext.style.backgroundImage = "url(" + src(current) + ")";
      bgNext.classList.add("pt-bg--visible");
      setTimeout(() => {
        bg.style.backgroundImage = bgNext.style.backgroundImage;
        bgNext.classList.remove("pt-bg--visible");
      }, 420);
    } else {
      bg.style.backgroundImage = "url(" + src(current) + ")";
    }

    label.textContent = ROOMS[current] || "";
    label.classList.remove("pt-label--in");
    void label.offsetWidth;
    label.classList.add("pt-label--in");

    dots.forEach((d, j) => d.classList.toggle("is-active", j === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* ---------- open / close ---------- */
  function openTour(title) {
    if (title) propTitle = title;
    if (titleEl) titleEl.textContent = propTitle;
    if (subEl)   subEl.textContent   = "Photo Walkthrough";
    if (loaderEl) loaderEl.style.display = "none";

    preload();
    goTo(0, true);

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    isOpen = true;
    document.body.style.overflow = "hidden";
  }

  function closeTour() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    isOpen = false;
    document.body.style.overflow = "";
    if (window.lenis && window.__lenis) window.__lenis.start();
  }

  /* ---------- events ---------- */
  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);
  if (closeBtn) closeBtn.addEventListener("click", closeTour);

  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "Escape")     closeTour();
  });

  overlay.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  overlay.addEventListener("touchend", (e) => {
    if (!isOpen) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  }, { passive: true });

  /* ---------- public API (mirrors interior.js HouseTour) ---------- */
  window.HouseTour = {
    open:           ()         => openTour(),
    openProperty:   (i, title) => openTour(title),
    openDeal:       (i, title) => openTour(title)
  };

}());

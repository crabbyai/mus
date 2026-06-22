/* ============================================================
   ENHANCE — cursor glow, pointer parallax, 3D tilt, spotlight
   Vanilla JS, no dependencies. Additive & self-contained.
   ============================================================ */
(function () {
  "use strict";

  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
  if (reduced) return;

  /* ---------- Cursor glow: luminous trail with easing ---------- */
  if (canHover) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const target = { ...pos };
    let shown = false;

    window.addEventListener("mousemove", (e) => {
      target.x = e.clientX; target.y = e.clientY;
      if (!shown) { glow.classList.add("is-on"); shown = true; }
    }, { passive: true });
    window.addEventListener("mouseleave", () => { glow.classList.remove("is-on"); shown = false; });

    (function loop() {
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      glow.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Hero aurora: gentle pointer parallax ---------- */
  const aurora = document.querySelector(".hero__aurora");
  const hero = document.querySelector(".hero");
  if (aurora && hero && canHover) {
    const blobs = aurora.querySelectorAll("span");
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      blobs.forEach((b, i) => {
        const depth = (i + 1) * 14;
        b.style.marginLeft = (dx * depth) + "px";
        b.style.marginTop = (dy * depth) + "px";
      });
    }, { passive: true });
  }

  /* ---------- 3D tilt for framed/glass elements ---------- */
  if (canHover) {
    const MAX = 7; // degrees
    const tiltEls = document.querySelectorAll(".hero__portrait-frame, .hero__portrait-card");
    tiltEls.forEach((el) => {
      el.addEventListener("mouseenter", () => el.classList.add("tilt-on"));
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg)`;
      });
      el.addEventListener("mouseleave", () => {
        el.classList.remove("tilt-on");
        el.style.transform = "";
      });
    });
  }

  /* ---------- Card spotlight: track pointer into CSS vars ----------
     Delegated so it also covers cards rendered after load (deals, portfolio). */
  if (canHover) {
    document.addEventListener("mousemove", (e) => {
      const card = e.target.closest && e.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
    }, { passive: true });
  }
})();

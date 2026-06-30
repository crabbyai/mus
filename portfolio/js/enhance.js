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

  /* ---------- Exit-intent popup ---------- */
  if (!sessionStorage.getItem("exitShown")) {
    const popup   = document.getElementById("exitPopup");
    const exitBd  = document.getElementById("exitPopupBd");
    const exitX   = document.getElementById("exitPopupClose");
    const exitFrm = document.getElementById("exitForm");
    let exitFired = false;

    function openExit() {
      if (exitFired || !popup) return;
      exitFired = true;
      sessionStorage.setItem("exitShown", "1");
      popup.classList.add("is-open");
      popup.setAttribute("aria-hidden", "false");
    }
    function closeExit() {
      if (!popup) return;
      popup.classList.remove("is-open");
      popup.setAttribute("aria-hidden", "true");
    }

    if (exitBd)  exitBd.addEventListener("click", closeExit);
    if (exitX)   exitX.addEventListener("click", closeExit);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeExit(); });

    if (canHover) {
      document.addEventListener("mouseleave", (e) => { if (e.clientY < 8) openExit(); });
    } else {
      setTimeout(openExit, 40000);
    }

    if (exitFrm) {
      exitFrm.addEventListener("submit", (e) => {
        e.preventDefault();
        const d = new FormData(exitFrm);
        const msg = `Hello Adeel! My name is ${d.get("name")}. I'm interested in: ${d.get("intent")}. Please reach me on this WhatsApp number.`;
        window.open(`https://wa.me/16134083945?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
        closeExit();
      });
    }
  }
})();

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

  /* ---------- Hero gold dust ----------
     A slow drift of warm motes over the aurora. 2D canvas rather than WebGL
     on purpose: this sits on the most performance-critical screen on the
     site, and the effect doesn't need a GPU context to read well. Sleeps the
     moment the hero leaves the viewport or the tab is hidden. */
  if (hero) {
    const dust = document.createElement("canvas");
    dust.className = "hero__dust";
    dust.setAttribute("aria-hidden", "true");
    hero.insertBefore(dust, hero.firstChild);

    const ctx = dust.getContext("2d");
    let w = 0, h = 0, dpr = 1, motes = [], raf = 0, live = false;
    let px = 0, py = 0, tx = 0, ty = 0;

    function size() {
      const r = hero.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      dust.width = Math.round(w * dpr); dust.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density by area, capped so a big desktop doesn't pay for hundreds.
      const n = Math.min(90, Math.round((w * h) / 22000));
      motes = [];
      for (let i = 0; i < n; i++) {
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 1.9,
          // depth drives both parallax and speed, which is what sells it
          d: 0.35 + Math.random() * 0.9,
          a: 0.16 + Math.random() * 0.5,
          drift: (Math.random() - 0.5) * 0.16,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function frame(t) {
      if (!live) return;
      raf = requestAnimationFrame(frame);
      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;
      ctx.clearRect(0, 0, w, h);
      const time = t * 0.001;
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.y -= m.d * 0.22;
        m.x += m.drift + Math.sin(time * 0.5 + m.phase) * 0.12;
        if (m.y < -6) { m.y = h + 6; m.x = Math.random() * w; }
        if (m.x < -6) m.x = w + 6; else if (m.x > w + 6) m.x = -6;
        const twinkle = 0.72 + Math.sin(time * 1.6 + m.phase) * 0.28;
        ctx.globalAlpha = m.a * twinkle;
        ctx.fillStyle = i % 7 === 0 ? "#f3eee3" : "#c9a45c";
        ctx.beginPath();
        ctx.arc(m.x + px * m.d * 3, m.y + py * m.d * 3, m.r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function play() { if (!live) { live = true; raf = requestAnimationFrame(frame); } }
    function pause() { live = false; cancelAnimationFrame(raf); }

    size();
    addEventListener("resize", size, { passive: true });
    document.addEventListener("visibilitychange", () => (document.hidden ? pause() : play()));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? play() : pause())))
        .observe(hero);
    } else { play(); }

    if (canHover) {
      hero.addEventListener("mousemove", (e) => {
        const r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 12;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 12;
      }, { passive: true });
    }
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
        (window.LeadRelay ? window.LeadRelay.send(msg) : window.open(`https://wa.me/16134083945?text=${encodeURIComponent(msg)}`, "_blank", "noopener"));
        closeExit();
      });
    }
  }
})();

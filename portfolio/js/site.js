/* ============================================================
   ADEEL RAHMAN — ACTOR · page chrome
   Preloader, smooth scroll, hero intro, scroll reveals, counters,
   nav, custom cursor and the casting form. The drama feed lives in
   dramas.js so either can fail without taking the other down.
   ============================================================ */
(function () {
  "use strict";

  const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HAS_GSAP = typeof gsap !== "undefined" && !REDUCED;
  const HAS_ST = HAS_GSAP && typeof ScrollTrigger !== "undefined";
  const HAS_LENIS = typeof Lenis !== "undefined" && !REDUCED;
  if (!HAS_GSAP) document.documentElement.classList.add("no-anim");

  const $ = (id) => document.getElementById(id);

  /* ---------- counters ---------- */
  function runCounters() {
    document.querySelectorAll("[data-count]").forEach((el) => {
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      if (!HAS_GSAP) { el.textContent = end + suffix; return; }
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.8, ease: "power2.out", onUpdate() { el.textContent = Math.round(o.v) + suffix; } });
    });
  }

  /* ---------- preloader ---------- */
  const preloader = $("preloader"), bar = $("preloaderBar"), count = $("preloaderCount");
  let started = false, done = false;
  function dismiss() {
    if (done) return;
    done = true;
    if (!preloader) { heroIntro(); return; }
    if (!HAS_GSAP) { preloader.style.display = "none"; runCounters(); return; }
    gsap.to(preloader, {
      yPercent: -100, duration: 0.9, ease: "power4.inOut",
      onComplete() { preloader.style.display = "none"; }
    });
    heroIntro();
  }
  function start() {
    if (started) return;
    started = true;
    if (!HAS_GSAP || !bar) { if (bar) bar.style.width = "100%"; if (count) count.textContent = "100"; dismiss(); return; }
    const p = { v: 0 };
    gsap.to(p, {
      v: 100, duration: 1.3, ease: "power2.inOut",
      onUpdate() { bar.style.width = p.v + "%"; count.textContent = Math.round(p.v); },
      onComplete: dismiss
    });
  }
  if (document.readyState === "complete") start(); else window.addEventListener("load", start);
  // Never trap a visitor behind the curtain if something stalls.
  setTimeout(() => { if (!done) { start(); setTimeout(dismiss, 800); } }, 2500);

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (HAS_ST) gsap.registerPlugin(ScrollTrigger);
  if (HAS_LENIS && HAS_GSAP) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    if (HAS_ST) lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }

  /* ---------- hero intro ---------- */
  function heroIntro() {
    if (!HAS_GSAP) return;
    gsap.timeline({ defaults: { ease: "power4.out" } })
      .to(".hero__title .line > span", { y: 0, duration: 1.3, stagger: 0.12 })
      .fromTo(".hero__portrait", { opacity: 0, y: 60, rotate: 2 }, { opacity: 1, y: 0, rotate: 0, duration: 1.4 }, 0.3)
      .to(".hero [data-reveal]:not(.hero__stat)", { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 0.6)
      .to(".hero__stat", { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, onComplete: runCounters }, 0.9);
  }

  /* ---------- scroll reveals + parallax ---------- */
  if (HAS_ST) {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      if (el.closest(".hero")) return;
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true }
      });
    });
    document.querySelectorAll("[data-speed]").forEach((el) => {
      const speed = parseFloat(el.dataset.speed);
      gsap.to(el, {
        yPercent: (1 - speed) * 30, ease: "none",
        scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  } else if (HAS_GSAP) {
    gsap.set("[data-reveal]", { opacity: 1, y: 0 });
  }

  /* ---------- anchors, nav, progress ---------- */
  const burger = $("navBurger"), mobileMenu = $("mobileMenu"), nav = $("nav"), progress = $("scrollProgress"), toTop = $("toTop");
  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove("is-open");
    if (burger) burger.classList.remove("is-open");
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute("href");
    if (href.length < 2 || href.indexOf("#watch/") === 0) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -70 });
    else target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
    closeMenu();
  });
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 60);
    if (progress) progress.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100 + "%";
    if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 900);
  }, { passive: true });
  if (burger) burger.addEventListener("click", () => {
    burger.classList.toggle("is-open");
    mobileMenu.classList.toggle("is-open");
  });
  if (toTop) toTop.addEventListener("click", () => {
    if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
  });

  /* ---------- scrollspy ---------- */
  const spyTargets = ["dramas", "about", "onset", "casting", "faq", "contact"].map($).filter(Boolean);
  if ("IntersectionObserver" in window && spyTargets.length) {
    const links = document.querySelectorAll(".nav__links a");
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const href = "#" + en.target.id;
        links.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === href));
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spyTargets.forEach((t) => spy.observe(t));
  }

  /* ---------- custom cursor + magnetic buttons ---------- */
  if (HAS_GSAP && window.matchMedia("(hover: hover)").matches) {
    const cursor = $("cursor"), dot = $("cursorDot");
    if (cursor && dot) {
      const pos = { x: innerWidth / 2, y: innerHeight / 2 }, mouse = { x: pos.x, y: pos.y };
      window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
      gsap.ticker.add(() => {
        pos.x += (mouse.x - pos.x) * 0.16;
        pos.y += (mouse.y - pos.y) * 0.16;
        cursor.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
        dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%,-50%)`;
      });
      // Delegated, so cards the drama feed renders later get the hover ring too.
      document.addEventListener("mouseover", (e) => {
        cursor.classList.toggle("is-hover", !!e.target.closest("a, button, summary, input, select"));
      });
    }
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25, duration: 0.4, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" }));
    });
  }

  /* ---------- casting form → WhatsApp ---------- */
  const form = $("leadForm");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const lines = [
      "Hello Adeel, I found your actor portfolio.",
      "Name: " + (f.get("name") || ""),
      "Project: " + (f.get("project") || ""),
      "City: " + (f.get("city") || ""),
      f.get("details") ? "Details: " + f.get("details") : ""
    ].filter(Boolean);
    window.open("https://wa.me/16134083945?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
  });

  const year = $("year");
  if (year) year.textContent = new Date().getFullYear();
})();

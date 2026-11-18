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
  const spyTargets = ["watch", "dramas", "about", "why", "journey", "overseas", "onset", "roles", "match", "brands", "screentest", "promise", "casting", "kit", "faq", "contact"].map($).filter(Boolean);
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
    const date = f.get("date");
    const nice = date ? new Date(date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "";
    const lines = [
      "Hello Adeel, I found your actor portfolio.",
      "Name: " + (f.get("name") || ""),
      "Project: " + (f.get("project") || ""),
      f.get("role") ? "Role: " + f.get("role") : "",
      "Format: " + (f.get("format") || ""),
      nice ? "Date: " + nice : "",
      f.get("sides") ? "Script / sides: " + f.get("sides") : "",
      f.get("details") ? "Details: " + f.get("details") : ""
    ].filter(Boolean);
    window.open("https://wa.me/16134083945?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    if (date) offerCalendar(`${f.get("format")} — Adeel Rahman (${f.get("project")})`, date, null, [f.get("role"), f.get("sides"), f.get("details")].filter(Boolean).join(" · "));
  });

  /* ---------- photo lightbox: any photo, whole, full size ---------- */
  const zoom = $("zoom"), zoomImg = $("zoomImg");
  if (zoom && zoomImg) {
    const shots = Array.from(document.querySelectorAll("[data-zoom] img, [data-zoom-group] img"));
    let at = 0, opener = null;
    const show = (i) => {
      at = (i + shots.length) % shots.length;
      zoomImg.src = shots[at].currentSrc || shots[at].src;
      zoomImg.alt = shots[at].alt;
    };
    const open = (i, from) => {
      opener = from || null;
      show(i);
      zoom.classList.add("is-open");
      zoom.setAttribute("aria-hidden", "false");
      document.documentElement.style.overflow = "hidden";
      if (lenis) lenis.stop();
      $("zoomClose").focus({ preventScroll: true });
    };
    const shut = () => {
      zoom.classList.remove("is-open");
      zoom.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
      if (lenis) lenis.start();
      if (opener && opener.focus) opener.focus({ preventScroll: true });
    };
    document.addEventListener("click", (e) => {
      const img = e.target.closest("[data-zoom], [data-zoom-group] picture");
      if (!img || zoom.contains(e.target)) return;
      const el = img.querySelector("img");
      const i = shots.indexOf(el);
      if (i >= 0) open(i, img.closest("button") || null);
    });
    zoom.addEventListener("click", (e) => {
      if (e.target.closest("#zoomPrev")) show(at - 1);
      else if (e.target.closest("#zoomNext")) show(at + 1);
      else if (e.target !== zoomImg) shut();
    });
    document.addEventListener("keydown", (e) => {
      if (!zoom.classList.contains("is-open")) return;
      if (e.key === "Escape") shut();
      else if (e.key === "ArrowLeft") show(at - 1);
      else if (e.key === "ArrowRight") show(at + 1);
      else if (e.key === "Tab") {
        const f = zoom.querySelectorAll("button"), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- comp card: print / save as PDF ---------- */
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".js-print-comp")) return;
    document.documentElement.classList.add("print-comp");
    window.print();
  });
  window.addEventListener("afterprint", () => document.documentElement.classList.remove("print-comp"));

  /* ---------- press kit: copy a bio ---------- */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    const text = ($(b.dataset.copy) || {}).textContent || "";
    const done = () => { b.textContent = "Copied ✓"; setTimeout(() => { b.textContent = "Copy"; }, 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text.trim()).then(done, () => selectText($(b.dataset.copy)));
    else selectText($(b.dataset.copy));
  });
  function selectText(el) {
    if (!el) return;
    const r = document.createRange(); r.selectNodeContents(el);
    const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
  }

  /* ---------- role match ---------- */
  const ROLES = [
    { id: "ceo", label: "CEO / Tycoon", photo: "lobby-2", genre: "Business drama · Family saga · Thriller",
      why: "Boardroom roles are where I actually worked. The MBA isn’t a prop: I know how these men talk, negotiate and threaten politely.",
      look: "Navy blazer, open collar or tie, beard groomed." },
    { id: "nri", label: "Son returning from abroad", photo: "mirror", genre: "Family drama · Romance · Social drama",
      why: "The character back from Canada is a staple of Pakistani drama, usually played with a borrowed accent. I’m the real thing: Canadian-born and at home in both worlds.",
      look: "Smart-casual, watch on, sunglasses in hand." },
    { id: "villain", label: "Villain / Enforcer", photo: "lobby-1", genre: "Crime · Thriller · Revenge drama",
      why: "Stillness and a steady stare do more than shouting. I can hold a silence until it becomes a threat.",
      look: "Aviators, dark blazer, full beard." },
    { id: "rishta", label: "The rich rishta / rival", photo: "lights-2", genre: "Romance · Family drama",
      why: "The polished suitor the family is dazzled by: charm on the surface, ambition underneath. A love triangle needs a rival worth fearing.",
      look: "Blazer, striped shirt, easy smile that doesn’t reach the eyes." },
    { id: "brother", label: "Elder brother / father figure", photo: "take-3", genre: "Family serial · Social drama",
      why: "Steady, protective and quietly carrying the family. Presence that holds a scene without needing the spotlight.",
      look: "Pressed shirt and trousers, nothing flashy." },
    { id: "pro", label: "Lawyer / doctor / officer", photo: "lobby-3", genre: "Legal · Medical · Crime procedural",
      why: "Authority reads instantly on this face, and professional dialogue in English or Urdu comes naturally to someone who spent years in meetings.",
      look: "Formal; beard trimmed for uniform roles if the part needs it." }
  ];
  const chipsBox = $("matchChips");
  if (chipsBox) {
    chipsBox.innerHTML = ROLES.map((r, i) => `<button type="button" class="dchip${i === 0 ? " is-active" : ""}" aria-pressed="${i === 0}" data-role="${r.id}">${r.label}</button>`).join("");
    const pick = (id) => {
      const r = ROLES.find((x) => x.id === id) || ROLES[0];
      chipsBox.querySelectorAll("[data-role]").forEach((c) => { const on = c.dataset.role === r.id; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", on); });
      $("matchTitle").textContent = r.label;
      $("matchWhy").textContent = r.why;
      $("matchLook").textContent = r.look;
      $("matchGenre").textContent = r.genre;
      $("matchSend").href = "https://wa.me/16134083945?text=" + encodeURIComponent(`Hello Adeel, I'm casting a "${r.label}" role and found you on your site. Can we talk?`);
    };
    chipsBox.addEventListener("click", (e) => { const c = e.target.closest("[data-role]"); if (c) pick(c.dataset.role); });
    pick(ROLES[0].id);
  }

  /* ---------- install as an app (only where the browser offers it) ---------- */
  const installBtn = $("installBtn");
  let installEvent = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installEvent = e;
    if (installBtn) installBtn.hidden = false;
  });
  if (installBtn) installBtn.addEventListener("click", () => {
    if (!installEvent) return;
    installEvent.prompt();
    installEvent = null;
    installBtn.hidden = true;
  });

  /* ---------- small helpers for the booking forms ---------- */
  const WA = "https://wa.me/16134083945?text=";
  const niceDate = (d) => d ? new Date(d + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "";
  const icsDay = (d) => d.replace(/-/g, "");
  const nextDay = (d) => { const t = new Date(d + "T12:00:00"); t.setDate(t.getDate() + 1); return t.toISOString().slice(0, 10); };
  // Offer an all-day calendar entry for whatever was just booked, built here in the browser.
  function offerCalendar(title, from, to, note) {
    const box = $("bookCal"), a = $("bookCalLink");
    if (!box || !a || !from) return;
    const esc = (t) => String(t).replace(/[\\,;]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Adeel Rahman//Bookings//EN", "BEGIN:VEVENT",
      "UID:" + Date.now() + "@adeel-rahman", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
      "DTSTART;VALUE=DATE:" + icsDay(from), "DTEND;VALUE=DATE:" + icsDay(nextDay(to || from)),
      "SUMMARY:" + esc(title), "DESCRIPTION:" + esc(note + "\nAdeel Rahman · WhatsApp +1 613 408 3945"), "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
    box.hidden = false;
  }
  const sendWa = (lines) => window.open(WA + encodeURIComponent(lines.filter(Boolean).join("\n")), "_blank", "noopener");

  /* ---------- booking tabs ---------- */
  const tabs = Array.from(document.querySelectorAll(".book__tab"));
  const selectTab = (t, focus) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.classList.toggle("is-active", on);
      x.setAttribute("aria-selected", on);
      x.tabIndex = on ? 0 : -1;
      $(x.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { e.preventDefault(); selectTab(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });

  const hold = $("holdForm");
  if (hold) hold.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(hold);
    const from = f.get("from"), to = f.get("to") < from ? from : f.get("to");
    sendWa(["Hello Adeel, I'd like to hold your dates.", "Name: " + f.get("name"), f.get("project") ? "Project: " + f.get("project") : "",
      "Hold: " + f.get("option"), "Dates: " + niceDate(from) + (to !== from ? " – " + niceDate(to) : ""), "Location: " + f.get("city"),
      f.get("notes") ? "Notes: " + f.get("notes") : ""]);
    offerCalendar(`${f.get("option")} — Adeel Rahman${f.get("project") ? " (" + f.get("project") + ")" : ""}`, from, to, "Hold requested on WhatsApp. " + (f.get("notes") || ""));
  });

  const brand = $("brandForm");
  if (brand) brand.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(brand);
    const needs = f.getAll("need");
    sendWa(["Hello Adeel, a brand enquiry.", "Name: " + f.get("name"), "Brand / agency: " + f.get("brand"), needs.length ? "Looking for: " + needs.join(", ") : "",
      f.get("date") ? "Date: " + niceDate(f.get("date")) : "", "Market: " + f.get("market"), f.get("notes") ? "Brief: " + f.get("notes") : ""]);
    if (f.get("date")) offerCalendar(`${f.get("brand")} × Adeel Rahman`, f.get("date"), null, needs.join(", "));
  });

  /* ---------- 30-second profile ---------- */
  const quick = $("quick");
  if (quick) {
    let opener = null;
    const openQ = (from) => {
      opener = from || null;
      quick.classList.add("is-open");
      quick.setAttribute("aria-hidden", "false");
      document.documentElement.style.overflow = "hidden";
      if (lenis) lenis.stop();
      closeMenu();
      $("quickClose").focus({ preventScroll: true });
    };
    const closeQ = (restore) => {
      if (!quick.classList.contains("is-open")) return;
      quick.classList.remove("is-open");
      quick.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
      if (lenis) lenis.start();
      if (restore !== false && opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
    document.addEventListener("click", (e) => {
      const o = e.target.closest("[data-quick-open]");
      if (o) { e.preventDefault(); openQ(o); return; }
      if (e.target === quick || e.target.closest("#quickClose")) { closeQ(); return; }
      const go = e.target.closest("[data-quick-close]");
      if (go) {
        // Smooth scroll is paused while the dialog is open, so close first, then scroll ourselves.
        e.preventDefault();
        e.stopImmediatePropagation();
        closeQ(false);
        const target = document.querySelector(go.getAttribute("href"));
        if (target) requestAnimationFrame(() => {
          if (lenis) lenis.scrollTo(target, { offset: -70 });
          else target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
        });
      }
    });
    document.addEventListener("keydown", (e) => {
      if (!quick.classList.contains("is-open")) return;
      if (e.key === "Escape") { closeQ(); return; }
      if (e.key === "Tab") {
        const f = quick.querySelectorAll("a[href], button"), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // Print the comp card from here: the dialog has to be out of the way first.
    window.addEventListener("beforeprint", () => closeQ(false));
  }

  /* ---------- share this profile: QR, copy, WhatsApp ---------- */
  const qrBox = $("shareQr");
  if (qrBox) {
    const canonical = (document.querySelector('link[rel="canonical"]') || {}).href || location.href.split("#")[0];
    $("shareUrl").textContent = canonical.replace(/^https?:\/\//, "");
    $("shareWa").href = "https://wa.me/?text=" + encodeURIComponent("Adeel Rahman — Canadian-born actor, MBA. Profile, photos and comp card: " + canonical);
    $("shareCopy").addEventListener("click", (e) => {
      const b = e.currentTarget;
      const done = () => { b.textContent = "Link copied ✓"; setTimeout(() => { b.textContent = "Copy link"; }, 2200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(canonical).then(done, () => { b.textContent = canonical; });
      else b.textContent = canonical;
    });
    if (typeof qrcode === "function") {
      const qr = qrcode(0, "M");
      qr.addData(canonical);
      qr.make();
      const n = qr.getModuleCount(), quiet = 4, size = n + quiet * 2;
      let path = "";
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) path += `M${c + quiet},${r + quiet}h1v1h-1z`;
      qrBox.innerHTML = `<svg viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" aria-hidden="true"><rect width="${size}" height="${size}" fill="#fff"/><path d="${path}" fill="#0a0f1e"/></svg>`;
      // A crisp PNG for print: 16 px per module.
      const px = 16, cv = document.createElement("canvas");
      cv.width = cv.height = size * px;
      const g = cv.getContext("2d");
      g.fillStyle = "#fff"; g.fillRect(0, 0, cv.width, cv.height);
      g.fillStyle = "#0a0f1e";
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) g.fillRect((c + quiet) * px, (r + quiet) * px, px, px);
      $("shareQrDl").href = cv.toDataURL("image/png");
    } else {
      $("share").querySelector(".share__qr").hidden = true;
      $("shareQrDl").hidden = true;
    }
  }

  const year = $("year");
  if (year) year.textContent = new Date().getFullYear();
})();

/* ============================================================
   WALKABLE TOUR — walk the house you just designed
   ------------------------------------------------------------
   The original tour looked good but toured a house that had
   nothing to do with the one on screen. This rebuilds the same
   experience — start at the gate, walk up the drive, in through
   the front door, room to room, up the stairs — except the world
   is generated from the live Design Studio config, so what you
   walk through is always what you built.

   Three.js rather than the old 2.3MB engine: it's already loaded
   for the configurator, so the tour costs almost nothing extra.
   ============================================================ */
import * as THREE from "three";
import {
  state, PLOTS, FINISHES,
  buildHouse, buildInterior,
  mat, box, plasterTex, paverTex, grassTex, glow, window3d, woodCladTex
} from "./house-builder.js?v=7";
import { ARCHETYPES, PROPERTY_MODELS } from "./estate3d.js?v=5";

/* ---------- module state ---------- */
let renderer, scene, camera, composer = null, bloomPass = null;
let world = null, running = false, raf = 0;
let exteriorGrp = null, interiorGrp = null, phase = "outside", doorZ = 0, promptEl;
let overlay, canvas, roomEl, hintEl;

const walls = [];          // AABBs for collision
const zones = [];          // { name, x, z, w, d } for the room readout
const keys = Object.create(null);
let yaw = 0, pitch = 0;
let pos = new THREE.Vector3(0, 0, 0);
const vel = new THREE.Vector2(0, 0);
let curRoom = "";
let joyVec = { x: 0, y: 0 }, joyId = null, lookId = null, lookLast = null;
let pointerLocked = false;

const EYE = 1.66;
const RADIUS = 0.42;       // how close you can get to a wall
const SPEED = 3.1, RUN = 5.4;

/* ---------- collision + zone registration ---------- */
function addWall(x, z, w, d) { walls.push({ x, z, w: w / 2 + RADIUS, d: d / 2 + RADIUS }); }
function addZone(name, x, z, w, d) { zones.push({ name, x, z, w: w / 2, d: d / 2 }); }

function blocked(x, z) {
  for (let i = 0; i < walls.length; i++) {
    const b = walls[i];
    if (Math.abs(x - b.x) < b.w && Math.abs(z - b.z) < b.d) return true;
  }
  return false;
}
function roomAt(x, z) {
  for (let i = 0; i < zones.length; i++) {
    const r = zones[i];
    if (Math.abs(x - r.x) < r.w && Math.abs(z - r.z) < r.d) return r.name;
  }
  return "";
}

/* ---------- floor height: flat everywhere except the staircase ramp ---------- */
let stair = null;          // { x, z0, z1, w, top }
function floorAt(x, z) {
  if (stair && Math.abs(x - stair.x) < stair.w) {
    if (z <= stair.z0 && z >= stair.z1) {
      const t = (stair.z0 - z) / (stair.z0 - stair.z1);
      return stair.base + t * (stair.top - stair.base);
    }
    if (z < stair.z1) return stair.top;
  }
  return stair && z < stair.z1 && Math.abs(x - stair.x) < stair.w * 2.4 ? stair.top : 0;
}

/* ============================================================
   World
   ============================================================ */
function buildWorld(cfg) {
  const g = new THREE.Group();
  walls.length = 0; zones.length = 0;
  const plot = PLOTS[cfg.plot];
  const fin = FINISHES[cfg.finish];
  const [lw, ld] = plot.lot;
  const W = plot.w, D = plot.d;
  const night = cfg.night;
  const H = 3.0, DOOR_W = 1.9;

  /* --- grounds --- */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(lw * 3, ld * 3),
    mat(cfg.features.lawn ? 0x4a8a4e : 0x9a8b76, 1, 0,
        cfg.features.lawn ? grassTex() : paverTex()));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  g.add(ground);

  const drive = new THREE.Mesh(new THREE.PlaneGeometry(5, ld / 2 + D / 2),
    mat(0x9a8b76, 0.95, 0, paverTex()));
  drive.rotation.x = -Math.PI / 2;
  drive.position.set(0, 0.02, D / 2 + (ld / 2 - D / 2) / 2 + 1);
  drive.receiveShadow = true;
  g.add(drive);
  addZone("Driveway", 0, D / 2 + 3.5, 5, 7);

  /* --- boundary wall, with the gate left open to walk through --- */
  if (cfg.features.wall) {
    const wallM = mat(fin.trim, 0.92, 0.02, plasterTex(fin.trim));
    const put = (w, h, d, x, y, z) => { const b = box(w, h, d, wallM); b.position.set(x, y, z); g.add(b); addWall(x, z, w, d); };
    put(lw, 2.2, 0.25, 0, 1.1, -ld / 2);
    put(0.25, 2.2, ld, lw / 2, 1.1, 0);
    put(0.25, 2.2, ld, -lw / 2, 1.1, 0);
    const seg = (lw - 4.6) / 2;
    for (const sx of [-1, 1]) put(seg, 2.2, 0.25, sx * (2.3 + seg / 2), 1.1, ld / 2);
  }

  /* --- exterior ---------------------------------------------------------
     When a tour names an archetype we drop in the *exact* model the lightbox
     thumbnail renders, so the house you walk up to is the house you saw.
     Those models are solid display geometry with no way through, so the front
     door acts as a threshold: reach it and we swap to the interior. */
  if (cfg.archetype && ARCHETYPES[cfg.archetype]) {
    exteriorGrp = new THREE.Group();
    const model = ARCHETYPES[cfg.archetype]();
    model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    exteriorGrp.add(model);
    g.add(exteriorGrp);

    // collide with the model's real footprint, leaving the entrance open
    const bbox = new THREE.Box3().setFromObject(model);
    const cx = (bbox.min.x + bbox.max.x) / 2;
    const bw = bbox.max.x - bbox.min.x, bd = bbox.max.z - bbox.min.z;
    doorZ = bbox.max.z;
    addWall(cx - bw / 2 - 0.3, (bbox.min.z + bbox.max.z) / 2, 0.6, bd);   // left flank
    addWall(cx + bw / 2 + 0.3, (bbox.min.z + bbox.max.z) / 2, 0.6, bd);   // right flank
    addWall(cx, bbox.min.z - 0.3, bw, 0.6);                               // rear
    addZone("Front Elevation", cx, doorZ + 2.2, bw, 4.0);
  }

  /* --- house shell: four walls with a doorway gap in the front --- */
  const wallMap = cfg.finish === "brick" ? plasterTex(fin.wall) : plasterTex(fin.wall);
  const shellM = mat(fin.wall, 0.9, 0.03, wallMap);
  const t = 0.24;
  const put = (w, h, d, x, y, z, m) => {
    const b = box(w, h, d, m || shellM); b.position.set(x, y, z); g.add(b);
    if (h > 1.2) addWall(x, z, w, d);
  };
  const shellStart = g.children.length;
  put(W, H, t, 0, H / 2, -D / 2);                      // back
  put(t, H, D, -W / 2, H / 2, 0);                      // left
  put(t, H, D, W / 2, H / 2, 0);                       // right
  // front wall either side of the door
  const side = (W - DOOR_W) / 2;
  put(side, H, t, -(DOOR_W / 2 + side / 2), H / 2, D / 2);
  put(side, H, t, (DOOR_W / 2 + side / 2), H / 2, D / 2);
  // header over the doorway (no collision — you walk under it)
  const head = box(DOOR_W, 0.6, t, shellM);
  head.position.set(0, H - 0.3, D / 2);
  g.add(head);

  /* Elevation detail: without glazing and banding the shell reads as a blank
     box from the drive, which is the first thing you see on arrival. */
  const trimM = mat(fin.trim, 0.8, 0.04, plasterTex(fin.trim));
  const band = box(W + 0.18, 0.26, D + 0.18, trimM);
  band.position.y = H - 0.13;
  g.add(band);
  const plinthB = box(W + 0.3, 0.35, D + 0.3, trimM);
  plinthB.position.y = 0.17;
  g.add(plinthB);

  // front glazing either side of the door
  for (const sx of [-1, 1]) {
    window3d(g, { w: Math.min(2.0, side * 0.62), h: 1.5, x: sx * (DOOR_W / 2 + side / 2),
                  y: 1.6, z: D / 2 + 0.14, night });
  }
  // side windows
  const sideN = Math.max(2, Math.round(D / 3.6));
  for (let i = 0; i < sideN; i++) {
    const z = -D / 2 + (D / sideN) * (i + 0.5);
    window3d(g, { w: 1.2, h: 1.4, x: -W / 2 - 0.14, y: 1.6, z, rotY: -Math.PI / 2, night });
    window3d(g, { w: 1.2, h: 1.4, x: W / 2 + 0.14, y: 1.6, z, rotY: Math.PI / 2, night });
  }
  // clad panel framing the entrance
  const entry = box(DOOR_W + 1.2, H, 0.16, mat(0x6b4526, 0.72, 0.04, woodCladTex()));
  entry.position.set(0, H / 2, D / 2 + 0.14);
  g.add(entry);
  // cut the doorway back out of that panel by drawing the opening over it
  const openL = box((DOOR_W + 1.2 - DOOR_W) / 2, H, 0.2, mat(0x6b4526, 0.72, 0.04, woodCladTex()));
  g.remove(entry);
  for (const sx of [-1, 1]) {
    const jamb = box(0.6, H, 0.18, mat(0x6b4526, 0.72, 0.04, woodCladTex()));
    jamb.position.set(sx * (DOOR_W / 2 + 0.3), H / 2, D / 2 + 0.14);
    g.add(jamb);
  }
  const lintel = box(DOOR_W + 1.2, 0.5, 0.18, mat(0x6b4526, 0.72, 0.04, woodCladTex()));
  lintel.position.set(0, H - 0.25, D / 2 + 0.14);
  g.add(lintel);

  // floor + ceiling
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D),
    new THREE.MeshStandardMaterial({ color: 0xd7d2c8, roughness: 0.12, metalness: 0.4 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.01;
  floor.receiveShadow = true;
  g.add(floor);
  const ceilM = mat(0xf2efe9, 0.95); ceilM.side = THREE.DoubleSide;
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), ceilM);
  ceil.rotation.x = Math.PI / 2; ceil.position.y = H;
  g.add(ceil);

  /* --- the furnished interior, reused verbatim from the configurator --- */
  const inner = buildInterior(Object.assign({}, cfg));
  inner.position.y = 0.012;
  // its own shell/ceiling would z-fight with ours, so drop those pieces
  inner.children.slice().forEach((c) => {
    const s = c.geometry && c.geometry.parameters;
    if (c.isMesh && s && s.width && Math.abs(s.width - (W - 0.36)) < 0.2 && s.height >= H - 0.05) inner.remove(c);
  });
  // Hide the floating room-name sprites — the HUD does that job here,
  // and at eye level they blanket the view.
  inner.traverse((o) => { if (o.isSprite) o.visible = false; });
  g.add(inner);

  // Interior zones (mirrors buildInterior's plan) so the HUD can name rooms
  const iw = W - 0.36, id = D - 0.36;
  addZone("Entrance Foyer", -iw * 0.08, D / 2 - 2.0, iw * 0.62, 4.0);
  addZone("Drawing Room", iw * 0.3, id * 0.1, iw * 0.36, id * 0.3);
  addZone("Family Lounge", -iw * 0.2, -id * 0.14, iw * 0.46, id * 0.3);
  if (W > 8) {
    addZone("Dining", iw * 0.28, -id * 0.06, iw * 0.34, id * 0.24);
    addZone(cfg.kitchen === "closed" ? "Kitchen" : "Open Kitchen",
            iw * 0.26, -id / 2 + 1.1, iw * 0.44, 2.2);
  }
  if (cfg.features.guestRoom && W > 8) addZone("Guest Bedroom", -iw * 0.34, id * 0.06, iw * 0.3, id * 0.26);

  /* --- staircase you can actually walk up --- */
  const sx = -iw * 0.42, sz0 = id * 0.16, steps = 12, run = 0.3, rise = H / steps;
  const treadM = mat(0x5a3f27, 0.55, 0.05, plasterTex(0x5a3f27));
  for (let i = 0; i < steps; i++) {
    const tr = box(1.5, 0.1, run, treadM);
    tr.position.set(sx, rise * (i + 1) - 0.05, sz0 - i * run);
    g.add(tr);
  }
  stair = { x: sx, z0: sz0 + run, z1: sz0 - steps * run, w: 0.8, base: 0, top: H };
  addZone("Stairs", sx, sz0 - (steps * run) / 2, 1.6, steps * run);

  /* --- upper landing so the stairs lead somewhere --- */
  const upY = H;
  const landing = new THREE.Mesh(new THREE.PlaneGeometry(W, D * 0.55),
    new THREE.MeshStandardMaterial({ color: 0xd7d2c8, roughness: 0.12, metalness: 0.4 }));
  landing.rotation.x = -Math.PI / 2;
  landing.position.set(0, upY + 0.02, -D * 0.22);
  landing.receiveShadow = true;
  g.add(landing);
  const upWall = (w, d, x, z) => { const b = box(w, 2.8, d, shellM); b.position.set(x, upY + 1.4, z); g.add(b); };
  upWall(W, 0.2, 0, -D / 2);
  upWall(0.2, D * 0.55, -W / 2, -D * 0.22);
  upWall(0.2, D * 0.55, W / 2, -D * 0.22);
  const upCeil = new THREE.Mesh(new THREE.PlaneGeometry(W, D * 0.55), ceilM);
  upCeil.rotation.x = Math.PI / 2; upCeil.position.set(0, upY + 2.8, -D * 0.22);
  g.add(upCeil);
  addZone("Master Bedroom", 0, -D * 0.3, W * 0.8, D * 0.4);
  // a bed so the landing isn't empty
  const bed = box(1.9, 0.5, 2.2, mat(0x6d5a48, 0.85));
  bed.position.set(0, upY + 0.3, -D * 0.32);
  g.add(bed);
  const duvet = box(1.92, 0.16, 1.5, mat(0xd8d2c6, 0.9));
  duvet.position.set(0, upY + 0.6, -D * 0.24);
  g.add(duvet);

  /* --- lighting --- */
  g.add(new THREE.HemisphereLight(night ? 0x50607f : 0xbcd0ff, 0x3a4030, night ? 0.9 : 1.5));
  const sun = new THREE.DirectionalLight(night ? 0x7e9ae0 : 0xffd9a0, night ? 0.5 : 2.6);
  sun.position.set(14, 22, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = 26;
  sun.shadow.camera.left = -sc; sun.shadow.camera.right = sc;
  sun.shadow.camera.top = sc; sun.shadow.camera.bottom = -sc;
  sun.shadow.camera.far = 80; sun.shadow.bias = -0.0007;
  g.add(sun);
  // warm interior fills so rooms read while walking
  for (const [lx, lz] of [[0, D * 0.2], [0, -D * 0.2], [-W * 0.25, 0], [W * 0.25, 0]]) {
    const pl = new THREE.PointLight(night ? 0xffcf9a : 0xf0f4ff, night ? 26 : 16, 16, 2);
    pl.position.set(lx, H - 0.4, lz);
    g.add(pl);
  }
  const upL = new THREE.PointLight(night ? 0xffcf9a : 0xf0f4ff, night ? 22 : 14, 16, 2);
  upL.position.set(0, upY + 2.2, -D * 0.25);
  g.add(upL);
  if (night) glow(g, 0, 2.4, D / 2 + 0.4, 3.2);

  // Everything built after the exterior is interior — park it in one group so
  // the threshold can toggle between the two.
  if (exteriorGrp) {
    interiorGrp = new THREE.Group();
    // Lights must stay in the world group — sweeping them into the interior
    // and hiding it leaves the whole exterior unlit.
    g.children.slice(shellStart).forEach((c) => {
      if (c === exteriorGrp || c.isLight) return;
      g.remove(c); interiorGrp.add(c);
    });
    g.add(interiorGrp);
    interiorGrp.visible = false;
    phase = "outside";
  } else {
    phase = "inside";
  }

  return g;
}

/* ============================================================
   Overlay + controls
   ============================================================ */
function ensureOverlay() {
  if (overlay) return;
  overlay = document.createElement("div");
  overlay.className = "wtour";
  overlay.id = "wtour";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML =
    '<canvas id="wtourCanvas"></canvas>' +
    '<div class="wtour__bar">' +
      '<div class="wtour__title"><span class="wtour__dot"></span><b id="wtourName">Your Design</b>' +
      '<em id="wtourRoom">Driveway</em></div>' +
      '<button class="wtour__close" id="wtourClose" type="button" aria-label="Exit tour">✕ Exit</button>' +
    '</div>' +
    '<p class="wtour__hint" id="wtourHint">Click to look · <b>W A S D</b> to walk · <b>Shift</b> run · <b>Esc</b> exit</p>' +
    '<div class="wtour__prompt" id="wtourPrompt">Walk to the front door to step inside</div>' +
    '<div class="wtour__joy" id="wtourJoy"><div class="wtour__knob" id="wtourKnob"></div></div>';
  document.body.appendChild(overlay);
  canvas = overlay.querySelector("#wtourCanvas");
  roomEl = overlay.querySelector("#wtourRoom");
  hintEl = overlay.querySelector("#wtourHint");
  promptEl = overlay.querySelector("#wtourPrompt");
  overlay.querySelector("#wtourClose").addEventListener("click", closeTour);
  bindControls();
}

function bindControls() {
  addEventListener("keydown", (e) => {
    if (!running) return;
    keys[e.key.toLowerCase()] = true;
    if (e.key === "Escape") closeTour();
    if (["w", "a", "s", "d", " "].includes(e.key.toLowerCase())) e.preventDefault();
  });
  addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });

  // desktop: pointer lock for mouse look
  canvas.addEventListener("click", () => {
    if (running && !pointerLocked && !("ontouchstart" in window)) canvas.requestPointerLock();
  });
  document.addEventListener("pointerlockchange", () => {
    pointerLocked = document.pointerLockElement === canvas;
    if (hintEl) hintEl.style.opacity = pointerLocked ? "0.35" : "1";
  });
  addEventListener("mousemove", (e) => {
    if (!running || !pointerLocked) return;
    yaw -= e.movementX * 0.0022;
    pitch = Math.max(-1.1, Math.min(1.1, pitch - e.movementY * 0.0019));
  });

  // mobile: left thumb walks, right side looks
  const joy = overlay.querySelector("#wtourJoy");
  const knob = overlay.querySelector("#wtourKnob");
  overlay.addEventListener("touchstart", (e) => {
    for (const t of e.changedTouches) {
      if (t.clientX < innerWidth * 0.45 && joyId === null) {
        joyId = t.identifier;
        joy.style.left = t.clientX + "px"; joy.style.top = t.clientY + "px";
        joy.classList.add("is-live");
      } else if (lookId === null) { lookId = t.identifier; lookLast = { x: t.clientX, y: t.clientY }; }
    }
  }, { passive: true });
  overlay.addEventListener("touchmove", (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === joyId) {
        const dx = t.clientX - parseFloat(joy.style.left);
        const dy = t.clientY - parseFloat(joy.style.top);
        const m = Math.min(46, Math.hypot(dx, dy)), a = Math.atan2(dy, dx);
        knob.style.transform = `translate(${Math.cos(a) * m}px, ${Math.sin(a) * m}px)`;
        joyVec = { x: Math.cos(a) * (m / 46), y: Math.sin(a) * (m / 46) };
      } else if (t.identifier === lookId && lookLast) {
        yaw -= (t.clientX - lookLast.x) * 0.006;
        pitch = Math.max(-1.1, Math.min(1.1, pitch - (t.clientY - lookLast.y) * 0.005));
        lookLast = { x: t.clientX, y: t.clientY };
      }
    }
  }, { passive: true });
  overlay.addEventListener("touchend", (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === joyId) {
        joyId = null; joyVec = { x: 0, y: 0 };
        knob.style.transform = ""; joy.classList.remove("is-live");
      } else if (t.identifier === lookId) { lookId = null; lookLast = null; }
    }
  }, { passive: true });

  addEventListener("resize", size);
}

function size() {
  if (!renderer) return;
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  if (composer) composer.setSize(w, h);
  if (bloomPass) bloomPass.resolution.set(w, h);
}

/* ============================================================
   Loop
   ============================================================ */
let last = 0;
function loop(now) {
  if (!running) return;
  raf = requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
  last = now;

  // input -> desired direction
  let fwd = 0, strafe = 0;
  if (keys.w || keys.arrowup) fwd += 1;
  if (keys.s || keys.arrowdown) fwd -= 1;
  if (keys.a || keys.arrowleft) strafe -= 1;
  if (keys.d || keys.arrowright) strafe += 1;
  if (joyId !== null) { fwd -= joyVec.y; strafe += joyVec.x; }

  const speed = (keys.shift ? RUN : SPEED);
  const sin = Math.sin(yaw), cos = Math.cos(yaw);
  const tx = (-sin * fwd + cos * strafe) * speed;
  const tz = (-cos * fwd - sin * strafe) * speed;
  // smooth acceleration so it doesn't feel twitchy
  vel.x += (tx - vel.x) * Math.min(1, dt * 12);
  vel.y += (tz - vel.y) * Math.min(1, dt * 12);

  // move each axis separately so you slide along walls instead of sticking
  const nx = pos.x + vel.x * dt;
  if (!blocked(nx, pos.z)) pos.x = nx; else vel.x = 0;
  const nz = pos.z + vel.y * dt;
  if (!blocked(pos.x, nz)) pos.z = nz; else vel.y = 0;

  const fy = floorAt(pos.x, pos.z);
  pos.y += (fy - pos.y) * Math.min(1, dt * 10);

  camera.position.set(pos.x, pos.y + EYE, pos.z);
  camera.rotation.set(pitch, yaw, 0, "YXZ");

  /* Threshold: crossing the front door swaps exterior for interior, and
     stepping back out reverses it. Keeps the walk continuous while letting
     the outside be the untouched thumbnail model. */
  if (exteriorGrp && interiorGrp) {
    const nearDoor = Math.abs(pos.x) < 2.4;
    if (phase === "outside" && nearDoor && pos.z < doorZ - 0.4) {
      phase = "inside";
      exteriorGrp.visible = false;
      interiorGrp.visible = true;
      if (promptEl) promptEl.classList.remove("is-on");
    } else if (phase === "inside" && nearDoor && pos.z > doorZ + 0.5) {
      phase = "outside";
      exteriorGrp.visible = true;
      interiorGrp.visible = false;
    }
    if (promptEl) {
      const show = phase === "outside" && pos.z < doorZ + 6 && pos.z > doorZ;
      promptEl.classList.toggle("is-on", show);
    }
  }

  const r = roomAt(pos.x, pos.z);
  if (r && r !== curRoom) { curRoom = r; if (roomEl) roomEl.textContent = r; }

  if (composer) composer.render(); else renderer.render(scene, camera);
}

/* ============================================================
   Open / close
   ============================================================ */
function openTour(cfg, title) {
  ensureOverlay();
  // An explicit config wins; without one we walk the Design Studio's
  // current state. Sold-home tours always pass their own.
  const conf = Object.assign({}, state, cfg || {});
  if (cfg && cfg.features) conf.features = Object.assign({}, state.features, cfg.features);

  if (!renderer) {
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch (e) { return false; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    camera = new THREE.PerspectiveCamera(72, 1, 0.05, 240);

    // bloom, same treatment as the configurator
    if (innerWidth > 640 && (navigator.hardwareConcurrency || 4) >= 4 &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Promise.all([
        import("./vendor/three/postprocessing/EffectComposer.js"),
        import("./vendor/three/postprocessing/RenderPass.js"),
        import("./vendor/three/postprocessing/UnrealBloomPass.js"),
        import("./vendor/three/postprocessing/OutputPass.js")
      ]).then(([EC, RP, UB, OP]) => {
        composer = new EC.EffectComposer(renderer);
        composer.addPass(new RP.RenderPass(scene, camera));
        bloomPass = new UB.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.42, 0.7, 0.9);
        composer.addPass(bloomPass);
        composer.addPass(new OP.OutputPass());
        size();
      }).catch(() => { composer = null; });
    }
  }

  scene = new THREE.Scene();
  const skyC = conf.night ? 0x05070f : 0x2b3d63;
  scene.background = new THREE.Color(skyC);
  scene.fog = new THREE.Fog(skyC, 26, 110);

  exteriorGrp = interiorGrp = null;
  world = buildWorld(conf);
  scene.add(world);

  // start at the gate, facing the house
  const [, ld] = PLOTS[conf.plot].lot;
  pos.set(0, 0, ld / 2 - 1.2);
  yaw = 0; pitch = 0;
  vel.set(0, 0);
  curRoom = "";

  const nameEl = overlay.querySelector("#wtourName");
  if (nameEl) nameEl.textContent = title || "Your Design";

  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  document.documentElement.style.overflow = "hidden";
  document.body.classList.add("wtour-open");
  if (window.__lenis && window.__lenis.stop) window.__lenis.stop();

  running = true; last = performance.now();
  size();
  raf = requestAnimationFrame(loop);
  return true;
}

function closeTour() {
  running = false;
  cancelAnimationFrame(raf);
  if (document.pointerLockElement) document.exitPointerLock();
  if (overlay) {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
  }
  document.documentElement.style.overflow = "";
  document.body.classList.remove("wtour-open");
  if (window.__lenis && window.__lenis.start) window.__lenis.start();
  if (world) {
    scene.remove(world);
    world.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
    });
    world = null;
  }
}

window.WalkTour = { open: openTour, close: closeTour,
  _dbg: () => ({ running, pos: [ +pos.x.toFixed(2), +pos.y.toFixed(2), +pos.z.toFixed(2) ],
                 keys: Object.keys(keys).filter(k => keys[k]), walls: walls.length, zones: zones.length }) };

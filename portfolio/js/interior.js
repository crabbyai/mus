/* ============================================================
   HOUSE TOUR — first-person interior walkthrough (PlayCanvas)
   A furnished Pakistani designer show-home: foyer, formal living,
   dining, open kitchen, and a master bedroom. Walk with WASD +
   mouse on desktop, or the on-screen joystick + drag on mobile.
   The 2.3 MB engine is lazy-loaded only when a tour is opened.
   ============================================================ */
(function () {
  const ENGINE_SRC = "js/vendor/playcanvas.min.js";
  let enginePromise = null;
  let app = null, camRoot = null, cam = null, world = null, curCfgKey = "";
  const P = () => world || (app && app.root);

  /* ---------- per-listing interior themes ----------
     Each home opens a furnished walkthrough tinted to its character. */
  const THEMES = {
    /* ---- Bahria Town 12 Marla — extracted from actual video footage ---- */
    bahriaTown:    { wall: [0.95, 0.94, 0.92], feature: [0.07, 0.07, 0.08], wood: [0.42, 0.25, 0.14], woodLight: [0.60, 0.40, 0.22], fabric: [0.24, 0.24, 0.26], fabric2: [0.44, 0.44, 0.46], marble: ["#f7f6f4", "#eeece8"], art: [["#1a2233", "#0a1018"], ["#2a3520", "#121910"], ["#301820", "#180c10"]], gold: true },
    charcoalCream: { wall: [0.86, 0.83, 0.77], feature: [0.16, 0.18, 0.22], wood: [0.27, 0.17, 0.10], woodLight: [0.55, 0.39, 0.24], fabric: [0.17, 0.22, 0.30], fabric2: [0.45, 0.36, 0.30], marble: ["#efece4", "#e3ddd0"], art: [["#243044", "#0f1726"], ["#3a2740", "#160f1e"], ["#243a36", "#0f1d1a"]] },
    whiteOak:      { wall: [0.92, 0.91, 0.87], feature: [0.74, 0.70, 0.62], wood: [0.55, 0.40, 0.24], woodLight: [0.70, 0.55, 0.34], fabric: [0.40, 0.42, 0.40], fabric2: [0.62, 0.55, 0.44], marble: ["#f4f1ea", "#e9e4d8"], art: [["#3a4a52", "#1a2630"], ["#4a3f2e", "#241d12"], ["#2e4036", "#15201a"]] },
    greyGraphite:  { wall: [0.42, 0.45, 0.50], feature: [0.16, 0.18, 0.21], wood: [0.24, 0.16, 0.10], woodLight: [0.42, 0.32, 0.22], fabric: [0.14, 0.16, 0.20], fabric2: [0.34, 0.34, 0.36], marble: ["#dadbde", "#c6c8cc"], art: [["#2a3038", "#12161c"], ["#34302a", "#16130f"], ["#283036", "#11151a"]] },
    spanishWarm:   { wall: [0.90, 0.86, 0.76], feature: [0.61, 0.31, 0.20], wood: [0.45, 0.28, 0.16], woodLight: [0.66, 0.46, 0.27], fabric: [0.38, 0.30, 0.22], fabric2: [0.55, 0.34, 0.22], marble: ["#f1e9da", "#e6dcc6"], art: [["#5a3a26", "#2a1c12"], ["#3a4030", "#1c2016"], ["#4a3526", "#231910"]] },
    heritage:      { wall: [0.80, 0.76, 0.68], feature: [0.18, 0.22, 0.22], wood: [0.20, 0.12, 0.07], woodLight: [0.40, 0.27, 0.16], fabric: [0.13, 0.26, 0.26], fabric2: [0.42, 0.32, 0.22], marble: ["#ece4d2", "#ddd0b8"], art: [["#1d3530", "#0c1a16"], ["#3a2f1e", "#1a150e"], ["#243a40", "#101d20"], ["#3a2740", "#160f1e"]], gold: true },
    brickWarm:     { wall: [0.86, 0.82, 0.74], feature: [0.56, 0.31, 0.22], wood: [0.30, 0.19, 0.11], woodLight: [0.58, 0.42, 0.26], fabric: [0.30, 0.26, 0.22], fabric2: [0.52, 0.40, 0.28], marble: ["#efe9dc", "#e2d8c4"], art: [["#4a3026", "#241712"], ["#3a4030", "#1c2016"], ["#2e3a40", "#141d20"]] },
    /* ---- Charcoal & Gold — extracted from uploaded property photos:
       dark walnut lounge, forest-green feature wall, white marble floors,
       gold rectangular chain chandeliers, amber glass kitchen pendants ---- */
    charcoalGold:  { wall: [0.78, 0.76, 0.72], feature: [0.10, 0.19, 0.14], wood: [0.22, 0.14, 0.08], woodLight: [0.42, 0.30, 0.18], fabric: [0.28, 0.28, 0.30], fabric2: [0.52, 0.50, 0.44], marble: ["#f4f2ee", "#ebe8e0"], art: [["#0e1c12", "#070e09"], ["#1c1c30", "#0d0d18"], ["#2c200c", "#160f06"]], gold: true }
  };
  // sold properties (index matches PROPERTIES in main.js)
  const SOLD_CFG = [
    // 0: Margalla View Manor
    { theme:"charcoalGold", grand:true, cinema:true, pool:true,
      roomLabels:["Master Suite","Chef's Kitchen","Cinema Lounge","Drawing Room","Grand Foyer"],
      upRoomLabels:["Master Suite + Dressing","Guest Suite","Family Lounge"] },
    // 1: Villa Serena
    { theme:"charcoalGold", grand:true, cinema:true, mirror:true,
      roomLabels:["Master Suite","Open Kitchen","Cinema Lounge","Formal Living","Grand Foyer"],
      upRoomLabels:["Master Suite","Children's Bedroom","Upper Lounge"] },
    // 2: Enclave Residence
    { theme:"greyGraphite", grand:true,
      roomLabels:["Master Bedroom","Kitchen","Dining Room","Double-Height Lounge","Entrance Foyer"],
      upRoomLabels:["Master Bedroom","Second Bedroom","Mezzanine Lounge"] },
    // 3: Casa Blanca E-11
    { theme:"spanishWarm", grand:false, terrazzo:true, mirror:true,
      roomLabels:["Bedroom","Kitchen","Dining","Sunken Lounge","Entrance"],
      upRoomLabels:["Master Bedroom","Guest Bedroom","Study Landing"] },
    // 4: Gulberg Farmhouse
    { theme:"brickWarm", grand:true, library:true, farmhouse:true,
      roomLabels:["Master Suite","Farmhouse Kitchen","Dining Pavilion","Living Pavilion","Foyer & Orchard"],
      upRoomLabels:["Master Suite","Guest Annexe Room","Reading Loft"] },
    // 5: Hilltop Modern
    { theme:"greyGraphite", grand:false, mirror:true,
      roomLabels:["Bedroom","Kitchen","Dining","Glazed Lounge","Foyer"],
      upRoomLabels:["Master Bedroom","Second Bedroom","Hilltop Terrace Lounge"] },
    // 6: Phase 6 Palazzo
    { theme:"heritage", grand:true, library:true,
      roomLabels:["Master Suite","Twin Kitchens","Cigar Lounge","Drawing Room","Entrance Foyer"],
      upRoomLabels:["Master Suite + Dressing","Guest Suite","Upper Drawing Room"] },
    // 7: Gulberg Heritage House
    { theme:"heritage", grand:true, library:true, atrium:true, mirror:true,
      roomLabels:["Master Suite","Kitchen","Dining","Glass Atrium","Entrance Foyer"],
      upRoomLabels:["Master Suite","Heritage Bedroom","Atrium Gallery"] },
    // 8: Bahria Orchard Villa
    { theme:"bahriaTown", grand:false,
      roomLabels:["Master Suite","Kitchen","Dining","Drawing Room","Courtyard Entrance"],
      upRoomLabels:["Master Suite","Children's Bedroom","Upper Landing"] },
    // 9: Model Town Estate
    { theme:"heritage", grand:true, library:true, mirror:true,
      roomLabels:["Master Suite","Kitchen","Dining Room","Drawing Room","Colonial Veranda"],
      upRoomLabels:["Master Suite","Guest Bedroom","Veranda Lounge"] },
    // 10: Lake City Linear
    { theme:"whiteOak", grand:true, cedar:true,
      roomLabels:["Master Suite","Kitchen","Dining","Gallery Living","Entrance Gallery"],
      upRoomLabels:["Master Suite","Second Bedroom","Gallery Mezzanine"] },
    // 11: Phase 5 Courtyard
    { theme:"spanishWarm", grand:false, terrazzo:true, mirror:true,
      roomLabels:["Bedroom","Kitchen","Dining","Courtyard Lounge","Entrance"],
      upRoomLabels:["Master Bedroom","Guest Bedroom","Courtyard Landing"] }
  ];
  const DEAL_CFG = [
    { theme:"bahriaTown", grand:false, roomLabels:["Master Suite","Kitchen","Dining","Drawing Room","Entrance Foyer"],
      upRoomLabels:["Master Suite","Children's Bedroom","Upper Landing"] },
    { theme:"charcoalGold", grand:true, cinema:true, roomLabels:["Master Suite","Chef's Kitchen","Cinema Lounge","Formal Living","Grand Foyer"],
      upRoomLabels:["Master Suite","Guest Suite","Family Lounge"] },
    { theme:"bahriaTown", grand:false, terrazzo:true, mirror:true, roomLabels:["Bedroom","Kitchen","Dining","Courtyard Lounge","Entrance"],
      upRoomLabels:["Master Bedroom","Guest Bedroom","Courtyard Landing"] }
  ];
  let curTheme = THEMES.charcoalCream;
  const hx = (s) => [parseInt(s.slice(1, 3), 16) / 255, parseInt(s.slice(3, 5), 16) / 255, parseInt(s.slice(5, 7), 16) / 255];
  /* mirror transform — flips the whole floor plan across X for "mirrored"
     layouts. Coordinate-level (not negative scale) so normals/shadows stay
     correct. When MX === 1 the build is byte-identical to the classic plan. */
  let MX = 1;
  const X = (v) => v * MX;       // mirror an X coordinate
  const R = (r) => r * MX;       // mirror a Y rotation (degrees)
  const state = {
    yaw: 180, pitch: -2, pos: null, vel: { x: 0, z: 0 },
    keys: {}, run: false,
    moveTouchId: null, lookTouchId: null,
    moveVec: { x: 0, y: 0 }, lookStart: null,
    walls: [], rooms: [], curRoom: "",
    stair: null, spawn: null, mirror: false
  };

  /* ---------- DOM ---------- */
  const overlay = document.getElementById("tour");
  const canvas = document.getElementById("tourCanvas");
  const roomLabel = document.getElementById("tourRoom");
  const titleEl = document.getElementById("tourName");
  const subEl = document.getElementById("tourSub");
  const loader = document.getElementById("tourLoader");
  const joyBase = document.getElementById("tourJoy");
  const joyKnob = document.getElementById("tourJoyKnob");

  function loadEngine() {
    if (window.pc) return Promise.resolve();
    if (enginePromise) return enginePromise;
    enginePromise = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = ENGINE_SRC;
      s.onload = res;
      s.onerror = () => rej(new Error("engine load failed"));
      document.head.appendChild(s);
    });
    return enginePromise;
  }

  /* ---------- texture helpers ---------- */
  function tex(draw, size = 256, rx = 1, ry = 1) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    draw(c.getContext("2d"), size);
    const t = new pc.Texture(app.graphicsDevice, {
      width: size, height: size, format: pc.PIXELFORMAT_RGBA8, mipmaps: true
    });
    t.setSource(c);
    t.addressU = t.addressV = pc.ADDRESS_REPEAT;
    t.minFilter = pc.FILTER_LINEAR_MIPMAP_LINEAR;
    t.magFilter = pc.FILTER_LINEAR;
    t.anisotropy = 8;
    t._rx = rx; t._ry = ry;
    return t;
  }
  function marbleTex() {
    const mc = (curTheme && curTheme.marble) || ["#efece4", "#e3ddd0"];
    return tex((ctx, s) => {
      // soft diagonal base wash
      const g = ctx.createLinearGradient(0, 0, s, s);
      g.addColorStop(0, mc[0]); g.addColorStop(0.55, mc[1]); g.addColorStop(1, mc[0]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
      // a few gentle, faint veins (much calmer than before)
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(150,140,120,0.16)"; ctx.lineWidth = 1.0;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        let x = Math.random() * s, y = Math.random() * s;
        ctx.moveTo(x, y);
        for (let j = 0; j < 6; j++) { x += (Math.random() - 0.5) * s * 0.3; y += (Math.random() - 0.5) * s * 0.3; ctx.lineTo(x, y); }
        ctx.stroke();
      }
      // crisp polished-tile grout seam at the edges (one slab per tile)
      ctx.strokeStyle = "rgba(120,112,98,0.22)"; ctx.lineWidth = 1.4;
      ctx.strokeRect(0.5, 0.5, s - 1, s - 1);
    }, 256, 3, 3);
  }
  function terrazzotex() {
    return tex((ctx, s) => {
      ctx.fillStyle = "#e8e4dc"; ctx.fillRect(0, 0, s, s);
      const chips = ["#c9a45c","#8b7355","#d4cfc4","#a09880","#c5b99a","#4a4a50","#2a2a30"];
      for (let i = 0; i < 180; i++) {
        ctx.fillStyle = chips[Math.floor(Math.random() * chips.length)];
        const x = Math.random()*s, y = Math.random()*s, r = 2+Math.random()*6;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.28); ctx.fill();
      }
      ctx.strokeStyle = "rgba(200,195,185,0.5)"; ctx.lineWidth = 1.5;
      for (let i = 0; i < s; i += 32) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,s); ctx.stroke(); }
      for (let i = 0; i < s; i += 32) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(s,i); ctx.stroke(); }
    }, 256, 5, 5);
  }
  function rugTex() {
    return tex((ctx, s) => {
      ctx.fillStyle = "#2a3344"; ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = "#c9a45c"; ctx.fillRect(s * 0.08, s * 0.08, s * 0.84, s * 0.84);
      ctx.fillStyle = "#2a3344"; ctx.fillRect(s * 0.14, s * 0.14, s * 0.72, s * 0.72);
      ctx.strokeStyle = "#c9a45c"; ctx.lineWidth = 3;
      ctx.strokeRect(s * 0.2, s * 0.2, s * 0.6, s * 0.6);
      ctx.fillStyle = "#9a7b3f";
      ctx.beginPath(); ctx.arc(s / 2, s / 2, s * 0.12, 0, 7); ctx.fill();
    }, 256, 1, 1);
  }
  function artTex(hue) {
    return tex((ctx, s) => {
      const g = ctx.createLinearGradient(0, 0, s, s);
      g.addColorStop(0, hue[0]); g.addColorStop(1, hue[1]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
      ctx.globalAlpha = 0.5; ctx.strokeStyle = "#c9a45c"; ctx.lineWidth = 6;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(Math.random() * s, Math.random() * s, 20 + Math.random() * 60, 0, 7); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }, 128, 1, 1);
  }

  /* ---------- material helper ---------- */
  function M(opts) {
    const m = new pc.StandardMaterial();
    if (opts.color) m.diffuse = new pc.Color(...opts.color);
    if (opts.map) { m.diffuseMap = opts.map; m.diffuseMapTiling = new pc.Vec2(opts.map._rx, opts.map._ry); }
    if (opts.gloss !== undefined) m.gloss = opts.gloss;
    if (opts.metal !== undefined) { m.metalness = opts.metal; m.useMetalness = true; }
    if (opts.emissive) { m.emissive = new pc.Color(...opts.emissive); m.emissiveIntensity = opts.emissiveI || 1; }
    if (opts.opacity !== undefined) { m.opacity = opts.opacity; m.blendType = pc.BLEND_NORMAL; }
    m.update();
    return m;
  }

  /* ---------- primitive helper ---------- */
  function prim(type, parent, { pos = [0, 0, 0], scale = [1, 1, 1], mat, shadow = true, recv = true }) {
    const e = new pc.Entity();
    e.addComponent("render", { type });
    if (mat) e.render.meshInstances.forEach((mi) => (mi.material = mat));
    e.render.castShadows = shadow;
    e.render.receiveShadows = recv;
    e.setLocalScale(scale[0], scale[1], scale[2]);
    e.setLocalPosition(pos[0], pos[1], pos[2]);
    (parent || P()).addChild(e);
    return e;
  }
  const box = (p, o) => prim("box", p, o);

  /* ---------- furniture ---------- */
  const MATS = {};
  function buildMats() {
    const t = curTheme;
    MATS.floor = M({ map: marbleTex(), gloss: 0.82, metal: 0.04, color: [1, 1, 1] });
    MATS.terrazzof = M({ map: terrazzotex(), gloss: 0.75, metal: 0.03, color: [1, 1, 1] });
    MATS.wall = M({ color: t.wall, gloss: 0.2 });
    MATS.wallDark = M({ color: t.feature, gloss: 0.3 });
    MATS.ceiling = M({ color: [t.wall[0] + 0.06, t.wall[1] + 0.06, t.wall[2] + 0.06], gloss: 0.1 });
    MATS.wood = M({ color: t.wood, gloss: 0.55, metal: 0.05 });
    MATS.woodLight = M({ color: t.woodLight, gloss: 0.4 });
    MATS.fabric = M({ color: t.fabric, gloss: 0.25 });
    MATS.fabric2 = M({ color: t.fabric2, gloss: 0.25 });
    MATS.gold = M({ color: [0.79, 0.64, 0.36], gloss: 0.85, metal: 0.9 });
    MATS.metal = M({ color: [0.2, 0.2, 0.22], gloss: 0.7, metal: 0.8 });
    MATS.glass = M({ color: [0.6, 0.78, 0.9], opacity: 0.22, gloss: 0.95, metal: 0.1 });
    MATS.marbleWhite = M({ color: [0.9, 0.88, 0.83], gloss: 0.7, metal: 0.05 });
    MATS.warm = M({ color: [1, 0.86, 0.6], emissive: [1, 0.82, 0.5], emissiveI: 2.2 });
    MATS.screen = M({ color: [0.05, 0.05, 0.07], emissive: [0.3, 0.45, 0.7], emissiveI: 1.4 });
    MATS.window = M({ color: [1, 0.93, 0.78], emissive: [1, 0.9, 0.72], emissiveI: 1.6 });
    MATS.plant = M({ color: [0.13, 0.27, 0.16], gloss: 0.3 });
    MATS.rug = M({ map: rugTex(), gloss: 0.2, color: [1, 1, 1] });
  }

  function sofa(parent, x, z, rot, w = 2.4, matFab) {
    const g = new pc.Entity(); g.setLocalPosition(x, 0, z); g.setEulerAngles(0, rot, 0); (parent || P()).addChild(g);
    const fab = matFab || MATS.fabric;
    box(g, { pos: [0, 0.22, 0], scale: [w, 0.44, 0.95], mat: fab });
    box(g, { pos: [0, 0.62, -0.4], scale: [w, 0.7, 0.18], mat: fab });
    box(g, { pos: [-w / 2 + 0.1, 0.5, 0], scale: [0.2, 0.5, 0.95], mat: fab });
    box(g, { pos: [w / 2 - 0.1, 0.5, 0], scale: [0.2, 0.5, 0.95], mat: fab });
    const n = Math.max(2, Math.round(w / 1.1));
    for (let i = 0; i < n; i++)
      box(g, { pos: [-w / 2 + w / (n * 2) + i * (w / n), 0.5, 0.05], scale: [w / n - 0.12, 0.16, 0.8], mat: fab });
    for (const sx of [-w / 2 + 0.15, w / 2 - 0.15])
      for (const sz of [-0.4, 0.4]) box(g, { pos: [sx, 0.05, sz], scale: [0.1, 0.1, 0.1], mat: MATS.metal });
    return g;
  }
  function coffeeTable(parent, x, z) {
    const g = new pc.Entity(); g.setLocalPosition(x, 0, z); (parent || P()).addChild(g);
    box(g, { pos: [0, 0.4, 0], scale: [1.3, 0.08, 0.7], mat: MATS.gold });
    box(g, { pos: [0, 0.2, 0], scale: [1.2, 0.04, 0.6], mat: MATS.glass });
    for (const sx of [-0.55, 0.55]) for (const sz of [-0.28, 0.28])
      prim("cylinder", g, { pos: [sx, 0.2, sz], scale: [0.05, 0.4, 0.05], mat: MATS.gold });
    return g;
  }
  function diningSet(parent, x, z) {
    const g = new pc.Entity(); g.setLocalPosition(x, 0, z); (parent || P()).addChild(g);
    box(g, { pos: [0, 0.74, 0], scale: [2.4, 0.08, 1.1], mat: MATS.wood });
    box(g, { pos: [0, 0.76, 0], scale: [2.0, 0.02, 0.4], mat: MATS.warm });
    for (const sx of [-1.0, 1.0]) box(g, { pos: [sx, 0.37, 0], scale: [0.12, 0.74, 0.8], mat: MATS.wood });
    for (let i = 0; i < 3; i++) for (const side of [-1, 1]) {
      const cx = -0.8 + i * 0.8, cz = side * 0.85;
      box(g, { pos: [cx, 0.45, cz], scale: [0.42, 0.06, 0.42], mat: MATS.fabric2 });
      box(g, { pos: [cx, 0.72, cz + side * 0.18], scale: [0.42, 0.55, 0.06], mat: MATS.fabric2 });
      for (const lx of [-0.16, 0.16]) for (const lz of [-0.16, 0.16])
        prim("cylinder", g, { pos: [cx + lx, 0.22, cz + lz], scale: [0.04, 0.45, 0.04], mat: MATS.wood });
    }
    return g;
  }
  function kitchen(parent) {
    const g = new pc.Entity(); (parent || P()).addChild(g);
    const isBahria      = curTheme === THEMES.bahriaTown;
    const isCGold       = curTheme === THEMES.charcoalGold;
    const matLower  = (isBahria || isCGold) ? M({ color: [0.20, 0.20, 0.22], gloss: 0.45, metal: 0.1 }) : MATS.wood;
    const matUpper  = isCGold   ? M({ color: [0.22, 0.22, 0.24], gloss: 0.50, metal: 0.15 })
                    : isBahria  ? M({ color: [0.88, 0.86, 0.82], gloss: 0.35 }) : MATS.woodLight;
    const matCounter= (isBahria || isCGold) ? M({ color: [0.12, 0.12, 0.14], gloss: 0.84, metal: 0.38 }) : MATS.marbleWhite;
    const matSplash = (isBahria || isCGold) ? M({ color: [0.52, 0.52, 0.55], gloss: 0.82, metal: 0.2 }) : MATS.wallDark;
    // run along north wall (z=-5.7) — mirror x so it tracks the flipped plan
    box(g, { pos: [X(-3), 0.45, -5.4], scale: [6, 0.9, 0.7], mat: matLower });
    box(g, { pos: [X(-3), 0.92, -5.4], scale: [6, 0.06, 0.72], mat: matCounter });
    box(g, { pos: [X(-3), 2.3, -5.55], scale: [6, 0.8, 0.4], mat: matUpper });
    box(g, { pos: [X(-3), 1.5, -5.7], scale: [6, 0.8, 0.06], mat: matSplash }); // backsplash
    box(g, { pos: [X(-3), 1.0, -5.0], scale: [6, 0.02, 0.02], mat: MATS.warm }); // under-cabinet light
    // hood — dark metal in bahria
    box(g, { pos: [X(-3), 2.0, -5.4], scale: [1.0, 0.5, 0.6], mat: MATS.metal });
    // sink notch (dark inset)
    box(g, { pos: [X(-4), 0.93, -5.4], scale: [0.7, 0.05, 0.5], mat: MATS.metal });
    // island / peninsula (no island in this house — extend lower run instead)
    if (!isBahria) {
      if (isCGold) {
        // dark concrete island + black stone top + amber glass cylinder pendants (as in photos)
        const matIsland   = M({ color: [0.16, 0.16, 0.18], gloss: 0.55, metal: 0.2 });
        const matBlackTop = M({ color: [0.10, 0.10, 0.11], gloss: 0.90, metal: 0.5 });
        const matAmber    = M({ color: [0.92, 0.56, 0.20], opacity: 0.55, gloss: 0.92, emissive: [0.85, 0.45, 0.12], emissiveI: 1.8 });
        box(g, { pos: [X(-3), 0.45, -3.4], scale: [3, 0.9, 1.2], mat: matIsland });
        box(g, { pos: [X(-3), 0.93, -3.4], scale: [3.2, 0.08, 1.4], mat: matBlackTop });
        for (const sx of [-1, 0, 1]) {
          prim("cylinder", g, { pos: [X(-3 + sx * 0.9), 0.52, -2.6], scale: [0.055, 0.7, 0.055], mat: MATS.gold });
          prim("cylinder", g, { pos: [X(-3 + sx * 0.9), 0.92, -2.6], scale: [0.22, 0.36, 0.22], mat: matAmber });
        }
      } else {
        box(g, { pos: [X(-3), 0.45, -3.4], scale: [3, 0.9, 1.2], mat: MATS.wallDark });
        box(g, { pos: [X(-3), 0.93, -3.4], scale: [3.2, 0.08, 1.4], mat: MATS.marbleWhite });
        for (const sx of [-1, 0, 1]) {
          prim("cylinder", g, { pos: [X(-3 + sx * 0.9), 0.55, -2.6], scale: [0.07, 0.7, 0.07], mat: MATS.gold });
          prim("cylinder", g, { pos: [X(-3 + sx * 0.9), 1.0, -2.6], scale: [0.34, 0.12, 0.34], mat: MATS.fabric2 });
        }
      }
    } // end !isBahria island block
    /* bahria: laundry appliance against side wall */
    if (isBahria) {
      box(g, { pos: [X(5.5), 0.45, -5.3], scale: [0.6, 0.9, 0.65], mat: matLower });
      box(g, { pos: [X(5.5), 0.4, -5.0], scale: [0.55, 0.55, 0.04], mat: MATS.metal });
    }
    return g;
  }
  function bed(parent, x, z) {
    const g = new pc.Entity(); g.setLocalPosition(x, 0, z); (parent || P()).addChild(g);
    box(g, { pos: [0, 0.28, 0], scale: [2.1, 0.4, 2.3], mat: MATS.wood });
    box(g, { pos: [0, 0.55, 0.1], scale: [2.0, 0.25, 2.1], mat: MATS.marbleWhite }); // mattress
    box(g, { pos: [0, 0.6, 0.5], scale: [2.0, 0.18, 1.2], mat: MATS.fabric }); // duvet fold
    box(g, { pos: [0, 0.95, -1.05], scale: [2.2, 1.1, 0.16], mat: MATS.fabric2 }); // headboard
    for (const px of [-0.55, 0.55]) box(g, { pos: [px, 0.72, -0.6], scale: [0.7, 0.22, 0.5], mat: MATS.warm });
    for (const sx of [-1.4, 1.4]) {
      box(g, { pos: [sx, 0.3, -0.7], scale: [0.55, 0.55, 0.5], mat: MATS.wood });
      prim("cylinder", g, { pos: [sx, 0.75, -0.7], scale: [0.18, 0.35, 0.18], mat: MATS.warm });
    }
    return g;
  }
  function wardrobe(parent, x, z, rot) {
    const g = new pc.Entity(); g.setLocalPosition(x, 0, z); g.setEulerAngles(0, rot, 0); (parent || P()).addChild(g);
    const isBahria = curTheme === THEMES.bahriaTown;
    if (isBahria) {
      /* black aluminium-frame glass-panel wardrobe as seen in video */
      const matFrame = M({ color: [0.06, 0.06, 0.07], gloss: 0.6, metal: 0.5 });
      const matGlassW = M({ color: [0.55, 0.55, 0.58], opacity: 0.28, gloss: 0.97, metal: 0.1 });
      box(g, { pos: [0, 1.2, 0], scale: [2.8, 2.4, 0.08], mat: matFrame });
      for (let i = 0; i < 4; i++) {
        box(g, { pos: [-1.05 + i * 0.7, 1.2, 0.02], scale: [0.04, 2.32, 0.04], mat: matFrame });
        box(g, { pos: [-0.7 + i * 0.7, 1.2, 0.02], scale: [0.58, 2.28, 0.04], mat: matGlassW });
      }
    } else {
      box(g, { pos: [0, 1.2, 0], scale: [2.4, 2.4, 0.6], mat: MATS.woodLight });
      for (let i = 0; i < 4; i++) box(g, { pos: [-0.9 + i * 0.6, 1.2, 0.31], scale: [0.02, 2.2, 0.02], mat: MATS.gold });
    }
    return g;
  }
  function tvWall(parent, x, z, rot) {
    const g = new pc.Entity(); g.setLocalPosition(x, 0, z); g.setEulerAngles(0, rot, 0); (parent || P()).addChild(g);
    box(g, { pos: [0, 1.5, 0.06], scale: [4.2, 3.0, 0.12], mat: MATS.wallDark });
    box(g, { pos: [0, 1.5, 0.14], scale: [2.6, 1.5, 0.06], mat: MATS.screen });
    box(g, { pos: [0, 0.3, 0.3], scale: [3.4, 0.5, 0.5], mat: MATS.wood });
    box(g, { pos: [0, 0.58, 0.3], scale: [3.4, 0.02, 0.5], mat: MATS.warm });
    for (let i = -1; i <= 1; i++) box(g, { pos: [i * 1.6, 1.5, 0.13], scale: [0.04, 2.6, 0.02], mat: MATS.gold });
    return g;
  }
  function painting(parent, x, y, z, rot, hue) {
    const g = new pc.Entity(); g.setLocalPosition(x, y, z); g.setEulerAngles(0, rot, 0); (parent || P()).addChild(g);
    box(g, { pos: [0, 0, 0], scale: [1.3, 0.95, 0.06], mat: MATS.gold });
    const art = box(g, { pos: [0, 0, 0.04], scale: [1.15, 0.8, 0.04], mat: M({ map: artTex(hue), gloss: 0.3, color: [1, 1, 1] }) });
    return g;
  }
  function plant(parent, x, z, s = 1) {
    const g = new pc.Entity(); g.setLocalPosition(x, 0, z); (parent || P()).addChild(g);
    prim("cylinder", g, { pos: [0, 0.3 * s, 0], scale: [0.4 * s, 0.6 * s, 0.4 * s], mat: MATS.marbleWhite });
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * 6.28;
      prim("cone", g, { pos: [Math.cos(a) * 0.18 * s, (0.9 + i * 0.12) * s, Math.sin(a) * 0.18 * s], scale: [0.5 * s, 1.0 * s, 0.5 * s], mat: MATS.plant });
    }
    prim("cone", g, { pos: [0, 1.4 * s, 0], scale: [0.5 * s, 1.1 * s, 0.5 * s], mat: MATS.plant });
    return g;
  }
  function chandelier(parent, x, z, y = 3.0) {
    const g = new pc.Entity(); g.setLocalPosition(x, y, z); (parent || P()).addChild(g);
    prim("cylinder", g, { pos: [0, 0.4, 0], scale: [0.03, 0.8, 0.03], mat: MATS.gold });
    prim("torus", g, { pos: [0, 0, 0], scale: [1, 1, 1], mat: MATS.gold });
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * 6.28;
      prim("sphere", g, { pos: [Math.cos(a) * 0.5, -0.1, Math.sin(a) * 0.5], scale: [0.16, 0.16, 0.16], mat: MATS.warm });
    }
    return g;
  }
  /* ceiling fan — as seen in this house: dark blades, gold hub */
  function ceilingFan(parent, x, z, y = 3.08) {
    const g = new pc.Entity(); g.setLocalPosition(x, y, z); (parent || P()).addChild(g);
    prim("cylinder", g, { pos: [0, 0.18, 0], scale: [0.06, 0.36, 0.06], mat: MATS.metal });
    prim("cylinder", g, { pos: [0, 0, 0], scale: [0.22, 0.12, 0.22], mat: MATS.gold });
    const blades = 3;
    for (let i = 0; i < blades; i++) {
      const a = (i / blades) * 6.28;
      const blade = new pc.Entity(); blade.setLocalPosition(Math.cos(a) * 0.55, 0, Math.sin(a) * 0.55);
      blade.setEulerAngles(0, (a * 180 / Math.PI) + 90, 8);
      box(blade, { pos: [0, 0, 0], scale: [0.9, 0.04, 0.22], mat: MATS.metal });
      g.addChild(blade);
    }
    prim("sphere", g, { pos: [0, -0.1, 0], scale: [0.15, 0.15, 0.15], mat: MATS.warm });
    return g;
  }
  /* black geometric feature wall — as in the drawing room:
     alternating black vertical slat panels and white marble-look inlays */
  function featureWall(parent, x, z, rot, w = 5.0, h = 3.2) {
    const g = new pc.Entity(); g.setLocalPosition(x, 0, z); g.setEulerAngles(0, rot, 0); (parent || P()).addChild(g);
    const matBlack  = M({ color: [0.06, 0.06, 0.07], gloss: 0.5, metal: 0.3 });
    const matMarble = M({ map: marbleTex(), gloss: 0.75, metal: 0.04, color: [1, 1, 1] });
    /* backing slab */
    box(g, { pos: [0, h / 2, 0], scale: [w, h, 0.12], mat: matBlack });
    const panels = 5, pw = w / panels;
    for (let i = 0; i < panels; i++) {
      const px = -w / 2 + pw * 0.5 + i * pw;
      if (i % 2 === 0) {
        /* black slat panel with diagonal score lines */
        box(g, { pos: [px, h / 2, 0.07], scale: [pw - 0.08, h - 0.12, 0.06], mat: matBlack });
        for (let d = 0; d < 4; d++)
          box(g, { pos: [px, 0.5 + d * 0.7, 0.11], scale: [pw - 0.12, 0.018, 0.02], mat: matMarble });
      } else {
        /* white marble inlay tile */
        box(g, { pos: [px, h / 2, 0.07], scale: [pw - 0.1, h - 0.16, 0.05], mat: matMarble });
      }
    }
    return g;
  }
  function curtain(parent, x, z, rot, w = 2.2) {
    const g = new pc.Entity(); g.setLocalPosition(x, 0, z); g.setEulerAngles(0, rot, 0); (parent || P()).addChild(g);
    for (let i = 0; i < 6; i++) box(g, { pos: [-w / 2 + i * (w / 5), 1.7, 0], scale: [w / 9, 2.6, 0.08], mat: MATS.fabric2 });
    return g;
  }
  /* forest-green feature wall with floating white shelves — charcoalGold drawing room */
  function greenFeatureWall(parent, x, z, rot, w = 5.0, h = 3.2) {
    const g = new pc.Entity(); g.setLocalPosition(x, 0, z); g.setEulerAngles(0, rot, 0); (parent || P()).addChild(g);
    const matGreen = M({ color: [0.09, 0.18, 0.13], gloss: 0.22 });
    const matShelf = M({ color: [0.92, 0.90, 0.86], gloss: 0.55 });
    box(g, { pos: [0, h / 2, 0],    scale: [w, h, 0.10], mat: matGreen });
    // two slim vertical dividers
    for (const vx of [-w * 0.28, w * 0.28])
      box(g, { pos: [vx, h / 2, 0.06], scale: [0.04, h - 0.18, 0.04], mat: matShelf });
    // three shelves with small decor cubes
    for (let r = 0; r < 3; r++) {
      const sy = 0.85 + r * 0.82;
      box(g, { pos: [0, sy, 0.08], scale: [w - 0.28, 0.04, 0.26], mat: matShelf });
      for (let d = 0; d < 4; d++) {
        const dx = -w * 0.35 + d * w * 0.23;
        box(g, { pos: [dx, sy + 0.12 + d * 0.04, 0.16], scale: [0.08, 0.18 + d * 0.06, 0.08], mat: MATS.marbleWhite });
      }
    }
    return g;
  }

  /* 3 gold circular disc pendants — as seen in charcoalGold lounge */
  function discPendants(parent, x, z, y = 2.82) {
    const g = new pc.Entity(); g.setLocalPosition(x, y, z); (parent || P()).addChild(g);
    for (let i = -1; i <= 1; i++) {
      prim("cylinder", g, { pos: [i * 1.05, 0.38, 0], scale: [0.022, 0.76, 0.022], mat: MATS.gold });
      prim("cylinder", g, { pos: [i * 1.05, 0,    0], scale: [0.68,  0.055, 0.68],  mat: MATS.gold });
      prim("cylinder", g, { pos: [i * 1.05, -0.04, 0], scale: [0.52, 0.10, 0.52],   mat: MATS.warm });
    }
    return g;
  }

  /* large rectangular chain chandelier — charcoalGold foyer/dining feature piece */
  function rectChandelier(parent, x, z, y = 3.0) {
    const g = new pc.Entity(); g.setLocalPosition(x, y, z); (parent || P()).addChild(g);
    prim("cylinder", g, { pos: [0, 0.55, 0], scale: [0.026, 1.1, 0.026], mat: MATS.gold });
    const fw = 1.5, fd = 0.75, ft = 0.045;
    box(g, { pos: [0,       0,    0],       scale: [fw, ft, ft],       mat: MATS.gold });
    box(g, { pos: [0,       0,    fd],      scale: [fw, ft, ft],       mat: MATS.gold });
    box(g, { pos: [-fw / 2, 0,    fd / 2], scale: [ft, ft, fd + ft],  mat: MATS.gold });
    box(g, { pos: [fw / 2,  0,    fd / 2], scale: [ft, ft, fd + ft],  mat: MATS.gold });
    // bulbs along the perimeter
    for (let i = 0; i < 6; i++) {
      const ox = -fw / 2 + (fw / 5) * i;
      prim("sphere", g, { pos: [ox, -0.09, 0],  scale: [0.1, 0.13, 0.1], mat: MATS.warm });
      prim("sphere", g, { pos: [ox, -0.09, fd], scale: [0.1, 0.13, 0.1], mat: MATS.warm });
    }
    for (let i = 1; i < 3; i++) {
      const oz = (fd / 3) * i;
      prim("sphere", g, { pos: [-fw / 2, -0.09, oz], scale: [0.1, 0.13, 0.1], mat: MATS.warm });
      prim("sphere", g, { pos: [fw / 2,  -0.09, oz], scale: [0.1, 0.13, 0.1], mat: MATS.warm });
    }
    return g;
  }

  /* ---------- WALKABLE STAIRCASE ----------
     Footprint: x in [stair.x0, stair.x1], z in [stair.zBot, stair.zTop].
     Climbs from y=0 at zBot (near back wall) up to y=H at zTop.
     state.stair holds the active (already mirror-resolved) footprint, read by
     staircase(), buildUpperFloor(), collide() and tick() so they stay in sync. */
  const STAIR_BASE = { x0: 0.1, x1: 1.9, zBot: 7.5, zTop: 4.6 };
  function staircase(H) {
    const S = state.stair;
    const steps = 16;
    const xMid = (S.x0 + S.x1) / 2, w = S.x1 - S.x0;
    const run = S.zBot - S.zTop;          // total horizontal travel
    const stepDepth = run / steps, stepRise = H / steps;
    for (let i = 0; i < steps; i++) {
      const z = S.zBot - stepDepth * (i + 0.5);
      const y = stepRise * (i + 0.5);
      box(null, { pos: [xMid, y - stepRise / 2, z], scale: [w, stepRise + 0.02, stepDepth + 0.02], mat: MATS.marbleWhite });
    }
    // glass balustrade down the open side
    box(null, { pos: [S.x0 - 0.04, H * 0.5 + 0.4, (S.zBot + S.zTop) / 2], scale: [0.05, H + 0.8, run], mat: MATS.glass });
    box(null, { pos: [S.x0 - 0.04, H + 0.55, (S.zBot + S.zTop) / 2], scale: [0.07, 0.07, run], mat: MATS.gold });
    // newel light at the foot
    prim("cylinder", null, { pos: [S.x1 + 0.1, 0.5, S.zBot - 0.1], scale: [0.12, 1.0, 0.12], mat: MATS.gold });
    prim("sphere", null, { pos: [S.x1 + 0.1, 1.1, S.zBot - 0.1], scale: [0.26, 0.26, 0.26], mat: MATS.warm });
  }

  /* ---------- UPPER FLOOR ----------
     A real second storey: slab with a stairwell void, perimeter walls,
     two bedroom suites + a landing lounge, reachable by the staircase. */
  function buildUpperFloor(cfg, H) {
    const S = state.stair;
    const slabTop = H, t = 0.12, cy = slabTop - t / 2;
    // hole is already in mirror-resolved world space (from state.stair)
    const hole = { x0: S.x0 - 0.2, x1: S.x1 + 0.2, z0: S.zTop, z1: 8 };
    const slab = (x0, x1, z0, z1) =>
      box(null, { pos: [(x0 + x1) / 2, cy, (z0 + z1) / 2], scale: [Math.abs(x1 - x0), t, z1 - z0], mat: MATS.floor });
    // slab around the stairwell hole (covers x[-7,7] z[-6,8] minus hole)
    slab(-7, hole.x0, -6, 8);
    slab(hole.x1, 7, -6, 8);
    slab(hole.x0, hole.x1, -6, hole.z0);

    // upper ceiling + cove lights
    box(null, { pos: [0, 2 * H + 0.05, 1], scale: [14, 0.1, 14], mat: MATS.ceiling, shadow: false });
    for (const cz of [-3, 1, 5]) box(null, { pos: [0, 2 * H - 0.06, cz], scale: [10, 0.04, 0.18], mat: MATS.warm, shadow: false });

    // upper perimeter walls (lvl 1) — symmetric about x, mirror is a no-op
    wallSeg(-7, 8, 7, 8, H, MATS.wall, true, 0.16, slabTop, 1);
    wallSeg(-7, -6, 7, -6, H, MATS.wall, true, 0.16, slabTop, 1);
    wallSeg(-7, -6, -7, 8, H, MATS.wall, true, 0.16, slabTop, 1);
    wallSeg(7, -6, 7, 8, H, MATS.wall, true, 0.16, slabTop, 1);
    // central partition splitting two suites, doorway gap z 0.5..1.7
    wallSeg(0, -6, 0, 0.5, H, MATS.wall, true, 0.16, slabTop, 1);
    wallSeg(0, 1.7, 0, 4, H, MATS.wall, true, 0.16, slabTop, 1);
    wallSeg(X(-7), 4, hole.x0, 4, H, MATS.wall, true, 0.16, slabTop, 1);

    // stairwell guard rails (lvl 1 collision so you can't fall in)
    const rail = (x1, z1, x2, z2) => {
      wallSeg(x1, z1, x2, z2, 1.0, MATS.glass, true, 0.06, slabTop, 1);
      wallSeg(x1, z1, x2, z2, 0.06, MATS.gold, false, 0.08, slabTop + 1.0, 1);
    };
    rail(hole.x0, hole.z0, hole.x0, hole.z1);
    rail(hole.x1, hole.z0, hole.x1, hole.z1);
    rail(hole.x0, hole.z1, hole.x1, hole.z1);

    // furnish upstairs on a group raised to the slab
    const up = new pc.Entity(); up.setLocalPosition(0, slabTop, 0); P().addChild(up);
    // west suite
    prim("plane", up, { pos: [X(-3.5), 0.02, 0], scale: [4.5, 1, 4.5], mat: MATS.rug, shadow: false });
    bed(up, X(-3.5), -1.5);
    wardrobe(up, X(-6.6), 1.5, R(90));
    chandelier(up, X(-3.5), 0, 2.9);
    painting(up, X(-3.5), 1.9, -5.9, 0, hue3(cfg, 0));
    plant(up, X(-6.3), -4.8, 1.0);
    // east suite
    prim("plane", up, { pos: [X(3.8), 0.02, -1], scale: [4.5, 1, 4.5], mat: MATS.rug, shadow: false });
    bed(up, X(3.8), -2.2);
    wardrobe(up, X(6.6), 0.5, R(-90));
    chandelier(up, X(3.8), -1, 2.9);
    painting(up, X(3.8), 1.9, -5.9, 0, hue3(cfg, 1));
    plant(up, X(6.2), -4.8, 1.0);
    // landing lounge (south, by the stairwell)
    sofa(up, X(-2.5), 6.2, R(180), 2.2, MATS.fabric);
    coffeeTable(up, X(-2.5), 5.4);
    plant(up, X(-6.2), 7.0, 1.1);
    chandelier(up, X(-3), 6, 2.9);

    state.upRooms = (cfg.upRoomLabels && cfg.upRoomLabels.length === 3)
      ? cfg.upRoomLabels
      : ["Upstairs Suite", "Family Bedroom", "Upper Landing"];
  }
  // helper for upstairs art hue without leaking the closure var
  function hue3(cfg, i) {
    const art = curTheme.art;
    return art[(i + 1) % art.length];
  }

  /* cinema room — tiered seats, large screen */
  function cinemaRoom(parent, x, z) {
    const g = new pc.Entity(); g.setLocalPosition(x, 0, z); (parent || P()).addChild(g);
    const matSeat = M({ color: [0.12, 0.05, 0.05], gloss: 0.3 });
    const matScreen = M({ color: [0.02, 0.05, 0.15], emissive: [0.18, 0.28, 0.55], emissiveI: 2.4 });
    /* screen */
    box(g, { pos: [0, 1.4, -0.2], scale: [3.8, 2.2, 0.08], mat: M({ color: [0.1, 0.1, 0.12], gloss: 0.15 }) });
    box(g, { pos: [0, 1.4, -0.14], scale: [3.4, 1.9, 0.04], mat: matScreen });
    /* rows of seats */
    for (let row = 0; row < 3; row++) {
      const tz = 0.9 + row * 1.1, ty = row * 0.12;
      for (let s = -1; s <= 1; s++) {
        box(g, { pos: [s * 1.1, ty + 0.3, tz], scale: [0.75, 0.12, 0.7], mat: matSeat });
        box(g, { pos: [s * 1.1, ty + 0.7, tz - 0.28], scale: [0.75, 0.65, 0.1], mat: matSeat });
      }
    }
    /* aisle floor strip glow */
    box(g, { pos: [0, 0.01, 1.5], scale: [0.2, 0.02, 3.5], mat: MATS.warm, shadow: false });
    return g;
  }

  /* infinity pool glow — visible through south wall */
  function infinityPool() {
    const matPool = M({ color: [0.12, 0.55, 0.75], emissive: [0.08, 0.45, 0.65], emissiveI: 1.6, opacity: 0.35, gloss: 0.98 });
    box(null, { pos: [0, 0.4, -6.1], scale: [9, 0.8, 0.12], mat: matPool, shadow: false });
    /* ripple shimmer strip */
    box(null, { pos: [0, 0.82, -6.0], scale: [9, 0.04, 0.08], mat: M({ color:[1,1,1], emissive:[0.5,0.85,1], emissiveI:2.2 }), shadow: false });
  }

  /* glass atrium — overhead glass ceiling glow */
  function glassAtrium(H) {
    const matGlass = M({ color: [0.8, 0.88, 1.0], emissive: [0.6, 0.72, 0.9], emissiveI: 1.3, opacity: 0.18, gloss: 0.98 });
    /* glass panels in ceiling above central living zone */
    for (let i = -2; i <= 2; i++)
      box(null, { pos: [i * 1.6, H + 0.04, 1], scale: [1.4, 0.06, 4.0], mat: matGlass, shadow: false });
    /* overhead frame */
    for (const fx of [-3.2, -0.8, 0.8, 3.2])
      box(null, { pos: [fx, H + 0.04, 1], scale: [0.08, 0.08, 4.0], mat: MATS.metal, shadow: false });
    /* warm skylight glow on floor */
    box(null, { pos: [0, 0.01, 1], scale: [6, 0.02, 4], mat: M({ color:[1,1,1], emissive:[0.85,0.90,0.98], emissiveI:0.5 }), shadow: false });
  }

  /* farmhouse exposed ceiling beams */
  function farmhouseBeams(H) {
    for (let i = -2; i <= 2; i++)
      box(null, { pos: [i * 2.2, H - 0.2, 1], scale: [0.28, 0.28, 12], mat: MATS.wood, shadow: false });
  }

  /* cedar vertical slat screens (Lake City) */
  function cedarScreens(parent, x, z, rot) {
    const g = new pc.Entity(); g.setLocalPosition(x, 0, z); g.setEulerAngles(0, rot, 0); (parent || P()).addChild(g);
    const matCedar = M({ color: [0.52, 0.32, 0.16], gloss: 0.4, metal: 0.02 });
    for (let i = 0; i < 8; i++)
      box(g, { pos: [-1.75 + i * 0.5, 1.6, 0], scale: [0.12, 3.2, 0.08], mat: matCedar });
    return g;
  }

  /* ---------- walls + shell ----------
     baseY = vertical base of the wall (0 = ground, H = upper floor)
     lvl   = collision level: 0 ground only, 1 upper only, 2 both */
  function wallSeg(x1, z1, x2, z2, h, mat, collide = true, thick = 0.16, baseY = 0, lvl = 0) {
    const dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz);
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2, ang = Math.atan2(dx, dz) * 180 / Math.PI;
    const e = new pc.Entity();
    e.addComponent("render", { type: "box" });
    e.render.meshInstances.forEach((mi) => (mi.material = mat));
    e.render.castShadows = true; e.render.receiveShadows = true;
    e.setLocalScale(thick, h, len);
    e.setLocalPosition(cx, baseY + h / 2, cz);
    e.setEulerAngles(0, ang, 0);
    P().addChild(e);
    if (collide) state.walls.push({ x1, z1, x2, z2, lvl });
    return e;
  }
  function windowOnWall(x1, z1, x2, z2, mat) {
    const dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz);
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2, ang = Math.atan2(dx, dz) * 180 / Math.PI;
    const e = new pc.Entity(); e.addComponent("render", { type: "box" });
    e.render.meshInstances.forEach((mi) => (mi.material = mat));
    e.setLocalScale(0.06, 1.8, len); e.setLocalPosition(cx, 1.7, cz); e.setEulerAngles(0, ang, 0);
    e.render.castShadows = false;
    P().addChild(e);
  }

  function buildHouse(cfg) {
    cfg = cfg || {};
    const art = curTheme.art;
    const hue = (i) => art[i % art.length];
    buildMats();
    const H = 3.2;

    // ---- resolve the per-listing layout (mirror flips the whole plan) ----
    MX = cfg.mirror ? -1 : 1;
    state.mirror = MX < 0;
    state.stair = MX < 0
      ? { x0: -STAIR_BASE.x1, x1: -STAIR_BASE.x0, zBot: STAIR_BASE.zBot, zTop: STAIR_BASE.zTop }
      : { x0: STAIR_BASE.x0, x1: STAIR_BASE.x1, zBot: STAIR_BASE.zBot, zTop: STAIR_BASE.zTop };
    state.spawn = { x: X(-1.5), z: 7.0, yaw: 0, pitch: -4 };

    // ground floor — single slab, terrazzo or marble per listing (no overlay → no z-fighting)
    const floorMat = cfg.terrazzo ? MATS.terrazzof : MATS.floor;
    box(null, { pos: [0, -0.05, 1], scale: [14, 0.1, 14], mat: floorMat });
    // cove light strips below the upper-floor slab
    for (const cz of [-3, 1, 5]) box(null, { pos: [0, H - 0.12, cz], scale: [10, 0.04, 0.18], mat: MATS.warm, shadow: false });

    // outer walls (with south doorway gap x -3..-1)
    wallSeg(X(-7), 8, X(-3), 8, H, MATS.wall);
    wallSeg(X(-1), 8, X(7), 8, H, MATS.wall);
    wallSeg(X(-7), -6, X(7), -6, H, MATS.wall);
    wallSeg(X(-7), -6, X(-7), 8, H, MATS.wall);
    wallSeg(X(7), -6, X(7), 8, H, MATS.wall);
    // bedroom partition (room x 2.5..7, z 4..8) with doorway gap z 5.4..6.6
    wallSeg(X(2.5), 4, X(2.5), 5.4, H, MATS.wall);
    wallSeg(X(2.5), 6.6, X(2.5), 8, H, MATS.wall);
    wallSeg(X(2.5), 4, X(7), 4, H, MATS.wall);
    // accent feature wall behind TV (west)
    wallSeg(X(-6.9), 0.5, X(-6.9), 3.5, H, MATS.wallDark, false, 0.04);

    // glowing windows
    windowOnWall(X(-6.95), -5, X(-6.95), -2, MATS.window);
    windowOnWall(X(-2), -5.9, X(2), -5.9, MATS.window);
    windowOnWall(X(6.95), -3, X(6.95), 0, MATS.window);
    curtain(null, X(-6.7), -3.5, R(90), 2.6);
    curtain(null, X(6.7), -1.5, R(-90), 2.6);

    const isBahria     = curTheme === THEMES.bahriaTown;
    const isCharcoalGold = curTheme === THEMES.charcoalGold;

    /* --- WEST / LIVING area --- */
    if (isBahria) {
      featureWall(null, X(-6.85), 2, R(90), 5.0, H);
      chandelier(null, X(-3), 2, H - 0.15);
      chandelier(null, X(-3), 0.5, H - 0.15);
      ceilingFan(null, X(-4.5), 2, H);
      ceilingFan(null, X(-1.5), 2, H);
      const matGarden = M({ color:[0.55,0.75,0.45], emissive:[0.38,0.52,0.28], emissiveI:1.8, opacity:0.18, gloss:0.95 });
      box(null, { pos:[0, H/2, -5.95], scale:[8, H, 0.06], mat:matGarden, shadow:false });
      for (const fx of [-3,-1,1,3]) box(null, { pos:[fx, H/2, -5.93], scale:[0.06, H, 0.08], mat:MATS.metal, shadow:false });
      curtain(null, X(-5.5), -5.6, R(0), 2.0);
      curtain(null, X(5.5), -5.6, R(0), 2.0);
      sofa(null, X(-2), 2, R(180), 2.8, MATS.fabric);
      sofa(null, X(-4.5), 1, R(90), 2.0, MATS.fabric);
      coffeeTable(null, X(-2), 1);
      for (const ox of [-0.6, 0.6]) {
        prim("cylinder", null, { pos:[X(ox), 0.8, 6.5], scale:[0.1, 1.6, 0.1], mat:MATS.gold });
        prim("sphere",   null, { pos:[X(ox), 1.7, 6.5], scale:[0.35,0.35,0.35], mat:M({ color:[1,1,1], gloss:0.2 }) });
      }
      const matFluted = M({ color:[0.48,0.50,0.54], gloss:0.35 });
      box(null, { pos:[X(4.75), H/2, 7.9], scale:[4, H, 0.1], mat:matFluted });
      box(null, { pos:[X(4.75), 1.6, 7.85], scale:[0.7, 1.0, 0.04], mat:M({ color:[0.55,0.55,0.58], gloss:0.98, metal:0.15, opacity:0.6 }) });
      box(null, { pos:[X(4.75), 1.6, 7.84], scale:[0.76, 1.06, 0.03], mat:MATS.gold });
      box(null, { pos:[X(-5.5), 1.8, -5.85], scale:[1.2, 0.7, 0.04], mat:M({ color:[1,0.9,0.7], emissive:[1,0.88,0.6], emissiveI:2.5 }), shadow:false });
    } else if (isCharcoalGold) {
      // forest-green feature wall with floating shelves (drawing room, as in photos)
      greenFeatureWall(null, X(-6.85), 2, R(90), 5.0, H);
      // white marble TV panel inset into the green wall
      box(null, { pos: [X(-6.80), 1.5, 2], scale: [0.06, 2.8, 4.6], mat: M({ color:[0.90,0.88,0.84], gloss:0.76, metal:0.05 }) });
      box(null, { pos: [X(-6.76), 1.5, 2], scale: [0.05, 1.48, 2.6], mat: MATS.screen });
      // 3 gold disc pendants over lounge (as in photos)
      discPendants(null, X(-3.2), 1.8, H - 0.18);
      ceilingFan(null, X(-4.8), 2, H);
      // cove light strip below ceiling on the green wall side
      box(null, { pos: [X(-6.5), H - 0.10, 2], scale: [0.04, 0.04, 5.0], mat: MATS.warm, shadow: false });
      prim("plane", null, { pos:[X(-3), 0.02, 2], scale:[4.5,1,3.2], mat:MATS.rug, shadow:false });
      sofa(null, X(-2.2), 2.8, R(180), 2.8, MATS.fabric);
      sofa(null, X(-4.8), 1.6, R(90),  2.0, MATS.fabric);
      coffeeTable(null, X(-2.8), 2);
      curtain(null, X(-6.7), -0.8, R(90), 2.6);
      curtain(null, X(-6.7),  4.8, R(90), 2.6);
      painting(null, X(-3), 1.9, 7.9, R(180), hue(0));
    } else {
      prim("plane", null, { pos:[X(-3), 0.02, 2], scale:[4.5,1,3.2], mat:MATS.rug, shadow:false });
      tvWall(null, X(-6.8), 2, R(90));
      sofa(null, X(-3), 3.6, R(180), 2.8, MATS.fabric);
      sofa(null, X(-5.0), 2, R(90), 2.2, MATS.fabric);
      coffeeTable(null, X(-3), 2);
      painting(null, X(-3), 1.9, 7.9, R(180), hue(0));
      chandelier(null, X(-3), 2, 3.0);
    }

    plant(null, X(-6), 6.5, 1.1);

    /* --- EAST zone: cinema OR dining --- */
    if (cfg.cinema) {
      cinemaRoom(null, X(4.2), 1);
      chandelier(null, X(4.2), 1, 3.0);
    } else {
      diningSet(null, X(4.2), 1);
      if (isCharcoalGold) rectChandelier(null, X(4.2), 1, 3.0);
      else chandelier(null, X(4.2), 1, 3.0);
      painting(null, X(6.9), 1.9, 0.5, R(-90), hue(1));
    }

    /* --- KITCHEN --- */
    kitchen(null);
    plant(null, X(-6.2), -5, 1.0);

    /* --- FOYER + walkable staircase + second storey --- */
    staircase(H);
    buildUpperFloor(cfg, H);
    plant(null, X(-6.3), 7.2, 1.2);
    painting(null, 0, 1.9, -5.9, R(0), hue(2));

    /* --- BEDROOM --- */
    prim("plane", null, { pos:[X(4.75), 0.02, 6], scale:[3.5,1,3.0], mat:MATS.rug, shadow:false });
    bed(null, X(4.75), 5.4);
    wardrobe(null, X(6.5), 6.2, R(-90));
    chandelier(null, X(4.75), 6, 3.0);
    painting(null, X(4.75), 1.9, 7.9, R(180), hue(3));
    plant(null, X(3.1), 7.4, 0.9);

    /* --- grand homes: foyer seating --- */
    if (cfg.grand) {
      sofa(null, X(-1.4), 5.6, R(0), 1.4, MATS.fabric2);
      sofa(null, X(-3.2), 5.6, R(0), 1.4, MATS.fabric2);
      coffeeTable(null, X(-2.3), 5.4);
      box(null, { pos:[X(-6.85), 0.5, 6.3], scale:[0.4, 1.0, 1.6], mat:MATS.wood });
      painting(null, X(-6.85), 1.7, 6.3, R(90), hue(0));
      if (isCharcoalGold) rectChandelier(null, X(-2.3), 6.4, 3.05);
      else chandelier(null, X(-2.3), 6.4, 3.05);
    }

    /* --- library / bookshelves --- */
    if (cfg.library) {
      const lib = new pc.Entity(); lib.setLocalPosition(X(2.2), 0, -4.6); lib.setEulerAngles(0, R(-90), 0); P().addChild(lib);
      box(lib, { pos:[0, 1.3, 0], scale:[3.0, 2.6, 0.4], mat:MATS.wood });
      for (let r = 0; r < 5; r++) box(lib, { pos:[0, 0.45+r*0.5, 0.16], scale:[2.8, 0.04, 0.06], mat:MATS.woodLight });
      const bc = ["#7a2e2e","#2e4a6a","#3a5a3a","#6a5a2e","#4a2e5a"];
      for (let r = 0; r < 5; r++) for (let b = 0; b < 10; b++)
        box(lib, { pos:[-1.3+b*0.28, 0.7+r*0.5, 0.16], scale:[0.18, 0.34, 0.22], mat:M({ color:hx(bc[(r+b)%5]), gloss:0.3 }) });
    }

    /* --- infinity pool glow (centred, mirror-agnostic) --- */
    if (cfg.pool) infinityPool();

    /* --- glass atrium overhead (centred, mirror-agnostic) --- */
    if (cfg.atrium) glassAtrium(H);

    /* --- farmhouse exposed beams --- */
    if (cfg.farmhouse) farmhouseBeams(H);

    /* --- cedar screens --- */
    if (cfg.cedar) {
      cedarScreens(null, X(-5.5), -5.5, R(0));
      cedarScreens(null, X(5.5), -5.5, R(0));
    }

    /* --- room zone labels from config (x mirrored, normalised so x1<x2) --- */
    const rl = cfg.roomLabels || ["Master Bedroom","Open Kitchen","Dining Area","Formal Living","Entrance Foyer"];
    const zone = (name, ax1, z1, ax2, z2) => {
      const mx1 = X(ax1), mx2 = X(ax2);
      return { name, x1: Math.min(mx1, mx2), x2: Math.max(mx1, mx2), z1, z2 };
    };
    state.rooms = [
      zone(rl[0], 2.5, 4,  7,   8),
      zone(rl[1], -7,  -6, 0,   -2.2),
      zone(rl[2], 1,   -2, 7,   3.8),
      zone(rl[3], -7,  -2, 0.8, 5),
      zone(rl[4], -7,  5,  2.4, 8)
    ];
  }

  /* ---------- lighting ---------- */
  function buildLights() {
    app.scene.ambientLight = new pc.Color(0.42, 0.39, 0.35);
    if (app.scene.fog) { app.scene.fog = pc.FOG_NONE; }
    const sun = new pc.Entity();
    sun.addComponent("light", {
      type: "directional", color: new pc.Color(1, 0.88, 0.66), intensity: 1.3,
      castShadows: true, shadowResolution: 2048, shadowBias: 0.04, normalOffsetBias: 0.06,
      shadowDistance: 30, shadowType: pc.SHADOW_PCF3
    });
    sun.setEulerAngles(52, -125, 0);
    P().addChild(sun);
    const spots = [[-3, 2], [4.2, 1], [-3, -4], [4.75, 6], [-3, 6.5], [0, 7]];
    for (const [x, z] of spots) {
      const o = new pc.Entity();
      o.addComponent("light", { type: "omni", color: new pc.Color(1, 0.87, 0.64), intensity: 0.85, range: 8 });
      o.setLocalPosition(x, 2.9, z);
      P().addChild(o);
    }
  }

  /* ---------- collision (only walls on the current floor) ---------- */
  function collide(nx, nz) {
    const r = 0.34;
    let px = nx, pz = nz;
    const S = state.stair || STAIR_BASE;
    const onStair = px > S.x0 && px < S.x1 && pz < S.zBot + 0.2 && pz > S.zTop - 0.2;
    for (const w of state.walls) {
      if (w.lvl !== 2 && w.lvl !== state.level) continue;
      // let the player pass freely through the stairwell footprint while climbing
      if (onStair && w.lvl === 1) continue;
      const dx = w.x2 - w.x1, dz = w.z2 - w.z1;
      const l2 = dx * dx + dz * dz || 1;
      let t = ((px - w.x1) * dx + (pz - w.z1) * dz) / l2;
      t = Math.max(0, Math.min(1, t));
      const cx = w.x1 + t * dx, cz = w.z1 + t * dz;
      const ddx = px - cx, ddz = pz - cz, d = Math.hypot(ddx, ddz);
      if (d < r && d > 1e-4) { px += (ddx / d) * (r - d); pz += (ddz / d) * (r - d); }
    }
    return [px, pz];
  }
  function roomAt(x, z) {
    if (state.level === 1) {
      const u = state.upRooms || ["Upstairs Suite", "Family Bedroom", "Upper Landing"];
      if (z > 4.2) return u[2];
      // west suite is u[0]; under a mirrored plan it lives on the +x side
      const west = state.mirror ? x > 0 : x < 0;
      return west ? u[0] : u[1];
    }
    for (const r of state.rooms)
      if (x >= r.x1 && x <= r.x2 && z >= r.z1 && z <= r.z2) return r.name;
    return "Show Home";
  }

  /* ---------- input ---------- */
  function bindInput() {
    window.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("is-open")) return;
      state.keys[e.code] = true;
      if (e.code === "ShiftLeft") state.run = true;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault();
    });
    window.addEventListener("keyup", (e) => {
      state.keys[e.code] = false;
      if (e.code === "ShiftLeft") state.run = false;
    });
    // desktop pointer-lock look
    canvas.addEventListener("click", () => {
      if (!isTouch()) canvas.requestPointerLock && canvas.requestPointerLock();
    });
    document.addEventListener("mousemove", (e) => {
      if (document.pointerLockElement === canvas) {
        state.yaw -= e.movementX * 0.12;
        state.pitch = Math.max(-80, Math.min(80, state.pitch - e.movementY * 0.12));
      }
    });
    // touch: left third = joystick, rest = look
    canvas.addEventListener("touchstart", (e) => {
      for (const t of e.changedTouches) {
        if (t.clientX < window.innerWidth * 0.4 && state.moveTouchId === null) {
          state.moveTouchId = t.identifier;
          state.joyOrigin = { x: t.clientX, y: t.clientY };
          joyBase.style.display = "block";
          joyBase.style.left = t.clientX + "px"; joyBase.style.top = t.clientY + "px";
        } else if (state.lookTouchId === null) {
          state.lookTouchId = t.identifier; state.lookStart = { x: t.clientX, y: t.clientY };
        }
      }
    }, { passive: true });
    canvas.addEventListener("touchmove", (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === state.moveTouchId) {
          const dx = t.clientX - state.joyOrigin.x, dy = t.clientY - state.joyOrigin.y;
          const max = 55, d = Math.min(max, Math.hypot(dx, dy)) || 0;
          const a = Math.atan2(dy, dx);
          state.moveVec.x = Math.cos(a) * (d / max);
          state.moveVec.y = Math.sin(a) * (d / max);
          joyKnob.style.transform = `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px)`;
        } else if (t.identifier === state.lookTouchId) {
          state.yaw -= (t.clientX - state.lookStart.x) * 0.25;
          state.pitch = Math.max(-80, Math.min(80, state.pitch - (t.clientY - state.lookStart.y) * 0.25));
          state.lookStart = { x: t.clientX, y: t.clientY };
        }
      }
    }, { passive: true });
    const endTouch = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === state.moveTouchId) {
          state.moveTouchId = null; state.moveVec.x = state.moveVec.y = 0;
          joyBase.style.display = "none"; joyKnob.style.transform = "translate(0,0)";
        }
        if (t.identifier === state.lookTouchId) state.lookTouchId = null;
      }
    };
    canvas.addEventListener("touchend", endTouch);
    canvas.addEventListener("touchcancel", endTouch);
  }
  const isTouch = () => window.matchMedia("(hover: none)").matches;

  /* ---------- update loop ---------- */
  function tick(dt) {
    if (!state.pos) return;
    const k = state.keys;
    let f = 0, s = 0;
    if (k.KeyW || k.ArrowUp) f += 1;
    if (k.KeyS || k.ArrowDown) f -= 1;
    if (k.KeyD || k.ArrowRight) s += 1;
    if (k.KeyA || k.ArrowLeft) s -= 1;
    if (state.moveTouchId !== null) { f -= state.moveVec.y; s += state.moveVec.x; }
    const speed = (state.run ? 5.2 : 2.7) * dt;
    const yr = state.yaw * Math.PI / 180;
    const sin = Math.sin(yr), cos = Math.cos(yr);
    // forward is -Z in PlayCanvas
    let mx = (-sin * f + cos * s);
    let mz = (-cos * f - sin * s);
    const ml = Math.hypot(mx, mz);
    if (ml > 1) { mx /= ml; mz /= ml; }
    const p = state.pos;
    const [cx, cz] = collide(p.x + mx * speed, p.z + mz * speed);
    p.x = Math.max(-6.6, Math.min(6.6, cx));
    p.z = Math.max(-5.6, Math.min(7.6, cz));

    // ---- vertical: climb the staircase, switch floors at top/bottom ----
    const H = 3.2, EYE = 1.65;
    const S = state.stair || STAIR_BASE;
    const onStair = p.x > S.x0 && p.x < S.x1 && p.z < S.zBot && p.z > S.zTop;
    let floorY;
    if (onStair) {
      const climb = Math.max(0, Math.min(1, (S.zBot - p.z) / (S.zBot - S.zTop)));
      floorY = climb * H;
      if (climb > 0.9) state.level = 1;
      else if (climb < 0.1) state.level = 0;
    } else {
      floorY = state.level * H;
    }
    // ease the eye height so steps feel smooth rather than jittery
    const targetEye = floorY + EYE;
    state.eyeY = state.eyeY == null ? targetEye : state.eyeY + (targetEye - state.eyeY) * Math.min(1, dt * 12);
    camRoot.setLocalPosition(p.x, state.eyeY, p.z);
    camRoot.setLocalEulerAngles(state.pitch, state.yaw, 0);
    const rn = onStair ? "Staircase" : roomAt(p.x, p.z);
    if (rn !== state.curRoom) { state.curRoom = rn; roomLabel.textContent = rn; }
  }

  /* ---------- lifecycle ---------- */
  function ensureApp() {
    if (app) return;
    app = new pc.Application(canvas, {
      mouse: new pc.Mouse(canvas),
      touch: new pc.TouchDevice(canvas),
      keyboard: new pc.Keyboard(window)
    });
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    app.graphicsDevice.maxPixelRatio = Math.min(window.devicePixelRatio, 2);
    camRoot = new pc.Entity("camRoot");
    cam = new pc.Entity("cam");
    cam.addComponent("camera", { fov: 70, clearColor: new pc.Color(0.04, 0.05, 0.08), nearClip: 0.05, farClip: 60 });
    if (cam.camera.toneMapping !== undefined) cam.camera.toneMapping = pc.TONEMAP_ACES;
    if (cam.camera.gammaCorrection !== undefined) cam.camera.gammaCorrection = pc.GAMMA_SRGB;
    camRoot.addChild(cam);
    app.root.addChild(camRoot);
    bindInput();
    app.on("update", tick);
    app.start();
    window.addEventListener("resize", () => app.resizeCanvas());
  }

  // (re)build the furnished interior for a given config; cheap, cached by key
  function rebuild(cfg) {
    const labels = (cfg.roomLabels || []).join(",") + "/" + (cfg.upRoomLabels || []).join(",");
    const key = `${cfg.theme}|${cfg.grand?1:0}|${cfg.library?1:0}|${cfg.cinema?1:0}|${cfg.pool?1:0}|${cfg.atrium?1:0}|${cfg.farmhouse?1:0}|${cfg.cedar?1:0}|${cfg.terrazzo?1:0}|${cfg.mirror?1:0}|${labels}`;
    if (key === curCfgKey && world) return;
    curCfgKey = key;
    curTheme = THEMES[cfg.theme] || THEMES.charcoalCream;
    if (world) world.destroy();
    world = new pc.Entity("world");
    app.root.addChild(world);
    state.walls = [];
    buildLights();
    buildHouse(cfg);
  }

  function resolveCfg(arg) {
    if (arg && typeof arg === "object") return arg;
    return { theme: "charcoalCream", grand: true, rooms: "Foyer · Living · Dining · Kitchen · Master Suite", name: "Designer Show-Home" };
  }

  async function open(arg) {
    const cfg = resolveCfg(arg);
    overlay.classList.add("is-open");
    document.documentElement.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
    loader.style.display = "flex";
    // title + subtitle in the tour bar
    if (titleEl) titleEl.textContent = cfg.name || "Virtual Show-Home";
    if (subEl) subEl.textContent = cfg.rooms || (cfg.roomLabels ? cfg.roomLabels.join(" · ") : "");
    try {
      await loadEngine();
      ensureApp();
      rebuild(cfg);
      // reset spawn at the foyer looking into the house (toward -Z)
      const sp = state.spawn || { x: -1.5, z: 7.0, yaw: 0, pitch: -4 };
      state.pos = { x: sp.x, y: 1.65, z: sp.z };
      state.yaw = sp.yaw; state.pitch = sp.pitch;
      state.level = 0; state.eyeY = null;
      state.curRoom = ""; roomLabel.textContent = (cfg.roomLabels && cfg.roomLabels[4]) || "Entrance Foyer";
      app.resizeCanvas();
      loader.style.display = "none";
    } catch (e) {
      loader.innerHTML = "<p>3D engine couldn't load on this connection.<br>Please try again on Wi-Fi.</p>";
    }
  }
  // open by sold-property index / hot-deal index (from main.js)
  function openProperty(i, name) { return open(Object.assign({ name }, SOLD_CFG[i] || {})); }
  function openDeal(i, name) { return open(Object.assign({ name }, DEAL_CFG[i] || {})); }
  function close() {
    overlay.classList.remove("is-open");
    document.documentElement.style.overflow = "";
    if (document.pointerLockElement) document.exitPointerLock();
    if (window.__lenis) window.__lenis.start();
  }

  document.getElementById("tourClose").addEventListener("click", close);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlay.classList.contains("is-open")) close(); });

  window.HouseTour = { open, openProperty, openDeal, close };
})();

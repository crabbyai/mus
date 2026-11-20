/* ============================================================
   Scorpion Street 3D: Night of the Blood Moon.
   Play the scorpion against the Cancer crab under a starry sky with
   constellations and a full moon that sometimes turns blood red (a
   werewolf rises and the wolves howl). Every sting rains cash from the
   moon onto the crab; whenever its health runs out it's "Nice try":
   the crab grows stronger and richer, its money stacks rise and its
   mansion grows, every round. Three.js r160 (vendored), bloom glow.
   ============================================================ */
import * as THREE from "three";
import { EffectComposer } from "../js/vendor/three/postprocessing/EffectComposer.js";
import { RenderPass } from "../js/vendor/three/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "../js/vendor/three/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "../js/vendor/three/postprocessing/ShaderPass.js";

const TX = {
  en: { justice: "JUSTICE", miss: "MISS", sliced: "Sliced! 🔪", knives: "Twin knives fall for the crab 🔪🔪", push: "✨ Crab magic: pushed away!", pull: "✨ Crab magic: pulled in!", sur: "“And the Trumpet will be blown…” (39:68)", moon: "“The Hour has drawn near, and the moon has split.” (54:1)", round: "Round", hp: "Crab", wealth: "Crab's wealth", mansion: "Mansion", start: "Tap or press a key to play", nice: "Nice try 😏", niceSub: "The crab grows stronger and richer, and the mansion grows.", hit: "Sting!", back: "The crab hits back!", blood: "Blood moon 🐺 Awoooo…", sound: "Sound", sting: "Sting", lvl: "Level", lh: "لا حول ولا قوة إلا بالله" },
  ur: { justice: 'انصاف', miss: 'MISS', sliced: 'کٹ گیا! 🔪', knives: 'کیکڑے کے لیے دو چاقو گرے 🔪🔪', push: '✨ کیکڑے کا جادو: دور دھکیل دیا!', pull: '✨ کیکڑے کا جادو: کھینچ لیا!', sur: '”اور صور پھونکا جائے گا…“ (39:68)', moon: '”قیامت قریب آ گئی اور چاند پھٹ گیا۔“ (54:1)', round: "راؤنڈ", hp: "کیکڑا", wealth: "کیکڑے کی دولت", mansion: "محل", start: "کھیلنے کے لیے ٹیپ کریں یا کوئی بٹن دبائیں", nice: "اچھی کوشش 😏", niceSub: "کیکڑا مزید طاقتور اور امیر ہو گیا، اور محل بڑا ہو گیا۔", hit: "ڈنک!", back: "کیکڑے نے جوابی وار کیا!", blood: "خونی چاند 🐺 آؤووو…", sound: "آواز", sting: "ڈنک", lvl: "لیول", lh: "لا حول ولا قوۃ الا باللہ" },
  ar: { justice: 'عدالة', miss: 'MISS', sliced: 'تقطّع! 🔪', knives: 'سكينان يسقطان للسلطعون 🔪🔪', push: '✨ سحر السلطعون: دُفع بعيدًا!', pull: '✨ سحر السلطعون: سُحب إليه!', sur: '«ونُفخ في الصور…» (39:68)', moon: '«اقتربت الساعة وانشق القمر» (54:1)', round: "الجولة", hp: "السلطعون", wealth: "ثروة السلطعون", mansion: "القصر", start: "اضغط أو اضغط زرًا لتلعب", nice: "محاولة جيدة 😏", niceSub: "السلطعون يزداد قوة وثراء، والقصر يكبر.", hit: "لسعة!", back: "السلطعون يردّ الضربة!", blood: "قمر دموي 🐺 أووو…", sound: "الصوت", sting: "لسعة", lvl: "المستوى", lh: "لا حول ولا قوة إلا بالله" },
  fr: { justice: 'JUSTICE', miss: 'RATÉ', sliced: 'Tranché ! 🔪', knives: 'Deux couteaux tombent pour le crabe 🔪🔪', push: '✨ Magie du crabe : repoussé !', pull: '✨ Magie du crabe : attiré !', sur: '« Et l’on soufflera dans la Trompe… » (39:68)', moon: '« L’Heure approche et la lune s’est fendue. » (54:1)', round: "Manche", hp: "Crabe", wealth: "Fortune du crabe", mansion: "Manoir", start: "Touchez ou appuyez sur une touche pour jouer", nice: "Bien essayé 😏", niceSub: "Le crabe devient plus fort et plus riche, et le manoir grandit.", hit: "Piqûre !", back: "Le crabe riposte !", blood: "Lune de sang 🐺 Aouuu…", sound: "Son", sting: "Piquer", lvl: "Niveau", lh: "لا حول ولا قوة إلا بالله" },
  es: { justice: 'JUSTICIA', miss: 'FALLO', sliced: '¡Rebanado! 🔪', knives: 'Dos cuchillos caen para el cangrejo 🔪🔪', push: '✨ Magia del cangrejo: ¡empujado!', pull: '✨ Magia del cangrejo: ¡atraído!', sur: '«Y se soplará la Trompeta…» (39:68)', moon: '«Se acercó la Hora y se partió la luna.» (54:1)', round: "Ronda", hp: "Cangrejo", wealth: "Fortuna del cangrejo", mansion: "Mansión", start: "Toca o pulsa una tecla para jugar", nice: "Buen intento 😏", niceSub: "El cangrejo se vuelve más fuerte y más rico, y la mansión crece.", hit: "¡Picadura!", back: "¡El cangrejo contraataca!", blood: "Luna de sangre 🐺 Auuuu…", sound: "Sonido", sting: "Picar", lvl: "Nivel", lh: "لا حول ولا قوة إلا بالله" },
  ja: { justice: '正義', miss: 'MISS', sliced: '斬られた！🔪', knives: 'カニのもとに2本のナイフが落ちてきた 🔪🔪', push: '✨ カニの魔法：吹き飛ばされた！', pull: '✨ カニの魔法：引き寄せられた！', sur: '「そしてラッパが吹かれる…」（39:68）', moon: '「時は近づき、月は裂けた。」（54:1）', round: "ラウンド", hp: "カニ", wealth: "カニの財産", mansion: "豪邸", start: "タップかキーでスタート", nice: "惜しい 😏", niceSub: "カニはさらに強く豊かになり、豪邸も大きくなった。", hit: "刺した！", back: "カニの反撃！", blood: "血の月 🐺 アオーン…", sound: "サウンド", sting: "刺す", lvl: "レベル", lh: "لا حول ولا قوة إلا بالله" },
  zh: { justice: '公正', miss: 'MISS', sliced: '被砍了！🔪', knives: '两把刀为螃蟹落下 🔪🔪', push: '✨ 螃蟹魔法：被推开了！', pull: '✨ 螃蟹魔法：被拉过去了！', sur: '“号角将被吹响……”（39:68）', moon: '“复活时已临近了，月亮已破裂了。”（54:1）', round: "回合", hp: "螃蟹", wealth: "螃蟹的财富", mansion: "豪宅", start: "点击或按任意键开始", nice: "不错的尝试 😏", niceSub: "螃蟹变得更强更富，豪宅也更大了。", hit: "蜇中！", back: "螃蟹反击了！", blood: "血月 🐺 嗷呜…", sound: "声音", sting: "蜇", lvl: "等级", lh: "لا حول ولا قوة إلا بالله" },
  ko: { justice: '정의', miss: 'MISS', sliced: '베였다! 🔪', knives: '게를 위해 쌍칼이 떨어진다 🔪🔪', push: '✨ 게의 마법: 밀려났다!', pull: '✨ 게의 마법: 끌려갔다!', sur: '“나팔이 불리리라…” (39:68)', moon: '“그 시간이 다가왔고 달이 갈라졌다.” (54:1)', round: "라운드", hp: "게", wealth: "게의 재산", mansion: "저택", start: "탭하거나 키를 눌러 시작", nice: "좋은 시도였어요 😏", niceSub: "게는 더 강하고 부유해졌고, 저택도 커졌습니다.", hit: "쏘기!", back: "게의 반격!", blood: "블러드 문 🐺 아우우…", sound: "소리", sting: "쏘기", lvl: "레벨", lh: "لا حول ولا قوة إلا بالله" }
};

export function start(root) {
  const tx = () => TX[(document.documentElement.lang || "en").slice(0, 2)] || TX.en;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = root.querySelector("canvas");
  const hud = {
    round: root.querySelector("[data-g='round']"), hp: root.querySelector("[data-g='hp'] i"), wealth: root.querySelector("[data-g='wealth']"),
    mansion: root.querySelector("[data-g='mansion']"), msg: root.querySelector("[data-g='msg']"), cap: root.querySelector("[data-g='cap']")
  };

  /* ---------- renderer ---------- */
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" }); }
  catch (e) { root.classList.add("g3--nogl"); return; }
  const small = innerWidth < 700;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;   // tone mapping happens in the final pass

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060914, 0.0065);
  const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 1200);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.5, 0.86);
  { const m = bloom.materialHighPassFilter;
    if (m && !/float luminance\(/.test(m.fragmentShader)) { m.fragmentShader = "float luminance(vec3 rgb){ return dot(rgb, vec3(0.2126729, 0.7151522, 0.0721750)); }\n" + m.fragmentShader; m.needsUpdate = true; } }
  composer.addPass(bloom);
  // Final pass: filmic tone mapping and sRGB output (version-independent replacement for OutputPass)
  composer.addPass(new ShaderPass({
    uniforms: { tDiffuse: { value: null }, exposure: { value: 1.08 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: "uniform sampler2D tDiffuse; uniform float exposure; varying vec2 vUv;" +
      "vec3 aces(vec3 x){ x *= 0.6; return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }" +
      "vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(c, vec3(1.0/2.4))-0.055, step(vec3(0.0031308), c)); }" +
      "void main(){ vec4 c = texture2D(tDiffuse, vUv); gl_FragColor = vec4(toSRGB(aces(c.rgb*exposure)), 1.0); }"
  }));

  /* ---------- sky dome ---------- */
  const skyU = { top: { value: new THREE.Color(0x02040c) }, mid: { value: new THREE.Color(0x0b1433) }, bot: { value: new THREE.Color(0x1d1a3a) }, blood: { value: 0 } };
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(600, 48, 24), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, uniforms: skyU, fog: false,
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: "uniform vec3 top,mid,bot; uniform float blood; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h>0.12 ? mix(mid,top,smoothstep(0.12,0.7,h)) : mix(bot,mid,smoothstep(-0.05,0.12,h)); c = mix(c, c*vec3(1.7,0.45,0.4)+vec3(0.06,0.0,0.0), blood*0.75); gl_FragColor = vec4(c,1.0); }"
  })));

  /* ---------- stars (twinkling) ---------- */
  const SKY_R = 560, N_STARS = small ? 1600 : 2600;
  const sp = new Float32Array(N_STARS * 3), ph = new Float32Array(N_STARS), sz = new Float32Array(N_STARS);
  for (let i = 0; i < N_STARS; i++) {
    const u = Math.random(), v = Math.random() * 0.98 + 0.02;      // upper hemisphere and a bit below
    const az = u * Math.PI * 2, el = Math.asin(v * 1.02 - 0.02);
    sp.set([SKY_R * Math.sin(az) * Math.cos(el), SKY_R * Math.sin(el), -SKY_R * Math.cos(az) * Math.cos(el)], i * 3);
    ph[i] = Math.random() * 6.28; sz[i] = Math.random() < 0.06 ? 3.2 + Math.random() * 2 : 1.2 + Math.random() * 1.6;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  starGeo.setAttribute("phase", new THREE.BufferAttribute(ph, 1));
  starGeo.setAttribute("size", new THREE.BufferAttribute(sz, 1));
  const starU = { t: { value: 0 }, pr: { value: renderer.getPixelRatio() } };
  scene.add(new THREE.Points(starGeo, new THREE.ShaderMaterial({
    uniforms: starU, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending,
    vertexShader: "attribute float phase; attribute float size; uniform float t; uniform float pr; varying float vA; void main(){ vA = 0.55+0.45*sin(t*1.7+phase*3.0); gl_PointSize = size*pr*(0.8+0.4*vA); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: "varying float vA; void main(){ vec2 d = gl_PointCoord-0.5; float r = length(d); if(r>0.5) discard; float a = smoothstep(0.5,0.0,r); gl_FragColor = vec4(vec3(1.0,0.96,0.86)*a*vA*1.4, a*vA); }"
  })));

  /* ---------- constellations ---------- */
  const CONST = {
    Scorpius: { az: -18, el: 12, s: 1.7, pts: [[-6, 6], [-4.6, 7.2], [-3, 6.4], [-1.2, 4.6], [0, 3], [1, 1], [2, -1], [2.6, -3], [2.2, -5], [0.8, -6.6], [-0.8, -7], [-2.2, -6.2], [-2.7, -4.8]], lines: [[0, 3], [1, 3], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12]] },
    Cancer: { az: 26, el: 26, s: 1.6, pts: [[0, 0], [0.4, 3.4], [-2.6, -2.2], [2.4, -2.6], [3.6, -4.2]], lines: [[0, 1], [0, 2], [0, 3], [3, 4]] },
    Orion: { az: 62, el: 20, s: 1.5, pts: [[-3, 5], [3, 5.4], [-1.2, 0.4], [0, 0], [1.2, -0.4], [-2.6, -5], [2.8, -5.2], [0, 6.6]], lines: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [0, 7], [1, 7]] },
    "Ursa Major": { az: -62, el: 34, s: 1.6, pts: [[-6, 1], [-4, 1.6], [-2, 1.2], [0, 0.4], [0.4, -1.8], [2.8, -2.2], [3, 0]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]] },
    Cassiopeia: { az: -100, el: 46, s: 1.6, pts: [[-4, 0], [-2, -2], [0, 0.4], [2, -2.2], [4, 0.2]], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] }
  };
  const toSky = (azDeg, elDeg, r) => { const az = azDeg * Math.PI / 180, el = elDeg * Math.PI / 180; return new THREE.Vector3(r * Math.sin(az) * Math.cos(el), r * Math.sin(el), -r * Math.cos(az) * Math.cos(el)); };
  function label(text, color) {
    const c = document.createElement("canvas"); c.width = 256; c.height = 64; const g = c.getContext("2d");
    g.font = "italic 30px Georgia, serif"; g.fillStyle = color; g.textAlign = "center"; g.fillText(text, 128, 42);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, fog: false, opacity: 0.75 }));
    s.scale.set(26, 6.5, 1); return s;
  }
  const constLines = [];
  Object.entries(CONST).forEach(([name, c]) => {
    const pts = c.pts.map(p => toSky(c.az + p[0] * c.s, c.el + p[1] * c.s, 520));
    const lg = new THREE.BufferGeometry().setFromPoints(c.lines.flatMap(([a, b]) => [pts[a], pts[b]]));
    const lm = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0xe8c87e, transparent: true, opacity: 0.32, fog: false }));
    scene.add(lm); constLines.push(lm.material);
    const bg = new THREE.BufferGeometry().setFromPoints(pts);
    scene.add(new THREE.Points(bg, new THREE.PointsMaterial({ color: 0xfff1cc, size: 3.4, sizeAttenuation: false, fog: false })));
    const l = label(name, "#e8c87e"); l.position.copy(toSky(c.az, c.el - 9 * c.s / 1.6, 515)); scene.add(l);
  });

  /* ---------- moon ---------- */
  const moonPos = toSky(6, 13, 300);
  const moonMat = new THREE.MeshBasicMaterial({ color: 0xfff4d6, fog: false });
  const moon = new THREE.Mesh(new THREE.SphereGeometry(15, 48, 32), moonMat); moon.position.copy(moonPos); scene.add(moon);
  // craters
  for (let i = 0; i < 9; i++) {
    const cr = new THREE.Mesh(new THREE.CircleGeometry(1.2 + Math.random() * 2.6, 24), new THREE.MeshBasicMaterial({ color: 0xd9ccaa, transparent: true, opacity: 0.55, fog: false }));
    const a = Math.random() * 6.28, r = Math.random() * 10;
    cr.position.set(moonPos.x + Math.cos(a) * r, moonPos.y + Math.sin(a) * r, moonPos.z + 15.2); cr.lookAt(camera.position.x, moonPos.y, 0); scene.add(cr); cr.userData.moon = true;
  }
  function glowTex(inner, outer) {
    const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d");
    const gr = g.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, inner); gr.addColorStop(1, outer);
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c);
  }
  const moonGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(255,240,200,0.55)", "rgba(255,240,200,0)"), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
  moonGlow.scale.set(120, 120, 1); moonGlow.position.copy(moonPos); scene.add(moonGlow);
  const moonLight = new THREE.DirectionalLight(0xbfd2ff, 1.25); moonLight.position.copy(moonPos); scene.add(moonLight);
  scene.add(new THREE.HemisphereLight(0x5a6aa8, 0x1a120a, 0.8));
  const key = new THREE.DirectionalLight(0xffdcb0, 1.6); key.position.set(14, 20, 30); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fb8ff, 0.6); rim.position.set(-20, 10, -10); scene.add(rim);

  /* ---------- ground, road, hills ---------- */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshStandardMaterial({ color: 0x241a12, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; scene.add(ground);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(12, 140), new THREE.MeshStandardMaterial({ color: 0x23262f, roughness: 0.9 }));
  road.rotation.x = -Math.PI / 2; road.position.set(0, 0.01, -30); scene.add(road);
  const dashMat = new THREE.MeshBasicMaterial({ color: 0xe8c87e }), dashes = [];
  for (let z = 30; z > -95; z -= 4) { const d = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 1.8), dashMat); d.rotation.x = -Math.PI / 2; d.position.set(0, 0.02, z); scene.add(d); dashes.push(d); }
  [-6.2, 6.2].forEach(x => { const e = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 140), new THREE.MeshBasicMaterial({ color: 0x8b93a7 })); e.rotation.x = -Math.PI / 2; e.position.set(x, 0.02, -30); scene.add(e); });
  // street sign
  const signC = document.createElement("canvas"); signC.width = 512; signC.height = 160; { const g = signC.getContext("2d"); g.fillStyle = "#0f6b3a"; g.fillRect(0, 0, 512, 160); g.strokeStyle = "#fff"; g.lineWidth = 10; g.strokeRect(8, 8, 496, 144); g.fillStyle = "#fff"; g.font = "bold 64px system-ui, sans-serif"; g.textAlign = "center"; g.fillText("SCORPION ST.", 256, 104); }
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.56), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signC) }));
  sign.position.set(-8.4, 4.4, 10); sign.rotation.y = 0.35; scene.add(sign);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.4), new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.6 })); pole.position.set(-8.4, 2.2, 10); scene.add(pole);
  const hillMat = new THREE.MeshStandardMaterial({ color: 0x0b0c14, roughness: 1 });
  const hills = [[-70, -150, 28, 14], [-20, -175, 40, 18], [40, -160, 34, 15], [95, -150, 30, 13], [-120, -140, 26, 11], [46, -112, 15, 9]];
  hills.forEach(([x, z, r, h]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), hillMat); m.scale.y = h / r; m.position.set(x, 0, z); scene.add(m); });

  /* ---------- werewolf and wolves (silhouettes) ---------- */
  function wolfShape() {
    const p = [[0, 0], [1.6, 0], [1.5, 0.8], [1.25, 1.7], [0.95, 2.6], [1.05, 3.05], [1.2, 3.55], [1.12, 3.92], [1.28, 4.35], [1.0, 4.02], [0.96, 4.4], [0.8, 3.98], [0.52, 4.18], [0.2, 4.62], [0.3, 4.24], [0.6, 3.62], [0.5, 3.0], [0.62, 2.0], [0.72, 0]];
    const s = new THREE.Shape(); s.moveTo(p[0][0] - 0.8, p[0][1]); p.slice(1).forEach(q => s.lineTo(q[0] - 0.8, q[1])); s.closePath(); return new THREE.ShapeGeometry(s);
  }
  const wolfGeo = wolfShape(), wolfMat = new THREE.MeshBasicMaterial({ color: 0x000000, fog: false, side: THREE.DoubleSide });
  const were = new THREE.Mesh(wolfGeo, wolfMat); were.scale.set(-3.4, 3.4, 3.4); were.position.set(46, -4, -110); scene.add(were);
  const wolves = [[-70, 14, -149, -1], [40, 15, -159, 1], [-20, 18, -174, 1]].map(([x, y, z, f]) => { const w = new THREE.Mesh(wolfGeo, wolfMat); w.scale.set(1.6 * f, 1.6, 1.6); w.position.set(x, y - 6, z + 2); w.userData.y = y; scene.add(w); return w; });

  /* ---------- mansion ---------- */
  const mansion = new THREE.Group(); scene.add(mansion);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xe9e1cf, roughness: 0.7 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x2b2f3d, roughness: 0.6, metalness: 0.2 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xe8c87e, metalness: 1, roughness: 0.25, emissive: 0x3a2a08 });
  const winMat = new THREE.MeshBasicMaterial({ color: 0xffd27a });
  function block(w, h, d, x, y, z) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat); m.position.set(x, y + h / 2, z); mansion.add(m); return m; }
  function windows(w, h, x, y, z, floors, cols) {
    for (let f = 0; f < floors; f++) for (let c = 0; c < cols; c++) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.0), winMat);
      win.position.set(x - w / 2 + (c + 0.5) * (w / cols), y + 1.1 + f * (h / floors), z + 0.02); mansion.add(win);
    }
  }
  function buildMansion(level) {
    while (mansion.children.length) { const c = mansion.children.pop(); c.geometry && c.geometry.dispose(); }
    const s = 1 + level * 0.32, floors = 2 + level, H = floors * 2.4, W = 16 * s, D = 8 * s;
    block(W, H, D, 0, 0, 0); windows(W, H, 0, 0, D / 2, floors, Math.round(6 * s));
    const roof = new THREE.Mesh(new THREE.ConeGeometry(W * 0.62, 3 + level, 4), roofMat); roof.rotation.y = Math.PI / 4; roof.scale.z = D / W * 1.4; roof.position.y = H + (3 + level) / 2; mansion.add(roof);
    for (let i = 0; i < 6; i++) { const col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, H * 0.6, 12), wallMat); col.position.set(-W * 0.3 + i * W * 0.12, H * 0.3, D / 2 + 1.2); mansion.add(col); }
    const porch = new THREE.Mesh(new THREE.BoxGeometry(W * 0.75, 0.5, 1.4), roofMat); porch.position.set(0, H * 0.6 + 0.25, D / 2 + 1.2); mansion.add(porch);
    if (level >= 1) [-1, 1].forEach(side => { const ww = W * 0.45, hh = H * 0.7; block(ww, hh, D * 0.8, side * (W / 2 + ww / 2), 0, -D * 0.05); windows(ww, hh, side * (W / 2 + ww / 2), 0, D * 0.35, floors - 1, Math.round(3 * s)); });
    if (level >= 2) [-1, 1].forEach(side => { const t = new THREE.Mesh(new THREE.CylinderGeometry(1.6 * s, 1.8 * s, H * 1.25, 16), wallMat); t.position.set(side * (W / 2 + W * 0.45), H * 0.62, D * 0.2); mansion.add(t); const cap = new THREE.Mesh(new THREE.ConeGeometry(2 * s, 3.2 * s, 16), roofMat); cap.position.set(t.position.x, H * 1.25 + 1.6 * s, t.position.z); mansion.add(cap); });
    if (level >= 3) { const dome = new THREE.Mesh(new THREE.SphereGeometry(3.4 * s, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), goldMat); dome.position.y = H + (3 + level) * 0.55; mansion.add(dome); }
    if (level >= 4) { const sign = new THREE.Mesh(new THREE.BoxGeometry(W * 0.5, 1.4, 0.2), goldMat); sign.position.set(0, H + 0.9, D / 2 + 0.3); mansion.add(sign); }
    // gold cornice, glowing pool and fountain, palm trees, searchlights, neon sign, gold crab statue
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(W + 0.6, 0.35, D + 0.6), goldMat); cornice.position.y = H + 0.17; mansion.add(cornice);
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.55, 3.2), new THREE.MeshBasicMaterial({ color: 0x2fd3ff })); pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.05, D / 2 + 5.2); mansion.add(pool);
    const rimP = new THREE.Mesh(new THREE.BoxGeometry(W * 0.55 + 0.5, 0.2, 3.7), goldMat); rimP.position.set(0, 0.02, D / 2 + 5.2); mansion.add(rimP); pool.position.y = 0.13;
    const fount = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.4, 2.2, 12), goldMat); fount.position.set(0, 1.1, D / 2 + 5.2); mansion.add(fount);
    const spray = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 12), new THREE.MeshBasicMaterial({ color: 0xbff4ff, transparent: true, opacity: 0.55 })); spray.position.set(0, 2.4, D / 2 + 5.2); mansion.add(spray); fx.spray = spray;
    [-1, 1].forEach(side => {
      const px = side * (W / 2 + (level >= 1 ? W * 0.45 : 0) + 2.5), pz = D / 2 + 3;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.35, 7 + level, 10), new THREE.MeshStandardMaterial({ color: 0x6b4a2a, roughness: 0.9 })); trunk.position.set(px, (7 + level) / 2, pz); trunk.rotation.z = side * 0.08; mansion.add(trunk);
      for (let i = 0; i < 7; i++) { const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.5, 4, 6), new THREE.MeshStandardMaterial({ color: 0x1f7a3a, roughness: 0.7 })); const a = i / 7 * 6.28; leaf.position.set(px + Math.cos(a) * 1.6, 7 + level + 0.2, pz + Math.sin(a) * 1.6); leaf.rotation.set(Math.sin(a) * 1.2, 0, -Math.cos(a) * 1.2); mansion.add(leaf); }
    });
    fx.beams = [];
    [-1, 1].forEach(side => { const beam = new THREE.Mesh(new THREE.ConeGeometry(3, 60, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff2c8, transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); beam.geometry.translate(0, -30, 0); beam.position.set(side * W * 0.3, H + 0.5, 0); beam.rotation.x = Math.PI; mansion.add(beam); fx.beams.push({ beam, side }); });
    { const c = document.createElement("canvas"); c.width = 512; c.height = 96; const g = c.getContext("2d"); g.font = "bold 58px system-ui, sans-serif"; g.textAlign = "center"; g.shadowColor = "#ff2fd6"; g.shadowBlur = 24; g.fillStyle = "#ffd6f7"; g.fillText("CRAB MANSION", 256, 66);
      const neon = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.42, W * 0.42 * 96 / 512), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true })); neon.position.set(0, H * 0.6 + 1.3, D / 2 + 1.95); mansion.add(neon); }
    if (level >= 2) { const statue = new THREE.Group(); const sb = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), goldMat); sb.scale.set(1.6, 0.7, 1.2); statue.add(sb); [-1, 1].forEach(sd => { const cl = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 10), goldMat); cl.position.set(sd * 1.7, 0.4, 0.8); statue.add(cl); }); statue.scale.setScalar(0.9 + level * 0.15); statue.position.set(0, H + (3 + level) * 0.55 + (level >= 3 ? 3.4 * s : 1.5), 0); mansion.add(statue); }
    mansion.position.set(0, 0, -30 - level * 3.5);
    const lamp = new THREE.PointLight(0xffc98a, 28 + level * 10, 0, 1.5); lamp.position.set(0, H * 0.6, D / 2 + 9); mansion.add(lamp);
  }

  /* ---------- the crab ---------- */
  const crab = new THREE.Group(); scene.add(crab);
  const shellMat = new THREE.MeshStandardMaterial({ color: 0xd9482b, roughness: 0.38, metalness: 0.25, emissive: 0x2a0500 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x8a2412, roughness: 0.5 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), shellMat); body.scale.set(1.7, 0.75, 1.25); body.position.y = 1.15; crab.add(body);
  const eyes = [];
  [-0.45, 0.45].forEach(x => { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6), dark); st.position.set(x, 1.95, 0.75); crab.add(st); const e = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 })); e.position.set(x, 2.3, 0.78); crab.add(e); eyes.push(e); });
  const legs = [];
  [-1, 1].forEach(side => { for (let i = 0; i < 3; i++) { const g = new THREE.Group(); g.position.set(side * 1.4, 1.0, 0.45 - i * 0.5); const a = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 1.4), dark); a.rotation.z = side * -1.0; a.position.x = side * 0.55; g.add(a); const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.04, 1.3), dark); b2.position.set(side * 1.15, -0.55, 0); b2.rotation.z = side * 0.35; g.add(b2); crab.add(g); legs.push({ g, side, i }); } });
  const claws = [];
  [-1, 1].forEach(side => {
    const g = new THREE.Group(); g.position.set(side * 1.7, 1.35, 1.0);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 1.1), shellMat); arm.rotation.x = Math.PI / 2.6; arm.position.z = 0.4; g.add(arm);
    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 14), shellMat); palm.scale.set(0.9, 0.7, 1.2); palm.position.set(0, 0.25, 1.05); g.add(palm);
    const top = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9, 12), shellMat); top.rotation.x = Math.PI / 2; top.position.set(0, 0.42, 1.75); g.add(top);
    const bot = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.75, 12), shellMat); bot.rotation.x = Math.PI / 2; bot.position.set(0, 0.06, 1.65); g.add(bot);
    const bicep = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 14), shellMat); bicep.scale.set(1, 0.85, 1.35); bicep.position.set(side * 0.05, 0.12, 0.35); g.add(bicep);
    crab.add(g); claws.push({ g, top, bot, side, arm, palm, bicep });
  });
  // battle spikes on the shell (shown as the crab gets stronger)
  const spikes = new THREE.Group(); crab.add(spikes);
  for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.85 + i / 8 * Math.PI * 0.7 + Math.PI / 2; const sp3 = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.5, 8), dark); sp3.position.set(Math.cos(a) * 1.25, 1.72 - Math.abs(i - 4) * 0.05, Math.sin(a) * -0.55 - 0.1); sp3.rotation.x = -0.35; spikes.add(sp3); }
  spikes.visible = false;
  // weapons the crab sometimes pulls out
  const steel = new THREE.MeshStandardMaterial({ color: 0xdfe6ee, metalness: 1, roughness: 0.18 });
  const blackMetal = new THREE.MeshStandardMaterial({ color: 0x1c1e24, metalness: 0.8, roughness: 0.3 });
  const sword = new THREE.Group();
  { const blade = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.4, 0.04), steel); blade.position.y = 1.5; sword.add(blade); const tip = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 4), steel); tip.position.y = 2.87; tip.rotation.y = Math.PI / 4; sword.add(tip);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.14), goldMat); guard.position.y = 0.28; sword.add(guard); const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5), blackMetal); sword.add(grip); const pom = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), goldMat); pom.position.y = -0.28; sword.add(pom); }
  const gun = new THREE.Group();
  { const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 1.0), blackMetal); barrel.position.set(0, 0.25, 0.45); gun.add(barrel); const grip2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.55, 0.26), blackMetal); grip2.rotation.x = -0.25; grip2.position.set(0, -0.05, 0); gun.add(grip2);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 1.02), goldMat); trim.position.set(0, 0.39, 0.45); gun.add(trim); }
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"); const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, "rgba(255,250,210,1)"); gr.addColorStop(0.35, "rgba(255,190,80,.8)"); gr.addColorStop(1, "rgba(255,120,20,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  flash.scale.set(1.4, 1.4, 1); flash.position.set(0, 0.25, 1.1); flash.visible = false; gun.add(flash);
  [sword, gun].forEach(w => { w.visible = false; claws[1].g.add(w); });
  sword.scale.setScalar(1.7); sword.position.set(0.2, 0.7, 1.3); sword.rotation.set(0.25, 0, -0.5);
  gun.scale.setScalar(2.1); gun.position.set(0.35, 1.05, 1.0); gun.rotation.y = -0.55;
  const weap = { kind: null, t: 0, next: 6 + Math.random() * 6, shot: 0 };
  const fxRef = { beams: [] };
  function strength(level) {
    const m = Math.min(level, 6);
    body.scale.set(1.7 + m * 0.12, 0.75 + m * 0.07, 1.25 + m * 0.09);
    claws.forEach(c => { c.palm.scale.set(0.9 + m * 0.16, 0.7 + m * 0.12, 1.2 + m * 0.14); c.arm.scale.set(1 + m * 0.35, 1, 1 + m * 0.35); c.bicep.scale.set(1 + m * 0.3, 0.85 + m * 0.25, 1.35 + m * 0.3); c.bicep.visible = m >= 1; });
    legs.forEach(l => l.g.children.forEach(seg => seg.scale.set(1 + m * 0.3, 1, 1 + m * 0.3)));
    spikes.visible = m >= 2; spikes.scale.setScalar(0.8 + m * 0.12);
    shellMat.color.set(0xd9482b).lerp(new THREE.Color(0x9a1608), Math.min(1, m / 5));
    shellMat.emissive.set(0x2a0500).lerp(new THREE.Color(0x4a0800), Math.min(1, m / 5));
    crown.scale.setScalar(1.2 + Math.min(m, 6) * 0.28); chain.scale.setScalar(1 + m * 0.08);
  }
  const crown = new THREE.Group(); {
    const gemCols = [0xff2244, 0x22ff88, 0x3aa6ff, 0xffffff, 0xb04dff];
    for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28; const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), new THREE.MeshStandardMaterial({ color: gemCols[i % 5], emissive: gemCols[i % 5], emissiveIntensity: 1.4, roughness: 0.1 })); gem.position.set(Math.cos(a) * 0.64, 0.02, Math.sin(a) * 0.64); crown.add(gem); }
    for (let i = 0; i < 7; i++) { const a = (i + 0.5) / 7 * 6.28; const tip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.75, 8), goldMat); tip.position.set(Math.cos(a) * 0.6, 0.5, Math.sin(a) * 0.6); crown.add(tip); const orb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff2c8, emissiveIntensity: 2 })); orb.position.set(Math.cos(a) * 0.6, 0.9, Math.sin(a) * 0.6); crown.add(orb); }
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 10, 0, 6.28, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x8a0f2a, roughness: 0.6 })); cap.position.y = 0.05; crown.add(cap);
    const top = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), new THREE.MeshStandardMaterial({ color: 0xff2244, emissive: 0xff2244, emissiveIntensity: 1.6 })); top.position.y = 0.75; crown.add(top);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(255,215,120,0.9)", "rgba(255,215,120,0)"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); halo.scale.set(3.2, 3.2, 1); halo.position.y = 0.4; crown.add(halo); const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.35, 24, 1, true), goldMat); crown.add(ring); for (let i = 0; i < 7; i++) { const sp2 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 8), goldMat); const a = i / 7 * 6.28; sp2.position.set(Math.cos(a) * 0.6, 0.35, Math.sin(a) * 0.6); crown.add(sp2); } }
  crown.position.set(0, 3.05, 0); crown.visible = false; crab.add(crown);
  const chain = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.09, 12, 48), goldMat); chain.rotation.x = Math.PI / 2.2; chain.position.set(0, 1.25, 0.55); chain.visible = false; crab.add(chain);
  const crabShadow = new THREE.Mesh(new THREE.CircleGeometry(2.2, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 })); crabShadow.rotation.x = -Math.PI / 2; crabShadow.position.y = 0.03; scene.add(crabShadow);

  /* ---------- the scorpion (player) ---------- */
  const scorp = new THREE.Group(); scene.add(scorp);
  const amber = new THREE.MeshStandardMaterial({ color: 0xd08a3a, roughness: 0.3, metalness: 0.35, emissive: 0x3a1c04 });
  const amberDark = new THREE.MeshStandardMaterial({ color: 0x8a5a24, roughness: 0.45 });
  for (let i = 0; i < 4; i++) { const seg = new THREE.Mesh(new THREE.SphereGeometry(0.42 - i * 0.03, 20, 14), amber); seg.scale.set(1, 0.55, 0.8); seg.position.set(0, 0.42, -0.25 + i * 0.42); scorp.add(seg); }
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 14), amber); head.scale.set(1.1, 0.55, 0.9); head.position.set(0, 0.42, -0.62); scorp.add(head);
  const TAILBASE = [0.15, -0.35, -0.45, -0.55, -0.6];   // arches up and over the back
  const tail = []; let prev = scorp;
  for (let i = 0; i < 5; i++) { const g = new THREE.Group(); g.position.set(0, i === 0 ? 0.4 : 0.46, i === 0 ? 1.3 : 0.0); const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.26 - i * 0.02, 14, 10), amber); s2.scale.set(1, 1, 1.4); s2.position.y = 0.2; g.add(s2); prev.add(g); tail.push(g); prev = g; }
  const stinger = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.42, 10), new THREE.MeshStandardMaterial({ color: 0x1a1008, emissive: 0x552200, metalness: 0.5 })); stinger.position.set(0, 0.45, -0.1); stinger.rotation.x = -Math.PI / 1.6; tail[4].add(stinger);
  const pincers = [];
  [-1, 1].forEach(side => { const g = new THREE.Group(); g.position.set(side * 0.38, 0.42, -0.78); const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.7), amber); arm.rotation.set(Math.PI / 2, 0, side * 0.5); arm.position.set(side * 0.18, 0, -0.25); g.add(arm); const claw = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), amber); claw.scale.set(0.8, 0.6, 1.4); claw.position.set(side * 0.36, 0, -0.62); g.add(claw); scorp.add(g); pincers.push(g); });
  const sLegs = [];
  [-1, 1].forEach(side => { for (let i = 0; i < 4; i++) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.8), amberDark); l.position.set(side * 0.5, 0.25, -0.35 + i * 0.35); l.rotation.z = side * 1.1; scorp.add(l); sLegs.push({ l, side, i }); } });
  scorp.scale.setScalar(1.25);
  const scorpShadow = new THREE.Mesh(new THREE.CircleGeometry(1.0, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 })); scorpShadow.rotation.x = -Math.PI / 2; scorpShadow.position.y = 0.03; scene.add(scorpShadow);

  /* ---------- money: stacks and falling bills ---------- */
  const billC = document.createElement("canvas"); billC.width = 128; billC.height = 64; { const g = billC.getContext("2d"); g.fillStyle = "#2f8a4a"; g.fillRect(0, 0, 128, 64); g.strokeStyle = "#d8f0c8"; g.lineWidth = 4; g.strokeRect(5, 5, 118, 54); g.fillStyle = "#d8f0c8"; g.font = "bold 40px Georgia, serif"; g.textAlign = "center"; g.fillText("$", 64, 47); g.beginPath(); g.arc(22, 32, 9, 0, 6.28); g.arc(106, 32, 9, 0, 6.28); g.fill(); }
  const billTex = new THREE.CanvasTexture(billC); billTex.colorSpace = THREE.SRGBColorSpace;
  const billMat = new THREE.MeshBasicMaterial({ map: billTex, side: THREE.DoubleSide });
  const MAXB = small ? 220 : 360;
  const bills = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.9, 0.45), billMat, MAXB); bills.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(bills);
  const B = Array.from({ length: MAXB }, () => ({ on: false, p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler(), w: new THREE.Vector3(), rest: 0 }));
  const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpS = new THREE.Vector3(1, 1, 1), hide = new THREE.Matrix4().makeScale(0, 0, 0);
  for (let i = 0; i < MAXB; i++) bills.setMatrixAt(i, hide);
  let bIdx = 0;
  function rain(n) {
    for (let k = 0; k < n; k++) {
      const b = B[bIdx]; bIdx = (bIdx + 1) % MAXB;
      const from = moonPos.clone().lerp(crab.position, 0.9 + Math.random() * 0.06); from.y = 16 + Math.random() * 10; from.x += (Math.random() - 0.5) * 8;
      const target = new THREE.Vector3(crab.position.x + (Math.random() - 0.5) * 12, 0, crab.position.z + (Math.random() - 0.5) * 9);
      b.on = true; b.rest = 0; b.p.copy(from); b.v.copy(target).sub(from).multiplyScalar(0.22 + Math.random() * 0.1); b.v.y = -4 - Math.random() * 3;
      b.r.set(Math.random() * 6, Math.random() * 6, Math.random() * 6); b.w.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
    }
  }
  const stackMat = new THREE.MeshStandardMaterial({ color: 0x3c9a57, roughness: 0.7, emissive: 0x06200d });
  const MAXS = 220;
  const stacks = new THREE.InstancedMesh(new THREE.BoxGeometry(0.9, 0.22, 0.45), stackMat, MAXS); scene.add(stacks);
  const bands = new THREE.InstancedMesh(new THREE.BoxGeometry(0.2, 0.23, 0.46), goldMat, MAXS); scene.add(bands);
  function buildStacks(level) {
    const n = Math.min(MAXS, 14 + level * 18); let i = 0;
    for (; i < n; i++) {
      const pile = Math.floor(i / 6), side = pile % 2 ? 1 : -1, slot = Math.floor(pile / 2);
      const x = side * (4.5 + (slot % 3) * 1.25), z = -14 - Math.floor(slot / 3) * 1.1, y = 0.11 + (i % 6) * 0.23 + Math.floor(slot / 9) * 0;
      tmpM.compose(new THREE.Vector3(x, y + Math.floor(i / (6 * 18)) * 1.4, z), tmpQ.setFromEuler(new THREE.Euler(0, (i * 0.37) % 0.4 - 0.2, 0)), tmpS);
      stacks.setMatrixAt(i, tmpM); bands.setMatrixAt(i, tmpM);
    }
    for (; i < MAXS; i++) { stacks.setMatrixAt(i, hide); bands.setMatrixAt(i, hide); }
    stacks.instanceMatrix.needsUpdate = true; bands.instanceMatrix.needsUpdate = true;
  }

  /* ---------- coins and diamonds ---------- */
  const fx = fxRef;
  function pool(geo, mat, n) { const m = new THREE.InstancedMesh(geo, mat, n); m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(m); for (let i = 0; i < n; i++) m.setMatrixAt(i, hide); return { m, n, a: Array.from({ length: n }, () => ({ on: false, p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler(), w: new THREE.Vector3(), rest: 0 })), i: 0 }; }
  const coins = pool(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 18), goldMat, small ? 160 : 260);
  const diamonds = pool(new THREE.OctahedronGeometry(0.24, 0), new THREE.MeshStandardMaterial({ color: 0xcff6ff, metalness: 0.2, roughness: 0.05, emissive: 0x3aa6c8, emissiveIntensity: 0.9, flatShading: true }), small ? 180 : 320);
  function drop(P, n, wide, fast) {
    for (let k = 0; k < n; k++) {
      const o = P.a[P.i]; P.i = (P.i + 1) % P.n;
      o.on = true; o.rest = 0;
      if (wide) o.p.set((Math.random() - 0.5) * 46, 22 + Math.random() * 18, 12 - Math.random() * 60);
      else o.p.set(crab.position.x + (Math.random() - 0.5) * 12, 18 + Math.random() * 12, crab.position.z + (Math.random() - 0.5) * 10);
      o.v.set((Math.random() - 0.5) * 2, fast ? -22 - Math.random() * 10 : -6 - Math.random() * 4, (Math.random() - 0.5) * 2);
      o.r.set(Math.random() * 6, Math.random() * 6, Math.random() * 6); o.w.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12);
    }
  }
  function stepPool(P, dt, restFor) {
    for (let i = 0; i < P.n; i++) {
      const o = P.a[i]; if (!o.on) continue;
      if (o.p.y > 0.05) { o.v.y -= 9 * dt; o.p.addScaledVector(o.v, dt); o.r.x += o.w.x * dt; o.r.y += o.w.y * dt; o.r.z += o.w.z * dt; if (o.p.y <= 0.05) { o.p.y = 0.05; o.r.set(restFor ? -Math.PI / 2 : o.r.x, o.r.y, 0); if (!restFor) { o.on = false; P.m.setMatrixAt(i, hide); continue; } } }
      else { o.rest += dt; if (o.rest > restFor) { o.on = false; P.m.setMatrixAt(i, hide); continue; } }
      tmpM.compose(o.p, tmpQ.setFromEuler(o.r), tmpS); P.m.setMatrixAt(i, tmpM);
    }
    P.m.instanceMatrix.needsUpdate = true;
  }

  /* ---------- twin knives (karambit style) ---------- */
  function makeKnife() {
    const k = new THREE.Group();
    const blade = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 6, 24, Math.PI * 0.85), steel); blade.scale.set(1, 1, 0.35); blade.rotation.z = Math.PI * 0.55; blade.position.set(0.15, 0.55, 0); k.add(blade);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 10), new THREE.MeshStandardMaterial({ color: 0x3b2a5a, metalness: 0.4, roughness: 0.4 })); k.add(handle);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.035, 8, 20), goldMat); ring.position.y = -0.38; k.add(ring);
    k.scale.setScalar(1.6); return k;
  }
  const knives = [makeKnife(), makeKnife()];
  knives.forEach(k => { k.visible = false; scene.add(k); });
  const slash = new THREE.Mesh(new THREE.RingGeometry(2.2, 2.6, 40, 1, 0, Math.PI * 0.9), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(slash);
  const dual = { phase: "idle", t: 0, next: 16 + Math.random() * 10, hitCool: 0 };   // idle, falling, wield

  /* ---------- crab magic ---------- */
  const runeTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d"); g.strokeStyle = "rgba(200,120,255,1)"; g.lineWidth = 6; g.shadowColor = "#b04dff"; g.shadowBlur = 18; g.beginPath(); g.arc(128, 128, 110, 0, 6.28); g.stroke(); g.beginPath(); g.arc(128, 128, 80, 0, 6.28); g.stroke(); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28; g.beginPath(); g.moveTo(128 + Math.cos(a) * 110, 128 + Math.sin(a) * 110); g.lineTo(128 + Math.cos(a + 2.09) * 110, 128 + Math.sin(a + 2.09) * 110); g.stroke(); } return new THREE.CanvasTexture(c); })();
  const rune = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: runeTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); rune.rotation.x = -Math.PI / 2; rune.position.y = 0.06; scene.add(rune);
  const magicLight = new THREE.PointLight(0xb04dff, 0, 30, 1.6); scene.add(magicLight);
  const magic = { t: 0, next: 12 + Math.random() * 8, mode: null };

  /* ---------- Qiyamah: the Trumpet (Sur) and the moon splitting ---------- */
  const sur = new THREE.Group();
  { const horn = new THREE.Mesh(new THREE.ConeGeometry(3.2, 26, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0xf2d28a, metalness: 1, roughness: 0.2, emissive: 0xc8962a, emissiveIntensity: 0.8, side: THREE.DoubleSide, fog: false })); horn.rotation.z = Math.PI / 2; sur.add(horn);
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.35, 12, 40), goldMat); mouth.position.x = -13; mouth.rotation.y = Math.PI / 2; sur.add(mouth);
    const bands = [-4, 3, 8].map(x => { const b2 = new THREE.Mesh(new THREE.TorusGeometry(3.2 * (13 - x) / 26 + 0.2, 0.18, 8, 32), goldMat); b2.position.x = x; b2.rotation.y = Math.PI / 2; sur.add(b2); return b2; }); }
  const surGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(255,245,210,0.9)", "rgba(255,245,210,0)"), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
  surGlow.scale.set(26, 26, 1); surGlow.position.x = -14; sur.add(surGlow);
  const surPos = toSky(-19, 15, 230);
  const craters = scene.children.filter(o => o.userData.moon); sur.position.copy(surPos); sur.lookAt(0, 0, 0); sur.rotateZ(-0.35); sur.visible = false; scene.add(sur);
  const waves = [0, 1, 2].map(() => { const w = new THREE.Mesh(new THREE.RingGeometry(1, 1.04, 96), new THREE.MeshBasicMaterial({ color: 0xfff2c8, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); w.position.copy(surPos); w.lookAt(0, 0, 0); scene.add(w); return w; });
  const halfMat = moonMat;
  const moonL = new THREE.Mesh(new THREE.SphereGeometry(15, 32, 24, Math.PI * 1.5, Math.PI), halfMat), moonR = new THREE.Mesh(new THREE.SphereGeometry(15, 32, 24, Math.PI * 0.5, Math.PI), halfMat);
  [moonL, moonR].forEach(h => { h.position.copy(moonPos); h.visible = false; scene.add(h); });
  const qiy = { t: 0, next: 55 + Math.random() * 20, on: false };
  function trumpet() {
    if (!soundOn || !ac) return;
    const t0 = ac.currentTime + 0.1, o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
    o.type = "sawtooth"; o2.type = "square"; f.type = "lowpass"; f.frequency.value = 900;
    o.frequency.setValueAtTime(98, t0); o.frequency.linearRampToValueAtTime(110, t0 + 2); o2.frequency.setValueAtTime(147, t0); o2.frequency.linearRampToValueAtTime(165, t0 + 2);
    o.connect(f); o2.connect(f); f.connect(g); g.connect(ac.destination);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.14, t0 + 0.8); g.gain.setValueAtTime(0.14, t0 + 5); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 6.5);
    o.start(t0); o2.start(t0); o.stop(t0 + 6.6); o2.stop(t0 + 6.6);
  }

  /* ---------- GOLD DIGGER, written in the sky ---------- */
  { const c = document.createElement("canvas"); c.width = 1024; c.height = 160; const g = c.getContext("2d"); g.font = "bold 120px Georgia, serif"; g.textAlign = "center"; g.shadowColor = "#ffcf5a"; g.shadowBlur = 30; g.fillStyle = "#ffe7a3"; g.fillText("GOLD DIGGER", 512, 125);
    const gd = new THREE.Mesh(new THREE.PlaneGeometry(150, 23.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, fog: false, opacity: 0.85 }));
    gd.position.copy(toSky(22, 15, 470)); gd.lookAt(0, 0, 0); scene.add(gd); fx.gold = gd; }

  /* ---------- palms lining the road, and the ROYAL ORCHARD gate behind the crab ---------- */
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2a, roughness: 0.9 }), leafMat = new THREE.MeshStandardMaterial({ color: 0x1f7a3a, roughness: 0.7 });
  function palmTree(x, z, h) {
    const g = new THREE.Group(); const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, h, 8), trunkMat); trunk.position.y = h / 2; g.add(trunk);
    for (let i = 0; i < 7; i++) { const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.45, 3.6, 5), leafMat); const a = i / 7 * 6.28; leaf.position.set(Math.cos(a) * 1.4, h + 0.1, Math.sin(a) * 1.4); leaf.rotation.set(Math.sin(a) * 1.2, 0, -Math.cos(a) * 1.2); g.add(leaf); }
    g.position.set(x, 0, z); g.rotation.z = (Math.random() - 0.5) * 0.12; scene.add(g);
  }
  for (let z = 14; z > -30; z -= small ? 9 : 6.5) [-1, 1].forEach(sd => palmTree(sd * (9.5 + Math.random() * 1.5), z + Math.random() * 2, 6 + Math.random() * 3));
  {
    const gate = new THREE.Group(), GH = 13;
    [-1, 1].forEach(sd => { const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, GH, 16), goldMat); pil.position.set(sd * 9, GH / 2, 0); gate.add(pil); const fin = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 12), goldMat); fin.position.set(sd * 9, GH + 0.6, 0); gate.add(fin); });
    const c = document.createElement("canvas"); c.width = 1024; c.height = 150; const g = c.getContext("2d");
    g.fillStyle = "#0b3b24"; g.fillRect(0, 0, 1024, 150); g.strokeStyle = "#e8c87e"; g.lineWidth = 10; g.strokeRect(8, 8, 1008, 134);
    g.font = "bold 92px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "#ffe7a3"; g.shadowColor = "#ffcf5a"; g.shadowBlur = 18; g.fillText("ROYAL ORCHARD", 512, 108);
    const board = new THREE.Mesh(new THREE.PlaneGeometry(17, 2.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) })); board.position.set(0, GH - 0.6, 0.2); gate.add(board);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(19, 0.5, 0.6), goldMat); beam.position.y = GH + 0.9; gate.add(beam);
    gate.position.set(0, 0, -23); scene.add(gate);
  }

  /* ---------- the crab's four wives: party dress, then hijab, then niqab ---------- */
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xc99272, roughness: 0.6 });
  const PARTY = [0xe8c87e, 0xff4fa3, 0x2fd39a, 0x9b5cff], HIJAB = [0xf3e3c3, 0xb0306a, 0x1f6b52, 0x5a3a8a];
  function makeWife(i, stage) {
    const w = new THREE.Group();
    const col = stage === 0 ? PARTY[i] : stage === 1 ? HIJAB[i] : 0x111118;
    const cloth = new THREE.MeshStandardMaterial({ color: col, roughness: stage === 0 ? 0.25 : 0.8, metalness: stage === 0 ? 0.6 : 0, emissive: stage === 0 ? col : 0x000000, emissiveIntensity: stage === 0 ? 0.15 : 0 });
    const gown = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.9, 24), cloth); gown.position.y = 0.95; w.add(gown);
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.8, 16), cloth); torso.position.y = 2.1; w.add(torso);
    [-1, 1].forEach(sd => { const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.9, 8), stage === 0 ? skinMat : cloth); arm.position.set(sd * 0.4, 2.0, 0); arm.rotation.z = sd * 0.25; w.add(arm); });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 16), skinMat); head.position.y = 2.78; w.add(head);
    if (stage === 0) {
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.33, 20, 16, 0, 6.28, 0, Math.PI * 0.55), new THREE.MeshStandardMaterial({ color: 0x1a0e08, roughness: 0.5 })); hair.position.y = 2.8; hair.rotation.x = -0.35; w.add(hair);
      const back = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.8, 12), hair.material); back.position.set(0, 2.45, -0.15); w.add(back);
      const neck = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 8, 24), goldMat); neck.position.y = 2.5; neck.rotation.x = Math.PI / 2; w.add(neck);
    } else {
      const wrap = new THREE.Mesh(new THREE.SphereGeometry(0.36, 22, 16, stage === 1 ? 0.75 : 0, stage === 1 ? 4.78 : 6.28), cloth); wrap.position.y = 2.8; wrap.rotation.y = Math.PI; w.add(wrap);
      const drape = new THREE.Mesh(new THREE.ConeGeometry(0.62, 0.9, 20, 1, true), cloth); drape.position.y = 2.35; w.add(drape);
      if (stage === 2) { const slit = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.05), skinMat); slit.position.set(0, 2.86, 0.34); w.add(slit); [-1, 1].forEach(sd => { const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshBasicMaterial({ color: 0x000000 })); eye.position.set(sd * 0.08, 2.86, 0.37); w.add(eye); }); }
    }
    return w;
  }
  const wives = new THREE.Group(); scene.add(wives);
  function buildWives(round) {
    while (wives.children.length) wives.remove(wives.children[0]);
    const stage = Math.min(2, round);
    [-2, -1, 1, 2].forEach((slot, i) => { const w = makeWife(i, stage); w.userData.slot = slot; wives.add(w); });
  }
  buildWives(0);

  /* ---------- cartoon bunnies with bow ties flying by ---------- */
  const bunnies = [];
  { const fur = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }), pink = new THREE.MeshStandardMaterial({ color: 0xff9ec7 }), black = new THREE.MeshStandardMaterial({ color: 0x0a0a0a }), wing = new THREE.MeshBasicMaterial({ color: 0xfff2c8, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    for (let i = 0; i < 3; i++) {
      const b2 = new THREE.Group();
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 12), fur); body.scale.set(1, 0.9, 1.2); b2.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 12), fur); head.position.set(0, 0.6, 0.75); b2.add(head);
      [-1, 1].forEach(sd => { const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.7, 4, 8), fur); ear.position.set(sd * 0.2, 1.35, 0.6); ear.rotation.z = sd * 0.2; b2.add(ear); const inner = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.5, 4, 8), pink); inner.position.set(sd * 0.2, 1.35, 0.7); inner.rotation.z = sd * 0.2; b2.add(inner);
        const bow = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.26, 4), black); bow.rotation.z = sd * Math.PI / 2; bow.position.set(sd * 0.13, 0.2, 1.05); b2.add(bow);
        const wg = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), wing); wg.position.set(sd * 0.9, 0.4, -0.1); wg.userData.sd = sd; b2.add(wg); });
      b2.scale.setScalar(1.4); b2.userData = { sp: 5 + Math.random() * 4, y: 9 + Math.random() * 8, z: -10 - Math.random() * 30, ph: Math.random() * 6, dir: i % 2 ? 1 : -1 };
      b2.position.set(-40 + i * 30, b2.userData.y, b2.userData.z); scene.add(b2); bunnies.push(b2);
    }
  }

  /* ---------- floating damage numbers and the AL-ʿADL banner ---------- */
  const PRAYER = "👁️✨May every evil eye on Adeel Ahmed Rahman go blind🧿🪬";
  const adlEl = document.createElement("div"); adlEl.className = "g3__adl"; root.appendChild(adlEl);
  let adlT = 0;
  function adl() { adlEl.innerHTML = "⚖️ AL-ʿADL <span lang='ar'>العدل</span> · " + tx().justice; adlEl.classList.add("on"); adlT = 1.6; }
  const dv = new THREE.Vector3();
  function dmg(text, at, kind) {
    dv.copy(at).project(camera); if (dv.z > 1) return;
    const el = document.createElement("div"); el.className = "g3__dmg g3__dmg--" + kind; el.textContent = text;
    el.style.left = ((dv.x * 0.5 + 0.5) * 100 + (Math.random() - 0.5) * 6) + "%"; el.style.top = ((-dv.y * 0.5 + 0.5) * 100) + "%";
    root.appendChild(el); setTimeout(() => el.remove(), 1300);
  }
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const CRAB_HIT = ["2222", "222", "222222", "88888888", "622"], WEAPON_HIT = ["6226228", "1111", "333", "3333", "333333"];
  function crabHits(list) { dmg(typeof list === "string" ? list : pick(list), pos.clone().add(new THREE.Vector3(0, 2, 0)), "crab"); adl(); }

  /* ---------- game state ---------- */
  const st = { stun: 0, round: 0, hp: 100, crabScale: 1, wealth: 1000000, level: 0, playing: false, sting: 0, cool: 0, kb: 0, crabT: 1.5, crabTarget: 0, lunge: 0, flinch: 0, shake: 0 };
  const pos = new THREE.Vector3(0, 0, 8);
  crab.position.set(0, 0, -12);
  buildMansion(0); buildStacks(0);
  const keys = {};
  const fmt = n => "$" + Math.round(n).toLocaleString("en-US");
  function setHud() {
    const t = tx();
    hud.round.textContent = t.round + " " + (st.round + 1);
    hud.hp.style.width = st.hp + "%";
    hud.wealth.textContent = t.wealth + ": " + fmt(st.wealth);
    hud.mansion.textContent = t.mansion + ": " + t.lvl + " " + (st.level + 1);
    root.querySelectorAll("[data-t]").forEach(el => { el.textContent = t[el.getAttribute("data-t")]; });
  }
  let msgT = 0;
  function say(main, sub, ms) { hud.msg.innerHTML = "<b>" + main + "</b>" + (sub ? "<span>" + sub + "</span><span class='lh' lang='ar'>" + tx().lh + "</span>" : ""); hud.msg.classList.add("on"); msgT = ms || 1200; }
  setHud(); say(tx().start, "", 99999);

  function begin() { if (!st.playing) { st.playing = true; hud.msg.classList.remove("on"); } }
  function niceTry() {
    st.round++; st.level++;
    st.crabScale = Math.min(3, st.crabScale * 1.3);
    st.wealth = st.wealth * 1.9 + 750000 + Math.random() * 400000;
    buildMansion(st.level); buildStacks(st.level);
    crown.visible = st.round >= 1; chain.visible = st.round >= 2; strength(st.round);
    rain(MAXB); drop(coins, coins.n, false, false); drop(diamonds, 120, true, true);
    pos.set(0, 0, 8); st.hp = 100; st.shake = 0.6;
    buildWives(st.round); adl();
    const t = tx(); say(t.nice, t.niceSub + "</span><span class='adl'>⚖️ AL-ʿADL · " + t.justice + "</span><span class='g3pray'>" + PRAYER, 4200); setHud();
  }
  function doSting() {
    begin(); if (st.cool > 0) return;
    st.sting = 1; st.cool = 0.55;
    const reach = 2.4 * st.crabScale + 2.2;
    const dx = pos.x - crab.position.x, dz = pos.z - crab.position.z;
    if (Math.hypot(dx, dz) < reach) {
      if (Math.random() < 0.3) { dmg(tx().miss, crab.position.clone().add(new THREE.Vector3(0, 3 * st.crabScale, 0)), "miss"); return; }
      dmg("1", crab.position.clone().add(new THREE.Vector3(0, 3 * st.crabScale, 0)), "one");
      st.hp = Math.max(0, st.hp - 12.5); st.flinch = 1; st.shake = 0.25; rain(40); drop(coins, 30, false, false); drop(diamonds, 25, false, true);
      st.wealth += 25000 + Math.random() * 60000; setHud();
      if (st.hp <= 0) niceTry(); else say(tx().hit, "", 500);
    }
  }

  /* ---------- input ---------- */
  addEventListener("keydown", e => {
    if (!inView) return;
    const k = e.key.toLowerCase();
    if (["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "d", "w", "s", " "].includes(k)) {
      if (document.activeElement && /input|textarea/i.test(document.activeElement.tagName)) return;
      if (k === " ") { doSting(); e.preventDefault(); return; }
      keys[k] = true; begin(); if (k.startsWith("arrow")) e.preventDefault();
    }
  });
  addEventListener("keyup", e => { keys[e.key.toLowerCase()] = false; });
  const joy = { x: 0, y: 0, id: null, sx: 0, sy: 0, t: 0, moved: 0 };
  const joyEl = root.querySelector(".g3__joy"), joyKnob = joyEl && joyEl.querySelector("i");
  canvas.addEventListener("pointerdown", e => {
    begin(); joy.id = e.pointerId; joy.sx = e.clientX; joy.sy = e.clientY; joy.t = performance.now(); joy.moved = 0; canvas.setPointerCapture(e.pointerId);
    const r = canvas.getBoundingClientRect(); if (joyEl) { joyEl.style.left = (e.clientX - r.left) + "px"; joyEl.style.top = (e.clientY - r.top) + "px"; joyEl.classList.add("on"); }
  });
  canvas.addEventListener("pointermove", e => {
    if (e.pointerId !== joy.id) return;
    let dx = e.clientX - joy.sx, dy = e.clientY - joy.sy; const d = Math.hypot(dx, dy); joy.moved = Math.max(joy.moved, d);
    const R0 = 55; if (d > R0) { dx = dx / d * R0; dy = dy / d * R0; }
    joy.x = dx / R0; joy.y = dy / R0; if (joyKnob) joyKnob.style.transform = "translate(" + dx + "px," + dy + "px)";
  });
  const joyEnd = e => {
    if (e.pointerId !== joy.id) return;
    if (joy.moved < 12 && performance.now() - joy.t < 300) doSting();   // a quick tap stings
    joy.id = null; joy.x = joy.y = 0; if (joyEl) { joyEl.classList.remove("on"); joyKnob.style.transform = ""; }
  };
  canvas.addEventListener("pointerup", joyEnd); canvas.addEventListener("pointercancel", joyEnd);
  root.querySelectorAll("[data-k]").forEach(b => {
    const k = b.getAttribute("data-k");
    const on = e => { e.preventDefault(); begin(); if (k === "sting") doSting(); else keys[k] = true; };
    const off = () => { keys[k] = false; };
    b.addEventListener("pointerdown", on); b.addEventListener("pointerup", off); b.addEventListener("pointerleave", off); b.addEventListener("pointercancel", off);
  });

  /* ---------- sound: synthesized howls (only after the visitor turns sound on) ---------- */
  let ac = null, soundOn = false;
  const sBtn = root.querySelector("[data-g='sound']");
  sBtn.addEventListener("click", () => { soundOn = !soundOn; sBtn.setAttribute("aria-pressed", soundOn); sBtn.querySelector("b").textContent = soundOn ? "🔊" : "🔈"; if (soundOn && !ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (soundOn) howl(0.2, 1); });
  function howl(delay, pitch) {
    if (!soundOn || !ac) return;
    const t0 = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain(), f = ac.createBiquadFilter();
    o.type = "sawtooth"; f.type = "lowpass"; f.frequency.value = 1200; lfo.frequency.value = 5.5; lg.gain.value = 9 * pitch;
    lfo.connect(lg); lg.connect(o.frequency); o.connect(f); f.connect(g); g.connect(ac.destination);
    o.frequency.setValueAtTime(260 * pitch, t0); o.frequency.exponentialRampToValueAtTime(520 * pitch, t0 + 0.9); o.frequency.exponentialRampToValueAtTime(430 * pitch, t0 + 2.4); o.frequency.exponentialRampToValueAtTime(300 * pitch, t0 + 3.2);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.4); g.gain.setValueAtTime(0.12, t0 + 2.4); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.3);
    o.start(t0); lfo.start(t0); o.stop(t0 + 3.4); lfo.stop(t0 + 3.4);
  }

  /* ---------- blood moon cycle ---------- */
  const white = new THREE.Color(0xfff4d6), red = new THREE.Color(0xc0180c), glowW = new THREE.Color(0xffffff), glowR = new THREE.Color(0xff3a2a);
  let bloodPhase = 0, bloodT = 18 + Math.random() * 12, bloodOn = false;

  /* ---------- resize, visibility ---------- */
  let inView = false, raf = 0, last = performance.now();
  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); composer.setSize(w, h); bloom.setSize(w, h);
    camera.aspect = w / h; camera.fov = w / h < 1 ? 66 : 56; camera.updateProjectionMatrix();
  }
  new ResizeObserver(size).observe(canvas); size();
  // Run only while on screen. IntersectionObserver plus a direct check on scroll and resize, so a
  // start during smooth scrolling can't leave the game paused.
  function check() {
    const r = root.getBoundingClientRect();
    inView = r.bottom > 0 && r.top < innerHeight && r.width > 0;
    if (inView && !raf && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); }
  }
  new IntersectionObserver(check, { threshold: [0, 0.05, 0.5] }).observe(root);
  let pend = 0;
  addEventListener("scroll", () => { if (!pend) pend = requestAnimationFrame(() => { pend = 0; check(); }); }, { passive: true });
  addEventListener("resize", check);
  check();
  document.addEventListener("visibilitychange", () => { if (!document.hidden && inView && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } });

  /* ---------- loop ---------- */
  const camPos = new THREE.Vector3(0, 5.6, 17), look = new THREE.Vector3();
  let time = 0;
  function loop(now) {
    raf = 0;
    if (!inView || document.hidden) return;
    const dt = Math.min(0.1, (now - last) / 1000); last = now; time += dt;
    starU.t.value = time;

    // player movement
    const sp2 = 8.5;
    let mx = (keys.arrowright || keys.d ? 1 : 0) - (keys.arrowleft || keys.a ? 1 : 0) + joy.x;
    let mz = (keys.arrowdown || keys.s ? 1 : 0) - (keys.arrowup || keys.w ? 1 : 0) + joy.y;
    if (st.stun > 0) { st.stun -= dt; mx = mz = 0; scorp.rotation.y += dt * 14; } else scorp.rotation.y = 0;
    if (st.kb > 0) { pos.z += st.kb * dt * 3; st.kb = Math.max(0, st.kb - dt * 6); }
    pos.x = THREE.MathUtils.clamp(pos.x + mx * sp2 * dt, -5.2, 5.2);
    const minZ = crab.position.z + 2.4 * st.crabScale + 1.2;
    pos.z = THREE.MathUtils.clamp(pos.z + mz * sp2 * dt, minZ, 12);
    scorp.position.set(pos.x, 0, pos.z); scorpShadow.position.set(pos.x, 0.03, pos.z);
    const walking = Math.abs(mx) > 0.05 || Math.abs(mz) > 0.05;
    sLegs.forEach(({ l, side, i }) => { l.rotation.x = walking ? Math.sin(time * 16 + i * 1.3 + (side > 0 ? 1.5 : 0)) * 0.5 : 0; });
    pincers.forEach((p, i) => { p.rotation.y = Math.sin(time * 3 + i) * 0.12; });
    // tail: idle sway or strike
    if (st.sting > 0) st.sting = Math.max(0, st.sting - dt * 3.2);
    if (st.cool > 0) st.cool -= dt;
    const strike = Math.sin(st.sting * Math.PI);
    tail.forEach((g, i) => { g.rotation.x = TAILBASE[i] - Math.sin(time * 2 + i) * 0.04 - strike * (i === 0 ? 0.5 : 0.28); });

    // crab AI
    const level = st.round, crabSpeed = 2.2 + level * 0.6;
    st.crabT -= dt;
    if (st.crabT <= 0) { st.crabT = 1 + Math.random() * 2; st.crabTarget = (Math.random() - 0.5) * 7; if (st.playing && Math.abs(pos.z - crab.position.z) < 9 + st.crabScale * 2 && Math.random() < 0.45 + level * 0.08) st.lunge = 1; }
    crab.position.x += THREE.MathUtils.clamp(st.crabTarget - crab.position.x, -1, 1) * crabSpeed * dt;
    let lz = 0;
    if (st.lunge > 0) { st.lunge = Math.max(0, st.lunge - dt * 2.2); lz = Math.sin((1 - st.lunge) * Math.PI) * (2 + st.crabScale);
      if (st.lunge < 0.55 && st.lunge > 0.45 && Math.hypot(pos.x - crab.position.x, pos.z - (crab.position.z + lz)) < 3 * st.crabScale + 1.6) { st.kb = 2.4 + level * 0.3; st.shake = 0.35; say(tx().back, "", 900); crabHits(CRAB_HIT); } }
    crab.scale.setScalar(st.crabScale * (1 + Math.sin(time * 2) * 0.015));
    crab.position.set(crab.position.x, 0, -12);
    crabShadow.position.set(crab.position.x, 0.03, -12); crabShadow.scale.setScalar(st.crabScale);
    legs.forEach(({ g, side, i }) => { g.rotation.x = Math.sin(time * 9 + i * 1.7 + side) * 0.25; });
    if (st.flinch > 0) st.flinch = Math.max(0, st.flinch - dt * 4);
    claws.forEach(({ g, top, side }, i) => { const snap = Math.max(0, Math.sin(time * 4 + i * 2)) ** 6; top.rotation.z = snap * 0.6 * side; g.rotation.y = side * (0.2 + Math.sin(time * 1.5 + i) * 0.1) - st.flinch * side * 0.4; g.rotation.x = -st.lunge * 0.6; });
    body.rotation.z = st.flinch * Math.sin(time * 40) * 0.08;
    eyes.forEach((e, i) => { e.position.y = 2.3 + Math.sin(time * 3 + i) * 0.04; });
    crown.rotation.y += dt * 0.6; crown.position.y = 3.5 + Math.min(st.round, 6) * 0.3 + Math.sin(time * 2.2) * 0.1;
    // weapons: now and then the crab pulls out a sword or a gun for a few seconds
    weap.next -= dt;
    if (!weap.kind && weap.next <= 0 && st.playing) { weap.kind = Math.random() < 0.5 ? "sword" : "gun"; weap.t = 3.2; weap.shot = 0.9; (weap.kind === "sword" ? sword : gun).visible = true; say(weap.kind === "sword" ? "🗡️" : "🔫", "", 900); }
    if (weap.kind) {
      weap.t -= dt;
      if (weap.kind === "sword") { weap.shot -= dt; if (weap.shot <= 0) { weap.shot = 0.8; if (Math.hypot(pos.x - crab.position.x, pos.z - crab.position.z) < 4 * st.crabScale + 3) { crabHits(WEAPON_HIT); st.kb = Math.max(st.kb, 1.8); st.shake = Math.max(st.shake, 0.25); } } sword.rotation.z = -0.5 + Math.sin(time * 6) * 0.9; sword.rotation.x = 0.25 + Math.sin(time * 3) * 0.3; }
      else { weap.shot -= dt; flash.visible = weap.shot < 0.08 && weap.shot > -0.02; if (weap.shot <= -0.02) { weap.shot = 0.7; if (Math.abs(pos.x - crab.position.x) < 3 + st.crabScale) { crabHits(WEAPON_HIT); st.kb = Math.max(st.kb, 1.4); st.shake = Math.max(st.shake, 0.18); } } gun.rotation.x = flash.visible ? -0.35 : 0; gun.rotation.y = -0.55; }
      if (weap.t <= 0) { sword.visible = gun.visible = flash.visible = false; weap.kind = null; weap.next = 7 + Math.random() * 8 - Math.min(st.round, 4); }
    }
    crab.lookAt(pos.x, 0, pos.z); crab.rotation.x = 0; crab.rotation.z = 0;   // the lunge moves the body and claws, not the crab's spot
    body.position.z = lz * 0.5; claws.forEach(c => { c.g.position.z = 1.0 + lz * 0.8; });

    // bills
    for (let i = 0; i < MAXB; i++) {
      const b = B[i]; if (!b.on) continue;
      if (b.p.y > 0.03) {
        b.v.y -= 2.2 * dt; b.v.multiplyScalar(1 - 0.9 * dt); b.v.x += Math.sin(time * 3 + i) * 1.2 * dt;
        b.p.addScaledVector(b.v, dt); b.r.x += b.w.x * dt; b.r.y += b.w.y * dt; b.r.z += b.w.z * dt;
        if (b.p.y <= 0.03) { b.p.y = 0.03; b.r.set(-Math.PI / 2, 0, Math.random() * 6); }
      } else { b.rest += dt; if (b.rest > 40) { b.on = false; bills.setMatrixAt(i, hide); continue; } }
      tmpM.compose(b.p, tmpQ.setFromEuler(b.r), tmpS); bills.setMatrixAt(i, tmpM);
    }
    bills.instanceMatrix.needsUpdate = true;

    // blood moon, werewolf, wolves
    if (!reduce) bloodT -= dt;
    if (bloodT <= 0 && !bloodOn) { bloodOn = true; bloodT = 11; hud.cap.textContent = tx().blood; hud.cap.classList.add("on"); howl(1.2, 1); howl(2.6, 1.25); howl(3.4, 0.85); }
    if (bloodOn && bloodT <= 0) { bloodOn = false; bloodT = 26 + Math.random() * 20; hud.cap.classList.remove("on"); }
    bloodPhase = THREE.MathUtils.clamp(bloodPhase + (bloodOn ? dt : -dt) * 0.6, 0, 1);
    const bp = THREE.MathUtils.smoothstep(bloodPhase, 0, 1);
    moonMat.color.copy(white).lerp(red, bp); moonGlow.material.color.copy(glowW).lerp(glowR, bp); skyU.blood.value = bp;
    moonLight.color.setRGB(0.75 + bp * 0.5, 0.82 - bp * 0.5, 1 - bp * 0.7);
    were.position.y = THREE.MathUtils.lerp(-6, 8.6, bp) + (bp > 0.9 ? Math.sin(time * 1.5) * 0.15 : 0);
    were.rotation.z = bp > 0.9 ? Math.sin(time * 0.8) * 0.04 : 0;
    wolves.forEach((w, i) => { w.position.y = THREE.MathUtils.lerp(w.userData.y - 6, w.userData.y, THREE.MathUtils.clamp(bp * 1.4 - i * 0.15, 0, 1)); });
    constLines.forEach(m => { m.opacity = 0.26 + Math.sin(time * 0.8) * 0.06 + bp * 0.1; });

    wives.children.forEach((w, i) => { const sl = w.userData.slot; w.position.set(crab.position.x + sl * (1.9 + st.crabScale * 1.5), 0, crab.position.z - 2.2 - Math.abs(sl) * 0.6); w.rotation.y = Math.sin(time * 1.2 + i) * 0.25; w.position.y = Math.abs(Math.sin(time * 2.4 + i)) * 0.12; });
    bunnies.forEach(b2 => { const u = b2.userData; b2.position.x += u.dir * u.sp * dt; if (Math.abs(b2.position.x) > 55) { b2.position.x = -u.dir * 55; u.y = 9 + Math.random() * 8; u.z = -10 - Math.random() * 30; } b2.position.y = u.y + Math.sin(time * 3 + u.ph) * 1.2; b2.position.z = u.z; b2.rotation.y = u.dir * Math.PI / 2; b2.children.forEach(c => { if (c.userData.sd) c.rotation.y = c.userData.sd * Math.sin(time * 14 + u.ph) * 0.7; }); });
    if (adlT > 0) { adlT -= dt; if (adlT <= 0) adlEl.classList.remove("on"); }

    // constant money weather: bills, coins and diamonds
    if (Math.random() < dt * 4) rain(1);
    if (Math.random() < dt * 6) drop(coins, 1, true, false);
    drop(diamonds, Math.random() < (small ? 0.35 : 0.6) ? 1 : 0, true, true);
    stepPool(coins, dt, 25); stepPool(diamonds, dt, 0);
    if (fx.spray) fx.spray.scale.setScalar(1 + Math.sin(time * 6) * 0.15);
    fx.beams.forEach(({ beam, side }) => { beam.rotation.z = Math.sin(time * 0.6 + side) * 0.5; beam.rotation.x = Math.PI + Math.sin(time * 0.4 + side * 2) * 0.25; });
    if (fx.gold) fx.gold.material.opacity = 0.7 + Math.sin(time * 1.3) * 0.15;

    // twin knives: fall from the sky, then the crab dual-wields and slashes
    const dist = Math.hypot(pos.x - crab.position.x, pos.z - crab.position.z);
    if (dual.phase === "idle" && st.playing) { dual.next -= dt; if (dual.next <= 0) { dual.phase = "falling"; dual.t = 0; knives.forEach((k, i) => { k.visible = true; k.position.set(crab.position.x + (i ? 2.5 : -2.5) * st.crabScale, 22, crab.position.z + 1); }); say(tx().knives, "", 1400); } }
    if (dual.phase === "falling") { dual.t += dt; knives.forEach((k, i) => { k.position.y -= dt * 18; k.rotation.z += dt * 14; }); if (knives[0].position.y < 2.2 * st.crabScale) { dual.phase = "wield"; dual.t = 6.5; knives.forEach((k, i) => { scene.remove(k); claws[i].g.add(k); k.position.set(0, 0.6, 1.5); k.rotation.set(0, 0, 0); }); } }
    if (dual.phase === "wield") {
      dual.t -= dt; dual.hitCool -= dt;
      claws.forEach((c, i) => { c.g.rotation.y = c.side * (0.4 + Math.sin(time * 18 + i * 1.6) * 1.1); c.g.rotation.x = Math.sin(time * 14 + i) * 0.6; });
      slash.position.set(crab.position.x, 1.6 * st.crabScale, crab.position.z + 1.5 * st.crabScale); slash.rotation.set(-Math.PI / 2 + Math.sin(time * 9) * 0.6, 0, time * 22); slash.scale.setScalar(st.crabScale); slash.material.opacity = 0.35 + Math.abs(Math.sin(time * 18)) * 0.4;
      if (dist < 3.4 * st.crabScale + 2.6 && dual.hitCool <= 0) { dual.hitCool = 0.9; st.kb = 3.4; st.stun = 0.8; st.shake = 0.5; say(tx().sliced, "", 800); crabHits("3434343434"); }
      if (st.lunge <= 0 && Math.random() < dt * 0.8) st.lunge = 1;
      if (dual.t <= 0) { dual.phase = "idle"; dual.next = 18 + Math.random() * 12 - Math.min(st.round, 5); knives.forEach(k => { k.parent && k.parent.remove(k); scene.add(k); k.visible = false; }); slash.material.opacity = 0; }
    }

    // crab magic: a purple rune, then the scorpion is blasted away or dragged in for an attack
    magic.next -= dt;
    if (!magic.mode && magic.next <= 0 && st.playing) { magic.mode = Math.random() < 0.5 ? "push" : "pull"; magic.t = 2.2; say(magic.mode === "push" ? tx().push : tx().pull, "", 1300); }
    if (magic.mode) {
      magic.t -= dt; const k = Math.min(1, (2.2 - magic.t) * 2) * Math.min(1, magic.t * 3);
      rune.position.set(crab.position.x, 0.06, crab.position.z); rune.scale.setScalar(st.crabScale * (0.9 + (2.2 - magic.t) * 0.25)); rune.rotation.z += dt * 2.5; rune.material.opacity = k * 0.9;
      magicLight.position.set(crab.position.x, 3, crab.position.z + 2); magicLight.intensity = k * 40;
      scorp.position.y = Math.sin(time * 10) * 0.15 * k;
      if (magic.mode === "push") pos.z += dt * 9 * k;
      else { pos.z += (crab.position.z + 2.6 * st.crabScale + 1.6 - pos.z) * Math.min(1, dt * 3 * k); pos.x += (crab.position.x - pos.x) * Math.min(1, dt * 2 * k); }
      if (magic.t <= 0) { const m = magic.mode; magic.mode = null; magic.next = 14 + Math.random() * 10 - Math.min(st.round, 5); rune.material.opacity = 0; magicLight.intensity = 0;
        if (m === "pull") { if (dual.phase === "wield") { st.kb = 4; st.stun = 1; st.shake = 0.6; say(tx().sliced, "", 900); crabHits("3434343434"); } else { weap.next = 0; st.lunge = 1; } } }
    }

    // Qiyamah: the Trumpet sounds, shockwaves roll, the moon splits
    if (!reduce) qiy.next -= dt;
    if (!qiy.on && qiy.next <= 0) { qiy.on = true; qiy.t = 11; sur.visible = true; hud.cap.textContent = tx().sur; hud.cap.classList.add("on"); trumpet(); }
    if (qiy.on) {
      qiy.t -= dt; const life = 11 - qiy.t;
      sur.scale.setScalar(Math.min(1, life * 0.8)); surGlow.material.opacity = 0.6 + Math.sin(time * 5) * 0.3;
      waves.forEach((w, i) => { const ph = ((life * 0.45 + i / 3) % 1); w.scale.setScalar(6 + ph * 70); w.material.opacity = (1 - ph) * 0.7; });
      st.shake = Math.max(st.shake, 0.12);
      if (life > 3) { if (!moonL.visible) { hud.cap.textContent = tx().moon; } moon.visible = false; craters.forEach(c => c.visible = false); moonL.visible = moonR.visible = true; const sep = Math.min(10, (life - 3) * 6); moonL.position.copy(moonPos).add(new THREE.Vector3(-sep, 0, 0)); moonR.position.copy(moonPos).add(new THREE.Vector3(sep, 0, 0)); }
      if (qiy.t <= 0) { qiy.on = false; qiy.next = 60 + Math.random() * 30; sur.visible = false; waves.forEach(w => w.material.opacity = 0); moon.visible = true; craters.forEach(c => c.visible = true); moonL.visible = moonR.visible = false; hud.cap.classList.remove("on"); }
    }

    // camera: follow behind the scorpion, framing the crab, moon and mansion
    st.shake = Math.max(0, st.shake - dt);
    const sh = reduce ? 0 : st.shake;
    camPos.lerp(new THREE.Vector3(pos.x * 0.55, 4.6 + st.crabScale * 1.1, pos.z + 8.5 + st.crabScale * 1.6), 1 - Math.pow(0.002, dt));
    camera.position.set(camPos.x + (Math.random() - 0.5) * sh, camPos.y + (Math.random() - 0.5) * sh, camPos.z);
    look.set((pos.x + crab.position.x) * 0.4, 1.2 + st.crabScale * 1.1, THREE.MathUtils.lerp(pos.z, crab.position.z, 0.62));
    camera.lookAt(look);

    if (msgT > 0 && msgT < 99999) { msgT -= dt * 1000; if (msgT <= 0) hud.msg.classList.remove("on"); }
    composer.render(dt);
    raf = requestAnimationFrame(loop);
  }
  // Re-label the HUD if the visitor switches language
  new MutationObserver(setHud).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  // test hook
  window.__g3 = { st, pos, keys, niceTry, doSting, rain, blood: () => { bloodT = 0; }, inView: () => inView, weapon: k => { weap.next = 0; st.playing = true; }, knives: () => { dual.next = 0; st.playing = true; }, magic: () => { magic.next = 0; st.playing = true; }, qiyamah: () => { qiy.next = 0; } };
}

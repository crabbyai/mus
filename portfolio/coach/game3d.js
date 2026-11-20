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
  en: { eagle: "🦅 A HUGE EAGLE descends with thunder! ⚡", buraq: "✨ Al-Burāq passes across the night sky", defend: "🛡️ The crab defends his wives while they pray", qibla: "They pray towards the Kaaba 🕋", crossfire: "Caught in the crossfire…", inna: "Inna lillahi wa inna ilayhi raji'un: to Allah we belong, and to Him we return (2:156)", beg: ["Make me your wife! 💍", "Pick me, Prince Crab! 🙏", "I'll respect you now! 👸", "Please, I'm begging! 💍"], prince: 'PRINCE CRAB', princess: 'FUTURE PRINCESS', princessSub: 'once she learns to respect the crab', mudhil: 'THE HUMILIATOR', ghani: 'THE RICH ONE', ringT: '12 LAKH WEDDING RING', hammer: "🔨 The Hammer of Justice", justice: "JUSTICE", miss: "MISS", sliced: "Sliced! 🔪", knives: "Twin knives fall for the crab 🔪🔪", push: "✨ Crab magic: pushed away!", pull: "✨ Crab magic: pulled in!", sur: "“And the Trumpet will be blown…” (39:68)", moon: "“The Hour has drawn near, and the moon has split.” (54:1)", round: "Round", hp: "Crab", wealth: "Crab's wealth", mansion: "Mansion", start: "Tap or press a key to play", nice: "Nice try 😏", niceSub: "The crab grows stronger and richer, and the mansion grows.", hit: "Sting!", back: "The crab hits back!", blood: "Blood moon 🐺 Awoooo…", sound: "Sound", sting: "Sting", lvl: "Level", lh: "لا حول ولا قوة إلا بالله" },
  ur: { eagle: "🦅 ایک دیو ہیکل عقاب گرج کے ساتھ اترتا ہے! ⚡", buraq: "✨ البراق رات کے آسمان سے گزرتا ہے", defend: "🛡️ کیکڑا نماز پڑھتی بیویوں کی حفاظت کر رہا ہے", qibla: "وہ کعبہ کی طرف نماز پڑھ رہی ہیں 🕋", crossfire: "کراس فائر کی زد میں…", inna: "إنا للہ وإنا إلیہ راجعون: ہم اللہ کے ہیں اور اسی کی طرف لوٹنے والے ہیں (2:156)", beg: ["مجھے اپنی بیوی بنا لو! 💍", "مجھے چن لو، شہزادہ کیکڑا! 🙏", "اب میں عزت کروں گی! 👸", "پلیز، میں منت کرتی ہوں! 💍"], prince: 'شہزادہ کیکڑا', princess: 'مستقبل کی شہزادی', princessSub: 'جب وہ کیکڑے کا احترام سیکھ لے', mudhil: 'ذلیل کرنے والا', ghani: 'بے نیاز، غنی', ringT: '12 لاکھ کی شادی کی انگوٹھی', hammer: '🔨 انصاف کا ہتھوڑا', justice: 'انصاف', miss: 'MISS', sliced: 'کٹ گیا! 🔪', knives: 'کیکڑے کے لیے دو چاقو گرے 🔪🔪', push: '✨ کیکڑے کا جادو: دور دھکیل دیا!', pull: '✨ کیکڑے کا جادو: کھینچ لیا!', sur: '”اور صور پھونکا جائے گا…“ (39:68)', moon: '”قیامت قریب آ گئی اور چاند پھٹ گیا۔“ (54:1)', round: "راؤنڈ", hp: "کیکڑا", wealth: "کیکڑے کی دولت", mansion: "محل", start: "کھیلنے کے لیے ٹیپ کریں یا کوئی بٹن دبائیں", nice: "اچھی کوشش 😏", niceSub: "کیکڑا مزید طاقتور اور امیر ہو گیا، اور محل بڑا ہو گیا۔", hit: "ڈنک!", back: "کیکڑے نے جوابی وار کیا!", blood: "خونی چاند 🐺 آؤووو…", sound: "آواز", sting: "ڈنک", lvl: "لیول", lh: "لا حول ولا قوۃ الا باللہ" },
  ar: { eagle: "🦅 نسرٌ ضخم يهبط مع الرعد! ⚡", buraq: "✨ البُراق يعبر سماء الليل", defend: "🛡️ السلطعون يحمي زوجاته وهنّ يصلّين", qibla: "يصلّين نحو الكعبة 🕋", crossfire: "وقعن في تبادل إطلاق النار…", inna: "إنا لله وإنا إليه راجعون (2:156)", beg: ["اجعلني زوجتك! 💍", "اخترني يا أمير السلطعون! 🙏", "سأحترمك الآن! 👸", "أرجوك، أتوسّل إليك! 💍"], prince: 'الأمير السلطعون', princess: 'الأميرة المستقبلية', princessSub: 'حين تتعلّم احترام السلطعون', mudhil: 'المُذِلّ', ghani: 'الغنيّ', ringT: 'خاتم زواج بـ 12 لاكه', hammer: '🔨 مطرقة العدل', justice: 'عدالة', miss: 'MISS', sliced: 'تقطّع! 🔪', knives: 'سكينان يسقطان للسلطعون 🔪🔪', push: '✨ سحر السلطعون: دُفع بعيدًا!', pull: '✨ سحر السلطعون: سُحب إليه!', sur: '«ونُفخ في الصور…» (39:68)', moon: '«اقتربت الساعة وانشق القمر» (54:1)', round: "الجولة", hp: "السلطعون", wealth: "ثروة السلطعون", mansion: "القصر", start: "اضغط أو اضغط زرًا لتلعب", nice: "محاولة جيدة 😏", niceSub: "السلطعون يزداد قوة وثراء، والقصر يكبر.", hit: "لسعة!", back: "السلطعون يردّ الضربة!", blood: "قمر دموي 🐺 أووو…", sound: "الصوت", sting: "لسعة", lvl: "المستوى", lh: "لا حول ولا قوة إلا بالله" },
  fr: { eagle: "🦅 Un AIGLE GÉANT descend dans le tonnerre ! ⚡", buraq: "✨ Al-Bouraq traverse le ciel nocturne", defend: "🛡️ Le crabe protège ses épouses pendant leur prière", qibla: "Elles prient vers la Kaaba 🕋", crossfire: "Prises entre deux feux…", inna: "Inna lillahi wa inna ilayhi raji'un : nous sommes à Allah et c'est à Lui que nous retournerons (2:156)", beg: ["Fais de moi ta femme ! 💍", "Choisis-moi, Prince Crabe ! 🙏", "Je te respecterai maintenant ! 👸", "S'il te plaît, je t'en supplie ! 💍"], prince: 'PRINCE CRABE', princess: 'FUTURE PRINCESSE', princessSub: 'quand elle apprendra à respecter le crabe', mudhil: 'CELUI QUI HUMILIE', ghani: 'LE RICHE', ringT: 'BAGUE DE MARIAGE DE 12 LAKHS', hammer: '🔨 Le Marteau de la Justice', justice: 'JUSTICE', miss: 'RATÉ', sliced: 'Tranché ! 🔪', knives: 'Deux couteaux tombent pour le crabe 🔪🔪', push: '✨ Magie du crabe : repoussé !', pull: '✨ Magie du crabe : attiré !', sur: '« Et l’on soufflera dans la Trompe… » (39:68)', moon: '« L’Heure approche et la lune s’est fendue. » (54:1)', round: "Manche", hp: "Crabe", wealth: "Fortune du crabe", mansion: "Manoir", start: "Touchez ou appuyez sur une touche pour jouer", nice: "Bien essayé 😏", niceSub: "Le crabe devient plus fort et plus riche, et le manoir grandit.", hit: "Piqûre !", back: "Le crabe riposte !", blood: "Lune de sang 🐺 Aouuu…", sound: "Son", sting: "Piquer", lvl: "Niveau", lh: "لا حول ولا قوة إلا بالله" },
  es: { eagle: "🦅 ¡Un ÁGUILA ENORME desciende con truenos! ⚡", buraq: "✨ Al-Buraq cruza el cielo nocturno", defend: "🛡️ El cangrejo defiende a sus esposas mientras rezan", qibla: "Rezan hacia la Kaaba 🕋", crossfire: "Atrapadas en el fuego cruzado…", inna: "Inna lillahi wa inna ilayhi raji'un: a Allah pertenecemos y a Él volveremos (2:156)", beg: ["¡Hazme tu esposa! 💍", "¡Elígeme, Príncipe Cangrejo! 🙏", "¡Ahora te respetaré! 👸", "¡Por favor, te lo suplico! 💍"], prince: 'PRÍNCIPE CANGREJO', princess: 'FUTURA PRINCESA', princessSub: 'cuando aprenda a respetar al cangrejo', mudhil: 'EL QUE HUMILLA', ghani: 'EL RICO', ringT: 'ANILLO DE BODA DE 12 LAKH', hammer: '🔨 El Martillo de la Justicia', justice: 'JUSTICIA', miss: 'FALLO', sliced: '¡Rebanado! 🔪', knives: 'Dos cuchillos caen para el cangrejo 🔪🔪', push: '✨ Magia del cangrejo: ¡empujado!', pull: '✨ Magia del cangrejo: ¡atraído!', sur: '«Y se soplará la Trompeta…» (39:68)', moon: '«Se acercó la Hora y se partió la luna.» (54:1)', round: "Ronda", hp: "Cangrejo", wealth: "Fortuna del cangrejo", mansion: "Mansión", start: "Toca o pulsa una tecla para jugar", nice: "Buen intento 😏", niceSub: "El cangrejo se vuelve más fuerte y más rico, y la mansión crece.", hit: "¡Picadura!", back: "¡El cangrejo contraataca!", blood: "Luna de sangre 🐺 Auuuu…", sound: "Sonido", sting: "Picar", lvl: "Nivel", lh: "لا حول ولا قوة إلا بالله" },
  ja: { eagle: "🦅 巨大なワシが雷とともに舞い降りる！⚡", buraq: "✨ ブラークが夜空を駆け抜ける", defend: "🛡️ 祈る妻たちをカニが守る", qibla: "彼女たちはカアバに向かって祈る 🕋", crossfire: "流れ弾に巻き込まれて…", inna: "インナー・リッラーヒ・ワ・インナー・イライヒ・ラージウーン：私たちはアッラーのもの、そして彼のもとへ帰る（2:156）", beg: ["私を妻にして！💍", "私を選んで、カニ王子！🙏", "これからは敬います！👸", "お願い、どうか！💍"], prince: 'カニ王子', princess: '未来のプリンセス', princessSub: 'カニを敬うことを学んだら', mudhil: '辱める御方', ghani: '富める御方', ringT: '12ラーフの結婚指輪', hammer: '🔨 正義のハンマー', justice: '正義', miss: 'MISS', sliced: '斬られた！🔪', knives: 'カニのもとに2本のナイフが落ちてきた 🔪🔪', push: '✨ カニの魔法：吹き飛ばされた！', pull: '✨ カニの魔法：引き寄せられた！', sur: '「そしてラッパが吹かれる…」（39:68）', moon: '「時は近づき、月は裂けた。」（54:1）', round: "ラウンド", hp: "カニ", wealth: "カニの財産", mansion: "豪邸", start: "タップかキーでスタート", nice: "惜しい 😏", niceSub: "カニはさらに強く豊かになり、豪邸も大きくなった。", hit: "刺した！", back: "カニの反撃！", blood: "血の月 🐺 アオーン…", sound: "サウンド", sting: "刺す", lvl: "レベル", lh: "لا حول ولا قوة إلا بالله" },
  zh: { eagle: "🦅 一只巨鹰伴着雷霆降临！⚡", buraq: "✨ 神驹布拉格划过夜空", defend: "🛡️ 螃蟹在妻子们礼拜时保护她们", qibla: "她们朝向克尔白礼拜 🕋", crossfire: "被卷入交火之中……", inna: "我们确是属于安拉的，我们必定归依他（2:156）", beg: ["让我做你的妻子吧！💍", "选我吧，螃蟹王子！🙏", "我现在会尊重你了！👸", "求求你了！💍"], prince: '螃蟹王子', princess: '未来的公主', princessSub: '等她学会尊重螃蟹', mudhil: '使人卑贱者', ghani: '富足者', ringT: '12拉克的结婚戒指', hammer: '🔨 正义之锤', justice: '公正', miss: 'MISS', sliced: '被砍了！🔪', knives: '两把刀为螃蟹落下 🔪🔪', push: '✨ 螃蟹魔法：被推开了！', pull: '✨ 螃蟹魔法：被拉过去了！', sur: '“号角将被吹响……”（39:68）', moon: '“复活时已临近了，月亮已破裂了。”（54:1）', round: "回合", hp: "螃蟹", wealth: "螃蟹的财富", mansion: "豪宅", start: "点击或按任意键开始", nice: "不错的尝试 😏", niceSub: "螃蟹变得更强更富，豪宅也更大了。", hit: "蜇中！", back: "螃蟹反击了！", blood: "血月 🐺 嗷呜…", sound: "声音", sting: "蜇", lvl: "等级", lh: "لا حول ولا قوة إلا بالله" },
  ko: { eagle: "🦅 거대한 독수리가 천둥과 함께 내려온다! ⚡", buraq: "✨ 부라크가 밤하늘을 가로지른다", defend: "🛡️ 게가 기도하는 아내들을 지킨다", qibla: "그녀들은 카바를 향해 기도한다 🕋", crossfire: "교전에 휘말려…", inna: "인나 릴라히 와 인나 일라이히 라지운: 우리는 알라께 속하며 그분께로 돌아갑니다 (2:156)", beg: ["저를 아내로 삼아 주세요! 💍", "저를 골라 주세요, 게 왕자님! 🙏", "이제 존중할게요! 👸", "제발요, 빌게요! 💍"], prince: '게 왕자', princess: '미래의 공주', princessSub: '게를 존중하는 법을 배우면', mudhil: '낮추시는 분', ghani: '부유하신 분', ringT: '12라크 결혼반지', hammer: '🔨 정의의 망치', justice: '정의', miss: 'MISS', sliced: '베였다! 🔪', knives: '게를 위해 쌍칼이 떨어진다 🔪🔪', push: '✨ 게의 마법: 밀려났다!', pull: '✨ 게의 마법: 끌려갔다!', sur: '“나팔이 불리리라…” (39:68)', moon: '“그 시간이 다가왔고 달이 갈라졌다.” (54:1)', round: "라운드", hp: "게", wealth: "게의 재산", mansion: "저택", start: "탭하거나 키를 눌러 시작", nice: "좋은 시도였어요 😏", niceSub: "게는 더 강하고 부유해졌고, 저택도 커졌습니다.", hit: "쏘기!", back: "게의 반격!", blood: "블러드 문 🐺 아우우…", sound: "소리", sting: "쏘기", lvl: "레벨", lh: "لا حول ولا قوة إلا بالله" }
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
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.6 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;   // tone mapping happens in the final pass
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
  const finalPass = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, exposure: { value: 1.1 }, time: { value: 0 }, vig: { value: 0.55 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: "uniform sampler2D tDiffuse; uniform float exposure, time, vig; varying vec2 vUv;" +
      "vec3 aces(vec3 x){ x *= 0.6; return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }" +
      "vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(c, vec3(1.0/2.4))-0.055, step(vec3(0.0031308), c)); }" +
      "void main(){ vec2 d = vUv-0.5; float r = dot(d,d); vec3 c; c.r = texture2D(tDiffuse, vUv+d*0.006).r; c.g = texture2D(tDiffuse, vUv).g; c.b = texture2D(tDiffuse, vUv-d*0.006).b;" +
      " c = aces(c*exposure); c *= 1.0 - vig*r*1.7; float n = fract(sin(dot(vUv*vec2(1231.7,977.3)+time, vec2(12.9898,78.233)))*43758.5453); c += (n-0.5)*0.016;" +
      " gl_FragColor = vec4(toSRGB(clamp(c,0.0,1.0)), 1.0); }"
  });
  composer.addPass(finalPass);

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
  key.castShadow = true; key.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048); key.shadow.bias = -0.0006; key.shadow.normalBias = 0.03;
  Object.assign(key.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 120 }); key.target.position.set(0, 0, -8); scene.add(key.target);
  const shadowy = o => o.traverse(m => { if (m.isMesh && !m.material.transparent) { m.castShadow = true; m.receiveShadow = true; } });
  const rim = new THREE.DirectionalLight(0x9fb8ff, 0.6); rim.position.set(-20, 10, -10); scene.add(rim);

  /* ---------- ground, road, hills ---------- */
  function noiseTex(base, spread, rep, cracks) {
    const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d"); const img = g.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) { const n = (Math.random() - 0.5) * spread; img.data[i] = base[0] + n; img.data[i + 1] = base[1] + n; img.data[i + 2] = base[2] + n; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
    if (cracks) { g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 1; for (let k = 0; k < 14; k++) { g.beginPath(); let x = Math.random() * 256, y = Math.random() * 256; g.moveTo(x, y); for (let j = 0; j < 6; j++) { x += (Math.random() - 0.5) * 40; y += (Math.random() - 0.5) * 40; g.lineTo(x, y); } g.stroke(); } }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshStandardMaterial({ map: noiseTex([46, 33, 22], 26, [90, 90], true), roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(12, 140), new THREE.MeshStandardMaterial({ map: noiseTex([40, 43, 52], 30, [3, 34], true), roughness: 0.55, metalness: 0.15 }));
  road.rotation.x = -Math.PI / 2; road.position.set(0, 0.01, -30); road.receiveShadow = true; scene.add(road);
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
    mansion.position.set(0, 0, -30 - level * 3.5); shadowy(mansion);
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
  const amber = new THREE.MeshStandardMaterial({ color: 0x8a3fd0, roughness: 0.3, metalness: 0.35, emissive: 0x24063a });
  const amberDark = new THREE.MeshStandardMaterial({ color: 0x4a1f78, roughness: 0.45 });
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
      if (suck > 0) { const tg = suckTarget[i & 1]; o.p.lerp(tg, Math.min(1, dt * (2.5 + (1 - suck) * 6))); o.r.y += dt * 10; if (o.p.distanceToSquared(tg) < 2.5) { o.on = false; P.m.setMatrixAt(i, hide); continue; } tmpM.compose(o.p, tmpQ.setFromEuler(o.r), tmpS); P.m.setMatrixAt(i, tmpM); continue; }
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
  { const horn = new THREE.Mesh(new THREE.ConeGeometry(3.2, 26, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0xf2d28a, metalness: 1, roughness: 0.2, emissive: 0xc8962a, emissiveIntensity: 0.8, side: THREE.DoubleSide, fog: false })); horn.rotation.z = -Math.PI / 2; sur.add(horn);
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.35, 12, 40), goldMat); mouth.position.x = -13; mouth.rotation.y = Math.PI / 2; sur.add(mouth);
    const bands = [-4, 3, 8].map(x => { const b2 = new THREE.Mesh(new THREE.TorusGeometry(3.2 * (13 - x) / 26 + 0.2, 0.18, 8, 32), goldMat); b2.position.x = x; b2.rotation.y = Math.PI / 2; sur.add(b2); return b2; }); }
  const surGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(255,245,210,0.9)", "rgba(255,245,210,0)"), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
  surGlow.scale.set(18, 18, 1); surGlow.position.x = -15; sur.add(surGlow);
  // feathered wing texture, shared by the angel and Al-Buraq
  const wingTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d");
    const feather = (x, y, len, wid, ang, a) => { g.save(); g.translate(x, y); g.rotate(ang); const gr = g.createLinearGradient(0, 0, -len, 0); gr.addColorStop(0, "rgba(255,248,230," + a + ")"); gr.addColorStop(0.7, "rgba(255,236,190," + a + ")"); gr.addColorStop(1, "rgba(232,200,126," + a * 0.8 + ")"); g.fillStyle = gr; g.beginPath(); g.ellipse(-len / 2, 0, len / 2, wid, 0, 0, 6.2832); g.fill(); g.strokeStyle = "rgba(200,160,90," + a * 0.5 + ")"; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 0); g.lineTo(-len * 0.95, 0); g.stroke(); g.restore(); };
    for (let k = 0; k < 11; k++) feather(236, 214, 150 + k * 7, 13, 0.15 + k * 0.12, 0.95);
    for (let k = 0; k < 9; k++) feather(236, 214, 90 + k * 5, 11, 0.2 + k * 0.15, 1);
    for (let k = 0; k < 7; k++) feather(236, 214, 52, 10, 0.25 + k * 0.2, 1);
    return new THREE.CanvasTexture(c); })();
  const wingMat = new THREE.MeshBasicMaterial({ map: wingTex, transparent: true, side: THREE.DoubleSide, depthWrite: false, fog: false });
  // the angel blowing the Trumpet: a radiant figure of light with great wings (no facial features)
  const angel = new THREE.Group(); {
    const light = new THREE.MeshStandardMaterial({ color: 0xfff6e0, emissive: 0xfff0d0, emissiveIntensity: 0.55, roughness: 0.6, fog: false });
    const robe = new THREE.Mesh(new THREE.ConeGeometry(3.6, 13, 24), light); robe.position.y = -6.5; angel.add(robe);
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.2, 3.6, 20), light); chest.position.y = -0.8; angel.add(chest);
    const head = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 18), light); head.position.set(-0.6, 2.2, 0); angel.add(head);
    [[-3.5, 0.4, 0.9], [-4.6, -0.2, -0.9]].forEach(a => { const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 5.2, 10), light); arm.position.set(a[0], a[1], a[2]); arm.rotation.z = Math.PI / 2 - 0.25; angel.add(arm); });
    [-1, 1].forEach(sd => { const w = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), wingMat); w.position.set(sd * 8.5, 5, -1.2); w.scale.x = -sd; w.userData.sd = sd; angel.add(w); });
    const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(255,250,235,0.85)", "rgba(255,250,235,0)"), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })); aura.scale.set(30, 30, 1); aura.material.opacity = 0.35; aura.position.y = 2; angel.add(aura);
  }
  angel.position.set(15.8, -1.9, 0); sur.add(angel);
  const surPos = toSky(-26, 13.2, 150);
  const craters = scene.children.filter(o => o.userData.moon); sur.position.copy(surPos); sur.lookAt(0, 0, 0); sur.rotateZ(-0.12); sur.visible = false; scene.add(sur);
  const waves = [0, 1, 2].map(() => { const w = new THREE.Mesh(new THREE.RingGeometry(1, 1.04, 96), new THREE.MeshBasicMaterial({ color: 0xfff2c8, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); w.position.copy(surPos); w.lookAt(0, 0, 0); scene.add(w); return w; });
  const halfMat = moonMat;
  const moonL = new THREE.Mesh(new THREE.SphereGeometry(15, 32, 24, Math.PI * 1.5, Math.PI), halfMat), moonR = new THREE.Mesh(new THREE.SphereGeometry(15, 32, 24, Math.PI * 0.5, Math.PI), halfMat);
  [moonL, moonR].forEach(h => { h.position.copy(moonPos); h.visible = false; scene.add(h); });
  const buraq = new THREE.Group(); {
    const coat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xbfd6ff, emissiveIntensity: 0.55, roughness: 0.4, fog: false });
    const gold = new THREE.MeshBasicMaterial({ color: 0xffd77a, fog: false });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(1.5, 4.2, 8, 16), coat); body.rotation.z = Math.PI / 2; buraq.add(body);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 1.05, 3.2, 12), coat); neck.position.set(3.2, 1.7, 0); neck.rotation.z = -0.7; buraq.add(neck);
    const head = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.1, 1.1), coat); head.position.set(4.6, 3.0, 0); head.rotation.z = -0.35; buraq.add(head);
    [-0.35, 0.35].forEach(z => { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.7, 6), coat); ear.position.set(4.0, 3.8, z); buraq.add(ear); });
    const mane = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.2, 0.5), gold); mane.position.set(2.6, 2.4, 0); mane.rotation.z = -0.7; buraq.add(mane);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.6, 3.6, 10), gold); tail.position.set(-4.4, 0.2, 0); tail.rotation.z = -2.2; buraq.add(tail);
    buraq.userData.legs = [[2, 0.6], [2, -0.6], [-2.2, 0.6], [-2.2, -0.6]].map(([x, z]) => { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 3.2, 8), coat); leg.geometry.translate(0, -1.6, 0); leg.position.set(x, -0.8, z); buraq.add(leg); return leg; });
    buraq.userData.wings = [-1, 1].map(sd => { const w = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), wingMat); w.position.set(-0.5, 4.2, sd * 0.4); w.rotation.y = Math.PI; w.scale.x = sd; buraq.add(w); return w; });
    const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(210,230,255,0.8)", "rgba(210,230,255,0)"), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })); aura.scale.set(9, 9, 1); aura.material.opacity = 0.5; buraq.add(aura);
    buraq.userData.trail = Array.from({ length: 7 }, (_, k) => { const t = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(255,240,200,0.7)", "rgba(255,240,200,0)"), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, opacity: 0.8 - k * 0.1 })); t.scale.setScalar(6 - k * 0.6); scene.add(t); t.visible = false; return t; });
  }
  buraq.scale.setScalar(2.4); buraq.visible = false; scene.add(buraq);
  const flight = { on: false, t: 0, next: 30 + Math.random() * 25, dir: 1 };
  const split = { on: false, t: 0, next: 38 + Math.random() * 20 };
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
  /* ---------- DIAMOND DIGGER, lit up in the sky while the crab is on a rampage ---------- */
  { const c = document.createElement("canvas"); c.width = 1024; c.height = 160; const g = c.getContext("2d"); g.font = "bold 104px Georgia, serif"; g.textAlign = "center"; g.shadowColor = "#7fe8ff"; g.shadowBlur = 34; g.fillStyle = "#e9fbff"; g.fillText("💎 DIAMOND DIGGER 💎", 512, 118);
    const dd = new THREE.Mesh(new THREE.PlaneGeometry(150, 23.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, fog: false, opacity: 0 }));
    if (small) dd.scale.setScalar(0.9); dd.userData.base = dd.scale.x; dd.position.copy(toSky(-3.5, 15.5, 470)); dd.lookAt(0, 0, 0); scene.add(dd); fx.dd = dd; }

  /* ---------- palms lining the road, and the ROYAL ORCHARD gate behind the crab ---------- */
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2a, roughness: 0.9 }), leafMat = new THREE.MeshStandardMaterial({ color: 0x1f7a3a, roughness: 0.7 });
  const shrinkables = [sign];
  function palmTree(x, z, h) {
    const g = new THREE.Group(); const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, h, 8), trunkMat); trunk.position.y = h / 2; g.add(trunk);
    for (let i = 0; i < 7; i++) { const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.45, 3.6, 5), leafMat); const a = i / 7 * 6.28; leaf.position.set(Math.cos(a) * 1.4, h + 0.1, Math.sin(a) * 1.4); leaf.rotation.set(Math.sin(a) * 1.2, 0, -Math.cos(a) * 1.2); g.add(leaf); }
    g.position.set(x, 0, z); g.rotation.z = (Math.random() - 0.5) * 0.12; scene.add(g); shrinkables.push(g); shadowy(g);
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
    gate.position.set(0, 0, -23); scene.add(gate); shrinkables.push(gate);
  }

  /* ---------- the crab's four wives: party dress, then hijab, then niqab ---------- */
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xc99272, roughness: 0.6 });
  const PARTY = [0xe8c87e, 0xff4fa3, 0x2fd39a, 0x9b5cff], HIJAB = [0x0c0c10, 0x101015, 0x0e0e13, 0x121217];
  function makeWife(i, stage) {
    const w = new THREE.Group();
    const col = stage === 0 ? PARTY[i] : stage === 1 ? HIJAB[i] : 0x111118;
    const cloth = new THREE.MeshStandardMaterial({ color: col, roughness: stage === 0 ? 0.25 : 0.62, metalness: stage === 0 ? 0.6 : 0.08, emissive: stage === 0 ? col : 0x000000, emissiveIntensity: stage === 0 ? 0.15 : 0 });
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
      if (stage === 2) { const veil = new THREE.Mesh(new THREE.SphereGeometry(0.33, 18, 12, -0.9, 1.8, Math.PI * 0.42, Math.PI * 0.5), cloth); veil.position.y = 2.8; w.add(veil); const slit = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.05), skinMat); slit.position.set(0, 2.86, 0.34); w.add(slit); [-1, 1].forEach(sd => { const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshBasicMaterial({ color: 0x000000 })); eye.position.set(sd * 0.08, 2.86, 0.37); w.add(eye); }); }
    }
    const upper = new THREE.Group(); upper.position.y = 1.75;
    w.children.slice().forEach(c => { if (c !== gown) { w.remove(c); c.position.y -= 1.75; upper.add(c); } });
    w.add(upper); w.userData.upper = upper; w.userData.gown = gown; shadowy(w);
    return w;
  }
  const wives = new THREE.Group(); scene.add(wives);
  let alive = [0, 1, 2, 3];
  function buildWives(round) {
    while (wives.children.length) wives.remove(wives.children[0]);
    const stage = Math.min(2, round);
    [-2, -1, 1, 2].forEach((slot, i) => { if (alive.indexOf(i) < 0) return; const w = makeWife(i, stage); w.userData.slot = slot; w.userData.i = i; wives.add(w); });
  }
  buildWives(0);

  const stemMat = new THREE.MeshStandardMaterial({ color: 0x2f7a3a }), budMat = new THREE.MeshStandardMaterial({ color: 0xc8102e, roughness: 0.45, emissive: 0x2a0008 });
  /* ---------- magician bunny rabbits hopping on the road: top hat, wand, a rose in the mouth ---------- */
  const bunnies = [];
  { const fur = new THREE.MeshStandardMaterial({ color: 0xf4f1ec, roughness: 0.9 }), furShade = new THREE.MeshStandardMaterial({ color: 0xe2dcd2, roughness: 0.95 }),
      pink = new THREE.MeshStandardMaterial({ color: 0xffa6c4, roughness: 0.7 }), eyeM = new THREE.MeshStandardMaterial({ color: 0x120608, roughness: 0.15 }),
      hatM = new THREE.MeshStandardMaterial({ color: 0x0c0c10, roughness: 0.35, metalness: 0.2 }), bandM = new THREE.MeshStandardMaterial({ color: 0xc8102e, roughness: 0.5 }),
      wandM = new THREE.MeshStandardMaterial({ color: 0x0c0c10, roughness: 0.3 }), tipM = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6 }),
      starM = new THREE.MeshStandardMaterial({ color: 0xffd77a, emissive: 0xffc030, emissiveIntensity: 1.2, metalness: 0.6, roughness: 0.2 }),
      whisk = new THREE.LineBasicMaterial({ color: 0x9a9a9a });
    const starShape = new THREE.Shape(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 0.07 : 0.17, a = k / 10 * Math.PI * 2 + Math.PI / 2; k ? starShape.lineTo(Math.cos(a) * r, Math.sin(a) * r) : starShape.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.04, bevelEnabled: false });
    for (let i = 0; i < 3; i++) {
      const b2 = new THREE.Group(), add = (m, x, y, z) => { m.position.set(x, y, z); b2.add(m); return m; };
      const body = add(new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 16), fur), 0, 0.62, -0.1); body.scale.set(0.9, 0.95, 1.25); body.rotation.x = -0.35;
      add(new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 12), fur), 0, 0.95, 0.32).scale.set(0.85, 0.9, 0.8);                // chest
      [-1, 1].forEach(sd => {
        const haunch = add(new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12), furShade), sd * 0.36, 0.42, -0.35); haunch.scale.set(0.6, 1, 1.25);
        const foot = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.42, 4, 10), fur), sd * 0.36, 0.09, -0.05); foot.rotation.x = Math.PI / 2;   // long hind feet
        add(new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.3, 4, 8), fur), sd * 0.17, 0.42, 0.42);                             // front paws
      });
      add(new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 })), 0, 0.72, -0.82);   // cotton tail
      const head = new THREE.Group(); head.position.set(0, 1.38, 0.42); b2.add(head);
      const skull = new THREE.Mesh(new THREE.SphereGeometry(0.33, 20, 16), fur); skull.scale.set(0.9, 0.88, 1.05); head.add(skull);
      const snout = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), fur); snout.scale.set(1, 0.8, 0.9); snout.position.set(0, -0.08, 0.24); head.add(snout);
      [-1, 1].forEach(sd => { const ch = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), fur); ch.position.set(sd * 0.09, -0.12, 0.33); head.add(ch); });
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), pink); nose.scale.set(1.2, 0.8, 0.8); nose.position.set(0, -0.03, 0.42); head.add(nose);
      [-1, 1].forEach(sd => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), eyeM); eye.position.set(sd * 0.2, 0.07, 0.2); head.add(eye);
        const glint = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), tipM); glint.position.set(sd * 0.21, 0.1, 0.26); head.add(glint);
        const ear = new THREE.Group(); ear.position.set(sd * 0.13, 0.26, -0.05); ear.rotation.set(-0.2, 0, sd * 0.22); head.add(ear);
        const outer = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.58, 4, 10), fur); outer.scale.z = 0.45; outer.position.y = 0.36; ear.add(outer);
        const inner = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.48, 4, 8), pink); inner.scale.z = 0.3; inner.position.set(0, 0.36, 0.03); ear.add(inner);
        for (let k = -1; k <= 1; k++) { const g2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(sd * 0.1, -0.08 + k * 0.03, 0.36), new THREE.Vector3(sd * 0.42, -0.04 + k * 0.08, 0.3)]); head.add(new THREE.Line(g2, whisk)); }
      });
      // a red rose held in the mouth
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.6, 6), stemMat); stem.rotation.z = Math.PI / 2; stem.position.set(0.12, -0.17, 0.4); head.add(stem);
      const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 12), new THREE.MeshStandardMaterial({ color: 0xe0102e, emissive: 0x6a0010, emissiveIntensity: 0.8, roughness: 0.4 })); bloom.scale.set(1, 1.15, 1); bloom.position.set(0.48, -0.15, 0.42); head.add(bloom);
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), stemMat); leaf.scale.set(1.6, 0.4, 0.9); leaf.position.set(0.25, -0.13, 0.42); head.add(leaf);
      // magician's top hat
      const hat = new THREE.Group(); hat.position.set(0.02, 0.27, 0.02); hat.rotation.z = -0.18; head.add(hat);
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.03, 24), hatM); hat.add(brim);
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.2, 0.4, 24), hatM); crown.position.y = 0.21; hat.add(crown);
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.07, 24), bandM); band.position.y = 0.06; hat.add(band);
      // magic wand in the right paw, sparkling star at the tip
      const wand = new THREE.Group(); wand.position.set(0.3, 0.55, 0.55); wand.rotation.set(0.3, 0, -0.75); wand.scale.setScalar(1.6); b2.add(wand);
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.7, 8), wandM); rod.position.y = 0.35; wand.add(rod);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.1, 8), tipM); cap.position.y = 0.66; wand.add(cap);
      const star = new THREE.Mesh(starGeo, starM); star.position.set(0, 0.82, -0.02); wand.add(star);
      const spark = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(255,230,140,0.95)", "rgba(255,230,140,0)"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); spark.scale.setScalar(1.3); spark.position.y = 0.82; wand.add(spark);
      shadowy(b2); b2.scale.setScalar(0.85);
      b2.userData = { sp: 3.5 + Math.random() * 2.5, z: 6 - Math.random() * 24, ph: Math.random() * 6, dir: i % 2 ? 1 : -1, wand, star, spark, head };
      b2.position.set(-14 + i * 12, 0, b2.userData.z); scene.add(b2); bunnies.push(b2);
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
  let rampage = 0;
  function crabHits(list) { rampage = 4.5; if (Math.random() < 0.65) loveStruck(); dmg(typeof list === "string" ? list : pick(list), pos.clone().add(new THREE.Vector3(0, 2, 0)), "crab"); adl(); }

  /* ---------- the Hammer of Justice: AL-ʿADL or AL-ḤAKAM written on its head ---------- */
  function nameTex(en, ar) { const c = document.createElement("canvas"); c.width = 512; c.height = 256; const g = c.getContext("2d"); g.fillStyle = "#2a1608"; g.fillRect(0, 0, 512, 256); g.strokeStyle = "#e8c87e"; g.lineWidth = 14; g.strokeRect(10, 10, 492, 236); g.textAlign = "center"; g.fillStyle = "#ffe7a3"; g.shadowColor = "#ffcf5a"; g.shadowBlur = 16; g.font = "bold 70px Georgia, serif"; g.fillText(en, 256, 110); g.font = "bold 72px serif"; g.fillText(ar, 256, 205); return new THREE.CanvasTexture(c); }
  const hamTex = { adl: nameTex("AL-ʿADL", "العدل"), hakam: nameTex("AL-ḤAKAM", "الحكم") };
  const hamFace = new THREE.MeshStandardMaterial({ map: hamTex.adl, roughness: 0.5, metalness: 0.2, emissive: 0xffffff, emissiveMap: hamTex.adl, emissiveIntensity: 0.35 });
  const hammer = new THREE.Group(); {
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 5.5, 12), new THREE.MeshStandardMaterial({ color: 0x5a3416, roughness: 0.6 })); handle.position.y = 2.75; hammer.add(handle);
    const wood = new THREE.MeshStandardMaterial({ color: 0x4a2a10, roughness: 0.45, metalness: 0.1 });
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 3.2), [goldMat, goldMat, wood, wood, wood, wood]); head.position.y = 5.8; head.rotation.y = Math.PI / 2; hammer.add(head);
    [-1, 1].forEach(sd => { const face = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.45), hamFace); face.position.set(0, 5.8, sd * 0.81); if (sd < 0) face.rotation.y = Math.PI; hammer.add(face); const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.3, 24), goldMat); cap.rotation.z = Math.PI / 2; cap.position.set(sd * 1.7, 5.8, 0); hammer.add(cap); });
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(255,215,120,0.8)", "rgba(255,215,120,0)"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); glow.scale.set(6, 6, 1); glow.position.y = 5.8; hammer.add(glow);
  }
  hammer.position.set(0, 1.4, 0.4); hammer.visible = false; crab.add(hammer);
  const quake = new THREE.Mesh(new THREE.RingGeometry(1, 1.5, 64), new THREE.MeshBasicMaterial({ color: 0xffd77a, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  quake.rotation.x = -Math.PI / 2; quake.position.y = 0.08; scene.add(quake);
  const ham = { phase: "idle", t: 0, next: 28 + Math.random() * 12, fly: 0, vy: 0, qt: 0 };

  /* ---------- fireflies ---------- */
  const FF = small ? 60 : 130, ffPos = new Float32Array(FF * 3), ffSeed = [];
  for (let i = 0; i < FF; i++) { ffSeed.push([(Math.random() - 0.5) * 40, 0.6 + Math.random() * 4, 14 - Math.random() * 50, Math.random() * 6]); }
  const ffGeo = new THREE.BufferGeometry(); ffGeo.setAttribute("position", new THREE.BufferAttribute(ffPos, 3));
  const fireflies = new THREE.Points(ffGeo, new THREE.PointsMaterial({ color: 0xffe08a, size: 0.22, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(fireflies);

  /* ---------- royal name tags: Prince Crab, and the future princess ---------- */
  function tagSprite(main, sub, col, w) {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 256; const g = c.getContext("2d"); g.textAlign = "center";
    g.fillStyle = "rgba(5,8,18,.55)"; g.beginPath(); g.roundRect ? g.roundRect(40, 40, 944, sub ? 176 : 120, 60) : g.rect(40, 40, 944, 176); g.fill();
    g.shadowColor = col; g.shadowBlur = 20; g.fillStyle = col; g.font = "bold 82px Georgia, serif"; g.fillText(main, 512, 128);
    if (sub) { g.shadowBlur = 0; g.fillStyle = "#f6efe0"; g.font = "italic 46px Georgia, serif"; g.fillText(sub, 512, 196); }
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); sp.scale.set(w, w / 4, 1); return sp;
  }
  let tagLang = "", princeTag = null, princessTag = null;
  function royalTags() {
    const l = document.documentElement.lang; if (l === tagLang) return; tagLang = l; const t = tx();
    if (princeTag) crab.remove(princeTag); if (princessTag) scorp.remove(princessTag);
    princeTag = tagSprite("🤴 " + t.prince + " 👑", "", "#ffd77a", 9); princeTag.position.set(0, 4.6, 0); crab.add(princeTag);
    princessTag = tagSprite("👸 " + t.princess, t.princessSub, "#ff9ecf", 2.6); princessTag.position.set(0, 2.5, 0); scorp.add(princessTag);
  }

  /* ---------- the 12 lakh wedding ring, AL-MUDHILL, AL-GHANI and the great suck ---------- */
  const ring = new THREE.Group(); {
    const band = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.22, 20, 64), new THREE.MeshStandardMaterial({ color: 0xffd36a, metalness: 1, roughness: 0.12, emissive: 0x5a3a00 })); ring.add(band);
    const setting = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.4, 0.4, 6), goldMat); setting.position.y = 1.38; ring.add(setting);
    const rock = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), new THREE.MeshStandardMaterial({ color: 0xe9fbff, emissive: 0x6fd6ff, emissiveIntensity: 1.3, roughness: 0, flatShading: true })); rock.scale.set(1, 1.25, 1); rock.position.y = 2.0; ring.add(rock);
    const flare = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(200,245,255,1)", "rgba(200,245,255,0)"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); flare.scale.set(3.2, 3.2, 1); flare.position.y = 2; ring.add(flare);
  }
  ring.visible = false; scene.add(ring);
  let ringTag = null;
  const nameEl = document.createElement("div"); nameEl.className = "g3__name"; root.appendChild(nameEl);
  function nameBanner(en, ar, meaning) { nameEl.innerHTML = "<b>" + en + "</b><span lang='ar'>" + ar + "</span><em>" + meaning + "</em>"; nameEl.classList.remove("on"); void nameEl.offsetWidth; nameEl.classList.add("on"); }
  const seq = { phase: "idle", t: 0, cool: 20 }, act = { v: 0 };
  let omen = 0, shrinkK = 1, mansionK = 1, suck = 0;
  const suckTarget = [new THREE.Vector3(), new THREE.Vector3()];
  function startRing() {
    seq.phase = "fall"; seq.t = 2.4; ring.visible = true; ring.scale.setScalar(1.3);
    if (ringTag) ring.remove(ringTag); ringTag = tagSprite("💍 " + tx().ringT, "₨ 1200000", "#bff4ff", 6); ringTag.position.y = 4; ring.add(ringTag);
    ring.position.set(crab.position.x, 42, crab.position.z + 2 * st.crabScale);
  }

  /* ---------- wolves that close in on the scorpion as the moon darkens ---------- */
  const wolfPack = [];
  { const fur = new THREE.MeshStandardMaterial({ color: 0x5a5a66, roughness: 0.8, emissive: 0x15151c }), eyeM = new THREE.MeshBasicMaterial({ color: 0xff2a1a });
    for (let i = 0; i < 8; i++) {
      const w = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.3, 6, 12), fur); body.rotation.z = Math.PI / 2; body.rotation.y = Math.PI / 2; body.position.y = 1.0; w.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 10), fur); head.position.set(0, 1.35, 1.05); w.add(head);
      const snout = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.55, 10), fur); snout.rotation.x = Math.PI / 2; snout.position.set(0, 1.25, 1.5); w.add(snout);
      [-1, 1].forEach(sd => { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.32, 6), fur); ear.position.set(sd * 0.18, 1.72, 0.98); w.add(ear); const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), eyeM); eye.position.set(sd * 0.14, 1.45, 1.38); w.add(eye); });
      const legs = [];
      [[-0.25, 0.6], [0.25, 0.6], [-0.25, -0.55], [0.25, -0.55]].forEach(([x, z]) => { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.8, 6), fur); leg.position.set(x, 0.4, z); w.add(leg); legs.push(leg); });
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.9, 8), fur); tail.rotation.x = -2.2; tail.position.set(0, 1.15, -1.1); w.add(tail);
      const eg = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(255,40,20,0.9)", "rgba(255,40,20,0)"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); eg.scale.set(0.55, 0.3, 1); eg.position.set(0, 1.45, 1.4); w.add(eg);
      w.visible = false; w.userData = { a: (i % 2 ? 1 : -1) * (0.5 + Math.floor(i / 2) * 0.45), legs, r: 30 };
      w.position.set(0, 0, 40); scene.add(w); wolfPack.push(w);
    }
  }

  /* ---------- 13 and 15, flickering in horror style ---------- */
  const horror = { t: 3 + Math.random() * 4 };
  function flash1315() {
    const el = document.createElement("div"); el.className = "h1315"; el.textContent = Math.random() < 0.5 ? "13" : "15";
    el.style.left = (8 + Math.random() * 84) + "%"; el.style.top = (18 + Math.random() * 64) + "%"; el.style.setProperty("--r", ((Math.random() - 0.5) * 30).toFixed(1) + "deg"); el.style.fontSize = (2.2 + Math.random() * 3.2).toFixed(1) + "rem";
    root.appendChild(el); setTimeout(() => el.remove(), 1500);
  }

  /* ---------- the Kaaba in the background, and the wives' prayer ---------- */
  const kaaba = new THREE.Group(); {
    const kMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.55, metalness: 0.1, fog: false, transparent: true, opacity: 0 });
    const kGold = new THREE.MeshStandardMaterial({ color: 0xe8c87e, metalness: 1, roughness: 0.25, emissive: 0x6a4a10, fog: false, transparent: true, opacity: 0 });
    const cube = new THREE.Mesh(new THREE.BoxGeometry(12, 13, 11), kMat); cube.position.y = 6.5; kaaba.add(cube);
    const band = new THREE.Mesh(new THREE.BoxGeometry(12.15, 1.1, 11.15), kGold); band.position.y = 9.6; kaaba.add(band);
    const door = new THREE.Mesh(new THREE.BoxGeometry(2.2, 4.2, 0.2), kGold); door.position.set(2.5, 4.4, 5.6); kaaba.add(door);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(255,240,200,0.75)", "rgba(255,240,200,0)"), transparent: true, depthWrite: false, fog: false, opacity: 0, blending: THREE.AdditiveBlending })); glow.scale.set(60, 60, 1); glow.position.y = 7; kaaba.add(glow);
    kaaba.userData.mats = [kMat, kGold, glow.material];
  }
  kaaba.position.copy(toSky(-25, 8, 230)); kaaba.position.y -= 12; kaaba.scale.setScalar(2.2); kaaba.lookAt(0, kaaba.position.y, 0); kaaba.rotateY(-0.6); kaaba.visible = false; scene.add(kaaba);
  const shop = { t: 55 + Math.random() * 20, level: 0 };
  const pray = { on: false, t: 0, next: 22 + Math.random() * 12, k: 0 };
  // prayer timeline (seconds): stand, bow (ruku), stand, prostrate (sujud), sit, prostrate, sit and salam
  function pose(t) { return t < 3 ? [0, 0] : t < 5.5 ? [1.35, 0] : t < 6.5 ? [0, 0] : t < 9 ? [1.95, 1] : t < 10 ? [0.15, 0.7] : t < 12.5 ? [1.95, 1] : [0.15, 0.7]; }

  /* ---------- crossfire, and the two scorpions begging to be the crab's wife ---------- */
  const fire = { done: false, t: 0, dying: [] };
  const tracerMat = new THREE.LineBasicMaterial({ color: 0xfff2a0, transparent: true, opacity: 0 });
  const tracers = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(new Float32Array(16 * 6), 3)), tracerMat); scene.add(tracers);
  const beggars = [];
  function bubble(text) {
    const c = document.createElement("canvas"); c.width = 720; c.height = 300; const g = c.getContext("2d");
    g.font = "bold 44px Georgia, serif"; const words = text.split(" "), lines = []; let ln = "";
    words.forEach(wd => { const t2 = ln ? ln + " " + wd : wd; if (g.measureText(t2).width > 640 && ln) { lines.push(ln); ln = wd; } else ln = t2; }); lines.push(ln);
    const L = lines.slice(0, 4), h = 40 + L.length * 54;
    g.fillStyle = "#fff"; g.beginPath(); g.roundRect ? g.roundRect(10, 10, 700, h, 50) : g.rect(10, 10, 700, h); g.fill(); g.beginPath(); g.moveTo(330, h + 8); g.lineTo(360, Math.min(296, h + 56)); g.lineTo(390, h + 8); g.fill();
    g.fillStyle = "#c2185b"; g.textAlign = "center"; L.forEach((l2, k) => g.fillText(l2, 360, 66 + k * 54));
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); sp.scale.set(10.5, 4.4, 1); sp.material.color.setScalar(0.78); return sp;
  }
  const jaan = { t: 9 + Math.random() * 6, phase: 0, who: null, ask: null, rep: null };
  function jaanBubble(text) { const sp = bubble(text); sp.scale.multiplyScalar(0.85); return sp; }
  function spawnBeggars() {
    [-1, 1].forEach((sd, k) => {
      const b2 = scorp.clone(true); b2.children.slice().forEach(c => { if (c.isSprite) b2.remove(c); });
      b2.traverse(m => { if (m.isMesh && !m.userData.carpet) { m.material = m.material.clone(); if (m.material.color) m.material.color.lerp(new THREE.Color(0xff7ab8), 0.45); } });
      b2.scale.setScalar(0.9); shadowy(b2); scene.add(b2);
      const bub = bubble(window.coachBeg ? window.coachBeg(k) : tx().beg[k]); bub.position.set(0, 5.6, 0); b2.add(bub);
      b2.userData = { sd, bub, line: k, t: 2 + k * 1.5 }; beggars.push(b2);
    });
  }
  function crossfire() {
    fire.done = true; fire.t = 1.2;
    const victims = wives.children.filter(w => w.userData.i === 0 || w.userData.i === 3);
    fire.dying = victims.map(w => ({ w, t: 0 }));
    say(tx().crossfire, "", 1600); st.shake = 0.7;
  }

  /* ---------- low mist drifting over the road ---------- */
  const mistTex = glowTex("rgba(190,200,255,0.22)", "rgba(190,200,255,0)");
  const mist = Array.from({ length: small ? 6 : 10 }, (_, i) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: mistTex, transparent: true, depthWrite: false, opacity: 0.5 })); m.scale.set(22, 6, 1); m.position.set((Math.random() - 0.5) * 40, 1.2, 10 - Math.random() * 45); m.userData.v = 0.4 + Math.random() * 0.6; scene.add(m); return m; });

  /* ---------- flag carpets: Canada under Prince Crab, Pakistan under every scorpion ---------- */
  function flagTex(kind) {
    const c = document.createElement("canvas"); c.width = 512; c.height = 256; const g = c.getContext("2d");
    if (kind === "ca") {
      g.fillStyle = "#d52b1e"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#ffffff"; g.fillRect(128, 0, 256, 256);
      const L = [50,5,56,18,63,15,60,38,72,26,75,33,88,30,84,44,92,48,70,66,73,74,52,71,53,92,47,92,48,71,27,74,30,66,8,48,16,44,12,30,25,33,28,26,40,38,37,15,44,18];
      g.fillStyle = "#d52b1e"; g.beginPath(); for (let i = 0; i < L.length; i += 2) { const x = 154 + L[i] * 2.04, y = 20 + L[i + 1] * 2.2; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); g.fill();
    } else {
      g.fillStyle = "#01411c"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#ffffff"; g.fillRect(0, 0, 128, 256);
      g.beginPath(); g.arc(328, 133, 72, 0, 6.2832); g.fill(); g.fillStyle = "#01411c"; g.beginPath(); g.arc(352, 115, 64, 0, 6.2832); g.fill();
      g.fillStyle = "#ffffff"; g.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 10 : 26, a = (-60 + i * 36) * Math.PI / 180; const x = 380 + r * Math.cos(a), y = 92 + r * Math.sin(a); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); g.fill();
    }
    g.strokeStyle = "#e8c87e"; g.lineWidth = 10; g.strokeRect(5, 5, 502, 246);
    const img = g.getImageData(0, 0, 512, 256), d = img.data;   // woven fabric grain
    for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * 22 + ((i / 4) % 2 ? 4 : -4); d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    g.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }
  const caT = flagTex("ca"), pkT = flagTex("pk");
  const caMat = new THREE.MeshStandardMaterial({ map: caT, emissive: 0xffffff, emissiveMap: caT, emissiveIntensity: 0.22, roughness: 0.95 }), pkMat = new THREE.MeshStandardMaterial({ map: pkT, emissive: 0xffffff, emissiveMap: pkT, emissiveIntensity: 0.32, roughness: 0.95 });
  function carpet(mat, w, h, under) {
    const g = new THREE.Group(); const top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, h), [mat, mat, mat, under || mat, mat, mat]); top.position.y = 0.05; top.receiveShadow = true; g.add(top);
    [-1, 1].forEach(sd => { const fr = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, h), goldMat); fr.position.set(sd * (w / 2 + 0.15), 0.04, 0); g.add(fr); });
    // map the flag across the top face only
    top.geometry.attributes.uv.needsUpdate = true; return g;
  }
  const crabCarpet = carpet(caMat, 13, 6.5, pkMat); scene.add(crabCarpet);
  const roadCarpet = carpet(pkMat, 7, 3.5); roadCarpet.position.set(0, 0.01, 7); scene.add(roadCarpet);   // fixed to the road, not to any scorpion

  /* ---------- red Italian superbikes: they multiply and get flashier as the crab keeps winning ---------- */
  const bikeBody = new THREE.MeshPhysicalMaterial({ color: 0xc8100e, metalness: 0.35, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 });
  const bikeDark = new THREE.MeshStandardMaterial({ color: 0x141418, metalness: 0.6, roughness: 0.45 });
  const bikeRim = new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.9, roughness: 0.25 });
  const bikeChrome = new THREE.MeshStandardMaterial({ color: 0xdfe6ee, metalness: 1, roughness: 0.12 });
  const bikeGlass = new THREE.MeshPhysicalMaterial({ color: 0x1a2030, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.55 });
  const tyre = new THREE.MeshStandardMaterial({ color: 0x0b0b0d, roughness: 0.9 });
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff6d8 });
  function makeBike() {
    const b = new THREE.Group();
    const wheel = x => { const w = new THREE.Group(); const t = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.13, 12, 28), tyre); w.add(t); const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 20), bikeRim); rim.rotation.x = Math.PI / 2; w.add(rim); const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 18), bikeChrome); disc.rotation.x = Math.PI / 2; w.add(disc); w.position.set(x, 0.55, 0); b.add(w); return w; };
    b.userData.wheels = [wheel(0.95), wheel(-0.95)];
    const fairing = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 1.2, 6, 14), bikeBody); fairing.rotation.z = Math.PI / 2 + 0.12; fairing.position.set(0.25, 1.05, 0); fairing.scale.set(1, 1, 0.8); b.add(fairing);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 14), bikeBody); nose.rotation.z = -Math.PI / 2 - 0.25; nose.position.set(1.05, 1.0, 0); nose.scale.set(1, 1, 0.75); b.add(nose);
    const tank = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 12), bikeBody); tank.scale.set(1.3, 0.75, 0.85); tank.position.set(0.1, 1.38, 0); b.add(tank);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.95, 12), bikeBody); tail.rotation.z = Math.PI / 2 - 0.3; tail.position.set(-0.75, 1.3, 0); tail.scale.set(1, 1, 0.7); b.add(tail);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.3), bikeDark); seat.position.set(-0.35, 1.42, 0); seat.rotation.z = 0.1; b.add(seat);
    const screen = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), bikeGlass); screen.position.set(0.72, 1.3, 0); screen.rotation.z = -0.9; screen.scale.set(1, 0.7, 0.75); b.add(screen);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), lampMat); lamp.position.set(1.28, 1.02, 0); b.add(lamp);
    const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.75, 8), bikeChrome); fork.position.set(0.88, 0.85, 0); fork.rotation.z = 0.35; b.add(fork);
    const bars = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), bikeDark); bars.rotation.x = Math.PI / 2; bars.position.set(0.55, 1.45, 0); b.add(bars);
    const engine = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.38, 0.32), bikeDark); engine.position.set(0, 0.72, 0); b.add(engine);
    [-1, 1].forEach(sd => { const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.7, 10), bikeChrome); ex.rotation.z = Math.PI / 2 - 0.25; ex.position.set(-0.7, 1.02, sd * 0.13); b.add(ex); });
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(255,40,40,0.8)", "rgba(255,40,40,0)"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); glow.scale.set(3.2, 1.1, 1); glow.position.y = 0.1; glow.visible = false; b.add(glow); b.userData.glow = glow;
    const pod = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 1, 28), goldMat); pod.position.y = -0.5; b.add(pod); b.userData.pod = pod;
    shadowy(b); return b;
  }
  const bikes = [], bikeSpawn = { cool: 2, tier: -1 };
  function bikeSlot(i) {   // a showroom fan behind the crab, then rows along the mansion's driveway
    const side = i % 2 ? 1 : -1, k = Math.floor(i / 2);
    if (k < 3) return [crab.position.x * 0.5 + side * (4.2 + k * 3.4) * Math.max(1, st.crabScale * 0.6), crab.position.z - 6 - 1.4 * st.crabScale, side, 2.2 + k * 0.5];
    return [side * (5 + (k - 3) * 3.1), mansion.position.z + 10 * mansionK, side, 0.6];
  }
  function bikeTier() { return Math.min(3, Math.floor(st.round / 1) + (omen >= 3 ? 1 : 0)); }
  function styleBikes(t) {   // cooler with every tier: gold rims, chrome, neon underglow, bigger bikes
    bikeRim.color.set(t >= 1 ? 0xe8c87e : 0x1a1a1e); bikeRim.emissive && bikeRim.emissive.set(t >= 1 ? 0x3a2a08 : 0x000000);
    bikeBody.color.set(t >= 3 ? 0xe0120f : 0xc8100e); bikeBody.sheenColor && (bikeBody.sheen = t >= 2 ? 1 : 0);
    bikes.forEach(b2 => { b2.userData.glow.visible = t >= 2; b2.userData.base = 1.7 + t * 0.2; });
  }

  /* ---------- the carpet flip, and the pind (village) that appears with it ---------- */
  const flip = { t: 0, next: 35 + Math.random() * 20, state: 0, anim: 0, from: 0, sadqa: -1 };
  const pind = new THREE.Group(); pind.visible = false; scene.add(pind);
  const mud = new THREE.MeshStandardMaterial({ color: 0xa8774a, roughness: 1 }), thatch = new THREE.MeshStandardMaterial({ color: 0xd8b25a, roughness: 1 }), wood = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.9 }), rope = new THREE.MeshStandardMaterial({ color: 0xe8d6a8, roughness: 1 }), clay = new THREE.MeshStandardMaterial({ color: 0xb4582c, roughness: 0.8 }), iron = new THREE.MeshStandardMaterial({ color: 0x3a6a5a, metalness: 0.6, roughness: 0.5 });
  function hut(x, z, r) { const g = new THREE.Group(); const w = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 2.6), mud); w.position.y = 1.1; g.add(w); const roof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.6, 4), thatch); roof.position.y = 3; roof.rotation.y = Math.PI / 4; g.add(roof); const door = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.05), wood); door.position.set(0, 0.7, 1.31); g.add(door); g.position.set(x, 0, z); g.rotation.y = r; pind.add(g); }
  function charpai(x, z) { const g = new THREE.Group(); const bed = new THREE.Mesh(new THREE.BoxGeometry(2, 0.12, 1.1), rope); bed.position.y = 0.6; g.add(bed); [[-0.9, -0.45], [0.9, -0.45], [-0.9, 0.45], [0.9, 0.45]].forEach(([a, b]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.6, 6), wood); l.position.set(a, 0.3, b); g.add(l); }); g.position.set(x, 0, z); g.rotation.y = 0.4; pind.add(g); }
  function hay(x, z) { const h = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.8, 10), thatch); h.position.set(x, 0.9, z); pind.add(h); }
  function matka(x, z) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 10), clay); m.scale.y = 1.15; m.position.set(x, 0.38, z); pind.add(m); const n = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.18, 10), clay); n.position.set(x, 0.82, z); pind.add(n); }
  function pump(x, z) { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 1.4, 10), iron); b.position.y = 0.7; g.add(b); const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8), iron); sp.rotation.z = Math.PI / 2; sp.position.set(0.3, 1.1, 0); g.add(sp); const lv = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 6), iron); lv.rotation.z = 1.1; lv.position.set(-0.4, 1.5, 0); g.add(lv); g.position.set(x, 0, z); pind.add(g); }
  function animal(kind, x, z) {   // goats (white, brown, black) and cows
    const big = kind === "cow", col = { goat: 0xf2ece0, brown: 0x8a5a34, black: 0x15151a, cow: 0xf5f1ea }[kind];
    const m = new THREE.MeshStandardMaterial({ color: col, roughness: 0.85 }), g = new THREE.Group(), S = big ? 1.7 : 1;
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.32 * S, 0.8 * S, 6, 12), m); body.rotation.z = Math.PI / 2; body.position.y = 0.75 * S; g.add(body);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.42 * S, 0.34 * S, 0.3 * S), m); head.position.set(0.72 * S, 0.98 * S, 0); g.add(head);
    [-1, 1].forEach(sd => { const horn = new THREE.Mesh(new THREE.ConeGeometry(0.04 * S, 0.3 * S, 6), new THREE.MeshStandardMaterial({ color: 0x3a3028 })); horn.position.set(0.68 * S, 1.22 * S, sd * 0.1 * S); horn.rotation.z = -0.5; g.add(horn); });
    const legs = [[0.35, 0.15], [0.35, -0.15], [-0.35, 0.15], [-0.35, -0.15]].map(([a, b]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * S, 0.05 * S, 0.6 * S, 6), m); l.position.set(a * S, 0.3 * S, b * S); g.add(l); return l; });
    if (big) { [[0, 0.2], [-0.3, -0.15]].forEach(([a, b]) => { const sp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), new THREE.MeshStandardMaterial({ color: 0x1a1a1a })); sp.scale.set(1.3, 0.8, 0.4); sp.position.set(a * S, 0.85 * S, 0.3 * S); g.add(sp); }); }
    g.position.set(x, 0, z); g.rotation.y = Math.random() * 6.28; g.userData = { legs, home: new THREE.Vector3(x, 0, z), ph: Math.random() * 6, kind }; pind.add(g); return g;
  }
  [-1, 1].forEach(sd => { hut(sd * 15, -6, sd * 0.4); hut(sd * 17, 2, -sd * 0.3); hay(sd * 12.5, -12); charpai(sd * 11.5, 4); matka(sd * 11, -2); matka(sd * 11.4, -2.6); });
  pump(-12.5, -16);
  const herd = [animal("goat", -7.6, 3), animal("brown", 7.8, 0), animal("goat", 8.2, -6), animal("cow", -8.4, -8), animal("cow", 8.6, -14), animal("goat", -7.8, -3)];
  const blackGoat = animal("black", -7.4, -1);
  shadowy(pind); pind.scale.setScalar(0.001);

  /* ---------- love-struck scorpion: hearts, roses, petals, a dizzy spin ---------- */
  const heartTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"); g.fillStyle = "#ff2a6a"; g.beginPath(); g.moveTo(32, 56); g.bezierCurveTo(4, 36, 6, 10, 24, 10); g.bezierCurveTo(30, 10, 32, 16, 32, 18); g.bezierCurveTo(32, 16, 34, 10, 40, 10); g.bezierCurveTo(58, 10, 60, 36, 32, 56); g.fill(); g.fillStyle = "rgba(255,255,255,.6)"; g.beginPath(); g.ellipse(22, 20, 5, 3, -0.6, 0, 6.28); g.fill(); return new THREE.CanvasTexture(c); })();
  const halo = new THREE.Group(); halo.visible = false; scene.add(halo);
  for (let i = 0; i < 5; i++) { const h = new THREE.Sprite(new THREE.SpriteMaterial({ map: heartTex, transparent: true, depthWrite: false })); h.scale.setScalar(0.7); halo.add(h); }
  const petalPool = new THREE.InstancedMesh(new THREE.CircleGeometry(0.16, 6), new THREE.MeshStandardMaterial({ color: 0xe0103a, roughness: 0.6, side: THREE.DoubleSide, emissive: 0x3a0010 }), small ? 80 : 140);
  petalPool.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(petalPool);
  const petals = Array.from({ length: petalPool.count }, () => ({ on: false, p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler(), w: 0, life: 0 })); let petalI = 0;
  for (let i = 0; i < petalPool.count; i++) petalPool.setMatrixAt(i, hide);
  const roses = [];
  const love = { t: 0 };
  function loveStruck() {
    love.t = 2.6; st.stun = Math.max(st.stun, 1.6); halo.visible = true;
    for (let k = 0; k < 4; k++) setTimeout(() => {   // floating hearts above the scorpion
      dv.copy(pos).add(new THREE.Vector3(0, 2.4, 0)).project(camera); if (dv.z > 1) return;
      const el = document.createElement("div"); el.className = "g3__love"; el.textContent = ["❤️", "💕", "💘", "💗"][k];
      el.style.left = ((dv.x * 0.5 + 0.5) * 100 + (Math.random() - 0.5) * 8) + "%"; el.style.top = ((-dv.y * 0.5 + 0.5) * 100) + "%";
      root.appendChild(el); setTimeout(() => el.remove(), 1700);
    }, k * 160);
    for (let k = 0; k < 26; k++) { const o = petals[petalI]; petalI = (petalI + 1) % petals.length; o.on = true; o.life = 7; o.p.set(pos.x + (Math.random() - 0.5) * 1.6, 1.6 + Math.random() * 1.5, pos.z + (Math.random() - 0.5) * 1.6); o.v.set((Math.random() - 0.5) * 2.4, 1 + Math.random() * 1.5, (Math.random() - 0.5) * 2.4); o.r.set(Math.random() * 6, Math.random() * 6, 0); o.w = (Math.random() - 0.5) * 8; }
    const rose = new THREE.Group(); const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 6), stemMat); stem.rotation.z = Math.PI / 2; rose.add(stem); const bud = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), budMat); bud.scale.set(1, 1.2, 1); bud.position.x = 0.55; rose.add(bud);
    rose.position.set(pos.x + (Math.random() - 0.5), 0.06, pos.z + (Math.random() - 0.5)); rose.rotation.y = Math.random() * 6.28; rose.userData.life = 14; scene.add(rose); roses.push(rose);
    if (roses.length > 10) scene.remove(roses.shift());
  }

  /* ---------- crows everywhere (some with red eyes) ---------- */
  const crowMat = new THREE.MeshStandardMaterial({ color: 0x0b0b10, roughness: 0.55, metalness: 0.25 }), beakMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, roughness: 0.4 });
  const redEye = new THREE.MeshBasicMaterial({ color: 0xff1a0a }), blackEye = new THREE.MeshBasicMaterial({ color: 0x3a3a44 });
  function makeCrow(red) {
    const c = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), crowMat); body.scale.set(0.75, 0.75, 1.3); c.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), crowMat); head.position.set(0, 0.2, 0.38); c.add(head);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.24, 8), beakMat); beak.rotation.x = Math.PI / 2; beak.position.set(0, 0.17, 0.62); c.add(beak);
    [-1, 1].forEach(sd => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), red ? redEye : blackEye); e.position.set(sd * 0.09, 0.25, 0.5); c.add(e); });
    if (red) { const g = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(255,30,10,0.9)", "rgba(255,30,10,0)"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); g.scale.set(0.6, 0.3, 1); g.position.set(0, 0.25, 0.52); c.add(g); }
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.45, 4), crowMat); tail.rotation.x = -Math.PI / 2; tail.scale.y = 0.3; tail.position.set(0, 0, -0.5); c.add(tail);
    c.userData.wings = [-1, 1].map(sd => { const w = new THREE.Group(); w.position.set(sd * 0.18, 0.08, 0); const m = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.03, 0.4), crowMat); m.position.x = sd * 0.38; w.add(m); c.add(w); return w; });
    return c;
  }
  const crows = [];
  const perches = [[-6.4, 0.25, 9], [6.4, 0.25, 4], [-6.4, 0.25, -2], [6.3, 0.25, -6]];
  for (let i = 0; i < (small ? 14 : 24); i++) {
    const red = Math.random() < 0.35, c = makeCrow(red); c.scale.setScalar(1.3); scene.add(c);
    const fly = i >= 6;
    c.userData.mode = fly ? "fly" : "perch"; c.userData.ph = Math.random() * 6.28; c.userData.r = 14 + Math.random() * 30; c.userData.h = 10 + Math.random() * 18; c.userData.sp = (0.15 + Math.random() * 0.25) * (Math.random() < 0.5 ? -1 : 1); c.userData.cz = -20 - Math.random() * 30;
    if (!fly) { const pp = perches[i % perches.length]; c.position.set(pp[0] + (Math.random() - 0.5), pp[1], pp[2] + (Math.random() - 0.5) * 3); c.rotation.y = (Math.random() - 0.5) * 3; }
    crows.push(c);
  }
  function caw() { if (!soundOn || !ac) return; const t0 = ac.currentTime + 0.02; for (let k = 0; k < 2; k++) { const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(); o.type = "sawtooth"; f.type = "bandpass"; f.frequency.value = 1200; f.Q.value = 3; o.frequency.setValueAtTime(620, t0 + k * 0.3); o.frequency.exponentialRampToValueAtTime(420, t0 + k * 0.3 + 0.22); g.gain.setValueAtTime(0.0001, t0 + k * 0.3); g.gain.exponentialRampToValueAtTime(0.08, t0 + k * 0.3 + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t0 + k * 0.3 + 0.24); o.connect(f); f.connect(g); g.connect(ac.destination); o.start(t0 + k * 0.3); o.stop(t0 + k * 0.3 + 0.26); } }

  /* ---------- HUGE EAGLES, arriving from the sky with thunderbolts ---------- */
  const eagleBrown = new THREE.MeshStandardMaterial({ color: 0x5a3416, roughness: 0.7, emissive: 0x1a0c04 }), eagleWhite = new THREE.MeshStandardMaterial({ color: 0xf4efe6, roughness: 0.7, emissive: 0x2a2a2a }), eagleGold = new THREE.MeshStandardMaterial({ color: 0xf2b21a, roughness: 0.35, metalness: 0.3 });
  const eagle = new THREE.Group(); {
    const body = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 14), eagleBrown); body.scale.set(0.9, 0.85, 2); eagle.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 14), eagleWhite); head.position.set(0, 0.55, 1.9); eagle.add(head);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.75, 10), eagleGold); beak.rotation.x = Math.PI / 2 + 0.4; beak.position.set(0, 0.4, 2.55); eagle.add(beak);
    [-1, 1].forEach(sd => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd23a })); e.position.set(sd * 0.3, 0.72, 2.25); eagle.add(e); const brow = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.2), eagleWhite); brow.position.set(sd * 0.28, 0.82, 2.25); brow.rotation.z = sd * 0.35; eagle.add(brow); });
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.6, 6), eagleWhite); tail.rotation.x = -Math.PI / 2; tail.scale.y = 0.25; tail.position.set(0, 0, -2.4); eagle.add(tail);
    eagle.userData.wings = [-1, 1].map(sd => { const w = new THREE.Group(); w.position.set(sd * 0.7, 0.2, 0.2); eagle.add(w);
      const inner = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, 1.9), eagleBrown); inner.position.x = sd * 1.7; w.add(inner);
      const tip = new THREE.Group(); tip.position.x = sd * 3.4; w.add(tip);
      const outer = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 1.5), eagleBrown); outer.position.x = sd * 1.5; tip.add(outer);
      for (let k = 0; k < 5; k++) { const f = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.28), eagleBrown); f.position.set(sd * (3.2 + k * 0.05), 0, 0.6 - k * 0.3); f.rotation.y = -sd * (0.1 + k * 0.08); tip.add(f); }
      w.userData.tip = tip; return w; });
    [-1, 1].forEach(sd => { const t = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.9, 6), eagleGold); t.position.set(sd * 0.45, -0.9, 0.4); eagle.add(t); });
    shadowy(eagle);
  }
  eagle.scale.setScalar(3.2); eagle.visible = false; scene.add(eagle);
  const boltMat = new THREE.MeshBasicMaterial({ color: 0xeaf4ff, transparent: true, opacity: 0, fog: false, blending: THREE.AdditiveBlending, depthWrite: false });
  const boltGlow = new THREE.MeshBasicMaterial({ color: 0x7fb8ff, transparent: true, opacity: 0, fog: false, blending: THREE.AdditiveBlending, depthWrite: false });
  const bolts = [0, 1, 2].map(() => { const g = new THREE.Group(); scene.add(g); return g; });
  const flashLight = new THREE.PointLight(0xcfe6ff, 0, 400, 1.2); flashLight.position.set(0, 60, -20); scene.add(flashLight);
  const flashEl = document.createElement("div"); flashEl.className = "g3__flash"; root.appendChild(flashEl);
  const eg = { on: false, t: 0, next: 26 + Math.random() * 14, strike: 0, side: 1 };
  function lightning() {
    bolts.forEach((grp, k) => { grp.children.forEach(m => m.geometry.dispose()); grp.clear();
      const pts = []; let x = eagle.visible ? eagle.position.x + (Math.random() - 0.5) * 30 : (Math.random() - 0.5) * 60, y = 110, z = -30 - Math.random() * 60;
      for (let j = 0; j < 16; j++) { pts.push(new THREE.Vector3(x, y, z)); x += (Math.random() - 0.5) * 12; y -= 110 / 15; z += (Math.random() - 0.5) * 5; }
      const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.05);
      grp.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.45, 5), boltMat), new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 1.8, 6), boltGlow));
      const fork = pts.slice(5, 11).map((p2, j) => p2.clone().add(new THREE.Vector3(j * 2.5 * (k % 2 ? 1 : -1), -j, 0)));
      grp.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(fork), 16, 0.25, 4), boltMat)); });
    eg.strike = 0.35; flashEl.classList.remove("on"); void flashEl.offsetWidth; flashEl.classList.add("on"); st.shake = Math.max(st.shake, 0.5);
    if (soundOn && ac) { const t0 = ac.currentTime, len = 2.2, buf = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.5);
      const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); src.buffer = buf; f.type = "lowpass"; f.frequency.value = 500; g.gain.value = 0.5; src.connect(f); f.connect(g); g.connect(ac.destination); src.start(t0); }
  }

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
  shadowy(crab); shadowy(scorp);
  spawnBeggars();
  setHud(); say(tx().start, "", 99999);

  function begin() { if (window.coachCourt && window.coachCourt.busy()) return; if (!st.playing) { st.playing = true; hud.msg.classList.remove("on"); } }
  function niceTry() {
    st.round++; st.level++;
    st.crabScale = Math.min(3.6, Math.max(st.crabScale, Math.min(3, st.crabScale * 1.3)));
    st.wealth = st.wealth * 1.9 + 750000 + Math.random() * 400000;
    buildMansion(st.level); buildStacks(st.level);
    crown.visible = st.round >= 1; chain.visible = st.round >= 2; strength(st.round);
    rain(MAXB); drop(coins, coins.n, false, false); drop(diamonds, 120, true, true);
    pos.set(0, 0, 8); st.hp = 100; st.shake = 0.6;
    buildWives(st.round); adl();
    const t = tx(); say(t.nice, t.niceSub + "</span><span class='adl'>⚖️ AL-ʿADL · " + t.justice + "</span><span class='g3pray'>" + PRAYER, 4200); setHud();
  }
  function doSting() {
    begin(); if (!st.playing || st.cool > 0) return;
    act.v += 1;
    st.sting = 1; st.cool = 0.55;
    const reach = 2.4 * 1.45 * st.crabScale + 2.2;
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
    if (!st.playing) { mx = mz = 0; }
    if (st.kb > 0) { pos.z += st.kb * dt * 3; st.kb = Math.max(0, st.kb - dt * 6); }
    pos.x = THREE.MathUtils.clamp(pos.x + mx * sp2 * dt, -5.2, 5.2);
    const minZ = crab.position.z + 2.4 * st.crabScale + 1.2;
    pos.z = THREE.MathUtils.clamp(pos.z + mz * sp2 * dt, minZ, 12);
    scorp.position.set(pos.x, ham.fly, pos.z); scorp.scale.setScalar(1.25 * shrinkK); scorpShadow.position.set(pos.x, 0.03, pos.z);
    const walking = Math.abs(mx) > 0.05 || Math.abs(mz) > 0.05;
    if (walking && st.playing) act.v += dt * Math.min(1.4, Math.hypot(mx, mz)) * 1.1;
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
    crab.scale.setScalar(st.crabScale * 1.45 * (1 + Math.sin(time * 2) * 0.015));   // the crab is drawn 45% bigger
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
    const bo = Math.max(bp, Math.min(0.75, omen * 0.13)); moonMat.color.copy(white).lerp(red, bo); moonGlow.material.color.copy(glowW).lerp(glowR, bo); skyU.blood.value = Math.max(bp, omen * 0.07);
    moonLight.color.setRGB(0.75 + bp * 0.5, 0.82 - bp * 0.5, 1 - bp * 0.7);
    were.position.y = THREE.MathUtils.lerp(-6, 8.6, bp) + (bp > 0.9 ? Math.sin(time * 1.5) * 0.15 : 0);
    were.rotation.z = bp > 0.9 ? Math.sin(time * 0.8) * 0.04 : 0;
    wolves.forEach((w, i) => { w.position.y = THREE.MathUtils.lerp(w.userData.y - 6, w.userData.y, THREE.MathUtils.clamp(bp * 1.4 - i * 0.15, 0, 1)); });
    constLines.forEach(m => { m.opacity = 0.26 + Math.sin(time * 0.8) * 0.06 + bp * 0.1; });

    // the wives' prayer towards the Kaaba, while the crab defends them
    if (!pray.on && st.playing) { pray.next -= dt; if (pray.next <= 0 && wives.children.length) { pray.on = true; pray.t = 0; kaaba.visible = true; say(tx().defend, tx().qibla, 2400); } }
    if (pray.on) { pray.t += dt; if (pray.t > 14.5) { pray.on = false; pray.next = 40 + Math.random() * 20; } }
    pray.k += ((pray.on ? 1 : 0) - pray.k) * Math.min(1, dt * 1.5);
    kaaba.userData.mats.forEach((m, j) => { m.opacity = pray.k * (j === 2 ? 0.55 : 1); }); kaaba.visible = pray.k > 0.01;
    const P0 = pose(pray.on ? pray.t : 0);
    wives.children.forEach((w, i) => {
      const sl = w.userData.slot; w.position.x = crab.position.x + sl * (1.9 + st.crabScale * 1.5); w.position.z = crab.position.z - 2.2 - Math.abs(sl) * 0.6;
      const dying = fire.dying.find(d => d.w === w);
      if (dying) return;
      const up = w.userData.upper, gown = w.userData.gown;
      if (pray.k > 0.05) {
        const face = Math.atan2(kaaba.position.x - w.position.x, kaaba.position.z - w.position.z);
        w.rotation.y += (face - w.rotation.y) * Math.min(1, dt * 3);
        up.rotation.x += (P0[0] - up.rotation.x) * Math.min(1, dt * 4);
        const low = P0[1]; w.position.y += (-low * 0.85 - w.position.y) * Math.min(1, dt * 4); gown.scale.y += ((1 - low * 0.55) - gown.scale.y) * Math.min(1, dt * 4); gown.position.y = 0.95 * gown.scale.y + low * 0.4;
        up.position.y = 1.75 * gown.scale.y + low * 0.55;
      } else {
        w.rotation.y = Math.sin(time * 1.2 + i) * 0.25; up.rotation.x *= 0.9; gown.scale.y += (1 - gown.scale.y) * 0.2; gown.position.y = 0.95 * gown.scale.y; up.position.y = 1.75 * gown.scale.y;
        w.position.y = Math.abs(Math.sin(time * 2.4 + i)) * 0.12;
      }
    });
    if (pray.on && st.playing) {   // the crab steps up: he tracks the scorpion and lunges far more often
      st.crabTarget = pos.x;
      if (st.lunge <= 0 && Math.abs(pos.z - crab.position.z) < 12 + st.crabScale * 2 && Math.random() < dt * 1.3) st.lunge = 1;
    }
    // crossfire: the first gunfight after round 1 catches two of the wives
    if (!fire.done && weap.kind === "gun" && st.round >= 1 && wives.children.length === 4 && weap.t < 2.4) crossfire();
    if (fire.t > 0) {
      fire.t -= dt; const a = tracers.geometry.attributes.position.array;
      for (let k = 0; k < 16; k++) { const sx = crab.position.x + (Math.random() - 0.5) * 3, sz = crab.position.z + 2; const tx3 = crab.position.x + (Math.random() - 0.5) * 22, tz3 = crab.position.z - 4 + Math.random() * 3; a.set([sx, 2 + Math.random() * 2, sz, tx3, 1 + Math.random() * 2, tz3], k * 6); }
      tracers.geometry.attributes.position.needsUpdate = true; tracerMat.opacity = Math.random() < 0.5 ? 0.9 : 0.2;
      if (fire.t <= 0) tracerMat.opacity = 0;
    }
    if (fire.dying.length) {
      let finished = true;
      fire.dying.forEach(d => {
        d.t += dt; const w = d.w;
        if (d.t < 0.8) { w.rotation.x = -Math.min(1, d.t / 0.8) * Math.PI / 2; w.position.y = 0; finished = false; }
        else if (d.t < 4.5) {   // a soft light carries them up
          if (!d.soul) { d.soul = true; w.traverse(m => { if (m.isMesh) { m.material = m.material.clone(); m.material.transparent = true; m.material.emissive && m.material.emissive.set(0x8899ff); } }); const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(220,230,255,0.9)", "rgba(220,230,255,0)"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); halo.scale.set(5, 5, 1); halo.position.y = 1.5; w.add(halo);
            if (d === fire.dying[0]) { hud.cap.textContent = tx().inna; hud.cap.classList.add("on"); if (!beggars.length) spawnBeggars(); } }
          const k = (d.t - 0.8) / 3.7; w.rotation.x = -Math.PI / 2 * (1 - k); w.position.y = k * 9; w.traverse(m => { if (m.isMesh) m.material.opacity = 1 - k; else if (m.isSprite) m.material.opacity = 1 - k; }); finished = false;
        }
      });
      if (finished) { fire.dying.forEach(d => wives.remove(d.w)); alive = alive.filter(i => i !== 0 && i !== 3); fire.dying = []; setTimeout(() => hud.cap.classList.remove("on"), 2500); }
    }
    beggars.forEach((b2, k) => {   // kneeling by the crab, always begging
      const u = b2.userData; b2.position.set(crab.position.x + u.sd * (2.8 * st.crabScale + 2.2), 0, crab.position.z + 2.4 * st.crabScale + 1);
      b2.lookAt(crab.position.x, 0, crab.position.z); b2.rotateY(Math.PI); b2.rotation.x = Math.sin(time * 4 + k) * 0.15;
      u.t -= dt; if (u.t <= 0) { u.t = 3.5 + Math.random() * 2; const n = window.coachBegCount ? window.coachBegCount() : 4; u.line = (u.line + 1 + Math.floor(Math.random() * 2)) % n; b2.remove(u.bub); u.bub = bubble(window.coachBeg ? window.coachBeg(u.line) : tx().beg[u.line % 4]); u.bub.position.set(0, 5.6, 0); b2.add(u.bub); }
    });
    // "Can I be your sukoon…?"  "Kiya hua meri jaan?"
    if (window.coachJaan) { jaan.t -= dt;
      if (jaan.phase === 0 && jaan.t <= 0) { const pool = wives.children.concat(beggars, [scorp]); jaan.who = pool[Math.floor(Math.random() * pool.length)]; jaan.ask = jaanBubble(window.coachJaan.ask); jaan.ask.position.set(0, jaan.who === scorp ? 4.2 : 5.4, 0); if (jaan.who.userData.upper) jaan.ask.position.y = 4.2; jaan.who.add(jaan.ask); jaan.phase = 1; jaan.t = 2.2; }
      else if (jaan.phase === 1 && jaan.t <= 0) { jaan.rep = bubble(window.coachJaan.reply); jaan.rep.material.color.setRGB(1, 0.92, 0.7); jaan.rep.position.set(0, 7.4, 0); crab.add(jaan.rep); jaan.phase = 2; jaan.t = 3; }
      else if (jaan.phase === 2 && jaan.t <= 0) { if (jaan.ask && jaan.ask.parent) jaan.ask.parent.remove(jaan.ask); if (jaan.rep) crab.remove(jaan.rep); jaan.phase = 0; jaan.t = 12 + Math.random() * 10; } }
    mist.forEach(m => { m.position.x += m.userData.v * dt; if (m.position.x > 24) m.position.x = -24; m.material.opacity = 0.35 + Math.sin(time * 0.5 + m.position.z) * 0.12; });
    bunnies.forEach(b2 => {   // bunnies with bow ties hopping across the road
      const u = b2.userData; b2.position.x += u.dir * u.sp * dt;
      if (Math.abs(b2.position.x) > 18) { b2.position.x = -u.dir * 18; u.z = 6 - Math.random() * 24; }
      b2.position.y = Math.abs(Math.sin(time * 5.5 + u.ph)) * 1.3; b2.position.z = u.z; b2.rotation.y = u.dir * Math.PI / 2;
      b2.rotation.z = 0; b2.rotation.x = -Math.cos(time * 5.5 + u.ph) * 0.12;
      u.wand.rotation.z = -0.75 + Math.sin(time * 3 + u.ph) * 0.45; u.star.rotation.y += dt * 4; u.spark.material.opacity = 0.6 + Math.sin(time * 9 + u.ph) * 0.35; u.head.rotation.y = Math.sin(time * 1.3 + u.ph) * 0.2;
    });
    if (adlT > 0) { adlT -= dt; if (adlT <= 0) adlEl.classList.remove("on"); }

    crabCarpet.position.x = 0; crabCarpet.position.z = -12 + 0.6 * st.crabScale; crabCarpet.scale.set(st.crabScale, 1, st.crabScale);   // fixed to the ground; it only grows
    // the crab flips his own carpet: underneath, surprise, a Pakistani flag, and the pind appears
    if (!reduce && st.playing) flip.next -= dt;
    if (flip.next <= 0 && !flip.anim) { flip.anim = 1.4; flip.from = flip.state; flip.state = 1 - flip.state; flip.next = flip.state ? 30 + Math.random() * 10 : 45 + Math.random() * 20;
      if (flip.state) { const P = window.coachPind ? window.coachPind() : null; if (P) say(P.flip, "", 2600); pind.visible = true; flip.sadqa = 4; blackGoat.visible = true; blackGoat.position.copy(blackGoat.userData.home); blackGoat.scale.setScalar(1); } }
    if (flip.anim > 0) { flip.anim = Math.max(0, flip.anim - dt); const k = 1 - flip.anim / 1.4, e = k * k * (3 - 2 * k);
      crabCarpet.rotation.x = (flip.from + e) * Math.PI * (flip.state ? 1 : 1) - (flip.state ? 0 : Math.PI) * 0; crabCarpet.rotation.x = (flip.state ? e : 1 - e) * Math.PI;
      crabCarpet.position.y = Math.sin(k * Math.PI) * 3 * st.crabScale; crab.position.y = Math.sin(k * Math.PI) * 2.2 * st.crabScale; st.shake = Math.max(st.shake, 0.15);
      if (!flip.anim) { crab.position.y = 0; crabCarpet.position.y = flip.state ? 0.12 : 0; } }
    { const want = flip.state ? 1 : 0.001, sc = pind.scale.x + (want - pind.scale.x) * Math.min(1, dt * 2.5); pind.scale.setScalar(sc); pind.visible = sc > 0.01;
      herd.forEach(a => { const u = a.userData; a.position.x = u.home.x + Math.sin(time * 0.3 + u.ph) * 0.8; a.position.z = u.home.z + Math.cos(time * 0.25 + u.ph) * 0.8; a.rotation.y = Math.atan2(Math.cos(time * 0.3 + u.ph), -Math.sin(time * 0.25 + u.ph)); u.legs.forEach((l, j) => l.rotation.z = Math.sin(time * 6 + j * 1.7 + u.ph) * 0.3); }); }
    if (flip.sadqa > 0 && pind.scale.x > 0.9) { flip.sadqa -= dt;   // the black goat walks to the crab and is given away as sadqa, vanishing in light
      const tgt = new THREE.Vector3(crab.position.x - 4 * st.crabScale, 0, crab.position.z + 2);
      const lp = blackGoat.parent.worldToLocal(tgt.clone()); blackGoat.position.lerp(lp, Math.min(1, dt * 0.9)); blackGoat.lookAt(blackGoat.parent.localToWorld(lp.clone()));
      blackGoat.userData.legs.forEach((l, j) => l.rotation.z = Math.sin(time * 9 + j * 1.7) * 0.4);
      if (flip.sadqa <= 0) { const P = window.coachPind ? window.coachPind() : null; if (P) { hud.cap.textContent = P.sadqa; hud.cap.classList.add("on"); setTimeout(() => hud.cap.classList.remove("on"), 3500); } flip.sadqa = -1; flip.vanish = 1; } }
    if (flip.vanish > 0) { flip.vanish = Math.max(0, flip.vanish - dt * 0.8); blackGoat.scale.setScalar(Math.max(0.001, flip.vanish)); blackGoat.position.y += dt * 2; if (!flip.vanish) blackGoat.visible = false; }
    // superbikes: one more pops in whenever the crab is winning harder
    { const want = Math.min(14, 2 + st.round * 2 + omen * 2 + (st.wealth > 5e6 ? 2 : 0)); bikeSpawn.cool -= dt;
      if (bikes.length < want && bikeSpawn.cool <= 0) { const b2 = makeBike(); b2.userData.t = 0; bikes.push(b2); scene.add(b2); bikeSpawn.cool = 0.9; bikeSpawn.tier = -1; if (bikes.length > 2 && st.playing) dmg("+🏍️", b2.position.clone().set(bikeSlot(bikes.length - 1)[0], 2, bikeSlot(bikes.length - 1)[1]), "crab"); }
      const tier = bikeTier(); if (tier !== bikeSpawn.tier) { bikeSpawn.tier = tier; styleBikes(tier); }
      bikes.forEach((b2, i) => { const [x, z, sd, h] = bikeSlot(i); const u = b2.userData; u.t = Math.min(1, u.t + dt * 1.6);
        b2.position.set(x, h + (1 - u.t) * 8, z); u.pod.scale.y = h / (u.base || 1.7) * 1.0; u.pod.position.y = -h / (u.base || 1.7) / 2; b2.rotation.y = -sd * 0.35 + Math.sin(time * 0.4 + i) * 0.5 + (1 - u.t) * 6; b2.scale.setScalar((u.base || 1.7) * (0.3 + 0.7 * u.t));
        if (u.glow.visible) u.glow.material.opacity = 0.55 + Math.sin(time * 4 + i) * 0.25; }); }
    // love-struck: hearts circle the dizzy scorpion, petals flutter down, dropped roses fade
    if (love.t > 0) { love.t -= dt; halo.position.set(pos.x, 2.1 * shrinkK + ham.fly, pos.z); halo.children.forEach((h, i) => { const a = time * 4 + i * 1.2566; h.position.set(Math.cos(a) * 0.9, Math.sin(time * 6 + i) * 0.12, Math.sin(a) * 0.9); h.material.opacity = Math.min(1, love.t * 2); }); if (love.t <= 0) halo.visible = false; }
    for (let i = 0; i < petals.length; i++) { const o = petals[i]; if (!o.on) continue; o.life -= dt;
      if (o.p.y > 0.04) { o.v.y = Math.max(-1.2, o.v.y - 3 * dt); o.p.addScaledVector(o.v, dt); o.v.x *= 0.98; o.v.z *= 0.98; o.r.x += o.w * dt; o.r.y += o.w * 0.7 * dt; } else { o.p.y = 0.04; o.r.x = -Math.PI / 2; }
      if (o.life <= 0) { o.on = false; petalPool.setMatrixAt(i, hide); continue; }
      tmpM.compose(o.p, tmpQ.setFromEuler(o.r), tmpS.set(1, 1, 1).multiplyScalar(Math.min(1, o.life))); petalPool.setMatrixAt(i, tmpM); }
    tmpS.set(1, 1, 1); petalPool.instanceMatrix.needsUpdate = true;
    for (let i = roses.length - 1; i >= 0; i--) { const r = roses[i]; r.userData.life -= dt; if (r.userData.life <= 0) { scene.remove(r); roses.splice(i, 1); } else if (r.userData.life < 1) r.scale.setScalar(r.userData.life); }
    // crows: circling the sky, perched along the road
    crows.forEach((c, i) => { const u = c.userData;
      if (u.mode === "fly") { const a = time * u.sp + u.ph; c.position.set(Math.cos(a) * u.r, u.h + Math.sin(time * 0.7 + u.ph) * 2, u.cz + Math.sin(a) * u.r * 0.6); c.rotation.y = Math.atan2(-Math.sin(a) * u.sp, Math.cos(a) * u.sp * 0.6) ; c.rotation.z = -Math.sign(u.sp) * 0.3;
        u.wings.forEach((w, k) => w.rotation.z = (k ? -1 : 1) * Math.sin(time * 9 + u.ph) * 0.7); }
      else { u.wings.forEach((w, k) => w.rotation.z = (k ? -1 : 1) * 0.15); c.rotation.x = Math.max(0, Math.sin(time * 1.5 + u.ph)) * 0.35; } });
    if (Math.random() < dt * 0.12) caw();
    // the eagle arrives from the sky, thunderbolts crack around it
    if (!eg.on && !reduce) { eg.next -= dt; if (eg.next <= 0) { eg.on = true; eg.t = 0; eg.side = Math.random() < 0.5 ? 1 : -1; eagle.visible = true; lightning(); say(tx().eagle, "", 2200); } }
    if (eg.on) { eg.t += dt; const T = 9, k = eg.t / T;
      const x = eg.side * (34 - k * 68), y = 30 - Math.sin(Math.min(1, k * 1.8) * Math.PI / 2) * 18 + Math.max(0, k - 0.7) * 60, z = -18 + Math.sin(k * Math.PI) * 4;
      const prev = eagle.position.clone(); eagle.position.set(x, y, z); if (eg.t > 0.05) eagle.lookAt(eagle.position.clone().add(eagle.position.clone().sub(prev))); eagle.rotation.z += -eg.side * 0.25;
      eagle.userData.wings.forEach((w, j) => { const f = Math.sin(time * 4.5) * 0.55; w.rotation.z = (j ? -1 : 1) * f; w.userData.tip.rotation.z = (j ? -1 : 1) * f * 0.6; });
      if (Math.random() < dt * 0.9) lightning();
      if (eg.t > 2.4 && eg.t < 2.5 && Math.random() < 0.6 && soundOn && ac) caw();
      if (eg.t >= T) { eg.on = false; eagle.visible = false; eg.next = 40 + Math.random() * 25; } }
    if (eg.strike > 0) { eg.strike -= dt; const o = eg.strike > 0 ? (Math.random() < 0.5 ? 1 : 0.35) : 0; boltMat.opacity = o; boltGlow.opacity = o * 0.45; flashLight.intensity = o * 1800; skyU.blood.value = Math.max(skyU.blood.value, 0); }
    // royal tags, fireflies and the horror numbers
    royalTags();
    for (let i = 0; i < FF; i++) { const sd = ffSeed[i]; ffPos[i * 3] = sd[0] + Math.sin(time * 0.5 + sd[3]) * 1.5; ffPos[i * 3 + 1] = sd[1] + Math.sin(time * 1.3 + sd[3] * 2) * 0.5; ffPos[i * 3 + 2] = sd[2] + Math.cos(time * 0.4 + sd[3]) * 1.5; }
    ffGeo.attributes.position.needsUpdate = true; fireflies.material.opacity = 0.55 + Math.sin(time * 3) * 0.25;
    finalPass.uniforms.time.value = time % 100; finalPass.uniforms.vig.value = 0.55 + omen * 0.09;
    if (!reduce) { horror.t -= dt; if (horror.t <= 0) { horror.t = 8 + Math.random() * 6 - Math.min(omen, 3) * 0.6; flash1315(); setTimeout(() => { if (window.coachWhisper && inView) window.coachWhisper(root); }, 1100); } }

    // the ring sequence: drop -> AL-MUDHILL -> AL-GHANI and the flood -> everything sucked into the crab and the mansion
    act.v = Math.max(0, act.v - dt * 0.3); seq.cool -= dt;
    if (seq.phase === "idle" && st.playing && act.v > 7 && seq.cool <= 0 && ham.phase === "idle") { act.v = 0; startRing(); }
    if (seq.phase !== "idle") {
      seq.t -= dt; const top = crab.position.clone().add(new THREE.Vector3(0, 6.4 * st.crabScale, 0));
      if (seq.phase === "fall") { ring.position.lerp(top, Math.min(1, dt * 2.2)); ring.position.y = Math.max(top.y, ring.position.y - dt * 22); ring.rotation.y += dt * 5; ring.rotation.x = 0.35;
        if (seq.t <= 0) { seq.phase = "mudhil"; seq.t = 2.6; st.shake = 0.9; nameBanner("AL-MUDHILL", "المُذِلّ", tx().mudhil); st.kb = 3; st.stun = 1.2; } }
      else if (seq.phase === "mudhil") { ring.position.copy(top); ring.position.y += Math.sin(time * 3) * 0.3; ring.rotation.y += dt * 2.5;
        if (seq.t <= 0) { seq.phase = "ghani"; seq.t = 3; nameBanner("AL-GHANI", "الغَنِيّ", tx().ghani); drop(coins, coins.n, true, false); drop(diamonds, diamonds.n, true, true); rain(MAXB); } }
      else if (seq.phase === "ghani") { ring.position.copy(top); ring.rotation.y += dt * 2.5; drop(diamonds, small ? 2 : 4, true, true); drop(coins, 2, true, false);
        if (seq.t <= 0) { seq.phase = "suck"; seq.t = 2.4; suck = 1; } }
      else if (seq.phase === "suck") { suck = Math.max(0.001, seq.t / 2.4);
        suckTarget[0].copy(crab.position).setY(1.5 * st.crabScale); suckTarget[1].copy(mansion.position).setY(6 * mansionK);
        ring.position.lerp(crab.position, dt * 2); ring.scale.multiplyScalar(1 - dt * 1.2); st.shake = Math.max(st.shake, 0.15);
        if (seq.t <= 0) { seq.phase = "idle"; suck = 0; ring.visible = false; seq.cool = 32 + Math.random() * 12;
          st.crabScale = Math.min(3.6, st.crabScale * 1.07); mansionK = Math.min(1.7, mansionK * 1.08); mansion.scale.setScalar(mansionK);
          shrinkK = Math.max(0.68, shrinkK * 0.95); shrinkables.forEach(o => o.scale.setScalar(shrinkK));
          omen = Math.min(6, omen + 1); howl(0.3, 0.9); howl(1.1, 1.15);
          st.wealth += 1200000 + Math.random() * 800000; setHud(); } }
    }
    // the moon grows more ominous, and the wolves close in
    { const ok = Math.min(1, omen / 6); moon.scale.setScalar(1 + ok * 0.45); moonGlow.scale.set(120 + ok * 90, 120 + ok * 90, 1); }
    wolfPack.forEach((w, i) => {
      const u = w.userData, on = i < omen * 2;
      if (!on) { w.visible = false; return; }
      if (!w.visible) { w.visible = true; u.r = 30; }
      const want = Math.max(3.4, 15 - omen * 1.9) + (i % 3) * 0.8; u.r += (want - u.r) * Math.min(1, dt * 0.35);
      const tx2 = pos.x + Math.sin(u.a) * u.r, tz2 = pos.z + Math.cos(u.a) * u.r;
      const moving = Math.hypot(tx2 - w.position.x, tz2 - w.position.z) > 0.3;
      w.position.x += (tx2 - w.position.x) * Math.min(1, dt * 1.2); w.position.z += (tz2 - w.position.z) * Math.min(1, dt * 1.2);
      w.scale.setScalar(1.25); w.lookAt(pos.x, 0, pos.z);
      u.legs.forEach((lg, k) => { lg.rotation.x = moving ? Math.sin(time * 10 + k * Math.PI) * 0.5 : 0; });
    });

    // the shopping-spree joke
    if (st.playing && seq.phase === "idle" && ham.phase === "idle" && !pray.on && !fire.dying.length) { shop.t -= dt;
      if (shop.t <= 0 && window.coachMall && !(window.coachCourt && window.coachCourt.busy())) { shop.t = 70 + Math.random() * 25; st.playing = false; Object.keys(keys).forEach(x => keys[x] = false);
        window.coachMall.play(shop.level++, () => { st.playing = true; st.kb = 2; say(tx().hit, "", 400); }); } }

    // the Hammer of Justice
    if (ham.phase === "idle" && st.playing && !weap.kind && dual.phase === "idle" && !magic.mode) { ham.next -= dt; if (ham.next <= 0) {
      const adlName = Math.random() < 0.5; hamFace.map = hamFace.emissiveMap = adlName ? hamTex.adl : hamTex.hakam; hamFace.needsUpdate = true;
      ham.phase = "raise"; ham.t = 1.3; hammer.visible = true; say(tx().hammer, "", 1300); } }
    if (ham.phase === "raise") { ham.t -= dt; hammer.rotation.x = -0.2 - (1 - ham.t / 1.3) * 1.1; hammer.scale.setScalar(Math.min(1, 1.3 - ham.t + 0.3)); rampage = Math.max(rampage, 1);
      if (ham.t <= 0) { ham.phase = "slam"; ham.t = 0.18; } }
    if (ham.phase === "slam") { ham.t -= dt; hammer.rotation.x = -1.3 + (1 - ham.t / 0.18) * 2.9;
      if (ham.t <= 0) { ham.phase = "after"; ham.t = 1.2; hammer.rotation.x = 1.6; st.shake = 1.4; ham.qt = 1;
        quake.position.x = crab.position.x; quake.position.z = crab.position.z + 4 * st.crabScale;
        ham.vy = 16; ham.fly = 0.001; st.kb = 5; st.stun = 2.2; crabHits(["88888888", "622", "222222"]); drop(diamonds, 60, true, true); } }
    if (ham.phase === "after") { ham.t -= dt; if (ham.t <= 0) { ham.phase = "idle"; hammer.visible = false; hammer.rotation.x = 0; ham.next = 50 + Math.random() * 20; } }
    if (ham.qt > 0) { ham.qt = Math.max(0, ham.qt - dt * 0.9); quake.scale.setScalar(2 + (1 - ham.qt) * 26); quake.material.opacity = ham.qt * 0.9; }
    if (ham.fly > 0) {   // the scorpion goes flying… and survives, so the case goes to court
      ham.vy -= 22 * dt; ham.fly += ham.vy * dt; scorp.position.y = ham.fly; scorp.rotation.x += dt * 9;
      if (ham.fly <= 0) { ham.fly = 0; scorp.position.y = 0; scorp.rotation.x = 0;
        if (window.coachCourt && !window.coachCourt.busy()) { st.playing = false; const k = Object.keys(keys); k.forEach(x => keys[x] = false);
          window.coachCourt.play(() => { st.playing = true; niceTry(); }); } } }

    // rampage: diamonds pour down and DIAMOND DIGGER lights up the sky
    if (dual.phase === "wield" || weap.kind) rampage = Math.max(rampage, 1);
    if (rampage > 0) { rampage -= dt; drop(diamonds, small ? 3 : 6, Math.random() < 0.5, true); }
    if (fx.dd) { const tgt = rampage > 0 ? 0.95 : 0; fx.dd.material.opacity += (tgt - fx.dd.material.opacity) * Math.min(1, dt * 4); fx.dd.visible = fx.dd.material.opacity > 0.01; fx.dd.scale.setScalar(fx.dd.userData.base * (1 + Math.sin(time * 6) * 0.03 * (rampage > 0 ? 1 : 0))); }

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

    // Al-Buraq gallops across the sky now and then
    if (!flight.on && !reduce) { flight.next -= dt; if (flight.next <= 0) { flight.on = true; flight.t = 0; flight.dir = Math.random() < 0.5 ? 1 : -1; buraq.visible = true; buraq.userData.trail.forEach(t => t.visible = true); if (!qiy.on && !split.on) { hud.cap.textContent = tx().buraq; hud.cap.classList.add("on"); } } }
    if (flight.on) {
      flight.t += dt; const k = flight.t / 11, x = flight.dir * (-170 + k * 340);
      buraq.position.set(x, 43 + Math.sin(k * Math.PI) * 4 + Math.sin(time * 3) * 1.2, -175); buraq.rotation.y = flight.dir > 0 ? 0 : Math.PI;
      buraq.userData.legs.forEach((lg, j) => { lg.rotation.z = Math.sin(time * 9 + j * 1.6) * 0.7; });
      buraq.userData.wings.forEach((w, j) => { w.rotation.x = Math.sin(time * 5) * 0.6 * (j ? 1 : -1); });
      buraq.userData.trail.forEach((t, j) => { t.position.set(x - flight.dir * (5 + j * 6), buraq.position.y - 1 - j * 0.4, -175); });
      if (k >= 1) { flight.on = false; flight.next = 55 + Math.random() * 35; buraq.visible = false; buraq.userData.trail.forEach(t => t.visible = false); if (!qiy.on && !split.on && hud.cap.textContent === tx().buraq) hud.cap.classList.remove("on"); }
    }
    // the moon splits in half on its own, sometimes (54:1)
    if (!split.on && !qiy.on && !reduce) { split.next -= dt; if (split.next <= 0) { split.on = true; split.t = 0; hud.cap.textContent = tx().moon; hud.cap.classList.add("on"); } }
    if (split.on && !qiy.on) {
      split.t += dt; const sep = 10 * Math.sin(Math.PI * Math.min(1, split.t / 9));
      moon.visible = false; craters.forEach(c => c.visible = false); moonL.visible = moonR.visible = true;
      moonL.position.copy(moonPos).add(new THREE.Vector3(-sep, 0, 0)); moonR.position.copy(moonPos).add(new THREE.Vector3(sep, 0, 0));
      if (split.t >= 9) { split.on = false; split.next = 45 + Math.random() * 30; moon.visible = true; craters.forEach(c => c.visible = true); moonL.visible = moonR.visible = false; hud.cap.classList.remove("on"); }
    }

    // Qiyamah: the angel blows the Trumpet, shockwaves roll, the moon splits
    if (!reduce) qiy.next -= dt;
    if (!qiy.on && qiy.next <= 0) { qiy.on = true; qiy.t = 11; sur.visible = true; hud.cap.textContent = tx().sur; hud.cap.classList.add("on"); trumpet(); }
    if (qiy.on) {
      qiy.t -= dt; const life = 11 - qiy.t;
      sur.scale.setScalar(Math.min(1, life * 0.8)); surGlow.material.opacity = 0.35 + Math.sin(time * 5) * 0.2;
      angel.children.forEach(c => { if (c.userData.sd) c.rotation.y = c.userData.sd * (0.25 + Math.sin(time * 2.2) * 0.3); });
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
  window.__g3 = { st, pos, keys, niceTry, doSting, rain, blood: () => { bloodT = 0; }, inView: () => inView, weapon: k => { weap.next = 0; st.playing = true; }, knives: () => { dual.next = 0; st.playing = true; }, magic: () => { magic.next = 0; st.playing = true; }, qiyamah: () => { qiy.next = 0; }, eagle: () => { eg.next = 0; }, flip: () => { flip.next = 0; st.playing = true; }, buraq: () => { flight.next = 0; }, split: () => { split.next = 0; }, pray: () => { pray.next = 0; st.playing = true; }, shop: () => { shop.t = 0; st.playing = true; }, crossfire: () => { st.playing = true; if (!fire.done) crossfire(); }, ring: () => { st.playing = true; seq.cool = 0; act.v = 99; }, omen: () => omen, hammer: () => { ham.next = 0; st.playing = true; } };
}

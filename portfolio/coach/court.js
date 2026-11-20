/* The Hammer of Justice ending, shared by both Scorpion Street games.
   window.coachCourt.play(done) shows a short full-screen cutscene:
   courtroom -> motion granted -> dragged to jail -> the cell -> the ending -> the Kaaba, Masjid an-Nabawi and 622. */
(function () {
  "use strict";
  var TX = {
    en: { c1: "Court is in session: The Scorpions v. The Crab", c2: "The judge rules: motion granted in the crab's favour ⚖️", c3: "All the scorpions are dragged off to jail", c4: "Skulls, dead roses… but two roses are still growing. The crab checks in on them.", c5: "The crab eventually lets them out, once they have learned to respect Allah and to be grateful to the crab who worked so hard for their love.", c6: "622 · The Hijrah, from Makkah to Madinah", end: "The End", skip: "Skip", back: "Back to the game", granted: "MOTION GRANTED", mk: "Makkah", md: "Madinah" },
    ur: { c1: "عدالت لگ چکی ہے: بچھو بنام کیکڑا", c2: "جج کا فیصلہ: درخواست کیکڑے کے حق میں منظور ⚖️", c3: "سارے بچھو گھسیٹ کر جیل لے جائے گئے", c4: "کھوپڑیاں، مرجھائے گلاب… مگر دو گلاب اب بھی کھل رہے ہیں۔ کیکڑا ان کی خبر لینے آتا ہے۔", c5: "آخرکار کیکڑا انہیں رہا کر دیتا ہے، جب وہ اللہ کا احترام سیکھ لیتے ہیں اور اس کیکڑے کے شکرگزار ہو جاتے ہیں جس نے ان کی محبت کے لیے اتنی محنت کی۔", c6: "622 · ہجرت، مکہ سے مدینہ", end: "ختم", skip: "چھوڑیں", back: "واپس کھیل میں", granted: "درخواست منظور", mk: "مکہ", md: "مدینہ" },
    ar: { c1: "انعقدت المحكمة: العقارب ضد السلطعون", c2: "حكم القاضي: قُبل الطلب لصالح السلطعون ⚖️", c3: "سُحبت العقارب كلها إلى السجن", c4: "جماجم وورود ذابلة… لكن وردتين ما زالتا تنموان. السلطعون يطمئن عليهما.", c5: "في النهاية يُطلق السلطعون سراحهم، بعد أن تعلّموا احترام الله والامتنان للسلطعون الذي تعب كثيرًا من أجل حبهم.", c6: "622 · الهجرة، من مكة إلى المدينة", end: "النهاية", skip: "تخطَّ", back: "العودة إلى اللعبة", granted: "قُبل الطلب", mk: "مكة", md: "المدينة" },
    fr: { c1: "L'audience est ouverte : les Scorpions contre le Crabe", c2: "Le juge tranche : requête accordée en faveur du crabe ⚖️", c3: "Tous les scorpions sont traînés en prison", c4: "Des crânes, des roses fanées… mais deux roses poussent encore. Le crabe vient prendre de leurs nouvelles.", c5: "Le crabe finit par les libérer, une fois qu'ils ont appris à respecter Allah et à être reconnaissants envers le crabe qui a tant travaillé pour leur amour.", c6: "622 · L'Hégire, de La Mecque à Médine", end: "Fin", skip: "Passer", back: "Retour au jeu", granted: "REQUÊTE ACCORDÉE", mk: "La Mecque", md: "Médine" },
    es: { c1: "Se abre la sesión: los Escorpiones contra el Cangrejo", c2: "El juez decide: moción concedida a favor del cangrejo ⚖️", c3: "Todos los escorpiones son arrastrados a la cárcel", c4: "Calaveras, rosas marchitas… pero dos rosas siguen creciendo. El cangrejo va a ver cómo están.", c5: "Con el tiempo el cangrejo los deja salir, cuando han aprendido a respetar a Allah y a agradecer al cangrejo que trabajó tanto por su amor.", c6: "622 · La Hégira, de La Meca a Medina", end: "Fin", skip: "Saltar", back: "Volver al juego", granted: "MOCIÓN CONCEDIDA", mk: "La Meca", md: "Medina" },
    ja: { c1: "開廷：サソリたち 対 カニ", c2: "判決：カニに有利な申し立てを認める ⚖️", c3: "サソリたちは全員、牢屋へ引きずられていく", c4: "ドクロと枯れたバラ…それでも2本のバラはまだ育っている。カニが様子を見に来る。", c5: "やがてカニは彼らを外に出してあげる。アッラーを敬い、彼らの愛のために懸命に働いたカニに感謝することを学んだときに。", c6: "622 · ヒジュラ、マッカからマディーナへ", end: "おわり", skip: "スキップ", back: "ゲームに戻る", granted: "申し立て認容", mk: "マッカ", md: "マディーナ" },
    zh: { c1: "开庭：蝎子们 诉 螃蟹", c2: "法官裁定：动议获准，判螃蟹胜诉 ⚖️", c3: "所有蝎子都被拖进了监狱", c4: "骷髅、枯萎的玫瑰……但还有两朵玫瑰在生长。螃蟹来看望它们。", c5: "最终螃蟹放它们出来，因为它们学会了敬畏安拉，并感激那只为了它们的爱如此努力的螃蟹。", c6: "622 · 希吉拉，从麦加到麦地那", end: "完", skip: "跳过", back: "回到游戏", granted: "动议获准", mk: "麦加", md: "麦地那" },
    ko: { c1: "개정합니다: 전갈들 대 게", c2: "판사의 판결: 게에게 유리하게 신청 인용 ⚖️", c3: "전갈들은 모두 감옥으로 끌려간다", c4: "해골과 시든 장미… 그래도 장미 두 송이는 아직 자라고 있다. 게가 들여다본다.", c5: "결국 게는 그들을 풀어 준다. 그들이 알라를 공경하고, 그들의 사랑을 위해 그토록 애쓴 게에게 감사하는 법을 배웠을 때.", c6: "622 · 히즈라, 메카에서 메디나로", end: "끝", skip: "건너뛰기", back: "게임으로 돌아가기", granted: "신청 인용", mk: "메카", md: "메디나" }
  };
  function tx() { return TX[(document.documentElement.lang || "en").slice(0, 2)] || TX.en; }

  var CSS = '\
.ct{position:fixed;inset:0;z-index:9999;background:#05070f;color:#f6efe0;font-family:system-ui,sans-serif;overflow:hidden;display:flex;align-items:center;justify-content:center}\
.ct__scene{position:absolute;inset:0;opacity:0;transition:opacity .7s;display:flex;align-items:center;justify-content:center}\
.ct__scene.on{opacity:1}\
.ct__cap{position:absolute;left:50%;bottom:7%;transform:translateX(-50%);width:min(92%,720px);text-align:center;font:600 clamp(1rem,3.4vw,1.4rem)/1.4 Georgia,serif;text-shadow:0 2px 10px #000;z-index:3}\
.ct__skip{position:absolute;top:14px;right:14px;z-index:4;border:1px solid rgba(232,200,126,.6);background:rgba(0,0,0,.5);color:#f6efe0;border-radius:999px;padding:.45rem 1rem;font:600 .9rem system-ui,sans-serif;cursor:pointer}\
.ct__stage{position:relative;width:min(96vw,900px);height:min(70vh,560px)}\
.ct--court{background:linear-gradient(180deg,#3a2414 0,#5b3a1f 55%,#2a190c 55%,#1b0f07 100%)}\
.ct--court::before{content:"";position:absolute;inset:0 0 45% 0;background:repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 4px,transparent 4px 90px)}\
.ct__seal{position:absolute;left:50%;top:4%;transform:translateX(-50%);font-size:clamp(2.4rem,7vw,4rem);filter:drop-shadow(0 0 14px rgba(255,210,110,.7))}\
.ct__bench{position:absolute;left:50%;top:22%;transform:translateX(-50%);width:62%;height:26%;background:linear-gradient(180deg,#7a4a22,#4a2a10);border:3px solid #c9a45c;border-radius:10px 10px 0 0;box-shadow:0 10px 30px rgba(0,0,0,.6)}\
.ct__judge{position:absolute;left:50%;top:6%;transform:translateX(-50%);font-size:clamp(3rem,9vw,5.2rem)}\
.ct__gavel{position:absolute;right:16%;top:10%;font-size:clamp(2rem,6vw,3.4rem);transform-origin:80% 80%}\
.ct__scene.on .ct__gavel{animation:ctbang 1s ease-in 1s 3}\
@keyframes ctbang{40%{transform:rotate(-40deg)}60%{transform:rotate(18deg)}}\
.ct__granted{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-8deg) scale(2.4);opacity:0;border:5px solid #ff4a3a;color:#ff4a3a;padding:.3rem 1rem;border-radius:10px;font:900 clamp(1.4rem,5vw,2.6rem) system-ui,sans-serif;letter-spacing:.08em;background:rgba(255,255,255,.08);z-index:2}\
.ct__scene.on .ct__granted{animation:ctstamp .4s 2.2s ease-in forwards}\
@keyframes ctstamp{to{opacity:1;transform:translate(-50%,-50%) rotate(-8deg) scale(1)}}\
.ct__p{position:relative;display:flex;flex-direction:column;align-items:center}\
.ct__p b{font-size:clamp(2.4rem,7vw,4.4rem);line-height:1;position:relative;z-index:1}\
.ct__p i{display:block;width:clamp(48px,11vw,86px);height:clamp(40px,9vw,70px);margin-top:-8px;background:linear-gradient(90deg,#12141c 0 38%,#fff 38% 44%,#c1121f 44% 56%,#fff 56% 62%,#12141c 62%);clip-path:polygon(12% 0,88% 0,100% 100%,0 100%);border-radius:4px}\
.ct__p--big b{font-size:clamp(3.4rem,10vw,6rem)}\
.ct__p--big i{width:clamp(70px,16vw,120px);height:clamp(54px,12vw,92px)}\
.ct__p small{font:800 .7rem system-ui,sans-serif;letter-spacing:.14em;color:#e8c87e;margin-top:.2rem}\
.ct--road{background:linear-gradient(180deg,#0b1030 0,#1b2347 60%,#222 60%,#111 100%)}\
.ct__jailhouse{position:absolute;right:4%;bottom:38%;width:30%;height:40%;background:#5a5f6b;border:4px solid #2c2f36;display:flex;align-items:flex-end;justify-content:center;font:900 clamp(.8rem,2.4vw,1.2rem) system-ui;letter-spacing:.2em}\
.ct__jailhouse::before{content:"JAIL";position:absolute;top:8%;left:50%;transform:translateX(-50%);color:#ffd23a}\
.ct__jailhouse::after{content:"";width:40%;height:55%;background:repeating-linear-gradient(90deg,#111 0 6px,transparent 6px 16px),#2a2d34}\
.ct__line{position:absolute;bottom:22%;left:-60%;display:flex;gap:2vw;align-items:flex-end}\
.ct__scene.on .ct__line{animation:ctdrag 4.5s linear forwards}\
@keyframes ctdrag{to{left:62%}}\
.ct__line .ct__p{position:relative;bottom:auto;animation:ctwobble .4s ease-in-out infinite alternate}\
@keyframes ctwobble{to{transform:rotate(8deg) translateY(-4px)}}\
.ct__chain{position:absolute;top:30%;left:0;right:0;height:3px;background:repeating-linear-gradient(90deg,#bbb 0 8px,transparent 8px 12px)}\
.ct--cell{background:radial-gradient(circle at 50% 30%,#2a2f3a,#0b0d12 75%)}\
.ct__bars{position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 9%,#3b3f48 9% 10.5%);pointer-events:none;z-index:2}\
.ct__floor{position:absolute;left:0;right:0;bottom:0;height:30%;background:linear-gradient(180deg,#22252c,#121318)}\
.ct__it{position:absolute;font-size:clamp(1.6rem,5vw,2.8rem)}\
.ct__rose{position:absolute;bottom:22%;font-size:clamp(2rem,6vw,3.4rem);transform-origin:50% 100%}\
.ct__scene.on .ct__rose{animation:ctgrow 3s ease-out forwards}\
@keyframes ctgrow{from{transform:scale(.3)}to{transform:scale(1.15)}}\
.ct__glass{position:absolute;left:50%;bottom:20%;transform:translateX(-50%);font-size:clamp(2.4rem,7vw,4rem);z-index:1}\
.ct__scene.on .ct__glass{animation:ctflip 2.4s ease-in-out infinite}\
@keyframes ctflip{0%,40%{transform:translateX(-50%) rotate(0)}60%,100%{transform:translateX(-50%) rotate(180deg)}}\
.ct__visit{position:absolute;bottom:18%;right:-30%;z-index:3}\
.ct__scene.on .ct__visit{animation:ctvisit 4.5s ease-out forwards}\
@keyframes ctvisit{to{right:6%}}\
.ct--end{background:radial-gradient(circle at 50% 40%,#1a2340,#05070f 70%)}\
.ct__end{max-width:760px;padding:0 6%;text-align:center;font:500 clamp(1.15rem,3.8vw,1.7rem)/1.55 Georgia,serif}\
.ct__end b{display:block;margin-top:1rem;color:#e8c87e;font-size:clamp(1.4rem,5vw,2.2rem)}\
.ct--holy{background:#0a1230}\
.ct__holy{position:absolute;inset:0}\
.ct__holy svg{position:absolute;left:0;top:0;width:100%;height:100%}\
.ct__lh{position:absolute;top:6%;left:50%;transform:translateX(-50%);font:600 clamp(1.3rem,4.4vw,2.2rem) "Noto Naskh Arabic",serif;color:#ffe7a3;white-space:nowrap;text-shadow:0 0 16px rgba(255,210,110,.6)}\
.ct__back{position:absolute;left:50%;bottom:3%;transform:translateX(-50%);z-index:4;border:0;border-radius:999px;padding:.8rem 1.5rem;background:linear-gradient(135deg,#f3dc9f,#c9a45c);color:#1a1206;font:800 1rem system-ui,sans-serif;cursor:pointer;opacity:0;transition:opacity .5s}\
.ct__back.on{opacity:1}\
.ct--holy .ct__cap{bottom:auto;top:12%;font-size:clamp(.9rem,2.6vw,1.15rem)}\
@media(prefers-reduced-motion:reduce){.ct *{animation:none!important}}';

  function suit(face, label, big) {
    return '<div class="ct__p' + (big ? " ct__p--big" : "") + '"><b>' + face + "</b><i></i>" + (label ? "<small>" + label + "</small>" : "") + "</div>";
  }
  function holySVG(t) {
    var P = innerWidth < innerHeight;   // portrait phones get a taller layout so nothing is cropped
    var L = P ? { vb: "0 0 600 1000", cx: 300, cy: 200, ty: 330, sand: 600, path: "M150 640 C 230 520, 380 520, 460 640", kaaba: "translate(40 600) scale(.95)", mosque: "translate(330 590) scale(.95)", stars: 600 }
              : { vb: "0 0 1000 600", cx: 500, cy: 150, ty: 250, sand: 330, path: "M270 420 C 400 300, 600 300, 730 420", kaaba: "translate(150 330)", mosque: "translate(640 300)", stars: 300 };
    // Kaaba (left), Masjid an-Nabawi with its green dome (right), the Hijrah path between them, 622 and the crescent and star
    return '<svg viewBox="' + L.vb + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<defs><linearGradient id="ctG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffe7a3"/><stop offset="1" stop-color="#c9a45c"/></linearGradient></defs>' +
      '<rect x="-500" y="' + L.sand + '" width="2000" height="1000" fill="#c9a774"/>' +
      Array.from({ length: 40 }, function (_, i) { return '<circle cx="' + ((i * 97) % 1000) + '" cy="' + ((i * 53) % L.stars) + '" r="' + (1 + (i % 3) * 0.6) + '" fill="#fff" opacity="' + (0.4 + (i % 5) * 0.12) + '"/>'; }).join("") +
      // crescent and star with 622
      '<g transform="translate(' + L.cx + ' ' + L.cy + ')"><circle r="46" fill="url(#ctG)"/><circle cx="18" cy="-10" r="40" fill="#13204a"/><path d="M40 -42l5 13 14 1-11 9 4 14-12-8-12 8 4-14-11-9 14-1z" fill="#ffe7a3"/></g>' +
      '<text x="' + L.cx + '" y="' + L.ty + '" text-anchor="middle" font-family="Georgia,serif" font-size="58" font-weight="700" fill="url(#ctG)">622</text>' +
      '<text x="' + L.cx + '" y="' + (L.ty + 32) + '" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#ffe7a3">١ هـ · HIJRAH</text>' +
      // the path of the Hijrah
      '<path d="' + L.path + '" fill="none" stroke="#ffe7a3" stroke-width="4" stroke-dasharray="10 12" opacity=".9"/>' +
      '<text font-size="34"><textPath href="#ctPath" startOffset="0%">🐪<animate attributeName="startOffset" from="0%" to="92%" dur="5s" fill="freeze"/></textPath></text>' +
      '<path id="ctPath" d="' + L.path.replace(/(\d+) (\d+)/g, function (m, x, y) { return x + " " + (y - 20); }) + '" fill="none"/>' +
      // Kaaba
      '<g transform="' + L.kaaba + '">' +
      '<polygon points="0,40 120,20 120,200 0,220" fill="#111"/><polygon points="120,20 200,45 200,215 120,200" fill="#050505"/><polygon points="0,40 80,62 200,45 120,20" fill="#222"/>' +
      '<polygon points="0,78 120,58 120,78 0,98" fill="url(#ctG)"/><polygon points="120,58 200,82 200,102 120,78" fill="#b38f4a"/>' +
      '<rect x="70" y="130" width="28" height="56" fill="url(#ctG)" transform="skewY(-9)"/>' +
      '<text x="100" y="255" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="#2a190c">' + t.mk + "</text></g>" +
      // Masjid an-Nabawi
      '<g transform="' + L.mosque + '">' +
      '<rect x="0" y="120" width="240" height="120" fill="#efe3c8" stroke="#c9a45c" stroke-width="3"/>' +
      [0, 1, 2, 3, 4, 5].map(function (i) { return '<path d="M' + (14 + i * 37) + ' 240 v-50 a14 14 0 0 1 28 0 v50" fill="#d9c7a0"/>'; }).join("") +
      '<rect x="95" y="70" width="70" height="50" fill="#efe3c8"/><path d="M90 74 Q130 -6 170 74 Z" fill="#1f9a4a"/><line x1="130" y1="34" x2="130" y2="8" stroke="url(#ctG)" stroke-width="4"/><circle cx="130" cy="6" r="6" fill="url(#ctG)"/>' +
      [-14, 254].map(function (x) { return '<rect x="' + (x - 6) + '" y="10" width="12" height="230" fill="#efe3c8" stroke="#c9a45c"/><path d="M' + (x - 9) + ' 12 L' + x + ' -26 L' + (x + 9) + ' 12 Z" fill="#c9a45c"/>'; }).join("") +
      '<text x="120" y="275" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="#2a190c">' + t.md + "</text></g>" +
      "</svg>";
  }

  var busy = false;
  function play(done) {
    if (busy) return; busy = true;
    if (!document.getElementById("ctCss")) { var st = document.createElement("style"); st.id = "ctCss"; st.textContent = CSS; document.head.appendChild(st); }
    var t = tx(), name = Math.random() < 0.5 ? "AL-ʿADL" : "AL-ḤAKAM";
    var box = document.createElement("div");
    box.className = "ct"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", t.c1);
    var scenes = [
      ['ct--court', '<div class="ct__stage"><span class="ct__seal">⚖️</span><div class="ct__bench"></div><span class="ct__judge">🧑‍⚖️</span><span class="ct__gavel">🔨</span>' +
        '<div style="position:absolute;left:4%;bottom:6%;display:flex;gap:2%">' + suit("🦂") + suit("🦂") + suit("🦂") + "</div>" +
        '<div style="position:absolute;right:6%;bottom:6%">' + suit("🦀", "👑", true) + "</div></div>", t.c1],
      ['ct--court', '<div class="ct__stage"><span class="ct__seal">⚖️</span><div class="ct__bench"></div><span class="ct__judge">🧑‍⚖️</span><span class="ct__gavel">🔨</span><span class="ct__granted">' + t.granted + "</span>" +
        '<div style="position:absolute;left:4%;bottom:6%;display:flex;gap:2%">' + suit("🦂") + suit("🦂") + suit("🦂") + "</div>" +
        '<div style="position:absolute;right:6%;bottom:6%">' + suit("🦀", "⚖️ " + name, true) + "</div></div>", t.c2],
      ['ct--road', '<div class="ct__stage"><div class="ct__jailhouse"></div><div class="ct__line"><div class="ct__chain"></div>' + suit("🦂") + suit("🦂") + suit("🦂") + suit("👮") + "</div></div>", t.c3],
      ['ct--cell', '<div class="ct__stage"><div class="ct__floor"></div><span class="ct__it" style="left:8%;bottom:16%">💀</span><span class="ct__it" style="left:20%;bottom:12%">💀</span><span class="ct__it" style="right:12%;bottom:14%">💀</span>' +
        '<span class="ct__it" style="left:32%;bottom:20%">🥀</span><span class="ct__it" style="right:26%;bottom:18%">🥀</span><span class="ct__it" style="left:14%;bottom:26%">🥀</span>' +
        '<span class="ct__rose" style="left:40%">🌹</span><span class="ct__rose" style="left:54%">🌹</span><span class="ct__glass">⏳</span>' +
        '<span class="ct__it" style="left:6%;bottom:34%">🦂</span><span class="ct__it" style="left:72%;bottom:30%">🦂</span>' +
        '<div class="ct__bars"></div><div class="ct__visit">' + suit("🦀", "", true) + "</div></div>", t.c4],
      ['ct--end', '<div class="ct__end">' + t.c5 + "<b>⚖️ AL-ʿADL · AL-ḤAKAM</b></div>", ""],
      ['ct--holy', '<div class="ct__holy">' + holySVG(t) + '<span class="ct__lh" lang="ar">لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّهِ</span></div>', t.c6 + " · " + t.end]
    ];
    box.innerHTML = scenes.map(function (s) { return '<div class="ct__scene ' + s[0] + '">' + s[1] + (s[2] ? '<p class="ct__cap">' + s[2] + "</p>" : "") + "</div>"; }).join("") +
      '<button type="button" class="ct__skip">' + t.skip + ' ✕</button><button type="button" class="ct__back">' + t.back + "</button>";
    document.body.appendChild(box);
    var els = box.querySelectorAll(".ct__scene"), i = -1, timer = 0, back = box.querySelector(".ct__back");
    var DUR = [4200, 4200, 4600, 5200, 6500, 7000];
    function finish() { clearTimeout(timer); box.remove(); busy = false; document.removeEventListener("keydown", onKey); if (done) done(); }
    function next() {
      if (i >= 0) els[i].classList.remove("on");
      i++;
      if (i >= els.length) { finish(); return; }
      els[i].classList.add("on");
      if (i === els.length - 1) { back.classList.add("on"); back.focus(); }
      timer = setTimeout(next, DUR[i]);
    }
    function onKey(e) { if (e.key === "Escape") finish(); }
    box.querySelector(".ct__skip").addEventListener("click", finish);
    back.addEventListener("click", finish);
    document.addEventListener("keydown", onKey);
    box.querySelector(".ct__skip").focus();
    next();
  }
  window.coachCourt = { play: play, busy: function () { return busy; } };
})();

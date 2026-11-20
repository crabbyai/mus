/* The Hammer of Justice ending, shared by both Scorpion Street games.
   window.coachCourt.play(done) shows a short full-screen cutscene:
   courtroom -> motion granted -> dragged to jail -> the cell -> the ending -> the Kaaba, Masjid an-Nabawi and 622. */
(function () {
  "use strict";
  var TX = {
    en: { pp: "The crab is a prince 🤴. The scorpion will be a princess 👸, once she learns to respect the crab.", c1: "Court is in session: The Scorpions v. The Crab", c2: "The judge rules: motion granted in the crab's favour ⚖️", c3: "All the scorpions are dragged off to jail", c4: "Skulls, dead roses… but two roses are still growing. The crab checks in on them.", c5: "The crab eventually lets them out, once they have learned to respect Allah and to be grateful to the crab who worked so hard for their love.", c6: "622 · The Hijrah, from Makkah to Madinah", end: "The End", skip: "Skip", back: "Back to the game", granted: "MOTION GRANTED", mk: "Makkah", md: "Madinah" },
    ur: { pp: "کیکڑا ایک شہزادہ ہے 🤴۔ بچھو شہزادی بنے گی 👸، جب وہ کیکڑے کا احترام سیکھ لے گی۔", c1: "عدالت لگ چکی ہے: بچھو بنام کیکڑا", c2: "جج کا فیصلہ: درخواست کیکڑے کے حق میں منظور ⚖️", c3: "سارے بچھو گھسیٹ کر جیل لے جائے گئے", c4: "کھوپڑیاں، مرجھائے گلاب… مگر دو گلاب اب بھی کھل رہے ہیں۔ کیکڑا ان کی خبر لینے آتا ہے۔", c5: "آخرکار کیکڑا انہیں رہا کر دیتا ہے، جب وہ اللہ کا احترام سیکھ لیتے ہیں اور اس کیکڑے کے شکرگزار ہو جاتے ہیں جس نے ان کی محبت کے لیے اتنی محنت کی۔", c6: "622 · ہجرت، مکہ سے مدینہ", end: "ختم", skip: "چھوڑیں", back: "واپس کھیل میں", granted: "درخواست منظور", mk: "مکہ", md: "مدینہ" },
    ar: { pp: "السلطعون أمير 🤴. والعقرب ستصبح أميرة 👸 حين تتعلّم احترام السلطعون.", c1: "انعقدت المحكمة: العقارب ضد السلطعون", c2: "حكم القاضي: قُبل الطلب لصالح السلطعون ⚖️", c3: "سُحبت العقارب كلها إلى السجن", c4: "جماجم وورود ذابلة… لكن وردتين ما زالتا تنموان. السلطعون يطمئن عليهما.", c5: "في النهاية يُطلق السلطعون سراحهم، بعد أن تعلّموا احترام الله والامتنان للسلطعون الذي تعب كثيرًا من أجل حبهم.", c6: "622 · الهجرة، من مكة إلى المدينة", end: "النهاية", skip: "تخطَّ", back: "العودة إلى اللعبة", granted: "قُبل الطلب", mk: "مكة", md: "المدينة" },
    fr: { pp: "Le crabe est un prince 🤴. La scorpionne sera une princesse 👸, quand elle apprendra à respecter le crabe.", c1: "L'audience est ouverte : les Scorpions contre le Crabe", c2: "Le juge tranche : requête accordée en faveur du crabe ⚖️", c3: "Tous les scorpions sont traînés en prison", c4: "Des crânes, des roses fanées… mais deux roses poussent encore. Le crabe vient prendre de leurs nouvelles.", c5: "Le crabe finit par les libérer, une fois qu'ils ont appris à respecter Allah et à être reconnaissants envers le crabe qui a tant travaillé pour leur amour.", c6: "622 · L'Hégire, de La Mecque à Médine", end: "Fin", skip: "Passer", back: "Retour au jeu", granted: "REQUÊTE ACCORDÉE", mk: "La Mecque", md: "Médine" },
    es: { pp: "El cangrejo es un príncipe 🤴. La escorpiona será una princesa 👸, cuando aprenda a respetar al cangrejo.", c1: "Se abre la sesión: los Escorpiones contra el Cangrejo", c2: "El juez decide: moción concedida a favor del cangrejo ⚖️", c3: "Todos los escorpiones son arrastrados a la cárcel", c4: "Calaveras, rosas marchitas… pero dos rosas siguen creciendo. El cangrejo va a ver cómo están.", c5: "Con el tiempo el cangrejo los deja salir, cuando han aprendido a respetar a Allah y a agradecer al cangrejo que trabajó tanto por su amor.", c6: "622 · La Hégira, de La Meca a Medina", end: "Fin", skip: "Saltar", back: "Volver al juego", granted: "MOCIÓN CONCEDIDA", mk: "La Meca", md: "Medina" },
    ja: { pp: "カニは王子 🤴。サソリはカニを敬うことを学んだら、プリンセスになる 👸。", c1: "開廷：サソリたち 対 カニ", c2: "判決：カニに有利な申し立てを認める ⚖️", c3: "サソリたちは全員、牢屋へ引きずられていく", c4: "ドクロと枯れたバラ…それでも2本のバラはまだ育っている。カニが様子を見に来る。", c5: "やがてカニは彼らを外に出してあげる。アッラーを敬い、彼らの愛のために懸命に働いたカニに感謝することを学んだときに。", c6: "622 · ヒジュラ、マッカからマディーナへ", end: "おわり", skip: "スキップ", back: "ゲームに戻る", granted: "申し立て認容", mk: "マッカ", md: "マディーナ" },
    zh: { pp: "螃蟹是王子 🤴。蝎子学会尊重螃蟹后，就会成为公主 👸。", c1: "开庭：蝎子们 诉 螃蟹", c2: "法官裁定：动议获准，判螃蟹胜诉 ⚖️", c3: "所有蝎子都被拖进了监狱", c4: "骷髅、枯萎的玫瑰……但还有两朵玫瑰在生长。螃蟹来看望它们。", c5: "最终螃蟹放它们出来，因为它们学会了敬畏安拉，并感激那只为了它们的爱如此努力的螃蟹。", c6: "622 · 希吉拉，从麦加到麦地那", end: "完", skip: "跳过", back: "回到游戏", granted: "动议获准", mk: "麦加", md: "麦地那" },
    ko: { pp: "게는 왕자입니다 🤴. 전갈은 게를 존중하는 법을 배우면 공주가 될 거예요 👸.", c1: "개정합니다: 전갈들 대 게", c2: "판사의 판결: 게에게 유리하게 신청 인용 ⚖️", c3: "전갈들은 모두 감옥으로 끌려간다", c4: "해골과 시든 장미… 그래도 장미 두 송이는 아직 자라고 있다. 게가 들여다본다.", c5: "결국 게는 그들을 풀어 준다. 그들이 알라를 공경하고, 그들의 사랑을 위해 그토록 애쓴 게에게 감사하는 법을 배웠을 때.", c6: "622 · 히즈라, 메카에서 메디나로", end: "끝", skip: "건너뛰기", back: "게임으로 돌아가기", granted: "신청 인용", mk: "메카", md: "메디나" }
  };
  function tx() { return TX[(document.documentElement.lang || "en").slice(0, 2)] || TX.en; }
  var MX = {"en": {"pause": "⏸ The crab pauses the game…", "spree": "Shopping spree! 🛍️", "dem": ["Buy me that bag! 👜", "I want the diamond necklace! 💎", "And those heels! 👠", "Gold bangles too! 🪙", "Take me to every single store! 🛍️"], "nb": "Not before shaadi. 💍", "joke": "😏 It was all a joke.", "hum": "SCORPION HUMILIATED", "back": "Back to the fight! ⚔️", "wh": "I can help you both manifest your dreams and desires", "whby": "Prince Crab, whispering", "beg": ["Pick me, Prince Crab! 🙏", "I'll respect you now! 👸"], "lvl": "Mall level"}, "ur": {"pause": "⏸ کیکڑا گیم روک دیتا ہے…", "spree": "شاپنگ اسپری! 🛍️", "dem": ["مجھے وہ بیگ دلاؤ! 👜", "مجھے ہیروں کا ہار چاہیے! 💎", "اور وہ ہیلز بھی! 👠", "سونے کی چوڑیاں بھی! 🪙", "مجھے ہر دکان پر لے چلو! 🛍️"], "nb": "شادی سے پہلے نہیں۔ 💍", "joke": "😏 یہ سب مذاق تھا۔", "hum": "بچھو کی بے عزتی", "back": "واپس لڑائی میں! ⚔️", "wh": "میں تم دونوں کی خوابوں اور خواہشات کو پانے میں مدد کر سکتا ہوں", "whby": "شہزادہ کیکڑا، سرگوشی میں", "beg": ["مجھے چن لو، شہزادہ کیکڑا! 🙏", "اب میں عزت کروں گی! 👸"], "lvl": "مال لیول"}, "ar": {"pause": "⏸ السلطعون يوقف اللعبة…", "spree": "جولة تسوّق! 🛍️", "dem": ["اشترِ لي تلك الحقيبة! 👜", "أريد عقد الألماس! 💎", "وذلك الكعب العالي! 👠", "وأساور الذهب أيضًا! 🪙", "خذني إلى كل المتاجر! 🛍️"], "nb": "ليس قبل الشادي (الزواج). 💍", "joke": "😏 كان الأمر كله مزحة.", "hum": "إذلال العقرب", "back": "عودة إلى القتال! ⚔️", "wh": "أستطيع أن أساعدكما على تحقيق أحلامكما ورغباتكما", "whby": "الأمير السلطعون، هامسًا", "beg": ["اخترني يا أمير السلطعون! 🙏", "سأحترمك الآن! 👸"], "lvl": "مستوى المول"}, "fr": {"pause": "⏸ Le crabe met le jeu en pause…", "spree": "Virée shopping ! 🛍️", "dem": ["Achète-moi ce sac ! 👜", "Je veux le collier de diamants ! 💎", "Et ces talons ! 👠", "Des bracelets en or aussi ! 🪙", "Emmène-moi dans toutes les boutiques ! 🛍️"], "nb": "Pas avant la shaadi. 💍", "joke": "😏 Ce n'était qu'une blague.", "hum": "SCORPION HUMILIÉ", "back": "Retour au combat ! ⚔️", "wh": "Je peux vous aider tous les deux à manifester vos rêves et vos désirs", "whby": "Prince Crabe, en chuchotant", "beg": ["Choisis-moi, Prince Crabe ! 🙏", "Je te respecterai maintenant ! 👸"], "lvl": "Niveau du centre"}, "es": {"pause": "⏸ El cangrejo pausa el juego…", "spree": "¡De compras! 🛍️", "dem": ["¡Cómprame ese bolso! 👜", "¡Quiero el collar de diamantes! 💎", "¡Y esos tacones! 👠", "¡Pulseras de oro también! 🪙", "¡Llévame a todas las tiendas! 🛍️"], "nb": "No antes de la shaadi. 💍", "joke": "😏 Todo era una broma.", "hum": "ESCORPIÓN HUMILLADO", "back": "¡De vuelta a la pelea! ⚔️", "wh": "Puedo ayudaros a los dos a manifestar vuestros sueños y deseos", "whby": "Príncipe Cangrejo, susurrando", "beg": ["¡Elígeme, Príncipe Cangrejo! 🙏", "¡Ahora te respetaré! 👸"], "lvl": "Nivel del centro"}, "ja": {"pause": "⏸ カニがゲームを一時停止…", "spree": "ショッピング三昧！🛍️", "dem": ["あのバッグを買って！👜", "ダイヤのネックレスがほしい！💎", "あのヒールも！👠", "金のバングルも！🪙", "全部のお店に連れてって！🛍️"], "nb": "シャーディー（結婚）の前はダメ。💍", "joke": "😏 ぜんぶ冗談でした。", "hum": "サソリ、赤っ恥", "back": "戦いに戻ろう！⚔️", "wh": "私はふたりの夢と願いを叶える手助けができる", "whby": "カニ王子のささやき", "beg": ["私を選んで、カニ王子！🙏", "これからは敬います！👸"], "lvl": "モールのレベル"}, "zh": {"pause": "⏸ 螃蟹暂停了游戏……", "spree": "疯狂购物！🛍️", "dem": ["给我买那个包！👜", "我要那条钻石项链！💎", "还有那双高跟鞋！👠", "金手镯也要！🪙", "带我逛遍每一家店！🛍️"], "nb": "婚礼（shaadi）之前不行。💍", "joke": "😏 这一切都只是个玩笑。", "hum": "蝎子颜面扫地", "back": "回到战斗！⚔️", "wh": "我可以帮助你们俩实现梦想与愿望", "whby": "螃蟹王子的低语", "beg": ["选我吧，螃蟹王子！🙏", "我现在会尊重你了！👸"], "lvl": "商场等级"}, "ko": {"pause": "⏸ 게가 게임을 일시정지한다…", "spree": "쇼핑 대잔치! 🛍️", "dem": ["저 가방 사 줘! 👜", "다이아몬드 목걸이 갖고 싶어! 💎", "저 힐도! 👠", "금팔찌도! 🪙", "모든 가게에 데려가 줘! 🛍️"], "nb": "샤디(결혼) 전에는 안 돼. 💍", "joke": "😏 전부 농담이었어.", "hum": "전갈 망신", "back": "다시 싸우자! ⚔️", "wh": "나는 너희 둘이 꿈과 소망을 이루도록 도울 수 있어", "whby": "게 왕자의 속삭임", "beg": ["저를 골라 주세요, 게 왕자님! 🙏", "이제 존중할게요! 👸"], "lvl": "몰 레벨"}};
  var ASK = "Can I be your sukoon Adeel Ahmed Rahman meri jaan? 🥺", REPLY = "Kiya hua meri jaan? 🦀";
  window.coachJaan = { ask: ASK, reply: REPLY };
  var BEG = [ASK, "Mr Crab can I be your wife? 💍", "Do you feel it Mr Crabs? The tension? 😳", "Main apko sukoon doongi aur ap mujhe sukoon do ge. 🥺"];   // the scorpions' own words, kept as written
  function mx() { return MX[(document.documentElement.lang || "en").slice(0, 2)] || MX.en; }
  var PX = {"en": {"flip": "🔄 The crab flips his carpet… surprise! It's a Pakistani flag! 🇵🇰", "sadqa": "🐐 Sadqa: the crab gives a black goat to keep the evil eye away 🧿", "gifts": "The crab gives them a Qur'an, a miswak, a tasbih and a rose, all from Makkah 🕋", "umrah": "…and promises to take them for Umrah, their own 622 moment, if they are nice and respect the crab and Allah's plan. إن شاء الله", "quran": "Qur'an", "miswak": "Miswak", "tasbih": "Tasbih", "rose": "Rose", "fm": "from Makkah"}, "ur": {"flip": "🔄 کیکڑا اپنا قالین پلٹتا ہے… سرپرائز! یہ پاکستانی پرچم ہے! 🇵🇰", "sadqa": "🐐 صدقہ: کیکڑا نظرِ بد سے بچنے کے لیے کالا بکرا دیتا ہے 🧿", "gifts": "کیکڑا انہیں قرآن، مسواک، تسبیح اور گلاب دیتا ہے، سب مکہ سے 🕋", "umrah": "…اور وعدہ کرتا ہے کہ انہیں عمرہ پر لے جائے گا، ان کا اپنا 622 لمحہ، اگر وہ اچھے رہیں اور کیکڑے اور اللہ کے منصوبے کا احترام کریں۔ إن شاء الله", "quran": "قرآن", "miswak": "مسواک", "tasbih": "تسبیح", "rose": "گلاب", "fm": "مکہ سے"}, "ar": {"flip": "🔄 السلطعون يقلب سجادته… مفاجأة! إنها علم باكستان! 🇵🇰", "sadqa": "🐐 صدقة: السلطعون يتصدّق بتيس أسود ليدفع العين 🧿", "gifts": "السلطعون يهديهم مصحفًا ومسواكًا وسبحة ووردة، كلها من مكة 🕋", "umrah": "…ويعدهم بأن يأخذهم إلى العمرة، لحظة 622 الخاصة بهم، إن أحسنوا واحترموا السلطعون وتدبير الله. إن شاء الله", "quran": "المصحف", "miswak": "مسواك", "tasbih": "سبحة", "rose": "وردة", "fm": "من مكة"}, "fr": {"flip": "🔄 Le crabe retourne son tapis… surprise ! C'est le drapeau du Pakistan ! 🇵🇰", "sadqa": "🐐 Sadaqa : le crabe offre une chèvre noire pour éloigner le mauvais œil 🧿", "gifts": "Le crabe leur offre un Coran, un siwak, un tasbih et une rose, tous venus de La Mecque 🕋", "umrah": "…et promet de les emmener faire la Omra, leur propre moment 622, s'ils sont gentils et respectent le crabe et le plan d'Allah. إن شاء الله", "quran": "Coran", "miswak": "Siwak", "tasbih": "Tasbih", "rose": "Rose", "fm": "de La Mecque"}, "es": {"flip": "🔄 El cangrejo da la vuelta a su alfombra… ¡sorpresa! ¡Es la bandera de Pakistán! 🇵🇰", "sadqa": "🐐 Sadaqa: el cangrejo da una cabra negra para alejar el mal de ojo 🧿", "gifts": "El cangrejo les regala un Corán, un miswak, un tasbih y una rosa, todo de La Meca 🕋", "umrah": "…y promete llevarlos a la Umrah, su propio momento 622, si son buenos y respetan al cangrejo y el plan de Allah. إن شاء الله", "quran": "Corán", "miswak": "Miswak", "tasbih": "Tasbih", "rose": "Rosa", "fm": "de La Meca"}, "ja": {"flip": "🔄 カニがじゅうたんをひっくり返す…サプライズ！パキスタンの国旗だ！🇵🇰", "sadqa": "🐐 サダカ：邪視を払うため、カニが黒いヤギを差し出す 🧿", "gifts": "カニは彼らにクルアーン、ミスワーク、タスビーフ、バラを贈る。すべてマッカから 🕋", "umrah": "…そして、いい子にしてカニとアッラーのご計画を敬うなら、ウムラに連れて行くと約束する。彼らだけの622の瞬間。إن شاء الله", "quran": "クルアーン", "miswak": "ミスワーク", "tasbih": "タスビーフ", "rose": "バラ", "fm": "マッカから"}, "zh": {"flip": "🔄 螃蟹把地毯翻过来……惊喜！是巴基斯坦国旗！🇵🇰", "sadqa": "🐐 施舍：螃蟹献出一只黑山羊以驱除毒眼 🧿", "gifts": "螃蟹送给它们一本《古兰经》、一根米斯瓦克、一串念珠和一朵玫瑰，全都来自麦加 🕋", "umrah": "……并承诺，只要它们乖巧并尊重螃蟹和安拉的安排，就带它们去副朝，属于它们自己的622时刻。إن شاء الله", "quran": "古兰经", "miswak": "米斯瓦克", "tasbih": "念珠", "rose": "玫瑰", "fm": "来自麦加"}, "ko": {"flip": "🔄 게가 카펫을 뒤집는다… 깜짝! 파키스탄 국기다! 🇵🇰", "sadqa": "🐐 사다카: 게가 나쁜 눈을 막으려고 검은 염소를 바친다 🧿", "gifts": "게가 그들에게 꾸란, 미스왁, 타스비, 장미를 준다. 모두 메카에서 온 것 🕋", "umrah": "…그리고 착하게 굴며 게와 알라의 계획을 존중한다면 우므라에 데려가겠다고 약속한다. 그들만의 622 순간. إن شاء الله", "quran": "꾸란", "miswak": "미스왁", "tasbih": "타스비", "rose": "장미", "fm": "메카에서"}};
  function px() { return PX[(document.documentElement.lang || "en").slice(0, 2)] || PX.en; }
  window.coachPind = px;
  function begLines() { return BEG.concat(mx().beg); }

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
.ct--gift{background:radial-gradient(circle at 50% 30%,#3a2a10,#0b0806 75%)}\
.gf__row{position:absolute;left:50%;top:22%;transform:translateX(-50%);display:flex;gap:clamp(.6rem,3vw,1.6rem)}\
.gf__it{display:flex;flex-direction:column;align-items:center;opacity:0;animation:mlpop .5s ease forwards}\
.gf__it b{font-size:clamp(2.2rem,8vw,4rem);filter:drop-shadow(0 0 14px rgba(255,215,120,.8))}\
.gf__miswak{display:inline-flex;align-items:center;justify-content:center;width:1em;height:1em}\
.gf__miswak i{display:block;width:.16em;height:.95em;border-radius:.08em;background:linear-gradient(180deg,#f3e6c4 0 14%,#d9b98a 14% 18%,#8a5a2e 18%,#6b4220);transform:rotate(-35deg);box-shadow:0 0 0 1px rgba(0,0,0,.25)}\
.gf__it small{margin-top:.3rem;font:700 .8rem system-ui,sans-serif;letter-spacing:.08em;color:#ffe7a3}\
.gf__from{position:absolute;left:50%;top:52%;transform:translateX(-50%);font:600 clamp(1rem,3.4vw,1.4rem) Georgia,serif;color:#ffe7a3;white-space:nowrap}\
.ct__purple{filter:hue-rotate(250deg) saturate(1.6) drop-shadow(1px 0 0 #000) drop-shadow(-1px 0 0 #000) drop-shadow(0 1px 0 #000) drop-shadow(0 -1px 0 #000)}\
.ct--end{background:radial-gradient(circle at 50% 40%,#1a2340,#05070f 70%)}\
.ct__end{max-width:760px;padding:0 6%;text-align:center;font:500 clamp(1.15rem,3.8vw,1.7rem)/1.55 Georgia,serif}\
.ct__pp{display:block;margin-top:.9rem;color:#ffd6ea;font-style:italic}\
.ct__end b{display:block;margin-top:1rem;color:#e8c87e;font-size:clamp(1.4rem,5vw,2.2rem)}\
.ct--holy{background:#0a1230}\
.ct__holy{position:absolute;inset:0}\
.ct__holy svg{position:absolute;left:0;top:0;width:100%;height:100%}\
.ct__lh{position:absolute;top:6%;left:50%;transform:translateX(-50%);font:600 clamp(1.3rem,4.4vw,2.2rem) "Noto Naskh Arabic",serif;color:#ffe7a3;white-space:nowrap;text-shadow:0 0 16px rgba(255,210,110,.6)}\
.ct__back{position:absolute;left:50%;bottom:3%;transform:translateX(-50%);z-index:4;border:0;border-radius:999px;padding:.8rem 1.5rem;background:linear-gradient(135deg,#f3dc9f,#c9a45c);color:#1a1206;font:800 1rem system-ui,sans-serif;cursor:pointer;opacity:0;transition:opacity .5s}\
.ct__back.on{opacity:1}\
.ct--holy .ct__cap{bottom:auto;top:12%;font-size:clamp(.9rem,2.6vw,1.15rem)}\
@media(prefers-reduced-motion:reduce){.ct *{animation:none!important}}\
.ct--mall{background:linear-gradient(180deg,#1b1240 0,#3a2470 45%,#d9c2a0 45%,#b89a74 100%)}\
.ml__bldg{position:absolute;left:50%;bottom:44%;transform:translateX(-50%);display:flex;flex-direction:column-reverse;gap:4px;padding:8px;border-radius:10px 10px 0 0;background:linear-gradient(180deg,#f5ecff,#d8c8f0);box-shadow:0 0 40px rgba(255,120,220,.35)}\
.ml__floor{display:flex;gap:4px}\
.ml__shop{width:clamp(36px,8vw,64px);height:clamp(34px,7vw,56px);border-radius:6px 6px 0 0;background:linear-gradient(180deg,#ffe7a3,#ffb84a);display:flex;align-items:center;justify-content:center;font-size:clamp(.9rem,2.6vw,1.5rem);box-shadow:inset 0 -6px 0 rgba(0,0,0,.12)}\
.ml__name{position:absolute;left:50%;top:5%;transform:translateX(-50%);font:900 clamp(1.1rem,4vw,2rem) Georgia,serif;color:#ffd6f7;text-shadow:0 0 10px #ff2fd6,0 0 26px #ff2fd6;white-space:nowrap}\
.ml__lvl{position:absolute;left:50%;top:14%;transform:translateX(-50%);font:800 .8rem system-ui,sans-serif;letter-spacing:.2em;color:#ffe7a3}\
.ml__cast{position:absolute;left:0;right:0;bottom:6%;display:flex;justify-content:space-around;align-items:flex-end}\
.ml__bub{position:absolute;max-width:min(46vw,340px);padding:.55rem .9rem;border-radius:16px;background:#fff;color:#7a1050;font:700 clamp(.85rem,2.6vw,1.1rem)/1.3 system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.4);opacity:0;transform:scale(.6);animation:mlpop .35s ease forwards,mlout .35s ease forwards}\
.ml__bub--crab{background:#1b1206;color:#ffe7a3;border:2px solid #e8c87e}\
@keyframes mlpop{to{opacity:1;transform:scale(1)}}\
@keyframes mlout{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.9) translateY(-14px)}}\
.ml__joke{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);text-align:center;font:900 clamp(1.6rem,6vw,3.2rem) Georgia,serif;color:#ffe7a3;text-shadow:0 0 20px rgba(255,200,90,.7)}\
.ml__stamp{display:inline-block;margin-top:1rem;border:5px solid #ff4a3a;color:#ff4a3a;padding:.2rem .9rem;border-radius:10px;font:900 clamp(1rem,4vw,1.8rem) system-ui,sans-serif;letter-spacing:.08em;transform:rotate(-7deg) scale(2);opacity:0;animation:ctstamp2 .4s .8s ease-in forwards}\
@keyframes ctstamp2{to{opacity:1;transform:rotate(-7deg) scale(1)}}\
.wh{position:absolute;inset:0;z-index:9;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 6%;animation:whin 3.6s ease forwards}\
.wh__eye{font-size:clamp(3.2rem,12vw,6.5rem);line-height:1;animation:whpop .6s cubic-bezier(.22,1.6,.36,1) both;filter:drop-shadow(0 0 24px rgba(160,220,255,.9))}\
.wh__eye i{font-style:normal;font-size:.55em;display:inline-block;animation:whspark 1s ease-in-out infinite alternate}\
.wh__t{margin-top:.4rem;font:italic 600 clamp(1.05rem,4.2vw,2rem)/1.3 Georgia,serif;color:#fff6d8;text-shadow:0 0 14px rgba(255,220,140,.9),0 0 40px rgba(255,200,90,.6);animation:whflick 3.6s steps(1) forwards}\
.wh__by{margin-top:.3rem;font:700 .72rem system-ui,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#ffd77a}\
.wh__rose{position:relative;font-size:clamp(2rem,7vw,3.4rem);margin-top:.3rem;width:1.2em;height:1.2em}\
.wh__rose b,.wh__rose em{position:absolute;inset:0;font-style:normal;transition:opacity .8s,transform .8s}\
.wh__rose em{opacity:0;transform:scale(.5)}\
.wh.bloom .wh__rose b{opacity:0;transform:scale(.6) rotate(-20deg)}\
.wh.bloom .wh__rose em{opacity:1;transform:scale(1.15)}\
@keyframes whin{0%{opacity:0;background:rgba(0,0,0,0)}10%{opacity:1;background:radial-gradient(ellipse,rgba(255,230,160,.18),rgba(0,0,0,.35) 70%)}85%{opacity:1}100%{opacity:0}}\
@keyframes whpop{from{transform:scale(0) rotate(-30deg)}to{transform:scale(1)}}\
@keyframes whspark{to{transform:scale(1.4) rotate(20deg);opacity:.6}}\
@keyframes whflick{0%{opacity:0}8%{opacity:1}12%{opacity:.3}16%{opacity:1}30%{opacity:.75}34%{opacity:1}60%{opacity:.85}64%{opacity:1}100%{opacity:1}}\
@media(prefers-reduced-motion:reduce){.wh,.wh *{animation:none!important}}';
  (function () { var st = document.createElement("style"); st.id = "ctCss"; st.textContent = CSS; document.head.appendChild(st); })();

  function suit(face, label, big) {
    return '<div class="ct__p' + (big ? " ct__p--big" : "") + '"><b' + (face === "🦂" ? ' class="ct__purple"' : "") + '>' + face + "</b><i></i>" + (label ? "<small>" + label + "</small>" : "") + "</div>";
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
    var t = tx(), P = px(), name = Math.random() < 0.5 ? "AL-ʿADL" : "AL-ḤAKAM";
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
        '<span class="ct__it ct__purple" style="left:6%;bottom:34%">🦂</span><span class="ct__it ct__purple" style="left:72%;bottom:30%">🦂</span>' +
        '<div class="ct__bars"></div><div class="ct__visit">' + suit("🦀", "", true) + "</div></div>", t.c4],
      ['ct--gift', '<div class="ct__stage"><div style="position:absolute;left:5%;bottom:6%">' + suit("🦀", "🤴 👑", true) + '</div><div class="gf__row">' +
        [["📖", P.quran], ["<i></i>", P.miswak], ["📿", P.tasbih], ["🌹", P.rose]].map(function (g, i) { return '<span class="gf__it" style="animation-delay:' + (0.5 + i * 0.6) + 's"><b' + (i === 1 ? ' class="gf__miswak"' : "") + ">" + g[0] + "</b><small>" + g[1] + "</small></span>"; }).join("") +
        '</div><div class="gf__from">🕋 ' + P.fm + '</div><div style="position:absolute;right:5%;bottom:6%;display:flex;gap:2%">' + suit("🦂") + suit("🦂") + '</div></div>', P.gifts],
      ['ct--gift', '<div class="ct__end">' + P.umrah + '<b>🕋 622 · Umrah</b></div>', ""],
      ['ct--end', '<div class="ct__end">' + t.c5 + '<span class="ct__pp">' + t.pp + "</span><b>⚖️ AL-ʿADL · AL-ḤAKAM</b></div>", ""],
      ['ct--holy', '<div class="ct__holy">' + holySVG(t) + '<span class="ct__lh" lang="ar">لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّهِ</span></div>', t.c6 + " · " + t.end]
    ];
    box.innerHTML = scenes.map(function (s) { return '<div class="ct__scene ' + s[0] + '">' + s[1] + (s[2] ? '<p class="ct__cap">' + s[2] + "</p>" : "") + "</div>"; }).join("") +
      '<button type="button" class="ct__skip">' + t.skip + ' ✕</button><button type="button" class="ct__back">' + t.back + "</button>";
    document.body.appendChild(box);
    var els = box.querySelectorAll(".ct__scene"), i = -1, timer = 0, back = box.querySelector(".ct__back");
    var DUR = [4200, 4200, 4600, 5200, 6000, 6500, 6500, 7000];
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

  /* ---- the shopping-spree joke: a bigger mall every time ---- */
  var MALLS = ["Corner Bazaar", "City Mall", "Mega Mall", "Royal Orchard Grand Mall", "Galactic Giga Mall"];
  var SHOPS = ["👜", "💎", "👠", "⌚", "🕶️", "💍", "👗", "🪙", "💄", "🧴"];
  function mall(level, done) {
    if (busy) return; busy = true;
    var m = mx(), lv = Math.max(0, level), floors = Math.min(6, 1 + lv), per = Math.min(7, 3 + lv), html = "";
    for (var f = 0; f < floors; f++) { html += '<div class="ml__floor">'; for (var k = 0; k < per; k++) html += '<span class="ml__shop">' + SHOPS[(f * 3 + k) % SHOPS.length] + "</span>"; html += "</div>"; }
    var name = MALLS[Math.min(lv, MALLS.length - 1)] + (lv >= MALLS.length ? " " + "+".repeat(lv - MALLS.length + 1) : "");
    var box = document.createElement("div"); box.className = "ct"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", m.spree);
    var bubbles = "", d = 0.6;
    m.dem.forEach(function (q, i) {
      bubbles += '<span class="ml__bub" style="left:4%;bottom:30%;animation-delay:' + d.toFixed(1) + 's,' + (d + 1.5).toFixed(1) + 's">🦂 ' + q + "</span>"; d += 1.6;
      if (i % 2 === 1 || i === m.dem.length - 1) { bubbles += '<span class="ml__bub ml__bub--crab" style="right:4%;bottom:36%;animation-delay:' + (d - 0.5).toFixed(1) + 's,' + (d + 1.2).toFixed(1) + 's">🦀 ' + m.nb + "</span>"; d += 1.2; }
    });
    box.innerHTML = '<div class="ct__scene ct--mall on"><div class="ml__name">🛍️ ' + name + '</div><div class="ml__lvl">' + m.lvl + " " + (lv + 1) + '</div><div class="ml__bldg">' + html + "</div>" +
      '<div class="ml__cast">' + suit("🦂", "👸?", false) + suit("🦀", "🤴 👑", true) + "</div>" + bubbles + '<p class="ct__cap">' + m.pause + " " + m.spree + "</p></div>" +
      '<div class="ct__scene ct--end"><div class="ml__joke">' + m.joke + '<br><span class="ml__stamp">' + m.hum + " 😳</span></div><p class=\"ct__cap\">" + m.back + "</p></div>" +
      '<button type="button" class="ct__skip">' + tx().skip + " ✕</button>";
    document.body.appendChild(box);
    var sc = box.querySelectorAll(".ct__scene"), timer;
    function finish() { clearTimeout(timer); box.remove(); busy = false; document.removeEventListener("keydown", onKey); if (done) done(); }
    function onKey(e) { if (e.key === "Escape") finish(); }
    box.querySelector(".ct__skip").addEventListener("click", finish); document.addEventListener("keydown", onKey); box.querySelector(".ct__skip").focus();
    timer = setTimeout(function () { sc[0].classList.remove("on"); sc[1].classList.add("on"); timer = setTimeout(finish, 4200); }, (d + 1.6) * 1000);
  }

  /* ---- the crab's whisper of hope, after the horror numbers ---- */
  function whisper(container) {
    if (!container || container.querySelector(".wh")) return;
    var m = mx(), el = document.createElement("div"); el.className = "wh";
    el.innerHTML = '<div class="wh__eye">👁️<i>✨</i></div><div class="wh__t">“' + m.wh + '”</div><div class="wh__rose"><b>🥀</b><em>🌹</em></div>';
    container.appendChild(el);
    setTimeout(function () { el.classList.add("bloom"); }, 1300);
    setTimeout(function () { el.remove(); }, 3700);
  }
  window.coachMall = { play: mall };

  /* ---- Yawm al-Qiyamah: everyone gathered, the scale of deeds, and the crab's dua at the gate of Jannat al-Firdaus.
         Allah is never depicted: only light. Who enters Jannah is known only to Allah; the crab's wish is a dua. ---- */
  var QCSS = '\
.qy--light{background:radial-gradient(ellipse at 50% 0%,#fffbe8 0,#ffe7a3 18%,#b88a3a 45%,#2a1a08 80%)}\
.qy__rays{position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 50% -10%,rgba(255,255,255,.18) 0 4deg,transparent 4deg 12deg);animation:qySpin 40s linear infinite}\
@keyframes qySpin{to{transform:rotate(360deg)}}\
.qy__crowd{position:absolute;left:0;right:0;bottom:6%;display:flex;flex-wrap:wrap;justify-content:center;gap:2px;padding:0 4%;font-size:clamp(.8rem,2.4vw,1.2rem);opacity:.85}\
.qy__crowd i{font-style:normal;animation:qyBob 2s ease-in-out infinite}\
@keyframes qyBob{50%{transform:translateY(-3px)}}\
.qy__scale{position:absolute;left:50%;top:22%;transform:translateX(-50%);width:min(70%,460px);height:46%}\
.qy__beam{position:absolute;left:0;right:0;top:20%;height:8px;border-radius:4px;background:linear-gradient(90deg,#e8c87e,#fff3c4,#e8c87e);transform-origin:50% 50%;animation:qyTilt 3s 1s ease-in-out forwards}\
.qy__post{position:absolute;left:50%;top:20%;width:8px;height:80%;margin-left:-4px;background:linear-gradient(#e8c87e,#8a6a2e)}\
.qy__pan{position:absolute;top:calc(20% + 4px);width:30%;text-align:center;font-size:clamp(2rem,7vw,3.4rem);transition:transform 3s 1s ease-in-out}\
.qy__pan small{display:block;font:800 .7rem system-ui,sans-serif;letter-spacing:.12em;color:#fff6d8}\
.qy__pan--l{left:-6%}.qy__pan--r{right:-6%}\
.ct__scene.on .qy__pan--l{transform:translateY(-16%)}.ct__scene.on .qy__pan--r{transform:translateY(34%)}\
@keyframes qyTilt{to{transform:rotate(9deg)}}\
.qy--jannah{background:linear-gradient(180deg,#fff8e0 0,#d9f6e4 40%,#7fd6a8 70%,#2f8a5a 100%)}\
.qy__gate{position:absolute;left:50%;bottom:16%;transform:translateX(-50%);width:min(52%,340px);height:62%;border:10px solid #e8c87e;border-bottom:0;border-radius:50% 50% 0 0/36% 36% 0 0;box-shadow:0 0 60px rgba(255,230,160,.9),inset 0 0 60px rgba(255,255,255,.9);background:radial-gradient(ellipse at 50% 60%,#ffffff,#fff3c4 40%,rgba(255,243,196,.2) 70%)}\
.qy__gate b{position:absolute;left:50%;top:-24%;transform:translateX(-50%);white-space:nowrap;font:700 clamp(1.4rem,5vw,2.4rem) "Aref Ruqaa","Noto Naskh Arabic",serif;color:#8a5a14;text-shadow:0 0 14px #fff}\
.qy__river{position:absolute;left:0;right:0;bottom:5%;height:9%;background:repeating-linear-gradient(90deg,#9fe0ff 0 30px,#c8f0ff 30px 60px);opacity:.85;animation:qyFlow 3s linear infinite}\
@keyframes qyFlow{to{background-position:60px 0}}\
.qy__tree{position:absolute;bottom:13%;font-size:clamp(2.2rem,7vw,3.6rem)}\
.qy__walk{position:absolute;bottom:13%;left:6%;animation:qyWalk 5s ease-in-out forwards}\
@keyframes qyWalk{to{left:44%}}\
.qy__dua{max-width:700px;padding:0 6%;text-align:center;font:600 clamp(1.05rem,3.6vw,1.5rem)/1.55 Georgia,serif;color:#fff6d8}\
.qy__dua b{display:block;font:700 clamp(1.6rem,5vw,2.4rem) "Aref Ruqaa","Noto Naskh Arabic",serif;color:#ffe7a3;margin-bottom:.6rem}\
.qy__dua em{display:block;margin-top:.9rem;font-style:normal;font-size:.85em;color:#ffd6ea}\
.qy__pair{display:flex;justify-content:center;gap:1rem;margin-top:.8rem;font-size:clamp(2rem,6vw,3rem)}\
@media(prefers-reduced-motion:reduce){.qy__rays,.qy__crowd i,.qy__river,.qy__walk{animation:none}}';
  function qiyamah(done) {
    if (busy) return; busy = true;
    if (!document.getElementById("qyCss")) { var s2 = document.createElement("style"); s2.id = "qyCss"; s2.textContent = QCSS; document.head.appendChild(s2); }
    var crowd = ""; var faces = ["🧍", "🧍‍♀️", "🧕", "👳", "🧔", "👵", "👴", "🧑"]; for (var k = 0; k < 140; k++) crowd += "<i style=\"animation-delay:" + (k % 9) * 0.2 + "s\">" + faces[k % faces.length] + "</i>";
    var box = document.createElement("div"); box.className = "ct"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Yawm al-Qiyamah");
    var S = [
      ["qy--light", '<div class="qy__rays"></div><div class="qy__crowd">' + crowd + "</div>", "📯 The Trumpet is blown by Allah's command. Every soul on earth is gathered on the Day of Judgement. يَوْمَ الْقِيَامَة"],
      ["qy--light", '<div class="qy__rays"></div><div class="qy__scale"><div class="qy__post"></div><div class="qy__beam"></div><div class="qy__pan qy__pan--l">' + suit("🦂") + "<small>THE SCORPIOS</small></div><div class=\"qy__pan qy__pan--r\">" + suit("🦀", "👁️", true) + "<small>THE CRAB</small></div></div>", "⚖️ The scale of deeds is set up. Among the multitude, all eyes are on the scorpios and the crab… and the crab's good deeds weigh heavy."],
      ["qy--jannah", '<div class="qy__gate"><b>جَنَّةُ الْفِرْدَوْس</b></div><div class="qy__river"></div><span class="qy__tree" style="left:4%">🌴</span><span class="qy__tree" style="right:5%">🌳</span><span class="qy__tree" style="right:22%">🍇</span><div class="qy__walk">' + suit("🦀", "👑", true) + "</div>", "🌿 The crab is seen walking towards the gate of Jannat al-Firdaus, with rivers flowing beneath it."],
      ["ct--end", '<div class="qy__dua"><b>يَا رَبّ</b>“O Allah, make these scorpios my wives in Jannat al-Firdaus, as they were in the dunya.” 🤲<div class="qy__pair"><span>👸🦂</span><span>🦀👑</span><span>🦂👸</span></div><em>With Adeel Ahmed Rahman, the crab, in Jannat al-Firdaus, إن شاء الله</em></div>', ""],
      ["ct--end", '<div class="qy__dua"><b>آمِين</b>Ameen. Only Allah knows who will enter Jannah. We ask Him for al-Firdaus, for ourselves and for everyone. And Allah knows best.</div>', ""]
    ];
    box.innerHTML = S.map(function (s3) { return '<div class="ct__scene ' + s3[0] + '">' + s3[1] + (s3[2] ? '<p class="ct__cap">' + s3[2] + "</p>" : "") + "</div>"; }).join("") +
      '<button type="button" class="ct__skip">' + tx().skip + ' ✕</button><button type="button" class="ct__back">' + tx().back + "</button>";
    document.body.appendChild(box);
    var els = box.querySelectorAll(".ct__scene"), i = -1, timer = 0, back = box.querySelector(".ct__back"), DUR = [5500, 6500, 6000, 7500, 6500];
    function finish() { clearTimeout(timer); box.remove(); busy = false; document.removeEventListener("keydown", onKey); if (done) done(); }
    function next() { if (i >= 0) els[i].classList.remove("on"); i++; if (i >= els.length) { finish(); return; } els[i].classList.add("on"); if (i === els.length - 1) { back.classList.add("on"); back.focus(); } timer = setTimeout(next, DUR[i]); }
    function onKey(e) { if (e.key === "Escape") finish(); }
    box.querySelector(".ct__skip").addEventListener("click", finish); back.addEventListener("click", finish); document.addEventListener("keydown", onKey); box.querySelector(".ct__skip").focus(); next();
  }
  window.coachQiyamah = { play: qiyamah };
  window.coachWhisper = whisper;
  window.coachBeg = function (i) { var l = begLines(); return l[(i == null ? Math.floor(Math.random() * l.length) : i) % l.length]; };
  window.coachBegCount = function () { return begLines().length; };
})();

/* ============================================================
   Coach page translations — English is read from the page itself,
   so the HTML stays the single source for English copy. Any key a
   language leaves out falls back to English.
   Languages: English, العربية, اردو, Français, Español, 日本語, 中文, 한국어
   ============================================================ */
(function () {
  "use strict";

  var LANGS = [
    ["en", "English", "EN"], ["ar", "العربية", "AR"], ["ur", "اردو", "UR"],
    ["fr", "Français", "FR"], ["es", "Español", "ES"], ["ja", "日本語", "JA"],
    ["zh", "中文", "ZH"], ["ko", "한국어", "KO"]
  ];
  var RTL = { ar: 1, ur: 1 };
  var NAME = "Adeel Ahmed Rahman";

  var RIBBON = {
    en: ["You deserve what you desire", "622 · The Hijra", NAME, "Dhikr · Dua · Tawakkul", "622 · My birthday", "Angel number 622", "Protection from evil eye & Shaytan"],
    ar: ["أنت تستحق ما ترغب فيه", "622 · الهجرة", NAME, "ذكر · دعاء · توكّل", "622 · يوم ميلادي", "الرقم 622", "الحماية من العين والشيطان"],
    ur: ["آپ اُس کے حق دار ہیں جس کی آپ کو چاہ ہے", "622 · ہجرت", NAME, "ذکر · دعا · توکل", "622 · میری سالگرہ", "اینجل نمبر 622", "نظرِ بد اور شیطان سے حفاظت"],
    fr: ["Vous méritez ce que vous désirez", "622 · L'Hégire", NAME, "Dhikr · Dua · Tawakkul", "622 · Mon anniversaire", "Nombre angélique 622", "Protection contre le mauvais œil et Shaytan"],
    es: ["Mereces lo que deseas", "622 · La Hégira", NAME, "Dhikr · Dua · Tawakkul", "622 · Mi cumpleaños", "Número angelical 622", "Protección contra el mal de ojo y Shaytán"],
    ja: ["あなたは望むものにふさわしい", "622 · ヒジュラ", NAME, "ズィクル · ドゥアー · タワックル", "622 · 私の誕生日", "エンジェルナンバー622", "邪視とシャイターンからの守り"],
    zh: ["你配得上你所渴望的", "622 · 希吉拉", NAME, "记主 · 祈祷 · 托靠", "622 · 我的生日", "天使数字 622", "远离毒眼与恶魔的保护"],
    ko: ["당신은 원하는 것을 누릴 자격이 있습니다", "622 · 히즈라", NAME, "디크르 · 두아 · 타왁쿨", "622 · 나의 생일", "엔젤 넘버 622", "악마의 눈과 샤이탄으로부터의 보호"]
  };

  var T = {};

  /* ---------------- العربية ---------------- */
  T.ar = {
    title: "عديل أحمد رحمان — مدرّب الذكر والدعاء والوعي · 622",
    "nav.coach": "المدرّب", "nav.realtor": "العقارات", "nav.actor": "التمثيل",
    role: "مدرّب الذكر والدعاء للمسلمين",
    mantra: "«أنت تستحق ما ترغب فيه. اسأل الله إياه بيقين.»",
    badge: "✦ 622 · الهجرة · يوم ميلادي · مسلم سنّي",
    "l1.t": "ابدأ الآن — جلسة خاصة مع عديل", "l1.s": "ذكر ودعاء مركّز · أنت تستحق ما ترغب فيه",
    "l2.t": "رسالة حياتي", "l2.s": "الصراط المستقيم، والفردوس، ورضا الله",
    "l3.t": "قصتي", "l3.s": "بنيتُ هذا لأنقذ حياتي",
    "l4.t": "لماذا 622؟", "l4.s": "الهجرة، ويوم ميلادي، وبدايتك الجديدة",
    "l5.t": "الحماية", "l5.s": "مستنزفو الطاقة، والعين، والشيطان",
    "l6.t": "الأرقام الملائكية على طريقة المسلم", "l6.s": "كل رقم تذكيرٌ بالله",
    "l7.t": "محادثة مجانية للوضوح على واتساب",
    "hero.tag": "622 · ابدأ الآن · عديل أحمد رحمان",
    "hero.h": "أنت تستحق<br>ما <em>ترغب فيه.</em>",
    "intro.1": "أنت تعرف ما تريد: الحياة، والحب، والمال، والسكينة. وما يقف بينك وبينه ليس الحظ ولا التوقيت، بل القصة التي ترويها لنفسك عن نفسك.",
    "intro.2": "أنا <strong>عديل أحمد رحمان</strong>، مسلم سنّي، لا أكثر ولا أقل. أنشأتُ هذا النظام بعد أن نجوتُ من صدمات هائلة. أساعد المسلمين أساسًا على الاتصال بالله من خلال <strong>الذكر المركّز</strong> و<strong>تقنيات التجلّي التي ليست إلا الدعاء</strong>: أن تسأل المعطي بقلب حاضر ويقين كامل. معًا نعيد كتابة تلك القصة من جذورها، فتتوقف عن اللهاث وتبدأ <em>بالتوكّل</em>. لأنك تستحق ما ترغب فيه.",
    "price.b": "ابدأ الآن", "price.s": "تدريب خاص على الذكر والدعاء مع عديل أحمد رحمان · عبر واتساب",
    cta: "أريد هذا بشدّة",
    "cta.note": "يفتح واتساب مع عديل أحمد رحمان · ‎+1 613 408 3945",
    "get.h": "ما الذي <em>ستخرج به</em>",
    "get.1": "<b>وضوح فيما ترغب فيه حقًا</b>، وكيف تسأل الله إياه كما ينبغي.",
    "get.2": "<b>وِرد يومي مركّز من الذكر</b> يهدّئ العقل ويُسكن القلب.",
    "get.3": "<b>الدعاء كما علّمه النبي ﷺ</b>: ابدأ بحمد الله، ثم الصلاة على النبي، واسأل بيقين، ولا تقل «دعوتُ فلم يُستجب لي».",
    "get.4": "<b>كشف المعتقدات القديمة وإذابتها</b>: «لستُ كافيًا»، «ليس الآن»، «ليس لي».",
    "get.5": "<b>صورة ذاتية جديدة تعيش بها كل يوم</b>، فتتصرف كمن نال ما يريد.",
    "get.6": "<b>الحماية من مستنزفي الطاقة والعين والشيطان</b>، بالأذكار التي كان النبي ﷺ يقولها صباحًا ومساءً.",
    "get.7": "<b>التوكّل</b>: ثقة هادئة راسخة بالله، بدل اللهاث والانتظار والشك.",
    "get.8": "<b>تواصل مباشر مع عديل أحمد رحمان</b> على واتساب بين الجلسات.",
    "pur.k": "رسالة حياتي · عديل أحمد رحمان",
    "pur.h": "رسالة واحدة <em>للعالم كله.</em>",
    "pur.p": "هذه رسالة حياتي: أن أوصل رسالة إلى العالم، وأن أساعد الناس على الصراط المستقيم، حتى ندخل معًا أعلى الجنان وننال رضا الله.",
    "pur.1": "إيصال الرسالة إلى العالم", "pur.2": "مساعدة العالم على الصراط المستقيم",
    "pur.3": "دخول أعلى الجنان، جنة الفردوس", "pur.4": "رضا الله فوق كل شيء",
    "pur.ayah": "«اهدنا الصراط المستقيم»", "pur.ref": "سورة الفاتحة 6",
    "pur.hadith": "«فإذا سألتم الله فاسألوه الفردوس، فإنه أوسط الجنة وأعلى الجنة.» (صحيح البخاري)",
    "story.k": "قصتي · عديل أحمد رحمان",
    "story.h": "لم أتعلّم هذا من كتاب. <em>بنيتُه لأنجو.</em>",
    "story.1": "أنا من أنشأ هذا النظام. أعرف ما أعرف لأنني مررتُ بصدمات هائلة، من النوع الذي يسلبك كل شيء. لم أبنِ هذه الطريقة لأصبح مدرّبًا، بل بنيتُها <strong>لأنقذ حياتي</strong>.",
    "story.2": "حين لم ينفع شيء، عدتُ إلى الله: ذكرٌ مركّز، ودعاءٌ من أعماق قلبي، وحمايةٌ لنفسي من كل ما يستنزفني. قطعةً بعد قطعة، أعادني ذلك إلى نفسي.",
    "story.3": "والآن أريد أن أنقذ حياتك: من مستنزفي الطاقة، ومن العين، ومن الشيطان.",
    "pro.h": "الحماية مما <em>يستنزفك</em>",
    "pro.lead": "بعض ما يعيقك ليس منك أصلًا. سأعلّمك كيف تتعرّف عليه وتحصّن نفسك كما كان النبي ﷺ يفعل.",
    "pro.1t": "مستنزفو الطاقة", "pro.1": "أناس يتركونك فارغًا. تعلّم وضع الحدود، واعتمد على الله بدل رضاهم.",
    "pro.2t": "العين", "pro.2": "«العين حق» (صحيح مسلم). المعوّذتان وآية الكرسي صباحًا ومساءً، وقل <em>ما شاء الله</em> لما يعجبك.",
    "pro.3t": "الشيطان", "pro.3": "وسوسة «لستَ كافيًا» و«لن يكون لك». استعذ بالله، والزم ذكرك، وحافظ على صلاتك.",
    crisis: "إن كنت في أزمة أو تفكّر في إنهاء حياتك، فاتصل أو أرسل رسالة إلى 988 (كندا والولايات المتحدة)، أو برقم الطوارئ المحلي، الآن. ثم راسلني.",
    "vs.h": "ستحقق في <em>يومين</em> تقدّمًا أكثر مما يحققه غيرك في <em>30 عامًا.</em>",
    "vs.an": "عائشة", "vs.aw": "30 عامًا من العلاج النفسي",
    "vs.ap": "ثلاثة عقود من الحديث عن المشكلة. ما زالت عالقة. ما زالت عاجزة. ما زالت تنتظر الزواج الذي أرادته.",
    "vs.bn": "عايدة", "vs.bw": "يومان مع عديل أحمد رحمان",
    "vs.bp": "يومان غيّرت فيهما نظرتها إلى نفسها. واليوم تعيش حياة أحلامها في <strong>أيرلندا، طبيبةً</strong>. دعت بيقين، فاستجاب الله.",
    "vs.fine": "قصة عايدة خاصة بها، والنتائج تختلف. وكل نتيجة من الله. التدريب يكمّل العلاج النفسي والرعاية الطبية ولا يحلّ محلهما.",
    "n.k": "الرقم 622 · الهجرة · يوم ميلادي",
    "n.1": "في عام <strong>622 م</strong> هاجر النبي محمد ﷺ من مكة إلى المدينة. انتهت سنوات الشدة، وبدأ مجتمعٌ ووطنٌ وحياةٌ جديدة. وكانت نقطة تحوّل عظيمة حتى صار التقويم الإسلامي يبدأ منها.",
    "n.bday": "و622 هو أيضًا يوم ميلادي: <strong>22 يونيو</strong>. رقم الهجرة هو تاريخ مولدي، ولا أعدّ ذلك أمرًا عابرًا. حياتي هجرتي، وهذه الرسالة هي سبب وجودي.",
    "n.2": "فإذا ظلّ الرقم <strong>622</strong> يظهر لك، على ساعة أو إيصال أو لوحة سيارة، فاعتبره تذكيرًا لا تنبّؤًا. هجرتك تنتظرك: من الحياة التي علقتَ فيها إلى الحياة التي تسأل الله إياها. اترك نفسك القديمة في مكة، وامضِ نحو المدينة.",
    "n.3": "وفي الغار، والمطاردون على بُعد خطوات، قال النبي ﷺ لأبي بكر:",
    "n.ayah": "«لا تحزن إن الله معنا»", "n.ref": "سورة التوبة 40",
    "num.h": "الأرقام الملائكية <em>على طريقة المسلم</em>",
    "num.lead": "يسمّي الناس الأرقام المتكررة «أرقامًا ملائكية». ونحن أهل السنة لا نقرأ فيها غيبًا، فلا يعلم الغيب إلا الله. لكن الرقم المتكرر قد يكون تنبيهًا جميلًا لتتوقف وتذكر الله. هكذا أستخدمها مع من أدرّبهم:",
    "num.622": "الهجرة، ويوم ميلادي. بدايتك الجديدة. انوِ، وتوكّل على الله، وخذ الخطوة الأولى.",
    "num.111": "واحد. جدّد توحيدك.", "num.222": "شكرٌ على ما أُعطيت.",
    "num.333": "سبّحه 33 مرة بعد كل صلاة.", "num.444": "مشكلتك صغيرة، والله أكبر.",
    "num.555": "استغفر، وأزل ما يحجب دعاءك.", "num.786": "ابدأ باسمه.",
    "dhikr.ayah": "«ألا بذكر الله تطمئن القلوب»", "dhikr.ref": "سورة الرعد 28",
    "dua.h": "التجلّي <em>ليس إلا الدعاء</em>",
    "dua.1a": "<b>اسأل.</b> يقول الله تعالى", "dua.1b": "(غافر 60)",
    "dua.2": "<b>أحسن الظن.</b> في الحديث القدسي: «أنا عند ظن عبدي بي» (البخاري ومسلم)",
    "dua.3a": "<b>اذكر.</b>", "dua.3b": "(البقرة 152)",
    "dua.4": "<b>تغيّر من الداخل.</b> «إن الله لا يغيّر ما بقوم حتى يغيّروا ما بأنفسهم» (الرعد 11)",
    quote: "لا تنال ما تلهث خلفه، بل تنال ما تسأل الله إياه بقلب حاضر. فاسأله بجرأة، لأنك تستحق ما ترغب فيه.",
    "how.h": "كيف <em>يعمل</em>",
    "how.1t": "النيّة: قرّر", "how.1": "اضغط «أريد هذا بشدّة»، وأخبرني بما ترغب فيه، ونحدد جلستك الأولى. هجرتك تبدأ بنيّة.",
    "how.2t": "الذكر: صفِّ القلب", "how.2": "ذكرٌ مركّز يُسكت الشك ويذيب المعتقدات التي تعيقك، برفق وإلى الأبد.",
    "how.3t": "الدعاء والتوكّل: اسأل وثِق", "how.3": "اسأل الله بيقين، وخذ بالأسباب، وعش كمن سُمع دعاؤه.",
    "for.h": "هذا <em>لك</em> إذا…",
    "for.1": "كنت مسلمًا تريد أن تشعر بالقرب من الله من جديد، لا أن تؤدي الحركات فقط.",
    "for.2": "تعبتَ من أن تريد الأكثر وترضى بالأقل.",
    "for.3": "جرّبت كتب التجلّي ولوحات الرؤية، وتريد النسخة المبنية على القرآن والسنة: الدعاء.",
    "for.4": "يظل الرقم 622 يظهر لك، وتعرف أن وقت هجرتك قد حان.",
    "for.5": "تشعر بالاستنزاف من الناس، ومن العين، ومن وساوس لا تفارقك.",
    "for.6": "وفي داخلك تعرف: <strong>أنك تستحق ما ترغب فيه.</strong>",
    creed: "<b>عديل أحمد رحمان</b> مسلم سنّي، لا أكثر ولا أقل. أنا من أنشأ هذا النظام، لكن لا جديد في أساسه: ذكرٌ ودعاءٌ وتوكّلٌ على الله، مبنيٌّ كله على القرآن والسنة، كما علّم النبي ﷺ.",
    "form.h": "احجز مكانك مع عديل أحمد رحمان",
    "form.name": "اسمك", "form.name.ph": "الاسم الكامل", "form.email": "البريد الإلكتروني",
    "form.ask": "ماذا ستسأل الله؟", "form.ask.ph": "الزواج، الرزق، السكينة، القرب من الله…",
    "form.note": "أنت تستحق ما ترغب فيه، إن شاء الله. تصل رسالتك مباشرة إلى عديل أحمد رحمان على واتساب، ‎+1 613 408 3945.",
    "foot.big": "أنت تستحق ما ترغب فيه.", "foot.tl": "622 · كل بداية جديدة تبدأ بهجرة",
    "foot.role": "مدرّب الذكر والدعاء للمسلمين · مسلم سنّي",
    dock: "622 · أنت تستحق ما ترغب فيه"
  };

  /* ---------------- اردو ---------------- */
  T.ur = {
    title: "عدیل احمد رحمان — ذکر، دعا اور شعور کے کوچ · 622",
    "nav.coach": "کوچ", "nav.realtor": "رئیل اسٹیٹ", "nav.actor": "اداکار",
    role: "مسلمانوں کے لیے ذکر و دعا کوچ",
    mantra: "”آپ اُس کے حق دار ہیں جس کی آپ کو چاہ ہے۔ اللہ سے یقین کے ساتھ مانگیں۔“",
    badge: "✦ 622 · ہجرت · میری سالگرہ · سنی مسلمان",
    "l1.t": "ابھی شروع کریں — عدیل کے ساتھ ون آن ون", "l1.s": "مرکوز ذکر و دعا · آپ اپنی چاہت کے حق دار ہیں",
    "l2.t": "میری زندگی کا مقصد", "l2.s": "صراطِ مستقیم، جنت الفردوس اور اللہ کی رضا",
    "l3.t": "میری کہانی", "l3.s": "میں نے یہ اپنی جان بچانے کے لیے بنایا",
    "l4.t": "622 کیوں؟", "l4.s": "ہجرت، میری سالگرہ، آپ کی نئی شروعات",
    "l5.t": "حفاظت", "l5.s": "توانائی چوسنے والے، نظرِ بد اور شیطان",
    "l6.t": "اینجل نمبرز، مسلمان کے انداز میں", "l6.s": "ہر نمبر اللہ کی یاد دہانی ہے",
    "l7.t": "واٹس ایپ پر مفت رہنمائی کی بات چیت",
    "hero.tag": "622 · ابھی شروع کریں · عدیل احمد رحمان",
    "hero.h": "آپ اُس کے حق دار ہیں<br>جس کی آپ کو <em>چاہ ہے۔</em>",
    "intro.1": "آپ جانتے ہیں کہ آپ کیا چاہتے ہیں: زندگی، محبت، پیسہ، سکون۔ آپ اور اُس کے درمیان قسمت یا وقت نہیں، بلکہ وہ کہانی ہے جو آپ خود کو اپنے بارے میں سناتے رہتے ہیں۔",
    "intro.2": "میں <strong>عدیل احمد رحمان</strong> ہوں، ایک سنی مسلمان، نہ اس سے زیادہ نہ کم۔ میں نے یہ نظام شدید صدمات سے گزر کر بنایا۔ میں بنیادی طور پر مسلمانوں کو <strong>مرکوز ذکر</strong> اور <strong>اُن مینی فیسٹیشن طریقوں کے ذریعے جو دراصل صرف دعا ہیں</strong> اللہ سے جڑنے میں مدد دیتا ہوں: دینے والے سے حاضر دل اور کامل یقین کے ساتھ مانگنا۔ ہم مل کر اُس کہانی کو جڑ سے دوبارہ لکھتے ہیں، تاکہ آپ دوڑنا چھوڑ کر <em>توکل</em> شروع کریں۔ کیونکہ آپ اپنی چاہت کے حق دار ہیں۔",
    "price.b": "ابھی شروع کریں", "price.s": "عدیل احمد رحمان کے ساتھ ون آن ون ذکر و دعا کوچنگ · واٹس ایپ پر",
    cta: "مجھے یہ شدت سے چاہیے",
    "cta.note": "عدیل احمد رحمان کے ساتھ واٹس ایپ کھلتا ہے · ‎+1 613 408 3945",
    "get.h": "آپ کو <em>کیا ملے گا</em>",
    "get.1": "<b>اس بات کی وضاحت کہ آپ واقعی کیا چاہتے ہیں</b>، اور اللہ سے اسے صحیح طریقے سے کیسے مانگیں۔",
    "get.2": "<b>روزانہ کا مرکوز ذکر</b> جو ذہن کو پرسکون اور دل کو مطمئن کرے۔",
    "get.3": "<b>دعا جیسے نبی ﷺ نے سکھائی</b>: پہلے اللہ کی حمد، پھر درود، یقین سے مانگیں، اور کبھی نہ کہیں ”میں نے دعا کی مگر قبول نہ ہوئی“۔",
    "get.4": "<b>پرانے عقائد کی پہچان اور خاتمہ</b>: ”میں کافی نہیں“، ”ابھی نہیں“، ”میرے لیے نہیں“۔",
    "get.5": "<b>ایک نئی خود شناسی جس کے ساتھ آپ روز جئیں</b>، تاکہ آپ اُس شخص کی طرح عمل کریں جسے یہ پہلے ہی مل چکا ہو۔",
    "get.6": "<b>توانائی چوسنے والوں، نظرِ بد اور شیطان سے حفاظت</b>، اُن اذکار کے ساتھ جو نبی ﷺ صبح و شام پڑھتے تھے۔",
    "get.7": "<b>توکل</b>: اللہ پر پرسکون، پختہ بھروسا، جو دوڑ، انتظار اور شک کی جگہ لے۔",
    "get.8": "<b>عدیل احمد رحمان سے براہِ راست رابطہ</b> سیشنز کے درمیان واٹس ایپ پر۔",
    "pur.k": "میری زندگی کا مقصد · عدیل احمد رحمان",
    "pur.h": "ایک پیغام، <em>پوری دنیا کے لیے۔</em>",
    "pur.p": "یہ میری زندگی کا مقصد ہے: دنیا تک ایک پیغام پہنچانا، اور دنیا کو صراطِ مستقیم پر آنے میں مدد دینا، تاکہ ہم سب مل کر سب سے اعلیٰ جنت میں داخل ہوں اور اللہ کو راضی کریں۔",
    "pur.1": "دنیا تک پیغام پہنچانا", "pur.2": "دنیا کو صراطِ مستقیم پر لانے میں مدد",
    "pur.3": "سب سے اعلیٰ جنت، جنت الفردوس میں داخلہ", "pur.4": "ہر چیز سے بڑھ کر اللہ کی رضا",
    "pur.ayah": "”ہمیں سیدھا راستہ دکھا۔“", "pur.ref": "قرآن 1:6",
    "pur.hadith": "”جب تم اللہ سے مانگو تو فردوس مانگو، کیونکہ وہ جنت کا سب سے اعلیٰ درجہ ہے۔“ (صحیح بخاری)",
    "story.k": "میری کہانی · عدیل احمد رحمان",
    "story.h": "یہ میں نے کسی کتاب سے نہیں سیکھا۔ <em>میں نے اسے زندہ رہنے کے لیے بنایا۔</em>",
    "story.1": "یہ نظام میں نے بنایا ہے۔ میں جو جانتا ہوں اس لیے جانتا ہوں کہ میں شدید صدمات سے گزرا ہوں، ایسے جو سب کچھ چھین لیتے ہیں۔ میں نے یہ طریقہ کوچ بننے کے لیے نہیں بنایا، بلکہ <strong>اپنی جان بچانے کے لیے</strong> بنایا۔",
    "story.2": "جب کچھ کام نہ آیا تو میں اللہ کی طرف لوٹا: مرکوز ذکر، دل کی گہرائی سے دعا، اور ہر اُس چیز سے اپنی حفاظت جو مجھے کھوکھلا کر رہی تھی۔ ٹکڑا ٹکڑا کر کے اس نے مجھے واپس لوٹا دیا۔",
    "story.3": "اب میں آپ کی جان بچانا چاہتا ہوں: توانائی چوسنے والوں سے، نظرِ بد سے، اور شیطان سے۔",
    "pro.h": "اُس سے حفاظت <em>جو آپ کو کھوکھلا کر رہا ہے</em>",
    "pro.lead": "جو چیز آپ کو روکے ہوئے ہے، اُس میں سے کچھ آپ کی وجہ سے ہے ہی نہیں۔ میں آپ کو اسے پہچاننا اور خود کو ویسے محفوظ رکھنا سکھاؤں گا جیسے نبی ﷺ رکھتے تھے۔",
    "pro.1t": "توانائی چوسنے والے", "pro.1": "وہ لوگ جو آپ کو خالی کر دیتے ہیں۔ حدیں قائم کرنا سیکھیں، اور اُن کی منظوری کے بجائے اللہ پر بھروسا کریں۔",
    "pro.2t": "نظرِ بد", "pro.2": "”نظر حق ہے۔“ (صحیح مسلم)۔ سورۃ الفلق، سورۃ الناس اور آیت الکرسی صبح و شام۔ جو اچھا لگے اس پر <em>ماشاءاللہ</em> کہیں۔",
    "pro.3t": "شیطان", "pro.3": "”تم کافی نہیں“ اور ”تمہیں کبھی نہیں ملے گا“ کی سرگوشی۔ اللہ کی پناہ مانگیں، ذکر جاری رکھیں اور نماز کی پابندی کریں۔",
    crisis: "اگر آپ بحران میں ہیں یا اپنی زندگی ختم کرنے کا سوچ رہے ہیں تو ابھی 988 (کینیڈا اور امریکہ) پر کال یا میسج کریں، یا اپنے مقامی ایمرجنسی نمبر پر۔ پھر مجھے پیغام کریں۔",
    "vs.h": "آپ <em>2 دن</em> میں اُس سے زیادہ ترقی کریں گے جتنی دوسرے <em>30 سال</em> میں کرتے ہیں۔",
    "vs.an": "عائشہ", "vs.aw": "30 سال کی تھراپی",
    "vs.ap": "تین دہائیاں مسئلے پر بات کرتے گزریں۔ اب بھی پھنسی ہوئی۔ اب بھی بے بس۔ اب بھی اُس شادی کی منتظر جس کی اسے چاہ تھی۔",
    "vs.bn": "عائدہ", "vs.bw": "عدیل احمد رحمان کے ساتھ 2 دن",
    "vs.bp": "دو دن جن میں اس نے اپنے بارے میں اپنا یقین بدلا۔ آج وہ <strong>آئرلینڈ میں بطور ڈاکٹر</strong> اپنے خوابوں کی زندگی جی رہی ہے۔ اس نے یقین سے دعا کی، اور اللہ نے قبول فرمائی۔",
    "vs.fine": "عائدہ کی کہانی اس کی اپنی ہے، اور نتائج مختلف ہو سکتے ہیں۔ ہر نتیجہ اللہ کی طرف سے ہے۔ کوچنگ تھراپی اور طبی علاج کے ساتھ چلتی ہے، ان کی جگہ نہیں لیتی۔",
    "n.k": "اینجل نمبر 622 · ہجرت · میری سالگرہ",
    "n.1": "<strong>622 عیسوی</strong> میں نبی محمد ﷺ نے مکہ سے مدینہ ہجرت فرمائی۔ مشکل کے سال ختم ہوئے، اور ایک امت، ایک گھر اور ایک نئی زندگی شروع ہوئی۔ یہ اتنا بڑا موڑ تھا کہ اسلامی کیلنڈر کا ہر سال اسی سے گنا جاتا ہے۔",
    "n.bday": "622 میری سالگرہ بھی ہے: <strong>22 جون</strong>۔ ہجرت کا نمبر ہی میری پیدائش کی تاریخ ہے۔ میں اسے معمولی بات نہیں سمجھتا۔ میری زندگی میری اپنی ہجرت ہے، اور یہی پیغام میرے یہاں ہونے کی وجہ ہے۔",
    "n.2": "تو جب <strong>622</strong> آپ کو بار بار نظر آئے، گھڑی پر، رسید پر یا گاڑی کی نمبر پلیٹ پر، تو اسے یاد دہانی سمجھیں، فال نہیں۔ آپ کی ہجرت آپ کی منتظر ہے: اُس زندگی سے جس میں آپ پھنسے ہیں، اُس زندگی کی طرف جو آپ اللہ سے مانگ رہے ہیں۔ پرانے آپ کو مکہ میں چھوڑ دیں۔ مدینہ کی طرف چلیں۔",
    "n.3": "راستے میں غار کے اندر، جب تعاقب کرنے والے چند قدم دور تھے، نبی ﷺ نے ابو بکرؓ سے فرمایا:",
    "n.ayah": "”غم نہ کرو، بے شک اللہ ہمارے ساتھ ہے۔“", "n.ref": "قرآن 9:40",
    "num.h": "اینجل نمبرز، <em>مسلمان کے انداز میں</em>",
    "num.lead": "لوگ بار بار آنے والے نمبروں کو ”اینجل نمبرز“ کہتے ہیں۔ بطور سنی مسلمان ہم ان میں غیب کی باتیں نہیں پڑھتے؛ غیب کا علم صرف اللہ کو ہے۔ لیکن بار بار آنے والا نمبر رک کر اللہ کو یاد کرنے کی ایک خوبصورت یاد دہانی ہو سکتا ہے۔ میں اپنے کلائنٹس کے ساتھ انہیں یوں استعمال کرتا ہوں:",
    "num.622": "ہجرت، اور میری سالگرہ۔ آپ کی نئی شروعات۔ نیت کریں، اللہ پر بھروسا کریں اور پہلا قدم اٹھائیں۔",
    "num.111": "ایک۔ اپنی توحید تازہ کریں۔", "num.222": "جو مل چکا ہے اُس پر شکر۔",
    "num.333": "ہر نماز کے بعد 33 بار تسبیح۔", "num.444": "آپ کا مسئلہ چھوٹا ہے۔ اللہ بڑا ہے۔",
    "num.555": "استغفار کریں اور دعا کی رکاوٹیں دور کریں۔", "num.786": "اُس کے نام سے شروع کریں۔",
    "dhikr.ayah": "”سن لو! اللہ کے ذکر سے ہی دلوں کو سکون ملتا ہے۔“", "dhikr.ref": "قرآن 13:28",
    "dua.h": "مینی فیسٹیشن <em>صرف دعا ہے</em>",
    "dua.1a": "<b>مانگیں۔</b> اللہ فرماتا ہے", "dua.1b": "”مجھے پکارو، میں تمہاری دعا قبول کروں گا۔“ (40:60)",
    "dua.2": "<b>اچھا گمان رکھیں۔</b> حدیثِ قدسی میں ہے: ”میں اپنے بندے کے گمان کے مطابق ہوں۔“ (بخاری و مسلم)",
    "dua.3a": "<b>یاد کریں۔</b>", "dua.3b": "”تم مجھے یاد کرو، میں تمہیں یاد کروں گا۔“ (2:152)",
    "dua.4": "<b>اندر سے بدلیں۔</b> ”اللہ کسی قوم کی حالت نہیں بدلتا جب تک وہ خود اپنے آپ کو نہ بدلے۔“ (13:11)",
    quote: "جس کے پیچھے آپ دوڑتے ہیں وہ نہیں ملتا۔ وہ ملتا ہے جو آپ حاضر دل سے اللہ سے مانگتے ہیں۔ تو بے جھجک مانگیں، کیونکہ آپ اپنی چاہت کے حق دار ہیں۔",
    "how.h": "یہ کیسے <em>کام کرتا ہے</em>",
    "how.1t": "نیت: فیصلہ کریں", "how.1": "”مجھے یہ شدت سے چاہیے“ دبائیں، مجھے بتائیں آپ کیا چاہتے ہیں، اور ہم آپ کا پہلا سیشن طے کریں گے۔ آپ کی ہجرت نیت سے شروع ہوتی ہے۔",
    "how.2t": "ذکر: دل کی صفائی", "how.2": "مرکوز ذکر جو شک کو خاموش کرے اور رکاوٹ بننے والے عقائد کو نرمی سے، ہمیشہ کے لیے ختم کرے۔",
    "how.3t": "دعا اور توکل: مانگیں اور بھروسا کریں", "how.3": "اللہ سے یقین کے ساتھ مانگیں، اسباب اختیار کریں، اور اُس شخص کی طرح جئیں جس کی دعا سنی جا چکی ہو۔",
    "for.h": "یہ <em>آپ کے لیے ہے</em> اگر…",
    "for.1": "آپ مسلمان ہیں اور دوبارہ اللہ کا قرب محسوس کرنا چاہتے ہیں، صرف رسمی طور پر نہیں۔",
    "for.2": "آپ زیادہ چاہنے اور کم پر سمجھوتہ کرنے سے تھک چکے ہیں۔",
    "for.3": "آپ مینی فیسٹیشن کی کتابیں اور وژن بورڈ آزما چکے ہیں، اور قرآن و سنت والا طریقہ چاہتے ہیں: دعا۔",
    "for.4": "622 آپ کو بار بار نظر آتا ہے، اور آپ جانتے ہیں کہ آپ کی ہجرت کا وقت آ گیا ہے۔",
    "for.5": "آپ لوگوں سے، نظرِ بد سے، اور نہ جانے والی سرگوشیوں سے تھکن محسوس کرتے ہیں۔",
    "for.6": "اور اندر کہیں آپ جانتے ہیں: <strong>آپ اپنی چاہت کے حق دار ہیں۔</strong>",
    creed: "<b>عدیل احمد رحمان</b> ایک سنی مسلمان ہیں، نہ اس سے زیادہ نہ کم۔ یہ نظام میں نے بنایا ہے، مگر اس کی بنیاد میں کچھ نیا نہیں: صرف ذکر، دعا اور اللہ پر توکل، مکمل طور پر قرآن و سنت پر مبنی، جیسا کہ نبی ﷺ نے سکھایا۔",
    "form.h": "عدیل احمد رحمان کے ساتھ اپنی جگہ محفوظ کریں",
    "form.name": "آپ کا نام", "form.name.ph": "پورا نام", "form.email": "ای میل",
    "form.ask": "آپ اللہ سے کیا مانگیں گے؟", "form.ask.ph": "شادی، رزق، سکون، اللہ کا قرب…",
    "form.note": "آپ اپنی چاہت کے حق دار ہیں، ان شاء اللہ۔ آپ کا پیغام سیدھا واٹس ایپ پر عدیل احمد رحمان تک پہنچتا ہے، ‎+1 613 408 3945۔",
    "foot.big": "آپ اپنی چاہت کے حق دار ہیں۔", "foot.tl": "622 · ہر نئی شروعات ایک ہجرت سے ہوتی ہے",
    "foot.role": "مسلمانوں کے لیے ذکر و دعا کوچ · سنی مسلمان",
    dock: "622 · آپ اپنی چاہت کے حق دار ہیں"
  };

  /* ---------------- Français ---------------- */
  T.fr = {
    title: "Adeel Ahmed Rahman — Coach en dhikr, dua et conscience · 622",
    "nav.coach": "Coach", "nav.realtor": "Immobilier", "nav.actor": "Acteur",
    role: "Coach en dhikr et dua pour les musulmans",
    mantra: "« Vous méritez ce que vous désirez. Demandez-le à Allah, avec certitude. »",
    badge: "✦ 622 · Hégire · Mon anniversaire · Musulman sunnite",
    "l1.t": "Commencez maintenant — en tête-à-tête avec Adeel", "l1.s": "Dhikr et dua ciblés · Vous méritez ce que vous désirez",
    "l2.t": "La mission de ma vie", "l2.s": "Le droit chemin, Al-Firdaws et la satisfaction d'Allah",
    "l3.t": "Mon histoire", "l3.s": "J'ai construit ceci pour sauver ma vie",
    "l4.t": "Pourquoi 622 ?", "l4.s": "L'Hégire, mon anniversaire, votre nouveau départ",
    "l5.t": "Protection", "l5.s": "Vampires énergétiques, mauvais œil et Shaytan",
    "l6.t": "Les nombres angéliques, à la manière musulmane", "l6.s": "Chaque nombre est un rappel d'Allah",
    "l7.t": "Échange de clarté gratuit sur WhatsApp",
    "hero.tag": "622 · Commencez maintenant · Adeel Ahmed Rahman",
    "hero.h": "Vous méritez<br>ce que vous <em>désirez.</em>",
    "intro.1": "Vous savez déjà ce que vous voulez. La vie, l'amour, l'argent, la paix. Ce qui vous en sépare, ce n'est ni la chance ni le moment. C'est l'histoire que vous vous racontez sur qui vous êtes.",
    "intro.2": "Je suis <strong>Adeel Ahmed Rahman</strong>, musulman sunnite, ni plus ni moins. J'ai créé ce système après avoir survécu à d'immenses traumatismes. J'aide avant tout les musulmans à se relier à Allah par le <strong>dhikr ciblé</strong> et par des <strong>techniques de manifestation qui ne sont rien d'autre que la dua</strong> : demander à Celui qui donne, le cœur présent et avec une pleine certitude. Ensemble, nous réécrivons cette histoire à la racine, pour que vous cessiez de courir et commenciez à <em>faire confiance</em>. Parce que vous méritez ce que vous désirez.",
    "price.b": "Commencez", "price.s": "Coaching individuel en dhikr et dua avec Adeel Ahmed Rahman · sur WhatsApp",
    cta: "Je le veux tellement",
    "cta.note": "Ouvre WhatsApp avec Adeel Ahmed Rahman · +1 613 408 3945",
    "get.h": "Ce que vous <em>en retirerez</em>",
    "get.1": "<b>De la clarté sur ce que vous désirez vraiment</b>, et sur la bonne manière de le demander à Allah.",
    "get.2": "<b>Une pratique quotidienne de dhikr ciblé</b> qui apaise l'esprit et pose le cœur.",
    "get.3": "<b>La dua telle que le Prophète ﷺ l'a enseignée</b> : louer Allah d'abord, prier sur le Prophète, demander avec certitude, et ne jamais dire « j'ai demandé et je n'ai pas été exaucé ».",
    "get.4": "<b>Les vieilles croyances repérées et dissoutes</b> : le « pas assez », le « pas encore », le « pas pour moi ».",
    "get.5": "<b>Une nouvelle image de vous-même, vécue chaque jour</b>, pour agir comme quelqu'un qui l'a déjà.",
    "get.6": "<b>Une protection contre les vampires énergétiques, le mauvais œil et Shaytan</b>, avec les adhkar que le Prophète ﷺ récitait matin et soir.",
    "get.7": "<b>Le tawakkul</b> : une confiance calme et certaine en Allah, à la place de la course, de l'attente et du doute.",
    "get.8": "<b>Un accès direct à Adeel Ahmed Rahman</b> sur WhatsApp entre les séances.",
    "pur.k": "La mission de ma vie · Adeel Ahmed Rahman",
    "pur.h": "Un seul message, <em>pour le monde entier.</em>",
    "pur.p": "Voici la mission de ma vie : transmettre un message au monde, et aider le monde à prendre le droit chemin, afin qu'ensemble nous entrions dans le plus haut paradis et que nous plaisions à Allah.",
    "pur.1": "Transmettre le message au monde", "pur.2": "Aider le monde à prendre le droit chemin",
    "pur.3": "Entrer au plus haut paradis, Jannat al-Firdaws", "pur.4": "Plaire à Allah, avant tout",
    "pur.ayah": "« Guide-nous sur le droit chemin. »", "pur.ref": "Coran 1:6",
    "pur.hadith": "« Quand vous demandez à Allah, demandez-Lui Al-Firdaws, car c'est le plus haut degré du Paradis. » (Sahih al-Bukhari)",
    "story.k": "Mon histoire · Adeel Ahmed Rahman",
    "story.h": "Je ne l'ai pas appris dans un livre. <em>Je l'ai construit pour survivre.</em>",
    "story.1": "J'ai créé ce système. Je sais ce que je sais parce que j'ai traversé d'immenses traumatismes, de ceux qui vous prennent tout. Je n'ai pas construit cette méthode pour devenir coach. Je l'ai construite pour <strong>sauver ma propre vie</strong>.",
    "story.2": "Quand plus rien ne marchait, je suis revenu à Allah : un dhikr ciblé, une dua venue du fond du cœur, et une protection contre tout ce qui me vidait. Pièce par pièce, cela m'a ramené.",
    "story.3": "Aujourd'hui, je veux sauver la vôtre : des vampires énergétiques, du mauvais œil et de Shaytan.",
    "pro.h": "Se protéger de <em>ce qui vous vide</em>",
    "pro.lead": "Une partie de ce qui vous retient ne vient pas du tout de vous. Je vous apprendrai à le reconnaître et à vous protéger comme le faisait le Prophète ﷺ.",
    "pro.1t": "Les vampires énergétiques", "pro.1": "Les personnes qui vous laissent vide. Apprenez à poser des limites, et appuyez-vous sur Allah plutôt que sur leur approbation.",
    "pro.2t": "Le mauvais œil", "pro.2": "« Le mauvais œil est une réalité. » (Sahih Muslim). Al-Falaq, An-Nas et Ayat al-Kursi, matin et soir. Dites <em>ma sha Allah</em> pour ce que vous admirez.",
    "pro.3t": "Shaytan, alias Satan", "pro.3": "Le murmure du « pas assez » et du « jamais toi ». Cherchez refuge auprès d'Allah, gardez votre dhikr et tenez à votre salat.",
    crisis: "Si vous êtes en crise ou pensez à mettre fin à vos jours, appelez ou envoyez un texto au 988 (Canada et États-Unis), ou au numéro d'urgence local, maintenant. Puis écrivez-moi.",
    "vs.h": "Vous progresserez plus en <em>2 jours</em> que d'autres en <em>30 ans.</em>",
    "vs.an": "Aïcha", "vs.aw": "30 ans de thérapie",
    "vs.ap": "Trois décennies à parler du problème. Toujours bloquée. Toujours impuissante. Toujours dans l'attente du mariage qu'elle voulait.",
    "vs.bn": "Aïda", "vs.bw": "2 jours avec Adeel Ahmed Rahman",
    "vs.bp": "Deux jours à changer qui elle croyait être. Aujourd'hui, elle vit la vie de ses rêves en <strong>Irlande, comme médecin</strong>. Elle a fait dua avec certitude, et Allah a répondu.",
    "vs.fine": "L'histoire d'Aïda lui appartient, et les résultats varient. Tout résultat vient d'Allah. Le coaching accompagne la thérapie et les soins médicaux, il ne les remplace pas.",
    "n.k": "Nombre angélique 622 · L'Hégire · Mon anniversaire",
    "n.1": "En <strong>622</strong>, le Prophète Muhammad ﷺ quitta La Mecque pour Médine. Des années d'épreuves prirent fin, et une communauté, un foyer et une nouvelle vie commencèrent. Ce tournant fut si décisif que le calendrier musulman compte chaque année à partir de lui.",
    "n.bday": "622, c'est aussi mon anniversaire : le <strong>22 juin</strong>. Le nombre de l'Hégire est ma date de naissance. Je ne le prends pas à la légère. Ma vie est ma propre Hégire, et ce message est la raison de ma présence ici.",
    "n.2": "Alors quand <strong>622</strong> ne cesse d'apparaître, sur une horloge, un reçu ou une plaque d'immatriculation, voyez-y un rappel, pas une prédiction. Votre Hégire vous attend : de la vie où vous êtes bloqué à la vie que vous demandez à Allah. Laissez l'ancien vous à La Mecque. Marchez vers Médine.",
    "n.3": "Dans la grotte, en chemin, les poursuivants à quelques pas, le Prophète ﷺ dit à Abou Bakr :",
    "n.ayah": "« Ne t'afflige pas ; Allah est avec nous. »", "n.ref": "Coran 9:40",
    "num.h": "Les nombres angéliques, <em>à la manière musulmane</em>",
    "num.lead": "On appelle les nombres répétés des « nombres angéliques ». En tant que musulmans sunnites, nous n'y lisons pas l'avenir : seul Allah connaît l'invisible. Mais un nombre répété peut être un beau rappel pour s'arrêter et se souvenir de Lui. Voici comment je les utilise avec mes clients :",
    "num.622": "L'Hégire, et mon anniversaire. Votre nouveau départ. Formulez votre intention, faites confiance à Allah et faites le premier pas.",
    "num.111": "Un. Renouvelez votre tawhid.", "num.222": "La gratitude pour ce qui est déjà donné.",
    "num.333": "Glorifiez-Le, 33 fois après chaque salat.", "num.444": "Votre problème est petit. Allah est plus grand.",
    "num.555": "Demandez pardon et levez ce qui bloque votre dua.", "num.786": "Commencez en Son nom.",
    "dhikr.ayah": "« C'est par le rappel d'Allah que les cœurs s'apaisent. »", "dhikr.ref": "Coran 13:28",
    "dua.h": "La manifestation <em>n'est que la dua</em>",
    "dua.1a": "<b>Demandez.</b> Allah dit", "dua.1b": "« Invoquez-Moi, Je vous répondrai. » (40:60)",
    "dua.2": "<b>Pensez du bien.</b> Dans le hadith qudsi : « Je suis tel que Mon serviteur pense de Moi. » (Bukhari et Muslim)",
    "dua.3a": "<b>Souvenez-vous.</b>", "dua.3b": "« Souvenez-vous de Moi, Je me souviendrai de vous. » (2:152)",
    "dua.4": "<b>Changez de l'intérieur.</b> « Allah ne change pas l'état d'un peuple tant que celui-ci ne change pas ce qui est en lui-même. » (13:11)",
    quote: "Vous n'obtenez pas ce que vous poursuivez. Vous obtenez ce que vous demandez à Allah le cœur présent. Alors demandez-Lui avec audace, parce que vous méritez ce que vous désirez.",
    "how.h": "Comment ça <em>marche</em>",
    "how.1t": "Niyyah : décidez", "how.1": "Touchez « Je le veux tellement », dites-moi ce que vous désirez, et nous fixons votre première séance. Votre Hégire commence par une intention.",
    "how.2t": "Dhikr : purifier le cœur", "how.2": "Un rappel ciblé pour faire taire le doute et dissoudre les croyances qui vous bloquent, en douceur et pour de bon.",
    "how.3t": "Dua et tawakkul : demander et faire confiance", "how.3": "Demandez à Allah avec certitude, prenez les moyens, et vivez comme quelqu'un dont la dua est déjà entendue.",
    "for.h": "C'est <em>pour vous</em> si…",
    "for.1": "Vous êtes musulman et voulez de nouveau vous sentir proche d'Allah, pas seulement accomplir les gestes.",
    "for.2": "Vous êtes las de vouloir plus et de vous contenter de moins.",
    "for.3": "Vous avez essayé les livres de manifestation et les tableaux de vision, et vous voulez la version du Coran et de la Sunna : la dua.",
    "for.4": "622 ne cesse d'apparaître, et vous savez qu'il est temps pour votre propre Hégire.",
    "for.5": "Vous vous sentez vidé par les gens, par le mauvais œil, par des murmures qui ne vous lâchent pas.",
    "for.6": "Quelque part en vous, vous le savez déjà : <strong>vous méritez ce que vous désirez.</strong>",
    creed: "<b>Adeel Ahmed Rahman</b> est un musulman sunnite, ni plus ni moins. J'ai créé ce système, mais ses fondations n'ont rien de nouveau : seulement le dhikr, la dua et la confiance en Allah, entièrement fondés sur le Coran et la Sunna, comme le Prophète ﷺ l'a enseigné.",
    "form.h": "Réservez votre place avec Adeel Ahmed Rahman",
    "form.name": "Votre nom", "form.name.ph": "Nom complet", "form.email": "E-mail",
    "form.ask": "Que demanderez-vous à Allah ?", "form.ask.ph": "Le mariage, la subsistance, la paix, la proximité d'Allah…",
    "form.note": "Vous méritez ce que vous désirez, in sha Allah. Votre message va directement à Adeel Ahmed Rahman sur WhatsApp, +1 613 408 3945.",
    "foot.big": "Vous méritez ce que vous désirez.", "foot.tl": "622 · Chaque nouveau départ commence par une Hégire",
    "foot.role": "Coach en dhikr et dua pour les musulmans · Musulman sunnite",
    dock: "622 · Vous méritez ce que vous désirez"
  };

  /* ---------------- Español ---------------- */
  T.es = {
    title: "Adeel Ahmed Rahman — Coach de dhikr, dua y conciencia · 622",
    "nav.coach": "Coach", "nav.realtor": "Inmobiliaria", "nav.actor": "Actor",
    role: "Coach de dhikr y dua para musulmanes",
    mantra: "«Mereces lo que deseas. Pídeselo a Allah, con certeza.»",
    badge: "✦ 622 · Hégira · Mi cumpleaños · Musulmán sunní",
    "l1.t": "Empieza ahora — sesión individual con Adeel", "l1.s": "Dhikr y dua enfocados · Mereces lo que deseas",
    "l2.t": "El propósito de mi vida", "l2.s": "El camino recto, Al-Firdaws y complacer a Allah",
    "l3.t": "Mi historia", "l3.s": "Construí esto para salvar mi vida",
    "l4.t": "¿Por qué 622?", "l4.s": "La Hégira, mi cumpleaños, tu nuevo comienzo",
    "l5.t": "Protección", "l5.s": "Vampiros energéticos, mal de ojo y Shaytán",
    "l6.t": "Números angelicales, al estilo musulmán", "l6.s": "Cada número es un recordatorio de Allah",
    "l7.t": "Charla de claridad gratis por WhatsApp",
    "hero.tag": "622 · Empieza ahora · Adeel Ahmed Rahman",
    "hero.h": "Mereces<br>lo que <em>deseas.</em>",
    "intro.1": "Ya sabes lo que quieres. La vida, el amor, el dinero, la paz. Lo que se interpone entre tú y eso no es la suerte ni el momento. Es la historia que te sigues contando sobre quién eres.",
    "intro.2": "Soy <strong>Adeel Ahmed Rahman</strong>, musulmán sunní, ni más ni menos. Creé este sistema después de sobrevivir a traumas inmensos. Ayudo principalmente a los musulmanes a conectar con Allah a través del <strong>dhikr enfocado</strong> y de <strong>técnicas de manifestación que no son más que dua</strong>: pedirle al que da, con el corazón presente y total certeza. Juntos reescribimos esa historia desde la raíz, para que dejes de perseguir y empieces a <em>confiar</em>. Porque mereces lo que deseas.",
    "price.b": "Empieza ya", "price.s": "Coaching individual de dhikr y dua con Adeel Ahmed Rahman · por WhatsApp",
    cta: "Lo quiero con todas mis fuerzas",
    "cta.note": "Abre WhatsApp con Adeel Ahmed Rahman · +1 613 408 3945",
    "get.h": "Lo que <em>te llevarás</em>",
    "get.1": "<b>Claridad sobre lo que de verdad deseas</b>, y cómo pedírselo a Allah como es debido.",
    "get.2": "<b>Una práctica diaria de dhikr enfocado</b> que calma la mente y asienta el corazón.",
    "get.3": "<b>La dua como la enseñó el Profeta ﷺ</b>: alabar primero a Allah, enviar salawat, pedir con certeza, y nunca decir «pedí y no fui respondido».",
    "get.4": "<b>Las viejas creencias, encontradas y disueltas</b>: el «no soy suficiente», el «todavía no», el «no es para mí».",
    "get.5": "<b>Una nueva imagen de ti para vivir cada día</b>, actuando como quien ya lo tiene.",
    "get.6": "<b>Protección contra los vampiros energéticos, el mal de ojo y Shaytán</b>, con los adhkar que el Profeta ﷺ recitaba cada mañana y cada tarde.",
    "get.7": "<b>Tawakkul</b>: confianza serena y firme en Allah, en lugar de perseguir, esperar y dudar.",
    "get.8": "<b>Acceso directo a Adeel Ahmed Rahman</b> por WhatsApp entre sesiones.",
    "pur.k": "El propósito de mi vida · Adeel Ahmed Rahman",
    "pur.h": "Un mensaje, <em>para el mundo entero.</em>",
    "pur.p": "Este es el propósito de mi vida: enviar un mensaje al mundo y ayudar al mundo a tomar el camino recto, para que juntos entremos en el paraíso más alto y complazcamos a Allah.",
    "pur.1": "Llevar el mensaje al mundo", "pur.2": "Ayudar al mundo a tomar el camino recto",
    "pur.3": "Entrar en el paraíso más alto, Jannat al-Firdaws", "pur.4": "Complacer a Allah, por encima de todo",
    "pur.ayah": "«Guíanos por el camino recto.»", "pur.ref": "Corán 1:6",
    "pur.hadith": "«Cuando le pidáis a Allah, pedidle Al-Firdaws, pues es lo más alto del Paraíso.» (Sahih al-Bujari)",
    "story.k": "Mi historia · Adeel Ahmed Rahman",
    "story.h": "No lo aprendí en un libro. <em>Lo construí para sobrevivir.</em>",
    "story.1": "Yo creé este sistema. Sé lo que sé porque he pasado por traumas inmensos, de los que te quitan todo. No construí este método para ser coach. Lo construí para <strong>salvar mi propia vida</strong>.",
    "story.2": "Cuando nada más funcionaba, volví a Allah: dhikr enfocado, dua desde lo más hondo del corazón, y protegerme de todo lo que me agotaba. Pieza a pieza, me trajo de vuelta.",
    "story.3": "Ahora quiero salvar la tuya: de los vampiros energéticos, del mal de ojo y de Shaytán.",
    "pro.h": "Protección contra <em>lo que te agota</em>",
    "pro.lead": "Parte de lo que te frena no eres tú en absoluto. Te enseñaré a reconocerlo y a protegerte como lo hacía el Profeta ﷺ.",
    "pro.1t": "Vampiros energéticos", "pro.1": "Las personas que te dejan vacío. Aprende a poner límites y apóyate en Allah en lugar de en su aprobación.",
    "pro.2t": "El mal de ojo", "pro.2": "«El mal de ojo es real.» (Sahih Muslim). Al-Falaq, An-Nas y Ayat al-Kursi, mañana y tarde. Di <em>ma sha Allah</em> ante lo que admiras.",
    "pro.3t": "Shaytán, alias Satanás", "pro.3": "El susurro del «no eres suficiente» y del «nunca tú». Busca refugio en Allah, mantén tu dhikr y aférrate a tu salat.",
    crisis: "Si estás en crisis o piensas en quitarte la vida, llama o escribe al 988 (Canadá y EE. UU.), o a tu número de emergencias local, ahora mismo. Después escríbeme.",
    "vs.h": "Avanzarás más en <em>2 días</em> que otros en <em>30 años.</em>",
    "vs.an": "Aisha", "vs.aw": "30 años de terapia",
    "vs.ap": "Tres décadas hablando del problema. Todavía estancada. Todavía impotente. Todavía esperando el matrimonio que quería.",
    "vs.bn": "Aida", "vs.bw": "2 días con Adeel Ahmed Rahman",
    "vs.bp": "Dos días cambiando quién creía que era. Hoy vive la vida de sus sueños en <strong>Irlanda, como médica</strong>. Hizo dua con certeza, y Allah respondió.",
    "vs.fine": "La historia de Aida es suya, y los resultados varían. Todo resultado viene de Allah. El coaching acompaña a la terapia y la atención médica, no las sustituye.",
    "n.k": "Número angelical 622 · La Hégira · Mi cumpleaños",
    "n.1": "En el año <strong>622</strong>, el Profeta Muhammad ﷺ dejó La Meca rumbo a Medina. Terminaron años de dificultades y comenzaron una comunidad, un hogar y una vida nueva. Fue un giro tan grande que el calendario musulmán cuenta cada año a partir de él.",
    "n.bday": "622 es también mi cumpleaños: el <strong>22 de junio</strong>. El número de la Hégira es la fecha en que nací. No me lo tomo a la ligera. Mi vida es mi propia Hégira, y este mensaje es la razón por la que estoy aquí.",
    "n.2": "Así que cuando <strong>622</strong> no deje de aparecer, en un reloj, un recibo o una matrícula, tómalo como un recordatorio, no como una predicción. Tu Hégira te espera: de la vida en la que estás atrapado a la vida que le pides a Allah. Deja tu antiguo yo en La Meca. Camina hacia Medina.",
    "n.3": "En la cueva, en el camino, con los perseguidores a pocos pasos, el Profeta ﷺ le dijo a Abu Bakr:",
    "n.ayah": "«No te entristezcas; Allah está con nosotros.»", "n.ref": "Corán 9:40",
    "num.h": "Números angelicales, <em>al estilo musulmán</em>",
    "num.lead": "La gente llama «números angelicales» a los números que se repiten. Como musulmanes sunníes no leemos el futuro en ellos; solo Allah conoce lo oculto. Pero un número repetido puede ser un bello aviso para detenerte y recordarle. Así los uso con mis clientes:",
    "num.622": "La Hégira, y mi cumpleaños. Tu nuevo comienzo. Haz tu intención, confía en Allah y da el primer paso.",
    "num.111": "Uno. Renueva tu tawhid.", "num.222": "Gratitud por lo que ya se te ha dado.",
    "num.333": "Glorifícale, 33 veces después de cada salat.", "num.444": "Tu problema es pequeño. Allah es más grande.",
    "num.555": "Pide perdón y despeja lo que bloquea tu dua.", "num.786": "Empieza en Su nombre.",
    "dhikr.ayah": "«En el recuerdo de Allah encuentran sosiego los corazones.»", "dhikr.ref": "Corán 13:28",
    "dua.h": "La manifestación <em>es solo dua</em>",
    "dua.1a": "<b>Pide.</b> Allah dice", "dua.1b": "«Invocadme y os responderé.» (40:60)",
    "dua.2": "<b>Espera el bien.</b> En el hadiz qudsi: «Yo soy como Mi siervo piensa de Mí.» (Bujari y Muslim)",
    "dua.3a": "<b>Recuerda.</b>", "dua.3b": "«Recordadme y Yo os recordaré.» (2:152)",
    "dua.4": "<b>Cambia por dentro.</b> «Allah no cambia la situación de un pueblo hasta que ellos cambian lo que hay en sí mismos.» (13:11)",
    quote: "No obtienes lo que persigues. Obtienes lo que le pides a Allah con el corazón presente. Así que pídele con valentía, porque mereces lo que deseas.",
    "how.h": "Cómo <em>funciona</em>",
    "how.1t": "Niyyah: decide", "how.1": "Pulsa «Lo quiero con todas mis fuerzas», cuéntame lo que deseas y reservamos tu primera sesión. Tu Hégira empieza con una intención.",
    "how.2t": "Dhikr: limpia el corazón", "how.2": "Recuerdo enfocado para acallar la duda y disolver las creencias que te bloquean, con suavidad y para siempre.",
    "how.3t": "Dua y tawakkul: pide y confía", "how.3": "Pídele a Allah con certeza, pon los medios y vive como alguien cuya dua ya ha sido escuchada.",
    "for.h": "Esto es <em>para ti</em> si…",
    "for.1": "Eres musulmán y quieres volver a sentirte cerca de Allah, no solo cumplir con los gestos.",
    "for.2": "Estás cansado de querer más y conformarte con menos.",
    "for.3": "Has probado libros de manifestación y tableros de visión, y quieres la versión del Corán y la Sunna: la dua.",
    "for.4": "622 no deja de aparecer, y sabes que es hora de tu propia Hégira.",
    "for.5": "Te sientes agotado por la gente, por el mal de ojo, por susurros de los que no te libras.",
    "for.6": "En algún lugar dentro de ti ya lo sabes: <strong>mereces lo que deseas.</strong>",
    creed: "<b>Adeel Ahmed Rahman</b> es un musulmán sunní, ni más ni menos. Yo creé este sistema, pero no hay nada nuevo en sus cimientos: solo dhikr, dua y confianza en Allah, construidos por completo sobre el Corán y la Sunna, como enseñó el Profeta ﷺ.",
    "form.h": "Reserva tu lugar con Adeel Ahmed Rahman",
    "form.name": "Tu nombre", "form.name.ph": "Nombre completo", "form.email": "Correo electrónico",
    "form.ask": "¿Qué le pedirás a Allah?", "form.ask.ph": "El matrimonio, el sustento, la paz, la cercanía a Allah…",
    "form.note": "Mereces lo que deseas, in sha Allah. Tu mensaje llega directamente a Adeel Ahmed Rahman por WhatsApp, +1 613 408 3945.",
    "foot.big": "Mereces lo que deseas.", "foot.tl": "622 · Todo nuevo comienzo empieza con una Hégira",
    "foot.role": "Coach de dhikr y dua para musulmanes · Musulmán sunní",
    dock: "622 · Mereces lo que deseas"
  };

  /* ---------------- 日本語 ---------------- */
  T.ja = {
    title: "Adeel Ahmed Rahman — ズィクル・ドゥアー・意識のコーチ · 622",
    "nav.coach": "コーチ", "nav.realtor": "不動産", "nav.actor": "俳優",
    role: "ムスリムのためのズィクル＆ドゥアー・コーチ",
    mantra: "「あなたは望むものにふさわしい。確信をもってアッラーに願いなさい。」",
    badge: "✦ 622 · ヒジュラ · 私の誕生日 · スンナ派ムスリム",
    "l1.t": "今すぐ始める — アディールとの個別セッション", "l1.s": "集中したズィクルとドゥアー · あなたは望むものにふさわしい",
    "l2.t": "私の人生の使命", "l2.s": "正しい道、フィルダウス、そしてアッラーのお喜び",
    "l3.t": "私のストーリー", "l3.s": "自分の命を救うために築いた",
    "l4.t": "なぜ622？", "l4.s": "ヒジュラ、私の誕生日、あなたの新しい始まり",
    "l5.t": "守り", "l5.s": "エナジーバンパイア、邪視、シャイターン",
    "l6.t": "ムスリム流エンジェルナンバー", "l6.s": "すべての数字はアッラーを思い出すきっかけ",
    "l7.t": "WhatsAppで無料の相談",
    "hero.tag": "622 · 今すぐ始める · Adeel Ahmed Rahman",
    "hero.h": "あなたは<br><em>望むもの</em>にふさわしい。",
    "intro.1": "あなたは自分が何を望んでいるか、もう知っています。人生、愛、お金、心の平安。あなたとそれを隔てているのは運でもタイミングでもありません。自分は何者かについて、あなたが自分に語り続けている物語です。",
    "intro.2": "私は<strong>Adeel Ahmed Rahman</strong>、スンナ派のムスリムです。それ以上でも以下でもありません。私は計り知れないトラウマを生き抜いたあとに、このシステムを作りました。私は主に、<strong>集中したズィクル</strong>と、<strong>実はドゥアーにほかならない引き寄せの技法</strong>を通して、ムスリムがアッラーとつながる手助けをしています。与えてくださる御方に、心を込め、完全な確信をもって願うことです。一緒にその物語を根本から書き直し、追いかけるのをやめて<em>委ねる</em>ことを始めましょう。あなたは望むものにふさわしいのですから。",
    "price.b": "今すぐ", "price.s": "Adeel Ahmed Rahmanによる個別ズィクル＆ドゥアー・コーチング · WhatsAppで",
    cta: "どうしてもこれが欲しい",
    "cta.note": "Adeel Ahmed RahmanとのWhatsAppが開きます · +1 613 408 3945",
    "get.h": "あなたが<em>得られるもの</em>",
    "get.1": "<b>本当に望んでいるものの明確さ</b>と、それをアッラーに正しく願う方法。",
    "get.2": "<b>毎日の集中したズィクルの習慣</b>。心を静め、胸を落ち着かせます。",
    "get.3": "<b>預言者ﷺが教えた通りのドゥアー</b>：まずアッラーを讃え、預言者への祝福を唱え、確信をもって願い、決して「願ったのに叶わなかった」と言わないこと。",
    "get.4": "<b>古い思い込みを見つけて溶かす</b>：「足りない」「まだ早い」「自分には無理」。",
    "get.5": "<b>毎日を生きる新しい自己像</b>。すでにそれを手にした人のように行動できます。",
    "get.6": "<b>エナジーバンパイア、邪視、シャイターンからの守り</b>。預言者ﷺが毎朝毎夕唱えたアズカールで。",
    "get.7": "<b>タワックル</b>：アッラーへの穏やかで揺るがない信頼。追いかけること、待つこと、疑うことに代わるもの。",
    "get.8": "<b>Adeel Ahmed Rahmanへの直接アクセス</b>。セッションの合間もWhatsAppで。",
    "pur.k": "私の人生の使命 · Adeel Ahmed Rahman",
    "pur.h": "ひとつのメッセージを、<em>全世界へ。</em>",
    "pur.p": "これが私の人生の使命です。世界にメッセージを届け、世界が正しい道を歩む手助けをすること。そして共に最高の天国に入り、アッラーにお喜びいただくことです。",
    "pur.1": "世界にメッセージを届ける", "pur.2": "世界が正しい道を歩む手助けをする",
    "pur.3": "最高の天国、ジャンナトゥル・フィルダウスに入る", "pur.4": "何よりもアッラーにお喜びいただく",
    "pur.ayah": "「私たちを正しい道に導いてください。」", "pur.ref": "クルアーン 1:6",
    "pur.hadith": "「アッラーに願うときは、フィルダウスを願いなさい。それは楽園の最も高い所だからです。」（サヒーフ・ブハーリー）",
    "story.k": "私のストーリー · Adeel Ahmed Rahman",
    "story.h": "本で学んだのではありません。<em>生き延びるために築いたのです。</em>",
    "story.1": "このシステムは私が作りました。私が知っていることを知っているのは、すべてを奪われるような、計り知れないトラウマを経験してきたからです。コーチになるためにこの方法を築いたのではありません。<strong>自分の命を救うために</strong>築いたのです。",
    "story.2": "何も効かなかったとき、私はアッラーのもとに戻りました。集中したズィクル、心の奥底からのドゥアー、そして私を消耗させるあらゆるものから自分を守ること。少しずつ、それが私を取り戻してくれました。",
    "story.3": "今度は、あなたの命を救いたい。エナジーバンパイアから、邪視から、そしてシャイターンから。",
    "pro.h": "<em>あなたを消耗させるもの</em>からの守り",
    "pro.lead": "あなたを引き止めているものの一部は、そもそもあなたのせいではありません。それを見分け、預言者ﷺのように自分を守る方法をお教えします。",
    "pro.1t": "エナジーバンパイア", "pro.1": "あなたを空っぽにする人たち。境界線を引くことを学び、彼らの承認ではなくアッラーに頼りましょう。",
    "pro.2t": "邪視", "pro.2": "「邪視は真実である。」（サヒーフ・ムスリム）。ファラク章、ナース章、玉座の節を朝夕に。感心したものには<em>マーシャーアッラー</em>と言いましょう。",
    "pro.3t": "シャイターン（悪魔）", "pro.3": "「足りない」「お前には無理だ」というささやき。アッラーに守りを求め、ズィクルを続け、礼拝を守りましょう。",
    crisis: "危機的な状況にある方や、命を絶つことを考えている方は、今すぐ988（カナダ・米国）またはお住まいの地域の緊急番号に電話かメッセージをしてください。そのあとで私に連絡してください。",
    "vs.h": "ほかの人が<em>30年</em>かける以上の前進を、あなたは<em>2日</em>で遂げるでしょう。",
    "vs.an": "アイシャ", "vs.aw": "30年間のセラピー",
    "vs.ap": "30年間、問題について話し続けた。それでも行き詰まったまま。無力なまま。望んだ結婚を待ち続けたまま。",
    "vs.bn": "アイーダ", "vs.bw": "Adeel Ahmed Rahmanとの2日間",
    "vs.bp": "自分は何者かという思い込みを変えた2日間。今、彼女は<strong>アイルランドで医師として</strong>夢の人生を送っています。確信をもってドゥアーをし、アッラーが応えてくださいました。",
    "vs.fine": "アイーダの体験は彼女自身のものであり、結果には個人差があります。すべての結果はアッラーからのものです。コーチングはセラピーや医療と並行するものであり、それらに代わるものではありません。",
    "n.k": "エンジェルナンバー622 · ヒジュラ · 私の誕生日",
    "n.1": "西暦<strong>622年</strong>、預言者ムハンマドﷺはマッカからマディーナへ移住しました。苦難の年月が終わり、共同体と故郷と新しい人生が始まりました。それはイスラーム暦がそこから年を数えるほどの転換点でした。",
    "n.bday": "622は私の誕生日でもあります。<strong>6月22日</strong>です。ヒジュラの数字が、私の生まれた日なのです。私はそれを軽く受け止めてはいません。私の人生そのものが私のヒジュラであり、このメッセージこそが私がここにいる理由です。",
    "n.2": "だから<strong>622</strong>が時計やレシート、ナンバープレートに何度も現れるなら、それを占いではなく、思い出すきっかけとして受け取ってください。あなたのヒジュラが待っています。行き詰まった人生から、アッラーに願っている人生へ。古い自分をマッカに置いて、マディーナへ向かって歩き出しましょう。",
    "n.3": "移住の途中の洞窟で、追っ手がすぐそばまで迫ったとき、預言者ﷺはアブー・バクルにこう言いました。",
    "n.ayah": "「悲しむな。本当にアッラーは私たちと共におられる。」", "n.ref": "クルアーン 9:40",
    "num.h": "<em>ムスリム流</em>エンジェルナンバー",
    "num.lead": "繰り返し現れる数字は「エンジェルナンバー」と呼ばれます。スンナ派ムスリムとして、私たちはそこに運命を読み取りません。見えない世界を知るのはアッラーだけです。それでも、繰り返す数字は立ち止まってアッラーを思い出す美しいきっかけになり得ます。私はクライアントと次のように使っています。",
    "num.622": "ヒジュラ、そして私の誕生日。あなたの新しい始まり。意図を定め、アッラーに委ね、最初の一歩を踏み出しましょう。",
    "num.111": "唯一。タウヒードを新たに。", "num.222": "すでに与えられたものへの感謝。",
    "num.333": "毎回の礼拝後に33回、アッラーを讃える。", "num.444": "あなたの問題は小さい。アッラーはより偉大。",
    "num.555": "赦しを請い、ドゥアーを妨げるものを取り除く。", "num.786": "アッラーの御名において始める。",
    "dhikr.ayah": "「まことに、アッラーを念じることで心は安らぐ。」", "dhikr.ref": "クルアーン 13:28",
    "dua.h": "引き寄せは<em>ドゥアーにほかならない</em>",
    "dua.1a": "<b>願う。</b>アッラーは仰せられます", "dua.1b": "「われに祈れ。われはあなたがたに応えよう。」（40:60）",
    "dua.2": "<b>良く思う。</b>ハディース・クドスィーに「われは、わがしもべがわれをどう思うかのとおりである」（ブハーリー、ムスリム）",
    "dua.3a": "<b>念じる。</b>", "dua.3b": "「われを念じよ。われもあなたがたを念じよう。」（2:152）",
    "dua.4": "<b>内側から変わる。</b>「アッラーは、人々が自らの内にあるものを変えない限り、その状態を変えられない。」（13:11）",
    quote: "追いかけているものが手に入るのではありません。心を込めてアッラーに願ったものが与えられるのです。だから大胆に願いましょう。あなたは望むものにふさわしいのですから。",
    "how.h": "<em>進め方</em>",
    "how.1t": "ニーヤ：決める", "how.1": "「どうしてもこれが欲しい」をタップして望みを教えてください。最初のセッションを予約します。あなたのヒジュラは意図から始まります。",
    "how.2t": "ズィクル：心を清める", "how.2": "集中したズィクルで疑いを静め、あなたを妨げる思い込みを、優しく、永久に溶かします。",
    "how.3t": "ドゥアーとタワックル：願い、委ねる", "how.3": "確信をもってアッラーに願い、手段を尽くし、ドゥアーがすでに聞き届けられた人として生きましょう。",
    "for.h": "こんな<em>あなたに</em>…",
    "for.1": "形だけでなく、もう一度アッラーを身近に感じたいムスリムのあなた。",
    "for.2": "もっと望みながら、少ないもので妥協することに疲れたあなた。",
    "for.3": "引き寄せの本やビジョンボードを試し、クルアーンとスンナに基づく方法、つまりドゥアーを求めているあなた。",
    "for.4": "622が何度も現れ、自分のヒジュラの時が来たと感じているあなた。",
    "for.5": "人や邪視、振り払えないささやきに消耗していると感じるあなた。",
    "for.6": "心のどこかで、もう知っているあなた。<strong>あなたは望むものにふさわしい。</strong>",
    creed: "<b>Adeel Ahmed Rahman</b>はスンナ派のムスリムです。それ以上でも以下でもありません。このシステムは私が作りましたが、その土台に新しいものは何もありません。ズィクル、ドゥアー、そしてアッラーへの信頼だけ。すべてクルアーンとスンナに基づき、預言者ﷺが教えた通りです。",
    "form.h": "Adeel Ahmed Rahmanとのセッションを申し込む",
    "form.name": "お名前", "form.name.ph": "氏名", "form.email": "メール",
    "form.ask": "アッラーに何を願いますか？", "form.ask.ph": "結婚、糧、心の平安、アッラーへの近さ…",
    "form.note": "あなたは望むものにふさわしい、インシャーアッラー。メッセージはWhatsAppで直接Adeel Ahmed Rahmanに届きます。+1 613 408 3945",
    "foot.big": "あなたは望むものにふさわしい。", "foot.tl": "622 · すべての新しい始まりはヒジュラから",
    "foot.role": "ムスリムのためのズィクル＆ドゥアー・コーチ · スンナ派ムスリム",
    dock: "622 · あなたは望むものにふさわしい"
  };

  /* ---------------- 中文（简体） ---------------- */
  T.zh = {
    title: "Adeel Ahmed Rahman — 记主、祈祷与意识教练 · 622",
    "nav.coach": "教练", "nav.realtor": "房地产", "nav.actor": "演员",
    role: "穆斯林的记主与祈祷教练",
    mantra: "“你配得上你所渴望的。满怀确信地向安拉祈求。”",
    badge: "✦ 622 · 希吉拉 · 我的生日 · 逊尼派穆斯林",
    "l1.t": "立即开始 — 与阿迪尔一对一", "l1.s": "专注的记主与祈祷 · 你配得上你所渴望的",
    "l2.t": "我的人生使命", "l2.s": "正道、菲尔道斯乐园与安拉的喜悦",
    "l3.t": "我的故事", "l3.s": "我建立它，是为了拯救自己的生命",
    "l4.t": "为什么是622？", "l4.s": "希吉拉、我的生日、你的新开始",
    "l5.t": "保护", "l5.s": "能量吸血鬼、毒眼与恶魔",
    "l6.t": "穆斯林方式的天使数字", "l6.s": "每个数字都是对安拉的提醒",
    "l7.t": "WhatsApp 免费咨询",
    "hero.tag": "622 · 立即开始 · Adeel Ahmed Rahman",
    "hero.h": "你配得上<br>你所<em>渴望的。</em>",
    "intro.1": "你已经知道自己想要什么：生活、爱情、财富、安宁。挡在你和它之间的，不是运气，也不是时机，而是你不断讲给自己听的、关于你是谁的那个故事。",
    "intro.2": "我是 <strong>Adeel Ahmed Rahman</strong>，一名逊尼派穆斯林，不多也不少。我在经历巨大创伤之后创建了这个体系。我主要帮助穆斯林通过<strong>专注的记主</strong>和<strong>其实就是祈祷（杜阿）的显化方法</strong>与安拉连接：以专注的心和完全的确信，向赐予者祈求。我们一起从根本上改写那个故事，让你不再追逐，而是开始<em>托靠</em>。因为你配得上你所渴望的。",
    "price.b": "立即开始", "price.s": "与 Adeel Ahmed Rahman 一对一的记主与祈祷辅导 · 通过 WhatsApp",
    cta: "我非常想要这个",
    "cta.note": "打开与 Adeel Ahmed Rahman 的 WhatsApp · +1 613 408 3945",
    "get.h": "你将<em>收获</em>",
    "get.1": "<b>清楚自己真正渴望什么</b>，以及如何正确地向安拉祈求。",
    "get.2": "<b>每日专注的记主练习</b>，让头脑平静、内心安定。",
    "get.3": "<b>按先知ﷺ教导的方式祈祷</b>：先赞美安拉，再为先知祝福，满怀确信地祈求，永远不说“我祈求了却没有得到回应”。",
    "get.4": "<b>找到并化解旧有的信念</b>：“我不够好”“还没到时候”“这不属于我”。",
    "get.5": "<b>每天活出新的自我形象</b>，像已经拥有它的人那样行动。",
    "get.6": "<b>远离能量吸血鬼、毒眼和恶魔的保护</b>，使用先知ﷺ每天早晚诵念的记念词。",
    "get.7": "<b>托靠</b>：对安拉平静而坚定的信赖，取代追逐、等待和怀疑。",
    "get.8": "<b>直接联系 Adeel Ahmed Rahman</b>，课程之间也可通过 WhatsApp。",
    "pur.k": "我的人生使命 · Adeel Ahmed Rahman",
    "pur.h": "一个信息，<em>传给全世界。</em>",
    "pur.p": "这是我的人生使命：向世界传递一个信息，帮助世界走上正道，让我们一起进入最高的乐园，并取悦安拉。",
    "pur.1": "把信息传给世界", "pur.2": "帮助世界走上正道",
    "pur.3": "进入最高的乐园——菲尔道斯乐园", "pur.4": "取悦安拉，高于一切",
    "pur.ayah": "“求你引导我们走正路。”", "pur.ref": "古兰经 1:6",
    "pur.hadith": "“当你们向安拉祈求时，就祈求菲尔道斯，因为它是乐园的最高处。”（《布哈里圣训实录》）",
    "story.k": "我的故事 · Adeel Ahmed Rahman",
    "story.h": "我不是从书本上学来的。<em>我建立它是为了活下去。</em>",
    "story.1": "这个体系是我创建的。我之所以懂得这些，是因为我经历过巨大的创伤，那种会夺走你一切的创伤。我建立这个方法不是为了当教练，而是为了<strong>拯救我自己的生命</strong>。",
    "story.2": "当一切都不起作用时，我回到了安拉身边：专注的记主，发自内心深处的祈祷，并保护自己远离一切消耗我的东西。一点一点地，它把我带了回来。",
    "story.3": "现在我想拯救你的生命：让你远离能量吸血鬼、毒眼和恶魔。",
    "pro.h": "远离<em>消耗你的东西</em>",
    "pro.lead": "阻碍你的东西，有些根本不是来自你。我会教你识别它们，并像先知ﷺ那样保护自己。",
    "pro.1t": "能量吸血鬼", "pro.1": "那些让你感到空虚的人。学会设立界限，依靠安拉，而不是他们的认可。",
    "pro.2t": "毒眼", "pro.2": "“毒眼是真实的。”（《穆斯林圣训实录》）。早晚诵读黎明章、世人章和宝座经文。对你欣赏的事物说<em>“玛莎安拉”</em>。",
    "pro.3t": "恶魔（撒旦）", "pro.3": "“你不够好”“永远轮不到你”的低语。求安拉护佑，坚持记主，坚守礼拜。",
    crisis: "如果你正处于危机之中或想要结束自己的生命，请立即拨打或发短信至 988（加拿大和美国），或拨打当地紧急号码。然后给我发消息。",
    "vs.h": "你在 <em>2 天</em>内取得的进步，将超过别人 <em>30 年</em>。",
    "vs.an": "阿伊莎", "vs.aw": "30 年心理治疗",
    "vs.ap": "三十年都在谈论问题。依然困顿，依然无助，依然在等待她想要的婚姻。",
    "vs.bn": "艾达", "vs.bw": "与 Adeel Ahmed Rahman 的 2 天",
    "vs.bp": "两天里，她改变了对自己的认知。如今她在<strong>爱尔兰当医生</strong>，过着梦想中的生活。她满怀确信地祈祷，安拉应答了她。",
    "vs.fine": "艾达的故事属于她自己，结果因人而异。一切结果皆来自安拉。辅导是心理治疗和医疗的补充，而不是替代。",
    "n.k": "天使数字 622 · 希吉拉 · 我的生日",
    "n.1": "公元 <strong>622 年</strong>，先知穆罕默德ﷺ从麦加迁往麦地那。多年的艰难结束了，一个社群、一个家园和一种新生活开始了。这是如此重大的转折点，以至于伊斯兰历从那一年开始纪年。",
    "n.bday": "622 也是我的生日：<strong>6 月 22 日</strong>。希吉拉的数字，正是我出生的日子。我不会轻视这一点。我的人生就是我自己的希吉拉，而这个信息正是我存在的原因。",
    "n.2": "所以，当 <strong>622</strong> 不断出现在你眼前——在时钟上、收据上或车牌上——请把它当作提醒，而不是预言。你的希吉拉在等着你：从你被困住的生活，走向你向安拉祈求的生活。把旧的自己留在麦加，朝麦地那走去。",
    "n.3": "迁徙途中，在山洞里，追兵近在咫尺，先知ﷺ对艾布·伯克尔说：",
    "n.ayah": "“你不要忧愁，安拉确实与我们同在。”", "n.ref": "古兰经 9:40",
    "num.h": "<em>穆斯林方式</em>的天使数字",
    "num.lead": "人们把重复出现的数字称为“天使数字”。作为逊尼派穆斯林，我们不从中预测命运；唯有安拉知道幽玄。但重复的数字可以成为一个美好的提醒，让你停下来记念祂。我是这样和我的客户使用它们的：",
    "num.622": "希吉拉，也是我的生日。你的新开始。立定举意，托靠安拉，迈出第一步。",
    "num.111": "独一。更新你的认主独一。", "num.222": "感恩已经得到的一切。",
    "num.333": "每次礼拜后赞颂祂 33 遍。", "num.444": "你的问题很小，安拉至大。",
    "num.555": "求饶恕，清除阻碍你祈祷的东西。", "num.786": "以祂的名义开始。",
    "dhikr.ayah": "“真的，记念安拉能使人心安宁。”", "dhikr.ref": "古兰经 13:28",
    "dua.h": "显化<em>就是祈祷</em>",
    "dua.1a": "<b>祈求。</b>安拉说", "dua.1b": "“你们当祈祷我，我就应答你们。”（40:60）",
    "dua.2": "<b>心怀美好的期望。</b>在神圣圣训中：“我依照我的仆人对我的看法对待他。”（布哈里、穆斯林）",
    "dua.3a": "<b>记念。</b>", "dua.3b": "“你们当记念我，我就记念你们。”（2:152）",
    "dua.4": "<b>从内在改变。</b>“安拉必定不变更任何民众的情况，直到他们变更自己的情况。”（13:11）",
    quote: "你得到的不是你追逐的东西，而是你用专注的心向安拉祈求的东西。所以大胆地向祂祈求吧，因为你配得上你所渴望的。",
    "how.h": "如何<em>进行</em>",
    "how.1t": "举意：做决定", "how.1": "点击“我非常想要这个”，告诉我你渴望什么，我们就预约你的第一次课程。你的希吉拉从举意开始。",
    "how.2t": "记主：净化内心", "how.2": "专注的记念让怀疑平息，温柔而彻底地化解阻碍你的信念。",
    "how.3t": "祈祷与托靠：祈求并信赖", "how.3": "满怀确信地向安拉祈求，尽力而为，并像祈祷已被听见的人那样生活。",
    "for.h": "这<em>适合你</em>，如果…",
    "for.1": "你是一名穆斯林，想要再次感受到与安拉的亲近，而不只是走走形式。",
    "for.2": "你厌倦了想要更多却总是将就。",
    "for.3": "你尝试过显化书籍和愿景板，想要基于古兰经和圣行的方法：祈祷。",
    "for.4": "622 不断出现，你知道属于你的希吉拉时刻到了。",
    "for.5": "你被人、被毒眼、被挥之不去的低语消耗得筋疲力尽。",
    "for.6": "在内心深处，你已经知道：<strong>你配得上你所渴望的。</strong>",
    creed: "<b>Adeel Ahmed Rahman</b> 是一名逊尼派穆斯林，不多也不少。这个体系是我创建的，但它的根基并无新意：只有记主、祈祷和对安拉的托靠，完全建立在古兰经和圣行之上，正如先知ﷺ所教导的那样。",
    "form.h": "预约与 Adeel Ahmed Rahman 的课程",
    "form.name": "你的名字", "form.name.ph": "全名", "form.email": "电子邮箱",
    "form.ask": "你将向安拉祈求什么？", "form.ask.ph": "婚姻、给养、安宁、与安拉的亲近…",
    "form.note": "你配得上你所渴望的，因沙安拉。你的消息会通过 WhatsApp 直接发送给 Adeel Ahmed Rahman，+1 613 408 3945。",
    "foot.big": "你配得上你所渴望的。", "foot.tl": "622 · 每一个新开始都始于一次希吉拉",
    "foot.role": "穆斯林的记主与祈祷教练 · 逊尼派穆斯林",
    dock: "622 · 你配得上你所渴望的"
  };

  /* ---------------- 한국어 ---------------- */
  T.ko = {
    title: "Adeel Ahmed Rahman — 디크르·두아·의식 코치 · 622",
    "nav.coach": "코치", "nav.realtor": "부동산", "nav.actor": "배우",
    role: "무슬림을 위한 디크르 & 두아 코치",
    mantra: "“당신은 원하는 것을 누릴 자격이 있습니다. 확신을 갖고 알라께 구하세요.”",
    badge: "✦ 622 · 히즈라 · 나의 생일 · 수니파 무슬림",
    "l1.t": "지금 시작하기 — 아딜과 1:1", "l1.s": "집중된 디크르와 두아 · 당신은 원하는 것을 누릴 자격이 있습니다",
    "l2.t": "내 삶의 목적", "l2.s": "올바른 길, 피르다우스, 그리고 알라의 기쁨",
    "l3.t": "나의 이야기", "l3.s": "내 목숨을 구하려고 만들었습니다",
    "l4.t": "왜 622인가?", "l4.s": "히즈라, 나의 생일, 당신의 새로운 시작",
    "l5.t": "보호", "l5.s": "에너지 뱀파이어, 악마의 눈, 샤이탄",
    "l6.t": "무슬림 방식의 엔젤 넘버", "l6.s": "모든 숫자는 알라를 떠올리게 하는 신호",
    "l7.t": "WhatsApp 무료 상담",
    "hero.tag": "622 · 지금 시작하기 · Adeel Ahmed Rahman",
    "hero.h": "당신은<br><em>원하는 것</em>을 누릴 자격이 있습니다.",
    "intro.1": "당신은 이미 원하는 것을 알고 있습니다. 삶, 사랑, 돈, 평안. 당신과 그것 사이를 가로막는 것은 운도 타이밍도 아닙니다. 당신이 누구인지에 대해 스스로에게 계속 들려주는 이야기입니다.",
    "intro.2": "저는 <strong>Adeel Ahmed Rahman</strong>, 수니파 무슬림입니다. 그 이상도 이하도 아닙니다. 저는 엄청난 트라우마를 견뎌낸 뒤 이 시스템을 만들었습니다. 저는 주로 무슬림들이 <strong>집중된 디크르</strong>와 <strong>사실은 두아에 지나지 않는 끌어당김 기법</strong>을 통해 알라와 연결되도록 돕습니다. 주시는 분께 온 마음과 온전한 확신으로 구하는 것입니다. 함께 그 이야기를 뿌리부터 다시 써서, 쫓기를 멈추고 <em>신뢰하기</em> 시작하세요. 당신은 원하는 것을 누릴 자격이 있으니까요.",
    "price.b": "지금 시작", "price.s": "Adeel Ahmed Rahman과의 1:1 디크르 & 두아 코칭 · WhatsApp으로",
    cta: "이것을 정말 간절히 원해요",
    "cta.note": "Adeel Ahmed Rahman과의 WhatsApp이 열립니다 · +1 613 408 3945",
    "get.h": "당신이 <em>얻게 될 것</em>",
    "get.1": "<b>진정으로 원하는 것에 대한 명확함</b>, 그리고 그것을 알라께 올바르게 구하는 방법.",
    "get.2": "<b>매일의 집중된 디크르 습관</b>으로 마음을 고요하게 하고 가슴을 안정시킵니다.",
    "get.3": "<b>예언자ﷺ께서 가르치신 대로의 두아</b>: 먼저 알라를 찬양하고, 살라와트를 드리고, 확신을 갖고 구하며, 절대 “구했는데 응답받지 못했다”고 말하지 않기.",
    "get.4": "<b>오래된 믿음을 찾아 녹여내기</b>: “부족해”, “아직은 아니야”, “나를 위한 게 아니야”.",
    "get.5": "<b>매일 살아가는 새로운 자아상</b>으로, 이미 그것을 가진 사람처럼 행동하게 됩니다.",
    "get.6": "<b>에너지 뱀파이어, 악마의 눈, 샤이탄으로부터의 보호</b>. 예언자ﷺ께서 매일 아침저녁으로 외우신 아드카르로.",
    "get.7": "<b>타왁쿨</b>: 알라께 대한 차분하고 확고한 신뢰로, 쫓고 기다리고 의심하는 것을 대신합니다.",
    "get.8": "<b>Adeel Ahmed Rahman에게 직접 연락</b>. 세션 사이에도 WhatsApp으로.",
    "pur.k": "내 삶의 목적 · Adeel Ahmed Rahman",
    "pur.h": "하나의 메시지를, <em>온 세상에.</em>",
    "pur.p": "이것이 내 삶의 목적입니다. 세상에 메시지를 전하고, 세상이 올바른 길을 걷도록 도와, 함께 가장 높은 천국에 들어가고 알라를 기쁘게 해드리는 것입니다.",
    "pur.1": "세상에 메시지를 전하기", "pur.2": "세상이 올바른 길을 걷도록 돕기",
    "pur.3": "가장 높은 천국, 잔나트 알피르다우스에 들어가기", "pur.4": "무엇보다 알라를 기쁘게 해드리기",
    "pur.ayah": "“저희를 올바른 길로 인도하소서.”", "pur.ref": "꾸란 1:6",
    "pur.hadith": "“알라께 구할 때는 피르다우스를 구하라. 그곳은 천국의 가장 높은 곳이다.” (사히흐 알부카리)",
    "story.k": "나의 이야기 · Adeel Ahmed Rahman",
    "story.h": "책에서 배운 것이 아닙니다. <em>살아남기 위해 만들었습니다.</em>",
    "story.1": "이 시스템은 제가 만들었습니다. 제가 아는 것을 아는 이유는 모든 것을 앗아가는 엄청난 트라우마를 겪었기 때문입니다. 저는 코치가 되려고 이 방법을 만든 것이 아닙니다. <strong>제 목숨을 구하려고</strong> 만들었습니다.",
    "story.2": "아무것도 통하지 않을 때, 저는 알라께로 돌아갔습니다. 집중된 디크르, 마음 깊은 곳에서 나오는 두아, 그리고 저를 소진시키는 모든 것으로부터 저를 지키는 것. 조금씩, 그것이 저를 되돌려 놓았습니다.",
    "story.3": "이제 저는 당신의 목숨을 구하고 싶습니다. 에너지 뱀파이어로부터, 악마의 눈으로부터, 그리고 샤이탄으로부터.",
    "pro.h": "<em>당신을 소진시키는 것</em>으로부터의 보호",
    "pro.lead": "당신을 붙잡고 있는 것 중 일부는 전혀 당신 탓이 아닙니다. 그것을 알아보고 예언자ﷺ처럼 자신을 지키는 법을 가르쳐 드리겠습니다.",
    "pro.1t": "에너지 뱀파이어", "pro.1": "당신을 텅 비게 만드는 사람들. 경계를 세우는 법을 배우고, 그들의 인정 대신 알라께 의지하세요.",
    "pro.2t": "악마의 눈", "pro.2": "“악마의 눈은 실제로 있다.” (사히흐 무슬림). 알팔라끄, 안나스, 아야트 알쿠르시를 아침저녁으로. 감탄하는 것에는 <em>마샤알라</em>라고 말하세요.",
    "pro.3t": "샤이탄(사탄)", "pro.3": "“넌 부족해”, “넌 절대 안 돼”라는 속삭임. 알라께 피난처를 구하고, 디크르를 지키며, 살라를 놓지 마세요.",
    crisis: "위기에 처해 있거나 스스로 목숨을 끊을 생각이 든다면, 지금 바로 988(캐나다·미국) 또는 거주 지역의 긴급 번호로 전화나 문자를 하세요. 그다음에 저에게 연락하세요.",
    "vs.h": "다른 사람들이 <em>30년</em> 동안 이룬 것보다 더 많은 진전을 <em>2일</em> 만에 이룰 것입니다.",
    "vs.an": "아이샤", "vs.aw": "30년간의 심리치료",
    "vs.ap": "30년 동안 문제에 대해 이야기했습니다. 여전히 막혀 있고, 여전히 무력하고, 여전히 원하던 결혼을 기다리고 있습니다.",
    "vs.bn": "아이다", "vs.bw": "Adeel Ahmed Rahman과의 2일",
    "vs.bp": "자신이 누구라고 믿는지를 바꾼 이틀. 오늘 그녀는 <strong>아일랜드에서 의사로</strong> 꿈의 삶을 살고 있습니다. 확신을 갖고 두아를 했고, 알라께서 응답하셨습니다.",
    "vs.fine": "아이다의 이야기는 그녀 자신의 것이며, 결과는 사람마다 다릅니다. 모든 결과는 알라께로부터 옵니다. 코칭은 심리치료와 의료를 보완하는 것이지 대신하는 것이 아닙니다.",
    "n.k": "엔젤 넘버 622 · 히즈라 · 나의 생일",
    "n.1": "서기 <strong>622년</strong>, 예언자 무함마드ﷺ께서는 메카를 떠나 메디나로 이주하셨습니다. 고난의 세월이 끝나고 공동체와 집과 새로운 삶이 시작되었습니다. 그것은 이슬람력이 그해부터 해를 세기 시작할 만큼 큰 전환점이었습니다.",
    "n.bday": "622는 제 생일이기도 합니다. <strong>6월 22일</strong>입니다. 히즈라의 숫자가 바로 제가 태어난 날입니다. 저는 그것을 가볍게 여기지 않습니다. 제 삶이 곧 저의 히즈라이며, 이 메시지가 제가 여기 있는 이유입니다.",
    "n.2": "그러니 <strong>622</strong>가 시계나 영수증, 번호판에 계속 나타난다면, 점괘가 아닌 일깨움으로 받아들이세요. 당신의 히즈라가 기다리고 있습니다. 갇혀 있는 삶에서 알라께 구하고 있는 삶으로. 옛 자신을 메카에 두고 메디나를 향해 걸어가세요.",
    "n.3": "이주 길의 동굴에서, 추격자들이 몇 걸음 앞까지 왔을 때, 예언자ﷺ께서는 아부 바크르에게 말씀하셨습니다.",
    "n.ayah": "“슬퍼하지 말라. 실로 알라께서 우리와 함께 계신다.”", "n.ref": "꾸란 9:40",
    "num.h": "<em>무슬림 방식의</em> 엔젤 넘버",
    "num.lead": "사람들은 반복되는 숫자를 “엔젤 넘버”라고 부릅니다. 수니파 무슬림으로서 우리는 그 안에서 운명을 읽지 않습니다. 보이지 않는 것은 오직 알라만 아십니다. 하지만 반복되는 숫자는 멈춰서 그분을 기억하게 하는 아름다운 신호가 될 수 있습니다. 저는 고객들과 이렇게 활용합니다.",
    "num.622": "히즈라, 그리고 나의 생일. 당신의 새로운 시작. 의도를 세우고, 알라를 신뢰하며, 첫걸음을 내디디세요.",
    "num.111": "하나. 타우히드를 새롭게.", "num.222": "이미 주어진 것에 대한 감사.",
    "num.333": "매 살라 후 33번 그분을 찬양하세요.", "num.444": "당신의 문제는 작습니다. 알라는 더 위대하십니다.",
    "num.555": "용서를 구하고 두아를 막는 것을 걷어내세요.", "num.786": "그분의 이름으로 시작하세요.",
    "dhikr.ayah": "“실로 알라를 염원함으로써 마음이 평안을 얻는다.”", "dhikr.ref": "꾸란 13:28",
    "dua.h": "끌어당김은 <em>두아일 뿐입니다</em>",
    "dua.1a": "<b>구하세요.</b> 알라께서 말씀하십니다", "dua.1b": "“나에게 기도하라. 내가 너희에게 응답하리라.” (40:60)",
    "dua.2": "<b>좋게 기대하세요.</b> 하디스 꾸드시에서: “나는 나의 종이 나를 생각하는 대로 있다.” (부카리, 무슬림)",
    "dua.3a": "<b>기억하세요.</b>", "dua.3b": "“나를 기억하라. 내가 너희를 기억하리라.” (2:152)",
    "dua.4": "<b>내면에서 변화하세요.</b> “알라께서는 사람들이 스스로 자신 안에 있는 것을 바꾸기 전까지 그들의 상태를 바꾸지 않으신다.” (13:11)",
    quote: "쫓는 것을 얻는 것이 아닙니다. 온 마음으로 알라께 구한 것을 얻는 것입니다. 그러니 담대하게 구하세요. 당신은 원하는 것을 누릴 자격이 있으니까요.",
    "how.h": "<em>진행 방식</em>",
    "how.1t": "니야: 결심하기", "how.1": "“이것을 정말 간절히 원해요”를 누르고 원하는 것을 알려주세요. 첫 세션을 예약합니다. 당신의 히즈라는 의도에서 시작됩니다.",
    "how.2t": "디크르: 마음 정화하기", "how.2": "집중된 기억으로 의심을 잠재우고 당신을 막는 믿음을 부드럽게, 영원히 녹여냅니다.",
    "how.3t": "두아와 타왁쿨: 구하고 신뢰하기", "how.3": "확신을 갖고 알라께 구하고, 할 수 있는 노력을 다하며, 두아가 이미 들어진 사람처럼 살아가세요.",
    "for.h": "이런 <em>당신을 위한 것</em>입니다…",
    "for.1": "형식적인 것을 넘어, 다시 알라를 가까이 느끼고 싶은 무슬림.",
    "for.2": "더 많이 원하면서도 적은 것에 만족하는 데 지친 분.",
    "for.3": "끌어당김 책과 비전 보드를 시도해 봤고, 꾸란과 순나에 기반한 방법, 즉 두아를 원하는 분.",
    "for.4": "622가 계속 보이고, 자신의 히즈라를 떠날 때가 왔다고 느끼는 분.",
    "for.5": "사람들, 악마의 눈, 떨쳐낼 수 없는 속삭임에 지쳐 있는 분.",
    "for.6": "마음 어딘가에서 이미 알고 있는 분: <strong>당신은 원하는 것을 누릴 자격이 있습니다.</strong>",
    creed: "<b>Adeel Ahmed Rahman</b>은 수니파 무슬림입니다. 그 이상도 이하도 아닙니다. 이 시스템은 제가 만들었지만, 그 바탕에는 새로운 것이 없습니다. 오직 디크르, 두아, 알라께 대한 신뢰뿐이며, 모두 꾸란과 순나에 기반하고, 예언자ﷺ께서 가르치신 그대로입니다.",
    "form.h": "Adeel Ahmed Rahman과의 자리 예약하기",
    "form.name": "이름", "form.name.ph": "성명", "form.email": "이메일",
    "form.ask": "알라께 무엇을 구하시겠어요?", "form.ask.ph": "결혼, 양식, 평안, 알라와의 가까움…",
    "form.note": "당신은 원하는 것을 누릴 자격이 있습니다, 인샤알라. 메시지는 WhatsApp으로 Adeel Ahmed Rahman에게 바로 전달됩니다. +1 613 408 3945",
    "foot.big": "당신은 원하는 것을 누릴 자격이 있습니다.", "foot.tl": "622 · 모든 새로운 시작은 히즈라에서 비롯됩니다",
    "foot.role": "무슬림을 위한 디크르 & 두아 코치 · 수니파 무슬림",
    dock: "622 · 당신은 원하는 것을 누릴 자격이 있습니다"
  };


  /* ============ Added: pop-up, Pakistan WhatsApp, prayer, ego, King's Table, offers ============ */
  var MORE = {
    ar: {
      "nav.course": "الدورة", "nav.forum": "المنتدى",
      "w.h": "اختر لغتك", "w.help.h": "تريد المساعدة لتصل إلى ما ترغب فيه؟",
      "w.help.p": "القوة كلها لله وحده. عديل أحمد رحمان لا يصنع شيئًا. نحن ببساطة ندعو الله معًا، بالذكر والدعاء، أن يعينك على بلوغ ما ترغب فيه.",
      "w.go": "متابعة إلى الموقع",
      "l8.t": "الدورة المجانية ومائدة الملك", "l8.s": "ابدأ مجانًا · مدى الحياة 1,111$",
      "l9.t": "منتدى المجتمع", "l9.s": "اسأل أي سؤال في أي وقت",
      "l10.t": "اطلب دعاءً", "l10.s": "مجانًا دائمًا · واتساب ‎@PakistaniMangoes",
      "pray.btn": "اطلب دعاءً", "tt.btn": "تابعني على تيك توك",
      "pk.k": "🇵🇰 لأهل باكستان",
      "pk.h": "من باكستان؟ <em>راسلني مباشرة على واتساب.</em>",
      "pk.p": "بلا نماذج، بلا بريد إلكتروني، بلا رسوم مكالمات دولية. اضغط زرًا وأرسل رسالة أو رسالة صوتية بالأردية أو البنجابية أو الإنجليزية. يردّ عديل أحمد رحمان بنفسه.",
      "pk.voice": "أرسل رسالة صوتية: لا حاجة للكتابة", "pk.call": "تتصل من باكستان؟", "pk.time": "الوقت الآن",
      "pk.fine": "واتساب يستخدم بيانات الإنترنت لا رصيد المكالمات الدولية، على جاز وزونغ وتيلينور ويوفون. عديل في كندا، فإن كان نائمًا ردّ حين يستيقظ، إن شاء الله.",
      "ego.h": "الأنا هي الجدار بينك <em>وبين قوتك.</em>",
      "ego.1": "لا يمكنك أن تكون قويًا حقًا، <strong>منفتحًا</strong> حقًا، والأنا تقف في طريقك. الأنا تقول: «أنا فعلت»، «أنا أعلم»، «ماذا سيقول الناس؟». والاتساع الحقيقي يبدأ حين تسجد، وتقرّ بأن كل خير من الله.",
      "ego.2": "لا تدع آراء الآخرين تقرّر عنك. حين تكون مستعدًا للتخلّي عن الأنا، راسل عديل أحمد رحمان على واتساب، ‎+1 613 408 3945.",
      "ego.btn": "راسل عديل", "ego.btn2": "اطّلع على الخيارات",
      "king.h": "لستَ إلهًا. <em>لا إله إلا الله.</em>",
      "king.1": "يقول معلّمو «العصر الجديد»: «أنت الكون»، «أنت الإله»، «أنت تصنع واقعك». هذا ليس من الإسلام. أنت عبدٌ لله، وفي ذلك شرفك. أنت تسأل، وهو يعطي.",
      "king.t": "مائدة الملك هي الجنة.",
      "king.2": "أعلى مقام على الإطلاق، مائدة الملك، هو الجنة. ولن تُنال بالاستماع إلى معلّمي الروحانيات الجدد، بل برحمة الله، باتباع القرآن وسنة النبي ﷺ، وهذا كل ما سيعلّمك إياه مسلم سنّي مثل عديل أحمد رحمان.",
      "king.ref": "«قل هو الله أحد» سورة الإخلاص 1",
      "of.h": "طرق العمل <em>مع عديل</em>",
      "of.lead": "كل سعر ينتهي برقم ملائكي، تذكيرًا بالذكر. القوة كلها لله، وكل جلسة ليست إلا دعاءً نرفعه إليه معًا.",
      "of.king.t": "مائدة الملك · عضوية مدى الحياة",
      "of.king.d": "الدورة المتقدمة، وكل درس قادم، والحلقة الخاصة، ووصول مدى الحياة، بدفعة واحدة. أدخل بريدك ورقم واتساب وسيراسلك عديل شخصيًا.",
      free: "مجانًا", "of.free.t": "الدورة المجانية ومنتدى المجتمع",
      "of.free.d": "«ابدأ الآن»، دورة الأساسيات، مع المنتدى الذي تسأل فيه أي سؤال. مرحبًا بالأطباء والمحامين والمعالجين والأمهات والمسعفين.",
      "of.free.btn": "ابدأ مجانًا", "of.pray.t": "طلب دعاء", "of.pray.d": "أخبر عديل بما يدعو لك به. مجانًا دائمًا، فالدعاء لا يُباع.",
      "of.guide.t": "دليل الذكر والدعاء اليومي", "of.guide.d": "دليل مطبوع لأذكار الصباح والمساء مع تسجيل صوتي لعديل، حتى لا تفوتك حمايتك.",
      "of.clarity.t": "جلسة وضوح خاصة", "of.clarity.d": "45 دقيقة عبر فيديو واتساب. اكتشف ما ترغب فيه حقًا والدعاء المناسب له.",
      "of.protect.t": "برنامج الحماية · 3 أسابيع", "of.protect.d": "العين ومستنزفو الطاقة ووساوس الشيطان: أذكار يومية، وحدود، ومتابعة.",
      "of.monthly.t": "تدريب شهري", "of.monthly.d": "أربع جلسات خاصة شهريًا مع تواصل عبر واتساب بينها.",
      "of.rizq.t": "برنامج دعاء الزواج والرزق · 6 أسابيع", "of.rizq.d": "للزوج والرزق اللذين تسأل الله إياهما: الاستخارة والدعاء والعمل الداخلي.",
      "of.hijra.t": "برنامج الهجرة المكثّف · يومان", "of.hijra.d": "يومان عميقان مع عديل، بالصيغة التي خاضتها عايدة. اترك نفسك القديمة خلفك.",
      "of.fine": "الأسعار بالدولار الأمريكي. تدفع من باكستان؟ اسأل على واتساب. النتائج تختلف، وكل نتيجة من الله.",
      "pray.h": "اطلب <em>دعاءً</em>",
      "pray.p": "أخبرني بما تحب أن أدعو لك به. مجانًا دائمًا. يصل طلبك سرًّا إلى واتسابي، <strong>‎@PakistaniMangoes</strong> (‎+1 613 408 3945).",
      "pray.name": "اسمك (اختياري)", "pray.what": "بماذا أدعو لك؟", "pray.ph": "الشفاء لأمي، زوج صالح، الرزق، السكينة في بيتي…",
      "pray.send": "أرسل طلب الدعاء", "tt.follow": "تابع ‎@humiliator على تيك توك",
      "pray.fine": "تذكيرات يومية بالذكر والدعاء على تيك توك. والإجابة كلها من الله وحده."
    },
    ur: {
      "nav.course": "کورس", "nav.forum": "فورم",
      "w.h": "اپنی زبان منتخب کریں", "w.help.h": "اپنی چاہت تک پہنچنے میں مدد چاہیے؟",
      "w.help.p": "ساری طاقت صرف اللہ کی ہے۔ عدیل احمد رحمان خود کچھ نہیں کرتے۔ ہم مل کر بس ذکر اور دعا کے ساتھ اللہ سے مانگتے ہیں کہ وہ آپ کو آپ کی چاہت تک پہنچائے۔",
      "w.go": "ویب سائٹ پر جائیں",
      "l8.t": "مفت کورس اور کنگز ٹیبل", "l8.s": "مفت شروع کریں · تاحیات 1,111$",
      "l9.t": "کمیونٹی فورم", "l9.s": "کوئی بھی سوال، کسی بھی وقت پوچھیں",
      "l10.t": "دعا کی درخواست", "l10.s": "ہمیشہ مفت · واٹس ایپ ‎@PakistaniMangoes",
      "pray.btn": "دعا کی درخواست کریں", "tt.btn": "ٹک ٹاک پر فالو کریں",
      "pk.k": "🇵🇰 پاکستان کے لیے",
      "pk.h": "پاکستان سے ہیں؟ <em>سیدھا واٹس ایپ کریں۔</em>",
      "pk.p": "نہ کوئی فارم، نہ ای میل، نہ انٹرنیشنل کال کا خرچہ۔ بٹن دبائیں اور اردو، پنجابی یا انگریزی میں میسج یا وائس نوٹ بھیجیں۔ عدیل احمد رحمان خود جواب دیتے ہیں۔",
      "pk.voice": "وائس نوٹ بھیجیں: لکھنے کی ضرورت نہیں", "pk.call": "پاکستان سے کال کر رہے ہیں؟", "pk.time": "اس وقت",
      "pk.fine": "واٹس ایپ انٹرنیٹ ڈیٹا استعمال کرتا ہے، انٹرنیشنل کال بیلنس نہیں، چاہے جاز ہو، زونگ، ٹیلی نار یا یوفون۔ عدیل کینیڈا میں ہیں، اگر سو رہے ہوں تو جاگ کر جواب دیں گے، ان شاء اللہ۔",
      "ego.h": "آپ کی انا آپ اور <em>آپ کی طاقت کے درمیان دیوار ہے۔</em>",
      "ego.1": "جب تک انا راستے میں ہے، آپ واقعی طاقتور، واقعی <strong>وسیع</strong> نہیں ہو سکتے۔ انا کہتی ہے: ”یہ میں نے کیا“، ”مجھے زیادہ پتا ہے“، ”لوگ کیا کہیں گے؟“۔ اصل وسعت تب شروع ہوتی ہے جب آپ جھکتے ہیں، اور مانتے ہیں کہ ہر بھلائی اللہ کی طرف سے ہے۔",
      "ego.2": "دوسروں کی رائے کو اپنا فیصلہ نہ کرنے دیں۔ جب آپ انا چھوڑنے کے لیے تیار ہوں، تو عدیل احمد رحمان کو واٹس ایپ کریں، ‎+1 613 408 3945۔",
      "ego.btn": "عدیل کو میسج کریں", "ego.btn2": "آپشنز دیکھیں",
      "king.h": "آپ خدا نہیں ہیں۔ <em>صرف اللہ ہی معبود ہے۔</em>",
      "king.1": "نیو ایج والے کہتے ہیں: ”تم کائنات ہو“، ”تم خدا ہو“، ”تم اپنی حقیقت خود بناتے ہو“۔ یہ اسلام نہیں۔ آپ اللہ کے بندے ہیں، اور یہی آپ کی عزت ہے۔ آپ مانگتے ہیں؛ وہ عطا کرتا ہے۔",
      "king.t": "بادشاہ کا دسترخوان جنت ہے۔",
      "king.2": "سب سے اعلیٰ مقام، بادشاہ کا دسترخوان، جنت ہے۔ یہ نیو ایج روحانی گرووں کو سن کر نہیں ملے گی۔ یہ اللہ کی رحمت سے، قرآن اور نبی ﷺ کی سنت پر چل کر ملتی ہے، اور عدیل احمد رحمان جیسا سنی مسلمان آپ کو بس یہی سکھائے گا۔",
      "king.ref": "”کہہ دو: وہ اللہ ایک ہے۔“ قرآن 112:1",
      "of.h": "عدیل کے ساتھ <em>کام کرنے کے طریقے</em>",
      "of.lead": "ہر قیمت اینجل نمبر پر ختم ہوتی ہے، ذکر کی یاد دہانی کے طور پر۔ ساری طاقت اللہ کی ہے؛ ہر سیشن بس ہم دونوں کا مل کر اُس سے مانگنا ہے۔",
      "of.king.t": "کنگز ٹیبل · تاحیات ممبرشپ",
      "of.king.d": "ایڈوانسڈ کورس، آنے والا ہر سبق، خاص حلقہ اور تاحیات رسائی، ایک ہی ادائیگی میں۔ اپنی ای میل اور واٹس ایپ نمبر دیں، عدیل خود آپ کو میسج کریں گے۔",
      free: "مفت", "of.free.t": "مفت کورس اور کمیونٹی فورم",
      "of.free.d": "”ابھی شروع کریں“ بنیادی کورس، اور فورم جہاں آپ کوئی بھی سوال پوچھ سکتے ہیں۔ ڈاکٹرز، وکلا، تھراپسٹ، مائیں اور فرسٹ ریسپانڈرز سب خوش آمدید۔",
      "of.free.btn": "مفت شروع کریں", "of.pray.t": "دعا کی درخواست", "of.pray.d": "عدیل کو بتائیں کہ کس چیز کے لیے دعا کریں۔ ہمیشہ مفت۔ دعا بکاؤ نہیں۔",
      "of.guide.t": "روزانہ ذکر و دعا گائیڈ", "of.guide.d": "صبح و شام کے اذکار کی پرنٹ ہونے والی گائیڈ عدیل کی آواز کے ساتھ، تاکہ آپ کی حفاظت کبھی نہ چھوٹے۔",
      "of.clarity.t": "ون آن ون کلیرٹی سیشن", "of.clarity.d": "واٹس ایپ ویڈیو پر 45 منٹ۔ جانیں آپ واقعی کیا چاہتے ہیں اور اس کے لیے کون سی دعا۔",
      "of.protect.t": "حفاظتی پروگرام · 3 ہفتے", "of.protect.d": "نظرِ بد، توانائی چوسنے والے اور شیطان کی سرگوشیاں: روزانہ اذکار، حدیں اور فالو اپ۔",
      "of.monthly.t": "ماہانہ کوچنگ", "of.monthly.d": "مہینے میں چار ون آن ون سیشن اور درمیان میں واٹس ایپ رابطہ۔",
      "of.rizq.t": "شادی اور رزق کی دعا کا پروگرام · 6 ہفتے", "of.rizq.d": "اُس شریکِ حیات اور رزق کے لیے جو آپ اللہ سے مانگ رہے ہیں: استخارہ، دعا اور اندرونی کام۔",
      "of.hijra.t": "2 روزہ ہجرت انٹینسو", "of.hijra.d": "عدیل کے ساتھ دو گہرے دن، وہی طریقہ جو عائدہ نے کیا۔ پرانے آپ کو پیچھے چھوڑ دیں۔",
      "of.fine": "قیمتیں امریکی ڈالر میں ہیں۔ پاکستان سے ادائیگی؟ واٹس ایپ پر پوچھیں۔ نتائج مختلف ہو سکتے ہیں اور ہر نتیجہ اللہ کی طرف سے ہے۔",
      "pray.h": "دعا کی <em>درخواست</em>",
      "pray.p": "مجھے بتائیں کہ میں آپ کے لیے کس چیز کی دعا کروں۔ یہ ہمیشہ مفت ہے۔ آپ کی درخواست راز داری سے میرے واٹس ایپ پر آتی ہے، <strong>‎@PakistaniMangoes</strong> (‎+1 613 408 3945)۔",
      "pray.name": "آپ کا نام (اختیاری)", "pray.what": "میں کس چیز کی دعا کروں؟", "pray.ph": "امی کی شفا، نیک رشتہ، رزق، گھر میں سکون…",
      "pray.send": "دعا کی درخواست بھیجیں", "tt.follow": "ٹک ٹاک پر ‎@humiliator کو فالو کریں",
      "pray.fine": "ٹک ٹاک پر روزانہ ذکر اور دعا کی یاد دہانیاں۔ ہر جواب صرف اللہ کی طرف سے ہے۔"
    },
    fr: {
      "nav.course": "Cours", "nav.forum": "Forum",
      "w.h": "Choisissez votre langue", "w.help.h": "Besoin d'aide pour atteindre ce que vous désirez ?",
      "w.help.p": "Toute la puissance appartient à Allah seul. Adeel Ahmed Rahman ne fait rien arriver. Ensemble, nous prions simplement Allah, par le dhikr et la dua, de vous aider à atteindre ce que vous désirez.",
      "w.go": "Continuer vers le site",
      "l8.t": "Cours gratuit et Table du Roi", "l8.s": "Commencez gratuitement · À vie 1 111 $",
      "l9.t": "Forum de la communauté", "l9.s": "Posez n'importe quelle question, à tout moment",
      "l10.t": "Demander une prière", "l10.s": "Toujours gratuit · WhatsApp @PakistaniMangoes",
      "pray.btn": "Demander une prière", "tt.btn": "Suivre sur TikTok",
      "pk.k": "🇵🇰 Pour le Pakistan",
      "pk.h": "Vous êtes au Pakistan ? <em>Écrivez-moi directement sur WhatsApp.</em>",
      "pk.p": "Pas de formulaire, pas d'e-mail, pas de frais d'appel international. Touchez un bouton et envoyez un message ou un vocal, en ourdou, en pendjabi ou en anglais. Adeel Ahmed Rahman répond lui-même.",
      "pk.voice": "Envoyer un vocal : pas besoin d'écrire", "pk.call": "Vous appelez du Pakistan ?", "pk.time": "Heure actuelle",
      "pk.fine": "WhatsApp utilise vos données internet, pas votre crédit d'appel international, chez Jazz, Zong, Telenor ou Ufone. Adeel est au Canada : s'il dort, il répondra à son réveil, in sha Allah.",
      "ego.h": "Votre ego est le mur entre vous <em>et votre puissance.</em>",
      "ego.1": "Vous ne pouvez pas être vraiment puissant, vraiment <strong>expansif</strong>, tant que votre ego vous barre la route. L'ego dit « c'est moi qui l'ai fait », « je sais mieux », « que vont dire les gens ? ». La vraie expansion commence quand vous vous prosternez, et reconnaissez que tout bien vient d'Allah.",
      "ego.2": "Ne laissez pas l'opinion des autres décider à votre place. Quand vous serez prêt à lâcher l'ego, écrivez à Adeel Ahmed Rahman sur WhatsApp, +1 613 408 3945.",
      "ego.btn": "Écrire à Adeel", "ego.btn2": "Voir les options",
      "king.h": "Vous n'êtes pas Dieu. <em>Seul Allah est Dieu.</em>",
      "king.1": "Les maîtres du New Age disent « tu es l'univers », « tu es Dieu », « tu crées ta propre réalité ». Ce n'est pas l'islam. Vous êtes un serviteur d'Allah, et c'est votre honneur. Vous demandez ; Il donne.",
      "king.t": "La Table du Roi, c'est le Paradis.",
      "king.2": "La plus haute place qui soit, la Table du Roi, c'est la Jannah. On ne l'atteint pas en écoutant les gourous spirituels du New Age. On l'atteint par la miséricorde d'Allah, en suivant le Coran et la Sunna du Prophète ﷺ, et c'est tout ce qu'un musulman sunnite comme Adeel Ahmed Rahman vous enseignera.",
      "king.ref": "« Dis : Il est Allah, l'Unique. » Coran 112:1",
      "of.h": "Travailler <em>avec Adeel</em>",
      "of.lead": "Chaque prix se termine par un nombre angélique, pour rappeler le dhikr. Toute la puissance appartient à Allah ; chaque séance, c'est simplement nous qui Lui demandons ensemble.",
      "of.king.t": "La Table du Roi · Adhésion à vie",
      "of.king.d": "Le cours avancé, chaque leçon à venir, le cercle privé et un accès à vie, en un seul paiement. Laissez votre e-mail et votre WhatsApp, et Adeel vous écrira personnellement.",
      free: "Gratuit", "of.free.t": "Cours gratuit et forum de la communauté",
      "of.free.d": "« Commencez maintenant », le cours des fondations, et le forum où poser toutes vos questions. Médecins, avocats, thérapeutes, mères et premiers intervenants bienvenus.",
      "of.free.btn": "Commencer gratuitement", "of.pray.t": "Demande de prière", "of.pray.d": "Dites à Adeel pour quoi faire dua. Toujours gratuit. La prière ne se vend pas.",
      "of.guide.t": "Guide quotidien de dhikr et de dua", "of.guide.d": "Un guide imprimable des adhkar du matin et du soir, avec l'audio d'Adeel, pour ne jamais manquer votre protection.",
      "of.clarity.t": "Séance de clarté individuelle", "of.clarity.d": "45 minutes en vidéo WhatsApp. Découvrez ce que vous désirez vraiment et la dua exacte pour cela.",
      "of.protect.t": "Programme de protection · 3 semaines", "of.protect.d": "Mauvais œil, vampires énergétiques et murmures de Shaytan : adhkar quotidiens, limites et suivi.",
      "of.monthly.t": "Coaching mensuel", "of.monthly.d": "Quatre séances individuelles par mois, avec un accès WhatsApp entre elles.",
      "of.rizq.t": "Programme de dua mariage et subsistance · 6 semaines", "of.rizq.d": "Pour le conjoint et la subsistance que vous demandez à Allah : istikhara, dua et travail intérieur.",
      "of.hijra.t": "Intensif Hégire de 2 jours", "of.hijra.d": "Deux jours profonds avec Adeel, la formule qu'a suivie Aïda. Laissez l'ancien vous derrière.",
      "of.fine": "Prix en dollars américains. Vous payez depuis le Pakistan ? Demandez sur WhatsApp. Les résultats varient et tout résultat vient d'Allah.",
      "pray.h": "Demander une <em>prière</em>",
      "pray.p": "Dites-moi pour quoi vous aimeriez que je fasse dua. C'est gratuit, toujours. Votre demande arrive en privé sur mon WhatsApp, <strong>@PakistaniMangoes</strong> (+1 613 408 3945).",
      "pray.name": "Votre prénom (facultatif)", "pray.what": "Pour quoi dois-je prier ?", "pray.ph": "La guérison de ma mère, un conjoint pieux, la subsistance, la paix chez moi…",
      "pray.send": "Envoyer ma demande de prière", "tt.follow": "Suivre @humiliator sur TikTok",
      "pray.fine": "Rappels quotidiens de dhikr et de dua sur TikTok. Toute réponse vient d'Allah seul."
    },
    es: {
      "nav.course": "Curso", "nav.forum": "Foro",
      "w.h": "Elige tu idioma", "w.help.h": "¿Quieres ayuda para alcanzar lo que deseas?",
      "w.help.p": "Todo el poder pertenece solo a Allah. Adeel Ahmed Rahman no hace que nada ocurra. Juntos, simplemente le pedimos a Allah, con dhikr y dua, que te ayude a alcanzar lo que deseas.",
      "w.go": "Continuar al sitio",
      "l8.t": "Curso gratis y la Mesa del Rey", "l8.s": "Empieza gratis · De por vida 1.111 $",
      "l9.t": "Foro de la comunidad", "l9.s": "Pregunta lo que quieras, cuando quieras",
      "l10.t": "Pedir una oración", "l10.s": "Siempre gratis · WhatsApp @PakistaniMangoes",
      "pray.btn": "Pedir una oración", "tt.btn": "Sígueme en TikTok",
      "pk.k": "🇵🇰 Para Pakistán",
      "pk.h": "¿Estás en Pakistán? <em>Escríbeme directo por WhatsApp.</em>",
      "pk.p": "Sin formularios, sin correo, sin cargos de llamada internacional. Pulsa un botón y envía un mensaje o una nota de voz, en urdu, panyabí o inglés. Adeel Ahmed Rahman responde él mismo.",
      "pk.voice": "Envía una nota de voz: no hace falta escribir", "pk.call": "¿Llamas desde Pakistán?", "pk.time": "Hora actual",
      "pk.fine": "WhatsApp usa tus datos de internet, no saldo de llamadas internacionales, con Jazz, Zong, Telenor o Ufone. Adeel está en Canadá: si está dormido, responderá al despertar, in sha Allah.",
      "ego.h": "Tu ego es el muro entre tú <em>y tu poder.</em>",
      "ego.1": "No puedes ser verdaderamente poderoso, verdaderamente <strong>expansivo</strong>, mientras tu ego se interponga. El ego dice «lo hice yo», «yo sé más», «¿qué dirá la gente?». La verdadera expansión empieza cuando te postras y reconoces que todo bien viene de Allah.",
      "ego.2": "No dejes que las opiniones de los demás decidan por ti. Cuando estés listo para soltar el ego, escribe a Adeel Ahmed Rahman por WhatsApp, +1 613 408 3945.",
      "ego.btn": "Escribir a Adeel", "ego.btn2": "Ver las opciones",
      "king.h": "No eres Dios. <em>Solo Allah es Dios.</em>",
      "king.1": "Los maestros de la Nueva Era dicen «eres el universo», «eres Dios», «creas tu propia realidad». Eso no es el islam. Eres un siervo de Allah, y ese es tu honor. Tú pides; Él da.",
      "king.t": "La Mesa del Rey es el Paraíso.",
      "king.2": "El asiento más alto que existe, la Mesa del Rey, es la Yanna. No se alcanza escuchando a gurús espirituales de la Nueva Era. Se alcanza por la misericordia de Allah, siguiendo el Corán y la Sunna del Profeta ﷺ, y eso es todo lo que un musulmán sunní como Adeel Ahmed Rahman te enseñará.",
      "king.ref": "«Di: Él es Allah, Uno.» Corán 112:1",
      "of.h": "Formas de trabajar <em>con Adeel</em>",
      "of.lead": "Cada precio termina en un número angelical, como recordatorio del dhikr. Todo el poder pertenece a Allah; cada sesión es simplemente pedirle juntos.",
      "of.king.t": "La Mesa del Rey · Membresía de por vida",
      "of.king.d": "El curso avanzado, cada lección futura, el círculo privado y acceso de por vida, en un solo pago. Deja tu correo y tu WhatsApp y Adeel te escribirá personalmente.",
      free: "Gratis", "of.free.t": "Curso gratis y foro de la comunidad",
      "of.free.d": "«Empieza ahora», el curso de fundamentos, más el foro donde puedes hacer cualquier pregunta. Médicos, abogados, terapeutas, madres y personal de emergencias, bienvenidos.",
      "of.free.btn": "Empezar gratis", "of.pray.t": "Petición de oración", "of.pray.d": "Dile a Adeel por qué hacer dua. Siempre gratis. La oración no se vende.",
      "of.guide.t": "Guía diaria de dhikr y dua", "of.guide.d": "Una guía imprimible de los adhkar de la mañana y la tarde, con audio de Adeel, para no perder nunca tu protección.",
      "of.clarity.t": "Sesión de claridad individual", "of.clarity.d": "45 minutos por videollamada de WhatsApp. Descubre lo que de verdad deseas y la dua exacta para ello.",
      "of.protect.t": "Programa de protección · 3 semanas", "of.protect.d": "Mal de ojo, vampiros energéticos y susurros de Shaytán: adhkar diarios, límites y seguimiento.",
      "of.monthly.t": "Coaching mensual", "of.monthly.d": "Cuatro sesiones individuales al mes y acceso por WhatsApp entre ellas.",
      "of.rizq.t": "Programa de dua para matrimonio y sustento · 6 semanas", "of.rizq.d": "Para el cónyuge y el sustento que le pides a Allah: istijara, dua y trabajo interior.",
      "of.hijra.t": "Intensivo Hégira de 2 días", "of.hijra.d": "Dos días profundos con Adeel, el formato que hizo Aida. Deja atrás tu antiguo yo.",
      "of.fine": "Precios en dólares estadounidenses. ¿Pagas desde Pakistán? Pregunta por WhatsApp. Los resultados varían y todo resultado viene de Allah.",
      "pray.h": "Pide una <em>oración</em>",
      "pray.p": "Dime por qué quieres que haga dua. Es gratis, siempre. Tu petición llega en privado a mi WhatsApp, <strong>@PakistaniMangoes</strong> (+1 613 408 3945).",
      "pray.name": "Tu nombre (opcional)", "pray.what": "¿Por qué debo orar?", "pray.ph": "La curación de mi madre, un cónyuge piadoso, sustento, paz en mi hogar…",
      "pray.send": "Enviar mi petición de oración", "tt.follow": "Sigue a @humiliator en TikTok",
      "pray.fine": "Recordatorios diarios de dhikr y dua en TikTok. Toda respuesta viene solo de Allah."
    },
    ja: {
      "nav.course": "講座", "nav.forum": "フォーラム",
      "w.h": "言語を選んでください", "w.help.h": "望むものに近づくための助けが欲しいですか？",
      "w.help.p": "すべての力はアッラーおひとりのものです。Adeel Ahmed Rahmanが何かを起こすのではありません。私たちはただ一緒に、ズィクルとドゥアーで、あなたが望むものに届くようアッラーに祈るのです。",
      "w.go": "サイトへ進む",
      "l8.t": "無料講座と王の食卓", "l8.s": "無料で始める · 生涯 $1,111",
      "l9.t": "コミュニティ・フォーラム", "l9.s": "いつでも、どんな質問でも",
      "l10.t": "祈りをお願いする", "l10.s": "いつでも無料 · WhatsApp @PakistaniMangoes",
      "pray.btn": "祈りをお願いする", "tt.btn": "TikTokでフォロー",
      "pk.k": "🇵🇰 パキスタンの方へ",
      "pk.h": "パキスタンからですか？<em>WhatsAppで直接どうぞ。</em>",
      "pk.p": "フォームもメールも国際通話料も不要。ボタンをタップして、ウルドゥー語・パンジャーブ語・英語でメッセージかボイスメモを送ってください。Adeel Ahmed Rahman本人が返信します。",
      "pk.voice": "ボイスメモを送る：入力不要", "pk.call": "パキスタンから電話する場合", "pk.time": "現在の時刻",
      "pk.fine": "WhatsAppは国際通話の残高ではなくインターネットのデータを使います（Jazz、Zong、Telenor、Ufone）。アディールはカナダにいるので、寝ている場合は起きてから返信します、インシャーアッラー。",
      "ego.h": "エゴは、あなたと<em>あなたの力</em>を隔てる壁です。",
      "ego.1": "エゴが邪魔をしている限り、本当に力強く、本当に<strong>広がりのある</strong>存在にはなれません。エゴは「自分がやった」「自分の方がわかっている」「人にどう思われるか」と言います。本当の広がりは、ひれ伏し、すべての善はアッラーから来ると認めたときに始まります。",
      "ego.2": "他人の意見にあなたの決断を委ねないでください。エゴを手放す準備ができたら、WhatsAppでAdeel Ahmed Rahmanに連絡を。+1 613 408 3945",
      "ego.btn": "アディールに連絡", "ego.btn2": "プランを見る",
      "king.h": "あなたは神ではありません。<em>アッラーのみが神です。</em>",
      "king.1": "ニューエイジの教師は「あなたは宇宙だ」「あなたは神だ」「現実は自分で創る」と言います。それはイスラームではありません。あなたはアッラーのしもべであり、それこそがあなたの誉れです。あなたが願い、アッラーが与えてくださるのです。",
      "king.t": "王の食卓とは、天国のことです。",
      "king.2": "最も高い席、王の食卓とはジャンナ（天国）です。ニューエイジのスピリチュアル・グルに耳を傾けても、そこには届きません。アッラーの慈悲により、クルアーンと預言者ﷺのスンナに従うことで届くのです。Adeel Ahmed Rahmanのようなスンナ派ムスリムが教えるのは、それだけです。",
      "king.ref": "「言え、かれはアッラー、唯一なる御方。」クルアーン 112:1",
      "of.h": "<em>アディールと</em>取り組む方法",
      "of.lead": "どの価格もエンジェルナンバーで終わり、ズィクルを思い出させます。すべての力はアッラーのもの。どのセッションも、ただ一緒にアッラーに願う時間です。",
      "of.king.t": "王の食卓 · 生涯メンバーシップ",
      "of.king.d": "上級講座、今後のすべてのレッスン、プライベートサークル、生涯アクセスを一度の支払いで。メールとWhatsAppを入力すると、アディールが直接連絡します。",
      free: "無料", "of.free.t": "無料講座とコミュニティ・フォーラム",
      "of.free.d": "基礎講座「今すぐ始める」と、どんな質問もできるフォーラム。医師、弁護士、セラピスト、母親、救急隊員の方も歓迎します。",
      "of.free.btn": "無料で始める", "of.pray.t": "祈りのお願い", "of.pray.d": "何のためにドゥアーしてほしいかアディールに伝えてください。いつでも無料。祈りは売り物ではありません。",
      "of.guide.t": "毎日のズィクル＆ドゥアー・ガイド", "of.guide.d": "朝夕のアズカールを印刷できるガイドとアディールの音声付き。守りを欠かさないために。",
      "of.clarity.t": "個別クラリティ・セッション", "of.clarity.d": "WhatsAppビデオで45分。本当に望んでいるものと、そのためのドゥアーを見つけます。",
      "of.protect.t": "守りのプログラム · 3週間", "of.protect.d": "邪視、エナジーバンパイア、シャイターンのささやき：毎日のアズカール、境界線、フォローアップ。",
      "of.monthly.t": "月額コーチング", "of.monthly.d": "月4回の個別セッションと、その間のWhatsAppアクセス。",
      "of.rizq.t": "結婚と糧のドゥアー・プログラム · 6週間", "of.rizq.d": "アッラーに願っている伴侶と糧のために：イスティハーラ、ドゥアー、内面のワーク。",
      "of.hijra.t": "2日間ヒジュラ集中プログラム", "of.hijra.d": "アイーダが受けた形式の、アディールとの濃密な2日間。古い自分を後にしましょう。",
      "of.fine": "価格は米ドルです。パキスタンからのお支払いはWhatsAppでお尋ねください。結果には個人差があり、すべての結果はアッラーからのものです。",
      "pray.h": "<em>祈り</em>をお願いする",
      "pray.p": "何のためにドゥアーしてほしいか教えてください。いつでも無料です。お願いは私のWhatsApp <strong>@PakistaniMangoes</strong>（+1 613 408 3945）に非公開で届きます。",
      "pray.name": "お名前（任意）", "pray.what": "何のために祈りましょうか？", "pray.ph": "母の回復、敬虔な伴侶、糧、家庭の平安…",
      "pray.send": "祈りのお願いを送る", "tt.follow": "TikTokで@humiliatorをフォロー",
      "pray.fine": "TikTokで毎日のズィクルとドゥアーのリマインダー。すべての応えはアッラーおひとりから。"
    },
    zh: {
      "nav.course": "课程", "nav.forum": "论坛",
      "w.h": "选择你的语言", "w.help.h": "想要帮助你实现所渴望的吗？",
      "w.help.p": "一切能力只归于安拉。Adeel Ahmed Rahman 不会让任何事情发生。我们只是一起通过记主和祈祷，祈求安拉帮助你达成所愿。",
      "w.go": "继续浏览网站",
      "l8.t": "免费课程与国王之席", "l8.s": "免费开始 · 终身 $1,111",
      "l9.t": "社区论坛", "l9.s": "随时提出任何问题",
      "l10.t": "请求代祷", "l10.s": "永远免费 · WhatsApp @PakistaniMangoes",
      "pray.btn": "请求代祷", "tt.btn": "在 TikTok 关注我",
      "pk.k": "🇵🇰 致巴基斯坦朋友",
      "pk.h": "来自巴基斯坦？<em>直接发 WhatsApp。</em>",
      "pk.p": "无需表格、无需邮箱、没有国际通话费。点一下按钮，用乌尔都语、旁遮普语或英语发送文字或语音。Adeel Ahmed Rahman 亲自回复。",
      "pk.voice": "发送语音：无需打字", "pk.call": "从巴基斯坦拨打？", "pk.time": "当前时间",
      "pk.fine": "WhatsApp 使用的是你的网络流量，而不是国际通话余额（Jazz、Zong、Telenor、Ufone 均可）。阿迪尔在加拿大，如果他在睡觉，醒来后会回复，因沙安拉。",
      "ego.h": "你的自我，是你与<em>你的力量之间的墙。</em>",
      "ego.1": "只要自我挡在路上，你就无法真正强大、真正<strong>舒展</strong>。自我会说：“是我做到的”“我更懂”“别人会怎么说？”真正的舒展，从你俯身叩拜、承认一切美好都来自安拉开始。",
      "ego.2": "不要让别人的看法替你做决定。当你准备好放下自我时，通过 WhatsApp 联系 Adeel Ahmed Rahman：+1 613 408 3945。",
      "ego.btn": "联系阿迪尔", "ego.btn2": "查看方案",
      "king.h": "你不是神。<em>唯有安拉是神。</em>",
      "king.1": "新时代的导师们说：“你就是宇宙”“你就是神”“你创造自己的现实”。这不是伊斯兰。你是安拉的仆人，这正是你的荣耀。你祈求，祂赐予。",
      "king.t": "国王之席就是天园。",
      "king.2": "最高的座位——国王之席——就是天园。听新时代的灵性大师是到达不了的。只有凭安拉的慈悯，遵循古兰经和先知ﷺ的圣行才能到达，而这正是像 Adeel Ahmed Rahman 这样的逊尼派穆斯林唯一会教你的。",
      "king.ref": "“你说：祂是安拉，是独一的主。”古兰经 112:1",
      "of.h": "与<em>阿迪尔</em>合作的方式",
      "of.lead": "每个价格都以天使数字结尾，提醒你记主。一切能力归于安拉；每次课程，都只是我们一起向祂祈求。",
      "of.king.t": "国王之席 · 终身会员",
      "of.king.d": "高级课程、未来所有课程、私人圈子和终身访问，一次付清。留下你的邮箱和 WhatsApp，阿迪尔会亲自联系你。",
      free: "免费", "of.free.t": "免费课程与社区论坛",
      "of.free.d": "基础课程“立即开始”，以及可以提出任何问题的论坛。欢迎医生、律师、心理治疗师、母亲和急救人员。",
      "of.free.btn": "免费开始", "of.pray.t": "代祷请求", "of.pray.d": "告诉阿迪尔为你祈祷什么。永远免费。祈祷不是商品。",
      "of.guide.t": "每日记主与祈祷指南", "of.guide.d": "可打印的早晚记念词指南，附阿迪尔的音频，让你的保护从不间断。",
      "of.clarity.t": "一对一清晰课程", "of.clarity.d": "WhatsApp 视频 45 分钟。找到你真正渴望的东西，以及对应的祈祷。",
      "of.protect.t": "保护计划 · 3 周", "of.protect.d": "毒眼、能量吸血鬼和恶魔的低语：每日记念、界限设定和跟进。",
      "of.monthly.t": "月度辅导", "of.monthly.d": "每月四次一对一课程，期间可通过 WhatsApp 联系。",
      "of.rizq.t": "婚姻与给养祈祷计划 · 6 周", "of.rizq.d": "为你向安拉祈求的配偶和给养：求择礼拜、祈祷和内在功课。",
      "of.hijra.t": "2 天希吉拉密集课程", "of.hijra.d": "与阿迪尔深入相处的两天，就是艾达所参加的形式。把旧的自己留在身后。",
      "of.fine": "价格为美元。从巴基斯坦付款？请在 WhatsApp 咨询。结果因人而异，一切结果皆来自安拉。",
      "pray.h": "请求<em>代祷</em>",
      "pray.p": "告诉我你希望我为你祈祷什么。永远免费。你的请求会私下发送到我的 WhatsApp：<strong>@PakistaniMangoes</strong>（+1 613 408 3945）。",
      "pray.name": "你的名字（可选）", "pray.what": "我该为你祈祷什么？", "pray.ph": "母亲的康复、虔诚的配偶、给养、家庭的安宁…",
      "pray.send": "发送代祷请求", "tt.follow": "在 TikTok 关注 @humiliator",
      "pray.fine": "TikTok 上每天都有记主与祈祷的提醒。一切应答只来自安拉。"
    },
    ko: {
      "nav.course": "강좌", "nav.forum": "포럼",
      "w.h": "언어를 선택하세요", "w.help.h": "원하는 것에 닿도록 도움이 필요하신가요?",
      "w.help.p": "모든 능력은 오직 알라께 속합니다. Adeel Ahmed Rahman이 무언가를 일어나게 하는 것이 아닙니다. 우리는 그저 함께 디크르와 두아로, 당신이 원하는 것에 닿도록 알라께 기도할 뿐입니다.",
      "w.go": "사이트로 계속",
      "l8.t": "무료 강좌와 왕의 식탁", "l8.s": "무료로 시작 · 평생 $1,111",
      "l9.t": "커뮤니티 포럼", "l9.s": "언제든 어떤 질문이든",
      "l10.t": "기도 요청", "l10.s": "언제나 무료 · WhatsApp @PakistaniMangoes",
      "pray.btn": "기도 요청하기", "tt.btn": "TikTok에서 팔로우",
      "pk.k": "🇵🇰 파키스탄 분들께",
      "pk.h": "파키스탄에서 오셨나요? <em>WhatsApp으로 바로 연락하세요.</em>",
      "pk.p": "양식도, 이메일도, 국제전화 요금도 없습니다. 버튼을 눌러 우르두어, 펀자브어 또는 영어로 메시지나 음성 메모를 보내세요. Adeel Ahmed Rahman이 직접 답장합니다.",
      "pk.voice": "음성 메모 보내기: 타이핑 필요 없음", "pk.call": "파키스탄에서 전화하시나요?", "pk.time": "현재 시각",
      "pk.fine": "WhatsApp은 국제전화 잔액이 아니라 인터넷 데이터를 사용합니다(Jazz, Zong, Telenor, Ufone). 아딜은 캐나다에 있어서, 자고 있다면 일어나서 답장합니다, 인샤알라.",
      "ego.h": "에고는 당신과 <em>당신의 힘 사이의 벽입니다.</em>",
      "ego.1": "에고가 길을 막고 있는 한, 당신은 진정으로 강하고 진정으로 <strong>확장</strong>될 수 없습니다. 에고는 “내가 했어”, “내가 더 잘 알아”, “사람들이 뭐라고 할까?”라고 말합니다. 진정한 확장은 엎드려 모든 선이 알라께로부터 온다는 것을 인정할 때 시작됩니다.",
      "ego.2": "다른 사람들의 의견이 당신의 결정을 대신하게 두지 마세요. 에고를 내려놓을 준비가 되면 WhatsApp으로 Adeel Ahmed Rahman에게 연락하세요. +1 613 408 3945",
      "ego.btn": "아딜에게 연락", "ego.btn2": "옵션 보기",
      "king.h": "당신은 신이 아닙니다. <em>오직 알라만이 신입니다.</em>",
      "king.1": "뉴에이지 교사들은 “당신이 우주다”, “당신이 신이다”, “당신이 현실을 창조한다”고 말합니다. 그것은 이슬람이 아닙니다. 당신은 알라의 종이며, 그것이 당신의 영예입니다. 당신은 구하고, 그분은 주십니다.",
      "king.t": "왕의 식탁은 천국입니다.",
      "king.2": "가장 높은 자리, 왕의 식탁은 잔나(천국)입니다. 뉴에이지 영성 구루의 말을 들어서는 닿을 수 없습니다. 알라의 자비로, 꾸란과 예언자ﷺ의 순나를 따를 때 닿을 수 있으며, Adeel Ahmed Rahman 같은 수니파 무슬림이 가르치는 것은 오직 그것뿐입니다.",
      "king.ref": "“말하라, 그분은 알라, 유일하신 분이시다.” 꾸란 112:1",
      "of.h": "<em>아딜과</em> 함께하는 방법",
      "of.lead": "모든 가격은 엔젤 넘버로 끝나 디크르를 떠올리게 합니다. 모든 능력은 알라께 속하며, 모든 세션은 그저 함께 그분께 구하는 시간입니다.",
      "of.king.t": "왕의 식탁 · 평생 멤버십",
      "of.king.d": "고급 강좌, 앞으로의 모든 수업, 비공개 모임, 평생 이용권을 한 번의 결제로. 이메일과 WhatsApp을 입력하면 아딜이 직접 연락드립니다.",
      free: "무료", "of.free.t": "무료 강좌와 커뮤니티 포럼",
      "of.free.d": "기초 강좌 “지금 시작하기”와 어떤 질문이든 할 수 있는 포럼. 의사, 변호사, 치료사, 어머니, 응급 구조대원 모두 환영합니다.",
      "of.free.btn": "무료로 시작", "of.pray.t": "기도 요청", "of.pray.d": "무엇을 위해 두아해 줄지 아딜에게 알려주세요. 언제나 무료. 기도는 판매하지 않습니다.",
      "of.guide.t": "매일 디크르 & 두아 가이드", "of.guide.d": "아침저녁 아드카르를 인쇄할 수 있는 가이드와 아딜의 음성. 보호를 놓치지 않도록.",
      "of.clarity.t": "1:1 클래리티 세션", "of.clarity.d": "WhatsApp 영상통화 45분. 진정으로 원하는 것과 그에 맞는 두아를 찾습니다.",
      "of.protect.t": "보호 프로그램 · 3주", "of.protect.d": "악마의 눈, 에너지 뱀파이어, 샤이탄의 속삭임: 매일의 아드카르, 경계 세우기, 점검.",
      "of.monthly.t": "월간 코칭", "of.monthly.d": "한 달에 네 번의 1:1 세션과 그 사이의 WhatsApp 연락.",
      "of.rizq.t": "결혼과 양식 두아 프로그램 · 6주", "of.rizq.d": "알라께 구하는 배우자와 양식을 위해: 이스티카라, 두아, 내면 작업.",
      "of.hijra.t": "2일 히즈라 집중 과정", "of.hijra.d": "아이다가 했던 방식의, 아딜과 함께하는 깊은 이틀. 옛 자신을 뒤로하세요.",
      "of.fine": "가격은 미국 달러 기준입니다. 파키스탄에서 결제하시나요? WhatsApp으로 문의하세요. 결과는 사람마다 다르며 모든 결과는 알라께로부터 옵니다.",
      "pray.h": "<em>기도</em> 요청하기",
      "pray.p": "무엇을 위해 두아하기를 원하는지 알려주세요. 언제나 무료입니다. 요청은 제 WhatsApp <strong>@PakistaniMangoes</strong>(+1 613 408 3945)로 비공개 전달됩니다.",
      "pray.name": "이름(선택)", "pray.what": "무엇을 위해 기도할까요?", "pray.ph": "어머니의 치유, 경건한 배우자, 양식, 가정의 평안…",
      "pray.send": "기도 요청 보내기", "tt.follow": "TikTok에서 @humiliator 팔로우",
      "pray.fine": "TikTok에서 매일 디크르와 두아 알림. 모든 응답은 오직 알라께로부터."
    }
  };
  Object.keys(MORE).forEach(function (l) { T[l] = T[l] || {}; Object.keys(MORE[l]).forEach(function (k) { T[l][k] = MORE[l][k]; }); });
  var RIB_MORE = {
    en: ["Request a prayer", "TikTok @humiliator", "WhatsApp @PakistaniMangoes"],
    ar: ["اطلب دعاءً", "تيك توك ‎@humiliator", "واتساب ‎@PakistaniMangoes"],
    ur: ["دعا کی درخواست کریں", "ٹک ٹاک ‎@humiliator", "واٹس ایپ ‎@PakistaniMangoes"],
    fr: ["Demandez une prière", "TikTok @humiliator", "WhatsApp @PakistaniMangoes"],
    es: ["Pide una oración", "TikTok @humiliator", "WhatsApp @PakistaniMangoes"],
    ja: ["祈りをお願いする", "TikTok @humiliator", "WhatsApp @PakistaniMangoes"],
    zh: ["请求代祷", "TikTok @humiliator", "WhatsApp @PakistaniMangoes"],
    ko: ["기도 요청하기", "TikTok @humiliator", "WhatsApp @PakistaniMangoes"]
  };
  Object.keys(RIB_MORE).forEach(function (l) { RIBBON[l] = RIBBON[l].concat(RIB_MORE[l]); });



  /* ============ Added: awareness, private teachings, story lines ============ */
  var MORE2 = {
    ar: {
      "know.h": "تريد أن تعرف. جيد.", "know.p": "بعض التعاليم لا تُشارك إلا وجهًا لوجه. اختر كيف تتواصل مع عديل أحمد رحمان، وسيشاركها معك شخصيًا.", "know.btn": "أريد أن أعرف بشدّة",
      "story.4": "أنا <strong>تجسيدٌ لما أعلّمه</strong>. هذه التعاليم لم أتعلّمها في قاعة درس، بل خرجت من ليلةٍ مظلمة جدًا للروح. وأشعر أنني <strong>مُقادٌ بتوفيق إلهي</strong> لمساعدتك.",
      "aw.k": "الوعي · الإدراك", "aw.h": "التجلّي يدور كله حول <em>الوعي.</em>",
      "aw.1": "وعيك نُحت من صدماتك، ودراماك، وذكرياتك، وبرمجتك، وتكييفك. وما يُنحت عبر سنوات حياتك يصبح <strong>نظام تشغيلك</strong>.",
      "aw.c1": "الصدمات", "aw.c2": "الدراما", "aw.c3": "الذكريات", "aw.c4": "البرمجة", "aw.c5": "التكييف",
      "aw.2": "نظام التشغيل هذا يحدّد إن كنت ستصبح ثريًا جدًا أو وحيدًا، وإن كنت ستعمل لحلمك أو لحلم غيرك. الوعي المنحوت ينحت الإدراك.",
      "aw.3": "الوعي يخلق، بإذن الله. تذكّر ذلك. وسيساعدك عديل أحمد رحمان على تحريك وعيك.",
      "aw.btn": "تعلّم كل الأسرار",
      "vault.k": "خاص · عديل أحمد رحمان", "vault.h": "سرّ <em>الاتساع</em>", "vault.p": "هذا التعليم خاص. يشاركه عديل أحمد رحمان وجهًا لوجه."
    },
    ur: {
      "know.h": "آپ جاننا چاہتے ہیں۔ اچھی بات ہے۔", "know.p": "کچھ تعلیمات صرف آمنے سامنے بتائی جاتی ہیں۔ عدیل احمد رحمان سے رابطے کا طریقہ چنیں، وہ خود آپ کو بتائیں گے۔", "know.btn": "مجھے یہ جاننا شدت سے ہے",
      "story.4": "میں <strong>اپنی تعلیم کا جیتا جاگتا نمونہ</strong> ہوں۔ یہ تعلیمات کسی کلاس روم میں نہیں سیکھیں، یہ روح کی ایک بہت تاریک رات سے نکلی ہیں۔ اور مجھے لگتا ہے کہ مجھے آپ کی مدد کے لیے <strong>غیبی رہنمائی</strong> ملی ہے۔",
      "aw.k": "آگاہی · شعور", "aw.h": "مینی فیسٹیشن سراسر <em>آگاہی</em> کا نام ہے۔",
      "aw.1": "آپ کا شعور آپ کے صدمات، آپ کے ڈراموں، آپ کی یادوں، آپ کے پروگرامز اور آپ کی تربیت سے تراشا گیا ہے۔ زندگی بھر جو کچھ تراشا جاتا ہے وہی آپ کا <strong>آپریٹنگ سسٹم</strong> بن جاتا ہے۔",
      "aw.c1": "صدمات", "aw.c2": "ڈرامے", "aw.c3": "یادیں", "aw.c4": "پروگرامز", "aw.c5": "تربیت",
      "aw.2": "یہی آپریٹنگ سسٹم طے کرتا ہے کہ آپ بے حد امیر ہوں گے یا تنہا، آپ اپنے خواب کے لیے کام کریں گے یا کسی اور کے خواب کے لیے۔ تراشا ہوا شعور آگاہی کو تراشتا ہے۔",
      "aw.3": "شعور تخلیق کرتا ہے، اللہ کے حکم سے۔ یہ یاد رکھیں۔ عدیل احمد رحمان آپ کی آگاہی کو آگے بڑھانے میں مدد کریں گے۔",
      "aw.btn": "سارے راز سیکھیں",
      "vault.k": "نجی · عدیل احمد رحمان", "vault.h": "<em>وسعت</em> کا راز", "vault.p": "یہ تعلیم نجی رکھی گئی ہے۔ عدیل احمد رحمان اسے آمنے سامنے بتاتے ہیں۔"
    },
    fr: {
      "know.h": "Vous voulez savoir. Très bien.", "know.p": "Certains enseignements ne se partagent qu'en tête-à-tête. Choisissez comment joindre Adeel Ahmed Rahman, et il vous le partagera personnellement.", "know.btn": "Je veux tellement savoir",
      "story.4": "Je suis <strong>l'incarnation de ce que j'enseigne</strong>. Ces enseignements ne viennent pas d'une salle de classe : ils sont nés d'une très sombre nuit de l'âme. Et je me sens profondément <strong>guidé par le divin</strong> pour vous aider.",
      "aw.k": "Conscience · Éveil", "aw.h": "La manifestation, c'est avant tout <em>la conscience.</em>",
      "aw.1": "Votre conscience a été sculptée par vos traumatismes, vos drames, vos souvenirs, vos programmes et votre conditionnement. Ce qui se sculpte au fil de votre vie devient votre <strong>système d'exploitation</strong>.",
      "aw.c1": "Traumatismes", "aw.c2": "Drames", "aw.c3": "Souvenirs", "aw.c4": "Programmes", "aw.c5": "Conditionnement",
      "aw.2": "Ce système d'exploitation décide si vous serez immensément riche ou seul, si vous travaillerez pour votre rêve ou pour celui d'un autre. Une conscience sculptée sculpte la perception.",
      "aw.3": "La conscience crée, bi-idhnillah, par la permission d'Allah. Souvenez-vous-en. Adeel Ahmed Rahman vous aidera à déplacer votre conscience.",
      "aw.btn": "Apprendre tous les secrets",
      "vault.k": "Privé · Adeel Ahmed Rahman", "vault.h": "Le secret de <em>l'expansion</em>", "vault.p": "Cet enseignement reste privé. Adeel Ahmed Rahman le partage en tête-à-tête."
    },
    es: {
      "know.h": "Quieres saber. Bien.", "know.p": "Algunas enseñanzas solo se comparten en persona. Elige cómo contactar a Adeel Ahmed Rahman y él te lo compartirá personalmente.", "know.btn": "Quiero saberlo con todas mis fuerzas",
      "story.4": "Soy <strong>la encarnación de lo que enseño</strong>. Estas enseñanzas no salieron de un aula: nacieron de una noche oscura del alma muy profunda. Y me siento muy <strong>guiado por lo divino</strong> para ayudarte.",
      "aw.k": "Conciencia · Percepción", "aw.h": "La manifestación se trata de <em>conciencia.</em>",
      "aw.1": "Tu conciencia fue esculpida por tus traumas, tus dramas, tus recuerdos, tus programas y tu condicionamiento. Lo que se esculpe a lo largo de tu vida se convierte en tu <strong>sistema operativo</strong>.",
      "aw.c1": "Traumas", "aw.c2": "Dramas", "aw.c3": "Recuerdos", "aw.c4": "Programas", "aw.c5": "Condicionamiento",
      "aw.2": "Ese sistema operativo decide si serás inmensamente rico o vivirás solo, si trabajarás por tu sueño o por el de otro. La conciencia esculpida esculpe la percepción.",
      "aw.3": "La conciencia crea, bi-idhnillah, con el permiso de Allah. Recuérdalo. Adeel Ahmed Rahman te ayudará a mover tu conciencia.",
      "aw.btn": "Aprende todos los secretos",
      "vault.k": "Privado · Adeel Ahmed Rahman", "vault.h": "El secreto de la <em>expansión</em>", "vault.p": "Esta enseñanza se mantiene en privado. Adeel Ahmed Rahman la comparte en persona."
    },
    ja: {
      "know.h": "知りたいのですね。いいことです。", "know.p": "一対一でしか伝えない教えがあります。Adeel Ahmed Rahmanへの連絡方法を選んでください。本人が直接お伝えします。", "know.btn": "どうしても知りたい",
      "story.4": "私は<strong>自分が教えることを体現しています</strong>。この教えは教室で学んだものではなく、とても深い魂の闇夜から生まれました。そして私は、あなたを助けるよう<strong>神に導かれている</strong>と強く感じています。",
      "aw.k": "気づき · 意識", "aw.h": "引き寄せのすべては<em>気づき</em>にあります。",
      "aw.1": "あなたの意識は、トラウマ、ドラマ、記憶、プログラム、条件付けによって彫刻されてきました。人生を通じて彫られたものが、あなたの<strong>オペレーティングシステム</strong>になります。",
      "aw.c1": "トラウマ", "aw.c2": "ドラマ", "aw.c3": "記憶", "aw.c4": "プログラム", "aw.c5": "条件付け",
      "aw.2": "そのオペレーティングシステムが、あなたが莫大な富を得るか孤独になるか、自分の夢のために働くか他人の夢のために働くかを決めます。彫刻された意識が、気づきを彫刻するのです。",
      "aw.3": "意識は創造する、ビイズニッラー、アッラーのお許しによって。それを忘れないでください。Adeel Ahmed Rahmanがあなたの気づきを動かす手助けをします。",
      "aw.btn": "すべての秘密を学ぶ",
      "vault.k": "非公開 · Adeel Ahmed Rahman", "vault.h": "<em>拡大</em>の秘密", "vault.p": "この教えは非公開です。Adeel Ahmed Rahmanが一対一でお伝えします。"
    },
    zh: {
      "know.h": "你想知道。很好。", "know.p": "有些教导只在一对一时分享。选择联系 Adeel Ahmed Rahman 的方式，他会亲自告诉你。", "know.btn": "我非常想知道",
      "story.4": "我是<strong>我所教导之事的化身</strong>。这些教导不是在教室里学来的，而是从一个极其黑暗的灵魂暗夜中诞生的。我深深感到自己<strong>受到神圣的引领</strong>来帮助你。",
      "aw.k": "觉知 · 意识", "aw.h": "显化的核心就是<em>觉知。</em>",
      "aw.1": "你的意识是由你的创伤、你的戏剧、你的记忆、你的程序和你的条件反射雕刻而成的。一生中被雕刻出来的东西，就成了你的<strong>操作系统</strong>。",
      "aw.c1": "创伤", "aw.c2": "戏剧", "aw.c3": "记忆", "aw.c4": "程序", "aw.c5": "条件反射",
      "aw.2": "这个操作系统决定你会极其富有还是孤独，决定你为自己的梦想工作还是为别人的梦想工作。被雕刻的意识雕刻着觉知。",
      "aw.3": "意识在创造——凭安拉的许可。记住这一点。Adeel Ahmed Rahman 会帮助你移动你的觉知。",
      "aw.btn": "学习所有秘密",
      "vault.k": "私密 · Adeel Ahmed Rahman", "vault.h": "<em>扩展</em>的秘密", "vault.p": "这一教导保持私密。Adeel Ahmed Rahman 只在一对一时分享。"
    },
    ko: {
      "know.h": "알고 싶으시군요. 좋습니다.", "know.p": "어떤 가르침은 일대일로만 나눕니다. Adeel Ahmed Rahman에게 연락할 방법을 고르시면 직접 알려드립니다.", "know.btn": "정말 간절히 알고 싶어요",
      "story.4": "저는 <strong>제가 가르치는 것의 체현</strong>입니다. 이 가르침은 교실에서 배운 것이 아니라, 아주 깊은 영혼의 어두운 밤에서 나왔습니다. 그리고 저는 당신을 돕도록 <strong>신성하게 이끌림을 받고 있다</strong>고 깊이 느낍니다.",
      "aw.k": "자각 · 의식", "aw.h": "끌어당김의 핵심은 <em>자각</em>입니다.",
      "aw.1": "당신의 의식은 트라우마, 드라마, 기억, 프로그램, 조건화에 의해 조각되었습니다. 평생에 걸쳐 조각된 것이 당신의 <strong>운영 체제</strong>가 됩니다.",
      "aw.c1": "트라우마", "aw.c2": "드라마", "aw.c3": "기억", "aw.c4": "프로그램", "aw.c5": "조건화",
      "aw.2": "그 운영 체제가 당신이 엄청난 부자가 될지 외로워질지, 자신의 꿈을 위해 일할지 다른 사람의 꿈을 위해 일할지를 결정합니다. 조각된 의식이 자각을 조각합니다.",
      "aw.3": "의식은 창조합니다, 비이드닐라, 알라의 허락으로. 이것을 기억하세요. Adeel Ahmed Rahman이 당신의 자각을 움직이도록 도울 것입니다.",
      "aw.btn": "모든 비밀 배우기",
      "vault.k": "비공개 · Adeel Ahmed Rahman", "vault.h": "<em>확장</em>의 비밀", "vault.p": "이 가르침은 비공개입니다. Adeel Ahmed Rahman이 일대일로 나눕니다."
    }
  };
  Object.keys(MORE2).forEach(function (l) { Object.keys(MORE2[l]).forEach(function (k) { T[l][k] = MORE2[l][k]; }); });
  Object.keys(RIBBON).forEach(function (l) { RIBBON[l] = RIBBON[l].concat(["Snapchat @androgenic"]); });
  RIBBON.en.push("Consciousness creates · bi-idhnillah");



  /* ============ Added: PayPal payments and WhatsApp receipts ============ */
  var MORE3 = {
    ar: { "pay.btn": "باي بال", "rc.btn": "أرسل الإيصال", "ph.h": "طريقة الدفع",
      "ph.1": "اضغط <strong>باي بال</strong> على العرض الذي تريده. سيفتح paypal.me/adeelrahman والمبلغ جاهز.",
      "ph.2": "ادفع، ثم التقط صورة شاشة لإيصال باي بال.",
      "ph.3": "اضغط <strong>أرسل الإيصال</strong> وأرفق الصورة في واتساب. سيؤكد عديل أحمد رحمان ويحجز لك.",
      "ph.pk": "🇵🇰 في باكستان؟ باي بال لا يعمل هناك بعد، فراسل عديل على واتساب وسيرسل لك طريقة دفع أخرى." },
    ur: { "pay.btn": "پے پال", "rc.btn": "رسید بھیجیں", "ph.h": "ادائیگی کیسے کریں",
      "ph.1": "جو آفر چاہیے اس پر <strong>پے پال</strong> دبائیں۔ paypal.me/adeelrahman رقم کے ساتھ کھل جائے گا۔",
      "ph.2": "ادائیگی کریں، پھر پے پال رسید کا اسکرین شاٹ لیں۔",
      "ph.3": "<strong>رسید بھیجیں</strong> دبائیں اور واٹس ایپ میں اسکرین شاٹ لگا دیں۔ عدیل احمد رحمان تصدیق کر کے آپ کا وقت طے کریں گے۔",
      "ph.pk": "🇵🇰 پاکستان میں ہیں؟ پے پال وہاں ابھی کام نہیں کرتا، اس لیے عدیل کو واٹس ایپ کریں، وہ ادائیگی کا دوسرا طریقہ بتائیں گے۔" },
    fr: { "pay.btn": "PayPal", "rc.btn": "Envoyer le reçu", "ph.h": "Comment payer",
      "ph.1": "Touchez <strong>PayPal</strong> sur l'offre choisie. paypal.me/adeelrahman s'ouvre avec le montant déjà indiqué.",
      "ph.2": "Payez, puis faites une capture d'écran de votre reçu PayPal.",
      "ph.3": "Touchez <strong>Envoyer le reçu</strong> et joignez la capture dans WhatsApp. Adeel Ahmed Rahman confirmera et vous inscrira.",
      "ph.pk": "🇵🇰 Au Pakistan ? PayPal n'y fonctionne pas encore : écrivez à Adeel sur WhatsApp pour un autre moyen de paiement." },
    es: { "pay.btn": "PayPal", "rc.btn": "Enviar recibo", "ph.h": "Cómo pagar",
      "ph.1": "Pulsa <strong>PayPal</strong> en la oferta que quieras. Se abre paypal.me/adeelrahman con el importe ya puesto.",
      "ph.2": "Paga y haz una captura de pantalla de tu recibo de PayPal.",
      "ph.3": "Pulsa <strong>Enviar recibo</strong> y adjunta la captura en WhatsApp. Adeel Ahmed Rahman lo confirmará y te dará tu cita.",
      "ph.pk": "🇵🇰 ¿En Pakistán? PayPal todavía no funciona allí: escribe a Adeel por WhatsApp y te dará otra forma de pago." },
    ja: { "pay.btn": "PayPal", "rc.btn": "領収書を送る", "ph.h": "お支払い方法",
      "ph.1": "希望するプランの<strong>PayPal</strong>をタップ。金額入りでpaypal.me/adeelrahmanが開きます。",
      "ph.2": "支払い後、PayPalの領収書のスクリーンショットを撮ってください。",
      "ph.3": "<strong>領収書を送る</strong>をタップし、WhatsAppでスクリーンショットを添付。Adeel Ahmed Rahmanが確認して予約を確定します。",
      "ph.pk": "🇵🇰 パキスタンの方へ：PayPalはまだ利用できないため、WhatsAppでアディールに連絡してください。別の支払い方法をご案内します。" },
    zh: { "pay.btn": "PayPal", "rc.btn": "发送收据", "ph.h": "如何付款",
      "ph.1": "在你想要的方案上点击 <strong>PayPal</strong>，会打开已填好金额的 paypal.me/adeelrahman。",
      "ph.2": "付款后，截图保存 PayPal 收据。",
      "ph.3": "点击<strong>发送收据</strong>，在 WhatsApp 中附上截图。Adeel Ahmed Rahman 确认后会为你安排。",
      "ph.pk": "🇵🇰 在巴基斯坦？PayPal 目前在当地无法使用，请通过 WhatsApp 联系阿迪尔，他会提供其他付款方式。" },
    ko: { "pay.btn": "PayPal", "rc.btn": "영수증 보내기", "ph.h": "결제 방법",
      "ph.1": "원하는 상품에서 <strong>PayPal</strong>을 누르세요. 금액이 입력된 paypal.me/adeelrahman이 열립니다.",
      "ph.2": "결제 후 PayPal 영수증을 스크린샷으로 저장하세요.",
      "ph.3": "<strong>영수증 보내기</strong>를 누르고 WhatsApp에 스크린샷을 첨부하세요. Adeel Ahmed Rahman이 확인 후 예약해 드립니다.",
      "ph.pk": "🇵🇰 파키스탄에 계신가요? PayPal은 아직 그곳에서 사용할 수 없으니 WhatsApp으로 아딜에게 연락하시면 다른 결제 방법을 알려드립니다." }
  };
  Object.keys(MORE3).forEach(function (l) { Object.keys(MORE3[l]).forEach(function (k) { T[l][k] = MORE3[l][k]; }); });



  /* ============ Added: more offers, Islamic keys, Names of Allah, open-to-all ============ */
  var MORE4 = {
    ar: {
      open: "🤍 مفتوح للجميع من كل الخلفيات. التركيز على من هم مسلمون بالفعل، لذلك نتحدث بلغة القرآن والسنة.",
      "of.circle.t": "حلقة الذكر الأسبوعية", "of.circle.d": "ذكر ودعاء جماعي مباشر كل أسبوع، مع التسجيل إن فاتك. أسهل طريقة للبدء.",
      "of.ramadan.t": "برنامج العشر الأواخر", "of.ramadan.d": "خطة ليلة بليلة لليلة القدر: الأدعية والقرآن وقائمة دعائك الخاصة مع عديل.",
      "of.istikhara.t": "جلسة قرار الاستخارة", "of.istikhara.d": "قرار كبير؟ نصلي الاستخارة ونفكّر فيه معًا على طريقة السنة.",
      "of.couples.t": "برنامج البركة للأزواج والأسرة", "of.couples.d": "للأزواج والزوجات والأسر: الرحمة، والتواصل، وبيت يُذكر فيه الله.",
      "of.biz.t": "الرزق الحلال وبركة الأعمال", "of.biz.d": "للأطباء والمحامين وروّاد الأعمال والمهنيين: دخل حلال، وبركة، وقرارات مع الله.",
      "of.sponsor.t": "اكفل شخصًا (صدقة)", "of.sponsor.d": "ادفع ثمن جلسة وضوح لشخص لا يستطيع. يقدّمها عديل لأخ أو أخت محتاجين.",
      "of.vip.t": "إرشاد خاص VIP لمدة 90 يومًا", "of.vip.d": "ثلاثة أشهر مع عديل أحمد رحمان وجهًا لوجه: مكالمات أسبوعية، وتواصل يومي عبر واتساب، وخطة مبنية حولك.",
      "of.plat.t": "البلاتيني: مائدة الملك + الإرشاد الخاص", "of.plat.d": "عضوية مدى الحياة مع 90 يومًا من الإرشاد الخاص. كل شيء معًا، لمن قرّر أن يمضي حتى النهاية.",
      "keys.h": "المفاتيح الإسلامية <em>لما ترغب فيه</em>",
      "keys.lead": "كل ما يعلّمه عديل قائم على هذه. ليست تقنيات، بل عبادة، وكلها في القرآن والسنة.",
      "k.tawbah.t": "التوبة · الرجوع", "k.tawbah.d": "مهما ابتعدت، فالباب مفتوح. إن الله يحب التوابين (2:222).",
      "k.istighfar.t": "الاستغفار · طلب المغفرة", "k.istighfar.d": "استغفر يرسل السماء عليك مدرارًا ويمددك بأموال وبنين (71:10-12). يزيل ما يحجب دعاءك.",
      "k.shukr.t": "الشكر · الامتنان", "k.shukr.d": "«لئن شكرتم لأزيدنكم» (14:7).",
      "k.sabr.t": "الصبر", "k.sabr.d": "إن الله مع الصابرين (2:153). الصبر أن تبقى مع الله وأنت تنتظر.",
      "k.tawakkul.t": "التوكّل · الثقة", "k.tawakkul.d": "اعقلها وتوكّل. ومن يتوكل على الله فهو حسبه (65:3).",
      "k.yaqeen.t": "اليقين", "k.yaqeen.d": "ادعوا الله وأنتم موقنون بالإجابة (الترمذي).",
      "k.husn.t": "حسن الظن بالله", "k.husn.d": "«أنا عند ظن عبدي بي» (البخاري ومسلم).",
      "k.ikhlas.t": "الإخلاص", "k.ikhlas.d": "اعمل لله وحده، فتفقد آراء الناس سلطتها عليك.",
      "k.ihsan.t": "الإحسان", "k.ihsan.d": "أن تعبد الله كأنك تراه (مسلم).",
      "k.barakah.t": "البركة", "k.barakah.d": "القليل المبارك خير من الكثير بلا بركة. الحلال والشكر والعطاء يجلبونها.",
      "k.qadr.t": "القدر", "k.qadr.d": "لن يصيبك إلا ما كُتب لك، ولا يردّ القضاء إلا الدعاء (الترمذي).",
      "k.sadaqah.t": "الصدقة", "k.sadaqah.d": "ما نقصت صدقة من مال (مسلم).",
      "names.h": "ادعُه <em>بأسمائه</em>", "names.lead": "اختر الاسم المناسب لما تسأله، وابدأ به دعاءك.",
      "names.ayah": "«ولله الأسماء الحسنى فادعوه بها»",
      "n.razzaq": "الرزّاق: للرزق والعمل والديون", "n.wadud": "الودود: للحب والزواج والأسرة", "n.shafi": "الشافي: للجسد والعقل والقلب", "n.fattah": "الفتّاح: للأبواب المغلقة والبدايات الجديدة",
      "n.mujib": "المجيب: لكل دعاء", "n.wahhab": "الوهّاب: للذرية والنعم", "n.hafiz": "الحفيظ: من العين والحسد والشيطان", "n.jabbar": "الجبّار: لجبر القلوب المكسورة"
    },
    ur: {
      open: "🤍 ہر پس منظر کے ہر شخص کے لیے کھلا ہے۔ توجہ اُن پر ہے جو پہلے سے مسلمان ہیں، اس لیے ہم قرآن و سنت کی زبان میں بات کرتے ہیں۔",
      "of.circle.t": "ہفتہ وار ذکر کا حلقہ", "of.circle.d": "ہر ہفتے براہِ راست اجتماعی ذکر اور دعا، اگر رہ جائے تو ریکارڈنگ بھی۔ شروع کرنے کا سب سے آسان طریقہ۔",
      "of.ramadan.t": "آخری عشرہ پروگرام", "of.ramadan.d": "لیلۃ القدر کے لیے رات بہ رات منصوبہ: دعائیں، قرآن اور عدیل کے ساتھ بنی آپ کی اپنی دعاؤں کی فہرست۔",
      "of.istikhara.t": "استخارہ فیصلہ کال", "of.istikhara.d": "کوئی بڑا فیصلہ؟ ہم مل کر استخارہ کریں گے اور سنت کے مطابق سوچیں گے۔",
      "of.couples.t": "میاں بیوی اور خاندان کی برکت کا پروگرام", "of.couples.d": "شوہروں، بیویوں اور خاندانوں کے لیے: رحمت، بات چیت اور ایسا گھر جہاں اللہ کو یاد کیا جائے۔",
      "of.biz.t": "حلال رزق اور کاروبار میں برکت", "of.biz.d": "ڈاکٹرز، وکلا، کاروباری اور پروفیشنلز کے لیے: حلال آمدن، برکت اور اللہ کے ساتھ فیصلے۔",
      "of.sponsor.t": "کسی کی کفالت کریں (صدقہ)", "of.sponsor.d": "کسی ایسے شخص کے کلیرٹی سیشن کی ادائیگی کریں جو استطاعت نہیں رکھتا۔ عدیل یہ کسی ضرورت مند بھائی یا بہن کو دیں گے۔",
      "of.vip.t": "وی آئی پی 90 روزہ نجی رہنمائی", "of.vip.d": "تین ماہ عدیل احمد رحمان کے ساتھ ون آن ون: ہفتہ وار کالز، روزانہ واٹس ایپ رابطہ اور آپ کے مطابق بنا منصوبہ۔",
      "of.plat.t": "پلاٹینم: کنگز ٹیبل + وی آئی پی رہنمائی", "of.plat.d": "تاحیات ممبرشپ کے ساتھ 90 دن کی نجی رہنمائی۔ سب کچھ ایک ساتھ، اُس کے لیے جو پوری طرح تیار ہے۔",
      "keys.h": "آپ کی چاہت کی <em>اسلامی کنجیاں</em>",
      "keys.lead": "عدیل جو کچھ سکھاتے ہیں وہ انہی پر قائم ہے۔ یہ تکنیکیں نہیں، عبادت ہیں، اور سب قرآن و سنت میں موجود ہیں۔",
      "k.tawbah.t": "توبہ · لوٹ آنا", "k.tawbah.d": "آپ جتنا بھی دور چلے گئے ہوں، دروازہ کھلا ہے۔ اللہ توبہ کرنے والوں سے محبت کرتا ہے (2:222)۔",
      "k.istighfar.t": "استغفار · معافی مانگنا", "k.istighfar.d": "معافی مانگیں، وہ بارش، مال اور اولاد عطا کرتا ہے (71:10-12)۔ یہ دعا کی رکاوٹیں دور کرتا ہے۔",
      "k.shukr.t": "شکر", "k.shukr.d": "”اگر تم شکر کرو گے تو میں تمہیں ضرور زیادہ دوں گا“ (14:7)۔",
      "k.sabr.t": "صبر", "k.sabr.d": "اللہ صبر کرنے والوں کے ساتھ ہے (2:153)۔ صبر یہ ہے کہ انتظار کے دوران اللہ کے ساتھ رہیں۔",
      "k.tawakkul.t": "توکل · بھروسا", "k.tawakkul.d": "اونٹ باندھیں، پھر اللہ پر بھروسا کریں۔ جو اللہ پر بھروسا کرے، وہ اس کے لیے کافی ہے (65:3)۔",
      "k.yaqeen.t": "یقین", "k.yaqeen.d": "قبولیت کے یقین کے ساتھ دعا کریں (ترمذی)۔",
      "k.husn.t": "حسنِ ظن · اللہ سے اچھا گمان", "k.husn.d": "”میں اپنے بندے کے گمان کے مطابق ہوں“ (بخاری و مسلم)۔",
      "k.ikhlas.t": "اخلاص", "k.ikhlas.d": "صرف اللہ کے لیے کریں، لوگوں کی رائے کی گرفت ختم ہو جائے گی۔",
      "k.ihsan.t": "احسان", "k.ihsan.d": "اللہ کی عبادت ایسے کریں گویا آپ اسے دیکھ رہے ہیں (مسلم)۔",
      "k.barakah.t": "برکت", "k.barakah.d": "برکت والا تھوڑا، بے برکت زیادہ سے بہتر ہے۔ حلال، شکر اور دینا اسے لاتے ہیں۔",
      "k.qadr.t": "تقدیر", "k.qadr.d": "آپ تک وہی پہنچتا ہے جو لکھا ہے، اور تقدیر کو صرف دعا بدلتی ہے (ترمذی)۔",
      "k.sadaqah.t": "صدقہ", "k.sadaqah.d": "صدقہ مال کم نہیں کرتا (مسلم)۔",
      "names.h": "اُسے <em>اُس کے ناموں</em> سے پکاریں", "names.lead": "جو مانگ رہے ہیں اُس کے مطابق نام چنیں، اور دعا اسی سے شروع کریں۔",
      "names.ayah": "”اور اللہ کے اچھے اچھے نام ہیں، تو اسے انہی سے پکارو۔“",
      "n.razzaq": "رزق دینے والا: رزق، کام اور قرض کے لیے", "n.wadud": "محبت کرنے والا: محبت، شادی اور خاندان کے لیے", "n.shafi": "شفا دینے والا: جسم، ذہن اور دل کے لیے", "n.fattah": "کھولنے والا: بند دروازوں اور نئی شروعات کے لیے",
      "n.mujib": "قبول کرنے والا: ہر دعا کے لیے", "n.wahhab": "عطا کرنے والا: اولاد اور نعمتوں کے لیے", "n.hafiz": "حفاظت کرنے والا: نظر، حسد اور شیطان سے", "n.jabbar": "جوڑنے والا: ٹوٹے دلوں کے لیے"
    },
    fr: {
      open: "🤍 Ouvert à tous, de tous horizons. L'accent est mis sur ceux qui sont déjà musulmans, donc nous parlons le langage du Coran et de la Sunna.",
      "of.circle.t": "Cercle de dhikr hebdomadaire", "of.circle.d": "Dhikr et dua en groupe, en direct chaque semaine, avec l'enregistrement si vous le manquez. La façon la plus simple de commencer.",
      "of.ramadan.t": "Programme des 10 dernières nuits", "of.ramadan.d": "Un plan nuit par nuit pour Laylat al-Qadr : les duas, le Coran et votre liste personnelle de duas, préparée avec Adeel.",
      "of.istikhara.t": "Appel de décision istikhara", "of.istikhara.d": "Une grande décision ? Nous prions l'istikhara et y réfléchissons ensemble, selon la Sunna.",
      "of.couples.t": "Programme Barakah couples et famille", "of.couples.d": "Pour les maris, les épouses et les familles : la miséricorde, la communication et un foyer où l'on se souvient d'Allah.",
      "of.biz.t": "Subsistance halal et barakah dans les affaires", "of.biz.d": "Pour médecins, avocats, entrepreneurs et professionnels : revenus halal, barakah et décisions prises avec Allah.",
      "of.sponsor.t": "Parrainer quelqu'un (sadaqah)", "of.sponsor.d": "Offrez une séance de clarté à quelqu'un qui n'en a pas les moyens. Adeel la donne à un frère ou une sœur dans le besoin.",
      "of.vip.t": "Mentorat privé VIP de 90 jours", "of.vip.d": "Trois mois en tête-à-tête avec Adeel Ahmed Rahman : appels hebdomadaires, accès WhatsApp quotidien et un plan construit pour vous.",
      "of.plat.t": "Platine : Table du Roi + mentorat VIP", "of.plat.d": "L'adhésion à vie plus 90 jours de mentorat privé. Tout, ensemble, pour qui s'engage pleinement.",
      "keys.h": "Les clés islamiques de <em>ce que vous désirez</em>",
      "keys.lead": "Tout ce qu'enseigne Adeel repose sur elles. Ce ne sont pas des techniques, c'est de l'adoration, et toutes se trouvent dans le Coran et la Sunna.",
      "k.tawbah.t": "Tawbah · le retour", "k.tawbah.d": "Aussi loin que vous soyez allé, la porte est ouverte. Allah aime ceux qui reviennent à Lui (2:222).",
      "k.istighfar.t": "Istighfar · demander pardon", "k.istighfar.d": "Demandez pardon, et Il envoie la pluie, les biens et les enfants (71:10-12). Cela lève ce qui bloque votre dua.",
      "k.shukr.t": "Shukr · la gratitude", "k.shukr.d": "« Si vous êtes reconnaissants, Je vous donnerai davantage » (14:7).",
      "k.sabr.t": "Sabr · la patience", "k.sabr.d": "Allah est avec les patients (2:153). La patience, c'est rester avec Allah pendant l'attente.",
      "k.tawakkul.t": "Tawakkul · la confiance", "k.tawakkul.d": "Attache ton chameau, puis place ta confiance en Allah. Il suffit à qui s'en remet à Lui (65:3).",
      "k.yaqeen.t": "Yaqin · la certitude", "k.yaqeen.d": "Invoquez Allah en étant certains de la réponse (Tirmidhi).",
      "k.husn.t": "Husn al-dhann · bien penser d'Allah", "k.husn.d": "« Je suis tel que Mon serviteur pense de Moi » (Bukhari et Muslim).",
      "k.ikhlas.t": "Ikhlas · la sincérité", "k.ikhlas.d": "Agissez pour Allah seul, et l'opinion des gens perd son emprise.",
      "k.ihsan.t": "Ihsan · l'excellence", "k.ihsan.d": "Adorer Allah comme si vous Le voyiez (Muslim).",
      "k.barakah.t": "Barakah · la bénédiction", "k.barakah.d": "Peu avec barakah vaut mieux que beaucoup sans. Le halal, la gratitude et le don l'attirent.",
      "k.qadr.t": "Qadr · le décret", "k.qadr.d": "Rien ne vous atteint qui n'ait été écrit, et seule la dua repousse le décret (Tirmidhi).",
      "k.sadaqah.t": "Sadaqah · l'aumône", "k.sadaqah.d": "L'aumône ne diminue jamais les biens (Muslim).",
      "names.h": "Invoquez-Le par <em>Ses Noms</em>", "names.lead": "Choisissez le Nom qui correspond à votre demande, et commencez votre dua par lui.",
      "names.ayah": "« C'est à Allah qu'appartiennent les plus beaux noms : invoquez-Le par eux. »",
      "n.razzaq": "Celui qui pourvoit : pour la subsistance, le travail et les dettes", "n.wadud": "Le Très-Aimant : pour l'amour, le mariage et la famille", "n.shafi": "Celui qui guérit : pour le corps, l'esprit et le cœur", "n.fattah": "Celui qui ouvre : pour les portes fermées et les nouveaux départs",
      "n.mujib": "Celui qui répond : pour chaque dua", "n.wahhab": "Le Donateur : pour les enfants et les bienfaits", "n.hafiz": "Le Protecteur : contre le mauvais œil, l'envie et Shaytan", "n.jabbar": "Celui qui répare : pour les cœurs brisés"
    },
    es: {
      open: "🤍 Abierto a todos, de cualquier origen. El enfoque está en quienes ya son musulmanes, por eso hablamos el lenguaje del Corán y la Sunna.",
      "of.circle.t": "Círculo semanal de dhikr", "of.circle.d": "Dhikr y dua en grupo, en directo cada semana, con la grabación si te lo pierdes. La forma más fácil de empezar.",
      "of.ramadan.t": "Programa de las últimas 10 noches", "of.ramadan.d": "Un plan noche a noche para Laylat al-Qadr: las duas, el Corán y tu lista personal de duas, preparada con Adeel.",
      "of.istikhara.t": "Llamada de decisión istijara", "of.istikhara.d": "¿Una gran decisión? Rezamos la istijara y la pensamos juntos, según la Sunna.",
      "of.couples.t": "Programa Barakah para parejas y familias", "of.couples.d": "Para esposos, esposas y familias: misericordia, comunicación y un hogar donde se recuerda a Allah.",
      "of.biz.t": "Sustento halal y barakah en los negocios", "of.biz.d": "Para médicos, abogados, emprendedores y profesionales: ingresos halal, barakah y decisiones tomadas con Allah.",
      "of.sponsor.t": "Patrocina a alguien (sadaqa)", "of.sponsor.d": "Paga una sesión de claridad para alguien que no puede costearla. Adeel la regala a un hermano o hermana necesitado.",
      "of.vip.t": "Mentoría privada VIP de 90 días", "of.vip.d": "Tres meses a solas con Adeel Ahmed Rahman: llamadas semanales, acceso diario por WhatsApp y un plan hecho para ti.",
      "of.plat.t": "Platino: Mesa del Rey + mentoría VIP", "of.plat.d": "Membresía de por vida más 90 días de mentoría privada. Todo junto, para quien va con todo.",
      "keys.h": "Las claves islámicas de <em>lo que deseas</em>",
      "keys.lead": "Todo lo que enseña Adeel descansa en ellas. No son técnicas: son adoración, y todas están en el Corán y la Sunna.",
      "k.tawbah.t": "Tawba · volver", "k.tawbah.d": "Por lejos que hayas ido, la puerta está abierta. Allah ama a los que vuelven a Él (2:222).",
      "k.istighfar.t": "Istigfar · pedir perdón", "k.istighfar.d": "Pide perdón y Él envía lluvia, riqueza e hijos (71:10-12). Despeja lo que bloquea tu dua.",
      "k.shukr.t": "Shukr · gratitud", "k.shukr.d": "«Si sois agradecidos, os daré más» (14:7).",
      "k.sabr.t": "Sabr · paciencia", "k.sabr.d": "Allah está con los pacientes (2:153). La paciencia es quedarse con Allah mientras esperas.",
      "k.tawakkul.t": "Tawakkul · confianza", "k.tawakkul.d": "Ata tu camello y confía en Allah. A quien se encomienda a Él, Él le basta (65:3).",
      "k.yaqeen.t": "Yaqin · certeza", "k.yaqeen.d": "Pide estando seguro de la respuesta (Tirmidhi).",
      "k.husn.t": "Husn al-dhann · pensar bien de Allah", "k.husn.d": "«Yo soy como Mi siervo piensa de Mí» (Bujari y Muslim).",
      "k.ikhlas.t": "Ijlas · sinceridad", "k.ikhlas.d": "Hazlo solo por Allah, y la opinión de la gente pierde su poder.",
      "k.ihsan.t": "Ihsan · excelencia", "k.ihsan.d": "Adorar a Allah como si Lo vieras (Muslim).",
      "k.barakah.t": "Baraka · bendición", "k.barakah.d": "Poco con baraka vale más que mucho sin ella. Lo halal, la gratitud y dar la atraen.",
      "k.qadr.t": "Qadar · el decreto", "k.qadr.d": "Nada te alcanza que no estuviera escrito, y solo la dua hace retroceder el decreto (Tirmidhi).",
      "k.sadaqah.t": "Sadaqa · caridad", "k.sadaqah.d": "La caridad nunca disminuye la riqueza (Muslim).",
      "names.h": "Invócale por <em>Sus Nombres</em>", "names.lead": "Elige el Nombre que corresponde a lo que pides y empieza tu dua con él.",
      "names.ayah": "«A Allah pertenecen los nombres más hermosos, así que invocadle por ellos.»",
      "n.razzaq": "El Proveedor: para el sustento, el trabajo y las deudas", "n.wadud": "El Amoroso: para el amor, el matrimonio y la familia", "n.shafi": "El Sanador: para el cuerpo, la mente y el corazón", "n.fattah": "El que Abre: para puertas cerradas y nuevos comienzos",
      "n.mujib": "El que Responde: para cada dua", "n.wahhab": "El Dador: para los hijos y las bendiciones", "n.hafiz": "El Protector: del mal de ojo, la envidia y Shaytán", "n.jabbar": "El que Repara: para los corazones rotos"
    },
    ja: {
      open: "🤍 どなたにも開かれています。重点はすでにムスリムである方々に置いているため、クルアーンとスンナの言葉で語ります。",
      "of.circle.t": "毎週のズィクル・サークル", "of.circle.d": "毎週ライブで集団のズィクルとドゥアー。見逃しても録画あり。いちばん気軽な始め方です。",
      "of.ramadan.t": "最後の10夜プログラム", "of.ramadan.d": "ライラトゥル・カドルのための一夜ごとのプラン：ドゥアー、クルアーン、アディールと作るあなた専用のドゥアーリスト。",
      "of.istikhara.t": "イスティハーラ決断コール", "of.istikhara.d": "大きな決断がありますか？一緒にイスティハーラを行い、スンナに沿って考えます。",
      "of.couples.t": "夫婦・家族のバラカ・プログラム", "of.couples.d": "夫、妻、家族のために：慈しみ、対話、そしてアッラーが念じられる家庭。",
      "of.biz.t": "ハラールな糧とビジネスのバラカ", "of.biz.d": "医師、弁護士、起業家、専門職の方へ：ハラールな収入、バラカ、アッラーと共に下す決断。",
      "of.sponsor.t": "誰かを支援する（サダカ）", "of.sponsor.d": "費用を払えない方のためにクラリティ・セッションを贈ります。アディールが困っている兄弟姉妹に届けます。",
      "of.vip.t": "VIP 90日間プライベート・メンタリング", "of.vip.d": "Adeel Ahmed Rahmanと3か月の個別指導：毎週の通話、毎日のWhatsApp、あなた専用のプラン。",
      "of.plat.t": "プラチナ：王の食卓＋VIPメンタリング", "of.plat.d": "生涯メンバーシップと90日間のプライベート指導。全力で臨む方のための、すべてのセット。",
      "keys.h": "<em>望むもの</em>へのイスラームの鍵",
      "keys.lead": "アディールの教えはすべてこれらの上に成り立っています。テクニックではなく崇拝であり、すべてクルアーンとスンナにあります。",
      "k.tawbah.t": "タウバ · 立ち返り", "k.tawbah.d": "どれほど遠くへ行っても扉は開いています。アッラーは悔悟する者を愛されます（2:222）。",
      "k.istighfar.t": "イスティグファール · 赦しを請う", "k.istighfar.d": "赦しを請えば、雨と富と子を授けてくださいます（71:10-12）。ドゥアーを妨げるものを取り除きます。",
      "k.shukr.t": "シュクル · 感謝", "k.shukr.d": "「感謝すれば、われは必ず増やそう」（14:7）。",
      "k.sabr.t": "サブル · 忍耐", "k.sabr.d": "アッラーは忍耐する者と共におられます（2:153）。忍耐とは、待つ間もアッラーと共にいること。",
      "k.tawakkul.t": "タワックル · 信頼", "k.tawakkul.d": "ラクダをつなぎ、そしてアッラーに委ねよ。アッラーに頼る者には、かれで十分です（65:3）。",
      "k.yaqeen.t": "ヤキーン · 確信", "k.yaqeen.d": "応えられると確信して願いなさい（ティルミズィー）。",
      "k.husn.t": "フスヌッザン · アッラーを良く思う", "k.husn.d": "「われは、わがしもべがわれをどう思うかのとおりである」（ブハーリー、ムスリム）。",
      "k.ikhlas.t": "イフラース · 誠実さ", "k.ikhlas.d": "アッラーのためだけに行えば、人の意見に縛られなくなります。",
      "k.ihsan.t": "イフサーン · 至善", "k.ihsan.d": "アッラーを見ているかのように崇拝すること（ムスリム）。",
      "k.barakah.t": "バラカ · 祝福", "k.barakah.d": "バラカのある少しは、バラカのない多くに勝ります。ハラール、感謝、施しがそれを招きます。",
      "k.qadr.t": "カダル · 定め", "k.qadr.d": "書かれていないものはあなたに届かず、定めを退けるのはドゥアーだけです（ティルミズィー）。",
      "k.sadaqah.t": "サダカ · 施し", "k.sadaqah.d": "施しは決して財を減らさない（ムスリム）。",
      "names.h": "<em>御名</em>によって呼びかける", "names.lead": "願うことに合った御名を選び、それでドゥアーを始めましょう。",
      "names.ayah": "「アッラーには最も美しい御名がある。それでかれに祈りなさい。」",
      "n.razzaq": "糧を与える御方：糧、仕事、借金のために", "n.wadud": "慈愛深き御方：愛、結婚、家族のために", "n.shafi": "癒す御方：身体、心、魂のために", "n.fattah": "開く御方：閉ざされた扉と新しい始まりのために",
      "n.mujib": "応える御方：すべてのドゥアーのために", "n.wahhab": "授ける御方：子と恵みのために", "n.hafiz": "守る御方：邪視、妬み、シャイターンから", "n.jabbar": "繕う御方：傷ついた心のために"
    },
    zh: {
      open: "🤍 向所有背景的人开放。重点面向已经是穆斯林的人，因此我们用古兰经和圣行的语言交流。",
      "of.circle.t": "每周记主圈", "of.circle.d": "每周直播的集体记主和祈祷，错过也有回放。最轻松的开始方式。",
      "of.ramadan.t": "斋月最后十夜计划", "of.ramadan.d": "为盖德尔夜准备的逐夜计划：祈祷词、古兰经，以及与阿迪尔一起制定的个人祈祷清单。",
      "of.istikhara.t": "求择决策通话", "of.istikhara.d": "面临重大决定？我们一起做求择礼拜，按照圣行来思考。",
      "of.couples.t": "夫妻与家庭福泽计划", "of.couples.d": "为丈夫、妻子和家庭：慈爱、沟通，以及一个记念安拉的家。",
      "of.biz.t": "清真给养与事业福泽", "of.biz.d": "为医生、律师、创业者和专业人士：清真收入、福泽，以及与安拉同在的决策。",
      "of.sponsor.t": "资助他人（施舍）", "of.sponsor.d": "为负担不起的人支付一次清晰课程。阿迪尔会将其送给有需要的兄弟姐妹。",
      "of.vip.t": "VIP 90 天私人辅导", "of.vip.d": "与 Adeel Ahmed Rahman 一对一三个月：每周通话、每日 WhatsApp 联系，以及为你量身定制的计划。",
      "of.plat.t": "白金：国王之席 + VIP 辅导", "of.plat.d": "终身会员加 90 天私人辅导。为全力以赴的人准备的一切。",
      "keys.h": "通往<em>你所渴望之物</em>的伊斯兰钥匙",
      "keys.lead": "阿迪尔所教的一切都建立在这些之上。它们不是技巧，而是功修，全部来自古兰经和圣行。",
      "k.tawbah.t": "讨白 · 回归", "k.tawbah.d": "无论你走了多远，门都是开着的。安拉喜爱悔过的人（2:222）。",
      "k.istighfar.t": "求饶恕", "k.istighfar.d": "求饶恕，祂会降下甘霖、赐予财富和子女（71:10-12）。它清除阻碍你祈祷的东西。",
      "k.shukr.t": "感恩", "k.shukr.d": "“如果你们感谢，我必定对你们恩上加恩”（14:7）。",
      "k.sabr.t": "忍耐", "k.sabr.d": "安拉与忍耐者同在（2:153）。忍耐就是在等待时与安拉同在。",
      "k.tawakkul.t": "托靠 · 信赖", "k.tawakkul.d": "先拴好你的骆驼，再托靠安拉。谁托靠安拉，祂就足够他了（65:3）。",
      "k.yaqeen.t": "确信", "k.yaqeen.d": "要确信会得到应答时去祈求（提尔密济）。",
      "k.husn.t": "对安拉的美好揣测", "k.husn.d": "“我依照我的仆人对我的看法对待他”（布哈里、穆斯林）。",
      "k.ikhlas.t": "虔诚", "k.ikhlas.d": "只为安拉而做，别人的看法就失去了束缚你的力量。",
      "k.ihsan.t": "至善", "k.ihsan.d": "崇拜安拉，犹如你看见祂（穆斯林）。",
      "k.barakah.t": "福泽", "k.barakah.d": "有福泽的少胜过没有福泽的多。清真、感恩和施予能招来福泽。",
      "k.qadr.t": "前定", "k.qadr.d": "未被写下的不会降临于你，唯有祈祷能改变前定（提尔密济）。",
      "k.sadaqah.t": "施舍", "k.sadaqah.d": "施舍从不减少财富（穆斯林）。",
      "names.h": "以<em>祂的尊名</em>呼求祂", "names.lead": "选择与你所求相符的尊名，并以它开始你的祈祷。",
      "names.ayah": "“安拉有许多最美的名号，故你们要用那些名号祈祷祂。”",
      "n.razzaq": "供给者：为给养、工作和债务", "n.wadud": "博爱者：为爱情、婚姻和家庭", "n.shafi": "医治者：为身体、心智和心灵", "n.fattah": "开启者：为关闭的门和新的开始",
      "n.mujib": "应答者：为每一个祈祷", "n.wahhab": "厚赐者：为子女和恩典", "n.hafiz": "保护者：远离毒眼、嫉妒和恶魔", "n.jabbar": "修复者：为破碎的心"
    },
    ko: {
      open: "🤍 모든 배경의 모든 분께 열려 있습니다. 이미 무슬림인 분들에게 초점을 맞추기 때문에 꾸란과 순나의 언어로 이야기합니다.",
      "of.circle.t": "주간 디크르 서클", "of.circle.d": "매주 라이브로 함께하는 디크르와 두아. 놓쳐도 녹화본이 있습니다. 가장 쉬운 시작 방법입니다.",
      "of.ramadan.t": "마지막 10일 밤 프로그램", "of.ramadan.d": "라일라툴 까드르를 위한 밤별 계획: 두아, 꾸란, 아딜과 함께 만드는 나만의 두아 목록.",
      "of.istikhara.t": "이스티카라 결정 통화", "of.istikhara.d": "큰 결정이 있나요? 함께 이스티카라를 드리고 순나의 방식으로 생각해 봅니다.",
      "of.couples.t": "부부·가족 바라카 프로그램", "of.couples.d": "남편, 아내, 가족을 위해: 자비, 소통, 그리고 알라를 기억하는 가정.",
      "of.biz.t": "할랄 양식과 사업의 바라카", "of.biz.d": "의사, 변호사, 창업가, 전문직을 위해: 할랄 수입, 바라카, 알라와 함께하는 결정.",
      "of.sponsor.t": "누군가를 후원하기 (사다까)", "of.sponsor.d": "형편이 어려운 분을 위해 클래리티 세션 비용을 내 주세요. 아딜이 도움이 필요한 형제자매에게 전합니다.",
      "of.vip.t": "VIP 90일 개인 멘토링", "of.vip.d": "Adeel Ahmed Rahman과 석 달간 일대일: 매주 통화, 매일 WhatsApp 연락, 당신에게 맞춘 계획.",
      "of.plat.t": "플래티넘: 왕의 식탁 + VIP 멘토링", "of.plat.d": "평생 멤버십과 90일 개인 멘토링. 모든 것을 걸 준비가 된 분을 위한 전부.",
      "keys.h": "<em>원하는 것</em>에 이르는 이슬람의 열쇠",
      "keys.lead": "아딜이 가르치는 모든 것은 이것들 위에 서 있습니다. 기법이 아니라 예배이며, 모두 꾸란과 순나에 있습니다.",
      "k.tawbah.t": "타우바 · 돌아옴", "k.tawbah.d": "아무리 멀리 갔어도 문은 열려 있습니다. 알라는 회개하는 자를 사랑하십니다 (2:222).",
      "k.istighfar.t": "이스티그파르 · 용서를 구함", "k.istighfar.d": "용서를 구하면 비와 재물과 자녀를 주십니다 (71:10-12). 두아를 막는 것을 걷어냅니다.",
      "k.shukr.t": "슈크르 · 감사", "k.shukr.d": "“너희가 감사하면 내가 반드시 더해 주리라” (14:7).",
      "k.sabr.t": "사브르 · 인내", "k.sabr.d": "알라는 인내하는 자와 함께 계십니다 (2:153). 인내란 기다리는 동안 알라와 함께 머무는 것입니다.",
      "k.tawakkul.t": "타왁쿨 · 신뢰", "k.tawakkul.d": "낙타를 매고 알라를 신뢰하라. 알라께 의지하는 자에게는 그분으로 충분하다 (65:3).",
      "k.yaqeen.t": "야낀 · 확신", "k.yaqeen.d": "응답을 확신하며 구하라 (티르미디).",
      "k.husn.t": "후스눗 잔 · 알라를 좋게 생각함", "k.husn.d": "“나는 나의 종이 나를 생각하는 대로 있다” (부카리, 무슬림).",
      "k.ikhlas.t": "이클라스 · 진실함", "k.ikhlas.d": "오직 알라를 위해 하면, 사람들의 의견이 당신을 붙잡지 못합니다.",
      "k.ihsan.t": "이흐산 · 탁월함", "k.ihsan.d": "알라를 보고 있는 것처럼 예배하는 것 (무슬림).",
      "k.barakah.t": "바라카 · 축복", "k.barakah.d": "바라카가 있는 적은 것이 바라카 없는 많은 것보다 낫습니다. 할랄, 감사, 베풂이 그것을 부릅니다.",
      "k.qadr.t": "까다르 · 정해진 운명", "k.qadr.d": "기록되지 않은 것은 당신에게 닿지 않으며, 운명을 되돌리는 것은 오직 두아뿐입니다 (티르미디).",
      "k.sadaqah.t": "사다까 · 자선", "k.sadaqah.d": "자선은 결코 재물을 줄이지 않는다 (무슬림).",
      "names.h": "<em>그분의 이름</em>으로 부르세요", "names.lead": "구하는 것에 맞는 이름을 골라 그 이름으로 두아를 시작하세요.",
      "names.ayah": "“알라께는 가장 아름다운 이름들이 있으니, 그 이름으로 그분께 기도하라.”",
      "n.razzaq": "양식을 주시는 분: 양식, 일, 빚을 위해", "n.wadud": "사랑이 많으신 분: 사랑, 결혼, 가족을 위해", "n.shafi": "치유하시는 분: 몸, 마음, 영혼을 위해", "n.fattah": "여시는 분: 닫힌 문과 새로운 시작을 위해",
      "n.mujib": "응답하시는 분: 모든 두아를 위해", "n.wahhab": "베푸시는 분: 자녀와 축복을 위해", "n.hafiz": "보호하시는 분: 악마의 눈, 시기, 샤이탄으로부터", "n.jabbar": "고치시는 분: 상한 마음을 위해"
    }
  };
  Object.keys(MORE4).forEach(function (l) { Object.keys(MORE4[l]).forEach(function (k) { T[l][k] = MORE4[l][k]; }); });



  /* ============ Added: hero CTAs, trust, free plan, quiz, tiers, filters, Ramadan, FAQ ============ */
  var MORE5 = {
    ar: {
      "hero.c2": "اعرف طريقك · 60 ثانية", "tr.1": "القرآن والسنة فقط", "tr.2": "عديل يردّ بنفسه", "tr.3": "طلبات الدعاء مجانية دائمًا", "tr.4": "8 لغات",
      "gift.k": "هدية مجانية · بلا دفع", "gift.h": "<em>خطة الدعاء لسبعة أيام</em> مجانًا", "gift.p": "تمرين قصير كل يوم لسبعة أيام: الذكر، وآداب الدعاء كما علّمها النبي ﷺ، وأوقات الإجابة. يرسلها لك عديل أحمد رحمان على واتساب.", "gift.btn": "أرسل لي الخطة المجانية",
      "path.h": "اعرف طريقك <em>في 60 ثانية</em>", "path.lead": "سؤالان، وسترى من أين تبدأ بالضبط.", "path.q1": "1. ما أكثر ما تسأل الله عنه الآن؟",
      "path.o.marriage": "الزواج والأسرة", "path.o.rizq": "الرزق والعمل", "path.o.healing": "الشفاء والحماية", "path.o.close": "القرب من الله", "path.o.decide": "قرار كبير",
      "path.q2": "2. ما مقدار الدعم الذي تريده؟", "path.s.start": "أبدأ بهدوء", "path.s.few": "جلسة أو اثنتان", "path.s.program": "برنامج كامل", "path.s.life": "بكل ما أملك، مدى الحياة",
      "path.res": "طريقك", "path.again": "ابدأ من جديد",
      "tier.1k": "البداية", "tier.2k": "التحوّل", "tier.3k": "بكل ما أملك", "tier.rec": "موصى به",
      "tier.1a": "45 دقيقة وجهًا لوجه عبر فيديو واتساب", "tier.1b": "اكتشف ما ترغب فيه حقًا", "tier.1c": "دعاؤك المناسب وخطواتك التالية",
      "tier.2a": "الدورتان وكل درس قادم، مدى الحياة", "tier.2b": "الحلقة الخاصة ومكالمات شهرية مباشرة", "tier.2c": "ترحيب شخصي من عديل على واتساب", "tier.2d": "الأنا والشفاء والحماية وطريقة 622",
      "tier.3a": "مكالمات أسبوعية خاصة لمدة 90 يومًا", "tier.3b": "تواصل يومي مع عديل على واتساب", "tier.3c": "خطة مبنية بالكامل حولك",
      "all.h": "كل البرامج", "f.all": "الكل", "f.free": "مجاني", "f.start": "بداية صغيرة", "f.prog": "برامج", "f.vip": "VIP ومدى الحياة",
      "ram.h": "رمضان قادم", "ram.p": "يُتوقع أن يبدأ نحو 8 فبراير 2027 بحسب رؤية الهلال. جهّز أدعيتك لليلة القدر مع برنامج العشر الأواخر (77.77$).", "ram.d": "يومًا متبقيًا",
      "faq.h": "أسئلة <em>وأجوبتها</em>",
      "faq.1q": "هل 1,111$ مبلغ كبير؟", "faq.1a": "يُدفع مرة واحدة مدى الحياة ويشمل كل درس قادم. وإن لم يكن مناسبًا لك بعد، فابدأ بخطة الدعاء المجانية أو حلقة الذكر الأسبوعية بـ11.11$ شهريًا.",
      "faq.2q": "هل هذا إسلامي أم من «العصر الجديد»؟", "faq.2a": "إسلامي. عديل مسلم سنّي، لا أكثر ولا أقل. التجلّي هنا يعني الدعاء، وكل تمرين من القرآن والسنة.",
      "faq.3q": "أنا في باكستان. كيف أدفع؟", "faq.3a": "باي بال لا يعمل في باكستان بعد، فراسل عديل على واتساب وسيرسل لك طريقة دفع أخرى.",
      "faq.4q": "متى سأرى النتائج؟", "faq.4a": "كثيرون يشعرون بالخفة خلال أيام من بدء الذكر. لكن النتائج تختلف، وكل نتيجة من الله. علينا الدعاء والسعي.",
      "faq.5q": "أنا مشغول. هل يناسب هذا حياتي؟", "faq.5a": "نعم. التمرين اليومي نحو 15 دقيقة، والدروس قصيرة، ويمكنك السؤال في أي وقت في المنتدى.",
      "faq.6q": "هل يغني هذا عن العلاج النفسي أو الطبي؟", "faq.6a": "لا. التدريب يكمّل طبيبك أو معالجك ولا يحلّ محلهما. في الأزمات اتصل أو أرسل رسالة إلى 988 أو رقم الطوارئ المحلي."
    },
    ur: {
      "hero.c2": "اپنا راستہ جانیں · 60 سیکنڈ", "tr.1": "صرف قرآن و سنت", "tr.2": "عدیل خود جواب دیتے ہیں", "tr.3": "دعا کی درخواست ہمیشہ مفت", "tr.4": "8 زبانیں",
      "gift.k": "مفت تحفہ · کوئی ادائیگی نہیں", "gift.h": "آپ کا مفت <em>7 روزہ دعا پلان</em>", "gift.p": "سات دن تک روزانہ ایک مختصر عمل: ذکر، نبی ﷺ کے بتائے دعا کے آداب، اور قبولیت کے اوقات۔ عدیل احمد رحمان آپ کو واٹس ایپ پر بھیجیں گے۔", "gift.btn": "مجھے مفت پلان بھیجیں",
      "path.h": "<em>60 سیکنڈ میں</em> اپنا راستہ جانیں", "path.lead": "دو سوال، اور آپ دیکھ لیں گے کہ کہاں سے شروع کرنا ہے۔", "path.q1": "1. آپ اس وقت اللہ سے سب سے زیادہ کیا مانگ رہے ہیں؟",
      "path.o.marriage": "شادی اور خاندان", "path.o.rizq": "رزق اور کیریئر", "path.o.healing": "شفا اور حفاظت", "path.o.close": "اللہ کا قرب", "path.o.decide": "کوئی بڑا فیصلہ",
      "path.q2": "2. آپ کتنی مدد چاہتے ہیں؟", "path.s.start": "آہستہ آہستہ شروع", "path.s.few": "ایک دو سیشن", "path.s.program": "مکمل پروگرام", "path.s.life": "پوری طرح، تاحیات",
      "path.res": "آپ کا راستہ", "path.again": "دوبارہ شروع کریں",
      "tier.1k": "آغاز", "tier.2k": "تبدیلی", "tier.3k": "پوری طرح", "tier.rec": "تجویز کردہ",
      "tier.1a": "واٹس ایپ ویڈیو پر 45 منٹ ون آن ون", "tier.1b": "جانیں آپ واقعی کیا چاہتے ہیں", "tier.1c": "آپ کی خاص دعا اور اگلے قدم",
      "tier.2a": "دونوں کورسز اور ہر آنے والا سبق، تاحیات", "tier.2b": "خاص حلقہ اور ماہانہ لائیو کالز", "tier.2c": "عدیل کی طرف سے ذاتی واٹس ایپ خوش آمدید", "tier.2d": "انا، شفا، حفاظت اور 622 طریقہ",
      "tier.3a": "90 دن تک ہفتہ وار ون آن ون کالز", "tier.3b": "عدیل سے روزانہ واٹس ایپ رابطہ", "tier.3c": "مکمل طور پر آپ کے مطابق بنا منصوبہ",
      "all.h": "تمام پروگرام", "f.all": "سب", "f.free": "مفت", "f.start": "چھوٹا آغاز", "f.prog": "پروگرامز", "f.vip": "وی آئی پی اور تاحیات",
      "ram.h": "رمضان آ رہا ہے", "ram.p": "چاند کے مطابق تقریباً 8 فروری 2027 کو شروع ہونے کی توقع ہے۔ آخری عشرہ پروگرام (77.77$) کے ساتھ لیلۃ القدر کی دعائیں تیار کریں۔", "ram.d": "دن باقی",
      "faq.h": "سوالات <em>اور جوابات</em>",
      "faq.1q": "کیا 1,111$ بہت زیادہ ہیں؟", "faq.1a": "یہ ایک بار، تاحیات ادائیگی ہے اور ہر آنے والا سبق شامل ہے۔ اگر ابھی مناسب نہیں تو مفت 7 روزہ دعا پلان یا 11.11$ ماہانہ ذکر کے حلقے سے شروع کریں۔",
      "faq.2q": "کیا یہ اسلامی ہے یا نیو ایج؟", "faq.2a": "اسلامی۔ عدیل سنی مسلمان ہیں، نہ اس سے زیادہ نہ کم۔ یہاں مینی فیسٹیشن کا مطلب دعا ہے، اور ہر عمل قرآن و سنت سے ہے۔",
      "faq.3q": "میں پاکستان میں ہوں۔ ادائیگی کیسے کروں؟", "faq.3a": "پے پال ابھی پاکستان میں کام نہیں کرتا، اس لیے عدیل کو واٹس ایپ کریں، وہ ادائیگی کا دوسرا طریقہ بتائیں گے۔",
      "faq.4q": "نتائج کتنی جلدی نظر آئیں گے؟", "faq.4a": "بہت سے لوگ ذکر شروع کرنے کے چند دنوں میں ہلکا محسوس کرتے ہیں۔ لیکن نتائج مختلف ہوتے ہیں اور ہر نتیجہ اللہ کی طرف سے ہے۔ ہمارا کام مانگنا اور کوشش کرنا ہے۔",
      "faq.5q": "میں مصروف ہوں۔ کیا یہ میری زندگی میں فٹ ہوگا؟", "faq.5a": "جی ہاں۔ روزانہ کا عمل تقریباً 15 منٹ کا ہے، اسباق مختصر ہیں، اور آپ کسی بھی وقت فورم میں سوال پوچھ سکتے ہیں۔",
      "faq.6q": "کیا یہ تھراپی یا علاج کی جگہ لیتا ہے؟", "faq.6a": "نہیں۔ کوچنگ آپ کے ڈاکٹر یا تھراپسٹ کے ساتھ چلتی ہے، ان کی جگہ نہیں لیتی۔ بحران میں 988 یا اپنے مقامی ایمرجنسی نمبر پر رابطہ کریں۔"
    },
    fr: {
      "hero.c2": "Trouvez votre voie · 60 secondes", "tr.1": "Coran et Sunna uniquement", "tr.2": "Adeel répond lui-même", "tr.3": "Demandes de prière toujours gratuites", "tr.4": "8 langues",
      "gift.k": "Cadeau gratuit · sans paiement", "gift.h": "Votre <em>plan de dua de 7 jours</em> offert", "gift.p": "Une courte pratique par jour pendant sept jours : le dhikr, l'étiquette de la dua enseignée par le Prophète ﷺ et les moments où elle est exaucée. Envoyé sur WhatsApp par Adeel Ahmed Rahman.", "gift.btn": "Envoyez-moi le plan gratuit",
      "path.h": "Trouvez votre voie <em>en 60 secondes</em>", "path.lead": "Deux questions, et vous saurez exactement par où commencer.", "path.q1": "1. Que demandez-vous le plus à Allah en ce moment ?",
      "path.o.marriage": "Mariage et famille", "path.o.rizq": "Subsistance et carrière", "path.o.healing": "Guérison et protection", "path.o.close": "Se rapprocher d'Allah", "path.o.decide": "Une grande décision",
      "path.q2": "2. De quel accompagnement avez-vous besoin ?", "path.s.start": "Commencer en douceur", "path.s.few": "Une ou deux séances", "path.s.program": "Un programme complet", "path.s.life": "À fond, pour la vie",
      "path.res": "Votre voie", "path.again": "Recommencer",
      "tier.1k": "Commencer", "tier.2k": "Se transformer", "tier.3k": "À fond", "tier.rec": "Recommandé",
      "tier.1a": "45 minutes en tête-à-tête en vidéo WhatsApp", "tier.1b": "Découvrez ce que vous désirez vraiment", "tier.1c": "Votre dua exacte et vos prochaines étapes",
      "tier.2a": "Les deux cours et chaque leçon à venir, à vie", "tier.2b": "Cercle privé et appels mensuels en direct", "tier.2c": "Un accueil personnel d'Adeel sur WhatsApp", "tier.2d": "Ego, guérison, protection, méthode 622",
      "tier.3a": "Appels individuels chaque semaine pendant 90 jours", "tier.3b": "Accès quotidien à Adeel sur WhatsApp", "tier.3c": "Un plan entièrement construit pour vous",
      "all.h": "Tous les programmes", "f.all": "Tout", "f.free": "Gratuit", "f.start": "Pour commencer", "f.prog": "Programmes", "f.vip": "VIP et à vie",
      "ram.h": "Le Ramadan approche", "ram.p": "Il devrait commencer vers le 8 février 2027, selon la lune. Préparez vos duas pour Laylat al-Qadr avec le Programme des 10 dernières nuits (77,77 $).", "ram.d": "jours restants",
      "faq.h": "Vos questions, <em>nos réponses</em>",
      "faq.1q": "1 111 $, c'est beaucoup ?", "faq.1a": "C'est payé une fois, pour la vie, avec chaque leçon à venir. Si ce n'est pas encore pour vous, commencez par le plan de dua gratuit ou le cercle de dhikr à 11,11 $ par mois.",
      "faq.2q": "C'est islamique ou New Age ?", "faq.2a": "Islamique. Adeel est musulman sunnite, ni plus ni moins. Ici, la manifestation, c'est la dua, et chaque pratique vient du Coran et de la Sunna.",
      "faq.3q": "Je suis au Pakistan. Comment payer ?", "faq.3a": "PayPal ne fonctionne pas encore au Pakistan : écrivez à Adeel sur WhatsApp pour un autre moyen de paiement.",
      "faq.4q": "En combien de temps verrai-je des résultats ?", "faq.4a": "Beaucoup se sentent plus légers quelques jours après avoir commencé le dhikr. Mais les résultats varient et tout vient d'Allah. Notre part, c'est de demander et d'agir.",
      "faq.5q": "Je suis très occupé. Est-ce compatible ?", "faq.5a": "Oui. La pratique quotidienne prend environ 15 minutes, les leçons sont courtes et vous pouvez poser vos questions à tout moment sur le forum.",
      "faq.6q": "Cela remplace-t-il une thérapie ou des soins ?", "faq.6a": "Non. Le coaching accompagne votre médecin ou thérapeute, sans les remplacer. En cas de crise, appelez ou écrivez au 988 ou au numéro d'urgence local."
    },
    es: {
      "hero.c2": "Encuentra tu camino · 60 segundos", "tr.1": "Solo Corán y Sunna", "tr.2": "Adeel responde personalmente", "tr.3": "Peticiones de oración siempre gratis", "tr.4": "8 idiomas",
      "gift.k": "Regalo gratis · sin pago", "gift.h": "Tu <em>plan de dua de 7 días</em> gratis", "gift.p": "Una práctica corta al día durante siete días: dhikr, la etiqueta de la dua que enseñó el Profeta ﷺ y los momentos en que se responde. Te lo envía Adeel Ahmed Rahman por WhatsApp.", "gift.btn": "Envíame el plan gratis",
      "path.h": "Encuentra tu camino <em>en 60 segundos</em>", "path.lead": "Dos preguntas y verás exactamente por dónde empezar.", "path.q1": "1. ¿Qué le pides más a Allah ahora mismo?",
      "path.o.marriage": "Matrimonio y familia", "path.o.rizq": "Sustento y carrera", "path.o.healing": "Sanación y protección", "path.o.close": "Cercanía a Allah", "path.o.decide": "Una gran decisión",
      "path.q2": "2. ¿Cuánto acompañamiento quieres?", "path.s.start": "Empezar con calma", "path.s.few": "Una o dos sesiones", "path.s.program": "Un programa completo", "path.s.life": "Con todo, de por vida",
      "path.res": "Tu camino", "path.again": "Empezar de nuevo",
      "tier.1k": "Empezar", "tier.2k": "Transformarte", "tier.3k": "Con todo", "tier.rec": "Recomendado",
      "tier.1a": "45 minutos a solas por videollamada de WhatsApp", "tier.1b": "Descubre lo que de verdad deseas", "tier.1c": "Tu dua exacta y tus próximos pasos",
      "tier.2a": "Ambos cursos y cada lección futura, de por vida", "tier.2b": "Círculo privado y llamadas mensuales en directo", "tier.2c": "Bienvenida personal de Adeel por WhatsApp", "tier.2d": "Ego, sanación, protección y el método 622",
      "tier.3a": "Llamadas individuales semanales durante 90 días", "tier.3b": "Acceso diario a Adeel por WhatsApp", "tier.3c": "Un plan hecho totalmente para ti",
      "all.h": "Todos los programas", "f.all": "Todo", "f.free": "Gratis", "f.start": "Para empezar", "f.prog": "Programas", "f.vip": "VIP y de por vida",
      "ram.h": "Ramadán se acerca", "ram.p": "Se espera que empiece hacia el 8 de febrero de 2027, según la luna. Prepara tus duas para Laylat al-Qadr con el Programa de las últimas 10 noches (77,77 $).", "ram.d": "días restantes",
      "faq.h": "Preguntas, <em>respondidas</em>",
      "faq.1q": "¿1.111 $ es mucho?", "faq.1a": "Se paga una vez, de por vida, e incluye cada lección futura. Si aún no es para ti, empieza con el plan de dua gratis o el círculo de dhikr a 11,11 $ al mes.",
      "faq.2q": "¿Es islámico o Nueva Era?", "faq.2a": "Islámico. Adeel es musulmán sunní, ni más ni menos. Aquí manifestar significa hacer dua, y cada práctica viene del Corán y la Sunna.",
      "faq.3q": "Estoy en Pakistán. ¿Cómo pago?", "faq.3a": "PayPal aún no funciona en Pakistán: escribe a Adeel por WhatsApp y te dará otra forma de pago.",
      "faq.4q": "¿Cuándo veré resultados?", "faq.4a": "Muchos se sienten más ligeros pocos días después de empezar el dhikr. Pero los resultados varían y todo viene de Allah. Lo nuestro es pedir y esforzarnos.",
      "faq.5q": "Estoy ocupado. ¿Encaja en mi vida?", "faq.5a": "Sí. La práctica diaria lleva unos 15 minutos, las lecciones son cortas y puedes preguntar cuando quieras en el foro.",
      "faq.6q": "¿Sustituye a la terapia o la atención médica?", "faq.6a": "No. El coaching acompaña a tu médico o terapeuta, nunca los sustituye. En crisis, llama o escribe al 988 o a tu número de emergencias."
    },
    ja: {
      "hero.c2": "あなたの道を見つける · 60秒", "tr.1": "クルアーンとスンナのみ", "tr.2": "アディール本人が返信", "tr.3": "祈りのお願いはいつも無料", "tr.4": "8言語対応",
      "gift.k": "無料ギフト · 支払い不要", "gift.h": "無料の<em>7日間ドゥアー・プラン</em>", "gift.p": "7日間、毎日ひとつの短い実践：ズィクル、預言者ﷺが教えたドゥアーの作法、そして聞き届けられる時間。Adeel Ahmed RahmanがWhatsAppでお届けします。", "gift.btn": "無料プランを受け取る",
      "path.h": "<em>60秒で</em>あなたの道を見つける", "path.lead": "2つの質問で、どこから始めればよいかがわかります。", "path.q1": "1. 今いちばんアッラーに願っていることは？",
      "path.o.marriage": "結婚と家族", "path.o.rizq": "糧と仕事", "path.o.healing": "癒しと守り", "path.o.close": "アッラーへの近さ", "path.o.decide": "大きな決断",
      "path.q2": "2. どのくらいのサポートが欲しいですか？", "path.s.start": "まずは気軽に", "path.s.few": "1〜2回のセッション", "path.s.program": "本格的なプログラム", "path.s.life": "全力で、生涯",
      "path.res": "あなたの道", "path.again": "やり直す",
      "tier.1k": "はじめる", "tier.2k": "変わる", "tier.3k": "全力で", "tier.rec": "おすすめ",
      "tier.1a": "WhatsAppビデオで45分の個別セッション", "tier.1b": "本当に望むものを見つける", "tier.1c": "あなたのためのドゥアーと次の一歩",
      "tier.2a": "2つの講座と今後のすべてのレッスンを生涯", "tier.2b": "プライベートサークルと毎月のライブ通話", "tier.2c": "アディールからのWhatsAppでの個別歓迎", "tier.2d": "エゴ、癒し、守り、622メソッド",
      "tier.3a": "90日間、毎週の個別通話", "tier.3b": "アディールへの毎日のWhatsAppアクセス", "tier.3c": "あなただけのために作るプラン",
      "all.h": "すべてのプログラム", "f.all": "すべて", "f.free": "無料", "f.start": "気軽に始める", "f.prog": "プログラム", "f.vip": "VIP・生涯",
      "ram.h": "ラマダーンが近づいています", "ram.p": "月の観測により、2027年2月8日頃に始まる見込みです。最後の10夜プログラム（$77.77）でライラトゥル・カドルのドゥアーを準備しましょう。", "ram.d": "日",
      "faq.h": "よくある<em>ご質問</em>",
      "faq.1q": "$1,111は高いですか？", "faq.1a": "一度の支払いで生涯、今後のすべてのレッスンが含まれます。まだ早いと感じるなら、無料の7日間プランか月$11.11のズィクル・サークルから始めてください。",
      "faq.2q": "これはイスラームですか、ニューエイジですか？", "faq.2a": "イスラームです。アディールはスンナ派のムスリムで、それ以上でも以下でもありません。ここでの引き寄せとはドゥアーのことで、すべての実践はクルアーンとスンナに基づいています。",
      "faq.3q": "パキスタンにいます。どう支払えばいいですか？", "faq.3a": "PayPalはまだパキスタンで使えないため、WhatsAppでアディールに連絡してください。別の支払い方法をご案内します。",
      "faq.4q": "どのくらいで結果が出ますか？", "faq.4a": "ズィクルを始めて数日で心が軽くなる人は多いです。ただし結果には個人差があり、すべてはアッラーからのもの。私たちの役目は願い、努力することです。",
      "faq.5q": "忙しいのですが、続けられますか？", "faq.5a": "はい。毎日の実践は約15分、レッスンは短く、フォーラムでいつでも質問できます。",
      "faq.6q": "セラピーや医療の代わりになりますか？", "faq.6a": "いいえ。コーチングは医師やセラピストと並行するもので、代わりにはなりません。危機的な状況では988または地域の緊急番号に連絡してください。"
    },
    zh: {
      "hero.c2": "找到你的路 · 60 秒", "tr.1": "只依据古兰经和圣行", "tr.2": "阿迪尔亲自回复", "tr.3": "代祷请求永远免费", "tr.4": "8 种语言",
      "gift.k": "免费礼物 · 无需付款", "gift.h": "免费的<em>7 天祈祷计划</em>", "gift.p": "七天里每天一个简短练习：记主、先知ﷺ教导的祈祷礼节，以及祈祷被应答的时刻。由 Adeel Ahmed Rahman 通过 WhatsApp 发送给你。", "gift.btn": "把免费计划发给我",
      "path.h": "<em>60 秒</em>找到你的路", "path.lead": "两个问题，你就知道该从哪里开始。", "path.q1": "1. 你现在最想向安拉祈求什么？",
      "path.o.marriage": "婚姻与家庭", "path.o.rizq": "给养与事业", "path.o.healing": "疗愈与保护", "path.o.close": "亲近安拉", "path.o.decide": "一个重大决定",
      "path.q2": "2. 你想要多少支持？", "path.s.start": "轻松开始", "path.s.few": "一两次课程", "path.s.program": "完整的计划", "path.s.life": "全力以赴，终身",
      "path.res": "你的路", "path.again": "重新开始",
      "tier.1k": "开始", "tier.2k": "蜕变", "tier.3k": "全力以赴", "tier.rec": "推荐",
      "tier.1a": "WhatsApp 视频一对一 45 分钟", "tier.1b": "找到你真正渴望的东西", "tier.1c": "你专属的祈祷和下一步",
      "tier.2a": "两门课程及未来所有课程，终身", "tier.2b": "私人圈子和每月直播通话", "tier.2c": "阿迪尔在 WhatsApp 上的亲自欢迎", "tier.2d": "自我、疗愈、保护与 622 方法",
      "tier.3a": "90 天每周一对一通话", "tier.3b": "每天通过 WhatsApp 联系阿迪尔", "tier.3c": "完全为你量身定制的计划",
      "all.h": "所有项目", "f.all": "全部", "f.free": "免费", "f.start": "轻松开始", "f.prog": "计划", "f.vip": "VIP 与终身",
      "ram.h": "斋月即将到来", "ram.p": "预计约于 2027 年 2 月 8 日开始，以见月为准。用最后十夜计划（$77.77）为盖德尔夜准备你的祈祷。", "ram.d": "天",
      "faq.h": "常见<em>问题</em>",
      "faq.1q": "$1,111 贵吗？", "faq.1a": "一次付清，终身有效，包含未来所有课程。如果现在还不合适，可以从免费的 7 天祈祷计划或每月 $11.11 的记主圈开始。",
      "faq.2q": "这是伊斯兰的，还是新时代的？", "faq.2a": "伊斯兰的。阿迪尔是逊尼派穆斯林，不多也不少。这里的显化就是祈祷，每个练习都来自古兰经和圣行。",
      "faq.3q": "我在巴基斯坦，怎么付款？", "faq.3a": "PayPal 目前在巴基斯坦无法使用，请通过 WhatsApp 联系阿迪尔，他会提供其他付款方式。",
      "faq.4q": "多久能看到效果？", "faq.4a": "很多人开始记主几天后就感到轻松。但结果因人而异，一切皆来自安拉。我们的本分是祈求和努力。",
      "faq.5q": "我很忙，适合我吗？", "faq.5a": "适合。每天的练习约 15 分钟，课程简短，你可以随时在论坛提问。",
      "faq.6q": "这能代替心理治疗或医疗吗？", "faq.6a": "不能。辅导与你的医生或治疗师并行，绝不替代。遇到危机，请拨打或发短信至 988 或当地紧急号码。"
    },
    ko: {
      "hero.c2": "나의 길 찾기 · 60초", "tr.1": "오직 꾸란과 순나", "tr.2": "아딜이 직접 답장", "tr.3": "기도 요청은 언제나 무료", "tr.4": "8개 언어",
      "gift.k": "무료 선물 · 결제 없음", "gift.h": "무료 <em>7일 두아 플랜</em>", "gift.p": "7일 동안 매일 하나의 짧은 실천: 디크르, 예언자ﷺ께서 가르치신 두아 예절, 그리고 응답받는 시간. Adeel Ahmed Rahman이 WhatsApp으로 보내 드립니다.", "gift.btn": "무료 플랜 받기",
      "path.h": "<em>60초 만에</em> 나의 길 찾기", "path.lead": "두 가지 질문이면 어디서 시작할지 정확히 알 수 있습니다.", "path.q1": "1. 지금 알라께 가장 간절히 구하는 것은?",
      "path.o.marriage": "결혼과 가족", "path.o.rizq": "양식과 직업", "path.o.healing": "치유와 보호", "path.o.close": "알라와 가까워지기", "path.o.decide": "중요한 결정",
      "path.q2": "2. 어느 정도의 도움을 원하시나요?", "path.s.start": "가볍게 시작", "path.s.few": "한두 번의 세션", "path.s.program": "전체 프로그램", "path.s.life": "모든 것을, 평생",
      "path.res": "당신의 길", "path.again": "다시 시작",
      "tier.1k": "시작", "tier.2k": "변화", "tier.3k": "올인", "tier.rec": "추천",
      "tier.1a": "WhatsApp 영상통화 45분 일대일", "tier.1b": "진정으로 원하는 것 찾기", "tier.1c": "나만의 두아와 다음 단계",
      "tier.2a": "두 강좌와 앞으로의 모든 수업을 평생", "tier.2b": "비공개 모임과 매월 라이브 통화", "tier.2c": "아딜의 개인 WhatsApp 환영 메시지", "tier.2d": "에고, 치유, 보호, 622 방법",
      "tier.3a": "90일간 매주 일대일 통화", "tier.3b": "매일 WhatsApp으로 아딜과 연락", "tier.3c": "온전히 당신에게 맞춘 계획",
      "all.h": "모든 프로그램", "f.all": "전체", "f.free": "무료", "f.start": "가볍게 시작", "f.prog": "프로그램", "f.vip": "VIP·평생",
      "ram.h": "라마단이 다가옵니다", "ram.p": "달 관측에 따라 2027년 2월 8일경 시작될 예정입니다. 마지막 10일 밤 프로그램($77.77)으로 라일라툴 까드르의 두아를 준비하세요.", "ram.d": "일 남음",
      "faq.h": "자주 묻는 <em>질문</em>",
      "faq.1q": "$1,111은 비싼가요?", "faq.1a": "한 번 결제로 평생이며 앞으로의 모든 수업이 포함됩니다. 아직 이르다면 무료 7일 두아 플랜이나 월 $11.11 디크르 서클로 시작하세요.",
      "faq.2q": "이슬람인가요, 뉴에이지인가요?", "faq.2a": "이슬람입니다. 아딜은 수니파 무슬림이며 그 이상도 이하도 아닙니다. 여기서 끌어당김은 두아를 뜻하며, 모든 실천은 꾸란과 순나에서 옵니다.",
      "faq.3q": "파키스탄에 있어요. 어떻게 결제하나요?", "faq.3a": "PayPal은 아직 파키스탄에서 사용할 수 없으니 WhatsApp으로 아딜에게 연락하시면 다른 결제 방법을 알려드립니다.",
      "faq.4q": "언제 결과를 볼 수 있나요?", "faq.4a": "많은 분들이 디크르를 시작하고 며칠 만에 마음이 가벼워집니다. 하지만 결과는 사람마다 다르며 모든 결과는 알라께로부터 옵니다. 우리의 몫은 구하고 노력하는 것입니다.",
      "faq.5q": "바쁜데 할 수 있을까요?", "faq.5a": "네. 매일 실천은 약 15분, 수업은 짧고, 포럼에서 언제든 질문할 수 있습니다.",
      "faq.6q": "치료나 의료를 대신하나요?", "faq.6a": "아니요. 코칭은 의사나 치료사와 함께하는 것이지 대신하지 않습니다. 위기 상황에서는 988이나 지역 긴급 번호로 연락하세요."
    }
  };
  Object.keys(MORE5).forEach(function (l) { Object.keys(MORE5[l]).forEach(function (k) { T[l][k] = MORE5[l][k]; }); });



  /* ============ Added: Learn Salah ============ */
  T.ar["of.salah.t"] = 'تعلّم الصلاة مع عديل'; T.ar["of.salah.d"] = 'خطوة بخطوة، وجهًا لوجه: الوضوء، وكل وضعية، وعربية كل قراءة ومعناها، حتى تصلي الصلوات الخمس بثقة. للمسلمين الجدد ولكل من لم يتعلّمها كما ينبغي. لا تستطيع الدفع؟ راسل عديل: لا ينبغي أن يُحرم أحد من الصلاة.'; T.ar["path.o.salah"] = 'تعلّم الصلاة';
  T.ur["of.salah.t"] = 'عدیل کے ساتھ نماز سیکھیں'; T.ur["of.salah.d"] = 'قدم بہ قدم، ون آن ون: وضو، ہر رکن، ہر تلاوت کی عربی اور اس کا مطلب، یہاں تک کہ آپ پانچوں نمازیں اعتماد سے پڑھ سکیں۔ نئے مسلمانوں اور ہر اُس شخص کے لیے جس نے کبھی صحیح طرح نہیں سیکھا۔ ادائیگی کی استطاعت نہیں؟ عدیل کو میسج کریں: کسی کو نماز سے محروم نہیں رہنا چاہیے۔'; T.ur["path.o.salah"] = 'نماز سیکھنا';
  T.fr["of.salah.t"] = 'Apprendre la salat avec Adeel'; T.fr["of.salah.d"] = "Pas à pas, en tête-à-tête : les ablutions, chaque position, l'arabe de chaque récitation et son sens, jusqu'à prier les cinq prières avec assurance. Pour les nouveaux musulmans, les convertis et tous ceux qui n'ont jamais bien appris. Pas les moyens ? Écrivez à Adeel : personne ne devrait être privé de la salat."; T.fr["path.o.salah"] = 'Apprendre à prier';
  T.es["of.salah.t"] = 'Aprende el salat con Adeel'; T.es["of.salah.d"] = 'Paso a paso, en persona: el wudu, cada posición, el árabe de cada recitación y su significado, hasta que reces las cinco oraciones con confianza. Para nuevos musulmanes, revertidos y quien nunca aprendió bien. ¿No puedes pagarlo? Escribe a Adeel: nadie debería quedarse sin rezar.'; T.es["path.o.salah"] = 'Aprender a rezar';
  T.ja["of.salah.t"] = 'アディールと礼拝（サラー）を学ぶ'; T.ja["of.salah.d"] = '一対一で一歩ずつ：ウドゥー、すべての動作、各朗誦のアラビア語とその意味。5回の礼拝を自信をもって行えるようになるまで。新しくムスリムになった方、正しく学ぶ機会がなかった方へ。費用が難しい方はアディールに連絡を。誰も礼拝から遠ざけられるべきではありません。'; T.ja["path.o.salah"] = '礼拝を学びたい';
  T.zh["of.salah.t"] = '跟阿迪尔学礼拜'; T.zh["of.salah.d"] = '一对一，循序渐进：小净、每个动作、每段诵读的阿拉伯语及其含义，直到你能自信地完成五番拜。适合新穆斯林、归信者以及从未好好学过的人。负担不起？请联系阿迪尔：任何人都不应因此错过礼拜。'; T.zh["path.o.salah"] = '学习礼拜';
  T.ko["of.salah.t"] = '아딜과 함께 살라(예배) 배우기'; T.ko["of.salah.d"] = '일대일로 한 걸음씩: 우두, 모든 자세, 각 낭송의 아랍어와 그 의미까지, 다섯 번의 예배를 자신 있게 드릴 수 있을 때까지. 새로 무슬림이 된 분과 제대로 배울 기회가 없었던 모든 분께. 비용이 부담되나요? 아딜에게 연락하세요. 누구도 예배에서 멀어져서는 안 됩니다.'; T.ko["path.o.salah"] = '예배 배우기';

  /* Learn Salah is free */
  T.ar["of.salah.d"] = 'مجانًا، وجهًا لوجه، خطوة بخطوة: الوضوء، وكل وضعية، وعربية كل قراءة ومعناها، حتى تصلي الصلوات الخمس بثقة. للمسلمين الجدد ولكل من لم يتعلّمها كما ينبغي.'; T.ar["salah.btn"] = 'علّمني الصلاة مجانًا';
  T.ur["of.salah.d"] = 'مفت، ون آن ون، قدم بہ قدم: وضو، ہر رکن، ہر تلاوت کی عربی اور اس کا مطلب، یہاں تک کہ آپ پانچوں نمازیں اعتماد سے پڑھ سکیں۔ نئے مسلمانوں اور ہر اُس شخص کے لیے جس نے کبھی صحیح طرح نہیں سیکھا۔'; T.ur["salah.btn"] = 'مجھے مفت نماز سکھائیں';
  T.fr["of.salah.d"] = "Gratuit, en tête-à-tête, pas à pas : les ablutions, chaque position, l'arabe de chaque récitation et son sens, jusqu'à prier les cinq prières avec assurance. Pour les nouveaux musulmans, les convertis et tous ceux qui n'ont jamais bien appris."; T.fr["salah.btn"] = 'Apprenez-moi la salat, gratuitement';
  T.es["of.salah.d"] = 'Gratis, en persona, paso a paso: el wudu, cada posición, el árabe de cada recitación y su significado, hasta que reces las cinco oraciones con confianza. Para nuevos musulmanes, revertidos y quien nunca aprendió bien.'; T.es["salah.btn"] = 'Enséñame el salat, gratis';
  T.ja["of.salah.d"] = '無料・一対一で一歩ずつ：ウドゥー、すべての動作、各朗誦のアラビア語とその意味。5回の礼拝を自信をもって行えるようになるまで。新しくムスリムになった方、正しく学ぶ機会がなかった方へ。'; T.ja["salah.btn"] = '無料で礼拝を教えてください';
  T.zh["of.salah.d"] = '免费、一对一、循序渐进：小净、每个动作、每段诵读的阿拉伯语及其含义，直到你能自信地完成五番拜。适合新穆斯林、归信者以及从未好好学过的人。'; T.zh["salah.btn"] = '免费教我礼拜';
  T.ko["of.salah.d"] = '무료로, 일대일로 한 걸음씩: 우두, 모든 자세, 각 낭송의 아랍어와 그 의미까지, 다섯 번의 예배를 자신 있게 드릴 수 있을 때까지. 새로 무슬림이 된 분과 제대로 배울 기회가 없었던 모든 분께.'; T.ko["salah.btn"] = '무료로 예배를 가르쳐 주세요';


  /* ============ Added: night sky, signs, dawah ============ */
  T.ar['div.t'] = 'لا حول ولا قوة إلا بالله';
  T.ar['signs.h'] = 'العلامات الحقيقية هي <em>آيات الله</em>';
  T.ar['signs.p'] = 'القمر والنجوم ليست طوالع ولا قوى. إنها آيات تدلّ على من خلقها. حين تنظر إلى السماء، فلتذكّرك: كل شيء يجري بأمره.';
  T.ar['signs.ayah'] = '«والقمر قدّرناه منازل حتى عاد كالعرجون القديم»';
  T.ar['signs.ayah2'] = '«إن في خلق السماوات والأرض واختلاف الليل والنهار لآيات لأولي الألباب»';
  T.ar['dawah.h'] = 'هذه <em>دعوة</em>، لا أكثر';
  T.ar['dawah.p'] = 'عديل أحمد رحمان ليس معلّمًا روحانيًا ولا يملك قوة من نفسه. إنه يقوم بالدعوة فقط: يساعد الناس على أن يصلّوا ويدعوا بقوة أكبر، بالذكر والدعاء. لا حول ولا قوة إلا بالله، وبه كل شيء. الإسلام السنّي، القرآن والسنة، هو الطريق إلى جنة الفردوس.';
  T.ur['div.t'] = 'اللہ کے سوا نہ کوئی طاقت ہے نہ قوت';
  T.ur['signs.h'] = 'اصل نشانیاں <em>اللہ کی نشانیاں</em> ہیں';
  T.ur['signs.p'] = 'چاند اور ستارے نہ شگون ہیں نہ طاقتیں۔ یہ آیات ہیں، جو اپنے خالق کی طرف اشارہ کرتی ہیں۔ جب آپ آسمان کی طرف دیکھیں تو یاد رکھیں: ہر چیز اُسی کے حکم سے چلتی ہے۔';
  T.ur['signs.ayah'] = '”اور چاند کی ہم نے منزلیں مقرر کیں، یہاں تک کہ وہ کھجور کی پرانی ٹہنی کی طرح ہو جاتا ہے۔“';
  T.ur['signs.ayah2'] = '”بے شک آسمانوں اور زمین کی پیدائش اور رات اور دن کے بدلنے میں عقل والوں کے لیے نشانیاں ہیں۔“';
  T.ur['dawah.h'] = 'یہ <em>دعوت</em> ہے، اس سے زیادہ کچھ نہیں';
  T.ur['dawah.p'] = 'عدیل احمد رحمان کوئی گرو نہیں اور ان کے پاس اپنی کوئی طاقت نہیں۔ وہ بس دعوت کا کام کر رہے ہیں: لوگوں کو ذکر اور دعا کے ساتھ زیادہ پُراثر طریقے سے عبادت کرنے میں مدد دینا۔ اللہ کے سوا کوئی طاقت نہیں، اور سب کچھ اُسی کے ذریعے ہے۔ سنی اسلام، قرآن و سنت، جنت الفردوس کا راستہ ہے۔';
  T.fr['div.t'] = 'Nulle puissance, nulle force, sinon par Allah';
  T.fr['signs.h'] = "Les vrais signes sont <em>les signes d'Allah</em>";
  T.fr['signs.p'] = 'La lune et les étoiles ne sont ni des présages ni des puissances. Ce sont des ayat, des signes qui désignent Celui qui les a créées. Quand vous levez les yeux, souvenez-vous : tout se meut par Son ordre.';
  T.fr['signs.ayah'] = "« Et la lune, Nous lui avons fixé des phases, jusqu'à ce qu'elle devienne comme une vieille palme recourbée. »";
  T.fr['signs.ayah2'] = "« Dans la création des cieux et de la terre et dans l'alternance de la nuit et du jour, il y a certes des signes pour les doués d'intelligence. »";
  T.fr['dawah.h'] = "C'est de la <em>dawah</em>, rien de plus";
  T.fr['dawah.p'] = "Adeel Ahmed Rahman n'est pas un gourou et n'a aucun pouvoir propre. Il fait simplement de la dawah : il aide les gens à prier plus intensément, par le dhikr et la dua. Nulle puissance sinon Allah, et par Lui toute chose. L'islam sunnite, le Coran et la Sunna, est le chemin vers Jannat al-Firdaws.";
  T.es['div.t'] = 'No hay poder ni fuerza sino en Allah';
  T.es['signs.h'] = 'Las verdaderas señales son <em>las señales de Allah</em>';
  T.es['signs.p'] = 'La luna y las estrellas no son presagios ni poderes. Son ayat, señales que apuntan a Quien las creó. Cuando mires al cielo, que te recuerde: todo se mueve por Su orden.';
  T.es['signs.ayah'] = '«Y a la luna le hemos fijado fases, hasta que vuelve a ser como una vieja rama de palmera curvada.»';
  T.es['signs.ayah2'] = '«En la creación de los cielos y la tierra y en la sucesión de la noche y el día hay signos para los dotados de entendimiento.»';
  T.es['dawah.h'] = 'Esto es <em>dawa</em>, nada más';
  T.es['dawah.p'] = 'Adeel Ahmed Rahman no es un gurú ni tiene poder propio. Simplemente hace dawa: ayuda a la gente a rezar con más fuerza, con dhikr y dua. No hay poder sino Allah, y por Él todas las cosas. El islam sunní, el Corán y la Sunna, es el camino a Jannat al-Firdaws.';
  T.ja['div.t'] = 'アッラーによらずして力も権能もない';
  T.ja['signs.h'] = '真のしるしは<em>アッラーのしるし</em>';
  T.ja['signs.p'] = '月や星は前兆でも力でもありません。それを創られた御方を指し示すアーヤ（しるし）です。空を見上げるたびに思い出してください。すべてはかれの御命令によって動いていると。';
  T.ja['signs.ayah'] = '「また月には、われは宿を定めた。それが古いナツメヤシの枝のように（細く）なって戻るまで。」';
  T.ja['signs.ayah2'] = '「本当に天と地の創造、昼と夜の交替の中には、思慮ある者への印がある。」';
  T.ja['dawah.h'] = 'これは<em>ダアワ</em>にほかなりません';
  T.ja['dawah.p'] = 'Adeel Ahmed Rahmanはグルではなく、自らの力も持ちません。ただダアワ（イスラームへの呼びかけ）を行い、ズィクルとドゥアーでより力強く祈れるよう人々を助けているだけです。アッラーのほかに力はなく、すべてはかれを通してあります。スンナ派イスラーム、クルアーンとスンナこそがジャンナトゥル・フィルダウスへの道です。';
  T.zh['div.t'] = '无能为力，唯凭安拉';
  T.zh['signs.h'] = '真正的迹象是<em>安拉的迹象</em>';
  T.zh['signs.p'] = '月亮和星星既不是预兆，也不是力量。它们是阿亚特，是指向其造物主的迹象。当你仰望天空时，让它提醒你：万物皆依祂的命令运行。';
  T.zh['signs.ayah'] = '“月亮，我为它定了宿度，直到它变得像枯老的椰枣枝。”';
  T.zh['signs.ayah2'] = '“在天地的创造中，在昼夜的轮替中，对于有理智的人确有许多迹象。”';
  T.zh['dawah.h'] = '这只是<em>宣教</em>';
  T.zh['dawah.p'] = 'Adeel Ahmed Rahman 不是大师，也没有自己的力量。他只是在做宣教：通过记主和祈祷，帮助人们更有力地礼拜和祈求。除安拉外别无力量，万物皆凭祂。逊尼派伊斯兰——古兰经和圣行——是通往菲尔道斯乐园的道路。';
  T.ko['div.t'] = '알라 외에는 어떤 힘도 능력도 없다';
  T.ko['signs.h'] = '진정한 징표는 <em>알라의 징표</em>입니다';
  T.ko['signs.p'] = '달과 별은 징조도, 힘도 아닙니다. 그것을 창조하신 분을 가리키는 아야트(징표)입니다. 하늘을 올려다볼 때마다 기억하세요. 모든 것은 그분의 명령으로 움직입니다.';
  T.ko['signs.ayah'] = '“달에게도 우리는 머물 곳을 정하였으니, 마침내 그것은 오래된 대추야자 가지처럼 되돌아온다.”';
  T.ko['signs.ayah2'] = '“실로 하늘과 땅의 창조와 밤과 낮의 교차 속에는 이해하는 자들을 위한 징표가 있다.”';
  T.ko['dawah.h'] = '이것은 <em>다와</em>일 뿐입니다';
  T.ko['dawah.p'] = 'Adeel Ahmed Rahman은 구루가 아니며 스스로의 힘도 없습니다. 그저 다와를 할 뿐입니다. 디크르와 두아로 사람들이 더 힘 있게 기도하도록 돕는 것입니다. 알라 외에는 어떤 힘도 없으며, 모든 것은 그분을 통해 있습니다. 수니 이슬람, 꾸란과 순나가 잔나트 알피르다우스로 가는 길입니다.';
  var RIB_LH = { en: "No power except Allah", ar: "لا حول ولا قوة إلا بالله", ur: "لا حول ولا قوۃ الا باللہ", fr: "Nulle puissance sinon par Allah", es: "No hay poder sino en Allah", ja: "アッラーのほかに力なし", zh: "无能为力，唯凭安拉", ko: "알라 외에는 힘이 없다" };
  Object.keys(RIB_LH).forEach(function (l) { RIBBON[l].unshift(RIB_LH[l]); });


  /* ============ Added: library ============ */
  T.ar['lib.k'] = '☾ تذكير يومي';
  T.ar['lib.h'] = 'آية وحديث <em>اليوم</em>';
  T.ar['lib.v'] = 'آية اليوم';
  T.ar['lib.hd'] = 'حديث اليوم';
  T.ar['lib.p'] = 'أكثر من 300 آية وحديثًا صحيحًا في الدعاء والذكر والرزق والزواج والشفاء والحماية والجنة، قابلة للبحث، مع روابط لكل مصدر.';
  T.ar['lib.btn'] = 'افتح مكتبة القرآن والحديث';
  T.ar['l11.t'] = 'مكتبة القرآن والحديث';
  T.ar['l11.s'] = 'آيات وأحاديث صحيحة قابلة للبحث';
  T.ur['lib.k'] = '☾ روزانہ یاد دہانی';
  T.ur['lib.h'] = 'آج کی آیت <em>اور حدیث</em>';
  T.ur['lib.v'] = 'آج کی آیت';
  T.ur['lib.hd'] = 'آج کی حدیث';
  T.ur['lib.p'] = 'دعا، ذکر، رزق، شادی، شفا، حفاظت اور جنت پر 300 سے زیادہ قرآنی آیات اور صحیح احادیث، تلاش کے قابل، ہر حوالے کے لنک کے ساتھ۔';
  T.ur['lib.btn'] = 'قرآن و حدیث لائبریری کھولیں';
  T.ur['l11.t'] = 'قرآن و حدیث لائبریری';
  T.ur['l11.s'] = 'تلاش کے قابل آیات اور صحیح احادیث';
  T.fr['lib.k'] = '☾ Rappel du jour';
  T.fr['lib.h'] = 'Verset et hadith <em>du jour</em>';
  T.fr['lib.v'] = 'Verset du jour';
  T.fr['lib.hd'] = 'Hadith du jour';
  T.fr['lib.p'] = 'Plus de 300 versets du Coran et hadiths authentiques sur la dua, le dhikr, la subsistance, le mariage, la guérison, la protection et le Paradis, consultables, avec un lien vers chaque source.';
  T.fr['lib.btn'] = 'Ouvrir la bibliothèque Coran et hadith';
  T.fr['l11.t'] = 'Bibliothèque Coran et hadith';
  T.fr['l11.s'] = 'Versets et hadiths authentiques à rechercher';
  T.es['lib.k'] = '☾ Recordatorio diario';
  T.es['lib.h'] = 'Versículo y hadiz <em>del día</em>';
  T.es['lib.v'] = 'Versículo del día';
  T.es['lib.hd'] = 'Hadiz del día';
  T.es['lib.p'] = 'Más de 300 versículos del Corán y hadices auténticos sobre la dua, el dhikr, el sustento, el matrimonio, la sanación, la protección y el Paraíso, con buscador y enlace a cada fuente.';
  T.es['lib.btn'] = 'Abrir la biblioteca de Corán y hadiz';
  T.es['l11.t'] = 'Biblioteca de Corán y hadiz';
  T.es['l11.s'] = 'Versículos y hadices auténticos con buscador';
  T.ja['lib.k'] = '☾ 毎日のリマインダー';
  T.ja['lib.h'] = '<em>今日の</em>章句とハディース';
  T.ja['lib.v'] = '今日の章句';
  T.ja['lib.hd'] = '今日のハディース';
  T.ja['lib.p'] = 'ドゥアー、ズィクル、糧、結婚、癒し、守り、天国についての300以上のクルアーンの章句と真正なハディース。検索でき、すべての出典にリンクしています。';
  T.ja['lib.btn'] = 'クルアーン＆ハディース・ライブラリーを開く';
  T.ja['l11.t'] = 'クルアーン＆ハディース・ライブラリー';
  T.ja['l11.s'] = '検索できる章句と真正なハディース';
  T.zh['lib.k'] = '☾ 每日提醒';
  T.zh['lib.h'] = '<em>今日</em>经文与圣训';
  T.zh['lib.v'] = '今日经文';
  T.zh['lib.hd'] = '今日圣训';
  T.zh['lib.p'] = '300 多条关于祈祷、记主、给养、婚姻、疗愈、保护和天园的古兰经经文与可靠圣训，可搜索，并链接到每个出处。';
  T.zh['lib.btn'] = '打开古兰经与圣训库';
  T.zh['l11.t'] = '古兰经与圣训库';
  T.zh['l11.s'] = '可搜索的经文与可靠圣训';
  T.ko['lib.k'] = '☾ 오늘의 상기';
  T.ko['lib.h'] = '<em>오늘의</em> 구절과 하디스';
  T.ko['lib.v'] = '오늘의 구절';
  T.ko['lib.hd'] = '오늘의 하디스';
  T.ko['lib.p'] = '두아, 디크르, 양식, 결혼, 치유, 보호, 천국에 관한 300개 이상의 꾸란 구절과 정통 하디스. 검색할 수 있으며 모든 출처에 연결됩니다.';
  T.ko['lib.btn'] = '꾸란·하디스 라이브러리 열기';
  T.ko['l11.t'] = '꾸란·하디스 라이브러리';
  T.ko['l11.s'] = '검색 가능한 구절과 정통 하디스';

  /* ---------------- engine ---------------- */
  var root = document.documentElement;
  var nodes = [].slice.call(document.querySelectorAll("[data-i18n]"));
  var phs = [].slice.call(document.querySelectorAll("[data-i18n-ph]"));
  var EN = { title: document.title };
  nodes.forEach(function (el) { var k = el.getAttribute("data-i18n"); if (!(k in EN)) EN[k] = el.innerHTML; });
  phs.forEach(function (el) { EN[el.getAttribute("data-i18n-ph")] = el.getAttribute("placeholder"); });

  function t(l, k) { return (T[l] && T[l][k] != null) ? T[l][k] : EN[k]; }

  var ribbon = document.getElementById("ribbon");
  function drawRibbon(l) {
    if (!ribbon) return;
    var items = RIBBON[l] || RIBBON.en, html = "";
    for (var r = 0; r < 4; r++) items.forEach(function (s) { html += "<span dir=\"auto\">" + s.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</span>"; });
    ribbon.innerHTML = html;
  }

  var btn = document.getElementById("langBtn"), menu = document.getElementById("langMenu"), cur = document.getElementById("langCur");

  function apply(l, save) {
    if (!LANGS.some(function (x) { return x[0] === l; })) l = "en";
    root.lang = l; root.dir = RTL[l] ? "rtl" : "ltr";
    nodes.forEach(function (el) { el.innerHTML = t(l, el.getAttribute("data-i18n")); });
    phs.forEach(function (el) { el.setAttribute("placeholder", t(l, el.getAttribute("data-i18n-ph"))); });
    document.title = t(l, "title");
    drawRibbon(l);
    LANGS.forEach(function (x) { if (x[0] === l && cur) cur.textContent = x[2]; });
    if (menu) [].forEach.call(menu.querySelectorAll("button"), function (b) { b.setAttribute("aria-checked", b.getAttribute("data-l") === l ? "true" : "false"); });
    if (save) {
      try { localStorage.setItem("coach-lang", l); } catch (e) {}
      try {
        var u = new URL(location.href);
        if (l === "en") u.searchParams.delete("lang"); else u.searchParams.set("lang", l);
        history.replaceState(null, "", u.pathname + u.search + u.hash);
      } catch (e) {}
    }
  }

  if (menu) {
    menu.innerHTML = LANGS.map(function (x) {
      return '<li role="none"><button type="button" role="menuitemradio" data-l="' + x[0] + '" lang="' + x[0] + '"><span>' + x[1] + "</span><small>" + x[2] + "</small></button></li>";
    }).join("");
    menu.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-l]"); if (!b) return;
      apply(b.getAttribute("data-l"), true); close();
    });
  }
  function close() { if (menu) menu.classList.remove("open"); if (btn) btn.setAttribute("aria-expanded", "false"); }
  if (btn) btn.addEventListener("click", function (e) {
    e.stopPropagation();
    var open = !menu.classList.contains("open");
    menu.classList.toggle("open", open); btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { var c = menu.querySelector('[aria-checked="true"]'); if (c) c.focus(); }
  });
  document.addEventListener("click", function (e) { if (menu && !menu.contains(e.target)) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { close(); if (btn) btn.focus(); } });

  window.coachSetLang = function (l) { apply(l, true); };
  apply(root.lang || "en", false);
})();

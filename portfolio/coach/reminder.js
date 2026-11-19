/* ============================================================
   34-second reminder: once per visit, a gentle call to repentance for
   everyone, whatever month they were born in. It never singles anyone
   out and never waits on top of another pop-up (it retries until the
   screen is clear). Preview with ?reminder.
   ============================================================ */
(function () {
  "use strict";
  var WA = "16134083945";
  var TX = {
    en: { k: "A reminder for everyone", h: "Your birth date doesn't decide your fate", p: "Whether you were born in October 🦉, on any day of November 🦂 ♏️, under Virgo, or on any day of the year, the stars don't decide what happens to you. Your deeds do, and Allah's mercy is greater than every sin.", ay: "“And whoever does an atom's weight of good will see it, and whoever does an atom's weight of evil will see it.”", ref: "Qur'an 99:7-8", p2: "If you have wronged someone, the door of tawbah is still open. Seek their forgiveness and turn back to Allah. “Indeed, Allah loves those who repent.” (2:222)", pray: "🤲 Request a prayer", wa: "Talk on WhatsApp", close: "Close" },
    ur: { k: "سب کے لیے ایک یاد دہانی", h: "آپ کی تاریخِ پیدائش آپ کی قسمت طے نہیں کرتی", p: "چاہے آپ اکتوبر 🦉، نومبر 🦂 ♏️ کی کسی بھی تاریخ، برجِ سنبلہ یا سال کے کسی بھی دن پیدا ہوئے ہوں، ستارے طے نہیں کرتے کہ آپ کے ساتھ کیا ہوگا۔ آپ کے اعمال طے کرتے ہیں، اور اللہ کی رحمت ہر گناہ سے بڑی ہے۔", ay: "”پس جس نے ذرہ برابر نیکی کی ہوگی وہ اسے دیکھ لے گا، اور جس نے ذرہ برابر برائی کی ہوگی وہ اسے دیکھ لے گا۔“", ref: "قرآن 99:7-8", p2: "اگر آپ نے کسی پر زیادتی کی ہے تو توبہ کا دروازہ اب بھی کھلا ہے۔ اس سے معافی مانگیں اور اللہ کی طرف لوٹ آئیں۔ ”بے شک اللہ توبہ کرنے والوں سے محبت کرتا ہے۔“ (2:222)", pray: "🤲 دعا کی درخواست", wa: "واٹس ایپ پر بات کریں", close: "بند کریں" },
    ar: { k: "تذكير للجميع", h: "تاريخ ميلادك لا يحدد مصيرك", p: "سواء وُلدت في أكتوبر 🦉 أو في أي يوم من نوفمبر 🦂 ♏️ أو في برج العذراء أو في أي يوم من أيام السنة، فالنجوم لا تحدد ما يصيبك. أعمالك هي التي تحدد، ورحمة الله أوسع من كل ذنب.", ay: "«فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ۝ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ»", ref: "الزلزلة 7-8", p2: "إن كنت ظلمت أحدًا، فباب التوبة ما زال مفتوحًا. اطلب منه السماح وارجع إلى الله. «إن الله يحب التوابين» (2:222)", pray: "🤲 اطلب دعاءً", wa: "تحدّث على واتساب", close: "إغلاق" },
    fr: { k: "Un rappel pour tous", h: "Votre date de naissance ne décide pas de votre destin", p: "Que vous soyez né en octobre 🦉, n'importe quel jour de novembre 🦂 ♏️, sous le signe de la Vierge ou n'importe quel jour de l'année, les astres ne décident pas de ce qui vous arrive. Ce sont vos actes, et la miséricorde d'Allah est plus grande que tout péché.", ay: "« Quiconque fait un bien du poids d'un atome le verra, et quiconque fait un mal du poids d'un atome le verra. »", ref: "Coran 99:7-8", p2: "Si vous avez fait du tort à quelqu'un, la porte du repentir est encore ouverte. Demandez-lui pardon et revenez à Allah. « Allah aime ceux qui se repentent. » (2:222)", pray: "🤲 Demander une prière", wa: "Parler sur WhatsApp", close: "Fermer" },
    es: { k: "Un recordatorio para todos", h: "Tu fecha de nacimiento no decide tu destino", p: "Hayas nacido en octubre 🦉, cualquier día de noviembre 🦂 ♏️, bajo Virgo o cualquier día del año, las estrellas no deciden lo que te ocurre. Lo deciden tus actos, y la misericordia de Allah es mayor que cualquier pecado.", ay: "«Quien haga el peso de un átomo de bien lo verá, y quien haga el peso de un átomo de mal lo verá.»", ref: "Corán 99:7-8", p2: "Si has hecho daño a alguien, la puerta del arrepentimiento sigue abierta. Pídele perdón y vuelve a Allah. «Allah ama a los que se arrepienten.» (2:222)", pray: "🤲 Pedir una oración", wa: "Hablar por WhatsApp", close: "Cerrar" },
    ja: { k: "すべての人へのリマインダー", h: "生年月日があなたの運命を決めるのではありません", p: "10月🦉生まれでも、11月🦂♏️のどの日に生まれても、おとめ座でも、一年のどの日に生まれても、星があなたに起こることを決めるのではありません。決めるのはあなたの行いであり、アッラーの慈悲はどんな罪よりも大きいのです。", ay: "「一微塵の重さでも善を行った者はそれを見る。一微塵の重さでも悪を行った者はそれを見る。」", ref: "クルアーン 99:7-8", p2: "誰かを傷つけたことがあるなら、悔悟の扉はまだ開いています。その人に赦しを請い、アッラーに立ち返りましょう。「本当にアッラーは悔悟する者を愛される。」（2:222）", pray: "🤲 祈りをお願いする", wa: "WhatsAppで話す", close: "閉じる" },
    zh: { k: "给每个人的提醒", h: "你的出生日期不决定你的命运", p: "无论你出生在十月🦉、十一月🦂♏️的任何一天、处女座，还是一年中的任何一天，星星都不会决定你的遭遇。决定的是你的行为，而安拉的慈悯大于一切罪过。", ay: "“行一个小蚂蚁重的善事者，将见其善报；作一个小蚂蚁重的恶事者，将见其恶报。”", ref: "古兰经 99:7-8", p2: "如果你曾亏待过别人，悔过之门仍然敞开。请求对方原谅，回归安拉。“安拉确实喜爱悔过的人。”（2:222）", pray: "🤲 请求代祷", wa: "在 WhatsApp 上交谈", close: "关闭" },
    ko: { k: "모두를 위한 상기", h: "생년월일이 당신의 운명을 정하지 않습니다", p: "10월🦉에 태어났든, 11월🦂♏️ 어느 날에 태어났든, 처녀자리든, 일 년 중 어느 날 태어났든, 별은 당신에게 일어날 일을 정하지 않습니다. 정하는 것은 당신의 행위이며, 알라의 자비는 모든 죄보다 큽니다.", ay: "“티끌만큼이라도 선을 행한 자는 그것을 볼 것이요, 티끌만큼이라도 악을 행한 자도 그것을 볼 것이다.”", ref: "꾸란 99:7-8", p2: "누군가에게 잘못했다면 회개의 문은 아직 열려 있습니다. 그에게 용서를 구하고 알라께 돌아오세요. “실로 알라께서는 회개하는 자를 사랑하신다.” (2:222)", pray: "🤲 기도 요청하기", wa: "WhatsApp으로 이야기하기", close: "닫기" }
  };
  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  var force = /[?&]reminder\b/.test(location.search);
  if (store("coach-reminder-shown") && !force) return;

  var css = document.createElement("style");
  css.textContent =
    ".rmd{position:fixed;inset:0;z-index:108;display:grid;place-items:center;padding:16px;background:rgba(5,8,18,.78);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);overflow-y:auto}" +
    ".rmd[hidden]{display:none}" +
    ".rmd__card{position:relative;width:min(520px,100%);margin:auto;padding:1.5rem 1.3rem 1.2rem;border-radius:24px;border:1px solid #c9a45c;text-align:center;color:#f3eee3;background:radial-gradient(circle at 50% 0%,rgba(60,90,180,.35),transparent 60%),linear-gradient(180deg,#141d36,#0a0f1e);box-shadow:0 40px 120px -30px rgba(0,0,0,.9);animation:rmdIn .45s cubic-bezier(.22,1,.36,1)}" +
    "@keyframes rmdIn{from{opacity:0;transform:translateY(14px) scale(.97)}}" +
    ".rmd__x{position:absolute;top:.6rem;inset-inline-end:.6rem;width:38px;height:38px;border-radius:50%;border:1px solid rgba(201,164,92,.3);background:transparent;color:#f3eee3;font-size:1.3rem;cursor:pointer}" +
    ".rmd__k{font:600 .66rem 'Manrope',system-ui,sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#e8c87e}" +
    ".rmd h2{font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:1.5rem;line-height:1.3;margin:.4rem 0 .7rem}" +
    ".rmd p{font-size:.94rem;line-height:1.7}" +
    ".rmd__ay{margin:.9rem 0;padding:.9rem 1rem;border-radius:14px;background:rgba(201,164,92,.08)}" +
    ".rmd__ay i{display:block;font-family:'Playfair Display',Georgia,serif;font-size:1.05rem}" +
    ".rmd__ay small{display:block;margin-top:.3rem;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:#8b93a7}" +
    ".rmd__btns{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-top:1rem}" +
    ".rmd__btns a{display:flex;align-items:center;justify-content:center;padding:.85rem .8rem;border-radius:999px;font:600 .9rem 'Manrope',system-ui,sans-serif;text-decoration:none}" +
    ".rmd__pray{background:linear-gradient(135deg,#e8c87e,#c9a45c 55%,#a88540);color:#0a0f1e}" +
    ".rmd__wa{background:#1fa855;color:#fff}" +
    ".rmd__close{margin-top:.8rem;background:none;border:0;color:#8b93a7;text-decoration:underline;cursor:pointer;font:500 .85rem 'Manrope',system-ui,sans-serif}";
  document.head.appendChild(css);

  var box = document.createElement("div");
  box.className = "rmd"; box.hidden = true;
  box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-labelledby", "rmdH");
  document.body.appendChild(box);
  var back = null;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function open() {
    var l = (document.documentElement.lang || "en").slice(0, 2), x = TX[l] || TX.en;
    var home = location.pathname.replace(/[^/]*$/, "");
    box.innerHTML = '<div class="rmd__card"><button type="button" class="rmd__x" aria-label="' + esc(x.close) + '">×</button>' +
      '<span class="rmd__k">☾ ' + esc(x.k) + '</span><h2 id="rmdH">' + esc(x.h) + "</h2><p>" + esc(x.p) + "</p>" +
      '<div class="rmd__ay"><i>' + esc(x.ay) + "</i><small>" + esc(x.ref) + "</small></div><p>" + esc(x.p2) + "</p>" +
      '<div class="rmd__btns"><a class="rmd__pray" href="' + home + '#pray">' + esc(x.pray) + '</a><a class="rmd__wa" href="https://wa.me/' + WA + "?text=" + encodeURIComponent("Assalamu alaikum Adeel Ahmed Rahman! I read the reminder on your site and I'd like to talk.") + '" target="_blank" rel="noopener">' + esc(x.wa) + "</a></div>" +
      '<button type="button" class="rmd__close">' + esc(x.close) + "</button></div>";
    box.querySelector(".rmd__x").onclick = close; box.querySelector(".rmd__close").onclick = close;
    box.querySelector(".rmd__pray").onclick = close;
    back = document.activeElement; box.hidden = false; document.body.style.overflow = "hidden";
    store("coach-reminder-shown", "1");
    box.querySelector(".rmd__pray").focus();
  }
  function close() { box.hidden = true; document.body.style.overflow = ""; if (back && back.focus) back.focus(); }
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  document.addEventListener("keydown", function (e) { if (!box.hidden && e.key === "Escape") close(); });

  function busy() {   // another pop-up, the chat or the contact chooser is open
    return document.querySelector(".welcome:not([hidden]), .xit:not([hidden]), .chat:not([hidden])");
  }
  function attempt() { if (busy()) setTimeout(attempt, 5000); else open(); }
  setTimeout(attempt, force ? 600 : 34000);
})();

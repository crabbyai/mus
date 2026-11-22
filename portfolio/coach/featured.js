/* ============================================================
   Featured hadith: Sahih al-Bukhari 304, pinned on the home page
   (top strip, sidebar, daily section) and on the library, course and
   forum pages. Any element with data-featured="strip" or
   data-featured="card" is filled in. Shown in full, in the visitor's
   language, with the Arabic and a link to the source.
   ============================================================ */
(function () {
  "use strict";
  var REF = "Sahih al-Bukhari 304", URL = "https://sunnah.com/bukhari:304";
  var AR = "عَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ قَالَ: خَرَجَ رَسُولُ اللَّهِ ﷺ فِي أَضْحًى أَوْ فِطْرٍ إِلَى الْمُصَلَّى، فَمَرَّ عَلَى النِّسَاءِ فَقَالَ: «يَا مَعْشَرَ النِّسَاءِ تَصَدَّقْنَ، فَإِنِّي أُرِيتُكُنَّ أَكْثَرَ أَهْلِ النَّارِ». فَقُلْنَ: وَبِمَ يَا رَسُولَ اللَّهِ؟ قَالَ: «تُكْثِرْنَ اللَّعْنَ، وَتَكْفُرْنَ الْعَشِيرَ، مَا رَأَيْتُ مِنْ نَاقِصَاتِ عَقْلٍ وَدِينٍ أَذْهَبَ لِلُبِّ الرَّجُلِ الْحَازِمِ مِنْ إِحْدَاكُنَّ». قُلْنَ: وَمَا نُقْصَانُ دِينِنَا وَعَقْلِنَا يَا رَسُولَ اللَّهِ؟ قَالَ: «أَلَيْسَ شَهَادَةُ الْمَرْأَةِ مِثْلَ نِصْفِ شَهَادَةِ الرَّجُلِ؟» قُلْنَ: بَلَى. قَالَ: «فَذَلِكِ مِنْ نُقْصَانِ عَقْلِهَا، أَلَيْسَ إِذَا حَاضَتْ لَمْ تُصَلِّ وَلَمْ تَصُمْ؟» قُلْنَ: بَلَى. قَالَ: «فَذَلِكِ مِنْ نُقْصَانِ دِينِهَا».";
  var TX = {
    en: { k: "Featured hadith", t: "Abu Sa'id al-Khudri reported: The Messenger of Allah ﷺ went out to the prayer place on Eid al-Adha or Eid al-Fitr. He passed by the women and said: “O women, give charity, for I have been shown that you are the majority of the people of the Fire.” They asked: “Why is that, O Messenger of Allah?” He said: “You curse often and you are ungrateful to your husbands. I have not seen anyone more deficient in intellect and religion than you who can take away the mind of a resolute man.” They asked: “What is the deficiency in our religion and intellect, O Messenger of Allah?” He said: “Is not the testimony of a woman equal to half the testimony of a man?” They said: “Yes.” He said: “That is the deficiency in her intellect. And is it not that when she menstruates she neither prays nor fasts?” They said: “Yes.” He said: “That is the deficiency in her religion.”", more: "Read the full hadith", less: "Show less", src: "Source" },
    ur: { k: "منتخب حدیث", t: "حضرت ابو سعید خدریؓ سے روایت ہے: رسول اللہ ﷺ عید الاضحیٰ یا عید الفطر میں عیدگاہ کی طرف نکلے، عورتوں کے پاس سے گزرے تو فرمایا: ”اے عورتوں کی جماعت! صدقہ کرو، کیونکہ مجھے دکھایا گیا ہے کہ جہنم والوں میں تمہاری اکثریت ہے۔“ انہوں نے عرض کیا: یا رسول اللہ! کس وجہ سے؟ فرمایا: ”تم لعن طعن بہت کرتی ہو اور شوہر کی ناشکری کرتی ہو۔ میں نے عقل اور دین میں ناقص ہونے کے باوجود ایک پختہ ارادے والے مرد کی عقل کو تم میں سے کسی سے بڑھ کر لے جانے والا نہیں دیکھا۔“ انہوں نے عرض کیا: یا رسول اللہ! ہمارے دین اور عقل میں کیا کمی ہے؟ فرمایا: ”کیا عورت کی گواہی مرد کی گواہی کے آدھے کے برابر نہیں؟“ انہوں نے کہا: کیوں نہیں۔ فرمایا: ”یہ اس کی عقل کی کمی ہے۔ اور کیا ایسا نہیں کہ جب وہ حیض میں ہو تو نہ نماز پڑھتی ہے نہ روزہ رکھتی ہے؟“ انہوں نے کہا: کیوں نہیں۔ فرمایا: ”یہ اس کے دین کی کمی ہے۔“", more: "پوری حدیث پڑھیں", less: "کم دکھائیں", src: "حوالہ" },
    ar: { k: "حديث مختار", t: "", more: "اقرأ الحديث كاملًا", less: "عرض أقل", src: "المصدر" },
    fr: { k: "Hadith à la une", t: "Abu Sa'id al-Khudri rapporte : Le Messager d'Allah ﷺ sortit vers le lieu de prière le jour de l'Aïd al-Adha ou de l'Aïd al-Fitr. Il passa près des femmes et dit : « Ô femmes, faites l'aumône, car il m'a été montré que vous êtes la majorité des gens du Feu. » Elles demandèrent : « Pourquoi cela, ô Messager d'Allah ? » Il dit : « Vous maudissez souvent et vous êtes ingrates envers vos époux. Je n'ai vu personne de plus déficient en raison et en religion que vous, capable pourtant de faire perdre la tête à un homme résolu. » Elles demandèrent : « Quelle est la déficience de notre religion et de notre raison, ô Messager d'Allah ? » Il dit : « Le témoignage d'une femme n'équivaut-il pas à la moitié de celui d'un homme ? » Elles dirent : « Si. » Il dit : « Voilà la déficience de sa raison. Et n'est-il pas vrai que, lorsqu'elle a ses règles, elle ne prie pas et ne jeûne pas ? » Elles dirent : « Si. » Il dit : « Voilà la déficience de sa religion. »", more: "Lire le hadith en entier", less: "Réduire", src: "Source" },
    es: { k: "Hadiz destacado", t: "Abu Sa'id al-Judri narró: El Mensajero de Allah ﷺ salió al lugar de oración en el Eid al-Adha o el Eid al-Fitr. Pasó junto a las mujeres y dijo: «Oh mujeres, dad caridad, pues se me ha mostrado que sois la mayoría de la gente del Fuego». Ellas preguntaron: «¿Por qué, oh Mensajero de Allah?». Dijo: «Maldecís a menudo y sois desagradecidas con vuestros esposos. No he visto a nadie más deficiente en intelecto y religión que vosotras capaz de quitarle el juicio a un hombre firme». Preguntaron: «¿Cuál es la deficiencia de nuestra religión y de nuestro intelecto, oh Mensajero de Allah?». Dijo: «¿No equivale el testimonio de una mujer a la mitad del testimonio de un hombre?». Dijeron: «Sí». Dijo: «Esa es la deficiencia de su intelecto. ¿Y no es cierto que, cuando menstrúa, no reza ni ayuna?». Dijeron: «Sí». Dijo: «Esa es la deficiencia de su religión».", more: "Leer el hadiz completo", less: "Mostrar menos", src: "Fuente" },
    ja: { k: "注目のハディース", t: "アブー・サイード・アル＝フドリーは伝えた。アッラーの使徒ﷺは犠牲祭か断食明けの祭りの日に礼拝所へ出かけ、女性たちのそばを通りかかって言った。「女性たちよ、施しをしなさい。わたしは、あなたがたが火獄の住人の大多数であるのを見せられたのだから。」彼女たちは尋ねた。「アッラーの使徒よ、それはなぜですか。」彼は言った。「あなたがたはよく呪いの言葉を口にし、夫に対して恩知らずである。理性と宗教において欠けているのに、意志の固い男の分別を奪うことにかけて、あなたがたの誰かほどの者を見たことがない。」彼女たちは尋ねた。「アッラーの使徒よ、私たちの宗教と理性の欠けとは何ですか。」彼は言った。「女性の証言は男性の証言の半分に等しいのではないか。」彼女たちは言った。「はい。」彼は言った。「それが彼女の理性の欠けである。また、月経の間は礼拝も断食もしないのではないか。」彼女たちは言った。「はい。」彼は言った。「それが彼女の宗教の欠けである。」", more: "ハディースの全文を読む", less: "閉じる", src: "出典" },
    zh: { k: "精选圣训", t: "艾布·赛义德·胡德里传述：安拉的使者ﷺ在宰牲节或开斋节去往礼拜场，路过妇女们时说：“妇女们啊，你们要施舍，因为我被显示你们是火狱居民中的多数。”她们问：“安拉的使者啊，为什么呢？”他说：“你们常常诅咒，并且对丈夫忘恩负义。我没有见过理智和宗教都有欠缺、却比你们中的某些人更能让坚毅的男人失去理智的人。”她们问：“安拉的使者啊，我们的宗教和理智有什么欠缺？”他说：“难道一个妇女的作证不等于一个男人作证的一半吗？”她们说：“是的。”他说：“这就是她理智上的欠缺。难道她在月经期间不是既不礼拜也不斋戒吗？”她们说：“是的。”他说：“这就是她宗教上的欠缺。”", more: "阅读完整圣训", less: "收起", src: "出处" },
    ko: { k: "추천 하디스", t: "아부 사이드 알쿠드리가 전하였다. 알라의 사도ﷺ께서 희생제 혹은 단식종료제 날 예배 장소로 나가시다가 여인들 곁을 지나시며 말씀하셨다. “여인들이여, 자선을 베풀라. 나는 너희가 불지옥 거주자의 다수인 것을 보았노라.” 그들이 물었다. “알라의 사도시여, 어찌하여 그렇습니까?” 그분께서 말씀하셨다. “너희는 저주를 자주 하고 남편에게 배은망덕하다. 이성과 신앙이 부족하면서도 굳건한 남자의 판단력을 너희 중 어떤 이보다 더 빼앗는 자를 나는 보지 못하였다.” 그들이 물었다. “알라의 사도시여, 우리의 신앙과 이성의 부족함이 무엇입니까?” 그분께서 말씀하셨다. “여자의 증언은 남자의 증언의 절반과 같지 않느냐?” 그들이 말하였다. “그렇습니다.” 그분께서 말씀하셨다. “그것이 그녀 이성의 부족함이다. 또 월경 중에는 예배도 단식도 하지 않지 않느냐?” 그들이 말하였다. “그렇습니다.” 그분께서 말씀하셨다. “그것이 그녀 신앙의 부족함이다.”", more: "하디스 전문 읽기", less: "접기", src: "출처" }
  };
  window.FEATURED_HADITH = { ref: REF, url: URL, ar: AR, tx: TX };

  var css = document.createElement("style");
  css.textContent =
    ".fh{position:relative;z-index:2;border:1px solid var(--gold,#c9a45c);border-radius:20px;padding:1.1rem 1.2rem;background:radial-gradient(circle at 0% 0%,rgba(232,200,126,.18),transparent 55%),linear-gradient(160deg,#141d36,#0a0f1e);color:var(--cream,#f3eee3)}" +
    ".fh__k{display:flex;align-items:center;gap:.5rem;font:600 .66rem/1.2 var(--sans,system-ui);letter-spacing:.24em;text-transform:uppercase;color:var(--gold-bright,#e8c87e)}" +
    ".fh__k b{margin-inline-start:auto;font-weight:600;letter-spacing:.06em;text-transform:none;color:var(--muted,#8b93a7)}" +
    ".fh__ar{display:block;font-family:'Noto Naskh Arabic',serif;direction:rtl;text-align:right;color:var(--gold-bright,#e8c87e);font-size:1.12rem;line-height:2;margin:.6rem 0 .3rem}" +
    ".fh__t{font-size:.95rem;line-height:1.75}" +
    ".fh__body{overflow:hidden}" +
    ".fh.is-short .fh__body{max-height:9.5em;-webkit-mask-image:linear-gradient(#000 55%,transparent);mask-image:linear-gradient(#000 55%,transparent)}" +
    ".fh__row{display:flex;flex-wrap:wrap;gap:.8rem;align-items:center;justify-content:space-between;margin-top:.6rem;font-size:.8rem}" +
    ".fh__row button{background:none;border:1px solid var(--gold,#c9a45c);border-radius:999px;padding:.4rem .9rem;color:var(--cream,#f3eee3);font:600 .8rem var(--sans,system-ui);cursor:pointer}" +
    ".fh__row a{color:var(--gold-bright,#e8c87e);border-bottom:1px solid rgba(201,164,92,.3)}" +
    ".fh-strip{max-width:1120px;margin:1.2rem auto 0;padding:0 16px}" +
    ".fh-card{margin-top:1.4rem}" +
    /* top strip: Arabic first, then the full translation on hover or once the visitor scrolls */
    ".fh-strip .fh__body{transition:max-height .45s ease}" +
    ".fh-strip .fh__t{display:none}" +
    ".fh-strip .fh.is-en .fh__ar{display:none}" +
    ".fh-strip .fh.is-en .fh__t{display:block;animation:fhIn .35s ease-out}" +
    ".fh-strip .fh.is-en.is-short .fh__body{max-height:80em;-webkit-mask-image:none;mask-image:none}" +
    ".fh-strip .fh.is-open .fh__ar{display:block}" +
    "@keyframes fhIn{from{opacity:0;transform:translateY(4px)}}" +
    "@media(prefers-reduced-motion:reduce){.fh-strip .fh__body{transition:none}.fh-strip .fh.is-en .fh__t{animation:none}}";
  document.head.appendChild(css);

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function lang() { var l = (document.documentElement.lang || "en").slice(0, 2); return TX[l] ? l : "en"; }

  function render() {
    var l = lang(), x = TX[l];
    [].forEach.call(document.querySelectorAll("[data-featured]"), function (el) {
      var open = el.getAttribute("data-open") === "1", strip = el.getAttribute("data-featured") === "strip";
      var t = x.t || TX.en.t;
      el.innerHTML = '<div class="fh' + (open ? " is-open" : " is-short") + (strip && en ? " is-en" : "") + '" role="note" aria-label="' + esc(x.k + ", " + REF) + '">' +
        '<div class="fh__k">☾ ' + esc(x.k) + "<b>" + REF + "</b></div>" +
        '<div class="fh__body"><span class="fh__ar" lang="ar">' + esc(AR) + "</span>" + (x.t || strip ? '<p class="fh__t"' + (x.t ? "" : ' lang="en"') + ">" + esc(t) + "</p>" : "") + "</div>" +
        '<div class="fh__row"><button type="button" aria-expanded="' + open + '">' + esc(open ? x.less : x.more) + '</button><a href="' + URL + '" target="_blank" rel="noopener">' + esc(x.src) + ": " + REF + " ↗</a></div></div>";
      el.querySelector("button").onclick = function () { el.setAttribute("data-open", open ? "0" : "1"); render(); };
    });
  }
  // Strip: swap the Arabic for the full translation on hover/focus/tap, or as soon as the page is scrolled
  var en = false, hover = false;
  function setEn() {
    var want = hover || (window.scrollY || 0) > 20;
    if (want === en) return; en = want;
    [].forEach.call(document.querySelectorAll('[data-featured="strip"] .fh'), function (f) { f.classList.toggle("is-en", en); });
  }
  window.addEventListener("scroll", setEn, { passive: true });
  document.addEventListener("pointerover", function (e) { var h = !!(e.target.closest && e.target.closest('[data-featured="strip"]')); if (h !== hover) { hover = h; setEn(); } });
  document.addEventListener("focusin", function (e) { if (e.target.closest && e.target.closest('[data-featured="strip"]')) { hover = true; setEn(); } });
  window.renderFeaturedHadith = render;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render); else render();
  // Re-render when the language changes
  if ("MutationObserver" in window) new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();

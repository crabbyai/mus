/* ============================================================
   "Before you go": shown once per visit when someone starts to leave.
   Desktop: the pointer leaves through the top of the window (towards
   the tabs or address bar). Phones: a quick scroll back up after
   reading at least a third of the page. Features Sahih al-Bukhari 304
   (via featured.js) with a link to sunnah.com, plus WhatsApp and the
   free plan. Browsers do not allow opening a site when a tab closes,
   so this is the closest honest equivalent.
   ============================================================ */
(function () {
  "use strict";
  var WA = "16134083945";
  var TX = {
    en: { h: "Before you go…", p: "Take this with you, and message Adeel whenever you're ready.", sun: "Read Bukhari 304 on Sunnah.com", wa: "WhatsApp Adeel", plan: "Free 7-Day Dua Plan", lib: "Qur'an & Hadith Library", stay: "Stay on the site" },
    ar: { h: "قبل أن تغادر…", p: "خذ هذا معك، وراسل عديل متى كنت مستعدًا.", sun: "اقرأ البخاري 304 على Sunnah.com", wa: "راسل عديل على واتساب", plan: "خطة الدعاء المجانية لسبعة أيام", lib: "مكتبة القرآن والحديث", stay: "البقاء في الموقع" },
    ur: { h: "جانے سے پہلے…", p: "یہ ساتھ لے جائیں، اور جب تیار ہوں عدیل کو میسج کریں۔", sun: "بخاری 304 سنہ ڈاٹ کام پر پڑھیں", wa: "عدیل کو واٹس ایپ کریں", plan: "مفت 7 روزہ دعا پلان", lib: "قرآن و حدیث لائبریری", stay: "ویب سائٹ پر رہیں" },
    fr: { h: "Avant de partir…", p: "Emportez ceci avec vous, et écrivez à Adeel quand vous serez prêt.", sun: "Lire Bukhari 304 sur Sunnah.com", wa: "Écrire à Adeel sur WhatsApp", plan: "Plan de dua de 7 jours gratuit", lib: "Bibliothèque Coran et hadith", stay: "Rester sur le site" },
    es: { h: "Antes de irte…", p: "Llévate esto contigo y escribe a Adeel cuando estés listo.", sun: "Leer Bujari 304 en Sunnah.com", wa: "Escribir a Adeel por WhatsApp", plan: "Plan de dua de 7 días gratis", lib: "Biblioteca de Corán y hadiz", stay: "Quedarme en el sitio" },
    ja: { h: "お帰りになる前に…", p: "これを持ち帰り、準備ができたらいつでもアディールに連絡してください。", sun: "Sunnah.comでブハーリー304を読む", wa: "アディールにWhatsApp", plan: "無料7日間ドゥアー・プラン", lib: "クルアーン＆ハディース・ライブラリー", stay: "サイトに戻る" },
    zh: { h: "离开之前…", p: "带上这段话，准备好时随时联系阿迪尔。", sun: "在 Sunnah.com 阅读布哈里 304", wa: "WhatsApp 联系阿迪尔", plan: "免费 7 天祈祷计划", lib: "古兰经与圣训库", stay: "留在网站" },
    ko: { h: "떠나시기 전에…", p: "이 말씀을 가져가시고, 준비되면 언제든 아딜에게 연락하세요.", sun: "Sunnah.com에서 부카리 304 읽기", wa: "아딜에게 WhatsApp", plan: "무료 7일 두아 플랜", lib: "꾸란·하디스 라이브러리", stay: "사이트에 머물기" }
  };
  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  var force = /[?&]exit\b/.test(location.search);   // preview with ?exit
  if (store("coach-exit-shown") && !force) return;
  var base = location.pathname.replace(/[^/]*$/, "");

  var css = document.createElement("style");
  css.textContent =
    ".xit{position:fixed;inset:0;z-index:110;display:grid;place-items:center;padding:16px;background:rgba(5,8,18,.8);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);overflow-y:auto}" +
    ".xit[hidden]{display:none}" +
    ".xit__card{position:relative;width:min(560px,100%);margin:auto;max-height:calc(100vh - 32px);overflow:auto;padding:1.4rem 1.2rem 1.2rem;border-radius:24px;border:1px solid #c9a45c;background:radial-gradient(circle at 50% 0%,rgba(232,200,126,.2),transparent 55%),linear-gradient(180deg,#141d36,#0a0f1e);color:#f3eee3;text-align:center;box-shadow:0 40px 120px -30px rgba(0,0,0,.9)}" +
    ".xit__x{position:absolute;top:.6rem;inset-inline-end:.6rem;width:38px;height:38px;border-radius:50%;border:1px solid rgba(201,164,92,.3);background:transparent;color:#f3eee3;font-size:1.3rem;cursor:pointer}" +
    ".xit h2{font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:1.7rem;margin:.2rem 0 .3rem}" +
    ".xit__p{font-size:.92rem;color:#8b93a7;margin-bottom:.9rem}" +
    ".xit__fh{text-align:start}" +
    ".xit__btns{display:grid;gap:.5rem;margin-top:1rem}" +
    ".xit__btns a,.xit__btns button{display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.85rem 1rem;border-radius:999px;font:600 .92rem 'Manrope',system-ui,sans-serif;text-decoration:none;cursor:pointer}" +
    ".xit__sun{background:linear-gradient(135deg,#e8c87e,#c9a45c 55%,#a88540);color:#0a0f1e;border:0}" +
    ".xit__wa{background:#1fa855;color:#fff;border:0}" +
    ".xit__ghost{background:transparent;color:#f3eee3;border:1px solid #c9a45c}" +
    ".xit__stay{background:none;border:0;color:#8b93a7;text-decoration:underline}" +
    ".xit__row{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}";
  document.head.appendChild(css);

  var box = document.createElement("div");
  box.className = "xit"; box.hidden = true;
  box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-labelledby", "xitH");
  document.body.appendChild(box);

  function fill() {
    var l = (document.documentElement.lang || "en").slice(0, 2), x = TX[l] || TX.en;
    var msg = encodeURIComponent("Assalamu alaikum Adeel Ahmed Rahman! I was on your site and I'd like to talk.");
    var plan = encodeURIComponent("Assalamu alaikum Adeel Ahmed Rahman! Please send me the free 7-Day Dua Plan.");
    box.innerHTML = '<div class="xit__card"><button type="button" class="xit__x" aria-label="Close">×</button>' +
      '<h2 id="xitH">☾ ' + x.h + '</h2><p class="xit__p">' + x.p + "</p>" +
      '<div class="xit__fh" data-featured="card" data-open="0"></div>' +
      '<div class="xit__btns"><a class="xit__sun" href="https://sunnah.com/bukhari:304" target="_blank" rel="noopener">📖 ' + x.sun + " ↗</a>" +
      '<a class="xit__wa" href="https://wa.me/' + WA + "?text=" + msg + '" target="_blank" rel="noopener">' + x.wa + "</a>" +
      '<div class="xit__row"><a class="xit__ghost" href="https://wa.me/' + WA + "?text=" + plan + '" target="_blank" rel="noopener">' + x.plan + '</a><a class="xit__ghost" href="' + base + 'library.html">' + x.lib + "</a></div>" +
      '<button type="button" class="xit__stay">' + x.stay + "</button></div></div>";
    box.querySelector(".xit__x").onclick = close;
    box.querySelector(".xit__stay").onclick = close;
    if (window.renderFeaturedHadith) window.renderFeaturedHadith();
  }
  var back = null;
  function open() {
    if (!box.hidden || store("coach-exit-shown")) return;
    var other = document.querySelector(".welcome:not([hidden])");   // never on top of another pop-up
    if (other) return;
    store("coach-exit-shown", "1");
    back = document.activeElement; fill(); box.hidden = false; document.body.style.overflow = "hidden";
    box.querySelector(".xit__sun").focus();
  }
  function close() { box.hidden = true; document.body.style.overflow = ""; if (back && back.focus) back.focus(); }
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  document.addEventListener("keydown", function (e) { if (!box.hidden && e.key === "Escape") close(); });

  var start = Date.now(), MIN = 8000;   // give people time to read first
  // Desktop: pointer leaves through the top edge
  document.addEventListener("mouseout", function (e) {
    if (e.relatedTarget || e.toElement) return;
    if (e.clientY <= 0 && Date.now() - start > MIN) open();
  });
  // Phones: quick scroll back up after reading a third of the page
  var lastY = window.scrollY, lastT = Date.now(), deepest = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY, t = Date.now(), h = document.documentElement.scrollHeight - innerHeight;
    if (h > 0) deepest = Math.max(deepest, y / h);
    if (deepest > 0.33 && lastY - y > 500 && t - lastT < 700 && t - start > MIN) open();
    if (t - lastT > 700 || y > lastY) { lastY = y; lastT = t; }
  }, { passive: true });
  if (force) setTimeout(function () { store("coach-exit-shown", ""); try { sessionStorage.removeItem("coach-exit-shown"); } catch (e) {} open(); }, 600);
  window.coachOpenExit = open;
})();

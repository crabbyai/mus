/* ============================================================
   Live chat. The floating WhatsApp button opens a chat panel on the
   page: quick topics, a greeting from Adeel, and a message box. "Send"
   continues the conversation on Adeel's WhatsApp, where he replies in
   person. If a Tawk.to property is set in coach/config.js, that live
   chat loads instead, so visitors can chat without leaving the site.
   ============================================================ */
(function () {
  "use strict";
  var C = window.COACH || {}, N = C.whatsapp || "16134083945";

  // Optional: Tawk.to live chat (free). Fill COACH.tawk = { propertyId, widgetId } in coach/config.js.
  if (C.tawk && C.tawk.propertyId && C.tawk.widgetId) {
    window.Tawk_API = window.Tawk_API || {}; window.Tawk_LoadStart = new Date();
    var s = document.createElement("script");
    s.async = true; s.src = "https://embed.tawk.to/" + C.tawk.propertyId + "/" + C.tawk.widgetId; s.charset = "UTF-8"; s.setAttribute("crossorigin", "*");
    document.head.appendChild(s);
    var fab = document.querySelector(".fab-wa"); if (fab) fab.style.display = "none";
    return;
  }

  var TX = {
    en: { title: "Chat with Adeel", sub: "Replies personally on WhatsApp", hi: "Assalamu alaikum! 👋 I'm Adeel Ahmed Rahman.", hi2: "What would you like help with today? Pick a topic or type your message.", time: "Adeel's time in Canada", ph: "Type your message…", send: "Send", sent: "WhatsApp is opening with your message. I'll reply there, in sha Allah. If it didn't open, message +1 613 408 3945.", ok: "Got it. Add anything you'd like below, then tap Send.", q: [["pray", "🤲 Request a prayer"], ["plan", "🎁 Free 7-Day Dua Plan"], ["king", "👑 The King's Table"], ["salah", "🕌 Free salah lessons"], ["ask", "💬 Ask a question"], ["pk", "🇵🇰 Paying from Pakistan"]], m: { pray: "Please make dua for me. I'd like you to pray for: ", plan: "Please send me the free 7-Day Dua Plan.", king: "I want this so badly: The King's Table, lifetime membership ($1,111). Please tell me how to join.", salah: "I'd like your free salah lessons. Please teach me how to pray.", ask: "I have a question: ", pk: "I'm in Pakistan. How can I pay for a session or program?" } },
    ur: { title: "عدیل سے بات کریں", sub: "واٹس ایپ پر خود جواب دیتے ہیں", hi: "السلام علیکم! 👋 میں عدیل احمد رحمان ہوں۔", hi2: "آج آپ کو کس چیز میں مدد چاہیے؟ کوئی موضوع چنیں یا اپنا پیغام لکھیں۔", time: "کینیڈا میں عدیل کا وقت", ph: "اپنا پیغام لکھیں…", send: "بھیجیں", sent: "واٹس ایپ آپ کے پیغام کے ساتھ کھل رہا ہے۔ میں وہیں جواب دوں گا، ان شاء اللہ۔ اگر نہ کھلے تو ‎+1 613 408 3945 پر میسج کریں۔", ok: "ٹھیک ہے۔ نیچے جو چاہیں شامل کریں، پھر بھیجیں دبائیں۔", q: [["pray", "🤲 دعا کی درخواست"], ["plan", "🎁 مفت 7 روزہ دعا پلان"], ["king", "👑 کنگز ٹیبل"], ["salah", "🕌 مفت نماز سیکھیں"], ["ask", "💬 سوال پوچھیں"], ["pk", "🇵🇰 پاکستان سے ادائیگی"]], m: { pray: "Assalam o Alaikum Adeel bhai, meray liye dua karein. Is cheez ke liye dua karein: ", plan: "Mujhe muft 7-Day Dua Plan bhej dein.", king: "I want this so badly: The King's Table ($1,111). Join karne ka tareeqa batayein.", salah: "Mujhe muft namaz seekhni hai. Please sikhayein.", ask: "Mera sawal hai: ", pk: "Main Pakistan mein hoon. Session ya program ki payment kaise karoon?" } },
    ar: { title: "تحدّث مع عديل", sub: "يردّ بنفسه على واتساب", hi: "السلام عليكم! 👋 أنا عديل أحمد رحمان.", hi2: "بماذا تحب أن أساعدك اليوم؟ اختر موضوعًا أو اكتب رسالتك.", time: "توقيت عديل في كندا", ph: "اكتب رسالتك…", send: "إرسال", sent: "يُفتح واتساب برسالتك. سأردّ هناك إن شاء الله. إن لم يُفتح، راسل ‎+1 613 408 3945.", ok: "حسنًا. أضف ما تشاء أدناه ثم اضغط إرسال.", q: [["pray", "🤲 اطلب دعاءً"], ["plan", "🎁 خطة الدعاء المجانية"], ["king", "👑 مائدة الملك"], ["salah", "🕌 تعلّم الصلاة مجانًا"], ["ask", "💬 اطرح سؤالًا"], ["pk", "🇵🇰 الدفع من باكستان"]] },
    fr: { title: "Discuter avec Adeel", sub: "Répond lui-même sur WhatsApp", hi: "Assalamu alaykum ! 👋 Je suis Adeel Ahmed Rahman.", hi2: "Comment puis-je vous aider aujourd'hui ? Choisissez un sujet ou écrivez votre message.", time: "Heure d'Adeel au Canada", ph: "Écrivez votre message…", send: "Envoyer", sent: "WhatsApp s'ouvre avec votre message. Je vous répondrai là-bas, in sha Allah. S'il ne s'ouvre pas, écrivez au +1 613 408 3945.", ok: "C'est noté. Ajoutez ce que vous voulez ci-dessous, puis touchez Envoyer.", q: [["pray", "🤲 Demander une prière"], ["plan", "🎁 Plan de dua gratuit"], ["king", "👑 La Table du Roi"], ["salah", "🕌 Apprendre la salat (gratuit)"], ["ask", "💬 Poser une question"], ["pk", "🇵🇰 Payer depuis le Pakistan"]] },
    es: { title: "Habla con Adeel", sub: "Responde personalmente por WhatsApp", hi: "¡Assalamu alaikum! 👋 Soy Adeel Ahmed Rahman.", hi2: "¿En qué te puedo ayudar hoy? Elige un tema o escribe tu mensaje.", time: "Hora de Adeel en Canadá", ph: "Escribe tu mensaje…", send: "Enviar", sent: "WhatsApp se está abriendo con tu mensaje. Te responderé allí, in sha Allah. Si no se abre, escribe al +1 613 408 3945.", ok: "Entendido. Añade lo que quieras abajo y pulsa Enviar.", q: [["pray", "🤲 Pedir una oración"], ["plan", "🎁 Plan de dua gratis"], ["king", "👑 La Mesa del Rey"], ["salah", "🕌 Aprender el salat gratis"], ["ask", "💬 Hacer una pregunta"], ["pk", "🇵🇰 Pagar desde Pakistán"]] },
    ja: { title: "アディールとチャット", sub: "WhatsAppで本人が返信します", hi: "アッサラーム・アライクム！👋 Adeel Ahmed Rahmanです。", hi2: "今日はどんなお手伝いをしましょうか？テーマを選ぶか、メッセージを入力してください。", time: "カナダのアディールの時刻", ph: "メッセージを入力…", send: "送信", sent: "メッセージ付きでWhatsAppが開きます。そちらで返信します、インシャーアッラー。開かない場合は +1 613 408 3945 へ。", ok: "承知しました。下に追記して送信をタップしてください。", q: [["pray", "🤲 祈りをお願いする"], ["plan", "🎁 無料ドゥアー・プラン"], ["king", "👑 王の食卓"], ["salah", "🕌 無料で礼拝を学ぶ"], ["ask", "💬 質問する"], ["pk", "🇵🇰 パキスタンからの支払い"]] },
    zh: { title: "与阿迪尔聊天", sub: "在 WhatsApp 上亲自回复", hi: "愿你平安！👋 我是 Adeel Ahmed Rahman。", hi2: "今天想得到什么帮助？选择一个主题或输入你的消息。", time: "阿迪尔在加拿大的时间", ph: "输入你的消息…", send: "发送", sent: "WhatsApp 正在打开并带上你的消息。我会在那里回复，因沙安拉。如未打开，请发消息至 +1 613 408 3945。", ok: "好的。在下面补充任何内容，然后点击发送。", q: [["pray", "🤲 请求代祷"], ["plan", "🎁 免费祈祷计划"], ["king", "👑 国王之席"], ["salah", "🕌 免费学礼拜"], ["ask", "💬 提问"], ["pk", "🇵🇰 从巴基斯坦付款"]] },
    ko: { title: "아딜과 채팅", sub: "WhatsApp으로 직접 답장합니다", hi: "앗살라무 알라이쿰! 👋 저는 Adeel Ahmed Rahman입니다.", hi2: "오늘 무엇을 도와드릴까요? 주제를 고르거나 메시지를 입력하세요.", time: "캐나다의 아딜 시간", ph: "메시지를 입력하세요…", send: "보내기", sent: "메시지와 함께 WhatsApp이 열립니다. 그곳에서 답장드릴게요, 인샤알라. 열리지 않으면 +1 613 408 3945로 연락하세요.", ok: "알겠습니다. 아래에 덧붙이고 보내기를 누르세요.", q: [["pray", "🤲 기도 요청"], ["plan", "🎁 무료 두아 플랜"], ["king", "👑 왕의 식탁"], ["salah", "🕌 무료 예배 배우기"], ["ask", "💬 질문하기"], ["pk", "🇵🇰 파키스탄에서 결제"]] }
  };
  function L() { var l = (document.documentElement.lang || "en").slice(0, 2); return TX[l] ? l : "en"; }
  function x() { return TX[L()]; }
  function msgFor(k) { return (x().m || TX.en.m)[k] || TX.en.m[k]; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var base = location.pathname.replace(/[^/]*$/, "");

  var css = document.createElement("style");
  css.textContent =
    ".chat{position:fixed;z-index:60;inset-inline-end:16px;bottom:calc(84px + env(safe-area-inset-bottom));width:min(380px,calc(100vw - 32px));max-height:min(620px,calc(100vh - 120px));display:flex;flex-direction:column;border-radius:22px;overflow:hidden;border:1px solid #c9a45c;background:#0a0f1e;color:#f3eee3;box-shadow:0 30px 80px -20px rgba(0,0,0,.85);font-family:'Manrope',system-ui,sans-serif;transform-origin:bottom right;animation:chatIn .3s cubic-bezier(.22,1,.36,1)}" +
    "html[dir=rtl] .chat{transform-origin:bottom left}" +
    ".chat[hidden]{display:none}" +
    "@keyframes chatIn{from{opacity:0;transform:translateY(12px) scale(.97)}}" +
    ".chat__hd{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem;background:linear-gradient(135deg,#1b2645,#0e1528);border-bottom:1px solid rgba(201,164,92,.25)}" +
    ".chat__hd img{width:42px;height:42px;border-radius:50%;object-fit:cover;object-position:50% 20%;border:2px solid #c9a45c}" +
    ".chat__hd b{display:block;font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:1.05rem}" +
    ".chat__hd small{display:flex;align-items:center;gap:.35rem;color:#8b93a7;font-size:.74rem}" +
    ".chat__hd small i{width:8px;height:8px;border-radius:50%;background:#1fa855;display:inline-block}" +
    ".chat__x{margin-inline-start:auto;width:34px;height:34px;border-radius:50%;border:1px solid rgba(201,164,92,.3);background:transparent;color:#f3eee3;font-size:1.2rem;cursor:pointer}" +
    ".chat__body{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.55rem;background:radial-gradient(circle at 50% 0%,rgba(232,200,126,.08),transparent 60%)}" +
    ".chat__time{align-self:center;font-size:.7rem;color:#8b93a7;padding:.2rem .6rem;border:1px solid rgba(201,164,92,.2);border-radius:999px}" +
    ".bub{max-width:85%;padding:.6rem .85rem;border-radius:16px;font-size:.92rem;line-height:1.5;white-space:pre-wrap}" +
    ".bub--a{align-self:flex-start;background:#18223f;border:1px solid rgba(201,164,92,.25);border-start-start-radius:4px}" +
    ".bub--u{align-self:flex-end;background:#1fa855;color:#fff;border-start-end-radius:4px}" +
    ".typing{align-self:flex-start;display:flex;gap:4px;padding:.7rem .9rem;border-radius:16px;background:#18223f}" +
    ".typing i{width:7px;height:7px;border-radius:50%;background:#e8c87e;animation:blink 1.2s infinite}" +
    ".typing i:nth-child(2){animation-delay:.2s}.typing i:nth-child(3){animation-delay:.4s}" +
    "@keyframes blink{0%,80%,100%{opacity:.25}40%{opacity:1}}" +
    ".chat__q{display:flex;flex-wrap:wrap;gap:.4rem}" +
    ".chat__q button{padding:.45rem .75rem;border-radius:999px;border:1px solid #c9a45c;background:transparent;color:#f3eee3;font:500 .82rem 'Manrope',system-ui,sans-serif;cursor:pointer}" +
    ".chat__q button:hover{background:rgba(201,164,92,.15)}" +
    ".chat__ft{display:flex;gap:.5rem;align-items:flex-end;padding:.7rem;border-top:1px solid rgba(201,164,92,.2);background:#0e1528}" +
    ".chat__ft textarea{flex:1;resize:none;min-height:44px;max-height:120px;padding:.7rem .8rem;border-radius:14px;border:1px solid rgba(201,164,92,.3);background:#0a0f1e;color:#f3eee3;font:400 .95rem 'Manrope',system-ui,sans-serif}" +
    ".chat__ft textarea:focus{outline:none;border-color:#e8c87e}" +
    ".chat__ft button{flex:none;height:44px;padding:0 1rem;border-radius:14px;border:0;background:#1fa855;color:#fff;font:700 .9rem system-ui,sans-serif;cursor:pointer;display:flex;align-items:center;gap:.4rem}" +
    ".chat__ft button svg{width:18px;height:18px;fill:#fff}" +
    ".chat__note{padding:0 .9rem .6rem;background:#0e1528;font-size:.68rem;color:#8b93a7;text-align:center}" +
    "@media(max-width:480px){.chat{inset-inline-end:8px;width:calc(100vw - 16px);bottom:calc(76px + env(safe-area-inset-bottom))}}";
  document.head.appendChild(css);

  var panel = document.createElement("div");
  panel.className = "chat"; panel.hidden = true;
  panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Chat with Adeel Ahmed Rahman");
  document.body.appendChild(panel);
  var started = false, body, ta;

  function bubble(t, who) { var b = document.createElement("div"); b.className = "bub bub--" + who; b.textContent = t; body.appendChild(b); body.scrollTop = body.scrollHeight; return b; }
  function reply(t, cb) {
    var ty = document.createElement("div"); ty.className = "typing"; ty.innerHTML = "<i></i><i></i><i></i>"; body.appendChild(ty); body.scrollTop = body.scrollHeight;
    setTimeout(function () { ty.remove(); bubble(t, "a"); if (cb) cb(); }, 650);
  }
  function caTime() { try { return new Date().toLocaleTimeString("en-US", { timeZone: "America/Toronto", hour: "numeric", minute: "2-digit" }); } catch (e) { return ""; } }
  function build() {
    var t = x();
    panel.innerHTML = '<div class="chat__hd"><img src="' + base + 'coach/assets/lobby-3.jpg" alt=""><div><b>' + esc(t.title) + "</b><small><i></i>" + esc(t.sub) + '</small></div><button type="button" class="chat__x" aria-label="Close">×</button></div>' +
      '<div class="chat__body" aria-live="polite"></div>' +
      '<div class="chat__ft"><textarea rows="1" aria-label="' + esc(t.ph) + '" placeholder="' + esc(t.ph) + '"></textarea><button type="button" class="chat__send"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 21 23 12 2 3v7l15 2-15 2z"/></svg>' + esc(t.send) + "</button></div>" +
      '<div class="chat__note">WhatsApp +1 613 408 3945 · @PakistaniMangoes</div>';
    body = panel.querySelector(".chat__body"); ta = panel.querySelector("textarea");
    panel.querySelector(".chat__x").onclick = close;
    panel.querySelector(".chat__send").onclick = send;
    ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });
    ta.addEventListener("input", function () { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 120) + "px"; });
    var tm = caTime(); if (tm) { var d = document.createElement("div"); d.className = "chat__time"; d.textContent = t.time + " · " + tm; body.appendChild(d); }
    reply(t.hi, function () {
      reply(t.hi2, function () {
        var q = document.createElement("div"); q.className = "chat__q";
        q.innerHTML = t.q.map(function (o) { return '<button type="button" data-k="' + o[0] + '">' + esc(o[1]) + "</button>"; }).join("");
        q.addEventListener("click", function (e) {
          var b = e.target.closest("button[data-k]"); if (!b) return;
          bubble(b.textContent, "u");
          ta.value = msgFor(b.getAttribute("data-k")); ta.dispatchEvent(new Event("input"));
          reply(x().ok, function () { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); });
        });
        body.appendChild(q); body.scrollTop = body.scrollHeight;
      });
    });
  }
  function send() {
    var v = ta.value.trim(); if (!v) { ta.focus(); return; }
    bubble(v, "u"); ta.value = ""; ta.style.height = "auto";
    var text = "Assalamu alaikum Adeel Ahmed Rahman! " + v + "\n\n(From the website chat" + (L() !== "en" ? ", language: " + L() : "") + ")";
    window.open("https://wa.me/" + N + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    reply(x().sent);
  }
  var lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    if (!started) { build(); started = true; }
    panel.hidden = false; setTimeout(function () { if (ta) ta.focus(); }, 50);
  }
  function close() { panel.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  document.addEventListener("keydown", function (e) { if (!panel.hidden && e.key === "Escape") close(); });
  // Rebuild in the new language if the visitor switches before chatting
  if ("MutationObserver" in window) new MutationObserver(function () { if (started && panel.hidden) { started = false; } }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  // The floating WhatsApp button becomes the chat launcher
  [].forEach.call(document.querySelectorAll(".fab-wa"), function (a) {
    a.setAttribute("aria-haspopup", "dialog");
    a.addEventListener("click", function (e) { e.preventDefault(); if (panel.hidden) open(); else close(); });
  });
  [].forEach.call(document.querySelectorAll(".js-chat"), function (a) { a.addEventListener("click", function (e) { e.preventDefault(); open(); }); });
  window.coachOpenChat = open;
  if (/[?&]chat\b/.test(location.search)) setTimeout(open, 500);
})();

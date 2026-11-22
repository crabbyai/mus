/* A special welcome for Arab visitors: Arabic in the device languages, or an Arab-country time zone */
(function () {
  "use strict";
  var langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""]).join(",").toLowerCase();
  var tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
  var ARAB_TZ = /^(Asia\/(Riyadh|Dubai|Qatar|Kuwait|Bahrain|Muscat|Baghdad|Amman|Beirut|Damascus|Aden|Gaza|Hebron)|Africa\/(Cairo|Casablanca|Algiers|Tunis|Tripoli|Khartoum|Nouakchott)|Indian\/Comoro)$/;
  var arab = /(^|,)ar(-|,|$)/.test(langs) || ARAB_TZ.test(tz);
  if (!arab) return;
  document.documentElement.classList.add("is-arab");
  var shown = false; try { shown = sessionStorage.getItem("coach-arab-welcome"); } catch (e) {}
  if (shown) return;
  var css = document.createElement("style");
  css.textContent = ".arw{position:fixed;left:50%;top:84px;z-index:120;transform:translate(-50%,-20px);opacity:0;width:min(560px,calc(100vw - 24px));padding:1rem 1.2rem;border-radius:20px;border:1px solid #e8c87e;background:linear-gradient(160deg,#0f2a1f,#08160f);color:#f6efe0;text-align:center;font-family:'Noto Naskh Arabic',serif;box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 30px rgba(232,200,126,.25);transition:opacity .5s,transform .5s}" +
    ".arw.on{opacity:1;transform:translate(-50%,0)}.arw b{display:block;font-size:1.6rem;color:#ffe7a3;margin-bottom:.3rem}.arw p{margin:.2rem 0 .7rem;font-size:1.08rem;line-height:1.8}" +
    ".arw .row{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap}.arw button,.arw a{border:0;border-radius:999px;padding:.55rem 1.1rem;font:700 .95rem 'Noto Naskh Arabic',system-ui,sans-serif;cursor:pointer;text-decoration:none}" +
    ".arw .go{background:linear-gradient(135deg,#ffe7a3,#c9a45c);color:#1a1206}.arw .wa{background:#25d366;color:#04210f}.arw .x{background:transparent;color:#bfe9cc;border:1px solid rgba(191,233,204,.4)}";
  document.head.appendChild(css);
  var el = document.createElement("div"); el.className = "arw"; el.setAttribute("role", "dialog"); el.setAttribute("dir", "rtl"); el.setAttribute("lang", "ar");
  el.innerHTML = "<b>أهلاً وسهلاً بكم يا أهلنا العرب 🌙</b><p>السلام عليكم ورحمة الله وبركاته. يسعدنا ويشرّفنا وجودكم هنا، فأنتم أهل لغة القرآن الكريم. نرحّب بكم ترحيباً خاصاً من القلب.</p>" +
    '<div class="row"><button type="button" class="go">عرض الموقع بالعربية</button><a class="wa" href="https://wa.me/16134083945?text=' + encodeURIComponent("السلام عليكم أخي عديل، أتواصل معك من موقعك 🌙") + '" target="_blank" rel="noopener">تواصل عبر واتساب</a><button type="button" class="x">إغلاق</button></div>';
  document.body.appendChild(el);
  function close() { el.classList.remove("on"); setTimeout(function () { el.remove(); }, 500); try { sessionStorage.setItem("coach-arab-welcome", "1"); } catch (e) {} }
  el.querySelector(".go").addEventListener("click", function () { if (window.coachSetLang) window.coachSetLang("ar"); close(); });
  el.querySelector(".x").addEventListener("click", close); el.querySelector(".wa").addEventListener("click", close);
  setTimeout(function () { el.classList.add("on"); }, 1800);
})();

/* Multani Mangoes — countdown, variety & country pickers, pre-order form. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  /* Days until the season opens (Sindhri arrives around the end of May). */
  function countdown() {
    var now = new Date(), y = now.getFullYear();
    var open = new Date(y, 4, 25), close = new Date(y, 8, 10); // ~25 May – ~10 Sep
    var el = $("cdDays"), label = document.querySelector(".countdown__label");
    if (now >= open && now <= close) { label.textContent = "Mango season is"; el.textContent = "ON"; document.querySelector(".countdown__u").textContent = "now — order today"; return; }
    if (now > close) open = new Date(y + 1, 4, 25);
    el.textContent = Math.ceil((open - now) / 864e5);
  }
  countdown();

  /* Per-country ordering notes. Kept general on purpose: prices, windows and
     paperwork are confirmed per city before anyone pays. */
  var COUNTRIES = {
    "Canada": ["Toronto, Mississauga, Brampton, Calgary, Vancouver, Montreal, Ottawa and more", "Delivered to your door or ready to collect, depending on your city", "Prices in Canadian dollars, sent before the season opens"],
    "USA": ["Houston, New York / New Jersey, Chicago, the Bay Area, Dallas and more", "Shipments prepared for US import rules, including any required treatment", "Prices in US dollars, sent before the season opens"],
    "UK": ["London, Birmingham, Manchester, Bradford, Glasgow and more", "Delivered to your door across the UK where couriers can reach", "Prices in pounds, sent before the season opens"],
    "Australia": ["Sydney, Melbourne, Brisbane, Perth, Adelaide and more", "Australia has strict biosecurity rules — shipments are prepared to meet them", "Prices in Australian dollars, sent before the season opens"],
    "UAE (Dubai)": ["Dubai, Sharjah, Abu Dhabi and the rest of the Emirates", "The shortest flight from Pakistan — the freshest boxes we send", "Prices in dirhams, sent before the season opens"]
  };
  function showCountry(c) {
    document.querySelectorAll(".country").forEach(function (b) { var on = b.dataset.country === c; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
    $("cinfo").innerHTML = "<h3>Multani mangoes in " + c.replace(" (Dubai)", " · Dubai") + "</h3><ul>" + COUNTRIES[c].map(function (t) { return "<li>" + t + "</li>"; }).join("") +
      '</ul><a class="btn btn--mango btn--sm" href="#order" data-country-pick="' + c + '">Reserve for ' + c.replace(" (Dubai)", "") + " →</a>";
  }
  $("countries").addEventListener("click", function (e) { var b = e.target.closest("[data-country]"); if (b) showCountry(b.dataset.country); });
  showCountry("Canada");

  /* Pickers that pre-fill the form */
  document.addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-pick]"))) {
      var v = t.dataset.pick;
      t.classList.add("is-on"); t.textContent = "✓ Added to your order";
    }

  });

  /* Order form: boxes per item, validate, save a private copy, open WhatsApp with the order. */
  var form = $("orderForm");
  function total() { var t = 0; form.querySelectorAll(".oq input").forEach(function (i) { t += Math.max(0, parseInt(i.value, 10) || 0); }); $("oqTot").textContent = t; return t; }
  function addBox(item, n) { var row = form.querySelector('.oq__row[data-item="' + item + '"]'); if (!row) return; var i = row.querySelector("input"); i.value = Math.min(200, Math.max(0, (parseInt(i.value, 10) || 0) + n)); row.classList.toggle("on", +i.value > 0); total(); }
  form.addEventListener("click", function (e) { var b = e.target.closest("[data-iq]"); if (b) addBox(b.closest(".oq__row").dataset.item, Number(b.dataset.iq)); });
  form.addEventListener("input", function (e) { if (e.target.closest(".oq")) { e.target.closest(".oq__row").classList.toggle("on", +e.target.value > 0); total(); } });
  form.addEventListener("reset", function () { setTimeout(function () { form.querySelectorAll(".oq__row").forEach(function (r) { r.classList.remove("on"); }); total(); $("formOk").hidden = true; }, 0); });
  document.addEventListener("click", function (e) { var t = e.target.closest("[data-pick]"); if (t) { var row = form.querySelector('.oq__row[data-item="' + t.dataset.pick + '"]'); if (row && !(+row.querySelector("input").value)) addBox(t.dataset.pick, 1); } });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("formErr"), bad = [];
    form.querySelectorAll("input[required]:not([type=radio]),textarea[required]").forEach(function (f) { var ok = f.type === "checkbox" ? f.checked : f.value.trim() !== ""; f.setAttribute("aria-invalid", !ok); if (!ok) bad.push(f); });
    var lines = []; form.querySelectorAll(".oq__row").forEach(function (r) { var n = parseInt(r.querySelector("input").value, 10) || 0; if (n > 0) lines.push(r.dataset.item + " × " + n); });
    if (bad.length || !lines.length) { err.textContent = !lines.length && !bad.length ? "Add at least one box." : "Please fill in the required fields (*)" + (lines.length ? "." : " and add at least one box."); err.hidden = false; (bad[0] || form.querySelector(".oq input")).focus(); return; }
    err.hidden = true;
    var f = new FormData(form);
    var msg = ["Assalam-o-alaikum Adeel Rahman — Multani Mangoes order 🥭",
      "Name: " + f.get("name"), "WhatsApp: " + f.get("phone"), f.get("email") ? "Email: " + f.get("email") : "",
      "Order:", lines.map(function (l) { return "• " + l + " box(es)"; }).join("\n"), "Total: " + total() + " boxes",
      "Pickup: " + f.get("pickup"), "Payment: Interac e-Transfer to siradeelahmedrahman@yahoo.ca" + (f.get("ref") ? " (ref: " + f.get("ref") + ")" : ""),
      f.get("notes") ? "Notes: " + f.get("notes") : ""].filter(Boolean).join("\n");
    // a private copy, readable only by Adeel (same write-only store as the site's contacts)
    var DB = ((window.COACH && window.COACH.live && window.COACH.live.databaseURL) || "").replace(/\/+$/, "");
    if (DB) fetch(DB + "/contacts/o" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6) + ".json", { method: "PUT", body: JSON.stringify({ kind: "mango-order", n: String(f.get("name")).slice(0, 80), w: String(f.get("phone")).slice(0, 20), e: String(f.get("email") || "").slice(0, 80), items: lines.join("; ").slice(0, 400), ref: String(f.get("ref") || "").slice(0, 80), note: String(f.get("notes") || "").slice(0, 500), t: { ".sv": "timestamp" } }) }).catch(function () {});
    window.open("https://wa.me/16134083945?text=" + encodeURIComponent(msg), "_blank", "noopener");
    $("formOk").hidden = false; $("formOk").scrollIntoView({ block: "center", behavior: "smooth" });
  });

  /* Private visit counting (Cloudflare Web Analytics, no cookies). */
  var tok = ((document.querySelector('meta[name="cf-beacon-token"]') || {}).content || "").trim();
  if (/^[a-f0-9]{32}$/i.test(tok)) {
    var s = document.createElement("script");
    s.defer = true; s.src = "https://static.cloudflareinsights.com/beacon.min.js";
    s.setAttribute("data-cf-beacon", JSON.stringify({ token: tok }));
    document.head.appendChild(s);
  }
})();

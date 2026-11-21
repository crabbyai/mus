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
      document.querySelectorAll('input[name="variety"]').forEach(function (c) { if (c.value === v) c.checked = true; });
      t.classList.add("is-on"); t.textContent = "✓ Added to your order";
    }
    if ((t = e.target.closest("[data-country-pick]"))) $("fCountry").value = t.dataset.countryPick;
    if ((t = e.target.closest("[data-type]"))) $("fType").value = t.dataset.type;
    if ((t = e.target.closest("[data-q]"))) {
      var q = $("fBoxes"); q.value = Math.min(500, Math.max(1, (parseInt(q.value, 10) || 1) + Number(t.dataset.q)));
    }
  });

  /* Pre-order: validate, open WhatsApp with the order (the inbox connector saves a copy). */
  var form = $("orderForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("formErr"), bad = [];
    form.querySelectorAll("[required]").forEach(function (f) { var ok = f.value.trim() !== ""; f.setAttribute("aria-invalid", !ok); if (!ok) bad.push(f); });
    var vars = Array.prototype.map.call(form.querySelectorAll('input[name="variety"]:checked'), function (c) { return c.value; });
    if (!vars.length) bad.push(form.querySelector('input[name="variety"]'));
    if (bad.length) { err.textContent = !vars.length && bad.length === 1 ? "Pick at least one variety." : "Please fill in your name, phone, country and city."; err.hidden = false; bad[0].focus(); return; }
    err.hidden = true;
    var f = new FormData(form);
    var msg = ["Assalam-o-alaikum Adeel — mango pre-order for summer 2027",
      "Name: " + f.get("name"), "Phone: " + f.get("phone"), f.get("email") ? "Email: " + f.get("email") : "",
      "Deliver to: " + f.get("city") + ", " + f.get("country"), "Order: " + f.get("type"),
      "Varieties: " + vars.join(", "), "Boxes: " + f.get("boxes"), f.get("notes") ? "Notes: " + f.get("notes") : ""].filter(Boolean).join("\n");
    window.open("https://wa.me/16134083945?text=" + encodeURIComponent(msg), "_blank", "noopener");
    $("formOk").hidden = false;
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

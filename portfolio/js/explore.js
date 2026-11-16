/* ============================================================
   EXPLORE — the city, the way you'd actually look at it
   ------------------------------------------------------------
   A real slippy map: pan it, pinch it, zoom all the way down to
   individual streets and building footprints. Over the top of
   it, everything an agent knows and a map doesn't — what a marla
   costs in this sector and not the next one, what a Kanal goes
   for, which market you'd actually shop at, where you'd eat on a
   Friday.

   Two things are deliberate.

   The tile source lives in data/places.json, not in here. The
   default is CARTO's dark basemap, which is free and attributed
   — but it is fair-use, and a commercial site should be pointed
   at its own MapTiler or Mapbox key. One line, one file.

   And if the tiles never arrive — blocked network, a dead key,
   a provider having a bad day — the map does not sit there as an
   empty grey grid pretending to load. It notices, says so, and
   keeps every sector, price and pin usable on a plain dark
   ground, because the overlay is the part that's actually mine.
   ============================================================ */
(function () {
  "use strict";

  var D = null, map = null, tiles = null, tilesOk = false;
  var layers = { sector: null, poi: null };
  var marks = [];
  var city = "isb", filter = "all", selected = null;
  var seen = {};                       // sectors opened this visit

  var FILTERS = [
    { id: "all", n: "Everything" },
    { id: "price", n: "Price" },
    { id: "eat", n: "Where to eat" },
    { id: "marks", n: "Landmarks" },
    { id: "value", n: "Best value" }
  ];

  /* Six bands, same ramp as the 3D city so a colour means the same thing
     wherever you meet it on this site. */
  var BANDS = [
    { max: 2, c: "#3d6fa8", n: "Under 20 Lac" },
    { max: 4, c: "#3f9e9e", n: "20–40 Lac" },
    { max: 7, c: "#6fae5c", n: "40–70 Lac" },
    { max: 11, c: "#d9b23c", n: "70 Lac–1.1 Cr" },
    { max: 16, c: "#e08a3c", n: "1.1–1.6 Cr" },
    { max: Infinity, c: "#d8503f", n: "1.6 Cr+" }
  ];
  function band(p) {
    for (var i = 0; i < BANDS.length; i++) if (p < BANDS[i].max) return BANDS[i];
    return BANDS[BANDS.length - 1];
  }
  function colourOf(d) {
    if (d.park) return "#4e9b5f";
    if (d.commercial || !d.p) return "#8d8fa3";
    return band(d.p).c;
  }

  function trimZeros(s) { return s.indexOf(".") < 0 ? s : s.replace(/0+$/, "").replace(/\.$/, ""); }
  function pkr(m) {
    var cr = m / 10;
    if (cr >= 1) return "PKR " + trimZeros(cr >= 10 ? cr.toFixed(1) : cr.toFixed(2)) + " Cr";
    return "PKR " + (m * 10).toFixed(m * 10 < 10 ? 1 : 0) + " Lac";
  }

  function $(id) { return document.getElementById(id); }

  function here() { return D.places.filter(function (p) { return p.city === city; }); }

  /* A pin that carries its price. The whole point of the map is that you can
     read the market off it without tapping anything — so the label is the
     price, and the ring is the band. */
  function pinFor(d, z) {
    var big = z >= 13;
    var c = colourOf(d);
    var label = d.p ? pkr(d.p) : (d.park ? "Park" : "Commercial");
    var photo = d.photo
      ? '<span class="xp-pin__photo" style="background-image:url(' + d.photo + ')"></span>'
      : '<span class="xp-pin__dot"></span>';
    return L.divIcon({
      className: "xp-pin-wrap",
      html: '<span class="xp-pin' + (big ? " is-big" : "") +
        (selected && selected.id === d.id ? " is-on" : "") +
        '" style="--c:' + c + '">' + photo +
        '<span class="xp-pin__text"><b>' + d.n + "</b>" +
        (big ? "<i>" + label + " / marla</i>" : "") + "</span></span>",
      iconSize: null
    });
  }

  /* One predicate for the pins and the POIs both. They used to filter
     separately, so "best value" hid the expensive sectors' pins and then
     cheerfully drew their restaurants anyway. */
  function visible(d) {
    if (filter === "eat") return d.eats.length > 0;
    if (filter === "marks") return d.marks.length > 0;
    // "best value" is the cheap end of the residential ladder, not the cheapest
    if (filter === "value") return d.p > 0 && d.p <= 7;
    return true;
  }

  function draw() {
    if (!map) return;
    var z = map.getZoom();
    layers.sector.clearLayers();
    marks = [];

    here().forEach(function (d) {
      if (!visible(d)) return;

      // The tinted circle carries the price band at a glance; it grows with
      // zoom so it stays a neighbourhood rather than a dot.
      var r = Math.max(280, 2600 - (z - 10) * 260);
      var circle = L.circle([d.lat, d.lng], {
        radius: r, color: colourOf(d), weight: 1.5,
        fillColor: colourOf(d), fillOpacity: filter === "price" ? 0.42 : 0.2,
        interactive: false
      });
      layers.sector.addLayer(circle);

      var m = L.marker([d.lat, d.lng], { icon: pinFor(d, z), riseOnHover: true,
        keyboard: true, alt: d.n + ", " + (d.p ? pkr(d.p) + " per marla" : d.tag) });
      m.on("click", function () { select(d); });
      m.on("keypress", function (e) { if (e.originalEvent.key === "Enter") select(d); });
      layers.sector.addLayer(m);
      marks.push({ d: d, m: m });
    });

    // POIs only once you're close enough for them to mean anything
    layers.poi.clearLayers();
    if (z >= 14) {
      here().forEach(function (d) {
        if (!visible(d)) return;
        var list = (filter === "marks" ? d.marks : filter === "eat" ? d.eats
          : d.eats.concat(d.marks)).slice(0, z >= 15 ? 6 : 3);
        list.forEach(function (name, i) {
          // fanned round the sector centre — these are "in this area", not
          // surveyed addresses, and the map says so
          var a = (i / Math.max(4, list.length)) * 6.2832 + d.lat;
          var rr = 0.0055 + (i % 3) * 0.0016;
          var isEat = d.eats.indexOf(name) >= 0;
          layers.poi.addLayer(L.marker(
            [d.lat + Math.sin(a) * rr * 0.75, d.lng + Math.cos(a) * rr],
            { icon: L.divIcon({ className: "xp-poi-wrap",
                html: '<span class="xp-poi' + (isEat ? " is-eat" : "") + '">' +
                  (isEat ? "🍽" : "◉") + "<b>" + name + "</b></span>", iconSize: null }),
              interactive: false }));
        });
      });
    }
    $("xpZoomHint").hidden = z >= 14;
  }

  function select(d) {
    selected = d;
    seen[d.id] = 1;
    paint(d);
    draw();
    map.flyTo([d.lat, d.lng], Math.max(map.getZoom(), 14), { duration: 0.7 });
    stat();
  }

  function paint(d) {
    var box = $("xpSheet");
    var b = d.p ? band(d.p) : null;
    box.innerHTML =
      '<button class="xp-sheet__close" id="xpClose" type="button" aria-label="Close">×</button>' +
      '<p class="xp-sheet__tag">' + d.tag + "</p>" +
      "<h3>" + d.n + ", " + D.cities[d.city].n + "</h3>" +
      (d.p
        ? '<div class="xp-sheet__price"><span style="--c:' + colourOf(d) + '"></span>' +
          "<strong>" + pkr(d.p) + "</strong><em>per marla · " + b.n + "</em></div>" +
          (d.band ? '<p class="xp-sheet__kanal">1 Kanal · <b>PKR ' + d.band + " Crore</b></p>" : "")
        : '<p class="xp-sheet__none">Not a residential sector — but it shapes what the ones around it are worth.</p>') +
      (d.plots ? '<p class="xp-sheet__meta">Typically sold in <b>' + d.plots + "</b></p>" : "") +
      (d.by ? '<p class="xp-sheet__meta">Developer <b>' + d.by + "</b></p>" : "") +
      (d.marks.length ? '<p class="xp-sheet__h">Around here</p><ul>' +
        d.marks.map(function (m) { return "<li>" + m + "</li>"; }).join("") + "</ul>" : "") +
      (d.eats.length ? '<p class="xp-sheet__h">Where you\'d eat</p><ul class="xp-eats">' +
        d.eats.map(function (m) { return "<li>" + m + "</li>"; }).join("") + "</ul>" : "") +
      '<div class="xp-sheet__acts">' +
        '<button class="btn btn--wa" id="xpWa" type="button">I want to live here <span class="btn__arrow">→</span></button>' +
        '<a class="btn btn--ghost btn--sm" href="sun-study.html">Which way does it face?</a>' +
      "</div>";
    box.classList.add("is-open");
    box.setAttribute("aria-hidden", "false");
    $("xpClose").addEventListener("click", closeSheet);
    $("xpWa").addEventListener("click", function () {
      var msg = "Hello Adeel — I've been exploring " + d.n + ", " + D.cities[d.city].n +
        " on your map.\n\n" +
        (d.p ? "It shows " + pkr(d.p) + " per marla" +
          (d.band ? " and PKR " + d.band + " Crore for a Kanal" : "") + ".\n\n" : "") +
        "What's actually available there right now?";
      if (window.LeadRelay) window.LeadRelay.send(msg);
      else window.open("https://wa.me/16134083945?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
  }

  function closeSheet() {
    var box = $("xpSheet");
    box.classList.remove("is-open");
    box.setAttribute("aria-hidden", "true");
    selected = null;
    draw();
  }

  function stat() {
    var total = here().length;
    var n = here().filter(function (p) { return seen[p.id]; }).length;
    $("xpStat").textContent = Math.round(n / total * 100) + "% explored";
  }

  function setCity(next) {
    if (next === city) return;
    city = next;
    document.querySelectorAll("[data-xpcity]").forEach(function (b) {
      var on = b.getAttribute("data-xpcity") === next;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    closeSheet();
    var c = D.cities[city];
    map.flyTo([c.lat, c.lng], c.zoom, { duration: 0.9 });
    draw();
    stat();
    fillJump();
  }

  function fillJump() {
    var sel = $("xpJump");
    if (!sel) return;
    var list = here().slice().sort(function (a, b) { return (b.p || 0) - (a.p || 0); });
    sel.innerHTML = '<option value="">Jump to an area…</option>' +
      list.map(function (d) {
        return '<option value="' + d.id + '">' + d.n +
          (d.p ? " — " + pkr(d.p) + " / marla" : "") + "</option>";
      }).join("");
  }

  function legend() {
    $("xpLegend").innerHTML = BANDS.map(function (b) {
      return '<span class="xp-key"><i style="background:' + b.c + '"></i>' + b.n + "</span>";
    }).reverse().join("");
  }

  /* Tiles are the one thing here that depends on somebody else's server. If
     they don't arrive, say so once and carry on — the sectors, the prices and
     the pins are all local and still work. */
  function watchTiles() {
    var settled = false;
    var done = function (ok) {
      if (settled) return;
      settled = true;
      tilesOk = ok;
      var warn = $("xpTileWarn");
      if (warn) warn.hidden = ok;
      document.querySelector(".xp-map").classList.toggle("is-flat", !ok);
    };
    tiles.on("tileload", function () { done(true); });
    tiles.on("tileerror", function () { setTimeout(function () { if (!tilesOk) done(false); }, 2500); });
    setTimeout(function () { done(tilesOk); }, 8000);
  }

  function boot() {
    var host = $("xpMap");
    if (!host || typeof L === "undefined") return;
    fetch("data/places.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        D = j;
        var c = D.cities[city];
        map = L.map(host, {
          center: [c.lat, c.lng], zoom: c.zoom, minZoom: 9, maxZoom: D.tiles.maxZoom || 19,
          zoomControl: false, attributionControl: true, preferCanvas: true
        });
        L.control.zoom({ position: "bottomright" }).addTo(map);
        tiles = L.tileLayer(D.tiles.url, {
          attribution: D.tiles.attribution, subdomains: D.tiles.subdomains || "abc",
          maxZoom: D.tiles.maxZoom || 19, detectRetina: true
        }).addTo(map);
        watchTiles();

        layers.sector = L.layerGroup().addTo(map);
        layers.poi = L.layerGroup().addTo(map);
        map.on("zoomend moveend", draw);

        // chrome
        document.querySelectorAll("[data-xpcity]").forEach(function (b) {
          b.addEventListener("click", function () { setCity(b.getAttribute("data-xpcity")); });
        });
        $("xpFilters").innerHTML = FILTERS.map(function (f) {
          return '<button class="chip' + (f.id === filter ? " is-active" : "") +
            '" type="button" data-f="' + f.id + '" aria-pressed="' + (f.id === filter) + '">' +
            f.n + "</button>";
        }).join("");
        $("xpFilters").querySelectorAll("[data-f]").forEach(function (b) {
          b.addEventListener("click", function () {
            $("xpFilters").querySelectorAll("[data-f]").forEach(function (o) {
              var on = o === b;
              o.classList.toggle("is-active", on);
              o.setAttribute("aria-pressed", String(on));
            });
            filter = b.getAttribute("data-f");
            draw();
          });
        });
        $("xpJump").addEventListener("change", function () {
          var d = D.places.filter(function (p) { return p.id === this.value && p.city === city; }.bind(this))[0];
          if (d) select(d);
        });
        $("xpLocate").addEventListener("click", function () {
          if (!navigator.geolocation) return;
          navigator.geolocation.getCurrentPosition(function (pos) {
            map.flyTo([pos.coords.latitude, pos.coords.longitude], 14, { duration: 1 });
          }, function () { /* declined — nothing to do */ });
        });
        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && selected) closeSheet();
        });

        legend();
        fillJump();
        draw();
        stat();
        var load = $("xpLoading");
        if (load) load.remove();
      })
      .catch(function () {
        var load = $("xpLoading");
        if (load) load.textContent = "Couldn't load the map data. Message me and I'll walk you through the area instead.";
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

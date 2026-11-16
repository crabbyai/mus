# Adeel Ahmed Rahman — Luxury Real Estate Portfolio

A highly interactive, single-page portfolio showcasing luxury homes sold across
**Islamabad** and **Lahore** — 5 Marla, 10 Marla, 1 Kanal and beyond.

**Stack:** Pure HTML/CSS/JS · Three.js 3D · GSAP + ScrollTrigger · Lenis smooth scroll · No build step.
**Bilingual:** English and اردو, right-to-left, every page.
**Fully self-hosted** — all libraries, fonts and artwork are vendored locally; zero external requests, works offline.

**Highlights**

- **اردو — the whole site, not the headings.** A full Urdu translation with
  right-to-left layout, set in Noto Nastaliq (vendored, like every other font
  here). ~1,200 translated blocks plus regex rules for the strings the page
  assembles live around a number, so the market panel, the instalment planner
  and the transfer-cost table read in Urdu too. Three ways in: a large toggle
  under the hero search, a compact one in the nav, and a floating orb that
  follows you down every page. First-time visitors are asked once, in Urdu,
  whether they'd like it — and the answer is remembered.
- **Hero omni-search** — the bar every top portal (Zameen, Realtor.ca, Zillow)
  opens with, now above the fold here too. Buy / Rent / Sell / Invest tabs, an
  autocompleting area box that knows the aliases people actually type ("ph2",
  "pindi", "f-7"), plot size and budget. It routes into whichever tool answers
  the question — the finder with its chips already set, the valuation tool on
  their area, or the market panel on their per-marla series — and says so
  plainly when the area they typed has no published series yet.
- **Compare homes side by side** — tick up to three closings and see them in
  one table: closed price, **price per marla computed** (the only figure that
  compares a 5 Marla in E-11 to a Kanal in DHA), covered area, days on market
  and a feature-by-feature ✓/— grid, with the cheapest rate, most house and
  fastest sale marked. Selection survives a reload; the table prints.
- **Price per marla on every card**, plus a *Best Value* sort that orders the
  whole gallery by land rate.
- **Printable fact sheets** — any sold home, or a whole comparison, prints as a
  clean sheet with the contact line on it. Nothing else on the page comes with it.
- **Rating stated plainly** — 4.9 out of 5, the five-star distribution and the
  review count, above the testimonial slider rather than buried in schema.
- **Walk-through virtual show-home (PlayCanvas)** — a fully-furnished interior
  (foyer, living, dining, open kitchen, master bedroom) you explore in
  first-person: WASD + mouse on desktop, on-screen joystick + drag on mobile.
  The engine is lazy-loaded only when a tour is opened.
- **Scroll-driven 3D showcase** — three signature homes built as procedural
  Three.js maquettes that assemble piece-by-piece and orbit as you scroll
  through a pinned section
- **Interactive 3D model in every property lightbox** — drag to rotate,
  gentle auto-spin, assembled on open (all 12 homes mapped to 8 archetypes)
- 12 bespoke "blue-hour" architectural illustrations — one per sold home, each
  accurate to its story (Margalla Hills, infinity pool, colonial verandas, orchard…)
- Hand-drawn SVG panoramas: Faisal Mosque dusk skyline (hero) and
  Badshahi Mosque / Minar-e-Pakistan night skyline (contact)
- Cinematic preloader, custom cursor, magnetic buttons, scroll-progress bar
- Hero with staggered headline reveal, parallax background and animated counters
- Filterable sold-homes gallery (city + plot size) with animated transitions
- Story lightbox for every home, auto-playing testimonial slider, marquee of addresses
- WhatsApp lead-capture button, fully responsive, zero external image dependencies
- SEO-ready: JSON-LD RealEstateAgent structured data, Open Graph & Twitter cards,
  canonical URL, sitemap.xml, robots.txt, SVG favicon

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
cd portfolio && python3 -m http.server 8000
```

To publish on **GitHub Pages**: Settings → Pages → deploy from this branch,
folder `/portfolio` (or copy this folder to the repo root of a `gh-pages` branch).

## Preview

### Hero
![Hero](.preview/01-hero.png)

### 3D Showcase — homes assemble & orbit on scroll
![3D Manor](.preview/09-3d-manor.png)
![3D Palazzo](.preview/10-3d-palazzo.png)
![3D Colonial](.preview/11-3d-colonial.png)

### About
![About](.preview/02-about.png)

### Sold Portfolio — bespoke illustration per home
![Portfolio](.preview/03-portfolio.png)

### Filtered — Lahore
![Filter](.preview/04-filter-lahore.png)

### Property Story Lightbox
![Lightbox](.preview/05-lightbox.png)

### Quote Band
![Quote](.preview/06-quote.png)

### Contact
![Contact](.preview/07-contact.png)

### Mobile
![Mobile](.preview/08-mobile-hero.png)

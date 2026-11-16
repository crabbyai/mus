# Adeel Rahman — Actor · Karachi & Lahore

A single-page acting portfolio with a live feed of the latest Pakistani dramas.

**Stack:** plain HTML/CSS/JS · GSAP + ScrollTrigger · Lenis smooth scroll · no build step.
Libraries, fonts and artwork are vendored locally. The only outside requests are
YouTube thumbnails and YouTube's embedded player.

## What's on the page

- **Hero, About, On Set, How I Work, Casting Sheet, FAQ, Contact** — the portfolio.
  Copy lives in `index.html`. The contact form opens WhatsApp with the brief filled in.
- **Now Showing** — the drama feed (`js/dramas.js`, `css/dramas.css`):
  - *Latest episodes* rail, newest first, with a **New** tag for the last 48 hours
  - *On air now* and *All-time favourites* grids, a search box and channel filters
  - an in-page player with previous / next, an episode-number grid, and
    "continue from Episode N" remembered in the visitor's browser
  - shareable links: `…/#watch/hum-parizaad/12` opens straight on that episode

## How the feed stays current

`scripts/drama-feed.mjs` runs hourly from `.github/workflows/drama-feed.yml` and
rewrites `data/dramas.json`:

1. It reads the newest uploads on the **official** ARY Digital, HUM TV, Har Pal Geo
   and Green Entertainment YouTube channels and works out which serials are on air.
2. It adds the evergreen picks in `data/drama-picks.json` (Parizaad, Kabhi Main
   Kabhi Tum, Tere Bin …). **Add a line to that file to add a drama.**
3. For each drama it searches the broadcaster's own channel and keeps the
   full-length episodes — clips, promos and highlights are dropped.

Episodes are only ever taken from the broadcaster's own channel and are played
through YouTube's embedded player. The site hosts no video. If a channel removes
an episode, it stops playing here too.

The page re-checks the feed every 10 minutes while it is open.

Run it by hand:

```bash
node scripts/drama-feed.mjs
```

No API key is needed. The script reads public YouTube pages, so if YouTube
changes their layout the run logs a warning and keeps the previous file — the
site never goes blank.

## Run the site

```bash
cd portfolio && python3 -m http.server 8000
```

Hosting options are in `HOSTING.md`.

## Still to add

Headshots beyond the current portraits, a showreel, and a credits list — the
page deliberately claims no roles until there are real ones to list.

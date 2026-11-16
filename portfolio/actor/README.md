# Adeel Rahman — Actor · Karachi & Lahore

The acting portfolio. It lives in `portfolio/actor/` and is served at
`https://crabbyai.github.io/mus/actor/`, beside the property site at `/mus/`.
It borrows the property site's stylesheet, fonts, portraits and animation
libraries from one folder up (`../css`, `../assets`, `../js/vendor`), so the two
look like one family. Everything else is in this folder.

## What's on the page

- **Portfolio** — hero, about, on set, how I work, casting sheet, FAQ, contact.
  Copy lives in `index.html`. The contact form opens WhatsApp with the brief filled in.
- **Live Drama Watch** — the newest episode of every serial on air, as feed
  cards (the same cards the property site uses for live listings).
- **This week's most watched** — a spotlight carousel of the five most-viewed
  new episodes.
- **The library** — every serial, searchable and filterable by channel, with
  *Continue watching* and *♥ My list* rows kept in the visitor's browser.
- **Player** — plays on the page, previous / next, an episode-number grid,
  autoplay next, WhatsApp share and copy-link. `…/actor/#watch/hum-parizaad/12`
  opens straight on that episode.
- **One page per drama** — `watch/<drama>.html`, plain and crawlable, so
  "Parizaad all episodes" has a page to land on. Listed in `sitemap.xml`.

## How the feed stays current

`scripts/drama-feed.mjs` runs hourly from `.github/workflows/drama-feed.yml`:

1. Reads the newest uploads on the **official** ARY Digital, HUM TV, Har Pal
   Geo, Green Entertainment and Express TV YouTube channels and works out which
   serials are on air.
2. Adds the evergreen picks in `data/drama-picks.json` (Parizaad, Kabhi Main
   Kabhi Tum, Tere Bin …). **Add a line to that file to add a drama.**
3. Searches each broadcaster's own channel and keeps the full-length episodes;
   clips, promos and highlights are dropped.
4. Rewrites `data/dramas.json`, the `watch/` pages and `sitemap.xml`.

Episodes only ever come from the broadcaster's own channel and play through
YouTube's embedded player. The site hosts no video. No API key is needed; if
YouTube changes its page layout the run logs a warning and keeps the previous
file, so the site never goes blank.

```bash
node scripts/drama-feed.mjs              # normal run
FEED_BUDGET=12 node scripts/drama-feed.mjs   # fill missing episodes faster
```

## Still to add

A showreel, more headshots and a credits list. The page deliberately claims no
roles until there are real ones to list.

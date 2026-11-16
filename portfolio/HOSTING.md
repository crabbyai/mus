# Hosting your website

This is a **static website** — just HTML, CSS, JavaScript and images. There is
no server, database or build step. That means it's cheap (often free) and easy
to host almost anywhere. Everything works by simply serving the files in this
folder.

**Your homepage is `index.html`.** Whatever host you use, point it at this
folder and make `index.html` the entry page.

---

## Easiest options (pick one)

### 1. Netlify Drop — free, ~60 seconds, no account needed to try
1. Go to **https://app.netlify.com/drop**
2. Drag this entire **`portfolio`** folder onto the page.
3. It uploads and gives you a live link instantly (e.g. `your-site.netlify.app`).
4. Create a free account to keep it and to connect your own domain.

### 2. Cloudflare Pages — free, fast, great for custom domains
1. Sign up at **https://pages.cloudflare.com** (free).
2. "Create a project" → "Direct Upload".
3. Upload this folder. Done.

### 3. Vercel — free
1. Sign up at **https://vercel.com**.
2. New Project → import, or drag-and-drop the folder with the Vercel CLI.

### 4. GitHub Pages (what it's on now)
Already live at `https://crabbyai.github.io/mus/`. To publish under your own
GitHub account, create a repo, upload these files, then in
**Settings → Pages** set the source to your branch.

### 5. Traditional web host (cPanel / shared hosting)
If you bought hosting with a provider (e.g. any cPanel host), open the
**File Manager**, go to the `public_html` folder, and upload the **contents**
of this folder (so `index.html` sits directly inside `public_html`).

---

## Getting your own domain (recommended for the long run)

A custom domain like **`adeelrahman.pk`** or **`adeelrahman.com`** looks far more
professional than a `.github.io` or `.netlify.app` address, and search engines
and AI assistants trust branded domains more.

1. Buy a domain (Namecheap, GoDaddy, or a local `.pk` registrar like PKNIC).
2. In your host (Netlify / Cloudflare / Vercel), open **Domain settings** and
   add your domain — they'll show you the DNS records to set at your registrar.
3. HTTPS (the padlock) is added automatically and free on all the hosts above.

---

## Updating the site later

Just edit the files and re-upload the folder (or push to GitHub). The main
files you'd touch:

- **`index.html`** — all the page text, sections and contact details.
- **`css/style.css`** — colours, fonts, spacing.
- **`assets/`** — your photos (`adeel-portrait.jpg`, `adeel-about.jpg`, etc.).
- Phone number / WhatsApp: it's `+1 613 408 3945` throughout — search and
  replace across `index.html` and the `js/` files if it ever changes.

## The live-listings feed (optional)

The "Live Market Watch" section reads from `data/market-feed.json`. On GitHub it
auto-refreshes from the MSJ and OREAL YouTube channels every 6 hours via a
GitHub Action (`.github/workflows/market-feed.yml`). On other hosts that don't
run that action, the section simply shows the last saved listings — still fine,
just not auto-updating. To keep auto-updates, keep the site on GitHub Pages or
re-create that scheduled job on your new host.

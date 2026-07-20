# Make the community feed pull live Reddit questions (~3 min)

The "Ask the Expert" section shows curated starter questions out of the box.
To make it pull **real, live questions** from r/islamabad, r/lahore and
r/pakistan, connect Reddit's official API. (Reddit blocks GitHub's servers on
the public endpoints, so the API is the only reliable way — it's free.)

## 1. Create a Reddit app
1. Log in to Reddit → go to <https://www.reddit.com/prefs/apps>.
2. Scroll down → **"are you a developer? create an app…"**.
3. Fill in:
   - **name:** `pakistani-luxury-feed` (anything)
   - **type:** choose **script**
   - **redirect uri:** `http://localhost` (required but unused)
4. Click **create app**.
5. Note the two values:
   - **client id** — the short string just under the app name ("personal use script").
   - **secret** — the longer `secret` value.

## 2. Add them as repository secrets
In GitHub: your repo → **Settings → Secrets and variables → Actions → New repository secret**. Add two:

| Name | Value |
|------|-------|
| `REDDIT_CLIENT_ID` | the client id from step 1 |
| `REDDIT_CLIENT_SECRET` | the secret from step 1 |

## 3. Run it
Repo → **Actions → "Refresh community feed…" → Run workflow**.
(After that it also refreshes automatically every 6 hours.)

That's it — the section fills with live real-estate questions from the three
subreddits, each with your auto-generated answer and a WhatsApp CTA. If the
credentials are ever missing or Reddit is down, the site simply keeps the last
good feed (and the curated starters), so it never looks broken.

> The secrets stay server-side in GitHub Actions — they are never shipped to
> the website or exposed to visitors.

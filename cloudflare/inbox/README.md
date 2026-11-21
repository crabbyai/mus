# Shared inbox & files (Cloudflare Worker)

One small server for every site: actor (`/actor/`), coach (`/`), realtor (`/realtor/`)
and mangoes (`/mangoes/`).

- **Inbox:** any form with `data-inbox="<site>:<kind>"` on a page that loads
  `shared/inbox.js` is also saved here, with an optional attached file (`name="file"`, ≤15 MB).
  The page's own WhatsApp step keeps working either way.
- **Private files:** upload self-tapes, videos, images or PDFs from the admin page and
  make links that expire after 3–90 days. Videos seek (range requests).
- **Stats:** the admin page reads Cloudflare Web Analytics through a read-only token
  stored on the server.
- **Admin page:** `portfolio/admin/` → `https://crabbyai.github.io/mus/admin/`.

## Bindings

| Name | Kind | What |
|---|---|---|
| `DB` | D1 database | enquiries, files, settings, rate limits (tables created on first request) |
| `FILES` | R2 bucket | attachments and uploads |
| `LINK_KEY` | secret | signs sessions and share links |
| `SETUP_CODE` | secret | one-time code to set the admin password |
| `ALLOWED_ORIGINS` | var | `https://crabbyai.github.io` |
| `ACCOUNT_ID`, `SITE_TAG` | vars | for the analytics query |

After deploying, set `API` in `portfolio/shared/inbox.js` and `portfolio/admin/admin.js`
to the Worker's URL.

## Safety

- The admin password is stored as a PBKDF2 hash; changing it signs out every device.
- Sign-in and form posts are rate-limited per IP; forms carry a honeypot.
- Uploaded files are private; share links are HMAC-signed and expire.
- Only `ALLOWED_ORIGINS` may post enquiries.

## Deployed

- Worker: `adeel-inbox` → https://adeel-inbox.adeelrahman.workers.dev
- D1 database: `adeel-inbox`
- R2 bucket: not yet — enable R2 in the dashboard, create bucket `adeel-files`,
  and add an `r2_bucket` binding named `FILES` (redeploy with `keep_bindings`).
  Until then enquiries save normally and attachments are noted as not stored.

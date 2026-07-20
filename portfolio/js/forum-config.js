/* ============================================================
   FORUM BACKEND CONFIG
   ------------------------------------------------------------
   Leave both blank  → forum runs in LOCAL mode (per-browser,
   accounts & posts live only in each visitor's own browser).

   Paste your Supabase project URL + anon (public) key → forum
   switches to SHARED mode: real accounts and posts that every
   visitor sees, on every device. See SUPABASE_SETUP.md for the
   3-step setup (create project, run the SQL, paste keys here).

   The anon key is meant to be public — it is safe in client
   code. Your data is protected by Row Level Security (in the SQL).
   ============================================================ */
window.FORUM_CONFIG = {
  url: "",        // e.g. "https://abcdefgh.supabase.co"
  anonKey: "",    // your project's anon / public key (a long JWT)
  emailDomain: "twincities.forum" // usernames map to <name>@this — no email needed
};

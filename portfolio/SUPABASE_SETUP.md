# Turn on the shared forum (Supabase) — ~5 minutes

The forum works out of the box in **local mode** (accounts/posts live in each
visitor's own browser). To make it a **real shared forum** — every visitor sees
every post, on every device — connect a free Supabase project.

## 1. Create a free project
1. Go to <https://supabase.com> → sign up (free tier is plenty).
2. **New project** → give it a name and a database password → wait ~2 min for it to spin up.

## 2. Run the SQL
In the project, open **SQL Editor → New query**, paste **everything** below, and click **Run**.

```sql
-- ===== Tables =====
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null default auth.uid(),
  author text not null,
  topic text,
  title text not null,
  body text,
  base_score int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts on delete cascade,
  user_id uuid references auth.users on delete set null default auth.uid(),
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create table if not exists votes (
  post_id uuid not null references posts on delete cascade,
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- ===== Row Level Security =====
alter table posts    enable row level security;
alter table comments enable row level security;
alter table votes    enable row level security;

create policy "posts_read"    on posts    for select using (true);
create policy "posts_insert"  on posts    for insert to authenticated with check (auth.uid() = user_id);
create policy "comments_read" on comments for select using (true);
create policy "comments_ins"  on comments for insert to authenticated with check (auth.uid() = user_id);
create policy "votes_read"    on votes    for select using (true);
create policy "votes_ins"     on votes    for insert to authenticated with check (auth.uid() = user_id);
create policy "votes_upd"     on votes    for update to authenticated using (auth.uid() = user_id);
create policy "votes_del"     on votes    for delete to authenticated using (auth.uid() = user_id);

-- ===== Seed content (fake starter threads) =====
insert into posts (author, topic, title, body, base_score, created_at) values
('IsloniteFirstHome','Buying','DHA Phase 2 vs Bahria Enclave for a 10 marla — genuinely stuck','Budget ~4.5–5 crore. DHA 2 feels established but pricey per marla; Enclave is greener and newer but I keep hearing handover horror stories. Which one actually holds value better over 5 years?',47, now() - interval '6 hours'),
('OverseasKhan','Overseas','Overseas Pakistani — how do I buy a plot in Islamabad without getting scammed from abroad?','In Dubai. Everyone says buy back home but I''m terrified of paying token for a file that doesn''t exist or a plot that''s double-sold. What''s the safe process when you can''t physically be there?',63, now() - interval '11 hours'),
('FilerByForce','Tax & Legal','Non-filer here. How much extra am I actually paying in tax on a 1 kanal purchase?','Keep hearing ''become a filer first''. Is it really that big a difference or just accountants drumming up business?',38, now() - interval '20 hours'),
('WaitingSince2021','Societies','Possession delayed 3 years in my society. Has anyone actually recovered money or gotten possession?','Paid in full, was promised possession in 2023. Still nothing but ''coming soon''. Do I lawyer up or keep waiting?',55, now() - interval '2 days'),
('RentTrapRafiq','Rent vs Buy','Rent vs buy in G-13/G-14 right now — the numbers just don''t add up?','Rent on a decent portion is way cheaper than the mortgage-equivalent on buying. Am I mad to keep renting and invest the difference?',41, now() - interval '1 day'),
('ScamRadar','Scams','Offered a ''file'' in a brand-new society at literally half the market rate. Too good to be true?','Dealer is pushing hard, says limited-time pre-launch. My gut says run. What are the tells of a fake/overselling society?',72, now() - interval '30 hours'),
('SmallFamilyBigDreams','Buying','Best-value sectors under 2 crore for a small family (schools + safety matter)?','5 marla max, want somewhere that''ll appreciate but is actually liveable now — gas, schools nearby, not a construction wasteland for 5 years.',34, now() - interval '48 hours'),
('InstallmentIshaq','Investment','Is it dumb to buy on installments right now with rates where they are?','Developer installment plans look tempting (no interest, they say). Am I locking into an overpriced unit? How do installment prices compare to cash-down deals right now?',29, now() - interval '3 days');

insert into comments (post_id, author, body, created_at)
select id,'PlotDealerPindi','DHA 2 for resale liquidity, hands down. In Enclave you wait for the right buyer.', now() - interval '5 hours' from posts where title like 'DHA Phase 2 vs%';
insert into comments (post_id, author, body, created_at)
select id,'Adeel Rahman','Both are solid. Living in it now → DHA 2 (utilities & access are sorted). Pure 5-year hold → Enclave usually closes the price gap. Tell me the exact sector and I''ll pull recent sold comps so you''re comparing like-for-like.', now() - interval '4 hours' from posts where title like 'DHA Phase 2 vs%';
insert into comments (post_id, author, body, created_at)
select id,'InvestorZee','Never pay anyone before verifying the file number directly with the society office. Get a cousin to physically go.', now() - interval '10 hours' from posts where title like 'Overseas Pakistani%';
insert into comments (post_id, author, body, created_at)
select id,'Adeel Rahman','Golden rule: verify ownership at the society/CDA one-window yourself (or a trusted rep), pay into the seller''s own account — never a dealer''s — and get a written sale agreement with CNIC + file number before any token. I do this for overseas clients regularly.', now() - interval '9 hours' from posts where title like 'Overseas Pakistani%';
insert into comments (post_id, author, body, created_at)
select id,'CA_Numbers','Advance tax on purchase is roughly double for non-filers. On a 1 kanal that''s easily 7 figures difference.', now() - interval '19 hours' from posts where title like 'Non-filer here%';
insert into comments (post_id, author, body, created_at)
select id,'Adeel Rahman','^ This. Non-filers pay ~2x advance tax on both purchase and sale. Get on the ATL before you transact — it usually saves many times the cost of filing.', now() - interval '18 hours' from posts where title like 'Non-filer here%';
insert into comments (post_id, author, body, created_at)
select id,'Adeel Rahman','If it''s that far below market, you''re the exit liquidity for someone. Verify approved NOC, that the developer owns the land, and files-sold vs land-available. If any is murky, walk.', now() - interval '28 hours' from posts where title like 'Offered a %';
```

## 3. Turn off email confirmation (so usernames work without email)
**Authentication → Sign In / Providers → Email** → set **Confirm email = OFF** → save.
(The forum signs users up as `username@twincities.forum`, so no real inbox is involved.)

## 4. Paste your keys
**Project Settings → API**, copy:
- **Project URL** (e.g. `https://abcdxyz.supabase.co`)
- **anon / public** key (a long token)

Put them in `portfolio/js/forum-config.js`:
```js
window.FORUM_CONFIG = {
  url: "https://abcdxyz.supabase.co",
  anonKey: "eyJhbGciOi...your-anon-key...",
  emailDomain: "twincities.forum"
};
```

Commit + push. That's it — the forum is now shared across all visitors and devices.

## Notes
- The **anon key is safe in public** — Row Level Security (above) controls access: anyone can read; only logged-in users can post/comment/vote; users can only change their own votes.
- Leaving the keys blank keeps everything in **local mode** — nothing breaks.
- Author names on posts are set client-side; if you ever want to hard-prevent someone registering a name like "Adeel Rahman", tell me and I'll add a reserved-name check.

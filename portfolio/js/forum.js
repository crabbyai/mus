/* ============================================================
   TWIN CITIES PROPERTY TALK — community forum
   Fully client-side: accounts, login, posting, comments and votes
   all persist in the visitor's own browser (localStorage). Seeded
   with realistic r/islamabad-style real-estate threads and an
   "Adeel Rahman ✓ Verified Agent" voice answering questions.
   No backend — posts are per-browser, not shared across visitors.
   ============================================================ */
(function () {
  "use strict";

  const section = document.getElementById("forum");
  const listEl = document.getElementById("forumList");
  if (!section || !listEl) return;

  const AGENT = "Adeel Rahman";
  const WA = "https://wa.me/16134083945";

  /* ---------- storage helpers ---------- */
  const K = {
    users: "ar_forum_users_v1",
    session: "ar_forum_session_v1",
    posts: "ar_forum_posts_v1",     // visitor-created posts
    votes: "ar_forum_votes_v1",     // { [id]: 1 | -1 }
    comments: "ar_forum_comments_v1" // { [postId]: [ {author, body, ts} ] }
  };
  const get = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
  const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  // Lightweight, non-cryptographic hash — enough to avoid storing raw
  // passwords in localStorage on a demo forum (nothing leaves the browser).
  function hash(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return String(h >>> 0);
  }

  const esc = (t) => { const d = document.createElement("div"); d.textContent = t == null ? "" : t; return d.innerHTML; };

  function timeAgo(ts) {
    const s = (Date.now() - ts) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago";
    const d = Math.floor(s / 86400);
    if (d === 1) return "yesterday";
    if (d < 30) return d + "d ago";
    return Math.floor(d / 30) + "mo ago";
  }
  const hAgo = (n) => Date.now() - n * 3600e3;
  const dAgo = (n) => Date.now() - n * 86400e3;

  // Deterministic avatar colour from a name.
  function avatar(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
    const initials = name.split(/[\s_]+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    return `<span class="fav" style="background:hsl(${h},45%,32%)">${esc(initials)}</span>`;
  }
  function nameTag(name, verified) {
    return `<span class="fpost__who">${avatar(name)}<span class="fpost__name">u/${esc(name)}</span>${
      verified ? '<span class="fpost__verified" title="Verified agent">✓ Verified Agent</span>' : ""}</span>`;
  }

  /* ---------- seed content ---------- */
  const SEED = [
    {
      id: "s1", author: "IsloniteFirstHome", topic: "Buying",
      title: "DHA Phase 2 vs Bahria Enclave for a 10 marla — genuinely stuck",
      body: "Budget ~4.5–5 crore. DHA 2 feels established but pricey per marla; Enclave is greener and newer but I keep hearing handover horror stories. Which one actually holds value better over 5 years?",
      votes: 47, ts: hAgo(6),
      comments: [
        { author: "PlotDealerPindi", body: "DHA 2 for resale liquidity, hands down. In Enclave you wait for the right buyer.", votes: 12, ts: hAgo(5) },
        { author: AGENT, verified: true, body: "Both are solid. Living in it now → DHA 2 (utilities & access are sorted). Pure 5-year hold → Enclave usually closes the price gap. Tell me the exact sector and I'll pull recent sold comps so you're comparing like-for-like.", votes: 23, ts: hAgo(4) }
      ]
    },
    {
      id: "s2", author: "OverseasKhan", topic: "Overseas",
      title: "Overseas Pakistani — how do I buy a plot in Islamabad without getting scammed from abroad?",
      body: "In Dubai. Everyone says buy back home but I'm terrified of paying token for a file that doesn't exist or a plot that's double-sold. What's the safe process when you can't physically be there?",
      votes: 63, ts: hAgo(11),
      comments: [
        { author: "InvestorZee", body: "Never pay anyone before verifying the file number directly with the society office. Get a cousin to physically go.", votes: 18, ts: hAgo(10) },
        { author: AGENT, verified: true, body: "Golden rule: verify ownership at the society/CDA one-window yourself (or a trusted rep), pay into the seller's own account — never a dealer's — and get a written sale agreement with CNIC + file number before any token. I do this verification for overseas clients regularly; happy to walk you through it.", votes: 29, ts: hAgo(9) }
      ]
    },
    {
      id: "s3", author: "FilerByForce", topic: "Tax & Legal",
      title: "Non-filer here. How much extra am I actually paying in tax on a 1 kanal purchase?",
      body: "Keep hearing 'become a filer first'. Is it really that big a difference or just accountants drumming up business?",
      votes: 38, ts: hAgo(20),
      comments: [
        { author: "CA_Numbers", body: "Advance tax on purchase is roughly double for non-filers. On a 1 kanal that's easily 7 figures difference. Filing costs peanuts by comparison.", votes: 21, ts: hAgo(19) },
        { author: AGENT, verified: true, body: "^ This. Non-filers pay ~2x advance tax on both purchase and sale, plus restrictions on high-value transactions. I always tell clients: get on the ATL before you transact — it usually saves many times the cost of filing.", votes: 15, ts: hAgo(18) }
      ]
    },
    {
      id: "s4", author: "WaitingSince2021", topic: "Societies",
      title: "Possession delayed 3 years in my society. Has anyone actually recovered money or gotten possession?",
      body: "Paid in full, was promised possession in 2023. Still nothing but 'coming soon'. Do I lawyer up or keep waiting?",
      votes: 55, ts: dAgo(2),
      comments: [
        { author: "BahriaAunty", body: "Document EVERYTHING in writing. Verbal promises mean nothing when it goes to court.", votes: 9, ts: dAgo(2) },
        { author: "PlotDealerPindi", body: "Which society? Some are just slow, others are a genuine red flag for resale too.", votes: 6, ts: dAgo(1) }
      ]
    },
    {
      id: "s5", author: "RentTrapRafiq", topic: "Rent vs Buy",
      title: "Rent vs buy in G-13/G-14 right now — the numbers just don't add up?",
      body: "Rent on a decent portion is way cheaper than the mortgage-equivalent on buying. Am I mad to keep renting and invest the difference, or is that short-term thinking in this market?",
      votes: 41, ts: dAgo(1),
      comments: [
        { author: AGENT, verified: true, body: "Not mad at all — in CDA sectors the rental yield is low, so renting-and-investing can win short term. But land appreciation + inflation hedge usually favours owning if you'll hold 5+ years. Depends on your timeline. Tell me yours and I'll run the actual numbers.", votes: 17, ts: dAgo(1) }
      ]
    },
    {
      id: "s6", author: "ScamRadar", topic: "Scams",
      title: "Offered a 'file' in a brand-new society at literally half the market rate. Too good to be true?",
      body: "Dealer is pushing hard, says limited-time pre-launch. My gut says run. What are the tells of a fake/overselling society?",
      votes: 72, ts: hAgo(30),
      comments: [
        { author: "InvestorZee", body: "Half price + urgency + pre-launch = classic combo. Check NOC status and how many files they've already sold vs actual land they own.", votes: 24, ts: hAgo(29) },
        { author: AGENT, verified: true, body: "If it's that far below market, you're the exit liquidity for someone. Verify: (1) approved NOC, (2) the developer actually owns the land, (3) files-sold vs land-available ratio. If any is murky, walk. I keep a shortlist of societies I'd actually put my own money in — ask.", votes: 33, ts: hAgo(28) }
      ]
    },
    {
      id: "s7", author: "SmallFamilyBigDreams", topic: "Buying",
      title: "Best-value sectors under 2 crore for a small family (schools + safety matter)?",
      body: "5 marla max, want somewhere that'll appreciate but is actually liveable now — gas, schools nearby, not a construction wasteland for 5 years.",
      votes: 34, ts: hAgo(48),
      comments: [
        { author: "G13Resident", body: "B-17 and some Bahria Enclave pockets fit this. Avoid the far-flung 'investment only' sectors if you actually want to live there.", votes: 11, ts: hAgo(47) }
      ]
    },
    {
      id: "s8", author: "InstallmentIshaq", topic: "Investment",
      title: "Is it dumb to buy on installments right now with rates where they are?",
      body: "Developer installment plans look tempting (no interest, they say). But am I locking myself into an overpriced unit? How do installment prices compare to cash-down deals right now?",
      votes: 29, ts: dAgo(3),
      comments: [
        { author: "InvestorZee", body: "Installment 'no interest' is baked into a higher price. Always compare vs the cash price + what you'd earn on that cash elsewhere.", votes: 13, ts: dAgo(3) },
        { author: AGENT, verified: true, body: "Exactly — there's no free financing, it's priced in. Installments make sense if the appreciation outpaces the premium AND cash flow suits you. Send me the plan and the cash price; I'll tell you if the premium is fair.", votes: 10, ts: dAgo(2) }
      ]
    }
  ];

  /* ---------- state ---------- */
  let sortMode = "hot";
  const session = () => get(K.session, null);
  const users = () => get(K.users, {});
  const votes = () => get(K.votes, {});
  const userPosts = () => get(K.posts, []);
  const userComments = () => get(K.comments, {});

  // Build the display list: seed + visitor posts, with vote/comment overlays.
  function buildPosts() {
    const up = userPosts();
    const all = SEED.concat(up).map((p) => ({ ...p }));
    const v = votes();
    const uc = userComments();
    all.forEach((p) => {
      const my = v[p.id] || 0;
      p.myVote = my;
      p.score = (p.votes || 0) + my;
      const extra = uc[p.id] || [];
      p.allComments = (p.comments || []).concat(extra);
    });
    return all;
  }
  function sortPosts(posts) {
    const a = posts.slice();
    if (sortMode === "new") a.sort((x, y) => y.ts - x.ts);
    else if (sortMode === "top") a.sort((x, y) => y.score - x.score);
    else a.sort((x, y) => (y.score / Math.pow((Date.now() - y.ts) / 3600e3 + 2, 1.3)) -
                          (x.score / Math.pow((Date.now() - x.ts) / 3600e3 + 2, 1.3)));
    return a;
  }

  /* ---------- rendering ---------- */
  const expanded = new Set();

  function renderAuth() {
    const el = document.getElementById("forumAuth");
    const u = session();
    if (u) {
      el.innerHTML = `<span class="forum__me">${avatar(u)}<span>u/${esc(u)}</span></span>
        <button class="forum__logout" id="forumLogout" type="button">Log out</button>`;
      document.getElementById("forumLogout").addEventListener("click", () => {
        set(K.session, null); render();
      });
    } else {
      el.innerHTML = `<button class="btn btn--gold btn--sm" id="forumLoginBtn" type="button">Log in / Join</button>`;
      document.getElementById("forumLoginBtn").addEventListener("click", () => openModal("login"));
    }
  }

  function renderCompose() {
    const wrap = document.getElementById("forumComposeWrap");
    const u = session();
    if (!u) {
      wrap.innerHTML = `<button class="forum__composebtn" id="forumComposeCta" type="button">
        <span class="fav" style="background:#2a3350">＋</span>
        <span>Ask the community a question…</span></button>`;
      document.getElementById("forumComposeCta").addEventListener("click", () => openModal("login"));
      return;
    }
    wrap.innerHTML = `
      <form class="forum__compose" id="forumComposeForm">
        <div class="forum__composehead">${avatar(u)}<strong>Post as u/${esc(u)}</strong></div>
        <select class="forum__topic" id="fcTopic" aria-label="Topic">
          ${["Buying", "Selling", "Investment", "Tax & Legal", "Overseas", "Rent vs Buy", "Societies", "Scams"]
            .map((t) => `<option>${t}</option>`).join("")}
        </select>
        <input class="forum__title-in" id="fcTitle" maxlength="140" placeholder="Title — e.g. Is DHA Valley worth it in 2026?" required />
        <textarea class="forum__body-in" id="fcBody" maxlength="1200" rows="3" placeholder="Add details (optional)"></textarea>
        <div class="forum__composeactions">
          <button class="btn btn--gold btn--sm" type="submit">Post question</button>
        </div>
      </form>`;
    document.getElementById("forumComposeForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("fcTitle").value.trim();
      if (!title) return;
      const post = {
        id: "u" + Date.now(),
        author: u, topic: document.getElementById("fcTopic").value,
        title, body: document.getElementById("fcBody").value.trim(),
        votes: 0, ts: Date.now(), comments: [], mine: true
      };
      const up = userPosts(); up.unshift(post); set(K.posts, up);
      const v = votes(); v[post.id] = 1; set(K.votes, v); // author auto-upvote → score 1
      sortMode = "new";
      syncSorts();
      render();
      const node = document.querySelector(`[data-post="${post.id}"]`);
      if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function commentHtml(c) {
    return `<div class="fcomment">
      ${nameTag(c.author, c.verified)}
      <span class="fcomment__time">· ${timeAgo(c.ts)}</span>
      <p class="fcomment__body">${esc(c.body)}</p>
    </div>`;
  }

  function postHtml(p) {
    const isOpen = expanded.has(p.id);
    const waShare = WA + "?text=" + encodeURIComponent("Hi Adeel — saw this on your community forum: \"" + p.title + "\". I have a similar question.");
    return `<article class="fpost" data-post="${p.id}">
      <div class="fpost__vote">
        <button class="fvote fvote--up ${p.myVote === 1 ? "is-on" : ""}" data-vote="1" data-id="${p.id}" aria-label="Upvote">▲</button>
        <span class="fpost__score">${p.score}</span>
        <button class="fvote fvote--down ${p.myVote === -1 ? "is-on" : ""}" data-vote="-1" data-id="${p.id}" aria-label="Downvote">▼</button>
      </div>
      <div class="fpost__main">
        <div class="fpost__meta">
          <span class="fpost__topic">${esc(p.topic)}</span>
          ${nameTag(p.author, p.author === AGENT)}
          <span class="fpost__time">· ${timeAgo(p.ts)}</span>
        </div>
        <h3 class="fpost__title">${esc(p.title)}</h3>
        ${p.body ? `<p class="fpost__body">${esc(p.body)}</p>` : ""}
        <div class="fpost__actions">
          <button class="fpost__act" data-toggle="${p.id}">💬 ${p.allComments.length} ${p.allComments.length === 1 ? "reply" : "replies"}</button>
          <a class="fpost__act" href="${waShare}" target="_blank" rel="noopener">Ask Adeel directly →</a>
        </div>
        <div class="fpost__comments" ${isOpen ? "" : "hidden"}>
          ${p.allComments.map(commentHtml).join("")}
          ${session()
            ? `<form class="fcomment-form" data-id="${p.id}">
                 <input class="fcomment-in" maxlength="600" placeholder="Add a reply as u/${esc(session())}…" required />
                 <button class="btn btn--gold btn--sm" type="submit">Reply</button>
               </form>`
            : `<button class="fcomment-login" data-login="1">Log in to reply</button>`}
        </div>
      </div>
    </article>`;
  }

  function renderList() {
    const posts = sortPosts(buildPosts());
    listEl.innerHTML = posts.map(postHtml).join("");

    listEl.querySelectorAll(".fvote").forEach((b) => b.addEventListener("click", () => {
      if (!session()) return openModal("login");
      const id = b.dataset.id, dir = +b.dataset.vote;
      const v = votes();
      v[id] = v[id] === dir ? 0 : dir; // toggle off if same
      set(K.votes, v);
      renderList();
    }));
    listEl.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.toggle;
      if (expanded.has(id)) expanded.delete(id); else expanded.add(id);
      renderList();
    }));
    listEl.querySelectorAll("[data-login]").forEach((b) => b.addEventListener("click", () => openModal("login")));
    listEl.querySelectorAll(".fcomment-form").forEach((f) => f.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = f.dataset.id, input = f.querySelector(".fcomment-in");
      const body = input.value.trim();
      if (!body) return;
      const uc = userComments();
      (uc[id] = uc[id] || []).push({ author: session(), body, ts: Date.now() });
      set(K.comments, uc);
      expanded.add(id);
      renderList();
    }));
  }

  function render() { renderAuth(); renderCompose(); renderList(); }

  function syncSorts() {
    document.querySelectorAll(".forum__sort").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.sort === sortMode));
  }

  /* ---------- auth modal ---------- */
  const modal = document.getElementById("forumModal");
  const modalBody = document.getElementById("forumModalBody");

  function openModal(mode) {
    modalBody.innerHTML = authFormHtml(mode);
    modal.hidden = false; modal.setAttribute("aria-hidden", "false");
    wireAuthForm();
    const first = modalBody.querySelector("input");
    if (first) first.focus();
  }
  function closeModal() { modal.hidden = true; modal.setAttribute("aria-hidden", "true"); }

  function authFormHtml(mode) {
    const isLogin = mode !== "register";
    return `
      <h3 class="fmodal__title">${isLogin ? "Welcome back" : "Join the community"}</h3>
      <p class="fmodal__sub">${isLogin ? "Log in to post, reply and vote." : "Pick a username — it's free and stays on this device."}</p>
      <form id="forumAuthForm" class="fmodal__form" data-mode="${isLogin ? "login" : "register"}">
        <label class="fmodal__label">Username
          <input id="faUser" autocomplete="username" maxlength="24" required placeholder="e.g. IsloniteBuyer" />
        </label>
        <label class="fmodal__label">Password
          <input id="faPass" type="password" autocomplete="${isLogin ? "current-password" : "new-password"}" minlength="4" required placeholder="At least 4 characters" />
        </label>
        <p class="fmodal__err" id="faErr" hidden></p>
        <button class="btn btn--gold" type="submit">${isLogin ? "Log in" : "Create account"}</button>
      </form>
      <p class="fmodal__switch">
        ${isLogin ? "New here?" : "Already have an account?"}
        <button type="button" id="faSwitch">${isLogin ? "Create an account" : "Log in"}</button>
      </p>`;
  }

  function wireAuthForm() {
    const form = document.getElementById("forumAuthForm");
    const err = document.getElementById("faErr");
    const showErr = (m) => { err.textContent = m; err.hidden = false; };
    document.getElementById("faSwitch").addEventListener("click", () =>
      openModal(form.dataset.mode === "login" ? "register" : "login"));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("faUser").value.trim().replace(/\s+/g, "_");
      const pass = document.getElementById("faPass").value;
      if (name.length < 3) return showErr("Username must be at least 3 characters.");
      const db = users();
      if (form.dataset.mode === "register") {
        if (db[name.toLowerCase()]) return showErr("That username is taken. Try another or log in.");
        db[name.toLowerCase()] = { name, pass: hash(pass), joined: Date.now() };
        set(K.users, db);
        set(K.session, name);
      } else {
        const rec = db[name.toLowerCase()];
        if (!rec || rec.pass !== hash(pass)) return showErr("Wrong username or password.");
        set(K.session, rec.name);
      }
      closeModal();
      render();
    });
  }

  document.getElementById("forumModalClose").addEventListener("click", closeModal);
  document.getElementById("forumModalBackdrop").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  /* ---------- sort buttons ---------- */
  document.getElementById("forumSorts").addEventListener("click", (e) => {
    const b = e.target.closest("[data-sort]");
    if (!b) return;
    sortMode = b.dataset.sort;
    syncSorts();
    renderList();
  });

  render();
})();

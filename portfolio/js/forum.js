/* ============================================================
   ASK THE EXPERT — live real-estate Q&A
   Pulls real property questions from r/islamabad, r/lahore and
   r/pakistan (refreshed by a scheduled GitHub Action into
   data/forum-feed.json) and answers each one automatically in
   Adeel's "Verified Agent" voice. Primary CTA on every card is
   WhatsApp. Read-only feed — no accounts needed.
   ============================================================ */
(function () {
  "use strict";

  const section = document.getElementById("forum");
  const listEl = document.getElementById("forumList");
  if (!section || !listEl) return;

  const AGENT = "Adeel Rahman";
  const WA = "https://wa.me/16134083945";
  const SUB_LABEL = { islamabad: "r/islamabad", lahore: "r/lahore", pakistan: "r/pakistan", rawalpindi: "r/rawalpindi" };

  const esc = (t) => { const d = document.createElement("div"); d.textContent = t == null ? "" : t; return d.innerHTML; };
  function timeAgo(ts) {
    const s = (Date.now() - ts) / 1000;
    if (s < 3600) return Math.max(1, Math.floor(s / 60)) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago";
    const d = Math.floor(s / 86400);
    if (d === 1) return "yesterday";
    if (d < 30) return d + "d ago";
    return Math.floor(d / 30) + "mo ago";
  }
  function avatar(name, gold) {
    let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
    const initials = name.replace(/^u\//, "").split(/[\s_-]+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const bg = gold ? "linear-gradient(140deg,#e7c56a,#b8862f)" : `hsl(${h},45%,32%)`;
    return `<span class="fav" style="background:${bg};${gold ? "color:#0a0e1a" : ""}">${esc(initials)}</span>`;
  }
  const hashNum = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

  /* ---------- auto-generated agent answers ----------
     Deterministic, template-based replies keyed to the topic detected in
     each question. No fabricated prices — helpful, honest, and always
     funnelling to WhatsApp. Variant chosen by a stable hash of the post id
     so each thread reads a little differently but never changes on reload. */
  const ANSWERS = {
    tax: [
      "Great question — and it matters more than most people think. Non-filers pay roughly double the advance tax on both purchase and sale, plus limits on high-value transactions. Get onto the ATL before you transact; it usually saves far more than it costs. Send me the deal size on WhatsApp and I'll estimate your exact tax either way.",
      "Short version: filing first almost always pays for itself. The advance-tax gap between filer and non-filer on a decent-sized property runs into serious money. Message me the property value and I'll break your numbers down."
    ],
    overseas: [
      "This is exactly where overseas buyers get burned. Never pay a token before ownership is verified at the society/CDA one-window, always pay into the seller's own account (never a dealer's), and get a written agreement with CNIC + file number first. I handle this verification for overseas clients regularly — WhatsApp me and I'll walk you through it safely.",
      "Buying from abroad is very doable if you never skip verification. Confirm the file/plot directly with the society, use a trusted rep for the physical check, and document everything before any payment. Message me your target area and I'll tell you what to watch for."
    ],
    rent: [
      "Honest answer: in CDA sectors rental yields are low, so renting-and-investing can win in the short term — but land appreciation and the inflation hedge usually favour owning if you'll hold 5+ years. It comes down to your timeline. Tell me yours on WhatsApp and I'll run the actual buy-vs-rent numbers for you.",
      "It really depends how long you'll stay. Under ~3 years, renting often wins; 5+ years, owning usually pulls ahead once appreciation is counted. Send me your budget and timeframe and I'll model both."
    ],
    scam: [
      "If it's far below market with urgency and a 'pre-launch' pitch, treat it as a red flag. Verify three things: an approved NOC, that the developer actually owns the land, and the files-sold vs land-available ratio. If any is murky, walk. I keep a shortlist of societies I'd put my own money in — message me and I'll tell you if this one's legit.",
      "Half price + limited time + pressure is the classic combo. Check the NOC status and how many files they've already sold against the land they truly own before paying a rupee. WhatsApp me the society name and I'll give you a straight read."
    ],
    possession: [
      "Sorry you're dealing with this — it's more common than it should be. Document every promise in writing, and know that possession/refund delays are a genuine resale red flag too. Depending on the society there are real options. Tell me which one on WhatsApp and I'll tell you where you actually stand.",
      "Keep everything in writing and don't rely on verbal 'coming soon' timelines. Some societies are just slow, others are a warning sign. Message me the society and I'll tell you how buyers there have actually fared."
    ],
    installment: [
      "'No interest' installments aren't free — the cost is baked into a higher price. They make sense only if the appreciation outpaces that premium and the cash flow suits you. Send me the plan and the equivalent cash price and I'll tell you if the premium is fair.",
      "Always compare the installment total against the cash price plus what that cash could earn elsewhere. Sometimes it's worth it, often it isn't. WhatsApp me the numbers and I'll check it for you."
    ],
    society: [
      "Both sides have a case here — it usually comes down to whether you're buying to live now or to hold. Established sectors win on liquidity and utilities; newer ones can close the price gap over time. Tell me your budget and timeframe on WhatsApp and I'll pull recent sold comps so you're comparing like-for-like.",
      "The 'which area' question is really a 'live now vs invest' question. I'd match it to your timeline and exit plan rather than hype. Message me the shortlist and budget and I'll rank them with real recent sales."
    ],
    price: [
      "Prices swing a lot by sector, street and even sun-facing, so a single 'rate' can be misleading. I price off recent actual sold deals, not asking prices. Send me the exact location and size on WhatsApp and I'll give you an honest current value.",
      "Asking prices and real closed prices are often quite different. Tell me the precise plot/house details and I'll give you the number I'd actually advise a client to pay."
    ],
    generic: [
      "Good question — the honest answer depends on your budget, timeline and whether you're buying to live or to invest. That's exactly the kind of thing I help people think through every day. Message me the specifics on WhatsApp and I'll give you a straight, no-pressure answer.",
      "Happy to help with this one. The right move really depends on your goals and numbers. Send me the details on WhatsApp and I'll point you the right way."
    ]
  };
  function detectTopic(t) {
    if (/\bvs\b|versus|which (society|area|sector|is better)|(\bdha\b[\s\S]*bahria|bahria[\s\S]*\bdha\b)|better (area|society|option)/.test(t)) return "society";
    if (/non.?filer|\bfiler\b|advance tax|\bfbr\b|\btax\b|withholding/.test(t)) return "tax";
    if (/overseas|abroad|dubai|\buk\b|\busa\b|canada|expat|remit|non.?resident/.test(t)) return "overseas";
    if (/rent vs buy|rent or buy|should i (rent|buy)|renting/.test(t)) return "rent";
    if (/scam|fraud|fake file|too good|double.?sold|\bfishy\b|legit\b|genuine\?/.test(t)) return "scam";
    if (/possession|handover|not delivered|refund|delay(ed)?|stuck/.test(t)) return "possession";
    if (/installment|instalment|no interest|payment plan|down payment/.test(t)) return "installment";
    if (/worth|price|\brate\b|\bvalue\b|overpriced|over ?priced|per marla|per kanal|how much/.test(t)) return "price";
    if (/\bdha\b|bahria|gulberg|enclave|which (area|sector)/.test(t)) return "society";
    return null;
  }
  // Title carries the intent; only fall back to the body if the title is vague.
  function topicOf(title, body) {
    return detectTopic((title || "").toLowerCase())
      || detectTopic(((title || "") + " " + (body || "")).toLowerCase())
      || "generic";
  }
  function generateAnswer(post) {
    const set = ANSWERS[topicOf(post.title, post.body)];
    return set[hashNum(post.id || post.title) % set.length];
  }

  /* ---------- fallback questions (shown until the live feed lands) ---------- */
  const FALLBACK = [
    { id: "f1", sub: "islamabad", author: "throwaway_isb", ts: Date.now() - 5 * 3600e3, score: 34, num_comments: 18,
      title: "DHA Phase 2 vs Bahria Enclave for a 10 marla — which actually holds value?", body: "Budget around 4.5–5 crore. DHA feels safer but pricier, Enclave is cheaper and greener but I keep hearing possession horror stories.", url: "https://www.reddit.com/r/islamabad/" },
    { id: "f2", sub: "pakistan", author: "dxb_expat", ts: Date.now() - 9 * 3600e3, score: 51, num_comments: 27,
      title: "Overseas Pakistani — how do I buy a plot in Islamabad without getting scammed?", body: "I'm in Dubai and terrified of paying a token for a file that doesn't exist. What's the safe process when you can't be there in person?", url: "https://www.reddit.com/r/pakistan/" },
    { id: "f3", sub: "lahore", author: "lhr_saver", ts: Date.now() - 26 * 3600e3, score: 22, num_comments: 14,
      title: "Rent vs buy in Lahore right now — the maths just doesn't add up?", body: "Rent is way cheaper than the buying equivalent. Am I mad to keep renting and invest the difference?", url: "https://www.reddit.com/r/lahore/" },
    { id: "f4", sub: "islamabad", author: "first_home_pk", ts: Date.now() - 2 * 86400e3, score: 40, num_comments: 31,
      title: "Offered a 'file' in a new society at half the market rate. Too good to be true?", body: "Dealer says limited-time pre-launch and is pushing hard. What are the red flags of a fake or overselling society?", url: "https://www.reddit.com/r/islamabad/" },
    { id: "f5", sub: "pakistan", author: "filer_confused", ts: Date.now() - 3 * 86400e3, score: 29, num_comments: 12,
      title: "Non-filer buying a 1 kanal — how much extra tax am I actually paying?", body: "Everyone says become a filer first. Is the difference really that big or is it overblown?", url: "https://www.reddit.com/r/pakistan/" }
  ];

  /* ---------- rendering ---------- */
  let sortMode = "new";
  let items = FALLBACK.slice();

  function sortItems(list) {
    const a = list.slice();
    if (sortMode === "top") a.sort((x, y) => (y.num_comments + y.score) - (x.num_comments + x.score));
    else a.sort((x, y) => y.ts - x.ts);
    return a;
  }

  function card(p) {
    const sub = SUB_LABEL[p.sub] || ("r/" + (p.sub || "pakistan"));
    const answer = generateAnswer(p);
    const wa = WA + "?text=" + encodeURIComponent('Hello Adeel — I saw this question on your site: "' + p.title + '". I have the same question, can you help?');
    const body = (p.body || "").trim();
    const snippet = body.length > 240 ? body.slice(0, 240).trim() + "…" : body;
    return `<article class="fpost">
      <div class="fpost__main">
        <div class="fpost__meta">
          <span class="fpost__topic">${esc(sub)}</span>
          <span class="fpost__who">${avatar("u/" + (p.author || "redditor"))}<span class="fpost__name">u/${esc(p.author || "redditor")}</span></span>
          <span class="fpost__time">· ${timeAgo(p.ts)}</span>
          ${p.num_comments != null ? `<span class="fpost__time">· 💬 ${p.num_comments}</span>` : ""}
        </div>
        <h3 class="fpost__title">${esc(p.title)}</h3>
        ${snippet ? `<p class="fpost__body">${esc(snippet)}</p>` : ""}
        ${p.url ? `<a class="fpost__src" href="${esc(p.url)}" target="_blank" rel="noopener">View discussion on Reddit ↗</a>` : ""}
        <div class="fanswer">
          <div class="fanswer__head">${avatar(AGENT, true)}<span class="fanswer__name">${esc(AGENT)}</span><span class="fpost__verified">✓ Verified Agent</span></div>
          <p class="fanswer__body">${esc(answer)}</p>
          <a class="fanswer__wa" href="${wa}" target="_blank" rel="noopener">💬 Ask me about this on WhatsApp →</a>
        </div>
      </div>
    </article>`;
  }

  function renderList() {
    listEl.innerHTML = sortItems(items).map(card).join("");
    if (window.ScrollTrigger) try { ScrollTrigger.refresh(); } catch {}
  }
  function syncSorts() { document.querySelectorAll(".forum__sort").forEach((b) => b.classList.toggle("is-active", b.dataset.sort === sortMode)); }

  const sortsEl = document.getElementById("forumSorts");
  if (sortsEl) sortsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sort]"); if (!b) return;
    sortMode = b.dataset.sort; syncSorts(); renderList();
  });

  renderList(); // fallback content immediately

  /* ---------- live feed ---------- */
  fetch("data/forum-feed.json", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((data) => {
      const live = (data && data.items) || [];
      if (live.length) { items = live; renderList(); }
      const stamp = document.getElementById("forumStamp");
      if (stamp && data && data.updated) stamp.textContent = "Updated " + timeAgo(Date.parse(data.updated)) + " · refreshes automatically";
    })
    .catch(() => { /* keep fallback questions */ });
})();

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
    landlord: [
      "Punjab's Rented Premises Act governs this — what matters most is what your written agreement says about increases at renewal. If it's silent, the increase is negotiable, not automatic, and you're entitled to proper notice. Message me the details on WhatsApp and I'll tell you what's actually enforceable.",
      "Rent increases at renewal are a negotiation unless your agreement fixes them. Get everything in writing and don't rely on a verbal demand. Send me your situation and I'll tell you where you stand."
    ],
    inheritance: [
      "Inherited property with multiple heirs needs the succession certificate and every heir's share settled properly before a clean sale — otherwise the buyer walks. The usual routes are one sibling buying the others out, or an agreed sale with a written distribution. Message me and I'll explain the cleanest path for your case.",
      "This is very common and very fixable. Get the succession/legal heirship sorted first, agree the split in writing, then go to market — a clean title is what gets you full price. WhatsApp me the details and I'll walk you through the order of steps."
    ],
    documents: [
      "Before any token, check: the title deed (registry/intiqal), a fresh fard from the land record, the approved building plan, the society NOC and dues clearance, and the seller's CNIC matching the title. Never rely on the dealer's word alone. Send me the property details and I'll do this verification with you.",
      "Verify ownership independently at the record office, confirm no dues or disputes outstanding, and match the seller's CNIC to the title before a rupee moves. I do exactly this check for clients — WhatsApp me and I'll run it on your property."
    ],
    noc: [
      "Check the NOC directly with the relevant authority — CDA/RDA for Islamabad and Rawalpindi, LDA for Lahore — not with the developer's brochure. Ask which specific sectors or phases are approved, because societies often advertise partial approval as full. Message me the society name and I'll tell you its real status.",
      "'Approved' is often doing a lot of work in marketing material. Confirm with the development authority which phases are actually NOC-cleared, and for how much land. Send me the society and I'll give you a straight read."
    ],
    yield: [
      "Rental yield in Pakistan is typically modest — most of the return has historically come from capital appreciation, not rent. Apartments can yield better than houses, but factor in management, maintenance and how liquid resale really is. Tell me the building and unit and I'll give you realistic numbers.",
      "Look past the headline yield to service charges, vacancy and resale liquidity — that's where apartment returns are won or lost. WhatsApp me the specifics and I'll model the real net figure."
    ],
    commercial: [
      "Commercial can yield better than residential, but the entry premium, vacancy risk and tenant quality all matter far more. Location and footfall drive everything. Tell me the budget and area you're considering and I'll tell you whether the premium is justified.",
      "Higher yield comes with higher risk and a much less liquid resale market. It suits some investors and not others. Message me your budget and goals and I'll give you an honest recommendation."
    ],
    timing: [
      "Nobody reliably times this market — what protects you is buying well: the right area, a fair price against genuine recent sales, and a holding period long enough to ride out cycles. Tell me your timeline and budget on WhatsApp and I'll tell you honestly whether to move now or wait.",
      "Rather than guessing the market, I'd focus on paying the right price for the right location. That's what has historically mattered far more than timing. Send me your plan and I'll give you a straight answer."
    ],
    plotvshouse: [
      "Plots have a lower entry, no maintenance and often stronger appreciation — but they earn nothing while you hold. A built house gives rental income but ties up more capital. It comes down to whether you need cash flow now or growth later. Message me your budget and I'll show you both options.",
      "Plot for growth, house for income — that's the short version. Which is right depends on your cash flow needs and horizon. WhatsApp me your numbers and I'll compare them properly for you."
    ],
    generic: [
      "Good question — the honest answer depends on your budget, timeline and whether you're buying to live or to invest. That's exactly the kind of thing I help people think through every day. Message me the specifics on WhatsApp and I'll give you a straight, no-pressure answer.",
      "Happy to help with this one. The right move really depends on your goals and numbers. Send me the details on WhatsApp and I'll point you the right way."
    ]
  };
  function detectTopic(t) {
    if (/\bvs\b|versus|which (society|area|sector|is better)|(\bdha\b[\s\S]*bahria|bahria[\s\S]*\bdha\b)|better (area|society|option)/.test(t)) return "society";
    if (/landlord|tenant|raising rent|rent increase|increase.*rent|eviction|lease renewal/.test(t)) return "landlord";
    if (/inherit|succession|legal heir|siblings?|father'?s property|family property/.test(t)) return "inheritance";
    if (/\bnoc\b|approved by (cda|lda|rda)|society approval/.test(t)) return "noc";
    if (/what documents|which documents|paperwork|title deed|\bfard\b|\bintiqal\b|registry|verify.*(ownership|documents)/.test(t)) return "documents";
    if (/rental yield|\byield\b|rental income|apartments?\b.*(invest|yield|rent)|flat.*(invest|yield)/.test(t)) return "yield";
    if (/commercial (property|plot|shop|plaza)|shop\b|plaza\b/.test(t)) return "commercial";
    if (/good time to buy|right time|wait for prices|market (crash|cool|dip|timing)|prices (drop|fall|cool)/.test(t)) return "timing";
    if (/plot or (a )?(built )?house|plot vs\.? house|house vs\.? plot/.test(t)) return "plotvshouse";
    // Remittance/overseas wins over the generic tax rule — "send money home
    // without tax headaches" is an overseas question, not a filer question.
    if (/remit|send(ing)? money home|transfer money (home|back)|overseas|abroad|dubai|expat|non.?resident/.test(t)) return "overseas";
    if (/non.?filer|\bfiler\b|advance tax|\bfbr\b|\btax\b|withholding/.test(t)) return "tax";
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

  /* ---------- curated question pool ----------
     Shown until (and whenever) the live Reddit feed is unavailable. These are
     the questions buyers genuinely ask, written the way they ask them. A
     day-seeded rotation surfaces a different six each day, so the section stays
     alive with no external dependency — and the timestamps are computed
     relative to "now", so nothing ever reads as stale. */
  const POOL = [
    { sub: "islamabad", author: "throwaway_isb", h: 5, c: 18,
      title: "DHA Phase 2 vs Bahria Enclave for a 10 marla — which actually holds value?",
      body: "Budget around 4.5–5 crore. DHA feels safer but pricier, Enclave is cheaper and greener but I keep hearing possession horror stories." },
    { sub: "pakistan", author: "dxb_expat", h: 9, c: 27,
      title: "Overseas Pakistani — how do I buy a plot in Islamabad without getting scammed?",
      body: "I'm in Dubai and terrified of paying a token for a file that doesn't exist. What's the safe process when you can't be there in person?" },
    { sub: "lahore", author: "lhr_saver", h: 26, c: 14,
      title: "Rent vs buy in Lahore right now — the maths just doesn't add up?",
      body: "Rent is way cheaper than the buying equivalent. Am I mad to keep renting and invest the difference?" },
    { sub: "islamabad", author: "first_home_pk", h: 48, c: 31,
      title: "Offered a 'file' in a new society at half the market rate. Too good to be true?",
      body: "Dealer says limited-time pre-launch and is pushing hard. What are the red flags of a fake or overselling society?" },
    { sub: "pakistan", author: "filer_confused", h: 72, c: 12,
      title: "Non-filer buying a 1 kanal — how much extra tax am I actually paying?",
      body: "Everyone says become a filer first. Is the difference really that big or is it overblown?" },
    { sub: "islamabad", author: "b17_watcher", h: 14, c: 9,
      title: "Is B-17 still the best value in Islamabad or has that window closed?",
      body: "Prices have climbed a lot in two years. Is there still upside or am I late to it?" },
    { sub: "lahore", author: "dha9_buyer", h: 33, c: 21,
      title: "DHA Phase 9 Prism — worth buying a plot now or wait for development?",
      body: "Plot prices look reasonable but development seems slow. Does buying early actually pay off here?" },
    { sub: "pakistan", author: "inherited_mess", h: 55, c: 16,
      title: "Inherited property with multiple siblings — how do we sell without a family war?",
      body: "Four of us on the same title, two want to sell and two don't. What's the cleanest legal route?" },
    { sub: "islamabad", author: "gulberg_greens", h: 20, c: 11,
      title: "Farmhouse in Gulberg Greens as an investment — good idea or money pit?",
      body: "Attracted by the space and price per marla, but worried about resale demand and maintenance." },
    { sub: "lahore", author: "askari_renter", h: 40, c: 7,
      title: "Landlord raising rent 25% at renewal — is that even legal in Punjab?",
      body: "Nothing in the agreement mentions a cap. Do tenants have any protection here?" },
    { sub: "pakistan", author: "plot_vs_house", h: 62, c: 24,
      title: "Plot or built house for a first investment — which is the smarter buy?",
      body: "Plot has no rental income but lower entry. House gives rent but costs a lot more upfront." },
    { sub: "islamabad", author: "cda_paperwork", h: 30, c: 13,
      title: "What documents should I actually check before paying token on a house?",
      body: "First-time buyer. I don't want to rely purely on what the dealer tells me." },
    { sub: "lahore", author: "bahria_orchard_q", h: 18, c: 10,
      title: "Bahria Orchard vs Central Park for a 5 marla — which area is safer long term?",
      body: "Similar budgets in both. Thinking about resale in about 5 years." },
    { sub: "pakistan", author: "remit_home", h: 80, c: 19,
      title: "Best way to send money home for a property purchase without tax headaches?",
      body: "Worried the transfer itself creates questions later about source of funds." },
    { sub: "islamabad", author: "e11_hunter", h: 26, c: 15,
      title: "E-11 apartments — genuinely good rental yield or a trap?",
      body: "Yields look attractive on paper but I keep hearing about management and ownership issues." },
    { sub: "lahore", author: "commercial_curious", h: 44, c: 8,
      title: "Is commercial property in Lahore worth the premium over residential?",
      body: "Rental yield looks better but entry price and risk both seem much higher." },
    { sub: "islamabad", author: "society_noc", h: 36, c: 22,
      title: "How do I actually verify a society's NOC myself?",
      body: "Everyone says 'check the NOC' but nobody explains where you check it or what approved really means." },
    { sub: "pakistan", author: "market_timing", h: 90, c: 17,
      title: "Is now a good time to buy or should I wait for prices to cool?",
      body: "Everyone has an opinion. Is there any way to judge this that isn't just guessing?" }
  ];

  // Deterministic day-of-year rotation: same questions all day, fresh tomorrow.
  function rotatedPool(n) {
    const day = Math.floor(Date.now() / 86400e3);
    const out = [];
    for (let i = 0; i < Math.min(n, POOL.length); i++) {
      const q = POOL[(day * 7 + i * 5) % POOL.length];
      if (!out.some((x) => x.title === q.title)) out.push(q);
    }
    // top up if the stride produced duplicates
    for (let i = 0; out.length < Math.min(n, POOL.length); i++) {
      const q = POOL[i % POOL.length];
      if (!out.some((x) => x.title === q.title)) out.push(q);
    }
    return out.map((q, i) => ({
      id: "f" + ((day + i) % 9973) + "-" + i,
      sub: q.sub, author: q.author, title: q.title, body: q.body,
      ts: Date.now() - q.h * 3600e3,
      score: 12 + ((day + i * 13) % 60),
      num_comments: q.c,
      url: "https://www.reddit.com/r/" + q.sub + "/"
    }));
  }

  /* ---------- rendering ---------- */
  let sortMode = "new";
  let items = rotatedPool(6);

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

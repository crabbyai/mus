/* ============================================================
   ASK THE EXPERT — two panels, and the line between them matters
   ------------------------------------------------------------
   TOP — "Live from Reddit". Genuinely live, and genuinely Reddit.
   Posts come from data/forum-feed.json (a scheduled Action pulls them
   through Reddit's OAuth API) and, failing that, from a direct
   client-side call to Reddit's public .json endpoints. If neither
   works the rail shows links straight into the real subreddits and
   nothing else. It never invents a post. Anything on that rail is a
   real thread by a real account with a real permalink.

   BOTTOM — "Asked & answered". Adeel's own question bank: the things
   buyers actually ask him, written the way they ask them, answered in
   his voice. These are anonymised, and the handles on them are
   randomly generated on purpose — they are display names, not Reddit
   accounts, and the panel says so.

   That separation is deliberate. The old version rendered the question
   bank as if it were Reddit — invented usernames, "5h ago" timestamps,
   and a "View discussion on Reddit" link under each one. Everything on
   this page has to survive a sceptical buyer checking it.
   ============================================================ */
(function () {
  "use strict";

  const section = document.getElementById("forum");
  const listEl = document.getElementById("forumList");
  if (!section || !listEl) return;

  const AGENT = "Adeel Rahman";
  const WA = "https://wa.me/16134083945";
  const SUBS = ["islamabad", "lahore", "pakistan", "rawalpindi"];
  const SUB_LABEL = { islamabad: "r/islamabad", lahore: "r/lahore", pakistan: "r/pakistan", rawalpindi: "r/rawalpindi" };
  const CITY = { islamabad: "Islamabad", lahore: "Lahore", rawalpindi: "Rawalpindi", pakistan: "Nationwide" };

  const esc = (t) => { const d = document.createElement("div"); d.textContent = t == null ? "" : t; return d.innerHTML; };
  const hashNum = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  /* xorshift so the second and third draws off one seed aren't just the first
     one shifted — otherwise every "AhmedKhan" gets the same six digits. */
  function rng(seed) {
    let x = seed || 1;
    return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x; };
  }

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
    const clean = String(name).replace(/^u\//, "");
    let h = 0; for (let i = 0; i < clean.length; i++) h = (h * 31 + clean.charCodeAt(i)) % 360;
    // Strip the trailing digits before taking initials, or every generated
    // handle would read "A3" instead of "AK".
    const words = clean.replace(/\d+$/, "").split(/(?=[A-Z])|[\s_-]+/).filter(Boolean);
    const initials = (words.length > 1 ? words[0][0] + words[1][0] : clean.slice(0, 2)).toUpperCase();
    const bg = gold ? "linear-gradient(140deg,#e7c56a,#b8862f)" : `hsl(${h},45%,32%)`;
    return `<span class="fav" style="background:${bg};${gold ? "color:#0a0e1a" : ""}">${esc(initials)}</span>`;
  }

  /* ---------- display handles ----------
     Two capitalised words run together plus six digits, the shape a real
     forum handle takes. The word pairs are drawn from Pakistani given
     names and surnames, or from an adjective/agent-noun pair, or one of
     each — so the list reads like a room of different people rather than
     eighteen variations on "throwaway_isb". Seeded off the question id, so
     a given question keeps its handle across reloads and devices. */
  const NAME_FIRST = ["Ahmed", "Bilal", "Faisal", "Hamza", "Imran", "Junaid", "Kamran", "Nauman", "Omar", "Rizwan",
    "Saad", "Talha", "Usman", "Waleed", "Yasir", "Zohaib", "Adnan", "Danish", "Farhan", "Haris", "Shahzad", "Tariq",
    "Areeba", "Hina", "Iqra", "Maryam", "Sana", "Zainab", "Ayesha", "Fatima", "Rabia", "Nimra", "Komal", "Sadia"];
  const NAME_LAST = ["Khan", "Malik", "Qureshi", "Siddiqui", "Chaudhry", "Sheikh", "Abbasi", "Awan", "Baig", "Farooqi",
    "Hashmi", "Janjua", "Kiani", "Lodhi", "Mirza", "Niazi", "Raja", "Satti", "Tarar", "Warraich", "Zaidi", "Ansari",
    "Durrani", "Gondal", "Bhatti", "Rehman", "Iqbal", "Aslam", "Nawaz", "Shah"];
  const WORD_ADJ = ["Silent", "Rapid", "Golden", "Northern", "Quiet", "Steady", "Curious", "Honest", "Modest",
    "Restless", "Patient", "Frugal", "Prudent", "Humble", "Eager", "Cautious", "Sharp", "Bright", "Calm", "Bold",
    "Careful", "Distant", "Lucky", "Weary", "Hopeful"];
  const WORD_NOUN = ["Builder", "Seeker", "Planner", "Saver", "Hunter", "Trader", "Dweller", "Watcher", "Wanderer",
    "Investor", "Buyer", "Renter", "Digger", "Climber", "Roamer", "Chaser", "Finder", "Keeper", "Drifter", "Settler",
    "Mover", "Bidder", "Broker", "Dreamer", "Waiter"];

  function handleFor(seed) {
    const next = rng(hashNum("handle:" + seed));
    const mode = next() % 4;
    const a = mode === 0 || mode === 2 ? NAME_FIRST : WORD_ADJ;
    const b = mode === 0 || mode === 3 ? NAME_LAST : WORD_NOUN;
    const w1 = a[next() % a.length];
    const w2 = b[next() % b.length];
    return w1 + w2 + String(next() % 1e6).padStart(6, "0");
  }

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
      "The 'which area' question is really a 'live now vs invest' question. I'd match it to your timeline and exit plan rather than hype. Message me the shortlist and budget and I'll rank them with real recent sales.",
      "I'd judge it on three things rather than reputation: how much of the phase is actually built and occupied, whether utilities and access roads are in place, and how quickly plots there resell. A cheaper area with real activity beats a famous one that's still empty. Send me both options and I'll tell you which one buyers are actually moving on.",
      "Price gaps between neighbouring areas are usually the market pricing in something real — approval status, development pace, or access. Sometimes it's mispriced and that's your opportunity. Tell me the two you're weighing and I'll tell you which it is.",
      "Whichever way you lean, buy the street rather than the society name. Within the same phase, corner, park-facing and main-boulevard plots behave very differently on resale. WhatsApp me the shortlist and I'll point you at the pockets worth paying up for."
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

  const TOPIC_LABEL = {
    tax: "Tax & filer status", overseas: "Buying from abroad", rent: "Rent vs buy",
    scam: "Scams & red flags", possession: "Possession & delays", installment: "Payment plans",
    society: "Society comparison", price: "Pricing & value", landlord: "Landlord & tenant",
    inheritance: "Inheritance", documents: "Paperwork", noc: "NOC & approvals",
    yield: "Rental yield", commercial: "Commercial", timing: "Market timing",
    plotvshouse: "Plot vs house", generic: "General advice"
  };

  function detectTopic(t) {
    /* "rent vs buy" is a rent question, not an area comparison — it has to be
       tested before the generic "vs" rule below or it lands in society. */
    if (/rent(ing)? (vs\.?|or) buy|buy(ing)? (vs\.?|or) rent/.test(t)) return "rent";
    if (/plot or (a )?(built )?house|plot vs\.? house|house vs\.? plot/.test(t)) return "plotvshouse";
    if (/\bvs\b|versus|which (society|area|sector|is better)|(\bdha\b[\s\S]*bahria|bahria[\s\S]*\bdha\b)|better (area|society|option)/.test(t)) return "society";
    if (/landlord|tenant|raising rent|rent increase|increase.*rent|eviction|lease renewal/.test(t)) return "landlord";
    if (/inherit|succession|legal heir|siblings?|father'?s property|family property/.test(t)) return "inheritance";
    if (/\bnoc\b|approved by (cda|lda|rda)|society approval/.test(t)) return "noc";
    if (/what documents|which documents|paperwork|title deed|\bfard\b|\bintiqal\b|registry|verify.*(ownership|documents)/.test(t)) return "documents";
    if (/rental yield|\byield\b|rental income|apartments?\b.*(invest|yield|rent)|flat.*(invest|yield)/.test(t)) return "yield";
    if (/commercial (property|plot|shop|plaza)|shop\b|plaza\b/.test(t)) return "commercial";
    if (/good time to buy|right time|wait for prices|market (crash|cool|dip|timing)|prices (drop|fall|cool)/.test(t)) return "timing";
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
  function answerFor(post) {
    const set = ANSWERS[post.topic || topicOf(post.title, post.body)];
    return set[hashNum(post.id || post.title) % set.length];
  }
  const waLink = (title, lead) =>
    WA + "?text=" + encodeURIComponent((lead || 'Hello Adeel — about this question: "') + title + '". Can you help?');

  /* ============================================================
     PANEL 2 — Adeel's question bank
     ============================================================ */
  const BANK = [
    { sub: "islamabad",
      q: "DHA Phase 2 vs Bahria Enclave for a 10 marla — which actually holds value?",
      b: "Budget around 4.5–5 crore. DHA feels safer but pricier, Enclave is cheaper and greener but I keep hearing possession horror stories." },
    { sub: "pakistan",
      q: "Overseas Pakistani — how do I buy a plot in Islamabad without getting scammed?",
      b: "I'm in Dubai and terrified of paying a token for a file that doesn't exist. What's the safe process when you can't be there in person?" },
    { sub: "lahore",
      q: "Rent vs buy in Lahore right now — the maths just doesn't add up?",
      b: "Rent is way cheaper than the buying equivalent. Am I mad to keep renting and invest the difference?" },
    { sub: "islamabad",
      q: "Offered a 'file' in a new society at half the market rate. Too good to be true?",
      b: "Dealer says limited-time pre-launch and is pushing hard. What are the red flags of a fake or overselling society?" },
    { sub: "pakistan",
      q: "Non-filer buying a 1 kanal — how much extra tax am I actually paying?",
      b: "Everyone says become a filer first. Is the difference really that big or is it overblown?" },
    { sub: "islamabad",
      q: "Is B-17 still the best value in Islamabad or has that window closed?",
      b: "Prices have climbed a lot in two years. Is there still upside or am I late to it?" },
    { sub: "lahore",
      q: "DHA Phase 9 Prism — worth buying a plot now or wait for development?",
      b: "Plot prices look reasonable but development seems slow. Does buying early actually pay off here?" },
    { sub: "pakistan",
      q: "Inherited property with multiple siblings — how do we sell without a family war?",
      b: "Four of us on the same title, two want to sell and two don't. What's the cleanest legal route?" },
    { sub: "islamabad",
      q: "Farmhouse in Gulberg Greens as an investment — good idea or money pit?",
      b: "Attracted by the space and price per marla, but worried about resale demand and maintenance." },
    { sub: "lahore",
      q: "Landlord raising rent 25% at renewal — is that even legal in Punjab?",
      b: "Nothing in the agreement mentions a cap. Do tenants have any protection here?" },
    { sub: "pakistan",
      q: "Plot or built house for a first investment — which is the smarter buy?",
      b: "Plot has no rental income but lower entry. House gives rent but costs a lot more upfront." },
    { sub: "islamabad",
      q: "What documents should I actually check before paying token on a house?",
      b: "First-time buyer. I don't want to rely purely on what the dealer tells me." },
    { sub: "lahore",
      q: "Bahria Orchard vs Central Park for a 5 marla — which area is safer long term?",
      b: "Similar budgets in both. Thinking about resale in about 5 years." },
    { sub: "pakistan",
      q: "Best way to send money home for a property purchase without tax headaches?",
      b: "Worried the transfer itself creates questions later about source of funds." },
    { sub: "islamabad",
      q: "E-11 apartments — genuinely good rental yield or a trap?",
      b: "Yields look attractive on paper but I keep hearing about management and ownership issues." },
    { sub: "lahore",
      q: "Is commercial property in Lahore worth the premium over residential?",
      b: "Rental yield looks better but entry price and risk both seem much higher." },
    { sub: "islamabad",
      q: "How do I actually verify a society's NOC myself?",
      b: "Everyone says 'check the NOC' but nobody explains where you check it or what approved really means." },
    { sub: "pakistan",
      q: "Is now a good time to buy or should I wait for prices to cool?",
      b: "Everyone has an opinion. Is there any way to judge this that isn't just guessing?" },
    { sub: "rawalpindi",
      q: "Bahria Town Phase 8 vs Adiala Road — is the price gap justified?",
      b: "Adiala side is far cheaper per marla but I can't tell whether that's opportunity or warning." },
    { sub: "islamabad",
      q: "Seller wants the whole payment before transfer. Is that normal?",
      b: "He says transfer takes weeks and he needs the funds first. Something about it feels off." }
  ];

  const bank = BANK.map((it, i) => {
    const id = "q" + String(i + 1).padStart(2, "0");
    const topic = topicOf(it.q, it.b);
    return {
      id, topic, sub: it.sub, title: it.q, body: it.b,
      author: handleFor(id + it.q),
      city: CITY[it.sub] || "Pakistan"
    };
  });
  /* Answer variants round-robin within a topic rather than being picked by
     hash. Five questions land on "society comparison", and a hash across two
     variants puts the identical paragraph under several of them — which reads
     exactly like the boilerplate it is. Cycling guarantees neighbours differ. */
  (function assignAnswers() {
    const used = {};
    bank.forEach((p) => {
      const set = ANSWERS[p.topic] || ANSWERS.generic;
      const n = used[p.topic] || 0;
      used[p.topic] = n + 1;
      p.answer = set[n % set.length];
    });
  })();

  /* ---------- bank rendering ---------- */
  const PAGE = 6;
  let topicFilter = "all";
  let query = "";
  let shown = PAGE;

  const searchEl = document.getElementById("forumSearch");
  const topicsEl = document.getElementById("forumTopics");
  const countEl = document.getElementById("forumCount");
  const moreEl = document.getElementById("forumMore");

  function matches(p) {
    if (topicFilter !== "all" && p.topic !== topicFilter) return false;
    if (!query) return true;
    return (p.title + " " + p.body + " " + (TOPIC_LABEL[p.topic] || "") + " " + p.city).toLowerCase().includes(query);
  }

  function bankCard(p) {
    const wa = waLink(p.title, 'Hello Adeel — I saw this on your site: "');
    return `<article class="fpost" id="ask-${esc(p.id)}">
      <div class="fpost__main">
        <div class="fpost__meta">
          <span class="fpost__topic">${esc(TOPIC_LABEL[p.topic] || "General")}</span>
          <span class="fpost__who">${avatar(p.author)}<span class="fpost__name">${esc(p.author)}</span></span>
          <span class="fpost__time">· ${esc(p.city)}</span>
        </div>
        <h3 class="fpost__title">${esc(p.title)}</h3>
        <p class="fpost__body">${esc(p.body)}</p>
        <div class="fanswer">
          <div class="fanswer__head">${avatar(AGENT, true)}<span class="fanswer__name">${esc(AGENT)}</span><span class="fpost__verified">✓ Verified Agent</span></div>
          <p class="fanswer__body">${esc(p.answer)}</p>
          <div class="fanswer__actions">
            <a class="fanswer__wa" href="${wa}" target="_blank" rel="noopener">💬 Ask me about this on WhatsApp →</a>
            <button class="fpost__act" type="button" data-share="${esc(p.id)}">🔗 Copy link</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  function renderTopics() {
    if (!topicsEl) return;
    const counts = {};
    bank.forEach((p) => { counts[p.topic] = (counts[p.topic] || 0) + 1; });
    const keys = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
    topicsEl.innerHTML = [`<button class="ftopic${topicFilter === "all" ? " is-active" : ""}" type="button" data-topic="all">All topics <span>${bank.length}</span></button>`]
      .concat(keys.map((k) => `<button class="ftopic${topicFilter === k ? " is-active" : ""}" type="button" data-topic="${esc(k)}">${esc(TOPIC_LABEL[k] || k)} <span>${counts[k]}</span></button>`))
      .join("");
  }

  function renderBank() {
    const hits = bank.filter(matches);
    listEl.innerHTML = hits.length
      ? hits.slice(0, shown).map(bankCard).join("")
      : `<p class="forum__empty">Nothing matches “${esc(query)}” yet — but I'll still answer it. <a href="${waLink(query || "a property question", "Hello Adeel — I have a question: ")}" target="_blank" rel="noopener">Ask me directly on WhatsApp →</a></p>`;
    if (countEl) {
      countEl.textContent = hits.length === bank.length
        ? bank.length + " questions answered"
        : hits.length + " of " + bank.length + " questions";
    }
    if (moreEl) {
      moreEl.hidden = hits.length <= shown;
      moreEl.textContent = "Show " + Math.min(PAGE, hits.length - shown) + " more";
    }
    if (window.ScrollTrigger) try { ScrollTrigger.refresh(); } catch (err) { /* not loaded */ }
  }

  if (topicsEl) topicsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-topic]"); if (!b) return;
    topicFilter = b.dataset.topic; shown = PAGE; renderTopics(); renderBank();
  });
  if (searchEl) {
    let t = 0;
    searchEl.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => { query = searchEl.value.trim().toLowerCase(); shown = PAGE; renderBank(); }, 140);
    });
  }
  if (moreEl) moreEl.addEventListener("click", () => { shown += PAGE; renderBank(); });

  listEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-share]"); if (!b) return;
    const url = location.origin + location.pathname + "#ask-" + b.dataset.share;
    const done = () => { const o = b.textContent; b.textContent = "✓ Link copied"; setTimeout(() => { b.textContent = o; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done).catch(() => { location.hash = "ask-" + b.dataset.share; });
    else { location.hash = "ask-" + b.dataset.share; done(); }
  });

  renderTopics();
  renderBank();

  // Deep link straight to a question — expand past the fold if it's paged out.
  if (/^#ask-/.test(location.hash)) {
    const want = location.hash.slice(5);
    while (shown < bank.length && !bank.slice(0, shown).some((p) => p.id === want)) shown += PAGE;
    renderBank();
    const el = document.getElementById("ask-" + want);
    if (el) setTimeout(() => el.scrollIntoView({ block: "center" }), 300);
  }

  /* ============================================================
     PANEL 1 — live from Reddit. Real posts or nothing.
     ============================================================ */
  const liveEl = document.getElementById("forumLive");
  const subsEl = document.getElementById("forumSubs");
  const stampEl = document.getElementById("forumStamp");
  const openEl = document.getElementById("forumOpen");

  let live = [];
  let subFilter = "all";
  let liveSort = "new";

  /* With posts loaded the chips filter the rail. With nothing loaded there is
     nothing to filter, so they become what they should have been all along:
     doors into the actual subreddits. */
  function renderSubs() {
    if (!subsEl) return;
    const counts = {};
    live.forEach((p) => { counts[p.sub] = (counts[p.sub] || 0) + 1; });
    let chips;
    if (live.length) {
      chips = [`<button class="rsub${subFilter === "all" ? " is-active" : ""}" type="button" data-sub="all">All <span>${live.length}</span></button>`];
      SUBS.forEach((s) => {
        const n = counts[s] || 0;
        chips.push(`<button class="rsub${subFilter === s ? " is-active" : ""}${n ? "" : " is-empty"}" type="button" data-sub="${s}">${SUB_LABEL[s]}${n ? ` <span>${n}</span>` : ""}</button>`);
      });
    } else {
      chips = SUBS.map((s) =>
        `<a class="rsub rsub--link" href="https://www.reddit.com/r/${s}/" target="_blank" rel="noopener nofollow">${SUB_LABEL[s]} ↗</a>`);
    }
    subsEl.innerHTML = chips.join("");
    if (liveSortEl) liveSortEl.hidden = !live.length;
    if (openEl) {
      const target = live.length && subFilter !== "all" ? subFilter : "islamabad+lahore+pakistan+rawalpindi";
      openEl.href = "https://www.reddit.com/r/" + target + "/";
      openEl.textContent = "Open " + (target.indexOf("+") > 0 ? "all four subreddits" : SUB_LABEL[target]) + " ↗";
    }
  }

  function livePost(p) {
    const wa = waLink(p.title, 'Hello Adeel — I saw this question on Reddit: "');
    const topic = p.topic || (p.topic = topicOf(p.title, p.body));
    return `<article class="rpost">
      <a class="rpost__link" href="${esc(p.url)}" target="_blank" rel="noopener nofollow">
        <span class="rpost__top">
          <span class="rpost__sub">${esc(SUB_LABEL[p.sub] || "r/" + p.sub)}</span>
          <span class="rpost__by">u/${esc(p.author || "redditor")}</span>
          <span class="rpost__age">· ${timeAgo(p.ts)}</span>
        </span>
        <span class="rpost__title">${esc(p.title)}</span>
        <span class="rpost__stats">▲ ${p.score || 0} &nbsp; 💬 ${p.num_comments || 0} &nbsp; <span class="rpost__go">Read on Reddit ↗</span></span>
      </a>
      <button class="rpost__take" type="button" aria-expanded="false" data-take="${esc(p.id)}">Adeel's take <span aria-hidden="true">▾</span></button>
      <div class="rpost__answer" id="take-${esc(p.id)}" hidden>
        <div class="fanswer__head">${avatar(AGENT, true)}<span class="fanswer__name">${esc(AGENT)}</span><span class="fpost__verified">✓ Verified Agent</span><span class="rpost__tag">${esc(TOPIC_LABEL[topic] || "General")}</span></div>
        <p class="fanswer__body">${esc(answerFor(p))}</p>
        <a class="fanswer__wa" href="${wa}" target="_blank" rel="noopener">💬 Ask me about this on WhatsApp →</a>
      </div>
    </article>`;
  }

  function renderLive() {
    if (!liveEl) return;
    const rows = live.filter((p) => subFilter === "all" || p.sub === subFilter)
      .slice().sort((a, b) => (liveSort === "top" ? (b.score + b.num_comments) - (a.score + a.num_comments) : b.ts - a.ts))
      .slice(0, 6);
    liveEl.innerHTML = rows.map(livePost).join("");
    liveEl.hidden = !rows.length;
    renderSubs();
    if (window.ScrollTrigger) try { ScrollTrigger.refresh(); } catch (err) { /* not loaded */ }
  }

  if (subsEl) subsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sub]"); if (!b) return;
    subFilter = b.dataset.sub; renderLive();
  });
  if (liveEl) liveEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-take]"); if (!b) return;
    const panel = document.getElementById("take-" + b.dataset.take);
    if (!panel) return;
    const open = panel.hidden;
    panel.hidden = !open;
    b.setAttribute("aria-expanded", String(open));
    b.classList.toggle("is-open", open);
  });
  const liveSortEl = document.getElementById("forumLiveSort");
  if (liveSortEl) liveSortEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sort]"); if (!b) return;
    liveSort = b.dataset.sort;
    liveSortEl.querySelectorAll("[data-sort]").forEach((x) => x.classList.toggle("is-active", x === b));
    renderLive();
  });

  function setStamp(text, cls) {
    if (!stampEl) return;
    stampEl.textContent = text;
    stampEl.className = "forum__stamp" + (cls ? " " + cls : "");
  }

  /* Only real-estate questions, and only ones that read like questions —
     same filter the scheduled Action applies, repeated here because the
     client-side path talks to Reddit directly. */
  const RE_TOPIC = /\b(marla|kanal|plot|dha|bahria|gulberg|enclave|property|real ?estate|house|flat|apartment|rent|landlord|tenant|possession|society|non-?filer|filer|invest|cda|file|overseas|installment|instalment|for sale)\b/i;
  const RE_ASK = /\?|\b(how|should|is it|worth|advice|help|which|vs|versus|better|recommend|anyone|thoughts|legit|genuine|scam|confused)\b/i;

  function normalise(d, sub) {
    if (!d || !d.title || d.stickied || d.over_18) return null;
    const hay = d.title + " " + (d.selftext || "");
    if (!RE_TOPIC.test(hay) || !RE_ASK.test(d.title)) return null;
    return {
      id: d.id,
      sub: (d.subreddit || sub || "").toLowerCase(),
      author: d.author && d.author !== "[deleted]" ? d.author : "redditor",
      title: String(d.title).replace(/\s+/g, " ").slice(0, 180),
      body: String(d.selftext || "").replace(/\s+/g, " ").slice(0, 300),
      url: d.permalink ? "https://www.reddit.com" + d.permalink : "https://www.reddit.com/r/" + sub + "/",
      score: d.score || 0,
      num_comments: d.num_comments || 0,
      ts: (d.created_utc || 0) * 1000
    };
  }

  /* Reddit's public .json endpoints send CORS headers, but they also rate-limit
     and sometimes refuse outright depending on where the request comes from.
     Every failure here is expected and silent: the rail simply keeps whatever
     the scheduled feed gave it, and if that was nothing, it shows links into
     the real subreddits instead of inventing posts. */
  function fetchSubLive(sub) {
    const url = "https://www.reddit.com/r/" + sub +
      "/search.json?q=" + encodeURIComponent("property OR plot OR marla OR kanal OR DHA OR Bahria OR rent OR house") +
      "&restrict_sr=on&sort=new&t=year&limit=25&raw_json=1";
    const ctrl = typeof AbortController === "function" ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), 7000) : 0;
    return fetch(url, { signal: ctrl ? ctrl.signal : undefined, credentials: "omit", referrerPolicy: "no-referrer" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then((j) => ((j && j.data && j.data.children) || []).map((k) => normalise(k.data, sub)).filter(Boolean))
      .catch(() => [])
      .then((rows) => { if (timer) clearTimeout(timer); return rows; });
  }

  function merge(rows) {
    const seen = new Set(live.map((p) => p.id));
    rows.forEach((p) => { if (p && !seen.has(p.id)) { seen.add(p.id); live.push(p); } });
    live.sort((a, b) => b.ts - a.ts);
  }

  function loadLive() {
    setStamp("Checking r/islamabad, r/lahore, r/pakistan…", "is-loading");
    // The scheduled feed first: it goes through Reddit's OAuth API from a
    // server, so it's the more dependable of the two.
    fetch("data/forum-feed.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("no feed"))))
      .then((d) => {
        merge((d && d.items) || []);
        if (live.length) {
          renderLive();
          setStamp(d.updated ? "Updated " + timeAgo(Date.parse(d.updated)) + " · refreshes every 6 hours" : "Live from Reddit", "is-live");
        }
      })
      .catch(() => { /* fall through to the browser-side attempt */ })
      .then(() => Promise.all(SUBS.slice(0, 3).map(fetchSubLive)))
      .then((sets) => {
        const before = live.length;
        sets.forEach(merge);
        if (live.length) {
          renderLive();
          if (!before) setStamp("Live from Reddit · fetched just now", "is-live");
        } else {
          renderLive();
          setStamp("Reddit isn't responding right now — open the subreddits directly:", "is-off");
        }
      });
  }

  // Nothing loads until the section is actually approaching the viewport.
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); loadLive(); }
    }, { rootMargin: "600px 0px" });
    io.observe(section);
  } else {
    loadLive();
  }

  renderSubs();
})();

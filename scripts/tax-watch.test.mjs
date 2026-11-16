/* Fixture tests for the pure half of tax-watch.
   No network: this is exactly the part that decides whether a rate on a
   government page is read correctly, so it is the part worth pinning down.
   Run with: node scripts/tax-watch.test.mjs
*/
import {
  textOf, ratesNear, checkRule, discoverLinks, getPath, setPath, isStale, report,
  looksLikePortal, isThin, pdfLinks, pdfText, docYear, normaliseSections
} from "./tax-watch.mjs";

let pass = 0, fail = 0;
function is(got, want, name) {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { pass++; console.log("  ok   " + name); }
  else { fail++; console.log("  FAIL " + name + "\n         got  " + g + "\n         want " + w); }
}

/* A page shaped like FBR's rate card: a real table, real noise around it. */
const FBR = `
<html><head><style>.x{color:red}</style><script>var a='90%';</script></head>
<body>
  <div class="banner">Save up to 30% on e-filing fees!</div>
  <h2>Advance tax on sale or transfer of immovable property (Section 236C)</h2>
  <table>
    <tr><th>Amount</th><th>Filer</th><th>Late filer</th><th>Non-filer</th></tr>
    <tr><td>Up to Rs 50 million</td><td>3%</td><td>6%</td><td>10%</td></tr>
  </table>
  <h2>Advance tax on purchase of immovable property (Section 236K)</h2>
  <table>
    <tr><td>Where value does not exceed Rs 50 million</td><td>3%</td><td>6%</td><td>12%</td></tr>
  </table>
  <p>Rates effective from 1 July 2024.</p>
</body></html>`;

console.log("textOf");
{
  const t = textOf(FBR);
  is(t.includes("var a="), false, "drops script contents");
  is(t.includes("color:red"), false, "drops style contents");
  is(t.includes("section 236k"), true, "keeps visible text, lowercased");
  is(/\s{2,}/.test(t), false, "collapses whitespace");
}

console.log("normaliseSections");
{
  // The live run's actual failure: 18,910 characters of FBR's withholding
  // card, "236c" found, "236k" not — because the card doesn't spell it the
  // way the rule does.
  is(normaliseSections("section 236 k applies"), "section 236k applies", "236 K");
  is(normaliseSections("under 236(k) of the ordinance"), "under 236k of the ordinance", "236(K)");
  is(normaliseSections("236-c on sale"), "236c on sale", "236-C");
  is(normaliseSections("236k"), "236k", "already normal, left alone");
  is(normaliseSections("236cb advance tax"), "236cb advance tax", "a longer section is not truncated");
  is(normaliseSections("in 2024 the rate rose"), "in 2024 the rate rose", "a year is not a section");
  is(normaliseSections("plot 1236 k block"), "plot 1236 k block", "only a standalone 2xx");
  is(textOf("<p>Advance tax under section 236 (K) is 3% for filers.</p>").includes("236k"),
     true, "and it happens inside textOf, before any keyword is matched");
  is(ratesNear(textOf("<p>Advance tax on purchase under section 236 (K) is 4% for filers.</p>"),
               ["236k", "purchase"]), [4], "so the rate reads straight out of it");
}

console.log("ratesNear");
{
  const t = textOf(FBR);
  is(ratesNear(t, ["236k", "purchase"], { boundaries: ["236c"] }), [3, 6, 12], "reads the 236K row");
  is(ratesNear(t, ["236c", "sale"], { boundaries: ["236k"] }), [3, 6, 10], "reads the 236C row");
  // The 30% banner must not leak in: it shares no window with the keywords.
  is(ratesNear(t, ["236k", "purchase"], { boundaries: ["236c"] }).includes(30), false, "ignores the banner above");
  is(ratesNear(t, ["236c", "sale"], { boundaries: ["236k"] }).includes(12), false, "236C does not swallow the 236K row");
  is(ratesNear(t, ["stamp duty"]), [], "no keyword, no rates");
  is(ratesNear(t, []), [], "no keywords at all is not a match-everything");
}

console.log("ratesNear — bounds and wording");
{
  const t = textOf(`<p>Stamp duty on urban immovable property is charged at 1 per cent
    of the value. In 1998 the rate was 5%. Registration fee 1%.</p>`);
  is(ratesNear(t, ["stamp duty", "urban"]).includes(1), true, "understands 'per cent'");
  is(ratesNear(t, ["stamp duty", "urban"]).includes(1998), false, "a year is not a rate");
}

console.log("checkRule");
{
  const t = textOf(FBR);
  const rule = { path: "federal.236K.slabs.0.filer", label: "236K filer", keywords: ["236k", "purchase"] };
  is(checkRule(t, rule, 3).ok, true, "held value present → confirmed");
  is(checkRule(t, rule, 4).ok, false, "held value absent → not confirmed");
  is(checkRule(t, rule, 4).propose, null, "three candidates → proposes nothing");

  const one = textOf(`<p>Advance tax on purchase under 236K is 4% for filers.</p>`);
  is(checkRule(one, rule, 3).propose, 4, "exactly one candidate → proposes it");
  is(checkRule(one, rule, 4).ok, true, "and agrees when we already hold it");
}

console.log("discoverLinks");
{
  const root = `<ul>
    <li><a href="/categ/withholding-tax-rates/123">Withholding Tax Rates</a></li>
    <li><a href="https://www.fbr.gov.pk/other">Something else</a></li>
    <li><a href="/sales-tax">Sales Tax Rates</a></li>
  </ul>`;
  is(discoverLinks(root, "https://www.fbr.gov.pk/", ["withholding", "rates"]),
     ["https://www.fbr.gov.pk/categ/withholding-tax-rates/123"], "matches on link text, resolves relative");
  is(discoverLinks(root, "https://www.fbr.gov.pk/", ["nothing here"]), [], "no match, no guess");
}

console.log("getPath / setPath");
{
  const o = { federal: { "236K": { slabs: [{ filer: 3 }] } } };
  is(getPath(o, "federal.236K.slabs.0.filer"), 3, "reads through an array index");
  setPath(o, "federal.236K.lastSeen", "2026-08-08");
  is(o.federal["236K"].lastSeen, "2026-08-08", "writes a new leaf");
  is(getPath(o, "federal.nope.deep"), undefined, "missing path is undefined, not a throw");
}

console.log("isStale");
{
  is(isStale("2024-07-01", new Date("2026-08-08T00:00:00Z")), true, "2024 rates in Aug 2026 are stale");
  is(isStale("2026-07-01", new Date("2026-08-08T00:00:00Z")), false, "current-year rates are not");
  is(isStale("2025-07-01", new Date("2026-06-30T00:00:00Z")), false, "still current the day before 1 July");
  is(isStale("2025-07-01", new Date("2026-07-01T00:00:00Z")), true, "stale the day the new Act lands");
}

console.log("report");
{
  const md = report(
    [{ label: "236K filer", held: 3, found: [3, 6, 12], ok: true, propose: null },
     { label: "Stamp duty", held: 1, found: [], ok: false, propose: null }],
    { unreachable: ["Punjab BOR: HTTP 500"], rediscovered: [], stale: true,
      effectiveFrom: "2024-07-01", staleYear: 2026 });
  is(md.includes("| 236K filer | 3% | 3%, 6%, 12% | ✅ |"), true, "confirmed row");
  is(md.includes("_nothing nearby_"), true, "empty row says so plainly");
  is(md.includes("1 of 2 confirmed"), true, "counts");
  is(md.includes("Punjab BOR: HTTP 500"), true, "surfaces unreachable sources");
  is(md.includes("before 1 July 2026"), true, "surfaces staleness");

  // The state a live run actually reached: figures found, but not the ones we
  // hold. Useless without the words they were found beside.
  const md2 = report(
    [{ label: "236K · purchase", held: 3, found: [5, 10], ok: false, propose: null }],
    { unreachable: [], rediscovered: [], stale: false,
      diagnostics: [{ label: "236K · purchase", chars: 18910, found: [5, 10],
                      present: ["236k", "purchase"], missing: [],
                      snippet: "236k advance tax on purchase 5 10" }] });
  is(md2.includes("figures found: 5%, 10%"), true, "an unconfirmed row carries its figures");
  is(md2.includes("around the first hit"), true, "and the text they were found in");
}

console.log("looksLikePortal");
{
  // The URL the first live run actually wandered onto.
  is(looksLikePortal("https://iris.fbr.gov.pk/public/txplogin.xhtml"), true, "the IRIS login screen");
  is(looksLikePortal("https://x.gov.pk/user/login"), true, "any login path");
  is(looksLikePortal("https://x.gov.pk/rates.xlsx"), true, "a spreadsheet download");
  is(looksLikePortal("https://www.fbr.gov.pk/withholding-tax-rates/51147/81155"), false, "a real rate page");
}

console.log("isThin");
{
  // The character counts the live run reported.
  is(isThin("x".repeat(83)), true, "83 chars — the Punjab board's shell");
  is(isThin("x".repeat(2164)), true, "2164 chars — FBR's shell");
  is(isThin("x".repeat(9000)), false, "a real document is not thin");
}

console.log("pdfLinks");
{
  const html = `<a href="/docs/wht-card-2025.pdf">Withholding Tax Card 2025-26</a>
                <a href="/docs/sales.pdf">Sales Tax Card</a>
                <a href="/page.html">Withholding Tax Rates</a>`;
  is(pdfLinks(html, "https://www.fbr.gov.pk/", ["withholding"]),
     ["https://www.fbr.gov.pk/docs/wht-card-2025.pdf"], "only PDFs, only matching ones");
  is(pdfLinks(html, "https://www.fbr.gov.pk/", []).length, 2, "no filter takes every PDF");
  is(pdfLinks(html, "https://www.fbr.gov.pk/", ["nothing"]), [], "no match, no guess");
}

console.log("docYear / newest card first");
{
  // The real filename the live run picked up, and the real mistake it made.
  is(docYear("https://download1.fbr.gov.pk/Docs/20238215830342WithholdingRatesCards.pdf"), 2023,
     "reads the year out of an FBR filename");
  is(docYear("/docs/card.pdf", "Withholding Tax Card 2025-26"), 2025, "or out of the link text");
  is(docYear("/docs/card.pdf"), 0, "and admits when there isn't one");

  const many = `<a href="/Docs/20238215830342WithholdingRatesCards.pdf">Withholding Rates Card</a>
                <a href="/Docs/20257110000000WithholdingRatesCards.pdf">Withholding Rates Card</a>
                <a href="/Docs/20241010000000WithholdingRatesCards.pdf">Withholding Rates Card</a>`;
  is(pdfLinks(many, "https://download1.fbr.gov.pk/", ["withholding"])[0],
     "https://download1.fbr.gov.pk/Docs/20257110000000WithholdingRatesCards.pdf",
     "newest card first — the run took a 2023 one because they were unsorted");
}

console.log("pdfText — against a real PDF built here");
{
  // Departments keep the rate card in a PDF behind a JavaScript page, so this
  // path has to actually work. Build one and read it back.
  const body = "Stamp duty on urban immovable property 1% Registration fee 1%";
  const objs = [];
  objs[1] = "<</Type/Catalog/Pages 2 0 R>>";
  objs[2] = "<</Type/Pages/Kids[3 0 R]/Count 1>>";
  objs[3] = "<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 200]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>";
  const stream = "BT /F1 12 Tf 20 150 Td (" + body + ") Tj ET";
  objs[4] = "<</Length " + stream.length + ">>\nstream\n" + stream + "\nendstream";
  objs[5] = "<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>";
  let pdf = "%PDF-1.4\n"; const off = [];
  for (let i = 1; i <= 5; i++) { off[i] = pdf.length; pdf += i + " 0 obj\n" + objs[i] + "\nendobj\n"; }
  const xref = pdf.length;
  pdf += "xref\n0 6\n0000000000 65535 f \n";
  for (let i = 1; i <= 5; i++) pdf += String(off[i]).padStart(10, "0") + " 00000 n \n";
  pdf += "trailer\n<</Size 6/Root 1 0 R>>\nstartxref\n" + xref + "\n%%EOF";
  const bytes = Uint8Array.from(pdf, (c) => c.charCodeAt(0) & 0xff);

  const out = await pdfText(bytes.buffer);
  if (out.error === "pdfjs-dist is not installed") {
    console.log("  skip pdfText — pdfjs-dist not installed here (the workflow installs it)");
  } else {
    is(!!out.text, true, "reads text out of a PDF");
    is(out.text.includes("stamp duty on urban"), true, "and it is the right text");
    is(ratesNear(out.text, ["stamp duty", "urban"]), [1], "and a rate parses straight out of it");
  }
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);

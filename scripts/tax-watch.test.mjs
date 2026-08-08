/* Fixture tests for the pure half of tax-watch.
   No network: this is exactly the part that decides whether a rate on a
   government page is read correctly, so it is the part worth pinning down.
   Run with: node scripts/tax-watch.test.mjs
*/
import {
  textOf, ratesNear, checkRule, discoverLinks, getPath, setPath, isStale, report
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
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);

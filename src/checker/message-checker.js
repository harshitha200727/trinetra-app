/* Message checker: runs the engine and renders the result card */

const SUSP_AT = 15, PAY_RE = /fee|charge|deposit|initial amount|clearance|கட்டண|शुल्क|फीस|चार्ज|जमा/i, WEAK = ["tonight", "unless", "hurry", "overdue"], UNSUP_RE = /[\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0600-\u06FF]/;

/* ---- Risk Indicator Score: explanation helpers (presentation only) ---- */
const SEV_ICON = { critical: "🔴", high: "🔴", medium: "🟠", low: "🟡" };
const SEV_KEY = { critical: "sevCritical", high: "sevHigh", medium: "sevMedium", low: "sevLow" };
const datasetHint = raw => {
  const d = window.fvDataset; if (!d || !d.types) return null;
  const m = d.similar(raw, 3);
  for (const o of m) if (o.s >= 0.55 && d.cats[o.row[2]] === "High Risk") return { s: o.s, type: d.types[o.row[3]] };
  return null;
};
function riFactorHtml(x) {
  const evs = x.ev.filter((e, i, a) => !a.some((o, j) => j !== i && o.length > e.length && o.toLowerCase().includes(e.toLowerCase()))), ev = evs.length ? '<span>' + tx("found") + ': ' + evs.map(escHtml).join(", ") + '</span>' : "";
  return '<div class="reason ri-f"><span class="ri-ic" aria-hidden="true">' + SEV_ICON[x.sev] + '</span><div><strong>' + tx("ri_" + x.id) + '</strong>' + ev + '</div><span class="sev s-' + x.sev + '">' + tx(SEV_KEY[x.sev]) + '</span></div>';
}
function riFactorsHtml(A, unsupported) {
  const L = A.indicators;
  if (!L.length) return '<div class="reasons"><p class="panel-label">⚠ ' + tx("riFactors") + '</p><p class="fine">' + (unsupported ? tx("langNoSupport") : tx("noFlags")) + '</p></div>';
  const head = L.length <= 5 ? L : L.slice(0, 4), rest = L.length <= 5 ? [] : L.slice(4);
  return '<div class="reasons"><p class="panel-label">⚠ ' + tx("riFactors") + '</p>' + head.map(riFactorHtml).join("") +
    (rest.length ? '<details class="ri-more"><summary>' + tx("riMore").replace("{n}", rest.length) + '</summary>' + rest.map(riFactorHtml).join("") + '</details>' : "") + '</div>';
}
/* "Why this matters" is built only from what was actually detected */
function riWhyHtml(A, level) {
  const out = [];
  A.combos.slice(0, 2).forEach(c => out.push(tx("rcb_" + c.id)));
  A.cats.filter(c => c.n).sort((a, b) => b.pts - a.pts).slice(0, 3).forEach(c => { if (out.length < 3 && SEV_N[c.top] >= 2) out.push(tx("rc_" + c.cat)); });
  if (A.unsupported && !A.indicators.length) out.push(tx("langNoSupport"));
  if (!out.length || level === "safe") out.unshift(tx("riNone"));
  return '<div class="why-box"><p class="panel-label">💡 ' + tx("riWhy") + '</p>' + out.slice(0, 3).map(x => '<p>' + x + '</p>').join("") + '</div>';
}
/* internal score breakdown: only shown to the admin account */
function devBreakdownHtml(A) {
  const m = me(); if (!m || m.role !== "admin") return "";
  const f = v => (Math.round(v * 10) / 10).toString(), b = A.breakdown;
  const row = (k, v) => '<tr><td>' + k + '</td><td>' + v + '</td></tr>';
  const catRows = A.cats.map(c => row(tx("rcat_" + c.cat) + ' (max ' + c.w + ', ' + c.n + ' indicator' + (c.n === 1 ? '' : 's') + (c.top ? ', top: ' + c.top : '') + ')', f(c.pts))).join("");
  return '<details class="dev-break"><summary>🛠 Developer breakdown (admin only)</summary><table>' +
    row("Base (every indicator at medium strength)", f(b.base)) + row("Severity adjustments", (b.severity >= 0 ? "+" : "") + f(b.severity)) +
    row("Duplicate / category-cap reduction", f(b.capped)) + row("Combination bonuses" + (b.comboIds.length ? " (" + b.comboIds.join(", ") + ")" : ""), "+" + f(b.bonus)) +
    (b.floor ? row("Minimum for strongest indicator", "+" + f(b.floor)) : "") + (b.smooth ? row("Top-end smoothing", f(b.smooth)) : "") +
    row("<b>Final score</b>", "<b>" + b.final + "</b>") + '</table><table><tr><th>Category</th><th>Points</th></tr>' + catRows + '</table></details>';
}
function runCheck() {
  if (!me()) { showAuth(); return; }
  const text = $("#message").value.trim();
  if (!text) { $("#message").focus(); return; }
  const t = copy[language] || copy.en, found = RULES.map(() => new Set());
  (text.match(TERM_RE) || []).forEach(w => found[termMap[w.toLowerCase()]].add(w.toLowerCase()));
  const hits = RULES.map((r, i) => ({ r, i, terms: [...found[i]] })).filter(h => h.terms.length);
  const A = assessRisk(text, { unsupportedRe: UNSUP_RE, dataset: datasetHint });
  const score = A.score, level = A.level, unsupported = A.unsupported && !A.indicators.length;
  window.lastAssess = A; logCheck(text, hits, score, level, A);
  const marked = escHtml(text).replace(TERM_RE, m => '<mark class="' + RULES[termMap[m.toLowerCase()]].cls + '">' + m + '</mark>');
  const ICON = { safe: "🟢", suspicious: "🟡", high: "🟠", critical: "🔴" };
  const stepSplit = txt => txt.split(/(?<=[.।;])\s+/).filter(Boolean);
  const advice = tx({ safe: "adviceSafe", suspicious: "adviceSuspicious", high: "adviceHigh", critical: "adviceCritical" }[level]);
  const adviceHtml = level === "safe" ? '<p class="advice-p">' + advice + '</p>' : '<ol class="advice-steps">' + stepSplit(advice).map(st => '<li>' + st + '</li>').join("") + '</ol>';
  const linkWarnHtml = A.indicators.some(x => x.cat === "link") && level !== "safe" ? '<div class="link-warn"><span aria-hidden="true">⚠</span> ' + tx("resultLinkWarn") + '</div>' : "";
  $("#result-panel").innerHTML =
    '<div class="result">' +
      '<div class="rs-banner ' + level + '"><span class="rs-emoji" aria-hidden="true">' + ICON[level] + '</span><div class="rs-text"><div class="rs-label">' + tx(level) + '</div><div class="rs-sub">' + tx("resultSummary" + level.charAt(0).toUpperCase() + level.slice(1)) + '</div></div></div>' +
      '<div class="risk-bar"><i class="risk-pin" style="left:' + Math.max(1, Math.min(98, score)) + '%"></i></div>' +
      '<div class="ri-scoreline"><b>' + tx("riScore") + ': ' + score + '/100</b><span>' + tx("riNote") + '</span></div>' +
      linkWarnHtml +
      riWhyHtml(A, level) + riFactorsHtml(A, unsupported) +
      '<div class="advice ' + level + '"><p class="panel-label">🛡 ' + tx("resultWhatHeading") + '</p>' + adviceHtml + '</div>' +
      '<div class="rs-actions"><button class="primary" type="button" data-rs="report">🚩 ' + tx("resultReportBtn") + '</button><button class="ghost" type="button" data-rs="history">📋 ' + tx("resultViewHistory") + '</button><button class="ghost" type="button" data-rs="again">↻ ' + tx("checkAnother") + '</button></div>' +
      '<details class="highlighted-fold"><summary>' + tx("resultShowMsg") + '</summary><div class="highlighted">' + marked + '</div></details>' +
      devBreakdownHtml(A) +
    '</div>';
}
$("#check-button").addEventListener("click", runCheck);
$("#message").addEventListener("keydown", e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) runCheck(); });

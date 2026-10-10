/* Check log, dashboard and shared check cards */

function logCheck(text, hits, score, level, A) { const m = me(); if (m) { const a = store.get("fv_scans", []); a.push({ t: Date.now(), u: m.email, l: level, s: score, src: SRC, m: text.slice(0, 80), c: hits.map(h => RULES.indexOf(h.r)), k: A ? A.cats.filter(c => c.n).map(c => c.cat) : undefined }); store.set("fv_scans", a.slice(-500)); } SRC = "text"; renderDash(); }

/* ---- Risk dashboard ---- */
const LV = { safe: "var(--fern)", suspicious: "#e6b43c", high: "#ea8a3c", critical: "var(--coral)" };
const LEVELS = ["safe", "suspicious", "high", "critical"], RULE_CAT = ["urgency", "financial", "sensitive", "link", "impersonation"];
const fmtTime = t => new Date(t).toLocaleString();
/* ---- Phase 4: shared check-card renderer (presentation only, same stored fields) ---- */
const TYPE_LABEL = { text: "typeMessage", screenshot: "typeScreenshot", voice: "typeMessage", url: "typeUrl", qr: "typeQr" };
function relDate(ts) {
  const d = new Date(ts), now = new Date();
  const dOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const nOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((nOnly - dOnly) / 86400000);
  if (days === 0) return tx("relToday");
  if (days === 1) return tx("relYesterday");
  return d.toLocaleDateString();
}
function checkCardHtml(x, admin) {
  const typeTx = tx(TYPE_LABEL[x.src] || "typeMessage");
  const meta = (admin ? escHtml(x.u) + " · " : "") + relDate(x.t) + " · " + typeTx;
  return '<div class="check-card"><div class="cc-top"><span class="verdict ' + x.l + '">' + tx(x.l) + '</span><span class="cc-score">' + x.s + '</span></div>' +
    '<p class="cc-desc">' + escHtml(x.m) + '</p><p class="cc-meta">' + meta + '</p></div>';
}
function buildCalc() {
  const box = $("#d-calc"); if (!box) return;
  const m = me(), A = window.lastAssess, f = v => (Math.round(v * 10) / 10).toString();
  const wt = '<table><tr><th>' + tx("calcCatH") + '</th><th>' + tx("calcMaxH") + '</th></tr>' + Object.keys(RISK_CATS).map(c => '<tr><td>' + tx("rcat_" + c) + '</td><td>' + RISK_CATS[c] + '</td></tr>').join("") + '</table>';
  let dev = "";
  if (m && m.role === "admin") {
    dev = '<div class="panel-label" style="margin:16px 0 4px">' + tx("calcTry") + '</div>' + (A ? '<table><tr><td>Base</td><td>' + f(A.breakdown.base) + '</td></tr><tr><td>Severity adjustments</td><td>' + f(A.breakdown.severity) + '</td></tr><tr><td>Combination bonuses (' + (A.breakdown.comboIds.join(", ") || "none") + ')</td><td>+' + f(A.breakdown.bonus) + '</td></tr><tr><td>Duplicate / capped</td><td>' + f(A.breakdown.capped) + '</td></tr><tr><td><b>Final</b></td><td><b>' + A.score + '</b></td></tr></table>' : '<p class="fine">' + tx("devNone") + '</p>');
  }
  box.innerHTML = wt + dev;
}
function renderDash() {
  const m = me(); if (!m) return; const admin = m.role === "admin";
  const sc = store.get("fv_scans", []).filter(x => admin || x.u === m.email), tot = sc.length;
  const n = l => sc.filter(x => x.l === l).length, avg = tot ? Math.round(sc.reduce((a, x) => a + x.s, 0) / tot) : 0, pct = v => tot ? v / tot * 100 : 0;
  $("#d-scope").textContent = tx(admin ? "viewAll" : "viewMine");
  $("#d-tiles").innerHTML = [["📊", tx("tTotal"), tot, ""], ["🔴", tx("critical"), n("critical"), "critical"], ["🟠", tx("high"), n("high"), "high"], ["🟡", tx("suspicious"), n("suspicious"), "suspicious"], ["🟢", tx("safe"), n("safe"), "safe"], ["📈", tx("tAvg"), avg, ""]].map(a => '<div class="tile tile-' + (a[3] || "plain") + '"><span class="tile-ic" aria-hidden="true">' + a[0] + '</span><b>' + a[2] + '</b><span>' + a[1] + '</span></div>').join("");
  const row = (label, v, max, color) => '<div class="hrow"><span>' + label + '</span><div class="hbar"><i style="width:' + (max ? v / max * 100 : 0) + '%;background:' + color + '"></i></div><b>' + v + '</b></div>';
  $("#d-level").innerHTML = '<div class="stack">' + LEVELS.map(l => '<i style="width:' + pct(n(l)) + '%;background:' + LV[l] + '"></i>').join("") + '</div><div class="legend">' + LEVELS.map(l => '<span>' + tx(l) + ' <b>' + n(l) + '</b></span>').join("") + '</div>';
  const bk = [0, 0, 0, 0]; sc.forEach(x => bk[x.s >= 75 ? 3 : x.s >= 50 ? 2 : x.s >= 20 ? 1 : 0]++);
  $("#d-score").innerHTML = ["0–19", "20–49", "50–74", "75–100"].map((lb, i) => row(lb + " · " + tx(LEVELS[i]), bk[i], Math.max(...bk, 1), LV[LEVELS[i]])).join("");
  const src = { text: 0, screenshot: 0, voice: 0 }; sc.forEach(x => src[x.src || "text"]++);
  $("#d-source").innerHTML = row(tx("srcText"), src.text, Math.max(tot, 1), "var(--ink)") + row(tx("srcShot"), src.screenshot, Math.max(tot, 1), "var(--ink)");
  const catKeys = Object.keys(RISK_CATS), cat = catKeys.map(() => 0); sc.forEach(x => (x.k || (x.c || []).map(i => RULE_CAT[i])).forEach(c => { const j = catKeys.indexOf(c); if (j >= 0) cat[j]++; }));
  $("#d-cat").innerHTML = catKeys.map((c, i) => row(tx("rcat_" + c), cat[i], Math.max(...cat, 1), "var(--fern)")).join("");
  buildCalc();
  $("#d-recent").innerHTML = tot ? '<div class="check-card-list">' + sc.slice(-20).reverse().map(x => checkCardHtml(x, admin)).join("") + '</div>' : '<p class="fine">' + tx("noChecks") + '</p>';
  $("#d-actions").hidden = !admin; $("#d-usersP").hidden = !admin; $("#dataset").hidden = !admin; $("#db-noaccess").hidden = admin;
  if (admin) { const us = store.get("fv_users", {}); $("#d-users").innerHTML = '<table><tr><th>' + tx("emailL") + '</th><th>' + tx("colRole") + '</th><th>' + tx("colCreated") + '</th><th></th></tr>' + Object.keys(us).map(e => '<tr><td>' + escHtml(e) + '</td><td>' + us[e].role + '</td><td>' + fmtTime(us[e].at) + '</td><td>' + (us[e].role === "admin" ? "" : '<button class="ghost" data-rm="' + escHtml(e) + '" type="button">' + tx("remove") + '</button>') + '</td></tr>').join("") + '</table>'; }
}
$("#d-users").addEventListener("click", async e => { const b = e.target.closest("[data-rm]"), m = me(); if (!b || !m || m.role !== "admin" || !(await appConfirm(tx("confRemove")))) return; const u = store.get("fv_users", {}); if (u[b.dataset.rm] && u[b.dataset.rm].role !== "admin") { delete u[b.dataset.rm]; store.set("fv_users", u); } renderDash(); });
$("#d-clear").addEventListener("click", async () => { const m = me(); if (m && m.role === "admin" && (await appConfirm(tx("confClear")))) { store.set("fv_scans", []); renderDash(); } });
$("#d-export").addEventListener("click", () => { const m = me(); if (!m || m.role !== "admin") return; const q = v => '"' + String(v).replace(/"/g, '""') + '"'; const rows = [["time", "user", "source", "result", "score", "message_start"]].concat(store.get("fv_scans", []).map(x => [new Date(x.t).toISOString(), x.u, x.src || "text", x.l, x.s, x.m])); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([rows.map(r => r.map(q).join(",")).join("\n")], { type: "text/csv" })); a.download = "fraudvision-checks.csv"; a.click(); });

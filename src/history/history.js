/* Check history */

/* ---- Check History ---- */
let histRisk = "all", histType = "all";
function renderHistory() {
  const m = me(); if (!m) return;
  const all = store.get("fv_scans", []).filter(x => x.u === m.email);
  const q = (($("#hist-q") || {}).value || "").toLowerCase();
  let rows = all.slice().reverse();
  if (q) rows = rows.filter(x => (x.m || "").toLowerCase().includes(q));
  if (histRisk !== "all") rows = rows.filter(x => x.l === histRisk);
  if (histType !== "all") rows = rows.filter(x => (x.src || "text") === histType || (histType === "text" && !x.src));
  document.querySelectorAll(".hist-filter[data-risk]").forEach(b => b.classList.toggle("on", b.dataset.risk === histRisk));
  document.querySelectorAll(".hist-filter[data-type]").forEach(b => b.classList.toggle("on", b.dataset.type === histType));
  $("#history-empty").hidden = all.length !== 0;
  $("#history-filters").hidden = all.length === 0;
  if (all.length === 0) { $("#history-table").innerHTML = ""; return; }
  $("#history-table").innerHTML = rows.length
    ? '<div class="check-card-list">' + rows.map(x => checkCardHtml(x, false)).join("") + '</div>'
    : '<p class="fine">' + tx("noMatchFilters") + '</p>';
}
$("#hist-q").addEventListener("input", renderHistory);
document.querySelectorAll(".hist-filter[data-risk]").forEach(b => b.addEventListener("click", () => { histRisk = b.dataset.risk; renderHistory(); }));
document.querySelectorAll(".hist-filter[data-type]").forEach(b => b.addEventListener("click", () => { histType = b.dataset.type; renderHistory(); }));
$("#history-empty-btn").addEventListener("click", () => { showView("home"); setTimeout(showChecker, 30); });
async function clearMyHistory() {
  const m = me(); if (!m || !(await appConfirm(tx("confClear")))) return;
  store.set("fv_scans", store.get("fv_scans", []).filter(x => x.u !== m.email));
  renderHistory(); renderDash();
}
$("#history-clear").addEventListener("click", clearMyHistory);
$("#privacy-clear-history").addEventListener("click", clearMyHistory);
$("#data-delete-history").addEventListener("click", clearMyHistory);

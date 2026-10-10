/* Checker mode tabs (Message / Screenshot / Link) */

/* ===== checker mode tabs ===== */
function setMode(m) {
  document.querySelectorAll(".mode-tab").forEach(b => { const on = b.dataset.mode === m; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
  $("#pane-message").hidden = m !== "message"; $("#pane-shot").hidden = m !== "shot"; $("#pane-link").hidden = m !== "link";
  $("#result-panel").hidden = m === "link";
  $("#url-result").hidden = m !== "link" || !$("#url-result").innerHTML;
  const f = m === "message" ? $("#message") : m === "link" ? $("#url-input") : null; if (f) f.focus();
}
document.querySelectorAll(".mode-tab").forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));
$("#shot-clear").addEventListener("click", () => $("#clear-button").click());
document.querySelectorAll(".example").forEach(b => b.addEventListener("click", () => setMode("message")));

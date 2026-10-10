/* Settings: appearance, notifications, profile */

/* ---- Appearance ---- */
function applyTheme(mode) {
  const dark = mode === "system" ? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) : mode === "dark";
  document.body.classList.toggle("night", dark);
  $("#theme-label").textContent = dark ? "Light" : "Night";
  document.querySelectorAll("#theme-seg button").forEach(b => b.classList.toggle("on", b.dataset.mode === mode));
  $("#side-theme-icon").textContent = dark ? "☀" : "☾"; $("#top-theme").textContent = dark ? "☀" : "☾"; $("#hdr-theme").textContent = dark ? "☀" : "☾"; $("#land-theme").textContent = dark ? "☀" : "☾"; $("#side-theme-label").textContent = dark ? "Light mode" : "Dark mode";
  try { localStorage.setItem("fv_theme_mode", mode); } catch (e) {}
}
$("#side-theme").addEventListener("click", () => applyTheme(document.body.classList.contains("night") ? "light" : "dark"));
document.querySelectorAll("#theme-seg button").forEach(b => b.addEventListener("click", () => applyTheme(b.dataset.mode)));
try {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", () => { if ((localStorage.getItem("fv_theme_mode") || "light") === "system") applyTheme("system"); });
} catch (e) {}

/* ---- Notifications (local prefs) ---- */
["notif-scam", "notif-edu", "notif-report"].forEach(id => {
  const el = $("#" + id); if (!el) return;
  const key = "fv_" + id.replace(/-/g, "_");
  try { const v = localStorage.getItem(key); if (v !== null) el.checked = v === "1"; } catch (e) {}
  el.addEventListener("change", () => { try { localStorage.setItem(key, el.checked ? "1" : "0"); } catch (e) {} });
});

/* ---- Profile ---- */
$("#settings-save-profile").addEventListener("click", () => {
  const m = me(); if (!m) return;
  try { localStorage.setItem("fv_display_name_" + m.email, $("#settings-display-name").value.trim()); } catch (e) {}
});

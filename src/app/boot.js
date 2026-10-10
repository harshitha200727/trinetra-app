/* App boot and translation refresh */

function boot() { $("#app").hidden = false; updateWho(); updateAuthUI(); if (me()) { renderDash(); } }

function translate() {
  const t = copy[language] || copy.en; document.documentElement.lang = language; try { localStorage.setItem("fv_export_language", language); } catch (e) {}
  document.querySelectorAll("[data-i18n]").forEach(el => { const key = el.dataset.i18n; if (t[key]) el.textContent = t[key]; });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => el.placeholder = t[el.dataset.i18nPlaceholder]);
  $("#language-select").value = language; $("#auth-lang").value = language; $("#side-lang").value = language; $("#r-lang").value = language; $("#hdr-lang").value = language; $("#result-panel").innerHTML = emptyPanel(); setAuthMode(authMode); updateWho(); buildCalc(); if (!$("#view-dash").hidden) renderDash();
}
["#language-select", "#auth-lang"].forEach(sel => $(sel).addEventListener("change", (event) => { language = event.target.value; translate(); }));

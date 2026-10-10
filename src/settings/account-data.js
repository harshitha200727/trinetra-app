/* Privacy, security, data export and account actions */

/* ---- Privacy: clear all my data ---- */
$("#privacy-clear-data").addEventListener("click", async () => {
  const m = me(); if (!m || !(await appConfirm(tx("confirmClearData")))) return;
  store.set("fv_scans", store.get("fv_scans", []).filter(x => x.u !== m.email));
  ["fv_notif_scam", "fv_notif_edu", "fv_notif_report", "fv_display_name_" + m.email, "fv_avatar_" + m.email].forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
  renderHistory(); renderDash(); updateWho();
});

/* ---- Security: change password, sign out ---- */
$("#settings-change-pw").addEventListener("click", async () => {
  const err = $("#settings-pw-err"); err.textContent = "";
  const m = me(); if (!m) return;
  const cur = $("#settings-cur-pw").value, next = $("#settings-new-pw").value;
  if (next.length < 8) { err.textContent = tx("errPw"); return; }
  const users = store.get("fv_users", {}); const u = users[m.email];
  if (!u) { err.textContent = tx("errStore"); return; }
  if (await sha(u.s + cur) !== u.h) { err.textContent = tx("errPwWrong"); return; }
  const s = newSalt(); u.s = s; u.h = await sha(s + next);
  if (!store.set("fv_users", users)) { err.textContent = tx("errStore"); return; }
  $("#settings-cur-pw").value = ""; $("#settings-new-pw").value = ""; err.textContent = tx("pwChanged");
});
$("#settings-signout").addEventListener("click", () => $("#signout").click());

/* ---- Data: export & delete account ---- */
$("#data-export").addEventListener("click", () => {
  const m = me(); if (!m) return;
  const payload = { email: m.email, role: m.role, checks: store.get("fv_scans", []).filter(x => x.u === m.email) };
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
  a.download = "fraudvision-my-data.json"; a.click();
});
$("#data-delete-account").addEventListener("click", async () => {
  const m = me(); if (!m) return;
  if (m.role === "admin") { await appAlert(tx("adminCannotDelete")); return; }
  if (!(await appConfirm(tx("confirmDeleteAccount")))) return;
  const users = store.get("fv_users", {}); delete users[m.email]; store.set("fv_users", users);
  store.set("fv_scans", store.get("fv_scans", []).filter(x => x.u !== m.email));
  try { localStorage.removeItem("fv_avatar_" + m.email); localStorage.removeItem("fv_display_name_" + m.email); } catch (e) {} sess.set(null); updateAuthUI(); showAuth();
});

document.addEventListener("click", e => {
  const b = e.target.closest(".acad-opt"); if (!b) return;
  const q = b.closest(".acad-q"); if (q.dataset.done) return; q.dataset.done = "1";
  const ok = +b.dataset.i === +q.dataset.ans;
  b.classList.add(ok ? "right" : "wrong");
  if (!ok) q.querySelector('.acad-opt[data-i="' + q.dataset.ans + '"]').classList.add("right");
  q.querySelector(".acad-fb").textContent = (ok ? "Correct. " : "Not quite. ") + q.dataset.why;
  if (ok) q.dataset.ok = "1";
  const all = document.querySelectorAll("#acad-quiz .acad-q");
  if ([...all].every(x => x.dataset.done)) $("#acad-score").textContent = "Your score: " + [...all].filter(x => x.dataset.ok).length + " / " + all.length;
});
$("#side-lang").addEventListener("change", e => { const sel = $("#language-select"); sel.value = e.target.value; sel.dispatchEvent(new Event("change")); });
$("#side-globe").addEventListener("click", () => setSidebarCollapsed(false));
$("#settings-save-profile").addEventListener("click", () => { const m2 = $("#settings-save-msg"); m2.textContent = "Saved"; setTimeout(() => m2.textContent = "", 2000); });
$("#avatar-upload").addEventListener("click", () => $("#avatar-file").click());
$("#avatar-file").addEventListener("change", e => {
  const f = e.target.files[0], m = me(); e.target.value = ""; if (!f || !m) return;
  const img = new Image(), url = URL.createObjectURL(f);
  img.onload = () => {
    const c = document.createElement("canvas"), n = 128, sz = Math.min(img.width, img.height); c.width = c.height = n;
    c.getContext("2d").drawImage(img, (img.width - sz) / 2, (img.height - sz) / 2, sz, sz, 0, 0, n, n);
    try { localStorage.setItem("fv_avatar_" + m.email, c.toDataURL("image/jpeg", .85)); } catch (err) {}
    URL.revokeObjectURL(url); updateWho();
  };
  img.src = url;
});
$("#avatar-remove").addEventListener("click", async () => { const m = me(); if (!m || !(await appConfirm("Remove your avatar?"))) return; try { localStorage.removeItem("fv_avatar_" + m.email); } catch (e) {} updateWho(); });
$("#forgot-toggle").addEventListener("click", () => { $("#forgot-box").hidden = !$("#forgot-box").hidden; });
$("#forgot-save").addEventListener("click", async () => {
  const err = $("#forgot-err"); err.textContent = ""; const m = me(); if (!m) return;
  const a = $("#forgot-new").value, b = $("#forgot-new2").value;
  if (a.length < 8) { err.textContent = tx("errPw"); return; }
  if (a !== b) { err.textContent = tx("errMatch"); return; }
  if (!(await appConfirm("Reset your password to the new one?"))) return;
  const users = store.get("fv_users", {}), u = users[m.email]; if (!u) { err.textContent = tx("errStore"); return; }
  const s2 = newSalt(); u.s = s2; u.h = await sha(s2 + a);
  if (!store.set("fv_users", users)) { err.textContent = tx("errStore"); return; }
  $("#forgot-new").value = $("#forgot-new2").value = ""; err.textContent = tx("pwChanged"); $("#forgot-box").hidden = true;
});
$("#sidebar-close").addEventListener("click", closeMobileSidebar);
$("#bnav-menu").addEventListener("click", openMobileSidebar);
$("#bnav-check").addEventListener("click", () => { showView("home"); setTimeout(showChecker, 30); });
$("#top-theme").addEventListener("click", () => applyTheme(document.body.classList.contains("night") ? "light" : "dark"));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeMobileSidebar(); });
$("#hdr-check").addEventListener("click", () => $("#quick-check-btn").click());
$("#hdr-theme").addEventListener("click", () => applyTheme(document.body.classList.contains("night") ? "light" : "dark"));
$("#hdr-lang").addEventListener("change", e => { const sel = $("#language-select"); sel.value = e.target.value; sel.dispatchEvent(new Event("change")); });
document.addEventListener("click", e => {
  const b = e.target.closest("[data-rs]"); if (!b) return;
  if (b.dataset.rs === "report") showView("report");
  else if (b.dataset.rs === "history") showView("history");
  else { $("#clear-button").click(); showView("home"); setTimeout(showChecker, 30); }
});
new MutationObserver(() => { const r = $("#result-panel"); if (r.querySelector(".result")) setTimeout(() => r.scrollIntoView({ behavior: "smooth", block: "start" }), 60); }).observe($("#result-panel"), { childList: true });
{ const h = new Date().getHours(); $("#greet").dataset.i18n = h < 12 ? "greetMorning" : h < 17 ? "greetAfternoon" : "greetEvening"; }

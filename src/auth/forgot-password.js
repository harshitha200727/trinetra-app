/* Forgot / reset password */

/* ---- Forgot password (login page) ---- */
function showReset(on) { $("#auth .authbox").classList.toggle("resetting", on); $("#a-main").hidden = on; $("#a-reset").hidden = !on; $("#r-err").textContent = ""; $("#a-ok").textContent = ""; if (on) { $("#r-email").value = $("#a-email").value; $("#r-email").focus(); } else { $("#a-email").focus(); } }
$("#a-forgot").addEventListener("click", () => showReset(true));
$("#r-back").addEventListener("click", () => showReset(false));
["#a-in", "#a-up"].forEach(id => $(id).addEventListener("click", () => { $("#a-forgot-row").hidden = authMode !== "in"; $("#a-ok").textContent = ""; }));
async function submitReset() {
  const email = $("#r-email").value.trim().toLowerCase(), pw = $("#r-pw").value, err = $("#r-err"); err.textContent = "";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = tx("errEmail"); return; }
  if (pw.length < 8) { err.textContent = tx("errPw"); return; }
  if ($("#r-pw2").value !== pw) { err.textContent = tx("errMatch"); return; }
  const users = store.get("fv_users", {}), u = users[email];
  if (!u) { err.textContent = tx("errNoAccount"); return; }
  const s = newSalt(); u.s = s; u.h = await sha(s + pw);
  if (!store.set("fv_users", users)) { err.textContent = tx("errStore"); return; }
  delete fails[email];
  $("#a-email").value = email; $("#a-pw").value = ""; $("#r-pw").value = ""; $("#r-pw2").value = "";
  showReset(false); $("#a-ok").textContent = tx("resetOk"); $("#a-pw").focus();
}
$("#r-lang").addEventListener("change", e => { const sel = $("#auth-lang"); sel.value = e.target.value; sel.dispatchEvent(new Event("change")); });
$("#r-submit").addEventListener("click", submitReset);
["#r-email", "#r-pw", "#r-pw2"].forEach(sel => $(sel).addEventListener("keydown", e => { if (e.key === "Enter") submitReset(); }));
try { applyTheme(localStorage.getItem("fv_theme_mode") || "light"); } catch (e) { applyTheme("light"); }

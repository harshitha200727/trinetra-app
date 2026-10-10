/* Accounts, sessions and sign-in (stored in this browser) */

/* ---- Accounts (demo-level, stored in this browser) ---- */
const ADMIN = "harshitha271207@gmail.com";
const tx = k => (copy[language] && copy[language][k]) || copy.en[k];
const store = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } } };
const sess = { get() { try { return sessionStorage.getItem("fv_s"); } catch (e) { return null; } }, set(v) { try { v ? sessionStorage.setItem("fv_s", v) : sessionStorage.removeItem("fv_s"); } catch (e) {} } };
async function sha(s) { if (window.crypto && crypto.subtle) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return Array.from(new Uint8Array(b), x => x.toString(16).padStart(2, "0")).join(""); } let h = 5381; for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0; return "f" + h.toString(16); }
const newSalt = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), x => x.toString(16).padStart(2, "0")).join("");
let authMode = "in", SRC = "text"; const fails = {};
function setAuthMode(m) { authMode = m; $("#a-in").classList.toggle("on", m === "in"); $("#a-up").classList.toggle("on", m === "up"); $("#a-cw").hidden = m === "in"; $("#a-submit").textContent = tx(m === "in" ? "tabIn" : "tabUp"); $("#a-pw").autocomplete = m === "in" ? "current-password" : "new-password"; $("#a-err").textContent = ""; }
$("#a-in").onclick = () => setAuthMode("in"); $("#a-up").onclick = () => setAuthMode("up");
async function submitAuth() {
  const email = $("#a-email").value.trim().toLowerCase(), pw = $("#a-pw").value, err = $("#a-err"); err.textContent = "";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = tx("errEmail"); return; }
  if (pw.length < 8) { err.textContent = tx("errPw"); return; }
  const users = store.get("fv_users", {});
  if (authMode === "up") {
    if ($("#a-pw2").value !== pw) { err.textContent = tx("errMatch"); return; }
    if (users[email]) { err.textContent = tx("errExists"); return; }
    const s = newSalt(); users[email] = { s, h: await sha(s + pw), role: email === ADMIN ? "admin" : "user", at: Date.now() };
    if (!store.set("fv_users", users)) { err.textContent = tx("errStore"); return; }
    sess.set(email); showApp(); return;
  }
  const f = fails[email] || { n: 0, t: 0 };
  if (f.n >= 5 && Date.now() - f.t < 30000) { err.textContent = tx("errLock"); return; }
  const u = users[email];
  if (!u || u.h !== await sha(u.s + pw)) { fails[email] = { n: f.n + 1, t: Date.now() }; err.textContent = tx("errBad"); return; }
  fails[email] = { n: 0, t: 0 }; sess.set(email); showApp();
}
$("#a-submit").addEventListener("click", submitAuth);
["#a-email", "#a-pw", "#a-pw2"].forEach(s => $(s).addEventListener("keydown", e => { if (e.key === "Enter") submitAuth(); }));
const me = () => { const e = sess.get(), u = store.get("fv_users", {})[e]; return u ? { email: e, role: u.role } : null; };
function updateWho() {
  const m = me();
  $("#who").innerHTML = m ? escHtml(m.email) + (m.role === "admin" ? '<span class="badge">' + tx("adminBadge") + '</span>' : "") : "";
  const initial = m ? m.email.trim()[0].toUpperCase() : "?";
  $("#sidebar-avatar").textContent = initial;
  let av = ""; if (m) { try { av = localStorage.getItem("fv_avatar_" + m.email) || ""; } catch (e) {} }
  ["#sidebar-avatar", "#settings-avatar"].forEach(id => { const a = $(id); if (!a) return; a.style.backgroundImage = av ? "url(" + av + ")" : ""; a.classList.toggle("has-img", !!av); if (av) a.textContent = ""; else a.textContent = initial; });
  const ef = $("#settings-email-field"); if (ef) ef.value = m ? m.email : "";
  const el = $("#settings-email-line"); if (el) el.textContent = m ? m.email : "";
  const rl = $("#settings-role-line"); if (rl) rl.textContent = m ? (m.role === "admin" ? tx("adminBadge") : tx("colRole")) : "";
  if (m) { try { const dn = localStorage.getItem("fv_display_name_" + m.email) || ""; const dnf = $("#settings-display-name"); if (dnf) dnf.value = dn; } catch (e) {} }
}
function updateAuthUI() { const loggedIn = !!me(); $("#dash-nav").hidden = !loggedIn; $("#signout").hidden = !loggedIn; $("#signin-nav").hidden = loggedIn; $("#sidebar-userchip").hidden = !loggedIn; document.querySelectorAll('.sidelink[data-auth="1"]').forEach(b => b.hidden = !loggedIn); { const dbn = $("#nav-database"); if (dbn) dbn.hidden = !(loggedIn && me().role === "admin"); } document.querySelectorAll(".acct-only").forEach(c => c.hidden = !loggedIn); if (!loggedIn) showView("home"); }
function showApp() { $("#auth").hidden = true; $("#app").hidden = false; updateWho(); updateAuthUI(); if (me()) { goDash(); } }
function showAuth() { $("#app").hidden = true; $("#auth").hidden = false; $("#a-pw").value = ""; $("#a-pw2").value = ""; setAuthMode("in"); }
document.querySelectorAll(".pw-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const inp = document.getElementById(btn.dataset.target);
    if (!inp) return;
    const showing = inp.type === "text";
    inp.type = showing ? "password" : "text";
    btn.textContent = showing ? "👁" : "🙈";
    btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
  });
});
function goHome() { renderDash(); window.scrollTo(0, 0); }
function goDash() { showView("dash"); renderDash(); }
$("#dash-nav").addEventListener("click", goDash); $("#signin-nav").addEventListener("click", showAuth); $("#signout").addEventListener("click", () => { sess.set(null); updateAuthUI(); showAuth(); });
document.querySelector(".brand[href]").addEventListener("click", () => window.scrollTo(0, 0));

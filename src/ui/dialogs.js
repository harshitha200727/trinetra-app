/* In-page confirm / alert dialogs */

/* ===== in-page confirm / alert (window.confirm is blocked in sandboxed previews, so "Clear" silently did nothing) ===== */
function appDialog(message, okText, cancelText, danger) {
  return new Promise(res => {
    const prev = document.activeElement;
    const wrap = document.createElement("div"); wrap.className = "app-dialog-back";
    wrap.innerHTML = '<div class="app-dialog" role="alertdialog" aria-modal="true" aria-label="Confirm"><p class="app-dialog-msg"></p><div class="app-dialog-actions">' + (cancelText ? '<button type="button" class="ghost" data-d="no"></button>' : '') + '<button type="button" class="' + (danger ? "danger-btn" : "primary") + '" data-d="yes"></button></div></div>';
    wrap.querySelector(".app-dialog-msg").textContent = message;
    wrap.querySelector('[data-d="yes"]').textContent = okText;
    const no = wrap.querySelector('[data-d="no"]'); if (no) no.textContent = cancelText;
    const done = v => { document.removeEventListener("keydown", onKey, true); wrap.remove(); try { prev && prev.focus && prev.focus(); } catch (e) {} res(v); };
    const onKey = e => { if (e.key === "Escape") { e.preventDefault(); done(false); } };
    wrap.addEventListener("click", e => { const b = e.target.closest("[data-d]"); if (b) done(b.dataset.d === "yes"); else if (e.target === wrap) done(false); });
    document.addEventListener("keydown", onKey, true);
    document.body.appendChild(wrap);
    (no || wrap.querySelector('[data-d="yes"]')).focus();
  });
}
const appConfirm = msg => appDialog(msg, tx("dlgYes"), tx("dlgCancel"), true);
const appAlert = msg => appDialog(msg, tx("dlgOk"), "", false);
Object.assign(copy.en, { dlgYes: "Yes, continue", dlgCancel: "Cancel", dlgOk: "OK" });
Object.assign(copy.hi, { dlgYes: "हाँ, आगे बढ़ें", dlgCancel: "रद्द करें", dlgOk: "ठीक है" });
Object.assign(copy.ta, { dlgYes: "ஆம், தொடரவும்", dlgCancel: "ரத்து செய்", dlgOk: "சரி" });

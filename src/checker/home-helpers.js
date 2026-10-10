/* Link/QR sub-modes, QR upload, drag and drop, character count, recent checks */

/* ===== Home v2 helpers: sub-modes, QR upload, drag & drop, char count, recent checks ===== */
function setSub(v) {
  document.querySelectorAll(".sub-tab").forEach(b => { const on = b.dataset.sub === v; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
  $("#sub-link").hidden = v !== "link"; $("#sub-qr").hidden = v !== "qr";
  if (v === "link") $("#url-input").focus();
}
document.querySelectorAll(".sub-tab").forEach(b => b.addEventListener("click", () => setSub(b.dataset.sub)));
const baseSetMode = setMode;
setMode = function (m) {
  baseSetMode(m);
  $("#ex-msg").hidden = m === "link"; $("#ex-link").hidden = m !== "link";
  $("#examples-wrap").hidden = m === "shot";
};
$("#ex-link").hidden = true;
/* drag & drop onto the upload zones */
function attachDrop(zone, handler) {
  ["dragenter", "dragover"].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add("drag"); }));
  ["dragleave", "drop"].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove("drag"); }));
  zone.addEventListener("drop", e => { e.stopPropagation(); const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) handler(f); });
}
attachDrop($("#shot-button"), f => readImage(f));
/* QR code upload: decoded locally with jsQR, then treated as plain text and analysed like a link (never opened) */
const JSQR_SRC = "lib/jsQR.js", JSQR_CDN = "https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js";
const addScript = (src) => new Promise((ok, no) => { const el = document.createElement("script"); el.src = src; el.onload = ok; el.onerror = () => no(new Error("load")); document.head.appendChild(el); });
const loadJsQr = () => window.jsQR ? Promise.resolve() : addScript(JSQR_SRC).catch(() => addScript(JSQR_CDN));
async function readQr(file) {
  if (!me()) { showAuth(); return; }
  const st = $("#qr-status"); st.textContent = "";
  if (!file || !/^image\//.test(file.type)) { st.textContent = tx("stBad"); return; }
  st.textContent = tx("qrReading");
  try { await loadJsQr(); } catch (e) { st.textContent = tx("qrLibFail"); return; }
  try {
    const bmp = await createImageBitmap(file), sc = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const cv = document.createElement("canvas"); cv.width = Math.max(1, Math.round(bmp.width * sc)); cv.height = Math.max(1, Math.round(bmp.height * sc));
    const cx = cv.getContext("2d", { willReadFrequently: true }); cx.drawImage(bmp, 0, 0, cv.width, cv.height);
    const id = cx.getImageData(0, 0, cv.width, cv.height), res = window.jsQR(id.data, id.width, id.height, { inversionAttempts: "attemptBoth" });
    if (!res || !res.data) { st.textContent = tx("qrFail"); return; }
    const data = String(res.data).trim();
    if (/^upi:/i.test(data)) { st.textContent = tx("qrUpi"); return; }
    if (!analyzeUrl(data)) { st.textContent = tx("qrNotLink") + " " + data.slice(0, 160); return; }
    st.textContent = ""; $("#url-input").value = data; URL_SRC = "qr"; runUrlCheck();
  } catch (e) { st.textContent = tx("qrFail"); }
}
$("#qr-button").addEventListener("click", () => $("#qr-input").click());
$("#qr-input").addEventListener("change", e => { readQr(e.target.files[0]); e.target.value = ""; });
attachDrop($("#qr-button"), f => readQr(f));
$("#qr-clear").addEventListener("click", () => { $("#qr-status").textContent = ""; $("#url-result").hidden = true; $("#url-result").innerHTML = ""; });
/* character counter (display only) */
const updateCount = () => { const n = $("#message").value.length; $("#char-count").textContent = n + " " + tx("charsUnit"); };
$("#message").addEventListener("input", updateCount); setInterval(updateCount, 400); updateCount();
/* recent checks list (reads the same fv_scans history, adds nothing) */
function renderRecent() {
  const box = $("#recent-list"); if (!box) return;
  const m = me(), rows = m ? store.get("fv_scans", []).filter(x => x.u === m.email).slice(-5).reverse() : [];
  box.innerHTML = rows.length ? rows.map(x => '<div class="rc-row"><div class="rc-main"><span class="rc-text">' + (escHtml(x.m || "") || "—") + '</span><span class="rc-meta">' + relDate(x.t) + " · " + tx(TYPE_LABEL[x.src] || "typeMessage") + '</span></div><span class="verdict ' + x.l + '">' + tx(x.l) + '</span></div>').join("") : '<div class="rc-empty"><b>' + tx("emptyHistoryTitle") + '</b>' + tx("emptyHistoryCopy") + '</div>';
}
{ const bd = renderDash; renderDash = function () { bd.apply(this, arguments); renderRecent(); }; }
{ const bs = showView; showView = function () { bs.apply(this, arguments); renderRecent(); }; }
{ const bt = translate; translate = function () { bt.apply(this, arguments); renderRecent(); updateCount(); }; }
renderRecent();

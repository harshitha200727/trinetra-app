/* Screenshot checker: reads text from an image in the browser (Tesseract.js) */

/* ---- Screenshot: text is read in the browser with Tesseract.js ---- */
const OCR_LANG = { en: "eng", hi: "eng+hin", ta: "eng+tam" };
const loadScript = src => new Promise((ok, no) => { if (window.Tesseract) return ok(); const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => no(new Error("load")); document.head.appendChild(s); });
async function readImage(file) {
  if (!me()) { showAuth(); return; }
  if (!file || !/^image\//.test(file.type)) { setStatus("stBad"); return; }
  $("#thumb").src = URL.createObjectURL(file); $("#thumb").hidden = false; setStatus("stLoad");
  try {
    try { await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js"); } catch (e0) { await loadScript("https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.1.1/tesseract.min.js"); }
    const run = async extra => {
      const o = Object.assign({ logger: m => { if (m.status === "recognizing text") $("#status").textContent = (copy[language]||copy.en).stRead + " " + Math.round(m.progress * 100) + "%"; } }, extra);
      try { return await Tesseract.recognize(file, OCR_LANG[language] || "eng", o); }
      catch (eW) {
        /* some hosts block blob: workers ("Failed to construct 'Worker'"); start the same worker from a data: URL instead */
        if (!/Worker|blob|origin|SecurityError/i.test((eW && (eW.message || eW.toString())) || "")) throw eW;
        const wp = "data:text/javascript;base64," + btoa('importScripts("https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js");');
        return await Tesseract.recognize(file, OCR_LANG[language] || "eng", Object.assign({}, o, { workerPath: wp, workerBlobURL: false }));
      }
    };
    let r; try { r = await run({}); } catch (e1) { r = await run({ langPath: "https://cdn.jsdelivr.net/gh/naptha/tessdata@gh-pages/4.0.0_best_int" }); }
    const text = ((r && r.data && r.data.text) || "").replace(/\n{3,}/g, "\n\n").trim();
    if (!text) { setStatus("stNone"); return; }
    $("#message").value = text; setStatus("stDone"); SRC = "screenshot"; runCheck();
  } catch (e) { setStatus("stFail"); $("#status").textContent += " [" + ((e && (e.message || e.toString())) || "unknown error") + "]"; }
}
$("#shot-button").addEventListener("click", () => $("#file-input").click());
$("#file-input").addEventListener("change", e => { readImage(e.target.files[0]); e.target.value = ""; });
document.addEventListener("paste", e => { const cd = e.clipboardData, f = cd && ([...(cd.files || [])].find(x => /^image\//.test(x.type)) || [...(cd.items || [])].filter(i => i.type.startsWith("image/")).map(i => i.getAsFile())[0]); if (f) { e.preventDefault(); readImage(f); } });
$("#checker").addEventListener("dragover", e => e.preventDefault());
$("#checker").addEventListener("drop", e => { const f = [...(e.dataTransfer.files || [])].find(x => /^image\//.test(x.type)); if (f) { e.preventDefault(); readImage(f); } });

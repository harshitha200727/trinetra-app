/* URL checker: local heuristics only, links are never opened */

let URL_SRC = "url";
const URL_EX = { short: "https://bit.ly/3xKycNow", bank: "http://hdfc-secure-login.verify-account.top/kyc/update?otp=1", apk: "https://free-recharge-offer.xyz/download/rewards.apk", safe: "https://www.wikipedia.org/wiki/Fraud" };
const SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly", "rb.gy", "shorturl.at", "ow.ly", "buff.ly", "tiny.cc", "rebrand.ly", "t.ly"];
const RISKY_TLD = ["xyz", "top", "click", "icu", "buzz", "tk", "ml", "ga", "cf", "gq", "work", "support", "rest", "zip", "mov", "cam", "monster", "loan", "country", "gdn", "men"];
const BRANDS = { sbi: ["sbi.co.in", "onlinesbi.sbi", "onlinesbi.com", "sbi.bank.in"], hdfc: ["hdfcbank.com", "hdfc.com", "hdfclife.com"], icici: ["icicibank.com", "icicilombard.com"], axis: ["axisbank.com"], kotak: ["kotak.com"], paytm: ["paytm.com", "paytmbank.com"], phonepe: ["phonepe.com"], googlepay: ["pay.google.com"], amazon: ["amazon.com", "amazon.in", "amazon.co.uk", "amazonaws.com"], flipkart: ["flipkart.com"], paypal: ["paypal.com", "paypal.me"], netflix: ["netflix.com"], google: ["google.com", "google.co.in", "goo.gl"], microsoft: ["microsoft.com", "live.com", "office.com"], apple: ["apple.com", "icloud.com"], facebook: ["facebook.com", "fb.com"], instagram: ["instagram.com"], whatsapp: ["whatsapp.com", "whatsapp.net"], irctc: ["irctc.co.in"], aadhaar: ["uidai.gov.in"], uidai: ["uidai.gov.in"], incometax: ["incometax.gov.in"], epfo: ["epfindia.gov.in"], dhl: ["dhl.com"], fedex: ["fedex.com"], indiapost: ["indiapost.gov.in"] };
const URL_KW = ["login", "signin", "verify", "verification", "secure", "update", "kyc", "otp", "account", "bank", "reward", "prize", "claim", "free", "refund", "wallet", "suspend", "confirm", "unlock", "password", "gift", "lottery", "recharge"];
const URL_WEIGHT = { scheme: 50, ip: 35, brand: 40, at: 25, puny: 25, short: 20, tld: 20, file: 30, http: 15, kw: 15, subs: 10, hyph: 10, long: 10, port: 10, enc: 10 };
function analyzeUrl(raw) {
  raw = (raw || "").trim();
  let candidate = (raw.match(/(?:[a-z][a-z0-9+.-]*:\/\/|www\.)\S+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:[\/?#:]\S*)?/i) || [raw])[0].replace(/[)\].,;!?'"]+$/, "");
  if (!candidate || /\s/.test(candidate)) return null;
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(candidate) && !/^[a-z0-9.-]+:\d+(\/|$)/i.test(candidate);
  const sig = [];
  const add = (k, detail) => { if (!sig.some(x => x.k === k)) sig.push({ k, w: URL_WEIGHT[k], d: detail || "" }); };
  if (hasScheme && !/^https?:\/\//i.test(candidate)) {
    const sch = candidate.split(":")[0].toLowerCase();
    if (/^(javascript|data|vbscript|file|blob)$/.test(sch)) return { shown: candidate, host: "", sig: [{ k: "scheme", w: URL_WEIGHT.scheme, d: sch + ":" }], score: 50 };
    if (!/^(ftp|ftps)$/.test(sch)) return null;
  }
  let u; try { u = new URL(hasScheme ? candidate : "https://" + candidate); } catch (e) { return null; }
  const host = u.hostname.toLowerCase().replace(/\.$/, "");
  if (!host || (!host.includes(".") && !/^\[/.test(host))) return null;
  if (u.protocol === "http:" || u.protocol === "ftp:") add("http", u.protocol.replace(":", ""));
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || /^\[/.test(host) || /^0x[0-9a-f]+$/i.test(host) || /^\d{8,10}$/.test(host);
  if (isIp) add("ip", host);
  const labels = host.split("."), SLD = ["co", "com", "org", "net", "gov", "ac", "edu", "nic", "gen", "ltd"];
  const regLen = labels.length >= 3 && SLD.includes(labels[labels.length - 2]) && labels[labels.length - 1].length === 2 ? 3 : 2;
  const reg = labels.slice(-regLen).join("."), tld = labels[labels.length - 1];
  if (!isIp) {
    if (SHORTENERS.includes(reg)) add("short", reg);
    if (RISKY_TLD.includes(tld)) add("tld", "." + tld);
    if (labels.length - regLen >= 3) add("subs", String(labels.length - regLen));
    if ((host.match(/-/g) || []).length >= 3) add("hyph");
    if (/(^|\.)xn--/.test(host) || /[^\x00-\x7f]/.test(candidate.split("/")[2] || "")) add("puny");
    const flat = host.replace(/0/g, "o").replace(/1/g, "l").replace(/3/g, "e").replace(/5/g, "s").replace(/rn/g, "m").replace(/[-.]/g, "");
    for (const b in BRANDS) {
      const official = BRANDS[b].some(d => host === d || host.endsWith("." + d));
      if (!official && (flat.includes(b) || host.includes(b))) { add("brand", b); break; }
    }
  }
  if (/@/.test(candidate.replace(/^[a-z]+:\/\//i, "").split(/[\/?#]/)[0])) add("at");
  if (candidate.length > 75) add("long", String(candidate.length));
  if (u.port && !["80", "443"].includes(u.port)) add("port", u.port);
  if ((candidate.match(/%[0-9a-f]{2}/gi) || []).length >= 4) add("enc");
  if (/\.(apk|exe|scr|msi|bat|jar|dmg|zip|rar)(\?|#|$)/i.test(u.pathname + u.search)) add("file", (u.pathname.match(/\.[a-z]+$/i) || [""])[0]);
  const text = (host + u.pathname + u.search).toLowerCase(), kws = URL_KW.filter(k => text.includes(k));
  const officialHost = Object.values(BRANDS).some(ds => ds.some(d => host === d || host.endsWith("." + d)));
  if (kws.length && !officialHost) add("kw", kws.slice(0, 4).join(", "));
  const score = Math.min(100, sig.reduce((a, x) => a + x.w, 0));
  return { shown: candidate, host, sig, score };
}
function urlLevel(score) { return score >= 75 ? "critical" : score >= 50 ? "high" : score >= 20 ? "suspicious" : "safe"; }
function runUrlCheck() {
  if (!me()) { showAuth(); return; }
  const inp = $("#url-input"), err = $("#url-err"), out = $("#url-result"); err.textContent = "";
  const raw = inp.value.trim();
  if (!raw) { err.textContent = tx("urlErrEmpty"); inp.focus(); return; }
  const r = analyzeUrl(raw);
  if (!r) { err.textContent = tx("urlErrInvalid"); out.hidden = true; inp.focus(); return; }
  const level = urlLevel(r.score), t = copy[language] || copy.en, n = r.sig.length;
  const icon = { safe: "🟢", suspicious: "🟡", high: "🟠", critical: "🔴" }[level];
  const summary = tx({ safe: "urlSumSafe", suspicious: "urlSumSusp", high: "urlSumHigh", critical: "urlSumCritical" }[level]).replace("{n}", n);
  const stepSplit = txt => txt.split(/(?<=[.।;])\s+/).filter(Boolean);
  const advice = tx({ safe: "urlAdviceSafe", suspicious: "urlAdviceSusp", high: "urlAdviceHigh", critical: "urlAdviceHigh" }[level]);
  const adviceHtml = level === "safe" ? '<p class="advice-p">' + advice + '</p>' : '<ol class="advice-steps">' + stepSplit(advice).map(st => '<li>' + st + '</li>').join("") + '</ol>';
  const reasons = n ? r.sig.map(x => '<div class="reason"><span class="reason-dot m3"></span><div><strong>' + tx("uS_" + x.k) + '</strong>' + (x.d ? '<span>' + t.found + ': ' + escHtml(x.d) + '</span><br>' : '') + '<span class="fine">' + tx("uW_" + x.k) + '</span></div><span class="sev s-' + (x.w >= 35 ? "critical" : x.w >= 20 ? "high" : x.w >= 15 ? "medium" : "low") + '">' + tx(SEV_KEY[x.w >= 35 ? "critical" : x.w >= 20 ? "high" : x.w >= 15 ? "medium" : "low"]) + '</span></div>').join("") : '<p class="fine">' + tx("urlNoFlags") + '</p>';
  /* the link is shown as escaped plain text inside <code> — never as an anchor */
  out.hidden = false;
  out.innerHTML =
    '<div class="result">' +
      '<div class="rs-banner ' + level + '"><span class="rs-emoji" aria-hidden="true">' + icon + '</span><div class="rs-text"><div class="rs-label">' + tx(level) + '</div><div class="rs-sub">' + summary + '</div></div></div>' +
      '<div class="risk-bar"><i class="risk-pin" style="left:' + Math.max(1, Math.min(98, r.score)) + '%"></i></div>' +
      '<div class="ri-scoreline"><b>' + tx("riScore") + ': ' + r.score + '/100</b><span>' + tx("riNote") + '</span></div>' +
      '<div class="url-shown"><p class="panel-label">🔗 ' + tx("urlLinkLabel") + '</p><code>' + escHtml(r.shown) + '</code>' + (level !== "safe" ? '<p class="fine">⚠ ' + tx("urlDoNotOpen") + '</p>' : '') + '</div>' +
      '<div class="reasons"><p class="panel-label">⚠ ' + tx("resultWhyHeading") + '</p>' + reasons + '</div>' +
      '<div class="advice ' + level + '"><p class="panel-label">🛡 ' + tx("resultWhatHeading") + '</p>' + adviceHtml + '<p class="fine">' + tx("urlCaveat") + '</p></div>' +
      '<div class="rs-actions"><button class="primary" type="button" data-rs="report">🚩 ' + tx("resultReportBtn") + '</button><button class="ghost" type="button" data-rs="history">📋 ' + tx("resultViewHistory") + '</button><button class="ghost" type="button" id="url-again">↻ ' + tx("checkAnother") + '</button></div>' +
    '</div>';
  const m = me(); if (m) { const a = store.get("fv_scans", []); a.push({ t: Date.now(), u: m.email, l: level, s: r.score, src: URL_SRC, m: r.shown.slice(0, 80), c: n ? [3] : [], k: n ? (r.sig.some(x => x.k === "brand") ? ["link", "impersonation"] : ["link"]) : [] }); store.set("fv_scans", a.slice(-500)); URL_SRC = "url"; renderDash(); }
  setTimeout(() => out.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
}
$("#url-check-btn").addEventListener("click", runUrlCheck);
$("#url-input").addEventListener("keydown", e => { if (e.key === "Enter") runUrlCheck(); });
$("#url-clear-btn").addEventListener("click", () => { $("#url-input").value = ""; $("#url-err").textContent = ""; $("#url-result").hidden = true; $("#url-result").innerHTML = ""; $("#url-input").focus(); });
document.querySelectorAll(".url-ex").forEach(b => b.addEventListener("click", () => { $("#url-input").value = URL_EX[b.dataset.uex]; $("#url-err").textContent = ""; $("#url-result").hidden = true; $("#url-result").innerHTML = ""; }));
document.addEventListener("click", e => { if (e.target.closest("#url-again")) { $("#url-clear-btn").click(); $("#checker").scrollIntoView({ behavior: "smooth", block: "center" }); } });

/* Language state and small DOM helpers */

let language = "en";
try { language = localStorage.getItem("fv_export_language") || "en"; } catch (e) {}
const $ = (selector) => document.querySelector(selector);
const emptyPanel = () => '<div class="empty"><div class="empty-icon">✦</div><h3>' + (copy[language]||copy.en).resultHere + '</h3><p>' + (copy[language]||copy.en).resultCopy + '</p></div>';
const setStatus = (key) => { $("#status").textContent = key ? (copy[language]||copy.en)[key] : ""; };
const showChecker = () => { $("#checker").scrollIntoView({behavior:"smooth", block:"center"}); $("#message").focus(); };
$("#checker-nav").addEventListener("click", showChecker);
$("#theme-toggle").addEventListener("click", () => { document.body.classList.toggle("night"); $("#theme-label").textContent = document.body.classList.contains("night") ? "Light" : "Night"; });
document.querySelectorAll(".example").forEach((button) => button.addEventListener("click", () => { $("#message").value = examples[button.dataset.example]; $("#result-panel").innerHTML = emptyPanel(); }));
$("#clear-button").addEventListener("click", () => { $("#message").value = ""; $("#thumb").hidden = true; setStatus(""); $("#result-panel").innerHTML = emptyPanel(); });

/* ===== Risk Indicator Score (rule-based, category-weighted) =====
   Sits on top of the existing keyword detection (KW / RULES / TERM_RE) and the link analysis (analyzeUrl).
   It converts detected indicators into a 0-100 "Risk Indicator Score". The number describes how strong and how
   many warning signs were found. It is NOT the probability that something is a scam. */

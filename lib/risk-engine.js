/* Risk Indicator Score engine: weighted categories, severities, combination bonuses (rule-based, no ML) */

const RISK_CATS = { urgency: 10, financial: 20, sensitive: 20, link: 15, unrealistic: 15, impersonation: 10, pattern: 10 };
const SEV_F = { low: 0.35, medium: 0.6, high: 0.85, critical: 1 };
const SEV_N = { low: 1, medium: 2, high: 3, critical: 4 };
const SEV_UP = { low: "medium", medium: "high", high: "critical", critical: "critical" };
const RK_AMT = "(?:(?:₹|rs\\.?|inr|usd|\\$)+\\s?\\d[\\d,]*(?:\\.\\d+)?(?:\\s?(?:lakh|lakhs|crore|crores|k|thousand))?)";
const RK_REQ = "(?:share|send|tell|give|provide|enter|submit|update|confirm|verify|reply|forward|read out|type|input|fill|upload|complete|click to|download|install)";
const RK_NEG = /\bno (?:otp|pin|password|cvv|payment|bank details)\b|\b(?:is|are|will be|be) (?:not|never) (?:requested|required|asked)\b|\b(?:do not|don't|dont|never|won't|will not|not ask|not to|nobody will ask|no one will ask)\b|मत\s|कभी नहीं|नहीं\s(?:माँगता|मांगता|माँगते|मांगते|माँगेगा|मांगेगा)|வேண்டாம்|ஒருபோதும்/i;
const RK_U_THREAT = ["blocked", "suspended", "deactivated", "frozen", "disconnected", "permanently closed", "suspension", "will be deactivated", "will be suspended", "final notice", "final warning", "do not disconnect", "ब्लॉक हो गया", "काट दी जाएगी", "काट दिया जाएगा", "बंद किया जाएगा", "बंद हो जाएगा", "முடக்கப்படும்", "முடக்கப்பட்டுள்ளது", "துண்டிக்கப்படும்", "செயலிழக்கப்படும்", "மூடப்படும்", "இறுதி எச்சரிக்கை", "இறுதி அறிவிப்பு", "अंतिम चेतावनी", "अंतिम सूचना"];
const RK_U_WEAK = ["tonight", "unless", "hurry", "overdue", "आज रात", "இன்று இரவு", "बकाया", "நிலுவையில்", "लंबित"];
const RK_PRIZE_STRONG = ["you have won", "you won", "lottery", "lucky draw", "வென்றுள்ளீர்கள்", "லாட்டரி", "जीते हैं", "जीता है", "लॉटरी"];
const RK_GUAR_CRIT = ["guaranteed returns", "guaranteed profit", "double your money", "உத்தரவாதமான வருமானம்", "गारंटीड रिटर्न"];
const RK_SENS_CRIT = ["cvv", "your pin", "upi pin", "atm pin", "pin verification", "password", "bank login", "login details", "card number", "card details", "கார்டு விவரங்கள", "வங்கி உள்நுழைவு", "कार्ड विवरण", "बैंक लॉगिन"];
const RK_AUTH_CRIT = ["digital arrest", "under arrest", "arrest warrant"];
const RK_AUTH_HIGH = ["narcotics", "cbi", "enforcement directorate", "cyber cell"];
const RK_REQ_ML = /भेज|बताएं|बताइए|बताओ|साझा|दीजिए|दें\b|डालें|अपडेट|जमा|अनुसरण|அனுப்ப|வழங்க|வழங்கு|உள்ளிட|பகிர|புதுப்பி|சமர்ப்பி/;
const RK_PAYW_ML = /भुगतान|शुल्क|जमा करें|रकम|பணம் செலுத்|கட்டண|செலுத்து/;
const RK_AUTH_LEGAL = ["legal complaint", "சட்டப்பூர்வ புகார்", "कानूनी शिकायत"];

function assessRisk(text, opts) {
  opts = opts || {};
  const raw = String(text || ""), low = raw.toLowerCase();
  const sentences = raw.split(/(?<=[.!?।\n])\s*/).filter(Boolean);
  const ind = {}; /* id -> { id, cat, sev, ev:[] } */
  const add = (id, cat, sev, ev) => {
    const x = ind[id] || (ind[id] = { id, cat, sev, ev: [] });
    if (SEV_N[sev] > SEV_N[x.sev]) x.sev = sev;
    (Array.isArray(ev) ? ev : ev ? [ev] : []).forEach(e => { e = String(e).trim(); if (e && x.ev.length < 4 && !x.ev.includes(e)) x.ev.push(e); });
  };
  const rx = (re, s) => { const m = (s === undefined ? low : s).match(re); return m ? m[0] : null; };
  const found = RULES.map(() => new Set());
  (raw.match(TERM_RE) || []).forEach(w => found[termMap[w.toLowerCase()]].add(w.toLowerCase()));
  /* sensitive-info terms only count in sentences that are not warnings ("Never share your OTP") */
  const liveSens = sentences.filter(s => !RK_NEG.test(s));
  const foundSens = new Set((liveSens.join(" ").match(TERM_RE) || []).map(w => w.toLowerCase()).filter(w => termMap[w] === 2));
  const live = liveSens.join(" ").toLowerCase();
  const REQ_EN = new RegExp("\\b" + RK_REQ + "\\b");
  const hasReqNear = (term) => liveSens.some(s => { const l = s.toLowerCase(); return l.includes(term) && (REQ_EN.test(l) || RK_REQ_ML.test(l)); });

  /* ---- A. urgency / pressure ---- */
  found[0].forEach(t => {
    if (RK_U_WEAK.includes(t)) add("U_deadline", "urgency", "low", t);
    else if (RK_U_THREAT.includes(t)) add("U_threat", "urgency", "medium", t);
    else add("U_deadline", "urgency", "medium", t);
  });
  { const m = rx(/\b(?:within|in|next)\s+\d+\s*(?:hours?|hrs?|minutes?|mins?)\b/); if (m) add("U_deadline", "urgency", "medium", m); }
  { const m = rx(/\b(?:limited (?:slots|seats|offer)|only \d+ (?:slots|seats|left)|offer (?:ends|expires)|expires? (?:today|tonight|soon))\b/); if (m) add("U_deadline", "urgency", "medium", m); }
  { const m = rx(/\b(?:invest|pay|send|transfer|deposit|register|apply|buy|join)\b[^.!?]{0,60}\btoday\b/); if (m) add("U_today", "urgency", "low", "today"); }

  /* ---- B. financial requests ---- */
  const feeRe = new RegExp("\\b(?:pay(?:ing)?|send|deposit|transfer)\\b[^.!?]{0,30}(?:" + RK_AMT + "|\\bfees?\\b|\\bcharges?\\b|\\bdeposit\\b)|\\b(?:processing|registration|joining|clearance|release|handling|delivery|customs|verification|insurance|security|withdrawal|advance|activation|membership|admin|unlock|token)\\s+(?:fees?|charges?|amount|deposit|payment)\\b|\\b(?:upfront|in advance)\\b[^.!?]{0,20}\\b(?:pay|payment|fee)\\b|\\bpay\\b[^.!?]{0,20}\\b(?:first|upfront)\\b");
  const feeWord = /\bfees?\b|\bcharges?\b|\bdeposit\b|\badvance\b|\bupfront\b|\bclearance\b/;
  found[1].forEach(t => { if (PAY_RE.test(t)) add("F_advance", "financial", "high", t); });
  { const m = rx(feeRe); if (m) add("F_advance", "financial", feeWord.test(m) ? "high" : "medium", m.slice(0, 48)); }
  { const m = rx(new RegExp("\\bpay\\b[^.!?]{0,25}\\b(?:through|via|using|at|on|by clicking|by tapping)\\b[^.!?]{0,15}\\b(?:link|url|portal)\\b|\\bpay (?:now|immediately|today)\\b")); if (m && !ind.F_advance) add("F_advance", "financial", "medium", m.slice(0, 40)); }
  { const mlPay = RK_PAYW_ML.test(raw); const mlAmt = new RegExp(RK_AMT).test(low);
    if (mlPay && (mlAmt || /लिंक|இணைப்பு|இணைப்பில்/.test(raw))) add("F_advance", "financial", /शुल्क|கட்டண/.test(raw) ? "high" : "medium", raw.match(RK_PAYW_ML)[0]); }
  ["क्लीयरेंस", "சுங்க அனுமதி"].forEach(t => { if (found[1].has(t)) add("F_advance", "financial", "high", t); });
  { const m = rx(/\b(?:transfer|send|deposit|remit|pay)\b[^.!?]{0,30}\b(?:to|into)\b[^.!?]{0,30}\b(?:account|a\/c|upi|wallet|number|id)\b|\bupi id\b|\bscan (?:and|&) pay\b|\baccept the request\b/); if (m) add("F_transfer", "financial", "high", m.slice(0, 48)); }
  { const m = rx(/\b(?:collect|payment) request\b/); if (m && !ind.F_transfer) add("F_transfer", "financial", "medium", m); }
  ["ट्रांसफर करें", "பணத்தை மாற்றுங்கள்"].forEach(t => { if (found[1].has(t)) add("F_transfer", "financial", "high", t); });
  ["பணத்தை எடுக்க", "पैसे निकालने"].forEach(t => { if (found[1].has(t)) add("F_transfer", "financial", "medium", t); });
  { const m = rx(/\binvest(?:ing|ment|ments|ed)?\b[^.!?]{0,60}/); if (m) { const verb = /\binvest\b/.test(m); const strong = /returns?|profit|earn|double|monthly/.test(m) || (verb && (new RegExp(RK_AMT).test(m) || /\b(?:now|today)\b/.test(m))); add("F_invest", "financial", strong ? "high" : "medium", m.slice(0, 40)); } }
  ["investment opportunity", "investment group", "vip group", "निवेश अवसर"].forEach(t => { if (found[1].has(t)) add("F_invest", "financial", "medium", t); });
  ["crypto", "bitcoin"].forEach(t => { if (found[1].has(t)) add("F_invest", "financial", "medium", t); });
  if (found[1].has("gift card")) add("F_gift", "financial", "high", "gift card");
  { const m = rx(/\b(?:usdt|trading signals?|forex|stock tips?)\b/); if (m) add("F_invest", "financial", "medium", m); }
  { const m = rx(/\b(?:purchase|buy|pay for|order)\b[^.!?]{0,30}\b(?:starter|package|kit|membership|plan|pack|product)s?\b|\b(?:starter|joining) (?:package|kit)\b/); if (m) add("F_purchase", "financial", /\b(?:recruit|refer|earn|income|unlock|commission|bonus)\b/.test(low) ? "high" : "medium", m.slice(0, 48)); }
  ["refund", "cashback", "cashback refund", "रिफंड", "வரி திருப்பிச் செலுத்தும்"].forEach(t => { if (found[1].has(t)) add("F_refund", "financial", "low", t); });

  /* ---- C. sensitive information ---- */
  const otpReq = rx(/\b(?:share|send|tell|give|read out|forward|provide|submit|enter|reply with|verify|confirm|type)\b[^.!?]{0,30}\b(?:otp|one[- ]time (?:password|pin|code)|verification code|security code)\b/, live);
  if (otpReq) add("S_otp", "sensitive", "critical", otpReq);
  foundSens.forEach(t => {
    if (t.includes("otp")) { const explicit = /^(?:share|send|enter|tell|give|verify|read|forward)|साझा|बताएं|भेजें|डालें|दें|அனுப்பு|வழங்கு|உள்ளிடு|-ஐ/.test(t) || hasReqNear("otp"); add("S_otp", "sensitive", explicit ? "critical" : "high", t); return; }
    if (t === "kyc") { add("S_kyc", "sensitive", (/\b(?:update|complete|verify|submit|pending|expired|expire|re-?do|click)\b/.test(live) || RK_REQ_ML.test(live) || /समाप्त|समय सीमा|காலாவதி/.test(live)) ? "high" : "medium", t); return; }
    if (["anydesk", "teamviewer", "screen share", "remote access"].includes(t)) { add("S_remote", "sensitive", "high", t); return; }
    if (["id proof", "identity documents", "identity details", "அடையாள ஆவண", "அடையாள விவரங்கள", "पहचान दस्तावेज", "पहचान संबंधी"].includes(t)) { add("S_id", "sensitive", hasReqNear(t) ? "high" : "medium", t); return; }
    if (RK_SENS_CRIT.includes(t)) { add("S_cred", "sensitive", /^[\x00-\x7f]+$/.test(t) ? (hasReqNear(t) ? "critical" : "medium") : (RK_REQ_ML.test(live) ? "critical" : "high"), t); return; }
    if (/^[\x00-\x7f]+$/.test(t)) add("S_cred", "sensitive", hasReqNear(t) ? "high" : "low", t); else add("S_cred", "sensitive", "high", t);
  });
  { const m = rx(/\b(?:verify|verification|confirm)\b[^.!?]{0,30}\b(?:account|identity|details|profile)\b|account (?:requires|needs) (?:verification|update)|\b(?:verify|update) your (?:account|details)\b/, live); if (m && !ind.S_kyc && !ind.S_cred && !ind.S_otp) add("S_verify", "sensitive", "low", m.slice(0, 40)); }

  /* ---- D. links and contact methods (reuses the URL Checker's link analysis) ---- */
  const urls = raw.match(/(?:https?:\/\/|www\.)[^\s<>"')]+|\b(?:bit\.ly|tinyurl\.com|cutt\.ly|rb\.gy|is\.gd|bit\.do|wa\.me|t\.me)\/\S*|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:xyz|top|click|icu|buzz)\b\S*/gi) || [];
  const ODD = ["subs", "hyph", "long", "enc", "port", "kw"], oddHit = new Set();
  urls.slice(0, 3).forEach(u => {
    let a = null; try { a = analyzeUrl(u); } catch (e) {}
    if (!a) { add("L_url", "link", "low", u.slice(0, 40)); return; }
    const host = a.host || u.slice(0, 40);
    if (!a.sig.length) add("L_url", "link", "low", host);
    a.sig.forEach(x => {
      if (x.k === "brand") add("I_brand", "impersonation", "high", host);
      else if (x.k === "ip") add("L_ip", "link", "high", host);
      else if (x.k === "short") add("L_short", "link", "medium", host);
      else if (x.k === "tld") add("L_tld", "link", "medium", host);
      else if (x.k === "file") add("L_file", "link", "high", host);
      else if (x.k === "puny") add("L_puny", "link", "high", host);
      else if (x.k === "at") add("L_at", "link", "high", host);
      else if (x.k === "scheme") add("L_scheme", "link", "high", host);
      else if (x.k === "http") add("L_http", "link", "low", host);
      else if (ODD.includes(x.k)) { oddHit.add(x.k); add("L_odd", "link", oddHit.size >= 2 ? "medium" : "low", host); }
    });
  });
  ["[suspicious-link]", "[சந்தேக இணைப்பு]", "[संदिग्ध लिंक]"].forEach(t => { if (low.includes(t)) add("L_marked", "link", "high", t); });
  { const m = rx(/\[[a-z\- ]*(?:link|url)\]/); if (m) add("L_marked", "link", "high", m); }
  if (!urls.length && found[3].has("http")) add("L_url", "link", "low", "http");
  { const m = rx(/\b(?:click here|click below|click the link|tap the link|tap here|open the link|this link|payment link)\b|इस लिंक|लिंक से|लिंक पर|இணைப்பில்/); if (m) add("L_click", "link", /\b(?:verify|claim|update|pay|confirm|kyc|login|log in|unlock|reward|prize)\b|payment link/.test(low) || RK_PAYW_ML.test(raw) || RK_REQ_ML.test(raw) ? "medium" : "low", m); }
  { const m = rx(/\b(?:scan (?:this|the) qr|qr code)\b|qr कोड|क्यूआर|qr குறியீடு/); if (m) add("L_qr", "link", "medium", m); }
  { const m = rx(/\b(?:wa\.me|t\.me|whatsapp|telegram)\b|\b(?:call|whatsapp|message|text|contact)\b[^.!?]{0,25}\+?\d[\d\s-]{8,}|अनजान नंबर|कॉल करें|அழைக்கவும்/); if (m) add("L_channel", "link", "medium", m.slice(0, 40)); }
  if (found[3].has(".apk") && !ind.L_file) add("L_file", "link", "high", ".apk");

  /* ---- E. unrealistic claims ---- */
  { const m = rx(new RegExp("\\bguarantee(?:d|s)?\\b[^.!?]{0,30}\\b(?:returns?|profits?|income|earnings?|salary|job|placement|approval)\\b|\\bguarantee(?:d|s)?\\b[^.!?]{0,15}" + RK_AMT + "|\\b(?:100%|assured|risk[- ]free|zero risk)\\b[^.!?]{0,20}\\b(?:profit|returns?|income|safe)\\b|\\bdouble your money\\b|\\btriple your money\\b"));
    if (m) add("X_guar", "unrealistic", /returns?|profit|money|risk|₹|rs|\$|inr/.test(m) ? "critical" : "high", m.slice(0, 48)); }
  RK_GUAR_CRIT.forEach(t => { if (found[1].has(t)) add("X_guar", "unrealistic", "critical", t); });
  if (found[1].has("monthly returns")) add("X_guar", "unrealistic", "high", "monthly returns");
  if (found[1].has("guaranteed") && !ind.X_guar) add("X_guar", "unrealistic", "low", "guaranteed");
  { const m = rx(/\byou (?:have )?(?:won|been selected)\b|\bwinner\b|\blucky draw\b|\blottery\b|\bjackpot\b|\bcongratulations\b[^.!?]{0,60}\b(?:won|prize|reward|selected|cash)\b/); if (m) add("X_prize", "unrealistic", "high", m.slice(0, 40)); }
  RK_PRIZE_STRONG.forEach(t => { if (found[1].has(t)) add("X_prize", "unrealistic", "high", t); });
  ["prize", "reward points", "win a free", "பரிசு", "பரிசை", "இனாம்", "इनाम", "पुरस्कार"].forEach(t => { if (found[1].has(t)) add("X_prize", "unrealistic", "medium", t); });
  ["profit", "லாபம்", "लाभ हुआ"].forEach(t => { if (found[1].has(t)) add("X_profit", "unrealistic", "medium", t); });
  { const m = rx(new RegExp("\\bearn(?:ing|s)?\\b[^.!?]{0,25}" + RK_AMT + "(?:[^.!?]{0,20}\\b(day|daily|week|weekly|hour|hourly|month|monthly)\\b)?")) || rx(new RegExp(RK_AMT + "\\s*(?:per|a|/)\\s*(day|week|hour)\\b"));
    if (m) { const per = /day|daily|week|hour/.test(m); const ctx = /work from home|work-from-home|part[- ]time|no experience|simple tasks?|typing|data entry|like\/?share/.test(low); let sev = per ? "high" : "medium"; if (ctx && sev === "medium") sev = "high"; add("X_income", "unrealistic", sev, m.slice(0, 48)); } }
  { const m = rx(/\b(?:easy money|quick money|get rich|passive income|no experience (?:needed|required|necessary)|without (?:any )?investment|no investment|earn from home|simple tasks?)\b/); if (m) add("X_easy", "unrealistic", "medium", m); }
  ["easy money"].forEach(t => { if (found[1].has(t)) add("X_easy", "unrealistic", "medium", t); });
  ["high-paying", "joining letter", "அதிக சம்பள", "उच्च वेतन", "தேர்வு செய்யப்பட்டுள்ளது", "चयनित हुआ है"].forEach(t => { if (found[1].has(t)) add("X_easy", "unrealistic", "medium", t); });
  ["work from home", "work-from-home", "घर से काम"].forEach(t => { if (found[1].has(t)) add("X_easy", "unrealistic", "low", t); });
  { const m = rx(/\b(?:loan|credit)\b[^.!?]{0,30}\b(?:approved|pre-?approved|instant(?:ly)?)\b|\bno (?:documents|cibil|credit check)\b|\bwithout (?:documents|cibil)\b/); if (m) add("X_loan", "unrealistic", "medium", m.slice(0, 40)); }
  ["pre-approved", "instant loan", "loan approved", "approved instantly", "முன்-ஒப்புதல்", "ஒப்புதல் பெற்றுள்ளது", "प्री-अप्रूव", "लोन मंजूर", "मंजूर हो गया है"].forEach(t => { if (found[1].has(t)) add("X_loan", "unrealistic", "medium", t); });
  { const m = rx(/\b(?:recruit|refer|bring|sign up|add)\b[^.!?]{0,15}\b\d+\s*(?:people|friends|members|persons|others)\b|\bdownline\b|\brecruit(?:ing)?\b[^.!?]{0,40}\b(?:earn|income|unlock|bonus|commission)\b|\b(?:earn|income|commission|bonus)\b[^.!?]{0,40}\brecruit/); if (m) add("X_recruit", "unrealistic", "high", m.slice(0, 48)); }
  { const m = rx(/\b(?:network marketing|mlm|multi[- ]level)\b/); if (m) add("X_recruit", "unrealistic", "low", m); }

  /* ---- F. impersonation / authority ---- */
  found[4].forEach(t => {
    if (RK_AUTH_CRIT.includes(t)) add("I_threat", "impersonation", "critical", t);
    else if (RK_AUTH_HIGH.includes(t)) add("I_threat", "impersonation", "high", t);
    else if (RK_AUTH_LEGAL.includes(t)) add("I_threat", "impersonation", "medium", t);
    else if (t === "customer care") add("I_care", "impersonation", "low", t);
    else add("I_official", "impersonation", "low", t);
  });
  { const m = rx(/\b(?:this is|i am|i'm|we are|calling from|message from|from the|official)\b[^.!?]{0,40}\b(?:bank|police|customs|department|officer|customer care|support team|helpdesk|rbi|income tax|cyber)\b/); if (m) add("I_claim", "impersonation", "medium", m.slice(0, 48)); }
  { const m = rx(/\b(?:customer care|helpline|support executive|help ?desk)\b/); if (m && !ind.I_care) add("I_care", "impersonation", "low", m); }
  /* an authority name only matters when it comes with a request, a threat or a link */
  { const ctxOn = ["F_advance", "F_transfer", "F_gift", "S_otp", "S_cred", "S_kyc", "S_remote", "L_short", "L_tld", "L_file", "L_ip", "L_marked", "L_click", "U_threat", "U_deadline"].some(k => ind[k] && SEV_N[ind[k].sev] >= 2);
    if (ctxOn) { ["I_official", "I_care"].forEach(k => { if (ind[k] && ind[k].sev === "low") ind[k].sev = "medium"; }); } }

  /* ---- G. scam pattern / category (derived from the indicators above + dataset match) ---- */
  const has = (...ids) => ids.some(i => ind[i]);
  const pay = has("F_advance", "F_transfer", "F_purchase", "F_gift");
  const sensReq = ["S_otp", "S_cred", "S_remote"].some(k => ind[k]) || (ind.S_kyc && ind.S_kyc.sev === "high") || (ind.S_id && ind.S_id.sev === "high");
  const linkMed = Object.values(ind).some(x => x.cat === "link" && SEV_N[x.sev] >= 2);
  const pat = (id, sev) => add(id, "pattern", sev, []);
  if (ind.X_prize && (pay || linkMed || sensReq)) pat("P_lottery", "high"); else if (ind.X_prize && ind.X_prize.sev === "high") pat("P_lottery", "low");
  if ((ind.X_income || ind.X_easy || /\bjob\b|\bhiring\b|\bvacanc/.test(low)) && pay) pat("P_job", "high"); else if (ind.X_income && ind.X_easy) pat("P_job", "medium");
  if (ind.F_invest && (ind.X_guar || ind.X_income || ind.X_easy)) pat("P_invest", ind.X_guar && SEV_N[ind.X_guar.sev] >= 3 ? "high" : "medium");
  if (ind.X_loan && (pay || sensReq)) pat("P_loan", "high"); else if (ind.X_loan && ind.X_loan.sev !== "low" && linkMed) pat("P_loan", "medium");
  if (ind.X_recruit && SEV_N[ind.X_recruit.sev] >= 3 && (ind.F_purchase || ind.F_advance)) pat("P_mlm", "high"); else if (ind.X_recruit && SEV_N[ind.X_recruit.sev] >= 3) pat("P_mlm", "medium");
  if ((sensReq || ind.U_threat) && (linkMed || ind.I_official || ind.I_claim) && !ind.P_lottery) pat("P_phish", "high");
  if (ind.F_transfer && has("U_deadline", "U_threat", "I_claim", "I_official")) pat("P_pay", "high");
  if (ind.I_care && (ind.S_remote || ind.S_otp || pay)) pat("P_care", "high");
  if (/\b(?:courier|parcel|package|customs|delivery)\b/.test(low) && ind.F_advance) pat("P_parcel", "high");
  if (ind.I_threat && SEV_N[ind.I_threat.sev] >= 3 && (pay || sensReq || ind.U_deadline || ind.U_threat)) pat("P_arrest", "critical");
  if (opts.dataset) { try { const d = opts.dataset(raw); if (d) add("P_data", "pattern", d.s >= 0.8 ? "high" : "medium", d.type); } catch (e) {} }

  /* advance payment tied to a reward / loan / job / investment is the strongest financial signal */
  if (ind.F_advance && (ind.X_prize || ind.X_loan || ind.X_income || ind.X_easy || ind.X_guar || ind.X_profit || ind.F_invest)) ind.F_advance.sev = "critical";
  if (ind.F_invest && ind.X_guar && ind.F_invest.sev === "medium") ind.F_invest.sev = "high";

  /* ---- scoring: per-category cap, diminishing returns for extra indicators ---- */
  const list = Object.values(ind);
  const byCat = {}; Object.keys(RISK_CATS).forEach(c => byCat[c] = []);
  list.forEach(x => byCat[x.cat].push(x));
  const cats = []; let base = 0, rawBase = 0, sevAdj = 0, capped = 0;
  Object.keys(RISK_CATS).forEach(c => {
    const w = RISK_CATS[c], arr = byCat[c].slice().sort((a, b) => SEV_N[b.sev] - SEV_N[a.sev]);
    if (!arr.length) { cats.push({ cat: c, w, frac: 0, pts: 0, n: 0 }); return; }
    const frac = Math.min(1, SEV_F[arr[0].sev] + (arr[1] ? 0.2 * SEV_F[arr[1].sev] : 0));
    const pts = w * frac;
    arr.forEach(x => { rawBase += w * 0.6; sevAdj += w * (SEV_F[x.sev] - 0.6); });
    capped += pts - arr.reduce((s, x) => s + w * SEV_F[x.sev], 0);
    base += pts; cats.push({ cat: c, w, frac, pts, n: arr.length, top: arr[0].sev });
  });

  /* ---- combination bonuses (controlled: strongest + 40% of the second, capped) ---- */
  const urg = has("U_deadline", "U_threat", "U_today");
  const reward = has("X_prize", "X_income", "X_easy", "X_guar", "X_loan", "X_profit");
  const guar = ind.X_guar && SEV_N[ind.X_guar.sev] >= 3;
  const cred = ["S_otp", "S_cred", "S_remote"].some(k => ind[k]) || (ind.S_kyc && ind.S_kyc.sev === "high") || (ind.S_id && ind.S_id.sev === "high");
  const credCrit = ["S_otp", "S_cred"].some(k => ind[k] && ind[k].sev === "critical");
  const invest = !!ind.F_invest && SEV_N[ind.F_invest.sev] >= 2;
  const impMed = Object.values(ind).some(x => x.cat === "impersonation" && SEV_N[x.sev] >= 2);
  const payMoney = has("F_advance", "F_transfer", "F_gift");
  const combos = [];
  const C = (id, bonus, ok) => { if (ok) combos.push({ id, bonus }); };
  C("pay_urg_reward", 38, pay && urg && reward);
  C("pay_urg", 30, pay && urg && !(pay && urg && reward));
  C("cred_urg", 45, cred && urg);
  C("invest_guar_urg", 40, (payMoney || invest) && guar && urg);
  C("pay_reward", 24, pay && reward && !urg);
  C("invest_guar", 24, (payMoney || invest) && guar && !urg);
  C("cred_crit", 30, credCrit);
  C("cred_high", 10, cred && !credCrit);
  C("pay_cred", 25, pay && cred);
  C("cred_imp", 15, cred && impMed);
  C("cred_link", 18, cred && linkMed);
  C("pay_link", 12, pay && linkMed);
  C("reward_link", 15, ind.X_prize && linkMed);
  C("arrest", 35, ind.I_threat && SEV_N[ind.I_threat.sev] >= 3 && (pay || cred || urg));
  C("recruit_buy", 20, ind.X_recruit && SEV_N[ind.X_recruit.sev] >= 3 && (ind.F_purchase || ind.F_advance));
  C("phish_triad", 18, urg && linkMed && impMed);
  C("urg_link_high", 25, urg && Object.values(ind).some(x => x.cat === "link" && SEV_N[x.sev] >= 3));
  combos.sort((a, b) => b.bonus - a.bonus);
  const bonus = Math.min(55, (combos[0] ? combos[0].bonus : 0) + (combos[1] ? 0.4 * combos[1].bonus : 0));
  let total = base + bonus, smooth = 0, floor = 0;
  const topSev = list.reduce((m, x) => Math.max(m, SEV_N[x.sev]), 0);
  /* a high-severity indicator is never "low risk"; a critical one is never below the middle of Suspicious */
  const minScore = topSev >= 4 ? 40 : topSev >= 3 ? 22 : 0;
  if (total < minScore) { floor = minScore - total; total = minScore; }
  if (total > 88) { const s = 88 + (total - 88) * 0.4; smooth = s - total; total = s; }
  let score = Math.max(0, Math.min(100, Math.round(total)));
  const unsupported = !!opts.unsupportedRe && opts.unsupportedRe.test(raw);
  if (unsupported && score < 20) score = 20;
  const level = score >= 75 ? "critical" : score >= 50 ? "high" : score >= 20 ? "suspicious" : "safe";

  /* ---- ranking for display: strongest first ---- */
  const catOrder = Object.keys(RISK_CATS);
  const ranked = list.slice().sort((a, b) => (SEV_N[b.sev] - SEV_N[a.sev]) || (RISK_CATS[b.cat] - RISK_CATS[a.cat]) || (catOrder.indexOf(a.cat) - catOrder.indexOf(b.cat)));
  return { score, level, indicators: ranked, cats, combos, unsupported,
    breakdown: { base: rawBase, severity: sevAdj, capped, bonus, floor, smooth, final: score, comboIds: combos.map(c => c.id) } };
}

/* Scam Database (admin): dataset explorer and the "similar messages" matcher */

/* ---- Scam message dataset: explorer on the dashboard + similar-message matches in the checker ---- */
(function () {
  const DS = window.FV_DATASET;
  const LANGS = DS.L, CATS = DS.C, TYPES = DS.T, INDS = DS.I, ACTS = DS.A, ROWS = DS.R;
  const LVL = { "High Risk": "high", "Suspicious": "suspicious", "Safe": "safe" };
  const N = ROWS.length, PAGE = 15;

  Object.assign(copy.en, { dsTitle:"Scam message dataset", dsCopy:"Labelled example messages in 12 languages. The checker compares what you paste with these examples and shows the closest ones.", dsTotal:"Messages", dsLangs:"Languages", dsByLang:"Messages by language", dsByRisk:"Messages by result", dsSearch:"Search messages or IDs…", dsAllLang:"All languages", dsAllRisk:"All results", dsAllType:"All types", dsColId:"ID", dsColType:"Type", dsDetails:"Warning signs and advice", dsInd:"Warning signs", dsAct:"Recommended action", dsCheck:"Check this", dsPrev:"Previous", dsNext:"Next", dsPage:"Page", dsMsgs:"messages", dsNone:"No messages match these filters.", simTitle:"Similar messages in the dataset", simNone:"No close match found in the dataset. That does not mean the message is safe.", simMatch:"match", simNote:"Matched by wording against labelled examples. A match is a hint, not proof." });
  Object.assign(copy.hi, { dsTitle:"स्कैम संदेश डेटासेट", dsCopy:"12 भाषाओं में लेबल किए गए उदाहरण संदेश। चेकर आपके संदेश की तुलना इन उदाहरणों से करके सबसे मिलते-जुलते उदाहरण दिखाता है।", dsTotal:"संदेश", dsLangs:"भाषाएँ", dsByLang:"भाषा के अनुसार संदेश", dsByRisk:"परिणाम के अनुसार संदेश", dsSearch:"संदेश या ID खोजें…", dsAllLang:"सभी भाषाएँ", dsAllRisk:"सभी परिणाम", dsAllType:"सभी प्रकार", dsColId:"ID", dsColType:"प्रकार", dsDetails:"चेतावनी संकेत और सलाह", dsInd:"चेतावनी संकेत", dsAct:"सुझाई गई कार्रवाई", dsCheck:"इसे जाँचें", dsPrev:"पिछला", dsNext:"अगला", dsPage:"पृष्ठ", dsMsgs:"संदेश", dsNone:"इन फ़िल्टरों से कोई संदेश नहीं मिला।", simTitle:"डेटासेट में मिलते-जुलते संदेश", simNone:"डेटासेट में कोई करीबी मेल नहीं मिला। इसका मतलब यह नहीं कि संदेश सुरक्षित है।", simMatch:"मेल", simNote:"लेबल किए उदाहरणों से शब्दों के आधार पर मिलान। मिलान एक संकेत है, प्रमाण नहीं।" });
  Object.assign(copy.ta, { dsTitle:"மோசடி செய்தித் தரவுத்தொகுப்பு", dsCopy:"12 மொழிகளில் வகைப்படுத்தப்பட்ட எடுத்துக்காட்டு செய்திகள். நீங்கள் ஒட்டும் செய்தியை இவற்றுடன் ஒப்பிட்டு மிக நெருக்கமானவற்றைக் காட்டும்.", dsTotal:"செய்திகள்", dsLangs:"மொழிகள்", dsByLang:"மொழி வாரியாக செய்திகள்", dsByRisk:"முடிவு வாரியாக செய்திகள்", dsSearch:"செய்தி அல்லது ID தேடுங்கள்…", dsAllLang:"அனைத்து மொழிகள்", dsAllRisk:"அனைத்து முடிவுகள்", dsAllType:"அனைத்து வகைகள்", dsColId:"ID", dsColType:"வகை", dsDetails:"எச்சரிக்கை அறிகுறிகளும் ஆலோசனையும்", dsInd:"எச்சரிக்கை அறிகுறிகள்", dsAct:"பரிந்துரைக்கப்படும் நடவடிக்கை", dsCheck:"இதைச் சோதி", dsPrev:"முந்தையது", dsNext:"அடுத்தது", dsPage:"பக்கம்", dsMsgs:"செய்திகள்", dsNone:"இந்த வடிகட்டிகளுக்குப் பொருந்தும் செய்திகள் இல்லை.", simTitle:"தரவுத்தொகுப்பில் ஒத்த செய்திகள்", simNone:"தரவுத்தொகுப்பில் நெருக்கமான ஒப்பீடு இல்லை. இதன் பொருள் செய்தி பாதுகாப்பானது என்பதல்ல.", simMatch:"பொருத்தம்", simNote:"வகைப்படுத்தப்பட்ட எடுத்துக்காட்டுகளுடன் சொற்களின் அடிப்படையில் ஒப்பிடப்பட்டது. ஒப்பீடு ஒரு குறிப்பு மட்டுமே, ஆதாரம் அல்ல." });
  Object.assign(copy.en, { navHome:"Home", navChecker:"Scam Checker", navMsgChecker:"Message Checker", navShotChecker:"Screenshot Checker", navUrlChecker:"URL Checker", navQrChecker:"QR Checker", navHistory:"Check History", navReport:"Report a Scam", navAcademy:"Fraud Academy", navDatabase:"Scam Database", navSettings:"Settings", urlCheckerTitle:"URL Checker", urlCheckerCopy:"A standalone link-safety scanner is on its way. For now, paste the whole message containing the link into the Message Checker — it already flags suspicious links found in text.", qrCheckerTitle:"QR Checker", qrCheckerCopy:"QR-code scanning is on its way. Until then, a screenshot of the QR code or the message around it can be checked with the Screenshot Checker.", comingSoon:"Coming soon", dbNoAccess:"The full scam-message dataset browser is available to the administrator account only.", historyTitle:"Your past checks", clearMyHistory:"Clear my history", reportTitle:"Report a Scam", reportCopy:"A guided in-app scam-reporting form is coming to Trinetra soon. Until then, please report scams directly to the National Cyber Crime Reporting Portal.", academyTitle:"Learn to spot a scam", settingsTitle:"Your Trinetra settings", settingsProfile:"Profile", settingsProfileCopy:"Your Trinetra account details.", settingsDisplayName:"Display name", settingsDisplayNamePh:"Add a display name", save:"Save", settingsAppearance:"Appearance", settingsAppearanceCopy:"Choose how Trinetra looks on this device.", settingsTheme:"Theme", themeLight:"Light", themeDark:"Dark", themeSystem:"System", settingsLanguage:"Language", settingsLanguageCopy:"Pick the language for menus and the checker.", settingsNotifications:"Notifications", settingsNotificationsCopy:"On-screen preferences, saved in this browser only.", notifScamAlerts:"Scam alerts", notifEduReminders:"Educational reminders", notifReportUpdates:"Report updates", settingsPrivacy:"Privacy", settingsPrivacyCopy:"Typed text and screenshots are read only in this browser and never uploaded. Your check history is stored locally here too.", privacyClearHistory:"Clear my check history", privacyClearData:"Clear all my stored data", clear:"Clear", settingsSecurity:"Security", settingsSecurityCopy:"Manage your password and session.", pwCurrentL:"Current password", pwNewL:"New password", pwChange:"Change password", settingsSignOut:"Sign out of Trinetra", errPwWrong:"Current password is incorrect.", pwChanged:"Password updated.", settingsData:"Data", settingsDataCopy:"Export or remove the data Trinetra keeps for your account.", dataExport:"Export my data", dataExportBtn:"Export", dataDeleteHistory:"Delete history", dataDeleteAccount:"Delete my account", dataDeleteAccountBtn:"Delete account", confirmDeleteAccount:"This permanently deletes your account and all your saved checks. This cannot be undone. Continue?", confirmClearData:"This clears your check history and saved preferences in this browser. Continue?", adminCannotDelete:"The administrator account cannot be deleted." });
  Object.assign(copy.hi, { navHome:"होम", navChecker:"स्कैम चेकर", navMsgChecker:"मैसेज चेकर", navShotChecker:"स्क्रीनशॉट चेकर", navUrlChecker:"URL चेकर", navQrChecker:"QR चेकर", navHistory:"चेक इतिहास", navReport:"स्कैम की रिपोर्ट करें", navAcademy:"फ्रॉड अकादमी", navDatabase:"स्कैम डेटाबेस", navSettings:"सेटिंग्स", urlCheckerTitle:"URL चेकर", urlCheckerCopy:"स्वतंत्र लिंक-सुरक्षा स्कैनर जल्द आ रहा है। तब तक, लिंक वाला पूरा संदेश मैसेज चेकर में पेस्ट करें — यह पहले से ही टेक्स्ट में संदिग्ध लिंक पहचान लेता है।", qrCheckerTitle:"QR चेकर", qrCheckerCopy:"QR-कोड स्कैनिंग जल्द आ रही है। तब तक, QR कोड या उसके आस-पास के संदेश का स्क्रीनशॉट लेकर स्क्रीनशॉट चेकर से जाँचें।", comingSoon:"जल्द आ रहा है", dbNoAccess:"पूरा स्कैम-संदेश डेटासेट ब्राउज़र केवल एडमिन खाते के लिए उपलब्ध है।", historyTitle:"आपकी पिछली जाँचें", clearMyHistory:"मेरा इतिहास साफ़ करें", reportTitle:"स्कैम की रिपोर्ट करें", reportCopy:"Trinetra में जल्द ही एक गाइडेड स्कैम-रिपोर्टिंग फ़ॉर्म आएगा। तब तक कृपया National Cyber Crime Reporting Portal पर सीधे रिपोर्ट करें।", academyTitle:"स्कैम पहचानना सीखें", settingsTitle:"आपकी Trinetra सेटिंग्स", settingsProfile:"प्रोफ़ाइल", settingsProfileCopy:"आपके Trinetra खाते का विवरण।", settingsDisplayName:"डिस्प्ले नाम", settingsDisplayNamePh:"डिस्प्ले नाम जोड़ें", save:"सेव करें", settingsAppearance:"रूप", settingsAppearanceCopy:"चुनें कि Trinetra इस डिवाइस पर कैसा दिखे।", settingsTheme:"थीम", themeLight:"लाइट", themeDark:"डार्क", themeSystem:"सिस्टम", settingsLanguage:"भाषा", settingsLanguageCopy:"मेनू और चेकर के लिए भाषा चुनें।", settingsNotifications:"सूचनाएं", settingsNotificationsCopy:"ऑन-स्क्रीन प्राथमिकताएँ, केवल इस ब्राउज़र में सेव होती हैं।", notifScamAlerts:"स्कैम अलर्ट", notifEduReminders:"शिक्षा संबंधी रिमाइंडर", notifReportUpdates:"रिपोर्ट अपडेट", settingsPrivacy:"गोपनीयता", settingsPrivacyCopy:"टाइप किया गया टेक्स्ट और स्क्रीनशॉट केवल इस ब्राउज़र में पढ़े जाते हैं और कभी अपलोड नहीं होते। आपका चेक इतिहास भी यहीं स्थानीय रूप से सेव होता है।", privacyClearHistory:"मेरा चेक इतिहास साफ़ करें", privacyClearData:"मेरा सारा सेव डेटा साफ़ करें", clear:"साफ़ करें", settingsSecurity:"सुरक्षा", settingsSecurityCopy:"अपना पासवर्ड और सेशन प्रबंधित करें।", pwCurrentL:"मौजूदा पासवर्ड", pwNewL:"नया पासवर्ड", pwChange:"पासवर्ड बदलें", settingsSignOut:"Trinetra से साइन आउट करें", errPwWrong:"मौजूदा पासवर्ड गलत है।", pwChanged:"पासवर्ड अपडेट हो गया।", settingsData:"डेटा", settingsDataCopy:"अपने खाते का डेटा एक्सपोर्ट करें या हटाएँ।", dataExport:"मेरा डेटा एक्सपोर्ट करें", dataExportBtn:"एक्सपोर्ट", dataDeleteHistory:"इतिहास हटाएँ", dataDeleteAccount:"मेरा खाता हटाएँ", dataDeleteAccountBtn:"खाता हटाएँ", confirmDeleteAccount:"इससे आपका खाता और सभी सेव की गई जाँचें स्थायी रूप से हट जाएंगी। यह पूर्ववत नहीं किया जा सकता। जारी रखें?", confirmClearData:"इससे इस ब्राउज़र में आपका चेक इतिहास और सेव प्राथमिकताएँ साफ़ हो जाएंगी। जारी रखें?", adminCannotDelete:"एडमिन खाता हटाया नहीं जा सकता।" });
  Object.assign(copy.ta, { navHome:"முகப்பு", navChecker:"ஸ்கேம் செக்கர்", navMsgChecker:"செய்தி செக்கர்", navShotChecker:"ஸ்கிரீன்ஷாட் செக்கர்", navUrlChecker:"URL செக்கர்", navQrChecker:"QR செக்கர்", navHistory:"சோதனை வரலாறு", navReport:"மோசடியைப் புகாரளி", navAcademy:"மோசடி கல்வி மையம்", navDatabase:"மோசடி தரவுத்தொகுப்பு", navSettings:"அமைப்புகள்", urlCheckerTitle:"URL செக்கர்", urlCheckerCopy:"தனி இணைப்பு-பாதுகாப்பு ஸ்கேனர் விரைவில் வருகிறது. தற்போதைக்கு, இணைப்பு உள்ள முழு செய்தியையும் செய்தி செக்கரில் ஒட்டவும் — இது ஏற்கனவே உரையில் சந்தேகத்திற்குரிய இணைப்புகளைக் கண்டறியும்.", qrCheckerTitle:"QR செக்கர்", qrCheckerCopy:"QR-குறியீடு ஸ்கேனிங் விரைவில் வருகிறது. அதுவரை, QR குறியீடு அல்லது அதைச் சுற்றியுள்ள செய்தியின் ஸ்கிரீன்ஷாட்டை ஸ்கிரீன்ஷாட் செக்கர் மூலம் சோதிக்கலாம்.", comingSoon:"விரைவில் வருகிறது", dbNoAccess:"முழு மோசடி-செய்தி தரவுத்தொகுப்பு உலாவி நிர்வாகி கணக்கிற்கு மட்டுமே கிடைக்கும்.", historyTitle:"உங்கள் முந்தைய சோதனைகள்", clearMyHistory:"என் வரலாற்றை அழி", reportTitle:"மோசடியைப் புகாரளி", reportCopy:"Trinetra-இல் விரைவில் ஒரு வழிகாட்டப்பட்ட மோசடி-புகார் படிவம் வரும். அதுவரை தேசிய சைபர் கிரைம் புகார் போர்ட்டலில் நேரடியாக புகாரளிக்கவும்.", academyTitle:"மோசடியைக் கண்டறியக் கற்றுக்கொள்ளுங்கள்", settingsTitle:"உங்கள் Trinetra அமைப்புகள்", settingsProfile:"சுயவிவரம்", settingsProfileCopy:"உங்கள் Trinetra கணக்கு விவரங்கள்.", settingsDisplayName:"காட்சிப் பெயர்", settingsDisplayNamePh:"காட்சிப் பெயரைச் சேர்க்கவும்", save:"சேமி", settingsAppearance:"தோற்றம்", settingsAppearanceCopy:"இந்த சாதனத்தில் Trinetra எப்படித் தெரிய வேண்டும் என்பதைத் தேர்வுசெய்யுங்கள்.", settingsTheme:"தீம்", themeLight:"லைட்", themeDark:"டார்க்", themeSystem:"சிஸ்டம்", settingsLanguage:"மொழி", settingsLanguageCopy:"மெனுக்கள் மற்றும் செக்கருக்கான மொழியைத் தேர்வுசெய்யுங்கள்.", settingsNotifications:"அறிவிப்புகள்", settingsNotificationsCopy:"திரையில் விருப்பத்தேர்வுகள், இந்த உலாவியில் மட்டும் சேமிக்கப்படும்.", notifScamAlerts:"மோசடி எச்சரிக்கைகள்", notifEduReminders:"கல்வி நினைவூட்டல்கள்", notifReportUpdates:"புகார் புதுப்பிப்புகள்", settingsPrivacy:"தனியுரிமை", settingsPrivacyCopy:"தட்டச்சு செய்யப்பட்ட உரையும் ஸ்கிரீன்ஷாட்களும் இந்த உலாவியில் மட்டுமே படிக்கப்படும், ஒருபோதும் பதிவேற்றப்படாது. உங்கள் சோதனை வரலாறும் இங்கேயே உள்ளூரில் சேமிக்கப்படும்.", privacyClearHistory:"என் சோதனை வரலாற்றை அழி", privacyClearData:"என் சேமிக்கப்பட்ட தரவு அனைத்தையும் அழி", clear:"அழி", settingsSecurity:"பாதுகாப்பு", settingsSecurityCopy:"உங்கள் கடவுச்சொல் மற்றும் அமர்வை நிர்வகிக்கவும்.", pwCurrentL:"தற்போதைய கடவுச்சொல்", pwNewL:"புதிய கடவுச்சொல்", pwChange:"கடவுச்சொல்லை மாற்று", settingsSignOut:"Trinetra-இலிருந்து வெளியேறு", errPwWrong:"தற்போதைய கடவுச்சொல் தவறானது.", pwChanged:"கடவுச்சொல் புதுப்பிக்கப்பட்டது.", settingsData:"தரவு", settingsDataCopy:"உங்கள் கணக்கிற்கான தரவை ஏற்றுமதி செய்யவும் அல்லது நீக்கவும்.", dataExport:"என் தரவை ஏற்றுமதி செய்", dataExportBtn:"ஏற்றுமதி", dataDeleteHistory:"வரலாற்றை நீக்கு", dataDeleteAccount:"என் கணக்கை நீக்கு", dataDeleteAccountBtn:"கணக்கை நீக்கு", confirmDeleteAccount:"இது உங்கள் கணக்கையும் சேமிக்கப்பட்ட அனைத்து சோதனைகளையும் நிரந்தரமாக நீக்கும். இதைச் செயல்தவிர்க்க முடியாது. தொடரவா?", confirmClearData:"இது இந்த உலாவியில் உங்கள் சோதனை வரலாறு மற்றும் சேமிக்கப்பட்ட விருப்பத்தேர்வுகளை அழிக்கும். தொடரவா?", adminCannotDelete:"நிர்வாகி கணக்கை நீக்க முடியாது." });

  const lvl = r => LVL[CATS[r[2]]] || "suspicious";
  const pill = r => '<span class="verdict ' + lvl(r) + '">' + tx(lvl(r)) + '</span>';
  const fmt = n => n.toLocaleString();
  const count = (idx) => { const a = new Array(idx.len).fill(0); ROWS.forEach(r => a[r[idx.col]]++); return a; };
  const perLang = count({ col: 1, len: LANGS.length }), perCat = count({ col: 2, len: CATS.length });

  /* ---------- Explorer ---------- */
  const st = { q: "", lang: "", cat: "", type: "", page: 0 };
  let view = ROWS.map((_, i) => i);
  function applyFilters() {
    const q = st.q.trim().toLowerCase();
    view = [];
    for (let i = 0; i < N; i++) {
      const r = ROWS[i];
      if (st.lang !== "" && r[1] !== +st.lang) continue;
      if (st.cat !== "" && r[2] !== +st.cat) continue;
      if (st.type !== "" && r[3] !== +st.type) continue;
      if (q && r[4].toLowerCase().indexOf(q) < 0 && r[0].toLowerCase().indexOf(q) < 0) continue;
      view.push(i);
    }
    const pages = Math.max(1, Math.ceil(view.length / PAGE)); if (st.page >= pages) st.page = pages - 1;
  }
  function fillSelect(sel, allKey, items, value, label) {
    sel.innerHTML = '<option value="">' + escHtml(tx(allKey)) + '</option>' + items.map((v, i) => '<option value="' + i + '">' + escHtml(label ? label(v) : v) + '</option>').join("");
    sel.value = value;
  }
  function renderTable() {
    applyFilters();
    const pages = Math.max(1, Math.ceil(view.length / PAGE)), from = st.page * PAGE, slice = view.slice(from, from + PAGE);
    $("#ds-table").innerHTML = slice.length ? '<table><tr><th>' + tx("dsColId") + '</th><th>' + tx("language") + '</th><th>' + tx("colResult") + '</th><th>' + tx("dsColType") + '</th><th>' + tx("colMsg") + '</th><th></th></tr>' +
      slice.map(i => { const r = ROWS[i]; return '<tr><td class="nowrap">' + escHtml(r[0]) + '</td><td class="nowrap">' + escHtml(LANGS[r[1]]) + '</td><td>' + pill(r) + '</td><td>' + escHtml(TYPES[r[3]]) + '</td><td class="msg">' + escHtml(r[4]) + '<details><summary>' + tx("dsDetails") + '</summary><b>' + tx("dsInd") + ':</b> ' + escHtml(INDS[r[5]]) + '<br><b>' + tx("dsAct") + ':</b> ' + escHtml(ACTS[r[6]]) + '</details></td><td><button class="ghost" type="button" data-chk="' + i + '">' + tx("dsCheck") + '</button></td></tr>'; }).join("") + '</table>'
      : '<p class="fine">' + tx("dsNone") + '</p>';
    $("#ds-pager").innerHTML = '<button class="ghost" type="button" data-pg="-1"' + (st.page === 0 ? " disabled" : "") + '>← ' + tx("dsPrev") + '</button><span class="fine">' + tx("dsPage") + ' ' + fmt(st.page + 1) + ' / ' + fmt(pages) + ' · ' + fmt(view.length) + ' ' + tx("dsMsgs") + '</span><button class="ghost" type="button" data-pg="1"' + (st.page >= pages - 1 ? " disabled" : "") + '>' + tx("dsNext") + ' →</button>';
  }
  function renderDataset() {
    $("#ds-tiles").innerHTML = [[tx("dsTotal"), fmt(N)], [tx("dsLangs"), LANGS.length]].concat(["high", "suspicious", "safe"].map(l => [tx(l), fmt(perCat.reduce((s, v, i) => s + (LVL[CATS[i]] === l ? v : 0), 0))])).map(a => '<div class="tile"><b>' + a[1] + '</b><span>' + a[0] + '</span></div>').join("");
    const row = (label, v, max, color) => '<div class="hrow"><span>' + escHtml(label) + '</span><div class="hbar"><i style="width:' + (max ? v / max * 100 : 0) + '%;background:' + color + '"></i></div><b>' + fmt(v) + '</b></div>';
    $("#ds-lang").innerHTML = LANGS.map((l, i) => row(l, perLang[i], Math.max(...perLang), "var(--brand)")).join("");
    $("#ds-risk").innerHTML = CATS.map((c, i) => row(tx(LVL[c] || "suspicious"), perCat[i], Math.max(...perCat), LV[LVL[c] || "suspicious"])).join("");
    fillSelect($("#ds-f-lang"), "dsAllLang", LANGS, st.lang);
    fillSelect($("#ds-f-risk"), "dsAllRisk", CATS, st.cat, c => tx(LVL[c] || "suspicious"));
    fillSelect($("#ds-f-type"), "dsAllType", TYPES, st.type);
    renderTable();
  }
  let timer; $("#ds-q").addEventListener("input", e => { clearTimeout(timer); timer = setTimeout(() => { st.q = e.target.value; st.page = 0; renderTable(); }, 150); });
  [["#ds-f-lang", "lang"], ["#ds-f-risk", "cat"], ["#ds-f-type", "type"]].forEach(a => $(a[0]).addEventListener("change", e => { st[a[1]] = e.target.value; st.page = 0; renderTable(); }));
  $("#ds-pager").addEventListener("click", e => { const b = e.target.closest("[data-pg]"); if (!b || b.disabled) return; st.page = Math.max(0, st.page + +b.dataset.pg); renderTable(); $("#dataset").scrollIntoView({ behavior: "smooth", block: "start" }); });
  $("#ds-table").addEventListener("click", e => { const b = e.target.closest("[data-chk]"); if (!b) return; $("#message").value = ROWS[+b.dataset.chk][4]; window.scrollTo({ top: 0, behavior: "smooth" }); $("#check-button").click(); });

  /* ---------- Similar messages (character-trigram match, works for every script) ---------- */
  const norm = s => s.toLowerCase().replace(/\s*ref:\s*reference code[^.]*\.?/g, " ").replace(/\d+/g, "0").replace(/[^\p{L}\p{M}\p{N}]+/gu, " ").trim();
  const grams = s => { const t = " " + s + " ", g = new Set(); for (let i = 0; i + 3 <= t.length; i++) g.add(t.substr(i, 3)); return g; };
  let idx = null;
  function buildIndex() {
    if (idx) return idx;
    const seen = new Map(), docs = [];
    ROWS.forEach((r, i) => { const k = r[4]; if (!seen.has(k)) { seen.set(k, docs.length); docs.push(i); } });
    const tri = new Map(), post = [], size = new Int32Array(docs.length);
    docs.forEach((ri, d) => { const g = grams(norm(ROWS[ri][4])); size[d] = g.size; g.forEach(x => { let id = tri.get(x); if (id === undefined) { id = post.length; tri.set(x, id); post.push([]); } post[id].push(d); }); });
    idx = { docs, tri, post, size, hit: new Int32Array(docs.length) };
    return idx;
  }
  function similar(text, k) {
    const X = buildIndex(), g = grams(norm(text.slice(0, 1000)));
    if (g.size < 5) return [];
    const touched = [];
    g.forEach(x => { const id = X.tri.get(x); if (id === undefined) return; const p = X.post[id]; for (let j = 0; j < p.length; j++) { const d = p[j]; if (X.hit[d]++ === 0) touched.push(d); } });
    const out = touched.map(d => ({ d, s: X.hit[d] / (g.size + X.size[d] - X.hit[d]) }));
    touched.forEach(d => X.hit[d] = 0);
    return out.filter(o => o.s >= 0.25).sort((a, b) => b.s - a.s).slice(0, k).map(o => ({ row: ROWS[X.docs[o.d]], s: o.s }));
  }
  function similarHtml(text) {
    const m = similar(text, 3);
    return '<div class="similar"><p class="panel-label">' + tx("simTitle") + '</p>' + (m.length ? m.map(o => { const r = o.row; return '<div class="simrow"><div class="meta">' + pill(r) + '<b>' + Math.round(o.s * 100) + '% ' + tx("simMatch") + '</b><span>' + escHtml(LANGS[r[1]]) + ' · ' + escHtml(r[0]) + '</span></div><div class="txt">' + escHtml(r[4]) + '</div><div class="why"><b>' + tx("dsAct") + ':</b> ' + escHtml(ACTS[r[6]]) + '</div></div>'; }).join("") + '<p class="fine">' + tx("simNote") + '</p>' : '<p class="fine">' + tx("simNone") + '</p>') + '</div>';
  }
  new MutationObserver(() => {
    const r = $("#result-panel").querySelector(".result");
    if (!r || r.querySelector(".similar")) return;
    try { r.insertAdjacentHTML("beforeend", similarHtml($("#message").value)); } catch (e) {}
  }).observe($("#result-panel"), { childList: true });

  /* keep the dataset labels in step with the language picker, then apply the new strings once */
  const baseTranslate = translate;
  translate = function () { baseTranslate(); renderDataset(); };
  translate();
  setTimeout(buildIndex, 600);
  window.fvDataset = { rows: ROWS, similar, types: TYPES, cats: CATS };
})();
  

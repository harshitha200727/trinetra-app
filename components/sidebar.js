/* Component: sidebar — markup is mounted into index.html by src/mount.js */
(window.FV_COMPONENTS = window.FV_COMPONENTS || {})["sidebar"] = `<aside class="sidebar" id="sidebar">
        <div class="sidebar-top">
          <a class="brand" href="#top" aria-label="Trinetra home">
            <span class="brand-logo" role="img" aria-label="Trinetra logo"></span>
            <span class="brand-text side-label"><span class="brand-word">Trinetra</span><span class="brand-tag">See Beyond The Obvious</span></span>
          </a>
          <button id="sidebar-collapse" type="button" aria-label="Collapse sidebar">⟨</button>
          <button id="sidebar-close" type="button" aria-label="Close menu">✕</button>
        </div>
        <button class="check-now-btn" id="quick-check-btn" type="button" data-tip="Check Now">⌁ <span class="side-label">Check Now</span></button>
        <nav class="sidenav" aria-label="Main navigation">
          <div class="side-group-label side-label" data-i18n="grpMain">Main</div>
          <button class="sidelink" data-view="home" data-tip="Home" type="button"><span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg></span><span class="side-label" data-i18n="navHome">Home</span></button>
          <div class="side-group-label side-label" data-i18n="grpCheck">Check</div>
          <button class="sidelink" id="checker-nav" data-tip="Scam Checker" data-view="home" data-scroll="1" type="button"><span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></span><span class="side-label" data-i18n="navChecker">Scam Checker</span></button>
          <div class="side-group-label side-label" data-i18n="grpInsights">Insights</div>
          <button class="sidelink" id="dash-nav" data-view="dash" data-tip="Dashboard" data-auth="1" type="button"><span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg></span><span class="side-label" data-i18n="dashNav">Dashboard</span></button>
          <button class="sidelink" data-view="history" data-tip="Check History" data-auth="1" type="button"><span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><path d="M9 12h6M9 16h6"/></svg></span><span class="side-label" data-i18n="navHistory">Check History</span></button>
          <div class="side-group-label side-label" data-i18n="grpLearn">Learn & Report</div>
          <button class="sidelink" data-view="report" data-tip="Report a Scam" type="button"><span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 22V4"/><path d="M4 4h14l-2 5 2 5H4"/></svg></span><span class="side-label" data-i18n="navReport">Report a Scam</span></button>
          <button class="sidelink" data-view="academy" data-tip="Fraud Academy" type="button"><span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg></span><span class="side-label" data-i18n="navAcademy">Fraud Academy</span></button>
          <button class="sidelink" id="nav-database" data-view="database" data-tip="Scam Database" data-auth="1" type="button" hidden><span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg></span><span class="side-label" data-i18n="navDatabase">Scam Database</span></button>
        </nav>
        <div class="sidebar-bottom">
          <div class="side-lang"><button class="sidelink side-globe" id="side-globe" type="button" data-tip="Language"><span class="icon">🌐</span></button><select id="side-lang" class="ghost" aria-label="Language"><option value="en">English</option><option value="hi">हिन्दी</option><option value="ta">தமிழ்</option><option value="mr">मराठी</option><option value="gu">ગુજરાતી</option><option value="bn">বাংলা</option><option value="kn">ಕನ್ನಡ</option><option value="te">తెలుగు</option><option value="ml">മലയാളം</option><option value="pa">ਪੰਜਾਬੀ</option><option value="or">ଓଡ଼ିଆ</option><option value="ur">اردو</option></select></div>
          <button class="sidelink" id="side-theme" type="button" data-tip="Theme"><span class="icon" id="side-theme-icon">☾</span><span class="side-label" id="side-theme-label">Dark mode</span></button>
          <div class="premium" data-tip="Upgrade Premium" title="Premium is coming soon" aria-disabled="true"><span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg></span><span class="side-label">Upgrade Premium</span><span class="side-label prem-badge">Soon</span></div>
          <button class="sidelink" data-view="settings" data-tip="Settings" type="button"><span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg></span><span class="side-label" data-i18n="navSettings">Settings</span></button>
          <button class="user-chip" id="sidebar-userchip" data-view="settings" type="button" hidden>
            <span class="avatar" id="sidebar-avatar">?</span>
            <span class="user-meta"><span id="who"></span><span class="fine">Profile</span></span>
          </button>
          <button class="sidelink" id="signin-nav" type="button" data-tip="Sign in"><span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><path d="M10 17l5-5-5-5M15 12H3"/></svg></span><span class="side-label" data-i18n="tabIn">Sign in</span></button>
          <button class="sidelink" id="signout" type="button" data-tip="Sign out"><span class="icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg></span><span class="side-label" data-i18n="signOut">Sign out</span></button>
        </div>
      </aside>`;

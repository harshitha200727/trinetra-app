/* Component: view-settings — markup is mounted into index.html by src/mount.js */
(window.FV_COMPONENTS = window.FV_COMPONENTS || {})["view-settings"] = `<div id="view-settings" hidden>
    <section class="section">
      <div class="page-head"><div class="kicker" data-i18n="navSettings">Settings</div><h2 data-i18n="settingsTitle">Your Trinetra settings</h2></div>
      <div class="settings-shell"><nav class="settings-nav" aria-label="Settings sections"><a href="#set-profile" data-i18n="settingsProfile">Profile</a><a href="#set-appearance" data-i18n="settingsAppearance">Appearance</a><a href="#set-language" data-i18n="settingsLanguage">Language</a><a href="#set-notifications" data-i18n="settingsNotifications">Notifications</a><a href="#set-privacy" data-i18n="settingsPrivacy">Privacy</a><a href="#set-security" data-i18n="settingsSecurity">Security</a><a href="#set-account" data-i18n="settingsAccount">Account</a></nav>
      <div class="settings-grid">
        <div class="settings-card acct-only" id="set-profile">
          <h3 data-i18n="settingsProfile">Profile</h3>
          <p class="fine" data-i18n="settingsProfileCopy">Your Trinetra account details.</p>
          <div class="settings-avatar-row">
            <span class="avatar" id="settings-avatar">?</span>
            <div>
              <div class="fine" id="settings-role-line">—</div>
              <div class="actions" style="margin-top:8px"><button class="ghost" id="avatar-upload" type="button">Change avatar</button><button class="ghost" id="avatar-remove" type="button">Remove</button></div>
              <input type="file" id="avatar-file" accept="image/*" hidden>
            </div>
          </div>
          <div class="settings-field">
            <label for="settings-display-name">Name</label>
            <input type="text" id="settings-display-name" placeholder="Add your name" maxlength="40">
          </div>
          <div class="settings-field">
            <label for="settings-email-field">Email</label>
            <input type="email" id="settings-email-field" readonly>
          </div>
          <div class="actions"><button class="ghost" id="settings-save-profile" type="button" data-i18n="save">Save</button><span class="fine" id="settings-save-msg" role="status"></span></div>
        </div>
        <div class="settings-card" id="set-appearance">
          <h3 data-i18n="settingsAppearance">Appearance</h3>
          <p class="fine" data-i18n="settingsAppearanceCopy">Choose how Trinetra looks on this device.</p>
          <div class="settings-row">
            <span class="field-label" data-i18n="settingsTheme">Theme</span>
            <div class="seg" id="theme-seg">
              <button type="button" data-mode="light" data-i18n="themeLight">Light</button>
              <button type="button" data-mode="dark" data-i18n="themeDark">Dark</button>
              <button type="button" data-mode="system" data-i18n="themeSystem">System</button>
            </div>
          </div>
          <button class="theme" id="theme-toggle" type="button" hidden><span>☾</span><span id="theme-label">Night</span></button>
        </div>
        <div class="settings-card" id="set-language">
          <h3 data-i18n="settingsLanguage">Language</h3>
          <p class="fine" data-i18n="settingsLanguageCopy">Pick the language for menus and the checker.</p>
          <select id="language-select" aria-label="Language" class="ghost" style="width:100%">
            <option value="en">English</option><option value="hi">हिन्दी</option><option value="ta">தமிழ்</option><option value="mr">मराठी</option><option value="gu">ગુજરાતી</option><option value="bn">বাংলা</option><option value="kn">ಕನ್ನಡ</option><option value="te">తెలుగు</option><option value="ml">മലയാളം</option><option value="pa">ਪੰਜਾਬੀ</option><option value="or">ଓଡ଼ିଆ</option><option value="ur">اردو</option>
          </select>
        </div>
        <div class="settings-card" id="set-notifications">
          <h3 data-i18n="settingsNotifications">Notifications</h3>
          <p class="fine" data-i18n="settingsNotificationsCopy">On-screen preferences, saved in this browser only.</p>
          <div class="settings-row"><span class="field-label" data-i18n="notifScamAlerts">Scam alerts</span><label class="switch"><input type="checkbox" id="notif-scam" checked><span class="slider"></span></label></div>
          <div class="settings-row"><span class="field-label" data-i18n="notifEduReminders">Educational reminders</span><label class="switch"><input type="checkbox" id="notif-edu" checked><span class="slider"></span></label></div>
          <div class="settings-row"><span class="field-label" data-i18n="notifReportUpdates">Report updates</span><label class="switch"><input type="checkbox" id="notif-report" checked><span class="slider"></span></label></div>
        </div>
        <div class="settings-card acct-only" id="set-privacy">
          <h3 data-i18n="settingsPrivacy">Privacy</h3>
          <p class="fine" data-i18n="settingsPrivacyCopy">Typed text and screenshots are read only in this browser and never uploaded. Your check history is stored locally here too.</p>
          <details class="acad-item" style="margin-bottom:12px"><summary>Data processing information</summary><div class="acad-body">
            <ul><li><b>What is processed:</b> the message text or screenshot you submit, so the checker can look for scam signals.</li>
            <li><b>Where:</b> entirely in this browser. Text and screenshots are not uploaded to any server (screenshot text is read on your device with OCR).</li>
            <li><b>What is stored:</b> your account (email and a salted password hash), a short excerpt of each check, and your preferences — all in this browser's local storage.</li>
            <li><b>Who can see it:</b> only you on this device; the administrator account can view check summaries in the dashboard.</li>
            <li><b>Your control:</b> clear history, clear stored data, export or delete your account below at any time.</li></ul></div></details>
          <div class="settings-row"><span class="field-label" data-i18n="privacyClearHistory">Clear my check history</span><button class="danger-btn" id="privacy-clear-history" type="button" data-i18n="clear">Clear</button></div>
          <div class="settings-row"><span class="field-label" data-i18n="privacyClearData">Clear all my stored data</span><button class="danger-btn" id="privacy-clear-data" type="button" data-i18n="clear">Clear</button></div>
        </div>
        <div class="settings-card acct-only" id="set-security">
          <h3 data-i18n="settingsSecurity">Security</h3>
          <p class="fine" data-i18n="settingsSecurityCopy">Manage your password and session.</p>
          <div class="settings-field">
            <label for="settings-cur-pw" data-i18n="pwCurrentL">Current password</label>
            <div class="pwrap"><input id="settings-cur-pw" type="password" autocomplete="current-password"><button type="button" class="pw-toggle" data-target="settings-cur-pw" aria-label="Show password">👁</button></div>
          </div>
          <div class="settings-field">
            <label for="settings-new-pw" data-i18n="pwNewL">New password</label>
            <div class="pwrap"><input id="settings-new-pw" type="password" autocomplete="new-password"><button type="button" class="pw-toggle" data-target="settings-new-pw" aria-label="Show password">👁</button></div>
          </div>
          <p class="err" id="settings-pw-err" role="alert"></p>
          <button class="primary" id="settings-change-pw" type="button" data-i18n="pwChange">Change password</button>
          <div class="settings-row"><span class="field-label">Forgot password?<span class="row-copy">Set a new password without the old one.</span></span><button class="ghost" id="forgot-toggle" type="button">Reset</button></div>
          <div id="forgot-box" hidden>
            <div class="settings-field"><label for="forgot-new">New password</label><div class="pwrap"><input id="forgot-new" type="password" autocomplete="new-password"><button type="button" class="pw-toggle" data-target="forgot-new" aria-label="Show password">👁</button></div></div>
            <div class="settings-field"><label for="forgot-new2">Confirm new password</label><div class="pwrap"><input id="forgot-new2" type="password" autocomplete="new-password"><button type="button" class="pw-toggle" data-target="forgot-new2" aria-label="Show password">👁</button></div></div>
            <p class="err" id="forgot-err" role="alert"></p>
            <button class="primary" id="forgot-save" type="button">Reset password</button>
            <p class="fine">Accounts are stored only in this browser, so there is no email reset. You must be signed in on this device.</p>
          </div>
          <div class="settings-row"><span class="field-label" data-i18n="settingsSignOut">Sign out of Trinetra</span><button class="ghost" id="settings-signout" type="button" data-i18n="signOut">Sign out</button></div>
        </div>
        <div class="settings-card acct-only" id="set-account">
          <h3 data-i18n="settingsAccount">Data</h3>
          <p class="fine" data-i18n="settingsDataCopy">Export or remove the data Trinetra keeps for your account.</p>
          <div class="settings-row"><span class="field-label" data-i18n="dataExport">Export my data</span><button class="ghost" id="data-export" type="button" data-i18n="dataExportBtn">Export</button></div>
          <div class="settings-row"><span class="field-label" data-i18n="dataDeleteHistory">Delete history</span><button class="danger-btn" id="data-delete-history" type="button" data-i18n="clear">Clear</button></div>
          <div class="settings-row"><span class="field-label" data-i18n="dataDeleteAccount">Delete my account</span><button class="danger-btn" id="data-delete-account" type="button" data-i18n="dataDeleteAccountBtn">Delete account</button></div>
        </div>
      </div>
    </div>
    </section>
    </div>`;

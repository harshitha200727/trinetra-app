/* Component: auth — markup is mounted into index.html by src/mount.js */
(window.FV_COMPONENTS = window.FV_COMPONENTS || {})["auth"] = `<div id="auth" class="authwrap" hidden>
    <div class="panel authbox">
      <span class="brand"><span class="brand-logo" role="img" aria-label="Trinetra logo"></span><span class="brand-word">Trinetra</span></span>
      <h2 data-i18n="authTitle">Sign in to Trinetra</h2>
      <p class="fine" data-i18n="authSub"></p>
      <div id="a-main">
      <div class="tabs2"><button class="ghost on" id="a-in" type="button" data-i18n="tabIn">Sign in</button><button class="ghost" id="a-up" type="button" data-i18n="tabUp">Create account</button></div>
      <label for="a-email" data-i18n="emailL">Email</label><input id="a-email" type="email" autocomplete="username">
      <label for="a-pw" data-i18n="pwL">Password</label><div class="pwrap"><input id="a-pw" type="password" autocomplete="current-password"><button type="button" class="pw-toggle" data-target="a-pw" aria-label="Show password">👁</button></div>
      <div class="forgot-row" id="a-forgot-row"><button type="button" class="linkbtn" id="a-forgot" data-i18n="forgotLink">Forgot password?</button></div>
      <p class="okmsg" id="a-ok" role="status"></p>
      <div id="a-cw" hidden><label for="a-pw2" data-i18n="pw2L">Confirm password</label><div class="pwrap"><input id="a-pw2" type="password" autocomplete="new-password"><button type="button" class="pw-toggle" data-target="a-pw2" aria-label="Show password">👁</button></div></div>
      <p class="err" id="a-err" role="alert"></p>
      <div class="actions"><button class="primary" id="a-submit" type="button"></button>
        <select id="auth-lang" aria-label="Language" class="ghost"><option value="en">English</option><option value="hi">हिन्दी</option><option value="ta">தமிழ்</option><option value="mr">मराठी</option><option value="gu">ગુજરાતી</option><option value="bn">বাংলা</option><option value="kn">ಕನ್ನಡ</option><option value="te">తెలుగు</option><option value="ml">മലയാളം</option><option value="pa">ਪੰਜਾਬੀ</option><option value="or">ଓଡ଼ିଆ</option><option value="ur">اردو</option></select></div>
      <p class="fine" data-i18n="authHint"></p>
      </div>
      <div id="a-reset" hidden>
        <h3 class="reset-title" data-i18n="resetTitle">Reset your password</h3>
        <p class="fine" data-i18n="resetSub">Enter your account email and choose a new password.</p>
        <label for="r-email" data-i18n="emailL">Email</label><input id="r-email" type="email" autocomplete="username">
        <label for="r-pw" data-i18n="pwNewL">New password</label><div class="pwrap"><input id="r-pw" type="password" autocomplete="new-password"><button type="button" class="pw-toggle" data-target="r-pw" aria-label="Show password">👁</button></div>
        <label for="r-pw2" data-i18n="pw2L">Confirm password</label><div class="pwrap"><input id="r-pw2" type="password" autocomplete="new-password"><button type="button" class="pw-toggle" data-target="r-pw2" aria-label="Show password">👁</button></div>
        <p class="err" id="r-err" role="alert"></p>
        <div class="actions"><button class="primary" id="r-submit" type="button" data-i18n="resetBtn">Reset password</button><button class="linkbtn" id="r-back" type="button" data-i18n="backToSignIn">Back to sign in</button><select id="r-lang" aria-label="Language" class="ghost"><option value="en">English</option><option value="hi">हिन्दी</option><option value="ta">தமிழ்</option><option value="mr">मराठी</option><option value="gu">ગુજરાતી</option><option value="bn">বাংলা</option><option value="kn">ಕನ್ನಡ</option><option value="te">తెలుగు</option><option value="ml">മലയാളം</option><option value="pa">ਪੰਜਾਬੀ</option><option value="or">ଓଡ଼ିଆ</option><option value="ur">اردو</option></select></div>
        <p class="fine" data-i18n="resetNote">Accounts are stored only in this browser, so there is no email link. Anyone using this browser can reset a password here.</p>
      </div>
    </div>
  </div>`;

/* Component: landing — public landing page shown to signed-out visitors (mounted into index.html by src/mount.js) */
(window.FV_COMPONENTS = window.FV_COMPONENTS || {})["landing"] = `<div id="landing" class="landing" hidden>
    <header class="land-nav" id="land-nav">
      <div class="land-wrap land-nav-in">
        <button type="button" class="brand land-brand" aria-label="Trinetra, back to top"><span class="brand-logo" role="img" aria-label="Trinetra logo"></span><span class="brand-text"><span class="brand-word">Trinetra</span><span class="brand-tag">See Beyond The Obvious</span></span></button>
        <div class="land-nav-tools">
          <select id="land-lang" class="ghost" aria-label="Language"><option value="en">English</option><option value="hi">हिन्दी</option><option value="ta">தமிழ்</option><option value="mr">मराठी</option><option value="gu">ગુજરાતી</option><option value="bn">বাংলা</option><option value="kn">ಕನ್ನಡ</option><option value="te">తెలుగు</option><option value="ml">മലയാളം</option><option value="pa">ਪੰਜਾਬੀ</option><option value="or">ଓଡ଼ିଆ</option><option value="ur">اردو</option></select>
          <button class="ghost land-icon-btn" id="land-theme" type="button" aria-label="Toggle dark mode">☾</button>
          <button class="ghost" id="land-signin" type="button" data-i18n="tabIn">Sign in</button>
          <button class="primary land-nav-cta" id="land-start-nav" type="button" data-i18n="landStart">Get started</button>
        </div>
      </div>
    </header>

    <section class="land-hero land-wrap">
      <div class="land-hero-copy">
        <span class="land-eyebrow land-in" style="--d:0"><span data-i18n="landEyebrow">Scam checker for everyday messages</span></span>
        <h1 class="land-title land-in" style="--d:1"><span data-i18n="landTitleA">See beyond</span> <em data-i18n="landTitleB">the obvious.</em></h1>
        <p class="land-lead land-in" style="--d:2" data-i18n="landLead">Paste a message, upload a screenshot or check a link. Trinetra shows the warning signs before you act.</p>
        <div class="land-cta land-in" style="--d:3">
          <button class="primary" id="land-start" type="button"><span data-i18n="landStartFree">Get started free</span> <span aria-hidden="true">→</span></button>
          <button class="ghost" id="land-signin-2" type="button" data-i18n="landHaveAcct">I have an account</button>
        </div>
        <ul class="land-points land-in" style="--d:4">
          <li><span aria-hidden="true">🔒</span> <span data-i18n="landPt1">Runs in your browser</span></li>
          <li><span aria-hidden="true">🌐</span> <span data-i18n="landPt2">12 languages</span></li>
          <li><span aria-hidden="true">✓</span> <span data-i18n="landPt3">Free to use</span></li>
        </ul>
      </div>
      <div class="land-hero-art land-in" style="--d:2">
        <figure class="land-frame">
          <div class="land-frame-bar" aria-hidden="true"><i></i><i></i><i></i></div>
          <img class="only-light" src="assets/landing/home-light.webp" width="1600" height="1000" alt="Trinetra checker with a suspicious bank message pasted in">
          <img class="only-dark" src="assets/landing/home-dark.webp" width="1600" height="1000" alt="Trinetra checker with a suspicious bank message pasted in" loading="lazy">
        </figure>
        <div class="land-float" aria-hidden="true"><span class="land-float-dot"></span><span><b data-i18n="landFloatT">Critical risk</b><small>96 / 100</small></span></div>
      </div>
    </section>

    <section class="land-steps land-wrap" aria-labelledby="land-steps-h">
      <h2 class="land-kicker reveal" id="land-steps-h" data-i18n="howItWorks">How it works</h2>
      <ol class="land-step-list">
        <li class="land-step reveal" style="--d:0"><span class="land-step-n">1</span><b data-i18n="landS1">Paste or upload</b><span data-i18n="landS1d">A message, screenshot, link or QR code.</span></li>
        <li class="land-step reveal" style="--d:1"><span class="land-step-n">2</span><b data-i18n="landS2">See the risk</b><span data-i18n="landS2d">A score with every warning sign explained.</span></li>
        <li class="land-step reveal" style="--d:2"><span class="land-step-n">3</span><b data-i18n="landS3">Act safely</b><span data-i18n="landS3d">Clear next steps, like where to report it.</span></li>
      </ol>
    </section>

    <section class="land-features land-wrap" aria-label="Features">
      <article class="land-feat reveal">
        <div class="land-feat-copy">
          <span class="land-kicker" data-i18n="landF1k">Check</span>
          <h3 data-i18n="landF1">One place for every kind of message</h3>
          <p data-i18n="landF1d">Switch between text, screenshots and links or QR codes in a tap.</p>
        </div>
        <figure class="land-shot">
          <img class="only-light" src="assets/landing/modes-light.webp" width="1000" height="384" alt="Checker tabs for Message, Screenshot and Link or QR" loading="lazy">
          <img class="only-dark" src="assets/landing/modes-dark.webp" width="1000" height="384" alt="Checker tabs for Message, Screenshot and Link or QR" loading="lazy">
        </figure>
      </article>
      <article class="land-feat land-feat-flip reveal">
        <div class="land-feat-copy">
          <span class="land-kicker" data-i18n="landF2k">Understand</span>
          <h3 data-i18n="landF2">Know exactly why it looks risky</h3>
          <p data-i18n="landF2d">A Risk Indicator Score, the warning signs it found and what to do next.</p>
        </div>
        <figure class="land-shot">
          <img class="only-light" src="assets/landing/result-light.webp" width="1000" height="890" alt="A Critical risk result with score 96 and the warning signs found" loading="lazy">
          <img class="only-dark" src="assets/landing/result-dark.webp" width="1000" height="890" alt="A Critical risk result with score 96 and the warning signs found" loading="lazy">
        </figure>
      </article>
      <article class="land-feat reveal">
        <div class="land-feat-copy">
          <span class="land-kicker" data-i18n="landF3k">Track</span>
          <h3 data-i18n="landF3">Your checks, at a glance</h3>
          <p data-i18n="landF3d">The dashboard keeps your history and shows how risky your messages were.</p>
        </div>
        <figure class="land-shot">
          <img class="only-light" src="assets/landing/dash-light.webp" width="1600" height="1000" alt="Trinetra dashboard with check totals by risk level" loading="lazy">
          <img class="only-dark" src="assets/landing/dash-dark.webp" width="1600" height="1000" alt="Trinetra dashboard with check totals by risk level" loading="lazy">
        </figure>
      </article>
    </section>

    <section class="land-final land-wrap reveal">
      <h2 data-i18n="landFinal">Pause before you click.</h2>
      <p data-i18n="landFinalD">Create a free account and check your first message.</p>
      <button class="primary" id="land-start-2" type="button"><span data-i18n="landStartFree">Get started free</span> <span aria-hidden="true">→</span></button>
    </section>

    <footer class="land-foot land-wrap">
      <span data-i18n="landFoot1">Trinetra shows warning signs only. It cannot confirm a message is genuine.</span>
      <span data-i18n="landFoot2">Report cybercrime in India: cybercrime.gov.in or call 1930.</span>
    </footer>
  </div>`;

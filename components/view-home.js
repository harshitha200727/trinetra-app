/* Component: view-home — markup is mounted into index.html by src/mount.js */
(window.FV_COMPONENTS = window.FV_COMPONENTS || {})["view-home"] = `<div id="view-home">
    <section class="sw-hero home2" id="top">
      <p class="greet"><span id="greet" data-i18n="greetMorning">Good morning</span> 👋</p>
      <h1 class="hero-title" data-i18n="swTitle">What did you receive?</h1>
      <p class="hero-copy" data-i18n="heroSub">Trinetra helps you understand suspicious messages and identify potential scam warning signs before you act on them.</p>
      <p class="hero-support fine" data-i18n="heroSupport">Paste a message or upload a screenshot. Trinetra examines the available information, highlights potential warning signs, explains why they matter, and suggests safer next steps.</p>

      <section class="panel sw-card" id="checker">
        <div class="mode-tabs" role="tablist" aria-label="Check type">
          <button type="button" role="tab" class="mode-tab on" data-mode="message" aria-selected="true"><span aria-hidden="true">💬</span> <span data-i18n="typeMessage">Message</span></button>
          <button type="button" role="tab" class="mode-tab" data-mode="shot" aria-selected="false"><span aria-hidden="true">📷</span> <span data-i18n="typeScreenshot">Screenshot</span></button>
          <button type="button" role="tab" class="mode-tab" data-mode="link" aria-selected="false"><span aria-hidden="true">🔗</span> <span data-i18n="tabLinkQr">Link / QR</span></button>
        </div>

        <div class="mode-pane" id="pane-message">
          <textarea id="message" data-i18n-placeholder="placeholder" placeholder="Paste the suspicious message here..."></textarea>
          <div class="char-count fine" id="char-count" aria-live="off">0</div>
          <div class="actions"><button class="ghost" id="clear-button" type="button" data-i18n="clear">Clear</button><button class="primary" id="check-button" type="button">🔍 <span data-i18n="scanBtn">Scan with Trinetra</span></button><input type="file" id="file-input" accept="image/*" hidden></div>
        </div>

        <div class="mode-pane" id="pane-shot" hidden>
          <button type="button" class="drop-zone" id="shot-button"><span class="pick-ic">📷</span><span class="pick-name" data-i18n="shotUploadTitle">Upload a screenshot</span><span class="pick-desc" data-i18n="shotUploadHint">Drag &amp; drop or choose an image</span><span class="drop-btn" data-i18n="shotUploadBtn">Choose Screenshot</span></button>
          <img id="thumb" class="thumb" alt="" hidden>
          <p class="fine" id="status" role="status"></p>
          <div class="actions"><button class="ghost" id="shot-clear" type="button" data-i18n="clear">Clear</button></div>
        </div>

        <div class="mode-pane" id="pane-link" hidden>
          <div class="sub-seg" role="tablist" aria-label="Link or QR">
            <button type="button" class="sub-tab on" data-sub="link" role="tab" aria-selected="true"><span aria-hidden="true">🔗</span> <span data-i18n="subLink">Suspicious Link</span></button>
            <button type="button" class="sub-tab" data-sub="qr" role="tab" aria-selected="false"><span aria-hidden="true">▣</span> <span data-i18n="subQr">QR Code</span></button>
          </div>
          <div id="sub-link">
            <input type="text" id="url-input" class="url-input" autocomplete="off" autocapitalize="off" spellcheck="false" data-i18n-placeholder="urlPlaceholder" placeholder="Paste the suspicious link here..." aria-label="Link to check">
            <p class="fine url-err" id="url-err" role="alert"></p>
            <div class="actions"><button class="ghost" id="url-clear-btn" type="button" data-i18n="clear">Clear</button><button class="primary" id="url-check-btn" type="button">🔗 <span data-i18n="scanBtn">Scan with Trinetra</span></button></div>
          </div>
          <div id="sub-qr" hidden>
            <button type="button" class="drop-zone" id="qr-button"><span class="pick-ic">▣</span><span class="pick-name" data-i18n="qrDropTitle">Upload a QR code</span><span class="pick-desc" data-i18n="qrDropHint">Drag &amp; drop or choose an image of the QR code. It is decoded on your device.</span><span class="drop-btn" data-i18n="qrBtn">Choose QR image</span></button>
            <input type="file" id="qr-input" accept="image/*" hidden>
            <p class="fine" id="qr-status" role="status"></p>
            <div class="actions"><button class="ghost" id="qr-clear" type="button" data-i18n="clear">Clear</button></div>
          </div>
        </div>
        <div class="safety"><b>♢</b><span data-i18n="safety"></span></div>
      </section>

      <section class="panel" id="result-panel" aria-live="polite"></section>
      <section class="panel" id="url-result" aria-live="polite" hidden></section>

      <ul class="trust-strip" aria-label="Safety">
        <li><span aria-hidden="true">🔒</span> <span data-i18n="trust1">Safe checking</span></li>
        <li><span aria-hidden="true">⚡</span> <span data-i18n="trust2">Quick analysis</span></li>
        <li><span aria-hidden="true">🛡</span> <span data-i18n="trust3">Suspicious links are never opened automatically</span></li>
      </ul>

      <div class="examples-block" id="examples-wrap">
        <h2 class="home-h" data-i18n="tryExample">Try an example</h2>
        <div class="chips" id="ex-msg"><button class="chip example" data-example="bank" data-i18n="exBank">Bank KYC Scam</button><button class="chip example" data-example="prize" data-i18n="exPrize">Prize Scam</button><button class="chip example" data-example="job" data-i18n="exJob">Job Scam</button><button class="chip example" data-example="otp" data-i18n="exOtp">Genuine OTP</button></div>
        <div class="chips" id="ex-link" hidden><button class="chip url-ex" type="button" data-uex="short" data-i18n="urlExShort">Short link</button><button class="chip url-ex" type="button" data-uex="bank" data-i18n="urlExBank">Fake bank</button><button class="chip url-ex" type="button" data-uex="apk" data-i18n="urlExApk">App download</button><button class="chip url-ex" type="button" data-uex="safe" data-i18n="urlExSafe">Normal site</button></div>
      </div>

      <section class="home-sec" id="recent">
        <div class="home-sec-head"><h2 class="home-h" data-i18n="recentTitle">Recent checks</h2><button class="linkbtn" type="button" data-view="history" data-auth="1" data-i18n="viewAll">View all →</button></div>
        <div id="recent-list" class="recent-list"></div>
      </section>

      <section class="home-sec" id="how">
        <h2 class="home-h" data-i18n="howTitle">How Trinetra helps</h2>
        <ol class="how-list">
          <li><span class="how-n">1</span><div><b data-i18n="how1T">Find warning signs</b><p data-i18n="how1D">Identify suspicious words, requests and patterns.</p></div></li>
          <li><span class="how-n">2</span><div><b data-i18n="how2T">Understand the risk</b><p data-i18n="how2D">Get a clear risk level with the warning signs behind it.</p></div></li>
          <li><span class="how-n">3</span><div><b data-i18n="how3T">Know what to do</b><p data-i18n="how3D">Receive practical safety advice.</p></div></li>
        </ol>
      </section>
    </section>
    </div>`;

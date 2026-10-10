/* Component: view-history — markup is mounted into index.html by src/mount.js */
(window.FV_COMPONENTS = window.FV_COMPONENTS || {})["view-history"] = `<div id="view-history" hidden>
    <section class="section">
      <div class="page-head"><div class="kicker" data-i18n="navHistory">Check History</div><h2 data-i18n="historyTitle">Your past checks</h2></div>
      <section class="panel">
        <div class="placeholder-page" id="history-empty">
          <div class="ph-icon">📋</div>
          <h2 data-i18n="emptyHistoryTitle">No checks yet</h2>
          <p data-i18n="emptyHistoryCopy">Your previous scam checks will appear here.</p>
          <button class="primary" id="history-empty-btn" type="button" data-i18n="checkAMessageBtn">Check a Message</button>
        </div>
        <div id="history-filters">
          <input type="search" id="hist-q" data-i18n-placeholder="dsSearch" placeholder="Search messages or IDs…" aria-label="Search" style="width:100%;border:1px solid var(--line);border-radius:12px;padding:11px 12px;background:var(--cream);color:var(--ink);font:inherit;margin-bottom:14px">
          <div class="hist-filter-row"><span class="hist-filter-label" data-i18n="filterRisk">Risk</span>
            <button class="hist-filter on" type="button" data-risk="all" data-i18n="filterAll">All</button>
            <button class="hist-filter" type="button" data-risk="safe" data-i18n="safe">Low risk</button>
            <button class="hist-filter" type="button" data-risk="suspicious" data-i18n="suspicious">Suspicious</button>
            <button class="hist-filter" type="button" data-risk="high" data-i18n="high">High risk</button>
            <button class="hist-filter" type="button" data-risk="critical" data-i18n="critical">Critical risk</button>
          </div>
          <div class="hist-filter-row"><span class="hist-filter-label" data-i18n="filterType">Check type</span>
            <button class="hist-filter on" type="button" data-type="all" data-i18n="filterAll">All</button>
            <button class="hist-filter" type="button" data-type="text" data-i18n="typeMessage">Message</button>
            <button class="hist-filter" type="button" data-type="screenshot" data-i18n="typeScreenshot">Screenshot</button>
            <button class="hist-filter" type="button" data-type="url" data-i18n="typeUrl">URL</button>
            <button class="hist-filter" type="button" data-type="qr" data-i18n="typeQr">QR</button>
          </div>
          <div class="scroll" id="history-table" style="margin-top:14px"></div>
          <div class="actions" style="margin-top:14px"><button class="danger-btn" id="history-clear" type="button" data-i18n="clearMyHistory">Clear my history</button></div>
        </div>
      </section>
    </section>
    </div>`;

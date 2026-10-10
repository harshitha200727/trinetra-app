/* Component: view-dash — markup is mounted into index.html by src/mount.js */
(window.FV_COMPONENTS = window.FV_COMPONENTS || {})["view-dash"] = `<div id="view-dash" hidden>
    <section class="section" id="dashboard">
      <div class="kicker" data-i18n="dashKicker">Risk dashboard</div>
      <h2 data-i18n="dashActivity">Your checking activity</h2>
      <p class="section-copy" data-i18n="dashCopy"></p>
      <p class="fine" id="d-scope"></p>
      <div class="tiles" id="d-tiles"></div>
      <div class="panel-label dash-h" data-i18n="dashOverview">Risk overview</div>
      <div class="dgrid">
        <section class="panel"><div class="panel-label" data-i18n="byLevel">Results</div><div id="d-level"></div><div class="panel-label" style="margin-top:22px" data-i18n="byScore">Score ranges</div><div id="d-score"></div></section>
        <section class="panel"><div class="panel-label" data-i18n="bySource">Where messages came from</div><div id="d-source"></div><div class="panel-label" style="margin-top:22px" data-i18n="byCat">Most common warning signs</div><div id="d-cat"></div></section>
      </div>
      <section class="panel" style="margin-top:18px"><div class="panel-label" data-i18n="recent">Recent checks</div><div class="scroll" id="d-recent"></div>
        <div class="actions" id="d-actions" hidden><button class="ghost" id="d-export" type="button" data-i18n="exportCsv">Download CSV</button><button class="ghost" id="d-clear" type="button" data-i18n="clearLog">Clear log</button></div></section>
      <details class="calc-fold"><summary data-i18n="calcTitle">How the Risk Indicator Score works</summary>
      <section class="panel" style="margin-top:18px">
        <p class="section-copy" data-i18n="calcCopy" style="margin:10px 0"></p>
        <p class="fine"><b data-i18n="calcFormula">Score = category points (capped) + combination bonus</b></p><p class="fine" data-i18n="calcLevels"></p>
        <div id="d-calc" style="margin-top:12px"></div></section>
      </details>
      <section class="panel" id="d-usersP" style="margin-top:18px" hidden><div class="panel-label" data-i18n="usersTitle">Registered users</div><div class="scroll" id="d-users"></div></section>
      <p class="fine" data-i18n="dataNote" style="margin-top:16px"></p>
    </section>
    </div>`;

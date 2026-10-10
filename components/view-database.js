/* Component: view-database — markup is mounted into index.html by src/mount.js */
(window.FV_COMPONENTS = window.FV_COMPONENTS || {})["view-database"] = `<div id="view-database" hidden>
    <section class="section">
      <div class="page-head"><div class="kicker" data-i18n="navDatabase">Scam Database</div></div>
      <section class="panel" id="dataset" style="margin-top:0">
        <div class="panel-label" data-i18n="dsTitle">Scam message dataset</div>
        <p class="section-copy" data-i18n="dsCopy" style="margin:10px 0"></p>
        <div class="tiles" id="ds-tiles"></div>
        <div class="dgrid">
          <div><div class="panel-label" data-i18n="dsByLang">Messages by language</div><div id="ds-lang"></div></div>
          <div><div class="panel-label" data-i18n="dsByRisk">Messages by result</div><div id="ds-risk"></div></div>
        </div>
        <div class="dsfilters">
          <input type="search" id="ds-q" data-i18n-placeholder="dsSearch" placeholder="Search messages or IDs…" aria-label="Search">
          <select id="ds-f-lang" class="ghost" aria-label="Language"></select>
          <select id="ds-f-risk" class="ghost" aria-label="Result"></select>
          <select id="ds-f-type" class="ghost" aria-label="Type"></select>
        </div>
        <div class="scroll" id="ds-table"></div>
        <div class="actions" id="ds-pager"></div>
      </section>
      <section class="panel placeholder-page" id="db-noaccess" hidden>
        <div class="ph-icon">🔒</div>
        <p data-i18n="dbNoAccess">The full scam-message dataset browser is available to the administrator account only.</p>
      </section>
    </section>
    </div>`;

# Trinetra — See Beyond The Obvious

Trinetra helps you understand suspicious messages and spot potential scam warning signs before you act on them.
Paste a message, upload a screenshot, or check a link / QR code. Trinetra highlights warning signs, explains why they matter and suggests safer next steps.

It is a **rule-based** checker (no machine learning, no external AI service). The *Risk Indicator Score* shows how many and how strong the warning signs are. It is **not** the probability that something is a scam, and "Low risk" never means a message is genuine.

## Run it

No build step is needed.

- **Quickest:** double-click `index.html`.
- **Local server (recommended):** `npm start` (or `python3 -m http.server 5173`) and open http://localhost:5173
- **Sanity check:** `npm run check` verifies every script listed in `index.html` exists and parses.

Everything runs in the browser. Accounts, history and settings are stored in this browser only (localStorage). Typed text and screenshots are analysed locally; screenshot text reading uses Tesseract.js, which is downloaded from a CDN the first time (internet needed once).

## Project structure

```
index.html               Page shell: placeholders for components + script order
manifest.webmanifest     Web app manifest (name, colours, icon)
css/
  styles.css             All styles: layout, components, light/dark theme, risk levels
components/              HTML markup, one file per UI piece (mounted by src/mount.js)
  auth.js  topbar.js  header.js  sidebar.js  sidebar-backdrop.js  bottom-nav.js
  view-home.js  view-dash.js  view-history.js  view-report.js
  view-academy.js  view-settings.js  view-database.js
lib/
  risk-engine.js         Risk Indicator Score engine (categories, severities, combinations)
  jsQR.js                QR decoder (MIT licence), loaded on demand
src/
  mount.js               Injects components into index.html
  main.js                Entry point
  core/dom.js            Language state and DOM helpers
  detection/rules.js     Keyword lists and detection rules
  i18n/                  English / Hindi / Tamil text (copy-*.js)
  checker/               message, screenshot (OCR), URL / QR checkers, mode tabs
  auth/                  accounts, sign-in, forgot password
  dashboard/             check log, dashboard, check cards
  history/               check history
  settings/              settings, privacy, data export / delete
  app/                   boot, navigation
  ui/dialogs.js          in-page confirm / alert dialogs
  dataset/explorer.js    Scam Database (admin only) and "similar messages" matcher
data/dataset.js          Labelled example messages in 12 languages
assets/                  Logos (light and dark)
scripts/check.js         Syntax / file sanity check
```

### Script order matters
The files are classic scripts (not ES modules) that share one global scope, so the app works from `file://` as well as from a server. `index.html` loads them in dependency order: data → components → `mount.js` → core → engine → features → entry point. If you add a file, add its `<script>` tag in the right place.

## Risk Indicator Score (summary)

| Score | Level |
|---|---|
| 0–19 | Low risk |
| 20–49 | Suspicious |
| 50–74 | High risk |
| 75–100 | Critical risk |

Seven weighted categories (urgency 10, financial request 20, sensitive information 20, link/contact 15, unrealistic claim 15, impersonation 10, scam pattern 10) with per-category caps, indicator severities, and a few controlled combination bonuses. Weights live in `RISK_CATS` in `lib/risk-engine.js`. The admin account sees an internal breakdown on each result.

## Admin
The account registered with the admin e-mail (see `ADMIN` in `src/auth/accounts.js`) can see the Scam Database, all users' statistics and the developer breakdown. This is a client-side demo only and is **not** real access control: move authentication and data to a backend before real use.

## Known limitations
- Rule-based keyword/regex detection: it will miss some scams and may flag some genuine messages.
- Strong keyword coverage only for English, Hindi and Tamil; other scripts get a minimum "Suspicious" rating rather than "Low risk".
- Accounts and history live in localStorage; clearing browser data removes them.
- Trinetra cannot confirm that a message is genuine and does not replace your bank, the police or professional security tools. To report cybercrime in India: cybercrime.gov.in or call 1930.

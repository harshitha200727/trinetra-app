# Trinetra – See Beyond The Obvious

Trinetra helps you understand suspicious messages and identify potential scam warning signs before you act on them.

Paste a message, upload a screenshot, or check a link or QR code. Trinetra explains **why** it looks risky, in plain language, and tells you what to do next.

> **Verification → Awareness → Safety**

---

## Features

- **Message checker:** paste an SMS, WhatsApp or email text and get a risk level with reasons.
- **Screenshot checker:** reads text from a screenshot (OCR) and analyses it.
- **Link and QR checker:** looks for suspicious URL patterns, lookalike domains and risky shorteners.
- **Risk Indicator Score (0–100):** a category-weighted score that maps to Low, Suspicious, High and Critical risk. It is a **risk indicator, not a probability**.
- **Clear explanations:** every result lists the warning signs that were found.
- **Multilingual:** English, Hindi (हिन्दी) and Tamil (தமிழ்).
- **Scam awareness:** an Academy section with common scam types and safety tips.
- **History and reports:** keep past checks and report scams.
- **Light and dark themes**, responsive on phone and desktop.

## How the score works

Trinetra checks a message against seven categories and combines them:

| Category | Weight |
| --- | --- |
| Urgency and pressure | 10 |
| Financial requests | 20 |
| Sensitive information requests | 20 |
| Suspicious links | 15 |
| Unrealistic offers | 15 |
| Impersonation | 10 |
| Known scam patterns | 10 |

Each category has a cap, and certain combinations of signals add a bonus. Strong combinations set a minimum level, for example a financial request plus a link plus urgency can never be rated Low.

## Important note

Trinetra uses **rules, not a trained AI model**. It can miss new scams and can flag harmless messages. It is an awareness aid, not a guarantee of safety.

- Never share OTPs, PINs or passwords.
- Verify through the official app or website, not through links in messages.
- Report fraud to **1930** (India's cybercrime helpline) or at [cybercrime.gov.in](https://cybercrime.gov.in).

---

## Getting started

### Requirements
- [Node.js](https://nodejs.org) LTS (only needed to run the local server)

### Run locally
```bash
npm run check   # verifies all project files are present
npm start       # serves the app at http://localhost:5173
```

You can also open `index.html` directly in a browser. A local server is recommended.

### Deploy
Trinetra is a static site, so there is no build step. On [Vercel](https://vercel.com), import this repository and deploy with the default settings.

---

## Project structure

```
trinetra-app/
├── index.html          # app shell
├── css/                # styles
├── components/         # HTML pieces (sidebar, header, views)
├── lib/                # risk engine, jsQR (QR decoding)
├── src/
│   ├── detection/      # scam rules
│   ├── checker/        # message, screenshot and link checkers
│   ├── auth/           # accounts (demo)
│   ├── dashboard/      # dashboard
│   ├── history/        # check history
│   ├── settings/       # settings and account data
│   ├── i18n/           # English, Hindi and Tamil text
│   ├── app/            # boot and navigation
│   └── ui/             # dialogs
├── data/               # scam dataset
├── assets/             # logos
└── scripts/check.js    # file check
```

## Current limitations

- Sign-in and history are stored in the browser (`localStorage`). This is for demo use only and is **not secure** for real accounts.
- Screenshot OCR loads Tesseract.js from a CDN, so it needs an internet connection the first time.
- Detection is strongest in English, Hindi and Tamil.

## Roadmap

- [ ] Real accounts and a database with Supabase (Auth and Postgres with row-level security)
- [ ] Cloud-saved history and a shared scam-report database
- [ ] Admin dashboard for reviewing reports
- [ ] Custom domain, privacy policy and terms
- [ ] More languages and improved detection rules

## Author

Built by **Harshitha C**.

## License

All rights reserved. Not licensed for reuse without permission.

# VitaLink — One link. Better health.

A working web-app prototype built to your brand guide (Concept 1: Heart Link, full color palette).

## Run it

```bash
cd VitaLink
npm start
```

Then open http://localhost:3000

Zero npm install needed — the server is pure Node stdlib.

## What's in the prototype

- **/** — Marketing landing page (hero, features, how-it-works, CTA band, footer)
- **/pages/onboarding.html** — Signup flow with brand-styled form
- **/pages/dashboard.html** — Health snapshot with vitals, weekly activity chart, upcoming appointments/meds
- **/pages/records.html** — Filterable list of labs, prescriptions, imaging, visit notes
- **/pages/providers.html** — Connected doctors, pharmacies, and time-limited sharing links
- **/pages/wellness.html** — Movement/sleep/hydration rings + habit tracker

Every page uses your exact color tokens defined once in `public/assets/styles.css`.

## File layout

```
VitaLink/
├── server.js           # 40-line static server, no deps
├── package.json
└── public/
    ├── index.html
    ├── assets/
    │   ├── styles.css  # brand tokens + all components
    │   ├── app.js      # shared sidebar renderer
    │   ├── logo.svg    # Concept 1 (Heart Link)
    │   └── favicon.svg
    └── pages/
        ├── onboarding.html
        ├── dashboard.html
        ├── records.html
        ├── providers.html
        └── wellness.html
```

## Straight talk on marketplace viability

You asked for a viable app — here's what actually stands between this prototype and being on the App Store making money.

**The good:** the "aggregate my health data" niche has real demand and the design bar is well within reach. Your brand identity is already stronger than a lot of shipping health apps.

**The hard parts, roughly in order:**
1. **Data access is the moat.** VitaLink's whole promise ("one link") depends on pulling records from providers. Real solutions use FHIR APIs (SMART on FHIR, Apple HealthKit, Google Health Connect). These are free, but integration is weeks of work per source.
2. **Regulation.** In the US, if you *transmit* PHI on behalf of a provider you're likely a HIPAA "business associate." If users only pull their own data into their own account, you can often stay classified as a personal health record and avoid HIPAA — but that line is thin. Talk to a lawyer before launch, not after.
3. **Competition.** Apple Health, MyChart (Epic), and Healow already exist. Your wedge has to be something they won't do: nicer UX, family caregivers, a specific chronic condition, or teens (an underserved segment).
4. **Monetization for a health app.** Freemium with family plan ($5–10/mo) is the realistic path. Ads on health data are a bad idea legally and reputationally.

**Recommended next step if you want to keep going:**
- Wrap this in [Capacitor](https://capacitorjs.com/) to ship it as an actual iOS/Android app from the same codebase.
- Replace the mock data with Apple HealthKit + Google Health Connect first (biggest wow, easiest integration).
- Add real auth with [Clerk](https://clerk.com/) or [Supabase Auth](https://supabase.com/auth) — both free tiers cover early users.
- Start narrow: pick ONE user (e.g., college students managing ADHD meds, or adult kids managing aging parents) instead of "everyone."

## Extending the prototype

The whole stack is intentionally boring: HTML + CSS + a few lines of vanilla JS. No build step, no framework churn. When you outgrow it, port straight into Next.js — the CSS variables and page structure will move over cleanly.

# Owner Content Checklist

Everything below must come from the business owner. Nothing here should be guessed or invented.
Each item lists the exact file where it will be updated. Tick items off as the information arrives.

> Tip: most single values live in `src/lib/site.ts`. Most lists (services, projects, FAQs…) live in `src/data/`.

---

## 1. Contact information

- [ ] **Business phone number**, both as displayed and in international dial format → `src/lib/site.ts` (`contact.phone`, `contact.phoneHref`)
- [ ] **Business email address** → `src/lib/site.ts` (`contact.email`)
- [ ] **Official Facebook page URL** → `src/lib/site.ts` (`social.facebook`)
- [ ] **Office address**, or confirmation that there is no public office → `src/lib/site.ts` (`contact.address`)
- [ ] **Office hours** → `src/lib/site.ts` (`contact.hours`)
- [ ] **Other contact channels to show, if any** (Messenger, Viber, WhatsApp, Instagram…) → `src/lib/site.ts` (`social`); displayed in `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/quote/QuoteSection.tsx`
- [ ] **Map on the Contact page?** (yes/no, and the exact location) → `src/app/contact/page.tsx`
- [ ] **Response-time promise** (currently "within 1–2 business days") → `src/components/quote/QuoteForm.tsx` (success message), `src/app/contact/page.tsx` (hero intro)
- [ ] **Who receives new quote requests** (email address or addresses for notifications) → environment variable when the form is connected (see `docs/QUOTE_SUBMISSION_PLAN.md`)

## 2. Company information

- [ ] **Exact business / registered name** (confirm "Solar Net Metering Services") → `src/lib/site.ts` (`name`). It also appears in the social image via `scripts/generate-placeholders.mjs` → `public/images/og-image.jpg`
- [ ] **One-sentence description and tagline** (approve or replace) → `src/lib/site.ts` (`description`, `tagline`)
- [ ] **Company story** (who you are, when you started, what you focus on) → `src/components/sections/AboutSection.tsx` (intro text and the four bullet points); `src/app/about/page.tsx` (page intro)
- [ ] **Mission, approach and commitment statements** → `src/app/about/page.tsx` (`values`)
- [ ] **Business registration, contractor or electrical licences, accreditations or memberships** to display, with numbers if required → `src/components/layout/Footer.tsx` and/or `src/app/about/page.tsx`
- [ ] **Owner / team names and roles** (optional) → `src/app/about/page.tsx`
- [ ] **Footer company blurb** (approve or replace) → `src/components/layout/Footer.tsx`

## 3. Services

- [ ] **Confirm the four services**, their titles, one-line summaries and bullet details → `src/data/services.ts` (`services`)
- [ ] **System types actually offered** (grid-tied, hybrid/battery, off-grid, ground-mount, carport) → `src/data/services.ts` (`details`), `src/data/faqs.ts` ("Do I need batteries?")
- [ ] **Maintenance, cleaning and repair offered?** → `src/data/services.ts` (`details`, `serviceOptions`)
- [ ] **Options in the form's "Service Interested In" list** → `src/data/services.ts` (`serviceOptions`)
- [ ] **Property types served** (Residential, Commercial, Industrial, Agricultural, Other) → `src/lib/quote.ts` (`propertyTypes`)
- [ ] **Installation process steps** (confirm the five steps) → `src/data/services.ts` (`installationProcess`)
- [ ] **Equipment brands and warranty terms** (product, performance and workmanship warranty lengths) → `src/data/services.ts`, `src/data/why-choose-us.ts`, `src/components/sections/Hero.tsx`
- [ ] **Is the site assessment free?** → `src/components/sections/Hero.tsx` (highlights), `src/components/quote/QuoteSection.tsx`
- [ ] **Typical installation timelines**, residential and commercial → `src/data/faqs.ts`
- [ ] **Financing or payment terms**, if they should be mentioned → `src/data/faqs.ts` (new FAQ)
- [ ] **Currency for the monthly bill field** → `src/components/quote/QuoteForm.tsx` (label and placeholder)

## 4. Net-metering information

- [ ] **Distribution utility or utilities you work with** → `src/app/net-metering/page.tsx` ("What Is Net Metering?" text), `src/data/faqs.ts`
- [ ] **Exact required-documents checklist** → `src/data/net-metering.ts` (`requiredDocuments`)
- [ ] **Exactly what you handle in the application** → `src/app/net-metering/page.tsx` (`support` list)
- [ ] **Typical approval and meter-installation timeline** → `src/data/faqs.ts`
- [ ] **Application fees and who pays them** → `src/data/faqs.ts` (new FAQ)
- [ ] **Eligibility or system-size limits** → `src/app/net-metering/page.tsx`
- [ ] **Confirm the credit explanation is accurate for your utility** (bill credits, carry-over rules) → `src/data/net-metering.ts` (`netMeteringSteps`), `src/data/faqs.ts` ("What is net metering?"), `src/app/net-metering/page.tsx`

## 5. Project portfolio

For **each** real project → `src/data/projects.ts`:
- [ ] Title
- [ ] Residential or Commercial
- [ ] Location (city/municipality level is enough; no street addresses)
- [ ] System size (kWp)
- [ ] One- or two-sentence description (results only if verified)
- [ ] Photo(s) with the client's permission to publish → `public/images/projects/`
- [ ] A short description of each photo, used as image alt text → `src/data/projects.ts` (`imageAlt`)

Also:
- [ ] **Which three projects to feature on the homepage** (the first three in the list are shown) → order in `src/data/projects.ts`
- [ ] **Remove any placeholder project that isn't replaced**, so only real projects are published.

## 6. Testimonials

For **each** testimonial → `src/data/testimonials.ts`:
- [ ] Exact quote text (verbatim, or approved edits)
- [ ] Name format the client approved (e.g. "Maria S."), role, client type
- [ ] **Written permission** from the client to publish
- [ ] Rating, only if it is real and its source is known (e.g. Facebook reviews). Otherwise the stars are removed → `src/components/sections/Testimonials.tsx`
- [ ] **If there are fewer than three real testimonials**, decide whether to show fewer or hide the section → `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/projects/page.tsx`

## 7. Service areas

- [ ] **List of cities / municipalities / provinces served** → `src/data/service-areas.ts`
- [ ] **Any areas to prioritise for location landing pages** → `src/data/service-areas.ts` (then set `SERVICE_AREA_PAGES_ENABLED`)
- [ ] **Text unique to each area**, if location pages are wanted (local utility, nearby projects) → future `src/app/service-areas/[slug]/page.tsx`

## 8. Business claims and statistics

Every claim below needs a yes / no / reworded answer. Anything not confirmed is removed.

- [ ] **Stats**: "100+ systems installed", "10+ years of experience", "24/7 monitoring support" → `src/lib/site.ts` (`stats`)
- [ ] **Savings examples**: 60% / 75% / 70% bill offset and the system-size ranges → `src/data/benefits.ts` (`savingsExamples`)
- [ ] "Free site assessment", "Quality, warrantied components", "Save from month one" → `src/components/sections/Hero.tsx`
- [ ] "Tier-1 components", "Trained installers and engineers", "We handle the paperwork" → `src/data/why-choose-us.ts`
- [ ] "Transparent proposals with no hidden costs", "After-sales support and system monitoring" → `src/components/sections/AboutSection.tsx`
- [ ] "Higher property value", "Protection from rate increases" → `src/data/benefits.ts` (`benefits`)
- [ ] "No-obligation" quote and proposal → `src/components/quote/QuoteSection.tsx`, `src/components/sections/CtaBanner.tsx`, `src/data/faqs.ts`
- [ ] "Completed by our team" and "Homeowners and businesses trust us" → `src/components/sections/ProjectsSection.tsx`, `src/app/projects/page.tsx`, `src/components/sections/Testimonials.tsx`
- [ ] **Savings disclaimer wording** → `src/components/sections/BenefitsSection.tsx` (`figcaption`)

## 9. Logo and branding

- [ ] **Logo as SVG**: a horizontal version, plus a white/reversed version for the navy footer → replaces the inline mark in `src/components/layout/Logo.tsx`
- [ ] **Square icon mark** for the favicon and phone home screen → `src/app/icon.svg`, `src/app/apple-icon.png`
- [ ] **Exact brand colours** (confirm or correct orange `#f5891f` and navy `#0b1f3a`) → `src/app/globals.css` (`:root` tokens); also `src/app/layout.tsx` (`themeColor`), `src/app/manifest.ts`
- [ ] **Brand fonts**, if there are official ones → `src/app/layout.tsx`
- [ ] **Social share image** (1200×630, or approval to keep the current layout with the real logo) → `public/images/og-image.jpg`

## 10. Photos

Owner must hold the rights to every photo (taken by the company, or licensed).

- [ ] **Hero photo**: a home with installed panels, landscape, at least 2000px wide → `public/images/hero.jpg` (alt text in `src/components/sections/Hero.tsx`)
- [ ] **About photo**: team at work, or a close-up of an installation → `public/images/about.jpg` (alt text in `src/components/sections/AboutSection.tsx`)
- [ ] **Project photos**: one per project, landscape, at least 1600px wide → `public/images/projects/*.jpg` (paths and alt text in `src/data/projects.ts`)
- [ ] **Permission from clients** whose homes or businesses appear in photos

## 11. Privacy and legal content

- [ ] **Privacy Policy text**: what is collected, why, how long it is kept, who can access it, how to request deletion, and a contact person → new `src/app/privacy/page.tsx` (linked from `src/components/layout/Footer.tsx` and the quote form)
- [ ] **Consent wording for the quote form checkbox** → `src/components/quote/QuoteForm.tsx` (see `docs/QUOTE_SUBMISSION_PLAN.md` §6)
- [ ] **Data retention period for quote requests** → Privacy Policy and the database clean-up plan
- [ ] **Data controller / privacy contact** (name or role, email) → `src/app/privacy/page.tsx`
- [ ] **Short privacy line under the form** (approve or replace "Your details are only used to prepare your quotation") → `src/components/quote/QuoteForm.tsx`
- [ ] **Terms of Use** (optional) → new `src/app/terms/page.tsx`
- [ ] **Copyright line** (legal entity name) → `src/components/layout/Footer.tsx`
- [ ] **Preferred hosting region for stored enquiries** (e.g. closest Supabase region to your customers) → decided when the Supabase project is created

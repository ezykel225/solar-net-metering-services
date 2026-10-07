# Solar Net Metering Services — Website (Phase 1)

Marketing website for **Solar Net Metering Services**, built with Next.js (App Router) and TypeScript.
Phase 1 is frontend only. There is no database, no authentication and no admin area yet.

## Run locally

Requirements: Node.js 20.9+ (Node 22 recommended) and npm.

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

| Command | Purpose |
| --- | --- |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | TypeScript check |
| `npm run images:placeholders` | Regenerate the illustrated placeholder images |

Optional: copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`. It is used for canonical URLs, the sitemap and Open Graph tags. On Vercel the site falls back to the project's production domain if the variable is unset.

## Project structure

```
src/
  app/                    Routes (one folder per page) + layout, sitemap, robots, icon
  components/
    layout/               Header (with mobile menu), Footer, Logo, PageHero, MobileCtaBar
    sections/             Page sections (Hero, Services, Net metering steps, Projects…)
    quote/                Quote form, form field, quote section (+ calculator pre-fill)
    calculator/           Solar Savings Calculator UI
    seo/                  JsonLd structured-data helper
    ui/                   Reusable primitives (ButtonLink, SectionHeading, Accordion, Icon)
  data/                   All editable content (services, projects, FAQs, testimonials…)
  lib/
    site.ts               Company name, contact details, social links ← edit this first
    seo.ts                Per-page metadata helper + LocalBusiness JSON-LD
    quote.ts              Quote request types, validation and submit function
    solar-calculator.ts   Solar Calculator assumptions, maths, formatting and quote hand-off
public/images/            Illustrated placeholder images (replace with real photos, same file names)
scripts/                  Placeholder image generator
```

Styling uses plain CSS. Design tokens (brand colors, spacing, radii) live in `src/app/globals.css`, and each component has its own CSS Module. The only runtime dependencies are `next`, `react` and `react-dom`.

## Replacing placeholder content

What is confirmed, what needs owner approval and what is still placeholder is tracked in
[`docs/CONTENT_STATUS.md`](docs/CONTENT_STATUS.md). Everything still needed from the business owner is listed, with the exact file for each item, in
[`docs/OWNER_CONTENT_CHECKLIST.md`](docs/OWNER_CONTENT_CHECKLIST.md). The earlier site audit is in
[`docs/COMPLETION_AUDIT.md`](docs/COMPLETION_AUDIT.md). The most common edits:

- **Contact details, Facebook/Messenger links, service-area wording, stats:** `src/lib/site.ts`
- **Packages, brands, street-light features:** `src/data/services.ts`
- **Customer result (bill before/after):** `src/data/case-studies.ts`
- **"Free" quote wording:** `src/data/navigation.ts` → `QUOTES_ARE_FREE` (one switch for all quote CTAs)
- **Solar Calculator assumptions (rate, sun hours, efficiency, panel wattage…):** `src/lib/solar-calculator.ts` → `calculatorAssumptions`
- **Logo, hero/about photos, project photos:** see the asset replacement guide in `docs/CONTENT_STATUS.md`
- **Projects / testimonials / FAQs / services:** `src/data/*.ts`
- **Photos:** overwrite the files in `public/images/` and `public/images/projects/`. Keep the same names or update the paths in `src/data/projects.ts`, and update the `imageAlt` text too.
- **Logo:** `src/components/layout/Logo.tsx` (and `src/app/icon.svg` for the favicon)

## Connecting the quote form later (Phase 2)

The form (`src/components/quote/QuoteForm.tsx`) only calls `submitQuoteRequest()` in `src/lib/quote.ts`.
Right now that function simulates a request and the form shows a demo success state. Nothing is stored or sent.

The connection plan is in [`docs/QUOTE_SUBMISSION_PLAN.md`](docs/QUOTE_SUBMISSION_PLAN.md). It covers the `quote_requests` table and migration, the server-only `/api/quote` route, environment variables, the privacy-consent checkbox, and the exact files that change.
The database row types and the form-to-row mapping (`toQuoteRequestInsert()`) are already in `src/lib/quote.ts`.

## Location-specific SEO (prepared)

- `buildMetadata()` in `src/lib/seo.ts` produces title, description, canonical, Open Graph and Twitter tags for any page.
- `src/data/service-areas.ts` lists locations with confirmed public work (Dumaguete City, Sibulan, Siaton, Siquijor). It is not a complete service-area list and is included in the LocalBusiness `areaServed` structured data.
- To add city pages, create `src/app/service-areas/[slug]/page.tsx` with `generateStaticParams()` over `serviceAreas`, then set `SERVICE_AREA_PAGES_ENABLED = true` so the sitemap includes them.

## Deployment

The site is fully static and works on Vercel with no extra configuration. Import the repo and set `NEXT_PUBLIC_SITE_URL`. (Not deployed yet.)

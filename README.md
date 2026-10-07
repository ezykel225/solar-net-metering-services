# Solar Net Metering Services — Website

Marketing website for **Solar Net Metering Services**, built with Next.js (App Router) and TypeScript.
Content, calculator settings and quote requests are managed in a protected admin area at `/admin`, backed by Supabase (Auth, Postgres with RLS, Storage).
Setup, security model and operations are documented in **[`docs/ADMIN_CMS.md`](docs/ADMIN_CMS.md)**.
Without Supabase variables, the public site still works with its built-in content.

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

Copy `.env.example` to `.env.local` and fill in the values. Every variable is explained there and in `docs/ADMIN_CMS.md` §2.
Without the Supabase variables, the public site uses its built-in content, `/admin` shows "not configured", and the quote form points visitors to phone and Messenger instead.

## Project structure

```
src/
  app/(site)/             Public pages (shared header/footer layout)
  app/admin/              Admin login and dashboard (protected)
  app/api/quote/          Quote submission endpoint (server-side validation, Supabase insert, email)
  proxy.ts                Session refresh + redirect for /admin
  components/
    layout/               Header (with mobile menu), Footer, Logo, PageHero, MobileCtaBar
    sections/             Page sections (Hero, Services, Net metering steps, Projects…)
    quote/                Quote form, form field, quote section (+ calculator pre-fill)
    calculator/           Solar Savings Calculator UI
    seo/                  JsonLd structured-data helper
    ui/                   Reusable primitives (ButtonLink, SectionHeading, Accordion, Icon)
    admin/                Admin shell, forms, image upload, confirmations
  data/                   Built-in content: seed source and offline fallback for the CMS
  lib/
    site.ts               Company name, contact details, social links ← edit this first
    seo.ts                Per-page metadata helper + LocalBusiness JSON-LD
    quote.ts              Quote request types, validation and submit function
    solar-calculator.ts   Solar Calculator maths, default settings, formatting and quote hand-off
    supabase/             Supabase clients (browser, server, public, service-role, proxy)
    cms/                  Public content getters with fallbacks
    admin/                Admin auth checks, content definitions, validation
supabase/migrations/      Schema + RLS, storage bucket, seed of confirmed content
public/images/            Illustrated placeholder images (replace with real photos, same file names)
scripts/                  Placeholder image generator
```

Styling uses plain CSS. Design tokens (brand colors, spacing, radii) live in `src/app/globals.css`, and each component has its own CSS Module. Runtime dependencies: `next`, `react`, `react-dom`, `@supabase/supabase-js`, `@supabase/ssr` and `server-only`.

## Replacing placeholder content

What is confirmed, what needs owner approval and what is still placeholder is tracked in
[`docs/CONTENT_STATUS.md`](docs/CONTENT_STATUS.md). Everything still needed from the business owner is listed, with the exact file for each item, in
[`docs/OWNER_CONTENT_CHECKLIST.md`](docs/OWNER_CONTENT_CHECKLIST.md). The earlier site audit is in
[`docs/COMPLETION_AUDIT.md`](docs/COMPLETION_AUDIT.md).

With Supabase configured, projects, packages, testimonials, services, FAQs, promotions, business settings and calculator settings are edited in **`/admin`**.
The files below only matter as the fallback or for content that isn't in the CMS yet: hero, about, why-choose-us, benefits, net-metering steps and the customer result. The most common file edits:

- **Contact details, Facebook/Messenger links, service-area wording, stats:** `src/lib/site.ts`
- **Packages, brands, street-light features:** `src/data/services.ts`
- **Customer result (bill before/after):** `src/data/case-studies.ts`
- **"Free" quote wording:** Admin → Business Settings (fallback: `QUOTES_ARE_FREE` in `src/data/navigation.ts`)
- **Calculator rates and assumptions:** Admin → Calculator Settings. The fallback defaults are `POWER_RATES` and `DEFAULT_CALCULATOR_CONFIG` in `src/lib/solar-calculator.ts`.
- **Logo, hero/about photos, project photos:** see the asset replacement guide in `docs/CONTENT_STATUS.md`
- **Projects / testimonials / FAQs / services:** `src/data/*.ts`
- **Photos:** overwrite the files in `public/images/` and `public/images/projects/`. Keep the same names or update the paths in `src/data/projects.ts`, and update the `imageAlt` text too.
- **Logo:** `src/components/layout/Logo.tsx` (and `src/app/icon.svg` for the favicon)

## Quote requests

The form posts to `/api/quote`. The server validates every field again, requires the privacy-consent checkbox, applies rate limits, saves the request to Supabase (`quote_requests`) and emails the business when Resend is configured.
Requests are managed in **Admin → Quote Requests**. Details are in `docs/ADMIN_CMS.md` §6.

## Location-specific SEO (prepared)

- `buildMetadata()` in `src/lib/seo.ts` produces title, description, canonical, Open Graph and Twitter tags for any page.
- `src/data/service-areas.ts` lists locations with confirmed public work (Dumaguete City, Sibulan, Siaton, Siquijor). It is not a complete service-area list and is included in the LocalBusiness `areaServed` structured data.
- To add city pages, create `src/app/service-areas/[slug]/page.tsx` with `generateStaticParams()` over `serviceAreas`, then set `SERVICE_AREA_PAGES_ENABLED = true` so the sitemap includes them.

## Deployment

Public pages are statically generated and refreshed every 5 minutes, or immediately after an admin save. The admin and the API are dynamic.
On Vercel, set the environment variables from `.env.example`. Follow the Supabase and Vercel checklist in `docs/ADMIN_CMS.md` §1–2. (Not deployed yet.)

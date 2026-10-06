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

Optional: copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`. It is used for canonical URLs, the sitemap and Open Graph tags.

## Project structure

```
src/
  app/                    Routes (one folder per page) + layout, sitemap, robots, icon
  components/
    layout/               Header (with mobile menu), Footer, Logo, PageHero, MobileCtaBar
    sections/             Page sections (Hero, Services, Net metering steps, Projects…)
    quote/                Quote form, form field, quote section
    ui/                   Reusable primitives (ButtonLink, SectionHeading, Accordion, Icon)
  data/                   All editable content (services, projects, FAQs, testimonials…)
  lib/
    site.ts               Company name, contact details, social links ← edit this first
    seo.ts                Per-page metadata helper + LocalBusiness JSON-LD
    quote.ts              Quote request types, validation and submit function
public/images/            Placeholder images (replace with real photos, same file names)
scripts/                  Placeholder image generator
```

Styling uses plain CSS. Design tokens (brand colors, spacing, radii) live in `src/app/globals.css`, and each component has its own CSS Module. The only runtime dependencies are `next`, `react` and `react-dom`.

## Replacing placeholder content

- **Contact details, Facebook link, stats:** `src/lib/site.ts`
- **Projects / testimonials / FAQs / services:** `src/data/*.ts`
- **Photos:** overwrite the files in `public/images/` and `public/images/projects/`. Keep the same names or update the paths in `src/data/projects.ts`, and update the `imageAlt` text too.
- **Logo:** `src/components/layout/Logo.tsx` (and `src/app/icon.svg` for the favicon)

## Connecting the quote form later (Phase 2)

The form (`src/components/quote/QuoteForm.tsx`) only calls `submitQuoteRequest()` in `src/lib/quote.ts`.
Right now that function simulates a request and the form shows a demo success state. Nothing is stored or sent.
To go live, replace the body of `submitQuoteRequest()` with either:

- a `fetch("/api/quote")` call to a new Route Handler (`src/app/api/quote/route.ts`) that reuses `validateQuoteRequest()` on the server, or
- a Supabase insert, with keys read from environment variables (see `.env.example`). Never hard-code them.

## Location-specific SEO (prepared)

- `buildMetadata()` in `src/lib/seo.ts` produces title, description, canonical, Open Graph and Twitter tags for any page.
- `src/data/service-areas.ts` holds placeholder service areas. They are already included in the LocalBusiness `areaServed` structured data.
- To add city pages, create `src/app/service-areas/[slug]/page.tsx` with `generateStaticParams()` over `serviceAreas`, then set `SERVICE_AREA_PAGES_ENABLED = true` so the sitemap includes them.

## Deployment

The site is fully static and works on Vercel with no extra configuration. Import the repo and set `NEXT_PUBLIC_SITE_URL`. (Not deployed yet.)

/**
 * Service areas — groundwork for location-specific SEO.
 *
 * Phase 2 idea: add `src/app/service-areas/[slug]/page.tsx` that uses
 * `generateStaticParams()` over this list and `buildMetadata()` from
 * `@/lib/seo` to create a landing page per city/province. Pages listed here
 * are also picked up automatically by `src/app/sitemap.ts` once that route exists.
 *
 * TODO: Replace with the company's real service areas.
 */
export type ServiceArea = {
  slug: string;
  name: string;
  region: string;
};

export const serviceAreas: ServiceArea[] = [
  { slug: "service-area-1", name: "Service Area 1", region: "Region placeholder" },
  { slug: "service-area-2", name: "Service Area 2", region: "Region placeholder" },
  { slug: "service-area-3", name: "Service Area 3", region: "Region placeholder" },
];

/** Set to true once `/service-areas/[slug]` pages are implemented. */
export const SERVICE_AREA_PAGES_ENABLED = false;

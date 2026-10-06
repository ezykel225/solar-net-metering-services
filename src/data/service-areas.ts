/**
 * Locations where the company has publicly shown work or customers.
 * This is NOT a complete list of service areas — always present it with
 * siteConfig.serviceAreaSummary wording.
 *
 * Location landing pages (Phase 2): add `src/app/service-areas/[slug]/page.tsx`
 * using generateStaticParams() over this list and buildMetadata() from
 * `@/lib/seo`, then set SERVICE_AREA_PAGES_ENABLED to include them in the sitemap.
 * Each page needs unique, owner-approved content before it is enabled.
 */
export type ServiceArea = {
  slug: string;
  name: string;
  region: string;
};

export const serviceAreas: ServiceArea[] = [
  { slug: "dumaguete-city", name: "Dumaguete City", region: "Negros Oriental" },
  { slug: "sibulan", name: "Sibulan", region: "Negros Oriental" },
  { slug: "siaton", name: "Siaton", region: "Negros Oriental" },
  { slug: "siquijor", name: "Siquijor", region: "Siquijor" },
];

/** Set to true once `/service-areas/[slug]` pages are implemented. */
export const SERVICE_AREA_PAGES_ENABLED = false;

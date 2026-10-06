/**
 * Resolves the public site URL:
 * 1. NEXT_PUBLIC_SITE_URL (set this to the final domain in Vercel),
 * 2. Vercel's production domain (provided automatically on Vercel),
 * 3. http://localhost:3000 for local development.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url = explicit || (vercel ? `https://${vercel}` : "http://localhost:3000");
  // Only used server-side (metadata, sitemap, JSON-LD); client components never render it.
  return url.replace(/\/$/, "");
}

/**
 * Central business information. Every page, the footer, metadata and
 * structured data read from here, so official details only need to be
 * updated in one place.
 *
 * CONFIRMED (from the company's public Facebook page): name, mobile number,
 * email, Facebook page, Messenger link, and the operating area wording.
 * NOT YET CONFIRMED: office address, office hours, company statistics.
 * Those are left empty (null / []) and the UI hides them until supplied.
 */
type Stat = { value: string; label: string };

export const siteConfig = {
  name: "Solar Net Metering Services",
  shortName: "SNMS",
  tagline: "Solar installation & net metering in Dumaguete City and Negros Oriental",
  description:
    "Professional solar installation and net metering services for residential and commercial properties.",
  /** Absolute site URL used for canonical links, sitemap and Open Graph. See resolveSiteUrl(). */
  url: resolveSiteUrl(),
  ogImage: "/images/og-image.jpg",
  contact: {
    phone: "0997 731 0543",
    phoneHref: "tel:+639977310543",
    /** International format for structured data */
    phoneIntl: "+63 997 731 0543",
    email: "solarandnetmeteringservices@gmail.com",
    /** Office street address — not yet confirmed; hidden while null. */
    address: null as string | null,
    /** Office hours — not yet confirmed; hidden while null. */
    hours: null as string | null,
  },
  /** Approved wording for where the company works. Not a complete list of service areas. */
  serviceAreaSummary:
    "Serving Dumaguete City and nearby areas in Negros Oriental, with selected projects in surrounding locations.",
  serviceAreaShort: "Dumaguete City & Negros Oriental",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61567843505161",
    /** Used for every "Message Us" call to action. */
    messenger: "https://www.facebook.com/messages/t/61567843505161/",
  },
  /** Company statistics — none confirmed yet. Add entries here once the owner confirms them. */
  stats: [] as Stat[],
};

export type SiteConfig = typeof siteConfig;

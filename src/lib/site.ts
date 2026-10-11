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

export type Registration = {
  authority: string | null;
  status: string | null;
  scope: string | null;
  region: string | null;
  /** YYYY-MM-DD */
  date: string | null;
  /** YYYY-MM-DD */
  expiryDate: string | null;
};

/** True when NEXT_PUBLIC_SITE_URL is set (links in notification emails use it). */
export const siteUrlConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());

/**
 * Central business information. Every page, the footer, metadata and
 * structured data read from here, so official details only need to be
 * updated in one place.
 *
 * CONFIRMED (client rebrand, Oct 2026): business name "EG Solar Products
 * Trading", mobile 0955 270 4060, email egsolarproductstrading@gmail.com,
 * business location (updated Oct 2026 to match the Google Business Profile):
 * Bulfas Compound, Dumaguete – Palinpinon Rd., Dumaguete City, 6200 Negros
 * Oriental, Plus Code 875R+JP. Service-area wording and the
 * Facebook/Messenger links carry over from the earlier confirmation (the
 * links still need owner confirmation for the new brand).
 * NOT YET CONFIRMED: office hours, company statistics — left empty and hidden.
 */
type Stat = { value: string; label: string };

export const siteConfig = {
  name: "EG Solar Products Trading",
  shortName: "EG Solar",
  tagline: "Solar products & solar services in Dumaguete City and Negros Oriental",
  description:
    "Solar systems, inverters and batteries, plus solar installation, system design, permits, net-metering assistance and after-sales support in Dumaguete City and Negros Oriental.",
  /** Absolute site URL used for canonical links, sitemap and Open Graph. See resolveSiteUrl(). */
  url: resolveSiteUrl(),
  /** Social-share image: the client's wide banner, fitted (not cropped) into 1200×630 on navy. */
  ogImage: "/images/brand/eg-solar-og.jpg",
  /**
   * Official EG Solar Products Trading logo (client-supplied, used unaltered).
   * It is a detailed circular emblem on a white square, so small placements
   * show it as a circle next to compact text branding instead of on its own.
   */
  logo: {
    src: "/images/brand/eg-solar-products-trading-logo.jpg",
    width: 1254,
    height: 1254,
  } as null | { src: string; width: number; height: number },
  contact: {
    phone: "0955 270 4060",
    phoneHref: "tel:+639552704060",
    /** International format for structured data */
    phoneIntl: "+639552704060",
    email: "egsolarproductstrading@gmail.com",
    /** Business location (confirmed, matches the Google Business Profile). Not the full service area — see serviceAreaSummary. */
    address: "Bulfas Compound, Dumaguete – Palinpinon Rd., Dumaguete City, 6200 Negros Oriental" as string | null,
    /** Office hours — not yet confirmed; hidden while null. */
    hours: null as string | null,
  },
  /**
   * Business-name registration (confirmed by the owner, Oct 2026). The
   * registration number and QR code are intentionally not stored or shown.
   */
  registration: {
    authority: "Department of Trade and Industry (DTI)",
    status: "DTI Registered",
    scope: "Regional",
    region: "Negros Island Region (NIR)",
    date: "2026-10-08",
    expiryDate: "2031-10-08",
  } as Registration | null,
  /**
   * Official Google Maps listing (confirmed). The embed URL and coordinates are
   * left empty until copied from the listing itself — never guessed.
   */
  map: {
    url: "https://maps.app.goo.gl/81yyiSJeFAdaxvHN9" as string | null,
    embedUrl: null as string | null,
    plusCode: "875R+JP Dumaguete City, Negros Oriental" as string | null,
    geo: null as { lat: number; lng: number } | null,
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

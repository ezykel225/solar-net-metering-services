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
 * TODO: Replace placeholder contact details with the company's official information.
 */
export const siteConfig = {
  name: "Solar Net Metering Services",
  shortName: "SNMS",
  tagline: "Solar installation & net metering for homes and businesses",
  description:
    "Professional solar installation and net metering services for residential and commercial properties.",
  /** Absolute site URL used for canonical links, sitemap and Open Graph. See resolveSiteUrl(). */
  url: resolveSiteUrl(),
  ogImage: "/images/og-image.jpg",
  contact: {
    phone: "+00 000 000 0000", // placeholder
    phoneHref: "tel:+000000000000", // placeholder
    email: "info@example.com", // placeholder
    address: "Office address to follow", // placeholder
    hours: "Mon – Sat, 8:00 AM – 5:00 PM", // placeholder
  },
  social: {
    facebook: "https://www.facebook.com/", // TODO: link to the official Facebook page
  },
  stats: [
    { value: "100+", label: "Systems installed" }, // placeholder figures
    { value: "10+", label: "Years of experience" },
    { value: "24/7", label: "Monitoring support" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

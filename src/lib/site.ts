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
  /** Set NEXT_PUBLIC_SITE_URL in Vercel. Falls back to localhost for development. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
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

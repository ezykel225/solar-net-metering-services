import type { Metadata } from "next";
import { siteConfig } from "./site";
import type { SiteSettings } from "./site-settings";

type PageMetadataInput = {
  title: string;
  description?: string;
  /** Route path, e.g. "/services". Used for canonical URLs. */
  path: string;
  /** Social preview image. Defaults to the site image (1200×630). */
  image?: string;
  imageAlt?: string;
};

/**
 * Builds consistent per-page metadata (title, canonical, Open Graph, Twitter).
 *
 * Location-specific pages can call this too, e.g.:
 *   buildMetadata({ title: `Solar Installation in ${area.name}`, path: `/service-areas/${area.slug}` })
 */
export function buildMetadata({ title, description, path, image, imageAlt }: PageMetadataInput): Metadata {
  const desc = description ?? siteConfig.description;
  const ogImage = image ?? siteConfig.ogImage;
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: desc,
      url: path,
      siteName: siteConfig.name,
      type: "website",
      images: [
        image
          ? { url: ogImage, alt: imageAlt ?? siteConfig.name }
          : { url: ogImage, width: 1200, height: 630, alt: siteConfig.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description: desc,
      images: [ogImage],
    },
  };
}

/**
 * Structured address. The confirmed location "Batinguel, Dumaguete City, Philippines"
 * becomes barangay + city; any other text is kept as a plain street address.
 */
function postalAddress(address: string) {
  const confirmed = /^\s*Batinguel,\s*Dumaguete City/i.test(address);
  return confirmed
    ? {
        "@type": "PostalAddress",
        streetAddress: "Batinguel",
        addressLocality: "Dumaguete City",
        addressRegion: "Negros Oriental",
        addressCountry: "PH",
      }
    : { "@type": "PostalAddress", streetAddress: address, addressCountry: "PH" };
}

/** LocalBusiness structured data (JSON-LD) rendered in the root layout. */
export function localBusinessJsonLd(settings: SiteSettings, areaServed: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: settings.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    telephone: settings.phoneIntl,
    email: settings.email,
    sameAs: [settings.facebook],
    ...(settings.address && { address: postalAddress(settings.address) }),
    knowsAbout: [
      "Solar products",
      "Solar systems",
      "Solar inverters",
      "Solar batteries",
      "Solar installation",
      "Solar system design",
      "Net metering",
    ],
    ...(areaServed.length > 0 && { areaServed }),
  };
}

/** BreadcrumbList structured data for an inner page (Home → page). */
export function breadcrumbJsonLd(label: string, path: string, parents: { label: string; href: string }[] = []) {
  const trail = [{ label: "Home", href: "/" }, ...parents, { label, href: path }];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${siteConfig.url}${c.href}`,
    })),
  };
}

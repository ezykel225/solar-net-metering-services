import type { Metadata } from "next";
import { siteConfig } from "./site";

type PageMetadataInput = {
  title: string;
  description?: string;
  /** Route path, e.g. "/services". Used for canonical URLs. */
  path: string;
  image?: string;
};

/**
 * Builds consistent per-page metadata (title, canonical, Open Graph, Twitter).
 *
 * Location-specific pages can call this too, e.g.:
 *   buildMetadata({ title: `Solar Installation in ${area.name}`, path: `/service-areas/${area.slug}` })
 */
export function buildMetadata({ title, description, path, image }: PageMetadataInput): Metadata {
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
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description: desc,
      images: [ogImage],
    },
  };
}

/** LocalBusiness structured data (JSON-LD) rendered in the root layout. */
export function localBusinessJsonLd(areaServed: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    sameAs: [siteConfig.social.facebook],
    ...(areaServed.length > 0 && { areaServed }),
  };
}

/** BreadcrumbList structured data for an inner page (Home → page). */
export function breadcrumbJsonLd(label: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
      { "@type": "ListItem", position: 2, name: label, item: `${siteConfig.url}${path}` },
    ],
  };
}

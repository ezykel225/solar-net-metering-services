import type { MetadataRoute } from "next";
import { mainNav } from "@/data/navigation";
import { serviceAreas, SERVICE_AREA_PAGES_ENABLED } from "@/data/service-areas";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: MetadataRoute.Sitemap = mainNav.map((item) => ({
    url: `${siteConfig.url}${item.href === "/" ? "" : item.href}`,
    lastModified,
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : item.href === "/contact" ? 0.9 : 0.7,
  }));

  const areaPages: MetadataRoute.Sitemap = SERVICE_AREA_PAGES_ENABLED
    ? serviceAreas.map((area) => ({
        url: `${siteConfig.url}/service-areas/${area.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      }))
    : [];

  return [...pages, ...areaPages];
}

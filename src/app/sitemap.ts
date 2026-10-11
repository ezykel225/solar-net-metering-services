import type { MetadataRoute } from "next";
import { mainNav } from "@/data/navigation";
import { serviceAreas, SERVICE_AREA_PAGES_ENABLED } from "@/data/service-areas";
import { getProjects } from "@/lib/cms";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = mainNav.map((item) => ({
    url: `${siteConfig.url}${item.href === "/" ? "" : item.href}`,
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : item.href === "/contact" ? 0.9 : 0.7,
  }));

  const areaPages: MetadataRoute.Sitemap = SERVICE_AREA_PAGES_ENABLED
    ? serviceAreas.map((area) => ({
        url: `${siteConfig.url}/service-areas/${area.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      }))
    : [];

  // Published projects only (getProjects never returns drafts or archived projects).
  const { data: projects } = await getProjects();
  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${siteConfig.url}/projects/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...projectPages, ...areaPages];
}

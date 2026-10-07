import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments are never indexed.
  if (process.env.VERCEL_ENV === "preview") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    // /admin is not blocked here on purpose: crawlers must be able to read its
    // "noindex" header (next.config.ts) for it to take effect.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

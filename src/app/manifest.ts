import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0b1f3a",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      // Official EG logo (legible from 180px up; the small favicon stays the simple sun mark).
      { src: "/images/brand/eg-solar-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/brand/eg-solar-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

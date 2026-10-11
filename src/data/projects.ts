export type ProjectCategory = "Residential" | "Commercial";

export type Project = {
  slug: string;
  title: string;
  /** Used for filtering; omit when not confirmed. */
  category?: ProjectCategory;
  /** Short labels shown on the card image, e.g. "Residential", "Hybrid Solar". */
  tags: string[];
  location?: string | null;
  /** Only confirmed specifications. Omit when unknown. */
  system?: string;
  description: string;
  /** Image URL (site path or Supabase Storage URL). Null when no image has been added. */
  image: string | null;
  imageAlt: string;
  /** Marked as featured in the admin (shown first). */
  featured?: boolean;
  /** True while the image is an illustration rather than a real project photo. */
  imageIsIllustration: boolean;
  /** Real project photos (main image first), viewable full size. Empty or omitted when none. */
  gallery?: { src: string; alt: string }[];
};

/**
 * Projects confirmed from the company's public posts.
 * Use conservative wording; do not add specifications that weren't published.
 * TODO (owner): real project photos with client permission.
 */
const tierraAlta = "/images/projects/tierra-alta";
const tierraAltaTitle = "Tierra Alta Hybrid Solar + Net Metering Installation";
const tierraAltaPhotos = [
  "tierra-alta-rooftop-solar-array.webp",
  "tierra-alta-rooftop-panels.webp",
  "tierra-alta-inverter-and-batteries.webp",
  "tierra-alta-inverter-and-batteries-2.webp",
  "tierra-alta-net-meter.webp",
];
const TIERRA_ALTA_MAIN_ALT =
  "Completed EG Solar Products Trading hybrid solar installation in Tierra Alta, Valencia: solar panels on a tiled roof";

export const projects: Project[] = [
  // Real completed project with genuine photos (client-supplied, Oct 2026). Same record as the CMS.
  {
    slug: "tierra-alta-hybrid-solar-net-metering",
    title: tierraAltaTitle,
    category: "Residential",
    tags: ["Residential", "Hybrid Solar", "Net Metering"],
    location: "Tierra Alta, Valencia, Negros Oriental",
    system: "10.8kW solar array · 12kW hybrid inverter · 32kWh battery storage",
    description:
      "A completed hybrid solar and net-metering installation in Tierra Alta, Valencia, featuring an 18-panel 10.8kW solar array (18 × 600W panels), a 12kW hybrid inverter and 32kWh of battery storage (2 × 16kWh batteries). The system is designed to use solar energy during the day, store available energy in its batteries, and support net-metering export when applicable.",
    image: `${tierraAlta}/${tierraAltaPhotos[0]}`,
    imageAlt: TIERRA_ALTA_MAIN_ALT,
    imageIsIllustration: false,
    featured: true,
    gallery: tierraAltaPhotos.map((file, i) => ({
      src: `${tierraAlta}/${file}`,
      alt: i === 0 ? TIERRA_ALTA_MAIN_ALT : `${tierraAltaTitle} — photo ${i + 1} of ${tierraAltaPhotos.length}`,
    })),
  },
  {
    slug: "siaton-hybrid-solar-installation",
    title: "Siaton 10kW Hybrid Solar Installation",
    category: "Residential",
    tags: ["Residential", "Hybrid Solar"],
    location: "Siaton, Negros Oriental",
    system: "10kW Hybrid Solar System · 300Ah LiFePO₄ Battery",
    description:
      "A completed 10kW hybrid solar installation in Siaton, Negros Oriental, with a 300Ah LiFePO₄ battery. The project includes the rooftop solar installation and the indoor power-system setup.",
    image: "/images/projects/siaton-hybrid.jpg",
    imageAlt: "Illustration of a house with rooftop solar panels",
    imageIsIllustration: true,
  },
  {
    slug: "sibulan-solar-installation",
    title: "Sibulan Solar Installation",
    tags: ["Solar Installation"],
    location: "Sibulan, Negros Oriental",
    description: "A solar installation for a client in Sibulan, who shared their satisfaction with the completed project.",
    image: "/images/projects/sibulan-installation.jpg",
    imageAlt: "Illustration of a home with solar panels on its roof at sunset",
    imageIsIllustration: true,
  },
];

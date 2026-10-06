export type ProjectCategory = "Residential" | "Commercial";

export type Project = {
  slug: string;
  title: string;
  /** Used for filtering; omit when not confirmed. */
  category?: ProjectCategory;
  /** Short labels shown on the card image, e.g. "Residential", "Hybrid Solar". */
  tags: string[];
  location: string;
  /** Only confirmed specifications. Omit when unknown. */
  system?: string;
  description: string;
  image: string;
  imageAlt: string;
  /** True while the image is an illustration rather than a real project photo. */
  imageIsIllustration: boolean;
};

/**
 * Projects confirmed from the company's public posts.
 * Use conservative wording; do not add specifications that weren't published.
 * TODO (owner): real project photos with client permission.
 */
export const projects: Project[] = [
  {
    slug: "siaton-hybrid-solar-installation",
    title: "Siaton Hybrid Solar Installation",
    category: "Residential",
    tags: ["Residential", "Hybrid Solar"],
    location: "Siaton, Negros Oriental",
    system: "10kW hybrid solar system · 15kWh battery storage",
    description: "A 10kW hybrid solar system with 15kWh of battery storage, installed for a residential client in Siaton.",
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

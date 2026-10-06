export type ProjectCategory = "Residential" | "Commercial";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  location: string;
  systemSize: string;
  description: string;
  image: string;
  imageAlt: string;
};

/** Placeholder projects — replace with real installations and photos. */
export const projects: Project[] = [
  {
    slug: "rooftop-family-residence",
    title: "Rooftop Family Residence",
    category: "Residential",
    location: "City, Province",
    systemSize: "6.5 kWp",
    description: "Grid-tied rooftop system with net metering that offsets most of the household's daytime consumption.",
    image: "/images/projects/residential-rooftop.jpg",
    imageAlt: "Two rows of solar panels installed on the brown roof of a single-storey home",
  },
  {
    slug: "warehouse-rooftop-array",
    title: "Warehouse Rooftop Array",
    category: "Commercial",
    location: "Industrial Park, City",
    systemSize: "120 kWp",
    description: "Large flat-roof installation powering lighting and cold-storage equipment for a distribution warehouse.",
    image: "/images/projects/commercial-warehouse.jpg",
    imageAlt: "Rows of solar panels covering the flat roof of a long commercial warehouse",
  },
  {
    slug: "suburban-home-upgrade",
    title: "Suburban Home Upgrade",
    category: "Residential",
    location: "Municipality, Province",
    systemSize: "5 kWp",
    description: "Compact battery-ready system installed in two days, including full net-metering application support.",
    image: "/images/projects/family-home.jpg",
    imageAlt: "Solar panels on the roof of a light-grey home at sunset",
  },
  {
    slug: "ground-mounted-solar-farm",
    title: "Ground-Mounted Solar Array",
    category: "Commercial",
    location: "Province",
    systemSize: "250 kWp",
    description: "Ground-mounted array on unused land, supplying a processing facility and exporting surplus to the grid.",
    image: "/images/projects/ground-mount.jpg",
    imageAlt: "Multiple rows of ground-mounted solar panels on a grassy field",
  },
  {
    slug: "retail-store-solar",
    title: "Retail Store Solar",
    category: "Commercial",
    location: "Town Center, City",
    systemSize: "40 kWp",
    description: "Rooftop system that cut a retail store's peak daytime electricity costs for air-conditioning and lighting.",
    image: "/images/projects/retail-building.jpg",
    imageAlt: "Solar panel rows on the roof of a cream-colored retail building with an orange trim",
  },
  {
    slug: "modern-residence",
    title: "Modern Residence",
    category: "Residential",
    location: "Subdivision, City",
    systemSize: "8 kWp",
    description: "High-efficiency panels with monitoring app setup so the homeowners can track production in real time.",
    image: "/images/projects/modern-residence.jpg",
    imageAlt: "Fourteen solar panels on the dark roof of a white modern house",
  },
];

import type { IconName } from "@/components/ui/Icon";

/**
 * Service list confirmed by the owner's DTI announcement (Oct 2026):
 * Solar Products, Solar System Installation, System Design & Consultation,
 * Permits & Documents Processing, Net Metering Assistance, Maintenance &
 * After-Sales Support. Wording beyond these titles needs owner approval.
 * Solar street lights are not on this list (not offered unless confirmed).
 * Do not add warranties, certifications or approval guarantees.
 */
export type Service = {
  slug: string;
  title: string;
  icon: IconName;
  summary: string;
  details: string[];
};

export const services: Service[] = [
  {
    slug: "solar-system-supply",
    title: "Solar Products",
    icon: "panel",
    summary: "Solar systems and components for homes and businesses, including inverters and batteries.",
    details: ["Complete solar system packages", "Inverters", "Batteries", "Product inquiries and pre-orders"],
  },
  {
    slug: "solar-installation",
    title: "Solar System Installation",
    icon: "home",
    summary: "Installation of solar systems for residential and commercial properties, including hybrid systems with battery storage.",
    details: ["Residential and commercial properties", "Grid-tied and hybrid systems", "Battery storage", "Site assessment before installation"],
  },
  {
    slug: "system-design-consultation",
    title: "System Design & Consultation",
    icon: "chart",
    summary: "We look at your property and electricity use and recommend a suitable solar system.",
    details: ["Site assessment", "Review of your electricity bill and usage", "System sizing and quotation"],
  },
  {
    slug: "permits-documents",
    title: "Permits & Documents Processing",
    icon: "fileText",
    summary: "Help preparing and processing the permits and documents for your solar project.",
    details: [
      "Building Permit",
      "Electrical Permit",
      "Final Inspection Permit",
      "Requirements can vary by project and electric cooperative",
    ],
  },
  {
    slug: "net-metering",
    title: "Net Metering Assistance",
    icon: "meter",
    summary: "Net-metering application assistance for NORECO 1 and NORECO 2 customers.",
    details: [
      "Net-metering application processing for NORECO 1 and NORECO 2",
      "Help preparing the advertised requirements",
      "Guidance throughout the application",
    ],
  },
  {
    slug: "maintenance-after-sales",
    title: "Maintenance & After-Sales Support",
    icon: "headset",
    summary: "Support after installation, including maintenance and help with questions about your system.",
    details: ["Solar system maintenance", "After-sales support", "Help with questions about your system"],
  },
];

/** Options in the quote form's "Service Interested In" field. */
export const PRODUCT_INQUIRY_SERVICE = "Product Inquiry / Pre-Order (Inverters, Batteries)";
export const INSTALLATION_SERVICE = "Solar System Installation";
export const serviceOptions = [
  "Solar Products",
  INSTALLATION_SERVICE,
  "System Design & Consultation",
  "Permits & Documents Processing",
  "Net Metering Assistance",
  "Maintenance & After-Sales Support",
  PRODUCT_INQUIRY_SERVICE,
  "Not sure yet",
];

/** Previous option names, still accepted from pages cached before the Oct 2026 rename. */
export const legacyServiceOptions = new Map<string, string>([
  ["Solar System Supply", "Solar Products"],
  ["Solar Installation", INSTALLATION_SERVICE],
]);

/**
 * Typical project flow built only from confirmed services.
 * Step order and wording: needs owner approval.
 */
export const installationProcess = [
  { title: "Inquiry & quotation", description: "Send us your details or message us, and tell us about your property and electricity use." },
  { title: "Site assessment", description: "We assess your property to recommend a suitable system." },
  { title: "Solar installation", description: "Our team installs your panels, inverter and any battery storage." },
  { title: "Net-metering application", description: "For NORECO 1 and NORECO 2 customers, we process your net-metering application." },
  { title: "After-sales support", description: "We support you after installation, including maintenance and questions about your system." },
];

export type SolarPackage = {
  name: string;
  /** Formatted price, e.g. "₱180,000"; null when no price is shown. */
  price: string | null;
  inclusions: string[];
  systemSize?: string | null;
  description?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  /** Per-package note; falls back to PACKAGES_NOTE. */
  note?: string | null;
  featured?: boolean;
};

/**
 * Packages publicly advertised by the company. Prices and availability are
 * subject to confirmation (the UI shows that note). Do not add promo scarcity
 * claims such as "only 5 slots" unless the owner decides to run them.
 */
export const solarPackages: SolarPackage[] = [
  {
    name: "3kW Hybrid Solar System Package",
    price: "₱180,000",
    inclusions: [
      "3kW Hybrid Inverter",
      "24V 100Ah wall-mounted battery",
      "5 high-efficiency solar panels (around 580W–600W each)",
      "Mounting structures / basic accessories",
      "Wiring and protection devices",
      "Basic installation support",
    ],
  },
  {
    name: "5kW Hybrid Solar System Package",
    price: "₱330,000",
    inclusions: [
      "5kW Hybrid Inverter",
      "10kWh wall-mounted lithium battery",
      "8–9 high-efficiency solar panels (around 580W–600W each)",
      "Mounting structures / basic accessories",
      "Wiring and protection devices",
      "Basic installation support",
      "Net-metering assistance",
    ],
  },
];

export const PACKAGES_NOTE = "Prices and package availability are subject to confirmation and may change.";

/**
 * Brands shown in the client's current promotional material (Oct 2026).
 * "Offer or promote" only — NOT an official partnership, authorized
 * dealership, certification or exclusive distributorship.
 */
export const brandGroups = [
  { category: "Inverters", brands: ["Deye", "Solis", "GoodWe", "SRNE"] },
  { category: "Batteries", brands: ["LVTopsun", "Puston", "SRNE", "DuroSel", "Deye"] },
];

/** Product lines for the "Solar Products & Pre-Orders" section. Availability is never implied. */
export const productLines = [
  {
    title: "Inverters",
    icon: "bolt" as IconName,
    description: "Hybrid and grid-tied inverters for residential and commercial solar systems.",
    brands: ["Deye", "Solis", "GoodWe", "SRNE"],
  },
  {
    title: "Batteries",
    icon: "battery" as IconName,
    description: "Battery storage for hybrid solar systems and backup power.",
    brands: ["LVTopsun", "Puston", "SRNE", "DuroSel", "Deye"],
  },
  {
    title: "Solar system components",
    icon: "panel" as IconName,
    description: "Solar panels and the other parts that make up a complete solar system.",
    brands: [] as string[],
  },
];

export const PRODUCTS_NOTE =
  "Pre-orders are available for inverters and batteries. Stock, models and prices change — ask us about current availability before ordering.";

/**
 * Street-light features advertised under the previous brand. NOT shown: solar
 * street lights are not on the owner's confirmed service list (Oct 2026).
 */
export const streetLightFeatures = [
  "Integrated solar panel, LED light, battery and controller",
  "Dusk-to-dawn operation",
  "Remote control",
  "Weather-resistant design",
  "Bulk orders available",
  "Nationwide shipping",
];

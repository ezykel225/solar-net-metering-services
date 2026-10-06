import type { IconName } from "@/components/ui/Icon";

/**
 * Services publicly offered by the company (confirmed from its Facebook page):
 * residential & commercial installation, hybrid systems, solar panels,
 * inverters, battery storage, net-metering services/assistance, solar street
 * lights, site assessment / quotation, and installation support.
 * Do not add services outside this list without owner confirmation.
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
    slug: "residential-solar",
    title: "Residential Solar",
    icon: "home",
    summary: "Solar installation for homes, with panels, inverters and optional battery storage.",
    details: [
      "Site assessment and quotation",
      "Solar panels and inverters",
      "Hybrid systems with battery storage",
      "Net-metering assistance",
    ],
  },
  {
    slug: "commercial-solar",
    title: "Commercial Solar",
    icon: "building",
    summary: "Solar installation for businesses that want to reduce what they buy from the grid.",
    details: [
      "Site assessment and quotation",
      "Solar panels and inverters",
      "Hybrid and battery storage options",
      "Installation support",
    ],
  },
  {
    slug: "hybrid-solar",
    title: "Hybrid Solar & Battery Storage",
    icon: "battery",
    summary: "Hybrid systems that combine solar panels, a hybrid inverter and battery storage.",
    details: [
      "Hybrid inverters",
      "Wall-mounted battery storage",
      "Solar panels",
      "See our current packages below",
    ],
  },
  {
    slug: "net-metering",
    title: "Net Metering",
    icon: "meter",
    summary: "Net-metering services and application assistance for NORECO 1 and NORECO 2 customers.",
    details: [
      "Net-metering application processing for NORECO 1 and NORECO 2",
      "Help preparing the advertised requirements",
      "Guidance throughout the application",
    ],
  },
  {
    slug: "solar-street-lights",
    title: "Solar Street Lights",
    icon: "lamp",
    summary: "All-in-one solar street lights with a built-in panel, LED light, battery and controller.",
    details: [
      "Dusk-to-dawn operation",
      "Remote control",
      "Weather-resistant design",
      "Bulk orders and nationwide shipping",
    ],
  },
  {
    slug: "installation-support",
    title: "Site Assessment & Installation Support",
    icon: "wrench",
    summary: "From site assessment and quotation to installation and support for your solar system.",
    details: ["Site assessment", "Quotation for your property", "Solar installation", "Installation support"],
  },
];

/** Options in the quote form's "Service Interested In" field. */
export const serviceOptions = [
  "Residential Solar",
  "Commercial Solar",
  "Hybrid Solar & Battery Storage",
  "Net Metering Assistance",
  "Solar Street Lights",
  "Site Assessment / Quotation",
  "Installation Support",
  "Not sure yet",
];

/**
 * Typical project flow built only from confirmed services.
 * Step order and wording: needs owner approval.
 */
export const installationProcess = [
  { title: "Inquiry & quotation", description: "Send us your details or message us, and tell us about your property and electricity use." },
  { title: "Site assessment", description: "We assess your property to recommend a suitable system." },
  { title: "Solar installation", description: "Our team installs your panels, inverter and any battery storage." },
  { title: "Net-metering application", description: "For NORECO 1 and NORECO 2 customers, we process your net-metering application." },
  { title: "Installation support", description: "We support you after installation with questions about your system." },
];

export type SolarPackage = {
  name: string;
  price: string;
  inclusions: string[];
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

/** Brands the company publicly uses/promotes. Not an official partnership or certification. */
export const brands = ["SRNE", "Deye", "LVTopsun"];

/** Publicly advertised street-light features (no model specifications yet). */
export const streetLightFeatures = [
  "Integrated solar panel, LED light, battery and controller",
  "Dusk-to-dawn operation",
  "Remote control",
  "Weather-resistant design",
  "Bulk orders available",
  "Nationwide shipping",
];

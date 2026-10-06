import type { IconName } from "@/components/ui/Icon";

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
    summary:
      "Custom rooftop systems sized to your household's energy use, designed to cut your monthly bill from day one.",
    details: [
      "Free site assessment and bill analysis",
      "System design matched to your roof and budget",
      "Grid-tied and hybrid (battery-ready) options",
      "Clean, code-compliant installation",
    ],
  },
  {
    slug: "commercial-solar",
    title: "Commercial Solar",
    icon: "building",
    summary:
      "Scalable solar for offices, shops, warehouses and facilities that want predictable, lower operating costs.",
    details: [
      "Load and demand analysis for your facility",
      "Rooftop, carport and ground-mounted systems",
      "Return-on-investment projections",
      "Installation scheduled around your operations",
    ],
  },
  {
    slug: "net-metering",
    title: "Net Metering",
    icon: "meter",
    summary:
      "We guide you through the net-metering application so excess solar energy earns credits on your electricity bill.",
    details: [
      "Document preparation and checklist",
      "Coordination with your distribution utility",
      "Bi-directional meter installation follow-up",
      "Updates at every stage of the application",
    ],
  },
  {
    slug: "installation-support",
    title: "Solar Installation & Support",
    icon: "wrench",
    summary:
      "From mounting to commissioning and after-sales care, our team keeps your system performing for years.",
    details: [
      "Professional mounting, wiring and commissioning",
      "System monitoring setup",
      "Preventive maintenance and panel cleaning",
      "Responsive troubleshooting and repairs",
    ],
  },
];

export const serviceOptions = [
  ...services.map((s) => s.title),
  "Battery / Hybrid System",
  "Maintenance & Repair",
  "Not sure yet",
];

export const installationProcess = [
  { title: "Free consultation", description: "We review your electricity bills, goals and budget." },
  { title: "Site assessment & design", description: "We inspect your roof or site and design the right system size." },
  { title: "Professional installation", description: "Our team mounts, wires and commissions your system safely." },
  { title: "Net-metering application", description: "We prepare documents and coordinate with your utility." },
  { title: "Monitoring & support", description: "We help you track performance and provide ongoing maintenance." },
];

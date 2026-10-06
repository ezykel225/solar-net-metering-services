import type { IconName } from "@/components/ui/Icon";

export type Step = { title: string; description: string; icon: IconName };

export const netMeteringSteps: Step[] = [
  {
    title: "Solar panels generate electricity",
    description: "Your panels convert sunlight into clean electricity throughout the day.",
    icon: "panel",
  },
  {
    title: "Your property uses the power",
    description: "Appliances, lights and equipment run on solar energy first, reducing what you draw from the grid.",
    icon: "plug",
  },
  {
    title: "Excess energy goes to the grid",
    description: "When you produce more than you use, the surplus is exported through a bi-directional meter.",
    icon: "grid",
  },
  {
    title: "You receive bill credits",
    description: "Exported energy is credited by your utility, helping lower your electricity bill even further.",
    icon: "receipt",
  },
];

export const requiredDocuments = [
  "Completed net-metering application form from your utility",
  "Copy of a recent electricity bill",
  "Valid government-issued ID of the account holder",
  "Proof of property ownership or authorization from the owner",
  "Single-line diagram and technical specifications of the solar system",
  "Certificate of final electrical inspection (or local equivalent)",
];

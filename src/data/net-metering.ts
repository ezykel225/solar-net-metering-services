import type { IconName } from "@/components/ui/Icon";

export type Step = { title: string; description: string; icon: IconName };

/** General explanation of how net metering works (educational, not company-specific). */
export const netMeteringSteps: Step[] = [
  {
    title: "Solar panels generate electricity",
    description: "Your panels convert sunlight into electricity during the day.",
    icon: "panel",
  },
  {
    title: "Your property uses the power",
    description: "Appliances and equipment use solar energy first, reducing what you draw from the grid.",
    icon: "plug",
  },
  {
    title: "Excess energy goes to the grid",
    description: "When you produce more than you use, the surplus is exported through a bi-directional meter.",
    icon: "grid",
  },
  {
    title: "You receive bill credits",
    description: "Exported energy is credited by your electric cooperative, which can help lower your bill.",
    icon: "receipt",
  },
];

/** Electric cooperatives the company publicly states it processes net-metering applications for. */
export const netMeteringCooperatives = ["NORECO 1", "NORECO 2"];

/**
 * Requirements the company currently advertises helping with.
 * Not an exhaustive or official checklist — always shown with NET_METERING_DISCLAIMER.
 */
export const requiredDocuments = [
  "Building Permit",
  "Electrical Permit",
  "Final Inspection Permit",
  "Valid government-issued ID of the owner",
];

export const NET_METERING_DISCLAIMER =
  "Requirements and processing steps may vary depending on the electric cooperative and project. Contact us for the current checklist.";

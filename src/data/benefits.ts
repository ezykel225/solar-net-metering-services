import type { IconName } from "@/components/ui/Icon";

export type Benefit = { title: string; description: string; icon: IconName };

export const benefits: Benefit[] = [
  { title: "Lower monthly bills", icon: "trendingDown", description: "Generate your own power and buy less from the grid every month." },
  { title: "Earn bill credits", icon: "receipt", description: "With net metering, your unused solar energy is credited back to you." },
  { title: "Protection from rate increases", icon: "shield", description: "Lock in part of your energy cost as utility rates continue to rise." },
  { title: "Higher property value", icon: "home", description: "Solar-powered homes and buildings are attractive to buyers and tenants." },
];

/**
 * Illustrative savings examples (placeholder figures, not a quote).
 * Percentages describe the share of the bill offset by solar.
 */
export const savingsExamples = [
  { label: "Typical home", system: "3–5 kWp", offset: 60 },
  { label: "Large home", system: "6–10 kWp", offset: 75 },
  { label: "Small business", system: "10–30 kWp", offset: 70 },
];

import type { IconName } from "@/components/ui/Icon";

export type Benefit = { title: string; description: string; icon: IconName };

/**
 * General benefits of solar, worded conservatively (no guaranteed savings,
 * bill amounts or property-value claims).
 */
export const benefits: Benefit[] = [
  {
    title: "Reduce your electricity bill",
    icon: "trendingDown",
    description: "Power your home or business with your own solar energy and buy less electricity from the grid.",
  },
  {
    title: "Earn credits with net metering",
    icon: "receipt",
    description: "With an approved net-metering application, excess solar energy you export can be credited to your account.",
  },
  {
    title: "Backup power with batteries",
    icon: "battery",
    description: "Hybrid systems with battery storage can keep selected appliances running during outages, depending on system design.",
  },
  {
    title: "Clean, renewable energy",
    icon: "leaf",
    description: "Generate electricity from sunlight right where you use it.",
  },
];

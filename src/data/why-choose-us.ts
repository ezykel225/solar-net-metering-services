import type { IconName } from "@/components/ui/Icon";

export type Reason = { title: string; description: string; icon: IconName };

export const reasons: Reason[] = [
  { title: "Experienced Team", icon: "users", description: "Trained installers and engineers who have delivered systems for homes and businesses." },
  { title: "Quality Installation", icon: "shield", description: "Tier-1 components, proper mounting and neat, code-compliant wiring on every project." },
  { title: "Reliable Support", icon: "headset", description: "Clear communication before, during and long after your system is switched on." },
  { title: "Lower Electricity Costs", icon: "trendingDown", description: "Systems sized to maximize savings so you see the difference on your monthly bill." },
  { title: "Renewable Energy", icon: "leaf", description: "Reduce your carbon footprint with clean energy produced right on your roof." },
  { title: "Net-Metering Assistance", icon: "fileText", description: "We handle the paperwork and coordinate with your utility on your behalf." },
];

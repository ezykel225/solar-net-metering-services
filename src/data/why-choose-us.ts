import type { IconName } from "@/components/ui/Icon";

export type Reason = { title: string; description: string; icon: IconName };

/** Built from confirmed information only. Owner to approve final wording. */
export const reasons: Reason[] = [
  {
    title: "Local to Negros Oriental",
    icon: "mapPin",
    description: "Based around Dumaguete City and serving nearby areas in Negros Oriental.",
  },
  {
    title: "Net-Metering Assistance",
    icon: "fileText",
    description: "We process net-metering applications for NORECO 1 and NORECO 2 customers.",
  },
  {
    title: "Hybrid & Battery Systems",
    icon: "battery",
    description: "Hybrid solar systems with inverters and battery storage, as well as standard solar installations.",
  },
  {
    title: "Brands We Work With",
    icon: "shield",
    description: "We install and promote products from brands including SRNE, Deye and LVTopsun.",
  },
  {
    title: "Lower Electricity Costs",
    icon: "trendingDown",
    description: "A properly sized system reduces how much electricity you buy from the grid. Actual savings vary.",
  },
  {
    title: "Installation Support",
    icon: "headset",
    description: "Support from site assessment and quotation through to installation.",
  },
];

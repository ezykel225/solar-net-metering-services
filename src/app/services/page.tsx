import { PageHero } from "@/components/layout/PageHero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Solar Services",
  description:
    "Residential solar, commercial solar, net-metering assistance and solar installation & support — complete solar services from design to after-sales care.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumb="Services"
        title="Our Solar Services"
        intro="Complete solar solutions for homes and businesses — designed, installed and supported by one dedicated team."
      />
      <ServicesSection detailed showHeading={false} />
      <ProcessSection />
      <WhyChooseUs />
      <CtaBanner title="Not sure which service you need?" text="Send us your latest electricity bill and we’ll recommend the right system for your property." />
    </>
  );
}

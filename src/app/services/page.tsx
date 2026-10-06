import { PageHero } from "@/components/layout/PageHero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Solar Services & Packages",
  description:
    "Residential and commercial solar installation, hybrid systems with battery storage, net-metering assistance for NORECO 1 and NORECO 2, and solar street lights.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumb="Services"
        path="/services"
        title="Our Solar Services"
        intro="Solar panels, inverters, battery storage, net-metering assistance and solar street lights — from site assessment to installation support."
      />
      <ServicesSection detailed showHeading={false} />
      <PackagesSection />
      <BrandsSection />
      <ProcessSection />
      <CtaBanner title="Not sure which system you need?" text="Send us your average monthly bill and we’ll recommend an option for your property." />
    </>
  );
}

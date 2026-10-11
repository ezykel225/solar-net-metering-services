import { PageHero } from "@/components/layout/PageHero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { PromotionsSection } from "@/components/sections/PromotionsSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Solar Products & Services",
  description:
    "Solar system supply, inverters and batteries, solar installation, system design and consultation, permits and documents, net-metering assistance, and maintenance and after-sales support in Dumaguete City.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumb="Services"
        path="/services"
        title="Solar Products & Services"
        intro="Solar systems, inverters and batteries — plus installation, system design, permits, net-metering assistance and after-sales support."
      />
      <ServicesSection detailed showHeading={false} />
      <ProductsSection />
      <PromotionsSection />
      <PackagesSection />
      <BrandsSection />
      <ProcessSection />
      <CtaBanner title="Not sure which system you need?" text="Send us your average monthly bill and we’ll recommend an option for your property." />
    </>
  );
}

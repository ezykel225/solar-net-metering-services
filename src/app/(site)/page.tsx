import { Hero } from "@/components/sections/Hero";
import { BrandBanner } from "@/components/sections/BrandBanner";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { PromotionsSection } from "@/components/sections/PromotionsSection";
import { NetMeteringSteps } from "@/components/sections/NetMeteringSteps";
import { AboutSection } from "@/components/sections/AboutSection";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { CalculatorTeaser } from "@/components/sections/CalculatorTeaser";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqSection } from "@/components/sections/FaqSection";
import { QuoteSection } from "@/components/quote/QuoteSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandBanner />
      <PromotionsSection />
      <ServicesSection />
      <ProductsSection />
      <NetMeteringSteps />
      <AboutSection />
      <WhyChooseUs />
      <ProjectsSection limit={3} />
      <BenefitsSection />
      <CalculatorTeaser />
      <Testimonials />
      <FaqSection limit={6} />
      <QuoteSection />
    </>
  );
}

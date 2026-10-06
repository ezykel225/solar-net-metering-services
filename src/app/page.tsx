import { Hero } from "@/components/sections/Hero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { NetMeteringSteps } from "@/components/sections/NetMeteringSteps";
import { AboutSection } from "@/components/sections/AboutSection";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqSection } from "@/components/sections/FaqSection";
import { QuoteSection } from "@/components/quote/QuoteSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <NetMeteringSteps />
      <AboutSection />
      <WhyChooseUs />
      <ProjectsSection limit={3} />
      <BenefitsSection />
      <Testimonials />
      <FaqSection limit={6} />
      <QuoteSection />
    </>
  );
}

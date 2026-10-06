import { PageHero } from "@/components/layout/PageHero";
import { AboutSection } from "@/components/sections/AboutSection";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { serviceAreas } from "@/data/service-areas";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import styles from "../inner-page.module.css";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Solar Net Metering Services offers solar installation, hybrid systems with battery storage and net-metering assistance in Dumaguete City and Negros Oriental.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About"
        path="/about"
        title="About Solar Net Metering Services"
        intro="Solar installation, hybrid systems and net-metering assistance for homes and businesses in Negros Oriental."
      />
      <AboutSection showLink={false} />
      <section className="section section--soft" aria-labelledby="areas-title">
        <div className="container">
          <SectionHeading id="areas-title" eyebrow="Where We Work" title="Serving Dumaguete City & Negros Oriental" intro={siteConfig.serviceAreaSummary} />
          <p className={styles.chipsLabel}>Locations of recent projects and customers include:</p>
          <ul className={styles.chips}>
            {serviceAreas.map((area) => (
              <li key={area.slug}>
                <Icon name="mapPin" size={16} /> {area.name}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <WhyChooseUs />
      <Testimonials />
      <CtaBanner spaced={false} />
    </>
  );
}

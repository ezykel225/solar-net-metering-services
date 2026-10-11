import { PageHero } from "@/components/layout/PageHero";
import { AboutSection } from "@/components/sections/AboutSection";
import { RegistrationNote } from "@/components/sections/RegistrationNote";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { serviceAreas } from "@/data/service-areas";
import { buildMetadata } from "@/lib/seo";
import styles from "../inner-page.module.css";
import { getSiteSettings } from "@/lib/cms";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "EG Solar Products Trading, based in Dumaguete City, supplies solar systems, inverters and batteries and provides installation, system design, permits, net-metering assistance and after-sales support.",
  path: "/about",
});

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        crumb="About"
        path="/about"
        title="About EG Solar Products Trading"
        intro="Solar products and solar services for homes and businesses, from Dumaguete City, Negros Oriental."
      />
      <AboutSection showLink={false} />
      <RegistrationNote />
      <section className="section section--soft" aria-labelledby="areas-title">
        <div className="container">
          <SectionHeading id="areas-title" eyebrow="Where We Work" title="Serving Dumaguete City & Negros Oriental" intro={settings.serviceAreaSummary} />
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

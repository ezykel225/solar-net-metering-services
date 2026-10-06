import { PageHero } from "@/components/layout/PageHero";
import { AboutSection } from "@/components/sections/AboutSection";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon, type IconName } from "@/components/ui/Icon";
import { buildMetadata } from "@/lib/seo";
import styles from "../inner-page.module.css";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about Solar Net Metering Services — a solar company helping homes and businesses lower electricity costs with quality installations and net-metering support.",
  path: "/about",
});

const values: { title: string; description: string; icon: IconName }[] = [
  { title: "Our Mission", icon: "sun", description: "To make solar energy simple, affordable and accessible for every home and business we serve." },
  { title: "Our Approach", icon: "users", description: "Honest advice, systems sized to real needs, and clear communication from quote to commissioning." },
  { title: "Our Commitment", icon: "shield", description: "Quality components, safe workmanship and dependable support long after installation." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About"
        title="About Solar Net Metering Services"
        intro="We help property owners take control of their electricity costs with professionally installed solar and hassle-free net metering."
      />
      <AboutSection showLink={false} />
      <section className="section section--soft" aria-labelledby="values-title">
        <div className="container">
          <SectionHeading id="values-title" eyebrow="What Drives Us" title="Mission, Approach & Commitment" />
          <ul className={styles.cards3}>
            {values.map((v) => (
              <li key={v.title} className={styles.card}>
                <span className={styles.cardIcon}>
                  <Icon name={v.icon} size={26} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.description}</p>
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

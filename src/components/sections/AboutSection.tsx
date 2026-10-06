import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import aboutImage from "../../../public/images/about.jpg";
import styles from "./AboutSection.module.css";

const points = [
  "Systems designed around your actual electricity usage",
  "End-to-end service: design, installation and net metering",
  "Transparent proposals with no hidden costs",
  "After-sales support and system monitoring",
];

export function AboutSection({ showLink = true }: { showLink?: boolean }) {
  return (
    <section className="section" aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.media}>
          <Image
            src={aboutImage}
            alt="Close-up of solar panels mounted on a sloped roof"
            placeholder="blur"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className={styles.image}
          />
          <div className={styles.experience}>
            <strong>{siteConfig.stats[1].value}</strong>
            <span>{siteConfig.stats[1].label}</span>
          </div>
        </div>
        <div>
          <SectionHeading
            id="about-title"
            align="left"
            eyebrow="About Us"
            title="Your Trusted Partner for Solar & Net Metering"
            intro={`${siteConfig.name} helps homeowners and businesses switch to clean, affordable solar energy. We handle everything — from assessing your roof and bills to installing your system and securing net-metering approval with your utility.`}
          />
          <ul className={styles.points}>
            {points.map((p) => (
              <li key={p}>
                <Icon name="checkCircle" size={20} /> {p}
              </li>
            ))}
          </ul>
          <dl className={styles.stats}>
            {siteConfig.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          {showLink ? (
            <ButtonLink href="/about" variant="secondary">
              More About Us
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}

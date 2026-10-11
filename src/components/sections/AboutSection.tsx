import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import aboutImage from "../../../public/images/about.jpg";
import styles from "./AboutSection.module.css";
import { getSiteSettings } from "@/lib/cms";

/** Confirmed offerings only (client rebrand material, Oct 2026). */
const points = [
  "Solar systems, inverters and batteries, including pre-orders",
  "Solar installation, system design and consultation",
  "Permits & documents processing and net-metering assistance (NORECO 1 & 2)",
  "Maintenance and after-sales support",
];

export async function AboutSection({ showLink = true }: { showLink?: boolean }) {
  const settings = await getSiteSettings();
  return (
    <section className="section" aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.media}>
          <Image
            src={aboutImage}
            alt="Illustration of solar panels mounted on a sloped roof"
            placeholder="blur"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className={styles.image}
          />
          <div className={styles.badge}>
            <strong>NORECO 1 &amp; 2</strong>
            <span>Net-metering assistance</span>
          </div>
        </div>
        <div>
          <SectionHeading
            id="about-title"
            align="left"
            eyebrow="About Us"
            title="Solar Products & Solar Services from Dumaguete City"
            intro={`${settings.name} supplies solar products and provides solar services for homes and businesses${
              settings.address ? `, from ${settings.address}` : ""
            }. ${settings.serviceAreaSummary}`}
          />
          <ul className={styles.points}>
            {points.map((p) => (
              <li key={p}>
                <Icon name="checkCircle" size={20} /> {p}
              </li>
            ))}
          </ul>
          {siteConfig.stats.length > 0 ? (
            <dl className={styles.stats}>
              {siteConfig.stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
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

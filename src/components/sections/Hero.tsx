import Image from "next/image";
import { QUOTE_HREF } from "@/data/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import heroImage from "../../../public/images/hero.jpg";
import styles from "./Hero.module.css";
import { getSiteSettings } from "@/lib/cms";

/** Confirmed offerings only. */
const highlights = [
  "Site assessment and quotation",
  "Net-metering assistance for NORECO 1 & NORECO 2",
  "Hybrid systems with battery storage",
];

export async function Hero() {
  const settings = await getSiteSettings();
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.badge}>
            <Icon name="mapPin" size={16} /> Serving Dumaguete City &amp; Negros Oriental
          </p>
          <h1 id="hero-title">
            Power Your Home <span className={styles.accent}>With Solar</span>
          </h1>
          <p className={styles.lead}>
            Professional solar installation and net metering solutions for homes and businesses.
          </p>
          <div className={styles.ctas}>
            <ButtonLink href={QUOTE_HREF}>
              {settings.quoteCopy.cta} <Icon name="arrowRight" size={18} />
            </ButtonLink>
            <ButtonLink href="/#how-it-works" variant="secondary">
              Learn More
            </ButtonLink>
          </div>
          <ul className={styles.highlights}>
            {highlights.map((item) => (
              <li key={item}>
                <Icon name="checkCircle" size={20} /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.media}>
          <div className={styles.imageFrame}>
            <Image
              src={heroImage}
              alt="Illustration of a home with rooftop solar panels under a sunny sky"
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={styles.image}
            />
          </div>
          <div className={`${styles.floatCard} ${styles.floatTop}`}>
            <span className={styles.floatIcon}>
              <Icon name="trendingDown" size={22} />
            </span>
            <span>
              <strong>Lower bills</strong>
              <small>Use your own solar power</small>
            </span>
          </div>
          <div className={`${styles.floatCard} ${styles.floatBottom}`}>
            <span className={styles.floatIcon}>
              <Icon name="meter" size={22} />
            </span>
            <span>
              <strong>Net metering</strong>
              <small>Earn credits for excess power</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

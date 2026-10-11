import Image from "next/image";
import { QUOTE_HREF } from "@/data/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import heroImage from "../../../public/images/hero.jpg";
import styles from "./Hero.module.css";
import { getSiteSettings } from "@/lib/cms";

/** Confirmed offerings only (client rebrand material, Oct 2026). */
const highlights = [
  "Solar systems, inverters & batteries",
  "Installation, system design & permits",
  "Net-metering assistance for NORECO 1 & NORECO 2",
];

export async function Hero() {
  const settings = await getSiteSettings();
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.badge}>
            <Icon name="sun" size={16} /> Solar Products • Solar Services
          </p>
          <h1 id="hero-title">
            Solar Products &amp; <span className={styles.accent}>Professional Solar Solutions</span>
          </h1>
          <p className={styles.lead}>
            From solar system supply and installation to system design, permits, net-metering assistance, inverters,
            batteries and after-sales support — based in Batinguel, Dumaguete City.
          </p>
          <div className={styles.ctas}>
            <ButtonLink href={QUOTE_HREF}>
              {settings.quoteCopy.cta} <Icon name="arrowRight" size={18} />
            </ButtonLink>
            <ButtonLink href="/services#products" variant="secondary">
              Products &amp; Pre-Orders
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

import Image from "next/image";
import banner from "../../../public/images/brand/eg-solar-products-trading-banner.jpg";
import styles from "./BrandBanner.module.css";

/**
 * The client's wide EG Solar Products Trading banner, shown whole (never
 * cropped) at container width so its logo and service icons stay readable.
 * Promotional artwork — not evidence of specific installations.
 */
export function BrandBanner() {
  return (
    <section className={styles.section} aria-label="EG Solar Products Trading — solar products and solar services">
      <div className="container">
        <Image
          src={banner}
          alt="EG Solar Products Trading banner: Solar Products • Solar Services — solar system supply, installation, system design and consultation, permits and documents processing, net metering assistance, and maintenance and after-sales support, with solar panels, inverters and batteries"
          sizes="(min-width: 1280px) 1200px, calc(100vw - 2rem)"
          quality={85}
          placeholder="blur"
          className={styles.image}
        />
      </div>
    </section>
  );
}

import { PACKAGES_NOTE, solarPackages } from "@/data/services";
import { QUOTE_HREF } from "@/data/navigation";
import { siteConfig } from "@/lib/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./PackagesSection.module.css";

/** Publicly advertised packages, always shown with the price/availability note. */
export function PackagesSection() {
  return (
    <section id="packages" className="section section--soft" aria-labelledby="packages-title">
      <div className="container">
        <SectionHeading
          id="packages-title"
          eyebrow="Featured Packages"
          title="Current Solar Packages"
          intro="Hybrid solar packages we currently advertise. Ask us which option suits your property."
        />
        <ul className={styles.grid}>
          {solarPackages.map((pkg) => (
            <li key={pkg.name} className={styles.card}>
              <h3 className={styles.name}>{pkg.name}</h3>
              <p className={styles.price}>
                <span className="sr-only">Price: </span>
                {pkg.price}
              </p>
              <p className={styles.includesLabel}>Package includes:</p>
              <ul className={styles.list}>
                {pkg.inclusions.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={18} /> {item}
                  </li>
                ))}
              </ul>
              <div className={styles.actions}>
                <ButtonLink href={QUOTE_HREF} block>
                  Ask About This Package
                </ButtonLink>
                <a className="btn btn--secondary btn--block" href={siteConfig.social.messenger} target="_blank" rel="noopener noreferrer">
                  <Icon name="messenger" size={18} /> Message Us
                  <span className="sr-only"> on Facebook Messenger (opens in a new tab)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          <Icon name="fileText" size={16} /> {PACKAGES_NOTE}
        </p>
      </div>
    </section>
  );
}

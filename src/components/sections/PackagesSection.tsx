import Image from "next/image";
import { PACKAGES_NOTE } from "@/data/services";
import { QUOTE_HREF } from "@/data/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPackages, getSiteSettings } from "@/lib/cms";
import styles from "./PackagesSection.module.css";

/**
 * Published, active packages from the CMS, always shown with the
 * price/availability note. Hidden entirely when no package is active.
 */
export async function PackagesSection() {
  const settings = await getSiteSettings();
  const { data: packages } = await getPackages();
  if (packages.length === 0) return null;
  return (
    <section id="packages" className="section section--soft" aria-labelledby="packages-title">
      <div className="container">
        <SectionHeading
          id="packages-title"
          eyebrow="Featured Packages"
          title="Current Solar Packages"
          intro="Solar packages we currently offer. Ask us which option suits your property."
        />
        <ul className={`${styles.grid} ${packages.length === 1 ? styles.single : ""}`}>
          {packages.map((pkg) => (
            <li key={pkg.name} className={`${styles.card} ${pkg.featured ? styles.featured : ""}`}>
              {pkg.image ? (
                <div className={styles.imageWrap}>
                  <Image src={pkg.image} alt={pkg.imageAlt ?? ""} fill sizes="(min-width: 768px) 460px, 100vw" className={styles.image} />
                </div>
              ) : null}
              {pkg.featured ? <p className={styles.badge}>Featured</p> : null}
              <h3 className={styles.name}>{pkg.name}</h3>
              <p className={styles.price}>
                <span className="sr-only">Price: </span>
                {pkg.price ?? "Price on request"}
              </p>
              {pkg.description ? <p className={styles.description}>{pkg.description}</p> : null}
              {pkg.inclusions.length > 0 ? (
                <>
                  <p className={styles.includesLabel}>Package includes:</p>
                  <ul className={styles.list}>
                    {pkg.inclusions.map((item) => (
                      <li key={item}>
                        <Icon name="check" size={18} /> {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {pkg.note && pkg.note !== PACKAGES_NOTE ? <p className={styles.cardNote}>{pkg.note}</p> : null}
              <div className={styles.actions}>
                <ButtonLink href={QUOTE_HREF} block>
                  Ask About This Package
                </ButtonLink>
                <a className="btn btn--secondary btn--block" href={settings.messenger} target="_blank" rel="noopener noreferrer">
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

import { PRODUCTS_NOTE, productLines } from "@/data/services";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSiteSettings } from "@/lib/cms";
import styles from "./ProductsSection.module.css";

/** Prefills the quote form with "Product Inquiry / Pre-Order" (see quotePrefillFromParams). */
export const PRODUCT_INQUIRY_HREF = "/contact?service=product#quote";

/**
 * Solar products & pre-orders (confirmed in the client's promotional material).
 * Inquiry only — no shop, no stock or price claims.
 */
export async function ProductsSection() {
  const settings = await getSiteSettings();
  return (
    <section id="products" className={`section section--soft ${styles.section}`} aria-labelledby="products-title">
      <div className="container">
        <SectionHeading
          id="products-title"
          eyebrow="Solar Products"
          title="Solar Products & Pre-Orders"
          intro="Looking for an inverter, batteries or a complete solar system? Tell us what you need and we’ll confirm models, availability and pricing."
        />
        <ul className={styles.grid}>
          {productLines.map((p) => (
            <li key={p.title} className={styles.card}>
              <span className={styles.icon} aria-hidden="true">
                <Icon name={p.icon} size={26} />
              </span>
              <h3 className={styles.title}>{p.title}</h3>
              <p>{p.description}</p>
              {p.brands.length > 0 ? (
                <p className={styles.brands}>
                  <span className={styles.brandsLabel}>Brands include:</span> {p.brands.join(", ")}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          <Icon name="fileText" size={16} /> {PRODUCTS_NOTE}
        </p>
        <div className={styles.ctas}>
          <ButtonLink href={PRODUCT_INQUIRY_HREF}>
            Ask About Product Availability <Icon name="arrowRight" size={18} />
          </ButtonLink>
          <a className="btn btn--secondary" href={settings.messenger} target="_blank" rel="noopener noreferrer">
            <Icon name="messenger" size={18} /> Message Us<span className="sr-only"> on Facebook Messenger (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}

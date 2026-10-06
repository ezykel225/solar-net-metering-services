import { brands } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./BrandsSection.module.css";

/** Brands the company publicly uses/promotes. Text only — no logos, no partnership claim. */
export function BrandsSection() {
  return (
    <section className="section" aria-labelledby="brands-title">
      <div className="container">
        <SectionHeading
          id="brands-title"
          eyebrow="Equipment"
          title="Brands We Work With"
          intro="We install and promote solar products from brands including:"
        />
        <ul className={styles.list}>
          {brands.map((brand) => (
            <li key={brand}>{brand}</li>
          ))}
        </ul>
        <p className={styles.note}>
          Brand names are trademarks of their respective owners. Listing a brand does not indicate an official
          partnership or certification.
        </p>
      </div>
    </section>
  );
}

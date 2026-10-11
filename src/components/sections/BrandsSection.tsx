import { brandGroups } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./BrandsSection.module.css";

/** Brands shown in the client's current promotional material. Text only — no logos, no partnership claim. */
export function BrandsSection() {
  return (
    <section className="section" aria-labelledby="brands-title">
      <div className="container">
        <SectionHeading
          id="brands-title"
          eyebrow="Brands"
          title="Brands and Products We Offer or Promote"
          intro="Inverters and batteries from brands including:"
        />
        {brandGroups.map((group) => (
          <div key={group.category} className={styles.group}>
            <h3 className={styles.groupTitle}>{group.category}</h3>
            <ul className={styles.list}>
              {group.brands.map((brand) => (
                <li key={brand}>{brand}</li>
              ))}
            </ul>
          </div>
        ))}
        <p className={styles.note}>
          Brand names are trademarks of their respective owners. Listing a brand does not indicate an official
          partnership, authorized dealership or certification. Availability varies.
        </p>
      </div>
    </section>
  );
}

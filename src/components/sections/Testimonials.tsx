import { testimonials } from "@/data/testimonials";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Testimonials.module.css";

/** Shows confirmed testimonials only. Renders nothing if the list is empty. */
export function Testimonials() {
  if (testimonials.length === 0) return null;
  const single = testimonials.length === 1;
  return (
    <section className={`section ${single ? styles.compact : ""}`} aria-labelledby="testimonials-title">
      <div className={`container ${single ? styles.singleLayout : ""}`}>
        <SectionHeading
          id="testimonials-title"
          eyebrow="Testimonials"
          title="What Our Clients Say"
          intro="Feedback shared by our customers."
          align={single ? "left" : "center"}
        />
        <ul className={`${styles.grid} ${single ? styles.single : ""}`}>
          {testimonials.map((t) => (
            <li key={t.name}>
              <figure className={styles.card}>
                <Icon name="quote" size={34} className={styles.quoteIcon} />
                <blockquote className={styles.quote} lang={t.lang}>
                  <p>“{t.quote}”</p>
                </blockquote>
                {t.translation ? (
                  <p className={styles.translation}>
                    <span className={styles.translationLabel}>English translation: </span>“{t.translation}”
                  </p>
                ) : null}
                <figcaption className={styles.author}>
                  <span className={styles.avatar} aria-hidden="true">
                    {t.name.replace(/^Ma[’']am\s+/, "").charAt(0)}
                  </span>
                  <span>
                    <strong>{t.name}</strong>
                    {t.detail ? <span>{t.detail}</span> : <span>Customer</span>}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { testimonials } from "@/data/testimonials";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  return (
    <section className="section" aria-labelledby="testimonials-title">
      <div className="container">
        <SectionHeading
          id="testimonials-title"
          eyebrow="Testimonials"
          title="What Our Clients Say"
          intro="Homeowners and businesses trust us to deliver reliable solar systems and savings."
        />
        <ul className={styles.grid}>
          {testimonials.map((t) => (
            <li key={t.name}>
              <figure className={styles.card}>
                <Icon name="quote" size={34} className={styles.quoteIcon} />
                <div className={styles.stars} role="img" aria-label="Rated 5 out of 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" size={18} />
                  ))}
                </div>
                <blockquote className={styles.quote}>
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption className={styles.author}>
                  <span className={styles.avatar} aria-hidden="true">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <strong>{t.name}</strong>
                    <span>
                      {t.role} · {t.location}
                    </span>
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

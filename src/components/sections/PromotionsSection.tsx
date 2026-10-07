import Image from "next/image";
import Link from "next/link";
import { getActivePromotions } from "@/lib/cms";
import { formatIsoDate } from "@/lib/solar-calculator";
import { Icon } from "@/components/ui/Icon";
import styles from "./PromotionsSection.module.css";

/**
 * Temporary offers managed in Admin → Promotions.
 * Renders nothing unless a promotion is active and within its date range
 * (checked by the database policy), so old offers disappear automatically.
 */
export async function PromotionsSection() {
  const promotions = await getActivePromotions();
  if (promotions.length === 0) return null;
  return (
    <section className={styles.section} aria-label="Current promotions">
      <div className="container">
        <ul className={styles.list}>
          {promotions.map((p) => {
            const ends = formatIsoDate(p.endsOn);
            const external = p.ctaUrl?.startsWith("https://");
            return (
              <li key={p.id} className={styles.card}>
                {p.image ? (
                  <div className={styles.imageWrap}>
                    <Image src={p.image} alt={p.imageAlt ?? ""} fill sizes="(min-width: 768px) 280px, 100vw" className={styles.image} />
                  </div>
                ) : null}
                <div className={styles.body}>
                  <p className={styles.eyebrow}>
                    <Icon name="star" size={14} /> Promotion
                    {p.discountLabel ? <span className={styles.discount}>{p.discountLabel}</span> : null}
                  </p>
                  <h2 className={styles.title}>{p.title}</h2>
                  {p.description ? <p className={styles.description}>{p.description}</p> : null}
                  <div className={styles.meta}>
                    {p.price ? <span className={styles.price}>{p.price}</span> : null}
                    {ends ? <span className={styles.ends}>Until {ends}</span> : null}
                  </div>
                  <p className={styles.terms}>Subject to availability and confirmation.</p>
                </div>
                {p.ctaUrl && p.ctaLabel ? (
                  external ? (
                    <a className={`btn btn--primary ${styles.cta}`} href={p.ctaUrl} target="_blank" rel="noopener noreferrer">
                      {p.ctaLabel} <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link className={`btn btn--primary ${styles.cta}`} href={p.ctaUrl}>
                      {p.ctaLabel}
                    </Link>
                  )
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

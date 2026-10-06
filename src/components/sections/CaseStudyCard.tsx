import { featuredCaseStudy, formatPeso, SAVINGS_DISCLAIMER } from "@/data/case-studies";
import { Icon } from "@/components/ui/Icon";
import styles from "./CaseStudyCard.module.css";

/**
 * Before/after bill comparison for a customer result the company shared publicly.
 * Always rendered with the savings disclaimer; never presented as a guarantee.
 */
export function CaseStudyCard({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const cs = featuredCaseStudy;
  const Heading = headingLevel;
  const afterWidth = Math.max((cs.billAfter / cs.billBefore) * 100, 3);
  return (
    <figure className={styles.card}>
      <div className={styles.head}>
        <span className={styles.icon}>
          <Icon name="chart" size={22} />
        </span>
        <div>
          <p className={styles.eyebrow}>Customer Result</p>
          <Heading className={styles.title}>{cs.system}</Heading>
        </div>
      </div>

      <dl className={styles.bars}>
        <div>
          <dt>Monthly bill before solar</dt>
          <dd>
            <span className={styles.amount}>about {formatPeso(cs.billBefore)}</span>
            <span className={styles.track} aria-hidden="true">
              <span className={`${styles.fill} ${styles.before}`} style={{ width: "100%" }} />
            </span>
          </dd>
        </div>
        <div>
          <dt>Monthly bill {cs.period}</dt>
          <dd>
            <span className={styles.amount}>about {formatPeso(cs.billAfter)}</span>
            <span className={styles.track} aria-hidden="true">
              <span className={`${styles.fill} ${styles.after}`} style={{ width: `${afterWidth}%` }} />
            </span>
          </dd>
        </div>
      </dl>

      <figcaption className={styles.note}>
        Result shared by one of our customers. This is not a guaranteed or typical result. {SAVINGS_DISCLAIMER}
      </figcaption>
    </figure>
  );
}

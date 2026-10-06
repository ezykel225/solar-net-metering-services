import { benefits, savingsExamples } from "@/data/benefits";
import { QUOTE_HREF } from "@/data/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./BenefitsSection.module.css";

export function BenefitsSection() {
  return (
    <section className="section section--soft" aria-labelledby="benefits-title">
      <div className={`container ${styles.grid}`}>
        <div>
          <SectionHeading
            id="benefits-title"
            align="left"
            eyebrow="Benefits"
            title="Save on Electricity, Year After Year"
            intro="Solar with net metering turns your roof into a long-term investment that keeps paying you back."
          />
          <ul className={styles.list}>
            {benefits.map((b) => (
              <li key={b.title}>
                <span className={styles.icon}>
                  <Icon name={b.icon} size={22} />
                </span>
                <div>
                  <h3>{b.title}</h3>
                  <p>{b.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <figure className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardIcon}>
              <Icon name="chart" size={22} />
            </span>
            <div>
              <h3>Estimated bill offset</h3>
              <p>Share of a typical monthly bill covered by solar</p>
            </div>
          </div>
          <ul className={styles.bars}>
            {savingsExamples.map((ex) => (
              <li key={ex.label}>
                <div className={styles.barLabel}>
                  <span>
                    <strong>{ex.label}</strong> · {ex.system}
                  </span>
                  <span className={styles.barValue}>up to {ex.offset}%</span>
                </div>
                <div className={styles.track} aria-hidden="true">
                  <span className={styles.fill} style={{ width: `${ex.offset}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <figcaption className={styles.note}>
            Illustrative figures only. Actual savings depend on consumption, roof orientation, system size and
            utility rates. Request a free quote for an estimate based on your own bills.
          </figcaption>
          <ButtonLink href={QUOTE_HREF} block>
            Get My Savings Estimate
          </ButtonLink>
        </figure>
      </div>
    </section>
  );
}

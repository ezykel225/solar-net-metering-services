import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon, type IconName } from "@/components/ui/Icon";
import styles from "./CalculatorTeaser.module.css";

const previews: { icon: IconName; label: string }[] = [
  { icon: "sun", label: "Suggested system size" },
  { icon: "panel", label: "Number of panels" },
  { icon: "trendingDown", label: "Estimated bill reduction range" },
  { icon: "battery", label: "Battery recommendation" },
];

/** Homepage teaser linking to the Solar Calculator. */
export function CalculatorTeaser() {
  return (
    <section className={styles.section} aria-labelledby="calc-teaser-title">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              <Icon name="chart" size={16} /> Solar Calculator
            </p>
            <h2 id="calc-teaser-title">Estimate Your Solar Needs</h2>
            <p>Enter your average monthly bill and a few details to get an initial estimate in under a minute.</p>
            <ButtonLink href="/solar-calculator">
              Try the Solar Calculator <Icon name="arrowRight" size={18} />
            </ButtonLink>
          </div>
          <ul className={styles.previews} aria-label="What the calculator estimates">
            {previews.map((p) => (
              <li key={p.label}>
                <span className={styles.previewIcon}>
                  <Icon name={p.icon} size={20} />
                </span>
                {p.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

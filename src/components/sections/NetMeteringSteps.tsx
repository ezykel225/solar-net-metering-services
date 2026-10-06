import { netMeteringSteps } from "@/data/net-metering";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./NetMeteringSteps.module.css";

export function NetMeteringSteps({ showLink = true }: { showLink?: boolean }) {
  return (
    <section id="how-it-works" className="section section--soft" aria-labelledby="how-title">
      <div className="container">
        <SectionHeading
          id="how-title"
          eyebrow="How It Works"
          title="How Solar Net Metering Works"
          intro="Net metering lets you send unused solar energy to the grid and receive credits that lower your electricity bill."
        />
        <ol className={styles.steps}>
          {netMeteringSteps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <div className={styles.iconWrap}>
                <span className={styles.icon}>
                  <Icon name={step.icon} size={30} />
                </span>
                <span className={styles.number} aria-hidden="true">
                  {index + 1}
                </span>
              </div>
              <h3>
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
        {showLink ? (
          <div className={styles.footer}>
            <ButtonLink href="/net-metering" variant="secondary">
              Learn more about net metering
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}

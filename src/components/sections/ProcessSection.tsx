import { installationProcess } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ProcessSection.module.css";

export function ProcessSection() {
  return (
    <section className="section section--soft" aria-labelledby="process-title">
      <div className="container">
        <SectionHeading
          id="process-title"
          eyebrow="Our Process"
          title="From Consultation to Clean Energy"
          intro="A clear, step-by-step process so you always know what happens next."
        />
        <ol className={styles.list}>
          {installationProcess.map((step, i) => (
            <li key={step.title} className={styles.item}>
              <span className={styles.number} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

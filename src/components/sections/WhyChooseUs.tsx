import { reasons } from "@/data/why-choose-us";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./WhyChooseUs.module.css";

export function WhyChooseUs() {
  return (
    <section className="section section--navy" aria-labelledby="why-title">
      <div className="container">
        <SectionHeading
          id="why-title"
          onDark
          eyebrow="Why Choose Us"
          title="Solar Done Right, From Start to Finish"
          intro="Local service, net-metering assistance and hybrid solar options — from site assessment to installation."
        />
        <ul className={styles.grid}>
          {reasons.map((reason) => (
            <li key={reason.title} className={styles.item}>
              <span className={styles.icon}>
                <Icon name={reason.icon} size={26} />
              </span>
              <div>
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

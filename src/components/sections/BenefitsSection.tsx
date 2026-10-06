import { benefits } from "@/data/benefits";
import { QUOTE_HREF } from "@/data/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CaseStudyCard } from "./CaseStudyCard";
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
            title="Why Homeowners and Businesses Go Solar"
            intro="Solar energy, net metering and battery storage can help you take more control of your electricity costs."
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

        <div className={styles.side}>
          <CaseStudyCard />
          <ButtonLink href={QUOTE_HREF} block>
            Get a Quote for Your Property
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

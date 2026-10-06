import { siteConfig } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuoteForm } from "./QuoteForm";
import styles from "./QuoteSection.module.css";

const steps = ["Send your details", "We review your bill & property", "Receive your quotation"];

export function QuoteSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  return (
    <section id="quote" className={`section ${styles.section}`} aria-labelledby="quote-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.info}>
          <SectionHeading
            id="quote-title"
            as={headingLevel}
            align="left"
            onDark
            eyebrow="Free Quotation"
            title="Get a Free Solar Quote"
            intro="Tell us a little about your property and electricity use, and we’ll get back to you with a quotation."
          />
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <li key={s}>
                <span aria-hidden="true">{i + 1}</span> {s}
              </li>
            ))}
          </ol>
          <ul className={styles.contact}>
            <li>
              <span className={styles.contactIcon}>
                <Icon name="phone" size={20} />
              </span>
              <span>
                <small>Call us</small>
                <a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a>
              </span>
            </li>
            <li>
              <span className={styles.contactIcon}>
                <Icon name="mail" size={20} />
              </span>
              <span>
                <small>Email us</small>
                <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              </span>
            </li>
            <li>
              <span className={styles.contactIcon}>
                <Icon name="messenger" size={20} />
              </span>
              <span>
                <small>Message us</small>
                <a href={siteConfig.social.messenger} target="_blank" rel="noopener noreferrer">
                  Facebook Messenger<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </span>
            </li>
            <li>
              <span className={styles.contactIcon}>
                <Icon name="mapPin" size={20} />
              </span>
              <span>
                <small>Service area</small>
                {siteConfig.contact.address ?? siteConfig.serviceAreaShort}
              </span>
            </li>
            {siteConfig.contact.hours ? (
              <li>
                <span className={styles.contactIcon}>
                  <Icon name="clock" size={20} />
                </span>
                <span>
                  <small>Office hours</small>
                  {siteConfig.contact.hours}
                </span>
              </li>
            ) : null}
          </ul>
        </div>
        <div className={styles.formCard}>
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}

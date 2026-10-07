
import { EmailText } from "@/components/ui/EmailText";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Suspense } from "react";
import { QuoteForm } from "./QuoteForm";
import { QuoteFormWithPrefill } from "./QuoteFormWithPrefill";
import styles from "./QuoteSection.module.css";
import { getSiteSettings } from "@/lib/cms";

const steps = ["Send your details", "We review your bill & property", "Receive your quotation"];

export async function QuoteSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const settings = await getSiteSettings();
  return (
    <section id="quote" className={`section ${styles.section}`} aria-labelledby="quote-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.info}>
          <SectionHeading
            id="quote-title"
            as={headingLevel}
            align="left"
            onDark
            eyebrow={settings.quoteCopy.eyebrow}
            title={settings.quoteCopy.heading}
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
                <a href={settings.phoneHref}>{settings.phone}</a>
              </span>
            </li>
            <li>
              <span className={styles.contactIcon}>
                <Icon name="mail" size={20} />
              </span>
              <span>
                <small>Email us</small>
                <a href={`mailto:${settings.email}`}>
                  <EmailText email={settings.email} />
                </a>
              </span>
            </li>
            <li>
              <span className={styles.contactIcon}>
                <Icon name="messenger" size={20} />
              </span>
              <span>
                <small>Message us</small>
                <a href={settings.messenger} target="_blank" rel="noopener noreferrer">
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
                {settings.address ?? settings.serviceAreaShort}
              </span>
            </li>
            {settings.hours ? (
              <li>
                <span className={styles.contactIcon}>
                  <Icon name="clock" size={20} />
                </span>
                <span>
                  <small>Office hours</small>
                  {settings.hours}
                </span>
              </li>
            ) : null}
          </ul>
        </div>
        <div className={styles.formCard}>
          {/* useSearchParams needs a Suspense boundary on statically rendered pages;
              the fallback is the same form without pre-filled values. */}
          <Suspense fallback={<QuoteForm />}>
            <QuoteFormWithPrefill />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

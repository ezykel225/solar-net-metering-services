import { faqs, type Faq } from "@/data/faqs";
import { QUOTE_HREF, quoteCopy } from "@/data/navigation";
import { siteConfig } from "@/lib/site";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./FaqSection.module.css";

type FaqSectionProps = {
  items?: Faq[];
  limit?: number;
  showHeading?: boolean;
};

export function FaqSection({ items = faqs, limit, showHeading = true }: FaqSectionProps) {
  const list = limit ? items.slice(0, limit) : items;
  return (
    <section className="section section--soft" aria-labelledby="faq-title">
      <div className={`container ${styles.grid}`}>
        <div>
          {showHeading ? (
            <SectionHeading
              id="faq-title"
              align="left"
              eyebrow="FAQs"
              title="Frequently Asked Questions"
              intro="Answers to common questions about solar installation and net metering."
            />
          ) : (
            <h2 id="faq-title" className="sr-only">
              Questions and answers
            </h2>
          )}
          <aside className={styles.help} aria-label="Need more help?">
            <span className={styles.helpIcon}>
              <Icon name="headset" size={26} />
            </span>
            <h3>Still have questions?</h3>
            <p>Message us or call, and we’ll explain your options and the net-metering process.</p>
            <div className={styles.helpActions}>
              <ButtonLink href={QUOTE_HREF} size="sm">
                {quoteCopy.ask}
              </ButtonLink>
              <a className={styles.phone} href={siteConfig.social.messenger} target="_blank" rel="noopener noreferrer">
                <Icon name="messenger" size={16} /> Message Us
                <span className="sr-only"> on Facebook Messenger (opens in a new tab)</span>
              </a>
              <a className={styles.phone} href={siteConfig.contact.phoneHref}>
                <Icon name="phone" size={16} /> {siteConfig.contact.phone}
              </a>
            </div>
          </aside>
        </div>
        <Accordion items={list} />
      </div>
    </section>
  );
}

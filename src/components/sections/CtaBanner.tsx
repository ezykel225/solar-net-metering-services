import { QUOTE_CTA, QUOTE_HREF } from "@/data/navigation";
import { siteConfig } from "@/lib/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import styles from "./CtaBanner.module.css";

type CtaBannerProps = {
  title?: string;
  text?: string;
  /** Adds top spacing; disable when the previous section is also white. */
  spaced?: boolean;
};

export function CtaBanner({
  title = "Ready to lower your electricity bill?",
  text = "Request a site assessment and quotation for your home or business, or message us with your questions.",
  spaced = true,
}: CtaBannerProps) {
  return (
    <section className={`${styles.wrap} ${spaced ? styles.spaced : ""}`} aria-labelledby="cta-title">
      <div className="container">
        <div className={styles.banner}>
          <div>
            <h2 id="cta-title">{title}</h2>
            <p>{text}</p>
          </div>
          <div className={styles.actions}>
            <ButtonLink href={QUOTE_HREF}>
              {QUOTE_CTA} <Icon name="arrowRight" size={18} />
            </ButtonLink>
            <a className="btn btn--light" href={siteConfig.social.messenger} target="_blank" rel="noopener noreferrer">
              <Icon name="messenger" size={18} /> Message Us
              <span className="sr-only"> on Facebook Messenger (opens in a new tab)</span>
            </a>
            <a className="btn btn--light" href={siteConfig.contact.phoneHref}>
              <Icon name="phone" size={18} /> Call Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

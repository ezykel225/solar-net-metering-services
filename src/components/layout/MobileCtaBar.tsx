import { QUOTE_HREF } from "@/data/navigation";
import { siteConfig } from "@/lib/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import styles from "./MobileCtaBar.module.css";

/** Sticky call-to-action bar shown on phones only. */
export function MobileCtaBar() {
  return (
    <div className={styles.bar}>
      <a className={`btn btn--secondary btn--sm ${styles.call}`} href={siteConfig.contact.phoneHref}>
        <Icon name="phone" size={18} /> Call
      </a>
      <ButtonLink href={QUOTE_HREF} size="sm" className={styles.quote}>
        Get a Free Quote
      </ButtonLink>
    </div>
  );
}

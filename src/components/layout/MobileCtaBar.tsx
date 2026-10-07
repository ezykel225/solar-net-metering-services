"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { QUOTE_HREF } from "@/data/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import styles from "./MobileCtaBar.module.css";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

/**
 * Sticky call-to-action bar shown on phones only. It slides away while the
 * quote form (#quote) is on screen, where it would be redundant and would
 * cover the submit button.
 */
export function MobileCtaBar() {
  const settings = useSiteSettings();
  const pathname = usePathname();
  // Keyed by pathname so a stale "visible" value never carries over to a page
  // without a quote form.
  const [quoteVisibleOn, setQuoteVisibleOn] = useState<string | null>(null);
  const quoteVisible = quoteVisibleOn === pathname;

  useEffect(() => {
    const quote = document.getElementById("quote");
    if (!quote || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setQuoteVisibleOn(entry.isIntersecting ? pathname : null),
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(quote);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div className={`${styles.bar} ${quoteVisible ? styles.hidden : ""}`} data-mobile-cta inert={quoteVisible}>
      <a className={`btn btn--secondary btn--sm ${styles.call}`} href={settings.phoneHref}>
        <Icon name="phone" size={18} /> Call
      </a>
      <a
        className={`btn btn--secondary btn--sm ${styles.messenger}`}
        href={settings.messenger}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message us on Facebook Messenger (opens in a new tab)"
      >
        <Icon name="messenger" size={20} />
      </a>
      <ButtonLink href={QUOTE_HREF} size="sm" className={styles.quote}>
        {settings.quoteCopy.cta}
      </ButtonLink>
    </div>
  );
}

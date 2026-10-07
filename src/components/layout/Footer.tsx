import Link from "next/link";
import { mainNav, QUOTE_CTA, QUOTE_HREF } from "@/data/navigation";
import { services } from "@/data/services";
import { siteConfig } from "@/lib/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmailText } from "@/components/ui/EmailText";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo onDark />
          <p>
            {siteConfig.description} {siteConfig.serviceAreaSummary}
          </p>
          <ul className={styles.socialList}>
            <li>
              <a className={styles.social} href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">
                <Icon name="facebook" size={18} />
                Follow us on Facebook
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a className={styles.social} href={siteConfig.social.messenger} target="_blank" rel="noopener noreferrer">
                <Icon name="messenger" size={18} />
                Message us on Messenger
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className={styles.title}>Quick Links</h2>
          <ul className={styles.links}>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={styles.title}>Services</h2>
          <ul className={styles.links}>
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services#${service.slug}`}>{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.contactCol}>
          <h2 className={styles.title}>Contact</h2>
          <ul className={styles.contact}>
            <li>
              <Icon name="phone" size={18} />
              <a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a>
            </li>
            <li>
              <Icon name="mail" size={18} />
              <a href={`mailto:${siteConfig.contact.email}`}>
                <EmailText email={siteConfig.contact.email} />
              </a>
            </li>
            <li>
              <Icon name="mapPin" size={18} />
              <span>{siteConfig.contact.address ?? siteConfig.serviceAreaShort}</span>
            </li>
            {siteConfig.contact.hours ? (
              <li>
                <Icon name="clock" size={18} />
                <span>{siteConfig.contact.hours}</span>
              </li>
            ) : null}
          </ul>
          <ButtonLink href={QUOTE_HREF} size="sm" className={styles.cta}>
            {QUOTE_CTA}
          </ButtonLink>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Clean energy for homes and businesses.</p>
        </div>
      </div>
    </footer>
  );
}

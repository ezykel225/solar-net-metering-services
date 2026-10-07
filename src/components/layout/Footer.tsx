import Link from "next/link";
import { mainNav, QUOTE_HREF } from "@/data/navigation";
import { siteConfig } from "@/lib/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmailText } from "@/components/ui/EmailText";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";
import { getServices, getSiteSettings } from "@/lib/cms";

export async function Footer() {
  const settings = await getSiteSettings();
  const { data: services } = await getServices();
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo onDark />
          <p>
            {siteConfig.description} {settings.serviceAreaSummary}
          </p>
          <ul className={styles.socialList}>
            <li>
              <a className={styles.social} href={settings.facebook} target="_blank" rel="noopener noreferrer">
                <Icon name="facebook" size={18} />
                Follow us on Facebook
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a className={styles.social} href={settings.messenger} target="_blank" rel="noopener noreferrer">
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
              <a href={settings.phoneHref}>{settings.phone}</a>
            </li>
            <li>
              <Icon name="mail" size={18} />
              <a href={`mailto:${settings.email}`}>
                <EmailText email={settings.email} />
              </a>
            </li>
            <li>
              <Icon name="mapPin" size={18} />
              <span>{settings.address ?? settings.serviceAreaShort}</span>
            </li>
            {settings.hours ? (
              <li>
                <Icon name="clock" size={18} />
                <span>{settings.hours}</span>
              </li>
            ) : null}
          </ul>
          <ButtonLink href={QUOTE_HREF} size="sm" className={styles.cta}>
            {settings.quoteCopy.cta}
          </ButtonLink>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p>
            © {year} {settings.name}. All rights reserved.
          </p>
          <p>
            <Link href="/privacy">Privacy Policy</Link>
          </p>
          <p>Clean energy for homes and businesses.</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, QUOTE_HREF } from "@/data/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import styles from "./Header.module.css";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const settings = useSiteSettings();
  const pathname = usePathname();
  // The menu is tied to the page it was opened on, so any navigation
  // (nav link, logo, browser back) closes it automatically.
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const menuOpen = menuOpenOn === pathname;
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the mobile menu is open: Escape closes it (returning focus to the
  // toggle), page scroll is locked, and content behind it is made inert so
  // keyboard and screen-reader users stay inside the menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpenOn(null);
        toggleRef.current?.focus();
      }
    };
    const background = document.querySelectorAll<HTMLElement>("main, footer, .skip-link, [data-mobile-cta]");
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    background.forEach((el) => (el.inert = true));
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      background.forEach((el) => (el.inert = false));
    };
  }, [menuOpen]);

  // Close the menu if the viewport grows to desktop width.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpenOn(null);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const closeMenu = () => setMenuOpenOn(null);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.topbar}>
        <div className={`container ${styles.topbarInner}`}>
          <p className={styles.topbarText}>
            <Icon name="sun" size={16} /> Solar installation &amp; net-metering assistance
          </p>
          <ul className={styles.topbarLinks}>
            <li>
              <a href={settings.phoneHref}>
                <Icon name="phone" size={15} /> {settings.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`}>
                <Icon name="mail" size={15} /> {settings.email}
              </a>
            </li>
            <li>
              <a href={settings.messenger} target="_blank" rel="noopener noreferrer">
                <Icon name="messenger" size={15} /> Message Us
                <span className="sr-only"> on Facebook Messenger (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook page (opens in a new tab)">
                <Icon name="facebook" size={15} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bar}`}>
        <Logo />

        <nav className={styles.desktopNav} aria-label="Main">
          <ul>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.navLink}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.shortLabel ? (
                    <>
                      <span className={styles.labelFull}>{item.label}</span>
                      <span className={styles.labelShort} aria-hidden="true">
                        {item.shortLabel}
                      </span>
                      <span className={`sr-only ${styles.labelShortSr}`}>{item.label}</span>
                    </>
                  ) : (
                    item.label
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ButtonLink href={QUOTE_HREF} size="sm" className={styles.quoteBtn}>
            {settings.quoteCopy.cta}
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpenOn(menuOpen ? null : pathname)}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={26} />
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={styles.mobileMenu} hidden={!menuOpen}>
        <nav aria-label="Mobile" className="container">
          <ul className={styles.mobileList}>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.mobileLink}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {item.label}
                  <Icon name="arrowRight" size={18} />
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.mobileCta}>
            <ButtonLink href={QUOTE_HREF} block onClick={closeMenu}>
              {settings.quoteCopy.cta}
            </ButtonLink>
            <a className="btn btn--secondary btn--block" href={settings.messenger} target="_blank" rel="noopener noreferrer">
              <Icon name="messenger" size={18} /> Message Us on Messenger
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a className="btn btn--secondary btn--block" href={settings.phoneHref}>
              <Icon name="phone" size={18} /> Call {settings.phone}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

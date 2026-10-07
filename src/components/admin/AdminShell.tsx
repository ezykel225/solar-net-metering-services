"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { signOutAction } from "@/app/admin/actions/auth";
import { Icon, type IconName } from "@/components/ui/Icon";
import styles from "./admin.module.css";

type NavItem = { href: string; label: string; icon: IconName };

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "chart" },
  { href: "/admin/projects", label: "Projects", icon: "panel" },
  { href: "/admin/packages", label: "Solar Packages", icon: "battery" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "quote" },
  { href: "/admin/services", label: "Services", icon: "wrench" },
  { href: "/admin/faqs", label: "FAQs", icon: "fileText" },
  { href: "/admin/promotions", label: "Promotions", icon: "star" },
  { href: "/admin/quotes", label: "Quote Requests", icon: "mail" },
  { href: "/admin/settings", label: "Business Settings", icon: "building" },
  { href: "/admin/calculator", label: "Calculator Settings", icon: "sun" },
];

const isCurrent = (pathname: string, href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

export function AdminShell({ email, newQuotes, children }: { email: string | null; newQuotes: number; children: ReactNode }) {
  const pathname = usePathname();
  // Menu is tied to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const title = adminNav.slice().reverse().find((n) => isCurrent(pathname, n.href))?.label ?? "Admin";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={styles.shell}>
      {open ? <button type="button" className={styles.backdrop} aria-label="Close menu" onClick={() => setOpenOn(null)} /> : null}
      <aside id="admin-sidebar" className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`} aria-label="Admin">
        <Link href="/admin" className={styles.brand}>
          <span className={styles.brandMark}>
            <Icon name="sun" size={20} />
          </span>
          <span>
            Solar Net Metering
            <small>Admin</small>
          </span>
        </Link>
        <nav aria-label="Admin sections">
          <ul className={styles.nav}>
            {adminNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>
                  <Icon name={item.icon} size={18} />
                  {item.label}
                  {item.href === "/admin/quotes" && newQuotes > 0 ? (
                    <span className={styles.navBadge} aria-label={`${newQuotes} new`}>
                      {newQuotes}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.sidebarFooter}>
          <form action={signOutAction}>
            <button type="submit" className={`${styles.navLink} ${styles.logoutButton}`}>
              <Icon name="arrowRight" size={18} /> Logout
            </button>
          </form>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="admin-sidebar"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
          <p className={styles.topbarTitle}>{title}</p>
          <div className={styles.topbarRight}>
            {email ? <span className={styles.userEmail}>{email}</span> : null}
            <Link href="/" className={styles.viewSite} target="_blank" rel="noopener">
              View website<span className="sr-only"> (opens in a new tab)</span>
            </Link>
          </div>
        </header>
        <main id="admin-main" className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

import Link from "next/link";
import { siteConfig } from "@/lib/site";
import styles from "./Logo.module.css";

/**
 * Text + mark logo. TODO: swap the inline mark for the official logo file
 * (e.g. /public/images/logo.svg) when it is provided.
 */
export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className={`${styles.logo} ${onDark ? styles.onDark : ""}`} aria-label={`${siteConfig.name} — Home`}>
      <svg className={styles.mark} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle cx="24" cy="15" r="7" fill="#f5891f" />
        <path
          d="M24 3v3M24 24v3M12 15H9M39 15h-3M15.5 6.5l2 2M30.5 21.5l2 2M15.5 23.5l2-2M30.5 8.5l2-2"
          stroke="#f5891f"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path d="M8 30h32l4 14H4z" fill="currentColor" />
        <path d="M17 30l-1.5 14M31 30l1.5 14M6 37h36" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.5" />
      </svg>
      <span className={styles.text}>
        <span className={styles.name}>Solar Net Metering</span>
        <span className={styles.sub}>Services</span>
      </span>
    </Link>
  );
}

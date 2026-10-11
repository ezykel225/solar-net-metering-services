import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import styles from "./Logo.module.css";

/**
 * Site logo. Uses the official logo file once siteConfig.logo is set;
 * until then, the business name with a simple sun mark (not an official logo).
 */
export function Logo({ onDark = false }: { onDark?: boolean }) {
  const official = siteConfig.logo;
  if (official) {
    const src = onDark && official.onDarkSrc ? official.onDarkSrc : official.src;
    return (
      <Link href="/" className={`${styles.logo} ${onDark ? styles.onDark : ""}`}>
        <Image
          src={src}
          alt={siteConfig.name}
          width={official.width}
          height={official.height}
          className={styles.official}
          priority={!onDark}
        />
        <span className="sr-only"> — Home</span>
      </Link>
    );
  }
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
        <span className={styles.name}>EG Solar Products</span>
        <span className={styles.sub}>Trading</span>
      </span>
    </Link>
  );
}

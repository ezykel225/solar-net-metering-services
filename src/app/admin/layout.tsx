import type { Metadata } from "next";
import styles from "@/components/admin/admin.module.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

// Admin pages are always rendered per request (never cached).
export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={styles.app}>{children}</div>;
}

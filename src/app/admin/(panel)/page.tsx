import type { Metadata } from "next";
import Link from "next/link";
import { loadAdminPage } from "@/lib/admin/auth";
import { formatDateTime, formatPhp } from "@/lib/admin/format";
import { quoteStatusLabel } from "@/lib/quote";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Notice } from "@/components/admin/Notice";
import styles from "@/components/admin/admin.module.css";

export const metadata: Metadata = { title: "Dashboard" };

/** Shape returned by public.admin_dashboard_stats() */
type DashboardStats = {
  projects_total: number;
  projects_published: number;
  packages_active: number;
  testimonials_published: number;
  quotes_new: number;
  promotions_active: number;
  export_credit_verified: boolean | null;
};

export default async function AdminDashboard() {
  // All counts come from one database function (one request instead of seven),
  // fetched together with the recent quotes and the admin check.
  const {
    data: [statsResult, recent],
  } = await loadAdminPage((supabase) =>
    Promise.all([
      supabase.rpc("admin_dashboard_stats"),
      supabase.from("quote_requests").select("id,full_name,property_type,monthly_electric_bill,status,created_at").order("created_at", { ascending: false }).limit(5),
    ]),
  );
  const stats = (statsResult.error ? null : statsResult.data) as DashboardStats | null;
  const n = (v: number | undefined) => (typeof v === "number" ? v : null);
  const [projectsTotal, projectsPublished, packagesActive, testimonialsPublished, quotesNew, promotionsActive] = [
    n(stats?.projects_total),
    n(stats?.projects_published),
    n(stats?.packages_active),
    n(stats?.testimonials_published),
    n(stats?.quotes_new),
    n(stats?.promotions_active),
  ];

  const cards: { label: string; value: number | null; href: string; icon: IconName; sub?: string; alert?: boolean }[] = [
    { label: "Total Projects", value: projectsTotal, href: "/admin/projects", icon: "panel", sub: "excluding archived" },
    { label: "Published Projects", value: projectsPublished, href: "/admin/projects", icon: "checkCircle" },
    { label: "Active Solar Packages", value: packagesActive, href: "/admin/packages", icon: "battery" },
    { label: "Testimonials", value: testimonialsPublished, href: "/admin/testimonials", icon: "quote", sub: "published" },
    { label: "New Quote Requests", value: quotesNew, href: "/admin/quotes?status=new", icon: "mail", alert: (quotesNew ?? 0) > 0 },
    { label: "Active Promotions", value: promotionsActive, href: "/admin/promotions", icon: "star", sub: "running today" },
  ];

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your website content and quotation requests.</p>
        </div>
      </div>

      <div className={styles.stats}>
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className={`${styles.stat} ${c.alert ? styles.statAlert : ""}`}>
            <span className={styles.statLabel}>
              <Icon name={c.icon} size={16} /> {c.label}
            </span>
            <span className={styles.statValue}>{c.value ?? "—"}</span>
            {c.sub ? <span className={styles.statSub}>{c.sub}</span> : null}
          </Link>
        ))}
      </div>

      {stats && stats.export_credit_verified === false ? (
        <Notice kind="warning">
          <p>
            The Solar Calculator’s net-metering export credit is still marked <strong>Unverified</strong>.{" "}
            <Link href="/admin/calculator">Review Calculator Settings</Link>.
          </p>
        </Notice>
      ) : null}

      <section className={styles.card} aria-labelledby="recent-quotes">
        <h2 id="recent-quotes">Recent quote requests</h2>
        {recent.error ? (
          <Notice kind="error">Quote requests could not be loaded. Please refresh the page.</Notice>
        ) : !recent.data?.length ? (
          <div className={styles.empty}>
            <Icon name="mail" size={32} />
            <h2>No quote requests yet</h2>
            <p>Requests sent through the website’s quote form will appear here.</p>
          </div>
        ) : (
          <ul className={styles.rows}>
            {recent.data.map((q) => (
              <li key={q.id} className={styles.row}>
                <div className={styles.rowText}>
                  <Link href={`/admin/quotes/${q.id}`} className={styles.rowTitle}>
                    {q.full_name}
                  </Link>
                  <span className={styles.rowMeta}>
                    <span>{q.property_type}</span>
                    <span>{formatPhp(q.monthly_electric_bill)}/month</span>
                    <span>{formatDateTime(q.created_at)}</span>
                  </span>
                </div>
                <span className={`${styles.badge} ${q.status === "new" ? styles.badgeOrange : ""}`}>{quoteStatusLabel(q.status)}</span>
              </li>
            ))}
          </ul>
        )}
        <p>
          <Link href="/admin/quotes">View all quote requests</Link>
        </p>
      </section>
    </>
  );
}

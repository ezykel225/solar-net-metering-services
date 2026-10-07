import type { Metadata } from "next";
import Link from "next/link";
import { loadAdminPage } from "@/lib/admin/auth";
import { formatDateTime, formatPhp } from "@/lib/admin/format";
import { isQuoteStatus, quoteStatuses, quoteStatusLabel } from "@/lib/quote";
import { Notice } from "@/components/admin/Notice";
import { Icon } from "@/components/ui/Icon";
import styles from "@/components/admin/admin.module.css";

export const metadata: Metadata = { title: "Quote Requests" };

const PAGE_SIZE = 25;

type Props = { searchParams: Promise<{ status?: string; page?: string }> };

export default async function QuotesPage({ searchParams }: Props) {
  const { status, page } = await searchParams;
  const filter = isQuoteStatus(status) ? status : null;
  const pageNum = Math.max(1, Math.min(1000, Number.parseInt(page ?? "1", 10) || 1));
  const from = (pageNum - 1) * PAGE_SIZE;
  const {
    data: { data, count, error },
  } = await loadAdminPage((supabase) => {
    let query = supabase
      .from("quote_requests")
      .select("id,full_name,phone_number,property_type,monthly_electric_bill,service_needed,status,source,created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (filter) query = query.eq("status", filter);
    return query;
  });
  const total = count ?? 0;
  const href = (s: string | null, p = 1) => `/admin/quotes?${new URLSearchParams({ ...(s ? { status: s } : {}), ...(p > 1 ? { page: String(p) } : {}) })}`;

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1>Quote Requests</h1>
          <p>Requests sent through the website. Calculator figures are estimates only.</p>
        </div>
      </div>

      <nav className={styles.tabs} aria-label="Filter by status">
        <Link href={href(null)} className={styles.tab} aria-current={!filter ? "page" : undefined}>
          All
        </Link>
        {quoteStatuses.map((s) => (
          <Link key={s.value} href={href(s.value)} className={styles.tab} aria-current={filter === s.value ? "page" : undefined}>
            {s.label}
          </Link>
        ))}
      </nav>

      {error ? (
        <Notice kind="error">Quote requests could not be loaded. Please refresh the page.</Notice>
      ) : !data?.length ? (
        <div className={`${styles.card} ${styles.empty}`}>
          <Icon name="mail" size={32} />
          <h2>{filter ? `No requests with status “${quoteStatusLabel(filter)}”` : "No quote requests yet"}</h2>
          <p>New requests from the website’s quote form appear here.</p>
        </div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Received</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Property</th>
                  <th scope="col">Monthly bill</th>
                  <th scope="col">Service</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((q) => (
                  <tr key={q.id}>
                    <td data-label="Received">{formatDateTime(q.created_at)}</td>
                    <td data-label="Customer">
                      <Link href={`/admin/quotes/${q.id}`}>{q.full_name}</Link>
                      {q.source === "solar_calculator" ? (
                        <>
                          {" "}
                          <span className={`${styles.badge} ${styles.badgeNavy}`}>Calculator</span>
                        </>
                      ) : null}
                    </td>
                    <td data-label="Phone">{q.phone_number}</td>
                    <td data-label="Property">{q.property_type}</td>
                    <td data-label="Monthly bill">{formatPhp(q.monthly_electric_bill)}</td>
                    <td data-label="Service">{q.service_needed}</td>
                    <td data-label="Status">
                      <span className={`${styles.badge} ${q.status === "new" ? styles.badgeOrange : q.status === "completed" ? styles.badgeGreen : ""}`}>
                        {quoteStatusLabel(q.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.pager}>
            {pageNum > 1 ? (
              <Link className={styles.btn} href={href(filter, pageNum - 1)}>
                ← Newer
              </Link>
            ) : (
              <span />
            )}
            <span className={styles.hint}>
              {from + 1}–{from + data.length} of {total}
            </span>
            {from + data.length < total ? (
              <Link className={styles.btn} href={href(filter, pageNum + 1)}>
                Older →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </>
      )}
    </>
  );
}

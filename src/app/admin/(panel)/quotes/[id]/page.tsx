import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadAdminPage } from "@/lib/admin/auth";
import { formatDateTime, formatPhp } from "@/lib/admin/format";
import { quoteStatusLabel } from "@/lib/quote";
import { applianceOptions, batteryOptions, daytimeUsageOptions, formatRange } from "@/lib/solar-calculator";
import { QuoteUpdateForm } from "@/components/admin/QuoteUpdateForm";
import { Notice } from "@/components/admin/Notice";
import styles from "@/components/admin/admin.module.css";

export const metadata: Metadata = { title: "Quote Request" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const rateTypeLabels: Record<string, string> = {
  residential: "Residential",
  low_voltage: "Low Voltage",
  high_voltage: "High Voltage",
  not_sure: "Not Sure (approximate rate used)",
};

const n = (v: unknown) => (v == null ? NaN : Number(v));

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const {
    data: { data: q, error },
  } = await loadAdminPage((supabase) => supabase.from("quote_requests").select("*").eq("id", id).maybeSingle());
  if (!error && !q) notFound();

  if (error || !q) {
    return <Notice kind="error">This quote request could not be loaded. Please refresh the page.</Notice>;
  }

  const fromCalc = q.source === "solar_calculator";
  const appliances = (q.calc_appliances as string[] | null)?.map((a) => applianceOptions[a as keyof typeof applianceOptions]?.label ?? a) ?? [];

  return (
    <>
      <Link href="/admin/quotes" className={styles.backLink}>
        ← Quote Requests
      </Link>
      <div className={styles.pageHeader}>
        <div>
          <h1>{q.full_name}</h1>
          <p>
            Received {formatDateTime(q.created_at)} · Status: <strong>{quoteStatusLabel(q.status)}</strong>
          </p>
        </div>
      </div>

      <div className={styles.detailGrid}>
        <div>
          <section className={styles.card} aria-labelledby="customer-h">
            <h2 id="customer-h">Customer request</h2>
            <dl className={styles.dl}>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${String(q.phone_number).replace(/[^\d+]/g, "")}`}>{q.phone_number}</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${encodeURIComponent(q.email)}`}>{q.email}</a>
                </dd>
              </div>
              <div className={styles.dlFull}>
                <dt>Address / location</dt>
                <dd>{q.address}</dd>
              </div>
              <div>
                <dt>Property type</dt>
                <dd>{q.property_type}</dd>
              </div>
              <div>
                <dt>Monthly electricity bill</dt>
                <dd>{formatPhp(q.monthly_electric_bill)}</dd>
              </div>
              <div className={styles.dlFull}>
                <dt>Service requested</dt>
                <dd>{q.service_needed}</dd>
              </div>
              <div className={styles.dlFull}>
                <dt>Message</dt>
                <dd>{q.message || "—"}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{fromCalc ? "Solar Calculator" : "Website form"}{q.source_page ? ` (${q.source_page})` : ""}</dd>
              </div>
              <div>
                <dt>Privacy consent</dt>
                <dd>
                  {q.privacy_consent ? "Agreed" : "Not recorded"} · {formatDateTime(q.consented_at)} · policy {q.privacy_policy_version}
                </dd>
              </div>
            </dl>
          </section>

          {fromCalc ? (
            <section className={styles.card} aria-labelledby="calc-h">
              <h2 id="calc-h">Solar Calculator details</h2>
              <Notice kind="info">These figures are estimates calculated from the customer’s inputs. Confirm with a site assessment.</Notice>
              <dl className={styles.dl}>
                <div>
                  <dt>Consumer rate type</dt>
                  <dd>{rateTypeLabels[q.calc_consumer_rate_type as string] ?? "—"}</dd>
                </div>
                <div>
                  <dt>Daytime usage</dt>
                  <dd>{daytimeUsageOptions[q.calc_daytime_usage as keyof typeof daytimeUsageOptions]?.label ?? "—"}</dd>
                </div>
                <div className={styles.dlFull}>
                  <dt>Selected appliances</dt>
                  <dd>{appliances.length ? appliances.join(", ") : "None selected"}</dd>
                </div>
                <div>
                  <dt>Battery preference</dt>
                  <dd>{batteryOptions[q.calc_battery_preference as keyof typeof batteryOptions]?.label ?? "—"}</dd>
                </div>
                <div>
                  <dt>Rate used</dt>
                  <dd>{q.calc_rate_used != null ? `₱${Number(q.calc_rate_used)}/kWh` : "—"}</dd>
                </div>
                <div>
                  <dt>Estimated monthly usage</dt>
                  <dd>{q.calc_monthly_usage_kwh != null ? `${Math.round(n(q.calc_monthly_usage_kwh)).toLocaleString("en-PH")} kWh` : "—"}</dd>
                </div>
                <div>
                  <dt>Suggested system size</dt>
                  <dd>{formatRange({ low: n(q.calc_system_size_kw_low), high: n(q.calc_system_size_kw_high) }, "kW", 1)}</dd>
                </div>
                <div>
                  <dt>Estimated panels</dt>
                  <dd>{formatRange({ low: n(q.calc_panels_low), high: n(q.calc_panels_high) }, "panels")}</dd>
                </div>
                <div>
                  <dt>Estimated generation</dt>
                  <dd>{formatRange({ low: n(q.calc_generation_kwh_low), high: n(q.calc_generation_kwh_high) }, "kWh/month")}</dd>
                </div>
                <div className={styles.dlFull}>
                  <dt>Estimated bill reduction</dt>
                  <dd>
                    {q.calc_bill_reduction_low != null
                      ? `${formatPhp(q.calc_bill_reduction_low)}–${formatPhp(q.calc_bill_reduction_high)} per month (estimate)`
                      : "—"}
                  </dd>
                </div>
              </dl>
            </section>
          ) : null}
        </div>

        <QuoteUpdateForm id={q.id} status={q.status} notes={q.internal_notes} />
      </div>
    </>
  );
}

import "server-only";
import { siteConfig, siteUrlConfigured } from "@/lib/site";

/**
 * New-quote email notification via the Resend HTTP API (no SDK dependency).
 *
 * Environment (server-only):
 *   RESEND_API_KEY      — required to send; without it, sending is skipped (the
 *                          quote is still saved and visible in Admin → Quote Requests)
 *   QUOTE_NOTIFY_TO     — recipient (default: egsolarproductstrading@gmail.com)
 *   QUOTE_NOTIFY_FROM   — verified sender, e.g. "Website <quotes@yourdomain.com>"
 *                          (default: Resend's test sender, which only delivers to the
 *                          Resend account owner's own address)
 *   NEXT_PUBLIC_SITE_URL — when set, the email links to the admin dashboard
 *
 * Never throws: the quote is already saved before this runs. Failures are
 * logged server-side with the HTTP status and Resend's error type only (no
 * personal data, no keys) and never reach the visitor.
 */
export type QuoteEmail = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  propertyType: string;
  monthlyBill: number;
  service: string;
  message: string | null;
  fromCalculator: boolean;
  estimateSummary: string | null;
  /** ISO timestamp the request was saved. */
  submittedAt: string;
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

export async function sendQuoteNotification(q: QuoteEmail): Promise<"sent" | "skipped" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return "skipped";
  const to = process.env.QUOTE_NOTIFY_TO?.trim() || "egsolarproductstrading@gmail.com";
  const configuredFrom = process.env.QUOTE_NOTIFY_FROM?.trim();
  if (!configuredFrom) console.warn("[quote] QUOTE_NOTIFY_FROM not set: using Resend's test sender (delivers only to the Resend account owner)");
  const from = configuredFrom || "EG Solar Products Trading Website <onboarding@resend.dev>";
  const bill = `₱${q.monthlyBill.toLocaleString("en-PH")}`;
  const submitted = new Date(q.submittedAt).toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    dateStyle: "medium",
    timeStyle: "short",
  });
  // Admin links only when the real site address is configured (never a localhost fallback).
  const adminUrl = siteUrlConfigured ? `${siteConfig.url}/admin/quotes/${q.id}` : null;
  const adminListUrl = siteUrlConfigured ? `${siteConfig.url}/admin/quotes` : null;
  const rows: [string, string][] = [
    ["Name", q.fullName],
    ["Phone", q.phone],
    ["Email", q.email],
    ["Address / location", q.address],
    ["Property type", q.propertyType],
    ["Monthly bill", bill],
    ["Service", q.service],
    ["Message", q.message ?? "—"],
    ["Source", q.fromCalculator ? "Solar Calculator" : "Website form"],
    ...(q.estimateSummary ? ([["Calculator estimate", q.estimateSummary]] as [string, string][]) : []),
    ["Submitted", `${submitted} (Philippine time)`],
  ];
  const html = `<h2>New quote request</h2><table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><th align="left" style="vertical-align:top">${escapeHtml(k)}</th><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>${
    adminUrl && adminListUrl
      ? `<p><a href="${escapeHtml(adminUrl)}">Open this request in the admin dashboard</a> · <a href="${escapeHtml(adminListUrl)}">All quote requests</a></p>`
      : "<p>View it in Admin → Quote Requests.</p>"
  }<p style="color:#666">Calculator figures are estimates only. Reply to this email to answer the customer directly.</p>`;
  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    (adminUrl ? `\n\nOpen in admin: ${adminUrl}\nAll quote requests: ${adminListUrl}` : "\n\nView it in Admin → Quote Requests.") +
    "\nCalculator figures are estimates only.";

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: q.email, subject: `New quote request: ${q.fullName} (${q.propertyType}, ${bill}/month)`, html, text }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      // Resend's error type (e.g. validation_error) helps fix setup; its message may echo addresses, so it isn't logged.
      const type = await res
        .json()
        .then((b: { name?: unknown }) => (typeof b?.name === "string" && /^[a-z_]{1,40}$/.test(b.name) ? b.name : "unknown"))
        .catch(() => "unknown");
      console.error(`[quote] notification email failed (HTTP ${res.status}, ${type})`);
      return "failed";
    }
    return "sent";
  } catch {
    console.error("[quote] notification email failed (network error)");
    return "failed";
  }
}

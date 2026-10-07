import "server-only";
import { siteConfig } from "@/lib/site";

/**
 * New-quote email notification via the Resend HTTP API (no SDK dependency).
 *
 * Environment (server-only):
 *   RESEND_API_KEY      — required to send; without it, sending is skipped (the
 *                          quote is still saved and visible in Admin → Quote Requests)
 *   QUOTE_NOTIFY_TO     — recipient (default: solarandnetmeteringservices@gmail.com)
 *   QUOTE_NOTIFY_FROM   — verified sender, e.g. "Website <quotes@yourdomain.com>"
 *                          (default: Resend's test sender, which only delivers to the
 *                          Resend account owner's own address)
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
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

export async function sendQuoteNotification(q: QuoteEmail): Promise<"sent" | "skipped" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return "skipped";
  const to = process.env.QUOTE_NOTIFY_TO?.trim() || "solarandnetmeteringservices@gmail.com";
  const from = process.env.QUOTE_NOTIFY_FROM?.trim() || "Solar Net Metering Website <onboarding@resend.dev>";
  const bill = `₱${q.monthlyBill.toLocaleString("en-PH")}`;
  const adminUrl = `${siteConfig.url}/admin/quotes/${q.id}`;
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
  ];
  const html = `<h2>New quote request</h2><table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><th align="left" style="vertical-align:top">${escapeHtml(k)}</th><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table><p><a href="${escapeHtml(adminUrl)}">Open in the admin dashboard</a></p><p style="color:#666">Calculator figures are estimates only.</p>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nAdmin: ${adminUrl}\nCalculator figures are estimates only.`;

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
      console.error(`[quote] notification email failed (HTTP ${res.status})`);
      return "failed";
    }
    return "sent";
  } catch {
    console.error("[quote] notification email failed (network error)");
    return "failed";
  }
}

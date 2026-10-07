import { NextResponse, after } from "next/server";
import { propertyTypes, serviceOptions, toQuoteRequestInsert, validateQuoteRequest, type QuoteErrors, type QuoteRequest } from "@/lib/quote";
import {
  calculateSolarEstimate,
  formatPesoRange,
  formatRange,
  parseCalculatorQuoteInput,
  type CalculatorResult,
} from "@/lib/solar-calculator";
import { CONSENT_REQUIRED_MESSAGE, PRIVACY_POLICY_VERSION } from "@/lib/privacy";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { getCalculatorConfig } from "@/lib/cms";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendQuoteNotification } from "@/lib/notifications/email";

/**
 * POST /api/quote — public quote form endpoint.
 *
 * 1. size + shape checks, honeypot
 * 2. server-side validation (same rules as the browser) + required privacy consent
 * 3. rate limiting (per IP in memory, per email in the database)
 * 4. optional Solar Calculator estimate, recomputed here from the visitor's
 *    inputs and the current Calculator Settings (never trusted from the browser)
 * 5. insert with the server-only service client (RLS blocks the public)
 * 6. email notification to the owner (does not block or fail the response)
 */
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const UNAVAILABLE = "Online quote requests are temporarily unavailable. Please call or message us instead.";

const json = (status: number, body: Record<string, unknown>, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

const str = (v: unknown, max = 3000) => (typeof v === "string" ? v.slice(0, max) : "");

export async function POST(request: Request) {
  // 1. Size and content-type checks
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return json(413, { error: "Request too large." });
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json(415, { error: "Unsupported request." });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json(400, { error: "Invalid request." });
  }
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: "Request too large." });

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { error: "Invalid request." });
  }

  // Honeypot: bots that fill the hidden field get a normal-looking success and nothing is stored.
  if (str(body.website).trim() !== "") return json(201, { ok: true });

  const v = (body.values && typeof body.values === "object" ? body.values : {}) as Record<string, unknown>;
  const values: QuoteRequest = {
    fullName: str(v.fullName),
    phone: str(v.phone),
    email: str(v.email),
    location: str(v.location),
    propertyType: str(v.propertyType),
    monthlyBill: str(v.monthlyBill, 40),
    service: str(v.service),
    message: str(v.message),
  };

  // 2. Validation (same rules as the browser) + allowed option values
  const fieldErrors: QuoteErrors = validateQuoteRequest(values);
  if (values.propertyType && !(propertyTypes as readonly string[]).includes(values.propertyType)) {
    fieldErrors.propertyType = "Please select a property type.";
  }
  if (values.service && !serviceOptions.includes(values.service)) {
    fieldErrors.service = "Please select a service.";
  }
  const consentError = body.privacyConsent === true ? undefined : CONSENT_REQUIRED_MESSAGE;
  if (Object.keys(fieldErrors).length > 0 || consentError) {
    return json(400, { error: "Please correct the highlighted fields.", fieldErrors, consentError });
  }

  // 3. Rate limiting — per IP (best effort, in memory)
  const ip = clientIp(request.headers);
  const ipLimit = rateLimit(`quote:${ip}`, 5, 10 * 60 * 1000);
  if (!ipLimit.allowed) {
    return json(429, { error: "Too many requests. Please wait a few minutes and try again." }, { "Retry-After": String(ipLimit.retryAfterSec) });
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) return json(503, { error: UNAVAILABLE });

  const insert = toQuoteRequestInsert(values);

  // Rate limiting — per email (database): at most 3 requests per hour
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from("quote_requests")
    .select("id", { count: "exact", head: true })
    .eq("email", insert.email)
    .gte("created_at", since);
  if (countError) {
    console.error(`[quote] rate-limit lookup failed (${countError.code ?? "unknown"})`);
    return json(503, { error: UNAVAILABLE });
  }
  if ((count ?? 0) >= 3) {
    return json(429, { error: "We've already received several requests from this email address. We'll be in touch soon." });
  }

  // 4. Optional calculator estimate, recomputed on the server
  const calcInput = parseCalculatorQuoteInput(body.calculator);
  let estimate: CalculatorResult | null = null;
  if (calcInput) {
    const config = await getCalculatorConfig();
    const outcome = calculateSolarEstimate({ monthlyBill: String(insert.monthly_electric_bill), ...calcInput }, config);
    if (outcome.ok) estimate = outcome.result;
  }
  const rateType = !calcInput
    ? null
    : calcInput.propertyType === "Residential"
      ? "residential"
      : ({ lowVoltage: "low_voltage", highVoltage: "high_voltage", notSure: "not_sure" } as const)[calcInput.commercialRate];

  const sourcePage = str(body.sourcePage, 200);
  const consentedAt = new Date().toISOString();

  // 5. Insert (service role; the public cannot insert or read this table)
  const { data, error } = await supabase
    .from("quote_requests")
    .insert({
      ...insert,
      source: calcInput ? "solar_calculator" : "website_form",
      source_page: /^\/[\w\-/]*$/.test(sourcePage) ? sourcePage : null,
      calc_consumer_rate_type: rateType,
      calc_daytime_usage: calcInput?.daytimeUsage ?? null,
      calc_appliances: calcInput ? calcInput.appliances : null,
      calc_battery_preference: calcInput?.battery ?? null,
      calc_rate_used: estimate?.rate.ratePerKwh ?? null,
      calc_monthly_usage_kwh: estimate ? Math.round(estimate.monthlyUsageKwh * 100) / 100 : null,
      calc_system_size_kw_low: estimate?.systemSizeKw.low ?? null,
      calc_system_size_kw_high: estimate?.systemSizeKw.high ?? null,
      calc_panels_low: estimate?.panelCount.low ?? null,
      calc_panels_high: estimate?.panelCount.high ?? null,
      calc_generation_kwh_low: estimate ? Math.round(estimate.monthlyGenerationKwh.low) : null,
      calc_generation_kwh_high: estimate ? Math.round(estimate.monthlyGenerationKwh.high) : null,
      calc_bill_reduction_low: estimate?.billReduction.low ?? null,
      calc_bill_reduction_high: estimate?.billReduction.high ?? null,
      privacy_consent: true,
      consented_at: consentedAt,
      privacy_policy_version: PRIVACY_POLICY_VERSION,
    })
    .select("id")
    .single();

  if (error || !data) {
    // Log only the error code — never the submitted personal data or keys.
    console.error(`[quote] insert failed (${error?.code ?? "unknown"})`);
    return json(500, { error: "Something went wrong while sending your request." });
  }

  // 6. Notify the owner after the response is sent (does not delay or fail the request).
  after(async () => {
    const result = await sendQuoteNotification({
      id: data.id,
      fullName: insert.full_name,
      phone: insert.phone_number,
      email: insert.email,
      address: insert.address,
      propertyType: insert.property_type,
      monthlyBill: insert.monthly_electric_bill,
      service: insert.service_needed,
      message: insert.message,
      fromCalculator: !!calcInput,
      estimateSummary: estimate
        ? `${formatRange(estimate.systemSizeKw, "kW", 1)} system, ${formatRange(estimate.panelCount, "panels")}, bill reduction ${formatPesoRange(estimate.billReduction)} per month (estimate)`
        : null,
    });
    if (result === "skipped") console.warn("[quote] RESEND_API_KEY not set: notification email skipped");
  });

  return json(201, { ok: true });
}

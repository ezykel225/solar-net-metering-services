/**
 * Quote request domain logic — shared by the form today and by a future
 * API route / Supabase integration. Keep this file free of React so it can
 * run on both the client and the server.
 */
import { serviceOptions } from "@/data/services";

export const propertyTypes = ["Residential", "Commercial", "Industrial", "Agricultural", "Other"] as const;
export { serviceOptions };

export type QuoteRequest = {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  propertyType: string;
  monthlyBill: string;
  service: string;
  message: string;
};

export type QuoteField = keyof QuoteRequest;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

export const emptyQuoteRequest: QuoteRequest = {
  fullName: "",
  phone: "",
  email: "",
  location: "",
  propertyType: "",
  monthlyBill: "",
  service: "",
  message: "",
};

/**
 * Parses the free-text monthly bill into a number, e.g. "5,000" → 5000,
 * "₱ 4,250.50" → 4250.5. Returns null when the text is not a plain amount
 * ("5k", "about 5000/mo"), so the database never stores a misread value.
 */
export function parseBillAmount(input: string): number | null {
  // A minus sign anywhere means a negative/invalid amount, never a positive one.
  if (input.includes("-") || input.includes("−")) return null;
  const cleaned = input
    .trim()
    .replace(/^[^\d\p{L}]+/u, "") // leading currency symbol, e.g. ₱ $ €
    .replace(/[\s,]/g, ""); // thousands separators and spaces
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(cleaned)) return null;
  return Number(cleaned);
}

/** Maximum lengths; mirrored by CHECK constraints in the planned quote_requests table. */
export const quoteLimits = {
  fullName: 120,
  phone: 20,
  email: 254,
  location: 300,
  message: 2000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;

/** Returns a map of field → error message. An empty object means valid. */
export function validateQuoteRequest(data: QuoteRequest): QuoteErrors {
  const errors: QuoteErrors = {};
  const v = (s: string) => s.trim();

  if (v(data.fullName).length < 2) errors.fullName = "Please enter your full name.";
  else if (v(data.fullName).length > quoteLimits.fullName) errors.fullName = "Please shorten your name.";
  if (!v(data.phone)) errors.phone = "Please enter your phone number.";
  else if (!PHONE_RE.test(v(data.phone)) || v(data.phone).replace(/\D/g, "").length < 7)
    errors.phone = "Please enter a valid phone number.";
  if (!v(data.email)) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(v(data.email)) || v(data.email).length > quoteLimits.email)
    errors.email = "Please enter a valid email address, e.g. name@example.com.";
  if (!v(data.location)) errors.location = "Please enter your address or location.";
  else if (v(data.location).length > quoteLimits.location) errors.location = "Please shorten the address.";
  if (!v(data.propertyType)) errors.propertyType = "Please select a property type.";
  if (!v(data.monthlyBill)) errors.monthlyBill = "Please enter your average monthly bill.";
  else if (parseBillAmount(data.monthlyBill) === null)
    errors.monthlyBill = "Please enter the amount as a number, e.g. 5,000.";
  if (!v(data.service)) errors.service = "Please select a service.";
  if (data.message.length > quoteLimits.message) errors.message = "Please keep your message under 2,000 characters.";

  return errors;
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: QuoteErrors; consentError?: string; kind?: "validation" | "rate_limited" | "unavailable" | "error" };

/* -------------------------------------------------------------------------
 * Database mapping — mirrors public.quote_requests
 * (supabase/migrations/20261007090000_cms_schema.sql).
 * ---------------------------------------------------------------------- */

/** Quote pipeline statuses, in order. New rows start as "new" (database default). */
export const quoteStatuses = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "site_assessment_scheduled", label: "Site Assessment Scheduled" },
  { value: "quotation_sent", label: "Quotation Sent" },
  { value: "approved", label: "Approved" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
] as const;
export type QuoteStatus = (typeof quoteStatuses)[number]["value"];
export const isQuoteStatus = (v: unknown): v is QuoteStatus => quoteStatuses.some((s) => s.value === v);
export const quoteStatusLabel = (v: string) => quoteStatuses.find((s) => s.value === v)?.label ?? v;

/** Customer-submitted columns the website inserts. */
export type QuoteRequestInsert = {
  full_name: string;
  phone_number: string;
  email: string;
  address: string;
  property_type: string;
  monthly_electric_bill: number;
  service_needed: string;
  message: string | null;
};

/**
 * Converts validated form values into a database insert payload.
 * Call validateQuoteRequest() first; this throws if the bill cannot be parsed.
 */
export function toQuoteRequestInsert(data: QuoteRequest): QuoteRequestInsert {
  const bill = parseBillAmount(data.monthlyBill);
  if (bill === null) throw new Error("monthlyBill must be validated before mapping");
  const message = data.message.trim();
  return {
    full_name: data.fullName.trim(),
    phone_number: data.phone.trim(),
    email: data.email.trim().toLowerCase(),
    address: data.location.trim(),
    property_type: data.propertyType,
    monthly_electric_bill: bill,
    service_needed: data.service,
    message: message === "" ? null : message,
  };
}

/** Body sent from the browser to /api/quote. Everything is re-validated on the server. */
export type QuoteSubmission = {
  values: QuoteRequest;
  privacyConsent: boolean;
  /** Honeypot field: must be empty. */
  website: string;
  /** Solar Calculator inputs, when the visitor came from the calculator. */
  calculator?: unknown;
  /** Page the form was sent from, e.g. "/contact". */
  sourcePage?: string;
};

/**
 * Sends a quote request to the server route /api/quote, which validates again,
 * inserts into Supabase with a server-only key and notifies the owner.
 * The browser never talks to the database directly.
 */
export async function submitQuoteRequest(submission: QuoteSubmission): Promise<SubmitResult> {
  const fieldErrors = validateQuoteRequest(submission.values);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, kind: "validation", error: "Please correct the highlighted fields.", fieldErrors };
  }
  try {
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
    if (res.ok) return { ok: true };
    const body = (await res.json().catch(() => ({}))) as { error?: string; fieldErrors?: QuoteErrors; consentError?: string };
    if (res.status === 400) {
      return {
        ok: false,
        kind: "validation",
        error: body.error ?? "Please correct the highlighted fields.",
        fieldErrors: body.fieldErrors,
        consentError: body.consentError,
      };
    }
    if (res.status === 429) {
      return { ok: false, kind: "rate_limited", error: body.error ?? "Too many requests. Please wait a few minutes and try again." };
    }
    if (res.status === 503) {
      return { ok: false, kind: "unavailable", error: body.error ?? "Online quote requests are temporarily unavailable." };
    }
    return { ok: false, kind: "error", error: "Something went wrong while sending your request." };
  } catch {
    return { ok: false, kind: "error", error: "We couldn't reach the server. Please check your connection and try again." };
  }
}

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

export type SubmitResult = { ok: true } | { ok: false; error: string };

/* -------------------------------------------------------------------------
 * Database mapping (prepared for Supabase, not connected yet).
 * Mirrors the `quote_requests` table in docs/QUOTE_SUBMISSION_PLAN.md.
 * ---------------------------------------------------------------------- */

/** Lead pipeline statuses. New rows always start as "new" (database default). */
export const quoteStatuses = ["new", "contacted", "quoted", "won", "lost", "spam"] as const;
export type QuoteStatus = (typeof quoteStatuses)[number];

/** Columns the website inserts. id, status and created_at are filled in by the database. */
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

/** A full row as stored in the database. */
export type QuoteRequestRow = QuoteRequestInsert & {
  id: string;
  status: QuoteStatus;
  created_at: string;
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

/**
 * Sends a quote request.
 *
 * PHASE 1: no backend — this simulates a network request so the success
 * state can be demonstrated. Nothing is stored or sent anywhere.
 *
 * PHASE 2 (planned, see docs/QUOTE_SUBMISSION_PLAN.md): this body becomes a
 * POST to the server route /api/quote, which validates again, maps with
 * toQuoteRequestInsert() and inserts into Supabase using a server-only key.
 * The browser never talks to Supabase directly.
 *
 *   const res = await fetch("/api/quote", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(data),
 *   });
 *   return res.ok ? { ok: true } : { ok: false, error: "Something went wrong. Please try again or call us." };
 *
 * The form component only depends on this function's signature.
 */
export async function submitQuoteRequest(data: QuoteRequest): Promise<SubmitResult> {
  const errors = validateQuoteRequest(data);
  if (Object.keys(errors).length > 0) {
    return { ok: false, error: "Please correct the highlighted fields." };
  }
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { ok: true };
}

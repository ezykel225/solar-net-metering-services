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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;

/** Returns a map of field → error message. An empty object means valid. */
export function validateQuoteRequest(data: QuoteRequest): QuoteErrors {
  const errors: QuoteErrors = {};
  const v = (s: string) => s.trim();

  if (v(data.fullName).length < 2) errors.fullName = "Please enter your full name.";
  if (!v(data.phone)) errors.phone = "Please enter your phone number.";
  else if (!PHONE_RE.test(v(data.phone)) || v(data.phone).replace(/\D/g, "").length < 7)
    errors.phone = "Please enter a valid phone number.";
  if (!v(data.email)) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(v(data.email))) errors.email = "Please enter a valid email address, e.g. name@example.com.";
  if (!v(data.location)) errors.location = "Please enter your address or location.";
  if (!v(data.propertyType)) errors.propertyType = "Please select a property type.";
  if (!v(data.monthlyBill)) errors.monthlyBill = "Please enter your average monthly bill.";
  else if (!/\d/.test(data.monthlyBill)) errors.monthlyBill = "Please enter an amount, e.g. 5,000.";
  if (!v(data.service)) errors.service = "Please select a service.";
  if (data.message.length > 2000) errors.message = "Please keep your message under 2,000 characters.";

  return errors;
}

export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Sends a quote request.
 *
 * PHASE 1: no backend — this simulates a network request so the success
 * state can be demonstrated. Nothing is stored or sent anywhere.
 *
 * PHASE 2: replace the body of this function with ONE of:
 *
 *   // a) Next.js Route Handler (e.g. src/app/api/quote/route.ts)
 *   const res = await fetch("/api/quote", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(data),
 *   });
 *   return res.ok ? { ok: true } : { ok: false, error: "Something went wrong. Please try again." };
 *
 *   // b) Supabase (keys from environment variables, never hard-coded)
 *   const { error } = await supabase.from("quote_requests").insert(toRow(data));
 *   return error ? { ok: false, error: error.message } : { ok: true };
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

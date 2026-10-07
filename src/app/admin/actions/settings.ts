"use server";

import { revalidatePath } from "next/cache";
import { AdminAuthError, requireAdminAction } from "@/lib/admin/auth";
import { friendlyDbError } from "@/lib/admin/validate";
import type { FormState } from "./content";

const notAuthorized: FormState = { error: "Your session has expired or you are not authorized. Please sign in again." };

const text = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
const optional = (v: string) => (v ? v : null);

/** Business Settings (single row). */
export async function saveBusinessSettingsAction(_prev: FormState, form: FormData): Promise<FormState> {
  const v = {
    business_name: text(form, "business_name"),
    phone_display: text(form, "phone_display"),
    phone_e164: text(form, "phone_e164").replace(/[\s-]/g, ""),
    email: text(form, "email").toLowerCase(),
    facebook_url: optional(text(form, "facebook_url")),
    messenger_url: optional(text(form, "messenger_url")),
    service_area_text: optional(text(form, "service_area_text")),
    service_area_short: optional(text(form, "service_area_short")),
    office_address: optional(text(form, "office_address")),
    business_hours: optional(text(form, "business_hours")),
    quote_cta_label: text(form, "quote_cta_label"),
    quotes_are_free: form.get("quotes_are_free") === "on",
  };
  const errors: Record<string, string> = {};
  if (v.business_name.length < 2 || v.business_name.length > 120) errors.business_name = "Enter the business name (2–120 characters).";
  if (v.phone_display.length < 7 || v.phone_display.length > 30) errors.phone_display = "Enter the phone number as it should appear.";
  if (!/^\+[1-9][0-9]{7,14}$/.test(v.phone_e164)) errors.phone_e164 = "Use international format, e.g. +639977310543.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) || v.email.length > 254) errors.email = "Enter a valid email address.";
  for (const k of ["facebook_url", "messenger_url"] as const) {
    if (v[k] && !/^https:\/\/[^\s]+$/.test(v[k]!)) errors[k] = "Enter a full link starting with https://";
  }
  if ((v.service_area_text?.length ?? 0) > 400) errors.service_area_text = "Keep this under 400 characters.";
  if ((v.service_area_short?.length ?? 0) > 80) errors.service_area_short = "Keep this under 80 characters.";
  if ((v.office_address?.length ?? 0) > 300) errors.office_address = "Keep this under 300 characters.";
  if ((v.business_hours?.length ?? 0) > 150) errors.business_hours = "Keep this under 150 characters.";
  if (v.quote_cta_label.length < 3 || v.quote_cta_label.length > 40) errors.quote_cta_label = "Enter the button wording (3–40 characters).";
  if (Object.keys(errors).length) return { error: "Please fix the highlighted fields.", errors, values: v };

  try {
    const { supabase } = await requireAdminAction();
    const { data, error } = await supabase.from("business_settings").update(v).eq("id", true).select("id");
    if (error) return { error: friendlyDbError(error) };
    if (!data?.length) return { error: "Business settings record is missing. Run the database seed migration." };
  } catch (e) {
    if (e instanceof AdminAuthError) return notAuthorized;
    throw e;
  }
  revalidatePath("/", "layout");
  return { ok: true, message: "Business settings saved. The website updates within moments.", values: v };
}

/** Number field with range check. */
function num(form: FormData, name: string, min: number, max: number, errors: Record<string, string>, label: string, required = true) {
  const raw = text(form, name).replace(/,/g, "");
  if (!raw) {
    if (required) errors[name] = `${label} is required.`;
    return null;
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n < min || n > max) {
    errors[name] = `${label} must be between ${min} and ${max}.`;
    return null;
  }
  return n;
}

/** Calculator Settings (single row). */
export async function saveCalculatorSettingsAction(_prev: FormState, form: FormData): Promise<FormState> {
  const errors: Record<string, string> = {};
  const method = text(form, "not_sure_method");
  const v = {
    residential_rate: num(form, "residential_rate", 0.01, 99.99, errors, "Residential rate"),
    low_voltage_rate: num(form, "low_voltage_rate", 0.01, 99.99, errors, "Low Voltage rate"),
    high_voltage_rate: num(form, "high_voltage_rate", 0.01, 99.99, errors, "High Voltage rate"),
    rate_source: text(form, "rate_source"),
    rate_billing_period: optional(text(form, "rate_billing_period")),
    rates_updated_on: optional(text(form, "rates_updated_on")),
    not_sure_method: method,
    not_sure_custom_rate: num(form, "not_sure_custom_rate", 0.01, 99.99, errors, "Custom rate", method === "custom"),
    peak_sun_hours: num(form, "peak_sun_hours", 1, 10, errors, "Peak sun hours"),
    system_efficiency: num(form, "system_efficiency", 0.5, 1, errors, "System efficiency"),
    panel_wattage: num(form, "panel_wattage", 100, 1000, errors, "Panel wattage"),
    coverage_low: num(form, "coverage_low", 0.1, 1.2, errors, "Low coverage"),
    coverage_medium: num(form, "coverage_medium", 0.1, 1.2, errors, "Medium coverage"),
    coverage_high: num(form, "coverage_high", 0.1, 1.2, errors, "High coverage"),
    min_monthly_bill: num(form, "min_monthly_bill", 1, 100_000_000, errors, "Minimum bill"),
    max_monthly_bill: num(form, "max_monthly_bill", 1, 100_000_000, errors, "Maximum bill"),
    max_bill_reduction_share: num(form, "max_bill_reduction_share", 0.1, 1, errors, "Bill reduction cap"),
    export_credit_ratio: num(form, "export_credit_ratio", 0, 1.5, errors, "Export credit factor"),
    export_credit_verified: text(form, "export_credit_verified") === "verified",
    export_credit_source: optional(text(form, "export_credit_source")),
    disclaimer: text(form, "disclaimer"),
  };
  if (v.rate_source.length < 2 || v.rate_source.length > 150) errors.rate_source = "Enter the rate source (2–150 characters).";
  if ((v.rate_billing_period?.length ?? 0) > 60) errors.rate_billing_period = "Keep this under 60 characters.";
  if (v.rates_updated_on && !/^\d{4}-\d{2}-\d{2}$/.test(v.rates_updated_on)) errors.rates_updated_on = "Enter a valid date.";
  if (!["average", "low_voltage", "high_voltage", "custom"].includes(method)) errors.not_sure_method = "Choose how to approximate the rate.";
  if (method !== "custom") v.not_sure_custom_rate = null;
  if (v.min_monthly_bill != null && v.max_monthly_bill != null && v.max_monthly_bill <= v.min_monthly_bill) {
    errors.max_monthly_bill = "The maximum must be higher than the minimum.";
  }
  if (v.export_credit_verified && (!v.export_credit_source || /placeholder|not yet confirmed/i.test(v.export_credit_source))) {
    errors.export_credit_source = "Add the official source (document and date) before marking the export credit as verified.";
  }
  if (
    v.coverage_low != null &&
    v.coverage_medium != null &&
    v.coverage_high != null &&
    !(v.coverage_low <= v.coverage_medium && v.coverage_medium <= v.coverage_high)
  ) {
    errors.coverage_medium = "Coverage targets must go up from low to medium to high daytime use.";
  }
  if ((v.export_credit_source?.length ?? 0) > 300) errors.export_credit_source = "Keep this under 300 characters.";
  if (v.disclaimer.length < 20 || v.disclaimer.length > 1000) errors.disclaimer = "The disclaimer must be 20–1000 characters.";
  // Echo what was typed so the form keeps it after a failed save.
  const typed = Object.fromEntries(form.entries()) as Record<string, unknown>;
  typed.export_credit_verified = v.export_credit_verified;
  if (Object.keys(errors).length) return { error: "Please fix the highlighted fields.", errors, values: typed };

  try {
    const { supabase } = await requireAdminAction();
    const { data, error } = await supabase.from("calculator_settings").update(v).eq("id", true).select("id");
    if (error) return { error: friendlyDbError(error) };
    if (!data?.length) return { error: "Calculator settings record is missing. Run the database seed migration." };
  } catch (e) {
    if (e instanceof AdminAuthError) return notAuthorized;
    throw e;
  }
  revalidatePath("/", "layout");
  return { ok: true, message: "Calculator settings saved. The public calculator now uses these values.", values: typed };
}

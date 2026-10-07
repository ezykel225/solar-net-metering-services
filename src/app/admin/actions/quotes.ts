"use server";

import { revalidatePath } from "next/cache";
import { AdminAuthError, requireAdminAction } from "@/lib/admin/auth";
import { friendlyDbError } from "@/lib/admin/validate";
import { isQuoteStatus } from "@/lib/quote";
import type { FormState } from "./content";

/** Update a quote request's status and internal notes (customer details are read-only). */
export async function updateQuoteAction(id: string, _prev: FormState, form: FormData): Promise<FormState> {
  const status = String(form.get("status") ?? "");
  const notes = String(form.get("internal_notes") ?? "").replace(/\r\n/g, "\n").trim();
  const errors: Record<string, string> = {};
  if (!isQuoteStatus(status)) errors.status = "Choose a status.";
  if (notes.length > 5000) errors.internal_notes = "Keep notes under 5,000 characters.";
  const values = { status, internal_notes: notes };
  if (Object.keys(errors).length) return { error: "Please fix the highlighted fields.", errors, values };
  try {
    const { supabase } = await requireAdminAction();
    const { data, error } = await supabase
      .from("quote_requests")
      .update({ status, internal_notes: notes || null })
      .eq("id", id)
      .select("id");
    if (error) return { error: friendlyDbError(error) };
    if (!data?.length) return { error: "This quote request no longer exists." };
  } catch (e) {
    if (e instanceof AdminAuthError) return { error: "Your session has expired. Please sign in again." };
    throw e;
  }
  revalidatePath("/admin/quotes");
  revalidatePath(`/admin/quotes/${id}`);
  return { ok: true, message: "Quote request updated.", values };
}

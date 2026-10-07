"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminAuthError, requireAdminAction } from "@/lib/admin/auth";
import { entities, isEntityKey, type EntityKey } from "@/lib/admin/entities";
import { friendlyDbError, parseEntityForm, rawFormValues } from "@/lib/admin/validate";
import { MEDIA_BUCKET } from "@/lib/supabase/env";

export type FormState = {
  ok?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
  /** Submitted values, returned so the form keeps the admin's input after a failed save. */
  values?: Record<string, unknown>;
};

/** Refresh every public page after a content change (ISR on-demand revalidation). */
const refreshPublicSite = () => revalidatePath("/", "layout");

const notAuthorized: FormState = { error: "Your session has expired or you are not authorized. Please sign in again." };

/** Storage paths (not bundled /images/... paths) referenced by a record. */
function storagePaths(def: (typeof entities)[EntityKey], row: Record<string, unknown> | null): string[] {
  if (!row) return [];
  const paths: string[] = [];
  for (const f of def.fields) {
    const v = row[f.name];
    if (f.type === "image" && typeof v === "string") paths.push(v);
    if (f.type === "images" && Array.isArray(v)) paths.push(...v.filter((p): p is string => typeof p === "string"));
  }
  return paths.filter((p) => !p.startsWith("/"));
}

/** Create or update a CMS record. */
export async function saveEntityAction(entityKey: string, id: string | null, _prev: FormState, form: FormData): Promise<FormState> {
  if (!isEntityKey(entityKey)) return { error: "Unknown content type." };
  const def = entities[entityKey];
  let ctx;
  try {
    ctx = await requireAdminAction();
  } catch (e) {
    if (e instanceof AdminAuthError) return notAuthorized;
    throw e;
  }
  const { values, errors } = parseEntityForm(def, form);
  const typed = rawFormValues(def, form);
  if (Object.keys(errors).length > 0) return { error: "Please fix the highlighted fields.", errors, values: typed };

  const { supabase } = ctx;
  if (id) {
    const { data: before } = await supabase.from(def.table).select("*").eq("id", id).maybeSingle();
    const { error } = await supabase.from(def.table).update(values).eq("id", id);
    if (error) return { error: friendlyDbError(error), values: typed };
    // Remove images that were replaced or removed (best effort).
    const keep = new Set(storagePaths(def, values));
    const removed = storagePaths(def, before).filter((p) => !keep.has(p));
    if (removed.length) await supabase.storage.from(MEDIA_BUCKET).remove(removed);
    refreshPublicSite();
    return { ok: true, message: `${def.singular} saved.`, values: typed };
  }

  // New record: place it at the end unless an order was given.
  if (values.display_order == null) {
    const { data: last } = await supabase.from(def.table).select("display_order").order("display_order", { ascending: false }).limit(1);
    values.display_order = ((last?.[0]?.display_order as number | undefined) ?? 0) + 1;
  }
  const { data, error } = await supabase.from(def.table).insert(values).select("id").single();
  if (error || !data) return { error: friendlyDbError(error), values: typed };
  refreshPublicSite();
  redirect(`/admin/${entityKey}/${data.id}?saved=1`);
}

/** Toggle a status/flag from the list (publish, activate, feature, archive). */
export async function setEntityFlagAction(entityKey: string, id: string, field: string, value: string | boolean): Promise<FormState> {
  if (!isEntityKey(entityKey)) return { error: "Unknown content type." };
  const def = entities[entityKey];
  const allowed: Record<string, (v: unknown) => boolean> = {
    ...(def.model.status ? { status: (v) => v === "draft" || v === "published" || v === "archived" } : {}),
    ...(def.model.active ? { is_active: (v) => typeof v === "boolean" } : {}),
    ...(def.model.featured ? { is_featured: (v) => typeof v === "boolean" } : {}),
  };
  if (!allowed[field]?.(value)) return { error: "That change is not allowed." };
  try {
    const { supabase } = await requireAdminAction();
    const { error } = await supabase.from(def.table).update({ [field]: value }).eq("id", id);
    if (error) return { error: friendlyDbError(error) };
  } catch (e) {
    if (e instanceof AdminAuthError) return notAuthorized;
    throw e;
  }
  refreshPublicSite();
  return { ok: true };
}

/** Permanently delete a record (the UI asks for confirmation first) and its uploaded images. */
export async function deleteEntityAction(entityKey: string, id: string): Promise<FormState> {
  if (!isEntityKey(entityKey)) return { error: "Unknown content type." };
  const def = entities[entityKey];
  try {
    const { supabase } = await requireAdminAction();
    const { data: row } = await supabase.from(def.table).select("*").eq("id", id).maybeSingle();
    const { error } = await supabase.from(def.table).delete().eq("id", id);
    if (error) return { error: friendlyDbError(error) };
    const paths = storagePaths(def, row);
    if (paths.length) await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  } catch (e) {
    if (e instanceof AdminAuthError) return notAuthorized;
    throw e;
  }
  refreshPublicSite();
  return { ok: true };
}

/** Move a record up or down in the display order. */
export async function moveEntityAction(entityKey: string, id: string, direction: "up" | "down"): Promise<FormState> {
  if (!isEntityKey(entityKey)) return { error: "Unknown content type." };
  const def = entities[entityKey];
  try {
    const { supabase } = await requireAdminAction();
    let query = supabase.from(def.table).select("id, display_order").order("display_order", { ascending: true }).order("created_at", { ascending: true });
    if (def.model.status) query = query.neq("status", "archived");
    const { data, error } = await query;
    if (error || !data) return { error: friendlyDbError(error) };
    const ids = data.map((r) => r.id as string);
    const i = ids.indexOf(id);
    const j = direction === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= ids.length) return { ok: true };
    [ids[i], ids[j]] = [ids[j], ids[i]];
    // Renumber 1..n so ordering stays clean even if values were duplicated.
    const updates = ids
      .map((rowId, index) => ({ rowId, order: index + 1 }))
      .filter(({ rowId, order }) => data.find((r) => r.id === rowId)?.display_order !== order);
    for (const u of updates) {
      const { error: upErr } = await supabase.from(def.table).update({ display_order: u.order }).eq("id", u.rowId);
      if (upErr) return { error: friendlyDbError(upErr) };
    }
  } catch (e) {
    if (e instanceof AdminAuthError) return notAuthorized;
    throw e;
  }
  refreshPublicSite();
  return { ok: true };
}

import { isAllowedImagePath, type EntityDef, type FieldDef } from "./entities";

export type ParsedForm = { values: Record<string, unknown>; errors: Record<string, string> };

const isIsoDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(new Date(`${v}T00:00:00Z`).getTime());

/** Parses one field from FormData into a database value (or an error). */
function parseField(field: FieldDef, form: FormData, def: EntityDef): { value: unknown; error?: string } {
  const raw = form.get(field.name);
  const str = typeof raw === "string" ? raw : "";
  switch (field.type) {
    case "text":
    case "url":
    case "textarea": {
      const v = field.type === "textarea" ? str.replace(/\r\n/g, "\n").trim() : str.trim();
      if (!v) return field.required ? { value: null, error: `${field.label} is required.` } : { value: null };
      if (v.length > field.maxLength) return { value: v, error: `Keep this under ${field.maxLength} characters.` };
      if ("pattern" in field && field.pattern && !field.pattern.test(v)) return { value: v, error: field.patternMessage ?? "Invalid format." };
      return { value: v };
    }
    case "number": {
      const v = str.trim().replace(/,/g, "");
      if (!v) return field.required ? { value: null, error: `${field.label} is required.` } : { value: null };
      const n = Number(v);
      if (!Number.isFinite(n)) return { value: null, error: "Enter a number." };
      if (field.integer && !Number.isInteger(n)) return { value: null, error: "Enter a whole number." };
      if (field.min !== undefined && n < field.min) return { value: null, error: `Must be at least ${field.min}.` };
      if (field.max !== undefined && n > field.max) return { value: null, error: `Must be at most ${field.max}.` };
      return { value: n };
    }
    case "select": {
      const allowed = field.options.map((o) => o.value);
      if (!allowed.includes(str)) return { value: null, error: "Choose one of the options." };
      if (!str) return field.required ? { value: null, error: `${field.label} is required.` } : { value: null };
      return { value: str };
    }
    case "multiselect": {
      const allowed = new Set(field.options.map((o) => o.value));
      const picked = form.getAll(field.name).filter((v): v is string => typeof v === "string" && allowed.has(v));
      return { value: [...new Set(picked)] };
    }
    case "checkbox":
      return { value: raw === "on" || raw === "true" };
    case "date": {
      const v = str.trim();
      if (!v) return field.required ? { value: null, error: `${field.label} is required.` } : { value: null };
      return isIsoDate(v) ? { value: v } : { value: null, error: "Enter a valid date." };
    }
    case "list": {
      const items = str
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      if (items.length > field.maxItems) return { value: items, error: `Use at most ${field.maxItems} items.` };
      if (items.some((i) => i.length > field.maxLength)) return { value: items, error: `Keep each item under ${field.maxLength} characters.` };
      if (field.required && items.length === 0) return { value: items, error: `${field.label} is required.` };
      return { value: items };
    }
    case "image": {
      const v = str.trim();
      if (!v) return { value: null };
      return isAllowedImagePath(v, def.folder) ? { value: v } : { value: null, error: "Invalid image. Please upload the image again." };
    }
    case "images": {
      let list: unknown;
      try {
        list = str ? JSON.parse(str) : [];
      } catch {
        return { value: [], error: "Invalid images. Please upload them again." };
      }
      if (!Array.isArray(list) || list.some((p) => typeof p !== "string" || !isAllowedImagePath(p, def.folder))) {
        return { value: [], error: "Invalid images. Please upload them again." };
      }
      if (list.length > field.maxItems) return { value: list, error: `Use at most ${field.maxItems} images.` };
      return { value: list };
    }
  }
}

/** Validates a submitted admin form against its entity definition. */
export function parseEntityForm(def: EntityDef, form: FormData): ParsedForm {
  const values: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  for (const field of def.fields) {
    const { value, error } = parseField(field, form, def);
    values[field.name] = value;
    if (error) errors[field.name] = error;
  }
  if (def.validate) Object.assign(errors, def.validate(values));
  return { values, errors };
}

/** Friendly message for a database error, without exposing internals. */
export function friendlyDbError(error: { code?: string; message?: string } | null | undefined): string {
  switch (error?.code) {
    case "23505":
      return "Another record already uses this value (for example the same link name).";
    case "23514":
      return "One of the values is outside the allowed range. Please check the form.";
    case "42501":
      return "You don’t have permission to make this change.";
    case "PGRST116":
      return "This record no longer exists.";
    default:
      return "The change could not be saved. Please try again.";
  }
}

/**
 * What the admin typed, in a shape the form can use as default values.
 * Returned with validation errors so a failed save never wipes their input
 * (React resets forms after a server action).
 */
export function rawFormValues(def: EntityDef, form: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of def.fields) {
    const raw = form.get(f.name);
    const str = typeof raw === "string" ? raw : "";
    switch (f.type) {
      case "checkbox":
        out[f.name] = raw === "on" || raw === "true";
        break;
      case "multiselect":
        out[f.name] = form.getAll(f.name).filter((v) => typeof v === "string");
        break;
      case "list":
        out[f.name] = str.replace(/\r\n/g, "\n").split("\n");
        break;
      case "images":
        try {
          const list = JSON.parse(str || "[]");
          out[f.name] = Array.isArray(list) ? list.filter((p) => typeof p === "string") : [];
        } catch {
          out[f.name] = [];
        }
        break;
      default:
        out[f.name] = str;
    }
  }
  return out;
}

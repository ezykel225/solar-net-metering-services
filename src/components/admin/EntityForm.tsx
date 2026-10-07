"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveEntityAction, type FormState } from "@/app/admin/actions/content";
import { entities, type EntityKey, type FieldDef } from "@/lib/admin/entities";
import { ImageField, ImagesField } from "./ImageField";
import { Notice } from "./Notice";
import { useFocusFirstError } from "./useFocusFirstError";
import styles from "./admin.module.css";

type Props = {
  entityKey: EntityKey;
  id: string | null;
  initial: Record<string, unknown>;
  savedNotice?: boolean;
};

const asString = (v: unknown) => (v == null ? "" : String(v));

/**
 * Generic create/edit form for a CMS table. Field rules come from
 * src/lib/admin/entities.ts and are validated again on the server.
 */
export function EntityForm({ entityKey, id, initial, savedNotice }: Props) {
  const def = entities[entityKey];
  const [state, action, pending] = useActionState<FormState, FormData>(saveEntityAction.bind(null, entityKey, id), {});
  const formRef = useFocusFirstError(state);
  const errors = state.errors ?? {};
  // After a save attempt, keep showing what the admin typed (React resets forms after actions).
  const current = state.values ?? initial;

  const renderField = (field: FieldDef) => {
    const fid = `f-${field.name}`;
    const error = errors[field.name];
    const describedBy = [field.help ? `${fid}-help` : null, error ? `${fid}-error` : null].filter(Boolean).join(" ") || undefined;
    const value = current[field.name];
    const common = {
      id: fid,
      name: field.name,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy,
      className: styles.input,
    };
    const wrap = (control: React.ReactNode, labelFor = true) => (
      <div key={field.name} className={`${styles.field} ${field.full ? styles.full : ""}`}>
        {labelFor ? (
          <label htmlFor={fid} className={styles.label}>
            {field.label} {field.required ? <span className={styles.required} aria-hidden="true">*</span> : null}
          </label>
        ) : null}
        {control}
        {field.help ? (
          <p id={`${fid}-help`} className={styles.hint}>
            {field.help}
          </p>
        ) : null}
        {error ? (
          <p id={`${fid}-error`} className={styles.fieldError}>
            {error}
          </p>
        ) : null}
      </div>
    );

    switch (field.type) {
      case "text":
      case "url":
        return wrap(
          <input
            {...common}
            type={field.type === "url" ? "text" : "text"}
            inputMode={field.type === "url" ? "url" : undefined}
            defaultValue={asString(value)}
            maxLength={field.maxLength}
            required={field.required}
            placeholder={field.placeholder}
          />,
        );
      case "textarea":
        return wrap(
          <textarea {...common} defaultValue={asString(value)} maxLength={field.maxLength} rows={field.rows ?? 4} required={field.required} placeholder={field.placeholder} />,
        );
      case "number":
        return wrap(
          <input
            {...common}
            type="number"
            defaultValue={asString(value)}
            min={field.min}
            max={field.max}
            step={field.step ?? (field.integer ? 1 : "any")}
            required={field.required}
            placeholder={field.placeholder}
          />,
        );
      case "date":
        return wrap(<input {...common} type="date" defaultValue={asString(value).slice(0, 10)} required={field.required} />);
      case "select":
        return wrap(
          <select {...common} defaultValue={asString(value)} required={field.required}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>,
        );
      case "list":
        return wrap(
          <textarea
            {...common}
            defaultValue={Array.isArray(value) ? value.join("\n") : ""}
            rows={Math.max(4, Array.isArray(value) ? value.length + 1 : 4)}
            placeholder={field.placeholder}
          />,
        );
      case "checkbox":
        return (
          <div key={field.name} className={`${styles.field} ${field.full ? styles.full : ""}`}>
            <span className={styles.label}>{field.label}</span>
            <label className={styles.checkRow}>
              <input type="checkbox" name={field.name} defaultChecked={value === true} aria-describedby={describedBy} />
              {field.checkboxLabel}
            </label>
            {field.help ? (
              <p id={`${fid}-help`} className={styles.hint}>
                {field.help}
              </p>
            ) : null}
          </div>
        );
      case "multiselect": {
        const selected = new Set(Array.isArray(value) ? (value as string[]) : []);
        return (
          <fieldset key={field.name} className={`${styles.fieldset} ${styles.field} ${field.full ? styles.full : ""}`} aria-describedby={describedBy}>
            <legend className={styles.label}>{field.label}</legend>
            <div className={styles.checkGrid}>
              {field.options.map((o) => (
                <label key={o.value} className={styles.checkRow}>
                  <input type="checkbox" name={field.name} value={o.value} defaultChecked={selected.has(o.value)} />
                  {o.label}
                </label>
              ))}
            </div>
            {error ? (
              <p id={`${fid}-error`} className={styles.fieldError}>
                {error}
              </p>
            ) : null}
          </fieldset>
        );
      }
      case "image":
        return (
          <div key={field.name} className={field.full ? styles.full : undefined}>
            <ImageField name={field.name} label={field.label} folder={def.folder!} initialPath={(value as string) ?? null} error={error} help={field.help} />
          </div>
        );
      case "images":
        return (
          <div key={field.name} className={field.full ? styles.full : undefined}>
            <ImagesField
              name={field.name}
              label={field.label}
              folder={def.folder!}
              initialPaths={Array.isArray(value) ? (value as string[]) : []}
              maxItems={field.maxItems}
              error={error}
            />
          </div>
        );
    }
  };

  return (
    <form ref={formRef} action={action} className={`${styles.card} ${styles.form}`} noValidate>
      {state.ok && state.message ? <Notice kind="success">{state.message}</Notice> : null}
      {!state.ok && !state.error && savedNotice ? <Notice kind="success">{def.singular} created.</Notice> : null}
      {state.error ? <Notice kind="error">{state.error}</Notice> : null}
      <div className={styles.formGrid}>{def.fields.map(renderField)}</div>
      <div className={styles.formActions}>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`} disabled={pending}>
          {pending ? "Saving…" : id ? "Save changes" : `Create ${def.singular.toLowerCase()}`}
        </button>
        <Link href={`/admin/${entityKey}`} className={styles.btn}>
          Back to list
        </Link>
      </div>
    </form>
  );
}

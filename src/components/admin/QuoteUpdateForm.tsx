"use client";

import { useActionState } from "react";
import { updateQuoteAction } from "@/app/admin/actions/quotes";
import type { FormState } from "@/app/admin/actions/content";
import { quoteStatuses } from "@/lib/quote";
import { Notice } from "./Notice";
import { SettingsField } from "./SettingsField";
import styles from "./admin.module.css";

export function QuoteUpdateForm({ id, status, notes }: { id: string; status: string; notes: string | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateQuoteAction.bind(null, id), {});
  const e = state.errors ?? {};
  const v = (state.values ?? {}) as { status?: string; internal_notes?: string };
  return (
    <form action={action} className={`${styles.card} ${styles.form}`} noValidate>
      <h2>Status &amp; notes</h2>
      {state.ok && state.message ? <Notice kind="success">{state.message}</Notice> : null}
      {state.error ? <Notice kind="error">{state.error}</Notice> : null}
      <SettingsField name="status" label="Status" required error={e.status}>
        {(p) => (
          <select {...p} defaultValue={v.status ?? status}>
            {quoteStatuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}
      </SettingsField>
      <SettingsField name="internal_notes" label="Internal notes" error={e.internal_notes} help="Only visible to admins. Not shared with the customer.">
        {(p) => <textarea {...p} defaultValue={v.internal_notes ?? notes ?? ""} rows={6} maxLength={5000} />}
      </SettingsField>
      <div className={styles.formActions}>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { saveBusinessSettingsAction } from "@/app/admin/actions/settings";
import type { FormState } from "@/app/admin/actions/content";
import { Notice } from "./Notice";
import { SettingsField } from "./SettingsField";
import { useFocusFirstError } from "./useFocusFirstError";
import styles from "./admin.module.css";

export type BusinessSettingsValues = {
  business_name: string;
  phone_display: string;
  phone_e164: string;
  email: string;
  facebook_url: string | null;
  messenger_url: string | null;
  service_area_text: string | null;
  service_area_short: string | null;
  office_address: string | null;
  business_hours: string | null;
  quote_cta_label: string;
  quotes_are_free: boolean;
};

export function BusinessSettingsForm({ initial }: { initial: BusinessSettingsValues }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveBusinessSettingsAction, {});
  const formRef = useFocusFirstError(state);
  const e = state.errors ?? {};
  // Keep typed values after a failed save (React resets forms after actions).
  const v = { ...initial, ...(state.values as Partial<BusinessSettingsValues> | undefined) };
  const val = (x: string | null | undefined) => x ?? "";

  return (
    <form ref={formRef} action={action} className={`${styles.card} ${styles.form}`} noValidate>
      {state.ok && state.message ? <Notice kind="success">{state.message}</Notice> : null}
      {state.error ? <Notice kind="error">{state.error}</Notice> : null}

      <h2>Business details</h2>
      <div className={styles.formGrid}>
        <SettingsField name="business_name" label="Business name" required error={e.business_name}>
          {(p) => <input {...p} defaultValue={val(v.business_name)} maxLength={120} />}
        </SettingsField>
        <SettingsField name="email" label="Email" required error={e.email}>
          {(p) => <input {...p} type="email" defaultValue={val(v.email)} maxLength={254} />}
        </SettingsField>
        <SettingsField name="phone_display" label="Phone number (as shown)" required error={e.phone_display} help="e.g. 0997 731 0543">
          {(p) => <input {...p} defaultValue={val(v.phone_display)} maxLength={30} />}
        </SettingsField>
        <SettingsField name="phone_e164" label="Phone number (international format)" required error={e.phone_e164} help="Used for tap-to-call links, e.g. +639977310543">
          {(p) => <input {...p} defaultValue={val(v.phone_e164)} maxLength={16} inputMode="tel" />}
        </SettingsField>
        <SettingsField name="facebook_url" label="Facebook page URL" error={e.facebook_url}>
          {(p) => <input {...p} type="url" defaultValue={val(v.facebook_url)} maxLength={300} />}
        </SettingsField>
        <SettingsField name="messenger_url" label="Messenger URL" error={e.messenger_url} help="Used for every “Message Us” button.">
          {(p) => <input {...p} type="url" defaultValue={val(v.messenger_url)} maxLength={300} />}
        </SettingsField>
        <SettingsField name="service_area_text" label="Service area text" full error={e.service_area_text} help="Shown in the About section, footer and quote section.">
          {(p) => <textarea {...p} defaultValue={val(v.service_area_text)} maxLength={400} rows={2} />}
        </SettingsField>
        <SettingsField name="service_area_short" label="Service area (short)" error={e.service_area_short} help="Shown next to the map pin, e.g. Dumaguete City & Negros Oriental">
          {(p) => <input {...p} defaultValue={val(v.service_area_short)} maxLength={80} />}
        </SettingsField>
        <SettingsField name="office_address" label="Office address (optional)" error={e.office_address} help="Leave empty to hide it on the website.">
          {(p) => <input {...p} defaultValue={val(v.office_address)} maxLength={300} />}
        </SettingsField>
        <SettingsField name="business_hours" label="Business hours (optional)" error={e.business_hours} help="Leave empty to hide them on the website.">
          {(p) => <input {...p} defaultValue={val(v.business_hours)} maxLength={150} placeholder="e.g. Mon – Sat, 8:00 AM – 5:00 PM" />}
        </SettingsField>
      </div>

      <h2 className={styles.sectionTitle}>Quote button wording</h2>
      <div className={styles.formGrid}>
        <SettingsField name="quote_cta_label" label="Main quote button text" required error={e.quote_cta_label} help="Used in the header, hero, footer and mobile bar.">
          {(p) => <input {...p} defaultValue={val(v.quote_cta_label)} maxLength={40} />}
        </SettingsField>
        <div className={styles.field}>
          <span className={styles.label}>Free quotations</span>
          <label className={styles.checkRow}>
            <input type="checkbox" name="quotes_are_free" defaultChecked={v.quotes_are_free} />
            Quotations are free (shows “Free” in quote headings and buttons)
          </label>
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`} disabled={pending}>
          {pending ? "Saving…" : "Save business settings"}
        </button>
      </div>
    </form>
  );
}

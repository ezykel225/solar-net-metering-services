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
  google_maps_url: string | null;
  google_maps_embed_url: string | null;
  plus_code: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  registration_authority: string | null;
  registration_status: string | null;
  registration_scope: string | null;
  registration_region: string | null;
  registration_date: string | null;
  registration_expiry_date: string | null;
  quote_cta_label: string;
  quotes_are_free: boolean;
};

export function BusinessSettingsForm({ initial }: { initial: BusinessSettingsValues }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveBusinessSettingsAction, {});
  const formRef = useFocusFirstError(state);
  const e = state.errors ?? {};
  // Keep typed values after a failed save (React resets forms after actions).
  const v = { ...initial, ...(state.values as Partial<BusinessSettingsValues> | undefined) };
  const val = (x: string | number | null | undefined) => (x == null ? "" : String(x));

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
        <SettingsField name="phone_display" label="Phone number (as shown)" required error={e.phone_display} help="e.g. 0955 270 4060">
          {(p) => <input {...p} defaultValue={val(v.phone_display)} maxLength={30} />}
        </SettingsField>
        <SettingsField name="phone_e164" label="Phone number (international format)" required error={e.phone_e164} help="Used for tap-to-call links, e.g. +639552704060">
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
        <SettingsField name="business_hours" label="Business hours (optional)" error={e.business_hours} help="Leave empty to hide them on the website.">
          {(p) => <input {...p} defaultValue={val(v.business_hours)} maxLength={150} placeholder="e.g. Mon – Sat, 8:00 AM – 5:00 PM" />}
        </SettingsField>
      </div>

      <h2 className={styles.sectionTitle}>Location &amp; map</h2>
      <p className={styles.hint}>
        Keep these the same as the Google Business Profile. Used on the Contact page, footer and in search-engine data.
      </p>
      <div className={styles.formGrid}>
        <SettingsField name="office_address" label="Business address" full error={e.office_address} help="Exact address as on Google Maps. Leave empty to hide it on the website.">
          {(p) => <input {...p} defaultValue={val(v.office_address)} maxLength={300} />}
        </SettingsField>
        <SettingsField name="google_maps_url" label="Google Maps link" error={e.google_maps_url} help="Google Maps → your business → Share → Copy link. Used for “View on Google Maps”.">
          {(p) => <input {...p} type="url" inputMode="url" defaultValue={val(v.google_maps_url)} maxLength={500} placeholder="https://maps.app.goo.gl/…" />}
        </SettingsField>
        <SettingsField name="plus_code" label="Plus Code (optional)" error={e.plus_code} help="Shown under the address; also used for “Get Directions”.">
          {(p) => <input {...p} defaultValue={val(v.plus_code)} maxLength={120} placeholder="e.g. 875R+JP Dumaguete City, Negros Oriental" />}
        </SettingsField>
        <SettingsField
          name="google_maps_embed_url"
          label="Map embed link (optional)"
          full
          error={e.google_maps_embed_url}
          help="Google Maps → your business → Share → Embed a map → Copy HTML, then paste it here (the whole code or just the link). Leave empty to show the address and buttons without a map."
        >
          {(p) => <textarea {...p} defaultValue={val(v.google_maps_embed_url)} maxLength={2400} rows={3} placeholder="https://www.google.com/maps/embed?pb=…" />}
        </SettingsField>
        <SettingsField name="latitude" label="Latitude (optional)" error={e.latitude} help="Only from the official listing. Leave empty if unsure.">
          {(p) => <input {...p} defaultValue={val(v.latitude)} maxLength={12} inputMode="decimal" placeholder="e.g. 12.345678" />}
        </SettingsField>
        <SettingsField name="longitude" label="Longitude (optional)" error={e.longitude} help="Fill in both latitude and longitude, or neither.">
          {(p) => <input {...p} defaultValue={val(v.longitude)} maxLength={13} inputMode="decimal" placeholder="e.g. 123.456789" />}
        </SettingsField>
      </div>

      <h2 className={styles.sectionTitle}>Business registration</h2>
      <p className={styles.hint}>
        Shown as a short “registered business” note on the About page once the authority and status are filled in. Do not
        enter the certificate number or QR code; they are not shown on the website.
      </p>
      <div className={styles.formGrid}>
        <SettingsField name="registration_authority" label="Registration authority (optional)" error={e.registration_authority} help="e.g. Department of Trade and Industry (DTI)">
          {(p) => <input {...p} defaultValue={val(v.registration_authority)} maxLength={120} />}
        </SettingsField>
        <SettingsField name="registration_status" label="Registration status (optional)" error={e.registration_status} help="e.g. DTI Registered">
          {(p) => <input {...p} defaultValue={val(v.registration_status)} maxLength={60} />}
        </SettingsField>
        <SettingsField name="registration_scope" label="Registration scope (optional)" error={e.registration_scope} help="e.g. Regional">
          {(p) => <input {...p} defaultValue={val(v.registration_scope)} maxLength={60} />}
        </SettingsField>
        <SettingsField name="registration_region" label="Registration region (optional)" error={e.registration_region} help="e.g. Negros Island Region (NIR)">
          {(p) => <input {...p} defaultValue={val(v.registration_region)} maxLength={120} />}
        </SettingsField>
        <SettingsField name="registration_date" label="Registration date (optional)" error={e.registration_date}>
          {(p) => <input {...p} type="date" defaultValue={val(v.registration_date)} />}
        </SettingsField>
        <SettingsField name="registration_expiry_date" label="Valid until (optional)" error={e.registration_expiry_date}>
          {(p) => <input {...p} type="date" defaultValue={val(v.registration_expiry_date)} />}
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

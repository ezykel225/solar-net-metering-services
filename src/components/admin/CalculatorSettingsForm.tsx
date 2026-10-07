"use client";

import { useActionState, useState, type FormEvent } from "react";
import { saveCalculatorSettingsAction } from "@/app/admin/actions/settings";
import type { FormState } from "@/app/admin/actions/content";
import {
  calculateSolarEstimate,
  calculatorConfigFromRow,
  defaultCalculatorInput,
  formatPesoRange,
  formatRange,
  formatRate,
  getAppliedRate,
  notSureMethodLabels,
  type CalculatorSettingsRow,
} from "@/lib/solar-calculator";
import { Notice } from "./Notice";
import { SettingsField } from "./SettingsField";
import { useFocusFirstError } from "./useFocusFirstError";
import styles from "./admin.module.css";

export type CalculatorSettingsValues = CalculatorSettingsRow;

const EXAMPLE_BILLS = [3000, 5000, 10000];

/** Builds a row-shaped object from the form, for the live preview. */
function rowFromForm(form: HTMLFormElement): CalculatorSettingsRow {
  const fd = new FormData(form);
  const obj = Object.fromEntries(fd.entries()) as Record<string, string>;
  return {
    ...(obj as unknown as CalculatorSettingsRow),
    not_sure_custom_rate: obj.not_sure_custom_rate ? obj.not_sure_custom_rate : null,
    export_credit_verified: obj.export_credit_verified === "verified",
  };
}

export function CalculatorSettingsForm({ initial }: { initial: CalculatorSettingsValues }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCalculatorSettingsAction, {});
  const formRef = useFocusFirstError(state);
  const [previewRow, setPreviewRow] = useState<CalculatorSettingsRow>(initial);
  const [method, setMethod] = useState(String(initial.not_sure_method ?? "average"));
  const [verified, setVerified] = useState(initial.export_credit_verified === true);
  const e = state.errors ?? {};
  const v = { ...initial, ...(state.values as Partial<CalculatorSettingsValues> | undefined) };
  const val = (x: unknown) => (x == null ? "" : String(x));

  const preview = calculatorConfigFromRow(previewRow);
  const approx = getAppliedRate("Commercial", "notSure", preview);
  const onChange = (event: FormEvent<HTMLFormElement>) => setPreviewRow(rowFromForm(event.currentTarget));

  return (
    <form ref={formRef} action={action} onChange={onChange} className={styles.form} noValidate>
      {state.ok && state.message ? <Notice kind="success">{state.message}</Notice> : null}
      {state.error ? <Notice kind="error">{state.error}</Notice> : null}

      <section className={styles.card} aria-labelledby="rates-h">
        <h2 id="rates-h">Electricity rates</h2>
        <p className={styles.cardIntro}>Retail rates (₱ per kWh) used to estimate monthly usage from a customer’s bill.</p>
        <div className={styles.formGrid}>
          <SettingsField name="residential_rate" label="Residential rate (₱/kWh)" required error={e.residential_rate}>
            {(p) => <input {...p} type="number" step="0.0001" min="0.01" max="99.99" defaultValue={val(v.residential_rate)} />}
          </SettingsField>
          <SettingsField name="low_voltage_rate" label="Low Voltage rate (₱/kWh)" required error={e.low_voltage_rate}>
            {(p) => <input {...p} type="number" step="0.0001" min="0.01" max="99.99" defaultValue={val(v.low_voltage_rate)} />}
          </SettingsField>
          <SettingsField name="high_voltage_rate" label="High Voltage rate (₱/kWh)" required error={e.high_voltage_rate}>
            {(p) => <input {...p} type="number" step="0.0001" min="0.01" max="99.99" defaultValue={val(v.high_voltage_rate)} />}
          </SettingsField>
          <SettingsField
            name="rate_source"
            label="Rate source / cooperative"
            required
            error={e.rate_source}
            help="Shown to visitors. Don’t name NORECO 1 or NORECO 2 until confirmed."
          >
            {(p) => <input {...p} defaultValue={val(v.rate_source)} maxLength={150} />}
          </SettingsField>
          <SettingsField name="rate_billing_period" label="Billing period / effective month" error={e.rate_billing_period} help="e.g. October 2026">
            {(p) => <input {...p} defaultValue={val(v.rate_billing_period)} maxLength={60} />}
          </SettingsField>
          <SettingsField name="rates_updated_on" label="Last updated date" error={e.rates_updated_on}>
            {(p) => <input {...p} type="date" defaultValue={val(v.rates_updated_on).slice(0, 10)} />}
          </SettingsField>
        </div>
      </section>

      <section className={styles.card} aria-labelledby="notsure-h">
        <h2 id="notsure-h">Commercial “Not Sure” rate</h2>
        <p className={styles.cardIntro}>
          Used when a commercial visitor doesn’t know if they are Low Voltage or High Voltage. Results are always labelled as
          approximate. Current approximate rate: <strong>₱{formatRate(approx.ratePerKwh)}/kWh</strong>.
        </p>
        <div className={styles.formGrid}>
          <SettingsField name="not_sure_method" label="How to approximate the rate" required error={e.not_sure_method}>
            {(p) => (
              <select {...p} defaultValue={method} onChange={(ev) => setMethod(ev.target.value)}>
                {Object.entries(notSureMethodLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          </SettingsField>
          {method === "custom" ? (
            <SettingsField name="not_sure_custom_rate" label="Custom approximate rate (₱/kWh)" required error={e.not_sure_custom_rate}>
              {(p) => <input {...p} type="number" step="0.0001" min="0.01" max="99.99" defaultValue={val(v.not_sure_custom_rate)} />}
            </SettingsField>
          ) : null}
        </div>
      </section>

      <section className={styles.card} aria-labelledby="assume-h">
        <h2 id="assume-h">Calculator assumptions</h2>
        <div className={styles.formGrid}>
          <SettingsField name="peak_sun_hours" label="Peak sun hours per day" required error={e.peak_sun_hours} help="Between 1 and 10.">
            {(p) => <input {...p} type="number" step="0.01" min="1" max="10" defaultValue={val(v.peak_sun_hours)} />}
          </SettingsField>
          <SettingsField name="system_efficiency" label="System efficiency factor" required error={e.system_efficiency} help="0.5–1 (0.8 = 80% after losses).">
            {(p) => <input {...p} type="number" step="0.001" min="0.5" max="1" defaultValue={val(v.system_efficiency)} />}
          </SettingsField>
          <SettingsField name="panel_wattage" label="Default panel wattage (W)" required error={e.panel_wattage}>
            {(p) => <input {...p} type="number" step="1" min="100" max="1000" defaultValue={val(v.panel_wattage)} />}
          </SettingsField>
          <SettingsField name="max_bill_reduction_share" label="Maximum estimated bill reduction" required error={e.max_bill_reduction_share} help="0.1–1 (0.85 = 85% of the bill).">
            {(p) => <input {...p} type="number" step="0.001" min="0.1" max="1" defaultValue={val(v.max_bill_reduction_share)} />}
          </SettingsField>
          <SettingsField name="coverage_low" label="Coverage target: low daytime use" required error={e.coverage_low} help="Share of monthly usage the system is sized for (0.6 = 60%).">
            {(p) => <input {...p} type="number" step="0.001" min="0.1" max="1.2" defaultValue={val(v.coverage_low)} />}
          </SettingsField>
          <SettingsField name="coverage_medium" label="Coverage target: medium daytime use" required error={e.coverage_medium}>
            {(p) => <input {...p} type="number" step="0.001" min="0.1" max="1.2" defaultValue={val(v.coverage_medium)} />}
          </SettingsField>
          <SettingsField name="coverage_high" label="Coverage target: high daytime use" required error={e.coverage_high}>
            {(p) => <input {...p} type="number" step="0.001" min="0.1" max="1.2" defaultValue={val(v.coverage_high)} />}
          </SettingsField>
          <div />
          <SettingsField name="min_monthly_bill" label="Minimum accepted monthly bill (₱)" required error={e.min_monthly_bill}>
            {(p) => <input {...p} type="number" step="1" min="1" defaultValue={val(v.min_monthly_bill)} />}
          </SettingsField>
          <SettingsField name="max_monthly_bill" label="Maximum accepted monthly bill (₱)" required error={e.max_monthly_bill}>
            {(p) => <input {...p} type="number" step="1" min="1" defaultValue={val(v.max_monthly_bill)} />}
          </SettingsField>
        </div>
      </section>

      <section className={styles.card} aria-labelledby="export-h">
        <h2 id="export-h">Net-metering export credit</h2>
        {!verified ? (
          <Notice kind="warning">
            <p>
              <strong>Unverified.</strong> The public calculator labels this value as an unverified assumption and never presents
              it as official. Mark it verified only when you have an official net-metering credit reference.
            </p>
          </Notice>
        ) : null}
        <div className={styles.formGrid}>
          <SettingsField
            name="export_credit_ratio"
            label="Export credit factor"
            required
            error={e.export_credit_ratio}
            help="Value of exported energy compared with the retail rate (0.5 = 50%)."
          >
            {(p) => <input {...p} type="number" step="0.001" min="0" max="1.5" defaultValue={val(v.export_credit_ratio)} />}
          </SettingsField>
          <SettingsField name="export_credit_verified" label="Verification status" required error={e.export_credit_verified}>
            {(p) => (
              <select {...p} defaultValue={verified ? "verified" : "unverified"} onChange={(ev) => setVerified(ev.target.value === "verified")}>
                <option value="unverified">Unverified</option>
                <option value="verified">Verified</option>
              </select>
            )}
          </SettingsField>
          <SettingsField
            name="export_credit_source"
            label="Source / reference note"
            full
            required={verified}
            error={e.export_credit_source}
            help="Required when Verified, e.g. the official cooperative or ERC document and date."
          >
            {(p) => <textarea {...p} defaultValue={val(v.export_credit_source)} maxLength={300} rows={2} />}
          </SettingsField>
        </div>
      </section>

      <section className={styles.card} aria-labelledby="disc-h">
        <h2 id="disc-h">Calculator disclaimer</h2>
        <SettingsField name="disclaimer" label="Public disclaimer text" required error={e.disclaimer} help="Shown with every result and on the calculator page.">
          {(p) => <textarea {...p} defaultValue={val(v.disclaimer)} maxLength={1000} rows={4} />}
        </SettingsField>
      </section>

      <section className={styles.card} aria-labelledby="preview-h">
        <h2 id="preview-h">Preview (residential, medium daytime use, no battery)</h2>
        <p className={styles.cardIntro}>Updates as you edit. Estimates only.</p>
        <div className={styles.previewBox}>
          <table>
            <thead>
              <tr>
                <th scope="col">Monthly bill</th>
                <th scope="col">System size</th>
                <th scope="col">Panels</th>
                <th scope="col">Bill reduction</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLE_BILLS.map((bill) => {
                const out = calculateSolarEstimate({ ...defaultCalculatorInput, monthlyBill: String(bill) }, preview);
                return (
                  <tr key={bill}>
                    <th scope="row">₱{bill.toLocaleString("en-PH")}</th>
                    {out.ok ? (
                      <>
                        <td>{formatRange(out.result.systemSizeKw, "kW", 1)}</td>
                        <td>{formatRange(out.result.panelCount)}</td>
                        <td>{formatPesoRange(out.result.billReduction)}</td>
                      </>
                    ) : (
                      <td colSpan={3}>{out.error}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className={styles.formActions}>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`} disabled={pending}>
          {pending ? "Saving…" : "Save calculator settings"}
        </button>
      </div>
    </form>
  );
}

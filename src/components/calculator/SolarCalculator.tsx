"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import {
  applianceOptions,
  batteryOptions,
  CALCULATOR_DISCLAIMER,
  calculateSolarEstimate,
  daytimeUsageOptions,
  defaultCalculatorInput,
  formatPeso,
  formatPesoRange,
  formatRange,
  propertyTypeOptions,
  toQuoteParams,
  type Appliance,
  type BatteryPreference,
  type CalculatorInput,
  type CalcPropertyType,
  type DaytimeUsage,
} from "@/lib/solar-calculator";
import { siteConfig } from "@/lib/site";
import { Icon, type IconName } from "@/components/ui/Icon";
import styles from "./SolarCalculator.module.css";

const entries = <K extends string, V>(obj: Record<K, V>) => Object.entries(obj) as [K, V][];

/**
 * Solar savings calculator. All assumptions and maths live in
 * src/lib/solar-calculator.ts; this component only handles input and display.
 * After the first calculation, results update live as inputs change.
 */
export function SolarCalculator() {
  const [input, setInput] = useState<CalculatorInput>(defaultCalculatorInput);
  const [submitted, setSubmitted] = useState(false);
  const [billTouched, setBillTouched] = useState(false);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const billInputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const outcome = submitted || billTouched ? calculateSolarEstimate(input) : null;
  const billError = outcome && !outcome.ok ? outcome.error : null;
  const result = submitted && outcome?.ok ? outcome.result : null;

  const update = <K extends keyof CalculatorInput>(key: K, value: CalculatorInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const toggleAppliance = (key: Appliance) =>
    setInput((prev) => ({
      ...prev,
      appliances: prev.appliances.includes(key) ? prev.appliances.filter((a) => a !== key) : [...prev.appliances, key],
    }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setBillTouched(true);
    const check = calculateSolarEstimate(input);
    if (check.ok) {
      requestAnimationFrame(() => resultsHeadingRef.current?.focus());
    } else {
      billInputRef.current?.focus();
    }
  };

  const billId = `${id}-bill`;
  const billHintId = `${id}-bill-hint`;
  const billErrorId = `${id}-bill-error`;

  return (
    <div className={styles.layout}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Solar savings calculator">
        {/* Monthly bill */}
        <div className={styles.field}>
          <label htmlFor={billId} className={styles.label}>
            Average Monthly Electricity Bill (₱) <span className={styles.required} aria-hidden="true">*</span>
          </label>
          <div className={styles.billWrap}>
            <span className={styles.peso} aria-hidden="true">
              ₱
            </span>
            <input
              ref={billInputRef}
              id={billId}
              name="monthlyBill"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="e.g. 5,000"
              required
              maxLength={12}
              value={input.monthlyBill}
              onChange={(e) => update("monthlyBill", e.target.value)}
              onBlur={() => input.monthlyBill.trim() && setBillTouched(true)}
              aria-invalid={billError ? true : undefined}
              aria-describedby={[billHintId, billError ? billErrorId : ""].filter(Boolean).join(" ")}
              className={styles.billInput}
            />
          </div>
          <p id={billHintId} className={styles.hint}>
            Check a recent electricity bill for your typical monthly amount.
          </p>
          {billError ? (
            <p id={billErrorId} className={styles.error}>
              {billError}
            </p>
          ) : null}
        </div>

        {/* Property type */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>Property Type</legend>
          <div className={styles.choices2}>
            {propertyTypeOptions.map((type) => (
              <Choice
                key={type}
                type="radio"
                name={`${id}-property`}
                checked={input.propertyType === type}
                onChange={() => update("propertyType", type as CalcPropertyType)}
                icon={type === "Residential" ? "home" : "building"}
                label={type}
              />
            ))}
          </div>
        </fieldset>

        {/* Daytime usage */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>Daytime Electricity Usage</legend>
          <div className={styles.choices3}>
            {entries(daytimeUsageOptions).map(([key, opt]) => (
              <Choice
                key={key}
                type="radio"
                name={`${id}-daytime`}
                checked={input.daytimeUsage === key}
                onChange={() => update("daytimeUsage", key as DaytimeUsage)}
                label={opt.label}
                hint={opt.hint}
              />
            ))}
          </div>
        </fieldset>

        {/* Appliances */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>
            Main Appliances / Loads <span className={styles.optional}>(optional, select all that apply)</span>
          </legend>
          <div className={styles.checks}>
            {entries(applianceOptions).map(([key, opt]) => (
              <Choice
                key={key}
                type="checkbox"
                name={`${id}-appliances`}
                checked={input.appliances.includes(key as Appliance)}
                onChange={() => toggleAppliance(key as Appliance)}
                label={opt.label}
                compact
              />
            ))}
          </div>
        </fieldset>

        {/* Battery */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>Battery Backup Preference</legend>
          <div className={styles.choices3}>
            {entries(batteryOptions).map(([key, opt]) => (
              <Choice
                key={key}
                type="radio"
                name={`${id}-battery`}
                checked={input.battery === key}
                onChange={() => update("battery", key as BatteryPreference)}
                label={opt.label}
                hint={opt.hint}
              />
            ))}
          </div>
        </fieldset>

        <button type="submit" className="btn btn--primary btn--block">
          {result ? "Recalculate" : "Calculate My Estimate"} <Icon name="arrowRight" size={18} />
        </button>
      </form>

      <section className={styles.results} aria-labelledby={`${id}-results-title`}>
        {result ? (
          <>
            <p className={styles.eyebrow}>Initial estimate</p>
            <h2 id={`${id}-results-title`} ref={resultsHeadingRef} tabIndex={-1} className={styles.resultsTitle}>
              Your Solar Estimate
            </h2>
            <p className={styles.basedOn}>
              Based on a monthly bill of <strong>{formatPeso(result.monthlyBill)}</strong>{" "}
              for a {input.propertyType.toLowerCase()} property.
            </p>

            <dl className={styles.stats}>
              <Stat icon="plug" label="Estimated monthly electricity usage" value={formatRange({ low: Math.round(result.monthlyUsageKwh), high: Math.round(result.monthlyUsageKwh) }, "kWh")} />
              <Stat icon="sun" label="Suggested solar system size" value={formatRange(result.systemSizeKw, "kW", 1)} highlight />
              <Stat icon="panel" label="Estimated number of panels" value={formatRange(result.panelCount, "panels")} />
              <Stat
                icon="bolt"
                label="Estimated monthly solar generation"
                value={formatRange({ low: Math.round(result.monthlyGenerationKwh.low), high: Math.round(result.monthlyGenerationKwh.high) }, "kWh")}
              />
              <Stat icon="trendingDown" label="Estimated monthly bill reduction" value={formatPesoRange(result.billReduction)} highlight />
              <Stat
                icon="battery"
                label="Suggested battery option"
                value={result.batteryKwh ? formatRange(result.batteryKwh, "kWh", 1) : "No battery"}
              />
            </dl>

            <div className={styles.summary}>
              <p>
                <strong>Suggested system type:</strong> {result.systemType}
              </p>
              <p>
                <strong>Battery:</strong> {result.batterySuggestion}
              </p>
              {result.notes.length > 0 ? (
                <ul className={styles.notes}>
                  {result.notes.map((n) => (
                    <li key={n}>
                      <Icon name="checkCircle" size={16} /> {n}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <p className={styles.disclaimer} role="note">
              <Icon name="fileText" size={18} /> {CALCULATOR_DISCLAIMER}
            </p>

            <div className={styles.cta}>
              <h3>Get an Exact Site Assessment</h3>
              <p>We’ll check your roof, usage and loads to recommend the right system. Your details will be pre-filled in the quote form for you to review.</p>
              <div className={styles.ctaActions}>
                <Link className="btn btn--primary" href={`/contact?${toQuoteParams(input, result)}#quote`}>
                  Get an Exact Site Assessment <Icon name="arrowRight" size={18} />
                </Link>
                <a className="btn btn--secondary" href={siteConfig.social.messenger} target="_blank" rel="noopener noreferrer">
                  <Icon name="messenger" size={18} /> Message Us
                  <span className="sr-only"> on Facebook Messenger (opens in a new tab)</span>
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <Icon name="chart" size={30} />
            </span>
            <h2 id={`${id}-results-title`} className={styles.resultsTitle}>
              Your estimate will appear here
            </h2>
            <p>Enter your average monthly bill and choose your options, then select “Calculate My Estimate”.</p>
            <ul className={styles.emptyList}>
              <li>Suggested system size</li>
              <li>Number of panels</li>
              <li>Estimated bill reduction range</li>
              <li>Battery recommendation</li>
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value, highlight }: { icon: IconName; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`${styles.stat} ${highlight ? styles.statHighlight : ""}`}>
      <dt>
        <Icon name={icon} size={18} /> {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

type ChoiceProps = {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
  icon?: IconName;
  compact?: boolean;
};

/** Native radio/checkbox styled as a selectable card; fully keyboard accessible. */
function Choice({ type, name, checked, onChange, label, hint, icon, compact }: ChoiceProps) {
  return (
    <label className={`${styles.choice} ${compact ? styles.choiceCompact : ""}`}>
      <input type={type} name={name} checked={checked} onChange={onChange} className={styles.choiceInput} />
      <span className={styles.choiceBox}>
        <span className={styles.choiceMark} aria-hidden="true">
          {type === "checkbox" ? <Icon name="check" size={14} /> : null}
        </span>
        <span className={styles.choiceText}>
          <span className={styles.choiceLabel}>
            {icon ? <Icon name={icon} size={18} /> : null}
            {label}
          </span>
          {hint ? <span className={styles.choiceHint}>{hint}</span> : null}
        </span>
      </span>
    </label>
  );
}

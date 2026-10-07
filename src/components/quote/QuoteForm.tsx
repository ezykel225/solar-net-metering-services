"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import {
  emptyQuoteRequest,
  propertyTypes,
  quoteLimits,
  serviceOptions,
  submitQuoteRequest,
  validateQuoteRequest,
  type QuoteErrors,
  type QuoteField,
  type QuoteRequest,
} from "@/lib/quote";
import { CONSENT_REQUIRED_MESSAGE, consentText } from "@/lib/privacy";
import type { CalculatorQuoteInput } from "@/lib/solar-calculator";
import { Icon } from "@/components/ui/Icon";
import { FormField } from "./FormField";
import styles from "./QuoteForm.module.css";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

type Status = "idle" | "submitting" | "success" | "error";

/** Order used to focus the first invalid field after a failed submit. */
const fieldOrder: QuoteField[] = ["fullName", "phone", "email", "location", "propertyType", "monthlyBill", "service", "message"];

type FieldEvent<E> = E & { target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement };

type QuoteFormProps = {
  /** Values to pre-fill, e.g. from the Solar Calculator. The visitor reviews them before sending. */
  initialValues?: Partial<QuoteRequest> | null;
  /** Solar Calculator inputs sent with the request (the server recomputes the estimate). */
  calculator?: CalculatorQuoteInput | null;
};

export function QuoteForm({ initialValues, calculator }: QuoteFormProps = {}) {
  const settings = useSiteSettings();
  const pathname = usePathname();
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [submitErrorKind, setSubmitErrorKind] = useState<string | undefined>();
  const consentRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<QuoteRequest>({ ...emptyQuoteRequest, ...initialValues });
  const [errors, setErrors] = useState<QuoteErrors>({});
  /** Fields the user has left at least once; only these show errors before submit. */
  const [touched, setTouched] = useState<Partial<Record<QuoteField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState("");
  /** Honeypot: hidden from people, often filled in by spam bots. */
  const [website, setWebsite] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const fieldError = (name: QuoteField, data: QuoteRequest) => validateQuoteRequest(data)[name];

  const handleChange = (e: FieldEvent<ChangeEvent>) => {
    const name = e.target.name as QuoteField;
    const next = { ...values, [name]: e.target.value };
    setValues(next);
    // Once a field has been visited, re-check it live so errors clear (or update) as the user types.
    if (touched[name] || errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: fieldError(name, next) }));
    }
  };

  const handleBlur = (e: FieldEvent<FocusEvent>) => {
    const name = e.target.name as QuoteField;
    // Don't flag an untouched empty field just because the user tabbed through it.
    if (!touched[name] && !values[name].trim()) return;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: fieldError(name, values) }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validateQuoteRequest(values);
    setTouched(Object.fromEntries(fieldOrder.map((f) => [f, true])));
    setErrors(nextErrors);

    setConsentError(consent ? "" : CONSENT_REQUIRED_MESSAGE);

    const firstInvalid = fieldOrder.find((f) => nextErrors[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    if (!consent) {
      consentRef.current?.focus();
      return;
    }

    setStatus("submitting");
    setSubmitError("");
    setSubmitErrorKind(undefined);
    const result = await submitQuoteRequest({
      values,
      privacyConsent: consent,
      website, // honeypot: checked on the server
      calculator: calculator ?? undefined,
      sourcePage: pathname,
    });
    if (result.ok) {
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
      return;
    }
    setStatus("error");
    setSubmitError(result.error);
    setSubmitErrorKind(result.kind);
    if (result.fieldErrors) setErrors(result.fieldErrors);
    if (result.consentError) setConsentError(result.consentError);
    const serverInvalid = fieldOrder.find((f) => result.fieldErrors?.[f]);
    if (serverInvalid) formRef.current?.querySelector<HTMLElement>(`[name="${serverInvalid}"]`)?.focus();
  };

  const reset = () => {
    setValues(emptyQuoteRequest);
    setErrors({});
    setTouched({});
    setConsent(false);
    setConsentError("");
    setStatus("idle");
  };

  if (status === "success") {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successIcon}>
          <Icon name="checkCircle" size={40} />
        </span>
        <h3 ref={successRef} tabIndex={-1}>
          Thank you, {values.fullName.trim().split(" ")[0]}!
        </h3>
        <p>
          Your quote request has been received. Our team will get back to you to discuss your solar needs. You can
          also reach us on{" "}
          <a href={settings.messenger} target="_blank" rel="noopener noreferrer">
            Facebook Messenger<span className="sr-only"> (opens in a new tab)</span>
          </a>{" "}
          or call <a href={settings.phoneHref}>{settings.phone}</a>.
        </p>
        <button type="button" className="btn btn--secondary" onClick={reset}>
          Submit another request
        </button>
      </div>
    );
  }

  const fieldProps = (name: QuoteField) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
  });

  const errorCount = Object.values(errors).filter(Boolean).length + (consentError ? 1 : 0);

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate aria-describedby="quote-form-note">
      {initialValues ? (
        <p className={styles.prefilled}>
          <Icon name="chart" size={18} /> We’ve filled in some details from your Solar Calculator estimate. Please
          review them and add your contact details.
        </p>
      ) : null}

      <p id="quote-form-note" className={styles.note}>
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div className="sr-only" role="alert">
        {errorCount > 0 ? `There ${errorCount === 1 ? "is 1 error" : `are ${errorCount} errors`} in the form.` : ""}
      </div>

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="quote-website">Leave this field empty</label>
        <input
          id="quote-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        <FormField label="Full Name" required autoComplete="name" maxLength={quoteLimits.fullName} {...fieldProps("fullName")} />
        <FormField
          label="Phone Number"
          required
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          maxLength={quoteLimits.phone}
          {...fieldProps("phone")}
        />
        <FormField
          label="Email"
          required
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={quoteLimits.email}
          {...fieldProps("email")}
        />
        <FormField
          label="Address / Location"
          required
          autoComplete="street-address"
          maxLength={quoteLimits.location}
          placeholder="e.g. Barangay, City"
          {...fieldProps("location")}
        />
        <FormField
          label="Property Type"
          required
          as="select"
          options={propertyTypes}
          placeholder="Select property type"
          {...fieldProps("propertyType")}
        />
        <FormField
          label="Average Monthly Electricity Bill (₱)"
          required
          inputMode="decimal"
          placeholder="e.g. 5,000"
          hint="Amount in pesos — check a recent bill for your typical amount."
          {...fieldProps("monthlyBill")}
        />
        <FormField
          label="Service Interested In"
          required
          as="select"
          options={serviceOptions}
          placeholder="Select a service"
          className={styles.full}
          {...fieldProps("service")}
        />
        <FormField
          label="Message"
          as="textarea"
          placeholder="Tell us about your property, roof or any questions you have."
          className={styles.full}
          {...fieldProps("message")}
        />
      </div>

      <div className={styles.consent}>
        <label className={styles.consentLabel}>
          <input
            ref={consentRef}
            type="checkbox"
            name="privacyConsent"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (e.target.checked) setConsentError("");
            }}
            required
            aria-invalid={consentError ? true : undefined}
            aria-describedby={consentError ? "quote-consent-error" : undefined}
            className={styles.consentInput}
          />
          <span>
            {consentText(settings.name)} <span className={styles.required} aria-hidden="true">*</span>{" "}
            <Link href="/privacy" target="_blank" rel="noopener">
              Read our Privacy Policy<span className="sr-only"> (opens in a new tab)</span>
            </Link>
          </span>
        </label>
        {consentError ? (
          <p id="quote-consent-error" className={styles.error}>
            {consentError}
          </p>
        ) : null}
      </div>

      {status === "error" && submitError ? (
        <div className={styles.submitError} role="alert">
          <p>{submitError}</p>
          {submitErrorKind === "unavailable" || submitErrorKind === "error" ? (
            <p>
              You can also reach us directly: call <a href={settings.phoneHref}>{settings.phone}</a> or{" "}
              <a href={settings.messenger} target="_blank" rel="noopener noreferrer">
                message us on Facebook Messenger<span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </p>
          ) : null}
        </div>
      ) : null}

      <button type="submit" className="btn btn--primary btn--block" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <span className={styles.spinner} aria-hidden="true" /> Sending request…
          </>
        ) : (
          <>
            {settings.quoteCopy.submit} <Icon name="arrowRight" size={18} />
          </>
        )}
      </button>
      <p className={styles.privacy}>
        <Icon name="shield" size={16} /> We use your details to respond to your quotation request.
      </p>
    </form>
  );
}

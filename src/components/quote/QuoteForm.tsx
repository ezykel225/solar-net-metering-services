"use client";

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
import { siteConfig } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";
import { FormField } from "./FormField";
import styles from "./QuoteForm.module.css";

type Status = "idle" | "submitting" | "success" | "error";

/** Order used to focus the first invalid field after a failed submit. */
const fieldOrder: QuoteField[] = ["fullName", "phone", "email", "location", "propertyType", "monthlyBill", "service", "message"];

type FieldEvent<E> = E & { target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement };

export function QuoteForm() {
  const [values, setValues] = useState<QuoteRequest>(emptyQuoteRequest);
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

    const firstInvalid = fieldOrder.find((f) => nextErrors[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setSubmitError("");
    // Bots that fill the honeypot get a normal-looking success without anything being sent.
    // Phase 2: repeat this check server-side and add rate limiting.
    const result = website ? { ok: true as const } : await submitQuoteRequest(values);
    if (result.ok) {
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
    } else {
      setStatus("error");
      setSubmitError(result.error);
    }
  };

  const reset = () => {
    setValues(emptyQuoteRequest);
    setErrors({});
    setTouched({});
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
          <a href={siteConfig.social.messenger} target="_blank" rel="noopener noreferrer">
            Facebook Messenger<span className="sr-only"> (opens in a new tab)</span>
          </a>{" "}
          or call <a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a>.
        </p>
        <p className={styles.demoNote}>
          Demo mode: this form is not yet connected to a database, so no information was stored or sent.
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

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate aria-describedby="quote-form-note">
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

      {status === "error" && submitError ? (
        <p className={styles.submitError} role="alert">
          {submitError}
        </p>
      ) : null}

      <button type="submit" className="btn btn--primary btn--block" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <span className={styles.spinner} aria-hidden="true" /> Sending request…
          </>
        ) : (
          <>
            Get My Free Quote <Icon name="arrowRight" size={18} />
          </>
        )}
      </button>
      <p className={styles.privacy}>
        <Icon name="shield" size={16} /> We use your details to respond to your quotation request.
      </p>
    </form>
  );
}

"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  emptyQuoteRequest,
  propertyTypes,
  serviceOptions,
  submitQuoteRequest,
  validateQuoteRequest,
  type QuoteErrors,
  type QuoteField,
  type QuoteRequest,
} from "@/lib/quote";
import { Icon } from "@/components/ui/Icon";
import { FormField } from "./FormField";
import styles from "./QuoteForm.module.css";

type Status = "idle" | "submitting" | "success" | "error";

/** Order used to focus the first invalid field after a failed submit. */
const fieldOrder: QuoteField[] = ["fullName", "phone", "email", "location", "propertyType", "monthlyBill", "service", "message"];

export function QuoteForm() {
  const [values, setValues] = useState<QuoteRequest>(emptyQuoteRequest);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the user edits it.
    if (errors[name as QuoteField]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validateQuoteRequest(values);
    setErrors(nextErrors);

    const firstInvalid = fieldOrder.find((f) => nextErrors[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setSubmitError("");
    const result = await submitQuoteRequest(values);
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
          Your quote request has been received. Our team will contact you within 1–2 business days to discuss your
          solar needs and schedule a free site assessment.
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

      <div className={styles.grid}>
        <FormField label="Full Name" required autoComplete="name" {...fieldProps("fullName")} />
        <FormField label="Phone Number" required type="tel" autoComplete="tel" inputMode="tel" {...fieldProps("phone")} />
        <FormField label="Email" required type="email" autoComplete="email" {...fieldProps("email")} />
        <FormField
          label="Address / Location"
          required
          autoComplete="street-address"
          placeholder="City, province or full address"
          {...fieldProps("location")}
        />
        <FormField label="Property Type" required as="select" options={propertyTypes} {...fieldProps("propertyType")} />
        <FormField
          label="Average Monthly Electricity Bill"
          required
          inputMode="decimal"
          placeholder="e.g. 5,000"
          hint="Check a recent bill for your typical amount."
          {...fieldProps("monthlyBill")}
        />
        <FormField label="Service Interested In" required as="select" options={serviceOptions} className={styles.full} {...fieldProps("service")} />
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

      <button type="submit" className="btn btn--primary btn--block" disabled={status === "submitting"} aria-disabled={status === "submitting"}>
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
        <Icon name="shield" size={16} /> We respect your privacy. Your details are only used to prepare your quotation.
      </p>
    </form>
  );
}

import type { ChangeEvent, HTMLAttributes } from "react";
import styles from "./QuoteForm.module.css";

type BaseProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

type InputProps = BaseProps & {
  as?: "input";
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
};
type SelectProps = BaseProps & { as: "select"; options: readonly string[] };
type TextareaProps = BaseProps & { as: "textarea" };

type FormFieldProps = InputProps | SelectProps | TextareaProps;

/** Labelled form control with hint and accessible error messaging. */
export function FormField(props: FormFieldProps) {
  const { label, name, value, onChange, error, hint, required, placeholder, className } = props;
  const id = `field-${name}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const shared = {
    id,
    name,
    value,
    onChange,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: styles.control,
  };

  let control;
  if (props.as === "select") {
    control = (
      <select {...shared}>
        <option value="" disabled>
          Select an option
        </option>
        {props.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  } else if (props.as === "textarea") {
    control = <textarea {...shared} rows={5} placeholder={placeholder} maxLength={2000} />;
  } else {
    control = (
      <input
        {...shared}
        type={props.type ?? "text"}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className={styles.optional}> (optional)</span>
        )}
      </label>
      {control}
      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

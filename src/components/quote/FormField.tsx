import type { ChangeEvent, FocusEvent, HTMLAttributes } from "react";
import styles from "./QuoteForm.module.css";

type BaseProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
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
  maxLength?: number;
};
type SelectProps = BaseProps & { as: "select"; options: readonly string[] };
type TextareaProps = BaseProps & { as: "textarea"; maxLength?: number };

type FormFieldProps = InputProps | SelectProps | TextareaProps;

/** Labelled form control with hint and accessible error messaging. */
export function FormField(props: FormFieldProps) {
  const { label, name, value, onChange, onBlur, error, hint, required, placeholder, className } = props;
  const id = `field-${name}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const counterId = props.as === "textarea" ? `${id}-count` : undefined;
  const describedBy = [hintId, errorId, counterId].filter(Boolean).join(" ") || undefined;

  const shared = {
    id,
    name,
    value,
    onChange,
    onBlur,
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
          {placeholder ?? "Select an option"}
        </option>
        {props.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  } else if (props.as === "textarea") {
    control = <textarea {...shared} rows={5} placeholder={placeholder} maxLength={props.maxLength ?? 2000} />;
  } else {
    control = (
      <input
        {...shared}
        type={props.type ?? "text"}
        enterKeyHint="next"
        maxLength={props.maxLength}
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
      {props.as === "textarea" ? (
        <p id={counterId} className={styles.counter}>
          {value.length.toLocaleString("en-US")} / {(props.maxLength ?? 2000).toLocaleString("en-US")} characters
        </p>
      ) : null}
    </div>
  );
}

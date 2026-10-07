import type { ReactNode } from "react";
import styles from "./admin.module.css";

type Props = {
  name: string;
  label: string;
  error?: string;
  help?: ReactNode;
  full?: boolean;
  required?: boolean;
  children: (props: {
    id: string;
    name: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
    "aria-required"?: boolean;
    className: string;
  }) => ReactNode;
};

/** Labelled form control with help text and an error message. */
export function SettingsField({ name, label, error, help, full, required, children }: Props) {
  const id = `s-${name}`;
  const describedBy = [help ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`${styles.field} ${full ? styles.full : ""}`}>
      <label htmlFor={id} className={styles.label}>
        {label} {required ? <span className={styles.required} aria-hidden="true">*</span> : null}
      </label>
      {children({
        id,
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
        className: styles.input,
      })}
      {help ? (
        <p id={`${id}-help`} className={styles.hint}>
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className={styles.fieldError}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

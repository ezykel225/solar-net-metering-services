"use client";

import { useActionState } from "react";
import { signInAction, type LoginState } from "@/app/admin/actions/auth";
import { Notice } from "./Notice";
import styles from "./admin.module.css";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signInAction, {});
  return (
    <form action={action} className={styles.form} noValidate>
      {state.error ? <Notice kind="error">{state.error}</Notice> : null}
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state.email} className={styles.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={styles.input} />
      </div>
      <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

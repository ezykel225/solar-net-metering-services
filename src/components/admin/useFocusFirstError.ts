"use client";

import { useEffect, useRef } from "react";

/**
 * After a failed save, moves keyboard focus to the first invalid field so
 * keyboard and screen-reader users land on what needs fixing.
 */
export function useFocusFirstError(state: { errors?: Record<string, string> }) {
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!state.errors || Object.keys(state.errors).length === 0) return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);
  return formRef;
}

"use client";

import { useSearchParams } from "next/navigation";
import { quotePrefillFromParams } from "@/lib/solar-calculator";
import { QuoteForm } from "./QuoteForm";

/**
 * Quote form pre-filled from Solar Calculator URL parameters
 * (e.g. /contact?bill=5000&property=Residential&size=2.5-3.5&battery=basic#quote).
 * Nothing is submitted automatically.
 */
export function QuoteFormWithPrefill() {
  const params = useSearchParams();
  const prefill = quotePrefillFromParams(new URLSearchParams(params.toString()));
  // Re-mount the form if the parameters change so the new values are applied.
  return <QuoteForm key={params.toString()} initialValues={prefill} />;
}

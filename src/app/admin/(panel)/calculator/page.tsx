import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin/auth";
import { CalculatorSettingsForm, type CalculatorSettingsValues } from "@/components/admin/CalculatorSettingsForm";
import { Notice } from "@/components/admin/Notice";
import styles from "@/components/admin/admin.module.css";

export const metadata: Metadata = { title: "Calculator Settings" };

export default async function CalculatorSettingsPage() {
  const { supabase } = await requireAdminPage();
  const { data, error } = await supabase.from("calculator_settings").select("*").maybeSingle();
  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1>Calculator Settings</h1>
          <p>Electricity rates and assumptions used by the public Solar Calculator. No code changes needed.</p>
        </div>
      </div>
      {error ? (
        <Notice kind="error">Settings could not be loaded. Please refresh the page.</Notice>
      ) : !data ? (
        <Notice kind="warning">The settings record is missing. Apply the seed migration (see docs/ADMIN_CMS.md).</Notice>
      ) : (
        <CalculatorSettingsForm initial={data as CalculatorSettingsValues} />
      )}
    </>
  );
}

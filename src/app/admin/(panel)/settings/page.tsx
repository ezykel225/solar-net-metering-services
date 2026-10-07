import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin/auth";
import { BusinessSettingsForm, type BusinessSettingsValues } from "@/components/admin/BusinessSettingsForm";
import { Notice } from "@/components/admin/Notice";
import styles from "@/components/admin/admin.module.css";

export const metadata: Metadata = { title: "Business Settings" };

export default async function BusinessSettingsPage() {
  const { supabase } = await requireAdminPage();
  const { data, error } = await supabase.from("business_settings").select("*").maybeSingle();
  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1>Business Settings</h1>
          <p>Contact details and wording used across the public website.</p>
        </div>
      </div>
      {error ? (
        <Notice kind="error">Settings could not be loaded. Please refresh the page.</Notice>
      ) : !data ? (
        <Notice kind="warning">The settings record is missing. Apply the seed migration (see docs/ADMIN_CMS.md).</Notice>
      ) : (
        <BusinessSettingsForm initial={data as BusinessSettingsValues} />
      )}
    </>
  );
}

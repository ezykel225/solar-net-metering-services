import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { NotConfigured } from "@/components/admin/AccessStates";
import { Icon } from "@/components/ui/Icon";
import styles from "@/components/admin/admin.module.css";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
  const ctx = await getAdminContext();
  if (ctx.state === "unconfigured") return <NotConfigured />;
  if (ctx.state === "admin") redirect("/admin");
  return (
    <div className={styles.loginWrap}>
      <main className={styles.loginCard}>
        <div className={styles.loginBrand}>
          <span className={styles.brandMark}>
            <Icon name="sun" size={20} />
          </span>
          Solar Net Metering Services
        </div>
        <h1>Admin sign in</h1>
        <p>Sign in to manage the website. Accounts are created by the site owner.</p>
        <LoginForm />
      </main>
    </div>
  );
}

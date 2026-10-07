import { signOutAction } from "@/app/admin/actions/auth";
import { Icon } from "@/components/ui/Icon";
import styles from "./admin.module.css";

/** Shown when Supabase environment variables are missing. */
export function NotConfigured() {
  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <h1>Admin not configured</h1>
        <p>
          Supabase is not connected yet. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (and the server-only <code>SUPABASE_SERVICE_ROLE_KEY</code>), then
          restart the site. See <code>docs/ADMIN_CMS.md</code>.
        </p>
      </div>
    </div>
  );
}

/** Signed in, but not listed in admin_users. */
export function NotAuthorized({ email }: { email: string | null }) {
  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div className={styles.loginBrand}>
          <Icon name="shield" size={22} /> Access denied
        </div>
        <h1>No admin access</h1>
        <p>
          {email ? <strong>{email}</strong> : "This account"} is signed in but is not authorised to use the admin area.
          Ask the site owner to add this account as an admin.
        </p>
        <form action={signOutAction}>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}>
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}

import { Icon } from "@/components/ui/Icon";
import { getSiteSettings } from "@/lib/cms";
import styles from "./RegistrationNote.module.css";

const formatDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/**
 * Compact, factual business-registration note (About page). Shows only what is
 * entered in Admin → Business Settings; never a certificate number or QR code.
 * Business-name registration is not a certification of products or services.
 */
export async function RegistrationNote() {
  const { name, registration: r } = await getSiteSettings();
  if (!r?.authority || !r.status) return null;
  const heading = /\sRegistered$/i.test(r.status) ? `${r.status.replace(/\sRegistered$/i, "-Registered")} Business` : r.status;
  const scope = r.scope ? ` under ${r.scope} scope` : "";
  const region = r.region ? ` for the ${r.region}` : "";
  return (
    <section className={styles.section} aria-labelledby="registration-title">
      <div className="container">
        <div className={styles.card}>
          <span className={styles.icon} aria-hidden="true">
            <Icon name="shield" size={24} />
          </span>
          <div>
            <h2 id="registration-title" className={styles.title}>
              {heading}
            </h2>
            <p className={styles.text}>
              {name} is registered with the {r.authority}
              {scope}
              {region}.
            </p>
            {r.date || r.expiryDate ? (
              <p className={styles.meta}>
                {r.date ? `Registered ${formatDate(r.date)}` : null}
                {r.date && r.expiryDate ? " · " : null}
                {r.expiryDate ? `valid until ${formatDate(r.expiryDate)}` : null}
              </p>
            ) : null}
            <p className={styles.meta}>This is a business-name registration, not a certification of products or services.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

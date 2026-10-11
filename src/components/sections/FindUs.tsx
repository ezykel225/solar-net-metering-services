import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSiteSettings } from "@/lib/cms";
import { directionsUrl, isGoogleMapsEmbedUrl } from "@/lib/maps";
import styles from "./FindUs.module.css";

/**
 * "Find Us" on the Contact page: address, official Google Maps listing and,
 * when an embed link has been entered in Business Settings, a lazy-loaded map.
 * Standard Google Maps share/embed links only — no Maps API key.
 */
export async function FindUs() {
  const settings = await getSiteSettings();
  if (!settings.address && !settings.mapsUrl) return null;

  const directions = directionsUrl(settings);
  // Re-checked here so only a Google Maps embed can ever be framed.
  const embed = settings.mapsEmbedUrl && isGoogleMapsEmbedUrl(settings.mapsEmbedUrl) ? settings.mapsEmbedUrl : null;
  const newTab = <span className="sr-only"> (opens Google Maps in a new tab)</span>;

  return (
    <section className="section" aria-labelledby="find-us-title">
      <div className="container">
        <SectionHeading id="find-us-title" eyebrow="Find Us" title="Visit Us" />
        <div className={`${styles.layout} ${embed ? styles.withMap : ""}`}>
          <div className={styles.card}>
            <h3 className={styles.name}>{settings.name}</h3>
            <ul className={styles.details}>
              {settings.address ? (
                <li>
                  <Icon name="mapPin" size={20} />
                  <address className={styles.address}>{settings.address}</address>
                </li>
              ) : null}
              {settings.plusCode ? (
                <li>
                  <Icon name="grid" size={20} />
                  <span>
                    <span className={styles.label}>Plus Code</span> {settings.plusCode}
                  </span>
                </li>
              ) : null}
              <li>
                <Icon name="phone" size={20} />
                <a href={settings.phoneHref}>{settings.phone}</a>
              </li>
              {settings.hours ? (
                <li>
                  <Icon name="clock" size={20} />
                  <span>{settings.hours}</span>
                </li>
              ) : null}
            </ul>
            {settings.mapsUrl || directions ? (
              <div className={styles.actions}>
                {directions ? (
                  <a className="btn btn--primary" href={directions} target="_blank" rel="noopener noreferrer">
                    <Icon name="arrowRight" size={18} /> Get Directions
                    {newTab}
                  </a>
                ) : null}
                {settings.mapsUrl ? (
                  <a className="btn btn--secondary" href={settings.mapsUrl} target="_blank" rel="noopener noreferrer">
                    <Icon name="mapPin" size={18} /> View on Google Maps
                    {newTab}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {embed ? (
            <div className={styles.map}>
              <iframe
                src={embed}
                title={`Map showing the location of ${settings.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { getServices } from "@/lib/cms";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ServicesSection.module.css";

type ServicesSectionProps = {
  /** Show the detailed bullet list on each card (used on the Services page). */
  detailed?: boolean;
  showHeading?: boolean;
};

export async function ServicesSection({ detailed = false, showHeading = true }: ServicesSectionProps) {
  const { data: services } = await getServices();
  if (services.length === 0) return null;
  return (
    <section className="section" aria-labelledby="services-title">
      <div className="container">
        {showHeading ? (
          <SectionHeading
            id="services-title"
            eyebrow="What We Do"
            title="Solar Solutions for Every Property"
            intro="From site assessment and quotation to installation and net-metering assistance, we offer solar solutions for homes and businesses."
          />
        ) : (
          // Keeps the heading outline intact (h1 → h2 → h3) when the page hero already introduces the section.
          <h2 id="services-title" className="sr-only">
            Our services
          </h2>
        )}
        <ul className={`${styles.grid} ${detailed ? styles.detailed : ""}`}>
          {services.map((service) => (
            <li key={service.slug} id={detailed ? service.slug : undefined} className={styles.card}>
              <span className={styles.icon}>
                <Icon name={service.icon} size={28} />
              </span>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              {detailed ? (
                <ul className={styles.details}>
                  {service.details.map((d) => (
                    <li key={d}>
                      <Icon name="check" size={18} /> {d}
                    </li>
                  ))}
                </ul>
              ) : (
                <Link href={`/services#${service.slug}`} className={styles.more}>
                  Learn more<span className="sr-only"> about {service.title}</span>
                  <Icon name="arrowRight" size={16} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

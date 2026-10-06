import { PageHero } from "@/components/layout/PageHero";
import { NetMeteringSteps } from "@/components/sections/NetMeteringSteps";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { requiredDocuments } from "@/data/net-metering";
import { faqs } from "@/data/faqs";
import { buildMetadata } from "@/lib/seo";
import styles from "../inner-page.module.css";

export const metadata = buildMetadata({
  title: "Net Metering",
  description:
    "Understand how solar net metering works, what documents are required, and how we handle the net-metering application with your utility.",
  path: "/net-metering",
});

const support = [
  "Check eligibility and system sizing for net metering",
  "Prepare technical documents and single-line diagrams",
  "Help complete and submit your application",
  "Coordinate inspections and meter installation with the utility",
  "Keep you updated until your system is approved",
];

const netMeteringFaqs = faqs.filter((f) => /net metering|net-metering|documents|cloudy/i.test(f.question));

export default function NetMeteringPage() {
  return (
    <>
      <PageHero
        crumb="Net Metering"
        title="Solar Net Metering, Made Simple"
        intro="Use your solar power first, export the surplus to the grid, and earn credits that reduce your electricity bill."
      />

      <section className="section" aria-labelledby="what-title">
        <div className={`container ${styles.split}`}>
          <div>
            <SectionHeading
              id="what-title"
              align="left"
              eyebrow="The Basics"
              title="What Is Net Metering?"
            />
            <div className={styles.prose}>
              <p>
                Net metering is an arrangement with your distribution utility that lets solar owners export excess
                electricity to the grid. A bi-directional meter records both the energy you import and the energy you
                export.
              </p>
              <p>
                When your panels produce more than your property needs — usually at midday — the surplus flows to the
                grid. Those exported kilowatt-hours are credited against your bill, so you benefit from every unit your
                system produces.
              </p>
              <p>
                Rules, credit rates and eligibility depend on your utility and local regulations. Our team will explain
                exactly how it works in your area.
              </p>
            </div>
          </div>
          <div className={styles.panel}>
            <h3>How we help with your application</h3>
            <ul className={styles.checklist}>
              {support.map((s) => (
                <li key={s}>
                  <Icon name="checkCircle" size={20} /> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <NetMeteringSteps showLink={false} />

      <section className="section" aria-labelledby="docs-title">
        <div className="container">
          <SectionHeading
            id="docs-title"
            eyebrow="Requirements"
            title="Common Net-Metering Documents"
            intro="Requirements vary by utility. We’ll give you the exact checklist for your area and prepare the technical documents for you."
          />
          <ul className={styles.docs}>
            {requiredDocuments.map((doc) => (
              <li key={doc}>
                <Icon name="fileText" size={22} />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BenefitsSection />
      <FaqSection items={netMeteringFaqs} />
      <CtaBanner title="Let us handle your net-metering application" text="Get a free quote for a solar system with full net-metering assistance included." />
    </>
  );
}

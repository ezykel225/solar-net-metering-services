import { PageHero } from "@/components/layout/PageHero";
import { NetMeteringSteps } from "@/components/sections/NetMeteringSteps";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { NET_METERING_DISCLAIMER, netMeteringCooperatives, requiredDocuments } from "@/data/net-metering";
import { getFaqs } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import styles from "../inner-page.module.css";

export const metadata = buildMetadata({
  title: "Net Metering for NORECO 1 & NORECO 2",
  description:
    "How solar net metering works, the requirements we help with, and our net-metering application processing for NORECO 1 and NORECO 2 customers.",
  path: "/net-metering",
});

const support = [
  "Process your net-metering application for NORECO 1 or NORECO 2",
  "Help you prepare the requirements for your application",
  "Install your solar system as part of the same project",
  "Answer your questions along the way",
];


export default async function NetMeteringPage() {
  const { data: faqs } = await getFaqs();
  const netMeteringFaqs = faqs.filter((f) => /net metering|net-metering|documents|cloudy|save/i.test(f.question));
  return (
    <>
      <PageHero
        crumb="Net Metering"
        path="/net-metering"
        title="Net Metering for NORECO 1 & NORECO 2 Customers"
        intro="Use your solar power first, export the surplus to the grid, and earn credits on your electricity bill. We process net-metering applications for NORECO 1 and NORECO 2."
      />

      <section className="section" aria-labelledby="what-title">
        <div className={`container ${styles.split}`}>
          <div>
            <SectionHeading id="what-title" align="left" eyebrow="The Basics" title="What Is Net Metering?" />
            <div className={styles.prose}>
              <p>
                Net metering is an arrangement with your electric cooperative that lets solar owners export excess
                electricity to the grid. A bi-directional meter records both the energy you import and the energy you
                export.
              </p>
              <p>
                When your panels produce more than your property needs, the surplus flows to the grid and is credited
                to your account, which can help reduce your electricity bill.
              </p>
              <p>
                Rules, credit rates and processing steps are set by your electric cooperative. We’ll explain how it
                works for your account.
              </p>
            </div>
          </div>
          <div className={styles.panel}>
            <h3>How we help</h3>
            <p className={styles.coops}>
              We process net-metering applications for:{" "}
              {netMeteringCooperatives.map((c, i) => (
                <span key={c}>
                  <strong>{c}</strong>
                  {i < netMeteringCooperatives.length - 1 ? " and " : ""}
                </span>
              ))}
            </p>
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
            title="Requirements We Help With"
            intro="These are the requirements we currently advertise helping our customers prepare:"
          />
          <ul className={styles.docs}>
            {requiredDocuments.map((doc) => (
              <li key={doc}>
                <Icon name="fileText" size={22} />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
          <p className={styles.note}>{NET_METERING_DISCLAIMER}</p>
        </div>
      </section>

      <BenefitsSection />
      <FaqSection items={netMeteringFaqs} />
      <CtaBanner
        title="Need help with your net-metering application?"
        text="Ask us about solar installation with net-metering assistance for NORECO 1 and NORECO 2."
      />
    </>
  );
}

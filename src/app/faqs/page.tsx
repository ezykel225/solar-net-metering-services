import { PageHero } from "@/components/layout/PageHero";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/data/faqs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQs",
  description: "Answers to frequently asked questions about solar installation, savings, and the net-metering application process.",
  path: "/faqs",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function FaqsPage() {
  return (
    <>
      <PageHero
        crumb="FAQs"
        path="/faqs"
        title="Frequently Asked Questions"
        intro="Everything you need to know about going solar and applying for net metering."
      />
      <FaqSection showHeading={false} />
      <CtaBanner />
      <JsonLd data={faqJsonLd} />
    </>
  );
}

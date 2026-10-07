import { PageHero } from "@/components/layout/PageHero";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFaqs } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQs",
  description: "Answers to frequently asked questions about solar installation, savings, and the net-metering application process.",
  path: "/faqs",
});

function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
  };
}

export default async function FaqsPage() {
  const { data: faqs } = await getFaqs();
  return (
    <>
      <PageHero
        crumb="FAQs"
        path="/faqs"
        title="Frequently Asked Questions"
        intro="Everything you need to know about going solar and applying for net metering."
      />
      <FaqSection showHeading={false} items={faqs} />
      <CtaBanner />
      {faqs.length > 0 ? <JsonLd data={faqJsonLd(faqs)} /> : null}
    </>
  );
}

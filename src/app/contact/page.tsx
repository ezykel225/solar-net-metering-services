import { PageHero } from "@/components/layout/PageHero";
import { QuoteSection } from "@/components/quote/QuoteSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact & Free Quote",
  description:
    "Request a free solar quotation or contact Solar Net Metering Services about solar installation and net-metering assistance.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumb="Contact"
        path="/contact"
        title="Contact Us & Get a Free Quote"
        intro="Ready to go solar? Send us your details and our team will get back to you within 1–2 business days."
      />
      <QuoteSection />
      <FaqSection limit={4} />
    </>
  );
}

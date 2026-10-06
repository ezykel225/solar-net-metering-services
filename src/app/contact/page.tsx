import { PageHero } from "@/components/layout/PageHero";
import { QuoteSection } from "@/components/quote/QuoteSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact & Free Quote",
  description:
    "Request a solar quotation or contact Solar Net Metering Services in Dumaguete City about solar installation, hybrid systems and net-metering assistance.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumb="Contact"
        path="/contact"
        title="Contact Us & Get a Free Quote"
        intro={`Ready to go solar? Send us your details, call ${siteConfig.contact.phone}, or message us on Facebook Messenger.`}
      />
      <QuoteSection />
      <FaqSection limit={4} />
    </>
  );
}

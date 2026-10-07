import { PageHero } from "@/components/layout/PageHero";
import { QuoteSection } from "@/components/quote/QuoteSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/cms";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: settings.quoteCopy.contactMetaTitle,
    description:
      "Request a solar quotation or contact Solar Net Metering Services in Dumaguete City about solar installation, hybrid systems and net-metering assistance.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        crumb="Contact"
        path="/contact"
        title={settings.quoteCopy.contactTitle}
        intro={`Ready to go solar? Send us your details, call ${settings.phone}, or message us on Facebook Messenger.`}
      />
      <QuoteSection />
      <FaqSection limit={4} />
    </>
  );
}

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
      "Request a quotation or contact EG Solar Products Trading in Batinguel, Dumaguete City about solar systems, inverters, batteries, installation and net-metering assistance.",
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

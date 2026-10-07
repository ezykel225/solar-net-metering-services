import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteSettingsProvider } from "@/components/providers/SiteSettingsProvider";
import { serviceAreas } from "@/data/service-areas";
import { getSiteSettings } from "@/lib/cms";
import { localBusinessJsonLd } from "@/lib/seo";

/**
 * Public pages are statically generated and refreshed every 5 minutes (ISR).
 * Admin saves also trigger on-demand revalidation, so changes usually appear
 * immediately. If Supabase is unreachable, pages keep their fallback content.
 */
export const revalidate = 300;

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  return (
    <SiteSettingsProvider value={settings}>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <MobileCtaBar />
      <JsonLd data={localBusinessJsonLd(settings, serviceAreas.map((a) => a.name))} />
    </SiteSettingsProvider>
  );
}

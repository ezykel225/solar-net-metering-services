import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
// Global styles first so component CSS modules can override them.
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceAreas } from "@/data/service-areas";
import { localBusinessJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Solar Installation & Net Metering in Dumaguete City`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "solar installation",
    "net metering",
    "solar panels",
    "residential solar",
    "commercial solar",
    "solar energy",
    "net metering application",
    "hybrid solar system",
    "solar battery storage",
    "solar street lights",
    "solar installation Dumaguete",
    "solar Negros Oriental",
    "NORECO 1 net metering",
    "NORECO 2 net metering",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b1f3a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = localBusinessJsonLd(serviceAreas.map((a) => a.name));
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <MobileCtaBar />
        <JsonLd data={jsonLd} />
      </body>
    </html>
  );
}

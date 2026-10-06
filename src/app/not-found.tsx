import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { QUOTE_CTA, QUOTE_HREF } from "@/data/navigation";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="section" aria-labelledby="nf-title">
      <div className="container" style={{ textAlign: "center", maxWidth: 640 }}>
        <p style={{ fontWeight: 800, fontSize: "4rem", color: "var(--color-orange-text)", margin: 0 }}>404</p>
        <h1 id="nf-title">Page not found</h1>
        <p>Sorry, the page you are looking for doesn’t exist or has been moved.</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.5rem" }}>
          <ButtonLink href="/">Back to Home</ButtonLink>
          <ButtonLink href={QUOTE_HREF} variant="secondary">
            {QUOTE_CTA}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { getSiteSettings } from "@/lib/cms";
import { PRIVACY_POLICY_VERSION } from "@/lib/privacy";
import styles from "../inner-page.module.css";

/**
 * PRIVACY POLICY — DRAFT STRUCTURE.
 * Factual sections describe what this website actually does. Sections marked
 * "To be provided" need final wording from the business owner or their legal
 * adviser. Not indexed by search engines until the final text is in place.
 * When the text changes, update PRIVACY_POLICY_VERSION in src/lib/privacy.ts.
 */
export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Solar Net Metering Services handles the information you share through this website.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

function Pending({ children }: { children: React.ReactNode }) {
  return <p className={styles.pending}>To be provided by the business owner: {children}</p>;
}

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero crumb="Privacy Policy" path="/privacy" title="Privacy Policy" intro="How we handle the information you share through this website." />
      <section className="section" aria-label="Privacy policy">
        <div className={`container ${styles.policy}`}>
          <p className={styles.draftNotice}>
            <strong>Draft:</strong> this policy is being finalised. Sections marked “To be provided” will be completed by{" "}
            {settings.name}. Version: {PRIVACY_POLICY_VERSION}.
          </p>

          <h2>Who we are</h2>
          <p>
            This website is operated by {settings.name}. For privacy questions, contact us at{" "}
            <a href={`mailto:${settings.email}`}>{settings.email}</a> or {settings.phone}.
          </p>
          <Pending>registered business name and address, and the person responsible for data privacy.</Pending>

          <h2>Information we collect</h2>
          <p>When you request a quotation, we collect the details you enter in the form:</p>
          <ul>
            <li>full name, phone number and email address</li>
            <li>address or location</li>
            <li>property type and average monthly electricity bill</li>
            <li>the service you are interested in and your message</li>
            <li>if you used the Solar Calculator: the options you selected and the resulting estimate</li>
            <li>the date and time you agreed to this policy</li>
          </ul>
          <p>The Solar Calculator itself runs in your browser; your inputs are only sent to us if you submit a quote request.</p>

          <h2>How we use your information</h2>
          <p>We use the information you provide to respond to your quotation request and to contact you about it.</p>
          <Pending>any other purposes, and the legal basis relied on for processing.</Pending>

          <h2>Where your information is stored</h2>
          <p>
            Quote requests are stored in a secure database hosted by our website service provider (Supabase) and are only
            accessible to authorised staff of {settings.name}. A notification email containing your request may also be
            sent to our business email address.
          </p>
          <Pending>hosting region details and any other service providers involved.</Pending>

          <h2>How long we keep your information</h2>
          <Pending>the retention period for quote requests and how records are deleted.</Pending>

          <h2>Your rights</h2>
          <Pending>
            how you can request access to, correction of, or deletion of your information, and how to raise a complaint
            with the relevant authority.
          </Pending>

          <h2>Changes to this policy</h2>
          <Pending>how changes to this policy will be communicated.</Pending>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { PRIVACY_POLICY_APPROVED, PRIVACY_POLICY_LAST_UPDATED, PRIVACY_POLICY_VERSION } from "@/lib/privacy";
import styles from "../inner-page.module.css";

/**
 * PRIVACY POLICY. Describes only what this website actually does (see the
 * quote form, /api/quote, src/lib/notifications/email.ts and the Supabase
 * schema). Requires owner approval before launch: set PRIVACY_POLICY_APPROVED
 * in src/lib/privacy.ts once approved, and change PRIVACY_POLICY_VERSION
 * whenever this text changes.
 */
export const metadata: Metadata = {
  ...buildMetadata({
    title: "Privacy Policy",
    description: "How EG Solar Products Trading collects, uses and stores the information you share through this website.",
    path: "/privacy",
  }),
  robots: PRIVACY_POLICY_APPROVED ? undefined : { index: false, follow: true },
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const name = settings.name;
  return (
    <>
      <PageHero crumb="Privacy Policy" path="/privacy" title="Privacy Policy" intro="How we handle the information you share through this website." />
      <section className="section" aria-label="Privacy policy">
        <div className={`container ${styles.policy}`}>
          {PRIVACY_POLICY_APPROVED ? null : (
            <p className={styles.draftNotice}>
              This policy is awaiting final review by {name}. It describes how this website currently handles your
              information.
            </p>
          )}
          <p>
            Last updated: {PRIVACY_POLICY_LAST_UPDATED} (version {PRIVACY_POLICY_VERSION})
          </p>

          <h2>Who we are</h2>
          <p>
            This website is operated by {name}
            {settings.address ? `, ${settings.address}` : ""}. If you have a question about your information, contact us
            at <a href={`mailto:${settings.email}`}>{settings.email}</a> or <a href={settings.phoneHref}>{settings.phone}</a>.
          </p>

          <h2>Information we collect</h2>
          <p>When you send a quotation request through our website, we collect the details you enter:</p>
          <ul>
            <li>your full name, phone number and email address</li>
            <li>your address or location</li>
            <li>your property type and average monthly electricity bill</li>
            <li>the service you are interested in and any message you write</li>
          </ul>
          <p>If you send your request from the Solar Calculator, we also receive:</p>
          <ul>
            <li>
              the options you selected (for example consumer rate type, daytime electricity use, appliances and battery
              preference)
            </li>
            <li>the estimate based on those options, which our website recalculates when your request is received</li>
          </ul>
          <p>With every request we also record:</p>
          <ul>
            <li>that you agreed to this policy, the date and time you agreed, and the version of the policy</li>
            <li>the date and time of the request and the page of our website it was sent from</li>
          </ul>
          <p>
            The Solar Calculator works in your browser. Nothing you enter in it is sent to us unless you choose to send a
            quotation request.
          </p>
          <p>
            If you call, email or message us (for example on Facebook Messenger), we receive the information you choose to
            share in that conversation.
          </p>

          <h2>Technical information</h2>
          <p>
            Like most websites, our hosting provider processes technical information such as your IP address and browser
            type to deliver pages and protect the website. When you send a quotation request, your IP address is used
            briefly to limit repeated submissions; it is not saved with your request.
          </p>
          <p>
            Our public website does not use advertising or analytics cookies. Cookies are only used to keep our own staff
            signed in to the website’s admin area.
          </p>

          <h2>How we use your information</h2>
          <p>We use the information in your quotation request to:</p>
          <ul>
            <li>respond to your request and contact you about it</li>
            <li>prepare a quotation, recommend a system or arrange a site assessment</li>
            <li>keep a record of your request and our follow-up</li>
            <li>protect our website against spam and misuse</li>
          </ul>
          <p>We do not sell your information.</p>

          <h2>Where your information is stored and who handles it</h2>
          <ul>
            <li>
              <strong>Database:</strong> quotation requests are stored in a database provided by Supabase. Access is
              limited to authorised staff of {name} who sign in to the website’s admin area.
            </li>
            <li>
              <strong>Email notifications:</strong> when a request is received, a copy of its details is sent to our
              business email address using an email delivery service (Resend).
            </li>
            <li>
              <strong>Website hosting:</strong> the website is hosted by a website hosting provider that processes
              requests to it.
            </li>
          </ul>
          <p>
            These service providers handle information on our behalf to run the website and may store it on servers
            outside the Philippines.
          </p>

          <h2>Links and embedded content</h2>
          <p>
            Our website links to Facebook, Facebook Messenger and Google Maps, and may show a map from Google Maps. When you
            use those services, or a map is loaded on our Contact page, their own privacy policies apply.
          </p>

          <h2>How long we keep your information</h2>
          <p>
            We keep quotation requests for as long as we need them to respond to you, follow up on a quotation or
            installation, and keep reasonable business records. When we no longer need a request, we delete it. You can ask
            us to delete your request at any time, unless we need to keep it for an ongoing transaction or a legal
            obligation.
          </p>

          <h2>How we protect your information</h2>
          <p>
            Our website uses an encrypted (HTTPS) connection, and quotation requests can only be viewed by signed-in,
            authorised staff. No method of storing or sending information is completely secure, but we take reasonable
            steps to protect it.
          </p>

          <h2>Your choices</h2>
          <p>
            You can contact us at <a href={`mailto:${settings.email}`}>{settings.email}</a> or {settings.phone} to ask what
            information we hold about you, to correct it, or to ask us to delete it. You may also have rights under the
            Philippine Data Privacy Act of 2012, including the right to raise a concern with the National Privacy
            Commission.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If we change this policy, we will update this page and its “last updated” date. The version you agreed to is
            recorded with your quotation request.
          </p>

          <p>
            <Link href="/contact">Back to Contact</Link>
          </p>
        </div>
      </section>
    </>
  );
}

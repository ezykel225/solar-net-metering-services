/**
 * Privacy consent for the quote form.
 *
 * PRIVACY_POLICY_VERSION is stored with every quote request (privacy_policy_version)
 * so it is clear which version of the policy the visitor agreed to. Change it
 * whenever the Privacy Policy text changes (src/app/(site)/privacy/page.tsx).
 *
 * PRIVACY_POLICY_APPROVED: set to true once the business owner has approved
 * the wording. Until then the page shows a "pending final review" notice and
 * is not indexed by search engines.
 */
export const PRIVACY_POLICY_VERSION = "2026-10-11";
export const PRIVACY_POLICY_LAST_UPDATED = "11 October 2026";
export const PRIVACY_POLICY_APPROVED = false;

/** Consent wording shown next to the required checkbox. */
export const consentText = (businessName: string) =>
  `I agree that ${businessName} may use the information I provide to respond to my quotation request.`;

export const CONSENT_REQUIRED_MESSAGE = "Please tick the box to agree before sending your request.";

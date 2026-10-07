/**
 * Privacy consent for the quote form.
 *
 * PRIVACY_POLICY_VERSION is stored with every quote request (privacy_policy_version)
 * so it is clear which version of the policy the visitor agreed to. Update it
 * whenever the Privacy Policy text changes.
 *
 * The policy is still a DRAFT structure until the owner/legal adviser supplies
 * the final wording (see src/app/(site)/privacy/page.tsx).
 */
export const PRIVACY_POLICY_VERSION = "draft-2026-10-07";

/** Consent wording shown next to the required checkbox. */
export const consentText = (businessName: string) =>
  `I agree that ${businessName} may use the information I provide to respond to my quotation request.`;

export const CONSENT_REQUIRED_MESSAGE = "Please tick the box to agree before sending your request.";

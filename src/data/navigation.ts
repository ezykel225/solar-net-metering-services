export type NavItem = {
  label: string;
  href: string;
  /** Shorter label used only where desktop space is tight (1024–1199px). */
  shortLabel?: string;
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Net Metering", href: "/net-metering" },
  { label: "Projects", href: "/projects" },
  { label: "Solar Calculator", shortLabel: "Calculator", href: "/solar-calculator" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
];

/** Anchor on the contact page where the quote form lives. */
export const QUOTE_HREF = "/contact#quote";

/**
 * Fallback for whether quotations are advertised as free. Once Supabase is
 * connected, the owner controls this in Admin → Business Settings.
 */
export const QUOTES_ARE_FREE = true;

export type QuoteCopy = {
  /** Main CTA button: header, hero, footer, mobile bar, banners */
  cta: string;
  /** Secondary CTA in the FAQ help box */
  ask: string;
  /** Quote section eyebrow and heading */
  eyebrow: string;
  heading: string;
  /** Quote form submit button */
  submit: string;
  /** Contact page heading and browser title */
  contactTitle: string;
  contactMetaTitle: string;
};

/**
 * All quote call-to-action wording, derived from one "free" switch.
 * `ctaOverride` (Business Settings → Quote CTA wording) replaces the main button text.
 */
export function buildQuoteCopy(quotesAreFree: boolean, ctaOverride?: string | null): QuoteCopy {
  const free = quotesAreFree ? "Free " : "";
  return {
    cta: ctaOverride?.trim() || `Get a ${free}Quote`,
    ask: `Ask for a ${free}Quote`,
    eyebrow: quotesAreFree ? "Free Quotation" : "Quotation",
    heading: `Get a ${free}Solar Quote`,
    submit: `Get My ${free}Quote`,
    contactTitle: `Contact Us & Get a ${free}Quote`,
    contactMetaTitle: `Contact & ${free}Quote`,
  };
}

/** Fallback wording when Business Settings are not available. */
export const quoteCopy = buildQuoteCopy(QUOTES_ARE_FREE);

/** Main call-to-action label (fallback). */
export const QUOTE_CTA = quoteCopy.cta;

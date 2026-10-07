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
 * TODO (owner): confirm whether quotations are free.
 * This single switch controls every "free" quote wording on the site
 * (buttons, quote section heading, submit button, Contact page title).
 */
export const QUOTES_ARE_FREE = true;

const free = QUOTES_ARE_FREE ? "Free " : "";

/** All quote call-to-action wording, derived from QUOTES_ARE_FREE. */
export const quoteCopy = {
  /** Main CTA button: header, hero, footer, mobile bar, banners */
  cta: `Get a ${free}Quote`,
  /** Secondary CTA in the FAQ help box */
  ask: `Ask for a ${free}Quote`,
  /** Quote section eyebrow and heading */
  eyebrow: QUOTES_ARE_FREE ? "Free Quotation" : "Quotation",
  heading: `Get a ${free}Solar Quote`,
  /** Quote form submit button */
  submit: `Get My ${free}Quote`,
  /** Contact page heading and browser title */
  contactTitle: `Contact Us & Get a ${free}Quote`,
  contactMetaTitle: `Contact & ${free}Quote`,
};

/** Main call-to-action label (kept as a named export for existing imports). */
export const QUOTE_CTA = quoteCopy.cta;

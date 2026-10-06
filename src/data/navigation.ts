export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Net Metering", href: "/net-metering" },
  { label: "Projects", href: "/projects" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
];

/** Anchor on the contact page where the quote form lives. */
export const QUOTE_HREF = "/contact#quote";

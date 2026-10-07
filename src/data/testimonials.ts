export type Testimonial = {
  quote: string;
  /** BCP 47 language tag of the quote, e.g. "ceb" for Cebuano. */
  lang?: string;
  /** Optional English translation shown beneath a non-English quote. */
  translation?: string;
  name: string;
  /** Only add a role/location if confirmed by the client. */
  detail?: string;
  /** Optional customer photo URL (with the customer's permission). */
  image?: string | null;
};

/**
 * Confirmed customer testimonials only. Do not add invented names or quotes.
 * Original wording is preserved exactly.
 */
export const testimonials: Testimonial[] = [
  {
    quote: "Salamat kaayo sa Solar and Netmetering Services. Dako jud og tabang sa among bill sa kuryente!",
    lang: "ceb",
    // English translation prepared by the website team — owner to confirm wording.
    translation: "Thank you very much to Solar and Netmetering Services. It's a really big help on our electricity bill!",
    name: "Ma’am Jing T.",
  },
];

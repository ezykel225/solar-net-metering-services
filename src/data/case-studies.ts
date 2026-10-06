/**
 * Customer results publicly shared by the company.
 * Must always be shown with SAVINGS_DISCLAIMER and never presented as a
 * guaranteed or typical result. Do not turn this into a business-wide
 * percentage claim (e.g. "98% savings").
 */
export type CaseStudy = {
  title: string;
  system: string;
  billBefore: number;
  billAfter: number;
  period: string;
};

export const featuredCaseStudy: CaseStudy = {
  title: "Customer result: 6kW hybrid solar system",
  system: "6kW hybrid solar system",
  billBefore: 5553,
  billAfter: 90,
  period: "after one month",
};

export const SAVINGS_DISCLAIMER =
  "Actual savings vary based on system size, electricity use, weather, utility charges, and other factors.";

export const formatPeso = (amount: number) => `₱${amount.toLocaleString("en-PH")}`;

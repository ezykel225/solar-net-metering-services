export type Testimonial = { quote: string; name: string; role: string; location: string };

/** Placeholder testimonials — replace with real, approved customer reviews. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Our electricity bill dropped noticeably in the first month. The team explained everything clearly, finished on schedule, and handled the net-metering paperwork for us.",
    name: "Maria S.",
    role: "Homeowner",
    location: "Residential client",
  },
  {
    quote:
      "We were worried about disruption to our store, but installation was scheduled around our hours and the crew kept the site clean. The savings have been consistent.",
    name: "Daniel R.",
    role: "Store Owner",
    location: "Commercial client",
  },
  {
    quote:
      "Very professional from the site visit to commissioning. They answered every question patiently and still check in to make sure the system is performing well.",
    name: "Angela T.",
    role: "Homeowner",
    location: "Residential client",
  },
];

import { NET_METERING_DISCLAIMER } from "./net-metering";
import { SAVINGS_DISCLAIMER } from "./case-studies";
import { brands } from "./services";

export type Faq = { question: string; answer: string };

const list = (items: string[]) => `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/** Answers use confirmed information only; timelines and fees are not stated until confirmed. */
export const faqs: Faq[] = [
  {
    question: "What is net metering?",
    answer:
      "Net metering is an arrangement with your electric cooperative. When your solar panels produce more electricity than your property uses, the excess is exported to the grid and credited to your account, which can help reduce your electricity bill.",
  },
  {
    question: "How much can solar save me?",
    answer: `It depends on your electricity use, system size and other factors. One customer with a 6kW hybrid system shared that their monthly bill went from about ₱5,553 to about ₱90 after one month, but this is not a guaranteed result. ${SAVINGS_DISCLAIMER} Request a quotation for an estimate based on your own bill.`,
  },
  {
    question: "How long does installation take?",
    answer:
      "It depends on the size of the system, your site and the permits involved. Contact us with your details and we can discuss an estimated schedule for your project. The net-metering application is a separate process with your electric cooperative.",
  },
  {
    question: "Can solar work during cloudy weather?",
    answer:
      "Yes. Solar panels still generate electricity on cloudy days, although output is lower. Grid-connected systems draw from the grid when solar production is low, and hybrid systems can also use stored battery power.",
  },
  {
    question: "What documents are required for net metering?",
    answer: `We currently help customers with requirements including a Building Permit, Electrical Permit, Final Inspection Permit and a valid government-issued ID of the owner. ${NET_METERING_DISCLAIMER}`,
  },
  {
    question: "Do you handle the net-metering application?",
    answer:
      "Yes. We process net-metering applications for NORECO 1 and NORECO 2 customers and help you prepare the requirements.",
  },
  {
    question: "Do I need batteries?",
    answer:
      "Not necessarily. A solar system can be connected to the grid without batteries. If you want stored power for use at night or during outages, we offer hybrid solar systems with battery storage.",
  },
  {
    question: "Do you sell solar street lights?",
    answer:
      "Yes. We offer all-in-one solar street lights with an integrated solar panel, LED light, battery and controller. They run dusk to dawn, come with a remote control and are designed to be weather-resistant. Bulk orders and nationwide shipping are available.",
  },
  {
    question: "What brands do you use?",
    answer: `We install and promote products from brands including ${list(brands)}.`,
  },
  {
    question: "Which areas do you serve?",
    answer:
      "We serve Dumaguete City and nearby areas in Negros Oriental, with selected projects in surrounding locations such as Sibulan, Siaton and Siquijor. Contact us to check if we can serve your location.",
  },
  {
    question: "How do I get a quotation?",
    answer:
      "Fill out the quote form with your details and average monthly bill, call or text us, or send us a message on Facebook Messenger. Our team will get back to you to discuss your property and needs.",
  },
];

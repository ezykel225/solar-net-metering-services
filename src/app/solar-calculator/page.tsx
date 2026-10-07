import { PageHero } from "@/components/layout/PageHero";
import { SolarCalculator } from "@/components/calculator/SolarCalculator";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { CALCULATOR_DISCLAIMER, calculatorAssumptions as a } from "@/lib/solar-calculator";
import { buildMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "Solar Calculator",
  description:
    "Estimate the solar system size, number of panels, monthly solar generation and possible bill reduction range for your home or business in Negros Oriental.",
  path: "/solar-calculator",
});

/** Plain-language list of the assumptions behind the estimate (read from the config). */
const assumptions = [
  `Electricity rate: about ₱${a.electricityRatePerKwh} per kWh, used to estimate your monthly usage from your bill.`,
  `Sunlight: an average of ${a.peakSunHours} peak sun hours per day.`,
  `System losses: about ${Math.round((1 - a.systemEfficiency) * 100)}% for heat, wiring, inverter and dust (${Math.round(a.systemEfficiency * 100)}% efficiency).`,
  `Panels: about ${a.panelWattage}W each.`,
  `Energy exported to the grid through net metering is valued lower than energy you use directly (about ${Math.round(a.exportCreditRatio * 100)}% of the retail rate).`,
  `The estimated bill reduction is capped at ${Math.round(a.maxBillReductionShare * 100)}% of your bill, because some charges remain even with solar.`,
  "System size is based on how much of your electricity you use during the day.",
];

export default function SolarCalculatorPage() {
  return (
    <>
      <PageHero
        crumb="Solar Calculator"
        path="/solar-calculator"
        title="Solar Savings Calculator"
        intro="Get a quick estimate of the solar system size, panels and possible bill reduction for your property. It only takes a minute."
      />

      <section className={`section section--soft ${styles.calcSection}`} aria-label="Calculator">
        <div className="container">
          <SolarCalculator />
        </div>
      </section>

      <section className="section" aria-labelledby="assumptions-title">
        <div className={`container ${styles.assumptions}`}>
          <SectionHeading
            id="assumptions-title"
            align="left"
            eyebrow="How It Works"
            title="How This Estimate Works"
            intro="The calculator uses general assumptions for Negros Oriental. A site assessment replaces them with real measurements of your property."
          />
          <ul className={styles.list}>
            {assumptions.map((item) => (
              <li key={item}>
                <Icon name="checkCircle" size={20} /> {item}
              </li>
            ))}
          </ul>
          <p className={styles.disclaimer}>{CALCULATOR_DISCLAIMER}</p>
        </div>
      </section>

      <CtaBanner spaced={false} title="Want an exact recommendation?" text="Request a site assessment and quotation, or message us with your questions." />
    </>
  );
}

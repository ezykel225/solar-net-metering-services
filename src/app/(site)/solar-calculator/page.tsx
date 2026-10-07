import { PageHero } from "@/components/layout/PageHero";
import { SolarCalculator } from "@/components/calculator/SolarCalculator";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import {
  formatIsoDate,
  formatRate,
  getAppliedRate,
  notSureMethodLabels,
  POWER_RATES,
  type CalculatorConfig,
} from "@/lib/solar-calculator";
import { getCalculatorConfig } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "Solar Calculator",
  description:
    "Estimate the solar system size, number of panels, monthly solar generation and possible bill reduction range for your home or business in Negros Oriental.",
  path: "/solar-calculator",
});

/** Rates table rows, read from the calculator settings so the page always matches the calculator. */
function rateRows(config: CalculatorConfig) {
  const approx = getAppliedRate("Commercial", "notSure", config);
  return [
    { type: POWER_RATES.residential.label, rate: config.rates.residential, usedFor: "Residential properties" },
    { type: POWER_RATES.lowVoltage.label, rate: config.rates.lowVoltage, usedFor: "Commercial — when you select Low Voltage" },
    { type: POWER_RATES.highVoltage.label, rate: config.rates.highVoltage, usedFor: "Commercial — when you select High Voltage" },
    {
      type: "Approximate (Not Sure)",
      rate: approx.ratePerKwh,
      usedFor: `Commercial — when you select Not Sure (${notSureMethodLabels[config.notSureMethod].toLowerCase()}). Confirm your exact rate from your bill.`,
    },
  ];
}

/** Plain-language list of the assumptions behind the estimate (read from the settings). */
function assumptionList(config: CalculatorConfig) {
  return [
    "Your monthly usage (kWh) is estimated by dividing your bill by the electricity rate for your consumer type (see the table below).",
    `Sunlight: an average of ${config.peakSunHours} peak sun hours per day.`,
    `System losses: about ${Math.round((1 - config.systemEfficiency) * 100)}% for heat, wiring, inverter and dust (${Math.round(config.systemEfficiency * 100)}% efficiency).`,
    `Panels: about ${config.panelWattage}W each.`,
    `The estimated bill reduction is capped at ${Math.round(config.maxBillReductionShare * 100)}% of your bill, because some charges remain even with solar.`,
    "System size is based on how much of your electricity you use during the day.",
  ];
}

export default async function SolarCalculatorPage() {
  // Loaded once per page render (cached with ISR) — not per calculator interaction.
  const config = await getCalculatorConfig();
  const updated = formatIsoDate(config.ratesUpdatedOn);
  const captionParts = [
    config.rateSource,
    config.rateBillingPeriod ? `billing period: ${config.rateBillingPeriod}` : null,
    updated ? `last updated on this website on ${updated}` : null,
  ].filter(Boolean);
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
          <SolarCalculator config={config} />
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
            {assumptionList(config).map((item) => (
              <li key={item}>
                <Icon name="checkCircle" size={20} /> {item}
              </li>
            ))}
          </ul>

          <h3 className={styles.subheading}>Electricity rates used</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption>
                {captionParts.join(", ")}.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Consumer type</th>
                  <th scope="col">Rate per kWh</th>
                  <th scope="col">Used for</th>
                </tr>
              </thead>
              <tbody>
                {rateRows(config).map((row) => (
                  <tr key={row.type}>
                    <th scope="row">{row.type}</th>
                    <td data-label="Rate per kWh">₱{formatRate(row.rate)}</td>
                    <td data-label="Used for">{row.usedFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {config.exportCreditVerified ? (
            <p className={styles.verified}>
              <strong>Net-metering export credit:</strong> exported energy is valued at about{" "}
              {Math.round(config.exportCreditRatio * 100)}% of the retail rate, based on: {config.exportCreditSource}
            </p>
          ) : (
            <p className={styles.unverified}>
              <strong>Assumption not yet verified:</strong> energy exported to the grid through net metering is valued at
              about {Math.round(config.exportCreditRatio * 100)}% of the retail rate in this estimate. The actual credit
              depends on your electric cooperative’s net-metering rules and has not yet been confirmed with an official
              reference.
            </p>
          )}

          <p className={styles.disclaimer}>{config.disclaimer}</p>
        </div>
      </section>

      <CtaBanner spaced={false} title="Want an exact recommendation?" text="Request a site assessment and quotation, or message us with your questions." />
    </>
  );
}

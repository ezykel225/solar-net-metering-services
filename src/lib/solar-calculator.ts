/**
 * Solar Savings Calculator — all assumptions and calculation logic.
 *
 * Two kinds of numbers:
 *  - CalculatorConfig: values the business owner edits in Admin → Calculator
 *    Settings (stored in Supabase, table calculator_settings). The constants
 *    below (POWER_RATES, DEFAULT_CALCULATOR_CONFIG…) are the fallback used
 *    when Supabase is not configured or temporarily unavailable.
 *  - calculatorAssumptions: fixed engineering constants (rounding, variability…).
 *
 * UI components must not hard-code constants. Results are rough planning
 * estimates only, always shown as ranges with the disclaimer. Never present
 * them as guaranteed savings.
 */
import { parseBillAmount, type QuoteRequest } from "@/lib/quote";

/* ------------------------------ power rates ------------------------------ */

/**
 * Retail electricity rates (₱ per kWh) by consumer type, from the published
 * NORECO power-rate reference supplied by the business owner.
 * Update these values (and POWER_RATE_UPDATED) whenever NORECO publishes new rates.
 * These are retail rates only; they say nothing about how exported solar is credited.
 */
export const POWER_RATES = {
  residential: { label: "Residential", ratePerKwh: 14.3522 },
  lowVoltage: { label: "Low Voltage", ratePerKwh: 13.5024 },
  highVoltage: { label: "High Voltage", ratePerKwh: 10.9692 },
} as const;
export type PowerRateKey = keyof typeof POWER_RATES;

/** When the rates above were last entered on the website (ISO date). Update together with POWER_RATES. */
export const POWER_RATE_UPDATED = "2026-10-07";

/** Rate source shown to visitors. */
export const POWER_RATE_SOURCE = "NORECO published power rates";


/** Consumer-rate choices offered for commercial properties. */
export const commercialRateOptions = {
  lowVoltage: { label: "Low Voltage", hint: "Shown on your bill as Low Voltage / secondary" },
  highVoltage: { label: "High Voltage", hint: "Shown on your bill as High Voltage / primary" },
  notSure: { label: "Not Sure", hint: "We’ll use an approximate rate" },
} as const;
export type CommercialRateChoice = keyof typeof commercialRateOptions;

export type AppliedRate = {
  label: string;
  ratePerKwh: number;
  /** True when the consumer type is unknown and an approximate rate is used. */
  approximate: boolean;
};

export type NotSureMethod = "average" | "low_voltage" | "high_voltage" | "custom";

/** Values the owner can change in Admin → Calculator Settings. */
export type CalculatorConfig = {
  rates: { residential: number; lowVoltage: number; highVoltage: number };
  rateSource: string;
  rateBillingPeriod: string | null;
  /** ISO date (YYYY-MM-DD) */
  ratesUpdatedOn: string | null;
  /** How a commercial "Not Sure" rate is approximated. */
  notSureMethod: NotSureMethod;
  notSureCustomRate: number | null;
  peakSunHours: number;
  systemEfficiency: number;
  panelWattage: number;
  /** Share of monthly usage the system is sized to cover, by daytime usage. */
  coverage: { low: number; medium: number; high: number };
  minimumBill: number;
  maximumBill: number;
  maxBillReductionShare: number;
  /** Value of exported energy relative to the retail rate. */
  exportCreditRatio: number;
  /** False until confirmed by an official net-metering credit reference. */
  exportCreditVerified: boolean;
  exportCreditSource: string | null;
  disclaimer: string;
};

export const CALCULATOR_DISCLAIMER =
  "This calculator provides an initial estimate only. Actual system size, solar generation and savings depend on electricity usage, roof orientation, shading, equipment efficiency, weather, utility rates, site conditions and net-metering approval.";

/** Fallback configuration (used when Supabase settings cannot be loaded). */
export const DEFAULT_CALCULATOR_CONFIG: CalculatorConfig = {
  rates: {
    residential: POWER_RATES.residential.ratePerKwh,
    lowVoltage: POWER_RATES.lowVoltage.ratePerKwh,
    highVoltage: POWER_RATES.highVoltage.ratePerKwh,
  },
  rateSource: POWER_RATE_SOURCE,
  rateBillingPeriod: null,
  ratesUpdatedOn: POWER_RATE_UPDATED,
  notSureMethod: "average",
  notSureCustomRate: null,
  peakSunHours: 4.5,
  systemEfficiency: 0.8,
  panelWattage: 580,
  coverage: { low: 0.6, medium: 0.75, high: 0.9 },
  minimumBill: 1_000,
  maximumBill: 500_000,
  maxBillReductionShare: 0.85,
  // UNVERIFIED — placeholder until an official NORECO net-metering credit reference exists.
  exportCreditRatio: 0.5,
  exportCreditVerified: false,
  exportCreditSource: null,
  disclaimer: CALCULATOR_DISCLAIMER,
};

export const notSureMethodLabels: Record<NotSureMethod, string> = {
  average: "Average of the Low Voltage and High Voltage rates",
  low_voltage: "Use the Low Voltage rate",
  high_voltage: "Use the High Voltage rate",
  custom: "Use a custom approximate rate",
};

/**
 * The rate used for a calculation.
 * - Residential → Residential rate.
 * - Commercial + Low/High Voltage → that rate (only when the visitor selects it).
 * - Commercial + Not Sure → an approximate rate chosen by the owner's "Not Sure"
 *   setting (default: average of Low and High Voltage), always labelled as approximate.
 */
export function getAppliedRate(
  propertyType: CalcPropertyType,
  commercialRate: CommercialRateChoice,
  config: CalculatorConfig = DEFAULT_CALCULATOR_CONFIG,
): AppliedRate {
  const { rates } = config;
  if (propertyType === "Residential") {
    return { label: `${POWER_RATES.residential.label} rate`, ratePerKwh: rates.residential, approximate: false };
  }
  if (commercialRate === "lowVoltage" || commercialRate === "highVoltage") {
    return { label: `${POWER_RATES[commercialRate].label} rate`, ratePerKwh: rates[commercialRate], approximate: false };
  }
  let rate: number;
  let how: string;
  switch (config.notSureMethod) {
    case "low_voltage":
      rate = rates.lowVoltage;
      how = "Low Voltage rate used as an approximation";
      break;
    case "high_voltage":
      rate = rates.highVoltage;
      how = "High Voltage rate used as an approximation";
      break;
    case "custom":
      rate = config.notSureCustomRate ?? (rates.lowVoltage + rates.highVoltage) / 2;
      how = "approximate rate set by the business";
      break;
    default:
      rate = (rates.lowVoltage + rates.highVoltage) / 2;
      how = "average of the Low and High Voltage rates";
  }
  return {
    label: `Approximate commercial rate (${how})`,
    ratePerKwh: Math.round(rate * 10_000) / 10_000,
    approximate: true,
  };
}

/** Database row shape of public.calculator_settings (numeric columns may arrive as strings). */
export type CalculatorSettingsRow = {
  residential_rate: number | string;
  low_voltage_rate: number | string;
  high_voltage_rate: number | string;
  rate_source: string | null;
  rate_billing_period: string | null;
  rates_updated_on: string | null;
  not_sure_method: string | null;
  not_sure_custom_rate: number | string | null;
  peak_sun_hours: number | string;
  system_efficiency: number | string;
  panel_wattage: number | string;
  coverage_low: number | string;
  coverage_medium: number | string;
  coverage_high: number | string;
  min_monthly_bill: number | string;
  max_monthly_bill: number | string;
  max_bill_reduction_share: number | string;
  export_credit_ratio: number | string;
  export_credit_verified: boolean | null;
  export_credit_source: string | null;
  disclaimer: string | null;
};

/** Number within [min, max], or the fallback. */
const inRange = (v: unknown, min: number, max: number, fallback: number) => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) && n >= min && n <= max ? n : fallback;
};

/**
 * Converts a calculator_settings row into a CalculatorConfig. Every value is
 * sanity-checked and falls back to the default individually, so a bad value
 * can never break the public calculator.
 */
export function calculatorConfigFromRow(row: CalculatorSettingsRow | null | undefined): CalculatorConfig {
  const d = DEFAULT_CALCULATOR_CONFIG;
  if (!row) return d;
  const method = (["average", "low_voltage", "high_voltage", "custom"] as const).find((m) => m === row.not_sure_method) ?? d.notSureMethod;
  const customRate = row.not_sure_custom_rate == null ? null : inRange(row.not_sure_custom_rate, 0.01, 100, NaN);
  let minimumBill = inRange(row.min_monthly_bill, 1, 100_000_000, d.minimumBill);
  let maximumBill = inRange(row.max_monthly_bill, 1, 100_000_000, d.maximumBill);
  if (maximumBill <= minimumBill) {
    minimumBill = d.minimumBill;
    maximumBill = d.maximumBill;
  }
  const verified = row.export_credit_verified === true && !!row.export_credit_source?.trim();
  return {
    rates: {
      residential: inRange(row.residential_rate, 0.01, 100, d.rates.residential),
      lowVoltage: inRange(row.low_voltage_rate, 0.01, 100, d.rates.lowVoltage),
      highVoltage: inRange(row.high_voltage_rate, 0.01, 100, d.rates.highVoltage),
    },
    rateSource: row.rate_source?.trim() || d.rateSource,
    rateBillingPeriod: row.rate_billing_period?.trim() || null,
    ratesUpdatedOn: /^\d{4}-\d{2}-\d{2}$/.test(row.rates_updated_on ?? "") ? row.rates_updated_on : null,
    notSureMethod: method === "custom" && !Number.isFinite(customRate) ? "average" : method,
    notSureCustomRate: Number.isFinite(customRate) ? customRate : null,
    peakSunHours: inRange(row.peak_sun_hours, 1, 10, d.peakSunHours),
    systemEfficiency: inRange(row.system_efficiency, 0.5, 1, d.systemEfficiency),
    panelWattage: inRange(row.panel_wattage, 100, 1000, d.panelWattage),
    coverage: {
      low: inRange(row.coverage_low, 0.1, 1.2, d.coverage.low),
      medium: inRange(row.coverage_medium, 0.1, 1.2, d.coverage.medium),
      high: inRange(row.coverage_high, 0.1, 1.2, d.coverage.high),
    },
    minimumBill,
    maximumBill,
    maxBillReductionShare: inRange(row.max_bill_reduction_share, 0.1, 1, d.maxBillReductionShare),
    exportCreditRatio: inRange(row.export_credit_ratio, 0, 1.5, d.exportCreditRatio),
    exportCreditVerified: verified,
    exportCreditSource: row.export_credit_source?.trim() || null,
    disclaimer: row.disclaimer && row.disclaimer.trim().length >= 20 ? row.disclaimer.trim() : d.disclaimer,
  };
}

/** "7 October 2026" style label for an ISO date, or null. */
export function formatIsoDate(iso: string | null) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-PH", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** Fixed engineering constants (not owner-editable). */
export const calculatorAssumptions = {
  /** Days used for monthly figures. */
  daysPerMonth: 30,
  /** Low end of generation range accounts for weather and seasonal variation. */
  generationVariability: 0.15,
  /** System sizes are rounded to these steps (kW), depending on system size. */
  sizeSteps: [
    { upToKw: 20, stepKw: 0.5 },
    { upToKw: 100, stepKw: 1 },
    { upToKw: Infinity, stepKw: 5 },
  ],
  /** Above this size, results add a note that a detailed engineering assessment is needed (kW). */
  largeSystemKw: 30,
  /** Smallest system the calculator will suggest (kW). */
  minSystemKw: 1,
  /** ± spread applied to the ideal size before rounding to a range. */
  sizeSpread: 0.1,
  /** Peso amounts in results are rounded to this step. */
  pesoRoundingStep: 50,
  /** Common battery capacities (kWh) used to suggest a battery option. */
  standardBatteriesKwh: [2.4, 5, 10, 15, 20, 30],
} as const;

/* ----------------------------- input options ----------------------------- */

export const propertyTypeOptions = ["Residential", "Commercial"] as const;
export type CalcPropertyType = (typeof propertyTypeOptions)[number];

export const daytimeUsageOptions = {
  low: {
    label: "Low",
    hint: "Most electricity is used in the evening or at night",
    /** Share of daily use that happens while the sun is up. */
    daytimeShare: 0.3,
  },
  medium: {
    label: "Medium",
    hint: "Usage is spread through the day and evening",
    daytimeShare: 0.5,
  },
  high: {
    label: "High",
    hint: "Most electricity is used during the day",
    daytimeShare: 0.7,
  },
} as const;
export type DaytimeUsage = keyof typeof daytimeUsageOptions;

export const batteryOptions = {
  none: {
    label: "No battery / solar only",
    hint: "Lowest cost; uses the grid at night",
    /** Extra share of solar energy used on-site thanks to storage. */
    selfConsumptionBoost: 0,
    /** Share of night-time daily usage the battery should cover [low, high]. */
    nightCoverage: [0, 0] as const,
  },
  basic: {
    label: "Basic backup",
    hint: "Keeps essential loads running for a few hours",
    selfConsumptionBoost: 0.15,
    nightCoverage: [0.3, 0.5] as const,
  },
  extended: {
    label: "Extended backup",
    hint: "Covers more of your evening and night usage",
    selfConsumptionBoost: 0.3,
    nightCoverage: [0.7, 1] as const,
  },
} as const;
export type BatteryPreference = keyof typeof batteryOptions;

export const applianceOptions = {
  aircon: { label: "Air conditioner", heavy: true },
  refrigerator: { label: "Refrigerator", heavy: false },
  waterPump: { label: "Water pump", heavy: true },
  washingMachine: { label: "Washing machine", heavy: false },
  electricStove: { label: "Electric stove", heavy: true },
  waterHeater: { label: "Water heater", heavy: true },
  office: { label: "Computer / office equipment", heavy: false },
  otherHeavy: { label: "Other heavy loads", heavy: true },
} as const;
export type Appliance = keyof typeof applianceOptions;

export type CalculatorInput = {
  monthlyBill: string;
  propertyType: CalcPropertyType;
  /** Only used when propertyType is "Commercial". */
  commercialRate: CommercialRateChoice;
  daytimeUsage: DaytimeUsage;
  appliances: Appliance[];
  battery: BatteryPreference;
};

export const defaultCalculatorInput: CalculatorInput = {
  monthlyBill: "",
  propertyType: "Residential",
  commercialRate: "notSure",
  daytimeUsage: "medium",
  appliances: [],
  battery: "none",
};

/* --------------------------------- types --------------------------------- */

export type Range = { low: number; high: number };

export type CalculatorResult = {
  monthlyBill: number;
  /** The electricity rate used to convert the bill into kWh. */
  rate: AppliedRate;
  monthlyUsageKwh: number;
  systemSizeKw: Range;
  panelCount: Range;
  monthlyGenerationKwh: Range;
  billReduction: Range;
  systemType: string;
  batterySuggestion: string;
  batteryKwh: Range | null;
  notes: string[];
};

export type CalculatorOutcome =
  | { ok: true; result: CalculatorResult }
  | { ok: false; error: string };

/* ------------------------------- validation ------------------------------ */

/** Validates the bill field. Returns an error message, or null when valid. */
export function validateBill(raw: string, config: CalculatorConfig = DEFAULT_CALCULATOR_CONFIG): string | null {
  if (!raw.trim()) return "Please enter your average monthly electricity bill.";
  if (raw.includes("-") || raw.includes("−")) return "The bill amount must be greater than zero.";
  const amount = parseBillAmount(raw);
  if (amount === null) return "Please enter the amount as a number, e.g. 5,000.";
  if (amount <= 0) return "The bill amount must be greater than zero.";
  if (amount < config.minimumBill)
    return `Please enter a bill of at least ${formatPeso(config.minimumBill)} for an estimate. For smaller bills, contact us to discuss options.`;
  if (amount > config.maximumBill)
    return `For bills above ${formatPeso(config.maximumBill)}, please request a site assessment for an accurate estimate.`;
  return null;
}

/* ------------------------------ calculation ------------------------------ */

const floorTo = (value: number, step: number) => Math.floor(value / step + 1e-9) * step;
const ceilTo = (value: number, step: number) => Math.ceil(value / step - 1e-9) * step;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const isFiniteRange = (r: Range | null) => r === null || (Number.isFinite(r.low) && Number.isFinite(r.high));

/** Rounding step for a given system size (finer for small systems). */
function sizeStepFor(kw: number) {
  return calculatorAssumptions.sizeSteps.find((s) => kw <= s.upToKw)?.stepKw ?? 5;
}

/** Smallest standard battery size that meets the requirement (or the largest available). */
function standardBattery(requiredKwh: number) {
  const sizes = calculatorAssumptions.standardBatteriesKwh;
  return sizes.find((s) => s >= requiredKwh) ?? sizes[sizes.length - 1];
}

/** Monthly bill reduction (₱) for a given monthly generation. */
function billReductionFor(
  generationKwh: number,
  monthlyUsageKwh: number,
  selfShare: number,
  bill: number,
  ratePerKwh: number,
  config: CalculatorConfig,
) {
  const selfUsedKwh = Math.min(generationKwh * selfShare, monthlyUsageKwh);
  const exportedKwh = Math.max(generationKwh - selfUsedKwh, 0);
  const value = selfUsedKwh * ratePerKwh + exportedKwh * ratePerKwh * config.exportCreditRatio;
  return Math.min(value, bill * config.maxBillReductionShare);
}

export function calculateSolarEstimate(
  input: CalculatorInput,
  config: CalculatorConfig = DEFAULT_CALCULATOR_CONFIG,
): CalculatorOutcome {
  const error = validateBill(input.monthlyBill, config);
  if (error) return { ok: false, error };

  const a = calculatorAssumptions;
  const bill = parseBillAmount(input.monthlyBill) as number;
  const usage = daytimeUsageOptions[input.daytimeUsage] ?? daytimeUsageOptions.medium;
  const battery = batteryOptions[input.battery] ?? batteryOptions.none;

  // 1. Bill → monthly usage, using the rate for this consumer type
  const rate = getAppliedRate(input.propertyType, input.commercialRate, config);
  const monthlyUsageKwh = bill / rate.ratePerKwh;

  // 2. Size the system to cover a share of usage
  const kwhPerKwPerMonth = config.peakSunHours * a.daysPerMonth * config.systemEfficiency;
  const coverage = config.coverage[input.daytimeUsage] ?? config.coverage.medium;
  const idealKw = (monthlyUsageKwh * coverage) / kwhPerKwPerMonth;
  const step = sizeStepFor(idealKw);
  let lowKw = Math.max(floorTo(idealKw * (1 - a.sizeSpread), step), a.minSystemKw);
  let highKw = Math.max(ceilTo(idealKw * (1 + a.sizeSpread), step), a.minSystemKw);
  if (highKw <= lowKw) highKw = lowKw + step;
  lowKw = Number(lowKw.toFixed(1));
  highKw = Number(highKw.toFixed(1));

  // 3. Panels and generation
  const panelCount = {
    low: Math.ceil((lowKw * 1000) / config.panelWattage),
    high: Math.ceil((highKw * 1000) / config.panelWattage),
  };
  const monthlyGenerationKwh = {
    low: lowKw * kwhPerKwPerMonth * (1 - a.generationVariability),
    high: highKw * kwhPerKwPerMonth,
  };

  // 4. Bill reduction range
  const selfShare = clamp(usage.daytimeShare + battery.selfConsumptionBoost, 0, 0.95);
  const reductionLow = billReductionFor(monthlyGenerationKwh.low, monthlyUsageKwh, selfShare, bill, rate.ratePerKwh, config);
  const reductionHigh = billReductionFor(monthlyGenerationKwh.high, monthlyUsageKwh, selfShare, bill, rate.ratePerKwh, config);
  const billReduction = {
    low: floorTo(reductionLow, a.pesoRoundingStep),
    high: Math.max(ceilTo(reductionHigh, a.pesoRoundingStep), floorTo(reductionLow, a.pesoRoundingStep)),
  };

  // 5. System type and battery
  const hasBattery = input.battery !== "none";
  const systemType = hasBattery
    ? "Hybrid solar system (solar panels + hybrid inverter + battery)"
    : "Grid-tied solar system, with a net-metering application where eligible";

  let batteryKwh: Range | null = null;
  let batterySuggestion = "No battery — the grid supplies power at night.";
  if (hasBattery) {
    const nightKwhPerDay = (monthlyUsageKwh / a.daysPerMonth) * (1 - usage.daytimeShare);
    batteryKwh = {
      low: standardBattery(nightKwhPerDay * battery.nightCoverage[0]),
      high: standardBattery(nightKwhPerDay * battery.nightCoverage[1]),
    };
    batterySuggestion =
      input.battery === "basic"
        ? "Basic backup battery for essential loads such as lights, fans, Wi-Fi and a refrigerator."
        : "Larger battery storage to cover more of your evening and night-time usage.";
  }

  // 6. Notes
  const notes: string[] = [];
  const heavy = input.appliances.filter((k) => applianceOptions[k]?.heavy).map((k) => applianceOptions[k].label.toLowerCase());
  if (heavy.length > 0) {
    notes.push(
      `Heavy loads (${heavy.join(", ")}) can raise usage and may need a larger inverter${hasBattery ? " or battery" : ""}. We check these during the site assessment.`,
    );
  }
  if (hasBattery && heavy.length > 0) {
    notes.push("Backing up heavy loads such as air conditioners needs much more battery capacity than essential loads.");
  }
  if (!hasBattery && input.daytimeUsage === "low") {
    notes.push("Most of your usage is outside daylight hours, so net metering or a battery helps you benefit more from your solar power.");
  }
  if (highKw > a.largeSystemKw) {
    notes.push("Larger systems need a detailed engineering and site assessment before final sizing.");
  }
  if (rate.approximate) {
    notes.push(
      "This estimate uses an approximate commercial rate because the consumer type is not known. Please confirm your exact rate (Low Voltage or High Voltage) from your electricity bill.",
    );
  }
  if (input.propertyType === "Commercial") {
    notes.push("Commercial systems are finalised after a load and site assessment.");
  }
  if (!hasBattery) {
    notes.push("Net-metering credits depend on approval by your electric cooperative.");
  }
  if (!config.exportCreditVerified) {
    notes.push(
      "The bill reduction range includes an unverified assumption about how exported solar energy is credited under net metering.",
    );
  }

  const result: CalculatorResult = {
    monthlyBill: bill,
    rate,
    monthlyUsageKwh,
    systemSizeKw: { low: lowKw, high: highKw },
    panelCount,
    monthlyGenerationKwh,
    billReduction,
    systemType,
    batterySuggestion,
    batteryKwh,
    notes,
  };

  // Final guard: never return NaN/Infinity to the UI.
  const numbers = [result.monthlyBill, result.monthlyUsageKwh, result.rate.ratePerKwh];
  const ranges = [result.systemSizeKw, result.panelCount, result.monthlyGenerationKwh, result.billReduction, result.batteryKwh];
  if (!numbers.every(Number.isFinite) || !ranges.every(isFiniteRange)) {
    return { ok: false, error: "We couldn't calculate an estimate from that amount. Please check the value and try again." };
  }
  return { ok: true, result };
}

/* ------------------------------ formatting ------------------------------- */

const SAFE = "—";
const num = (n: number, digits = 0) =>
  Number.isFinite(n) ? n.toLocaleString("en-PH", { maximumFractionDigits: digits, minimumFractionDigits: 0 }) : SAFE;

/** Rate with up to 4 decimals, e.g. 14.3522 → "14.3522". */
export const formatRate = (n: number) => (Number.isFinite(n) ? n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : SAFE);

export const formatPeso = (n: number) => (Number.isFinite(n) ? `₱${num(Math.round(n))}` : SAFE);

/** "2.5–3.5 kW" or "3 kW" when both ends match. */
export function formatRange(r: Range | null, unit = "", digits = 0) {
  if (!r || !Number.isFinite(r.low) || !Number.isFinite(r.high)) return SAFE;
  const lo = num(r.low, digits);
  const hi = num(r.high, digits);
  const suffix = unit ? ` ${unit}` : "";
  return lo === hi ? `${lo}${suffix}` : `${lo}–${hi}${suffix}`;
}

export function formatPesoRange(r: Range) {
  if (!Number.isFinite(r.low) || !Number.isFinite(r.high)) return SAFE;
  return r.low === r.high ? formatPeso(r.low) : `${formatPeso(r.low)}–${formatPeso(r.high)}`;
}

/* ---------------------- hand-off to the quote form ----------------------- */

/** Query-string parameters carried from the calculator to the quote form. */
export function toQuoteParams(input: CalculatorInput, result: CalculatorResult) {
  const params = new URLSearchParams({
    bill: String(Math.round(result.monthlyBill)),
    property: input.propertyType,
    ...(input.propertyType === "Commercial" ? { rate: input.commercialRate } : {}),
    size: `${result.systemSizeKw.low}-${result.systemSizeKw.high}`,
    battery: input.battery,
    daytime: input.daytimeUsage,
  });
  if (input.appliances.length > 0) params.set("appliances", input.appliances.join(","));
  return params.toString();
}

/** Calculator inputs carried with a quote request (re-validated on the server). */
export type CalculatorQuoteInput = {
  propertyType: CalcPropertyType;
  commercialRate: CommercialRateChoice;
  daytimeUsage: DaytimeUsage;
  appliances: Appliance[];
  battery: BatteryPreference;
};

/** Validates untrusted calculator inputs (from a URL or a request body). */
export function parseCalculatorQuoteInput(raw: unknown): CalculatorQuoteInput | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const propertyType = propertyTypeOptions.find((p) => p === r.propertyType);
  const daytimeUsage = typeof r.daytimeUsage === "string" && r.daytimeUsage in daytimeUsageOptions ? (r.daytimeUsage as DaytimeUsage) : null;
  const battery = typeof r.battery === "string" && r.battery in batteryOptions ? (r.battery as BatteryPreference) : null;
  if (!propertyType || !daytimeUsage || !battery) return null;
  const commercialRate =
    propertyType === "Commercial" && typeof r.commercialRate === "string" && r.commercialRate in commercialRateOptions
      ? (r.commercialRate as CommercialRateChoice)
      : "notSure";
  const appliances = Array.isArray(r.appliances)
    ? [...new Set(r.appliances.filter((a): a is Appliance => typeof a === "string" && a in applianceOptions))]
    : [];
  return { propertyType, commercialRate, daytimeUsage, appliances, battery };
}

/**
 * Reads calculator parameters from a URL and maps them to quote-form values
 * plus the calculator inputs to send with the request. Every value is
 * re-validated (URLs can be edited by anyone); unknown values are ignored.
 * Returns null when nothing usable is present.
 */
export function quotePrefillFromParams(
  params: URLSearchParams,
  config: CalculatorConfig = DEFAULT_CALCULATOR_CONFIG,
): { values: Partial<QuoteRequest>; calculator: CalculatorQuoteInput | null } | null {
  const prefill: Partial<QuoteRequest> = {};

  const billRaw = params.get("bill") ?? "";
  if (/^\d{1,9}$/.test(billRaw) && validateBill(billRaw, config) === null) {
    prefill.monthlyBill = Number(billRaw).toLocaleString("en-PH");
  }

  const property = params.get("property");
  const propertyType = propertyTypeOptions.find((p) => p === property);
  if (propertyType) prefill.propertyType = propertyType;

  const batteryKey = params.get("battery");
  const battery = batteryKey && batteryKey in batteryOptions ? (batteryKey as BatteryPreference) : null;
  if (battery) {
    prefill.service = battery === "none" ? `${propertyType ?? "Residential"} Solar` : "Hybrid Solar & Battery Storage";
  }

  const sizeMatch = /^(\d{1,3}(?:\.\d)?)-(\d{1,3}(?:\.\d)?)$/.exec(params.get("size") ?? "");
  const size = sizeMatch ? formatRange({ low: Number(sizeMatch[1]), high: Number(sizeMatch[2]) }, "kW", 1) : null;

  const rateKey = params.get("rate");
  const rateChoice =
    propertyType === "Commercial" && rateKey && rateKey in commercialRateOptions ? (rateKey as CommercialRateChoice) : null;

  if (size || battery) {
    const parts = [
      "From the Solar Calculator:",
      size ? `estimated system size about ${size}` : null,
      battery ? `battery preference: ${batteryOptions[battery].label}` : null,
      rateChoice ? `consumer rate type: ${commercialRateOptions[rateChoice].label}` : null,
    ].filter(Boolean);
    prefill.message = `${parts[0]} ${parts.slice(1).join("; ")}. I'd like an exact site assessment.`;
  }

  const calculator = parseCalculatorQuoteInput({
    propertyType,
    commercialRate: rateChoice ?? "notSure",
    daytimeUsage: params.get("daytime"),
    battery,
    appliances: (params.get("appliances") ?? "").split(",").filter(Boolean).slice(0, 12),
  });

  if (Object.keys(prefill).length === 0 && !calculator) return null;
  return { values: prefill, calculator };
}

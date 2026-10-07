/**
 * Solar Savings Calculator — all assumptions and calculation logic.
 *
 * Every number the calculator uses lives in `calculatorAssumptions` (or the
 * option tables below). UI components must not hard-code constants.
 * Results are rough planning estimates only, always shown as ranges with the
 * CALCULATOR_DISCLAIMER. Never present them as guaranteed savings.
 *
 * TODO (owner): confirm the electricity rate, export credit ratio and panel
 * wattage reflect current NORECO bills and the equipment actually installed.
 */
import { parseBillAmount, type QuoteRequest } from "@/lib/quote";

export const calculatorAssumptions = {
  /** Approximate all-in electricity rate (₱ per kWh) used to convert a bill into kWh. */
  electricityRatePerKwh: 12,
  /** Average daily peak sun hours for the area. */
  peakSunHours: 4.5,
  /** Share of rated output delivered after losses (heat, wiring, inverter, dust). */
  systemEfficiency: 0.8,
  /** Approximate wattage of one solar panel (W). */
  panelWattage: 580,
  /** Days used for monthly figures. */
  daysPerMonth: 30,
  /**
   * Value of exported (net-metered) energy relative to the retail rate.
   * Net-metering credits are usually worth less per kWh than energy you use directly.
   */
  exportCreditRatio: 0.5,
  /** Bills never drop to zero (fixed/minimum charges); cap the estimated reduction at this share of the bill. */
  maxBillReductionShare: 0.85,
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
  /** Bills outside this range get a message instead of an estimate (₱). */
  minimumBill: 1_000,
  maximumBill: 500_000,
  /** Peso amounts in results are rounded to this step. */
  pesoRoundingStep: 50,
  /** Common battery capacities (kWh) used to suggest a battery option. */
  standardBatteriesKwh: [2.4, 5, 10, 15, 20, 30],
} as const;

export const CALCULATOR_DISCLAIMER =
  "This calculator provides an initial estimate only. Actual system size, solar generation and savings depend on electricity usage, roof orientation, shading, equipment efficiency, weather, utility rates, site conditions and net-metering approval.";

/* ----------------------------- input options ----------------------------- */

export const propertyTypeOptions = ["Residential", "Commercial"] as const;
export type CalcPropertyType = (typeof propertyTypeOptions)[number];

export const daytimeUsageOptions = {
  low: {
    label: "Low",
    hint: "Most electricity is used in the evening or at night",
    /** Share of daily use that happens while the sun is up. */
    daytimeShare: 0.3,
    /** Share of monthly usage the system is sized to cover. */
    coverage: 0.6,
  },
  medium: {
    label: "Medium",
    hint: "Usage is spread through the day and evening",
    daytimeShare: 0.5,
    coverage: 0.75,
  },
  high: {
    label: "High",
    hint: "Most electricity is used during the day",
    daytimeShare: 0.7,
    coverage: 0.9,
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
  daytimeUsage: DaytimeUsage;
  appliances: Appliance[];
  battery: BatteryPreference;
};

export const defaultCalculatorInput: CalculatorInput = {
  monthlyBill: "",
  propertyType: "Residential",
  daytimeUsage: "medium",
  appliances: [],
  battery: "none",
};

/* --------------------------------- types --------------------------------- */

export type Range = { low: number; high: number };

export type CalculatorResult = {
  monthlyBill: number;
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
export function validateBill(raw: string): string | null {
  const a = calculatorAssumptions;
  if (!raw.trim()) return "Please enter your average monthly electricity bill.";
  if (raw.includes("-") || raw.includes("−")) return "The bill amount must be greater than zero.";
  const amount = parseBillAmount(raw);
  if (amount === null) return "Please enter the amount as a number, e.g. 5,000.";
  if (amount <= 0) return "The bill amount must be greater than zero.";
  if (amount < a.minimumBill)
    return `Please enter a bill of at least ${formatPeso(a.minimumBill)} for an estimate. For smaller bills, contact us to discuss options.`;
  if (amount > a.maximumBill)
    return `For bills above ${formatPeso(a.maximumBill)}, please request a site assessment for an accurate estimate.`;
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
function billReductionFor(generationKwh: number, monthlyUsageKwh: number, selfShare: number, bill: number) {
  const a = calculatorAssumptions;
  const selfUsedKwh = Math.min(generationKwh * selfShare, monthlyUsageKwh);
  const exportedKwh = Math.max(generationKwh - selfUsedKwh, 0);
  const value =
    selfUsedKwh * a.electricityRatePerKwh + exportedKwh * a.electricityRatePerKwh * a.exportCreditRatio;
  return Math.min(value, bill * a.maxBillReductionShare);
}

export function calculateSolarEstimate(input: CalculatorInput): CalculatorOutcome {
  const error = validateBill(input.monthlyBill);
  if (error) return { ok: false, error };

  const a = calculatorAssumptions;
  const bill = parseBillAmount(input.monthlyBill) as number;
  const usage = daytimeUsageOptions[input.daytimeUsage] ?? daytimeUsageOptions.medium;
  const battery = batteryOptions[input.battery] ?? batteryOptions.none;

  // 1. Bill → monthly usage
  const monthlyUsageKwh = bill / a.electricityRatePerKwh;

  // 2. Size the system to cover a share of usage
  const kwhPerKwPerMonth = a.peakSunHours * a.daysPerMonth * a.systemEfficiency;
  const idealKw = (monthlyUsageKwh * usage.coverage) / kwhPerKwPerMonth;
  const step = sizeStepFor(idealKw);
  let lowKw = Math.max(floorTo(idealKw * (1 - a.sizeSpread), step), a.minSystemKw);
  let highKw = Math.max(ceilTo(idealKw * (1 + a.sizeSpread), step), a.minSystemKw);
  if (highKw <= lowKw) highKw = lowKw + step;
  lowKw = Number(lowKw.toFixed(1));
  highKw = Number(highKw.toFixed(1));

  // 3. Panels and generation
  const panelCount = {
    low: Math.ceil((lowKw * 1000) / a.panelWattage),
    high: Math.ceil((highKw * 1000) / a.panelWattage),
  };
  const monthlyGenerationKwh = {
    low: lowKw * kwhPerKwPerMonth * (1 - a.generationVariability),
    high: highKw * kwhPerKwPerMonth,
  };

  // 4. Bill reduction range
  const selfShare = clamp(usage.daytimeShare + battery.selfConsumptionBoost, 0, 0.95);
  const reductionLow = billReductionFor(monthlyGenerationKwh.low, monthlyUsageKwh, selfShare, bill);
  const reductionHigh = billReductionFor(monthlyGenerationKwh.high, monthlyUsageKwh, selfShare, bill);
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
  if (input.propertyType === "Commercial") {
    notes.push("Commercial systems are finalised after a load and site assessment.");
  }
  if (!hasBattery) {
    notes.push("Net-metering credits depend on approval by your electric cooperative.");
  }

  const result: CalculatorResult = {
    monthlyBill: bill,
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
  const numbers = [result.monthlyBill, result.monthlyUsageKwh];
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
    size: `${result.systemSizeKw.low}-${result.systemSizeKw.high}`,
    battery: input.battery,
  });
  return params.toString();
}

/**
 * Reads calculator parameters from a URL and maps them to quote-form values.
 * Every value is re-validated (URLs can be edited by anyone); unknown or
 * malformed values are ignored. Returns null when nothing usable is present.
 */
export function quotePrefillFromParams(params: URLSearchParams): Partial<QuoteRequest> | null {
  const prefill: Partial<QuoteRequest> = {};

  const billRaw = params.get("bill") ?? "";
  if (/^\d{1,9}$/.test(billRaw) && validateBill(billRaw) === null) {
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

  if (size || battery) {
    const parts = [
      "From the Solar Calculator:",
      size ? `estimated system size about ${size}` : null,
      battery ? `battery preference: ${batteryOptions[battery].label}` : null,
    ].filter(Boolean);
    prefill.message = `${parts[0]} ${parts.slice(1).join("; ")}. I'd like an exact site assessment.`;
  }

  return Object.keys(prefill).length > 0 ? prefill : null;
}

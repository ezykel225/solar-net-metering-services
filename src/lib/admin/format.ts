/** Formatting helpers for the admin area (Philippine time and pesos). */
export const formatDateTime = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" })
    : "—";

export const formatDate = (iso: string | null | undefined) =>
  iso ? new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-PH", { timeZone: "UTC", dateStyle: "medium" }) : "—";

export const formatPhp = (n: number | string | null | undefined) => {
  const v = typeof n === "string" ? Number(n) : n;
  return v == null || !Number.isFinite(v) ? "—" : `₱${v.toLocaleString("en-PH", { maximumFractionDigits: 2 })}`;
};

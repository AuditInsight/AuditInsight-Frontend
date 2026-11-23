/**
 * Shared display rules for payments in the Super Admin panel.
 * Times arrive as ISO strings with a time zone, so the browser shows them in the viewer's local time.
 */
import type { AdminPaymentResponse, AdminPaymentStatus, AdminPaymentProvider, AdminSubscriptionType } from "@/api/admin";

export const PAYMENT_STATUSES: AdminPaymentStatus[] = ["SUCCESSFUL", "PENDING", "FAILED", "UNDERPAID", "EXPIRED", "CANCELLED"];

export const STATUS_LABEL: Record<AdminPaymentStatus, string> = {
  SUCCESSFUL: "Paid",
  PENDING: "Waiting for approval",
  FAILED: "Failed",
  UNDERPAID: "Underpaid",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

export const STATUS_COLORS: Record<AdminPaymentStatus, { bg: string; fg: string }> = {
  SUCCESSFUL: { bg: "#dcfce7", fg: "#15803d" },
  PENDING: { bg: "#e0f2fe", fg: "#0369a1" },
  FAILED: { bg: "#fee2e2", fg: "#b91c1c" },
  UNDERPAID: { bg: "#fef3c7", fg: "#92400e" },
  EXPIRED: { bg: "#f1f5f9", fg: "#475569" },
  CANCELLED: { bg: "#f1f5f9", fg: "#475569" },
};

export const PROVIDER_LABEL: Record<AdminPaymentProvider, string> = {
  MOMO: "MTN Mobile Money",
  CARD: "Card",
};

export const PLAN_LABEL: Record<AdminSubscriptionType, string> = {
  MONTHLY: "Monthly",
  SIX_MONTHS: "6 months",
  ANNUAL: "Annual",
};

/** "20 Nov 2026, 18:03" in the viewer's time zone; "—" when missing. */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** The viewer's time zone name, e.g. "Africa/Kigali", shown next to times so nobody guesses. */
export function viewerTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "your local time";
  } catch {
    return "your local time";
  }
}

/** "RWF 15,000" — RWF has no decimals. */
export function formatMoney(amount: number | null | undefined, currency: string): string {
  if (amount === null || amount === undefined) return "—";
  const decimals = currency === "RWF" ? 0 : 2;
  return `${currency} ${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * Money that actually arrived. Only a paid or underpaid payment received anything; showing the plan price next to a
 * failed or pending payment would look like money was taken when it wasn't.
 */
export function receivedAmount(p: Pick<AdminPaymentResponse, "status" | "receivedAmount" | "currency">): string {
  if (p.status !== "SUCCESSFUL" && p.status !== "UNDERPAID") return "—";
  return formatMoney(p.receivedAmount, p.currency);
}

/** "0788 123 456" for a Rwandan number; anything else unchanged. */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  const m = /^0(\d{3})(\d{3})(\d{3})$/.exec(phone);
  return m ? `0${m[1]} ${m[2]} ${m[3]}` : phone;
}

/** Start of the given local day as an ISO date-time with the viewer's offset, e.g. 2026-11-20T00:00:00+02:00. */
export function localDayStartIso(yyyyMmDd: string, addDays = 0): string | undefined {
  if (!yyyyMmDd) return undefined;
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  const date = new Date(y, m - 1, d + addDays, 0, 0, 0, 0);
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  );
}

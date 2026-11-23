// ── Mobile Money providers ─────────────────────────────────────────
export type MoMoProvider = "MTN" | "AIRTEL" | "MPESA" | "ORANGE" | "unknown";

export interface MoMoData {
  phone: string;       // raw digits e.g. 0781234567
  provider: MoMoProvider;
  name: string;        // account holder name
  isValid: boolean;
}

// ── Provider detection by prefix ──────────────────────────────────
// Rwanda prefixes (extend for other countries as needed)
const MTN_PREFIXES    = ["078", "079"];
const AIRTEL_PREFIXES = ["072", "073"];
const MPESA_PREFIXES  = ["071"];
const ORANGE_PREFIXES = ["082", "083"];

export function detectProvider(phone: string): MoMoProvider {
  const digits = phone.replace(/\D/g, "");
  const prefix = digits.slice(0, 3);
  if (MTN_PREFIXES.includes(prefix))    return "MTN";
  if (AIRTEL_PREFIXES.includes(prefix)) return "AIRTEL";
  if (MPESA_PREFIXES.includes(prefix))  return "MPESA";
  if (ORANGE_PREFIXES.includes(prefix)) return "ORANGE";
  return "unknown";
}

// ── Phone number formatting ────────────────────────────────────────
// Rwanda format: 07X XXX XXXX
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

// ── Validation ─────────────────────────────────────────────────────
export function isPhoneValid(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 && /^0[7-8]\d{8}$/.test(digits);
}

// ── Supported network ──────────────────────────────────────────────
// Payments go through pawaPay as MTN Rwanda deposits, so only MTN numbers can pay for now
// (the backend rejects other networks with the same message).
export const MTN_ONLY_MESSAGE =
  "Only MTN Mobile Money numbers (starting with 078 or 079) can be used for payment at the moment. " +
  "Airtel Money and other networks are not supported yet. Please enter an MTN Rwanda number.";

/** Local 10-digit form (07XXXXXXXX) of +250 / 250 / 9-digit / 10-digit input. */
export function toLocalRwandaNumber(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("250")) digits = "0" + digits.slice(3);
  else if (digits.length === 9 && digits.startsWith("7")) digits = "0" + digits;
  return digits;
}

export function isMtnRwandaNumber(phone: string): boolean {
  return /^07[89]\d{7}$/.test(toLocalRwandaNumber(phone));
}

/**
 * Error to show for a MoMo number, or "" when it can pay. A non-MTN prefix is flagged as soon as it's typed;
 * an incomplete number only once the field has been left (`touched`).
 */
export function momoPhoneError(phone: string, touched: boolean): string {
  const local = toLocalRwandaNumber(phone);
  if (local.length >= 3 && /^0\d\d/.test(local) && !/^07[89]/.test(local)) return MTN_ONLY_MESSAGE;
  if (isMtnRwandaNumber(phone)) return "";
  return touched ? "Enter a valid 10-digit MTN number, e.g. 078 123 4567" : "";
}

// ── Provider branding ──────────────────────────────────────────────
export const PROVIDER_COLORS: Record<MoMoProvider, string> = {
  MTN:     "#ffcc00",
  AIRTEL:  "#e4002b",
  MPESA:   "#00a651",
  ORANGE:  "#ff6600",
  unknown: "#94a3b8",
};

export const PROVIDER_BG: Record<MoMoProvider, string> = {
  MTN:     "#fffbeb",
  AIRTEL:  "#fff1f2",
  MPESA:   "#f0fdf4",
  ORANGE:  "#fff7ed",
  unknown: "#f8fafc",
};

export const PROVIDER_LABELS: Record<MoMoProvider, string> = {
  MTN:     "MTN MoMo",
  AIRTEL:  "Airtel Money",
  MPESA:   "M-Pesa",
  ORANGE:  "Orange Money",
  unknown: "Mobile Money",
};

export const PROVIDER_EMOJI: Record<MoMoProvider, string> = {
  MTN:     "🟡",
  AIRTEL:  "🔴",
  MPESA:   "🟢",
  ORANGE:  "🟠",
  unknown: "📱",
};


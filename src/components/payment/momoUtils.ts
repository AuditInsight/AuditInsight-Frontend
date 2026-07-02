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
const MTN_PREFIXES    = ["078", "079", "072", "073"];
const AIRTEL_PREFIXES = ["073", "074"];
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

// ── Test phone numbers ─────────────────────────────────────────────
export const TEST_PHONES = [
  { phone: "0781234567", provider: "MTN",    result: "success",  label: "MTN MoMo — Success" },
  { phone: "0731234567", provider: "AIRTEL", result: "success",  label: "Airtel Money — Success" },
  { phone: "0711234567", provider: "MPESA",  result: "success",  label: "M-Pesa — Success" },
  { phone: "0789999999", provider: "MTN",    result: "failed",   label: "MTN MoMo — Insufficient funds" },
];

// ── Simulate MoMo payment ──────────────────────────────────────────
export async function simulateMoMoPayment(
  phone: string
): Promise<{ success: boolean; receiptId?: string; error?: string }> {
  // Simulate USSD push delay (real MoMo takes 5–30s)
  await new Promise((r) => setTimeout(r, 2200));

  const raw = phone.replace(/\D/g, "");
  const failed = TEST_PHONES.find(
    (t) => t.phone.replace(/\D/g, "") === raw && t.result === "failed"
  );
  if (failed) {
    return { success: false, error: "Transaction failed: Insufficient funds on this account." };
  }

  const receiptId = `MOMO-${Date.now().toString(36).toUpperCase()}`;
  return { success: true, receiptId };
}

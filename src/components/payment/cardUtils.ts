// ── Card brand detection ───────────────────────────────────────────
export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export function detectBrand(number: string): CardBrand {
  const n = number.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^6(?:011|5)/.test(n)) return "discover";
  return "unknown";
}

// ── Card number formatting ─────────────────────────────────────────
export function formatCardNumber(raw: string, brand: CardBrand): string {
  const digits = raw.replace(/\D/g, "");
  // Amex: 4-6-5 groups
  if (brand === "amex") {
    const p1 = digits.slice(0, 4);
    const p2 = digits.slice(4, 10);
    const p3 = digits.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(" ");
  }
  // All others: 4-4-4-4
  return digits.slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function maxCardLength(brand: CardBrand): number {
  return brand === "amex" ? 15 : 16;
}

// ── Luhn algorithm — real card number validation ───────────────────
export function luhnCheck(number: string): boolean {
  const digits = number.replace(/\D/g, "");
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (isEven) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

// ── Expiry validation ──────────────────────────────────────────────
export function isExpiryValid(expiry: string): boolean {
  const [mm, yy] = expiry.split("/");
  if (!mm || !yy || mm.length !== 2 || yy.length !== 2) return false;
  const month = parseInt(mm, 10);
  const year = 2000 + parseInt(yy, 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const exp = new Date(year, month - 1, 1);
  return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
}

// ── Brand SVG logos (inline) ───────────────────────────────────────
export const BRAND_COLORS: Record<CardBrand, string> = {
  visa:       "#1a1f71",
  mastercard: "#eb001b",
  amex:       "#007bc1",
  discover:   "#ff6600",
  unknown:    "#94a3b8",
};

export const BRAND_LABELS: Record<CardBrand, string> = {
  visa:       "VISA",
  mastercard: "MC",
  amex:       "AMEX",
  discover:   "DISC",
  unknown:    "",
};

// ── Test card numbers (for mock payment) ──────────────────────────
export const TEST_CARDS = [
  { number: "4242 4242 4242 4242", brand: "visa",       result: "success",  label: "Visa — Success" },
  { number: "4000 0000 0000 0002", brand: "visa",       result: "declined", label: "Visa — Declined" },
  { number: "5555 5555 5555 4444", brand: "mastercard", result: "success",  label: "Mastercard — Success" },
  { number: "3782 822463 10005",   brand: "amex",       result: "success",  label: "Amex — Success" },
];



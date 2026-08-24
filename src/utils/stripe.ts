export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "";

// Note: @stripe/js is not installed, so loadStripe is commented out
// export async function loadStripe() {
//   if (typeof window === "undefined") return null;
//   if (!STRIPE_PUBLIC_KEY) {
//     console.error("Stripe public key not configured");
//     return null;
//   }
//
//   const Stripe = await import("@stripe/js").then(m => m.loadStripe);
//   return Stripe(STRIPE_PUBLIC_KEY);
// }

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

export function getCardBrandIcon(brand: string): string {
  const icons: Record<string, string> = {
    visa: "💳",
    mastercard: "💳",
    amex: "💳",
    discover: "💳",
    other: "💳",
  };
  return icons[brand.toLowerCase()] || "💳";
}

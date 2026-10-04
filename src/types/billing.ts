// Mirrors the backend SubscriptionType enum (fixed-price RWF periods).
export type SubscriptionType = "MONTHLY" | "SIX_MONTHS" | "ANNUAL";
export type PaymentStatus = "PENDING" | "SUCCESSFUL" | "FAILED";
export type SubscriptionStatus = "TRIAL" | "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface MOMOPaymentMethod {
  id: string;
  type: "momo";
  provider: "momo";
  phoneNumber: string;
  network: "mtn" | "airtel" | "other";
  isDefault: boolean;
  createdAt: string;
}

export interface CardPaymentMethod {
  id: string;
  type: "card";
  provider: "stripe";
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: string;
}

export type PaymentMethod = MOMOPaymentMethod | CardPaymentMethod;

export interface PricingPlan {
  id: SubscriptionType;
  name: string;
  /** Price in RWF for the whole period. */
  price: number;
  durationDays: number;
  /** Short billing note, e.g. "Billed every 6 months". */
  billed: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  /** CTA label used on the public landing page. */
  cta: string;
}

export interface Subscription {
  id: string;
  organisationId: string;
  subscriptionType: SubscriptionType | null;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
}

const PLAN_FEATURES = [
  "Digital financial filing",
  "Transaction entry",
  "Evidence linking",
  "Review queue",
  "Reports",
  "Missing document flags",
  "Risk detection",
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "MONTHLY",
    name: "1 Month Plan",
    price: 15000,
    durationDays: 30,
    billed: "Billed monthly",
    description: "Full access to AuditInsight with flexible monthly billing.",
    features: PLAN_FEATURES,
    cta: "Get Started",
  },
  {
    id: "SIX_MONTHS",
    name: "6 Month Plan",
    price: 80000,
    durationDays: 180,
    billed: "Billed every 6 months",
    description: "Get the full AuditInsight experience and save 11% with a 6-month plan.",
    features: PLAN_FEATURES,
    highlighted: true,
    cta: "Choose 6 Months",
  },
  {
    id: "ANNUAL",
    name: "1 Year Plan",
    price: 150000,
    durationDays: 365,
    billed: "Billed annually",
    description: "Get the full AuditInsight experience for a year and receive 2 months free.",
    features: PLAN_FEATURES,
    cta: "Choose 1 Year",
  },
];

export const getPlan = (id: SubscriptionType | null | undefined) =>
  PRICING_PLANS.find((p) => p.id === id);

export const formatRwf = (amount: number) => `${new Intl.NumberFormat("en-US").format(amount)} RWF`;

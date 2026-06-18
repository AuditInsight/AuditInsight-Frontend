export type PlanTier = "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
export type BillingCycle = "monthly" | "annual";
export type PaymentStatus = "active" | "past_due" | "cancelled" | "trialing";

export interface PricingPlan {
  id: PlanTier;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  maxUsers: number;
  maxAudits: number;
  storageGB: number;
}

export interface Subscription {
  id: string;
  organisationId: string;
  plan: PlanTier;
  billingCycle: BillingCycle;
  status: PaymentStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentMethod {
  id: string;
  brand: "visa" | "mastercard" | "amex" | "other";
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "FREE",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Get started with basic audit management",
    features: ["Up to 2 users", "5 audits per month", "1 GB storage", "Basic reports", "Email support"],
    maxUsers: 2,
    maxAudits: 5,
    storageGB: 1,
  },
  {
    id: "STARTER",
    name: "Starter",
    monthlyPrice: 29,
    annualPrice: 23,
    description: "For small teams getting serious about audits",
    features: ["Up to 10 users", "50 audits per month", "10 GB storage", "Advanced reports", "Audit trail", "Priority support"],
    maxUsers: 10,
    maxAudits: 50,
    storageGB: 10,
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    monthlyPrice: 79,
    annualPrice: 63,
    description: "Full-featured audit management for growing orgs",
    features: ["Up to 50 users", "Unlimited audits", "100 GB storage", "Custom workflows", "Compliance templates", "API access", "24/7 support"],
    maxUsers: 50,
    maxAudits: -1,
    storageGB: 100,
    highlighted: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    monthlyPrice: 199,
    annualPrice: 159,
    description: "Enterprise-grade security and compliance",
    features: ["Unlimited users", "Unlimited audits", "1 TB storage", "SSO / SAML", "Dedicated account manager", "Custom integrations", "SLA guarantee"],
    maxUsers: -1,
    maxAudits: -1,
    storageGB: 1000,
  },
];

export const MOCK_SUBSCRIPTION: Subscription = {
  id: "sub_mock_001",
  organisationId: "org_001",
  plan: "PROFESSIONAL",
  billingCycle: "monthly",
  status: "active",
  currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  cancelAtPeriodEnd: false,
};

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pm_001", brand: "visa", last4: "4242", expiryMonth: 12, expiryYear: 2027, isDefault: true },
];

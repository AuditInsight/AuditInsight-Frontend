"use client";

import { useState, useEffect } from "react";
import { PRICING_PLANS, PlanTier, BillingCycle, Subscription } from "@/types/billing";
import CheckoutModal from "@/components/payment/CheckoutModal";
import { useSettings } from "@/hooks/useSettings";

export default function BillingSettingsCard() {
  const { org } = useSettings();
  const organisationId = org?.id || "";

  const [subscription, setSubscription] = useState<Subscription>({
    id: "sub_default",
    organisationId: organisationId,
    planTier: "PROFESSIONAL",
    billingCycle: "MONTHLY",
    status: "ACTIVE",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const [cycle, setCycle] = useState<BillingCycle>("MONTHLY");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(subscription.planTier);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPrice = (plan: (typeof PRICING_PLANS)[0], billingCycle: BillingCycle) => {
    if (billingCycle === "MONTHLY") return plan.monthlyPrice;
    if (billingCycle === "SIX_MONTHS") return plan.sixMonthsPrice;
    return plan.annualPrice;
  };

  const handleSelectPlan = (planId: PlanTier) => {
    setSelectedPlan(planId);
  };

  const handleApplyPlan = () => {
    if (selectedPlan === "FREE") {
      // Free plan - no payment needed
      setSubscription(prev => ({
        ...prev,
        planTier: selectedPlan,
        billingCycle: cycle,
      }));
    } else {
      // Paid plan - open checkout
      setCheckoutOpen(true);
    }
  };

  const handlePaymentSuccess = () => {
    setSubscription(prev => ({
      ...prev,
      planTier: selectedPlan,
      billingCycle: cycle,
    }));
    setCheckoutOpen(false);
  };

  const currentPlan = PRICING_PLANS.find(p => p.id === subscription.planTier);

  return (
    <div style={s.wrap}>
      {/* section header */}
      <div style={s.sectionHeader}>
        <div>
          <h2 style={s.sectionTitle}>Billing & Plans</h2>
          <p style={s.sectionSub}>Manage your subscription, payment methods, and billing cycle.</p>
        </div>
      </div>

      {/* current plan banner */}
      <div style={s.card}>
        <h4 style={s.cardTitle}>Current Plan & Next Payment</h4>
        <div style={s.planGrid}>
          <div>
            <span style={s.label}>Plan</span>
            <span style={s.value}>{currentPlan?.name || "—"}</span>
          </div>
          <div>
            <span style={s.label}>Billing Cycle</span>
            <span style={s.value}>
              {subscription.billingCycle === "MONTHLY"
                ? "Monthly"
                : subscription.billingCycle === "SIX_MONTHS"
                  ? "6 Months"
                  : "Annual"}
            </span>
          </div>
          <div>
            <span style={s.label}>Amount</span>
            <span style={s.value}>
              {getPrice(currentPlan!, subscription.billingCycle) === 0
                ? "Free"
                : `${new Intl.NumberFormat("en-RW", {
                    style: "currency",
                    currency: "RWF",
                    maximumFractionDigits: 0,
                  }).format(getPrice(currentPlan!, subscription.billingCycle))}`}
            </span>
          </div>
          <div>
            <span style={s.label}>Next Payment Due</span>
            <span style={{ ...s.value, color: "#1e3a8a", fontWeight: 700 }}>
              {new Date(subscription.endDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* plan features */}
      <div style={s.card}>
        <h4 style={s.cardTitle}>What's included in your plan</h4>
        <div style={s.featureGrid}>
          {currentPlan?.features.map(f => (
            <div key={f} style={s.featureItem}>
              <span style={s.featureCheck}>✓</span>
              {f}
            </div>
          ))}
        </div>
        <div style={s.usagePills}>
          <div style={s.pill}>
            <span style={s.pillLabel}>Users</span>
            <span style={s.pillValue}>
              {currentPlan?.maxUsers === -1 ? "Unlimited" : `Up to ${currentPlan?.maxUsers}`}
            </span>
          </div>
          <div style={s.pill}>
            <span style={s.pillLabel}>Audits / mo</span>
            <span style={s.pillValue}>
              {currentPlan?.maxAudits === -1 ? "Unlimited" : currentPlan?.maxAudits}
            </span>
          </div>
          <div style={s.pill}>
            <span style={s.pillLabel}>Storage</span>
            <span style={s.pillValue}>
              {currentPlan && currentPlan.storageGB >= 1000
                ? `${currentPlan.storageGB / 1000} TB`
                : `${currentPlan?.storageGB} GB`}
            </span>
          </div>
        </div>
      </div>

      {/* upgrade plan section */}
      <div style={s.card}>
        <h4 style={s.cardTitle}>Choose Your Plan</h4>

        {/* Billing Cycle Toggle */}
        <div style={s.cycleToggle}>
          <button
            onClick={() => setCycle("MONTHLY")}
            style={{
              ...s.cycleBtn,
              ...(cycle === "MONTHLY" ? s.cycleBtnActive : {}),
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setCycle("SIX_MONTHS")}
            style={{
              ...s.cycleBtn,
              ...(cycle === "SIX_MONTHS" ? s.cycleBtnActive : {}),
            }}
          >
            6 Months
          </button>
          <button
            onClick={() => setCycle("YEARLY")}
            style={{
              ...s.cycleBtn,
              ...(cycle === "YEARLY" ? s.cycleBtnActive : {}),
            }}
          >
            Annual
          </button>
        </div>

        {/* Plan Cards */}
        <div style={s.plansGrid}>
          {PRICING_PLANS.map(plan => {
            const isSelected = selectedPlan === plan.id;
            const isPopular = plan.highlighted;
            const price = getPrice(plan, cycle);

            return (
              <button
                key={plan.id}
                onClick={() => handleSelectPlan(plan.id)}
                style={{
                  ...s.planCard,
                  ...(isSelected ? s.planCardSelected : {}),
                  ...(isPopular && !isSelected ? s.planCardPopular : {}),
                }}
              >
                {isPopular && <div style={s.popularBadge}>Most Popular</div>}
                <div style={s.planName}>{plan.name}</div>
                <div style={s.priceRow}>
                  <span style={s.priceAmount}>
                    {price === 0
                      ? "Free"
                      : `${new Intl.NumberFormat("en-RW", {
                          style: "currency",
                          currency: "RWF",
                          maximumFractionDigits: 0,
                        }).format(price)}`}
                  </span>
                  {price > 0 && <span style={s.perMonth}>{cycle === "MONTHLY" ? "/mo" : cycle === "SIX_MONTHS" ? "/6mo" : "/year"}</span>}
                </div>
                {price > 0 && (
                  <div style={s.billed}>
                    {cycle === "MONTHLY" ? "Billed monthly" : cycle === "SIX_MONTHS" ? "Billed every 6 months" : "Billed annually"}
                  </div>
                )}
                <p style={s.planDesc}>{plan.description}</p>
                <ul style={s.featureList}>
                  {plan.features.slice(0, 3).map(f => (
                    <li key={f} style={s.planFeatureItem}>
                      <span style={s.checkIcon}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {isSelected && (
                  <div style={s.selectedIndicator}>
                    <span style={s.selectedDot} /> Selected
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={handleApplyPlan}
          disabled={loading}
          style={{
            ...s.upgradeBtn,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading
            ? "Processing..."
            : selectedPlan === "FREE"
              ? "Downgrade to Free"
              : `Pay & Upgrade to ${PRICING_PLANS.find(p => p.id === selectedPlan)?.name}`}
        </button>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        plan={selectedPlan}
        cycle={cycle}
        organisationId={organisationId}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", flexDirection: "column", gap: 20 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  sectionTitle: { margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" },
  sectionSub: { marginTop: 4, color: "#6b7280", fontSize: 14, marginBottom: 0 },
  card: { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "20px 22px" },
  cardTitle: { margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0F172A" },
  planGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
  },
  label: {
    display: "block",
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    marginBottom: 6,
  },
  value: {
    display: "block",
    fontSize: 16,
    fontWeight: 700,
    color: "#0F172A",
  },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px 16px", marginBottom: 16 },
  featureItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#374151" },
  featureCheck: { color: "#16a34a", fontWeight: 700 },
  usagePills: { display: "flex", gap: 10, flexWrap: "wrap" },
  pill: { background: "#F1F5F9", borderRadius: 8, padding: "8px 14px", display: "flex", flexDirection: "column", gap: 2 },
  pillLabel: { fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" },
  pillValue: { fontSize: 14, color: "#0F172A", fontWeight: 700 },
  cycleToggle: { display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" },
  cycleBtn: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "#f1f5f9",
    color: "#64748b",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
  },
  cycleBtnActive: { background: "#1e3a8a", color: "#fff", fontWeight: 600 },
  plansGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 16 },
  planCard: { position: "relative", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "20px", textAlign: "left", cursor: "pointer", transition: "all 0.18s", fontFamily: "inherit", display: "flex", flexDirection: "column" },
  planCardSelected: { border: "2px solid #1e3a8a", boxShadow: "0 0 0 4px rgba(30,58,138,0.08)" },
  planCardPopular: { border: "1.5px solid #2563eb", boxShadow: "0 4px 18px rgba(30,58,138,0.12)" },
  popularBadge: { position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" },
  planName: { fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 10 },
  priceRow: { display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 },
  priceAmount: { fontSize: 24, fontWeight: 800, color: "#0F172A" },
  perMonth: { fontSize: 13, color: "#94A3B8" },
  billed: { fontSize: 11, color: "#94A3B8", marginBottom: 8 },
  planDesc: { fontSize: 12.5, color: "#64748B", margin: "8px 0 14px", lineHeight: 1.5 },
  featureList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, flex: 1 },
  planFeatureItem: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#374151", lineHeight: 1.4 },
  checkIcon: { color: "#2563eb", fontWeight: 700, flexShrink: 0 },
  selectedIndicator: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#1e3a8a", marginTop: 14 },
  selectedDot: { width: 7, height: 7, borderRadius: "50%", background: "#1e3a8a", display: "inline-block" },
  upgradeBtn: { width: "100%", padding: "12px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
};

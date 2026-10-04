"use client";

import { useState, useEffect } from "react";
import { PRICING_PLANS, SubscriptionType, Subscription, getPlan, formatRwf } from "@/types/billing";
import PlanCards from "@/components/billing/PlanCards";
import CheckoutModal from "@/components/payment/CheckoutModal";
import { useSettings } from "@/hooks/useSettings";
import { getActiveSubscription } from "@/utils/api";

export default function BillingSettingsCard() {
  const { org } = useSettings();
  const organisationId = org?.id || "";

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionType | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const loadSubscription = async () => {
    if (!organisationId) return;
    try {
      const { data } = await getActiveSubscription(organisationId);
      setSubscription({ ...data, subscriptionType: data.subscriptionType ?? null });
    } catch {
      setSubscription(null);
    }
  };

  useEffect(() => {
    loadSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organisationId]);

  const currentPlan = getPlan(subscription?.subscriptionType);
  const target = selectedPlan ?? subscription?.subscriptionType ?? "SIX_MONTHS";
  const targetPlan = PRICING_PLANS.find(p => p.id === target);

  const handlePaymentSuccess = () => {
    setCheckoutOpen(false);
    setSelectedPlan(null);
    loadSubscription();
  };

  return (
    <div style={s.wrap}>
      <div style={s.sectionHeader}>
        <div>
          <h2 style={s.sectionTitle}>Billing & Plans</h2>
          <p style={s.sectionSub}>Manage your subscription and choose how long you want to subscribe for.</p>
        </div>
      </div>

      <div style={s.card}>
        <h4 style={s.cardTitle}>Current Plan</h4>
        <div style={s.planGrid}>
          <div>
            <span style={s.label}>Plan</span>
            <span style={s.value}>{currentPlan?.name || "No active plan"}</span>
          </div>
          <div>
            <span style={s.label}>Status</span>
            <span style={s.value}>{subscription?.status ?? "—"}</span>
          </div>
          <div>
            <span style={s.label}>Amount</span>
            <span style={s.value}>{currentPlan ? formatRwf(currentPlan.price) : "—"}</span>
          </div>
          <div>
            <span style={s.label}>{subscription?.status === "EXPIRED" ? "Expired On" : "Valid Until"}</span>
            <span style={{ ...s.value, color: "#1e3a8a", fontWeight: 700 }}>
              {subscription
                ? new Date(subscription.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                : "—"}
            </span>
          </div>
        </div>
      </div>

      <div style={s.card}>
        <h4 style={s.cardTitle}>Choose Your Plan</h4>
        <PlanCards
          selected={target}
          current={subscription?.status === "ACTIVE" ? subscription.subscriptionType : null}
          onSelect={setSelectedPlan}
        />
        <button onClick={() => setCheckoutOpen(true)} style={{ ...s.upgradeBtn, marginTop: 20 }}>
          Pay {targetPlan ? formatRwf(targetPlan.price) : ""} for {targetPlan?.name}
        </button>
      </div>

      <CheckoutModal
        open={checkoutOpen}
        plan={target}
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
  upgradeBtn: { width: "100%", padding: "12px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
};

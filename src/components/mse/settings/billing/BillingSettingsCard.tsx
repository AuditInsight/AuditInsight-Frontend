"use client";

import { useState } from "react";
import {
  MOCK_SUBSCRIPTION,
  MOCK_PAYMENT_METHODS,
  PRICING_PLANS,
  PlanTier,
  BillingCycle,
  Subscription,
  PaymentMethod,
} from "@/types/billing";
import PlanBadge from "./PlanBadge";
import ChangePlanModal from "./ChangePlanModal";
import PaymentModal from "./PaymentModal";

const CARD_ICONS: Record<string, string> = {
  visa: "💳",
  mastercard: "💳",
  amex: "💳",
  other: "💳",
};

function toastStyle(type: "success" | "error"): React.CSSProperties {
  return {
    position: "fixed", bottom: 28, right: 28, zIndex: 2000,
    background: type === "success" ? "#15803d" : "#b91c1c",
    color: "#fff", borderRadius: 12, padding: "13px 20px",
    fontSize: 14, fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    display: "flex", alignItems: "center", gap: 10,
  };
}

export default function BillingSettingsCard() {
  const [subscription, setSubscription] = useState<Subscription>(MOCK_SUBSCRIPTION);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);
  const [changePlanOpen, setChangePlanOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<{ plan: PlanTier; cycle: BillingCycle } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleChangePlan = (plan: PlanTier, cycle: BillingCycle) => {
    setChangePlanOpen(false);
    const planInfo = PRICING_PLANS.find(p => p.id === plan)!;
    const price = cycle === "monthly" ? planInfo.monthlyPrice : planInfo.annualPrice;
    if (price > 0) {
      setPendingPlan({ plan, cycle });
      setPaymentOpen(true);
    } else {
      // FREE plan — no payment needed
      setSubscription(prev => ({ ...prev, plan, billingCycle: cycle }));
      showToast("Plan updated to Free.");
    }
  };

  const handlePaymentSuccess = () => {
    if (pendingPlan) {
      setSubscription(prev => ({ ...prev, plan: pendingPlan.plan, billingCycle: pendingPlan.cycle }));
      showToast(`Payment successful! Switched to ${PRICING_PLANS.find(p => p.id === pendingPlan.plan)?.name} plan.`);
    }
    setPaymentOpen(false);
    setPendingPlan(null);
  };

  const planInfo = PRICING_PLANS.find(p => p.id === subscription.plan)!;
  const amount = subscription.billingCycle === "monthly" ? planInfo.monthlyPrice : planInfo.annualPrice;

  return (
    <div style={s.wrap}>
      {/* section header */}
      <div style={s.sectionHeader}>
        <div>
          <h2 style={s.sectionTitle}>Billing & Plans</h2>
          <p style={s.sectionSub}>Manage your subscription, payment methods, and billing cycle.</p>
        </div>
        <button style={s.changePlanBtn} onClick={() => setChangePlanOpen(true)}>
          Change Plan
        </button>
      </div>

      {/* current plan banner */}
      <PlanBadge subscription={subscription} />

      {/* plan features */}
      <div style={s.card}>
        <h4 style={s.cardTitle}>What&apos;s included in your plan</h4>
        <div style={s.featureGrid}>
          {planInfo.features.map(f => (
            <div key={f} style={s.featureItem}>
              <span style={s.featureCheck}>✓</span>
              {f}
            </div>
          ))}
        </div>
        <div style={s.usagePills}>
          <div style={s.pill}>
            <span style={s.pillLabel}>Users</span>
            <span style={s.pillValue}>{planInfo.maxUsers === -1 ? "Unlimited" : `Up to ${planInfo.maxUsers}`}</span>
          </div>
          <div style={s.pill}>
            <span style={s.pillLabel}>Audits / mo</span>
            <span style={s.pillValue}>{planInfo.maxAudits === -1 ? "Unlimited" : planInfo.maxAudits}</span>
          </div>
          <div style={s.pill}>
            <span style={s.pillLabel}>Storage</span>
            <span style={s.pillValue}>{planInfo.storageGB >= 1000 ? `${planInfo.storageGB / 1000} TB` : `${planInfo.storageGB} GB`}</span>
          </div>
        </div>
      </div>

      {/* payment methods */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <h4 style={s.cardTitle}>Payment Methods</h4>
          <button style={s.addCardBtn} onClick={() => { setPendingPlan({ plan: subscription.plan, cycle: subscription.billingCycle }); setPaymentOpen(true); }}>
            + Add Card
          </button>
        </div>
        {paymentMethods.length === 0 ? (
          <p style={s.emptyText}>No payment methods added yet.</p>
        ) : (
          <div style={s.cardList}>
            {paymentMethods.map(pm => (
              <div key={pm.id} style={s.cardRow}>
                <span style={s.cardIcon}>{CARD_ICONS[pm.brand]}</span>
                <div style={s.cardInfo}>
                  <span style={s.cardBrand}>{pm.brand.toUpperCase()}</span>
                  <span style={s.cardNum}>•••• •••• •••• {pm.last4}</span>
                  <span style={s.cardExp}>Expires {pm.expiryMonth.toString().padStart(2,"0")}/{pm.expiryYear}</span>
                </div>
                {pm.isDefault && <span style={s.defaultBadge}>Default</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* billing summary */}
      {amount > 0 && (
        <div style={s.card}>
          <h4 style={s.cardTitle}>Next Invoice</h4>
          <div style={s.invoiceRow}>
            <span style={s.invoiceLabel}>{planInfo.name} ({subscription.billingCycle})</span>
            <span style={s.invoiceAmount}>${amount}</span>
          </div>
          <div style={s.invoiceRow}>
            <span style={{ ...s.invoiceLabel, color: "#94A3B8" }}>Due on {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
            <button style={s.payNowBtn} onClick={() => { setPendingPlan({ plan: subscription.plan, cycle: subscription.billingCycle }); setPaymentOpen(true); }}>
              Pay Now
            </button>
          </div>
        </div>
      )}

      {/* modals */}
      <ChangePlanModal
        open={changePlanOpen}
        currentSubscription={subscription}
        onClose={() => setChangePlanOpen(false)}
        onChangePlan={handleChangePlan}
      />

      <PaymentModal
        open={paymentOpen}
        plan={pendingPlan?.plan ?? subscription.plan}
        cycle={pendingPlan?.cycle ?? subscription.billingCycle}
        onClose={() => { setPaymentOpen(false); setPendingPlan(null); }}
        onSuccess={handlePaymentSuccess}
      />

      {toast && (
        <div style={toastStyle(toast.type)}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", flexDirection: "column", gap: 20 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  sectionTitle: { margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" },
  sectionSub: { marginTop: 4, color: "#6b7280", fontSize: 14, marginBottom: 0 },
  changePlanBtn: { padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  card: { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "20px 22px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  cardTitle: { margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0F172A" },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px 16px", marginBottom: 16 },
  featureItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#374151" },
  featureCheck: { color: "#16a34a", fontWeight: 700 },
  usagePills: { display: "flex", gap: 10, flexWrap: "wrap" },
  pill: { background: "#F1F5F9", borderRadius: 8, padding: "8px 14px", display: "flex", flexDirection: "column", gap: 2 },
  pillLabel: { fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" },
  pillValue: { fontSize: 14, color: "#0F172A", fontWeight: 700 },
  addCardBtn: { padding: "7px 14px", borderRadius: 8, border: "1.5px solid #1e3a8a", background: "#fff", color: "#1e3a8a", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  emptyText: { fontSize: 13.5, color: "#94A3B8", margin: 0 },
  cardList: { display: "flex", flexDirection: "column", gap: 10 },
  cardRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" },
  cardIcon: { fontSize: 22 },
  cardInfo: { flex: 1, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  cardBrand: { fontSize: 12, fontWeight: 700, color: "#374151" },
  cardNum: { fontSize: 14, color: "#0F172A", fontWeight: 500, letterSpacing: "1px" },
  cardExp: { fontSize: 12, color: "#94A3B8" },
  defaultBadge: { fontSize: 11, fontWeight: 700, background: "#DBEAFE", color: "#1d4ed8", padding: "3px 9px", borderRadius: 20 },
  invoiceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" },
  invoiceLabel: { fontSize: 14, color: "#374151" },
  invoiceAmount: { fontSize: 18, fontWeight: 700, color: "#0F172A" },
  payNowBtn: { padding: "7px 16px", borderRadius: 8, border: "none", background: "#1e3a8a", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
};

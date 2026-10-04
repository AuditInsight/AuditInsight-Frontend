"use client";

import { useState } from "react";
import { SubscriptionType, getPlan } from "@/types/billing";
import PlanCards from "@/components/billing/PlanCards";
import CheckoutModal from "@/components/payment/CheckoutModal";

interface Props {
  onSelect: (plan: SubscriptionType) => void;
  onBack: () => void;
}

export default function PricingPlanStep({ onSelect, onBack }: Props) {
  const [selected, setSelected] = useState<SubscriptionType>("SIX_MONTHS");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div style={s.wrap}>
      <h2 style={s.heading}>Choose your plan</h2>
      <p style={s.sub}>Flexible plans for every team size. Pick the period that suits you.</p>

      <div style={{ width: "100%", marginBottom: 32 }}>
        <PlanCards selected={selected} onSelect={setSelected} />
      </div>

      <div style={s.actions}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <button style={s.continueBtn} onClick={() => setCheckoutOpen(true)}>
          Pay & Start {getPlan(selected)?.name} →
        </button>
      </div>

      <CheckoutModal
        open={checkoutOpen}
        plan={selected}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => {
          setCheckoutOpen(false);
          onSelect(selected);
        }}
      />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 1000, margin: "0 auto" },
  heading: { fontSize: 26, fontWeight: 700, color: "#0F172A", margin: "0 0 8px", letterSpacing: "-0.4px", textAlign: "center" },
  sub: { fontSize: 14, color: "#64748B", margin: "0 0 24px", textAlign: "center" },
  actions: { display: "flex", gap: 12, width: "100%", maxWidth: 520 },
  backBtn: { flex: "0 0 auto", padding: "13px 22px", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  continueBtn: { flex: 1, padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit" },
};

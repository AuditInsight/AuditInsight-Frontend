"use client";

import { useState } from "react";
import { PRICING_PLANS, PlanTier, BillingCycle } from "@/types/billing";
import CheckoutModal from "@/components/payment/CheckoutModal";

interface Props {
  onSelect: (plan: PlanTier, cycle: BillingCycle) => void;
  onBack: () => void;
}

const CHECK = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function PricingPlanStep({ onSelect, onBack }: Props) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [selected, setSelected] = useState<PlanTier>("PROFESSIONAL");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const price = (p: typeof PRICING_PLANS[0]) =>
    cycle === "monthly" ? p.monthlyPrice : p.annualPrice;

  return (
    <div style={s.wrap}>
      <h2 style={s.heading}>Choose your plan</h2>
      <p style={s.sub}>Start free, upgrade anytime. No hidden fees.</p>

      {/* cycle toggle */}
      <div style={s.toggle}>
        <button
          style={{ ...s.toggleBtn, ...(cycle === "monthly" ? s.toggleActive : {}) }}
          onClick={() => setCycle("monthly")}
        >
          Monthly
        </button>
        <button
          style={{ ...s.toggleBtn, ...(cycle === "annual" ? s.toggleActive : {}) }}
          onClick={() => setCycle("annual")}
        >
          Annual
          <span style={s.saveBadge}>Save 20%</span>
        </button>
      </div>

      {/* plan cards */}
      <div style={s.grid}>
        {PRICING_PLANS.map(plan => {
          const isSelected = selected === plan.id;
          const isPopular = plan.highlighted;
          return (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              style={{
                ...s.card,
                ...(isSelected ? s.cardSelected : {}),
                ...(isPopular && !isSelected ? s.cardPopular : {}),
              }}
            >
              {isPopular && <div style={s.popularBadge}>Most Popular</div>}
              <div style={s.planName}>{plan.name}</div>
              <div style={s.priceRow}>
                <span style={s.priceAmount}>
                  {price(plan) === 0 ? "Free" : `$${price(plan)}`}
                </span>
                {price(plan) > 0 && <span style={s.perMonth}>/mo</span>}
              </div>
              {cycle === "annual" && price(plan) > 0 && (
                <div style={s.billed}>Billed annually</div>
              )}
              <p style={s.planDesc}>{plan.description}</p>
              <ul style={s.featureList}>
                {plan.features.map(f => (
                  <li key={f} style={s.featureItem}>
                    <span style={{ ...s.checkIcon, color: "#2563eb" }}>{CHECK}</span>
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

      <div style={s.actions}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <button
          style={s.continueBtn}
          onClick={() => {
            if (selected === "FREE") {
              onSelect(selected, cycle);
            } else {
              setCheckoutOpen(true);
            }
          }}
        >
          {selected === "FREE" ? "Get Started Free →" : `Pay & Start ${PRICING_PLANS.find(p => p.id === selected)?.name} →`}
        </button>
      </div>

      <CheckoutModal
        open={checkoutOpen}
        plan={selected}
        cycle={cycle}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => {
          setCheckoutOpen(false);
          onSelect(selected, cycle);
        }}
      />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 900, margin: "0 auto" },
  heading: { fontSize: 26, fontWeight: 700, color: "#0F172A", margin: "0 0 8px", letterSpacing: "-0.4px", textAlign: "center" },
  sub: { fontSize: 14, color: "#64748B", margin: "0 0 24px", textAlign: "center" },
  toggle: { display: "flex", background: "#F1F5F9", borderRadius: 10, padding: 4, gap: 4, marginBottom: 32 },
  toggleBtn: { padding: "8px 20px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer", background: "transparent", color: "#64748B", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 },
  toggleActive: { background: "#fff", color: "#0F172A", fontWeight: 600, boxShadow: "0 1px 4px rgba(0,0,0,0.10)" },
  saveBadge: { background: "rgba(30,58,138,0.08)", color: "#1e3a8a", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20 },
  grid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, width: "100%", marginBottom: 32 },
  card: { position: "relative", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "24px 20px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s", display: "flex", flexDirection: "column", gap: 0, boxShadow: "0 1px 4px rgba(15,23,42,0.05)" },
  cardSelected: { border: "2px solid #1e3a8a", boxShadow: "0 0 0 4px rgba(30,58,138,0.08)" },
  cardPopular: { border: "1.5px solid #2563eb", boxShadow: "0 4px 18px rgba(30,58,138,0.12)" },
  popularBadge: { position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" },
  planName: { fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 10 },
  priceRow: { display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 },
  priceAmount: { fontSize: 28, fontWeight: 800, color: "#0F172A" },
  perMonth: { fontSize: 13, color: "#94A3B8" },
  billed: { fontSize: 11, color: "#94A3B8", marginBottom: 8 },
  planDesc: { fontSize: 12.5, color: "#64748B", margin: "8px 0 14px", lineHeight: 1.5 },
  featureList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, flex: 1 },
  featureItem: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#374151", lineHeight: 1.4 },
  checkIcon: { flexShrink: 0, marginTop: 1 },
  selectedIndicator: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#1e3a8a", marginTop: 14 },
  selectedDot: { width: 7, height: 7, borderRadius: "50%", background: "#1e3a8a", display: "inline-block" },
  actions: { display: "flex", gap: 12, width: "100%", maxWidth: 520 },
  backBtn: { flex: "0 0 auto", padding: "13px 22px", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  continueBtn: { flex: 1, padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit" },
};

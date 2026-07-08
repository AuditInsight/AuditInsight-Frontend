"use client";

import { useState } from "react";
import { PRICING_PLANS, PlanTier, BillingCycle, Subscription } from "@/types/billing";

interface Props {
  open: boolean;
  currentSubscription: Subscription;
  onClose: () => void;
  onChangePlan: (plan: PlanTier, cycle: BillingCycle) => void;
}

const CHECK = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function ChangePlanModal({ open, currentSubscription, onClose, onChangePlan }: Props) {
  const [selected, setSelected] = useState<PlanTier>(currentSubscription.plan);
  const [cycle, setCycle] = useState<BillingCycle>(currentSubscription.billingCycle);

  if (!open) return null;

  const isSame = selected === currentSubscription.plan && cycle === currentSubscription.billingCycle;

  const price = (p: typeof PRICING_PLANS[0]) =>
    cycle === "monthly" ? p.monthlyPrice : p.annualPrice;

  const direction = (): "upgrade" | "downgrade" | "same" => {
    const curr = PRICING_PLANS.findIndex(p => p.id === currentSubscription.plan);
    const next = PRICING_PLANS.findIndex(p => p.id === selected);
    if (next > curr) return "upgrade";
    if (next < curr) return "downgrade";
    return "same";
  };

  const dir = direction();

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <div>
            <h3 style={s.title}>Change Plan</h3>
            <p style={s.sub}>Current plan: <strong>{PRICING_PLANS.find(p => p.id === currentSubscription.plan)?.name}</strong></p>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* billing cycle toggle */}
        <div style={s.cycleWrap}>
          <div style={s.toggle}>
            <button style={{ ...s.toggleBtn, ...(cycle === "monthly" ? s.toggleActive : {}) }} onClick={() => setCycle("monthly")}>Monthly</button>
            <button style={{ ...s.toggleBtn, ...(cycle === "annual" ? s.toggleActive : {}) }} onClick={() => setCycle("annual")}>
              Annual <span style={s.saveBadge}>Save 20%</span>
            </button>
          </div>
        </div>

        {/* plan list */}
        <div style={s.planList}>
          {PRICING_PLANS.map(plan => {
            const isCurrent = plan.id === currentSubscription.plan && cycle === currentSubscription.billingCycle;
            const isSelected = selected === plan.id;
            return (
              <button
                key={plan.id}
                style={{ ...s.planRow, ...(isSelected ? s.planRowSelected : {}), ...(isCurrent ? s.planRowCurrent : {}) }}
                onClick={() => setSelected(plan.id)}
              >
                <div style={s.planLeft}>
                  <div style={{ ...s.radio, ...(isSelected ? s.radioActive : {}) }}>
                    {isSelected && <div style={s.radioDot} />}
                  </div>
                  <div>
                    <div style={s.planName}>
                      {plan.name}
                      {isCurrent && <span style={s.currentBadge}>Current</span>}
                      {plan.highlighted && !isCurrent && <span style={s.popularBadge}>Popular</span>}
                    </div>
                    <div style={s.featureSummary}>{plan.features.slice(0, 2).join(" · ")}</div>
                  </div>
                </div>
                <div style={s.planPrice}>
                  <span style={s.priceAmt}>{price(plan) === 0 ? "Free" : `$${price(plan)}`}</span>
                  {price(plan) > 0 && <span style={s.pricePer}>/mo</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* change summary */}
        {!isSame && (
          <div style={{ ...s.summaryBox, ...(dir === "downgrade" ? s.summaryWarn : s.summaryInfo) }}>
            {dir === "upgrade"
              ? `✨ Upgrading to ${PRICING_PLANS.find(p => p.id === selected)?.name} — new features unlock immediately.`
              : `⚠️ Downgrading to ${PRICING_PLANS.find(p => p.id === selected)?.name} — takes effect at next billing cycle.`}
          </div>
        )}

        <div style={s.actions}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            style={{ ...s.confirmBtn, opacity: isSame ? 0.5 : 1 }}
            disabled={isSame}
            onClick={() => onChangePlan(selected, cycle)}
          >
            {isSame ? "No Changes" : dir === "downgrade" ? "Confirm Downgrade" : "Confirm Upgrade"}
          </button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: 20 },
  modal: { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 500, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden" },
  header: { padding: "22px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0 },
  sub: { fontSize: 13, color: "#64748B", margin: "4px 0 0" },
  closeBtn: { background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#94A3B8", padding: 4 },
  cycleWrap: { padding: "16px 24px 0", display: "flex" },
  toggle: { display: "flex", background: "#F1F5F9", borderRadius: 10, padding: 3, gap: 3 },
  toggleBtn: { padding: "7px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", background: "transparent", color: "#64748B", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 },
  toggleActive: { background: "#fff", color: "#0F172A", fontWeight: 600, boxShadow: "0 1px 4px rgba(0,0,0,0.10)" },
  saveBadge: { background: "#dcfce7", color: "#16a34a", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 20 },
  planList: { padding: "14px 24px", display: "flex", flexDirection: "column", gap: 8 },
  planRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 12, border: "1.5px solid #E2E8F0", background: "#fff", cursor: "pointer", fontFamily: "inherit", textAlign: "left" },
  planRowSelected: { border: "2px solid #1e3a8a", background: "rgba(30,58,138,0.03)" },
  planRowCurrent: { background: "#F8FAFC" },
  planLeft: { display: "flex", alignItems: "center", gap: 12 },
  radio: { width: 18, height: 18, borderRadius: "50%", border: "2px solid #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  radioActive: { border: "2px solid #1e3a8a" },
  radioDot: { width: 8, height: 8, borderRadius: "50%", background: "#1e3a8a" },
  planName: { fontSize: 14, fontWeight: 600, color: "#0F172A", display: "flex", alignItems: "center", gap: 7 },
  currentBadge: { fontSize: 10.5, fontWeight: 700, background: "#E0F2FE", color: "#0369a1", padding: "2px 7px", borderRadius: 20 },
  popularBadge: { fontSize: 10.5, fontWeight: 700, background: "#EDE9FE", color: "#7c3aed", padding: "2px 7px", borderRadius: 20 },
  featureSummary: { fontSize: 12, color: "#94A3B8", marginTop: 3 },
  planPrice: { display: "flex", alignItems: "baseline", gap: 2 },
  priceAmt: { fontSize: 18, fontWeight: 700, color: "#0F172A" },
  pricePer: { fontSize: 12, color: "#94A3B8" },
  summaryBox: { margin: "0 24px 14px", borderRadius: 10, padding: "11px 14px", fontSize: 13, lineHeight: 1.5 },
  summaryInfo: { background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1d4ed8" },
  summaryWarn: { background: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E" },
  actions: { padding: "4px 24px 24px", display: "flex", gap: 10 },
  cancelBtn: { flex: "0 0 auto", padding: "12px 20px", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  confirmBtn: { flex: 1, padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
};



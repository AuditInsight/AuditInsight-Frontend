"use client";

import { useState } from "react";
import { PRICING_PLANS, SubscriptionType, Subscription, getPlan, formatRwf } from "@/types/billing";

interface Props {
  open: boolean;
  currentSubscription: Subscription;
  onClose: () => void;
  onChangePlan: (plan: SubscriptionType) => void;
}

export default function ChangePlanModal({ open, currentSubscription, onClose, onChangePlan }: Props) {
  const current = currentSubscription.subscriptionType;
  const [selected, setSelected] = useState<SubscriptionType>(current ?? "SIX_MONTHS");

  if (!open) return null;

  const isSame = selected === current;
  const selectedPlan = getPlan(selected);

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <div>
            <h3 style={s.title}>Change Plan</h3>
            <p style={s.sub}>Current plan: <strong>{getPlan(current)?.name ?? "None"}</strong></p>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.planList}>
          {PRICING_PLANS.map(plan => {
            const isCurrent = plan.id === current;
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
                      {plan.highlighted && !isCurrent && <span style={s.popularBadge}>Most Popular</span>}
                    </div>
                    <div style={s.featureSummary}>{plan.billed}</div>
                  </div>
                </div>
                <div style={s.priceAmt}>{formatRwf(plan.price)}</div>
              </button>
            );
          })}
        </div>

        {!isSame && selectedPlan && (
          <div style={s.summaryBox}>
            Switching to {selectedPlan.name} — you will be asked to pay {formatRwf(selectedPlan.price)}.
          </div>
        )}

        <div style={s.actions}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            style={{ ...s.confirmBtn, opacity: isSame ? 0.5 : 1 }}
            disabled={isSame}
            onClick={() => onChangePlan(selected)}
          >
            {isSame ? "No Changes" : "Continue to Payment"}
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
  priceAmt: { fontSize: 15, fontWeight: 700, color: "#0F172A" },
  summaryBox: { margin: "0 24px 14px", borderRadius: 10, padding: "11px 14px", fontSize: 13, lineHeight: 1.5, background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1d4ed8" },
  actions: { padding: "4px 24px 24px", display: "flex", gap: 10 },
  cancelBtn: { flex: "0 0 auto", padding: "12px 20px", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  confirmBtn: { flex: 1, padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
};

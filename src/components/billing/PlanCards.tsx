"use client";

import { Check } from "lucide-react";
import { PRICING_PLANS, SubscriptionType, formatRwf } from "@/types/billing";

interface Props {
  selected?: SubscriptionType | null;
  /** The plan the organisation is currently subscribed to, if any. */
  current?: SubscriptionType | null;
  onSelect: (id: SubscriptionType) => void;
  disabled?: boolean;
}

/** Plan cards that mirror the landing-page pricing section. */
export default function PlanCards({ selected, current, onSelect, disabled = false }: Props) {
  return (
    <>
      <style>{`
        .plan-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          align-items: start;
          width: 100%;
        }
        @media (max-width: 900px) {
          .plan-cards-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="plan-cards-grid">
        {PRICING_PLANS.map((plan) => {
          const hl = !!plan.highlighted;
          const isSelected = selected === plan.id;
          const isCurrent = current === plan.id;
          return (
            <div
              key={plan.id}
              style={{
                ...s.card,
                ...(hl ? s.cardHL : {}),
                ...(isSelected && !hl ? s.cardSelected : {}),
                ...(isSelected && hl ? s.cardSelectedHL : {}),
              }}
            >
              {hl && <div style={s.popularBadge}>Most Popular</div>}
              <div style={s.planTop}>
                <p style={{ ...s.planName, color: hl ? "#fff" : "#0f172a" }}>{plan.name}</p>
                <div style={s.priceRow}>
                  <span style={{ ...s.price, color: hl ? "#fff" : "#0f172a" }}>{formatRwf(plan.price)}</span>
                </div>
                <p style={{ ...s.billed, color: hl ? "rgba(255,255,255,0.7)" : "#94a3b8" }}>{plan.billed}</p>
                <p style={{ ...s.planDesc, color: hl ? "rgba(255,255,255,0.75)" : "#64748b" }}>{plan.description}</p>
              </div>
              <div style={s.featureList}>
                {plan.features.map((f) => (
                  <div key={f} style={s.featureRow}>
                    <div
                      style={{
                        ...s.checkIcon,
                        background: hl ? "rgba(255,255,255,0.15)" : "#f0fdf4",
                        color: hl ? "#fff" : "#16a34a",
                      }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 13, color: hl ? "rgba(255,255,255,0.88)" : "#374151" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(plan.id)}
                style={{
                  ...s.btn,
                  ...(hl ? s.btnHL : {}),
                  ...(isSelected && !hl ? s.btnSelected : {}),
                  opacity: disabled ? 0.6 : 1,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              >
                {isCurrent ? (isSelected ? "Current plan" : "Current plan · Select") : isSelected ? "Selected" : `Select ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: { background: "#fff", borderRadius: 24, padding: "32px", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", gap: 24, position: "relative" },
  cardHL: { background: "linear-gradient(160deg,#0c2d6b,#1e3a8a)", border: "1px solid #2563eb", boxShadow: "0 32px 80px rgba(30,58,138,0.40)" },
  cardSelected: { border: "2px solid #1e3a8a", boxShadow: "0 0 0 4px rgba(30,58,138,0.08)" },
  cardSelectedHL: { boxShadow: "0 0 0 4px rgba(37,99,235,0.35), 0 32px 80px rgba(30,58,138,0.40)" },
  popularBadge: { position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#22c55e", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" },
  planTop: { display: "flex", flexDirection: "column", gap: 6 },
  planName: { margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" },
  priceRow: { display: "flex", alignItems: "baseline", gap: 4 },
  price: { fontSize: 30, fontWeight: 800, letterSpacing: "-1px" },
  billed: { margin: 0, fontSize: 12 },
  planDesc: { margin: 0, fontSize: 13, lineHeight: 1.5 },
  featureList: { display: "flex", flexDirection: "column", gap: 10, flex: 1 },
  featureRow: { display: "flex", alignItems: "center", gap: 10 },
  checkIcon: { width: 20, height: 20, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  btn: { width: "100%", height: 44, borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", color: "#1e3a8a", fontSize: 14, fontWeight: 700, fontFamily: "inherit" },
  btnHL: { background: "#fff", color: "#1e3a8a", border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.15)" },
  btnSelected: { background: "#1e3a8a", color: "#fff", border: "1.5px solid #1e3a8a" },
};

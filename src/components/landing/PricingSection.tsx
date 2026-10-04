"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { PRICING_PLANS, formatRwf } from "@/types/billing";


export default function PricingSection() {
  return (
    <section id="pricing" style={s.section}>
      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          align-items: start;
        }
        .pricing-title { font-size: 40px; }
        @media (max-width: 1024px) {
          .pricing-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
        }
        @media (max-width: 600px) {
          .pricing-grid { grid-template-columns: 1fr; }
          .pricing-title { font-size: 28px; }
        }
      `}</style>
      <div style={s.inner}>
        <div style={s.head}>
          <p style={s.eyebrow}>Pricing</p>
          <h2 className="pricing-title" style={s.title}>Flexible plans for every team size</h2>
          <p style={s.sub}>Every plan includes full access to AuditInsight. Pay monthly, every 6 months, or yearly.</p>
        </div>
        <div className="pricing-grid">
          {PRICING_PLANS.map((plan) => (
            <div key={plan.id} style={{ ...s.card, ...(plan.highlighted ? s.cardHL : {}) }}>
              {plan.highlighted && <div style={s.popularBadge}>Most Popular</div>}
              <div style={s.planTop}>
                <p style={{ ...s.planName, color: plan.highlighted ? "#fff" : "#0f172a" }}>{plan.name}</p>
                <div style={s.priceRow}>
                  <span style={{ ...s.price, color: plan.highlighted ? "#fff" : "#0f172a" }}>{formatRwf(plan.price)}</span>
                </div>
                <p style={{ ...s.planDesc, color: plan.highlighted ? "rgba(255,255,255,0.75)" : "#64748b" }}>{plan.description}</p>
              </div>
              <div style={s.featureList}>
                {plan.features.map((f) => (
                  <div key={f} style={s.featureRow}>
                    <div style={{ ...s.checkIcon, background: plan.highlighted ? "rgba(255,255,255,0.15)" : "#f0fdf4", color: plan.highlighted ? "#fff" : "#16a34a" }}>
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 13, color: plan.highlighted ? "rgba(255,255,255,0.88)" : "#374151" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/sign-up" style={{ textDecoration: "none", display: "block", marginTop: "auto" }}>
                <button style={{ ...s.btn, ...(plan.highlighted ? s.btnHL : {}) }}>{plan.cta}</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  section:      { padding: "80px 24px", background: "#f8fafc" },
  inner:        { maxWidth: 1160, margin: "0 auto" },
  head:         { textAlign: "center", marginBottom: 48 },
  eyebrow:      { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1e3a8a", margin: "0 0 12px" },
  title:        { margin: "0 0 12px", fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" },
  sub:          { margin: 0, fontSize: 16, color: "#64748b" },
  card:         { background: "#fff", borderRadius: 24, padding: "32px", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", gap: 24, position: "relative" },
  cardHL:       { background: "linear-gradient(160deg,#0c2d6b,#1e3a8a)", border: "1px solid #2563eb", boxShadow: "0 32px 80px rgba(30,58,138,0.40)", transform: "scale(1.04)" },
  popularBadge: { position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#22c55e", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" },
  planTop:      { display: "flex", flexDirection: "column", gap: 6 },
  planName:     { margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" },
  priceRow:     { display: "flex", alignItems: "baseline", gap: 4 },
  price:        { fontSize: 38, fontWeight: 800, letterSpacing: "-1.5px" },
  period:       { fontSize: 14, fontWeight: 500 },
  planDesc:     { margin: 0, fontSize: 13, lineHeight: 1.5 },
  featureList:  { display: "flex", flexDirection: "column", gap: 10, flex: 1 },
  featureRow:   { display: "flex", alignItems: "center", gap: 10 },
  checkIcon:    { width: 20, height: 20, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  btn:          { width: "100%", height: 44, borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", color: "#1e3a8a", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  btnHL:        { background: "#fff", color: "#1e3a8a", border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.15)" },
};



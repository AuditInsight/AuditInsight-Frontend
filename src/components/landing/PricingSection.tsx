"use client";

import Link from "next/link";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Free Trial", price: "$0", period: "14 days",
    desc: "Try the platform with no commitment.",
    features: ["Up to 100 transactions", "2 users", "2 GB storage", "Basic reports"],
    cta: "Start Free", highlight: false,
  },
  {
    name: "Basic", price: "$49", period: "/month",
    desc: "For small finance teams getting started.",
    features: ["Up to 1,000 transactions", "5 users", "50 GB storage", "Review queue", "Evidence management", "Risk alerts"],
    cta: "Get Started", highlight: false,
  },
  {
    name: "Professional", price: "$149", period: "/month",
    desc: "For growing audit teams that need full power.",
    features: ["Unlimited transactions", "20 users", "250 GB storage", "AI fraud detection", "Advanced reports", "Workflow automation", "Priority support"],
    cta: "Start Professional", highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", period: "",
    desc: "Tailored for large organisations and audit firms.",
    features: ["Unlimited everything", "SSO & SAML", "Dedicated account manager", "Custom integrations", "SLA guarantee", "On-premise option"],
    cta: "Contact Sales", highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" style={s.section}>
      <div style={s.inner}>
        <div style={s.head}>
          <p style={s.eyebrow}>Pricing</p>
          <h2 style={s.title}>Flexible plans for every team size</h2>
          <p style={s.sub}>All plans include a 14-day free trial. No credit card required.</p>
        </div>

        <div style={s.grid}>
          {PLANS.map((plan) => (
            <div key={plan.name} style={{ ...s.card, ...(plan.highlight ? s.cardHL : {}) }}>
              {plan.highlight && <div style={s.popularBadge}>Most Popular</div>}
              <div style={s.planTop}>
                <p style={{ ...s.planName, color: plan.highlight ? "#fff" : "#0f172a" }}>{plan.name}</p>
                <div style={s.priceRow}>
                  <span style={{ ...s.price, color: plan.highlight ? "#fff" : "#0f172a" }}>{plan.price}</span>
                  {plan.period && <span style={{ ...s.period, color: plan.highlight ? "rgba(255,255,255,0.7)" : "#64748b" }}>{plan.period}</span>}
                </div>
                <p style={{ ...s.planDesc, color: plan.highlight ? "rgba(255,255,255,0.75)" : "#64748b" }}>{plan.desc}</p>
              </div>

              <div style={s.featureList}>
                {plan.features.map((f) => (
                  <div key={f} style={s.featureRow}>
                    <div style={{ ...s.checkIcon, background: plan.highlight ? "rgba(255,255,255,0.15)" : "#f0fdf4", color: plan.highlight ? "#fff" : "#16a34a" }}>
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.88)" : "#374151" }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link href="/sign-up" style={{ textDecoration: "none", display: "block", marginTop: "auto" }}>
                <button style={{ ...s.btn, ...(plan.highlight ? s.btnHL : {}) }}>{plan.cta}</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  section: { padding: "96px 48px", background: "#f8fafc" },
  inner: { maxWidth: 1160, margin: "0 auto" },
  head: { textAlign: "center", marginBottom: 56 },
  eyebrow: { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1e3a8a", margin: "0 0 12px" },
  title: { margin: "0 0 12px", fontSize: 40, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" },
  sub: { margin: 0, fontSize: 16, color: "#64748b" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, alignItems: "start" },
  card: {
    background: "#fff", borderRadius: 22, padding: "28px 24px",
    border: "1px solid #e2e8f0",
    display: "flex", flexDirection: "column", gap: 20,
    position: "relative",
  },
  cardHL: {
    background: "linear-gradient(160deg,#0c2d6b,#1e3a8a)",
    border: "1px solid #1e3a8a",
    boxShadow: "0 24px 64px rgba(30,58,138,0.35)",
    transform: "scale(1.03)",
  },
  popularBadge: {
    position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
    background: "#22c55e", color: "#fff",
    fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
    whiteSpace: "nowrap",
  },
  planTop: { display: "flex", flexDirection: "column", gap: 6 },
  planName: { margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" },
  priceRow: { display: "flex", alignItems: "baseline", gap: 4 },
  price: { fontSize: 38, fontWeight: 800, letterSpacing: "-1.5px" },
  period: { fontSize: 14, fontWeight: 500 },
  planDesc: { margin: 0, fontSize: 13, lineHeight: 1.5 },
  featureList: { display: "flex", flexDirection: "column", gap: 10, flex: 1 },
  featureRow: { display: "flex", alignItems: "center", gap: 10 },
  checkIcon: {
    width: 20, height: 20, borderRadius: 6,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  btn: {
    width: "100%", height: 44, borderRadius: 12, border: "1.5px solid #e2e8f0",
    background: "#fff", color: "#1e3a8a",
    fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
  },
  btnHL: {
    background: "#fff", color: "#1e3a8a",
    border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
  },
};

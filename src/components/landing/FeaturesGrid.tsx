"use client";

const FEATURES = [
  { emoji: "💳", title: "Transaction Monitoring",   text: "Track every financial movement in real time with risk scoring, duplicate detection, and approval workflow tracking.",   color: "#eff6ff", border: "#bfdbfe" },
  { emoji: "📁", title: "Evidence Management",      text: "Link invoices, receipts, bank statements, and approval memos directly to transactions with structured folder categories.", color: "#f0fdf4", border: "#bbf7d0" },
  { emoji: "🚨", title: "AI Fraud Detection",       text: "Automatic flagging of round numbers, after-hours postings, duplicate amounts, and split-payment patterns.",            color: "#fff7ed", border: "#fed7aa" },
  { emoji: "🔔", title: "Review Queue",             text: "Auditors flag issues with severity levels; accountants resolve with notes and evidence — all in a tracked workflow.",   color: "#fdf4ff", border: "#e9d5ff" },
  { emoji: "📈", title: "Audit Readiness Score",    text: "Live compliance scoring with evidence coverage percentage, missing docs heatmap, and exportable PDF/CSV reports.",     color: "#f0f9ff", border: "#bae6fd" },
  { emoji: "⚙️",  title: "Role-Based Access Control", text: "Admins, Accountants, and Auditors each see only what they need — enforced at both UI and API level.",               color: "#fefce8", border: "#fde68a" },
];

export default function FeaturesGrid() {
  return (
    <section id="features" style={s.section}>
      <div style={s.inner}>
        <div style={s.head}>
          <p style={s.eyebrow}>Platform Features</p>
          <h2 style={s.title}>Everything needed for modern audits</h2>
          <p style={s.sub}>One platform for your entire financial audit cycle — from evidence upload to compliance reporting.</p>
        </div>

        <div style={s.grid}>
          {FEATURES.map((f) => (
            <div key={f.title} style={s.card}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, { transform: "translateY(-4px)", boxShadow: "0 16px 48px rgba(15,23,42,0.10)" })}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: "translateY(0)", boxShadow: "0 2px 8px rgba(15,23,42,0.05)" })}
            >
              <div style={{ ...s.iconBox, background: f.color, border: `1px solid ${f.border}` }}>
                <span style={{ fontSize: 22 }}>{f.emoji}</span>
              </div>
              <h3 style={s.cardTitle}>{f.title}</h3>
              <p style={s.cardText}>{f.text}</p>
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
  title: { margin: "0 0 14px", fontSize: 40, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" },
  sub: { margin: 0, fontSize: 17, color: "#64748b", lineHeight: 1.6, maxWidth: 600, marginLeft: "auto", marginRight: "auto" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
  card: {
    background: "#fff", borderRadius: 20, padding: "28px 26px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
    display: "flex", flexDirection: "column", gap: 14,
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default",
  },
  iconBox: {
    width: 48, height: 48, borderRadius: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" },
  cardText: { margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.65 },
};

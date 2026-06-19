"use client";

const STEPS = [
  { n: "01", emoji: "📥", title: "Accountant Logs Transactions", desc: "Daily financial entries are added with chart of accounts, amounts, and payment methods." },
  { n: "02", emoji: "📎", title: "Evidence is Uploaded",         desc: "Invoices, receipts, and contracts are linked directly to each transaction." },
  { n: "03", emoji: "🤖", title: "AI Risk Engine Runs",          desc: "The system auto-flags duplicates, round numbers, after-hours activity, and missing docs." },
  { n: "04", emoji: "🔍", title: "Auditor Reviews & Flags",      desc: "Auditors inspect the trail, raise issues with severity levels, and notify accountants." },
  { n: "05", emoji: "✅", title: "Accountant Resolves Issues",   desc: "Accountants upload corrections and notes, clearing the review queue." },
  { n: "06", emoji: "📊", title: "Reports Exported",            desc: "PDF/CSV compliance packages are generated for executives and external auditors." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={s.section}>
      <div style={s.inner}>
        <div style={s.head}>
          <p style={s.eyebrow}>How It Works</p>
          <h2 style={s.title}>From transaction to audit report in 6 steps</h2>
        </div>

        <div style={s.grid}>
          {STEPS.map((step, i) => (
            <div key={step.n} style={s.card}>
              <div style={s.top}>
                <span style={s.num}>{step.n}</span>
                <span style={{ fontSize: 28 }}>{step.emoji}</span>
              </div>
              <h3 style={s.cardTitle}>{step.title}</h3>
              <p style={s.cardDesc}>{step.desc}</p>
              {i < STEPS.length - 1 && <div style={s.connector} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  section: { padding: "96px 48px", background: "#fff" },
  inner: { maxWidth: 1160, margin: "0 auto" },
  head: { textAlign: "center", marginBottom: 56 },
  eyebrow: { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1e3a8a", margin: "0 0 12px" },
  title: { margin: 0, fontSize: 40, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
  card: {
    background: "linear-gradient(135deg,#f8fafc,#f0f4ff)",
    borderRadius: 20, padding: "26px 24px",
    border: "1px solid #e2e8f0",
    position: "relative",
  },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  num: { fontSize: 13, fontWeight: 800, color: "#1e3a8a", letterSpacing: "0.05em" },
  cardTitle: { margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#0f172a" },
  cardDesc: { margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.65 },
  connector: {
    position: "absolute", top: "50%", right: -13,
    width: 26, height: 2,
    background: "linear-gradient(90deg,#1e3a8a,#3b82f6)",
    zIndex: 1,
  },
};

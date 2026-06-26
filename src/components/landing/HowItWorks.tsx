"use client";

import { BarChart3, CheckCircle, Paperclip, Search, Sparkles, Wallet, type LucideIcon } from "lucide-react";

const STEPS: { n: string; icon: LucideIcon; title: string; desc: string }[] = [
  { n: "01", icon: Wallet,      title: "Accountant Logs Transactions", desc: "Daily financial entries are added with chart of accounts, amounts, and payment methods." },
  { n: "02", icon: Paperclip,   title: "Evidence is Uploaded",         desc: "Invoices, receipts, and contracts are linked directly to each transaction." },
  { n: "03", icon: Sparkles,    title: "AI Risk Engine Runs",          desc: "The system auto-flags duplicates, round numbers, after-hours activity, and missing docs." },
  { n: "04", icon: Search,      title: "Auditor Reviews & Flags",      desc: "Auditors inspect the trail, raise issues with severity levels, and notify accountants." },
  { n: "05", icon: CheckCircle, title: "Accountant Resolves Issues",   desc: "Accountants upload corrections and notes, clearing the review queue." },
  { n: "06", icon: BarChart3,   title: "Reports Exported",             desc: "PDF/CSV compliance packages are generated for executives and external auditors." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={s.section}>
      <style>{`
        .hiw-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .hiw-title { font-size: 40px; }
        .hiw-connector { display: block; }
        @media (max-width: 960px) {
          .hiw-grid { grid-template-columns: repeat(2, 1fr); }
          .hiw-title { font-size: 32px; }
          .hiw-connector { display: none; }
        }
        @media (max-width: 600px) {
          .hiw-grid { grid-template-columns: 1fr; }
          .hiw-title { font-size: 26px; }
        }
      `}</style>
      <div style={s.inner}>
        <div style={s.head}>
          <p style={s.eyebrow}>How It Works</p>
          <h2 className="hiw-title" style={s.title}>From transaction to audit report in 6 steps</h2>
        </div>
        <div className="hiw-grid">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.n} style={s.card}>
                <div style={s.top}>
                  <span style={s.num}>{step.n}</span>
                  <div style={s.iconWrap}><Icon size={22} color="#1e3a8a" strokeWidth={1.75} /></div>
                </div>
                <h3 style={s.cardTitle}>{step.title}</h3>
                <p style={s.cardDesc}>{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hiw-connector" style={s.connector} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  section:   { padding: "80px 24px", background: "#fff" },
  inner:     { maxWidth: 1160, margin: "0 auto" },
  head:      { textAlign: "center", marginBottom: 48 },
  eyebrow:   { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1e3a8a", margin: "0 0 12px" },
  title:     { margin: 0, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" },
  card: {
    background: "linear-gradient(135deg,#f8fafc,#f0f4ff)",
    borderRadius: 20, padding: "26px 24px",
    border: "1px solid #e2e8f0",
    position: "relative",
  },
  top:       { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  num:       { fontSize: 13, fontWeight: 800, color: "#1e3a8a", letterSpacing: "0.05em" },
  iconWrap:  { width: 40, height: 40, borderRadius: 12, background: "#fff", border: "1px solid #dbeafe", display: "flex", alignItems: "center", justifyContent: "center" },
  cardTitle: { margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#0f172a" },
  cardDesc:  { margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.65 },
  connector: {
    position: "absolute", top: "50%", right: -13,
    width: 26, height: 2,
    background: "linear-gradient(90deg,#1e3a8a,#3b82f6)",
    zIndex: 1,
  },
};

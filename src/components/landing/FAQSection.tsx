"use client";

const faqs = [
  { q: "Can I export reports?",                       a: "Yes, reports can be exported to PDF, CSV, and Excel." },
  { q: "Does AuditInsight support fraud detection?",  a: "Yes, the platform includes AI-powered risk and fraud monitoring." },
  { q: "Can multiple auditors collaborate?",          a: "Yes, teams can collaborate using roles and permissions." },
];

export default function FAQSection() {
  return (
    <section id="faq" style={s.section}>
      <style>{`
        .faq-title { font-size: 36px; }
        @media (max-width: 600px) {
          .faq-section { padding: 60px 20px; }
          .faq-title   { font-size: 26px; }
        }
      `}</style>
      <div style={s.inner}>
        <h2 className="faq-title" style={s.title}>Frequently Asked Questions</h2>
        <div style={s.list}>
          {faqs.map((faq) => (
            <div key={faq.q} style={s.item}>
              <h4 style={s.q}>{faq.q}</h4>
              <p style={s.a}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  section: { padding: "80px 24px" },
  inner:   { maxWidth: 760, margin: "0 auto" },
  title:   { margin: "0 0 32px", fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" },
  list:    { display: "flex", flexDirection: "column", gap: 16 },
  item:    { background: "#fff", borderRadius: 18, padding: 24, border: "1px solid #e5e7eb" },
  q:       { margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#0f172a" },
  a:       { margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.65 },
};

"use client";

const TESTIMONIALS = [
 {
   quote:
     "Financial records can become scattered across filing cabinets, physical folders, and storage areas, making important documents difficult to organize and retrieve when they are needed.",
   name: "Marie Uwase",
   role: "Finance Director",
   company: "Kigali Trade Co.",
   initials: "MU",
   color: "#1e3a8a",
 },
 {
   quote:
     "Finding one invoice, receipt, bank statement, or approval document can mean searching through multiple folders and asking different people where the document was stored.",
   name: "Jean Habimana",
   role: "Senior Auditor",
   company: "East Africa Logistics",
   initials: "JH",
   color: "#15803d",
 },
 {
   quote:
     "The same financial documents may be printed, copied, and physically filed in different locations, creating unnecessary administrative work and making record keeping more difficult.",
   name: "Sandra Mukamana",
   role: "Chief Compliance Officer",
   company: "Rwanda Health Partners",
   initials: "SM",
   color: "#7c3aed",
 },
 {
   quote:
     "Missing supporting documents are often discovered when an audit or review is already underway, leaving finance teams under pressure to search for invoices, receipts, approvals, and other evidence.",
   name: "Ndahayo Eric",
   role: "Finance Manager",
   company: "Ubumwe Microfinance",
   initials: "NE",
   color: "#b45309",
 },
 {
   quote:
     "Physical documents can be misplaced, damaged, or become difficult to preserve and access over time, especially when organizations depend heavily on paper-based filing.",
   name: "Uwayo Jean Paul",
   role: "Internal Auditor",
   company: "Rwanda Education Fund",
   initials: "UJ",
   color: "#0369a1",
 },
 {
   quote:
     "Financial information can end up spread across paper files, computers, emails, and different storage locations, making it difficult to maintain one organized view of the organization's records and evidence.",
   name: "Alice Uwimana",
   role: "Senior Accountant",
   company: "Rwanda Agricultural Cooperative",
   initials: "AU",
   color: "#be185d",
 },
];

export default function Testimonials() {
  return (
    <section style={s.section}>
      <style>{`
        .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .testi-title { font-size: 40px; }
        @media (max-width: 960px) {
          .testi-grid  { grid-template-columns: repeat(2, 1fr); }
          .testi-title { font-size: 32px; }
        }
        @media (max-width: 600px) {
          .testi-grid  { grid-template-columns: 1fr; }
          .testi-title { font-size: 26px; }
        }
      `}</style>
      <div style={s.inner}>
        <div style={s.head}>
          <p style={s.eyebrow}>Customer Stories</p>
          <h2 className="testi-title" style={s.title}>Trusted by audit professionals</h2>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} style={s.card}>
              <div style={s.stars}>{"★★★★★"}</div>
              <p style={s.quote}>&ldquo;{t.quote}&rdquo;</p>
              <div style={s.author}>
                <div style={{ ...s.avatar, background: t.color }}>{t.initials}</div>
                <div>
                  <p style={s.name}>{t.name}</p>
                  <p style={s.role}>{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  section: { padding: "80px 24px", background: "#fff" },
  inner:   { maxWidth: 1160, margin: "0 auto" },
  head:    { textAlign: "center", marginBottom: 48 },
  eyebrow: { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1e3a8a", margin: "0 0 12px" },
  title:   { margin: 0, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" },
  card:    { background: "#fff", borderRadius: 24, padding: "32px", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", gap: 18, boxShadow: "0 2px 8px rgba(15,23,42,0.04)" },
  stars:   { fontSize: 16, color: "#f59e0b", letterSpacing: "2px" },
  quote:   { margin: 0, fontSize: 15, color: "#4b5563", lineHeight: 1.8, fontStyle: "italic", flex: 1 },
  author:  { display: "flex", alignItems: "center", gap: 12, marginTop: 4 },
  avatar:  { width: 42, height: 42, borderRadius: "50%", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  name:    { margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" },
  role:    { margin: 0, fontSize: 12, color: "#64748b" },
};



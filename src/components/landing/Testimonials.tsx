"use client";

const TESTIMONIALS = [
  {
    quote: "AuditInsight completely transformed how we prepare for external audits. The evidence trail and review queue alone cut our prep time in half.",
    name: "Marie Uwase", role: "Finance Director", company: "Kigali Trade Co.", initials: "MU", color: "#1e3a8a",
  },
  {
    quote: "As an auditor, having strict read-only access with a proper flagging system is exactly what I needed. The compliance reporting is exceptional.",
    name: "Jean Habimana", role: "Senior Auditor", company: "East Africa Logistics", initials: "JH", color: "#15803d",
  },
  {
    quote: "The AI fraud detection caught a suspicious cash withdrawal pattern we would have missed. It flagged round numbers posted after midnight automatically.",
    name: "Sandra Mukamana", role: "Chief Compliance Officer", company: "Rwanda Health Partners", initials: "SM", color: "#7c3aed",
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
  card:    { background: "#f8fafc", borderRadius: 22, padding: "28px 26px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 16 },
  stars:   { fontSize: 16, color: "#f59e0b", letterSpacing: "2px" },
  quote:   { margin: 0, fontSize: 15, color: "#374151", lineHeight: 1.7, fontStyle: "italic", flex: 1 },
  author:  { display: "flex", alignItems: "center", gap: 12, marginTop: 4 },
  avatar:  { width: 42, height: 42, borderRadius: "50%", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  name:    { margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" },
  role:    { margin: 0, fontSize: 12, color: "#64748b" },
};

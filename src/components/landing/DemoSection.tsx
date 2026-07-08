"use client";

export default function DemoSection() {
  return (
    <section style={s.section}>
      <style>{`
        .demo-card { padding: 32px; border-radius: 24px; }
        .demo-video { height: 480px; }
        @media (max-width: 768px) {
          .demo-card { padding: 20px; }
          .demo-video { height: 260px; }
        }
        @media (max-width: 480px) {
          .demo-video { height: 200px; }
        }
      `}</style>
      <div className="demo-card" style={s.card}>
        <h2 style={s.title}>Platform Walkthrough</h2>
        <p style={s.sub}>See how AuditInsight manages transactions, evidence, reviews, and reporting.</p>
        <div className="demo-video" style={s.video}>Demo Video Placeholder</div>
      </div>
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  section: { padding: "40px 24px 80px" },
  card:    { background: "#fff", border: "1px solid #e5e7eb" },
  title:   { margin: "0 0 10px", fontSize: 28, fontWeight: 800, color: "#0f172a" },
  sub:     { margin: "0 0 0", fontSize: 15, color: "#64748b" },
  video: {
    borderRadius: 16, background: "#0f172a", marginTop: 24,
    color: "#fff", display: "flex", justifyContent: "center",
    alignItems: "center", fontSize: 20, fontWeight: 700,
  },
};



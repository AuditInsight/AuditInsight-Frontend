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
       <h2 style={s.title}>
         See What Your Financial Records Could Look Like.
       </h2>
       <p style={s.sub}>
         From Scattered Paper Files and Disconnected Folders To One Organised,
         Searchable Financial Workspace.
       </p>
       <div className="demo-video" style={s.video}>
         Demo Video Placeholder
       </div>
     </div>
   </section>
 );
}

const s: Record<string, React.CSSProperties> = {
  section: { padding: "60px 24px 100px" },
  card:    { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 28, boxShadow: "0 2px 8px rgba(15,23,42,0.04)" },
  title:   { margin: "0 0 12px", fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px" },
  sub:     { margin: "0 0 28px", fontSize: 16, color: "#64748b", lineHeight: 1.6 },
  video: {
    borderRadius: 16, background: "#0f172a", marginTop: 24,
    color: "#fff", display: "flex", justifyContent: "center",
    alignItems: "center", fontSize: 20, fontWeight: 700,
  },
};



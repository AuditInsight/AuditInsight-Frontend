"use client";

const ITEMS = [
  { emoji: "🔐", title: "Role-Based Access",     desc: "CLIENT, MEMBER, AUDITOR, and ADMIN roles with strict UI and API enforcement." },
  { emoji: "📋", title: "Immutable Audit Trail",  desc: "Every login, transaction, flag, and resolution is permanently logged — no edits, no deletes." },
  { emoji: "🔑", title: "Secure Invitations",     desc: "Cryptographically signed invite tokens with 7-day expiry and forced password reset on first login." },
  { emoji: "🏢", title: "Multi-Tenant Isolation", desc: "Strict organisation data isolation — no user can view another tenant's financial data." },
  { emoji: "🚫", title: "API-Level Guards",        desc: "All write endpoints return 403 Forbidden for AUDITOR and CLIENT roles even if UI is bypassed." },
  { emoji: "📧", title: "Automated Notifications", desc: "Instant email alerts for invites, flagged issues, and resolutions — keeping every party informed." },
];

const BADGES = ["SOC 2 Ready", "GDPR Compliant", "ISO 27001 Aligned", "AES-256 Encryption", "Zero Trust Architecture"];

export default function SecuritySection() {
  return (
    <section id="security" style={s.section}>
      <div style={s.inner}>
        <div style={s.dark}>
          <div style={s.head}>
            <p style={s.eyebrow}>Enterprise Security</p>
            <h2 style={s.title}>Built for financial-grade compliance</h2>
            <p style={s.sub}>Security isn't an afterthought — it's the foundation every feature is built on.</p>

            <div style={s.badges}>
              {BADGES.map((b) => (
                <span key={b} style={s.badge}>✓ {b}</span>
              ))}
            </div>
          </div>

          <div style={s.grid}>
            {ITEMS.map((item) => (
              <div key={item.title} style={s.card}>
                <div style={s.iconWrap}><span style={{ fontSize: 22 }}>{item.emoji}</span></div>
                <h3 style={s.cardTitle}>{item.title}</h3>
                <p style={s.cardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  section: { padding: "0 48px 96px", background: "#f8fafc" },
  inner: { maxWidth: 1160, margin: "0 auto" },
  dark: {
    background: "linear-gradient(160deg,#0a1628,#0f2044)",
    borderRadius: 28, padding: "64px 56px",
    boxShadow: "0 32px 80px rgba(10,22,40,0.40)",
  },
  head: { textAlign: "center", marginBottom: 52 },
  eyebrow: { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#60a5fa", margin: "0 0 12px" },
  title: { margin: "0 0 12px", fontSize: 38, fontWeight: 800, color: "#fff", letterSpacing: "-1px" },
  sub: { margin: "0 0 24px", fontSize: 16, color: "rgba(255,255,255,0.60)", lineHeight: 1.6 },
  badges: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 },
  badge: {
    fontSize: 12, fontWeight: 600,
    color: "#93c5fd", background: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.25)",
    padding: "5px 12px", borderRadius: 20,
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18, padding: "22px 20px",
  },
  iconWrap: {
    width: 44, height: 44, borderRadius: 12,
    background: "rgba(255,255,255,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 14,
  },
  cardTitle: { margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#fff" },
  cardDesc: { margin: 0, fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.65 },
};

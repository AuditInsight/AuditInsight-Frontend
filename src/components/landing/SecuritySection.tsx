"use client";

import { Building2, Check, ClipboardList, Key, Lock, Mail, ShieldOff, type LucideIcon } from "lucide-react";

const ITEMS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Lock,          title: "Role-Based Access",      desc: "CLIENT, MEMBER, AUDITOR, and ADMIN roles with strict UI and API enforcement." },
  { icon: ClipboardList, title: "Immutable Audit Trail",  desc: "Every login, transaction, flag, and resolution is permanently logged — no edits, no deletes." },
  { icon: Key,           title: "Secure Invitations",     desc: "Cryptographically signed invite tokens with 7-day expiry and forced password reset on first login." },
  { icon: Building2,     title: "Multi-Tenant Isolation", desc: "Strict organisation data isolation — no user can view another tenant's financial data." },
  { icon: ShieldOff,     title: "API-Level Guards",       desc: "All write endpoints return 403 Forbidden for AUDITOR and CLIENT roles even if UI is bypassed." },
  { icon: Mail,          title: "Automated Notifications",desc: "Instant email alerts for invites, flagged issues, and resolutions — keeping every party informed." },
];

const BADGES = ["SOC 2 Ready", "GDPR Compliant", "ISO 27001 Aligned", "AES-256 Encryption", "Zero Trust Architecture"];

export default function SecuritySection() {
  return (
    <section id="security" style={s.section}>
      <style>{`
        .sec-dark   { padding: 64px 48px; }
        .sec-grid   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .sec-title  { font-size: 38px; }
        @media (max-width: 960px) {
          .sec-grid  { grid-template-columns: repeat(2, 1fr); }
          .sec-dark  { padding: 40px 24px; }
          .sec-title { font-size: 30px; }
        }
        @media (max-width: 600px) {
          .sec-grid  { grid-template-columns: 1fr; }
          .sec-title { font-size: 24px; }
        }
      `}</style>
      <div style={s.inner}>
        <div className="sec-dark" style={s.dark}>
          <div style={s.head}>
            <p style={s.eyebrow}>Enterprise Security</p>
            <h2 className="sec-title" style={s.title}>Built for financial-grade compliance</h2>
            <p style={s.sub}>Security isn&apos;t an afterthought — it&apos;s the foundation every feature is built on.</p>
            <div style={s.badges}>
              {BADGES.map((b) => (
                <span key={b} style={s.badge}><Check size={12} strokeWidth={3} style={{ flexShrink: 0 }} /> {b}</span>
              ))}
            </div>
          </div>
          <div className="sec-grid">
            {ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} style={s.card}>
                  <div style={s.iconWrap}><Icon size={20} color="#93c5fd" strokeWidth={1.75} /></div>
                  <h3 style={s.cardTitle}>{item.title}</h3>
                  <p style={s.cardDesc}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  section:   { padding: "0 24px 80px", background: "#f8fafc" },
  inner:     { maxWidth: 1160, margin: "0 auto" },
  dark:      { background: "linear-gradient(160deg,#0a1628,#0f2044)", borderRadius: 28, boxShadow: "0 32px 80px rgba(10,22,40,0.40)" },
  head:      { textAlign: "center", marginBottom: 48 },
  eyebrow:   { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#60a5fa", margin: "0 0 12px" },
  title:     { margin: "0 0 12px", fontWeight: 800, color: "#fff", letterSpacing: "-1px" },
  sub:       { margin: "0 0 24px", fontSize: 16, color: "rgba(255,255,255,0.60)", lineHeight: 1.6 },
  badges:    { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 },
  badge:     { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#93c5fd", background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", padding: "5px 12px", borderRadius: 20 },
  card:      { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "22px 20px" },
  iconWrap:  { width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  cardTitle: { margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#fff" },
  cardDesc:  { margin: 0, fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.65 },
};



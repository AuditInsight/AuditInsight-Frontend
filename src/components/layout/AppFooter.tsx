"use client";

import { Shield } from "lucide-react";

export default function AppFooter() {
  const year = new Date().getFullYear();
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <div style={s.left}>
          <div style={s.logoRow}>
            <div style={s.logoMark}><Shield size={11} color="#fff" strokeWidth={2.5} /></div>
            <span style={s.logoText}>AuditInsight</span>
          </div>
          <span style={s.copy}>© {year} AuditInsight · All rights reserved</span>
        </div>

        <div style={s.right}>
          {["Privacy Policy", "Terms", "Security", "Documentation", "Support"].map((l, i, arr) => (
            <span key={l} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <a href="#" style={s.link}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, { color: "#1e3a8a" })}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, { color: "#94a3b8" })}
              >{l}</a>
              {i < arr.length - 1 && <span style={s.sep}>·</span>}
            </span>
          ))}
        </div>

        <div style={s.badges}>
          {["SOC 2", "GDPR", "AES-256"].map((b) => (
            <span key={b} style={s.badge}>✓ {b}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

const s: Record<string, React.CSSProperties> = {
  footer: {
    borderTop: "1px solid #e2e8f0",
    background: "#fff",
    marginTop: "auto",
  },
  inner: {
    maxWidth: 1500, margin: "0 auto",
    padding: "14px 32px",
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    gap: 16, flexWrap: "wrap",
  },
  left: { display: "flex", alignItems: "center", gap: 14 },
  logoRow: { display: "flex", alignItems: "center", gap: 6 },
  logoMark: {
    width: 22, height: 22, borderRadius: 6,
    background: "linear-gradient(135deg,#0f3d75,#1e3a8a)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: { fontSize: 13, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" },
  copy: { fontSize: 12, color: "#94a3b8", fontWeight: 400 },
  right: { display: "flex", alignItems: "center", gap: 0 },
  link: { fontSize: 12, color: "#94a3b8", textDecoration: "none", fontWeight: 500, transition: "color 0.15s" },
  sep: { color: "#e2e8f0", fontSize: 12 },
  badges: { display: "flex", gap: 6 },
  badge: {
    fontSize: 10, fontWeight: 600,
    color: "#1d4ed8", background: "#eff6ff",
    border: "1px solid #bfdbfe",
    padding: "2px 8px", borderRadius: 12,
  },
};

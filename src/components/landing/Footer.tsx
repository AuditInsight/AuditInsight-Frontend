"use client";

import { Shield } from "lucide-react";

const LINKS = {
  Product: [
    { label: "Features",       href: "#features"    },
    { label: "How It Works",   href: "#how-it-works"},
    { label: "Pricing",        href: "#pricing"     },
    { label: "Security",       href: "#security"    },
    { label: "Changelog",      href: "#"            },
  ],
  Platform: [
    { label: "Dashboard",      href: "/dashboard"   },
    { label: "Transactions",   href: "/transactions"},
    { label: "Evidence Vault", href: "/evidence"    },
    { label: "Review Queue",   href: "/review-queue"},
    { label: "Reports",        href: "/reports"     },
  ],
  Company: [
    { label: "About",          href: "#" },
    { label: "Blog",           href: "#" },
    { label: "Careers",        href: "#" },
    { label: "Contact",        href: "#" },
    { label: "Status",         href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy",    href: "#" },
    { label: "Terms of Service",  href: "#" },
    { label: "Cookie Policy",     href: "#" },
    { label: "Data Processing",   href: "#" },
    { label: "Security Disclosures", href: "#" },
  ],
};

const SOCIALS = [
  { label: "Twitter / X", symbol: "𝕏", href: "#" },
  { label: "LinkedIn",    symbol: "in", href: "#" },
  { label: "GitHub",      symbol: "⌥",  href: "#" },
];

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        {/* Top row */}
        <div style={s.topRow}>
          {/* Brand */}
          <div style={s.brand}>
            <div style={s.logoRow}>
              <div style={s.logoMark}><Shield size={16} color="#fff" strokeWidth={2.5} /></div>
              <span style={s.logoText}>AuditInsight</span>
            </div>
            <p style={s.brandDesc}>
              The modern audit and compliance operating system for finance teams.
              Built for accuracy, transparency, and trust.
            </p>
            <div style={s.socialRow}>
              {SOCIALS.map((soc) => (
                <a key={soc.label} href={soc.href} title={soc.label} style={s.socialBtn}>
                  {soc.symbol}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([col, links]) => (
            <div key={col} style={s.col}>
              <p style={s.colTitle}>{col}</p>
              {links.map((l) => (
                <a key={l.label} href={l.href} style={s.link}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, { color: "#fff" })}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, { color: "rgba(255,255,255,0.50)" })}
                >
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={s.divider} />

        {/* Bottom row */}
        <div style={s.bottomRow}>
          <p style={s.copy}>© {new Date().getFullYear()} AuditInsight. All rights reserved.</p>
          <div style={s.bottomBadges}>
            {["SOC 2", "GDPR", "ISO 27001", "AES-256"].map((b) => (
              <span key={b} style={s.badge}>✓ {b}</span>
            ))}
          </div>
          <p style={s.madeWith}>Built with precision for audit professionals.</p>
        </div>
      </div>
    </footer>
  );
}

const s: Record<string, React.CSSProperties> = {
  footer: {
    background: "linear-gradient(180deg,#0a1628 0%,#060e1c 100%)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  inner: { maxWidth: 1160, margin: "0 auto", padding: "72px 48px 40px" },

  topRow: {
    display: "grid",
    gridTemplateColumns: "280px repeat(4, 1fr)",
    gap: 40,
    marginBottom: 56,
  },

  brand: { display: "flex", flexDirection: "column", gap: 16 },
  logoRow: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: {
    width: 36, height: 36, borderRadius: 10,
    background: "linear-gradient(135deg,#0f3d75,#1e3a8a)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 12px rgba(30,58,138,0.40)",
  },
  logoText: { fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.4px" },
  brandDesc: { margin: 0, fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.7, maxWidth: 260 },
  socialRow: { display: "flex", gap: 10 },
  socialBtn: {
    width: 36, height: 36, borderRadius: 9,
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.10)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "rgba(255,255,255,0.60)", fontSize: 13, fontWeight: 700,
    textDecoration: "none", transition: "all 0.15s", cursor: "pointer",
  },

  col: { display: "flex", flexDirection: "column", gap: 10 },
  colTitle: {
    margin: "0 0 4px", fontSize: 12, fontWeight: 700,
    letterSpacing: "0.07em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.28)",
  },
  link: {
    fontSize: 14, color: "rgba(255,255,255,0.50)",
    textDecoration: "none", fontWeight: 400,
    transition: "color 0.15s", lineHeight: 1.4,
  },

  divider: { height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 28 },

  bottomRow: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", flexWrap: "wrap", gap: 16,
  },
  copy: { margin: 0, fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 500 },
  bottomBadges: { display: "flex", gap: 8 },
  badge: {
    fontSize: 11, fontWeight: 600,
    color: "rgba(148,198,255,0.70)",
    background: "rgba(59,130,246,0.08)",
    border: "1px solid rgba(59,130,246,0.15)",
    padding: "3px 9px", borderRadius: 16,
  },
  madeWith: { margin: 0, fontSize: 12, color: "rgba(255,255,255,0.25)" },
};

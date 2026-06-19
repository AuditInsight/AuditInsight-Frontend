"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

const NAV_LINKS = [
  { label: "Features",  href: "#features"  },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing",   href: "#pricing"   },
  { label: "Security",  href: "#security"  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header style={{ ...s.bar, ...(scrolled ? s.barScrolled : {}) }}>
      {/* Logo */}
      <div style={s.logo}>
        <div style={s.logoMark}><Shield size={16} color="#fff" strokeWidth={2.5} /></div>
        <span style={s.logoText}>AuditInsight</span>
      </div>

      {/* Nav */}
      <nav style={s.nav}>
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            style={{ ...s.link, ...(hover === l.href ? s.linkHover : {}) }}
            onMouseEnter={() => setHover(l.href)}
            onMouseLeave={() => setHover(null)}
          >
            {l.label}
          </a>
        ))}
      </nav>

      {/* Actions */}
      <div style={s.actions}>
        <Link href="/log-in" style={{ textDecoration: "none" }}>
          <button style={s.ghostBtn}>Sign In</button>
        </Link>
        <Link href="/sign-up" style={{ textDecoration: "none" }}>
          <button style={s.primaryBtn}>Start Free Trial →</button>
        </Link>
      </div>
    </header>
  );
}

const s: Record<string, React.CSSProperties> = {
  bar: {
    position: "sticky", top: 0, zIndex: 200,
    height: 68,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 48px",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    transition: "box-shadow 0.2s",
  },
  barScrolled: {
    boxShadow: "0 4px 24px rgba(15,23,42,0.10)",
  },
  logo: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" },
  logoMark: {
    width: 34, height: 34, borderRadius: 10,
    background: "linear-gradient(135deg,#0f3d75,#1e3a8a)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 12px rgba(30,58,138,0.30)",
  },
  logoText: { fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px" },
  nav: { display: "flex", alignItems: "center", gap: 4 },
  link: {
    padding: "8px 14px", borderRadius: 8,
    fontSize: 14, fontWeight: 500, color: "#374151",
    textDecoration: "none", transition: "all 0.15s",
  },
  linkHover: { color: "#1e3a8a", background: "rgba(30,58,138,0.06)" },
  actions: { display: "flex", alignItems: "center", gap: 10 },
  ghostBtn: {
    height: 40, padding: "0 18px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", background: "#fff",
    fontSize: 14, fontWeight: 600, color: "#374151",
    cursor: "pointer", fontFamily: "inherit",
    transition: "all 0.15s",
  },
  primaryBtn: {
    height: 40, padding: "0 20px", borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg,#0f3d75,#1e3a8a)",
    fontSize: 14, fontWeight: 700, color: "#fff",
    cursor: "pointer", fontFamily: "inherit",
    boxShadow: "0 4px 14px rgba(30,58,138,0.35)",
    transition: "all 0.15s",
  },
};

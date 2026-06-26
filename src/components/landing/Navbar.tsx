"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Shield, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features",    href: "#features"    },
  { label: "How It Works",href: "#how-it-works" },
  { label: "Pricing",     href: "#pricing"      },
  { label: "Security",    href: "#security"     },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [hover, setHover]         = useState<string | null>(null);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .nb-bar {
          position: sticky; top: 0; z-index: 200;
          height: 68px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          transition: box-shadow 0.2s;
        }
        .nb-bar.scrolled { box-shadow: 0 4px 24px rgba(15,23,42,0.10); }
        .nb-nav  { display: flex; align-items: center; gap: 4; }
        .nb-actions { display: flex; align-items: center; gap: 10; }
        .nb-hamburger { display: none; }
        .nb-mobile { display: none; }

        @media (max-width: 768px) {
          .nb-bar { padding: 0 20px; }
          .nb-nav { display: none; }
          .nb-actions { display: none; }
          .nb-hamburger {
            display: flex; align-items: center; justify-content: center;
            background: none; border: none; cursor: pointer;
            padding: 8px; border-radius: 8px; color: #374151;
          }
          .nb-mobile.open {
            display: flex; flex-direction: column; gap: 4;
            position: sticky; top: 68px; z-index: 199;
            padding: 16px 20px 20px;
            background: rgba(255,255,255,0.98);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(0,0,0,0.08);
            box-shadow: 0 8px 24px rgba(15,23,42,0.10);
          }
        }
      `}</style>

      <header className={`nb-bar${scrolled ? " scrolled" : ""}`}>
        <div style={s.logo}>
          <div style={s.logoMark}><Shield size={16} color="#fff" strokeWidth={2.5} /></div>
          <span style={s.logoText}>AuditInsight</span>
        </div>

        <nav className="nb-nav">
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

        <div className="nb-actions">
          <Link href="/log-in" style={{ textDecoration: "none" }}>
            <button style={s.ghostBtn}>Sign In</button>
          </Link>
          <Link href="/sign-up" style={{ textDecoration: "none" }}>
            <button style={s.primaryBtn}>Start Free Trial →</button>
          </Link>
        </div>

        <button
          className="nb-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <div className={`nb-mobile${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} style={s.mobileLink} onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
        <div style={{ height: 1, background: "#e2e8f0", margin: "8px 0" }} />
        <Link href="/log-in" style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
          <button style={{ ...s.ghostBtn, width: "100%" }}>Sign In</button>
        </Link>
        <Link href="/sign-up" style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
          <button style={{ ...s.primaryBtn, width: "100%", marginTop: 8 }}>Start Free Trial →</button>
        </Link>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  logo:     { display: "flex", alignItems: "center", gap: 10 },
  logoMark: {
    width: 34, height: 34, borderRadius: 10,
    background: "linear-gradient(135deg,#0f3d75,#1e3a8a)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 12px rgba(30,58,138,0.30)",
  },
  logoText: { fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px" },
  link: {
    padding: "8px 14px", borderRadius: 8,
    fontSize: 14, fontWeight: 500, color: "#374151",
    textDecoration: "none", transition: "all 0.15s",
  },
  linkHover: { color: "#1e3a8a", background: "rgba(30,58,138,0.06)" },
  mobileLink: {
    padding: "12px 8px", borderRadius: 8,
    fontSize: 15, fontWeight: 500, color: "#374151",
    textDecoration: "none", display: "block",
  },
  ghostBtn: {
    height: 40, padding: "0 18px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", background: "#fff",
    fontSize: 14, fontWeight: 600, color: "#374151",
    cursor: "pointer", fontFamily: "inherit",
  },
  primaryBtn: {
    height: 40, padding: "0 20px", borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg,#0f3d75,#1e3a8a)",
    fontSize: 14, fontWeight: 700, color: "#fff",
    cursor: "pointer", fontFamily: "inherit",
    boxShadow: "0 4px 14px rgba(30,58,138,0.35)",
  },
};

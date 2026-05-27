// components/landing/Navbar.tsx

"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Security", href: "#security" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        AuditInsight
      </div>

      <nav style={styles.nav}>
        {navLinks.map((l) => {
          const isActive = active === l.href;
          return (
            <a
              key={l.href}
              href={l.href}
              style={{
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : null),
              }}
              onMouseEnter={() => setActive(l.href)}
              onMouseLeave={() => setActive(null)}
            >
              {l.label}
            </a>
          );
        })}
      </nav>

      <div style={styles.actions}>
        <Link href="/log-in">
          <button type="button" style={styles.loginBtn}>
            Login
          </button>
        </Link>

        <Link href="/sign-up">
          <button type="button" style={styles.primaryBtn}>
            Start Free Trial
          </button>
        </Link>
      </div>
    </header>
  );
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  header: {
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 48px",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  logo: {
    fontSize: 22,
    fontWeight: 800,
    color: "#1e3a8a",
  },

  nav: {
    display: "flex",
    gap: 28,
    fontSize: 15,
    color: "#374151",
  },

  navLink: {
    color: "#374151",
    textDecoration: "none",
    fontWeight: 600,
    padding: "8px 4px",
    borderRadius: 8,
    transition: "color 0.18s ease, background 0.18s ease",
  },

  navLinkActive: {
    color: "#1e3a8a",
    background: "rgba(30,58,138,0.06)",
  },

  actions: {
    display: "flex",
    gap: 12,
  },

  loginBtn: {
    height: 42,
    padding: "0 18px",
    borderRadius: 10,
    border: "1px solid #dbe3ee",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },

  primaryBtn: {
    height: 42,
    padding: "0 18px",
    borderRadius: 10,
    border: "none",
    background: "#1e3a8a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
};
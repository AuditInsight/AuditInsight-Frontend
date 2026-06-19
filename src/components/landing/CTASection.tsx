"use client";

import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

export default function CTASection() {
  return (
    <section style={s.section}>
      <div style={s.inner}>
        <div style={s.card}>
          <div style={s.blob1} /><div style={s.blob2} />
          <div style={s.content}>
            <div style={s.iconRow}>
              <div style={s.shieldBox}><Shield size={24} color="#fff" /></div>
            </div>
            <h2 style={s.title}>Start building audit intelligence today</h2>
            <p style={s.sub}>Join finance teams who audit smarter. Free 14-day trial — no credit card required.</p>
            <div style={s.actions}>
              <Link href="/sign-up" style={{ textDecoration: "none" }}>
                <button style={s.primaryBtn}>
                  Start Free Trial <ArrowRight size={15} style={{ marginLeft: 6 }} />
                </button>
              </Link>
              <Link href="/log-in" style={{ textDecoration: "none" }}>
                <button style={s.ghostBtn}>Sign in to your workspace</button>
              </Link>
            </div>
            <div style={s.trust}>
              {["✓ No credit card", "✓ Setup in 2 minutes", "✓ Cancel anytime"].map((t) => (
                <span key={t} style={s.trustItem}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  section: { padding: "0 48px 80px", background: "#f8fafc" },
  inner: { maxWidth: 1160, margin: "0 auto" },
  card: {
    background: "linear-gradient(135deg,#0c2d6b 0%,#1e3a8a 50%,#1d4ed8 100%)",
    borderRadius: 28, padding: "72px 48px",
    textAlign: "center",
    position: "relative", overflow: "hidden",
    boxShadow: "0 32px 80px rgba(30,58,138,0.40)",
  },
  blob1: {
    position: "absolute", top: -60, right: -60,
    width: 300, height: 300, borderRadius: "50%",
    background: "rgba(255,255,255,0.05)", pointerEvents: "none",
  },
  blob2: {
    position: "absolute", bottom: -80, left: -40,
    width: 240, height: 240, borderRadius: "50%",
    background: "rgba(255,255,255,0.04)", pointerEvents: "none",
  },
  content: { position: "relative", zIndex: 2 },
  iconRow: { display: "flex", justifyContent: "center", marginBottom: 20 },
  shieldBox: {
    width: 56, height: 56, borderRadius: 16,
    background: "rgba(255,255,255,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.20)",
  },
  title: { margin: "0 0 14px", fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: "-1.5px" },
  sub: { margin: "0 0 36px", fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.6 },
  actions: { display: "flex", justifyContent: "center", gap: 14, marginBottom: 28 },
  primaryBtn: {
    display: "inline-flex", alignItems: "center",
    height: 52, padding: "0 28px", borderRadius: 12,
    border: "none", background: "#fff",
    fontSize: 15, fontWeight: 700, color: "#1e3a8a",
    cursor: "pointer", fontFamily: "inherit",
    boxShadow: "0 8px 24px rgba(0,0,0,0.20)",
  },
  ghostBtn: {
    height: 52, padding: "0 24px", borderRadius: 12,
    border: "1.5px solid rgba(255,255,255,0.35)",
    background: "rgba(255,255,255,0.10)",
    fontSize: 15, fontWeight: 600, color: "#fff",
    cursor: "pointer", fontFamily: "inherit",
  },
  trust: { display: "flex", justifyContent: "center", gap: 24 },
  trustItem: { fontSize: 13, color: "rgba(255,255,255,0.60)", fontWeight: 500 },
};

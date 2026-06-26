"use client";

import Link from "next/link";
import { Shield, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Lock } from "lucide-react";

export default function HeroSection() {
  return (
    <section style={s.section}>
      <style>{`
        .hero-section { padding: 80px 48px 80px; }
        .hero-inner {
          max-width: 1200px; margin: 0 auto;
          position: relative; z-index: 2;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: center;
        }
        .hero-title {
          margin: 0; font-weight: 800;
          font-size: 56px; line-height: 1.08; letter-spacing: -1.5px;
          color: #0f172a;
        }
        .hero-right { position: relative; display: flex; justify-content: center; }
        .hero-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .hero-stats  { display: flex; gap: 32px; padding-top: 8px; flex-wrap: wrap; }

        @media (max-width: 960px) {
          .hero-inner { grid-template-columns: 1fr; gap: 0; }
          .hero-right { display: none; }
          .hero-title { font-size: 40px; letter-spacing: -1px; }
        }
        @media (max-width: 600px) {
          .hero-section { padding: 60px 20px 60px; }
          .hero-title  { font-size: 30px; letter-spacing: -0.6px; }
          .hero-stats  { gap: 20px; }
        }
      `}</style>

      <div style={s.bgBlob1} />
      <div style={s.bgBlob2} />

      <div className="hero-inner">
        <div style={s.left}>
          <div style={s.badge}>
            <span style={s.badgeDot} />
            AI-Powered Audit Intelligence Platform
          </div>

          <h1 className="hero-title">
            The Modern{" "}
            <span style={s.titleAccent}>Audit &amp; Compliance</span>{" "}
            Operating System
          </h1>

          <p style={s.desc}>
            Track transactions, verify evidence, detect fraud, automate reviews,
            and achieve audit readiness — all in one workspace built for finance teams.
          </p>

          <div className="hero-actions">
            <Link href="/sign-up" style={{ textDecoration: "none" }}>
              <button style={s.primaryBtn}>
                Start Free Trial <ArrowRight size={15} style={{ marginLeft: 6 }} />
              </button>
            </Link>
            <Link href="/log-in" style={{ textDecoration: "none" }}>
              <button style={s.ghostBtn}>View Demo →</button>
            </Link>
          </div>

          <div className="hero-stats">
            {[
              { value: "98%",   label: "Evidence Accuracy"      },
              { value: "24/7",  label: "Risk Monitoring"         },
              { value: "1.2M+", label: "Transactions Audited"    },
            ].map((stat) => (
              <div key={stat.label} style={s.stat}>
                <span style={s.statVal}>{stat.value}</span>
                <span style={s.statLbl}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-right">
          <div style={s.mockCard}>
            <div style={s.mockHeader}>
              <div style={s.mockLogoRow}>
                <div style={s.mockLogoMark}><Shield size={13} color="#fff" /></div>
                <span style={s.mockLogoTxt}>AuditInsight</span>
              </div>
              <span style={s.mockBadge}>● Live</span>
            </div>

            <div style={s.scoreRow}>
              <p style={s.scoreLabel}>Audit Readiness</p>
              <p style={s.scoreValue}>84%</p>
              <div style={s.scoreBar}><div style={s.scoreBarFill} /></div>
            </div>

            {[
              { icon: <TrendingUp size={14} />,   label: "Linked Evidence",  value: "92%", color: "#15803d", bg: "#f0fdf4" },
              { icon: <AlertTriangle size={14} />, label: "Critical Issues",  value: "14",  color: "#b45309", bg: "#fffbeb" },
              { icon: <CheckCircle size={14} />,   label: "Resolved Flags",   value: "38",  color: "#1d4ed8", bg: "#eff6ff" },
            ].map((row) => (
              <div key={row.label} style={s.metricRow}>
                <div style={{ ...s.metricIcon, background: row.bg, color: row.color }}>{row.icon}</div>
                <span style={s.metricLabel}>{row.label}</span>
                <span style={{ ...s.metricValue, color: row.color }}>{row.value}</span>
              </div>
            ))}

            <div style={s.chartRow}>
              {[40,65,50,80,55,90,70,85,60,95,75,88].map((h, i) => (
                <div key={i} style={{ ...s.chartBar, height: `${h}%`, opacity: i === 11 ? 1 : 0.45 + i * 0.045 }} />
              ))}
            </div>
            <div style={s.chartLabels}>
              <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
            </div>
          </div>

          <div style={s.floatBadge}>
            <div style={s.floatBadgeIcon}><Lock size={18} color="#1e3a8a" strokeWidth={1.75} /></div>
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#0f172a" }}>SOC 2 Ready</p>
              <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>Enterprise security</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ACCENT = "linear-gradient(135deg,#0f3d75,#1e3a8a)";

const s: Record<string, React.CSSProperties> = {
  section: {
    position: "relative", overflow: "hidden",
    background: "linear-gradient(160deg,#f0f4ff 0%,#f8fafc 50%,#eef2ff 100%)",
    padding: "80px 48px",
  },
  bgBlob1: {
    position: "absolute", top: -120, left: -120,
    width: 480, height: 480, borderRadius: "50%",
    background: "radial-gradient(circle,rgba(30,58,138,0.10) 0%,transparent 70%)",
    pointerEvents: "none",
  },
  bgBlob2: {
    position: "absolute", bottom: -80, right: -80,
    width: 360, height: 360, borderRadius: "50%",
    background: "radial-gradient(circle,rgba(59,130,246,0.09) 0%,transparent 70%)",
    pointerEvents: "none",
  },
  left: { display: "flex", flexDirection: "column", gap: 24 },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "7px 14px", borderRadius: 999,
    background: "#dbeafe", color: "#1e3a8a",
    fontSize: 12, fontWeight: 700, width: "fit-content",
    border: "1px solid #bfdbfe",
  },
  badgeDot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "#22c55e", display: "inline-block",
    boxShadow: "0 0 0 3px rgba(34,197,94,0.25)",
  },
  titleAccent: {
    background: ACCENT,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  desc: { fontSize: 17, lineHeight: 1.75, color: "#475569", maxWidth: 520, margin: 0 },
  primaryBtn: {
    display: "inline-flex", alignItems: "center",
    height: 50, padding: "0 24px", borderRadius: 12,
    border: "none", background: ACCENT,
    fontSize: 15, fontWeight: 700, color: "#fff",
    cursor: "pointer", fontFamily: "inherit",
    boxShadow: "0 8px 24px rgba(30,58,138,0.35)",
  },
  ghostBtn: {
    height: 50, padding: "0 22px", borderRadius: 12,
    border: "1.5px solid #cbd5e1", background: "#fff",
    fontSize: 15, fontWeight: 600, color: "#374151",
    cursor: "pointer", fontFamily: "inherit",
  },
  stat:    { display: "flex", flexDirection: "column", gap: 2 },
  statVal: { fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px" },
  statLbl: { fontSize: 12, color: "#64748b", fontWeight: 500 },

  mockCard: {
    width: "100%", maxWidth: 420,
    background: "#fff", borderRadius: 24, padding: "24px 24px 20px",
    boxShadow: "0 32px 80px rgba(15,23,42,0.14), 0 4px 16px rgba(15,23,42,0.06)",
    border: "1px solid #e2e8f0",
  },
  mockHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  mockLogoRow: { display: "flex", alignItems: "center", gap: 8 },
  mockLogoMark: {
    width: 28, height: 28, borderRadius: 7, background: ACCENT,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  mockLogoTxt: { fontSize: 14, fontWeight: 700, color: "#0f172a" },
  mockBadge: { fontSize: 11, fontWeight: 600, color: "#16a34a", background: "#f0fdf4", padding: "3px 9px", borderRadius: 20, border: "1px solid #bbf7d0" },

  scoreRow:    { marginBottom: 20 },
  scoreLabel:  { margin: "0 0 4px", fontSize: 12, color: "#64748b", fontWeight: 500 },
  scoreValue:  { margin: "0 0 10px", fontSize: 48, fontWeight: 800, color: "#0f172a", letterSpacing: "-2px" },
  scoreBar:    { height: 8, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" },
  scoreBarFill:{ height: "100%", width: "84%", background: ACCENT, borderRadius: 6 },

  metricRow:  { display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f8fafc" },
  metricIcon: { width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  metricLabel:{ flex: 1, fontSize: 13, color: "#374151", fontWeight: 500 },
  metricValue:{ fontSize: 14, fontWeight: 700 },

  chartRow: { display: "flex", alignItems: "flex-end", gap: 4, height: 56, marginTop: 16, padding: "0 2px" },
  chartBar: {
    flex: 1, borderRadius: "4px 4px 0 0",
    background: "linear-gradient(180deg,#1e3a8a,#3b82f6)",
    minWidth: 6,
  },
  chartLabels: { display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", marginTop: 6, fontWeight: 500 },

  floatBadge: {
    position: "absolute", bottom: -16, left: -20,
    background: "#fff", borderRadius: 14, padding: "10px 14px",
    display: "flex", alignItems: "center", gap: 10,
    boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
    border: "1px solid #e2e8f0",
  },
  floatBadgeIcon: {
    width: 34, height: 34, borderRadius: 10,
    background: "#eff6ff", border: "1px solid #bfdbfe",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
};

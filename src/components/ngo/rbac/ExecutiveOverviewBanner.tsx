"use client";

import { ShieldCheck, TrendingUp, FolderOpen, AlertTriangle } from "lucide-react";
import type { NGOTransaction, NGOFlag } from "@/types/ngo";
import { useRBAC } from "@/context/RBACContext";

interface Props {
  transactions: NGOTransaction[];
  flags: NGOFlag[];
}

export default function ExecutiveOverviewBanner({ transactions, flags }: Props) {
  const { user } = useRBAC();
  if (user.role !== "ORG_ADMIN") return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const totalGrant    = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalSpend    = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const burnPct       = totalGrant > 0 ? Math.round((totalSpend / totalGrant) * 100) : 0;
  const openFlags     = flags.filter((f) => f.status === "OPEN").length;
  const projects      = new Set(transactions.map((t) => t.projectName)).size;
  const criticalFlags = flags.filter((f) => f.status === "OPEN" && f.severity === "CRITICAL").length;

  const kpis = [
    {
      label: "Grant Utilisation",
      value: `${burnPct}%`,
      sub: `RWF ${((totalGrant - totalSpend) / 1_000_000).toFixed(1)}M remaining`,
      icon: <TrendingUp size={14} />,
    },
    {
      label: "Active Projects",
      value: projects,
      sub: `${transactions.length} total transactions`,
      icon: <FolderOpen size={14} />,
    },
    {
      label: "Open Audit Flags",
      value: openFlags,
      sub: openFlags === 0 ? "All clear" : `${criticalFlags} critical`,
      icon: <AlertTriangle size={14} />,
    },
    {
      label: "Total Grant Funding",
      value: `RWF ${(totalGrant / 1_000_000).toFixed(1)}M`,
      sub: "All donors combined",
      icon: <ShieldCheck size={14} />,
    },
  ];

  return (
    <div style={s.banner}>
      {/* Radial glow */}
      <div style={s.glow} />

      {/* Greeting row */}
      <div style={s.topRow}>
        <div>
          <p style={s.greeting}>{greeting}, {user.fullName.split(" ")[0]} · {user.organisationName}</p>
          <h2 style={s.heading}>Executive Overview</h2>
          <p style={s.sub}>Read-only monitoring dashboard · All departments</p>
        </div>
        <div style={s.shieldWrap}>
          <ShieldCheck size={22} color="#fff" />
        </div>
      </div>

      {/* KPI strip */}
      <div style={s.kpiGrid}>
        {kpis.map(({ label, value, sub, icon }) => (
          <div key={label} style={s.kpiCard}>
            <div style={s.kpiLabel}>
              {icon}
              <span style={{ fontSize: 11.5, fontWeight: 600 }}>{label}</span>
            </div>
            <p style={s.kpiValue}>{value}</p>
            <p style={s.kpiSub}>{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  banner:    { position: "relative", borderRadius: 16, background: "linear-gradient(135deg,#0f2d5e,#1e3a8a)", padding: "24px", overflow: "hidden", boxShadow: "0 4px 24px rgba(15,23,42,0.18)" },
  glow:      { position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)" },
  topRow:    { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20, position: "relative" },
  greeting:  { fontSize: 12.5, color: "rgba(147,197,253,0.9)", fontWeight: 500, margin: "0 0 4px" },
  heading:   { fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", margin: "0 0 4px", lineHeight: 1.2 },
  sub:       { fontSize: 12.5, color: "rgba(147,197,253,0.8)", margin: 0 },
  shieldWrap:{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  kpiGrid:   { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, position: "relative" },
  kpiCard:   { borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", padding: "14px 16px", backdropFilter: "blur(4px)" },
  kpiLabel:  { display: "flex", alignItems: "center", gap: 6, color: "rgba(147,197,253,0.9)", marginBottom: 8 },
  kpiValue:  { fontSize: 20, fontWeight: 800, color: "#fff", lineHeight: 1, margin: "0 0 4px" },
  kpiSub:    { fontSize: 11.5, color: "rgba(147,197,253,0.75)", margin: 0 },
};



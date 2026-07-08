"use client";

import { Lock, DollarSign, FolderOpen, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import type { NGOTransaction, NGOFlag, DonorName } from "@/types/ngo";

interface Props {
  allTransactions: NGOTransaction[];
  allFlags: NGOFlag[];
  donorScope: DonorName;
}

export default function DonorScopeMetrics({ allTransactions, allFlags, donorScope }: Props) {
  const txns  = allTransactions.filter((t) => t.donor === donorScope);
  const flags = allFlags.filter((f) => f.donor === donorScope && f.status === "OPEN");

  const totalGrant    = txns.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalSpend    = txns.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const remaining     = totalGrant - totalSpend;
  const burnPct       = totalGrant > 0 ? Math.round((totalSpend / totalGrant) * 100) : 0;
  const completed     = txns.filter((t) => t.status === "COMPLETED").length;
  const pending       = txns.filter((t) => t.status === "PENDING").length;
  const flagged       = txns.filter((t) => t.status === "FLAGGED").length;
  const projects      = new Set(txns.map((t) => t.projectName)).size;
  const compliancePct = txns.length > 0
    ? Math.max(0, Math.round((completed / txns.length) * 100) - flags.length * 10)
    : 100;
  const ringColor = compliancePct >= 80 ? "#1e3a8a" : compliancePct >= 60 ? "#2563eb" : "#475569";

  const metrics = [
    { label: "Total Grant Funding",  value: `RWF ${(totalGrant / 1_000_000).toFixed(1)}M`,  sub: `${donorScope} contribution only`,  icon: <DollarSign size={16} color="#1e3a8a" />,  bg: "rgba(30,58,138,0.05)",  border: "rgba(30,58,138,0.15)",  color: "#0f172a" },
    { label: "Total Expenditure",    value: `RWF ${(totalSpend / 1_000_000).toFixed(1)}M`,  sub: `${burnPct}% of grant utilised`,    icon: <TrendingUp size={16} color="#475569" />,  bg: "#f8fafc",               border: "#e2e8f0",               color: "#0f172a" },
    { label: "Remaining Balance",    value: `RWF ${(remaining / 1_000_000).toFixed(1)}M`,   sub: remaining >= 0 ? "Funds available" : "Over budget", icon: <CheckCircle2 size={16} color="#2563eb" />, bg: "rgba(37,99,235,0.05)", border: "rgba(37,99,235,0.15)", color: "#0f172a" },
    { label: "Active Projects",      value: projects,                                         sub: `${txns.length} total transactions`, icon: <FolderOpen size={16} color="#3b82f6" />,  bg: "#f1f5f9",               border: "#e2e8f0",               color: "#0f172a" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Scope banner */}
      <div style={s.scopeBanner}>
        <Lock size={13} color="#1e3a8a" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 12.5, fontWeight: 600, color: "#1e3a8a", margin: 0 }}>
          Data scoped to <strong>{donorScope}</strong> only. You are viewing your organisation&apos;s funding pool exclusively.
        </p>
      </div>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {metrics.map(({ label, value, sub, icon, bg, border, color }) => (
          <div key={label} style={{ borderRadius: 12, border: `1px solid ${border}`, padding: "14px 16px", background: bg }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "#64748b" }}>{label}</span>
              {icon}
            </div>
            <p style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1, margin: "0 0 4px" }}>{value}</p>
            <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Burn rate bar */}
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0 }}>{donorScope} Grant Utilisation</p>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{burnPct}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: "#f1f5f9", overflow: "hidden", marginBottom: 12 }}>
          <div style={{ height: "100%", borderRadius: 999, width: `${burnPct}%`, background: burnPct > 90 ? "#334155" : "#1e3a8a", transition: "width 0.7s ease" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "#64748b" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1e3a8a" }} />{completed} complete
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#94a3b8" }} />{pending} pending
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#475569" }} />{flagged} flagged
          </span>
        </div>
      </div>

      {/* Compliance ring */}
      <div style={{ ...s.card, display: "flex", alignItems: "center", gap: 20 }}>
        <svg width={72} height={72} viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
          <circle cx={36} cy={36} r={28} fill="none" stroke="#f1f5f9" strokeWidth={7} />
          <circle cx={36} cy={36} r={28} fill="none" stroke={ringColor} strokeWidth={7}
            strokeDasharray={`${(compliancePct / 100) * 2 * Math.PI * 28} ${2 * Math.PI * 28}`}
            strokeLinecap="round" transform="rotate(-90 36 36)"
            style={{ transition: "stroke-dasharray 0.8s ease" }} />
          <text x={36} y={36} textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: 13, fontWeight: 700, fill: "#0f172a" }}>{compliancePct}%</text>
        </svg>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>{donorScope} Compliance Score</p>
          <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.55, margin: "0 0 8px" }}>
            {compliancePct >= 80 ? "Strong evidence coverage across your funded projects." : compliancePct >= 60 ? "Some documentation gaps detected — follow up recommended." : "Gaps identified — immediate attention required."}
          </p>
          {flags.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <AlertTriangle size={12} color="#475569" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>
                {flags.length} open flag{flags.length !== 1 ? "s" : ""} on your projects
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  scopeBanner: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(30,58,138,0.05)", border: "1px solid rgba(30,58,138,0.18)" },
  card:        { background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "16px", boxShadow: "0 1px 4px rgba(15,23,42,0.04)" },
};



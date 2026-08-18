"use client";

import { ShieldCheck, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useNGOTransactions } from "@/hooks/useNGOTransactions";
import { useNGOAuditFlags } from "@/hooks/useNGOAuditFlags";

interface ComplianceMetric {
  label: string;
  score: number;
  color: string;
}

export default function NGOComplianceScore() {
  const { transactions } = useNGOTransactions();
  const { flags } = useNGOAuditFlags();

  const completed = transactions.filter((t) => t.status === "COMPLETED").length;
  const total = transactions.length || 1;
  const evidenceCoverage = Math.round((completed / total) * 100);

  const resolvedFlags = flags.filter((f) => f.status === "RESOLVED").length;
  const flagResolutionRate = flags.length > 0 ? Math.round((resolvedFlags / flags.length) * 100) : 100;

  const recentMonths = 3;
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth() - recentMonths, 1);
  const recentTxns = transactions.filter((t) => new Date(t.date) >= cutoff);
  const onTimeTxns = recentTxns.filter((t) => t.evidenceCount > 0 || t.status === "COMPLETED");
  const timelinessRate = recentTxns.length > 0 ? Math.round((onTimeTxns.length / recentTxns.length) * 100) : 0;

  const openFlags = flags.filter((f) => f.status === "OPEN").length;
  const flagHealthScore = Math.max(0, 100 - (openFlags * 15));

  const metrics: ComplianceMetric[] = [
    { label: "Evidence Coverage", score: evidenceCoverage, color: "#1e3a8a" },
    { label: "Timely Submissions", score: timelinessRate, color: "#2563eb" },
    { label: "Flag Resolution", score: flagResolutionRate, color: "#15803d" },
    { label: "Flag Health", score: flagHealthScore, color: "#475569" },
  ];

  const overall = Math.round(metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length);
  const status = overall >= 90 ? "Excellent" : overall >= 75 ? "Good" : overall >= 60 ? "Fair" : "Needs Attention";
  const statusColor = overall >= 90 ? "#15803d" : overall >= 75 ? "#2563eb" : overall >= 60 ? "#d97706" : "#dc2626";

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1e3a8a" }}>
            <ShieldCheck size={16} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Compliance Score</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>Overall audit readiness</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1 }}>{overall}%</p>
          <span style={{ fontSize: 12, fontWeight: 600, color: statusColor }}>{status}</span>
        </div>
      </div>

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {metrics.map((item) => (
          <div key={item.label}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{item.score}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 4, background: "#f1f5f9", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${item.score}%`, background: item.color, borderRadius: 4, transition: "width 0.4s ease" }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
        {overall >= 75
          ? <CheckCircle2 size={13} style={{ color: "#15803d", flexShrink: 0 }} />
          : <AlertTriangle size={13} style={{ color: "#d97706", flexShrink: 0 }} />}
        <span style={{ fontSize: 12, color: "#64748b" }}>
          {overall >= 75 ? "Audit-ready. Keep maintaining evidence standards." : "Some areas need attention before next audit."}
        </span>
        <TrendingUp size={12} style={{ color: "#94a3b8", marginLeft: "auto", flexShrink: 0 }} />
      </div>
    </div>
  );
}

"use client";

import { Flag, Clock, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import type { NGOTransaction, NGOFlag } from "@/types/ngo";

interface Props {
  transactions: NGOTransaction[];
  flags: NGOFlag[];
  auditorName: string;
}

export default function AuditSummaryPanel({ transactions, flags, auditorName }: Props) {
  const router = useRouter();

  const myFlags       = flags.filter((f) => f.flaggedBy === auditorName);
  const openFlags     = flags.filter((f) => f.status === "OPEN");
  const pendingReview = transactions.filter((t) => t.status === "PENDING");
  const completed     = transactions.filter((t) => t.status === "COMPLETED");
  const compliancePct = transactions.length > 0
    ? Math.max(0, Math.round((completed.length / transactions.length) * 100) - openFlags.length * 8)
    : 100;

  const queueItems = [
    {
      label:  "Open Audit Flags",
      value:  openFlags.length,
      sub:    "Require resolution",
      color:  "#0f172a",
      bg:     "#f1f5f9",
      border: "#e2e8f0",
      icon:   <AlertTriangle size={15} color="#475569" />,
    },
    {
      label:  "Pending Review",
      value:  pendingReview.length,
      sub:    "No evidence attached",
      color:  "#1e3a8a",
      bg:     "rgba(30,58,138,0.06)",
      border: "rgba(30,58,138,0.18)",
      icon:   <Clock size={15} color="#1e3a8a" />,
    },
    {
      label:  "Flags I Raised",
      value:  myFlags.length,
      sub:    `${myFlags.filter((f) => f.status === "OPEN").length} still open`,
      color:  "#2563eb",
      bg:     "rgba(37,99,235,0.06)",
      border: "rgba(37,99,235,0.18)",
      icon:   <Flag size={15} color="#2563eb" />,
    },
    {
      label:  "Compliance Score",
      value:  `${compliancePct}%`,
      sub:    compliancePct >= 80 ? "Strong coverage" : "Gaps detected",
      color:  "#0f172a",
      bg:     "#f8fafc",
      border: "#e2e8f0",
      icon:   <TrendingUp size={15} color="#475569" />,
    },
  ];

  return (
    <div style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerIcon}>
          <CheckCircle2 size={15} color="#1e3a8a" />
        </div>
        <div>
          <p style={s.headerTitle}>Audit Review Queue</p>
          <p style={s.headerSub}>Your outstanding validation work</p>
        </div>
      </div>

      {/* Metrics grid */}
      <div style={s.grid}>
        {queueItems.map(({ label, value, sub, color, bg, border, icon }) => (
          <div key={label} style={{ ...s.metricCard, background: bg, border: `1px solid ${border}` }}>
            <div style={{ marginBottom: 8 }}>{icon}</div>
            <p style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1, margin: "0 0 4px" }}>{value}</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 2px", lineHeight: 1.3 }}>{label}</p>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: "0 16px 16px" }}>
        <button style={s.ctaBtn} onClick={() => router.push("/ngo-dashboard/review")}>
          <Flag size={13} /> Open Review Queue
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  card:        { background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(15,23,42,0.05)" },
  header:      { display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid #f1f5f9" },
  headerIcon:  { width: 34, height: 34, borderRadius: 9, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  headerTitle: { fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.3 },
  headerSub:   { fontSize: 11.5, color: "#94a3b8", margin: "2px 0 0" },
  grid:        { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 16 },
  metricCard:  { borderRadius: 10, padding: "12px 14px" },
  ctaBtn:      { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "10px", borderRadius: 10, background: "#0f172a", color: "#fff", fontSize: 12.5, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit" },
};

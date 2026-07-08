"use client";

import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { computeTransactionMetrics } from "@/lib/transactionMetrics";

interface Props {
  transactions: Transaction[];
  evidence: Evidence[];
}

export default function ReviewStats({ transactions, evidence }: Props) {
  const metrics = computeTransactionMetrics(transactions, evidence);

  const stats = [
    { label: "No Evidence",        value: metrics.noEvidence,             color: "#ef4444" },
    { label: "Duplicates",         value: metrics.duplicateTransactions,  color: "#f59e0b" },
    { label: "Total Transactions", value: metrics.totalTransactions,      color: "#3b82f6" },
    { label: "Evidence Files",     value: metrics.totalEvidence,          color: "#22c55e" },
    { label: "Completed %",        value: `${metrics.completedPercent}%`, color: "#7c3aed" },
  ];

  return (
    <div className="rq-stats">
      {stats.map((s) => (
        <div key={s.label} style={card}>
          <span style={{ ...dot, background: s.color }} />
          <div>
            <div style={value}>{s.value}</div>
            <div style={label}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const card: React.CSSProperties = {
  background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14,
  padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
};
const dot:   React.CSSProperties = { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 };
const value: React.CSSProperties = { fontSize: 16, fontWeight: 700, color: "#111827", lineHeight: 1.1 };
const label: React.CSSProperties = { fontSize: 12, fontWeight: 500, color: "#6b7280", marginTop: 2 };



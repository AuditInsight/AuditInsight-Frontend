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
    { label: "No Evidence", value: metrics.noEvidence, color: "#ef4444" },
    { label: "Duplicates", value: metrics.duplicateTransactions, color: "#f59e0b" },
    { label: "Total Transactions", value: metrics.totalTransactions, color: "#3b82f6" },
    { label: "Evidence Files", value: metrics.totalEvidence, color: "#22c55e" },
    { label: "Completed %", value: `${metrics.completedPercent}%`, color: "#7c3aed" },
  ];

  return (
    <div style={styles.container}>
      {stats.map((s) => (
        <div key={s.label} style={styles.card}>
          <span style={{ ...styles.dot, background: s.color }} />
          <div style={styles.textBlock}>
            <div style={styles.value}>{s.value}</div>
            <div style={styles.label}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 12,
    marginBottom: 16,
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 14,
    fontWeight: 600,
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
  },
  dot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  textBlock: { display: "flex", flexDirection: "column" },
  value: { fontSize: 16, fontWeight: 700, color: "#111827", lineHeight: 1.1 },
  label: { fontSize: 12, fontWeight: 500, color: "#6b7280", marginTop: 2 },
};

"use client";

import type { CSSProperties } from "react";
import { Transaction } from "@/types/transaction.types";

interface Props {
  data: Transaction[];
}

export default function EvidenceCompletenessTable({ data }: Props) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Transactions Missing Evidence</h3>
      {data.length === 0 ? (
        <p style={styles.empty}>All transactions have complete evidence.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Transaction</th>
              <th style={styles.th}>Counterparty</th>
              <th style={styles.th}>Amount (RWF)</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Evidence Files</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tx) => (
              <tr key={tx.id}>
                <td style={styles.td}>{tx.id}</td>
                <td style={styles.td}>{tx.counterparty}</td>
                <td style={styles.td}>{tx.amount.toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    background: tx.status === "PENDING" ? "#fef2f2" : "#dcfce7",
                    color: tx.status === "PENDING" ? "#b91c1c" : "#15803d",
                  }}>
                    {tx.status}
                  </span>
                </td>
                <td style={styles.td}>{tx.evidenceCount ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 18, color: "#111827" },
  empty: { margin: 0, fontSize: 14, color: "#64748b" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#64748b", fontWeight: 600, fontSize: 12 },
  td: { padding: "12px", borderBottom: "1px solid #f1f5f9", color: "#334155" },
  badge: { padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 },
};

"use client";

import type { CSSProperties } from "react";
import { EnrichedReviewItem } from "@/mock/reviewQueue.mock";

interface Props {
  data: EnrichedReviewItem[];
}

export default function InternalAuditFindingsTable({ data }: Props) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Internal Audit Findings</h3>
      {data.length === 0 ? (
        <p style={styles.empty}>No audit findings on record.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Finding</th>
              <th style={styles.th}>Transaction</th>
              <th style={styles.th}>Auditor Note</th>
              <th style={styles.th}>Due</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const auditorNote = row.messages.find((m) => m.role === "AUDITOR")?.message ?? "—";
              return (
                <tr key={row.id}>
                  <td style={styles.td}>{row.type}</td>
                  <td style={styles.td}>{row.transactionId}</td>
                  <td style={{ ...styles.td, maxWidth: 320 }}>{auditorNote}</td>
                  <td style={styles.td}>{row.due}</td>
                  <td style={styles.td}>{row.status}</td>
                </tr>
              );
            })}
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
  td: { padding: "12px", borderBottom: "1px solid #f1f5f9", color: "#334155", verticalAlign: "top" },
};



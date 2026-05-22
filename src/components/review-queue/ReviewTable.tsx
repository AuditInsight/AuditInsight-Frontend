"use client";

import type { CSSProperties } from "react";
import { ReviewItem } from "@/lib/reviewEngine";

interface Props {
  data: ReviewItem[];

  onRowClick?: (row: ReviewItem) => void;
}

export default function ReviewTable({ data, onRowClick }: Props) {
  return (
    <div style={styles.container}>
      <table style={styles.table}>
        {/* HEADER */}
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Transaction</th>
            <th style={styles.th}>Counterparty</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Risk</th>
            <th style={styles.th}>Due</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              style={styles.row}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f9fafb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <td style={styles.td}>{row.type}</td>
              <td style={styles.td}>{row.transactionId}</td>
              <td style={styles.td}>{row.counterparty}</td>
              <td style={styles.td}>{row.amount}</td>

              <td style={styles.td}>
                <span
                  style={{
                    ...styles.riskBadge,
                    background:
                      row.risk === "Critical"
                        ? "#fef2f2"
                        : row.risk === "Medium"
                        ? "#fffbeb"
                        : "#f0fdf4",
                    color:
                      row.risk === "Critical"
                        ? "#dc2626"
                        : row.risk === "Medium"
                        ? "#d97706"
                        : "#16a34a",
                  }}
                >
                  {row.risk}
                </span>
              </td>

              <td style={styles.td}>{row.due}</td>

              <td style={styles.td}>
                <button style={styles.statusBtn}>
                  {row.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================
   STYLES (MODERN TABLE UX)
========================= */

const styles: Record<string, CSSProperties> = {
  container: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 12,
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },

  headerRow: {
    borderBottom: "1px solid #e5e7eb",
  },

  th: {
    textAlign: "left",
    padding: "12px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "#6b7280",
  },

  row: {
    borderBottom: "1px solid #f3f4f6",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },

  td: {
    padding: "14px",
    color: "#111827",
    fontSize: 14,
  },

  riskBadge: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
  },

  statusBtn: {
    padding: "5px 10px",
    borderRadius: 8,
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
  },
};
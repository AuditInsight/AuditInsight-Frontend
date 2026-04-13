"use client";

import { Transaction } from "@/types/transaction.types";
import { evidenceData } from "@/data/evidence.data";
import { theme } from "@/styles/theme";

interface Props {
  data: Transaction[];
  onRowClick?: (transaction: Transaction) => void;
}

export const TransactionsTable = ({ data, onRowClick }: Props) => {
  return (
    <div style={wrapper}>
      <table style={table}>
        
        {/* HEADER */}
        <thead style={thead}>
          <tr>
            <th style={th}></th>
            <th style={th}>ID</th>
            <th style={th}>Date</th>
            <th style={th}>Amount</th>
            <th style={th}>Counterparty</th>
            <th style={th}>Source</th>
            <th style={th}>Evidence ↓</th>
            <th style={th}>Risk Score ↓</th>
            <th style={th}>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t) => {
            const evidences = evidenceData.filter(
              (e) => e.transactionId === t.id
            );

            const evidenceScore =
              evidences.length === 0
                ? 0
                : Math.round(
                    (evidences.filter(e => e.status === "Verified").length /
                      evidences.length) * 100
                  );

            return (
              <tr
                key={t.id}
                style={row}
                onClick={() => onRowClick?.(t)}
                
                /* ✅ FIXED HOVER */
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = theme.colors.appBackground)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td><input type="checkbox" /></td>

                {/* ID */}
                <td style={cell}>
                  🔍 #TXN{t.id}
                </td>

                <td style={cell}>{t.date}</td>

                {/* Amount */}
                <td style={{ ...cell, color: theme.colors.success, fontWeight: 600 }}>
                  ${t.amount.toLocaleString()}
                </td>

                {/* Counterparty */}
                <td style={cell}>👤 {t.counterparty}</td>

                {/* Source */}
                <td>
                  <span style={sourceBadge}>
                    {t.source === "Bank" ? "🏦" : "📊"} {t.source}
                  </span>
                </td>

                {/* Evidence */}
                <td>
                  <Bar value={evidenceScore} />
                </td>

                {/* Risk */}
                <td>
                  <Bar value={t.riskScore} risk />
                </td>

                {/* Status */}
                <td>
                  <span style={getStatusStyle(t.status)}>
                    {getStatusIcon(t.status)} {t.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};



/* 🔥 REUSABLE BAR COMPONENT */
const Bar = ({ value }: { value: number; risk?: boolean }) => {
  const color =
    value === 0
      ? theme.colors.danger
      : value < 50
      ? theme.colors.warning
      : theme.colors.success;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={bar}>
        <div
          style={{
            width: `${value}%`,
            background: color,
            height: "100%",
            borderRadius: 4,
          }}
        />
      </div>
      <span style={{ fontSize: theme.typography.xs }}>{value}%</span>
    </div>
  );
};



/* 🔥 STATUS */
const getStatusStyle = (status: string): React.CSSProperties => ({
  padding: "4px 10px",
  borderRadius: theme.radius.sm,
  fontSize: theme.typography.xs,
  fontWeight: 500,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,

  /* ✅ OPTIONAL (still ok to keep hardcoded OR themeify later) */
  background:
    status === "Flagged"
      ? theme.colors.dangerBg
      : status === "Overdue"
      ? theme.colors.warningBg
      : theme.colors.appBackground,

  color:
    status === "Flagged"
      ? theme.colors.danger
      : status === "Overdue"
      ? theme.colors.warning
      : theme.colors.primary,
});

const getStatusIcon = (status: string) => {
  if (status === "Flagged") return "⚠️";
  if (status === "Overdue") return "⏳";
  return "ℹ️";
};



/* 🎨 STYLES */

const wrapper: React.CSSProperties = {
  background: theme.colors.Surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  overflow: "hidden",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

/* ✅ FIXED */
const thead: React.CSSProperties = {
  background: theme.colors.appBackground,
};

const th: React.CSSProperties = {
  fontSize: theme.typography.sm,
  color: theme.colors.textSecondary,
  padding: "12px",
  textAlign: "left",
};

const row: React.CSSProperties = {
  borderBottom: `1px solid ${theme.colors.divider}`,
  cursor: "pointer",
};

const cell: React.CSSProperties = {
  padding: "12px",
  fontSize: theme.typography.sm,
  color: theme.colors.textPrimary,
};

const bar: React.CSSProperties = {
  width: 80,
  height: 6,
  background: theme.colors.divider,
  borderRadius: 4,
};

/* ✅ FIXED */
const sourceBadge: React.CSSProperties = {
  padding: "4px 8px",
  borderRadius: theme.radius.sm,
  background: theme.colors.appBackground,
  fontSize: theme.typography.xs,
};
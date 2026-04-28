"use client";

import { Transaction } from "@/types/transaction.types";
import { evidenceData } from "@/data/evidence.data";
import { theme } from "@/styles/theme";
import {
  Landmark,
  Wallet,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  Search,
} from "lucide-react";

interface Props {
  data: Transaction[];
  onRowClick?: (transaction: Transaction) => void;
}

export const TransactionsTable = ({ data, onRowClick }: Props) => {
  return (
    <div style={wrapper}>
      <table style={table}>
        <thead style={thead}>
          <tr>
            <th style={th}></th>
            <th style={th}>ID</th>
            <th style={th}>Date</th>
            <th style={th}>Amount</th>
            <th style={th}>Counterparty</th>
            <th style={th}>Source</th>
            <th style={th}>Evidence</th>
            <th style={th}>Risk Score</th>
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
                    (evidences.filter((e) => e.status === "Verified").length /
                      evidences.length) *
                      100
                  );

            return (
              <tr
                key={t.id}
                style={row}
                onClick={() => onRowClick?.(t)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    theme.colors.appBackground;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <td style={cell}>
                  <input type="checkbox" />
                </td>

                <td style={cell}>
                  <div style={idCell}>
                    <Search size={14} />
                    #TXN{t.id}
                  </div>
                </td>

                <td style={cell}>{t.date}</td>

                <td
                  style={{
                    ...cell,
                    color: theme.colors.success,
                    fontWeight: 600,
                  }}
                >
                  ${t.amount.toLocaleString()}
                </td>

                <td style={cell}>{t.counterparty}</td>

                <td style={cell}>
                  <span style={sourceBadge}>
                    {t.source === "BANK" ? (
                      <Landmark size={14} />
                    ) : (
                      <Wallet size={14} />
                    )}
                    {t.source}
                  </span>
                </td>

                <td style={cell}>
                  <Bar value={evidenceScore} />
                </td>

                <td style={cell}>
                  <Bar value={t.riskScore} risk />
                </td>

                <td style={cell}>
                  <span style={getStatusStyle(t.status)}>
                    {getStatusIcon(t.status)}
                    {t.status}
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

const Bar = ({
  value,
  risk,
}: {
  value: number;
  risk?: boolean;
}) => {
  const color = risk
    ? value > 70
      ? theme.colors.danger
      : value > 40
      ? theme.colors.warning
      : theme.colors.success
    : value === 0
    ? theme.colors.danger
    : value < 50
    ? theme.colors.warning
    : theme.colors.success;

  return (
    <div style={barWrapper}>
      <div style={barTrack}>
        <div
          style={{
            ...barFill,
            width: `${value}%`,
            background: color,
          }}
        />
      </div>
      <span style={barText}>{value}%</span>
    </div>
  );
};

const getStatusStyle = (
  status: string
): React.CSSProperties => {
  const isFlagged = status === "FLAGGED";
  const isPending = status === "PENDING";

  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: theme.typography.xs,
    fontWeight: 600,
    background: isFlagged
      ? theme.colors.dangerBg
      : isPending
      ? theme.colors.warningBg
      : theme.colors.successBg,
    color: isFlagged
      ? theme.colors.danger
      : isPending
      ? theme.colors.warning
      : theme.colors.success,
  };
};

const getStatusIcon = (status: string) => {
  if (status === "FLAGGED") return <AlertTriangle size={14} />;
  if (status === "PENDING") return <Clock3 size={14} />;
  return <CheckCircle2 size={14} />;
};

/* styles */

const wrapper: React.CSSProperties = {
  background: theme.colors.Surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  overflow: "auto",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
};

const thead: React.CSSProperties = {
  background: theme.colors.appBackground,
  position: "sticky",
  top: 0,
  zIndex: 2,
};

const th: React.CSSProperties = {
  padding: "14px 12px",
  fontSize: theme.typography.sm,
  color: theme.colors.textSecondary,
  textAlign: "left",
  fontWeight: 600,
  borderBottom: `1px solid ${theme.colors.divider}`,
};

const row: React.CSSProperties = {
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const cell: React.CSSProperties = {
  padding: "14px 12px",
  fontSize: theme.typography.sm,
  color: theme.colors.textPrimary,
  borderBottom: `1px solid ${theme.colors.divider}`,
};

const idCell: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const sourceBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 10px",
  borderRadius: 999,
  background: theme.colors.appBackground,
  fontSize: theme.typography.xs,
};

const barWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const barTrack: React.CSSProperties = {
  width: 90,
  height: 8,
  background: theme.colors.divider,
  borderRadius: 999,
  overflow: "hidden",
};

const barFill: React.CSSProperties = {
  height: "100%",
  borderRadius: 999,
  transition: "width 0.35s ease",
};

const barText: React.CSSProperties = {
  fontSize: theme.typography.xs,
  color: theme.colors.textSecondary,
};
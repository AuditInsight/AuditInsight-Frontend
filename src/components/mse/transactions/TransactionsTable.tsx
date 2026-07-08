"use client";

import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";
import { TransactionActions } from "./TransactionActions";
import { Paperclip } from "lucide-react";

interface Props {
  data: Transaction[];
  evidences?: Evidence[];
  onRowClick: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  highlightId?: string;
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  COMPLETED: { bg: "#dcfce7", color: "#15803d" },
  PENDING: { bg: "#fef3c7", color: "#d97706" },
};

export const TransactionsTable = ({
  data,
  evidences = [],
  onRowClick,
  onEdit,
  onDelete,
  highlightId,
}: Props) => {
  return (
    <table style={table}>
      <thead>
        <tr style={headerRow}>
          <th style={th}>Transaction ID</th>
          <th style={th}>Date</th>
          <th style={th}>Amount</th>
          <th style={th}>Counterparty</th>
          <th style={th}>Status</th>
          <th style={th}>Evidence</th>
          <th style={th}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((t) => {
          const isHighlighted = highlightId === String(t.id);
          const count = t.evidenceCount ?? evidences.filter((e) => e.transactionId === t.id).length;
          const statusStyle = STATUS_STYLE[t.status] ?? STATUS_STYLE.PENDING;

          return (
            <tr
              key={t.id}
              onClick={() => onRowClick(t)}
              style={{
                ...row,
                background: isHighlighted ? "rgba(59,130,246,0.15)" : "transparent",
                cursor: "pointer",
              }}
            >
              <td style={{ ...td, fontFamily: "monospace", fontWeight: 600 }}>{t.id}</td>
              <td style={td}>{t.date}</td>
              <td style={td}>RWF {t.amount.toLocaleString()}</td>
              <td style={td}>{t.counterparty}</td>
              <td style={td}>
                <span style={{
                  padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: statusStyle.bg, color: statusStyle.color,
                }}>
                  {t.status}
                </span>
              </td>
              <td style={td}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, color: count > 0 ? "#15803d" : "#94a3b8" }}>
                  <Paperclip size={13} />
                  {count} {count === 1 ? "file" : "files"}
                </span>
              </td>
              <td style={td} onClick={(e) => e.stopPropagation()}>
                <TransactionActions
                  transaction={t}
                  onView={onRowClick}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse" };
const headerRow: React.CSSProperties = { borderBottom: `1px solid ${theme.colors.border}`, textAlign: "left" };
const th: React.CSSProperties = { padding: "12px 16px", fontSize: 13, fontWeight: 600, color: theme.colors.textMuted };
const row: React.CSSProperties = { borderBottom: "1px solid #eee" };
const td: React.CSSProperties = { padding: "12px 16px", fontSize: 14 };



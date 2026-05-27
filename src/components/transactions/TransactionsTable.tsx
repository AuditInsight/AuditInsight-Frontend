"use client";

import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";
import { TransactionActions } from "./TransactionActions";

interface Props {
  data: Transaction[];
  evidences?: Evidence[];
  onRowClick: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  highlightId?: number;
}

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
          const isHighlighted = highlightId === t.id;

          const transactionEvidence = evidences.filter(
            (e) => Number(e.transactionId) === Number(t.id)
          );

          return (
            <tr
              key={t.id}
              onClick={() => onRowClick(t)}
              style={{
                ...row,
                background: isHighlighted
                  ? "rgba(59,130,246,0.15)"
                  : "transparent",
                cursor: "pointer",
              }}
            >
              <td style={td}>{t.id}</td>
              <td style={td}>{t.date}</td>
              <td style={td}>{t.amount.toLocaleString()}</td>
              <td style={td}>{t.counterparty}</td>
              <td style={td}>{t.status}</td>
              <td style={td}>{transactionEvidence.length} docs</td>
              <td style={td}>
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

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const headerRow: React.CSSProperties = {
  borderBottom: `1px solid ${theme.colors.border}`,
  textAlign: "left",
};

const th: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 13,
  fontWeight: 600,
  color: theme.colors.textMuted,
};

const row: React.CSSProperties = {
  borderBottom: "1px solid #eee",
};

const td: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 14,
};

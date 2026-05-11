"use client";

import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";

interface Props {
  data: Transaction[];
  evidences?: Evidence[];
  onRowClick: (transaction: Transaction) => void;
  highlightId?: number;
}

export const TransactionsTable = ({
  data,
  evidences = [],
  onRowClick,
  highlightId,
}: Props) => {
  return (
    <table style={table}>
      {/* =========================
          HEADER ROW (FIXED)
      ========================= */}
      <thead>
        <tr style={headerRow}>
          <th style={th}>Transaction ID</th>
          <th style={th}>Date</th>
          <th style={th}>Amount</th>
          <th style={th}>Counterparty</th>
          <th style={th}>Status</th>
          <th style={th}>Evidence</th>
        </tr>
      </thead>

      {/* =========================
          BODY
      ========================= */}
      <tbody>
        {data.map((t) => {
          const isHighlighted = highlightId === t.id;

          // ✅ FIXED SAFE LINK
          const transactionEvidence = evidences.filter(
            (e) =>
              Number(e.transactionId) === Number(t.id)
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
              <td style={td}>{t.amount}</td>
              <td style={td}>{t.counterparty}</td>
              <td style={td}>{t.status}</td>

              {/* Evidence column */}
              <td style={td}>
                {transactionEvidence.length} docs
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

/* =========================
   STYLES
========================= */

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
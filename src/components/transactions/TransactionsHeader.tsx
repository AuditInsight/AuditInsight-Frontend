"use client";

import { Transaction } from "@/types/transaction.types";

interface Props {
  data: Transaction[];
  onRowClick: (transaction: Transaction) => void;
  highlightId?: number;
}

export const TransactionsTable = ({
  data,
  onRowClick,
  highlightId,
}: Props) => {
  return (
    <table style={table}>
      <tbody>
        {data.map((t) => {
          const isHighlighted = highlightId === t.id;

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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

/* styles */
const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const row: React.CSSProperties = {
  borderBottom: "1px solid #eee",
};

const td: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 14,
};
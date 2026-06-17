"use client";

import { Transaction } from "@/types/transaction.types";

interface Props {
  transaction: Transaction;
}

const evidenceStatusWidth: Record<string, number> = {
  COMPLETE: 100,
  PARTIAL: 50,
  MISSING: 5,
};

const evidenceStatusColor: Record<string, string> = {
  COMPLETE: "#22c55e",
  PARTIAL: "#f59e0b",
  MISSING: "#ef4444",
};

export const TransactionRow = ({ transaction }: Props) => {
  const evWidth = evidenceStatusWidth[transaction.evidenceStatus ?? "MISSING"] ?? 5;
  const evColor = evidenceStatusColor[transaction.evidenceStatus ?? "MISSING"] ?? "#ef4444";
  const riskWidth = transaction.riskScore ?? 0;

  return (
    <tr style={row}>
      <td>#{transaction.id}</td>
      <td>{transaction.date}</td>
      <td>${transaction.amount}</td>
      <td>{transaction.counterparty ?? transaction.name ?? "—"}</td>
      <td>{transaction.type}</td>

      {/* RISK */}
      <td>
        <div style={bar}>
          <div
            style={{
              width: `${riskWidth}%`,
              background: "#f59e0b",
              height: "100%",
              borderRadius: 4,
            }}
          />
        </div>
      </td>

      {/* EVIDENCE */}
      <td>
        <div style={bar}>
          <div
            style={{
              width: `${evWidth}%`,
              background: evColor,
              height: "100%",
              borderRadius: 4,
            }}
          />
        </div>
      </td>

      {/* STATUS */}
      <td>{transaction.status}</td>
    </tr>
  );
};

const row: React.CSSProperties = {
  borderBottom: "1px solid #e5e7eb",
};

const bar: React.CSSProperties = {
  width: 80,
  height: 6,
  background: "#e5e7eb",
  borderRadius: 4,
};

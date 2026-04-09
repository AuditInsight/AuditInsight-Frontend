"use client";

import { evidenceData } from "@/data/evidence.data";
import { Transaction } from "@/types/transaction.types";

interface Props {
  transaction: Transaction;
}

export const TransactionRow = ({ transaction }: Props) => {
  
  const evidences = evidenceData.filter(
    (e) => e.transactionId === transaction.id
  );

  const evidenceScore =
    evidences.length === 0
      ? 0
      : Math.round(
          (evidences.filter(e => e.status === "Verified").length /
            evidences.length) * 100
        );

  return (
    <tr style={row}>
      <td>#{transaction.id}</td>
      <td>{transaction.date}</td>
      <td>${transaction.amount}</td>
      <td>{transaction.counterparty}</td>
      <td>{transaction.type}</td>

      {/* RISK */}
      <td>
        <div style={bar}>
          <div
            style={{
              width: `${transaction.riskScore}%`,
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
              width: `${evidenceScore}%`,
              background: "#22c55e",
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

/* 🎨 STYLES */

const row: React.CSSProperties = {
  borderBottom: "1px solid #e5e7eb",
};

const bar: React.CSSProperties = {
  width: 80,
  height: 6,
  background: "#e5e7eb",
  borderRadius: 4,
};
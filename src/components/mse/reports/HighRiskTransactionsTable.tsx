"use client";

import type { CSSProperties } from "react";
import { Transaction } from "@/types/transaction.types";

interface Props {
  data: Transaction[];
}

export default function HighRiskTransactionsTable({
  data,
}: Props) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        High-Risk Transactions
      </h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Counterparty</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Evidence</th>
          </tr>
        </thead>

        <tbody>
          {data.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.counterparty}</td>
              <td>{tx.amount}</td>
              <td>{tx.status}</td>
              <td>{tx.evidenceCount ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 18,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
};
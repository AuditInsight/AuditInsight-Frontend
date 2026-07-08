"use client";

import type { CSSProperties } from "react";
import { ReviewItem } from "@/lib/reviewEngine";

interface Props {
  data: ReviewItem[];
}

export default function FraudAlertsTable({
  data,
}: Props) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        Fraud & Duplicate Alerts
      </h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Issue</th>
            <th>Transaction</th>
            <th>Risk</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.type}</td>
              <td>{row.transactionId}</td>
              <td>{row.risk}</td>
              <td>{row.status}</td>
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
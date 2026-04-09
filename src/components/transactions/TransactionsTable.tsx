"use client";

import { Transaction } from "@/types/transaction.types";
import { evidenceData } from "@/data/evidence.data";

/* ✅ FIXED PROPS */
interface Props {
  data: Transaction[];
  onRowClick?: (transaction: Transaction) => void;
}

export const TransactionsTable = ({ data, onRowClick }: Props) => {
  return (
    <div style={{ marginTop: 20 }}>
      <table style={table}>
        <thead style={thead}>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Counterparty</th>
            <th>Source</th>
            <th>Evidence</th>
            <th>Risk Score</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t) => {
            // 🔥 LINK EVIDENCE → TRANSACTION
            const evidences = evidenceData.filter(
              (e) => e.transactionId === t.id
            );

            // 🔥 CALCULATE SCORE
            const evidenceScore =
              evidences.length === 0
                ? 0
                : Math.round(
                    (evidences.filter(
                      (e) => e.status === "Verified"
                    ).length /
                      evidences.length) *
                      100
                  );

            // 🔥 FLAGS (INJECTED — no UI change yet)
            const flags: string[] = [];

            if (evidences.length === 0) {
              flags.push("No evidence attached");
            }

            if (t.riskScore > 70) {
              flags.push("High risk transaction");
            }

            if (evidenceScore < 50 && evidences.length > 0) {
              flags.push("Weak evidence support");
            }

            return (
              <tr
                key={t.id}
                style={{
                  ...row,
                  cursor: "pointer",
                  background:
                    evidenceScore === 0
                      ? "#fff1f2"
                      : t.riskScore > 70
                      ? "#fff7ed"
                      : "#f0fdf4",
                }}
                onClick={() => onRowClick?.(t)}
              >
                <td>{t.id}</td>
                <td>{t.date}</td>
                <td>${t.amount}</td>
                <td>{t.counterparty}</td>
                <td>{t.source}</td>

                {/* 🔥 SMART EVIDENCE BAR */}
                <td>
                  <div style={bar}>
                    <div
                      style={{
                        width: `${evidenceScore}%`,
                        background:
                          evidenceScore === 0
                            ? "#ef4444"
                            : evidenceScore < 50
                            ? "#f59e0b"
                            : "#22c55e",
                        height: "100%",
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </td>

                {/* 🔥 SMART RISK BAR */}
                <td>
                  <div style={bar}>
                    <div
                      style={{
                        width: `${t.riskScore}%`,
                        background:
                          t.riskScore > 70
                            ? "#ef4444"
                            : t.riskScore > 40
                            ? "#f59e0b"
                            : "#22c55e",
                        height: "100%",
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </td>

                <td>{t.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/* 🎨 styles */
const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thead: React.CSSProperties = {
  textAlign: "left",
  borderBottom: "2px solid #e5e7eb",
};

const row: React.CSSProperties = {
  borderBottom: "1px solid #f1f5f9",
};

const bar: React.CSSProperties = {
  width: 80,
  height: 6,
  background: "#e5e7eb",
  borderRadius: 4,
};
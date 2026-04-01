import React from "react";

/*
🧠 This component displays summary cards at the top of the dashboard

It answers:
👉 What is happening today?
👉 Are we safe?
👉 Where is the risk?

We use simple data (numbers) passed as props
*/

// 👉 Define the shape (type) of the data we expect
type TransactionsStatsProps = {
  totalTransactions: number;      // number → counts transactions
  newTransactions: number;        // number → today's new ones

  verifiedPercentage: number;     // number → percentage (0 - 100)
  missingEvidence: number;        // number → count of missing docs

  flaggedRisks: number;           // number → total risks
  highRiskCount: number;          // number → high risk items

  overdueApprovals: number;       // number → approvals delayed
  overdueDays: number;            // number → how many days overdue
};

/*
🧠 Functional Component

👉 Receives data
👉 Displays UI
*/
const TransactionsStats: React.FC<TransactionsStatsProps> = ({
  totalTransactions,
  newTransactions,
  verifiedPercentage,
  missingEvidence,
  flaggedRisks,
  highRiskCount,
  overdueApprovals,
  overdueDays,
}) => {
  return (
    <div style={styles.container}>
      
      {/* ================= CARD 1 ================= */}
      <div style={styles.card}>
        <h2>{totalTransactions.toLocaleString()}</h2>
        <p>Transactions Today</p>

        <span style={styles.successText}>
          ↑ {newTransactions} New
        </span>
      </div>

      {/* ================= CARD 2 ================= */}
      <div style={styles.card}>
        <h2>{verifiedPercentage}%</h2>
        <p>Verified Evidence</p>

        {/* 🧠 Simple progress bar */}
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${verifiedPercentage}%`, // dynamic width
            }}
          />
        </div>

        <span>{missingEvidence} Missing</span>
      </div>

      {/* ================= CARD 3 ================= */}
      <div style={styles.card}>
        <h2>{flaggedRisks}</h2>
        <p>Flagged Risks</p>

        <span style={styles.warningText}>
          ⚠ {highRiskCount} High Risk
        </span>
      </div>

      {/* ================= CARD 4 ================= */}
      <div style={styles.card}>
        <h2>{overdueApprovals}</h2>
        <p>Past Due Approvals</p>

        <span style={styles.dangerText}>
          ⏳ {overdueDays} Overdue &gt; 3 Days
        </span>
      </div>

    </div>
  );
};

export default TransactionsStats;

/*
🧠 STYLES (Simple inline styling)

👉 container → holds all cards
👉 card → each box
👉 colors show meaning:
   green = good
   orange = warning
   red = danger
*/

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)", // 4 equal cards
    gap: "16px",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },

  progressBar: {
    width: "100%",
    height: "8px",
    background: "#eee",
    borderRadius: "4px",
    margin: "8px 0",
  },

  progressFill: {
    height: "100%",
    background: "#22c55e", // green
    borderRadius: "4px",
  },

  successText: {
    color: "#16a34a",
    fontSize: "12px",
  },

  warningText: {
    color: "#f59e0b",
    fontSize: "12px",
  },

  dangerText: {
    color: "#ef4444",
    fontSize: "12px",
  },
};
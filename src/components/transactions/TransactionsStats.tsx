"use client";

import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";

/* 🔥 PROPS */
interface Props {
  transactions: Transaction[];
  evidences: Evidence[];
}

export const TransactionsStats = ({ transactions, evidences }: Props) => {
  const total = transactions.length;

  const verified = evidences.filter(
    (e: Evidence) => e.status === "Verified"
  ).length;

  const missing = evidences.filter(
    (e: Evidence) => e.status === "Missing"
  ).length;

  const flagged = transactions.filter(
    (t: Transaction) => t.riskScore > 70
  ).length;

  const overdue = transactions.filter(
    (t: Transaction) => t.status === "Overdue"
  ).length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <Card title="Transactions Today" value={total} sub="+219 New" />

      <Card
        title="Verified Evidence"
        value="95.6%"
        sub={`${missing} Missing`}
        color="green"
      />

      <Card
        title="Flagged Risks"
        value={flagged}
        sub="High Risk"
        color="orange"
      />

      <Card
        title="Past Due Approvals"
        value={overdue}
        sub="> 3 Days"
        color="red"
      />
    </div>
  );
};

/* 🔥 CARD TYPES */
interface CardProps {
  title: string;
  value: string | number;
  sub: string;
  color?: "green" | "orange" | "red";
}

const Card = ({ title, value, sub }: CardProps) => (
  <div
    style={{
      padding: 16,
      borderRadius: 10,
      background: "#fff",
      border: "1px solid #e5e7eb",
    }}
  >
    <div style={{ fontSize: 13, color: "#64748b" }}>{title}</div>
    <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
    <div style={{ fontSize: 12, color: "#64748b" }}>{sub}</div>
  </div>
);
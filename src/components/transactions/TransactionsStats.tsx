"use client";

import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";

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
    (t: Transaction) => t.status === "FLAGGED"
  ).length;

  return (
    <div style={container}>
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

const Card = ({ title, value, sub, color }: CardProps) => {
  const accent =
    color === "green"
      ? theme.colors.success
      : color === "orange"
      ? theme.colors.warning
      : color === "red"
      ? theme.colors.danger
      : theme.colors.primary;

  const accentBg =
    color === "green"
      ? theme.colors.successBg
      : color === "orange"
      ? theme.colors.warningBg
      : color === "red"
      ? theme.colors.dangerBg
      : theme.colors.appBackground;

  return (
    <div
      style={{
        padding: theme.spacing.md,
        borderRadius: theme.radius.lg,

        /* ✅ YOUR FIX (CORRECT) */
        background: theme.colors.Surface,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.sm,

        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.xs,

        /* ✅ FINAL POLISH */
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* TITLE */}
      <div
        style={{
          fontSize: theme.typography.sm,
          color: theme.colors.textSecondary,
        }}
      >
        {title}
      </div>

      {/* VALUE */}
      <div
        style={{
          fontSize: theme.typography.xl,
          fontWeight: 700,
          color: theme.colors.textPrimary,
        }}
      >
        {value}
      </div>

      {/* SUB TEXT */}
      <div
        style={{
          fontSize: theme.typography.xs,
          color: theme.colors.textMuted,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            padding: "2px 6px",
            borderRadius: theme.radius.sm,
            background: accentBg,
            color: accent,
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          ●
        </span>

        {sub}
      </div>
    </div>
  );
};

/* 🎨 GRID CONTAINER */
const container: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: theme.spacing.sm,
  marginBottom: theme.spacing.lg,

  /* ✅ OPTIONAL GLOBAL FONT (even better) */
  fontFamily: theme.typography.fontFamily,
};
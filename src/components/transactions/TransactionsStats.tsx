"use client";

import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";
import {
  Receipt,
  ShieldCheck,
  AlertTriangle,
  Clock3,
} from "lucide-react";

interface Props {
  transactions: Transaction[];
  evidences: Evidence[];
}

export const TransactionsStats = ({
  transactions,
  evidences,
}: Props) => {
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
      <Card
        title="Transactions Today"
        value={total}
        sub="+219 New"
        icon={<Receipt size={18} />}
      />

      <Card
        title="Verified Evidence"
        value={`${verified}`}
        sub={`${missing} Missing`}
        color="green"
        icon={<ShieldCheck size={18} />}
      />

      <Card
        title="Flagged Risks"
        value={flagged}
        sub="High Risk"
        color="orange"
        icon={<AlertTriangle size={18} />}
      />

      <Card
        title="Past Due Approvals"
        value={overdue}
        sub="> 3 Days"
        color="red"
        icon={<Clock3 size={18} />}
      />
    </div>
  );
};

interface CardProps {
  title: string;
  value: string | number;
  sub: string;
  color?: "green" | "orange" | "red";
  icon: React.ReactNode;
}

const Card = ({
  title,
  value,
  sub,
  color,
  icon,
}: CardProps) => {
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
        background: theme.colors.Surface,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.sm,
        transition: "all 0.25s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 14px 30px rgba(37,99,235,0.10)";
        e.currentTarget.style.borderColor = accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 8px 24px rgba(15,23,42,0.06)";
        e.currentTarget.style.borderColor = theme.colors.border;
      }}
    >
      <div style={topRow}>
        <div
          style={{
            ...iconWrapper,
            background: accentBg,
            color: accent,
          }}
        >
          {icon}
        </div>

        <div style={titleStyle}>{title}</div>
      </div>

      <div style={valueStyle}>{value}</div>

      <div style={subStyle}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: accent,
          }}
        />
        {sub}
      </div>
    </div>
  );
};

const container: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: theme.spacing.md,
  marginBottom: theme.spacing.lg,
  fontFamily: theme.typography.fontFamily,
};

const topRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const iconWrapper: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: theme.typography.sm,
  color: theme.colors.textSecondary,
};

const valueStyle: React.CSSProperties = {
  fontSize: theme.typography.xl,
  fontWeight: 700,
  color: theme.colors.textPrimary,
};

const subStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: theme.typography.xs,
  color: theme.colors.textMuted,
};
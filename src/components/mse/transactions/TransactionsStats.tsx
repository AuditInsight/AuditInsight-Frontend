"use client";

import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";
import { computeTransactionStats } from "@/lib/transactionStats";
import { Briefcase, Copy, FolderOpen, XCircle } from "lucide-react";

interface Props {
  transactions: Transaction[];
  evidences: Evidence[];
}

export const TransactionsStats = ({ transactions, evidences }: Props) => {
  const stats = computeTransactionStats(transactions, evidences);

  return (
    <>
      <style>{`
        .txn-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 1024px) { .txn-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .txn-stats-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div className="txn-stats-grid">
        <StatCard title="No Evidence"           value={stats.noEvidence}           sub={`${stats.pending} pending`}          color="red"    icon={<XCircle size={18} />}    />
        <StatCard title="Duplicate Transactions" value={stats.duplicateTransactions} sub="Same amount & counterparty"          color="orange" icon={<Copy size={18} />}       />
        <StatCard title="Total Transactions"     value={stats.totalTransactions}     sub={`${stats.completed} completed`}     icon={<Briefcase size={18} />} />
        <StatCard title="Evidence Files"         value={stats.totalEvidence}         sub={`${stats.completedPercent}% complete`} color="green" icon={<FolderOpen size={18} />} />
      </div>
    </>
  );
};

interface CardProps {
  title: string;
  value: string | number;
  sub: string;
  color?: "green" | "orange" | "red";
  icon: React.ReactNode;
}

const StatCard = ({ title, value, sub, color, icon }: CardProps) => {
  const accent =
    color === "green"  ? theme.colors.success  :
    color === "orange" ? theme.colors.warning  :
    color === "red"    ? theme.colors.danger   : theme.colors.primary;

  const accentBg =
    color === "green"  ? theme.colors.successBg :
    color === "orange" ? theme.colors.warningBg :
    color === "red"    ? theme.colors.dangerBg  : theme.colors.appBackground;

  return (
    <div style={{
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      background: theme.colors.Surface,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
      display: "flex", flexDirection: "column", gap: theme.spacing.sm,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: accentBg, color: accent }}>
          {icon}
        </div>
        <div style={{ fontSize: theme.typography.sm, color: theme.colors.textSecondary }}>{title}</div>
      </div>
      <div style={{ fontSize: theme.typography.xl, fontWeight: 700, color: theme.colors.textPrimary }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: theme.typography.xs, color: theme.colors.textMuted }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0 }} />
        {sub}
      </div>
    </div>
  );
};



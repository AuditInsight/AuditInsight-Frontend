"use client";

import { useState } from "react";
import { TransactionDetailsModal } from "@/components/transactions/modals/TransactionDetailsModal";
import { transactionsData } from "@/data/transactions.data";
import { evidenceData } from "@/data/evidence.data";
import { Evidence } from "@/types/evidence.types";
import { EvidenceRow } from "./EvidenceRow";
import { Transaction } from "@/types/transaction.types";
import { theme } from "@/styles/theme";

interface Props {
  data: Evidence[];
}

export const statusStyles = {
  Verified: {
    background: theme.colors.successSoft,
    color: theme.colors.success,
  },

  Pending: {
    background: theme.colors.warningSoft,
    color: theme.colors.warning,
  },

  Missing: {
    background: theme.colors.dangerSoft,
    color: theme.colors.danger,
  },
};

export const rowStyle: React.CSSProperties = {
  transition: "all 0.18s ease",
};

export const rowHoverStyles = {
  background: "#fff",

  transform: "scale(1.002)",

  boxShadow: `
    inset 0 1px 0 rgba(255,255,255,0.8),
    0 8px 20px rgba(15,23,42,0.05)
  `,
};

export const EvidenceTable = ({ data }: Props) => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (id: number) => {
    const txn =
      transactionsData.find((t) => t.id === id) || null;

    setSelectedTransaction(txn);

    setIsOpen(true);
  };

  return (
    <>
      <div style={wrapper}>
        <table style={table}>
          {/* 🔹 HEADER */}
          <thead style={thead}>
            <tr>
              <th style={th}>Document</th>
              <th style={th}>Category</th>
              <th style={th}>Amount</th>
              <th style={th}>Date</th>
              <th style={th}>Linked Transaction</th>
              <th style={th}>Verification</th>
              <th style={th}>AI Flags</th>
            </tr>
          </thead>

          {/* 🔹 BODY */}
          <tbody>
            {data.map((e) => (
              <EvidenceRow
                key={e.id}
                evidence={e}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      <TransactionDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        transaction={selectedTransaction}
        evidences={
          selectedTransaction
            ? evidenceData.filter(
                (e) =>
                  e.transactionId ===
                  selectedTransaction.id
              )
            : []
        }
      />
    </>
  );
};

/* =========================
   🎨 STYLES
========================= */

const wrapper: React.CSSProperties = {
  overflowX: "auto",

  marginTop: 16,

  background: `
    linear-gradient(
      180deg,
      rgba(255,255,255,0.96),
      rgba(255,255,255,0.92)
    )
  `,

  borderRadius: theme.radius.lg,

  border: `1px solid ${theme.colors.border}`,

  backdropFilter: "blur(18px)",

  boxShadow: `
    0 10px 30px rgba(15,23,42,0.04)
  `,
};

const table: React.CSSProperties = {
  width: "100%",

  borderCollapse: "separate",

  borderSpacing: 0,
};

const thead: React.CSSProperties = {
  position: "sticky",

  top: 0,

  zIndex: 3,

  background: `
    linear-gradient(
      180deg,
      rgba(248,250,252,0.95),
      rgba(241,245,249,0.92)
    )
  `,

  backdropFilter: "blur(12px)",

  borderBottom: `
    1px solid ${theme.colors.border}
  `,
};

const th: React.CSSProperties = {
  textAlign: "left",

  padding: "14px 18px",

  fontSize: theme.typography.sm,

  fontWeight: 700,

  color: theme.colors.textSecondary,

  letterSpacing: "-0.01em",

  whiteSpace: "nowrap",

  borderBottom: `
    1px solid ${theme.colors.border}
  `,
};
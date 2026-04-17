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
                onOpenTransaction={handleOpen}
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
                (e) => e.transactionId === selectedTransaction.id
              )
            : []
        }
      />
    </>
  );
};

/* 🎨 STYLES */

const wrapper: React.CSSProperties = {
  overflowX: "auto",
  marginTop: 16,
  background: theme.colors.Surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thead: React.CSSProperties = {
  background: theme.colors.appBackground,
  borderBottom: `1px solid ${theme.colors.border}`,
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 16px",
  fontSize: theme.typography.sm,
  fontWeight: 600,
  color: theme.colors.textSecondary,
};
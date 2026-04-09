"use client";

import { useState, useMemo } from "react";
import { TransactionsStats } from "@/components/transactions/TransactionsStats";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionsPagination } from "@/components/transactions/TransactionsPagination";
import { TransactionDetailsModal } from "@/components/transactions/modals/TransactionDetailsModal";

import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";
import { theme } from "@/styles/theme";

import { transactionsData } from "@/data/transactions.data";
import { evidenceData } from "@/data/evidence.data";
import { Transaction } from "@/types/transaction.types";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const pageSize = 25;

  // ✅ FILTER (UNCHANGED)
  const filteredData = useMemo(() => {
    return transactionsData.filter((t) => {
      if (
        search &&
        !t.counterparty.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [search]);

  // ✅ PAGINATION (UNCHANGED)
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // ✅ MODAL HANDLER (UNCHANGED)
  const handleOpen = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsOpen(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.lg,
      }}
    >
      {/* 🔥 STATS */}
      <TransactionsStats
        transactions={transactionsData}
        evidences={evidenceData}
      />

      {/* 🔥 TOOLBAR (REPLACES FILTERS) */}
      <PageToolbar
        title="Transactions"
        filters={["03/01/2026 → 03/30/2026"]}
        showSearch
        primaryActionLabel="Add Transaction"
      />

      {/* 🔥 TABLE */}
      <TransactionsTable
        data={paginatedData}
        onRowClick={handleOpen}
      />

      {/* 🔥 PAGINATION */}
      <TransactionsPagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />

      {/* 🔥 FOOTER */}
      <div
        style={{
          fontSize: theme.typography.sm,
          color: theme.colors.textMuted,
        }}
      >
        Showing {(page - 1) * pageSize + 1}–
        {Math.min(page * pageSize, filteredData.length)} of{" "}
        {filteredData.length.toLocaleString()} transactions
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
    </div>
  );
}
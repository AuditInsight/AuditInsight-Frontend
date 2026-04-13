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
  /* ✅ NEW STATE */
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const pageSize = 25;

  /* ✅ UPGRADED FILTER LOGIC */
  const filteredData = useMemo(() => {
    return transactionsData.filter((t) => {
      // 🔍 SEARCH
      if (
        search &&
        !t.counterparty.toLowerCase().includes(search.toLowerCase())
      ) return false;

      // 📅 DATE FILTER
      if (startDate && new Date(t.date) < new Date(startDate)) return false;
      if (endDate && new Date(t.date) > new Date(endDate)) return false;

      return true;
    });
  }, [search, startDate, endDate]);

  /* ✅ PAGINATION */
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* ✅ ACTIONS */
  const handleReset = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleExport = () => {
    const csv = filteredData.map(
      (t) =>
        `${t.id},${t.date},${t.amount},${t.counterparty},${t.status}`
    );

    const blob = new Blob([csv.join("\n")], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  const handleAdd = () => {
    alert("Open Add Transaction Modal"); // 🔥 replace later
  };

  /* ✅ MODAL HANDLER */
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

        /* ✅ GLOBAL APP STYLING */
        background: theme.colors.appBackground,
        padding: theme.spacing.lg,
        minHeight: "100vh",
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* 🔥 STATS */}
      <TransactionsStats
        transactions={transactionsData}
        evidences={evidenceData}
      />

      {/* 🔥 TOOLBAR (NOW FULLY FUNCTIONAL) */}
      <PageToolbar
        title="Transactions"
        showSearch
        primaryActionLabel="Add Transaction"

        search={search}
        setSearch={setSearch}

        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}

        onReset={handleReset}
        onExport={handleExport}
        onAdd={handleAdd}
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
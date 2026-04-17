"use client";

import { useState, useMemo } from "react";
import { TransactionsStats } from "@/components/transactions/TransactionsStats";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionsPagination } from "@/components/transactions/TransactionsPagination";
import { TransactionDetailsModal } from "@/components/transactions/modals/TransactionDetailsModal";
import { AddTransactionModal } from "@/components/transactions/modals/AddTransactionModal";

import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";
import { theme } from "@/styles/theme";

import { transactionsData } from "@/data/transactions.data";
import { evidenceData } from "@/data/evidence.data";
import { Transaction } from "@/types/transaction.types";

import { createTransaction } from "@/utils/api";

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(transactionsData);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const pageSize = 25;

  /* 🔍 FILTER */
  const filteredData = useMemo(() => {
    return transactions.filter((t) => {
      if (
        search &&
        !t.counterparty.toLowerCase().includes(search.toLowerCase())
      )
        return false;

      if (startDate && new Date(t.date) < new Date(startDate)) return false;
      if (endDate && new Date(t.date) > new Date(endDate)) return false;

      return true;
    });
  }, [transactions, search, startDate, endDate]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  /* 🔄 RESET */
  const handleReset = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  /* 📤 EXPORT */
  const handleExport = () => {
    const csv = filteredData.map(
      (t) => `${t.id},${t.date},${t.amount},${t.counterparty},${t.status}`,
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
    setIsAddModalOpen(true);
  };

  /* 🚀 CREATE TRANSACTION (FIXED) */
  const handleCreateTransaction = async (data: Omit<Transaction, "id">) => {
  try {
    const res = await createTransaction(data);

    const newTransaction: Transaction = {
      id: res.data.id ?? Date.now(),
      date: res.data.date,
      amount: res.data.amount,
      counterparty: res.data.counterparty,
      type: res.data.type,
      source: res.data.source,
      status: res.data.status,
      riskScore: res.data.riskScore,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setIsAddModalOpen(false);
  } catch (error) {
    console.error("Failed to create transaction:", error);
  }
};

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
        background: theme.colors.appBackground,
        padding: theme.spacing.lg,
        minHeight: "100vh",
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* STATS */}
      <TransactionsStats transactions={transactions} evidences={evidenceData} />

      {/* TOOLBAR */}
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

      {/* TABLE */}
      <TransactionsTable data={paginatedData} onRowClick={handleOpen} />

      {/* PAGINATION */}
      <TransactionsPagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />

      {/* FOOTER */}
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

      {/* MODALS */}
      <TransactionDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        transaction={selectedTransaction}
        evidences={
          selectedTransaction
            ? evidenceData.filter(
                (e) => e.transactionId === selectedTransaction.id,
              )
            : []
        }
      />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTransaction}
      />
    </div>
  );
}

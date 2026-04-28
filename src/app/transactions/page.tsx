"use client";

import { useState, useMemo, useEffect } from "react";
import { TransactionsStats } from "@/components/transactions/TransactionsStats";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionsPagination } from "@/components/transactions/TransactionsPagination";
import { TransactionDetailsModal } from "@/components/transactions/modals/TransactionDetailsModal";
import { AddTransactionModal } from "@/components/transactions/modals/AddTransactionModal";
import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";

import { theme } from "@/styles/theme";
import { evidenceData } from "@/data/evidence.data";
import { Transaction } from "@/types/transaction.types";
import { createTransaction, getTransactions } from "@/utils/api";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const pageSize = 25;

  // ✅ Load transactions from backend
  const loadTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

  // ✅ Fetch transactions when page loads
  useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

  fetchTransactions();
}, []);

  const filteredData = useMemo(() => {
    return transactions.filter((t) => {
      if (
        search &&
        !t.counterparty.toLowerCase().includes(search.toLowerCase())
      ) return false;

      if (startDate && new Date(t.date) < new Date(startDate)) return false;
      if (endDate && new Date(t.date) > new Date(endDate)) return false;

      return true;
    });
  }, [transactions, search, startDate, endDate]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleReset = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleExport = () => {
    const csv = filteredData.map(
      (t) => `${t.id},${t.date},${t.amount},${t.counterparty},${t.status}`
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

  // ✅ Create transaction then reload backend data
  const handleCreateTransaction = async (data: Omit<Transaction, "id">) => {
    try {
      await createTransaction(data);
      await loadTransactions();
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
    <div style={pageStyles}>
      <TransactionsStats
        transactions={transactions}
        evidences={evidenceData}
      />

      <section style={section}>
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
          onAdd={() => setIsAddModalOpen(true)}
        />

        <TransactionsTable
          data={paginatedData}
          onRowClick={handleOpen}
        />

        <div style={footer}>
          <span>
            Showing {filteredData.length === 0 ? 0 : (page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, filteredData.length)} of{" "}
            {filteredData.length.toLocaleString()} transactions
          </span>

          <TransactionsPagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </section>

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

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTransaction}
      />
    </div>
  );
}

/* styles */

const pageStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.xl,
  background: theme.colors.appBackground,
  minHeight: "100vh",
  fontFamily: theme.typography.fontFamily,
};

const section: React.CSSProperties = {
  background: "rgba(255,255,255,0.78)",
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.xl,
  padding: theme.spacing.lg,
  boxShadow: theme.shadows.md,
  ...theme.effects.glass,
};

const footer: React.CSSProperties = {
  marginTop: theme.spacing.md,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: theme.colors.textMuted,
  fontSize: theme.typography.sm,
};
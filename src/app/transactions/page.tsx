"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { TransactionsStats } from "@/components/transactions/TransactionsStats";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionsPagination } from "@/components/transactions/TransactionsPagination";
import { TransactionDetailsModal } from "@/components/transactions/modals/TransactionDetailsModal";
import { AddTransactionModal } from "@/components/transactions/modals/AddTransactionModal";
import { ConfirmDeleteModal } from "@/components/transactions/modals/ConfirmDeleteModal";
import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";

import { theme } from "@/styles/theme";
import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import {
  createTransaction,
  deleteTransaction,
  getEvidence,
  getTransactions,
  updateTransaction,
} from "@/utils/api";

function TransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const transactionId = searchParams.get("transactionId");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const pageSize = 25;

  /* =========================
     LOAD DATA
  ========================= */
  const reloadData = async () => {
    try {
      const [txRes, evRes] = await Promise.all([
        getTransactions(),
        getEvidence(),
      ]);
      setTransactions(txRes.data);
      setEvidences(evRes.data);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  /* =========================
     DERIVED: selected transaction
  ========================= */
  const selectedFromUrl = useMemo(() => {
    if (!transactionId || transactions.length === 0) return null;

    return (
      transactions.find((t) => t.id === Number(transactionId)) || null
    );
  }, [transactionId, transactions]);

  const isOpen = !!selectedFromUrl;

  useEffect(() => {
    setSelectedTransaction(selectedFromUrl);
  }, [selectedFromUrl]);

  /* =========================
     FILTERING
  ========================= */
  const filteredData = useMemo(() => {
    return transactions.filter((t) => {
      if (
        search &&
        !(t.counterparty ?? t.name ?? "").toLowerCase().includes(search.toLowerCase())
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
    page * pageSize
  );

  /* =========================
     ACTIONS
  ========================= */
  const handleOpen = (transaction: Transaction) => {
    router.push(`/transactions?transactionId=${transaction.id}`);
  };

  const handleCloseModal = () => {
    router.replace("/transactions");
    setSelectedTransaction(null);
  };

  const handleCreateTransaction = async (data: Omit<Transaction, "id">) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await createTransaction(data as any);
      await reloadData();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  const handleUpdateTransaction = async (data: Omit<Transaction, "id">) => {
    if (!editingTransaction) return;

    try {
      await updateTransaction(editingTransaction.id, data);
      await reloadData();
      setEditingTransaction(null);
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;

    setIsDeleting(true);
    try {
      await deleteTransaction(transactionToDelete.id);
      if (transactionId === String(transactionToDelete.id)) {
        handleCloseModal();
      }
      setTransactionToDelete(null);
      await reloadData();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

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

  /* =========================
     UI
  ========================= */
  return (
    <div style={pageStyles}>
      <TransactionsStats
        transactions={transactions}
        evidences={evidences}
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
          evidences={evidences}
          onRowClick={handleOpen}
          onEdit={handleEdit}
          onDelete={handleDeleteTransaction}
          highlightId={
            transactionId ? Number(transactionId) : undefined
          }
        />

        <div style={footer}>
          <span>
            Showing{" "}
            {filteredData.length === 0
              ? 0
              : (page - 1) * pageSize + 1}
            –
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
  onClose={handleCloseModal}
  transaction={selectedTransaction}
  evidences={
    selectedTransaction
      ? evidences.filter(
          (e) =>
            Number(e.transactionId) === Number(selectedTransaction.id)
        )
      : []
  }
/>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTransaction}
        mode="add"
      />

      <AddTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSubmit={handleUpdateTransaction}
        transaction={editingTransaction}
        mode="edit"
      />

      <ConfirmDeleteModal
        isOpen={!!transactionToDelete}
        transaction={transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense>
      <TransactionsContent />
    </Suspense>
  );
}

/* =========================
   STYLES (ADDED BACK)
========================= */

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
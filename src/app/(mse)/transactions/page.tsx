"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { TransactionsStats } from "@/components/mse/transactions/TransactionsStats";
import { TransactionsTable } from "@/components/mse/transactions/TransactionsTable";
import { TransactionsPagination } from "@/components/mse/transactions/TransactionsPagination";
import { TransactionFilters } from "@/components/mse/transactions/TransactionFilters";
import ViewTransactionModal from "@/components/mse/transactions/modals/ViewTransactionModal";
import { AddTransactionModal } from "@/components/mse/transactions/modals/AddTransactionModal";
import { ConfirmDeleteModal } from "@/components/mse/transactions/modals/ConfirmDeleteModal";
import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";

import { theme } from "@/styles/theme";
import { Transaction } from "@/types/transaction.types";
import { useTransactions } from "@/hooks/useTransactions";
import { usePermissions } from "@/security/access-control";
import { exportTransactionsCSV } from "@/utils/export";

function TransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  const { transactions, evidences, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { canAddTransaction, canEditTransaction, canDeleteTransaction } = usePermissions();

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState("All");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [evidenceCount, setEvidenceCount] = useState("All");
  const [projectName, setProjectName] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const pageSize = 25;

  const selectedTransaction = useMemo(() => {
    if (!transactionId || transactions.length === 0) return null;
    return transactions.find((t) => String(t.id) === transactionId) ?? null;
  }, [transactionId, transactions]);

  const filteredData = useMemo(() => {
    return transactions.filter((t) => {
      if (search && !(t.counterparty ?? t.name ?? "").toLowerCase().includes(search.toLowerCase())) return false;
      if (startDate && new Date(t.date) < new Date(startDate)) return false;
      if (endDate && new Date(t.date) > new Date(endDate)) return false;
      if (status !== "All" && t.status !== status) return false;
      if (type !== "All" && t.type !== type) return false;
      if (paymentMethod !== "All" && t.paymentMethod !== paymentMethod) return false;
      if (minAmount && t.amount < Number(minAmount)) return false;
      if (maxAmount && t.amount > Number(maxAmount)) return false;
      if (evidenceCount === "HAS" && (t.evidenceCount ?? 0) === 0) return false;
      if (evidenceCount === "NO" && (t.evidenceCount ?? 0) > 0) return false;
      if (projectName !== "All" && t.projectName !== projectName) return false;
      return true;
    });
  }, [transactions, search, startDate, endDate, status, type, paymentMethod, minAmount, maxAmount, evidenceCount, projectName]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const handleCloseModal = () => {
    router.replace("/transactions");
  };

  const handleCreateTransaction = async (data: Omit<Transaction, "id" | "status" | "evidenceCount">) => {
    try {
      await addTransaction(data);
      setIsAddModalOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create transaction";
      console.error("Create transaction error", err);
      alert(msg);
    }
  };

  const handleUpdateTransaction = async (data: Omit<Transaction, "id" | "status" | "evidenceCount">) => {
    if (!editingTransaction) return;
    try {
      await updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update transaction";
      console.error("Update transaction error", err);
      alert(msg);
    }
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    setIsDeleting(true);
    await deleteTransaction(transactionToDelete.id);
    if (transactionId === String(transactionToDelete.id)) handleCloseModal();
    setTransactionToDelete(null);
    setIsDeleting(false);
  };

  const handleExport = () => {
    exportTransactionsCSV(filteredData);
  };

  const projectOptions = useMemo(() => {
    const projects = Array.from(new Set(transactions.map((t) => t.projectName).filter(Boolean))) as string[];
    projects.sort((a, b) => a.localeCompare(b));
    return projects;
  }, [transactions]);

  return (
    <div style={pageStyles}>
      <style>{`
        .txn-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .txn-footer { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; color: ${theme.colors.textMuted}; font-size: ${theme.typography.sm}; }
      `}</style>

      <TransactionsStats transactions={transactions} evidences={evidences} />

      <section style={section}>
        <PageToolbar
          title="Transactions"
          showSearch
          primaryActionLabel={canAddTransaction ? "Add Transaction" : undefined}
          search={search}
          setSearch={setSearch}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onReset={() => {
            setSearch("");
            setStartDate("");
            setEndDate("");
            setStatus("All");
            setType("All");
            setPaymentMethod("All");
            setMinAmount("");
            setMaxAmount("");
            setEvidenceCount("All");
            setProjectName("All");
            setPage(1);
          }}
          onExport={handleExport}
          onAdd={canAddTransaction ? () => setIsAddModalOpen(true) : undefined}
        />

        <TransactionFilters
          status={status}
          setStatus={setStatus}
          type={type}
          setType={setType}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          minAmount={minAmount}
          setMinAmount={setMinAmount}
          maxAmount={maxAmount}
          setMaxAmount={setMaxAmount}
          evidenceCount={evidenceCount}
          setEvidenceCount={setEvidenceCount}
          projectName={projectName}
          setProjectName={setProjectName}
          projectOptions={projectOptions}
        />

        <div className="txn-table-wrap">
        <TransactionsTable
          data={paginatedData}
          evidences={evidences}
          onRowClick={(t) => router.push(`/transactions?transactionId=${t.id}`)}
          onEdit={canEditTransaction ? (t) => setEditingTransaction(t) : undefined}
          onDelete={canDeleteTransaction ? (t) => setTransactionToDelete(t) : undefined}
          highlightId={transactionId ?? undefined}
        />
        </div>

        <div className="txn-footer">
          <span>
            Showing {filteredData.length === 0 ? 0 : (page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, filteredData.length)} of {filteredData.length.toLocaleString()} transactions
          </span>
          <TransactionsPagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </section>

      {selectedTransaction && (
        <ViewTransactionModal
          transaction={selectedTransaction}
          evidence={evidences}
          onClose={handleCloseModal}
        />
      )}

      {canAddTransaction && (
        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateTransaction}
          mode="add"
        />
      )}

      {canEditTransaction && (
        <AddTransactionModal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSubmit={handleUpdateTransaction}
          transaction={editingTransaction}
          mode="edit"
        />
      )}

      {canDeleteTransaction && (
        <ConfirmDeleteModal
          isOpen={!!transactionToDelete}
          transaction={transactionToDelete}
          onClose={() => setTransactionToDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
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



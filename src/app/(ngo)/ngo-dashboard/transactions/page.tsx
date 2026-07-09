"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import NGODashboardShell from "@/components/ngo/dashboard/NGODashboardShell";
import { ProtectedRoute } from "@/components/Guards";
import PermissionGate from "@/components/ngo/rbac/PermissionGate";
import ActionItems from "@/components/ngo/rbac/ActionItems";
import AuditorAlertsPanel from "@/components/ngo/rbac/AuditorAlertsPanel";
import UploadEvidenceModal from "@/components/ngo/UploadEvidenceModal";
import NGOFlagIssueModal from "@/components/ngo/NGOFlagIssueModal";

import { TransactionsStats } from "@/components/mse/transactions/TransactionsStats";
import { TransactionsTable } from "@/components/mse/transactions/TransactionsTable";
import { TransactionsPagination } from "@/components/mse/transactions/TransactionsPagination";
import { AddTransactionModal } from "@/components/mse/transactions/modals/AddTransactionModal";
import { ConfirmDeleteModal } from "@/components/mse/transactions/modals/ConfirmDeleteModal";
import ViewTransactionModal from "@/components/mse/transactions/modals/ViewTransactionModal";
import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";

import { useRBAC, useScopedData } from "@/context/RBACContext";
import { theme } from "@/styles/theme";
import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import type { NGOTransaction, NGOFlag, NGOFlagCategory, FlagSeverity, DonorName } from "@/types/ngo";
import { NGO_TRANSACTIONS, NGO_FLAGS } from "@/mock/ngo.mock";

// ── Map NGOTransaction → Transaction so MSE components work unchanged ─────────
function toTransaction(t: NGOTransaction): Transaction {
  return {
    id:            t.id,
    organisationId: t.organisationId,
    name:          t.description || t.projectName,
    counterparty:  t.counterparty,
    date:          t.date,
    amount:        t.amount,
    type:          t.type,
    paymentMethod: t.paymentMethod,
    status:        t.status === "FLAGGED" ? "PENDING" : t.status,
    evidenceCount: t.evidenceCount,
    createdBy:     t.createdBy,
    createdAt:     t.createdAt,
    notes:         t.notes,
  };
}

function TransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  const { user, can } = useRBAC();
  const canAdd    = can("transaction:create");
  const canEdit   = can("transaction:edit");
  const canDelete = can("transaction:create"); // same gate as create for NGO

  const [ngoTransactions, setNgoTransactions] = useState<NGOTransaction[]>(NGO_TRANSACTIONS);
  const [flags,           setFlags]           = useState<NGOFlag[]>(NGO_FLAGS);
  const [flagTarget,      setFlagTarget]      = useState<NGOTransaction | null>(null);
  const [uploadTarget,    setUploadTarget]    = useState<NGOTransaction | null>(null);
  const [isAddOpen,       setIsAddOpen]       = useState(false);
  const [editingTx,       setEditingTx]       = useState<Transaction | null>(null);
  const [txToDelete,      setTxToDelete]      = useState<Transaction | null>(null);
  const [isDeleting,      setIsDeleting]      = useState(false);
  const [search,          setSearch]          = useState("");
  const [startDate,       setStartDate]       = useState("");
  const [endDate,         setEndDate]         = useState("");
  const [page,            setPage]            = useState(1);

  const pageSize = 25;

  // Apply donor scope for DONOR_REPRESENTATIVE
  const scopedNgo = useScopedData(ngoTransactions, (t) => t.donor);

  // Map to Transaction shape for MSE components
  const transactions = useMemo(() => scopedNgo.map(toTransaction), [scopedNgo]);

  // Build a fake Evidence[] from evidenceCount so TransactionsStats works
  const evidences = useMemo<Evidence[]>(() =>
    scopedNgo.flatMap((t) =>
      Array.from({ length: t.evidenceCount }, (_, i) => ({
        id:           `${t.id}-ev-${i}`,
        transactionId: t.id,
        documentName: `Evidence ${i + 1}`,
        folder:       "",
        subfolder:    "",
        fileType:     "pdf",
        fileUpload:   "",
        status:       "Verified" as const,
        uploadedAt:   t.createdAt,
        uploadedBy:   t.createdBy,
      }))
    ),
  [scopedNgo]);

  // Filtered + paginated
  const filteredData = useMemo(() => {
    return transactions.filter((t) => {
      if (search && !(t.counterparty ?? t.name ?? "").toLowerCase().includes(search.toLowerCase())) return false;
      if (startDate && new Date(t.date) < new Date(startDate)) return false;
      if (endDate   && new Date(t.date) > new Date(endDate))   return false;
      return true;
    });
  }, [transactions, search, startDate, endDate]);

  const totalPages    = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const selectedTransaction = useMemo(() => {
    if (!transactionId) return null;
    return transactions.find((t) => t.id === transactionId) ?? null;
  }, [transactionId, transactions]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleExport = () => {
    const rows = [
      ["ID", "Description", "Counterparty", "Date", "Amount", "Type", "Status"],
      ...filteredData.map((t) => [t.id, t.name, t.counterparty, t.date, t.amount, t.type, t.status]),
    ];
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "ngo-transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreate = (data: Omit<Transaction, "id" | "status" | "evidenceCount">) => {
    const newNgo: NGOTransaction = {
      id:             `NGO-TXN-${Date.now()}`,
      organisationId: user.organisationId,
      projectName:    data.name,
      donor:          "USAID",
      budgetLine:     "",
      description:    data.name,
      counterparty:   data.counterparty,
      date:           data.date,
      amount:         data.amount,
      currency:       "RWF",
      paymentMethod:  data.paymentMethod,
      type:           data.type,
      status:         "PENDING",
      evidenceCount:  0,
      createdBy:      data.createdBy ?? user.fullName,
      createdAt:      new Date().toISOString(),
      notes:          data.notes,
    };
    setNgoTransactions((p) => [newNgo, ...p]);
    setIsAddOpen(false);
  };

  const handleUpdate = (data: Omit<Transaction, "id" | "status" | "evidenceCount">) => {
    if (!editingTx) return;
    setNgoTransactions((p) =>
      p.map((t) =>
        t.id === editingTx.id
          ? { ...t, description: data.name, counterparty: data.counterparty, date: data.date, amount: data.amount, type: data.type, paymentMethod: data.paymentMethod, notes: data.notes }
          : t
      )
    );
    setEditingTx(null);
  };

  const handleConfirmDelete = async () => {
    if (!txToDelete) return;
    setIsDeleting(true);
    setNgoTransactions((p) => p.filter((t) => t.id !== txToDelete.id));
    if (transactionId === txToDelete.id) router.replace("/ngo-dashboard/transactions");
    setTxToDelete(null);
    setIsDeleting(false);
  };

  const handleFlagSubmit = (flag: { transactionId: string; category: NGOFlagCategory; severity: FlagSeverity; notes: string }) => {
    setFlags((p) => [...p, {
      id: `FLAG-${Date.now()}`, transactionId: flag.transactionId,
      projectName: flagTarget?.projectName ?? "", donor: flagTarget?.donor ?? "USAID",
      category: flag.category, severity: flag.severity, notes: flag.notes,
      flaggedBy: user.fullName, flaggedAt: new Date().toISOString(), status: "OPEN",
    }]);
    setNgoTransactions((p) => p.map((t) => t.id === flag.transactionId ? { ...t, status: "FLAGGED" as const } : t));
    setFlagTarget(null);
  };

  const handleUploadSubmit = (transactionId: string, fileCount: number) => {
    setNgoTransactions((p) =>
      p.map((t) => t.id === transactionId ? { ...t, status: "COMPLETED" as const, evidenceCount: t.evidenceCount + fileCount } : t)
    );
    setFlags((p) =>
      p.map((f) => f.transactionId === transactionId ? { ...f, status: "RESOLVED" as const, resolvedAt: new Date().toISOString() } : f)
    );
  };

  // Find the NGOTransaction for the upload/flag target from a Transaction id
  const findNgo = (id: string) => ngoTransactions.find((t) => t.id === id) ?? null;

  return (
    <div style={pageStyles}>
      <style>{`
        .txn-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .txn-footer { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; color: ${theme.colors.textMuted}; font-size: ${theme.typography.sm}; }
        .ngo-txn-panels { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 768px) { .ngo-txn-panels { grid-template-columns: 1fr; } }
      `}</style>

      <TransactionsStats transactions={transactions} evidences={evidences} />

      {/* NGO-specific action panels (auditor alerts + action items) */}
      <PermissionGate component="panel:action_items">
        <div className="ngo-txn-panels">
          <ActionItems
            transactions={scopedNgo}
            onUploadEvidence={(txn) => setUploadTarget(txn)}
          />
          <AuditorAlertsPanel
            flags={flags}
            transactions={scopedNgo}
            onUploadEvidence={(txn) => setUploadTarget(txn)}
          />
        </div>
      </PermissionGate>

      <section style={section}>
        <PageToolbar
          title="Transactions"
          showSearch
          primaryActionLabel={canAdd ? "Add Transaction" : undefined}
          search={search}
          setSearch={setSearch}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onReset={() => { setSearch(""); setStartDate(""); setEndDate(""); setPage(1); }}
          onExport={handleExport}
          onAdd={canAdd ? () => setIsAddOpen(true) : undefined}
        />

        <div className="txn-table-wrap">
          <TransactionsTable
            data={paginatedData}
            evidences={evidences}
            onRowClick={(t) => router.push(`/ngo-dashboard/transactions?transactionId=${t.id}`)}
            onEdit={canEdit ? (t) => setEditingTx(t) : undefined}
            onDelete={canDelete ? (t) => setTxToDelete(t) : undefined}
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

      {/* View modal */}
      {selectedTransaction && (
        <ViewTransactionModal
          transaction={{ ...selectedTransaction, isDuplicate: false }}
          evidence={evidences}
          onClose={() => router.replace("/ngo-dashboard/transactions")}
        />
      )}

      {/* Add modal */}
      {canAdd && (
        <AddTransactionModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleCreate}
          mode="add"
        />
      )}

      {/* Edit modal */}
      {canEdit && (
        <AddTransactionModal
          isOpen={!!editingTx}
          onClose={() => setEditingTx(null)}
          onSubmit={handleUpdate}
          transaction={editingTx}
          mode="edit"
        />
      )}

      {/* Delete modal */}
      {canDelete && (
        <ConfirmDeleteModal
          isOpen={!!txToDelete}
          transaction={txToDelete}
          onClose={() => setTxToDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}

      {/* NGO-specific: flag issue modal */}
      <NGOFlagIssueModal
        open={flagTarget !== null}
        transaction={flagTarget}
        auditorName={user.fullName}
        onClose={() => setFlagTarget(null)}
        onSubmit={handleFlagSubmit}
      />

      {/* NGO-specific: upload evidence modal */}
      <UploadEvidenceModal
        open={uploadTarget !== null}
        transaction={uploadTarget}
        onClose={() => setUploadTarget(null)}
        onSubmit={handleUploadSubmit}
      />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <ProtectedRoute>
      <NGODashboardShell>
        <Suspense>
          <TransactionsContent />
        </Suspense>
      </NGODashboardShell>
    </ProtectedRoute>
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

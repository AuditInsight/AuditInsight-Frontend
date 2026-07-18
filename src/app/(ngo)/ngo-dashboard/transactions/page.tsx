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
import NGOAddTransactionModal from "@/components/ngo/AddTransactionModal";

import { TransactionsStats } from "@/components/mse/transactions/TransactionsStats";
import { TransactionsPagination } from "@/components/mse/transactions/TransactionsPagination";
import { AddTransactionModal } from "@/components/mse/transactions/modals/AddTransactionModal";
import ViewTransactionModal from "@/components/mse/transactions/modals/ViewTransactionModal";
import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";
import NGOTransactionTable from "@/components/ngo/NGOTransactionTable";

import { useRBAC } from "@/context/RBACContext";
import { useTransactions } from "@/hooks/useTransactions";
import { useReviewQueue } from "@/hooks/useReviewQueue";
import { theme } from "@/styles/theme";
import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import type { NGOTransaction, NGOFlagCategory, FlagSeverity } from "@/types/ngo";

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
  const canAdd  = can("transaction:create");
  const canEdit = can("transaction:edit");

  const { transactions: rawTransactions } = useTransactions();

  // Map real Transaction[] → NGOTransaction[] for NGO-specific components
  const ngoTransactions = useMemo<NGOTransaction[]>(() =>
    rawTransactions.map((t) => ({
      id:             t.id,
      organisationId: t.organisationId ?? "",
      projectName:    t.name,
      donor:          (t as Transaction & { donor?: string }).donor ?? "",
      budgetLine:     (t as Transaction & { budgetLine?: string }).budgetLine ?? "",
      description:    t.name,
      counterparty:   t.counterparty,
      date:           t.date,
      amount:         t.amount,
      currency:       "RWF",
      paymentMethod:  t.paymentMethod,
      type:           t.type,
      status:         t.status === "PENDING" ? "PENDING" : "COMPLETED",
      evidenceCount:  t.evidenceCount ?? 0,
      createdBy:      t.createdBy ?? "",
      createdAt:      t.createdAt ?? "",
      notes:          t.notes,
    })),
  [rawTransactions]);
  const [flags,           setFlags]           = useState<NGOFlag[]>(NGO_FLAGS);
  const [flagTarget,      setFlagTarget]      = useState<NGOTransaction | null>(null);
  const [uploadTarget,    setUploadTarget]    = useState<NGOTransaction | null>(null);
  const [isAddOpen,       setIsAddOpen]       = useState(false);
  const [editingTx,       setEditingTx]       = useState<Transaction | null>(null);
  const [search,          setSearch]          = useState("");
  const [startDate,       setStartDate]       = useState("");
  const [endDate,         setEndDate]         = useState("");
  const [page,            setPage]            = useState(1);

  const pageSize = 25;

  const scopedNgo = ngoTransactions;

  // Build Evidence[] from evidenceCount so TransactionsStats works
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

  // Filtered + paginated — filter directly on NGO fields
  const filteredNgo = useMemo(() => {
    return scopedNgo.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.id.toLowerCase().includes(q) &&
          !t.projectName.toLowerCase().includes(q) &&
          !t.description.toLowerCase().includes(q) &&
          !t.counterparty.toLowerCase().includes(q) &&
          !t.budgetLine.toLowerCase().includes(q)
        ) return false;
      }
      if (startDate && new Date(t.date) < new Date(startDate)) return false;
      if (endDate   && new Date(t.date) > new Date(endDate))   return false;
      return true;
    });
  }, [scopedNgo, search, startDate, endDate]);

  const filteredData = useMemo(() => filteredNgo.map(toTransaction), [filteredNgo]);

  const totalPages    = Math.ceil(filteredNgo.length / pageSize);
  const paginatedNgo  = filteredNgo.slice((page - 1) * pageSize, page * pageSize);

  const selectedTransaction = useMemo(() => {
    if (!transactionId) return null;
    return filteredData.find((t) => t.id === transactionId) ?? null;
  }, [transactionId, filteredData]);

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

  const handleCreate = (_txn: NGOTransaction) => {
    // NGO modal already called the API — just close
    setIsAddOpen(false);
  };

  const handleUpdate = (_data: Omit<Transaction, "id" | "status" | "evidenceCount">) => {
    // Backend has no full-update endpoint — status-only PATCH is handled by useTransactions
    setEditingTx(null);
  };

  const handleFlagSubmit = (flag: { transactionId: string; category: NGOFlagCategory; severity: FlagSeverity; notes: string }) => {
    setFlags((p) => [...p, {
      id: `FLAG-${Date.now()}`, transactionId: flag.transactionId,
      projectName: flagTarget?.projectName ?? "",
      category: flag.category, severity: flag.severity, notes: flag.notes,
      flaggedBy: user.fullName, flaggedAt: new Date().toISOString(), status: "OPEN",
    }]);
    setFlagTarget(null);
  };

  const handleUploadSubmit = (_transactionId: string, _fileCount: number) => {
    // Evidence upload is handled by the evidence module — no local state mutation needed
    setUploadTarget(null);
  };

  return (
    <div style={pageStyles}>
      <style>{`
        .txn-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .txn-footer { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; color: ${theme.colors.textMuted}; font-size: ${theme.typography.sm}; }
        .ngo-txn-panels { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 768px) { .ngo-txn-panels { grid-template-columns: 1fr; } }
      `}</style>

      <TransactionsStats transactions={filteredData} evidences={evidences} />

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
          <NGOTransactionTable
            transactions={paginatedNgo}
            onUploadEvidence={(txn) => setUploadTarget(txn)}
            onEditTransaction={(txn) => setEditingTx(toTransaction(txn))}
            onFlagIssue={(txn) => setFlagTarget(txn)}
          />
        </div>

        <div className="txn-footer">
          <span>
            Showing {filteredNgo.length === 0 ? 0 : (page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, filteredNgo.length)} of {filteredNgo.length.toLocaleString()} transactions
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

      {/* Add modal — NGO-specific modal with donor/budgetLine/projectName fields */}
      {canAdd && (
        <NGOAddTransactionModal
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleCreate}
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

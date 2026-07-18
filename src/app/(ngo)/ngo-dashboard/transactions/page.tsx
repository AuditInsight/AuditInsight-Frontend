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
import NGOEditTransactionModal from "@/components/ngo/EditTransactionModal";

import { TransactionsStats } from "@/components/mse/transactions/TransactionsStats";
import { TransactionsPagination } from "@/components/mse/transactions/TransactionsPagination";
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
import type { ReviewItem } from "@/lib/reviewEngine";

// ── Map Transaction → NGOTransaction for NGO-specific components ──────────────
function toNGO(t: Transaction): NGOTransaction {
  return {
    id:             t.id,
    organisationId: t.organisationId ?? "",
    projectName:    t.projectName ?? t.name,
    donor:          t.donor ?? "",
    budgetLine:     t.budgetLine ?? "",
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
  };
}

// ── Map NGOTransaction → Transaction so MSE components work unchanged ─────────
function toTransaction(t: NGOTransaction): Transaction {
  return {
    id:             t.id,
    organisationId: t.organisationId,
    name:           t.description || t.projectName,
    counterparty:   t.counterparty,
    date:           t.date,
    amount:         t.amount,
    type:           t.type,
    paymentMethod:  t.paymentMethod,
    status:         t.status === "FLAGGED" ? "PENDING" : t.status,
    evidenceCount:  t.evidenceCount,
    createdBy:      t.createdBy,
    createdAt:      t.createdAt,
    notes:          t.notes,
    donor:          t.donor,
    budgetLine:     t.budgetLine,
    projectName:    t.projectName,
  };
}

// ── Map ReviewItem → NGOFlag shape for AuditorAlertsPanel ────────────────────
function reviewItemToFlag(item: ReviewItem): {
  id: string; transactionId: string; projectName: string;
  category: string; severity: string; notes: string;
  flaggedBy: string; flaggedAt: string; status: string; donor?: string;
} {
  return {
    id:            item.id,
    transactionId: item.transactionId,
    projectName:   "",
    category:      item.type,
    severity:      item.risk === "High" ? "HIGH" : item.risk === "Low" ? "LOW" : "MEDIUM",
    notes:         item.description,
    flaggedBy:     item.flaggedBy,
    flaggedAt:     item.createdAt,
    status:        item.status === "Resolved" ? "RESOLVED" : "OPEN",
  };
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ padding: "32px 0" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ height: 52, background: "#f1f5f9", borderRadius: 8, marginBottom: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}

// ── Error banner ──────────────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{ background: "rgba(30,58,138,0.06)", border: "1px solid rgba(30,58,138,0.2)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <span style={{ fontSize: 13.5, color: "#1e3a8a", fontWeight: 500 }}>{message}</span>
      <button onClick={onRetry} style={{ fontSize: 12.5, fontWeight: 600, color: "#1e3a8a", background: "rgba(30,58,138,0.1)", border: "1px solid rgba(30,58,138,0.2)", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>
        Retry
      </button>
    </div>
  );
}

function TransactionsContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  const { user, can } = useRBAC();
  const canAdd  = can("transaction:create");
  const canEdit = can("transaction:edit");

  const {
    transactions: rawTransactions,
    loading: txnLoading,
    error: txnError,
    deleteTransaction,
    saveEvidence,
  } = useTransactions();

  const {
    items: reviewItems,
    flagIssue: apiFlagIssue,
  } = useReviewQueue();

  // Map real Transaction[] → NGOTransaction[] for NGO-specific components
  const ngoTransactions = useMemo<NGOTransaction[]>(
    () => rawTransactions.map(toNGO),
    [rawTransactions]
  );

  // Map ReviewItems → flag-like shape for AuditorAlertsPanel
  const openFlags = useMemo(
    () => reviewItems.filter((i) => i.status !== "Resolved").map(reviewItemToFlag),
    [reviewItems]
  );

  const [flagTarget,   setFlagTarget]   = useState<NGOTransaction | null>(null);
  const [uploadTarget, setUploadTarget] = useState<NGOTransaction | null>(null);
  const [editTarget,   setEditTarget]   = useState<NGOTransaction | null>(null);
  const [isAddOpen,    setIsAddOpen]    = useState(false);
  const [search,       setSearch]       = useState("");
  const [startDate,    setStartDate]    = useState("");
  const [endDate,      setEndDate]      = useState("");
  const [page,         setPage]         = useState(1);
  const [deleteError,  setDeleteError]  = useState<string | null>(null);

  const pageSize = 25;

  // Build Evidence[] from evidenceCount so TransactionsStats works
  const evidences = useMemo<Evidence[]>(() =>
    ngoTransactions.flatMap((t) =>
      Array.from({ length: t.evidenceCount }, (_, i) => ({
        id:            `${t.id}-ev-${i}`,
        transactionId: t.id,
        documentName:  `Evidence ${i + 1}`,
        folder:        "",
        subfolder:     "",
        fileType:      "pdf",
        fileUpload:    "",
        status:        "Verified" as const,
        uploadedAt:    t.createdAt,
        uploadedBy:    t.createdBy,
      }))
    ),
  [ngoTransactions]);

  // Filtered + paginated
  const filteredNgo = useMemo(() => {
    return ngoTransactions.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.id.toLowerCase().includes(q) &&
          !t.projectName.toLowerCase().includes(q) &&
          !t.description.toLowerCase().includes(q) &&
          !t.counterparty.toLowerCase().includes(q) &&
          !(t.budgetLine ?? "").toLowerCase().includes(q) &&
          !(t.donor ?? "").toLowerCase().includes(q)
        ) return false;
      }
      if (startDate && new Date(t.date) < new Date(startDate)) return false;
      if (endDate   && new Date(t.date) > new Date(endDate))   return false;
      return true;
    });
  }, [ngoTransactions, search, startDate, endDate]);

  const filteredData  = useMemo(() => filteredNgo.map(toTransaction), [filteredNgo]);
  const totalPages    = Math.ceil(filteredNgo.length / pageSize);
  const paginatedNgo  = filteredNgo.slice((page - 1) * pageSize, page * pageSize);

  const selectedTransaction = useMemo(() => {
    if (!transactionId) return null;
    return filteredData.find((t) => t.id === transactionId) ?? null;
  }, [transactionId, filteredData]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleExport = () => {
    const rows = [
      ["ID", "Project", "Donor", "Budget Line", "Counterparty", "Date", "Amount", "Type", "Status"],
      ...filteredNgo.map((t) => [t.id, t.projectName, t.donor ?? "", t.budgetLine ?? "", t.counterparty, t.date, t.amount, t.type, t.status]),
    ];
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "ngo-transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreate = (_txn: NGOTransaction) => {
    // AddTransactionModal already called the API — useTransactions auto-refreshes
    setIsAddOpen(false);
  };

  const handleFlagSubmit = async (flag: {
    transactionId: string;
    category: NGOFlagCategory;
    severity: FlagSeverity;
    notes: string;
  }) => {
    try {
      await apiFlagIssue({
        transactionId: flag.transactionId,
        type:          flag.category,
        description:   flag.notes || flag.category,
        status:        "Open",
        flaggedBy:     user.fullName,
        createdAt:     new Date().toISOString(),
        risk:          flag.severity === "CRITICAL" || flag.severity === "HIGH" ? "High" : "Medium",
      });
    } catch {
      // Non-fatal — flag modal shows its own error
    }
    setFlagTarget(null);
  };

  const handleUploadDone = (saved: Evidence) => {
    saveEvidence(saved);
    setUploadTarget(null);
  };

  const handleDelete = async (txnId: string) => {
    setDeleteError(null);
    try {
      await deleteTransaction(txnId);
    } catch {
      setDeleteError("Failed to delete transaction. Please try again.");
    }
  };

  return (
    <div style={pageStyles}>
      <style>{`
        .txn-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .txn-footer { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; color: ${theme.colors.textMuted}; font-size: ${theme.typography.sm}; }
        .ngo-txn-panels { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 768px) { .ngo-txn-panels { grid-template-columns: 1fr; } }
      `}</style>

      {txnError && (
        <ErrorBanner message={txnError} onRetry={() => window.location.reload()} />
      )}

      {deleteError && (
        <ErrorBanner message={deleteError} onRetry={() => setDeleteError(null)} />
      )}

      <TransactionsStats transactions={filteredData} evidences={evidences} />

      {/* NGO-specific action panels */}
      <PermissionGate component="panel:action_items">
        <div className="ngo-txn-panels">
          <ActionItems
            transactions={ngoTransactions}
            onUploadEvidence={(txn) => setUploadTarget(txn)}
          />
          <AuditorAlertsPanel
            flags={openFlags as Parameters<typeof AuditorAlertsPanel>[0]["flags"]}
            transactions={ngoTransactions}
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

        {txnLoading ? (
          <LoadingSkeleton />
        ) : filteredNgo.length === 0 && !search && !startDate && !endDate ? (
          <div style={{ padding: "48px 16px", textAlign: "center", color: "#94a3b8", fontSize: 13.5 }}>
            No transactions yet. {canAdd && "Click \"Add Transaction\" to record the first one."}
          </div>
        ) : (
          <>
            <div className="txn-table-wrap">
              <NGOTransactionTable
                transactions={paginatedNgo}
                onUploadEvidence={(txn) => setUploadTarget(txn)}
                onEditTransaction={(txn) => setEditTarget(txn)}
                onFlagIssue={(txn) => setFlagTarget(txn)}
                onDeleteTransaction={canEdit ? handleDelete : undefined}
              />
            </div>

            <div className="txn-footer">
              <span>
                Showing {filteredNgo.length === 0 ? 0 : (page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filteredNgo.length)} of {filteredNgo.length.toLocaleString()} transactions
              </span>
              <TransactionsPagination page={page} setPage={setPage} totalPages={totalPages} />
            </div>
          </>
        )}
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
        <NGOAddTransactionModal
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleCreate}
        />
      )}

      {/* Edit modal */}
      <NGOEditTransactionModal
        open={editTarget !== null}
        transaction={editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={() => setEditTarget(null)}
      />

      {/* Flag issue modal */}
      <NGOFlagIssueModal
        open={flagTarget !== null}
        transaction={flagTarget}
        auditorName={user.fullName}
        onClose={() => setFlagTarget(null)}
        onSubmit={handleFlagSubmit}
      />

      {/* Upload evidence modal */}
      <UploadEvidenceModal
        open={uploadTarget !== null}
        transaction={uploadTarget}
        onClose={() => setUploadTarget(null)}
        onSubmit={handleUploadDone}
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
  display:       "flex",
  flexDirection: "column",
  gap:           theme.spacing.xl,
  background:    theme.colors.appBackground,
  minHeight:     "100vh",
  fontFamily:    theme.typography.fontFamily,
};

const section: React.CSSProperties = {
  background:   "rgba(255,255,255,0.78)",
  border:       `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.xl,
  padding:      theme.spacing.lg,
  boxShadow:    theme.shadows.md,
  ...theme.effects.glass,
};

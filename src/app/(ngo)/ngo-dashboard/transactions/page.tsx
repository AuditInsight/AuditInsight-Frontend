"use client";

import { useState } from "react";
import NGODashboardShell from "@/components/ngo/dashboard/NGODashboardShell";
import NGOTransactionTable from "@/components/ngo/NGOTransactionTable";
import NGOFlagIssueModal from "@/components/ngo/NGOFlagIssueModal";
import UploadEvidenceModal from "@/components/ngo/UploadEvidenceModal";
import EditTransactionModal from "@/components/ngo/EditTransactionModal";
import AddTransactionModal from "@/components/ngo/AddTransactionModal";
import PermissionGate from "@/components/ngo/rbac/PermissionGate";
import ActionItems from "@/components/ngo/rbac/ActionItems";
import AuditorAlertsPanel from "@/components/ngo/rbac/AuditorAlertsPanel";
import { useRBAC, useScopedData } from "@/context/RBACContext";
import { ProtectedRoute } from "@/components/Guards";
import type { NGOTransaction, NGOFlag, NGOFlagCategory, FlagSeverity, DonorName } from "@/types/ngo";
import { NGO_TRANSACTIONS, NGO_FLAGS } from "@/mock/ngo.mock";
import { Plus, Download, TrendingUp, TrendingDown, AlertTriangle, Clock } from "lucide-react";
import NGOPageHeader from "@/components/ngo/dashboard/NGOPageHeader";
import NGOStatCard from "@/components/ngo/dashboard/NGOStatCard";

function TransactionsContent() {
  const { user } = useRBAC();

  const [transactions, setTransactions] = useState<NGOTransaction[]>(NGO_TRANSACTIONS);
  const [flags,        setFlags]        = useState<NGOFlag[]>(NGO_FLAGS);
  const [flagTarget,   setFlagTarget]   = useState<NGOTransaction | null>(null);
  const [uploadTarget, setUploadTarget] = useState<NGOTransaction | null>(null);
  const [editTarget,   setEditTarget]   = useState<NGOTransaction | null>(null);
  const [addOpen,      setAddOpen]      = useState(false);

  const scopedTxns = useScopedData(transactions, (t) => t.donor);
  const income  = scopedTxns.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expense = scopedTxns.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const flagged = scopedTxns.filter((t) => t.status === "FLAGGED").length;
  const pending = scopedTxns.filter((t) => t.status === "PENDING").length;
  const isDonor = user.role === "DONOR_REPRESENTATIVE";

  const handleFlagSubmit = (flag: { transactionId: string; category: NGOFlagCategory; severity: FlagSeverity; notes: string }) => {
    setFlags((p) => [...p, {
      id: `FLAG-${Date.now()}`, transactionId: flag.transactionId,
      projectName: flagTarget?.projectName ?? "", donor: flagTarget?.donor ?? "USAID",
      category: flag.category, severity: flag.severity, notes: flag.notes,
      flaggedBy: user.fullName, flaggedAt: new Date().toISOString(), status: "OPEN",
    }]);
    setTransactions((p) => p.map((t) => t.id === flag.transactionId ? { ...t, status: "FLAGGED" as const } : t));
    setFlagTarget(null);
  };

  const handleUploadSubmit = (transactionId: string, fileCount: number) => {
    setTransactions((p) => p.map((t) =>
      t.id === transactionId ? { ...t, status: "COMPLETED" as const, evidenceCount: t.evidenceCount + fileCount } : t
    ));
    setFlags((p) => p.map((f) =>
      f.transactionId === transactionId ? { ...f, status: "RESOLVED" as const, resolvedAt: new Date().toISOString() } : f
    ));
  };

  const handleExport = () => {
    const rows = [["ID","Project","Donor","Amount","Status"], ...scopedTxns.map((t) => [t.id, t.projectName, t.donor, t.amount, t.status])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "ngo-transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <NGOPageHeader title="Transactions" subtitle="Record, review, and manage all project financial transactions." onExport={handleExport} />

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <NGOStatCard label="Total Income"     value={`RWF ${(income / 1_000_000).toFixed(1)}M`}  sub={`${scopedTxns.filter((t) => t.type === "INCOME").length} receipts`}  accent="#1e3a8a" icon={<TrendingUp size={16} />}   />
        <NGOStatCard label="Total Expenses"   value={`RWF ${(expense / 1_000_000).toFixed(1)}M`} sub={`${scopedTxns.filter((t) => t.type === "EXPENSE").length} payments`} accent="#2563eb" icon={<TrendingDown size={16} />} />
        <NGOStatCard label="Flagged"          value={flagged} sub="Require attention"             accent="#475569" icon={<AlertTriangle size={16} />} />
        <NGOStatCard label="Pending Evidence" value={pending} sub="Upload required"               accent="#64748b" icon={<Clock size={16} />} />
      </div>

      {/* Action panels */}
      <PermissionGate component="panel:action_items">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <ActionItems transactions={scopedTxns} onUploadEvidence={(txn) => setUploadTarget(txn)} />
          <AuditorAlertsPanel flags={flags} transactions={scopedTxns} onUploadEvidence={(txn) => setUploadTarget(txn)} />
        </div>
      </PermissionGate>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
              {isDonor ? `${user.assignedDonorId} Transactions` : "All Transactions"}
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#64748b" }}>
              {user.role === "ACCOUNTANT" && "Record, tag, and upload evidence for each transaction."}
              {user.role === "AUDITOR"    && "Inspect evidence and flag compliance issues."}
              {user.role === "ORG_ADMIN"  && "Read-only view of all project transactions."}
              {isDonor                    && `Scoped to ${user.assignedDonorId} projects only.`}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PermissionGate component="txn:export_btn">
              <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                <Download size={14} /> Export CSV
              </button>
            </PermissionGate>
            <PermissionGate component="txn:add_btn">
              <button
                onClick={() => setAddOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 9, border: "none", background: "#0f172a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                <Plus size={14} /> New Transaction
              </button>
            </PermissionGate>
          </div>
        </div>

        <NGOTransactionTable
          transactions={scopedTxns}
          donorScope={user.assignedDonorId as DonorName | null}
          onUploadEvidence={(txn) => setUploadTarget(txn)}
          onEditTransaction={(txn) => setEditTarget(txn)}
          onFlagIssue={(txn) => setFlagTarget(txn)}
        />
      </div>

      <NGOFlagIssueModal
        open={flagTarget !== null} transaction={flagTarget} auditorName={user.fullName}
        onClose={() => setFlagTarget(null)} onSubmit={handleFlagSubmit}
      />
      <UploadEvidenceModal
        open={uploadTarget !== null} transaction={uploadTarget}
        onClose={() => setUploadTarget(null)} onSubmit={handleUploadSubmit}
      />
      <EditTransactionModal
        open={editTarget !== null} transaction={editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={(updated) => setTransactions((p) => p.map((t) => t.id === updated.id ? updated : t))}
      />
      <AddTransactionModal
        open={addOpen}
        createdBy={user.fullName}
        organisationId={user.organisationId ?? "ORG-001"}
        onClose={() => setAddOpen(false)}
        onSubmit={(txn) => setTransactions((p) => [txn, ...p])}
      />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <ProtectedRoute>
      <NGODashboardShell>
        <TransactionsContent />
      </NGODashboardShell>
    </ProtectedRoute>
  );
}



"use client";

/**
 * NGOTransactionTable.tsx — RBAC-aware transaction table.
 *
 * Action cell rendering rules (enforced via PermissionGate + COMPONENT_GATE):
 *   ACCOUNTANT        → Upload Evidence + Edit buttons
 *   AUDITOR           → Flag Compliance Issue button (disabled if already flagged)
 *   ORG_ADMIN         → Read-only status label only
 *   DONOR_REPRESENTATIVE → Read-only status label only (data already scoped upstream)
 *
 * Data isolation for DONOR_REPRESENTATIVE is applied by the parent via
 * useScopedData() — this component receives pre-filtered rows.
 */

import { useState } from "react";
import { Upload, Edit2, Flag, ChevronUp, ChevronDown, Lock } from "lucide-react";
import PermissionGate from "@/components/ngo-dashboard/rbac/PermissionGate";
import { useRBAC } from "@/context/RBACContext";
import type { NGOTransaction, NGORole, NGOTransactionStatus, DonorName } from "@/types/ngo";

interface Props {
  transactions: NGOTransaction[];
  /** Passed for legacy compatibility — RBAC role is read from context */
  role?: NGORole;
  donorScope?: DonorName | null;
  onUploadEvidence: (txn: NGOTransaction) => void;
  onEditTransaction: (txn: NGOTransaction) => void;
  onFlagIssue: (txn: NGOTransaction) => void;
}

type SortKey = "date" | "amount" | "projectName" | "donor" | "status";
type SortDir = "asc" | "desc";

const STATUS_CFG: Record<NGOTransactionStatus, {
  label: string; dot: string; badge: string;
}> = {
  COMPLETED: { label: "Complete", dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  PENDING:   { label: "Pending",  dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200"   },
  FLAGGED:   { label: "Flagged",  dot: "bg-red-500",     badge: "bg-red-50 text-red-700 border-red-200"         },
};

function EvidenceBadge({ txn }: { txn: NGOTransaction }) {
  const cfg = STATUS_CFG[txn.status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {txn.status === "COMPLETED" && `${txn.evidenceCount} file${txn.evidenceCount !== 1 ? "s" : ""}`}
      {txn.status === "PENDING"   && "No evidence"}
      {txn.status === "FLAGGED"   && "⚠ Flagged"}
    </span>
  );
}

function ActionCell({
  txn,
  onUpload,
  onEdit,
  onFlag,
}: {
  txn: NGOTransaction;
  onUpload: () => void;
  onEdit: () => void;
  onFlag: () => void;
}) {
  const { canSee } = useRBAC();

  // ACCOUNTANT — Upload Evidence (primary CTA) + Edit
  if (canSee("txn:upload_btn")) {
    const needsEvidence = txn.status === "PENDING" || txn.status === "FLAGGED";
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={onUpload}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
            needsEvidence
              ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm"
              : "bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
          }`}
        >
          <Upload size={12} />
          {txn.status === "FLAGGED" ? "Re-upload" : "Upload"}
        </button>
        <PermissionGate component="txn:edit_btn">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold transition-colors"
          >
            <Edit2 size={12} /> Edit
          </button>
        </PermissionGate>
      </div>
    );
  }

  // AUDITOR — Flag Compliance Issue (strictly Auditor-only)
  if (canSee("txn:flag_btn")) {
    const alreadyFlagged = txn.status === "FLAGGED";
    return (
      <button
        onClick={onFlag}
        disabled={alreadyFlagged}
        title={alreadyFlagged ? "Already flagged" : "Flag a compliance issue"}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
          alreadyFlagged
            ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
            : "bg-red-50 hover:bg-red-100 text-red-700 border-red-200 cursor-pointer"
        }`}
      >
        <Flag size={12} />
        {alreadyFlagged ? "Flagged" : "Flag Issue"}
      </button>
    );
  }

  // ORG_ADMIN / DONOR_REPRESENTATIVE — read-only status label, no actions
  const cfg = STATUS_CFG[txn.status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function NGOTransactionTable({
  transactions,
  donorScope,
  onUploadEvidence,
  onEditTransaction,
  onFlagIssue,
}: Props) {
  const { user } = useRBAC();

  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filterStatus, setFilterStatus] = useState<NGOTransactionStatus | "ALL">("ALL");
  const [filterDonor,  setFilterDonor]  = useState<DonorName | "ALL">("ALL");
  const [search, setSearch] = useState("");

  // Donor scoping — DONOR_REPRESENTATIVE only sees their donor
  const scopedTxns = donorScope
    ? transactions.filter((t) => t.donor === donorScope)
    : transactions;

  const filtered = scopedTxns.filter((t) => {
    if (filterStatus !== "ALL" && t.status !== filterStatus) return false;
    if (filterDonor  !== "ALL" && t.donor  !== filterDonor)  return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.projectName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.counterparty.toLowerCase().includes(q) ||
        t.budgetLine.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "date")        cmp = a.date.localeCompare(b.date);
    if (sortKey === "amount")      cmp = a.amount - b.amount;
    if (sortKey === "projectName") cmp = a.projectName.localeCompare(b.projectName);
    if (sortKey === "donor")       cmp = a.donor.localeCompare(b.donor);
    if (sortKey === "status")      cmp = a.status.localeCompare(b.status);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const uniqueDonors = Array.from(new Set(scopedTxns.map((t) => t.donor)));
  const totalAmount  = sorted.reduce((s, t) => s + (t.type === "EXPENSE" ? -t.amount : t.amount), 0);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col
      ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
      : <ChevronDown size={12} className="opacity-30" />;

  // Column header label for the action column
  const actionColLabel =
    user.role === "ACCOUNTANT" ? "Actions" :
    user.role === "AUDITOR"    ? "Audit Action" : "Status";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 flex-wrap">
        <input
          className="flex-1 min-w-[200px] px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
          placeholder="Search transactions, projects, counterparties…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <select
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none bg-white cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as NGOTransactionStatus | "ALL")}
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Complete</option>
            <option value="PENDING">Pending</option>
            <option value="FLAGGED">Flagged</option>
          </select>
          {!donorScope && (
            <select
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none bg-white cursor-pointer"
              value={filterDonor}
              onChange={(e) => setFilterDonor(e.target.value as DonorName | "ALL")}
            >
              <option value="ALL">All Donors</option>
              {uniqueDonors.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          )}
        </div>
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
          {sorted.length} transaction{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Donor scope banner */}
      {donorScope && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-violet-50 border-b border-violet-100">
          <Lock size={13} className="text-violet-600 flex-shrink-0" />
          <p className="text-xs font-semibold text-violet-800">
            Viewing transactions scoped to <strong>{donorScope}</strong> only.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">
                ID
              </th>
              {(["projectName", "donor", "amount", "date", "status"] as SortKey[]).map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap cursor-pointer hover:text-slate-700 select-none"
                >
                  <span className="inline-flex items-center gap-1">
                    {col === "projectName" ? "Project" :
                     col === "donor"       ? "Donor"   :
                     col === "amount"      ? "Amount"  :
                     col === "date"        ? "Date"    : "Evidence"}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">
                Budget Line
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">
                {actionColLabel}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">
                  No transactions match your filters.
                </td>
              </tr>
            ) : (
              sorted.map((txn) => (
                <tr
                  key={txn.id}
                  className={`hover:bg-slate-50 transition-colors ${txn.status === "FLAGGED" ? "border-l-2 border-l-red-400" : ""}`}
                >
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-slate-500">{txn.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-slate-900 leading-tight">{txn.projectName}</p>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-[180px] truncate">{txn.description}</p>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100">
                      {txn.donor}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className={`text-sm font-bold ${txn.type === "INCOME" ? "text-emerald-700" : "text-slate-900"}`}>
                      {txn.type === "INCOME" ? "+" : "−"}{txn.currency} {txn.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{txn.paymentMethod.replace("_", " ")}</p>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-xs text-slate-600">
                      {new Date(txn.date).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <EvidenceBadge txn={txn} />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-xs text-slate-500">{txn.budgetLine}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <ActionCell
                      txn={txn}
                      onUpload={() => onUploadEvidence(txn)}
                      onEdit={() => onEditTransaction(txn)}
                      onFlag={() => onFlagIssue(txn)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {sorted.length > 0 && (
            <tfoot>
              <tr className="bg-slate-50">
                <td colSpan={3} className="px-4 py-3 text-xs font-bold text-slate-500">
                  Net total ({sorted.length} transactions)
                </td>
                <td className={`px-4 py-3 text-sm font-bold ${totalAmount >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                  {totalAmount >= 0 ? "+" : ""}RWF {Math.abs(totalAmount).toLocaleString()}
                </td>
                <td colSpan={4} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

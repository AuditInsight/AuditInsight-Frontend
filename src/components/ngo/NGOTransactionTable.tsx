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
  label: string; dotColor: string; badgeColor: string; badgeBg: string; badgeBorder: string;
}> = {
  COMPLETED: { label: "Complete", dotColor: "#1e3a8a", badgeColor: "#1e3a8a", badgeBg: "rgba(30,58,138,0.07)",  badgeBorder: "rgba(30,58,138,0.2)"  },
  PENDING:   { label: "Pending",  dotColor: "#475569", badgeColor: "#475569", badgeBg: "#f1f5f9",              badgeBorder: "#e2e8f0"              },
  FLAGGED:   { label: "Flagged",  dotColor: "#64748b", badgeColor: "#334155", badgeBg: "#f1f5f9",              badgeBorder: "#cbd5e1"              },
};

function EvidenceBadge({ txn }: { txn: NGOTransaction }) {
  const cfg = STATUS_CFG[txn.status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1px solid ${cfg.badgeBorder}`, color: cfg.badgeColor, background: cfg.badgeBg }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dotColor, flexShrink: 0 }} />
      {txn.status === "COMPLETED" && `${txn.evidenceCount} file${txn.evidenceCount !== 1 ? "s" : ""}`}
      {txn.status === "PENDING"   && "No evidence"}
      {txn.status === "FLAGGED"   && "Flagged"}
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
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={onUpload}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${needsEvidence ? "#1e3a8a" : "rgba(30,58,138,0.25)"}`, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: needsEvidence ? "#1e3a8a" : "rgba(30,58,138,0.06)", color: needsEvidence ? "#fff" : "#1e3a8a", transition: "all 0.15s" }}
        >
          <Upload size={12} />
          {txn.status === "FLAGGED" ? "Re-upload" : "Upload"}
        </button>
        <PermissionGate component="txn:edit_btn">
          <button
            onClick={onEdit}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            <Edit2 size={12} /> Edit
          </button>
        </PermissionGate>
      </div>
    );
  }

  // AUDITOR — Flag Compliance Issue
  if (canSee("txn:flag_btn")) {
    const alreadyFlagged = txn.status === "FLAGGED";
    return (
      <button
        onClick={onFlag}
        disabled={alreadyFlagged}
        title={alreadyFlagged ? "Already flagged" : "Flag a compliance issue"}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: alreadyFlagged ? "not-allowed" : "pointer", background: alreadyFlagged ? "#f8fafc" : "#f1f5f9", color: alreadyFlagged ? "#94a3b8" : "#334155", transition: "all 0.15s" }}
      >
        <Flag size={12} />
        {alreadyFlagged ? "Flagged" : "Flag Issue"}
      </button>
    );
  }

  // ORG_ADMIN / DONOR_REPRESENTATIVE — read-only
  const cfg = STATUS_CFG[txn.status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1px solid ${cfg.badgeBorder}`, color: cfg.badgeColor, background: cfg.badgeBg }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dotColor, flexShrink: 0 }} />
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
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap" as const }}>
        <input
          style={{ flex: 1, minWidth: 200, padding: "8px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13.5, color: "#0f172a", outline: "none", fontFamily: "inherit", background: "#f8fafc" }}
          placeholder="Search transactions, projects, counterparties…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select
            style={{ padding: "7px 12px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13, color: "#475569", outline: "none", background: "#f8fafc", cursor: "pointer", fontFamily: "inherit" }}
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
              style={{ padding: "7px 12px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13, color: "#475569", outline: "none", background: "#f8fafc", cursor: "pointer", fontFamily: "inherit" }}
              value={filterDonor}
              onChange={(e) => setFilterDonor(e.target.value as DonorName | "ALL")}
            >
              <option value="ALL">All Donors</option>
              {uniqueDonors.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          )}
        </div>
        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" as const }}>
          {sorted.length} transaction{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Donor scope banner */}
      {donorScope && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "rgba(30,58,138,0.04)", borderBottom: "1px solid rgba(30,58,138,0.1)" }}>
          <Lock size={13} style={{ color: "#1e3a8a", flexShrink: 0 }} />
          <p style={{ fontSize: 12.5, fontWeight: 600, color: "#1e3a8a", margin: 0 }}>
            Viewing transactions scoped to <strong>{donorScope}</strong> only.
          </p>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: "auto" as const }}>
        <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13.5 }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={{ padding: "10px 16px", textAlign: "left" as const, fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.07em", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" as const }}>
                ID
              </th>
              {(["projectName", "donor", "amount", "date", "status"] as SortKey[]).map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  style={{ padding: "10px 16px", textAlign: "left" as const, fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.07em", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" as const, cursor: "pointer", userSelect: "none" as const }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {col === "projectName" ? "Project" :
                     col === "donor"       ? "Donor"   :
                     col === "amount"      ? "Amount"  :
                     col === "date"        ? "Date"    : "Evidence"}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
              <th style={{ padding: "10px 16px", textAlign: "left" as const, fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.07em", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" as const }}>
                Budget Line
              </th>
              <th style={{ padding: "10px 16px", textAlign: "left" as const, fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.07em", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" as const }}>
                {actionColLabel}
              </th>
            </tr>
          </thead>
          <tbody style={{ borderTop: "1px solid #f1f5f9" }}>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: "48px 16px", textAlign: "center" as const, fontSize: 13.5, color: "#94a3b8" }}>
                  No transactions match your filters.
                </td>
              </tr>
            ) : (
              sorted.map((txn) => (
                <tr
                  key={txn.id}
                  style={{ borderBottom: "1px solid #f8fafc", borderLeft: txn.status === "FLAGGED" ? "3px solid #94a3b8" : "3px solid transparent" }}
                >
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" as const }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>{txn.id}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a", margin: 0, lineHeight: 1.3 }}>{txn.projectName}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{txn.description}</p>
                  </td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" as const }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: "rgba(30,58,138,0.07)", color: "#1e3a8a", border: "1px solid rgba(30,58,138,0.15)" }}>
                      {txn.donor}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" as const }}>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                      {txn.type === "INCOME" ? "+" : "−"}{txn.currency} {txn.amount.toLocaleString()}
                    </p>
                    <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "2px 0 0" }}>{txn.paymentMethod.replace("_", " ")}</p>
                  </td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" as const }}>
                    <span style={{ fontSize: 12.5, color: "#475569" }}>
                      {new Date(txn.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <EvidenceBadge txn={txn} />
                  </td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" as const }}>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>{txn.budgetLine}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <ActionCell txn={txn} onUpload={() => onUploadEvidence(txn)} onEdit={() => onEditTransaction(txn)} onFlag={() => onFlagIssue(txn)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {sorted.length > 0 && (
            <tfoot>
              <tr style={{ background: "#f8fafc" }}>
                <td colSpan={3} style={{ padding: "10px 16px", fontSize: 12, fontWeight: 700, color: "#64748b" }}>
                  Net total ({sorted.length} transactions)
                </td>
                <td style={{ padding: "10px 16px", fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>
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

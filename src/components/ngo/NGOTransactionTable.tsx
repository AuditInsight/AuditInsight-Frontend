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
import { Upload, Edit2, Flag, ChevronUp, ChevronDown, Lock, Trash2 } from "lucide-react";
import PermissionGate from "@/components/ngo/rbac/PermissionGate";
import { useRBAC } from "@/context/RBACContext";
import type { NGOTransaction, NGORole, NGOTransactionStatus } from "@/types/ngo";

interface Props {
  transactions: NGOTransaction[];
  /** Passed for legacy compatibility — RBAC role is read from context */
  role?: NGORole;
  donorScope?: string | null;
  onUploadEvidence: (txn: NGOTransaction) => void;
  onEditTransaction: (txn: NGOTransaction) => void;
  onFlagIssue: (txn: NGOTransaction) => void;
  onDeleteTransaction?: (id: string) => void;
}

type SortKey = "date" | "amount" | "projectName" | "status";
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
  onDelete,
}: {
  txn: NGOTransaction;
  onUpload: () => void;
  onEdit: () => void;
  onFlag: () => void;
  onDelete?: () => void;
}) {
  const { canSee } = useRBAC();

  // ACCOUNTANT — Upload Evidence (primary CTA) + Edit + Delete
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
        {onDelete && (
          <PermissionGate component="txn:edit_btn">
            <button
              onClick={() => { if (window.confirm(`Delete transaction ${txn.id}?`)) onDelete(); }}
              title="Delete transaction"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, background: "#fff", color: "#94a3b8", border: "1px solid #e2e8f0", cursor: "pointer" }}
            >
              <Trash2 size={12} />
            </button>
          </PermissionGate>
        )}
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
  onDeleteTransaction,
}: Props) {
  const { user } = useRBAC();

  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = [...transactions].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "date")        cmp = a.date.localeCompare(b.date);
    if (sortKey === "amount")      cmp = a.amount - b.amount;
    if (sortKey === "projectName") cmp = a.projectName.localeCompare(b.projectName);
    if (sortKey === "status")      cmp = a.status.localeCompare(b.status);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalAmount = sorted.reduce((s, t) => s + (t.type === "EXPENSE" ? -t.amount : t.amount), 0);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col
      ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
      : <ChevronDown size={12} className="opacity-30" />;

  const thStyle: React.CSSProperties = { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" };


  // Column header label for the action column
  const actionColLabel =
    user.role === "ACCOUNTANT" ? "Actions" :
    user.role === "AUDITOR"    ? "Audit Action" : "Status";

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}>
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
              {/* ID */}
              <th style={thStyle}>ID</th>
              {/* Date — sortable */}
              <th style={{ ...thStyle, cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("date")}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Date <SortIcon col="date" /></span>
              </th>
              {/* Project — sortable */}
              <th style={{ ...thStyle, cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("projectName")}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Project <SortIcon col="projectName" /></span>
              </th>
              {/* Budget Line */}
              <th style={thStyle}>Budget Line</th>
              {/* Amount — sortable */}
              <th style={{ ...thStyle, cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("amount")}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Amount <SortIcon col="amount" /></span>
              </th>
              {/* Counterparty */}
              <th style={thStyle}>Counterparty</th>
              {/* Status — sortable */}
              <th style={{ ...thStyle, cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("status")}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Status <SortIcon col="status" /></span>
              </th>
              {/* Evidence */}
              <th style={thStyle}>Evidence</th>
              {/* Actions */}
              <th style={thStyle}>{actionColLabel}</th>
            </tr>
          </thead>
          <tbody style={{ borderTop: "1px solid #f1f5f9" }}>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: "48px 16px", textAlign: "center" as const, fontSize: 13.5, color: "#94a3b8" }}>
                  No transactions match your filters.
                </td>
              </tr>
            ) : (
              sorted.map((txn) => (
                <tr
                  key={txn.id}
                  style={{ borderBottom: "1px solid #f8fafc", borderLeft: txn.status === "FLAGGED" ? "3px solid #94a3b8" : "3px solid transparent" }}
                >
                  {/* ID */}
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" as const }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>{txn.id}</span>
                  </td>
                  {/* Date */}
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" as const }}>
                    <span style={{ fontSize: 12.5, color: "#475569" }}>
                      {new Date(txn.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  {/* Project */}
                  <td style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a", margin: 0, lineHeight: 1.3 }}>{txn.projectName}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{txn.description}</p>
                  </td>
                  {/* Budget Line */}
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" as const }}>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>{txn.budgetLine}</span>
                  </td>
                  {/* Amount */}
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" as const }}>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                      {txn.type === "INCOME" ? "+" : "−"}{txn.currency} {txn.amount.toLocaleString()}
                    </p>
                    <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "2px 0 0" }}>{txn.paymentMethod.replace("_", " ")}</p>
                  </td>
                  {/* Counterparty */}
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" as const }}>
                    <span style={{ fontSize: 12.5, color: "#475569" }}>{txn.counterparty}</span>
                  </td>
                  {/* Status */}
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1px solid ${STATUS_CFG[txn.status].badgeBorder}`, color: STATUS_CFG[txn.status].badgeColor, background: STATUS_CFG[txn.status].badgeBg }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_CFG[txn.status].dotColor, flexShrink: 0, display: "inline-block" }} />
                        {STATUS_CFG[txn.status].label}
                      </span>
                    </span>
                  </td>
                  {/* Evidence */}
                  <td style={{ padding: "12px 16px" }}>
                    <EvidenceBadge txn={txn} />
                  </td>
                  {/* Actions */}
                  <td style={{ padding: "12px 16px" }}>
                    <ActionCell txn={txn} onUpload={() => onUploadEvidence(txn)} onEdit={() => onEditTransaction(txn)} onFlag={() => onFlagIssue(txn)} onDelete={onDeleteTransaction ? () => onDeleteTransaction(txn.id) : undefined} />
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
                <td colSpan={5} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}



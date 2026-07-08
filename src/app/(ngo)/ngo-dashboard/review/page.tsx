"use client";

import { useState } from "react";
import NGOPageLayout from "@/components/ngo/NGOPageLayout";
import NGOFlagIssueModal from "@/components/ngo/NGOFlagIssueModal";
import AuditSummaryPanel from "@/components/ngo/rbac/AuditSummaryPanel";
import PermissionGate from "@/components/ngo/rbac/PermissionGate";
import { useNGOToast } from "@/components/ngo/NGOPageLayout";
import { useRBAC } from "@/context/RBACContext";
import { ProtectedRoute } from "@/components/Guards";
import { NGO_TRANSACTIONS, NGO_FLAGS } from "@/mock/ngo.mock";
import type { NGOTransaction, NGOFlag, NGOFlagCategory, FlagSeverity } from "@/types/ngo";
import { theme } from "@/styles/theme";
import { Flag, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

const SEV_CFG = {
  CRITICAL: { color: theme.colors.danger,  bg: theme.colors.dangerBg,  border: "#fecaca" },
  HIGH:     { color: theme.colors.warning, bg: theme.colors.warningBg, border: "#fde68a" },
  MEDIUM:   { color: theme.colors.primary, bg: theme.colors.primarySoft, border: "#bfdbfe" },
  LOW:      { color: theme.colors.success, bg: theme.colors.successBg, border: "#bbf7d0" },
};

function ReviewQueueContent() {
  const { user, can, canSee } = useRBAC();
  const toast = useNGOToast();

  const [transactions, setTransactions] = useState<NGOTransaction[]>(NGO_TRANSACTIONS);
  const [flags, setFlags]               = useState<NGOFlag[]>(NGO_FLAGS);
  const [flagTarget, setFlagTarget]     = useState<NGOTransaction | null>(null);
  const [filter, setFilter]             = useState<"ALL" | "OPEN" | "RESOLVED">("ALL");

  const visibleFlags  = flags.filter((f) => filter === "ALL" || f.status === filter);
  const openCount     = flags.filter((f) => f.status === "OPEN").length;
  const resolvedCount = flags.filter((f) => f.status === "RESOLVED").length;

  const handleFlagSubmit = (flag: { transactionId: string; category: NGOFlagCategory; severity: FlagSeverity; notes: string }) => {
    setFlags((prev) => [...prev, {
      id: `FLAG-${Date.now()}`, transactionId: flag.transactionId,
      projectName: flagTarget?.projectName ?? "", donor: flagTarget?.donor ?? "USAID",
      category: flag.category, severity: flag.severity, notes: flag.notes,
      flaggedBy: user.fullName, flaggedAt: new Date().toISOString(), status: "OPEN",
    }]);
    setTransactions((prev) => prev.map((t) => t.id === flag.transactionId ? { ...t, status: "FLAGGED" as const } : t));
    setFlagTarget(null);
    toast.success("Flag raised", `Transaction ${flag.transactionId} has been flagged.`);
  };

  const resolveFlag = (id: string) => {
    setFlags((prev) => prev.map((f) => f.id === id ? { ...f, status: "RESOLVED" as const, resolvedAt: new Date().toISOString() } : f));
    toast.success("Flag resolved", "The issue has been marked as resolved.");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xl }}>

      {/* Stats */}
      <div style={{ display: "flex", gap: theme.spacing.lg, flexWrap: "wrap" }}>
        {[
          { label: "Open Flags",           value: openCount,                                                color: theme.colors.danger,  icon: <AlertTriangle size={16} /> },
          { label: "Resolved",             value: resolvedCount,                                            color: theme.colors.success, icon: <CheckCircle2 size={16} />  },
          { label: "Pending Review",       value: transactions.filter((t) => t.status === "PENDING").length, color: theme.colors.warning, icon: <Clock size={16} />         },
          { label: "Flagged Transactions", value: transactions.filter((t) => t.status === "FLAGGED").length, color: "#7c3aed",            icon: <Flag size={16} />          },
        ].map(({ label, value, color, icon }) => (
          <div key={label} style={{ flex: 1, minWidth: 140, background: theme.colors.Surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.lg, padding: theme.spacing.lg, boxShadow: theme.shadows.sm }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: theme.typography.sm, color: theme.colors.textSecondary, fontWeight: 500 }}>{label}</span>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
            </div>
            <div style={{ fontSize: theme.typography.xxl, fontWeight: 700, color: theme.colors.textPrimary, letterSpacing: "-0.5px", lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* AUDITOR summary panel */}
      <PermissionGate component="panel:audit_summary">
        <AuditSummaryPanel transactions={transactions} flags={flags} auditorName={user.fullName} />
      </PermissionGate>

      {/* Flags list */}
      <div style={{ background: theme.colors.Surface, borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.md, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${theme.colors.divider}`, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: theme.colors.dangerBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={15} style={{ color: theme.colors.danger }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: theme.typography.md, fontWeight: 700, color: theme.colors.textPrimary }}>Audit Flags</p>
              <p style={{ margin: "2px 0 0", fontSize: theme.typography.xs, color: theme.colors.textMuted }}>{openCount} open · {resolvedCount} resolved</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["ALL", "OPEN", "RESOLVED"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: theme.radius.sm, border: `1px solid ${filter === f ? theme.colors.primary : theme.colors.border}`, background: filter === f ? theme.colors.primary : theme.colors.Surface, color: filter === f ? "#fff" : theme.colors.textSecondary, fontSize: theme.typography.sm, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {visibleFlags.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 24px", gap: 10 }}>
            <CheckCircle2 size={32} style={{ color: theme.colors.success }} />
            <p style={{ margin: 0, fontSize: theme.typography.md, fontWeight: 600, color: theme.colors.textPrimary }}>No flags in this view</p>
            <p style={{ margin: 0, fontSize: theme.typography.sm, color: theme.colors.textMuted }}>All clear for the selected filter.</p>
          </div>
        ) : (
          <div>
            {visibleFlags.map((flag) => {
              const cfg = SEV_CFG[flag.severity];
              return (
                <div key={flag.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px", borderBottom: `1px solid ${theme.colors.divider}`, borderLeft: `3px solid ${cfg.color}` }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: theme.typography.xs, fontWeight: 700, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>{flag.severity}</span>
                      <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: theme.typography.xs, fontWeight: 600, background: theme.colors.primarySoft, color: theme.colors.primary, border: `1px solid ${theme.colors.border}` }}>{flag.donor}</span>
                      <span style={{ fontSize: theme.typography.xs, color: theme.colors.textMuted }}>{new Date(flag.flaggedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      {flag.status === "RESOLVED" && (
                        <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: theme.typography.xs, fontWeight: 700, color: theme.colors.success, background: theme.colors.successBg, border: `1px solid #bbf7d0` }}>Resolved</span>
                      )}
                    </div>
                    <p style={{ margin: "0 0 4px", fontSize: theme.typography.md, fontWeight: 700, color: theme.colors.textPrimary }}>{flag.category}</p>
                    <p style={{ margin: "0 0 6px", fontSize: theme.typography.sm, color: theme.colors.textMuted }}>{flag.transactionId} · {flag.projectName} · Flagged by {flag.flaggedBy}</p>
                    <p style={{ margin: 0, fontSize: theme.typography.sm, color: theme.colors.textSecondary, lineHeight: theme.typography.lineHeight.relaxed }}>{flag.notes}</p>
                  </div>
                  {flag.status === "OPEN" && can("flag:resolve") && (
                    <button onClick={() => resolveFlag(flag.id)} style={{ flexShrink: 0, padding: "7px 16px", borderRadius: theme.radius.md, border: "none", background: theme.colors.success, color: "#fff", fontSize: theme.typography.sm, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      Mark Resolved
                    </button>
                  )}
                  {flag.status === "OPEN" && !can("flag:resolve") && (
                    <span style={{ flexShrink: 0, fontSize: theme.typography.xs, color: theme.colors.textMuted, paddingTop: 4 }}>Awaiting resolution</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending transactions table */}
      <div style={{ background: theme.colors.Surface, borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.md, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.colors.divider}` }}>
          <p style={{ margin: 0, fontSize: theme.typography.md, fontWeight: 700, color: theme.colors.textPrimary }}>Transactions Awaiting Review</p>
          <p style={{ margin: "3px 0 0", fontSize: theme.typography.sm, color: theme.colors.textMuted }}>Transactions with missing evidence or pending status.</p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: theme.typography.sm }}>
            <thead>
              <tr style={{ background: theme.colors.appBackground }}>
                {["ID", "Project", "Donor", "Amount", "Date", "Issue", "Action"].map((h) => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: theme.typography.xs, fontWeight: 700, color: theme.colors.textMuted, letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: `1px solid ${theme.colors.border}`, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.filter((t) => t.status !== "COMPLETED").map((txn) => (
                <tr key={txn.id} style={{ borderBottom: `1px solid ${theme.colors.divider}` }}>
                  <td style={{ padding: "13px 16px" }}><span style={{ fontFamily: "monospace", fontSize: theme.typography.xs, fontWeight: 700, color: theme.colors.textMuted }}>{txn.id}</span></td>
                  <td style={{ padding: "13px 16px", fontWeight: 600, color: theme.colors.textPrimary }}>{txn.projectName}</td>
                  <td style={{ padding: "13px 16px" }}><span style={{ padding: "3px 10px", borderRadius: 999, fontSize: theme.typography.xs, fontWeight: 700, background: theme.colors.primarySoft, color: theme.colors.primary, border: `1px solid ${theme.colors.border}` }}>{txn.donor}</span></td>
                  <td style={{ padding: "13px 16px", fontWeight: 700, color: theme.colors.textPrimary, whiteSpace: "nowrap" }}>RWF {txn.amount.toLocaleString()}</td>
                  <td style={{ padding: "13px 16px", fontSize: theme.typography.xs, color: theme.colors.textSecondary, whiteSpace: "nowrap" }}>{new Date(txn.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
                  <td style={{ padding: "13px 16px" }}><span style={{ fontSize: theme.typography.sm, fontWeight: 600, color: txn.status === "FLAGGED" ? theme.colors.danger : theme.colors.warning }}>{txn.status === "FLAGGED" ? "⚠ Flagged" : "No evidence"}</span></td>
                  <td style={{ padding: "13px 16px" }}>
                    {txn.status !== "FLAGGED" && canSee("txn:flag_btn") && (
                      <button onClick={() => setFlagTarget(txn)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: theme.radius.sm, border: `1px solid #fecaca`, background: theme.colors.dangerBg, color: theme.colors.danger, fontSize: theme.typography.sm, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        <Flag size={12} /> Flag Issue
                      </button>
                    )}
                    {txn.status === "FLAGGED" && <span style={{ fontSize: theme.typography.sm, fontWeight: 600, color: theme.colors.danger }}>⚠ Flagged</span>}
                    {txn.status !== "FLAGGED" && !canSee("txn:flag_btn") && <span style={{ color: theme.colors.textMuted }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NGOFlagIssueModal open={flagTarget !== null} transaction={flagTarget} auditorName={user.fullName} onClose={() => setFlagTarget(null)} onSubmit={handleFlagSubmit} />
    </div>
  );
}

export default function ReviewQueuePage() {
  return (
    <ProtectedRoute>
      <NGOPageLayout pageTitle="Review Queue" pageSub="Inspect transactions, flag compliance issues, and track resolutions.">
        <ReviewQueueContent />
      </NGOPageLayout>
    </ProtectedRoute>
  );
}



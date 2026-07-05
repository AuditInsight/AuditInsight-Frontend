"use client";

import { useState } from "react";
import NGOPageLayout from "@/components/ngo-dashboard/NGOPageLayout";
import NGOFlagIssueModal from "@/components/ngo-dashboard/NGOFlagIssueModal";
import AuditSummaryPanel from "@/components/ngo-dashboard/rbac/AuditSummaryPanel";
import PermissionGate from "@/components/ngo-dashboard/rbac/PermissionGate";
import { useNGOToast } from "@/components/ngo-dashboard/NGOPageLayout";
import { useRBAC } from "@/context/RBACContext";
import { ProtectedRoute } from "@/components/Guards";
import { NGO_TRANSACTIONS, NGO_FLAGS } from "@/mock/ngo.mock";
import type { NGOTransaction, NGOFlag, NGOFlagCategory, FlagSeverity } from "@/types/ngo";
import { Flag, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

const SEV_CFG = {
  CRITICAL: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  HIGH:     { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  MEDIUM:   { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  LOW:      { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
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

  const handleFlagSubmit = (flag: {
    transactionId: string; category: NGOFlagCategory;
    severity: FlagSeverity; notes: string;
  }) => {
    setFlags((prev) => [...prev, {
      id: `FLAG-${Date.now()}`,
      transactionId: flag.transactionId,
      projectName: flagTarget?.projectName ?? "",
      donor: flagTarget?.donor ?? "USAID",
      category: flag.category,
      severity: flag.severity,
      notes: flag.notes,
      flaggedBy: user.fullName,
      flaggedAt: new Date().toISOString(),
      status: "OPEN",
    }]);
    setTransactions((prev) =>
      prev.map((t) => t.id === flag.transactionId ? { ...t, status: "FLAGGED" as const } : t)
    );
    setFlagTarget(null);
    toast.success("Flag raised", `Transaction ${flag.transactionId} has been flagged.`);
  };

  const resolveFlag = (id: string) => {
    setFlags((prev) =>
      prev.map((f) => f.id === id ? { ...f, status: "RESOLVED" as const, resolvedAt: new Date().toISOString() } : f)
    );
    toast.success("Flag resolved", "The issue has been marked as resolved.");
  };

  return (
    <>
      {/* Stats strip */}
      <div className="flex gap-4 flex-wrap">
        {[
          { label: "Open Flags",           value: openCount,                                              color: "#dc2626", icon: <AlertTriangle size={16} /> },
          { label: "Resolved",             value: resolvedCount,                                          color: "#16a34a", icon: <CheckCircle2 size={16} /> },
          { label: "Pending Review",       value: transactions.filter((t) => t.status === "PENDING").length, color: "#d97706", icon: <Clock size={16} /> },
          { label: "Flagged Transactions", value: transactions.filter((t) => t.status === "FLAGGED").length, color: "#7c3aed", icon: <Flag size={16} /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="flex-1 min-w-[130px] bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">{label}</span>
              <span style={{ color }}>{icon}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
          </div>
        ))}
      </div>

      {/* AUDITOR: Review Queue Summary panel */}
      <PermissionGate component="panel:audit_summary">
        <AuditSummaryPanel
          transactions={transactions}
          flags={flags}
          auditorName={user.fullName}
        />
      </PermissionGate>

      {/* Flags list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 flex-wrap">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <ShieldCheck size={15} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">Audit Flags</p>
              <p className="text-xs text-slate-400 mt-0.5">{openCount} open · {resolvedCount} resolved</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {(["ALL", "OPEN", "RESOLVED"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer font-[inherit] ${
                  filter === f
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {visibleFlags.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <CheckCircle2 size={32} className="text-emerald-500" />
            <p className="text-sm font-semibold text-slate-700">No flags in this view</p>
            <p className="text-xs text-slate-400">All clear for the selected filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {visibleFlags.map((flag) => {
              const cfg = SEV_CFG[flag.severity];
              return (
                <div
                  key={flag.id}
                  className="px-5 py-4 hover:bg-slate-50 transition-colors"
                  style={{ borderLeft: `3px solid ${cfg.color}` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                          style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
                        >
                          {flag.severity}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-100">
                          {flag.donor}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(flag.flaggedAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                        {flag.status === "RESOLVED" && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-900 mb-1">{flag.category}</p>
                      <p className="text-xs text-slate-500 mb-1.5">
                        {flag.transactionId} · {flag.projectName} · Flagged by {flag.flaggedBy}
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">{flag.notes}</p>
                    </div>

                    {/* ORG_ADMIN: Resolve button — gated by flag:resolve permission */}
                    {flag.status === "OPEN" && can("flag:resolve") && (
                      <button
                        onClick={() => resolveFlag(flag.id)}
                        className="flex-shrink-0 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}

                    {/* Read-only label for AUDITOR / others */}
                    {flag.status === "OPEN" && !can("flag:resolve") && (
                      <span className="flex-shrink-0 text-xs text-slate-400 font-medium pt-1">
                        Awaiting resolution
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transactions pending review */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="text-sm font-bold text-slate-900">Transactions Awaiting Review</p>
          <p className="text-xs text-slate-400 mt-0.5">Transactions with missing evidence or pending status.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50">
              <tr>
                {["ID", "Project", "Donor", "Amount", "Date", "Issue", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.filter((t) => t.status !== "COMPLETED").map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs font-bold text-slate-500">{txn.id}</span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">{txn.projectName}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100">
                      {txn.donor}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                    RWF {txn.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(txn.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-semibold ${txn.status === "FLAGGED" ? "text-red-600" : "text-amber-600"}`}>
                      {txn.status === "FLAGGED" ? "⚠ Flagged" : "No evidence"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {/* AUDITOR only: Flag Issue button */}
                    {txn.status !== "FLAGGED" && canSee("txn:flag_btn") && (
                      <button
                        onClick={() => setFlagTarget(txn)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors"
                      >
                        <Flag size={12} /> Flag Issue
                      </button>
                    )}
                    {txn.status === "FLAGGED" && (
                      <span className="text-xs font-semibold text-red-500">⚠ Flagged</span>
                    )}
                    {txn.status !== "FLAGGED" && !canSee("txn:flag_btn") && (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NGOFlagIssueModal
        open={flagTarget !== null}
        transaction={flagTarget}
        auditorName={user.fullName}
        onClose={() => setFlagTarget(null)}
        onSubmit={handleFlagSubmit}
      />
    </>
  );
}

export default function ReviewQueuePage() {
  return (
    <ProtectedRoute>
      <NGOPageLayout
        pageTitle="Review Queue"
        pageSub="Inspect transactions, flag compliance issues, and track resolutions."
      >
        <ReviewQueueContent />
      </NGOPageLayout>
    </ProtectedRoute>
  );
}

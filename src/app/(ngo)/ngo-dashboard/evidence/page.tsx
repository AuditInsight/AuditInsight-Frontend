"use client";

import { useState } from "react";
import NGODashboardShell from "@/components/ngo/dashboard/NGODashboardShell";
import UploadEvidenceModal from "@/components/ngo/UploadEvidenceModal";
import PermissionGate from "@/components/ngo/rbac/PermissionGate";
import { useRBAC, useScopedData } from "@/context/RBACContext";
import { ProtectedRoute } from "@/components/Guards";
import type { NGOTransaction, DonorName } from "@/types/ngo";
import { NGO_TRANSACTIONS } from "@/mock/ngo.mock";
import { Upload, FileText, CheckCircle2, AlertTriangle, Clock, Search, Lock } from "lucide-react";
import NGOPageHeader from "@/components/ngo/dashboard/NGOPageHeader";
import NGOStatCard from "@/components/ngo/dashboard/NGOStatCard";
import NGOEmptyState from "@/components/ngo/dashboard/NGOEmptyState";

const STATUS_CFG = {
  COMPLETED: { label: "Verified", color: "#1e3a8a", bg: "rgba(30,58,138,0.07)", border: "rgba(30,58,138,0.2)" },
  PENDING:   { label: "Pending",  color: "#475569", bg: "#f1f5f9",              border: "#e2e8f0"              },
  FLAGGED:   { label: "Flagged",  color: "#334155", bg: "#f1f5f9",              border: "#cbd5e1"              },
};

function EvidenceContent() {
  const { user, can } = useRBAC();

  const [transactions, setTransactions] = useState<NGOTransaction[]>(NGO_TRANSACTIONS);
  const [uploadTarget, setUploadTarget] = useState<NGOTransaction | null>(null);
  const [search,       setSearch]       = useState("");

  const scoped   = useScopedData(transactions, (t) => t.donor);
  const filtered = scoped.filter((t) =>
    !search ||
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.projectName.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalFiles    = scoped.reduce((s, t) => s + t.evidenceCount, 0);
  const verified      = scoped.filter((t) => t.status === "COMPLETED").length;
  const flaggedCount  = scoped.filter((t) => t.status === "FLAGGED").length;
  const pendingUpload = scoped.filter((t) => t.evidenceCount === 0).length;
  const isDonor       = user.role === "DONOR_REPRESENTATIVE";
  const canUpload     = can("evidence:upload");

  const handleUploadSubmit = (transactionId: string, fileCount: number) => {
    setTransactions((p) => p.map((t) =>
      t.id === transactionId ? { ...t, status: "COMPLETED" as const, evidenceCount: t.evidenceCount + fileCount } : t
    ));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <NGOPageHeader title="Evidence Vault" subtitle="Manage and verify supporting documents for all transactions." />

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <NGOStatCard label="Total Files"      value={totalFiles}    accent="#1e3a8a" icon={<FileText size={16} />}      />
        <NGOStatCard label="Verified Records" value={verified}      accent="#2563eb" icon={<CheckCircle2 size={16} />}  />
        <NGOStatCard label="Flagged Records"  value={flaggedCount}  accent="#475569" icon={<AlertTriangle size={16} />} />
        <NGOStatCard label="Pending Upload"   value={pendingUpload} accent="#64748b" icon={<Clock size={16} />}         />
      </div>

      {/* Upload drop zone — ACCOUNTANT only */}
      <PermissionGate component="evidence:upload_zone">
        <div
          style={{ background: "#fff", borderRadius: 14, border: "2px dashed #e2e8f0", padding: "36px 24px", textAlign: "center", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", cursor: "default" }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#1e3a8a" }}>
            <Upload size={22} />
          </div>
          <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Upload Evidence Documents</p>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: "#64748b" }}>Select a transaction below and click <strong>Upload</strong> to attach supporting documents.</p>
        </div>
      </PermissionGate>

      {/* Read-only notice */}
      {!canUpload && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <Lock size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "#64748b" }}>
            {isDonor
              ? `Read-only access to ${user.assignedDonorId} evidence records.`
              : "You have read-only access to evidence records."}
          </span>
        </div>
      )}

      {/* Evidence table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <Search size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by transaction ID, project, description…"
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#0f172a", fontFamily: "inherit", width: "100%" }}
            />
          </div>
          <span style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>{filtered.length} records</span>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                {["Transaction", "Project", "Donor", "Budget Line", "Files", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><NGOEmptyState icon={<FileText size={24} />} title="No evidence records match your search." subtitle="Try adjusting your search terms." /></td></tr>
              ) : filtered.map((txn) => {
                const cfg = STATUS_CFG[txn.status];
                return (
                  <tr key={txn.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>{txn.id}</span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{txn.projectName}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{txn.description}</p>
                    </td>
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: "rgba(30,58,138,0.07)", color: "#1e3a8a", border: "1px solid rgba(30,58,138,0.15)" }}>{txn.donor}</span>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>{txn.budgetLine}</td>
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#475569" }}>
                        <FileText size={13} style={{ color: "#94a3b8" }} />
                        {txn.evidenceCount} file{txn.evidenceCount !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <PermissionGate component="evidence:upload_btn">
                        <button
                          onClick={() => setUploadTarget(txn)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: `1px solid ${txn.status !== "COMPLETED" ? "#1e3a8a" : "rgba(30,58,138,0.25)"}`, background: txn.status !== "COMPLETED" ? "#1e3a8a" : "rgba(30,58,138,0.06)", color: txn.status !== "COMPLETED" ? "#fff" : "#1e3a8a", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                        >
                          <Upload size={12} />
                          {txn.status === "FLAGGED" ? "Re-upload" : txn.status === "COMPLETED" ? "Add More" : "Upload"}
                        </button>
                      </PermissionGate>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <UploadEvidenceModal
        open={uploadTarget !== null}
        transaction={uploadTarget}
        onClose={() => setUploadTarget(null)}
        onSubmit={handleUploadSubmit}
      />
    </div>
  );
}

export default function EvidencePage() {
  return (
    <ProtectedRoute>
      <NGODashboardShell>
        <EvidenceContent />
      </NGODashboardShell>
    </ProtectedRoute>
  );
}



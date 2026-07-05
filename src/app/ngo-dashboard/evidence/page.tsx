"use client";

import { useState } from "react";
import NGOPageLayout from "@/components/ngo-dashboard/NGOPageLayout";
import { useNGOToast } from "@/components/ngo-dashboard/NGOPageLayout";
import PermissionGate from "@/components/ngo-dashboard/rbac/PermissionGate";
import DonorScopeBanner from "@/components/ngo-dashboard/rbac/DonorScopeBanner";
import { useRBAC, useScopedData } from "@/context/RBACContext";
import { ProtectedRoute } from "@/components/Guards";
import { NGO_TRANSACTIONS } from "@/mock/ngo.mock";
import {
  Upload, FileText, CheckCircle2, AlertTriangle,
  Clock, Search, Eye, Lock,
} from "lucide-react";

const STATUS_CFG = {
  COMPLETED: { label: "Verified", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  PENDING:   { label: "Pending",  color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  FLAGGED:   { label: "Flagged",  color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

function EvidenceContent() {
  const { user, canSee, can } = useRBAC();
  const toast = useNGOToast();
  const [search, setSearch] = useState("");

  // Strict donor scope isolation — DONOR_REPRESENTATIVE sees only their rows
  const allWithEvidence = NGO_TRANSACTIONS.filter((t) => t.evidenceCount > 0);
  const scoped = useScopedData(allWithEvidence, (t) => t.donor);

  const rows = scoped.map((t) => ({
    id: t.id, project: t.projectName, donor: t.donor,
    description: t.description, date: t.date,
    files: t.evidenceCount, status: t.status, budgetLine: t.budgetLine,
  }));

  const filtered = rows.filter((e) =>
    !search ||
    e.project.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalFiles   = rows.reduce((s, e) => s + e.files, 0);
  const verified     = rows.filter((e) => e.status === "COMPLETED").length;
  const flaggedCount = rows.filter((e) => e.status === "FLAGGED").length;
  const pendingUpload = NGO_TRANSACTIONS.filter((t) => t.evidenceCount === 0).length;

  const isDonor = user.role === "DONOR_REPRESENTATIVE";

  return (
    <>
      {/* DONOR_REPRESENTATIVE: scope isolation banner */}
      {isDonor && user.assignedDonorId && (
        <DonorScopeBanner donorName={user.assignedDonorId} />
      )}

      {/* Stats strip */}
      <div className="flex gap-4 flex-wrap">
        {[
          { label: "Total Files",      value: totalFiles,    color: "#1e3a8a", icon: <FileText size={16} />     },
          { label: "Verified Records", value: verified,      color: "#16a34a", icon: <CheckCircle2 size={16} /> },
          { label: "Flagged Records",  value: flaggedCount,  color: "#dc2626", icon: <AlertTriangle size={16} />},
          { label: "Pending Upload",   value: pendingUpload, color: "#d97706", icon: <Clock size={16} />        },
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

      {/* Upload drop zone — ACCOUNTANT only (evidence:upload_zone) */}
      <PermissionGate component="evidence:upload_zone">
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <Upload size={22} className="text-blue-700" />
          </div>
          <p className="text-sm font-bold text-slate-900 mb-1">Upload Evidence Documents</p>
          <p className="text-xs text-slate-500 mb-4">
            Drag &amp; drop files here, or click to browse. Supports PDF, JPG, PNG, XLSX.
          </p>
          <button
            onClick={() => toast.warning("Coming soon", "File browser will be available once connected to storage.")}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
          >
            Browse Files
          </button>
        </div>
      </PermissionGate>

      {/* Read-only notice for non-upload roles */}
      {!can("evidence:upload") && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
          <Lock size={14} className="text-slate-400 flex-shrink-0" />
          <p className="text-xs text-slate-500 font-medium">
            {isDonor
              ? `You have read-only access to ${user.assignedDonorId} evidence records. Upload and delete actions are disabled.`
              : "You have read-only access to evidence records. Upload and delete actions are disabled for your role."}
          </p>
        </div>
      )}

      {/* Evidence table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100">
          <div className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <Search size={13} className="text-slate-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search evidence records…"
              className="border-none bg-transparent outline-none text-sm text-slate-900 placeholder-slate-400 w-full font-[inherit]"
            />
          </div>
          {/* ACCOUNTANT: Upload new evidence button in toolbar */}
          <PermissionGate component="evidence:upload_btn">
            <button
              onClick={() => toast.success("Upload ready", "Select a file to attach.")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
            >
              <Upload size={14} /> Upload Evidence
            </button>
          </PermissionGate>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50">
              <tr>
                {["Transaction", "Project", "Donor", "Budget Line", "Files", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-sm text-slate-400">
                    No evidence records match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => {
                  const cfg = STATUS_CFG[e.status as keyof typeof STATUS_CFG];
                  return (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-slate-500">{e.id}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-slate-900 leading-tight">{e.project}</p>
                        <p className="text-xs text-slate-400 mt-0.5 max-w-[180px] truncate">{e.description}</p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100">
                          {e.donor}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{e.budgetLine}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                          <FileText size={13} className="text-slate-400" />
                          {e.files} file{e.files !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-semibold border"
                          style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {/* View — all roles */}
                          <button
                            onClick={() => toast.success("Opening file", `Viewing evidence for ${e.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold transition-colors"
                          >
                            <Eye size={12} /> View
                          </button>

                          {/* Upload — ACCOUNTANT only */}
                          <PermissionGate component="evidence:upload_btn">
                            <button
                              onClick={() => toast.success("Upload ready", `Select a file to attach to ${e.id}`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold transition-colors"
                            >
                              <Upload size={12} /> Upload
                            </button>
                          </PermissionGate>

                          {/* Delete — nobody (evidence:delete_btn maps to [] in COMPONENT_GATE) */}
                          {/* Intentionally omitted — hard disabled for all roles */}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function EvidencePage() {
  return (
    <ProtectedRoute>
      <NGOPageLayout
        pageTitle="Evidence Vault"
        pageSub="Manage and verify supporting documents for all transactions."
      >
        <EvidenceContent />
      </NGOPageLayout>
    </ProtectedRoute>
  );
}

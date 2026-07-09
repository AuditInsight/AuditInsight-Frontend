"use client";

import NGODashboardShell from "@/components/ngo/dashboard/NGODashboardShell";
import NGOPageHeader from "@/components/ngo/dashboard/NGOPageHeader";
import NGOStatCard from "@/components/ngo/dashboard/NGOStatCard";
import NGOEmptyState from "@/components/ngo/dashboard/NGOEmptyState";
import { ProtectedRoute } from "@/components/Guards";
import { NGO_TRANSACTIONS, NGO_FLAGS } from "@/mock/ngo.mock";
import { FileText, Download, BarChart3, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";

const REPORTS = [
  { id: "R-001", name: "Q1 2024 Financial Summary",    type: "Financial",   date: "2024-04-01", status: "Ready",   size: "2.4 MB" },
  { id: "R-002", name: "USAID Grant Utilisation",       type: "Donor",       date: "2024-03-15", status: "Ready",   size: "1.8 MB" },
  { id: "R-003", name: "Evidence Compliance Audit",     type: "Compliance",  date: "2024-03-10", status: "Ready",   size: "3.1 MB" },
  { id: "R-004", name: "GIZ Project Expenditure",       type: "Donor",       date: "2024-02-28", status: "Ready",   size: "1.2 MB" },
  { id: "R-005", name: "Annual Audit Trail 2023",       type: "Audit",       date: "2024-01-31", status: "Ready",   size: "5.6 MB" },
  { id: "R-006", name: "Q2 2024 Financial Summary",     type: "Financial",   date: "2024-07-01", status: "Pending", size: "—"      },
];

const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  Financial:  { color: "#1e3a8a", bg: "rgba(30,58,138,0.08)"  },
  Donor:      { color: "#2563eb", bg: "rgba(37,99,235,0.08)"  },
  Compliance: { color: "#475569", bg: "#f1f5f9"               },
  Audit:      { color: "#64748b", bg: "#f8fafc"               },
};

function ReportsContent() {
  const totalTxns    = NGO_TRANSACTIONS.length;
  const openFlags    = NGO_FLAGS.filter((f) => f.status === "OPEN").length;
  const completedPct = Math.round((NGO_TRANSACTIONS.filter((t) => t.status === "COMPLETED").length / totalTxns) * 100);
  const readyReports = REPORTS.filter((r) => r.status === "Ready").length;

  const handleDownload = (report: typeof REPORTS[0]) => {
    const content = `Report: ${report.name}\nType: ${report.type}\nDate: ${report.date}\nStatus: ${report.status}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${report.id}-${report.name.replace(/\s+/g, "-")}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <NGOPageHeader title="Reports" subtitle="Download financial summaries, donor reports, and compliance audits." />

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <NGOStatCard label="Available Reports" value={readyReports}      accent="#1e3a8a" icon={<FileText size={16} />}      />
        <NGOStatCard label="Compliance Rate"   value={`${completedPct}%`} accent="#2563eb" icon={<CheckCircle2 size={16} />}  />
        <NGOStatCard label="Open Flags"        value={openFlags}          accent="#475569" icon={<AlertTriangle size={16} />} />
        <NGOStatCard label="Total Transactions" value={totalTxns}         accent="#64748b" icon={<TrendingUp size={16} />}    />
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1e3a8a" }}>
            <BarChart3 size={16} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Generated Reports</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>{readyReports} ready to download</p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                {["Report", "Type", "Generated", "Size", "Status", "Action"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REPORTS.length === 0 ? (
                <tr><td colSpan={6}><NGOEmptyState icon={<FileText size={24} />} title="No reports yet" subtitle="Reports will appear here once generated." /></td></tr>
              ) : REPORTS.map((report) => {
                const tc = TYPE_COLORS[report.type] ?? { color: "#64748b", bg: "#f8fafc" };
                return (
                  <tr key={report.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", flexShrink: 0 }}>
                          <FileText size={14} />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{report.name}</p>
                          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{report.id}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: tc.color, background: tc.bg, border: `1px solid ${tc.color}22` }}>{report.type}</span>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>{report.date}</td>
                    <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#64748b" }}>{report.size}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: report.status === "Ready" ? "#15803d" : "#d97706", background: report.status === "Ready" ? "#f0fdf4" : "#fffbeb", border: `1px solid ${report.status === "Ready" ? "#bbf7d0" : "#fde68a"}` }}>
                        {report.status}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      {report.status === "Ready" ? (
                        <button
                          onClick={() => handleDownload(report)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "1px solid #1e3a8a", background: "#1e3a8a", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                        >
                          <Download size={12} /> Download
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>Generating…</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <NGODashboardShell>
        <ReportsContent />
      </NGODashboardShell>
    </ProtectedRoute>
  );
}

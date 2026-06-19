"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { Download, ChevronDown } from "lucide-react";
import { EvidenceDropdown } from "@/components/evidence/EvidenceDropdown";
import { MOCK_REVIEW_QUEUE } from "@/mock/reviewQueue.mock";
import { MOCK_TRANSACTIONS } from "@/mock/transactions.mock";

interface Props {
  severity: string;
  setSeverity: (value: string) => void;
  dateFrom?: string;
  setDateFrom?: (v: string) => void;
  dateTo?: string;
  setDateTo?: (v: string) => void;
}

function getFiltered(severity: string, dateFrom: string, dateTo: string) {
  return MOCK_REVIEW_QUEUE.filter((r) => {
    if (severity !== "All" && r.risk !== severity) return false;
    if (dateFrom && r.due < dateFrom) return false;
    if (dateTo && r.due > dateTo) return false;
    return true;
  });
}

function exportCSV(severity: string, dateFrom: string, dateTo: string) {
  const rows = getFiltered(severity, dateFrom, dateTo);
  const header = "ID,Transaction,Counterparty,Amount,Severity,Type,Status,Due";
  const lines = rows.map((r) =>
    `${r.id},${r.transactionId},${r.counterparty ?? ""},${r.amount ?? ""},${r.severity},${r.type},${r.status},${r.due}`
  );
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `audit-report-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

function exportPDF(severity: string, dateFrom: string, dateTo: string) {
  const rows = getFiltered(severity, dateFrom, dateTo);
  const txTotal = MOCK_TRANSACTIONS.length;
  const criticals = rows.filter((r) => r.risk === "Critical").length;
  const filterLabel = `Severity: ${severity}${dateFrom ? " | From: " + dateFrom : ""}${dateTo ? " | To: " + dateTo : ""}`;
  const rowsHtml = rows.map((r) =>
    `<tr>
      <td>${r.transactionId}</td>
      <td>${r.counterparty ?? ""}</td>
      <td>${r.amount ?? ""}</td>
      <td><span class="badge ${(r.risk ?? "").toLowerCase()}">${r.risk}</span></td>
      <td>${r.type}</td>
      <td>${r.status}</td>
      <td>${r.due}</td>
    </tr>`
  ).join("");
  const html = `<html><head><title>Audit Report</title>
    <style>
      body{font-family:Arial,sans-serif;padding:32px;color:#111}
      h1{color:#0f172a;margin-bottom:4px}
      p{margin:0 0 16px;color:#64748b;font-size:13px}
      .stats{display:flex;gap:40px;margin:20px 0;padding:16px;background:#f8fafc;border-radius:8px}
      .stat strong{display:block;font-size:11px;color:#64748b;text-transform:uppercase;margin-bottom:4px}
      .stat span{font-size:26px;font-weight:800;color:#0f172a}
      table{width:100%;border-collapse:collapse;margin-top:20px}
      th,td{text-align:left;padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px}
      th{background:#f1f5f9;font-weight:600;color:#374151}
      .badge{padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700}
      .critical{background:#fee2e2;color:#dc2626}
      .medium{background:#fef3c7;color:#d97706}
      .low{background:#dcfce7;color:#15803d}
    </style></head><body>
    <h1>AuditInsight — Compliance Report</h1>
    <p>Generated: ${new Date().toLocaleString()} &nbsp;|&nbsp; ${filterLabel}</p>
    <div class="stats">
      <div class="stat"><strong>Total Transactions</strong><span>${txTotal}</span></div>
      <div class="stat"><strong>Flagged Issues</strong><span style="color:#dc2626">${rows.length}</span></div>
      <div class="stat"><strong>Critical</strong><span style="color:#dc2626">${criticals}</span></div>
      <div class="stat"><strong>Resolved</strong><span style="color:#16a34a">${rows.filter((r) => r.status === "Resolved").length}</span></div>
    </div>
    <table><thead><tr>
      <th>Transaction</th><th>Counterparty</th><th>Amount</th>
      <th>Severity</th><th>Type</th><th>Status</th><th>Due</th>
    </tr></thead><tbody>${rowsHtml}</tbody></table>
    </body></html>`;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

export default function ReportsToolbar({
  severity, setSeverity,
  dateFrom = "", setDateFrom,
  dateTo = "", setDateTo,
}: Props) {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.filters}>
        <input placeholder="Search reports..." style={styles.search} />
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom?.(e.target.value)} style={styles.input} />
        <input type="date" value={dateTo} onChange={(e) => setDateTo?.(e.target.value)} style={styles.input} />
        <EvidenceDropdown
          label={severity}
          options={["All", "Critical", "Medium", "Low"]}
          onChange={setSeverity}
        />
      </div>

      <div style={{ position: "relative" }}>
        <button style={styles.exportBtn} onClick={() => setExportOpen((v) => !v)}>
          <Download size={14} /> Export <ChevronDown size={13} />
        </button>
        {exportOpen && (
          <div style={styles.exportMenu}>
            <button style={styles.exportItem} onClick={() => { exportCSV(severity, dateFrom, dateTo); setExportOpen(false); }}>
              ⬇ Export CSV
            </button>
            <button style={styles.exportItem} onClick={() => { exportPDF(severity, dateFrom, dateTo); setExportOpen(false); }}>
              🖨 Export PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 20, alignItems: "center" },
  filters:   { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" },
  search:    { height: 40, padding: "0 14px", borderRadius: 10, border: "1px solid #dbe3ee", minWidth: 220, fontSize: 14, outline: "none" },
  input:     { height: 40, padding: "0 14px", borderRadius: 10, border: "1px solid #dbe3ee", fontSize: 14, outline: "none" },
  exportBtn: {
    height: 40, padding: "0 16px", borderRadius: 10, border: "none",
    background: "#1e3a8a", color: "#fff", cursor: "pointer", fontWeight: 600,
    display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "inherit",
  },
  exportMenu: {
    position: "absolute", right: 0, top: 44, background: "#fff",
    border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    zIndex: 200, minWidth: 160, overflow: "hidden",
  },
  exportItem: {
    display: "block", width: "100%", padding: "11px 16px", textAlign: "left",
    background: "none", border: "none", cursor: "pointer", fontSize: 13,
    fontFamily: "inherit", color: "#0f172a",
  },
};

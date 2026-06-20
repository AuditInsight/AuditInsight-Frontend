"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { Download, ChevronDown } from "lucide-react";
import { EvidenceDropdown } from "@/components/evidence/EvidenceDropdown";
import { MOCK_REVIEW_QUEUE } from "@/mock/reviewQueue.mock";
import { MOCK_TRANSACTIONS } from "@/mock/transactions.mock";
import { exportReportsCSV, exportReportsPDF } from "@/utils/export";

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
            <button style={styles.exportItem} onClick={() => {
              const rows = getFiltered(severity, dateFrom, dateTo);
              exportReportsCSV(rows, { severity, dateFrom, dateTo, transactionsCount: MOCK_TRANSACTIONS.length });
              setExportOpen(false);
            }}>
              Export CSV
            </button>
            <button style={styles.exportItem} onClick={() => {
              const rows = getFiltered(severity, dateFrom, dateTo);
              exportReportsPDF(rows, { severity, dateFrom, dateTo, transactionsCount: MOCK_TRANSACTIONS.length });
              setExportOpen(false);
            }}>
              Export PDF
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

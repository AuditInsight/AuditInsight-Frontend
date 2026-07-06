"use client";

import { useState } from "react";
import { FileText, CheckCircle2, Clock, PenLine } from "lucide-react";
import PermissionGate from "./PermissionGate";

interface MockReport {
  id: string;
  title: string;
  period: string;
  preparedBy: string;
  status: "PENDING_SIGNATURE" | "SIGNED" | "DRAFT";
  submittedAt: string;
}

const MOCK_REPORTS: MockReport[] = [
  {
    id: "RPT-Q3-2024",
    title: "Q3 2024 Donor Compliance Report",
    period: "July – September 2024",
    preparedBy: "Diane Uwase",
    status: "PENDING_SIGNATURE",
    submittedAt: "2024-10-01T09:00:00",
  },
  {
    id: "RPT-H1-2024",
    title: "H1 2024 Financial Summary",
    period: "January – June 2024",
    preparedBy: "Diane Uwase",
    status: "SIGNED",
    submittedAt: "2024-07-05T10:00:00",
  },
];

const STATUS_CFG = {
  PENDING_SIGNATURE: { color: "#1e3a8a", bg: "rgba(30,58,138,0.07)", border: "rgba(30,58,138,0.2)", label: "Pending Signature", icon: <Clock size={11} /> },
  SIGNED:            { color: "#2563eb", bg: "rgba(37,99,235,0.07)", border: "rgba(37,99,235,0.2)", label: "Signed",            icon: <CheckCircle2 size={11} /> },
  DRAFT:             { color: "#64748b", bg: "#f1f5f9",              border: "#e2e8f0",              label: "Draft",            icon: <FileText size={11} /> },
};

export default function ReportSigningPanel() {
  const [reports, setReports] = useState<MockReport[]>(MOCK_REPORTS);
  const [signing, setSigning] = useState<string | null>(null);

  const handleSign = (id: string) => {
    setSigning(id);
    setTimeout(() => {
      setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: "SIGNED" as const } : r));
      setSigning(null);
    }, 1200);
  };

  return (
    <PermissionGate permission="report:sign">
      <div style={s.card}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.headerIcon}>
            <PenLine size={15} color="#1e3a8a" />
          </div>
          <div>
            <p style={s.headerTitle}>Report Signing</p>
            <p style={s.headerSub}>Final approval &amp; executive sign-off</p>
          </div>
        </div>

        {/* Report list */}
        <div>
          {reports.map((report) => {
            const cfg       = STATUS_CFG[report.status];
            const isPending = report.status === "PENDING_SIGNATURE";
            return (
              <div key={report.id} style={s.reportRow}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" as const }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                        {cfg.icon} {cfg.label}
                      </span>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8" }}>{report.id}</span>
                    </div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a", margin: "0 0 3px", lineHeight: 1.3 }}>{report.title}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{report.period} · Prepared by {report.preparedBy}</p>
                  </div>
                  {isPending && (
                    <button
                      style={{ ...s.signBtn, opacity: signing === report.id ? 0.7 : 1 }}
                      onClick={() => handleSign(report.id)}
                      disabled={signing === report.id}
                    >
                      <PenLine size={12} />
                      {signing === report.id ? "Signing…" : "Sign Report"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PermissionGate>
  );
}

const s: Record<string, React.CSSProperties> = {
  card:        { background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(15,23,42,0.05)" },
  header:      { display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid #f1f5f9" },
  headerIcon:  { width: 34, height: 34, borderRadius: 9, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  headerTitle: { fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.3 },
  headerSub:   { fontSize: 11.5, color: "#94a3b8", margin: "2px 0 0" },
  reportRow:   { padding: "14px 18px", borderBottom: "1px solid #f8fafc" },
  signBtn:     { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
};

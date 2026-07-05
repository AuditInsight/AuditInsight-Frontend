"use client";

/**
 * ReportSigningPanel.tsx — ORG_ADMIN-only final report signing component.
 *
 * Provides the executive director with a high-level approval interface
 * for signing off on audit reports. Gated by permission "report:sign".
 */

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
  PENDING_SIGNATURE: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    label: "Pending Signature",
    icon: <Clock size={11} />,
  },
  SIGNED: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    label: "Signed",
    icon: <CheckCircle2 size={11} />,
  },
  DRAFT: {
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    label: "Draft",
    icon: <FileText size={11} />,
  },
};

export default function ReportSigningPanel() {
  const [reports, setReports] = useState<MockReport[]>(MOCK_REPORTS);
  const [signing, setSigning] = useState<string | null>(null);

  const handleSign = (id: string) => {
    setSigning(id);
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "SIGNED" as const } : r))
      );
      setSigning(null);
    }, 1200);
  };

  return (
    <PermissionGate permission="report:sign">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <PenLine size={15} className="text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">
              Report Signing
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Final approval &amp; executive sign-off
            </p>
          </div>
        </div>

        {/* Report list */}
        <div className="divide-y divide-slate-50">
          {reports.map((report) => {
            const cfg = STATUS_CFG[report.status];
            const isPending = report.status === "PENDING_SIGNATURE";
            return (
              <div key={report.id} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.badge}`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{report.id}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 leading-tight">
                      {report.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {report.period} · Prepared by {report.preparedBy}
                    </p>
                  </div>
                  {isPending && (
                    <button
                      onClick={() => handleSign(report.id)}
                      disabled={signing === report.id}
                      className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white text-xs font-semibold transition-colors"
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

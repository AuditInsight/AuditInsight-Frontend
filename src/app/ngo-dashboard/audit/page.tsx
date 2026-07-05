"use client";

import { useState } from "react";
import NGOPageLayout from "@/components/ngo-dashboard/NGOPageLayout";
import PermissionGate from "@/components/ngo-dashboard/rbac/PermissionGate";
import { useRBAC } from "@/context/RBACContext";
import { ProtectedRoute } from "@/components/Guards";
import { NGO_TRANSACTIONS, NGO_FLAGS } from "@/mock/ngo.mock";
import type { NGOFlag } from "@/types/ngo";
import {
  ShieldCheck, AlertTriangle, CheckCircle2,
  Clock, FileText, Lock,
} from "lucide-react";

const CHECKLIST = [
  { category: "Financial Records", items: [
    { label: "All transactions recorded in ledger",          done: true  },
    { label: "Bank reconciliation statements up to date",    done: true  },
    { label: "Payment vouchers filed for all disbursements", done: false },
    { label: "Petty cash register maintained",               done: true  },
  ]},
  { category: "Evidence & Documentation", items: [
    { label: "Supporting documents attached to all transactions", done: false },
    { label: "Supplier contracts on file",                        done: false },
    { label: "Signed attendance sheets for training activities",  done: false },
    { label: "Beneficiary lists verified and signed",             done: true  },
  ]},
  { category: "Donor Compliance", items: [
    { label: "USAID quarterly report submitted",     done: true  },
    { label: "UNICEF activity report submitted",     done: true  },
    { label: "World Bank procurement plan approved", done: false },
    { label: "EU visibility requirements met",       done: true  },
  ]},
  { category: "Governance", items: [
    { label: "Board minutes filed for Q3",                done: true  },
    { label: "Segregation of duties policy enforced",     done: true  },
    { label: "Internal audit completed for H1",           done: false },
    { label: "External auditor engagement letter signed", done: true  },
  ]},
];

const totalItems = CHECKLIST.flatMap((c) => c.items).length;
const doneItems  = CHECKLIST.flatMap((c) => c.items).filter((i) => i.done).length;
const readiness  = Math.round((doneItems / totalItems) * 100);
const scoreColor = readiness >= 80 ? "#16a34a" : readiness >= 60 ? "#d97706" : "#dc2626";

function AuditReadinessContent() {
  const { user, can } = useRBAC();
  const [flags, setFlags] = useState<NGOFlag[]>(NGO_FLAGS);

  const openFlags = flags.filter((f) => f.status === "OPEN");
  const evidenced = NGO_TRANSACTIONS.filter((t) => t.evidenceCount > 0).length;

  // ACCOUNTANT and DONOR_REPRESENTATIVE don't have access to this page
  const hasAccess = user.role === "AUDITOR" || user.role === "ORG_ADMIN";

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Lock size={24} className="text-slate-400" />
        </div>
        <p className="text-base font-bold text-slate-900">Access Restricted</p>
        <p className="text-sm text-slate-500 text-center max-w-sm">
          The Audit Readiness page is available to Auditors and Executive Directors only.
          Contact your administrator if you need access.
        </p>
      </div>
    );
  }

  const resolveFlag = (id: string) => {
    setFlags((prev) =>
      prev.map((f) => f.id === id ? { ...f, status: "RESOLVED" as const, resolvedAt: new Date().toISOString() } : f)
    );
  };

  return (
    <>
      {/* Score + stats */}
      <div className="flex gap-4 flex-wrap">
        {/* Readiness ring */}
        <div className="flex items-center gap-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-[2] min-w-[280px]">
          <svg width={96} height={96} viewBox="0 0 96 96" className="flex-shrink-0">
            <circle cx={48} cy={48} r={38} fill="none" stroke="#f1f5f9" strokeWidth={9} />
            <circle
              cx={48} cy={48} r={38} fill="none"
              stroke={scoreColor} strokeWidth={9}
              strokeDasharray={`${(readiness / 100) * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
              strokeLinecap="round" transform="rotate(-90 48 48)"
              style={{ transition: "stroke-dasharray 0.8s ease" }}
            />
            <text x={48} y={48} textAnchor="middle" dominantBaseline="central"
              style={{ fontSize: 18, fontWeight: 700, fill: "#0f172a" }}>
              {readiness}%
            </text>
          </svg>
          <div>
            <p className="text-lg font-bold text-slate-900 mb-1.5">Audit Readiness Score</p>
            <p className="text-sm text-slate-500 leading-relaxed mb-3">
              {readiness >= 80
                ? "Your organisation is well-prepared for an external audit."
                : readiness >= 60
                ? "Some gaps need to be addressed before the audit."
                : "Critical gaps detected — immediate action required."}
            </p>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50">
                {doneItems} Complete
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-red-600 bg-red-50">
                {totalItems - doneItems} Pending
              </span>
            </div>
          </div>
        </div>

        {/* Side stats */}
        <div className="flex flex-col gap-3 flex-1 min-w-[200px]">
          {[
            { label: "Open Audit Flags",       value: openFlags.length,                          color: "#dc2626", icon: <AlertTriangle size={15} /> },
            { label: "Transactions Evidenced", value: `${evidenced}/${NGO_TRANSACTIONS.length}`, color: "#1e3a8a", icon: <FileText size={15} />      },
            { label: "Checklist Progress",     value: `${doneItems}/${totalItems}`,              color: "#16a34a", icon: <CheckCircle2 size={15} />   },
            { label: "Days to Next Audit",     value: "42",                                      color: "#d97706", icon: <Clock size={15} />           },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3">
              <span style={{ color }}>{icon}</span>
              <span className="flex-1 text-sm text-slate-500">{label}</span>
              <span className="text-sm font-bold text-slate-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {CHECKLIST.map((section) => {
          const done = section.items.filter((i) => i.done).length;
          return (
            <div key={section.category} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-blue-900" />
                  <span className="text-sm font-bold text-slate-900">{section.category}</span>
                </div>
                <span className={`text-xs font-bold ${done === section.items.length ? "text-emerald-600" : "text-amber-600"}`}>
                  {done}/{section.items.length}
                </span>
              </div>
              <div className="px-5 py-4 flex flex-col gap-2.5">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    {item.done
                      ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      : <Clock size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    }
                    <span className={`text-sm ${item.done ? "text-slate-400 line-through" : "text-slate-700 font-medium"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Open flags — Resolve gated to ORG_ADMIN */}
      {openFlags.length > 0 && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-red-100 bg-red-50">
            <AlertTriangle size={15} className="text-red-600" />
            <p className="text-sm font-bold text-red-700">
              {openFlags.length} Open Flag{openFlags.length !== 1 ? "s" : ""} — Must Resolve Before Audit
            </p>
          </div>
          <div className="divide-y divide-slate-50">
            {openFlags.map((flag) => (
              <div key={flag.id} className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{
                    color: flag.severity === "CRITICAL" ? "#dc2626" : "#d97706",
                    background: flag.severity === "CRITICAL" ? "#fef2f2" : "#fffbeb",
                  }}
                >
                  {flag.severity}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{flag.category}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {flag.transactionId} · {flag.projectName} · {flag.donor}
                  </p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{flag.notes}</p>
                </div>

                {/* ORG_ADMIN: Resolve button */}
                <PermissionGate permission="flag:resolve">
                  <button
                    onClick={() => resolveFlag(flag.id)}
                    className="flex-shrink-0 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                  >
                    Resolve
                  </button>
                </PermissionGate>

                {/* AUDITOR: read-only label */}
                {!can("flag:resolve") && (
                  <span className="flex-shrink-0 text-xs text-slate-400 font-medium pt-1">
                    Awaiting resolution
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function AuditReadinessPage() {
  return (
    <ProtectedRoute>
      <NGOPageLayout
        pageTitle="Audit Readiness"
        pageSub="Assess your organisation's readiness for an external audit."
      >
        <AuditReadinessContent />
      </NGOPageLayout>
    </ProtectedRoute>
  );
}

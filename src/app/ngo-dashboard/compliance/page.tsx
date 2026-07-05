"use client";

import NGOPageLayout from "@/components/ngo-dashboard/NGOPageLayout";
import DonorScopeBanner from "@/components/ngo-dashboard/rbac/DonorScopeBanner";
import { useRBAC, useScopedData } from "@/context/RBACContext";
import { ProtectedRoute } from "@/components/Guards";
import { NGO_TRANSACTIONS, NGO_FLAGS } from "@/mock/ngo.mock";
import { CheckCircle2, AlertTriangle, Clock, TrendingUp, Lock } from "lucide-react";
import type { DonorName } from "@/types/ngo";

const ALL_DONORS: DonorName[] = ["USAID", "UNICEF", "World Bank", "EU"];

const DONOR_RULES: Record<string, string[]> = {
  USAID:        ["Signed attendance sheets for all training activities", "Payment vouchers for all disbursements", "Quarterly financial reports", "Procurement docs for purchases > RWF 500,000"],
  UNICEF:       ["Beneficiary lists for all programme activities", "Bank reconciliation statements monthly", "Activity reports per project milestone", "Signed grant agreement on file"],
  "World Bank": ["Signed supplier contracts before payment", "Environmental & social safeguard reports", "Procurement plan approved by WB", "Audit trail for all transactions > RWF 1M"],
  EU:           ["Payment vouchers for all transactions", "No unsupported cash payments above RWF 50,000", "Quarterly narrative reports", "Visibility requirements (EU branding on outputs)"],
};

function DonorComplianceCard({ donor }: { donor: DonorName }) {
  const txns     = NGO_TRANSACTIONS.filter((t) => t.donor === donor);
  const flags    = NGO_FLAGS.filter((f) => f.donor === donor && f.status === "OPEN");
  const complete = txns.filter((t) => t.status === "COMPLETED").length;
  const score    = txns.length > 0
    ? Math.max(0, Math.min(100, Math.round((complete / txns.length) * 100) - flags.length * 10))
    : 100;
  const color    = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";
  const rules    = DONOR_RULES[donor] ?? [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <p className="text-base font-bold text-slate-900">{donor}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {txns.length} transactions · {flags.length} open flag{flags.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold leading-none" style={{ color }}>{score}%</p>
          <p className="text-xs text-slate-400 mt-0.5">compliance</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-1.5 bg-slate-100">
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>

      {/* Requirements checklist */}
      <div className="px-5 py-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Requirements</p>
        <ul className="flex flex-col gap-2">
          {rules.map((rule, i) => {
            const hasIssue = flags.some((f) =>
              f.category.toLowerCase().includes(rule.split(" ")[1]?.toLowerCase() ?? "")
            );
            return (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                {hasIssue
                  ? <AlertTriangle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
                  : <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                }
                {rule}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Open issues */}
      {flags.length > 0 && (
        <div className="px-5 py-3 border-t border-red-100 bg-red-50">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Open Issues</p>
          {flags.map((f) => (
            <p key={f.id} className="text-xs text-red-700 mb-1">
              ⚠ {f.category} — {f.transactionId}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function ComplianceContent() {
  const { user } = useRBAC();
  const isDonor  = user.role === "DONOR_REPRESENTATIVE";

  // Scope: DONOR_REPRESENTATIVE sees only their donor's transactions
  const allTxns   = useScopedData(NGO_TRANSACTIONS, (t) => t.donor);
  const allFlags  = NGO_FLAGS;
  const openFlags = allFlags.filter((f) => f.status === "OPEN");

  // Which donor cards to render
  const visibleDonors: DonorName[] = isDonor && user.assignedDonorId
    ? [user.assignedDonorId as DonorName]
    : ALL_DONORS;

  return (
    <>
      {/* DONOR_REPRESENTATIVE: scope banner */}
      {isDonor && user.assignedDonorId && (
        <DonorScopeBanner donorName={user.assignedDonorId} />
      )}

      {/* Read-only notice */}
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
        <Lock size={14} className="text-slate-400 flex-shrink-0" />
        <p className="text-xs text-slate-500 font-medium">
          Compliance data is read-only. Contact your Finance Officer to resolve documentation gaps.
        </p>
      </div>

      {/* Stats strip */}
      <div className="flex gap-4 flex-wrap">
        {[
          { label: isDonor ? "Your Donor" : "Active Donors",  value: visibleDonors.length,                                    color: "#1e3a8a", icon: <TrendingUp size={16} />    },
          { label: "Open Flags",                              value: openFlags.length,                                         color: "#dc2626", icon: <AlertTriangle size={16} /> },
          { label: "Compliant Txns",                          value: allTxns.filter((t) => t.status === "COMPLETED").length,   color: "#16a34a", icon: <CheckCircle2 size={16} />  },
          { label: "Pending Evidence",                        value: allTxns.filter((t) => t.status === "PENDING").length,     color: "#d97706", icon: <Clock size={16} />          },
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

      {/* Donor compliance cards — scoped for DONOR_REPRESENTATIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visibleDonors.map((donor) => (
          <DonorComplianceCard key={donor} donor={donor} />
        ))}
      </div>
    </>
  );
}

export default function CompliancePage() {
  return (
    <ProtectedRoute>
      <NGOPageLayout
        pageTitle="Donor Compliance"
        pageSub="Track compliance status and requirements for each active donor."
      >
        <ComplianceContent />
      </NGOPageLayout>
    </ProtectedRoute>
  );
}

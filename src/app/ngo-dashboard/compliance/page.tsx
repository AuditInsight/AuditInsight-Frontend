"use client";

import NGOPageLayout from "@/components/ngo-dashboard/NGOPageLayout";
import DonorScopeBanner from "@/components/ngo-dashboard/rbac/DonorScopeBanner";
import { useRBAC, useScopedData } from "@/context/RBACContext";
import { ProtectedRoute } from "@/components/Guards";
import { NGO_TRANSACTIONS, NGO_FLAGS } from "@/mock/ngo.mock";
import { theme } from "@/styles/theme";
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
  const score    = txns.length > 0 ? Math.max(0, Math.min(100, Math.round((complete / txns.length) * 100) - flags.length * 10)) : 100;
  const color    = score >= 80 ? theme.colors.success : score >= 60 ? theme.colors.warning : theme.colors.danger;
  const rules    = DONOR_RULES[donor] ?? [];

  return (
    <div style={{ background: theme.colors.Surface, borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.sm, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${theme.colors.divider}` }}>
        <div>
          <p style={{ margin: 0, fontSize: theme.typography.lg, fontWeight: 700, color: theme.colors.textPrimary }}>{donor}</p>
          <p style={{ margin: "3px 0 0", fontSize: theme.typography.xs, color: theme.colors.textMuted }}>{txns.length} transactions · {flags.length} open flag{flags.length !== 1 ? "s" : ""}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>{score}%</p>
          <p style={{ margin: "3px 0 0", fontSize: theme.typography.xs, color: theme.colors.textMuted }}>compliance</p>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ height: 4, background: theme.colors.appBackground }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, transition: "width 0.7s ease" }} />
      </div>

      {/* Requirements */}
      <div style={{ padding: "16px 20px" }}>
        <p style={{ margin: "0 0 12px", fontSize: theme.typography.xs, fontWeight: 700, color: theme.colors.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Requirements</p>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {rules.map((rule, i) => {
            const hasIssue = flags.some((f) => f.category.toLowerCase().includes(rule.split(" ")[1]?.toLowerCase() ?? ""));
            return (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: theme.typography.sm, color: theme.colors.textSecondary }}>
                {hasIssue
                  ? <AlertTriangle size={13} style={{ color: theme.colors.danger, flexShrink: 0, marginTop: 1 }} />
                  : <CheckCircle2 size={13} style={{ color: theme.colors.success, flexShrink: 0, marginTop: 1 }} />
                }
                {rule}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Open issues */}
      {flags.length > 0 && (
        <div style={{ padding: "12px 20px", borderTop: `1px solid #fecaca`, background: theme.colors.dangerBg }}>
          <p style={{ margin: "0 0 6px", fontSize: theme.typography.xs, fontWeight: 700, color: theme.colors.danger, textTransform: "uppercase", letterSpacing: "0.07em" }}>Open Issues</p>
          {flags.map((f) => (
            <p key={f.id} style={{ margin: "0 0 4px", fontSize: theme.typography.sm, color: "#7f1d1d" }}>⚠ {f.category} — {f.transactionId}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function ComplianceContent() {
  const { user } = useRBAC();
  const isDonor  = user.role === "DONOR_REPRESENTATIVE";
  const allTxns  = useScopedData(NGO_TRANSACTIONS, (t) => t.donor);
  const openFlags = NGO_FLAGS.filter((f) => f.status === "OPEN");
  const visibleDonors: DonorName[] = isDonor && user.assignedDonorId ? [user.assignedDonorId as DonorName] : ALL_DONORS;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xl }}>

      {isDonor && user.assignedDonorId && <DonorScopeBanner donorName={user.assignedDonorId} />}

      {/* Read-only notice */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: theme.radius.md, background: theme.colors.appBackground, border: `1px solid ${theme.colors.border}` }}>
        <Lock size={14} style={{ color: theme.colors.textMuted, flexShrink: 0 }} />
        <span style={{ fontSize: theme.typography.sm, color: theme.colors.textSecondary }}>Compliance data is read-only. Contact your Finance Officer to resolve documentation gaps.</span>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: theme.spacing.lg, flexWrap: "wrap" }}>
        {[
          { label: isDonor ? "Your Donor" : "Active Donors", value: visibleDonors.length,                                  accent: theme.colors.primary, icon: <TrendingUp size={16} />    },
          { label: "Open Flags",                             value: openFlags.length,                                       accent: theme.colors.danger,  icon: <AlertTriangle size={16} /> },
          { label: "Compliant Txns",                         value: allTxns.filter((t) => t.status === "COMPLETED").length, accent: theme.colors.success, icon: <CheckCircle2 size={16} />  },
          { label: "Pending Evidence",                       value: allTxns.filter((t) => t.status === "PENDING").length,   accent: theme.colors.warning, icon: <Clock size={16} />          },
        ].map(({ label, value, accent, icon }) => (
          <div key={label} style={{ flex: 1, minWidth: 140, background: theme.colors.Surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.lg, padding: theme.spacing.lg, boxShadow: theme.shadows.sm }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: theme.typography.sm, color: theme.colors.textSecondary, fontWeight: 500 }}>{label}</span>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", color: accent }}>{icon}</div>
            </div>
            <div style={{ fontSize: theme.typography.xxl, fontWeight: 700, color: theme.colors.textPrimary, letterSpacing: "-0.5px", lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Donor cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: theme.spacing.lg }}>
        {visibleDonors.map((donor) => <DonorComplianceCard key={donor} donor={donor} />)}
      </div>
    </div>
  );
}

export default function CompliancePage() {
  return (
    <ProtectedRoute>
      <NGOPageLayout pageTitle="Donor Compliance" pageSub="Track compliance status and requirements for each active donor.">
        <ComplianceContent />
      </NGOPageLayout>
    </ProtectedRoute>
  );
}

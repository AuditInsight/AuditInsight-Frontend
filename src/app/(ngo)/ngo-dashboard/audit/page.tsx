"use client";

import { useState } from "react";
import NGOPageLayout from "@/components/ngo/NGOPageLayout";
import PermissionGate from "@/components/ngo/rbac/PermissionGate";
import { useRBAC } from "@/context/RBACContext";
import { ProtectedRoute } from "@/components/Guards";
import { NGO_TRANSACTIONS, NGO_FLAGS } from "@/mock/ngo.mock";
import type { NGOFlag } from "@/types/ngo";
import { theme } from "@/styles/theme";
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, FileText, Lock } from "lucide-react";

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
const scoreColor = readiness >= 80 ? theme.colors.success : readiness >= 60 ? theme.colors.warning : theme.colors.danger;

function AuditReadinessContent() {
  const { user, can } = useRBAC();
  const [flags, setFlags] = useState<NGOFlag[]>(NGO_FLAGS);

  const openFlags = flags.filter((f) => f.status === "OPEN");
  const evidenced = NGO_TRANSACTIONS.filter((t) => t.evidenceCount > 0).length;
  const hasAccess = user.role === "AUDITOR" || user.role === "ORG_ADMIN";

  if (!hasAccess) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 16, background: theme.colors.Surface, borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.sm }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: theme.colors.appBackground, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lock size={24} style={{ color: theme.colors.textMuted }} />
        </div>
        <p style={{ margin: 0, fontSize: theme.typography.lg, fontWeight: 700, color: theme.colors.textPrimary }}>Access Restricted</p>
        <p style={{ margin: 0, fontSize: theme.typography.sm, color: theme.colors.textMuted, textAlign: "center", maxWidth: 360 }}>
          The Audit Readiness page is available to Auditors and Executive Directors only.
        </p>
        <a href="/ngo-dashboard" style={{ marginTop: 8, padding: "9px 22px", borderRadius: theme.radius.md, background: theme.colors.primary, color: "#fff", fontSize: theme.typography.sm, fontWeight: 600, textDecoration: "none" }}>
          Back to Dashboard
        </a>
      </div>
    );
  }

  const resolveFlag = (id: string) => setFlags((prev) => prev.map((f) => f.id === id ? { ...f, status: "RESOLVED" as const, resolvedAt: new Date().toISOString() } : f));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xl }}>

      {/* Score + side stats */}
      <div style={{ display: "flex", gap: theme.spacing.lg, flexWrap: "wrap" }}>
        {/* Ring card */}
        <div style={{ flex: 2, minWidth: 280, display: "flex", alignItems: "center", gap: 24, background: theme.colors.Surface, borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`, padding: "24px", boxShadow: theme.shadows.sm }}>
          <svg width={96} height={96} viewBox="0 0 96 96" style={{ flexShrink: 0 }}>
            <circle cx={48} cy={48} r={38} fill="none" stroke={theme.colors.appBackground} strokeWidth={9} />
            <circle cx={48} cy={48} r={38} fill="none" stroke={scoreColor} strokeWidth={9}
              strokeDasharray={`${(readiness / 100) * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
              strokeLinecap="round" transform="rotate(-90 48 48)"
              style={{ transition: "stroke-dasharray 0.8s ease" }} />
            <text x={48} y={48} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 18, fontWeight: 700, fill: theme.colors.textPrimary }}>{readiness}%</text>
          </svg>
          <div>
            <p style={{ margin: "0 0 6px", fontSize: theme.typography.lg, fontWeight: 700, color: theme.colors.textPrimary }}>Audit Readiness Score</p>
            <p style={{ margin: "0 0 14px", fontSize: theme.typography.sm, color: theme.colors.textSecondary, lineHeight: theme.typography.lineHeight.relaxed }}>
              {readiness >= 80 ? "Your organisation is well-prepared for an external audit." : readiness >= 60 ? "Some gaps need to be addressed before the audit." : "Critical gaps detected — immediate action required."}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: theme.typography.xs, fontWeight: 600, color: theme.colors.success, background: theme.colors.successBg }}>{doneItems} Complete</span>
              <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: theme.typography.xs, fontWeight: 600, color: theme.colors.danger, background: theme.colors.dangerBg }}>{totalItems - doneItems} Pending</span>
            </div>
          </div>
        </div>

        {/* Side stats */}
        <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Open Audit Flags",       value: openFlags.length,                          color: theme.colors.danger,  icon: <AlertTriangle size={15} /> },
            { label: "Transactions Evidenced", value: `${evidenced}/${NGO_TRANSACTIONS.length}`, color: theme.colors.primary, icon: <FileText size={15} />      },
            { label: "Checklist Progress",     value: `${doneItems}/${totalItems}`,              color: theme.colors.success, icon: <CheckCircle2 size={15} />   },
            { label: "Days to Next Audit",     value: "42",                                      color: theme.colors.warning, icon: <Clock size={15} />           },
          ].map(({ label, value, color, icon }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, background: theme.colors.Surface, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, padding: "12px 16px", boxShadow: theme.shadows.xs }}>
              <span style={{ color }}>{icon}</span>
              <span style={{ flex: 1, fontSize: theme.typography.sm, color: theme.colors.textSecondary }}>{label}</span>
              <span style={{ fontSize: theme.typography.sm, fontWeight: 700, color: theme.colors.textPrimary }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: theme.spacing.lg }}>
        {CHECKLIST.map((section) => {
          const done = section.items.filter((i) => i.done).length;
          return (
            <div key={section.category} style={{ background: theme.colors.Surface, borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.sm, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${theme.colors.divider}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ShieldCheck size={15} style={{ color: theme.colors.primary }} />
                  <span style={{ fontSize: theme.typography.md, fontWeight: 700, color: theme.colors.textPrimary }}>{section.category}</span>
                </div>
                <span style={{ fontSize: theme.typography.sm, fontWeight: 700, color: done === section.items.length ? theme.colors.success : theme.colors.warning }}>{done}/{section.items.length}</span>
              </div>
              <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                {section.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    {item.done
                      ? <CheckCircle2 size={14} style={{ color: theme.colors.success, flexShrink: 0, marginTop: 1 }} />
                      : <Clock size={14} style={{ color: theme.colors.warning, flexShrink: 0, marginTop: 1 }} />
                    }
                    <span style={{ fontSize: theme.typography.sm, color: item.done ? theme.colors.textMuted : theme.colors.textPrimary, fontWeight: item.done ? 400 : 500, textDecoration: item.done ? "line-through" : "none" }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Open flags */}
      {openFlags.length > 0 && (
        <div style={{ background: theme.colors.Surface, borderRadius: theme.radius.lg, border: `1px solid #fecaca`, boxShadow: theme.shadows.sm, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid #fecaca", background: theme.colors.dangerBg }}>
            <AlertTriangle size={15} style={{ color: theme.colors.danger }} />
            <span style={{ fontSize: theme.typography.md, fontWeight: 700, color: theme.colors.danger }}>{openFlags.length} Open Flag{openFlags.length !== 1 ? "s" : ""} — Must Resolve Before Audit</span>
          </div>
          <div>
            {openFlags.map((flag) => (
              <div key={flag.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px", borderBottom: `1px solid ${theme.colors.divider}` }}>
                <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: theme.typography.xs, fontWeight: 700, flexShrink: 0, marginTop: 2, color: flag.severity === "CRITICAL" ? theme.colors.danger : theme.colors.warning, background: flag.severity === "CRITICAL" ? theme.colors.dangerBg : theme.colors.warningBg }}>
                  {flag.severity}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 3px", fontSize: theme.typography.sm, fontWeight: 600, color: theme.colors.textPrimary }}>{flag.category}</p>
                  <p style={{ margin: "0 0 6px", fontSize: theme.typography.xs, color: theme.colors.textMuted }}>{flag.transactionId} · {flag.projectName} · {flag.donor}</p>
                  <p style={{ margin: 0, fontSize: theme.typography.sm, color: theme.colors.textSecondary, lineHeight: theme.typography.lineHeight.relaxed }}>{flag.notes}</p>
                </div>
                <PermissionGate permission="flag:resolve">
                  <button onClick={() => resolveFlag(flag.id)} style={{ flexShrink: 0, padding: "7px 16px", borderRadius: theme.radius.md, border: "none", background: theme.colors.success, color: "#fff", fontSize: theme.typography.sm, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Resolve
                  </button>
                </PermissionGate>
                {!can("flag:resolve") && <span style={{ flexShrink: 0, fontSize: theme.typography.xs, color: theme.colors.textMuted, paddingTop: 4 }}>Awaiting resolution</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuditReadinessPage() {
  return (
    <ProtectedRoute>
      <NGOPageLayout pageTitle="Audit Readiness" pageSub="Assess your organisation's readiness for an external audit.">
        <AuditReadinessContent />
      </NGOPageLayout>
    </ProtectedRoute>
  );
}



"use client";

import { useRouter } from "next/navigation";
import { AdminOrganisationResponse } from "@/api/admin";

interface Props {
  tenants: AdminOrganisationResponse[];
}

const SUBSCRIPTION_BADGE: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: "#dcfce7", color: "#15803d" },
  TRIAL: { bg: "#e0f2fe", color: "#0369a1" },
  PENDING: { bg: "#fef9c3", color: "#a16207" },
  EXPIRED: { bg: "#fef9c3", color: "#a16207" },
  CANCELLED: { bg: "#fee2e2", color: "#b91c1c" },
};

export default function TenantsTable({ tenants }: Props) {
  const router = useRouter();

  return (
    <div style={tableWrap}>
      <table style={table}>
        <thead>
          <tr style={headRow}>
            <th style={th}>Company</th>
            <th style={th}>Industry</th>
            <th style={th}>Members</th>
            <th style={th}>Registered</th>
            <th style={th}>Subscription</th>
            <th style={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id} style={row}>
              <td style={td}>{t.name}</td>
              <td style={td}>{t.industry}</td>
              <td style={td}>{t.memberCount}</td>
              <td style={td}>{new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
              <td style={td}>
                {t.subscriptionStatus ? (
                  <span style={{ ...statusBadge, ...(SUBSCRIPTION_BADGE[t.subscriptionStatus] ?? { bg: "#f1f5f9", color: "#64748b" }) }}>
                    {t.subscriptionType ? `${t.subscriptionType} · ` : ""}{t.subscriptionStatus}
                  </span>
                ) : (
                  <span style={{ ...statusBadge, background: "#f1f5f9", color: "#64748b" }}>No subscription</span>
                )}
              </td>
              <td style={td}>
                <button onClick={() => router.push(`/admin/organizations/${t.id}`)} style={actionBtn}>
                  View / Change Tier
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tenants.length === 0 && <p style={emptyState}>No organisations match this search.</p>}
    </div>
  );
}

const tableWrap: React.CSSProperties = { overflowX: "auto", borderRadius: 12, border: "1px solid #e5e7eb" };
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const headRow: React.CSSProperties = { background: "#f8fafc" };
const th: React.CSSProperties = { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" };
const row: React.CSSProperties = { borderBottom: "1px solid #f1f5f9" };
const td: React.CSSProperties = { padding: "12px 16px", color: "#1f2937" };
const statusBadge: React.CSSProperties = { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" };
const actionBtn: React.CSSProperties = { padding: "5px 14px", borderRadius: 8, border: "1px solid #1e3a8a", background: "#fff", color: "#1e3a8a", cursor: "pointer", fontWeight: 600, fontSize: 12 };
const emptyState: React.CSSProperties = { textAlign: "center", padding: "32px 16px", color: "#94a3b8", fontSize: 13.5, margin: 0 };

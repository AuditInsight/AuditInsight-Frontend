"use client";

import { usePermissions } from "@/security/access-control";
import { useAdminOverview } from "@/hooks/useAdminOverview";
import { theme } from "@/styles/theme";
import Link from "next/link";
import { Shield, Building2, Users, CreditCard, ScrollText } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminOverviewPage() {
  const { canViewAdminPanel } = usePermissions();
  const { overview, loading, error } = useAdminOverview();

  if (!canViewAdminPanel) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Shield size={40} color="#94a3b8" strokeWidth={1.5} style={{ marginBottom: 12 }} />
          <p style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", margin: 0 }}>Access Restricted</p>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>Only the Super Admin can view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Platform Overview</h1>
        <p style={styles.subtitle}>Snapshot of organisations, users and subscriptions across AuditInsight.</p>
      </div>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.statsRow}>
        {[
          { label: "Organisations", value: overview?.totalOrganisations, icon: Building2, href: "/admin/organizations", color: "#1e3a8a" },
          { label: "Users", value: overview?.totalUsers, icon: Users, href: "/admin/users", color: "#15803d" },
          { label: "Active Subscriptions", value: overview?.activeSubscriptions, icon: CreditCard, href: "/admin/organizations", color: "#b45309" },
        ].map((s) => (
          <Link key={s.label} href={s.href} style={styles.statCardLink}>
            <div style={styles.statCard}>
              <s.icon size={20} color={s.color} />
              <span style={{ fontSize: 28, fontWeight: 800, color: s.color, marginTop: 10 }}>
                {loading ? "—" : s.value ?? 0}
              </span>
              <span style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{s.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}><ScrollText size={16} style={{ marginRight: 6, verticalAlign: "-2px" }} />Recent Admin Activity</h2>
          <Link href="/admin/settings" style={styles.viewAllLink}>View audit log →</Link>
        </div>
        {loading ? (
          <p style={styles.emptyState}>Loading…</p>
        ) : !overview?.recentAuditLog.length ? (
          <p style={styles.emptyState}>No admin activity recorded yet.</p>
        ) : (
          <table style={styles.table}>
            <tbody>
              {overview.recentAuditLog.map((entry) => (
                <tr key={entry.id} style={styles.row}>
                  <td style={styles.td}>{entry.action}</td>
                  <td style={{ ...styles.td, color: "#64748b" }}>{entry.adminUsername}</td>
                  <td style={{ ...styles.td, color: "#94a3b8", whiteSpace: "nowrap" }}>
                    {new Date(entry.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: theme.spacing.lg, background: theme.colors.appBackground, minHeight: "100vh" },
  header: { marginBottom: 24 },
  title: { margin: 0, fontSize: 26, fontWeight: 800, color: "#111827" },
  subtitle: { margin: "4px 0 0", fontSize: 14, color: "#6b7280" },
  errorBanner: { marginBottom: 20, padding: "12px 16px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13.5 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 },
  statCardLink: { textDecoration: "none" },
  statCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", cursor: "pointer" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #f1f5f9" },
  cardTitle: { margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" },
  viewAllLink: { fontSize: 13, color: "#1e3a8a", fontWeight: 600, textDecoration: "none" },
  emptyState: { padding: "24px 20px", margin: 0, fontSize: 13.5, color: "#94a3b8", textAlign: "center" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13.5 },
  row: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 20px", color: "#1f2937" },
};

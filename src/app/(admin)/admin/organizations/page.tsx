"use client";

import { usePermissions } from "@/security/access-control";
import TenantsTable from "@/components/admin/TenantsTable";
import { MOCK_TENANTS } from "@/mock/admin.mock";
import { theme } from "@/styles/theme";
import { Shield } from "lucide-react";

export default function OrganizationsPage() {
  const { canViewAdminPanel } = usePermissions();

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
        <div>
          <h1 style={styles.title}>Global Tenants</h1>
          <p style={styles.subtitle}>All registered organisations on the platform — {MOCK_TENANTS.length} total</p>
        </div>
      </div>

      {/* ── Summary stat cards ── */}
      <div style={styles.statsRow}>
        {[
          { label: "Total Organisations", value: MOCK_TENANTS.length, color: "#1e3a8a" },
          { label: "Paid", value: MOCK_TENANTS.filter((t) => t.billingStatus === "PAID").length, color: "#15803d" },
          { label: "Unpaid", value: MOCK_TENANTS.filter((t) => t.billingStatus === "UNPAID").length, color: "#b91c1c" },
          { label: "Blocked", value: MOCK_TENANTS.filter((t) => t.isBlocked).length, color: "#92400e" },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <span style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <TenantsTable tenants={MOCK_TENANTS} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: theme.spacing.lg, background: theme.colors.appBackground, minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { margin: 0, fontSize: 26, fontWeight: 800, color: "#111827" },
  subtitle: { margin: "4px 0 0", fontSize: 14, color: "#6b7280" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  statCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column" },
};



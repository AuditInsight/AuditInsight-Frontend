"use client";

import { usePermissions } from "@/security/access-control";
import AuditorApprovalsTable from "@/components/admin/AuditorApprovalsTable";
import { MOCK_PENDING_AUDITORS } from "@/mock/admin.mock";
import { theme } from "@/styles/theme";
import { Shield } from "lucide-react";

export default function ApprovalsPage() {
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

  const pending = MOCK_PENDING_AUDITORS.filter((a) => a.status === "PENDING").length;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Auditor Approvals</h1>
          <p style={styles.subtitle}>
            Review and verify professional license submissions —{" "}
            <strong style={{ color: "#b45309" }}>{pending} pending</strong>
          </p>
        </div>
      </div>

      {/* ── Summary stat cards ── */}
      <div style={styles.statsRow}>
        {[
          { label: "Pending Review", value: MOCK_PENDING_AUDITORS.filter((a) => a.status === "PENDING").length, color: "#b45309" },
          { label: "Approved", value: MOCK_PENDING_AUDITORS.filter((a) => a.status === "APPROVED").length, color: "#15803d" },
          { label: "Rejected", value: MOCK_PENDING_AUDITORS.filter((a) => a.status === "REJECTED").length, color: "#b91c1c" },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <span style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <AuditorApprovalsTable auditors={MOCK_PENDING_AUDITORS} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: theme.spacing.lg, background: theme.colors.appBackground, minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { margin: 0, fontSize: 26, fontWeight: 800, color: "#111827" },
  subtitle: { margin: "4px 0 0", fontSize: 14, color: "#6b7280" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 },
  statCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column" },
};



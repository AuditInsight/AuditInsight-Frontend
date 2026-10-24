"use client";

import { useState, useEffect, useCallback } from "react";
import { isAxiosError } from "axios";
import { usePermissions } from "@/security/access-control";
import TenantsTable from "@/components/admin/TenantsTable";
import { TransactionsPagination } from "@/components/mse/transactions/TransactionsPagination";
import { theme } from "@/styles/theme";
import { Shield, Search } from "lucide-react";
import { getAdminOrganisations, AdminOrganisationResponse, PageResult } from "@/api/admin";

export const dynamic = "force-dynamic";

export default function OrganizationsPage() {
  const { canViewAdminPanel } = usePermissions();

  const [result, setResult] = useState<PageResult<AdminOrganisationResponse> | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganisations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAdminOrganisations({ page, search: search || undefined });
      setResult(data);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to load organisations.");
      } else {
        setError("Failed to load organisations.");
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchOrganisations();
  }, [fetchOrganisations]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

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

  const items = result?.items ?? [];
  const activeCount = items.filter((t) => t.subscriptionStatus === "ACTIVE").length;
  const trialCount = items.filter((t) => t.subscriptionStatus === "TRIAL").length;
  const noSubCount = items.filter((t) => !t.subscriptionStatus).length;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Global Tenants</h1>
          <p style={styles.subtitle}>All registered organisations on the platform — {result?.totalItems ?? 0} total</p>
        </div>
      </div>

      <div style={styles.statsRow}>
        {[
          { label: "Organisations (this page)", value: items.length, color: "#1e3a8a" },
          { label: "Active", value: activeCount, color: "#15803d" },
          { label: "Trial", value: trialCount, color: "#0369a1" },
          { label: "No subscription", value: noSubCount, color: "#92400e" },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <span style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
        <Search size={15} color="#94a3b8" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search organisations by name…"
          style={styles.searchInput}
        />
      </form>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {loading ? (
        <p style={styles.emptyState}>Loading organisations…</p>
      ) : (
        <>
          <TenantsTable tenants={items} />
          {result && result.totalPages > 1 && (
            <TransactionsPagination page={page} setPage={setPage} totalPages={result.totalPages} />
          )}
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: theme.spacing.lg, background: theme.colors.appBackground, minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { margin: 0, fontSize: 26, fontWeight: 800, color: "#111827" },
  subtitle: { margin: "4px 0 0", fontSize: 14, color: "#6b7280" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 },
  statCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column" },
  searchForm: { display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 14px", marginBottom: 20, maxWidth: 360 },
  searchInput: { border: "none", outline: "none", fontSize: 13.5, fontFamily: "inherit", flex: 1, background: "transparent" },
  errorBanner: { marginBottom: 20, padding: "12px 16px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13.5 },
  emptyState: { textAlign: "center", padding: "40px 16px", color: "#94a3b8", fontSize: 14 },
};

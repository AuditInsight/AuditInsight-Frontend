"use client";

import { useState, useEffect, useCallback } from "react";
import { isAxiosError } from "axios";
import { usePermissions } from "@/security/access-control";
import { theme } from "@/styles/theme";
import { Shield, Search } from "lucide-react";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import { TransactionsPagination } from "@/components/mse/transactions/TransactionsPagination";
import {
  getAdminUsers,
  activateUser,
  deactivateUser,
  AdminUserResponse,
  AdminRole,
  PageResult,
} from "@/api/admin";

export const dynamic = "force-dynamic";

const ROLE_OPTIONS: { label: string; value: AdminRole | "" }[] = [
  { label: "All roles", value: "" },
  { label: "Client (Org Admin)", value: "CLIENT" },
  { label: "Member", value: "MEMBER" },
  { label: "Auditor", value: "AUDITOR" },
  { label: "Admin", value: "ADMIN" },
];

export default function AdminUsersPage() {
  const { canViewAdminPanel } = usePermissions();

  const [result, setResult] = useState<PageResult<AdminUserResponse> | null>(null);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<AdminRole | "">("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingUsername, setTogglingUsername] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAdminUsers({ page, role: role || undefined, search: search || undefined });
      setResult(data);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to load users.");
      } else {
        setError("Failed to load users.");
      }
    } finally {
      setLoading(false);
    }
  }, [page, role, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleToggleActive = async (user: AdminUserResponse) => {
    setTogglingUsername(user.username);
    try {
      if (user.active) {
        await deactivateUser(user.username);
      } else {
        await activateUser(user.username);
      }
      await fetchUsers();
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to update user status.");
      } else {
        setError("Failed to update user status.");
      }
    } finally {
      setTogglingUsername(null);
    }
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

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Platform Users</h1>
          <p style={styles.subtitle}>All registered users across every organisation — {result?.totalItems ?? 0} total</p>
        </div>
      </div>

      <div style={styles.toolbar}>
        <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
          <Search size={15} color="#94a3b8" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email…"
            style={styles.searchInput}
          />
        </form>
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value as AdminRole | ""); setPage(1); }}
          style={styles.roleSelect}
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {loading ? (
        <p style={styles.emptyState}>Loading users…</p>
      ) : (
        <>
          <AdminUsersTable
            users={result?.items ?? []}
            onToggleActive={handleToggleActive}
            togglingUsername={togglingUsername}
          />
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title: { margin: 0, fontSize: 26, fontWeight: 800, color: "#111827" },
  subtitle: { margin: "4px 0 0", fontSize: 14, color: "#6b7280" },
  toolbar: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  searchForm: { display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 14px", flex: "1 1 260px", maxWidth: 360 },
  searchInput: { border: "none", outline: "none", fontSize: 13.5, fontFamily: "inherit", flex: 1, background: "transparent" },
  roleSelect: { padding: "8px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13.5, fontFamily: "inherit", background: "#fff", color: "#0f172a" },
  errorBanner: { marginBottom: 20, padding: "12px 16px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13.5 },
  emptyState: { textAlign: "center", padding: "40px 16px", color: "#94a3b8", fontSize: 14 },
};

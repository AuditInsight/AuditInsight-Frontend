"use client";

import { AdminUserResponse } from "@/api/admin";

interface Props {
  users: AdminUserResponse[];
  onToggleActive: (user: AdminUserResponse) => void;
  togglingUsername: string | null;
}

export default function AdminUsersTable({ users, onToggleActive, togglingUsername }: Props) {
  return (
    <div style={tableWrap}>
      <table style={table}>
        <thead>
          <tr style={headRow}>
            <th style={th}>Name</th>
            <th style={th}>Username</th>
            <th style={th}>Role</th>
            <th style={th}>Organisations</th>
            <th style={th}>Status</th>
            <th style={th}>Joined</th>
            <th style={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={row}>
              <td style={td}>{u.fullName}</td>
              <td style={td}>{u.username}</td>
              <td style={td}>{u.role}</td>
              <td style={td}>
                {u.organisations.length === 0
                  ? "—"
                  : u.organisations.map((o) => o.organisationName).join(", ")}
              </td>
              <td style={td}>
                <span style={{ ...statusBadge, background: u.active ? "#f0fdf4" : "#fef9c3", color: u.active ? "#166534" : "#92400e" }}>
                  {u.active ? "Active" : "Deactivated"}
                </span>
              </td>
              <td style={td}>{new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
              <td style={td}>
                {u.role === "ADMIN" ? (
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>—</span>
                ) : (
                  <button
                    onClick={() => onToggleActive(u)}
                    disabled={togglingUsername === u.username}
                    style={{
                      ...actionBtn,
                      background: u.active ? "#ef4444" : "#1e3a8a",
                      opacity: togglingUsername === u.username ? 0.6 : 1,
                      cursor: togglingUsername === u.username ? "not-allowed" : "pointer",
                    }}
                  >
                    {togglingUsername === u.username ? "…" : u.active ? "Deactivate" : "Activate"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <p style={emptyState}>No users match this filter.</p>}
    </div>
  );
}

const tableWrap: React.CSSProperties = { overflowX: "auto", borderRadius: 12, border: "1px solid #e5e7eb" };
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const headRow: React.CSSProperties = { background: "#f8fafc" };
const th: React.CSSProperties = { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" };
const row: React.CSSProperties = { borderBottom: "1px solid #f1f5f9" };
const td: React.CSSProperties = { padding: "12px 16px", color: "#1f2937" };
const statusBadge: React.CSSProperties = { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 };
const actionBtn: React.CSSProperties = { padding: "5px 14px", borderRadius: 8, border: "none", color: "#fff", fontWeight: 600, fontSize: 12 };
const emptyState: React.CSSProperties = { textAlign: "center", padding: "32px 16px", color: "#94a3b8", fontSize: 13.5, margin: 0 };

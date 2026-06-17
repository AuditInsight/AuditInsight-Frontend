"use client";

import { useMemo, useState } from "react";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";
import UserActionsMenu from "./UserActionsMenu";

export interface User {
  userId?: number;
  id?: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  emailAddress?: string;
  role: string;
  status?: string;
  lastLogin?: string;
  joinedAt?: string;
}

interface Props {
  users: User[];
}

export default function UsersTable({ users }: Props) {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) => {
      const displayName = u.name ?? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
      return displayName.toLowerCase().includes(search.toLowerCase());
    });
  }, [users, search]);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Users</h3>
          <p style={styles.subtitle}>
            Manage system users, roles and access permissions
          </p>
        </div>
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      {/* TABLE */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.thRight}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 24, color: "#6b7280", textAlign: "center", fontSize: 14 }}>
                  No members found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const displayName = user.name ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
                const displayEmail = user.email ?? user.emailAddress ?? "";
                const rowId = user.userId ?? user.id ?? displayEmail;
                const joined = user.joinedAt
                  ? new Date(user.joinedAt).toLocaleDateString()
                  : user.lastLogin ?? "—";

                const rawStatus = user.status ?? "";
                const statusMap: Record<string, "Active" | "Inactive" | "Suspended" | "Pending Invite"> = {
                  ACTIVE: "Active",
                  PENDING: "Pending Invite",
                  REVOKED: "Inactive",
                  Active: "Active",
                  Suspended: "Suspended",
                  Pending: "Pending Invite",
                };
                const mappedStatus = statusMap[rawStatus] ?? "Active";

                return (
                  <tr key={String(rowId)} style={styles.row}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={styles.avatar}>
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={styles.name}>{displayName || "—"}</div>
                          <div style={styles.email}>{displayEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <RoleBadge role={user.role} />
                    </td>
                    <td style={styles.td}>
                      <StatusBadge status={mappedStatus} />
                    </td>
                    <td style={styles.tdMuted}>{joined}</td>
                    <td style={styles.tdRight}>
                      <UserActionsMenu
                        onEdit={() => {}}
                        onSuspend={() => {}}
                        onResetPassword={() => {}}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottom: "1px solid #f3f4f6",
  },
  title: { margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" },
  subtitle: { marginTop: 4, fontSize: 13, color: "#6b7280" },
  search: {
    width: 260,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: 14,
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14 },
  th: { textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#6b7280", fontWeight: 600, background: "#fafafa" },
  thRight: { textAlign: "right", padding: "14px 16px", fontSize: 12, color: "#6b7280", fontWeight: 600, background: "#fafafa" },
  row: { transition: "all 0.2s ease", borderBottom: "1px solid #f3f4f6", cursor: "pointer" },
  td: { padding: "16px", verticalAlign: "middle" },
  tdMuted: { padding: "16px", color: "#6b7280", fontSize: 13 },
  tdRight: { padding: "16px", textAlign: "right" },
  userCell: { display: "flex", alignItems: "center", gap: 12 },
  avatar: {
    width: 38, height: 38, borderRadius: "50%", background: "#1e3a8a",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 14,
  },
  name: { fontWeight: 600, color: "#111827" },
  email: { fontSize: 12, color: "#6b7280" },
};

"use client";

import { useMemo, useState } from "react";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";
import UserActionsMenu from "./UserActionsMenu";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status?: string;
  lastLogin?: string;
}

interface Props {
  users: User[];
}

export default function UsersTable({ users }: Props) {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
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
              <th style={styles.th}>Last Login</th>
              <th style={styles.thRight}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={styles.row}>
                {/* USER */}
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    <div style={styles.avatar}>
                      {user.name.charAt(0)}
                    </div>

                    <div>
                      <div style={styles.name}>{user.name}</div>
                      <div style={styles.email}>{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* ROLE */}
                <td style={styles.td}>
                  <RoleBadge role={user.role} />
                </td>

                {/* STATUS */}
                <td style={styles.td}>
                  <StatusBadge
                    status={
                      (user.status as
                        | "Active"
                        | "Inactive"
                        | "Suspended"
                        | "Pending Invite") || "Active"
                    }
                  />
                </td>

                {/* LAST LOGIN */}
                <td style={styles.tdMuted}>
                  {user.lastLogin || "—"}
                </td>

                {/* ACTIONS */}
                <td style={styles.tdRight}>
                  <UserActionsMenu
                    onEdit={() => {}}
                    onSuspend={() => {}}
                    onResetPassword={() => {}}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================
   STYLES (CLEAN UI UPGRADE)
========================= */

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

  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },

  search: {
    width: 260,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: 14,
  },

  tableWrap: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    fontSize: 14,
  },

  th: {
    textAlign: "left",
    padding: "14px 16px",
    fontSize: 12,
    color: "#6b7280",
    fontWeight: 600,
    background: "#fafafa",
  },

  thRight: {
    textAlign: "right",
    padding: "14px 16px",
    fontSize: 12,
    color: "#6b7280",
    fontWeight: 600,
    background: "#fafafa",
  },

  row: {
    transition: "all 0.2s ease",
    borderBottom: "1px solid #f3f4f6",
    cursor: "pointer",
  },

  td: {
    padding: "16px",
    verticalAlign: "middle",
  },

  tdMuted: {
    padding: "16px",
    color: "#6b7280",
    fontSize: 13,
  },

  tdRight: {
    padding: "16px",
    textAlign: "right",
  },

  userCell: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#1e3a8a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
  },

  name: {
    fontWeight: 600,
    color: "#111827",
  },

  email: {
    fontSize: 12,
    color: "#6b7280",
  },
};
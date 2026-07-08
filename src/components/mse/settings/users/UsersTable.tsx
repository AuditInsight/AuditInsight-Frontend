"use client";

import { useMemo, useState } from "react";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";
import { MoreVertical, UserCheck, UserX, KeyRound } from "lucide-react";

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

const SUSPENDED_KEY = "suspended_users";

function getSuspended(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(SUSPENDED_KEY) ?? "[]"); } catch { return []; }
}

function setSuspended(emails: string[]) {
  localStorage.setItem(SUSPENDED_KEY, JSON.stringify(emails));
}

export function isUserSuspended(email: string): boolean {
  return getSuspended().includes(email.toLowerCase());
}

export default function UsersTable({ users }: Props) {
  const [search, setSearch] = useState("");
  const [suspended, _setSuspended] = useState<string[]>(getSuspended);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState<string | null>(null);

  const toggleSuspend = (email: string) => {
    const key = email.toLowerCase();
    const next = suspended.includes(key)
      ? suspended.filter((e) => e !== key)
      : [...suspended, key];
    _setSuspended(next);
    setSuspended(next);
    setOpenMenu(null);
  };

  const handleResetPassword = (email: string) => {
    setResetDone(email);
    setOpenMenu(null);
    setTimeout(() => setResetDone(null), 3000);
  };

  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) => {
      const displayName = u.name ?? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
      return displayName.toLowerCase().includes(search.toLowerCase()) ||
        (u.email ?? u.emailAddress ?? "").toLowerCase().includes(search.toLowerCase());
    });
  }, [users, search]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Team Members</h3>
          <p style={styles.subtitle}>Manage users, roles, and access</p>
        </div>
        <input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      {resetDone && (
        <div style={styles.toastSuccess}>
          ✅ Password reset link sent to <strong>{resetDone}</strong> (mock)
        </div>
      )}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Joined</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
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
                const rowId = String(user.userId ?? user.id ?? displayEmail);
                const joined = user.joinedAt
                  ? new Date(user.joinedAt).toLocaleDateString()
                  : user.lastLogin ?? "—";

                const rawStatus = user.status ?? "";
                const isSuspendedByAdmin = suspended.includes(displayEmail.toLowerCase());

                type MappedStatus = "Active" | "Inactive" | "Suspended" | "Pending Invite";
                const statusMap: Record<string, MappedStatus> = {
                  ACTIVE: "Active", PENDING: "Pending Invite",
                  REVOKED: "Inactive", Active: "Active",
                  Suspended: "Suspended", Pending: "Pending Invite",
                };
                const baseStatus: MappedStatus = statusMap[rawStatus] ?? "Active";
                const displayStatus: MappedStatus = isSuspendedByAdmin ? "Inactive" : baseStatus;
                const isPending = baseStatus === "Pending Invite";

                return (
                  <tr key={rowId} style={styles.row}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={{
                          ...styles.avatar,
                          background: isSuspendedByAdmin ? "#94a3b8" : "#1e3a8a",
                        }}>
                          {(displayName || displayEmail).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ ...styles.name, opacity: isSuspendedByAdmin ? 0.5 : 1 }}>{displayName || "—"}</div>
                          <div style={styles.email}>{displayEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}><RoleBadge role={user.role} /></td>
                    <td style={styles.td}><StatusBadge status={displayStatus} /></td>
                    <td style={styles.tdMuted}>{joined}</td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      {!isPending && (
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <button
                            style={styles.menuTrigger}
                            onClick={() => setOpenMenu(openMenu === rowId ? null : rowId)}
                          >
                            <MoreVertical size={15} />
                          </button>
                          {openMenu === rowId && (
                            <>
                              <div
                                style={{ position: "fixed", inset: 0, zIndex: 9 }}
                                onClick={() => setOpenMenu(null)}
                              />
                              <div style={styles.menu}>
                                <button
                                  style={styles.menuItem}
                                  onClick={() => toggleSuspend(displayEmail)}
                                >
                                  {isSuspendedByAdmin
                                    ? <><UserCheck size={13} color="#16a34a" /> Activate User</>
                                    : <><UserX size={13} color="#dc2626" /> Deactivate User</>
                                  }
                                </button>
                                <button
                                  style={styles.menuItem}
                                  onClick={() => handleResetPassword(displayEmail)}
                                >
                                  <KeyRound size={13} color="#6b7280" /> Send Password Reset
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
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
  container: { background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottom: "1px solid #f3f4f6" },
  title: { margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" },
  subtitle: { marginTop: 4, fontSize: 13, color: "#6b7280" },
  search: { width: 260, padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb", outline: "none", fontSize: 14 },
  toastSuccess: { margin: "0 20px 12px", padding: "10px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, fontSize: 13, color: "#15803d" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14 },
  th: { textAlign: "left", padding: "14px 16px", fontSize: 12, color: "#6b7280", fontWeight: 600, background: "#fafafa" },
  row: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "16px", verticalAlign: "middle" },
  tdMuted: { padding: "16px", color: "#6b7280", fontSize: 13 },
  userCell: { display: "flex", alignItems: "center", gap: 12 },
  avatar: { width: 38, height: 38, borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 },
  name: { fontWeight: 600, color: "#111827" },
  email: { fontSize: 12, color: "#6b7280" },
  menuTrigger: { background: "none", border: "1px solid #e5e7eb", borderRadius: 7, padding: "5px 7px", cursor: "pointer", display: "flex", alignItems: "center", color: "#64748b" },
  menu: { position: "absolute", right: 0, top: "calc(100% + 4px)", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 10, minWidth: 190, overflow: "hidden" },
  menuItem: { display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "inherit", color: "#374151", textAlign: "left" },
};

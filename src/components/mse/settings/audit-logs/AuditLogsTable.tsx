"use client";

import { getAuditLog, AuditEntry } from "@/security/audit-logger";

const ACTION_COLOR: Record<string, { bg: string; color: string }> = {
  USER_LOGIN:           { bg: "#eff6ff", color: "#1d4ed8" },
  USER_LOGOUT:          { bg: "#f8fafc", color: "#475569" },
  PASSWORD_RESET:       { bg: "#faf5ff", color: "#7c3aed" },
  TRANSACTION_CREATE:   { bg: "#f0fdf4", color: "#15803d" },
  TRANSACTION_UPDATE:   { bg: "#fffbeb", color: "#b45309" },
  TRANSACTION_DELETE:   { bg: "#fef2f2", color: "#b91c1c" },
  EVIDENCE_UPLOAD:      { bg: "#f0f9ff", color: "#0369a1" },
  EVIDENCE_DELETE:      { bg: "#fef2f2", color: "#b91c1c" },
  FLAG_CREATED:         { bg: "#fff7ed", color: "#c2410c" },
  FLAG_RESOLVED:        { bg: "#f0fdf4", color: "#15803d" },
  MEMBER_INVITED:       { bg: "#eff6ff", color: "#1d4ed8" },
  MEMBER_SUSPENDED:     { bg: "#fef2f2", color: "#b91c1c" },
  MEMBER_ACTIVATED:     { bg: "#f0fdf4", color: "#15803d" },
};

export default function AuditLogsTable() {
  const logs = [...getAuditLog()].reverse();

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <h3 style={s.title}>Audit Trail</h3>
          <p style={s.subtitle}>Immutable log of all critical system actions — {logs.length} entries</p>
        </div>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Timestamp</th>
              <th style={s.th}>User</th>
              <th style={s.th}>Role</th>
              <th style={s.th}>Action</th>
              <th style={s.th}>Resource</th>
              <th style={s.th}>Detail</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                  No audit entries yet.
                </td>
              </tr>
            ) : (
              logs.map((log: AuditEntry) => {
                const chip = ACTION_COLOR[log.action] ?? { bg: "#f1f5f9", color: "#475569" };
                return (
                  <tr key={log.id} style={s.row}>
                    <td style={s.tdMono}>
                      {new Date(log.timestamp).toLocaleString(undefined, {
                        month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td style={s.td}>
                      <div style={s.userCell}>
                        <div style={s.avatar}>{log.userEmail.charAt(0).toUpperCase()}</div>
                        <span style={s.email}>{log.userEmail}</span>
                      </div>
                    </td>
                    <td style={s.td}>
                      <span style={{ ...s.roleChip, ...ROLE_COLOR[log.userRole] ?? {} }}>
                        {log.userRole}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{ ...s.actionChip, background: chip.bg, color: chip.color }}>
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={s.tdMono}>{log.targetResourceId}</td>
                    <td style={{ ...s.td, color: "#374151", maxWidth: 260 }}>{log.detail}</td>
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

const ROLE_COLOR: Record<string, React.CSSProperties> = {
  CLIENT:  { background: "#eff6ff", color: "#1e40af" },
  MEMBER:  { background: "#f0fdf4", color: "#166534" },
  AUDITOR: { background: "#faf5ff", color: "#6b21a8" },
  ADMIN:   { background: "#fff7ed", color: "#9a3412" },
};

const s: Record<string, React.CSSProperties> = {
  container: { background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" },
  header: { padding: "20px 20px 16px", borderBottom: "1px solid #f3f4f6" },
  title: { margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" },
  subtitle: { marginTop: 4, fontSize: 13, color: "#6b7280" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    textAlign: "left", padding: "10px 14px", fontSize: 11,
    color: "#6b7280", fontWeight: 600, background: "#fafafa",
    borderBottom: "1px solid #f3f4f6", whiteSpace: "nowrap",
  },
  row: { borderBottom: "1px solid #f9fafb" },
  td: { padding: "12px 14px", verticalAlign: "middle", color: "#111827" },
  tdMono: { padding: "12px 14px", fontFamily: "monospace", fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" },
  userCell: { display: "flex", alignItems: "center", gap: 8 },
  avatar: {
    width: 28, height: 28, borderRadius: "50%",
    background: "#1e3a8a", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 11, flexShrink: 0,
  },
  email: { fontSize: 12, color: "#374151" },
  roleChip: {
    display: "inline-block", fontSize: 11, fontWeight: 600,
    padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap",
  },
  actionChip: {
    display: "inline-block", fontSize: 11, fontWeight: 600,
    padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap",
  },
};

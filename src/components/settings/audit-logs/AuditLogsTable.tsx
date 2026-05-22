"use client";

interface Log {
  id: number;
  user: string;
  action: string;
  timestamp: string;
}

interface Props {
  logs: Log[];
}

export default function AuditLogsTable({ logs }: Props) {
  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h3 style={styles.title}>Audit Logs</h3>
        <p style={styles.subtitle}>
          Track all system activities and user actions.
        </p>
      </div>

      {/* TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Action</th>
              <th style={styles.th}>Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={styles.row}>
                <td style={styles.tdUser}>
                  <div style={styles.userAvatar}>
                    {log.user.charAt(0)}
                  </div>
                  <span style={styles.userText}>{log.user}</span>
                </td>

                <td style={styles.td}>{log.action}</td>

                <td style={styles.tdTime}>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    border: "1px solid #e5e7eb",
  },

  header: {
    marginBottom: 14,
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

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    fontSize: 14,
  },

  th: {
    textAlign: "left",
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    padding: "8px 12px",
    borderBottom: "1px solid #f3f4f6",
  },

  row: {
    background: "#f9fafb",
    transition: "all 0.2s ease",
  },

  td: {
    padding: "12px",
    color: "#111827",
  },

  tdUser: {
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  tdTime: {
    padding: "12px",
    color: "#6b7280",
    fontSize: 13,
  },

  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#1e3a8a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
  },

  userText: {
    fontWeight: 500,
    color: "#111827",
  },
};
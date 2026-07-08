"use client";

const permissions = [
  "Upload Evidence",
  "Approve Transactions",
  "Manage Users",
  "Export Reports",
];

export default function PermissionsMatrix() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Permissions Matrix</h3>
        <p style={styles.subtitle}>
          Control what actions users are allowed to perform.
        </p>
      </div>

      <div style={styles.list}>
        {permissions.map((p) => (
          <div key={p} style={styles.row}>
            <span style={styles.label}>{p}</span>
            <input type="checkbox" style={styles.checkbox} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   STYLES (PUT IT HERE 👇)
========================= */

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    border: "1px solid #e5e7eb",
  },

  header: {
    marginBottom: 16,
  },

  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 12px",
    borderRadius: 10,
    transition: "all 0.2s ease",
    border: "1px solid #f3f4f6",
    cursor: "pointer",
  },

  label: {
    fontSize: 14,
    fontWeight: 500,
    color: "#111827",
  },

  checkbox: {
    width: 16,
    height: 16,
    cursor: "pointer",
  },
};



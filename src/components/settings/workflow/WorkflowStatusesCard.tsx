"use client";

const statuses = ["Open", "In Review", "Escalated", "Resolved"];

export default function WorkflowStatusesCard() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Workflow Statuses</h3>
        <p style={styles.subtitle}>
          Track lifecycle of audit transactions.
        </p>
      </div>

      <div style={styles.list}>
        {statuses.map((status) => (
          <div key={status} style={styles.item}>
            {status}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
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
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  item: {
    padding: "10px 12px",
    borderRadius: 10,
    background: "#f9fafb",
    fontSize: 14,
    fontWeight: 500,
    color: "#111827",
    border: "1px solid #f3f4f6",
  },
};
"use client";

export default function AutoAssignmentCard() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Auto Assignment</h3>
        <p style={styles.subtitle}>
          Automatically assign transactions to reviewers.
        </p>
      </div>

      <label style={styles.row}>
        <input type="checkbox" style={styles.checkbox} />
        <span style={styles.label}>Enable auto assignment</span>
      </label>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
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
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 10,
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
  },
};
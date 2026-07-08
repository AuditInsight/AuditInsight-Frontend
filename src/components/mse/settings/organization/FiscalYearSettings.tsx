"use client";

export default function FiscalYearSettings() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Fiscal Year</h3>
        <p style={styles.subtitle}>
          Define reporting period
        </p>
      </div>

      <div style={styles.row}>
        <div style={styles.field}>
          <span style={styles.label}>Start Date</span>
          <input type="date" style={styles.input} />
        </div>

        <div style={styles.field}>
          <span style={styles.label}>End Date</span>
          <input type="date" style={styles.input} />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
  },

  header: {
    marginBottom: 16,
  },

  title: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },

  row: {
    display: "flex",
    gap: 12,
  },

  field: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  label: {
    fontSize: 12,
    color: "#6b7280",
  },

  input: {
    height: 40,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    padding: "0 10px",
    outline: "none",
  },
};



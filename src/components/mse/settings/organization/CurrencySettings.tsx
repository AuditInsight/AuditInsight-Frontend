"use client";

export default function CurrencySettings() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Currency Settings</h3>
        <p style={styles.subtitle}>
          Default reporting currency
        </p>
      </div>

      <div style={styles.field}>
        <span style={styles.label}>Currency</span>

        <select style={styles.select}>
          <option>RWF</option>
          <option>USD</option>
          <option>EUR</option>
        </select>
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

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  label: {
    fontSize: 12,
    color: "#6b7280",
  },

  select: {
    height: 40,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    padding: "0 10px",
    outline: "none",
    background: "#fff",
  },
};
"use client";

export default function EvidenceRequirementsCard() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Evidence Requirements</h3>
        <p style={styles.subtitle}>
          Standard documents required for audit validation.
        </p>
      </div>

      <div style={styles.list}>
        <div style={styles.item}>Invoice document</div>
        <div style={styles.item}>Approval signature</div>
        <div style={styles.item}>Payment proof</div>
      </div>
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
    border: "1px solid #f3f4f6",
    fontSize: 14,
    color: "#111827",
    fontWeight: 500,
  },
};



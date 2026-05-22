"use client";

export default function ApprovalLimitsCard() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Approval Limits</h3>
        <p style={styles.subtitle}>
          Define financial thresholds for approvals.
        </p>
      </div>

      <div style={styles.box}>
        Transactions above <b>5,000,000 RWF</b> require CFO approval.
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
    color: "#111827",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
  },

  box: {
    padding: 12,
    borderRadius: 10,
    background: "#f9fafb",
    fontSize: 14,
    color: "#111827",
    border: "1px solid #f3f4f6",
  },
};
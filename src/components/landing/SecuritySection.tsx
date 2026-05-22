// components/landing/SecuritySection.tsx

"use client";

export default function SecuritySection() {
  return (
    <section
      id="security"
      style={styles.section}
    >
      <div style={styles.card}>
        <h2>
          Enterprise Security &
          Compliance
        </h2>

        <div style={styles.grid}>
          <div>✓ Role-Based Access</div>
          <div>✓ Audit Logs</div>
          <div>✓ Evidence Tracking</div>
          <div>✓ Session Management</div>
          <div>✓ Approval Controls</div>
          <div>✓ Fraud Monitoring</div>
        </div>
      </div>
    </section>
  );
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  section: {
    padding: "20px 48px 80px",
  },

  card: {
    background: "#0f172a",
    borderRadius: 24,
    padding: 50,
    color: "#fff",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: 20,
    marginTop: 30,
  },
};
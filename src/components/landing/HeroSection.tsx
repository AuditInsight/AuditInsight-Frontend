// components/landing/HeroSection.tsx

"use client";

export default function HeroSection() {
  return (
    <section style={styles.section}>
      <div style={styles.left}>
        <div style={styles.badge}>
          AI-Powered Audit Intelligence
        </div>

        <h1 style={styles.title}>
          Modern Audit &
          <br />
          Compliance Operating System
        </h1>

        <p style={styles.text}>
          Track transactions, verify
          evidence, detect fraud risks,
          automate reviews, and monitor
          audit readiness in real time.
        </p>

        <div style={styles.actions}>
          <button style={styles.primaryBtn}>
            Start Free Trial
          </button>

          <button style={styles.secondaryBtn}>
            Watch Demo
          </button>
        </div>

        <div style={styles.stats}>
          <div>
            <h3>98%</h3>
            <span>Evidence Accuracy</span>
          </div>

          <div>
            <h3>24/7</h3>
            <span>Risk Monitoring</span>
          </div>

          <div>
            <h3>1.2M+</h3>
            <span>Transactions Reviewed</span>
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.mockup}>
          <div style={styles.mockHeader}>
            Audit Readiness
          </div>

          <div style={styles.score}>
            84%
          </div>

          <div style={styles.row}>
            <span>Linked Evidence</span>
            <strong>92%</strong>
          </div>

          <div style={styles.row}>
            <span>Critical Issues</span>
            <strong>14</strong>
          </div>

          <div style={styles.row}>
            <span>Fraud Alerts</span>
            <strong>6</strong>
          </div>
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
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 60,
    alignItems: "center",
    padding: "90px 48px",
  },

  left: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  badge: {
    width: "fit-content",
    padding: "8px 14px",
    borderRadius: 999,
    background: "#dbeafe",
    color: "#1e3a8a",
    fontWeight: 700,
    fontSize: 13,
  },

  title: {
    fontSize: 64,
    lineHeight: 1.05,
    margin: 0,
    color: "#111827",
    fontWeight: 800,
  },

  text: {
    fontSize: 18,
    lineHeight: 1.7,
    color: "#4b5563",
    maxWidth: 600,
  },

  actions: {
    display: "flex",
    gap: 14,
  },

  primaryBtn: {
    height: 50,
    padding: "0 24px",
    borderRadius: 12,
    border: "none",
    background: "#1e3a8a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
  },

  secondaryBtn: {
    height: 50,
    padding: "0 24px",
    borderRadius: 12,
    border: "1px solid #dbe3ee",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
  },

  stats: {
    display: "flex",
    gap: 40,
    marginTop: 10,
  },

  right: {
    display: "flex",
    justifyContent: "center",
  },

  mockup: {
    width: 420,
    background: "#fff",
    borderRadius: 24,
    padding: 28,
    boxShadow:
      "0 20px 50px rgba(15,23,42,0.08)",
    border: "1px solid #e5e7eb",
  },

  mockHeader: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
  },

  score: {
    fontSize: 72,
    fontWeight: 800,
    color: "#1e3a8a",
    marginBottom: 24,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: "1px solid #f1f5f9",
  },
};
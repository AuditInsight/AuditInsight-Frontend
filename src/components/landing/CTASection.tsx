// components/landing/CTASection.tsx

"use client";

export default function CTASection() {
  return (
    <section style={styles.section}>
      <div style={styles.card}>
        <h2>
          Start Building Audit
          Intelligence Today
        </h2>

        <p>
          Modernize compliance, evidence,
          and review workflows with
          AuditInsight.
        </p>

        <button style={styles.btn}>
          Start Free Trial
        </button>
      </div>
    </section>
  );
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  section: {
    padding: "20px 48px 100px",
  },

  card: {
    background: "#1e3a8a",
    borderRadius: 28,
    padding: 60,
    textAlign: "center",
    color: "#fff",
  },

  btn: {
    marginTop: 24,
    height: 50,
    padding: "0 28px",
    borderRadius: 12,
    border: "none",
    background: "#fff",
    color: "#1e3a8a",
    fontWeight: 700,
    cursor: "pointer",
  },
};
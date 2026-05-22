// components/landing/DemoSection.tsx

"use client";

export default function DemoSection() {
  return (
    <section style={styles.section}>
      <div style={styles.card}>
        <h2>Platform Walkthrough</h2>

        <p>
          See how AuditInsight manages
          transactions, evidence,
          reviews, and reporting.
        </p>

        <div style={styles.video}>
          Demo Video Placeholder
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
    padding: "40px 48px 80px",
  },

  card: {
    background: "#fff",
    borderRadius: 24,
    padding: 32,
    border: "1px solid #e5e7eb",
  },

  video: {
    height: 480,
    borderRadius: 20,
    background: "#0f172a",
    marginTop: 24,
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 22,
    fontWeight: 700,
  },
};
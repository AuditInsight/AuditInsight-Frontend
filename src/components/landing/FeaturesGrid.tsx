// components/landing/FeaturesGrid.tsx

"use client";

const features = [
  {
    title: "Transaction Monitoring",
    text: "Track and review financial activity in real time.",
  },

  {
    title: "Evidence Management",
    text: "Link invoices, receipts, and approvals to transactions.",
  },

  {
    title: "Fraud Detection",
    text: "Detect duplicates, suspicious approvals, and anomalies.",
  },

  {
    title: "Review Queue",
    text: "Manage unresolved issues and compliance findings.",
  },

  {
    title: "Audit Readiness",
    text: "Monitor preparedness with live readiness scoring.",
  },

  {
    title: "Executive Reporting",
    text: "Generate audit insights, exports, and compliance reports.",
  },
];

export default function FeaturesGrid() {
  return (
    <section
      id="features"
      style={styles.section}
    >
      <div style={styles.heading}>
        <h2>Everything Needed For Modern Audits</h2>

        <p>
          Centralized audit intelligence
          platform for finance and
          compliance teams.
        </p>
      </div>

      <div style={styles.grid}>
        {features.map((feature) => (
          <div
            key={feature.title}
            style={styles.card}
          >
            <h3>{feature.title}</h3>

            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  section: {
    padding: "80px 48px",
  },

  heading: {
    textAlign: "center",
    marginBottom: 50,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: 24,
  },

  card: {
    background: "#fff",
    borderRadius: 20,
    padding: 28,
    border: "1px solid #e5e7eb",
    minHeight: 220,
  },
};
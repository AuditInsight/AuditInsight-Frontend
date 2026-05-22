// components/landing/HowItWorks.tsx

"use client";

const steps = [
  "Transactions",
  "Evidence Upload",
  "AI Review Engine",
  "Audit Reports",
];

export default function HowItWorks() {
  return (
    <section style={styles.section}>
      <h2>How AuditInsight Works</h2>

      <div style={styles.flow}>
        {steps.map((step, index) => (
          <div key={step} style={styles.item}>
            <div style={styles.circle}>
              {index + 1}
            </div>

            <span>{step}</span>
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
    textAlign: "center",
  },

  flow: {
    display: "flex",
    justifyContent: "center",
    gap: 30,
    marginTop: 40,
    flexWrap: "wrap",
  },

  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
  },

  circle: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "#1e3a8a",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 800,
    fontSize: 22,
  },
};
// components/landing/Testimonials.tsx

"use client";

const testimonials = [
  {
    name: "Finance Director",
    text: "AuditInsight transformed how we prepare for audits.",
  },

  {
    name: "Internal Auditor",
    text: "The review queue and readiness reporting are incredibly useful.",
  },

  {
    name: "Compliance Officer",
    text: "Fraud monitoring and evidence tracking save us hours weekly.",
  },
];

export default function Testimonials() {
  return (
    <section style={styles.section}>
      <h2>What Teams Say</h2>

      <div style={styles.grid}>
        {testimonials.map((t) => (
          <div key={t.name} style={styles.card}>
            <p>{t.text}</p>

            <strong>{t.name}</strong>
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

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: 24,
    marginTop: 40,
  },

  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 28,
    border: "1px solid #e5e7eb",
  },
};
// components/landing/TrustedSection.tsx

"use client";

const items = [
  "Internal Audit Teams",
  "Finance Departments",
  "Compliance Officers",
  "Enterprise Review Teams",
];

export default function TrustedSection() {
  return (
    <section style={styles.section}>
      <p style={styles.title}>
        Trusted by modern finance and
        audit teams
      </p>

      <div style={styles.grid}>
        {items.map((item) => (
          <div key={item} style={styles.card}>
            {item}
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
    padding: "20px 48px 70px",
  },

  title: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 30,
    fontWeight: 600,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: 20,
  },

  card: {
    height: 80,
    borderRadius: 16,
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #e5e7eb",
    fontWeight: 700,
  },
};
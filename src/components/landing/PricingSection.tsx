// components/landing/PricingSection.tsx

"use client";

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    storage: "2 GB",
    users: "2 Users",
    features: [
      "Basic reports",
      "100 transactions",
      "Limited storage",
    ],
  },

  {
    name: "Basic",
    price: "$49/mo",
    storage: "50 GB",
    users: "5 Users",
    features: [
      "Review queue",
      "Evidence management",
      "Risk alerts",
    ],
  },

  {
    name: "Professional",
    price: "$149/mo",
    storage: "250 GB",
    users: "20 Users",
    features: [
      "AI fraud detection",
      "Advanced reports",
      "Workflow automation",
    ],
  },

  {
    name: "Enterprise",
    price: "Custom",
    storage: "Unlimited",
    users: "Unlimited Users",
    features: [
      "SSO",
      "Unlimited storage",
      "Dedicated support",
    ],
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      style={styles.section}
    >
      <div style={styles.heading}>
        <h2>Pricing Plans</h2>

        <p>
          Flexible plans for teams of
          all sizes.
        </p>
      </div>

      <div style={styles.grid}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={styles.card}
          >
            <h3>{plan.name}</h3>

            <div style={styles.price}>
              {plan.price}
            </div>

            <p>{plan.storage}</p>

            <p>{plan.users}</p>

            <div style={styles.features}>
              {plan.features.map((f) => (
                <div key={f}>✓ {f}</div>
              ))}
            </div>

            <button style={styles.btn}>
              Get Started
            </button>
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
    padding: "90px 48px",
  },

  heading: {
    textAlign: "center",
    marginBottom: 50,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: 24,
  },

  card: {
    background: "#fff",
    borderRadius: 20,
    padding: 30,
    border: "1px solid #e5e7eb",
  },

  price: {
    fontSize: 42,
    fontWeight: 800,
    margin: "20px 0",
  },

  features: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    margin: "24px 0",
  },

  btn: {
    width: "100%",
    height: 46,
    borderRadius: 12,
    border: "none",
    background: "#1e3a8a",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};
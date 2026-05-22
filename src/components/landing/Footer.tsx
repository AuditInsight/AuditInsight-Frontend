// components/landing/Footer.tsx

"use client";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div>
        <h3>AuditInsight</h3>

        <p>
          AI-powered audit intelligence
          platform.
        </p>
      </div>

      <div style={styles.links}>
        <span>Pricing</span>
        <span>Security</span>
        <span>Documentation</span>
        <span>Contact</span>
      </div>
    </footer>
  );
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  footer: {
    padding: "40px 48px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    background: "#fff",
  },

  links: {
    display: "flex",
    gap: 20,
    color: "#6b7280",
  },
};
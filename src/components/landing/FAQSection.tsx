// components/landing/FAQSection.tsx

"use client";

const faqs = [
  {
    q: "Can I export reports?",
    a: "Yes, reports can be exported to PDF, CSV, and Excel.",
  },

  {
    q: "Does AuditInsight support fraud detection?",
    a: "Yes, the platform includes AI-powered risk and fraud monitoring.",
  },

  {
    q: "Can multiple auditors collaborate?",
    a: "Yes, teams can collaborate using roles and permissions.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      style={styles.section}
    >
      <h2>Frequently Asked Questions</h2>

      <div style={styles.list}>
        {faqs.map((faq) => (
          <div
            key={faq.q}
            style={styles.item}
          >
            <h4>{faq.q}</h4>

            <p>{faq.a}</p>
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

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginTop: 30,
  },

  item: {
    background: "#fff",
    borderRadius: 18,
    padding: 24,
    border: "1px solid #e5e7eb",
  },
};
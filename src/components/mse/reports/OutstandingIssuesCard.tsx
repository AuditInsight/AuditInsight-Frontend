"use client";

import type { CSSProperties } from "react";

interface Props {
  verificationProblems: number;
  complianceIssues: number;
  fraudFlags: number;
  controlViolations: number;
}

export default function OutstandingIssuesCard({
  verificationProblems,
  complianceIssues,
  fraudFlags,
  controlViolations,
}: Props) {
  const items = [
    {
      label: "Verification Problems",
      value: verificationProblems,
    },
    {
      label: "Compliance Issues",
      value: complianceIssues,
    },
    {
      label: "Fraud Flags",
      value: fraudFlags,
    },
    {
      label: "Control Violations",
      value: controlViolations,
    },
  ];

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>
        Outstanding Issues
      </h3>

      <div style={styles.list}>
        {items.map((item) => (
          <div
            key={item.label}
            style={styles.row}
          >
            <span>{item.label}</span>

            <span style={styles.badge}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<
  string,
  CSSProperties
> = {
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 16,
    color: "#111827",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14,
  },

  badge: {
    background: "#eff6ff",
    color: "#1e3a8a",
    borderRadius: 999,
    padding: "4px 10px",
    fontWeight: 700,
  },
};
"use client";

import type { CSSProperties } from "react";

interface Props {
  active: string;
  setActive: (value: string) => void;
}

const reportItems = [
  "Audit Readiness Report",
  "Evidence Completeness Report",
  "High-Risk Transactions",
  "Compliance Exposure",
  "Fraud & Duplicate Alerts",
  "Internal Audit Findings",
];

export default function ReportsSidebar({
  active,
  setActive,
}: Props) {
  return (
    <div style={styles.container}>
      {reportItems.map((item) => {
        const isActive = active === item;

        return (
          <div
            key={item}
            onClick={() => setActive(item)}
            style={{
              ...styles.item,
              ...(isActive ? styles.activeItem : {}),
            }}
          >
            <span>{item}</span>
          </div>
        );
      })}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    overflow: "hidden",
    height: "fit-content",
  },

  item: {
    padding: "16px 18px",
    borderBottom: "1px solid #f1f5f9",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    color: "#334155",
    transition: "all 0.2s ease",
  },

  activeItem: {
    background: "#1e3a8a",
    color: "#fff",
  },
};
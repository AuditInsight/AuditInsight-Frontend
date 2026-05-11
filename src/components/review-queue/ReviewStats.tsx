"use client";

import { ReviewItem } from "@/lib/reviewEngine";

interface Props {
  data: ReviewItem[];
}

export default function ReviewStats({
  data,
}: Props) {
  /* =========================
     KPI COUNTS
  ========================= */

  const critical = data.filter(
    (d) => d.risk === "Critical"
  ).length;

  const medium = data.filter(
    (d) => d.risk === "Medium"
  ).length;

  const low = data.filter(
    (d) => d.risk === "Low"
  ).length;

  /* =========================
     OVERDUE ISSUES
  ========================= */

  const overdue = data.filter(
    (d) =>
      new Date(d.due) < new Date() &&
      d.status !== "Resolved"
  ).length;

  /* =========================
     KPI CARDS
  ========================= */

  const stats = [
    {
      label: "Critical",
      value: critical,
      color: "#ef4444",
    },

    {
      label: "Medium Risk",
      value: medium,
      color: "#f59e0b",
    },

    {
      label: "Low Risk",
      value: low,
      color: "#22c55e",
    },

    {
      label: "Overdue",
      value: overdue,
      color: "#7c3aed",
    },
  ];

  return (
    <div style={styles.container}>
      {stats.map((s) => (
        <div
          key={s.label}
          style={styles.card}
        >
          <span
            style={{
              ...styles.dot,
              background: s.color,
            }}
          />

          <span style={styles.label}>
            {s.value} {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* 🎨 STYLES */

const styles: Record<
  string,
  React.CSSProperties
> = {
  container: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 16,
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,

    padding: "12px 16px",

    display: "flex",
    alignItems: "center",
    gap: 10,

    fontSize: 14,
    fontWeight: 500,

    boxShadow:
      "0 2px 8px rgba(15,23,42,0.04)",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },

  label: {
    color: "#111827",
  },
};
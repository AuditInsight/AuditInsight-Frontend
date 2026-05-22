"use client";

import { ReviewItem } from "@/lib/reviewEngine";

interface Props {
  data: ReviewItem[];
}

export default function ReviewStats({ data }: Props) {
  /* =========================
     KPI COUNTS
  ========================= */
  const critical = data.filter((d) => d.risk === "Critical").length;

  const medium = data.filter((d) => d.risk === "Medium").length;

  const low = data.filter((d) => d.risk === "Low").length;

  const overdue = data.filter(
    (d) =>
      new Date(d.due) < new Date() &&
      d.status !== "Resolved"
  ).length;

  /* =========================
     KPI CARDS
  ========================= */
  const stats = [
    { label: "Critical", value: critical, color: "#ef4444" },
    { label: "Medium Risk", value: medium, color: "#f59e0b" },
    { label: "Low Risk", value: low, color: "#22c55e" },
    { label: "Overdue", value: overdue, color: "#7c3aed" },
  ];

  return (
    <div style={styles.container}>
      {stats.map((s) => (
        <div key={s.label} style={styles.card}>
          <span
            style={{
              ...styles.dot,
              background: s.color,
            }}
          />

          <div style={styles.textBlock}>
            <div style={styles.value}>{s.value}</div>
            <div style={styles.label}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================
   STYLES (KPI DASHBOARD STYLE)
========================= */

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 16,
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: "14px 16px",

    display: "flex",
    alignItems: "center",
    gap: 12,

    fontSize: 14,
    fontWeight: 600,

    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
    transition: "all 0.2s ease",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },

  textBlock: {
    display: "flex",
    flexDirection: "column",
  },

  value: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1.1,
  },

  label: {
    fontSize: 12,
    fontWeight: 500,
    color: "#6b7280",
    marginTop: 2,
  },
};
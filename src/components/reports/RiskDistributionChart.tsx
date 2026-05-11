"use client";

import type { CSSProperties } from "react";

import { ReviewItem } from "@/lib/reviewEngine";

interface Props {
  reviews: ReviewItem[];
}

export default function RiskDistributionChart({
  reviews,
}: Props) {
  const critical = reviews.filter(
    (r) => r.risk === "Critical"
  ).length;

  const medium = reviews.filter(
    (r) => r.risk === "Medium"
  ).length;

  const low = reviews.filter(
    (r) => r.risk === "Low"
  ).length;

  const data = [
    {
      label: "Critical",
      value: critical,
      color: "#ef4444",
    },
    {
      label: "Medium",
      value: medium,
      color: "#f59e0b",
    },
    {
      label: "Low",
      value: low,
      color: "#22c55e",
    },
  ];

  const total =
    critical + medium + low || 1;

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>
        Risk Distribution
      </h3>

      <div style={styles.chart}>
        {data.map((item) => {
          const width =
            (item.value / total) * 100;

          return (
            <div
              key={item.label}
              style={styles.item}
            >
              <div style={styles.row}>
                <span>{item.label}</span>

                <span>
                  {item.value}
                </span>
              </div>

              <div style={styles.track}>
                <div
                  style={{
                    ...styles.bar,
                    width: `${width}%`,
                    background: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
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
    marginBottom: 18,
  },

  chart: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  item: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
  },

  track: {
    height: 10,
    background: "#f3f4f6",
    borderRadius: 999,
    overflow: "hidden",
  },

  bar: {
    height: "100%",
    borderRadius: 999,
  },
};
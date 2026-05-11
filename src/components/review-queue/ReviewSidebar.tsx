"use client";

import { useMemo } from "react";
import { ReviewItem } from "@/lib/reviewEngine";

interface Props {
  data: ReviewItem[];
  active: string;
  setActive: (value: string) => void;
}

export default function ReviewSidebar({
  data,
  active,
  setActive,
}: Props) {
  /* =========================
     COUNT ISSUES
  ========================= */
  const counts = useMemo(() => {
    return data.reduce((acc, item) => {
      acc[item.type] =
        (acc[item.type] || 0) + 1;

      return acc;
    }, {} as Record<string, number>);
  }, [data]);

  /* =========================
     REAL AUDIT SIDEBAR
  ========================= */
  const items = [
    {
      label: "All",
      count: data.length,
    },
    {
      label: "Missing Evidence",
      count:
        counts["Missing Evidence"] || 0,
    },
    {
      label: "Verification Problems",
      count:
        counts["Verification Problems"] || 0,
    },
    {
      label: "Compliance Issues",
      count:
        counts["Compliance Issues"] || 0,
    },
    {
      label: "Control Violations",
      count:
        counts["Control Violations"] || 0,
    },
    {
      label: "AI / Risk Flags",
      count:
        counts["AI / Risk Flags"] || 0,
    },
    {
      label: "System Errors",
      count:
        counts["System Errors"] || 0,
    },
  ];

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>
        Issues
      </h4>

      {items.map((item) => {
        const isActive =
          active === item.label;

        return (
          <div
            key={item.label}
            onClick={() =>
              setActive(item.label)
            }
            style={{
              ...styles.item,

              ...(isActive
                ? styles.itemActive
                : {}),
            }}
          >
            <span>{item.label}</span>

            <span style={styles.count}>
              {item.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* 🎨 STYLES */

const styles: Record<
  string,
  React.CSSProperties
> = {
  container: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 14,
    height: "fit-content",
  },

  title: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 12,
    color: "#111827",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    padding: "10px 12px",
    borderRadius: 8,

    cursor: "pointer",
    fontSize: 13,

    color: "#374151",

    transition: "all 0.2s ease",
    marginBottom: 4,
  },

  itemActive: {
    background: "#1e3a8a",
    color: "#fff",
    fontWeight: 600,
  },

  count: {
    fontSize: 12,
    opacity: 0.85,
  },
};
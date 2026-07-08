"use client";

import type { CSSProperties } from "react";

interface Props {
  complete: number;
  pending: number;
  missing: number;
}

export default function EvidenceBreakdownChart({
  complete,
  pending,
  missing,
}: Props) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        Evidence Completeness
      </h3>

      <div style={styles.items}>
        <div style={styles.row}>
          <span style={styles.left}>
            <span
              style={{
                ...styles.dot,
                background: "#22c55e",
              }}
            />
            Complete
          </span>

          <strong>{complete}%</strong>
        </div>

        <div style={styles.row}>
          <span style={styles.left}>
            <span
              style={{
                ...styles.dot,
                background: "#f59e0b",
              }}
            />
            Pending
          </span>

          <strong>{pending}%</strong>
        </div>

        <div style={styles.row}>
          <span style={styles.left}>
            <span
              style={{
                ...styles.dot,
                background: "#ef4444",
              }}
            />
            Missing
          </span>

          <strong>{missing}%</strong>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
  },

  items: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
};



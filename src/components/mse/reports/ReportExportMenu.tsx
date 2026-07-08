"use client";

import type { CSSProperties } from "react";

export default function ReportExportMenu() {
  return (
    <div style={styles.container}>
      <button style={styles.button}>
        Export PDF
      </button>

      <button style={styles.button}>
        Export Excel
      </button>

      <button style={styles.button}>
        Export CSV
      </button>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    gap: 10,
  },

  button: {
    height: 38,
    padding: "0 16px",
    borderRadius: 10,
    border: "1px solid #dbe3ee",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};



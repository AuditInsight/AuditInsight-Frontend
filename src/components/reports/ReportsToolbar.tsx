"use client";

import type { CSSProperties } from "react";

import { EvidenceDropdown } from "@/components/evidence/EvidenceDropdown";

interface Props {
  severity: string;
  setSeverity: (value: string) => void;
}

export default function ReportsToolbar({
  severity,
  setSeverity,
}: Props) {
  return (
    <div style={styles.container}>
      <div style={styles.filters}>
        <input
          placeholder="Search reports..."
          style={styles.search}
        />

        <input
          type="date"
          style={styles.input}
        />

        <EvidenceDropdown
          label={severity}
          options={[
            "All",
            "Critical",
            "Medium",
            "Low",
          ]}
          onChange={(value) => setSeverity(value)}
        />

        <EvidenceDropdown
          label="Transaction Type"
          options={[
            "All",
            "Expense",
            "Transfer",
            "Invoice",
          ]}
        />
      </div>

      <button style={styles.exportBtn}>
        Export
      </button>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  },

  filters: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  search: {
    height: 40,
    padding: "0 14px",
    borderRadius: 10,
    border: "1px solid #dbe3ee",
    minWidth: 220,
    fontSize: 14,
    outline: "none",
  },

  input: {
    height: 40,
    padding: "0 14px",
    borderRadius: 10,
    border: "1px solid #dbe3ee",
    fontSize: 14,
    outline: "none",
  },

  exportBtn: {
    height: 40,
    padding: "0 18px",
    borderRadius: 10,
    border: "none",
    background: "#1e3a8a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};
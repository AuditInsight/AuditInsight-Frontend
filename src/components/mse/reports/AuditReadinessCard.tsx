"use client";

import type { CSSProperties } from "react";

interface Props {
  readiness: number;
  linkedEvidencePercent: number;
  transactionsCount: number;
  evidenceCount: number;
}

export default function AuditReadinessCard({
  readiness,
  linkedEvidencePercent,
  transactionsCount,
  evidenceCount,
}: Props) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        Audit Readiness
      </div>

      <div style={styles.readiness}>
        {readiness}%
      </div>

      <div style={styles.grid}>
        <div style={styles.metric}>
          <span style={styles.label}>
            Transactions
          </span>

          <span style={styles.value}>
            {transactionsCount}
          </span>
        </div>

        <div style={styles.metric}>
          <span style={styles.label}>
            Evidence Docs
          </span>

          <span style={styles.value}>
            {evidenceCount}
          </span>
        </div>

        <div style={styles.metric}>
          <span style={styles.label}>
            Linked Evidence
          </span>

          <span style={styles.value}>
            {linkedEvidencePercent}%
          </span>
        </div>
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

  header: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 14,
    color: "#111827",
  },

  readiness: {
    fontSize: 42,
    fontWeight: 800,
    color: "#1e3a8a",
    marginBottom: 18,
  },

  grid: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  metric: {
    display: "flex",
    justifyContent: "space-between",
  },

  label: {
    color: "#6b7280",
    fontSize: 14,
  },

  value: {
    fontWeight: 700,
    color: "#111827",
  },
};
"use client";

import type { CSSProperties } from "react";

interface Props {
  organization: string;
  industry: string;
  country: string;
}

export default function OrganizationProfileCard({
  organization,
  industry,
  country,
}: Props) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Organization Profile</h3>
        <p style={styles.subtitle}>
          Basic information about your organization
        </p>
      </div>

      <div style={styles.grid}>
        <div style={styles.item}>
          <span style={styles.label}>Organization</span>
          <p style={styles.value}>{organization}</p>
        </div>

        <div style={styles.item}>
          <span style={styles.label}>Industry</span>
          <p style={styles.value}>{industry}</p>
        </div>

        <div style={styles.item}>
          <span style={styles.label}>Country</span>
          <p style={styles.value}>{country}</p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    border: "1px solid #e5e7eb",
  },

  header: {
    marginBottom: 16,
  },

  title: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
  },

  item: {
    padding: 12,
    borderRadius: 12,
    background: "#f9fafb",
    border: "1px solid #f3f4f6",
  },

  label: {
    fontSize: 12,
    color: "#6b7280",
  },

  value: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
  },
};



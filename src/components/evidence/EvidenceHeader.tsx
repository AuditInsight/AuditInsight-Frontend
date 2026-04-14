"use client";

import { theme } from "@/styles/theme"; // ✅ FIXED

export const EvidenceHeader = () => {
  return (
    <div style={wrapper}>
      <div style={header}>
        <h2 style={title}>Document Control Center</h2>

        <div style={actions}>
          <button style={secondaryBtn}>📤 Export</button>
          <button style={primaryBtn}>+ Add Evidence</button>
        </div>
      </div>
    </div>
  );
};

/* 🎨 STYLES */

/* ✅ UPDATED WRAPPER */
const wrapper: React.CSSProperties = {
  overflowX: "auto",
  marginTop: 16,
  marginBottom: theme.spacing.lg, // ✅ ADDED
  background: theme.colors.Surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  padding: theme.spacing.md,
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const title: React.CSSProperties = {
  fontSize: theme.typography.heading,
  fontWeight: 600,
  color: theme.colors.textPrimary,
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: theme.spacing.sm,
};

const secondaryBtn: React.CSSProperties = {
  padding: "8px 14px",
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.sm,
  background: theme.colors.Surface,
  cursor: "pointer",
  fontSize: theme.typography.sm,
};

const primaryBtn: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: theme.radius.sm,
  background: theme.colors.primary,
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: theme.typography.sm,
};
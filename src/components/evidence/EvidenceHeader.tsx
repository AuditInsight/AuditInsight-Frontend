"use client";

import { theme } from "@/styles/theme";

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

/* ✅ WRAPPER (CARD STYLE) */
const wrapper: React.CSSProperties = {
  overflowX: "auto",
  marginTop: 16,
  marginBottom: theme.spacing.lg,
  background: theme.colors.Surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  padding: theme.spacing.md,
};

/* ✅ HEADER LAYOUT */
const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

/* ✅ TITLE (USING YOUR SIMPLE STYLE BUT THEMED) */
const title: React.CSSProperties = {
  fontSize: 22, // 👈 kept your original size
  fontWeight: 600,
  color: theme.colors.textPrimary,
};

/* ✅ ACTIONS */
const actions: React.CSSProperties = {
  display: "flex",
  gap: 10, // 👈 kept your original spacing
};

/* ✅ BUTTONS */
const secondaryBtn: React.CSSProperties = {
  padding: "8px 14px",
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.sm,
  background: theme.colors.Surface,
  cursor: "pointer",
};

const primaryBtn: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: theme.radius.sm,
  background: theme.colors.primary,
  color: "#fff",
  border: "none",
  cursor: "pointer",
};
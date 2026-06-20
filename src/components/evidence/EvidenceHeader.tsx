"use client";

import { theme } from "@/styles/theme";

interface EvidenceHeaderProps {
  onAdd?: () => void;
  onExport?: () => void;
}

export const EvidenceHeader = ({
  onAdd,
  onExport,
}: EvidenceHeaderProps) => {
  return (
    <div style={wrapper}>
      <div style={header}>
        <h2 style={title}>Document Control Center</h2>

        <div style={actions}>
          <button type="button" style={secondaryBtn} onClick={onExport}>
            Export
          </button>

          {onAdd && (
            <button style={primaryBtn} onClick={onAdd}>
              + Add Evidence
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* 🎨 STYLES */

const wrapper: React.CSSProperties = {
  overflowX: "auto",
  marginTop: 16,
  marginBottom: theme.spacing.lg,
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
  fontSize: 22,
  fontWeight: 600,
  color: theme.colors.textPrimary,
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: 10,
};

const secondaryBtn: React.CSSProperties = {
  padding: "8px 14px",
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.sm,
  background: theme.colors.Surface,
  cursor: "pointer",
  color: theme.colors.textPrimary,
};

const primaryBtn: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: theme.radius.sm,
  background: theme.colors.primary,
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};
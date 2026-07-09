"use client";

import { Download, Plus, FileStack } from "lucide-react";
import { theme } from "@/styles/theme";

interface EvidenceHeaderProps {
  onAdd?: () => void;
  onExport?: () => void;
}

export const EvidenceHeader = ({ onAdd, onExport }: EvidenceHeaderProps) => {
  return (
    <div style={wrapper}>
      <div style={left}>
        <div style={iconWrap}>
          <FileStack size={20} color="#1e3a8a" />
        </div>
        <div>
          <h2 style={title}>Document Control Center</h2>
          <p style={subtitle}>Manage, upload and verify audit evidence</p>
        </div>
      </div>

      <div style={actions}>
        <button type="button" style={secondaryBtn} onClick={onExport}>
          <Download size={14} />
          Export CSV
        </button>
        {onAdd && (
          <button style={primaryBtn} onClick={onAdd}>
            <Plus size={14} />
            Add Evidence
          </button>
        )}
      </div>
    </div>
  );
};

const wrapper: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 16,
  padding: "20px 24px",
  background: "#fff",
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
};

const left: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const iconWrap: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  background: "#eff6ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 700,
  color: theme.colors.textPrimary,
  letterSpacing: "-0.3px",
};

const subtitle: React.CSSProperties = {
  margin: "2px 0 0",
  fontSize: 12.5,
  color: theme.colors.textMuted,
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
};

const secondaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  background: "#fff",
  cursor: "pointer",
  color: theme.colors.textPrimary,
  fontSize: 13,
  fontWeight: 500,
};

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 16px",
  borderRadius: theme.radius.md,
  background: "#1e3a8a",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
};

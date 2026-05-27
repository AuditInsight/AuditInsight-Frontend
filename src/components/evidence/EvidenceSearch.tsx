"use client";

import { Search } from "lucide-react";
import { theme } from "@/styles/theme"; // ✅ ADDED

export const EvidenceSearch = ({
  value,
  onChange,
  setPage,
}: {
  value: string;
  onChange: (v: string) => void;
  setPage: (page: number) => void;
}) => {
  return (
    <div style={container}>
      <Search size={14} color={theme.colors.textMuted} />

      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setPage(1); // 🔥 RESET PAGE
        }}
        placeholder="Search by name, category, amount, status…"
        style={input}
      />
    </div>
  );
};

/* 🎨 STYLES (THEME-BASED) */

const container: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.sm,
  padding: "6px 10px",
  background: theme.colors.Surface,
};

const input: React.CSSProperties = {
  border: "none",
  outline: "none",
  fontSize: theme.typography.sm,
  background: "transparent",
  color: theme.colors.textPrimary,
};
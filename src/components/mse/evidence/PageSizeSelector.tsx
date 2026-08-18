"use client";

import { theme } from "@/styles/theme";

interface PageSizeSelectorProps {
  pageSize: number;
  setPageSize: (size: number) => void;
  onPageSizeChange?: () => void;
}

export const PageSizeSelector = ({ pageSize, setPageSize, onPageSizeChange }: PageSizeSelectorProps) => {
  const sizes = [10, 25, 50, 100];

  const handleChange = (size: number) => {
    setPageSize(size);
    onPageSizeChange?.();
  };

  return (
    <div style={container}>
      <label style={label}>Items per page:</label>
      <select
        value={pageSize}
        onChange={(e) => handleChange(Number(e.target.value))}
        style={select}
      >
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};

const container: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const label: React.CSSProperties = {
  fontSize: "13px",
  color: theme.colors.textMuted,
  fontWeight: 500,
};

const select: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.border}`,
  fontSize: "13px",
  cursor: "pointer",
  background: "#fff",
  color: theme.colors.textPrimary,
};

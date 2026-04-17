"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { theme } from "@/styles/theme";

export const EvidenceDropdown = ({
  label,
  options,
}: {
  label: string;
  options: string[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={container}>
      <button
        style={button}
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div style={dropdown}>
          {options.map((opt) => (
            <div
              key={opt}
              style={item}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  theme.colors.appBackground)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* 🎨 STYLES */

const container: React.CSSProperties = {
  position: "relative",
};

/* ✅ THEME BUTTON */
const button: React.CSSProperties = {
  padding: "6px 12px",
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.sm,
  background: theme.colors.Surface,
  display: "flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
  fontSize: theme.typography.sm,
};

/* ✅ THEME DROPDOWN */
const dropdown: React.CSSProperties = {
  position: "absolute",
  top: "110%",
  left: 0,
  background: theme.colors.Surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.sm,
  boxShadow: theme.shadows.sm,
  width: 160,
  zIndex: 10,
};

/* ✅ ITEM */
const item: React.CSSProperties = {
  padding: "8px 10px",
  fontSize: theme.typography.sm,
  cursor: "pointer",
};
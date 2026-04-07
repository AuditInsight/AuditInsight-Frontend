"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
      <button style={button} onClick={() => setOpen(!open)}>
        {label}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div style={dropdown}>
          {options.map((opt) => (
            <div key={opt} style={item}>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* 🎨 */
const container = {
  position: "relative" as const,
};

const button = {
  padding: "6px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  background: "#fff",
  display: "flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
};

const dropdown = {
  position: "absolute" as const,
  top: "110%",
  left: 0,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  width: 160,
  zIndex: 10,
};

const item = {
  padding: "8px 10px",
  fontSize: 13,
  cursor: "pointer",
};
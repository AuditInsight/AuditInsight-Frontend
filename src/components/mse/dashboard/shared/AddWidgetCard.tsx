"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { metricCard } from "./dashboard.styles";

export default function AddWidgetCard({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...metricCard,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 10, cursor: "pointer",
        border: `2px dashed ${hovered ? "#3b82f6" : "#cbd5e1"}`,
        background: hovered ? "#f8fafc" : "#fff",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        background: hovered ? "#dbeafe" : "#f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hovered ? "#2563eb" : "#64748b",
        transition: "all 0.2s ease",
      }}>
        <Plus size={24} />
      </div>
      <span style={{ fontSize: 13, color: hovered ? "#2563eb" : "#94a3b8", fontWeight: 600 }}>
        Add new widget
      </span>
    </div>
  );
}

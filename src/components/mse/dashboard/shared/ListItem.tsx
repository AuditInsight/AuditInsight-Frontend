"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { listItemRow } from "./dashboard.styles";

interface Props {
  icon: React.ReactNode;
  iconBg: string;
  iconColor?: string;
  title: string;
  subtitle: string;
  rightLabel?: string;
  rightColor?: string;
  onClick?: () => void;
}

export default function ListItem({ icon, iconBg, iconColor, title, subtitle, rightLabel, rightColor, onClick }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ ...listItemRow, background: hovered ? "#f8fafc" : "transparent", cursor: onClick ? "pointer" : "default" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: iconBg, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: iconColor ?? "#64748b",
        }}>
          {icon}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {rightLabel && (
          <span style={{
            padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600,
            background: `${rightColor}15`, color: rightColor, whiteSpace: "nowrap",
          }}>
            {rightLabel}
          </span>
        )}
        {onClick && <ChevronRight size={16} style={{ color: "#94a3b8" }} />}
      </div>
    </div>
  );
}

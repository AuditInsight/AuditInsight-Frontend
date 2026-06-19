"use client";

import { useState } from "react";
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import { metricCard } from "./dashboard.styles";

interface Props {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: string;
  trendUp?: boolean;
  color: string;
  onClick?: () => void;
}

export default function MetricCard({ icon, value, label, trend, trendUp, color, onClick }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...metricCard,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 24px rgba(0,0,0,0.12)"
          : "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{ position: "absolute", top: 16, right: 16, color: "#94a3b8" }}>
        <ArrowUpRight size={16} />
      </div>
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: `${color}15`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color, marginBottom: 16,
      }}>
        {icon}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1 }}>
          {value}
        </span>
        {trend && (
          <span style={{
            padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: trendUp ? "#dbeafe" : "#f1f5f9",
            color: trendUp ? "#2563eb" : "#64748b",
            display: "flex", alignItems: "center", gap: 2,
          }}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>
        )}
      </div>
      <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

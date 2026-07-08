"use client";

import { useState } from "react";
import { RefreshCw, MoreHorizontal } from "lucide-react";
import { cardShell, iconButton } from "./dashboard.styles";

interface Props {
  title: string;
  count?: string | number;
  children: React.ReactNode;
  onRefresh?: () => void;
  onMore?: () => void;
  style?: React.CSSProperties;
}

export default function CardShell({ title, count, children, onRefresh, onMore, style }: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    if (!onRefresh) return;
    setRefreshing(true);
    onRefresh();
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div style={{ ...cardShell, ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{title}</h3>
          {count !== undefined && (
            <span style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
              {count}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {onRefresh && (
            <button style={iconButton} onClick={handleRefresh} title="Refresh">
              <RefreshCw size={16} style={{ color: "#94a3b8", animation: refreshing ? "spin 0.8s linear" : "none" }} />
            </button>
          )}
          {onMore && (
            <button style={iconButton} onClick={onMore} title="More options">
              <MoreHorizontal size={16} style={{ color: "#94a3b8" }} />
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

"use client";

import { Calendar, Download } from "lucide-react";
import { yearBtn, exportBtn } from "./dashboard.styles";

interface Props {
  color: string;
  userName: string;
  userEmail: string;
  orgName?: string;
  onExport: () => void;
}

export default function GreetingBanner({ color, userName, userEmail, orgName, onExport }: Props) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div style={{
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      padding: "24px 24px 42px",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 16,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500, letterSpacing: "0.5px" }}>
          {greeting}
        </p>
        <h1 style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", wordBreak: "break-word" }}>
          {userName}
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span>{userEmail}</span>
          {orgName && <><span style={{ opacity: 0.4 }}>·</span><span>{orgName}</span></>}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
        <button style={yearBtn}>
          <Calendar size={14} />
          {new Date().getFullYear()}
        </button>
        <button style={exportBtn} onClick={onExport}>
          <Download size={14} />
          Export Data
        </button>
      </div>
    </div>
  );
}



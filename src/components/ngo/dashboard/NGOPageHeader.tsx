"use client";

import { Download } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  onExport?: () => void;
  action?: React.ReactNode;
}

const ACCENT = "#0f172a";

export default function NGOPageHeader({ title, subtitle, onExport, action }: Props) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div style={s.header}>
      <div>
        <p style={s.eyebrow}>{greeting}</p>
        <h1 style={s.title}>{title}</h1>
        {subtitle && <p style={s.subtitle}>{subtitle}</p>}
        <p style={s.date}>{dateStr}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {action}
        {onExport && (
          <button type="button" style={s.btn} onClick={onExport}>
            <Download size={15} /> Export
          </button>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  header: {
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    gap: 20, flexWrap: "wrap",
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "22px 24px",
  },
  eyebrow:  { margin: 0, fontSize: 13, color: "#64748b", fontWeight: 500 },
  title:    { margin: "4px 0 0", fontSize: 24, fontWeight: 700, color: ACCENT, letterSpacing: "-0.4px" },
  subtitle: { margin: "6px 0 0", fontSize: 13, color: "#64748b" },
  date:     { margin: "4px 0 0", fontSize: 12, color: "#94a3b8" },
  btn: {
    display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px",
    borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff",
    color: ACCENT, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  },
};

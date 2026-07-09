"use client";

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  icon: React.ReactNode;
}

export default function NGOStatCard({ label, value, sub, accent, icon }: Props) {
  return (
    <div style={{
      flex: 1, minWidth: 140,
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      padding: 20,
      boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</span>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: accent + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: accent,
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: "#94a3b8" }}>{sub}</div>}
    </div>
  );
}

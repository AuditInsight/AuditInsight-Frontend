"use client";

interface Props {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export default function NGOEmptyState({ icon, title, subtitle, action }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 24px", gap: 12, textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
        {icon}
      </div>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{title}</p>
      {subtitle && <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", maxWidth: 320 }}>{subtitle}</p>}
      {action && (
        <button
          onClick={action.onClick}
          style={{ marginTop: 4, padding: "8px 18px", borderRadius: 9, border: "none", background: "#0f172a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

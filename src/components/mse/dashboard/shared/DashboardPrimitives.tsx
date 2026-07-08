"use client";

// ── SegmentedBar ──────────────────────────────────────────
export function SegmentedBar({ segments }: { segments: { value: number; color: string }[] }) {
  return (
    <div style={{ display: "flex", height: 12, borderRadius: 8, overflow: "hidden", gap: 4, marginBottom: 20, background: "#f1f5f9" }}>
      {segments.map((seg, i) => (
        <div
          key={i}
          style={{ flex: seg.value, background: seg.color, borderRadius: 4, minWidth: seg.value > 0 ? 12 : 0, transition: "all 0.3s ease" }}
        />
      ))}
    </div>
  );
}

// ── CategoryRow ───────────────────────────────────────────
export function CategoryRow({ dotColor, label, value }: { dotColor: string; label: string; value: string | number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor }} />
        <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{label}</span>
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{value}</span>
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────
export function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div style={{ padding: 32, textAlign: "center", color: "#94a3b8", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{message}</span>
    </div>
  );
}

// ── BarChart (inline sparkbar used in KPI cards) ──────────
export function SparkBars({ color }: { color: string }) {
  const bars = [35, 55, 42, 70, 48, 62, 50, 75, 58, 80, 65, 88, 72, 90];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "12px 0" }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{ flex: 1, background: `linear-gradient(180deg, ${color} 0%, ${color}88 100%)`, borderRadius: "6px 6px 0 0", height: `${h}%`, minHeight: 8, transition: "all 0.3s ease", cursor: "pointer" }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.75"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        />
      ))}
    </div>
  );
}



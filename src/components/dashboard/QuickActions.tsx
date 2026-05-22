import { Card } from "@/components/ui/card/card";

export default function QuickActions() {
  return (
    <Card>
      <h3>Quick Actions</h3>

      {/* 🚀 UPDATED LAYOUT (COLUMN + GAP) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button>➕ Upload Evidence</button>
        <button>🔍 Review Risks</button>
        <button>📊 Generate Report</button>
      </div>
    </Card>
  );
}
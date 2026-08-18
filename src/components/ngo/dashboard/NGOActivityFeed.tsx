"use client";

import { Clock, Info } from "lucide-react";

export default function NGOActivityFeed() {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Recent Activity</p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8" }}>Latest actions across all projects</p>
      </div>
      <div style={{ padding: "24px 20px", textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <Info size={22} style={{ color: "#94a3b8" }} />
        </div>
        <p style={{ margin: 0, fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}>Activity log coming soon</p>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#cbd5e1" }}>Transaction activity will appear here</p>
      </div>
    </div>
  );
}

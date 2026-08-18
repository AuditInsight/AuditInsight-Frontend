"use client";

import { ShieldCheck, Info } from "lucide-react";

export default function NGOComplianceScore() {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1e3a8a" }}>
            <ShieldCheck size={16} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Compliance Score</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>Overall audit readiness</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 20px", textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <Info size={22} style={{ color: "#94a3b8" }} />
        </div>
        <p style={{ margin: 0, fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}>Compliance scoring coming soon</p>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#cbd5e1" }}>Connect to audit engine to calculate scores</p>
      </div>
    </div>
  );
}

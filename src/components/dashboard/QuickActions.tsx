"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card/card";
import { usePermissions } from "@/security/access-control";

export default function QuickActions() {
  const router = useRouter();
  const { canUploadEvidence, canFlagIssue } = usePermissions();

  return (
    <Card>
      <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>Quick Actions</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {canUploadEvidence && (
          <button style={btn} onClick={() => router.push("/evidence")}>
            ➕ Upload Evidence
          </button>
        )}
        {canFlagIssue && (
          <button style={btn} onClick={() => router.push("/review-queue")}>
            🚩 Flag an Issue
          </button>
        )}
        <button style={btn} onClick={() => router.push("/review-queue")}>
          🔍 Review Risks
        </button>
        <button style={btn} onClick={() => router.push("/transactions")}>
          💳 View Transactions
        </button>
      </div>
    </Card>
  );
}

const btn: React.CSSProperties = {
  padding: "9px 14px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
  textAlign: "left",
};

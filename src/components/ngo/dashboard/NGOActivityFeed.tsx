"use client";

import { CheckCircle2, AlertTriangle, Upload, FileText, Clock } from "lucide-react";
import { useNGOTransactions } from "@/hooks/useNGOTransactions";
import { useNGOAuditFlags } from "@/hooks/useNGOAuditFlags";

interface ActivityItem {
  id: string;
  type: "completed" | "flagged" | "uploaded" | "resolved" | "created";
  title: string;
  subtitle: string;
  time: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

const TYPE_CFG = {
  completed: { icon: <CheckCircle2 size={14} />, color: "#15803d", bg: "#f0fdf4" },
  flagged: { icon: <AlertTriangle size={14} />, color: "#d97706", bg: "#fffbeb" },
  uploaded: { icon: <Upload size={14} />, color: "#1e3a8a", bg: "rgba(30,58,138,0.08)" },
  resolved: { icon: <CheckCircle2 size={14} />, color: "#2563eb", bg: "rgba(37,99,235,0.08)" },
  created: { icon: <FileText size={14} />, color: "#475569", bg: "#f1f5f9" },
};

export default function NGOActivityFeed() {
  const { transactions } = useNGOTransactions();
  const { flags } = useNGOAuditFlags();

  const activities: ActivityItem[] = [];

  transactions.forEach((txn) => {
    if (txn.status === "COMPLETED") {
      activities.push({
        id: `completed-${txn.id}`,
        type: "completed",
        title: `${txn.evidenceCount} evidence file${txn.evidenceCount !== 1 ? "s" : ""} verified`,
        subtitle: `${txn.projectName} · RWF ${txn.amount.toLocaleString()}`,
        time: formatTimeAgo(txn.createdAt),
        ...TYPE_CFG.completed,
      });
    } else if (txn.status === "PENDING") {
      activities.push({
        id: `created-${txn.id}`,
        type: "created",
        title: "New transaction recorded",
        subtitle: `${txn.projectName} · RWF ${txn.amount.toLocaleString()}`,
        time: formatTimeAgo(txn.createdAt),
        ...TYPE_CFG.created,
      });
    }
  });

  flags.forEach((flag) => {
    if (flag.status === "RESOLVED" && flag.resolvedAt) {
      activities.push({
        id: `resolved-${flag.id}`,
        type: "resolved",
        title: "Audit flag resolved",
        subtitle: `${flag.category} · ${flag.notes || "Issue resolved"}`,
        time: formatTimeAgo(flag.resolvedAt),
        ...TYPE_CFG.resolved,
      });
    } else if (flag.status === "OPEN") {
      activities.push({
        id: `flagged-${flag.id}`,
        type: "flagged",
        title: "Transaction flagged",
        subtitle: `${flag.category} · ${flag.notes || "Requires review"}`,
        time: formatTimeAgo(flag.flaggedAt),
        ...TYPE_CFG.flagged,
      });
    }
  });

  const sorted = activities.sort((a, b) => {
    const timeMap: Record<string, number> = {
      "Just now": 0,
      "m ago": 1,
      "h ago": 2,
      "d ago": 3,
    };
    const getWeight = (time: string) => {
      for (const [key, val] of Object.entries(timeMap)) {
        if (time.includes(key)) return val;
      }
      return 4;
    };
    return getWeight(a.time) - getWeight(b.time);
  });

  const items = sorted.slice(0, 6);

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Recent Activity</p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8" }}>Latest actions across all projects</p>
      </div>
      <div>
        {items.length === 0 ? (
          <div style={{ padding: "24px 20px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Clock size={22} style={{ color: "#94a3b8" }} />
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: "#94a3b8", fontWeight: 500 }}>No activity yet</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#cbd5e1" }}>Activity will appear here as you record transactions</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: idx < items.length - 1 ? "1px solid #f8fafc" : "none" }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 9, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.subtitle}</p>
              </div>
              <span style={{ fontSize: 11.5, color: "#94a3b8", whiteSpace: "nowrap", flexShrink: 0 }}>{item.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

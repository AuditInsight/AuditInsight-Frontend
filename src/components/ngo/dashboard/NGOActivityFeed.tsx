"use client";

import { CheckCircle2, AlertTriangle, Upload, Flag, FileText, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "completed" | "flagged" | "uploaded" | "resolved" | "created" | "pending";
  title: string;
  subtitle: string;
  time: string;
}

const DUMMY_ACTIVITY: ActivityItem[] = [
  { id: "1", type: "completed",  title: "Evidence verified",          subtitle: "TXN-001 · USAID Health Project",          time: "2 min ago"  },
  { id: "2", type: "flagged",    title: "Transaction flagged",         subtitle: "TXN-007 · GIZ Education Fund",            time: "18 min ago" },
  { id: "3", type: "uploaded",   title: "Evidence uploaded",           subtitle: "TXN-003 · Rwanda Health Foundation",      time: "1 hr ago"   },
  { id: "4", type: "resolved",   title: "Flag resolved",               subtitle: "FLAG-002 · UNICEF Water Project",         time: "3 hr ago"   },
  { id: "5", type: "created",    title: "New transaction recorded",    subtitle: "TXN-012 · World Bank Infrastructure",     time: "5 hr ago"   },
  { id: "6", type: "pending",    title: "Evidence upload required",    subtitle: "TXN-009 · EU Climate Initiative",         time: "Yesterday"  },
];

const TYPE_CFG = {
  completed: { icon: <CheckCircle2 size={14} />, color: "#15803d", bg: "#f0fdf4" },
  flagged:   { icon: <AlertTriangle size={14} />, color: "#d97706", bg: "#fffbeb" },
  uploaded:  { icon: <Upload size={14} />,        color: "#1e3a8a", bg: "rgba(30,58,138,0.08)" },
  resolved:  { icon: <CheckCircle2 size={14} />,  color: "#2563eb", bg: "rgba(37,99,235,0.08)" },
  created:   { icon: <FileText size={14} />,      color: "#475569", bg: "#f1f5f9" },
  pending:   { icon: <Clock size={14} />,         color: "#64748b", bg: "#f8fafc" },
};

interface Props {
  maxItems?: number;
}

export default function NGOActivityFeed({ maxItems = 6 }: Props) {
  const items = DUMMY_ACTIVITY.slice(0, maxItems);

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Recent Activity</p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8" }}>Latest actions across all projects</p>
      </div>
      <div>
        {items.map((item, idx) => {
          const cfg = TYPE_CFG[item.type];
          return (
            <div
              key={item.id}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: idx < items.length - 1 ? "1px solid #f8fafc" : "none" }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 9, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", color: cfg.color, flexShrink: 0 }}>
                {cfg.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.subtitle}</p>
              </div>
              <span style={{ fontSize: 11.5, color: "#94a3b8", whiteSpace: "nowrap", flexShrink: 0 }}>{item.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { Shield, FileText, Flag, Upload, CheckCircle2 } from "lucide-react";
import { getAuditLog } from "@/security/audit-logger";
import type { AuditEntry } from "@/security/audit-logger";

const ACTION_TYPE_MAP: Record<string, "create" | "update" | "flag" | "upload" | "resolve"> = {
  TRANSACTION_CREATE: "create",
  TRANSACTION_UPDATE: "update",
  TRANSACTION_DELETE: "update",
  EVIDENCE_UPLOAD: "upload",
  EVIDENCE_DELETE: "upload",
  FLAG_CREATED: "flag",
  FLAG_RESOLVED: "resolve",
};

const TYPE_CFG = {
  create:  { icon: <FileText size={13} />,    color: "#1e3a8a", bg: "rgba(30,58,138,0.08)"  },
  update:  { icon: <FileText size={13} />,    color: "#2563eb", bg: "rgba(37,99,235,0.08)"  },
  flag:    { icon: <Flag size={13} />,        color: "#d97706", bg: "#fffbeb"               },
  upload:  { icon: <Upload size={13} />,      color: "#475569", bg: "#f1f5f9"               },
  resolve: { icon: <CheckCircle2 size={13} />, color: "#15803d", bg: "#f0fdf4"              },
};

interface Props {
  maxItems?: number;
}

export default function NGOAuditTrail({ maxItems = 6 }: Props) {
  const auditLog = [...getAuditLog()].reverse();
  const entries = auditLog.slice(0, maxItems);

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1e3a8a" }}>
          <Shield size={16} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Audit Trail</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>Immutable log of all user actions</p>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              {["Action", "Actor", "Target", "Timestamp"].map((h) => (
                <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                  No audit entries yet
                </td>
              </tr>
            ) : (
              entries.map((entry, idx: number) => {
                const type = (ACTION_TYPE_MAP[entry.action as keyof typeof ACTION_TYPE_MAP] || "create") as keyof typeof TYPE_CFG;
                const cfg = TYPE_CFG[type];
                return (
                  <tr key={entry.id} style={{ borderBottom: idx < entries.length - 1 ? "1px solid #f8fafc" : "none" }}>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", color: cfg.color, flexShrink: 0 }}>
                          {cfg.icon}
                        </div>
                        <span style={{ fontWeight: 600, color: "#0f172a" }}>{entry.action.replace(/_/g, " ")}</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <p style={{ margin: 0, fontWeight: 600, color: "#0f172a", fontSize: 12 }}>{entry.userEmail}</p>
                      <p style={{ margin: "1px 0 0", fontSize: 11, color: "#94a3b8" }}>{entry.userRole}</p>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#64748b" }}>{entry.targetResourceId}</span>
                    </td>
                    <td style={{ padding: "11px 16px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
                      {new Date(entry.timestamp).toLocaleString(undefined, {
                        month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

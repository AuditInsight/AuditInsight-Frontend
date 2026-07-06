"use client";

import { useState } from "react";
import { Bell, CheckCheck, X } from "lucide-react";
import type { NGONotification, FlagSeverity } from "@/types/ngo";

interface Props {
  notifications: NGONotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
}

const SEVERITY_CONFIG: Record<FlagSeverity, { color: string; bg: string; border: string; dot: string }> = {
  CRITICAL: { color: "#0f172a",  bg: "#f1f5f9",              border: "#cbd5e1",              dot: "#334155" },
  HIGH:     { color: "#1e3a8a",  bg: "rgba(30,58,138,0.06)", border: "rgba(30,58,138,0.2)",  dot: "#1e3a8a" },
  MEDIUM:   { color: "#2563eb",  bg: "rgba(37,99,235,0.06)", border: "rgba(37,99,235,0.2)",  dot: "#2563eb" },
  LOW:      { color: "#475569",  bg: "#f8fafc",              border: "#e2e8f0",              dot: "#94a3b8" },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NGONotificationPanel({ notifications, onMarkRead, onMarkAllRead, onDismiss }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={s.panel}>
      {/* Panel header */}
      <div style={s.panelHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={s.bellWrap}>
            <Bell size={16} color="#0f172a" />
            {unreadCount > 0 && <span style={s.bellBadge}>{unreadCount}</span>}
          </div>
          <div>
            <h3 style={s.panelTitle}>Audit Alerts</h3>
            <p style={s.panelSub}>
              {unreadCount > 0 ? `${unreadCount} unread issue${unreadCount > 1 ? "s" : ""}` : "All caught up"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button style={s.markAllBtn} onClick={onMarkAllRead}>
            <CheckCheck size={13} />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div style={s.list}>
        {notifications.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}><CheckCheck size={22} color="#1e3a8a" /></div>
            <p style={s.emptyText}>No audit flags raised</p>
            <p style={s.emptySub}>Your auditor hasn't flagged any issues yet.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const cfg = SEVERITY_CONFIG[notif.severity];
            const isExpanded = expanded === notif.id;
            return (
              <div
                key={notif.id}
                style={{
                  ...s.notifCard,
                  background: notif.read ? "#fff" : cfg.bg,
                  borderColor: notif.read ? "#e2e8f0" : cfg.border,
                  borderLeft: `3px solid ${cfg.dot}`,
                }}
              >
                <div style={s.notifTop}>
                  {/* Severity dot + unread indicator */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                    <div style={{ ...s.severityDot, background: cfg.dot }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={s.notifMeta}>
                        <span style={{ ...s.severityBadge, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                          {notif.severity}
                        </span>
                        <span style={s.donorTag}>{notif.donor}</span>
                        <span style={s.timeAgo}>{timeAgo(notif.createdAt)}</span>
                        {!notif.read && <span style={s.unreadDot} />}
                      </div>
                      <p style={s.notifProject}>{notif.projectName} · {notif.transactionId}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <button
                      style={s.iconBtn}
                      onClick={() => setExpanded(isExpanded ? null : notif.id)}
                      title={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? "▲" : "▼"}
                    </button>
                    <button
                      style={s.iconBtn}
                      onClick={() => onDismiss(notif.id)}
                      title="Dismiss"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>

                {/* Message preview */}
                <p
                  style={{
                    ...s.notifMessage,
                    WebkitLineClamp: isExpanded ? undefined : 2,
                    overflow: isExpanded ? "visible" : "hidden",
                    display: isExpanded ? "block" : "-webkit-box",
                  }}
                >
                  <strong>{String(notif.auditorName).replace(/[<>"'&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" }[c] ?? c))}</strong>{" flagged "}{String(notif.message).replace(/[<>"'&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" }[c] ?? c))}
                </p>

                {/* Expanded actions */}
                {isExpanded && (
                  <div style={s.notifActions}>
                    {!notif.read && (
                      <button style={s.actionBtn} onClick={() => onMarkRead(notif.id)}>
                        <CheckCheck size={13} /> Mark as read
                      </button>
                    )}
                    <button
                      style={{ ...s.actionBtn, ...s.actionBtnPrimary }}
                      onClick={() => window.location.href = `/ngo-dashboard/transactions?id=${notif.transactionId}`}
                    >
                      View Transaction →
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  panel:          { background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" },
  panelHeader:    { padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  bellWrap:       { position: "relative", width: 36, height: 36, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  bellBadge:      { position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "#1e3a8a", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" },
  panelTitle:     { margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" },
  panelSub:       { margin: "2px 0 0", fontSize: 12, color: "#64748b" },
  markAllBtn:     { display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" as const },
  list:           { display: "flex", flexDirection: "column", gap: 0 },
  empty:          { padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  emptyIcon:      { width: 48, height: 48, borderRadius: "50%", background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center" },
  emptyText:      { fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 },
  emptySub:       { fontSize: 12.5, color: "#94a3b8", margin: 0, textAlign: "center" as const },
  notifCard:      { padding: "14px 16px", borderBottom: "1px solid #f1f5f9", transition: "background 0.15s", borderLeft: "3px solid transparent" },
  notifTop:       { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 },
  severityDot:    { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5 },
  notifMeta:      { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" as const, marginBottom: 3 },
  severityBadge:  { padding: "1px 7px", borderRadius: 999, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.04em" },
  donorTag:       { padding: "1px 7px", borderRadius: 999, fontSize: 10.5, fontWeight: 600, background: "#f1f5f9", color: "#475569" },
  timeAgo:        { fontSize: 11, color: "#94a3b8" },
  unreadDot:      { width: 6, height: 6, borderRadius: "50%", background: "#2563eb", flexShrink: 0 },
  notifProject:   { margin: 0, fontSize: 12, fontWeight: 600, color: "#475569" },
  notifMessage:   { margin: "4px 0 0", fontSize: 13, color: "#374151", lineHeight: 1.55, WebkitBoxOrient: "vertical" as const },
  notifActions:   { display: "flex", gap: 8, marginTop: 10 },
  iconBtn:        { width: 26, height: 26, borderRadius: 6, border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#64748b", fontFamily: "inherit" },
  actionBtn:      { display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  actionBtnPrimary: { background: "#0f172a", color: "#fff", border: "1px solid #0f172a" },
};

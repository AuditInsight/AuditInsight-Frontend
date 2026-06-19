"use client";

import { useEffect, useRef } from "react";
import { Bell, X, CheckCheck, Mail, AlertTriangle, CheckCircle, UserPlus } from "lucide-react";
import { MockNotification, NotifType } from "@/mock/notifications.mock";
import { useNotifications } from "@/hooks/useNotifications";

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const ICON_MAP: Record<NotifType, { icon: React.ReactNode; color: string; bg: string }> = {
  INVITE_SENT:             { icon: <UserPlus size={14} />,      color: "#1d4ed8", bg: "#eff6ff" },
  FLAG_CREATED:            { icon: <AlertTriangle size={14} />, color: "#b45309", bg: "#fffbeb" },
  FLAG_RESOLVED:           { icon: <CheckCircle size={14} />,   color: "#15803d", bg: "#f0fdf4" },
  PASSWORD_RESET:          { icon: <Mail size={14} />,          color: "#6b21a8", bg: "#faf5ff" },
  SUBSCRIPTION_SUSPENDED:  { icon: <AlertTriangle size={14} />, color: "#b91c1c", bg: "#fef2f2" },
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ open, onClose }: Props) {
  const { notifications, unreadCount, read, readAll } = useNotifications();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={ref} style={s.panel}>
      {/* Header */}
      <div style={s.head}>
        <div style={s.headLeft}>
          <Bell size={15} style={{ color: "#1e3a8a" }} />
          <span style={s.headTitle}>Notifications</span>
          {unreadCount > 0 && <span style={s.badge}>{unreadCount}</span>}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {unreadCount > 0 && (
            <button onClick={readAll} style={s.markBtn} title="Mark all as read">
              <CheckCheck size={13} /> All read
            </button>
          )}
          <button onClick={onClose} style={s.closeBtn}><X size={14} /></button>
        </div>
      </div>

      {/* List */}
      <div style={s.list}>
        {notifications.length === 0 ? (
          <div style={s.empty}>
            <Mail size={28} style={{ color: "#cbd5e1", marginBottom: 8 }} />
            <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>No notifications yet</p>
          </div>
        ) : (
          [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((n) => {
              const meta = ICON_MAP[n.type] ?? ICON_MAP.FLAG_CREATED;
              return (
                <div
                  key={n.id}
                  style={{ ...s.item, ...(n.read ? {} : s.itemUnread) }}
                  onClick={() => read(n.id)}
                >
                  <div style={{ ...s.iconWrap, background: meta.bg, color: meta.color }}>
                    {meta.icon}
                  </div>
                  <div style={s.itemBody}>
                    <p style={{ ...s.subject, fontWeight: n.read ? 500 : 700 }}>{n.subject}</p>
                    <p style={s.bodyText}>{n.body}</p>
                    <span style={s.time}>{timeAgo(n.createdAt)}</span>
                  </div>
                  {!n.read && <div style={s.dot} />}
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  panel: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    width: 380,
    maxHeight: 520,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    zIndex: 200,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid #f1f5f9",
    background: "#fafafa",
    flexShrink: 0,
  },
  headLeft: { display: "flex", alignItems: "center", gap: 8 },
  headTitle: { fontSize: 14, fontWeight: 700, color: "#0f172a" },
  badge: {
    background: "#dc2626",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 10,
    padding: "2px 6px",
    minWidth: 18,
    textAlign: "center",
  },
  markBtn: {
    display: "flex", alignItems: "center", gap: 4,
    background: "#eff6ff", border: "none", color: "#1d4ed8",
    fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 8,
    cursor: "pointer", fontFamily: "inherit",
  },
  closeBtn: {
    background: "none", border: "none", color: "#94a3b8",
    cursor: "pointer", padding: 4, display: "flex", alignItems: "center",
  },
  list: { overflowY: "auto", flex: 1 },
  empty: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "48px 24px",
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "14px 16px",
    borderBottom: "1px solid #f8fafc",
    cursor: "pointer",
    transition: "background 0.15s",
    position: "relative",
  },
  itemUnread: { background: "#f8faff" },
  iconWrap: {
    width: 32, height: 32, borderRadius: 9,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginTop: 2,
  },
  itemBody: { flex: 1, minWidth: 0 },
  subject: { margin: "0 0 3px", fontSize: 13, color: "#0f172a", lineHeight: 1.4 },
  bodyText: {
    margin: "0 0 4px", fontSize: 12, color: "#64748b",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  } as React.CSSProperties,
  time: { fontSize: 11, color: "#94a3b8", fontWeight: 500 },
  dot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "#3b82f6", flexShrink: 0, marginTop: 6,
  },
};

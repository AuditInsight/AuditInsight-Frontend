"use client";

import { useState, createContext, useContext } from "react";
import { Bell, LogOut, Search, ChevronDown } from "lucide-react";
import NGOSidebar from "./NGOSidebar";
import NGONotificationPanel from "./NGONotificationPanel";
import NGOToast, { useToast } from "./NGOToast";
import NGORoleSwitcher from "./rbac/NGORoleSwitcher";
import AppFooter from "@/components/layout/AppFooter";
import { useAuth } from "@/context/AuthContext.production";
import { RBACProvider, useRoleAccent, useRoleLabel } from "@/context/RBACContext";
import type { NGORole, NGONotification } from "@/types/ngo";
import { NGO_NOTIFICATIONS } from "@/mock/ngo.mock";

const noop = () => {};
const noopToast = { toasts: [], dismiss: noop, success: noop, error: noop, warning: noop };

export const NGOSearchContext = createContext("");
export const NGOToastContext  = createContext<ReturnType<typeof useToast>>(noopToast as ReturnType<typeof useToast>);
export function useNGOToast() { return useContext(NGOToastContext); }

interface Props {
  pageTitle: string;
  pageSub?: string;
  children: React.ReactNode;
}

function NGOPageLayoutInner({ pageTitle, pageSub, children }: Props) {
  const { user: authUser, logout } = useAuth();
  const accent   = useRoleAccent();
  const roleLabel = useRoleLabel();
  const [collapsed, setCollapsed]       = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [notifications, setNotifications] = useState<NGONotification[]>(NGO_NOTIFICATIONS);
  const [search, setSearch]             = useState("");
  const toast                           = useToast();

  const rawRole   = authUser?.role ?? "ORG_ADMIN";
  const role       = (rawRole === "SYSTEM_ADMIN" ? "ORG_ADMIN" : rawRole) as NGORole;
  const fullName = authUser?.fullName ?? "User";
  const email    = authUser?.email ?? "";
  const orgName  = authUser?.organisationName ?? "NGO Portal";
  const donorScope = authUser?.donorScope ?? null;

  const unread   = notifications.filter((n) => !n.read).length;
  const initials = fullName.split(" ").map((n) => n[0] ?? "").join("").toUpperCase().slice(0, 2);

  const markRead = (id: string) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAll  = ()           => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const dismiss  = (id: string) => setNotifications((p) => p.filter((n) => n.id !== id));

  const handleLogout = () => { logout(); window.location.href = "/log-in"; };

  return (
    <NGOToastContext.Provider value={toast}>
    <NGOSearchContext.Provider value={search}>
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <NGOSidebar
        user={{ fullName, email, role, organisationName: orgName, donorScope }}
        onLogout={handleLogout}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={tb.bar}>
          <div>
            <p style={tb.sub}>{orgName} · NGO Portal</p>
            <h1 style={tb.title}>{pageTitle}</h1>
            {pageSub && <p style={tb.pageSub}>{pageSub}</p>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={tb.searchBox}>
              <Search size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
              <input
                placeholder="Search…"
                style={tb.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ position: "relative" }}>
              <button style={tb.iconBtn} onClick={() => setNotifOpen((v) => !v)} title="Notifications">
                <Bell size={15} />
                {unread > 0 && <span style={tb.badge}>{unread > 9 ? "9+" : unread}</span>}
              </button>
              {notifOpen && (
                <div style={tb.notifDropdown}>
                  <NGONotificationPanel
                    notifications={notifications}
                    onMarkRead={markRead}
                    onMarkAllRead={markAll}
                    onDismiss={dismiss}
                  />
                </div>
              )}
            </div>
            <div style={tb.userChip}>
              <div style={{ ...tb.avatar, background: accent.color }}>{initials}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={tb.userName}>{fullName}</span>
                <span style={{ ...tb.userRole, color: accent.color }}>{roleLabel}</span>
              </div>
              <ChevronDown size={13} style={{ color: "#94a3b8" }} />
            </div>
            <button style={tb.iconBtn} onClick={handleLogout} title="Sign out">
              <LogOut size={14} />
            </button>
          </div>
        </div>

        <main style={{ flex: 1, padding: "28px", display: "flex", flexDirection: "column", gap: 24 }}>
          {children}
        </main>

        <AppFooter />
      </div>
      <NGOToast toasts={toast.toasts} onDismiss={toast.dismiss} />
      <NGORoleSwitcher />
    </div>
    </NGOSearchContext.Provider>
    </NGOToastContext.Provider>
  );
}

export default function NGOPageLayout({ pageTitle, pageSub, children }: Props) {
  return (
    <RBACProvider>
      <NGOPageLayoutInner pageTitle={pageTitle} pageSub={pageSub}>
        {children}
      </NGOPageLayoutInner>
    </RBACProvider>
  );
}

const tb: Record<string, React.CSSProperties> = {
  bar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 28px", background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
    position: "sticky", top: 0, zIndex: 50, gap: 16, flexWrap: "wrap" as const,
  },
  sub:     { margin: 0, fontSize: 11.5, color: "#94a3b8", fontWeight: 500 },
  title:   { margin: "2px 0 0", fontSize: 18, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.4px" },
  pageSub: { margin: "2px 0 0", fontSize: 12.5, color: "#64748b" },
  searchBox: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "7px 12px", borderRadius: 9,
    background: "#f8fafc", border: "1px solid #e2e8f0", width: 180,
  },
  searchInput: { border: "none", background: "transparent", outline: "none", fontSize: 12.5, color: "#0f172a", fontFamily: "inherit", width: "100%" },
  iconBtn: {
    width: 36, height: 36, borderRadius: 9,
    border: "1px solid #e2e8f0", background: "#f8fafc",
    color: "#64748b", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative" as const,
  },
  badge: {
    position: "absolute" as const, top: -4, right: -4,
    background: "#dc2626", color: "#fff",
    fontSize: 9, fontWeight: 700, borderRadius: 10,
    padding: "1px 4px", minWidth: 16, textAlign: "center" as const,
    lineHeight: 1.5, border: "1.5px solid #fff",
  },
  userChip: {
    display: "flex", alignItems: "center", gap: 9,
    padding: "6px 12px 6px 6px", borderRadius: 10,
    background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer",
  },
  avatar: {
    width: 30, height: 30, borderRadius: "50%",
    background: "#1e3a8a", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 800, flexShrink: 0,
  },
  userName: { fontSize: 12.5, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 },
  userRole: { fontSize: 10.5, color: "#94a3b8", fontWeight: 500, textTransform: "capitalize" as const },
  notifDropdown: {
    position: "absolute" as const, top: "calc(100% + 10px)", right: 0,
    width: 400, maxHeight: 520, overflowY: "auto" as const,
    borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    border: "1px solid #e2e8f0", zIndex: 200,
  },
};

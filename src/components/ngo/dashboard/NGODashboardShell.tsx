"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, CreditCard, FolderOpen,
  Flag, Settings, Bell, LogOut, Search,
  ChevronDown, Shield,
} from "lucide-react";
import NGONotificationPanel from "@/components/ngo/NGONotificationPanel";
import NGORoleSwitcher from "@/components/ngo/rbac/NGORoleSwitcher";
import NGOToast, { useToast } from "@/components/ngo/NGOToast";
import { useAuth } from "@/context/AuthContext.production";
import { useRBAC } from "@/context/RBACContext";
import type { NGORole, NGONotification } from "@/types/ngo";
import { NGO_NOTIFICATIONS } from "@/mock/ngo.mock";

const TABS = [
  { label: "Dashboard",    path: "/ngo-dashboard",              icon: <LayoutDashboard size={15} /> },
  { label: "Transactions", path: "/ngo-dashboard/transactions", icon: <CreditCard size={15} />      },
  { label: "Evidence",     path: "/ngo-dashboard/evidence",     icon: <FolderOpen size={15} />      },
  { label: "Review Queue", path: "/ngo-dashboard/review",       icon: <Flag size={15} />            },
  { label: "Settings",     path: "/ngo-dashboard/settings",     icon: <Settings size={15} />        },
];

interface Props { children: React.ReactNode }

export default function NGODashboardShell({ children }: Props) {
  const { user: authUser, logout } = useAuth();
  const { user: rbacUser } = useRBAC();
  const router   = useRouter();
  const pathname = usePathname();
  const toast    = useToast();

  const [notifOpen, setNotifOpen]         = useState(false);
  const [search, setSearch]               = useState("");
  const [notifications, setNotifications] = useState<NGONotification[]>(NGO_NOTIFICATIONS);

  const rawRole  = authUser?.role ?? "ORG_ADMIN";
  const role     = (rawRole === "SYSTEM_ADMIN" ? "ORG_ADMIN" : rawRole) as NGORole;
  const fullName = authUser?.fullName ?? rbacUser.fullName ?? "User";
  const orgName  = authUser?.organisationName ?? "NGO Portal";

  const unread   = notifications.filter((n) => !n.read).length;
  const initials = fullName.split(" ").map((n) => n[0] ?? "").join("").toUpperCase().slice(0, 2);

  const markRead = (id: string) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAll  = ()           => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const dismiss  = (id: string) => setNotifications((p) => p.filter((n) => n.id !== id));
  const handleLogout = () => { logout(); window.location.href = "/log-in"; };

  const activeTab = TABS.find((t) => t.path === pathname)
    ?? TABS.slice().reverse().find((t) => pathname.startsWith(t.path));

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.logoArea}>
          <div style={s.logoMark}>
            <Shield size={14} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <span style={s.logoTitle}>AuditInsight</span>
            <span style={s.logoSub}>NGO Portal</span>
          </div>
        </div>

        <nav style={s.tabBar}>
          {TABS.map((tab) => {
            const isActive = activeTab?.path === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                style={{ ...s.tab, ...(isActive ? s.tabActive : {}) }}
              >
                <span style={{ color: isActive ? "#0f172a" : "#94a3b8", display: "flex", alignItems: "center" }}>
                  {tab.icon}
                </span>
                {tab.label}
                {isActive && <span style={s.tabUnderline} />}
              </button>
            );
          })}
        </nav>

        <div style={s.controls}>
          <div style={s.searchBox}>
            <Search size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
            <input
              placeholder="Search…"
              style={s.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ position: "relative" }}>
            <button style={s.iconBtn} onClick={() => setNotifOpen((v) => !v)} title="Notifications">
              <Bell size={15} />
              {unread > 0 && <span style={s.badge}>{unread > 9 ? "9+" : unread}</span>}
            </button>
            {notifOpen && (
              <div style={s.notifDropdown}>
                <NGONotificationPanel
                  notifications={notifications}
                  onMarkRead={markRead}
                  onMarkAllRead={markAll}
                  onDismiss={dismiss}
                />
              </div>
            )}
          </div>

          <div style={s.userChip}>
            <div style={s.avatar}>{initials}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={s.userName}>{fullName.split(" ")[0]}</span>
              <span style={s.userRole}>{role.replace(/_/g, " ")}</span>
            </div>
            <ChevronDown size={12} style={{ color: "#94a3b8" }} />
          </div>

          <button style={s.iconBtn} onClick={handleLogout} title="Sign out">
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <main style={s.main}>{children}</main>

      <footer style={s.footer}>
        <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
          AuditInsight NGO Portal · {orgName} · {new Date().getFullYear()} · <span style={{ color: "#cbd5e1" }}>v2.0</span>
        </p>
      </footer>

      <NGOToast toasts={toast.toasts} onDismiss={toast.dismiss} />
      <NGORoleSwitcher />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f1f5f9", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
  header: { display: "flex", alignItems: "center", gap: 0, background: "#fff", borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", height: 56 },
  logoArea: { display: "flex", alignItems: "center", gap: 10, paddingRight: 24, borderRight: "1px solid #f1f5f9", flexShrink: 0 },
  logoMark: { width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#1e40af,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(59,130,246,0.3)", flexShrink: 0 },
  logoTitle: { fontSize: 13.5, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px", display: "block", lineHeight: 1.2 },
  logoSub:   { fontSize: 9, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block" },
  tabBar: { display: "flex", alignItems: "stretch", flex: 1, height: "100%", paddingLeft: 8, gap: 0, overflowX: "auto" as const },
  tab: { position: "relative" as const, display: "flex", alignItems: "center", gap: 7, padding: "0 16px", height: "100%", border: "none", background: "transparent", color: "#64748b", fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" as const, transition: "color 0.15s" },
  tabActive: { color: "#0f172a", fontWeight: 600 },
  tabUnderline: { position: "absolute" as const, bottom: 0, left: 12, right: 12, height: 2, borderRadius: "2px 2px 0 0", background: "#0f172a" },
  controls: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0, paddingLeft: 16, borderLeft: "1px solid #f1f5f9" },
  searchBox: { display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 9, background: "#f8fafc", border: "1px solid #e2e8f0", width: 170 },
  searchInput: { border: "none", background: "transparent", outline: "none", fontSize: 12.5, color: "#0f172a", fontFamily: "inherit", width: "100%" },
  iconBtn: { position: "relative" as const, width: 34, height: 34, borderRadius: 9, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute" as const, top: -4, right: -4, background: "#dc2626", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 10, padding: "1px 4px", minWidth: 16, textAlign: "center" as const, lineHeight: 1.5, border: "1.5px solid #fff" },
  notifDropdown: { position: "absolute" as const, top: "calc(100% + 10px)", right: 0, width: 400, maxHeight: 520, overflowY: "auto" as const, borderRadius: 14, boxShadow: "0 20px 60px rgba(15,23,42,0.15)", border: "1px solid #e2e8f0", zIndex: 200 },
  userChip: { display: "flex", alignItems: "center", gap: 8, padding: "5px 10px 5px 5px", borderRadius: 9, background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer" },
  avatar: { width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  userName: { fontSize: 12, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 },
  userRole: { fontSize: 10, color: "#94a3b8", fontWeight: 500, textTransform: "capitalize" as const, lineHeight: 1.2 },
  main: { flex: 1, padding: "28px 28px 40px", maxWidth: 1500, width: "100%", margin: "0 auto", boxSizing: "border-box" as const, display: "flex", flexDirection: "column", gap: 24 },
  footer: { padding: "14px 24px", borderTop: "1px solid #e2e8f0", background: "#fff" },
};

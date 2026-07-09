"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, CreditCard, FolderOpen, Flag, Settings,
  Bell, LogOut, Search, ChevronDown, Shield, Menu, X,
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

const ROLE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  ACCOUNTANT:           { label: "Finance Officer",      color: "#1e3a8a", bg: "rgba(30,58,138,0.08)"  },
  AUDITOR:              { label: "Auditor",              color: "#15803d", bg: "rgba(21,128,61,0.08)"  },
  ORG_ADMIN:            { label: "Executive Director",   color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
  DONOR_REPRESENTATIVE: { label: "Donor Representative", color: "#d97706", bg: "rgba(217,119,6,0.08)"  },
  CLIENT:               { label: "Executive Director",   color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
  MEMBER:               { label: "Finance Officer",      color: "#1e3a8a", bg: "rgba(30,58,138,0.08)"  },
};

interface Props { children: React.ReactNode }

export default function NGODashboardShell({ children }: Props) {
  const { user: authUser, logout } = useAuth();
  const { user: rbacUser } = useRBAC();
  const router   = useRouter();
  const pathname = usePathname();
  const toast    = useToast();

  const [notifOpen,  setNotifOpen]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search,     setSearch]     = useState("");
  const [notifications, setNotifications] = useState<NGONotification[]>(NGO_NOTIFICATIONS);

  const rawRole  = authUser?.role ?? "ORG_ADMIN";
  const role     = (rawRole === "SYSTEM_ADMIN" ? "ORG_ADMIN" : rawRole) as NGORole;
  const fullName = authUser?.fullName ?? rbacUser.fullName ?? "User";
  const orgName  = authUser?.organisationName ?? "NGO Portal";
  const roleBadge = ROLE_BADGE[rawRole] ?? ROLE_BADGE.ORG_ADMIN;

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
      <style>{CSS}</style>

      {/* ── Top header ── */}
      <header style={s.header}>
        {/* Logo */}
        <div style={s.logoArea}>
          <div style={s.logoMark}>
            <Shield size={14} color="#fff" strokeWidth={2.5} />
          </div>
          <div className="ngo-logo-text">
            <span style={s.logoTitle}>AuditInsight</span>
            <span style={s.logoSub}>NGO Portal</span>
          </div>
        </div>

        {/* Desktop nav */}
        <nav style={s.tabBar} className="ngo-desktop-nav">
          {TABS.map((tab) => {
            const isActive = activeTab?.path === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                style={{ ...s.tab, ...(isActive ? s.tabActive : {}) }}
              >
                <span style={{ color: isActive ? "#1e3a8a" : "#94a3b8", display: "flex", alignItems: "center" }}>
                  {tab.icon}
                </span>
                {tab.label}
                {isActive && <span style={s.tabUnderline} />}
              </button>
            );
          })}
        </nav>

        {/* Right controls */}
        <div style={s.controls}>
          {/* Search — hidden on mobile */}
          <div style={s.searchBox} className="ngo-search">
            <Search size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
            <input
              placeholder="Search…"
              style={s.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <button style={s.iconBtn} onClick={() => { setNotifOpen((v) => !v); setMobileOpen(false); }} title="Notifications">
              <Bell size={15} />
              {unread > 0 && <span style={s.badge}>{unread > 9 ? "9+" : unread}</span>}
            </button>
            {notifOpen && (
              <>
                <div style={s.notifDropdown}>
                  <NGONotificationPanel
                    notifications={notifications}
                    onMarkRead={markRead}
                    onMarkAllRead={markAll}
                    onDismiss={dismiss}
                  />
                </div>
                <div style={s.backdrop} onClick={() => setNotifOpen(false)} />
              </>
            )}
          </div>

          {/* User chip — hidden on small mobile */}
          <div style={s.userChip} className="ngo-user-chip">
            <div style={{ ...s.avatar, background: roleBadge.bg, color: roleBadge.color }}>{initials}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={s.userName}>{fullName.split(" ")[0]}</span>
              <span style={{ ...s.userRole, color: roleBadge.color }}>{roleBadge.label}</span>
            </div>
            <ChevronDown size={12} style={{ color: "#94a3b8" }} />
          </div>

          <button style={s.iconBtn} onClick={handleLogout} title="Sign out" className="ngo-logout">
            <LogOut size={14} />
          </button>

          {/* Mobile hamburger */}
          <button style={s.iconBtn} className="ngo-hamburger" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* ── Mobile nav drawer ── */}
      {mobileOpen && (
        <>
          <div style={s.mobileDrawer}>
            {/* User info */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ ...s.avatar, width: 40, height: 40, fontSize: 14, background: roleBadge.bg, color: roleBadge.color }}>{initials}</div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{fullName}</p>
                <span style={{ fontSize: 12, fontWeight: 600, color: roleBadge.color, background: roleBadge.bg, padding: "2px 8px", borderRadius: 6 }}>{roleBadge.label}</span>
              </div>
            </div>
            {/* Search */}
            <div style={{ padding: "12px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 9, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <Search size={13} style={{ color: "#94a3b8" }} />
                <input placeholder="Search…" style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#0f172a", fontFamily: "inherit", width: "100%" }} value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            {/* Nav links */}
            {TABS.map((tab) => {
              const isActive = activeTab?.path === tab.path;
              return (
                <button
                  key={tab.path}
                  onClick={() => { router.push(tab.path); setMobileOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 20px", border: "none", background: isActive ? "rgba(30,58,138,0.06)" : "transparent", color: isActive ? "#1e3a8a" : "#475569", fontSize: 14, fontWeight: isActive ? 700 : 500, cursor: "pointer", fontFamily: "inherit", borderLeft: isActive ? "3px solid #1e3a8a" : "3px solid transparent", textAlign: "left" }}
                >
                  {tab.icon} {tab.label}
                </button>
              );
            })}
            <div style={{ padding: "12px 20px", borderTop: "1px solid #f1f5f9", marginTop: "auto" }}>
              <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #fee2e2", background: "#fef2f2", color: "#dc2626", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
          <div style={s.backdrop} onClick={() => setMobileOpen(false)} />
        </>
      )}

      <main style={s.main}>{children}</main>

      <footer style={s.footer}>
        <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
          AuditInsight NGO Portal · {orgName} · {new Date().getFullYear()}
        </p>
      </footer>

      <NGOToast toasts={toast.toasts} onDismiss={toast.dismiss} />
      <NGORoleSwitcher />
    </div>
  );
}

const CSS = `
  @keyframes ngo-slide-down { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  .ngo-desktop-nav { display: flex !important; }
  .ngo-hamburger   { display: none !important; }
  .ngo-search      { display: flex !important; }
  .ngo-user-chip   { display: flex !important; }
  .ngo-logout      { display: flex !important; }
  @media (max-width: 768px) {
    .ngo-desktop-nav { display: none !important; }
    .ngo-hamburger   { display: flex !important; }
    .ngo-search      { display: none !important; }
    .ngo-logo-text   { display: none !important; }
  }
  @media (max-width: 480px) {
    .ngo-user-chip { display: none !important; }
    .ngo-logout    { display: none !important; }
  }
`;

const s: Record<string, React.CSSProperties> = {
  root:    { minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f1f5f9", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
  header:  { display: "flex", alignItems: "center", gap: 0, background: "#fff", borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(15,23,42,0.06)", position: "sticky", top: 0, zIndex: 100, padding: "0 20px", height: 58 },
  logoArea:  { display: "flex", alignItems: "center", gap: 10, paddingRight: 20, borderRight: "1px solid #f1f5f9", flexShrink: 0 },
  logoMark:  { width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#1e40af,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(59,130,246,0.35)", flexShrink: 0 },
  logoTitle: { fontSize: 14, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px", display: "block", lineHeight: 1.2 },
  logoSub:   { fontSize: 9, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block" },
  tabBar:    { display: "flex", alignItems: "stretch", flex: 1, height: "100%", paddingLeft: 8, gap: 0, overflowX: "auto" as const },
  tab:       { position: "relative" as const, display: "flex", alignItems: "center", gap: 7, padding: "0 16px", height: "100%", border: "none", background: "transparent", color: "#64748b", fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" as const, transition: "color 0.15s" },
  tabActive: { color: "#1e3a8a", fontWeight: 700 },
  tabUnderline: { position: "absolute" as const, bottom: 0, left: 12, right: 12, height: 2, borderRadius: "2px 2px 0 0", background: "#1e3a8a" },
  controls:  { display: "flex", alignItems: "center", gap: 8, flexShrink: 0, paddingLeft: 16, borderLeft: "1px solid #f1f5f9" },
  searchBox: { display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 9, background: "#f8fafc", border: "1px solid #e2e8f0", width: 180 },
  searchInput: { border: "none", background: "transparent", outline: "none", fontSize: 12.5, color: "#0f172a", fontFamily: "inherit", width: "100%" },
  iconBtn:   { position: "relative" as const, width: 36, height: 36, borderRadius: 9, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  badge:     { position: "absolute" as const, top: -4, right: -4, background: "#dc2626", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 10, padding: "1px 4px", minWidth: 16, textAlign: "center" as const, lineHeight: 1.5, border: "1.5px solid #fff" },
  notifDropdown: { position: "absolute" as const, top: "calc(100% + 10px)", right: 0, width: 400, maxWidth: "calc(100vw - 32px)", maxHeight: 520, overflowY: "auto" as const, borderRadius: 14, boxShadow: "0 20px 60px rgba(15,23,42,0.15)", border: "1px solid #e2e8f0", zIndex: 200, background: "#fff", animation: "ngo-slide-down 0.15s ease" },
  userChip:  { display: "flex", alignItems: "center", gap: 8, padding: "5px 10px 5px 5px", borderRadius: 9, background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer" },
  avatar:    { width: 30, height: 30, borderRadius: "50%", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  userName:  { fontSize: 12, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 },
  userRole:  { fontSize: 10, fontWeight: 600, lineHeight: 1.2 },
  mobileDrawer: { position: "fixed" as const, top: 58, left: 0, bottom: 0, width: 280, background: "#fff", zIndex: 99, boxShadow: "4px 0 24px rgba(15,23,42,0.12)", display: "flex", flexDirection: "column", overflowY: "auto" as const, animation: "ngo-slide-down 0.2s ease" },
  backdrop:  { position: "fixed" as const, inset: 0, background: "rgba(15,23,42,0.3)", zIndex: 98 },
  main:      { flex: 1, padding: "24px 24px 48px", maxWidth: 1500, width: "100%", margin: "0 auto", boxSizing: "border-box" as const },
  footer:    { padding: "14px 24px", borderTop: "1px solid #e2e8f0", background: "#fff" },
};

"use client";

import { useState } from "react";
import {
  LayoutDashboard, ArrowLeftRight, FileCheck, ClipboardList,
  BarChart3, Settings, LogOut, Building2, UserCheck, Bell, Shield,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { usePermissions } from "@/security/access-control";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";
import NotificationsPanel from "./NotificationsPanel";
import { useNotifications } from "@/hooks/useNotifications";
import CompanySwitcher from "./CompanySwitcher";

export interface HeaderProps { title: string; }

const ROLE_LABEL: Record<UserRole, string> = {
  CLIENT:  "Org Admin",
  MEMBER:  "Accountant",
  AUDITOR: "Auditor",
  ADMIN:   "Super Admin",
};

const STANDARD_NAV = [
  { label: "Dashboard",    icon: LayoutDashboard, path: "/dashboard"    },
  { label: "Transactions", icon: ArrowLeftRight,  path: "/transactions" },
  { label: "Evidence",     icon: FileCheck,       path: "/evidence"     },
  { label: "Review Queue", icon: ClipboardList,   path: "/review-queue" },
  { label: "Reports",      icon: BarChart3,       path: "/reports"      },
  { label: "Settings",     icon: Settings,        path: "/settings"     },
];

const ADMIN_NAV = [
  { label: "Organizations",     icon: Building2, path: "/admin/organizations" },
  { label: "Auditor Approvals", icon: UserCheck, path: "/admin/approvals"     },
  { label: "Settings",          icon: Settings,  path: "/admin/settings"      },
];

export default function Header({ title }: HeaderProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const { canManageOrganisation, canViewAdminPanel } = usePermissions();
  const { logout, user, role, loading } = useAuth();
  const { unreadCount } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => { logout(); router.replace("/log-in"); };

  const navItems = canViewAdminPanel
    ? ADMIN_NAV
    : STANDARD_NAV.filter((item) => !(item.path === "/settings" && !canManageOrganisation));

  const currentRole = (role ?? "CLIENT") as UserRole;

  // Always derive from the live auth user — never from mock defaults
  const displayName     = loading ? "" : (user?.fullName ?? "");
  const displayOrg      = loading ? "" : (user?.organisationName ?? "");
  const displayRole     = ROLE_LABEL[currentRole];
  const displayInitials = displayName
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <header style={s.bar}>
      {/* LEFT — logo */}
      <div style={s.left} onClick={() => router.push(canViewAdminPanel ? "/admin/organizations" : "/dashboard")}>
        <div style={s.logoMark}>
          <Shield size={16} color="#1e3a8a" strokeWidth={2.5} />
        </div>
        <div style={s.logoText}>
          <span style={s.logoTitle}>{title}</span>
          <span style={s.logoSub}>Audit Intelligence</span>
        </div>
      </div>

      {/* CENTER — nav + company switcher for auditors */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <nav style={s.pillGroup}>
          {navItems.map((item) => {
            const Icon     = item.icon;
            const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.path)}
                style={{ ...s.navBtn, ...(isActive ? s.navBtnActive : {}) }}
                onMouseEnter={(e) => { if (!isActive) Object.assign(e.currentTarget.style, s.navBtnHover); }}
                onMouseLeave={(e) => { if (!isActive) Object.assign(e.currentTarget.style, s.navBtn); }}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <CompanySwitcher />
      </div>

      {/* RIGHT — bell · user info · avatar · logout */}
      <div style={s.right}>
        <div style={{ position: "relative" }}>
          <button
            style={s.iconBtn}
            title="Notifications"
            aria-label="Notifications"
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={s.bellBadge}>{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>
          <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* User block — role / name / org */}
        <div style={s.userBlock}>
          <span style={s.userRole}>{displayRole}</span>
          <span style={s.userName}>{displayName}</span>
          {displayOrg && <span style={s.userOrg}>{displayOrg}</span>}
        </div>

        {/* Avatar circle — real initials */}
        <div style={s.avatar} title={displayName}>
          {displayInitials}
        </div>

        <button onClick={handleLogout} title="Sign out" style={s.iconBtn} aria-label="Sign out">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

const s: Record<string, React.CSSProperties> = {
  bar: {
    height: 62,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    background: "#0d2158",
    boxShadow: "0 4px 24px rgba(0,0,0,0.22)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    gap: 16,
  },

  left: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 },
  logoMark: {
    width: 34, height: 34, borderRadius: 10,
    background: "linear-gradient(135deg,#fff,rgba(255,255,255,0.85))",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 12px rgba(255,255,255,0.15)",
  },
  logoText: { display: "flex", flexDirection: "column", lineHeight: 1.15 },
  logoTitle: { fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" },
  logoSub:   { fontSize: 10, color: "rgba(255,255,255,0.50)", letterSpacing: "0.07em", textTransform: "uppercase" },

  pillGroup: {
    display: "flex", alignItems: "center", gap: 2,
    background: "rgba(255,255,255,0.07)",
    borderRadius: 12, padding: "4px 5px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  navBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "8px 13px", borderRadius: 9, border: "none",
    background: "transparent", color: "rgba(255,255,255,0.62)",
    fontSize: 13, fontWeight: 500, cursor: "pointer",
    fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap",
  } as React.CSSProperties,
  navBtnActive: {
    background: "rgba(255,255,255,0.14)", color: "#fff", fontWeight: 600,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 8px rgba(0,0,0,0.12)",
  },
  navBtnHover: { background: "rgba(255,255,255,0.09)", color: "#fff" },

  right:     { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 9,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.75)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  bellBadge: {
    position: "absolute",
    top: -4, right: -4,
    background: "#dc2626",
    color: "#fff",
    fontSize: 9,
    fontWeight: 700,
    borderRadius: 10,
    padding: "1px 4px",
    minWidth: 16,
    textAlign: "center",
    lineHeight: 1.5,
    border: "1.5px solid #0d2158",
  },
  userBlock: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 },
  userRole:  { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(148,198,255,0.90)" },
  userName:  { fontSize: 13, color: "#fff", fontWeight: 600 },
  userOrg:   { fontSize: 10, color: "rgba(255,255,255,0.45)", fontWeight: 500 },
  avatar: {
    width: 36, height: 36, borderRadius: "50%",
    background: "#1e3a8a",
    border: "2px solid rgba(255,255,255,0.20)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0,
    cursor: "default",
  },
};

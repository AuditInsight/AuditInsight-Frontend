"use client";

import { LayoutDashboard, ArrowLeftRight, FileCheck, ClipboardList, BarChart3, Settings, LogOut, Building2, UserCheck, Bell, Shield } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { usePermissions } from "@/security/access-control";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";

export interface HeaderProps { title: string; }

const ROLE_COLOR: Record<UserRole, string> = {
  CLIENT:  "#60a5fa",
  MEMBER:  "#4ade80",
  AUDITOR: "#fbbf24",
  ADMIN:   "#c084fc",
};

const ROLE_LABEL: Record<UserRole, string> = {
  CLIENT:  "Org Admin",
  MEMBER:  "Accountant",
  AUDITOR: "Auditor",
  ADMIN:   "Super Admin",
};

const STANDARD_NAV = [
  { label: "Dashboard",    icon: LayoutDashboard, path: "/dashboard" },
  { label: "Transactions", icon: ArrowLeftRight,  path: "/transactions" },
  { label: "Evidence",     icon: FileCheck,       path: "/evidence" },
  { label: "Review Queue", icon: ClipboardList,   path: "/review-queue" },
  { label: "Reports",      icon: BarChart3,        path: "/reports" },
  { label: "Settings",     icon: Settings,         path: "/settings" },
];

const ADMIN_NAV = [
  { label: "Organizations",     icon: Building2,  path: "/admin/organizations" },
  { label: "Auditor Approvals", icon: UserCheck,  path: "/admin/approvals" },
];

export default function Header({ title }: HeaderProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const { fullName, initials, role, loading } = useProfile();
  const { canManageOrganisation, canViewAdminPanel } = usePermissions();
  const { logout } = useAuth();

  const handleLogout = () => { logout(); router.replace("/log-in"); };

  const navItems = canViewAdminPanel
    ? ADMIN_NAV
    : STANDARD_NAV.filter(item => !(item.path === "/settings" && !canManageOrganisation));

  const currentRole     = (role || "CLIENT") as UserRole;
  const ringColor       = ROLE_COLOR[currentRole];
  const displayName     = loading ? "…" : fullName || "User";
  const displayInitials = loading ? "…" : initials || "?";
  const displayRole     = ROLE_LABEL[currentRole];

  return (
    <header style={s.bar}>
      {/* ── LEFT: logo ── */}
      <div style={s.left} onClick={() => router.push(canViewAdminPanel ? "/admin/organizations" : "/dashboard")}>
        <div style={s.logoMark}>
          <Shield size={16} color="#1e3a8a" strokeWidth={2.5} />
        </div>
        <div style={s.logoText}>
          <span style={s.logoTitle}>{title}</span>
          <span style={s.logoSub}>Audit Intelligence</span>
        </div>
      </div>

      {/* ── CENTER: pill nav group ── */}
      <nav style={s.pillGroup}>
        {navItems.map(item => {
          const Icon     = item.icon;
          const isActive = pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              style={{ ...s.navBtn, ...(isActive ? s.navBtnActive : {}) }}
              onMouseEnter={e => { if (!isActive) Object.assign(e.currentTarget.style, s.navBtnHover); }}
              onMouseLeave={e => { if (!isActive) Object.assign(e.currentTarget.style, s.navBtn); }}
            >
              <Icon size={14} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── RIGHT: bell + user block + avatar + logout ── */}
      <div style={s.right}>
        {/* notification bell */}
        <button style={s.iconBtn} title="Notifications">
          <Bell size={16} />
        </button>

        {/* role + name */}
        <div style={s.userBlock}>
          <span style={{ ...s.userRole, color: ringColor }}>{displayRole}</span>
          <span style={s.userName}>{displayName}</span>
        </div>

        {/* avatar with role ring */}
        <div style={{ ...s.avatar, boxShadow: `0 0 0 2.5px ${ringColor}, 0 4px 14px rgba(0,0,0,0.20)` }}>
          {displayInitials}
        </div>

        {/* logout */}
        <button onClick={handleLogout} title="Sign out" style={s.iconBtn}>
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

  // logo
  left: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 },
  logoMark: {
    width: 34, height: 34, borderRadius: 10,
    background: "linear-gradient(135deg,#fff,rgba(255,255,255,0.85))",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 12px rgba(255,255,255,0.15)",
  },
  logoText: { display: "flex", flexDirection: "column", lineHeight: 1.15 },
  logoTitle: { fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" },
  logoSub: { fontSize: 10, color: "rgba(255,255,255,0.50)", letterSpacing: "0.07em", textTransform: "uppercase" },

  // nav pill group — matches dashboard TopNav style exactly
  pillGroup: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    background: "rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding: "4px 5px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  navBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "8px 14px", borderRadius: 9, border: "none",
    background: "transparent", color: "rgba(255,255,255,0.65)",
    fontSize: 13, fontWeight: 500, cursor: "pointer",
    fontFamily: "inherit", transition: "all 0.15s",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
  navBtnActive: {
    background: "rgba(255,255,255,0.14)",
    color: "#fff", fontWeight: 600,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 8px rgba(0,0,0,0.12)",
  },
  navBtnHover: {
    background: "rgba(255,255,255,0.09)",
    color: "#fff",
  },

  // right side
  right: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 9,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.75)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  userBlock: {
    display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1,
  },
  userRole: {
    fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em",
  },
  userName: { fontSize: 13, color: "#fff", fontWeight: 600 },
  avatar: {
    width: 38, height: 38, borderRadius: "50%",
    background: "linear-gradient(180deg,rgba(255,255,255,0.20),rgba(255,255,255,0.08))",
    border: "1px solid rgba(255,255,255,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0,
  },
};

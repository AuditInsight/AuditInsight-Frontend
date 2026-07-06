"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext.production";
import { NAV_BY_ROLE } from "./sidebar.menu";
import { FrontendRole } from "@/types/auth";
import { LogOut, Shield } from "lucide-react";

const ROLE_CONFIG: Record<FrontendRole, { label: string; color: string; bg: string }> = {
  ORG_ADMIN:            { label: "Org Admin",            color: "#1e3a8a", bg: "#eff6ff" },
  ACCOUNTANT:           { label: "Accountant",           color: "#15803d", bg: "#f0fdf4" },
  AUDITOR:              { label: "Auditor",              color: "#b45309", bg: "#fffbeb" },
  SYSTEM_ADMIN:         { label: "Super Admin",          color: "#7c3aed", bg: "#faf5ff" },
  DONOR_REPRESENTATIVE: { label: "Donor Representative", color: "#7c3aed", bg: "#faf5ff" },
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const currentRole = (user?.role ?? "ORG_ADMIN") as FrontendRole;
  const navItems = NAV_BY_ROLE[currentRole] ?? [];
  const cfg = ROLE_CONFIG[currentRole];

  const initials = (user?.fullName ?? "?")
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    logout();
    router.replace("/log-in");
  };

  return (
    <aside style={s.sidebar}>
      {/* Logo */}
      <div style={s.logoRow}>
        <div style={s.logoMark}><Shield size={16} color="#fff" /></div>
        <span style={s.logoText}>AuditInsight</span>
      </div>

      <div style={s.divider} />

      {/* Profile card */}
      <div style={{ ...s.profileCard, borderColor: cfg.color + "33" }}>
        <div style={{ ...s.avatar, background: cfg.color }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={s.profileName}>{user?.fullName ?? "User"}</p>
          <p style={s.profileEmail}>{user?.email ?? ""}</p>
        </div>
        <span style={{ ...s.rolePill, background: cfg.bg, color: cfg.color, borderColor: cfg.color + "44" }}>
          {cfg.label}
        </span>
      </div>

      <div style={s.divider} />

      {/* Navigation */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                ...s.navItem,
                ...(isActive ? { ...s.navItemActive, background: cfg.color } : {}),
              }}
              onMouseEnter={(e) => { if (!isActive) Object.assign(e.currentTarget.style, s.navItemHover); }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; } }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 13.5, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              {isActive && <span style={{ ...s.activeDot, background: "rgba(255,255,255,0.6)" }} />}
            </button>
          );
        })}
      </nav>

      <div style={s.divider} />

      {/* Logout */}
      <button onClick={handleLogout} style={s.logoutBtn}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, { background: "#fef2f2", color: "#dc2626" })}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: "transparent", color: "#64748b" })}>
        <LogOut size={16} />
        <span style={{ fontSize: 13.5 }}>Sign out</span>
      </button>
    </aside>
  );
}

const s: Record<string, React.CSSProperties> = {
  sidebar: { width: 240, minHeight: "100vh", background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", padding: "20px 14px", position: "sticky", top: 0, height: "100vh", overflowY: "auto", flexShrink: 0 },
  logoRow: { display: "flex", alignItems: "center", gap: 10, padding: "0 6px", marginBottom: 4 },
  logoMark: { width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 16, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" },
  divider: { height: 1, background: "#f1f5f9", margin: "12px 0" },
  profileCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 10px", borderRadius: 12, border: "1.5px solid", background: "#fafafa", textAlign: "center" },
  avatar: { width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 17, fontWeight: 800, flexShrink: 0 },
  profileName: { margin: 0, fontSize: 13.5, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 },
  profileEmail: { margin: "1px 0 0", fontSize: 11, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 },
  rolePill: { display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 999, border: "1px solid", fontSize: 11, fontWeight: 700, letterSpacing: "0.03em", marginTop: 2 },
  navItem: { display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: "#475569", fontFamily: "inherit", width: "100%", textAlign: "left", transition: "background 0.15s, color 0.15s" },
  navItemActive: { color: "#fff", fontWeight: 600 },
  navItemHover: { background: "#f1f5f9", color: "#0f172a" },
  activeDot: { width: 6, height: 6, borderRadius: "50%", marginLeft: "auto", opacity: 0.7 },
  logoutBtn: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: "#64748b", fontFamily: "inherit", width: "100%", textAlign: "left", transition: "background 0.15s, color 0.15s" },
};

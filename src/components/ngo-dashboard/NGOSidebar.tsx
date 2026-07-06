"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield, LayoutDashboard, CreditCard, FolderOpen,
  Handshake, ClipboardList, Users, ShieldCheck,
  Flag, Settings, LogOut, FileText, ChevronLeft,
  ChevronRight, Lock,
} from "lucide-react";
import type { NGORole } from "@/types/ngo";

interface NGOUser {
  fullName: string;
  email: string;
  role: NGORole;
  organisationName: string;
  donorScope?: string | null;
}

interface Props {
  user: NGOUser;
  onLogout: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

type NavItem = { label: string; path: string; icon: React.ReactNode };
type NavGroup = { section: string; items: NavItem[] };

const NAV: Record<NGORole, NavGroup[]> = {
  ACCOUNTANT: [
    {
      section: "Workspace",
      items: [
        { label: "Dashboard",             path: "/ngo-dashboard",               icon: <LayoutDashboard size={16} /> },
        { label: "Transactions",          path: "/ngo-dashboard/transactions",  icon: <CreditCard size={16} /> },
        { label: "Evidence Vault",        path: "/ngo-dashboard/evidence",      icon: <FolderOpen size={16} /> },
      ],
    },
    {
      section: "Compliance",
      items: [
        { label: "Donor Compliance",      path: "/ngo-dashboard/compliance",    icon: <Handshake size={16} /> },
        { label: "Project Activities",    path: "/ngo-dashboard/projects",      icon: <ClipboardList size={16} /> },
        { label: "Beneficiary Registers", path: "/ngo-dashboard/beneficiaries", icon: <Users size={16} /> },
      ],
    },
    {
      section: "Account",
      items: [
        { label: "Settings",              path: "/ngo-dashboard/settings",      icon: <Settings size={16} /> },
      ],
    },
  ],
  AUDITOR: [
    {
      section: "Workspace",
      items: [
        { label: "Dashboard",             path: "/ngo-dashboard",               icon: <LayoutDashboard size={16} /> },
        { label: "Transactions",          path: "/ngo-dashboard/transactions",  icon: <CreditCard size={16} /> },
        { label: "Evidence Vault",        path: "/ngo-dashboard/evidence",      icon: <FolderOpen size={16} /> },
      ],
    },
    {
      section: "Audit",
      items: [
        { label: "Audit Readiness",       path: "/ngo-dashboard/audit",         icon: <ShieldCheck size={16} /> },
        { label: "Donor Compliance",      path: "/ngo-dashboard/compliance",    icon: <Handshake size={16} /> },
        { label: "Beneficiary Registers", path: "/ngo-dashboard/beneficiaries", icon: <Users size={16} /> },
        { label: "Review Queue",          path: "/ngo-dashboard/review",        icon: <Flag size={16} /> },
      ],
    },
  ],
  ORG_ADMIN: [
    {
      section: "Overview",
      items: [
        { label: "Dashboard",             path: "/ngo-dashboard",               icon: <LayoutDashboard size={16} /> },
        { label: "Transactions",          path: "/ngo-dashboard/transactions",  icon: <CreditCard size={16} /> },
        { label: "Document Vault",        path: "/ngo-dashboard/evidence",      icon: <FileText size={16} /> },
      ],
    },
    {
      section: "Governance",
      items: [
        { label: "Donor Compliance",      path: "/ngo-dashboard/compliance",    icon: <Handshake size={16} /> },
        { label: "Project Activities",    path: "/ngo-dashboard/projects",      icon: <ClipboardList size={16} /> },
        { label: "Audit Readiness",       path: "/ngo-dashboard/audit",         icon: <ShieldCheck size={16} /> },
      ],
    },
    {
      section: "Account",
      items: [
        { label: "Settings",              path: "/ngo-dashboard/settings",      icon: <Settings size={16} /> },
      ],
    },
  ],
  DONOR_REPRESENTATIVE: [
    {
      section: "Portfolio",
      items: [
        { label: "My Projects",           path: "/ngo-dashboard",               icon: <ClipboardList size={16} /> },
        { label: "Transactions",          path: "/ngo-dashboard/transactions",  icon: <CreditCard size={16} /> },
        { label: "Evidence",              path: "/ngo-dashboard/evidence",      icon: <FolderOpen size={16} /> },
        { label: "Compliance Reports",    path: "/ngo-dashboard/compliance",    icon: <Handshake size={16} /> },
      ],
    },
  ],
};

const ROLE_CONFIG: Record<NGORole, { label: string; accent: string; avatarBg: string }> = {
  ACCOUNTANT:           { label: "Finance Officer",      accent: "#2563eb", avatarBg: "#1e3a8a" },
  AUDITOR:              { label: "Auditor",              accent: "#475569", avatarBg: "#334155" },
  ORG_ADMIN:            { label: "Executive Director",   accent: "#1e3a8a", avatarBg: "#0f172a" },
  DONOR_REPRESENTATIVE: { label: "Donor Representative", accent: "#3b82f6", avatarBg: "#1d4ed8" },
};

export default function NGOSidebar({ user, onLogout, collapsed = false, onToggleCollapse }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const cfg      = ROLE_CONFIG[user.role];
  const groups   = NAV[user.role];

  const initials = user.fullName.split(" ").map((n) => n[0] ?? "").join("").toUpperCase().slice(0, 2);
  const W = collapsed ? 68 : 256;

  return (
    <aside style={{ ...s.sidebar, width: W, minWidth: W }}>

      {/* ── Logo + collapse toggle ── */}
      <div style={s.logoRow}>
        <div style={s.logoMark}>
          <Shield size={15} color="#fff" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={s.logoTitle}>AuditInsight</span>
            <span style={s.logoSub}>NGO Portal</span>
          </div>
        )}
        <button
          style={s.collapseBtn}
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* ── Org pill ── */}
      {!collapsed && (
        <div style={s.orgPill}>
          <div style={{ ...s.orgDot, background: cfg.accent }} />
          <span style={s.orgName}>{user.organisationName}</span>
          {user.donorScope && (
            <span style={s.scopeBadge}>
              <Lock size={9} style={{ marginRight: 3 }} />
              {user.donorScope}
            </span>
          )}
        </div>
      )}

      <div style={s.divider} />

      {/* ── Navigation groups ── */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0, overflowY: "auto", overflowX: "hidden" }}>
        {groups.map((group) => (
          <div key={group.section} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <p style={s.sectionLabel}>{group.section}</p>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    ...s.navItem,
                    ...(collapsed ? s.navItemCollapsed : {}),
                    ...(isActive ? { ...s.navItemActive, background: cfg.accent + "22", color: cfg.accent } : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) Object.assign(e.currentTarget.style, s.navItemHover);
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(148,163,184,0.9)";
                    }
                  }}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span style={{ ...s.activeBar, background: cfg.accent }} />
                  )}
                  <span style={{
                    color: isActive ? cfg.accent : "#94a3b8",
                    display: "flex", alignItems: "center", flexShrink: 0,
                    transition: "color 0.15s",
                  }}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span style={{ fontSize: 13.5, fontWeight: isActive ? 600 : 400, letterSpacing: "-0.01em" }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={s.divider} />

      {/* ── User profile card ── */}
      {collapsed ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
          <div style={{ ...s.avatarSmall, background: cfg.avatarBg }} title={user.fullName}>
            {initials}
          </div>
        </div>
      ) : (
        <div style={s.profileCard}>
          <div style={{ ...s.avatarSmall, background: cfg.avatarBg, width: 38, height: 38, fontSize: 13 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={s.profileName}>{user.fullName}</p>
            <p style={s.profileEmail}>{user.email}</p>
          </div>
          <span style={{ ...s.rolePill, color: cfg.accent, borderColor: cfg.accent + "44", background: cfg.accent + "15" }}>
            {cfg.label}
          </span>
        </div>
      )}

      {/* ── Sign out ── */}
      <button
        onClick={onLogout}
        style={{ ...s.logoutBtn, justifyContent: collapsed ? "center" : "flex-start" }}
        title="Sign out"
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, { background: "#f1f5f9", color: "#0f172a" })}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: "transparent", color: "#94a3b8" })}
      >
        <LogOut size={15} />
        {!collapsed && <span style={{ fontSize: 13.5 }}>Sign out</span>}
      </button>
    </aside>
  );
}

const s: Record<string, React.CSSProperties> = {
  sidebar: {
    background: "#fff",
    borderRight: "1px solid #e2e8f0",
    display: "flex", flexDirection: "column",
    padding: "16px 10px 12px",
    position: "sticky", top: 0, height: "100vh",
    overflowY: "auto", overflowX: "hidden",
    flexShrink: 0,
    transition: "width 0.22s cubic-bezier(0.4,0,0.2,1), min-width 0.22s cubic-bezier(0.4,0,0.2,1)",
    boxShadow: "1px 0 0 #f1f5f9",
  },
  logoRow: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "0 4px", marginBottom: 14,
  },
  logoMark: {
    width: 32, height: 32, borderRadius: 9, flexShrink: 0,
    background: "linear-gradient(135deg,#1e40af,#3b82f6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
  },
  logoTitle: { fontSize: 14.5, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px", display: "block", lineHeight: 1.2 },
  logoSub:   { fontSize: 9.5, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block" },
  collapseBtn: {
    width: 24, height: 24, borderRadius: 6, border: "1px solid #e2e8f0",
    background: "#f8fafc", color: "#94a3b8",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0, transition: "all 0.15s",
  },
  orgPill: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "8px 10px", borderRadius: 9,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    marginBottom: 4, flexWrap: "wrap" as const,
  },
  orgDot:  { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  orgName: { fontSize: 12.5, fontWeight: 600, color: "#0f172a", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const },
  scopeBadge: {
    display: "inline-flex", alignItems: "center",
    fontSize: 10, fontWeight: 700, color: "#64748b",
    background: "#f1f5f9", borderRadius: 999,
    padding: "2px 7px", border: "1px solid #e2e8f0",
    whiteSpace: "nowrap" as const,
  },
  divider: { height: 1, background: "#f1f5f9", margin: "10px 0" },
  sectionLabel: {
    fontSize: 10, fontWeight: 700, color: "#94a3b8",
    letterSpacing: "0.09em", textTransform: "uppercase" as const,
    padding: "0 10px", margin: "8px 0 3px",
  },
  navItem: {
    position: "relative" as const,
    display: "flex", alignItems: "center", gap: 10,
    padding: "9px 10px", borderRadius: 9,
    border: "none", background: "transparent",
    cursor: "pointer", color: "#64748b",
    fontFamily: "inherit", width: "100%", textAlign: "left" as const,
    transition: "background 0.15s, color 0.15s",
    overflow: "hidden",
  },
  navItemCollapsed: { justifyContent: "center", padding: "10px 0" },
  navItemActive: { fontWeight: 600 },
  navItemHover:  { background: "#f1f5f9", color: "#0f172a" },
  activeBar: {
    position: "absolute" as const, left: 0, top: "20%", bottom: "20%",
    width: 3, borderRadius: "0 3px 3px 0",
  },
  profileCard: {
    display: "flex", alignItems: "center", gap: 9,
    padding: "10px 8px", borderRadius: 10,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    marginBottom: 6,
  },
  avatarSmall: {
    width: 32, height: 32, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 12, fontWeight: 800, flexShrink: 0,
  },
  profileName:  { margin: 0, fontSize: 12.5, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const },
  profileEmail: { margin: "1px 0 0", fontSize: 10.5, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const },
  rolePill: {
    fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
    border: "1px solid", letterSpacing: "0.03em", whiteSpace: "nowrap" as const, flexShrink: 0,
  },
  logoutBtn: {
    display: "flex", alignItems: "center", gap: 9,
    padding: "9px 10px", borderRadius: 9, border: "none",
    background: "transparent", cursor: "pointer",
    color: "#94a3b8", fontFamily: "inherit",
    width: "100%", textAlign: "left" as const,
    transition: "background 0.15s, color 0.15s",
  },
};

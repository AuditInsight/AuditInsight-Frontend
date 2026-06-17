"use client";

import {
  LayoutDashboard,
  ArrowLeftRight,
  FileCheck,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { useRouter, usePathname } from "next/navigation";
import { headerStyles } from "./header.styles";
import { useProfile } from "@/hooks/useProfile";

export interface HeaderProps {
  title: string;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Transactions", icon: ArrowLeftRight, path: "/transactions" },
  { label: "Evidence", icon: FileCheck, path: "/evidence" },
  { label: "Review Queue", icon: ClipboardList, path: "/review-queue" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { fullName, initials, role, loading } = useProfile();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("organisationId");
    router.replace("/log-in");
  };

  const displayName = loading ? "…" : fullName || "User";
  const displayInitials = loading ? "…" : initials || "?";
  const displayRole = role
    ? role.charAt(0) + role.slice(1).toLowerCase()
    : "";

  return (
    <header style={headerStyles.container}>
      {/* LEFT */}
      <div style={headerStyles.left}>
        <div
          style={headerStyles.logo}
          onClick={() => router.push("/dashboard")}
        >
          <div style={headerStyles.logoMark} />
          <div style={headerStyles.logoText}>
            <span style={headerStyles.title}>{title}</span>
            <span style={headerStyles.subtitle}>Audit Intelligence</span>
          </div>
        </div>

        <nav style={headerStyles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <div
                key={item.label}
                onClick={() => router.push(item.path)}
                style={{
                  ...headerStyles.navItem,
                  ...(isActive ? headerStyles.navItemActive : {}),
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    Object.assign(e.currentTarget.style, headerStyles.navItemHover);
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.78)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <Icon size={16} />
                {item.label}
              </div>
            );
          })}
        </nav>
      </div>

      {/* RIGHT */}
      <div style={headerStyles.right}>
        <div style={headerStyles.welcomeBlock}>
          <span style={headerStyles.welcomeLabel}>
            {displayRole}
          </span>
          <span style={headerStyles.welcome}>{displayName}</span>
        </div>

        <div style={headerStyles.avatar}>{displayInitials}</div>

        <button
          onClick={handleLogout}
          title="Sign out"
          style={logoutBtn}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

const logoutBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 8,
  color: "rgba(255,255,255,0.80)",
  cursor: "pointer",
  padding: "7px 9px",
  display: "flex",
  alignItems: "center",
  marginLeft: 8,
};

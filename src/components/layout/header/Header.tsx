"use client";

import {
  LayoutDashboard,
  ArrowLeftRight,
  FileCheck,
  ClipboardList,
  BarChart3,
  Settings,
} from "lucide-react";

import { useRouter, usePathname } from "next/navigation";
import { headerStyles } from "./header.styles";

export interface HeaderProps {
  title: string;
}

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Transactions",
    icon: ArrowLeftRight,
    path: "/transactions",
  },
  {
    label: "Evidence",
    icon: FileCheck,
    path: "/evidence",
  },
  {
    label: "Review Queue",
    icon: ClipboardList,
    path: "/review-queue",
  },
  {
    label: "Reports",
    icon: BarChart3,
    path: "/reports",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Header({
  title,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header style={headerStyles.container}>
      {/* =========================
          LEFT
      ========================= */}
      <div style={headerStyles.left}>
        
        {/* LOGO */}
        <div
          style={headerStyles.logo}
          onClick={() => router.push("/dashboard")}
        >
          <div style={headerStyles.logoMark} />

          <div style={headerStyles.logoText}>
            <span style={headerStyles.title}>
              {title}
            </span>

            <span style={headerStyles.subtitle}>
              Audit Intelligence
            </span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav style={headerStyles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.path;

            return (
              <div
                key={item.label}
                onClick={() =>
                  router.push(item.path)
                }
                style={{
                  ...headerStyles.navItem,

                  ...(isActive
                    ? headerStyles.navItemActive
                    : {}),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    Object.assign(
                      e.currentTarget.style,
                      headerStyles.navItemHover
                    );
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background =
                      "transparent";

                    e.currentTarget.style.color =
                      "rgba(255,255,255,0.78)";

                    e.currentTarget.style.transform =
                      "translateY(0)";
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

      {/* =========================
          RIGHT
      ========================= */}
      <div style={headerStyles.right}>
        
        {/* USER INFO */}
        <div style={headerStyles.welcomeBlock}>
          <span
            style={headerStyles.welcomeLabel}
          >
            Logged in as
          </span>

          <span style={headerStyles.welcome}>
            Diana
          </span>
        </div>

        {/* AVATAR */}
        <div style={headerStyles.avatar}>
          D

          <div style={headerStyles.badge}>
            6
          </div>
        </div>
      </div>
    </header>
  );
}
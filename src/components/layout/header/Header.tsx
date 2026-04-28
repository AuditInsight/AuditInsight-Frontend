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

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header style={headerStyles.container}>
      <div style={headerStyles.left}>
        <div
          style={headerStyles.logo}
          onClick={() => router.push("/dashboard")}
        >
          <div style={headerStyles.logoMark} />
          {title}
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
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = isActive ? "1" : "0.85";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Icon size={16} />
                {item.label}

                {isActive && (
                  <div style={headerStyles.activeUnderline} />
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div style={headerStyles.right}>
        <span style={headerStyles.welcome}>Welcome, Diana</span>

        <div style={headerStyles.avatar}>
          D
          <div style={headerStyles.badge}>6</div>
        </div>
      </div> 
    </header>
  );
}
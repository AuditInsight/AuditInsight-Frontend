import { FrontendRole } from "@/types/auth";

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const CORE_NAV: NavItem[] = [
  { label: "Dashboard",    path: "/dashboard",    icon: "📊" },
  { label: "Transactions", path: "/transactions", icon: "💳" },
  { label: "Evidence",     path: "/evidence",     icon: "📁" },
  { label: "Review Queue", path: "/review-queue", icon: "🔔" },
  { label: "Settings",     path: "/settings",     icon: "⚙️" },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Organizations",     path: "/admin/organizations", icon: "🏢" },
  { label: "Auditor Approvals", path: "/admin/approvals",     icon: "✅" },
  { label: "Settings",          path: "/admin/settings",      icon: "⚙️" },
];

export const NAV_BY_ROLE: Record<FrontendRole, NavItem[]> = {
  ACCOUNTANT:   CORE_NAV,
  ORG_ADMIN:    CORE_NAV,
  AUDITOR:      CORE_NAV,
  SYSTEM_ADMIN: ADMIN_NAV,
};



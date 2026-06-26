import { UserRole } from "@/types/user";

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

export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  MEMBER:  CORE_NAV,
  CLIENT:  CORE_NAV,
  AUDITOR: CORE_NAV,
  ADMIN:   ADMIN_NAV,
};

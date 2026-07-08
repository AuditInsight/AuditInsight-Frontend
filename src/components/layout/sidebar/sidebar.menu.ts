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

// NGO roles use the /ngo-dashboard layout — handled by NGOSidebar directly
const NGO_DONOR_NAV: NavItem[] = [
  { label: "My Projects",        path: "/ngo-dashboard",             icon: "📋" },
  { label: "Transactions",       path: "/ngo-dashboard/transactions", icon: "💳" },
  { label: "Evidence",           path: "/ngo-dashboard/evidence",    icon: "📁" },
  { label: "Compliance Reports", path: "/ngo-dashboard/compliance",  icon: "🤝" },
];

export const NAV_BY_ROLE: Record<FrontendRole, NavItem[]> = {
  ACCOUNTANT:           CORE_NAV,
  ORG_ADMIN:            CORE_NAV,
  AUDITOR:              CORE_NAV,
  SYSTEM_ADMIN:         ADMIN_NAV,
  DONOR_REPRESENTATIVE: NGO_DONOR_NAV,
};



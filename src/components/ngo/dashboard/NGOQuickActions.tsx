"use client";

import { useRouter } from "next/navigation";
import { Plus, Upload, Flag, BarChart3, FileText, Settings, Eye, ShieldCheck } from "lucide-react";
import { useRBAC } from "@/context/RBACContext";
import type { NGORole } from "@/types/ngo";
import { useAuth } from "@/context/AuthContext.production";

interface QuickAction {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  path: string;
}

// Actions visible per role
const ACTIONS_BY_ROLE: Record<NGORole, QuickAction[]> = {
  ACCOUNTANT: [
    { label: "New Transaction",  description: "Record a new financial entry",   icon: <Plus size={18} />,      color: "#1e3a8a", bg: "rgba(30,58,138,0.08)", path: "/ngo-dashboard/transactions" },
    { label: "Upload Evidence",  description: "Attach documents to a record",   icon: <Upload size={18} />,    color: "#2563eb", bg: "rgba(37,99,235,0.08)", path: "/ngo-dashboard/evidence"     },
    { label: "Evidence Vault",   description: "Browse all supporting documents", icon: <FileText size={18} />,  color: "#64748b", bg: "#f8fafc",              path: "/ngo-dashboard/evidence"     },
    { label: "View Reports",     description: "Download financial summaries",    icon: <BarChart3 size={18} />, color: "#475569", bg: "#f1f5f9",              path: "/ngo-dashboard/reports"      },
    { label: "Settings",         description: "Manage your account preferences", icon: <Settings size={18} />,  color: "#0f172a", bg: "#f1f5f9",              path: "/ngo-dashboard/settings"     },
  ],
  AUDITOR: [
    { label: "Review Queue",     description: "Inspect flagged transactions",    icon: <Flag size={18} />,      color: "#d97706", bg: "#fffbeb",              path: "/ngo-dashboard/review"       },
    { label: "Evidence Vault",   description: "Browse all supporting documents", icon: <FileText size={18} />,  color: "#64748b", bg: "#f8fafc",              path: "/ngo-dashboard/evidence"     },
    { label: "View Reports",     description: "Download financial summaries",    icon: <BarChart3 size={18} />, color: "#475569", bg: "#f1f5f9",              path: "/ngo-dashboard/reports"      },
    { label: "Compliance",       description: "Check compliance status",         icon: <ShieldCheck size={18} />, color: "#15803d", bg: "#f0fdf4",           path: "/ngo-dashboard/compliance"   },
    { label: "Settings",         description: "Manage your account preferences", icon: <Settings size={18} />,  color: "#0f172a", bg: "#f1f5f9",              path: "/ngo-dashboard/settings"     },
  ],
  ORG_ADMIN: [
    { label: "View Transactions", description: "Overview of all transactions",   icon: <Eye size={18} />,       color: "#1e3a8a", bg: "rgba(30,58,138,0.08)", path: "/ngo-dashboard/transactions" },
    { label: "View Reports",      description: "Download financial summaries",   icon: <BarChart3 size={18} />, color: "#475569", bg: "#f1f5f9",              path: "/ngo-dashboard/reports"      },
    { label: "Review Queue",      description: "Monitor flagged transactions",   icon: <Flag size={18} />,      color: "#d97706", bg: "#fffbeb",              path: "/ngo-dashboard/review"       },
    { label: "Compliance",        description: "Check compliance status",        icon: <ShieldCheck size={18} />, color: "#15803d", bg: "#f0fdf4",           path: "/ngo-dashboard/compliance"   },
    { label: "Settings",          description: "Manage organisation settings",   icon: <Settings size={18} />,  color: "#0f172a", bg: "#f1f5f9",              path: "/ngo-dashboard/settings"     },
  ],
  DONOR_REPRESENTATIVE: [
    { label: "View Transactions", description: "View your donor transactions",   icon: <Eye size={18} />,       color: "#1e3a8a", bg: "rgba(30,58,138,0.08)", path: "/ngo-dashboard/transactions" },
    { label: "Evidence Vault",    description: "Browse supporting documents",    icon: <FileText size={18} />,  color: "#64748b", bg: "#f8fafc",              path: "/ngo-dashboard/evidence"     },
    { label: "View Reports",      description: "Download financial summaries",   icon: <BarChart3 size={18} />, color: "#475569", bg: "#f1f5f9",              path: "/ngo-dashboard/reports"      },
  ],
};

export default function NGOQuickActions() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const rawRole = authUser?.role ?? "ORG_ADMIN";
  const role    = (rawRole === "SYSTEM_ADMIN" ? "ORG_ADMIN" : rawRole) as NGORole;
  const actions = ACTIONS_BY_ROLE[role] ?? ACTIONS_BY_ROLE.ORG_ADMIN;

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Quick Actions</p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8" }}>Common tasks at a glance</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#f1f5f9" }}>
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => router.push(action.path)}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, padding: "18px 20px", background: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "background 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
          >
            <div style={{ width: 38, height: 38, borderRadius: 10, background: action.bg, display: "flex", alignItems: "center", justifyContent: "center", color: action.color }}>
              {action.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{action.label}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

/**
 * ExecutiveOverviewBanner.tsx — ORG_ADMIN-only executive greeting banner.
 *
 * Displays a high-level summary of the organisation's audit health,
 * burn rate, and active project count. Gated by widget:executive_overview.
 *
 * Gated by: COMPONENT_GATE["panel:executive_flags"] → ORG_ADMIN only.
 */

import { ShieldCheck, TrendingUp, FolderOpen, AlertTriangle } from "lucide-react";
import type { NGOTransaction, NGOFlag } from "@/types/ngo";
import { useRBAC } from "@/context/RBACContext";

interface Props {
  transactions: NGOTransaction[];
  flags: NGOFlag[];
}

export default function ExecutiveOverviewBanner({ transactions, flags }: Props) {
  const { user } = useRBAC();

  if (user.role !== "ORG_ADMIN") return null;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const totalGrant  = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalSpend  = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const burnPct     = totalGrant > 0 ? Math.round((totalSpend / totalGrant) * 100) : 0;
  const openFlags   = flags.filter((f) => f.status === "OPEN").length;
  const projects    = new Set(transactions.map((t) => t.projectName)).size;
  const criticalFlags = flags.filter((f) => f.status === "OPEN" && f.severity === "CRITICAL").length;

  const burnColor =
    burnPct > 90 ? "#dc2626" : burnPct > 70 ? "#d97706" : "#1e3a8a";

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-900 to-blue-800 p-6 shadow-lg text-white overflow-hidden relative">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)",
        }}
      />

      {/* Greeting row */}
      <div className="flex items-start justify-between gap-4 mb-5 relative">
        <div>
          <p className="text-blue-200 text-sm font-medium mb-1">
            {greeting}, {user.fullName.split(" ")[0]} · {user.organisationName}
          </p>
          <h2 className="text-2xl font-bold text-white leading-tight tracking-tight">
            Executive Overview
          </h2>
          <p className="text-blue-200 text-sm mt-1">
            Read-only monitoring dashboard · All departments
          </p>
        </div>
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
          <ShieldCheck size={22} className="text-white" />
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {[
          {
            label: "Grant Utilisation",
            value: `${burnPct}%`,
            sub: `RWF ${((totalGrant - totalSpend) / 1_000_000).toFixed(1)}M remaining`,
            icon: <TrendingUp size={14} />,
            accent: burnColor,
          },
          {
            label: "Active Projects",
            value: projects,
            sub: `${transactions.length} total transactions`,
            icon: <FolderOpen size={14} />,
            accent: "#60a5fa",
          },
          {
            label: "Open Audit Flags",
            value: openFlags,
            sub: openFlags === 0 ? "All clear" : `${criticalFlags} critical`,
            icon: <AlertTriangle size={14} />,
            accent: openFlags > 0 ? "#fca5a5" : "#86efac",
          },
          {
            label: "Total Grant Funding",
            value: `RWF ${(totalGrant / 1_000_000).toFixed(1)}M`,
            sub: "All donors combined",
            icon: <ShieldCheck size={14} />,
            accent: "#a5b4fc",
          },
        ].map(({ label, value, sub, icon, accent }) => (
          <div
            key={label}
            className="rounded-xl bg-white/10 border border-white/15 p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-1.5 mb-2" style={{ color: accent }}>
              {icon}
              <span className="text-xs font-semibold">{label}</span>
            </div>
            <p className="text-xl font-bold text-white leading-none mb-1">{value}</p>
            <p className="text-xs text-blue-200">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

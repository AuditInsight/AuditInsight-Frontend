"use client";

import { useState } from "react";
import {
  TrendingUp, Users, FolderOpen, ShieldCheck,
  AlertTriangle, DollarSign, CheckCircle2, Clock,
  Bell, LogOut, Search, ChevronDown,
} from "lucide-react";
import NGOSidebar from "./NGOSidebar";
import NGOTransactionTable from "./NGOTransactionTable";
import NGOFlagIssueModal from "./NGOFlagIssueModal";
import NGONotificationPanel from "./NGONotificationPanel";
import AppFooter from "@/components/layout/AppFooter";
import { useAuth } from "@/context/AuthContext.production";
import { RBACProvider, useRBAC, useScopedData } from "@/context/RBACContext";
import type { NGORole, NGOTransaction, NGOFlag, NGONotification, DonorName } from "@/types/ngo";
import { NGO_PERMISSIONS } from "@/types/ngo";
import { NGO_TRANSACTIONS, NGO_FLAGS, NGO_NOTIFICATIONS, NGO_MOCK_USERS } from "@/mock/ngo.mock";
import PermissionGate from "@/components/ngo-dashboard/rbac/PermissionGate";
import ActionItems from "@/components/ngo-dashboard/rbac/ActionItems";
import AuditorAlertsPanel from "@/components/ngo-dashboard/rbac/AuditorAlertsPanel";
import ExecutiveAlertPanel from "@/components/ngo-dashboard/rbac/ExecutiveAlertPanel";
import AuditSummaryPanel from "@/components/ngo-dashboard/rbac/AuditSummaryPanel";
import DonorScopeMetrics from "@/components/ngo-dashboard/rbac/DonorScopeMetrics";
import ExecutiveOverviewBanner from "@/components/ngo-dashboard/rbac/ExecutiveOverviewBanner";
import ReportSigningPanel from "@/components/ngo-dashboard/rbac/ReportSigningPanel";
import DonorScopeBanner from "@/components/ngo-dashboard/rbac/DonorScopeBanner";
import RoleBadge from "@/components/ngo-dashboard/rbac/RoleBadge";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  .ngo-shell   { display: flex; min-height: 100vh; background: #f1f5f9; font-family: 'Inter', system-ui, sans-serif; }
  .ngo-body    { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .ngo-content { padding: 28px; display: flex; flex-direction: column; gap: 24px; flex: 1; }
  .ngo-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .ngo-two-col { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }
  @media (max-width: 1200px) { .ngo-two-col { grid-template-columns: 1fr; } }
  @media (max-width: 1024px) { .ngo-metrics { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px)  { .ngo-metrics { grid-template-columns: 1fr; } .ngo-content { padding: 16px; } }
`;

// ─── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({ icon, label, value, sub, accent, progress }: {
  icon: React.ReactNode; label: string; value: string | number;
  sub?: string; accent: string; progress?: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: "#fff", borderRadius: 14, padding: "20px",
        border: `1px solid ${hovered ? "#cbd5e1" : "#e2e8f0"}`,
        boxShadow: hovered ? "0 4px 20px rgba(15,23,42,0.08)" : "0 1px 3px rgba(15,23,42,0.04)",
        transition: "all 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", color: accent, marginBottom: 14 }}>
        {icon}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1, marginBottom: 5 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginBottom: progress !== undefined ? 10 : 0 }}>
        {label}
      </div>
      {progress !== undefined && (
        <>
          <div style={{ height: 5, borderRadius: 999, background: "#f1f5f9", overflow: "hidden", marginBottom: 4 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: accent, borderRadius: 999, transition: "width 0.6s ease" }} />
          </div>
          <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{sub}</div>
        </>
      )}
      {progress === undefined && sub && (
        <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>{sub}</div>
      )}
    </div>
  );
}

// ─── Compliance ring ──────────────────────────────────────────────────────────
function ComplianceRing({ score }: { score: number }) {
  const r = 36, circ = 2 * Math.PI * r;
  const color = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 24px", background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
      <svg width={88} height={88} viewBox="0 0 88 88">
        <circle cx={44} cy={44} r={r} fill="none" stroke="#f1f5f9" strokeWidth={8} />
        <circle cx={44} cy={44} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${(score / 100) * circ} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 44 44)" style={{ transition: "stroke-dasharray 0.8s ease" }} />
        <text x={44} y={44} textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: 16, fontWeight: 700, fill: "#0f172a" }}>{score}%</text>
      </svg>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Audit Compliance Score</div>
        <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 10 }}>
          {score >= 80 ? "Strong evidence coverage across all projects." : score >= 60 ? "Some gaps detected — action recommended." : "Critical gaps — urgent action required."}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[["Complete", "#16a34a", "#f0fdf4"], ["Pending", "#d97706", "#fffbeb"], ["Flagged", "#dc2626", "#fef2f2"]].map(([l, c, bg]) => (
            <span key={l} style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, color: c, background: bg }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Top header bar ───────────────────────────────────────────────────────────
function TopBar({ role, userName, orgName, donorScope, flagCount, unreadNotifs, onNotifClick, notifOpen, notifications, onMarkRead, onMarkAllRead, onDismiss, onLogout, search, onSearchChange }: {
  role: NGORole; userName: string; orgName: string; donorScope?: string | null;
  flagCount: number; unreadNotifs: number;
  onNotifClick: () => void; notifOpen: boolean;
  notifications: NGONotification[];
  onMarkRead: (id: string) => void; onMarkAllRead: () => void; onDismiss: (id: string) => void;
  onLogout: () => void;
  search: string; onSearchChange: (v: string) => void;
}) {
  const ROLE_TITLES: Record<NGORole, string> = {
    ACCOUNTANT:           "Finance Workspace",
    AUDITOR:              "Audit Review",
    ORG_ADMIN:            "Executive Overview",
    DONOR_REPRESENTATIVE: `${donorScope ?? "Donor"} Portal`,
  };
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const initials = userName.split(" ").map((n) => n[0] ?? "").join("").toUpperCase().slice(0, 2);

  return (
    <div style={tb.bar}>
      {/* Left: greeting + title */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <span style={tb.greeting}>{greeting}, {userName.split(" ")[0]} · {orgName}</span>
        <h1 style={tb.title}>{ROLE_TITLES[role]}</h1>
      </div>

      {/* Right: search, flag alert, bell, avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Search */}
        <div style={tb.searchBox}>
          <Search size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
          <input placeholder="Search transactions…" style={tb.searchInput} value={search} onChange={(e) => onSearchChange(e.target.value)} />
        </div>

        {/* Flag alert */}
        {flagCount > 0 && (
          <div style={tb.flagAlert}>
            <AlertTriangle size={13} color="#dc2626" />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#dc2626" }}>{flagCount} flag{flagCount > 1 ? "s" : ""}</span>
          </div>
        )}

        {/* Bell */}
        <div style={{ position: "relative" }}>
          <button style={tb.iconBtn} onClick={onNotifClick} title="Notifications">
            <Bell size={15} />
            {unreadNotifs > 0 && (
              <span style={tb.badge}>{unreadNotifs > 9 ? "9+" : unreadNotifs}</span>
            )}
          </button>
          {notifOpen && (
            <div style={tb.notifDropdown}>
              <NGONotificationPanel
                notifications={notifications}
                onMarkRead={onMarkRead}
                onMarkAllRead={onMarkAllRead}
                onDismiss={onDismiss}
              />
            </div>
          )}
        </div>

        {/* Avatar + name */}
        <div style={tb.userChip}>
          <div style={tb.avatar}>{initials}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <span style={tb.userName}>{userName}</span>
            <span style={tb.userRole}>{role.replace("_", " ")}</span>
          </div>
          <ChevronDown size={13} style={{ color: "#94a3b8" }} />
        </div>

        {/* Logout */}
        <button style={tb.logoutBtn} onClick={onLogout} title="Sign out">
          <LogOut size={14} />
        </button>
      </div>
    </div>
  );
}

const tb: Record<string, React.CSSProperties> = {
  bar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 28px", background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
    position: "sticky", top: 0, zIndex: 50, gap: 16, flexWrap: "wrap" as const,
  },
  greeting: { fontSize: 11.5, color: "#94a3b8", fontWeight: 500, letterSpacing: "0.01em" },
  title:    { margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.4px" },
  searchBox: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "7px 12px", borderRadius: 9,
    background: "#f8fafc", border: "1px solid #e2e8f0",
    width: 200,
  },
  searchInput: {
    border: "none", background: "transparent", outline: "none",
    fontSize: 12.5, color: "#0f172a", fontFamily: "inherit", width: "100%",
  },
  flagAlert: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "6px 12px", borderRadius: 9,
    background: "#fef2f2", border: "1px solid #fecaca",
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 9,
    border: "1px solid #e2e8f0", background: "#f8fafc",
    color: "#64748b", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative" as const,
  },
  badge: {
    position: "absolute" as const, top: -4, right: -4,
    background: "#dc2626", color: "#fff",
    fontSize: 9, fontWeight: 700, borderRadius: 10,
    padding: "1px 4px", minWidth: 16, textAlign: "center" as const,
    lineHeight: 1.5, border: "1.5px solid #fff",
  },
  userChip: {
    display: "flex", alignItems: "center", gap: 9,
    padding: "6px 12px 6px 6px", borderRadius: 10,
    background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer",
  },
  avatar: {
    width: 30, height: 30, borderRadius: "50%",
    background: "#1e3a8a", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 800, flexShrink: 0,
  },
  userName: { fontSize: 12.5, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 },
  userRole: { fontSize: 10.5, color: "#94a3b8", fontWeight: 500, textTransform: "capitalize" as const },
  logoutBtn: {
    width: 36, height: 36, borderRadius: 9,
    border: "1px solid #e2e8f0", background: "#f8fafc",
    color: "#94a3b8", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  notifDropdown: {
    position: "absolute" as const,
    top: "calc(100% + 10px)",
    right: 0,
    width: 400,
    maxHeight: 520,
    overflowY: "auto" as const,
    borderRadius: 14,
    boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    zIndex: 200,
  },
};

// ─── Main component ───────────────────────────────────────────────────────────
function NGODashboardInner() {
  const { user: authUser, logout } = useAuth();
  const { user: rbacUser, scopeData } = useRBAC();

  // Resolve role — must be a valid NGORole; SYSTEM_ADMIN cannot reach this page
  const rawRole    = authUser?.role ?? "ORG_ADMIN";
  const activeRole = (rawRole === "SYSTEM_ADMIN" ? "ORG_ADMIN" : rawRole) as NGORole;
  const mockUser   = NGO_MOCK_USERS[activeRole];
  const user = {
    fullName:         authUser?.fullName         ?? mockUser.fullName,
    email:            authUser?.email            ?? mockUser.email,
    role:             activeRole,
    organisationName: authUser?.organisationName ?? mockUser.organisationName,
    donorScope:       (authUser?.donorScope      ?? mockUser.donorScope) as DonorName | null,
  };
  const perms = NGO_PERMISSIONS[activeRole];

  const [collapsed, setCollapsed]   = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [search, setSearch]         = useState("");

  const [transactions, setTransactions] = useState<NGOTransaction[]>(NGO_TRANSACTIONS);
  const [flags, setFlags]               = useState<NGOFlag[]>(NGO_FLAGS);
  const [notifications, setNotifications] = useState<NGONotification[]>(NGO_NOTIFICATIONS);
  const [flagTarget, setFlagTarget]     = useState<NGOTransaction | null>(null);

  const scopedTransactions = scopeData(transactions, (t) => t.donor);

  const totalGrant  = scopedTransactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalSpend  = scopedTransactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const burnPct     = totalGrant > 0 ? Math.round((totalSpend / totalGrant) * 100) : 0;
  const openFlags   = flags.filter((f) => f.status === "OPEN").length;
  const completedTxns = scopedTransactions.filter((t) => t.status === "COMPLETED").length;
  const complianceScore = Math.max(0, Math.round(((completedTxns / Math.max(scopedTransactions.length, 1)) * 100) - (openFlags * 8)));
  const uniqueProjects  = new Set(scopedTransactions.map((t) => t.projectName)).size;
  const uniqueDonors    = new Set(scopedTransactions.map((t) => t.donor)).size;
  const unreadNotifs    = notifications.filter((n) => !n.read).length;

  const handleFlagSubmit = (flag: { transactionId: string; category: import("@/types/ngo").NGOFlagCategory; severity: import("@/types/ngo").FlagSeverity; notes: string }) => {
    const newFlag: NGOFlag = {
      id: `FLAG-${Date.now()}`,
      transactionId: flag.transactionId,
      projectName: flagTarget?.projectName ?? "",
      donor: flagTarget?.donor ?? "USAID",
      category: flag.category, severity: flag.severity, notes: flag.notes,
      flaggedBy: user.fullName, flaggedAt: new Date().toISOString(), status: "OPEN",
    };
    setFlags((prev) => [...prev, newFlag]);
    setTransactions((prev) => prev.map((t) => t.id === flag.transactionId ? { ...t, status: "FLAGGED" as const } : t));
    setNotifications((prev) => [{
      id: `NOTIF-${Date.now()}`, flagId: newFlag.id,
      transactionId: flag.transactionId, projectName: flagTarget?.projectName ?? "",
      donor: flagTarget?.donor ?? "USAID",
      message: `Transaction ${flag.transactionId} for ${flagTarget?.projectName}: ${flag.category}.`,
      auditorName: user.fullName, severity: flag.severity,
      createdAt: new Date().toISOString(), read: false,
    }, ...prev]);
    setFlagTarget(null);
  };

  const handleMarkRead    = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const handleMarkAllRead = ()            => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const handleDismiss     = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const handleLogout      = () => { logout(); window.location.href = "/log-in"; };

  return (
    <div className="ngo-shell">
      <style>{CSS}</style>

      <NGOSidebar
        user={{ fullName: user.fullName, email: user.email, role: user.role, organisationName: user.organisationName, donorScope: user.donorScope }}
        onLogout={handleLogout}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <div className="ngo-body">
        {/* Top header bar */}
        <TopBar
          role={activeRole}
          userName={user.fullName}
          orgName={user.organisationName}
          donorScope={user.donorScope}
          flagCount={openFlags}
          unreadNotifs={unreadNotifs}
          onNotifClick={() => setNotifOpen((v) => !v)}
          notifOpen={notifOpen}
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onDismiss={handleDismiss}
          onLogout={handleLogout}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="ngo-content">
          {/* Metrics */}
          <div className="ngo-metrics">
            <MetricCard icon={<DollarSign size={18} />} label="Total Grant Funding"
              value={`RWF ${(totalGrant / 1_000_000).toFixed(1)}M`}
              sub={`${burnPct}% utilised · RWF ${((totalGrant - totalSpend) / 1_000_000).toFixed(1)}M remaining`}
              accent="#1e3a8a" progress={burnPct} />
            <MetricCard icon={<Users size={18} />} label="Active Donors"
              value={uniqueDonors} sub={`Across ${uniqueProjects} active projects`} accent="#7c3aed" />
            <MetricCard icon={<FolderOpen size={18} />} label="Projects in Progress"
              value={uniqueProjects}
              sub={`${transactions.filter((t) => t.status === "PENDING").length} transactions pending evidence`}
              accent="#0891b2" />
            <MetricCard icon={<ShieldCheck size={18} />} label="Open Audit Flags"
              value={openFlags}
              sub={openFlags === 0 ? "No issues raised" : `${openFlags} issue${openFlags > 1 ? "s" : ""} require attention`}
              accent={openFlags > 0 ? "#dc2626" : "#16a34a"} />
          </div>

          {/* ORG_ADMIN: Executive Overview Banner */}
          <PermissionGate component="panel:executive_flags">
            <ExecutiveOverviewBanner
              transactions={scopedTransactions}
              flags={flags}
            />
          </PermissionGate>

          {/* DONOR_REPRESENTATIVE: Scope Banner */}
          {activeRole === "DONOR_REPRESENTATIVE" && user.donorScope && (
            <DonorScopeBanner donorName={user.donorScope} />
          )}

          {/* Compliance ring */}
          {(activeRole === "ORG_ADMIN" || activeRole === "AUDITOR") && (
            <ComplianceRing score={complianceScore} />
          )}

          {/* Table + side panel */}
          <div className="ngo-two-col">
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <div style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                    {activeRole === "DONOR_REPRESENTATIVE" ? `${user.donorScope} Transactions` : "Transaction Review"}
                  </h2>
                  <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#64748b" }}>
                    {activeRole === "ACCOUNTANT" && "Record, tag, and upload evidence for each transaction."}
                    {activeRole === "AUDITOR"    && "Inspect evidence and flag compliance issues."}
                    {activeRole === "ORG_ADMIN"  && "Read-only view of all project transactions."}
                    {activeRole === "DONOR_REPRESENTATIVE" && `Scoped to ${user.donorScope} projects only.`}
                  </p>
                </div>
                {perms.canRecordTransaction && (
                  <button style={s.addTxnBtn}>+ New Transaction</button>
                )}
              </div>
              <NGOTransactionTable
                transactions={scopedTransactions.filter((t) =>
                  !search ||
                  t.id.toLowerCase().includes(search.toLowerCase()) ||
                  t.description.toLowerCase().includes(search.toLowerCase()) ||
                  t.projectName.toLowerCase().includes(search.toLowerCase())
                )}
                role={activeRole}
                donorScope={user.donorScope}
                onUploadEvidence={(txn) => alert(`Upload evidence for ${txn.id}`)}
                onEditTransaction={(txn) => alert(`Edit transaction ${txn.id}`)}
                onFlagIssue={(txn) => setFlagTarget(txn)}
              />
            </div>

            {/* Right panel — role-specific */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* ACCOUNTANT: Action Items + Auditor Alerts */}
              <PermissionGate component="panel:action_items">
                <ActionItems
                  transactions={scopedTransactions}
                  onUploadEvidence={(txn) => { /* handled by table */ void txn; }}
                />
              </PermissionGate>
              <PermissionGate component="panel:auditor_alerts">
                <AuditorAlertsPanel
                  flags={flags}
                  transactions={scopedTransactions}
                  onUploadEvidence={(txn) => { void txn; }}
                />
              </PermissionGate>

              {/* AUDITOR: Review Queue Summary */}
              <PermissionGate component="panel:audit_summary">
                <AuditSummaryPanel
                  transactions={scopedTransactions}
                  flags={flags}
                  auditorName={user.fullName}
                />
              </PermissionGate>

              {/* ORG_ADMIN: Executive Flag Alert Panel */}
              <PermissionGate component="panel:executive_flags">
                <ExecutiveAlertPanel
                  flags={flags}
                  onResolve={(id) => {
                    setFlags((prev) => prev.map((f) =>
                      f.id === id ? { ...f, status: "RESOLVED" as const, resolvedAt: new Date().toISOString() } : f
                    ));
                  }}
                />
              </PermissionGate>

              {/* ORG_ADMIN: Report Signing Panel */}
              <PermissionGate permission="report:sign">
                <ReportSigningPanel />
              </PermissionGate>

              {/* DONOR_REPRESENTATIVE: Scoped Portfolio */}
              {activeRole === "DONOR_REPRESENTATIVE" && user.donorScope && (() => {
                const dt = scopedTransactions;
                const dg = dt.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
                const ds = dt.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
                return (
                  <div style={s.summaryCard}>
                    <h3 style={s.cardTitle}>{user.donorScope} Portfolio</h3>
                    <div style={s.divider} />
                    {[
                      { label: "Total transactions",   value: dt.length,                                       color: "#0f172a" },
                      { label: "Grant disbursed",      value: `RWF ${(dg / 1_000_000).toFixed(1)}M`,          color: "#16a34a" },
                      { label: "Total expenditure",    value: `RWF ${(ds / 1_000_000).toFixed(1)}M`,          color: "#1e3a8a" },
                      { label: "Flagged transactions", value: dt.filter(t => t.status === "FLAGGED").length,   color: "#dc2626" },
                      { label: "Evidence complete",    value: dt.filter(t => t.status === "COMPLETED").length, color: "#16a34a" },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={s.summaryRow}>
                        <span style={{ flex: 1, fontSize: 13, color: "#475569" }}>{label}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        <AppFooter />
      </div>

      <NGOFlagIssueModal
        open={flagTarget !== null} transaction={flagTarget}
        auditorName={user.fullName}
        onClose={() => setFlagTarget(null)}
        onSubmit={handleFlagSubmit}
      />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  addTxnBtn: { padding: "9px 16px", borderRadius: 10, border: "none", background: "#0f172a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" as const },
  summaryCard: { background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "18px 20px", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" },
  cardTitle:   { margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12 },
  divider:     { height: 1, background: "#f1f5f9", marginBottom: 12 },
  summaryRow:  { display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #f8fafc" },
};

// ─── Public export — wraps inner component with RBACProvider ─────────────────────
export default function NGODashboard() {
  return (
    <RBACProvider>
      <NGODashboardInner />
    </RBACProvider>
  );
}

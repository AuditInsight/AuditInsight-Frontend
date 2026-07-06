"use client";

import { useState } from "react";
import {
  TrendingUp, Users, FolderOpen, ShieldCheck,
  AlertTriangle, DollarSign, Bell, LogOut,
  Search, ChevronDown, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import NGOSidebar from "./NGOSidebar";
import NGOTransactionTable from "./NGOTransactionTable";
import NGOFlagIssueModal from "./NGOFlagIssueModal";
import NGONotificationPanel from "./NGONotificationPanel";
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
import NGORoleSwitcher from "@/components/ngo-dashboard/rbac/NGORoleSwitcher";
import AddTransactionModal from "./AddTransactionModal";
import UploadEvidenceModal from "./UploadEvidenceModal";
import EditTransactionModal from "./EditTransactionModal";

// ─── Metric card ──────────────────────────────────────────────────────────────
function KPICard({
  icon, label, value, sub, accent, progress, trend,
}: {
  icon: React.ReactNode; label: string; value: string | number;
  sub?: string; accent: string; progress?: number;
  trend?: { dir: "up" | "down"; label: string };
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "20px", display: "flex", flexDirection: "column", gap: 14, boxShadow: "0 1px 4px rgba(15,23,42,0.05)", transition: "box-shadow 0.2s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: accent + "15", color: accent }}>
          {icon}
        </div>
        {trend && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700, padding: "4px 8px", borderRadius: 8, color: trend.dir === "up" ? "#1e3a8a" : "#475569", background: trend.dir === "up" ? "rgba(30,58,138,0.08)" : "#f1f5f9" }}>
            {trend.dir === "up" ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {trend.label}
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1, marginBottom: 4 }}>{value}</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>{label}</div>
      </div>
      {progress !== undefined && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, color: "#94a3b8" }}>{sub}</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: accent }}>{progress}%</span>
          </div>
          <div style={{ height: 5, borderRadius: 999, background: "#f1f5f9", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 999, width: `${progress}%`, background: accent, transition: "width 0.7s ease" }} />
          </div>
        </div>
      )}
      {progress === undefined && sub && (
        <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0, marginTop: -6 }}>{sub}</p>
      )}
    </div>
  );
}

// ─── Compliance ring ──────────────────────────────────────────────────────────
function ComplianceRing({ score }: { score: number }) {
  const r = 34, circ = 2 * Math.PI * r;
  const color = score >= 80 ? "#1e3a8a" : score >= 60 ? "#2563eb" : "#475569";
  const label = score >= 80 ? "Strong" : score >= 60 ? "Moderate" : "Needs Work";
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: 20, display: "flex", alignItems: "center", gap: 20, boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width={80} height={80} viewBox="0 0 80 80">
          <circle cx={40} cy={40} r={r} fill="none" stroke="#f1f5f9" strokeWidth={7} />
          <circle cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth={7}
            strokeDasharray={`${(score / 100) * circ} ${circ}`} strokeLinecap="round"
            transform="rotate(-90 40 40)" style={{ transition: "stroke-dasharray 0.8s ease" }} />
          <text x={40} y={40} textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: 14, fontWeight: 700, fill: "#0f172a" }}>{score}%</text>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Audit Compliance</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, padding: "2px 9px", borderRadius: 999, color, background: color + "15", border: `1px solid ${color}33` }}>{label}</span>
        </div>
        <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.6, marginBottom: 12, margin: "0 0 12px" }}>
          {score >= 80 ? "Strong evidence coverage across all projects." : score >= 60 ? "Some gaps detected — action recommended." : "Gaps identified — review required."}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {[["Complete", "#1e3a8a"], ["Pending", "#475569"], ["Flagged", "#64748b"]].map(([l, c]) => (
            <span key={l} style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, color: c, background: c + "12", border: `1px solid ${c}33` }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.3 }}>{title}</h2>
        {sub && <p style={{ fontSize: 12.5, color: "#64748b", margin: "3px 0 0" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────
function TopBar({
  role, userName, orgName, donorScope, flagCount,
  unreadNotifs, onNotifClick, notifOpen, notifications,
  onMarkRead, onMarkAllRead, onDismiss, onLogout, search, onSearchChange,
}: {
  role: NGORole; userName: string; orgName: string; donorScope?: string | null;
  flagCount: number; unreadNotifs: number;
  onNotifClick: () => void; notifOpen: boolean;
  notifications: NGONotification[];
  onMarkRead: (id: string) => void; onMarkAllRead: () => void; onDismiss: (id: string) => void;
  onLogout: () => void; search: string; onSearchChange: (v: string) => void;
}) {
  const ROLE_TITLES: Record<NGORole, string> = {
    ACCOUNTANT: "Finance Workspace",
    AUDITOR: "Audit Review",
    ORG_ADMIN: "Executive Overview",
    DONOR_REPRESENTATIVE: `${donorScope ?? "Donor"} Portal`,
  };
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const initials = userName.split(" ").map((n) => n[0] ?? "").join("").toUpperCase().slice(0, 2);

  return (
    <header style={tb.bar}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span style={tb.greeting}>{greeting}, {userName.split(" ")[0]} · {orgName}</span>
        <h1 style={tb.title}>{ROLE_TITLES[role]}</h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={tb.searchBox}>
          <Search size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
          <input
            placeholder="Search transactions…"
            style={tb.searchInput}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {flagCount > 0 && (
          <div style={tb.flagPill}>
            <AlertTriangle size={12} style={{ color: "#1e3a8a" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1e3a8a" }}>{flagCount} flag{flagCount > 1 ? "s" : ""}</span>
          </div>
        )}

        <div style={{ position: "relative" }}>
          <button style={tb.iconBtn} onClick={onNotifClick} title="Notifications">
            <Bell size={15} />
            {unreadNotifs > 0 && (
              <span style={tb.notifBadge}>{unreadNotifs > 9 ? "9+" : unreadNotifs}</span>
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

        <div style={tb.userChip}>
          <div style={tb.userAvatar}>{initials}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={tb.userName}>{userName.split(" ")[0]}</span>
            <span style={tb.userRole}>{role.replace(/_/g, " ")}</span>
          </div>
          <ChevronDown size={12} style={{ color: "#94a3b8" }} />
        </div>

        <button style={tb.iconBtn} onClick={onLogout} title="Sign out">
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}

// ─── Main inner component ─────────────────────────────────────────────────────
function NGODashboardInner() {
  const { user: authUser, logout } = useAuth();
  const { user: rbacUser, scopeData } = useRBAC();

  const rawRole = authUser?.role ?? "ORG_ADMIN";
  const activeRole = (rawRole === "SYSTEM_ADMIN" ? "ORG_ADMIN" : rawRole) as NGORole;
  const mockUser = NGO_MOCK_USERS[activeRole];
  const user = {
    fullName: authUser?.fullName ?? mockUser.fullName,
    email: authUser?.email ?? mockUser.email,
    role: activeRole,
    organisationId: authUser?.organisationId ?? mockUser.organisationId,
    organisationName: authUser?.organisationName ?? mockUser.organisationName,
    donorScope: (authUser?.donorScope ?? mockUser.donorScope) as DonorName | null,
  };
  const perms = NGO_PERMISSIONS[activeRole];

  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState<NGOTransaction[]>(NGO_TRANSACTIONS);
  const [flags, setFlags] = useState<NGOFlag[]>(NGO_FLAGS);
  const [notifications, setNotifications] = useState<NGONotification[]>(NGO_NOTIFICATIONS);
  const [flagTarget,    setFlagTarget]    = useState<NGOTransaction | null>(null);
  const [uploadTarget,  setUploadTarget]  = useState<NGOTransaction | null>(null);
  const [editTarget,    setEditTarget]    = useState<NGOTransaction | null>(null);
  const [addTxnOpen,    setAddTxnOpen]    = useState(false);

  const scopedTxns = scopeData(transactions, (t) => t.donor);
  const totalGrant = scopedTxns.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalSpend = scopedTxns.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const burnPct = totalGrant > 0 ? Math.round((totalSpend / totalGrant) * 100) : 0;
  const openFlags = flags.filter((f) => f.status === "OPEN").length;
  const completedTxns = scopedTxns.filter((t) => t.status === "COMPLETED").length;
  const complianceScore = Math.max(0, Math.round(((completedTxns / Math.max(scopedTxns.length, 1)) * 100) - openFlags * 8));
  const uniqueProjects = new Set(scopedTxns.map((t) => t.projectName)).size;
  const uniqueDonors = new Set(scopedTxns.map((t) => t.donor)).size;
  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const pendingCount = scopedTxns.filter((t) => t.status === "PENDING").length;

  const handleFlagSubmit = (flag: { transactionId: string; category: import("@/types/ngo").NGOFlagCategory; severity: import("@/types/ngo").FlagSeverity; notes: string }) => {
    const newFlag: NGOFlag = {
      id: `FLAG-${Date.now()}`, transactionId: flag.transactionId,
      projectName: flagTarget?.projectName ?? "", donor: flagTarget?.donor ?? "USAID",
      category: flag.category, severity: flag.severity, notes: flag.notes,
      flaggedBy: user.fullName, flaggedAt: new Date().toISOString(), status: "OPEN",
    };
    setFlags((p) => [...p, newFlag]);
    setTransactions((p) => p.map((t) => t.id === flag.transactionId ? { ...t, status: "FLAGGED" as const } : t));
    setNotifications((p) => [{
      id: `NOTIF-${Date.now()}`, flagId: newFlag.id, transactionId: flag.transactionId,
      projectName: flagTarget?.projectName ?? "", donor: flagTarget?.donor ?? "USAID",
      message: `Transaction ${flag.transactionId} for ${flagTarget?.projectName}: ${flag.category}.`,
      auditorName: user.fullName, severity: flag.severity,
      createdAt: new Date().toISOString(), read: false,
    }, ...p]);
    setFlagTarget(null);
  };

  const handleUploadSubmit = (transactionId: string, fileCount: number) => {
    setTransactions((p) => p.map((t) =>
      t.id === transactionId
        ? { ...t, status: "COMPLETED" as const, evidenceCount: t.evidenceCount + fileCount }
        : t
    ));
    setFlags((p) => p.map((f) =>
      f.transactionId === transactionId ? { ...f, status: "RESOLVED" as const, resolvedAt: new Date().toISOString() } : f
    ));
  };

  const handleEditSubmit = (updated: NGOTransaction) => {
    setTransactions((p) => p.map((t) => t.id === updated.id ? updated : t));
  };

  const handleAddTransaction = (txn: NGOTransaction) => {
    setTransactions((p) => [txn, ...p]);
  };

  const handleMarkRead = (id: string) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const handleMarkAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const handleDismiss = (id: string) => setNotifications((p) => p.filter((n) => n.id !== id));
  const handleLogout = () => { logout(); window.location.href = "/log-in"; };

  const filteredTxns = scopedTxns.filter((t) =>
    !search ||
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.projectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <NGOSidebar
        user={{ fullName: user.fullName, email: user.email, role: user.role, organisationName: user.organisationName, donorScope: user.donorScope }}
        onLogout={handleLogout}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <TopBar
          role={activeRole} userName={user.fullName} orgName={user.organisationName}
          donorScope={user.donorScope} flagCount={openFlags} unreadNotifs={unreadNotifs}
          onNotifClick={() => setNotifOpen((v) => !v)} notifOpen={notifOpen}
          notifications={notifications} onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead} onDismiss={handleDismiss}
          onLogout={handleLogout} search={search} onSearchChange={setSearch}
        />

        <main style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── Role-specific top banner ── */}
          <PermissionGate component="panel:executive_flags">
            <ExecutiveOverviewBanner transactions={scopedTxns} flags={flags} />
          </PermissionGate>
          {activeRole === "DONOR_REPRESENTATIVE" && user.donorScope && (
            <DonorScopeBanner donorName={user.donorScope} />
          )}

          {/* ── KPI cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            <KPICard
              icon={<DollarSign size={18} />} label="Total Grant Funding"
              value={`RWF ${(totalGrant / 1_000_000).toFixed(1)}M`}
              accent="#1e3a8a" progress={burnPct}
              sub={`RWF ${((totalGrant - totalSpend) / 1_000_000).toFixed(1)}M remaining`}
              trend={{ dir: burnPct > 80 ? "up" : "down", label: `${burnPct}% used` }}
            />
            <KPICard
              icon={<Users size={18} />} label="Active Donors"
              value={uniqueDonors} accent="#2563eb"
              sub={`Across ${uniqueProjects} active projects`}
            />
            <KPICard
              icon={<FolderOpen size={18} />} label="Pending Evidence"
              value={pendingCount} accent="#3b82f6"
              sub={`${uniqueProjects} projects in progress`}
              trend={pendingCount > 0 ? { dir: "down", label: "needs action" } : undefined}
            />
            <KPICard
              icon={<ShieldCheck size={18} />} label="Open Audit Flags"
              value={openFlags} accent="#475569"
              sub={openFlags === 0 ? "All clear — no issues" : `${openFlags} issue${openFlags > 1 ? "s" : ""} require attention`}
              trend={openFlags > 0 ? { dir: "down", label: "action needed" } : undefined}
            />
          </div>

          {/* ── Compliance ring (AUDITOR + ORG_ADMIN) ── */}
          {(activeRole === "ORG_ADMIN" || activeRole === "AUDITOR") && (
            <ComplianceRing score={complianceScore} />
          )}

          {/* ── Main content: table + right panel ── */}
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 320px" }}>

            {/* Left: transaction table */}
            <div style={{ minWidth: 0 }}>
              <SectionHeader
                title={activeRole === "DONOR_REPRESENTATIVE" ? `${user.donorScope} Transactions` : "Transaction Review"}
                sub={
                  activeRole === "ACCOUNTANT" ? "Record, tag, and upload evidence for each transaction." :
                  activeRole === "AUDITOR" ? "Inspect evidence and flag compliance issues." :
                  activeRole === "ORG_ADMIN" ? "Read-only view of all project transactions." :
                  `Scoped to ${user.donorScope} projects only.`
                }
                action={
                  perms.canRecordTransaction ? (
                    <button
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, background: "#0f172a", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}
                      onClick={() => setAddTxnOpen(true)}
                    >
                      + New Transaction
                    </button>
                  ) : undefined
                }
              />
              <NGOTransactionTable
                transactions={filteredTxns}
                role={activeRole}
                donorScope={user.donorScope}
                onUploadEvidence={(txn) => setUploadTarget(txn)}
                onEditTransaction={(txn) => setEditTarget(txn)}
                onFlagIssue={(txn) => setFlagTarget(txn)}
              />
            </div>

            {/* Right: role-specific panels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <PermissionGate component="panel:action_items">
                <ActionItems transactions={scopedTxns} onUploadEvidence={(txn) => setUploadTarget(txn)} />
              </PermissionGate>
              <PermissionGate component="panel:auditor_alerts">
                <AuditorAlertsPanel flags={flags} transactions={scopedTxns} onUploadEvidence={(txn) => setUploadTarget(txn)} />
              </PermissionGate>
              <PermissionGate component="panel:audit_summary">
                <AuditSummaryPanel transactions={scopedTxns} flags={flags} auditorName={user.fullName} />
              </PermissionGate>
              <PermissionGate component="panel:executive_flags">
                <ExecutiveAlertPanel
                  flags={flags}
                  onResolve={(id) => setFlags((p) => p.map((f) => f.id === id ? { ...f, status: "RESOLVED" as const, resolvedAt: new Date().toISOString() } : f))}
                />
              </PermissionGate>
              <PermissionGate permission="report:sign">
                <ReportSigningPanel />
              </PermissionGate>
              <PermissionGate component="panel:donor_metrics">
                {user.assignedDonorId && (
                  <DonorScopeMetrics allTransactions={transactions} allFlags={flags} donorScope={user.assignedDonorId} />
                )}
              </PermissionGate>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ padding: "14px 24px", borderTop: "1px solid #e2e8f0", background: "#fff" }}>
          <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", margin: 0 }}>
            AuditInsight NGO Portal · {user.organisationName} · {new Date().getFullYear()}
          </p>
        </footer>
      </div>

      <NGOFlagIssueModal
        open={flagTarget !== null} transaction={flagTarget}
        auditorName={user.fullName}
        onClose={() => setFlagTarget(null)}
        onSubmit={handleFlagSubmit}
      />
      <UploadEvidenceModal
        open={uploadTarget !== null} transaction={uploadTarget}
        onClose={() => setUploadTarget(null)}
        onSubmit={handleUploadSubmit}
      />
      <EditTransactionModal
        open={editTarget !== null} transaction={editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEditSubmit}
      />
      <AddTransactionModal
        open={addTxnOpen}
        createdBy={user.fullName}
        organisationId={user.organisationId}
        onClose={() => setAddTxnOpen(false)}
        onSubmit={handleAddTransaction}
      />
      <NGORoleSwitcher />
    </div>
  );
}

export default function NGODashboard() {
  return (
    <RBACProvider>
      <NGODashboardInner />
    </RBACProvider>
  );
}

const tb: Record<string, React.CSSProperties> = {
  bar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 24px", background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
    position: "sticky", top: 0, zIndex: 50, gap: 16,
  },
  greeting: { fontSize: 11.5, color: "#94a3b8", fontWeight: 500, margin: 0 },
  title:    { fontSize: 17, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.4px", margin: 0 },
  searchBox: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "7px 12px", borderRadius: 10,
    background: "#f8fafc", border: "1px solid #e2e8f0", width: 200,
  },
  searchInput: {
    border: "none", background: "transparent", outline: "none",
    fontSize: 12.5, color: "#0f172a", fontFamily: "inherit", width: "100%",
  },
  flagPill: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "6px 12px", borderRadius: 10,
    background: "rgba(30,58,138,0.06)", border: "1px solid rgba(30,58,138,0.18)",
  },
  iconBtn: {
    position: "relative" as const,
    width: 36, height: 36, borderRadius: 9,
    border: "1px solid #e2e8f0", background: "#f8fafc",
    color: "#64748b", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.15s",
  },
  notifBadge: {
    position: "absolute" as const, top: -4, right: -4,
    minWidth: 16, height: 16, padding: "0 3px",
    borderRadius: 999, background: "#1e3a8a", color: "#fff",
    fontSize: 9, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "2px solid #fff",
  },
  notifDropdown: {
    position: "absolute" as const, top: "calc(100% + 10px)", right: 0,
    width: 400, maxHeight: 520, overflowY: "auto" as const,
    borderRadius: 14, boxShadow: "0 20px 60px rgba(15,23,42,0.15)",
    border: "1px solid #e2e8f0", zIndex: 200,
  },
  userChip: {
    display: "flex", alignItems: "center", gap: 9,
    padding: "6px 12px 6px 6px", borderRadius: 10,
    background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer",
  },
  userAvatar: {
    width: 28, height: 28, borderRadius: 8,
    background: "linear-gradient(135deg,#0f3d75,#1e3a8a)",
    color: "#fff", fontSize: 11, fontWeight: 800,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  userName: { fontSize: 12.5, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 },
  userRole: { fontSize: 10.5, color: "#64748b", fontWeight: 500, textTransform: "capitalize" as const, lineHeight: 1.2 },
};

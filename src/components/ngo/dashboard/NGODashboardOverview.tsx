"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, ArrowUpRight, BarChart3, CheckCircle2,
  ChevronRight, Copy, Download, FileText, FolderOpen,
  Loader2, Paperclip, RefreshCw, TrendingUp, XCircle,
  DollarSign, Users, ShieldCheck,
} from "lucide-react";
import { NGO_TRANSACTIONS, NGO_FLAGS } from "@/mock/ngo.mock";
import { useRBAC, useScopedData } from "@/context/RBACContext";
import { useAuth } from "@/context/AuthContext.production";
import type { NGORole } from "@/types/ngo";

const ACCENT = "#0f172a";
const CHART_BAR = "#cbd5e1";
const CHART_BAR_ACTIVE = "#64748b";

const RESPONSIVE = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .ngo-db-shell { max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
  .ngo-db-metrics-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .ngo-db-three-col   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .ngo-db-two-col     { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  @media (max-width: 1024px) {
    .ngo-db-metrics-row { grid-template-columns: repeat(2, 1fr); }
    .ngo-db-three-col   { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .ngo-db-metrics-row { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .ngo-db-three-col   { grid-template-columns: 1fr; }
    .ngo-db-two-col     { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .ngo-db-metrics-row { grid-template-columns: 1fr; gap: 10px; }
  }
`;

// ─── Shared primitives (same style as MSE dashboard) ─────────────────────────

function MetricCard({ icon, value, label, trend, color, onClick }: {
  icon: React.ReactNode; value: string | number; label: string;
  trend?: string; color: string; onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...s.metricCard, borderColor: hovered ? "#cbd5e1" : "#e2e8f0", boxShadow: hovered ? "0 4px 16px rgba(15,23,42,0.06)" : "none", cursor: onClick ? "pointer" : "default" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color }}>
          {icon}
        </div>
        {onClick && <ArrowUpRight size={15} style={{ color: "#94a3b8" }} />}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: ACCENT, letterSpacing: "-0.5px", lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</span>
        {trend && (
          <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", display: "inline-flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" }}>
            <TrendingUp size={11} />{trend}
          </span>
        )}
      </div>
    </div>
  );
}

function ListItem({ icon, iconBg, iconColor, title, subtitle, rightLabel, rightColor, onClick }: {
  icon: React.ReactNode; iconBg: string; iconColor?: string;
  title: string; subtitle: string; rightLabel?: string; rightColor?: string; onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...s.listItem, background: hovered ? "#f8fafc" : "transparent", cursor: onClick ? "pointer" : "default" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor || "#64748b", flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {rightLabel && (
          <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: `${rightColor}15`, color: rightColor, whiteSpace: "nowrap" }}>
            {rightLabel}
          </span>
        )}
        {onClick && <ChevronRight size={16} style={{ color: "#94a3b8" }} />}
      </div>
    </div>
  );
}

function SegmentedBar({ segments }: { segments: { value: number; color: string }[] }) {
  return (
    <div style={{ display: "flex", height: 12, borderRadius: 8, overflow: "hidden", gap: 4, marginBottom: 20, background: "#f1f5f9" }}>
      {segments.map((seg, i) => (
        <div key={i} style={{ flex: seg.value, background: seg.color, borderRadius: 4, minWidth: seg.value > 0 ? 12 : 0 }} />
      ))}
    </div>
  );
}

function CategoryRow({ dotColor, label, value }: { dotColor: string; label: string; value: string | number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{label}</span>
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{value}</span>
    </div>
  );
}

function CardShell({ title, count, children, onRefresh }: {
  title: string; count?: string | number; children: React.ReactNode; onRefresh?: () => void;
}) {
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    if (onRefresh) { setRefreshing(true); onRefresh(); setTimeout(() => setRefreshing(false), 800); }
  };
  return (
    <div style={s.card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #f1f5f9" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: ACCENT }}>{title}</h3>
          {count !== undefined && <span style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, display: "block" }}>{count}</span>}
        </div>
        {onRefresh && (
          <button style={s.iconBtn} onClick={handleRefresh} title="Refresh">
            <RefreshCw size={16} style={{ animation: refreshing ? "spin 0.8s linear" : "none", color: "#94a3b8" }} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function BarChart({ data, maxHeight = 100 }: { data: { label: string; count: number }[]; maxHeight?: number }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: maxHeight, padding: "8px 0" }}>
        {data.map((d, i) => (
          <div key={d.label} title={`${d.label}: ${d.count}`} style={{ flex: 1, background: i === data.length - 1 ? CHART_BAR_ACTIVE : CHART_BAR, borderRadius: "4px 4px 0 0", height: `${Math.max((d.count / max) * 100, 8)}%`, minHeight: 6 }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
        {data.length > 0 ? (
          <>
            <span>{data[0].label}</span>
            {data.length > 2 && <span>{data[Math.floor(data.length / 2)].label}</span>}
            <span>{data[data.length - 1].label}</span>
          </>
        ) : <span>No data</span>}
      </div>
    </>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div style={{ padding: 32, textAlign: "center", color: "#94a3b8", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{message}</span>
    </div>
  );
}

// ─── Dashboard header (same as MSE) ──────────────────────────────────────────
function DashboardHeader({ userName, orgName, roleLabel, onExport }: {
  userName: string; orgName?: string; roleLabel: string; onExport: () => void;
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <div style={s.header}>
      <div>
        <p style={s.headerEyebrow}>{greeting}</p>
        <h1 style={s.headerTitle}>{userName || "Dashboard"}</h1>
        <p style={s.headerMeta}>{roleLabel}{orgName ? ` · ${orgName}` : ""}</p>
        <p style={s.headerDate}>{dateStr}</p>
      </div>
      <button type="button" style={s.headerBtn} onClick={onExport}>
        <Download size={15} /> Export
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function NGODashboardOverview() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { user: rbacUser } = useRBAC();
  const [isLoading, setIsLoading] = useState(false);

  const rawRole  = authUser?.role ?? "ORG_ADMIN";
  const role     = (rawRole === "SYSTEM_ADMIN" ? "ORG_ADMIN" : rawRole) as NGORole;
  const fullName = authUser?.fullName ?? rbacUser.fullName ?? "User";
  const orgName  = authUser?.organisationName ?? "Rwanda Health Foundation";

  const ROLE_LABEL: Record<NGORole, string> = {
    ACCOUNTANT:           "Finance Officer",
    AUDITOR:              "Auditor",
    ORG_ADMIN:            "Executive Director",
    DONOR_REPRESENTATIVE: "Donor Representative",
  };

  const txns  = NGO_TRANSACTIONS;
  const flags = NGO_FLAGS;

  // Derived metrics
  const totalTxns     = txns.length;
  const totalIncome   = txns.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpense  = txns.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const openFlags     = flags.filter((f) => f.status === "OPEN").length;
  const pendingTxns   = txns.filter((t) => t.status === "PENDING");
  const flaggedTxns   = txns.filter((t) => t.status === "FLAGGED");
  const completedTxns = txns.filter((t) => t.status === "COMPLETED");
  const completedPct  = totalTxns > 0 ? Math.round((completedTxns.length / totalTxns) * 100) : 0;
  const totalEvidence = txns.reduce((s, t) => s + t.evidenceCount, 0);
  const uniqueDonors  = new Set(txns.map((t) => t.donor)).size;
  const uniqueProjects = new Set(txns.map((t) => t.projectName)).size;
  const burnPct       = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;

  // Monthly bar chart data (group by month from date field)
  const monthlyTxns = txns.reduce<Record<string, number>>((acc, t) => {
    const m = t.date.slice(0, 7);
    acc[m] = (acc[m] ?? 0) + 1;
    return acc;
  }, {});
  const txByMonth = Object.entries(monthlyTxns).map(([label, count]) => ({ label, count }));

  const handleExport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Transactions", totalTxns],
      ["Total Income (RWF)", totalIncome],
      ["Total Expenses (RWF)", totalExpense],
      ["Open Flags", openFlags],
      ["Completed %", `${completedPct}%`],
      ["Total Evidence Files", totalEvidence],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "ngo-dashboard.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => { setIsLoading(true); setTimeout(() => setIsLoading(false), 800); };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <style>{RESPONSIVE}</style>
      <div className="ngo-db-shell">

        <DashboardHeader
          userName={fullName}
          orgName={orgName}
          roleLabel={ROLE_LABEL[role]}
          onExport={handleExport}
        />

        {/* 4 metric cards */}
        <div className="ngo-db-metrics-row">
          <MetricCard icon={<DollarSign size={18} />}  value={`RWF ${(totalIncome / 1_000_000).toFixed(1)}M`}  label="Total Grant Funding"  trend={`${burnPct}% utilised`} color="#1e3a8a" onClick={() => router.push("/ngo-dashboard/transactions")} />
          <MetricCard icon={<Users size={18} />}        value={uniqueDonors}                                     label="Active Donors"         trend={`${uniqueProjects} projects`} color="#2563eb" onClick={() => router.push("/ngo-dashboard/transactions")} />
          <MetricCard icon={<XCircle size={18} />}      value={pendingTxns.length}                               label="Pending Evidence"      trend="upload required" color="#dc2626" onClick={() => router.push("/ngo-dashboard/evidence")} />
          <MetricCard icon={<ShieldCheck size={18} />}  value={openFlags}                                        label="Open Audit Flags"      trend={openFlags > 0 ? "action needed" : "all clear"} color="#475569" onClick={() => router.push("/ngo-dashboard/review")} />
        </div>

        {/* Completion metric */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          <MetricCard icon={<BarChart3 size={18} />} value={`${completedPct}%`} label="Completed Transactions" trend={`${completedTxns.length} of ${totalTxns}`} color="#15803d" onClick={() => router.push("/ngo-dashboard/transactions")} />
        </div>

        {/* 3-column cards */}
        <div className="ngo-db-three-col">
          <CardShell title="Pending Evidence" count={`${pendingTxns.length} transactions`} onRefresh={handleRefresh}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {pendingTxns.slice(0, 5).map((t) => (
                <ListItem key={t.id} icon={<AlertTriangle size={16} />} iconBg="#fef2f2" iconColor="#dc2626" title={t.projectName} subtitle={`${t.donor} · RWF ${t.amount.toLocaleString()}`} rightLabel="Pending" rightColor="#d97706" onClick={() => router.push("/ngo-dashboard/evidence")} />
              ))}
              {pendingTxns.length === 0 && <EmptyState icon={<CheckCircle2 size={24} style={{ color: "#16a34a" }} />} message="All transactions have evidence" />}
            </div>
          </CardShell>

          <CardShell title="Flagged Transactions" count={`${flaggedTxns.length} flagged`} onRefresh={handleRefresh}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {flaggedTxns.slice(0, 5).map((t) => (
                <ListItem key={t.id} icon={<Copy size={16} />} iconBg="#fffbeb" iconColor="#d97706" title={t.projectName} subtitle={`${t.donor} · RWF ${t.amount.toLocaleString()}`} rightLabel="Flagged" rightColor="#d97706" onClick={() => router.push("/ngo-dashboard/review")} />
              ))}
              {flaggedTxns.length === 0 && <EmptyState icon={<CheckCircle2 size={24} style={{ color: "#16a34a" }} />} message="No flagged transactions" />}
            </div>
          </CardShell>

          <CardShell title="Recent Transactions" count={`${totalEvidence} evidence files`} onRefresh={handleRefresh}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {txns.slice(0, 5).map((t) => (
                <ListItem key={t.id} icon={<Paperclip size={16} />} iconBg="#f8fafc" iconColor="#475569" title={t.projectName} subtitle={`${t.donor} · ${t.budgetLine}`} rightLabel={t.status} rightColor={t.status === "COMPLETED" ? "#16a34a" : t.status === "FLAGGED" ? "#d97706" : "#94a3b8"} onClick={() => router.push("/ngo-dashboard/transactions")} />
              ))}
              {txns.length === 0 && <EmptyState icon={<FileText size={24} />} message="No transactions yet" />}
            </div>
          </CardShell>
        </div>

        {/* 2-column: status + bar chart */}
        <div className="ngo-db-two-col">
          <CardShell title="Transaction Status" onRefresh={handleRefresh}>
            <div style={{ fontSize: 40, fontWeight: 700, color: ACCENT, letterSpacing: "-1px", marginBottom: 16 }}>{completedPct}%</div>
            <SegmentedBar segments={[{ value: completedTxns.length, color: "#16a34a" }, { value: pendingTxns.length, color: "#94a3b8" }, { value: flaggedTxns.length, color: "#d97706" }]} />
            <CategoryRow dotColor="#16a34a" label="Completed (with evidence)" value={completedTxns.length} />
            <CategoryRow dotColor="#94a3b8" label="Pending (no evidence)"     value={pendingTxns.length} />
            <CategoryRow dotColor="#d97706" label="Flagged"                   value={flaggedTxns.length} />
            <CategoryRow dotColor="#dc2626" label="Open Audit Flags"          value={openFlags} />
          </CardShell>

          <CardShell title="Transactions by Month" onRefresh={handleRefresh}>
            {txByMonth.length > 0 ? <BarChart data={txByMonth} /> : <EmptyState icon={<BarChart3 size={24} />} message="No transaction data" />}
          </CardShell>
        </div>

        {/* 2-column: evidence breakdown */}
        <div className="ngo-db-two-col">
          <CardShell title="Evidence Coverage" onRefresh={handleRefresh}>
            <SegmentedBar segments={[{ value: totalEvidence, color: "#16a34a" }, { value: pendingTxns.length, color: "#dc2626" }]} />
            <CategoryRow dotColor="#16a34a" label="Evidence Files Attached"       value={totalEvidence} />
            <CategoryRow dotColor="#dc2626" label="Transactions Without Evidence" value={pendingTxns.length} />
            <CategoryRow dotColor="#d97706" label="Flagged Records"               value={flaggedTxns.length} />
            <CategoryRow dotColor="#64748b" label="Completion Rate"               value={`${completedPct}%`} />
          </CardShell>

          <CardShell title="Donor Funding Overview" onRefresh={handleRefresh}>
            {Array.from(new Set(txns.map((t) => t.donor))).map((donor) => {
              const donorTxns = txns.filter((t) => t.donor === donor);
              const income    = donorTxns.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
              const expense   = donorTxns.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
              return (
                <CategoryRow
                  key={donor}
                  dotColor="#1e3a8a"
                  label={`${donor} (${donorTxns.length} txns)`}
                  value={`RWF ${((income || expense) / 1_000_000).toFixed(1)}M`}
                />
              );
            })}
          </CardShell>
        </div>

      </div>

      {isLoading && (
        <div style={s.loadingOverlay}>
          <Loader2 size={40} style={{ color: ACCENT, animation: "spin 1s linear infinite" }} />
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "22px 24px" },
  headerEyebrow: { margin: 0, fontSize: 13, color: "#64748b", fontWeight: 500 },
  headerTitle:   { margin: "4px 0 0", fontSize: 24, fontWeight: 700, color: ACCENT, letterSpacing: "-0.4px" },
  headerMeta:    { margin: "6px 0 0", fontSize: 13, color: "#64748b" },
  headerDate:    { margin: "4px 0 0", fontSize: 12, color: "#94a3b8" },
  headerBtn: { display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: ACCENT, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
  metricCard: { background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #e2e8f0", transition: "border-color 0.2s, box-shadow 0.2s" },
  card: { background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #e2e8f0" },
  listItem: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, gap: 12, transition: "background 0.15s" },
  iconBtn: { width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  loadingOverlay: { position: "fixed", inset: 0, background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000 },
};

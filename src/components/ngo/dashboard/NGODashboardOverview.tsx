"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, ArrowUpRight, BarChart3, CheckCircle2, ChevronRight,
  Copy, Download, FileText, Loader2, Paperclip, RefreshCw, TrendingUp,
  XCircle, DollarSign, Users, ShieldCheck,
} from "lucide-react";
import { NGO_TRANSACTIONS, NGO_FLAGS } from "@/mock/ngo.mock";
import { useRBAC, useScopedData } from "@/context/RBACContext";
import { useAuth } from "@/context/AuthContext.production";
import type { NGORole } from "@/types/ngo";
import NGOActivityFeed from "@/components/ngo/dashboard/NGOActivityFeed";
import NGOQuickActions from "@/components/ngo/dashboard/NGOQuickActions";
import NGOComplianceScore from "@/components/ngo/dashboard/NGOComplianceScore";

const ACCENT = "#0f172a";
const CSS = `
  @keyframes ngo-spin { to { transform: rotate(360deg); } }
  .ngo-db { max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
  .ngo-metrics { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
  .ngo-three   { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .ngo-two     { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
  .ngo-bottom  { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  @media (max-width: 1100px) {
    .ngo-metrics { grid-template-columns: repeat(2,1fr); }
    .ngo-three   { grid-template-columns: repeat(2,1fr); }
    .ngo-bottom  { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 768px) {
    .ngo-metrics { grid-template-columns: repeat(2,1fr); gap: 12px; }
    .ngo-three   { grid-template-columns: 1fr; }
    .ngo-two     { grid-template-columns: 1fr; }
    .ngo-bottom  { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .ngo-metrics { grid-template-columns: 1fr; gap: 10px; }
  }
`;

// ─── Primitives ───────────────────────────────────────────────────────────────

function MetricCard({ icon, value, label, trend, color, onClick }: {
  icon: React.ReactNode; value: string | number; label: string;
  trend?: string; color: string; onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ background: "#fff", borderRadius: 14, padding: 20, border: `1px solid ${hov ? "#cbd5e1" : "#e2e8f0"}`, boxShadow: hov ? "0 4px 16px rgba(15,23,42,0.07)" : "0 1px 3px rgba(15,23,42,0.04)", transition: "all 0.2s", cursor: onClick ? "pointer" : "default" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "12", border: `1px solid ${color}22`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
          {icon}
        </div>
        {onClick && <ArrowUpRight size={15} style={{ color: "#94a3b8" }} />}
      </div>
      <div style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, color: ACCENT, letterSpacing: "-0.5px", lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</span>
        {trend && (
          <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", display: "inline-flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" }}>
            <TrendingUp size={10} />{trend}
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
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, gap: 12, transition: "background 0.15s", background: hov ? "#f8fafc" : "transparent", cursor: onClick ? "pointer" : "default" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor || "#64748b", flexShrink: 0 }}>{icon}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {rightLabel && <span style={{ padding: "3px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: `${rightColor}15`, color: rightColor, whiteSpace: "nowrap" }}>{rightLabel}</span>}
        {onClick && <ChevronRight size={14} style={{ color: "#94a3b8" }} />}
      </div>
    </div>
  );
}

function SegBar({ segments }: { segments: { value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div style={{ display: "flex", height: 10, borderRadius: 8, overflow: "hidden", gap: 3, marginBottom: 18, background: "#f1f5f9" }}>
      {segments.map((seg, i) => (
        <div key={i} style={{ flex: seg.value / total, background: seg.color, borderRadius: 4, minWidth: seg.value > 0 ? 8 : 0 }} />
      ))}
    </div>
  );
}

function CatRow({ dot, label, value }: { dot: string; label: string; value: string | number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{label}</span>
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{value}</span>
    </div>
  );
}

function Card({ title, count, children, onRefresh }: {
  title: string; count?: string | number; children: React.ReactNode; onRefresh?: () => void;
}) {
  const [spin, setSpin] = useState(false);
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: ACCENT }}>{title}</h3>
          {count !== undefined && <span style={{ fontSize: 12, color: "#94a3b8", marginTop: 3, display: "block" }}>{count}</span>}
        </div>
        {onRefresh && (
          <button style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            onClick={() => { setSpin(true); onRefresh(); setTimeout(() => setSpin(false), 700); }}>
            <RefreshCw size={14} style={{ color: "#94a3b8", animation: spin ? "ngo-spin 0.7s linear" : "none" }} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function BarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 90, padding: "6px 0" }}>
        {data.map((d, i) => (
          <div key={d.label} title={`${d.label}: ${d.count}`}
            style={{ flex: 1, background: i === data.length - 1 ? "#64748b" : "#cbd5e1", borderRadius: "4px 4px 0 0", height: `${Math.max((d.count / max) * 100, 8)}%`, minHeight: 5 }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
        {data.length > 0 && <><span>{data[0].label}</span>{data.length > 2 && <span>{data[Math.floor(data.length / 2)].label}</span>}<span>{data[data.length - 1].label}</span></>}
      </div>
    </>
  );
}

function Empty({ icon, msg }: { icon: React.ReactNode; msg: string }) {
  return (
    <div style={{ padding: "28px 16px", textAlign: "center", color: "#94a3b8", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{msg}</span>
    </div>
  );
}

// ─── Role-aware header ────────────────────────────────────────────────────────
const ROLE_META: Record<NGORole, { label: string; sub: string; color: string }> = {
  ACCOUNTANT:           { label: "Finance Officer",      sub: "Record transactions and upload supporting evidence.",          color: "#1e3a8a" },
  AUDITOR:              { label: "Auditor",              sub: "Review evidence, flag compliance issues, and track flags.",    color: "#15803d" },
  ORG_ADMIN:            { label: "Executive Director",   sub: "Organisation-wide overview of financial health and compliance.", color: "#7c3aed" },
  DONOR_REPRESENTATIVE: { label: "Donor Representative", sub: "Read-only view scoped to your donor's projects.",              color: "#d97706" },
};

function Header({ name, org, role, onExport }: { name: string; org: string; role: NGORole; onExport: () => void }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const meta = ROLE_META[role];
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #e2e8f0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
      <div>
        <p style={{ margin: 0, fontSize: 12.5, color: "#64748b" }}>{greeting} · {org}</p>
        <h1 style={{ margin: "4px 0 0", fontSize: "clamp(18px,3vw,24px)", fontWeight: 700, color: ACCENT, letterSpacing: "-0.4px" }}>{name}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
          <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, color: meta.color, background: meta.color + "12", border: `1px solid ${meta.color}22` }}>{meta.label}</span>
          <span style={{ fontSize: 12.5, color: "#64748b" }}>{meta.sub}</span>
        </div>
      </div>
      <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: ACCENT, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }} onClick={onExport}>
        <Download size={14} /> Export
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function NGODashboardOverview() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { user: rbacUser } = useRBAC();
  const [loading, setLoading] = useState(false);

  const rawRole  = authUser?.role ?? "ORG_ADMIN";
  const role     = (rawRole === "SYSTEM_ADMIN" ? "ORG_ADMIN" : rawRole) as NGORole;
  const fullName = authUser?.fullName ?? rbacUser.fullName ?? "User";
  const orgName  = authUser?.organisationName ?? "Rwanda Health Foundation";

  const allTxns = NGO_TRANSACTIONS;
  const scopedTxns = useScopedData(allTxns, (t) => t.donor);
  const flags   = NGO_FLAGS;

  const income   = scopedTxns.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expense  = scopedTxns.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const openFlags    = flags.filter((f) => f.status === "OPEN").length;
  const pending      = scopedTxns.filter((t) => t.status === "PENDING");
  const flagged      = scopedTxns.filter((t) => t.status === "FLAGGED");
  const completed    = scopedTxns.filter((t) => t.status === "COMPLETED");
  const completedPct = scopedTxns.length > 0 ? Math.round((completed.length / scopedTxns.length) * 100) : 0;
  const evidence     = scopedTxns.reduce((s, t) => s + t.evidenceCount, 0);
  const donors       = new Set(scopedTxns.map((t) => t.donor)).size;
  const projects     = new Set(scopedTxns.map((t) => t.projectName)).size;
  const burnPct      = income > 0 ? Math.round((expense / income) * 100) : 0;

  const txByMonth = Object.entries(
    scopedTxns.reduce<Record<string, number>>((acc, t) => { const m = t.date.slice(0, 7); acc[m] = (acc[m] ?? 0) + 1; return acc; }, {})
  ).map(([label, count]) => ({ label, count }));

  const handleExport = () => {
    const rows = [["Metric","Value"],["Total Income",income],["Total Expense",expense],["Open Flags",openFlags],["Completed %",`${completedPct}%`],["Evidence Files",evidence]];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "ngo-dashboard.csv"; a.click();
  };

  const refresh = () => { setLoading(true); setTimeout(() => setLoading(false), 700); };

  // Role-specific metric cards
  const metrics = (() => {
    if (role === "ACCOUNTANT") return [
      { icon: <DollarSign size={18} />, value: `RWF ${(income / 1_000_000).toFixed(1)}M`, label: "Total Grant Funding", trend: `${burnPct}% used`, color: "#1e3a8a", path: "/ngo-dashboard/transactions" },
      { icon: <XCircle size={18} />,    value: pending.length,                             label: "Pending Evidence",    trend: "upload required",  color: "#dc2626", path: "/ngo-dashboard/evidence"     },
      { icon: <FileText size={18} />,   value: evidence,                                   label: "Evidence Files",      trend: `${completed.length} verified`, color: "#2563eb", path: "/ngo-dashboard/evidence" },
      { icon: <Users size={18} />,      value: donors,                                     label: "Active Donors",       trend: `${projects} projects`, color: "#475569", path: "/ngo-dashboard/transactions" },
    ];
    if (role === "AUDITOR") return [
      { icon: <ShieldCheck size={18} />, value: openFlags,          label: "Open Audit Flags",    trend: openFlags > 0 ? "action needed" : "all clear", color: "#dc2626", path: "/ngo-dashboard/review"       },
      { icon: <XCircle size={18} />,     value: flagged.length,     label: "Flagged Transactions", trend: "requires review",  color: "#d97706", path: "/ngo-dashboard/review"       },
      { icon: <FileText size={18} />,    value: evidence,           label: "Evidence Files",       trend: `${completedPct}% coverage`, color: "#1e3a8a", path: "/ngo-dashboard/evidence" },
      { icon: <CheckCircle2 size={18} />,value: `${completedPct}%`, label: "Compliance Rate",      trend: `${completed.length} of ${scopedTxns.length}`, color: "#15803d", path: "/ngo-dashboard/review" },
    ];
    if (role === "DONOR_REPRESENTATIVE") return [
      { icon: <DollarSign size={18} />, value: `RWF ${(income / 1_000_000).toFixed(1)}M`, label: "Your Donor Funding", trend: `${burnPct}% utilised`, color: "#1e3a8a", path: "/ngo-dashboard/transactions" },
      { icon: <FileText size={18} />,   value: evidence,                                   label: "Evidence Files",    trend: `${completed.length} verified`, color: "#2563eb", path: "/ngo-dashboard/evidence" },
      { icon: <CheckCircle2 size={18} />,value: `${completedPct}%`, label: "Compliance Rate",     trend: `${completed.length} of ${scopedTxns.length}`, color: "#15803d", path: "/ngo-dashboard/transactions" },
    ];
    // ORG_ADMIN
    return [
      { icon: <DollarSign size={18} />,  value: `RWF ${(income / 1_000_000).toFixed(1)}M`, label: "Total Grant Funding",  trend: `${burnPct}% utilised`, color: "#1e3a8a", path: "/ngo-dashboard/transactions" },
      { icon: <Users size={18} />,       value: donors,                                     label: "Active Donors",        trend: `${projects} projects`, color: "#2563eb", path: "/ngo-dashboard/transactions" },
      { icon: <ShieldCheck size={18} />, value: openFlags,                                  label: "Open Audit Flags",     trend: openFlags > 0 ? "action needed" : "all clear", color: "#dc2626", path: "/ngo-dashboard/review" },
      { icon: <CheckCircle2 size={18} />,value: `${completedPct}%`,                         label: "Compliance Rate",      trend: `${completed.length} of ${scopedTxns.length}`, color: "#15803d", path: "/ngo-dashboard/review" },
    ];
  })();

  return (
    <div>
      <style>{CSS}</style>
      <div className="ngo-db">

        <Header name={fullName} org={orgName} role={role} onExport={handleExport} />

        {/* Metric cards */}
        <div className="ngo-metrics">
          {metrics.map((m) => (
            <MetricCard key={m.label} icon={m.icon} value={m.value} label={m.label} trend={m.trend} color={m.color} onClick={() => router.push(m.path)} />
          ))}
        </div>

        {/* 3-col cards */}
        <div className="ngo-three">
          <Card title="Pending Evidence" count={`${pending.length} transactions`} onRefresh={refresh}>
            {pending.length === 0
              ? <Empty icon={<CheckCircle2 size={22} style={{ color: "#16a34a" }} />} msg="All transactions have evidence" />
              : pending.slice(0, 5).map((t) => (
                  <ListItem key={t.id} icon={<AlertTriangle size={15} />} iconBg="#fef2f2" iconColor="#dc2626" title={t.projectName} subtitle={`${t.donor} · RWF ${t.amount.toLocaleString()}`} rightLabel="Pending" rightColor="#d97706" onClick={() => router.push("/ngo-dashboard/evidence")} />
                ))}
          </Card>

          <Card title="Flagged Transactions" count={`${flagged.length} flagged`} onRefresh={refresh}>
            {flagged.length === 0
              ? <Empty icon={<CheckCircle2 size={22} style={{ color: "#16a34a" }} />} msg="No flagged transactions" />
              : flagged.slice(0, 5).map((t) => (
                  <ListItem key={t.id} icon={<Copy size={15} />} iconBg="#fffbeb" iconColor="#d97706" title={t.projectName} subtitle={`${t.donor} · RWF ${t.amount.toLocaleString()}`} rightLabel="Flagged" rightColor="#d97706" onClick={() => router.push("/ngo-dashboard/review")} />
                ))}
          </Card>

          <Card title="Recent Transactions" count={`${evidence} evidence files`} onRefresh={refresh}>
            {scopedTxns.length === 0
              ? <Empty icon={<FileText size={22} />} msg="No transactions yet" />
              : scopedTxns.slice(0, 5).map((t) => (
                  <ListItem key={t.id} icon={<Paperclip size={15} />} iconBg="#f8fafc" iconColor="#475569" title={t.projectName} subtitle={`${t.donor} · ${t.budgetLine}`} rightLabel={t.status} rightColor={t.status === "COMPLETED" ? "#16a34a" : t.status === "FLAGGED" ? "#d97706" : "#94a3b8"} onClick={() => router.push("/ngo-dashboard/transactions")} />
                ))}
          </Card>
        </div>

        {/* 2-col: status + chart */}
        <div className="ngo-two">
          <Card title="Transaction Status" onRefresh={refresh}>
            <div style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: ACCENT, letterSpacing: "-1px", marginBottom: 14 }}>{completedPct}%</div>
            <SegBar segments={[{ value: completed.length, color: "#16a34a" }, { value: pending.length, color: "#94a3b8" }, { value: flagged.length, color: "#d97706" }]} />
            <CatRow dot="#16a34a" label="Completed (with evidence)" value={completed.length} />
            <CatRow dot="#94a3b8" label="Pending (no evidence)"     value={pending.length} />
            <CatRow dot="#d97706" label="Flagged"                   value={flagged.length} />
            <CatRow dot="#dc2626" label="Open Audit Flags"          value={openFlags} />
          </Card>
          <Card title="Transactions by Month" onRefresh={refresh}>
            {txByMonth.length > 0 ? <BarChart data={txByMonth} /> : <Empty icon={<BarChart3 size={22} />} msg="No transaction data" />}
          </Card>
        </div>

        {/* 2-col: evidence + donors */}
        <div className="ngo-two">
          <Card title="Evidence Coverage" onRefresh={refresh}>
            <SegBar segments={[{ value: evidence, color: "#16a34a" }, { value: pending.length, color: "#dc2626" }]} />
            <CatRow dot="#16a34a" label="Evidence Files Attached"       value={evidence} />
            <CatRow dot="#dc2626" label="Transactions Without Evidence" value={pending.length} />
            <CatRow dot="#d97706" label="Flagged Records"               value={flagged.length} />
            <CatRow dot="#64748b" label="Completion Rate"               value={`${completedPct}%`} />
          </Card>
          <Card title="Donor Funding Overview" onRefresh={refresh}>
            {Array.from(new Set(scopedTxns.map((t) => t.donor))).map((donor) => {
              const dt = scopedTxns.filter((t) => t.donor === donor);
              const amt = dt.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0) || dt.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
              return <CatRow key={donor} dot="#1e3a8a" label={`${donor} (${dt.length} txns)`} value={`RWF ${(amt / 1_000_000).toFixed(1)}M`} />;
            })}
          </Card>
        </div>

        {/* Bottom: compliance + quick actions + activity */}
        <div className="ngo-bottom">
          <NGOComplianceScore />
          <NGOQuickActions />
          <NGOActivityFeed />
        </div>

      </div>

      {loading && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000 }}>
          <Loader2 size={36} style={{ color: ACCENT, animation: "ngo-spin 1s linear infinite" }} />
        </div>
      )}
    </div>
  );
}

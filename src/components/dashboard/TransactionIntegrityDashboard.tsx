"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  FileText,
  FolderOpen,
  Loader2,
  MoreHorizontal,
  Paperclip,
  RefreshCw,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { exportDashboardCSV } from "@/utils/export";
import {
  computeTransactionMetrics,
  enrichTransactions,
  findDuplicateIds,
  groupEvidenceByMonth,
  groupTransactionsByMonth,
  formatMonthLabel,
} from "@/lib/transactionMetrics";

const ACCENT = "#0f172a";
const CHART_BAR = "#cbd5e1";
const CHART_BAR_ACTIVE = "#64748b";

interface Props {
  transactions: (Transaction & { evidenceCount?: number; isDuplicate?: boolean })[];
  evidence: Evidence[];
  user: { fullName?: string; email?: string; organisationName?: string } | null;
  roleLabel: string;
}

function DashboardHeader({
  userName,
  userEmail,
  orgName,
  roleLabel,
  onExport,
}: {
  userName: string;
  userEmail: string;
  orgName?: string;
  roleLabel: string;
  onExport: () => void;
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={dashboardHeader}>
      <div>
        <p style={headerEyebrow}>{greeting}</p>
        <h1 style={headerTitle}>{userName || "Dashboard"}</h1>
        <p style={headerMeta}>
          {roleLabel}
          {orgName ? ` · ${orgName}` : ""}
          {" · "}
          {userEmail}
        </p>
        <p style={headerDate}>{dateStr}</p>
      </div>
      <button type="button" style={headerActionBtn} onClick={onExport}>
        <Download size={15} />
        Export
      </button>
    </div>
  );
}

function MetricCard({
  icon,
  value,
  label,
  trend,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: string;
  color: string;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...metricCard,
        borderColor: isHovered ? "#cbd5e1" : "#e2e8f0",
        boxShadow: isHovered ? "0 4px 16px rgba(15,23,42,0.06)" : "none",
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "#f8fafc", border: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "center", color,
        }}>
          {icon}
        </div>
        {onClick && <ArrowUpRight size={15} style={{ color: "#94a3b8" }} />}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: ACCENT, letterSpacing: "-0.5px", lineHeight: 1, marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</span>
        {trend && (
          <span style={{
            padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
            background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0",
            display: "inline-flex", alignItems: "center", gap: 3, whiteSpace: "nowrap",
          }}>
            <TrendingUp size={11} />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function ListItem({
  icon, iconBg, iconColor, title, subtitle, rightLabel, rightColor, onClick,
}: {
  icon: React.ReactNode; iconBg: string; iconColor?: string;
  title: string; subtitle: string;
  rightLabel?: string; rightColor?: string; onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      style={{ ...listItemRow, background: isHovered ? "#f8fafc" : "transparent", cursor: onClick ? "pointer" : "default" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {rightLabel && (
          <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: `${rightColor}15`, color: rightColor, whiteSpace: "nowrap" }}>
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
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor }} />
        <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{label}</span>
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{value}</span>
    </div>
  );
}

function CardShell({ title, count, children, onRefresh }: {
  title: string; count?: string | number; children: React.ReactNode; onRefresh?: () => void;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh();
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  return (
    <div style={cardShell}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #f1f5f9" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: ACCENT }}>{title}</h3>
          {count !== undefined && <span style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, display: "block" }}>{count}</span>}
        </div>
        {onRefresh && (
          <button style={iconButton} onClick={handleRefresh} title="Refresh">
            <RefreshCw size={16} style={{ animation: isRefreshing ? "spin 0.8s linear" : "none", color: "#94a3b8" }} />
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
          <div
            key={d.label}
            title={`${d.label}: ${d.count}`}
            style={{
              flex: 1,
              background: i === data.length - 1 ? CHART_BAR_ACTIVE : CHART_BAR,
              borderRadius: "4px 4px 0 0",
              height: `${Math.max((d.count / max) * 100, 8)}%`,
              minHeight: 6,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
        {data.length > 0 ? (
          <>
            <span>{formatMonthLabel(data[0].label)}</span>
            {data.length > 2 && <span>{formatMonthLabel(data[Math.floor(data.length / 2)].label)}</span>}
            <span>{formatMonthLabel(data[data.length - 1].label)}</span>
          </>
        ) : (
          <span>No data</span>
        )}
      </div>
    </>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div style={{ padding: 32, textAlign: "center", color: "#94a3b8", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{message}</span>
    </div>
  );
}

export function TransactionIntegrityDashboard({ transactions, evidence, user, roleLabel }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const metrics = computeTransactionMetrics(transactions, evidence);
  const enriched = enrichTransactions(transactions, evidence);
  const dupes = findDuplicateIds(enriched);
  const missingTxns = enriched.filter((t) => (t.evidenceCount ?? 0) === 0);
  const duplicateTxns = enriched.filter((t) => dupes.has(t.id));
  const txByMonth = groupTransactionsByMonth(transactions);
  const evByMonth = groupEvidenceByMonth(evidence);

  const handleExport = () => {
    exportDashboardCSV({
      role: roleLabel,
      userName: user?.fullName ?? "",
      orgName: user?.organisationName,
      metrics: [
        { label: "Transactions with No Evidence", value: metrics.noEvidence },
        { label: "Duplicate Transactions", value: metrics.duplicateTransactions },
        { label: "Total Transactions", value: metrics.totalTransactions },
        { label: "Total Evidence Files", value: metrics.totalEvidence },
        { label: "Completed Transactions %", value: `${metrics.completedPercent}%` },
      ],
      tables: [
        {
          title: "Transactions Missing Evidence",
          headers: ["ID", "Name", "Counterparty", "Amount", "Date"],
          rows: missingTxns.map((t) => [t.id, t.name, t.counterparty, t.amount, t.date]),
        },
        {
          title: "Duplicate Transactions",
          headers: ["ID", "Name", "Counterparty", "Amount", "Date"],
          rows: duplicateTxns.map((t) => [t.id, t.name, t.counterparty, t.amount, t.date]),
        },
      ],
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div style={pageBg}>
      <div style={dashboardShell}>
        <DashboardHeader
          userName={user?.fullName ?? ""}
          userEmail={user?.email ?? ""}
          orgName={user?.organisationName}
          roleLabel={roleLabel}
          onExport={handleExport}
        />

        <div style={metricsRow}>
          <MetricCard
            icon={<XCircle size={18} />}
            value={metrics.noEvidence}
            label="Transactions with No Evidence"
            trend={`${metrics.pending} pending`}
            color="#dc2626"
            onClick={() => router.push("/transactions")}
          />
          <MetricCard
            icon={<Copy size={18} />}
            value={metrics.duplicateTransactions}
            label="Duplicate Transactions"
            color="#d97706"
            onClick={() => router.push("/transactions")}
          />
          <MetricCard
            icon={<Briefcase size={18} />}
            value={metrics.totalTransactions}
            label="Total Transactions"
            color="#475569"
            onClick={() => router.push("/transactions")}
          />
          <MetricCard
            icon={<FolderOpen size={18} />}
            value={metrics.totalEvidence}
            label="Total Evidence Files"
            color="#475569"
            onClick={() => router.push("/evidence")}
          />
        </div>

        <div style={{ ...metricsRow, gridTemplateColumns: "1fr" }}>
          <MetricCard
            icon={<BarChart3 size={18} />}
            value={`${metrics.completedPercent}%`}
            label="Completed Transactions"
            trend={`${metrics.completed} of ${metrics.totalTransactions}`}
            color="#15803d"
            onClick={() => router.push("/transactions")}
          />
        </div>

        <div style={threeColGrid}>
          <CardShell title="Missing Evidence" count={`${missingTxns.length} transactions`} onRefresh={handleRefresh}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {missingTxns.slice(0, 5).map((t) => (
                <ListItem
                  key={t.id}
                  icon={<AlertTriangle size={16} />}
                  iconBg="#fef2f2"
                  iconColor="#dc2626"
                  title={t.name}
                  subtitle={`${t.counterparty} · RWF ${t.amount.toLocaleString()}`}
                  rightLabel="Pending"
                  rightColor="#d97706"
                  onClick={() => router.push(`/transactions?transactionId=${t.id}`)}
                />
              ))}
              {missingTxns.length === 0 && (
                <EmptyState icon={<CheckCircle2 size={24} style={{ color: "#16a34a" }} />} message="All transactions have evidence" />
              )}
            </div>
          </CardShell>

          <CardShell title="Duplicate Transactions" count={`${duplicateTxns.length} flagged`} onRefresh={handleRefresh}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {duplicateTxns.slice(0, 5).map((t) => (
                <ListItem
                  key={t.id}
                  icon={<Copy size={16} />}
                  iconBg="#fffbeb"
                  iconColor="#d97706"
                  title={t.name}
                  subtitle={`${t.counterparty} · RWF ${t.amount.toLocaleString()}`}
                  rightLabel="Duplicate"
                  rightColor="#d97706"
                  onClick={() => router.push(`/transactions?transactionId=${t.id}`)}
                />
              ))}
              {duplicateTxns.length === 0 && (
                <EmptyState icon={<CheckCircle2 size={24} style={{ color: "#16a34a" }} />} message="No duplicate transactions" />
              )}
            </div>
          </CardShell>

          <CardShell title="Recent Evidence" count={`${evidence.length} files`} onRefresh={handleRefresh}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {evidence.slice(0, 5).map((e) => (
                <ListItem
                  key={e.id}
                  icon={<Paperclip size={16} />}
                  iconBg="#f8fafc"
                  iconColor="#475569"
                  title={e.documentName}
                  subtitle={`${e.transactionId} · ${e.counterparty ?? ""}`}
                  rightLabel={e.status ?? "Pending"}
                  rightColor={e.status === "Verified" ? "#16a34a" : "#d97706"}
                  onClick={() => router.push("/evidence")}
                />
              ))}
              {evidence.length === 0 && (
                <EmptyState icon={<FileText size={24} />} message="No evidence uploaded yet" />
              )}
            </div>
          </CardShell>
        </div>

        <div style={twoColGrid}>
          <CardShell title="Transaction Status" onRefresh={handleRefresh}>
            <div style={{ fontSize: 40, fontWeight: 700, color: ACCENT, letterSpacing: "-1px", marginBottom: 16 }}>
              {metrics.completedPercent}%
            </div>
            <SegmentedBar segments={[
              { value: metrics.completed, color: "#16a34a" },
              { value: metrics.pending, color: "#94a3b8" },
            ]} />
            <CategoryRow dotColor="#16a34a" label="Completed (with evidence)" value={metrics.completed} />
            <CategoryRow dotColor="#94a3b8" label="Pending (no evidence)" value={metrics.pending} />
            <CategoryRow dotColor="#dc2626" label="Missing Evidence" value={metrics.noEvidence} />
            <CategoryRow dotColor="#d97706" label="Duplicates" value={metrics.duplicateTransactions} />
          </CardShell>

          <CardShell title="Transactions by Month" onRefresh={handleRefresh}>
            {txByMonth.length > 0 ? (
              <BarChart data={txByMonth} />
            ) : (
              <EmptyState icon={<BarChart3 size={24} />} message="No transaction data" />
            )}
          </CardShell>
        </div>

        <div style={twoColGrid}>
          <CardShell title="Evidence Attachments by Month" onRefresh={handleRefresh}>
            {evByMonth.length > 0 ? (
              <BarChart data={evByMonth} />
            ) : (
              <EmptyState icon={<Paperclip size={24} />} message="No evidence uploads yet" />
            )}
          </CardShell>

          <CardShell title="Evidence vs Missing" onRefresh={handleRefresh}>
            <SegmentedBar segments={[
              { value: metrics.totalEvidence, color: "#16a34a" },
              { value: metrics.noEvidence, color: "#dc2626" },
            ]} />
            <CategoryRow dotColor="#16a34a" label="Evidence Files Attached" value={metrics.totalEvidence} />
            <CategoryRow dotColor="#dc2626" label="Transactions Without Evidence" value={metrics.noEvidence} />
            <CategoryRow dotColor="#d97706" label="Duplicate Transaction Pairs" value={Math.floor(metrics.duplicateTransactions / 2)} />
            <CategoryRow dotColor="#64748b" label="Completion Rate" value={`${metrics.completedPercent}%`} />
          </CardShell>
        </div>

        {isLoading && (
          <div style={loadingOverlay}>
            <Loader2 size={40} style={{ color: ACCENT, animation: "spin 1s linear infinite" }} />
          </div>
        )}
      </div>
    </div>
  );
}

const pageBg: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f1f5f9",
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};

const dashboardShell: React.CSSProperties = {
  maxWidth: 1400,
  margin: "0 auto",
  padding: "28px 28px 40px",
  display: "flex",
  flexDirection: "column",
  gap: 24,
};

const dashboardHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 20,
  flexWrap: "wrap",
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: "22px 24px",
};

const headerEyebrow: React.CSSProperties = { margin: 0, fontSize: 13, color: "#64748b", fontWeight: 500 };
const headerTitle: React.CSSProperties = { margin: "4px 0 0", fontSize: 24, fontWeight: 700, color: ACCENT, letterSpacing: "-0.4px" };
const headerMeta: React.CSSProperties = { margin: "6px 0 0", fontSize: 13, color: "#64748b" };
const headerDate: React.CSSProperties = { margin: "4px 0 0", fontSize: 12, color: "#94a3b8" };
const headerActionBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px",
  borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff",
  color: ACCENT, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
};

const loadingOverlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(255,255,255,0.85)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000,
};

const iconButton: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0",
  background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
};

const metricsRow: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 };
const metricCard: React.CSSProperties = {
  background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #e2e8f0",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};
const threeColGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 };
const twoColGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 };
const cardShell: React.CSSProperties = { background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #e2e8f0" };
const listItemRow: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "10px 12px", borderRadius: 10, gap: 12, transition: "background 0.15s ease",
};

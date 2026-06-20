"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/security/access-control";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/hooks/useDashboardData";
import { MOCK_REVIEW_QUEUE } from "@/mock/reviewQueue.mock";
import { exportDashboardCSV } from "@/utils/export";
import {
  ArrowUpRight,
  RefreshCw,
  MoreHorizontal,
  Briefcase,
  AlertTriangle,
  BarChart3,
  FolderOpen,
  Paperclip,
  BookOpen,
  CheckCircle2,
  Search,
  AlertOctagon,
  FileText,
  Download,
  XCircle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Loader2,
} from "lucide-react";

const ACCENT = "#0f172a";
const CHART_BAR = "#cbd5e1";
const CHART_BAR_ACTIVE = "#64748b";

/* ══════════════════════════════════════════════════════════
   PAGE HEADER
   ══════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════
   METRIC CARD
   ══════════════════════════════════════════════════════════ */
function MetricCard({ icon, value, label, trend, trendUp, color, onClick }: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: string;
  trendUp?: boolean;
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
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
        }}>
          {icon}
        </div>
        {onClick && <ArrowUpRight size={15} style={{ color: "#94a3b8", flexShrink: 0 }} />}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: ACCENT, letterSpacing: "-0.5px", lineHeight: 1, marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</span>
        {trend && (
          <span style={{
            padding: "2px 8px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            background: "#f8fafc",
            color: trendUp ? "#15803d" : "#64748b",
            border: "1px solid #e2e8f0",
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            whiteSpace: "nowrap",
          }}>
            {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LIST ITEM
   ══════════════════════════════════════════════════════════ */
function ListItem({ icon, iconBg, iconColor, title, subtitle, rightLabel, rightColor, onClick }: {
  icon: React.ReactNode; 
  iconBg: string; 
  iconColor?: string; 
  title: string; 
  subtitle: string;
  rightLabel?: string; 
  rightColor?: string;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      style={{
        ...listItemRow,
        background: isHovered ? "#f8fafc" : "transparent",
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
        <div style={{ 
          width: 38, 
          height: 38, 
          borderRadius: 10, 
          background: iconBg, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          color: iconColor || "#64748b", 
          flexShrink: 0 
        }}>
          {icon}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ 
            fontSize: 14, 
            fontWeight: 600, 
            color: "#0f172a", 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis" 
          }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            {subtitle}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {rightLabel && (
          <span style={{
            padding: "4px 12px", 
            borderRadius: 999, 
            fontSize: 11, 
            fontWeight: 600,
            background: `${rightColor}15`, 
            color: rightColor, 
            whiteSpace: "nowrap",
          }}>
            {rightLabel}
          </span>
        )}
        {onClick && (
          <ChevronRight size={16} style={{ color: "#94a3b8" }} />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SEGMENTED BAR
   ══════════════════════════════════════════════════════════ */
function SegmentedBar({ segments }: { segments: { value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  return (
    <div style={{ display: "flex", height: 12, borderRadius: 8, overflow: "hidden", gap: 4, marginBottom: 20, background: "#f1f5f9" }}>
      {segments.map((seg, i) => (
        <div 
          key={i} 
          style={{ 
            flex: seg.value, 
            background: seg.color, 
            borderRadius: 4, 
            minWidth: seg.value > 0 ? 12 : 0,
            transition: "all 0.3s ease"
          }} 
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CATEGORY ROW
   ══════════════════════════════════════════════════════════ */
function CategoryRow({ dotColor, label, value }: { dotColor: string; label: string; value: string | number }) {
  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      padding: "10px 0", 
      borderBottom: "1px solid #f1f5f9" 
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor }} />
        <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{label}</span>
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{value}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CARD SHELL
   ═════════════════════════════════════════════════════════ */
function CardShell({ title, count, children, onRefresh, onMore, style }: { 
  title: string; 
  count?: string | number; 
  children: React.ReactNode; 
  onRefresh?: () => void;
  onMore?: () => void;
  style?: React.CSSProperties 
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
    <div style={{ ...cardShell, ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #f1f5f9" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: ACCENT }}>{title}</h3>
          {count !== undefined && (
            <span style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, display: "block" }}>
              {count}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {onRefresh && (
            <button 
              style={iconButton}
              onClick={handleRefresh}
              title="Refresh"
            >
              <RefreshCw size={16} style={{ 
                animation: isRefreshing ? "spin 0.8s linear" : "none",
                color: "#94a3b8"
              }} />
            </button>
          )}
          {onMore && (
            <button 
              style={iconButton}
              onClick={onMore}
              title="More options"
            >
              <MoreHorizontal size={16} style={{ color: "#94a3b8" }} />
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EMPTY STATE
   ══════════════════════════════════════════════════════════ */
function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div style={{ 
      padding: 32, 
      textAlign: "center", 
      color: "#94a3b8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12
    }}>
      <div style={{ 
        width: 56, 
        height: 56, 
        borderRadius: "50%", 
        background: "#f1f5f9", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{message}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CLIENT DASHBOARD
   ═════════════════════════════════════════════════════════ */
function ClientDashboard({ transactions, evidence, user }: { transactions: any[]; evidence: any[]; user: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const highRisk = transactions.filter((t) => (t.riskScore ?? 0) >= 80 || t.evidenceStatus === "MISSING").length;
  const coverage = transactions.length > 0
    ? Math.round((transactions.filter((t) => t.evidenceStatus === "COMPLETE").length / transactions.length) * 100)
    : 0;
  const pending = transactions.filter((t) => t.status === "PENDING" || t.status === "PENDING_APPROVAL" || t.status === "FLAGGED").length;
  const verified = evidence.filter((e) => e.status === "Verified").length;
  const activityBars = [42, 55, 38, 62, 48, 70, 58, 65, 52, 74, 60, 68, 55, 72];

  const handleExport = () => {
    exportDashboardCSV({
      role: "Organisation Admin",
      userName: user?.fullName ?? "",
      orgName: user?.organisationName,
      metrics: [
        { label: "Total Transactions", value: transactions.length },
        { label: "High Risk Items", value: highRisk },
        { label: "Evidence Coverage", value: `${coverage}%` },
        { label: "Evidence Files", value: evidence.length },
      ],
      tables: [{
        title: "High Risk Transactions",
        headers: ["ID", "Name", "Counterparty", "Evidence Status", "Risk Score"],
        rows: transactions
          .filter((t) => (t.riskScore ?? 0) >= 80 || t.evidenceStatus === "MISSING")
          .map((t) => [t.id, t.name, t.counterparty, t.evidenceStatus, t.riskScore ?? ""]),
      }],
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
          roleLabel="Organisation Admin"
          onExport={handleExport}
        />

        <div style={metricsRow}>
          <MetricCard
            icon={<Briefcase size={18} />}
            value={transactions.length}
            label="Total Transactions"
            color="#475569"
            onClick={() => router.push("/transactions")}
          />
          <MetricCard
            icon={<AlertTriangle size={18} />}
            value={highRisk}
            label="High Risk Items"
            trend={`${highRisk} flagged`}
            trendUp={false}
            color="#dc2626"
            onClick={() => router.push("/transactions")}
          />
          <MetricCard
            icon={<BarChart3 size={18} />}
            value={`${coverage}%`}
            label="Evidence Coverage"
            color="#15803d"
            onClick={() => router.push("/evidence")}
          />
          <MetricCard
            icon={<FolderOpen size={18} />}
            value={evidence.length}
            label="Evidence Files"
            color="#475569"
            onClick={() => router.push("/evidence")}
          />
        </div>

      {/* MIDDLE 3-COLUMN GRID */}
      <div style={threeColGrid}>
        {/* LEFT: High Risk Transactions */}
        <CardShell 
          title="High Risk Transactions" 
          count={`${highRisk} Items`}
          onRefresh={handleRefresh}
          onMore={() => console.log("More options")}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {transactions.filter((t) => (t.riskScore ?? 0) >= 80 || t.evidenceStatus === "MISSING").slice(0, 5).map((t, i) => (
              <ListItem 
                key={i} 
                icon={<AlertTriangle size={16} />} 
                iconBg="#fef2f2" 
                iconColor="#dc2626" 
                title={t.name || t.id}
                subtitle={t.counterparty || "No counterparty"}
                rightLabel="High Risk"
                rightColor="#dc2626"
                onClick={() => router.push("/transactions")}
              />
            ))}
            {highRisk === 0 && (
              <EmptyState 
                icon={<CheckCircle2 size={24} style={{ color: "#16a34a" }} />} 
                message="No high risk items"
              />
            )}
          </div>
        </CardShell>

        {/* CENTER: Recent Evidence */}
        <CardShell 
          title="Recent Evidence" 
          count={`${evidence.length} Files`}
          onRefresh={handleRefresh}
          onMore={() => console.log("More options")}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {evidence.slice(0, 5).map((e, i) => (
              <ListItem 
                key={i} 
                icon={<Paperclip size={16} />} 
                iconBg="#f8fafc"
                iconColor="#475569" 
                title={e.documentName || e.name || e.id}
                subtitle={e.category || "Document"}
                rightLabel={e.status || "Pending"}
                rightColor={e.status === "Verified" ? "#16a34a" : "#d97706"}
                onClick={() => router.push("/evidence")}
              />
            ))}
            {evidence.length === 0 && (
              <EmptyState 
                icon={<FolderOpen size={24} />} 
                message="No evidence uploaded yet"
              />
            )}
          </div>
        </CardShell>

        {/* RIGHT: Compliance Status */}
        <CardShell 
          title="Compliance Status"
          onRefresh={handleRefresh}
          onMore={() => console.log("More options")}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Total Transactions</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{transactions.length}</span>
          </div>
          <SegmentedBar segments={[
            { value: transactions.length - highRisk - pending, color: "#16a34a" },
            { value: pending, color: "#94a3b8" },
            { value: highRisk, color: "#dc2626" },
          ]} />
          <CategoryRow dotColor="#16a34a" label="Complete" value={transactions.length - highRisk - pending} />
          <CategoryRow dotColor="#94a3b8" label="In Progress" value={pending} />
          <CategoryRow dotColor="#dc2626" label="High Risk" value={highRisk} />
          <CategoryRow dotColor="#64748b" label="Evidence Verified" value={verified} />
          <CategoryRow dotColor="#cbd5e1" label="Missing Evidence Txns" value={transactions.filter((t) => t.evidenceStatus === "MISSING").length} />
        </CardShell>
      </div>

      {/* BOTTOM 2-COLUMN GRID */}
      <div style={twoColGrid}>
        <CardShell 
          title="Evidence Coverage KPI"
          onRefresh={handleRefresh}
        >
          <div style={{ fontSize: 40, fontWeight: 700, color: ACCENT, letterSpacing: "-1px", marginBottom: 16 }}>
            {coverage}%
          </div>
          <div style={{ height: 8, background: "#f1f5f9", borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
            <div style={{
              height: "100%",
              width: `${coverage}%`,
              background: ACCENT,
              borderRadius: 6,
              transition: "width 0.8s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </CardShell>

        <CardShell 
          title="Transaction Overview"
          onRefresh={handleRefresh}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100, padding: "8px 0" }}>
            {activityBars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: i === activityBars.length - 1 ? CHART_BAR_ACTIVE : CHART_BAR,
                  borderRadius: "4px 4px 0 0",
                  height: `${h}%`,
                  minHeight: 6,
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
            <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span>
          </div>
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

/* ══════════════════════════════════════════════════════════
   MEMBER DASHBOARD
   ══════════════════════════════════════════════════════════ */
function MemberDashboard({ transactions, evidence, user }: { transactions: any[]; evidence: any[]; user: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const openReviewItems = MOCK_REVIEW_QUEUE.filter(
    (item) => item.status === "Open" || item.status === "In Review"
  );
  const missingEvidenceTxns = transactions.filter((t) => t.evidenceStatus === "MISSING");
  const partialEvidenceTxns = transactions.filter((t) => t.evidenceStatus === "PARTIAL");
  const needsEvidence = [...missingEvidenceTxns, ...partialEvidenceTxns];
  const pendingEvidence = evidence.filter((e) => e.status === "Pending").length;
  const verifiedEvidence = evidence.filter((e) => e.status === "Verified").length;
  const draftsToComplete = transactions.filter(
    (t) => t.status === "PENDING" || t.status === "PENDING_APPROVAL" || t.status === "FLAGGED"
  ).length;
  const coverage = transactions.length > 0
    ? Math.round((transactions.filter((t) => t.evidenceStatus === "COMPLETE").length / transactions.length) * 100)
    : 0;
  const uploadActivity = [35, 42, 28, 55, 48, 62, 58, 70, 45, 52, 68, 74, 60, 80];

  const handleExport = () => {
    exportDashboardCSV({
      role: "Accountant",
      userName: user?.fullName ?? "",
      orgName: user?.organisationName,
      metrics: [
        { label: "Open Review Items", value: openReviewItems.length },
        { label: "Needs Evidence", value: needsEvidence.length },
        { label: "Transactions In Progress", value: draftsToComplete },
        { label: "Evidence Coverage", value: `${coverage}%` },
      ],
      tables: [
        {
          title: "My Action Items",
          headers: ["Type", "Transaction", "Counterparty", "Status", "Risk"],
          rows: openReviewItems.map((item) => [
            item.type,
            item.transactionId,
            item.counterparty,
            item.status,
            item.risk,
          ]),
        },
        {
          title: "Transactions Needing Evidence",
          headers: ["ID", "Name", "Counterparty", "Evidence Status"],
          rows: needsEvidence.map((t) => [t.id, t.name, t.counterparty, t.evidenceStatus]),
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
          roleLabel="Accountant"
          onExport={handleExport}
        />

        <div style={metricsRow}>
          <MetricCard
            icon={<AlertOctagon size={18} />}
            value={openReviewItems.length}
            label="Open Review Items"
            trend={`${openReviewItems.filter((i) => i.risk === "Critical").length} critical`}
            trendUp={false}
            color="#dc2626"
            onClick={() => router.push("/review-queue")}
          />
          <MetricCard
            icon={<XCircle size={18} />}
            value={needsEvidence.length}
            label="Needs Evidence"
            trend={`${missingEvidenceTxns.length} missing`}
            trendUp={false}
            color="#475569"
            onClick={() => router.push("/evidence")}
          />
          <MetricCard
            icon={<BookOpen size={18} />}
            value={draftsToComplete}
            label="In Progress"
            color="#475569"
            onClick={() => router.push("/transactions")}
          />
          <MetricCard
            icon={<CheckCircle2 size={18} />}
            value={`${coverage}%`}
            label="Evidence Coverage"
            trend={`${verifiedEvidence} verified`}
            trendUp={true}
            color="#15803d"
            onClick={() => router.push("/reports")}
          />
        </div>

      <div style={threeColGrid}>
        <CardShell
          title="My Action Items"
          count={`${openReviewItems.length} to resolve`}
          onRefresh={handleRefresh}
          onMore={() => router.push("/review-queue")}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {openReviewItems.slice(0, 5).map((item) => (
              <ListItem
                key={item.id}
                icon={<AlertTriangle size={16} />}
                iconBg={item.risk === "Critical" ? "#fef2f2" : "#fffbeb"}
                iconColor={item.risk === "Critical" ? "#dc2626" : "#d97706"}
                title={item.type}
                subtitle={`${item.transactionId} · ${item.counterparty}`}
                rightLabel={item.status}
                rightColor={item.risk === "Critical" ? "#dc2626" : "#d97706"}
                onClick={() => router.push("/review-queue")}
              />
            ))}
            {openReviewItems.length === 0 && (
              <EmptyState
                icon={<CheckCircle2 size={24} style={{ color: "#16a34a" }} />}
                message="No open review items"
              />
            )}
          </div>
        </CardShell>

        <CardShell
          title="Transactions Needing Evidence"
          count={`${needsEvidence.length} items`}
          onRefresh={handleRefresh}
          onMore={() => router.push("/transactions")}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {needsEvidence.slice(0, 5).map((t) => (
              <ListItem
                key={t.id}
                icon={<Paperclip size={16} />}
                iconBg="#fef3c7"
                iconColor="#d97706"
                title={t.name || t.id}
                subtitle={t.counterparty || "No counterparty"}
                rightLabel={t.evidenceStatus}
                rightColor={t.evidenceStatus === "MISSING" ? "#dc2626" : "#d97706"}
                onClick={() => router.push("/evidence")}
              />
            ))}
            {needsEvidence.length === 0 && (
              <EmptyState
                icon={<CheckCircle2 size={24} style={{ color: "#16a34a" }} />}
                message="All transactions have evidence"
              />
            )}
          </div>
        </CardShell>

        <CardShell
          title="Evidence Status"
          onRefresh={handleRefresh}
          onMore={() => router.push("/evidence")}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Uploaded Documents</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{evidence.length}</span>
          </div>
          <SegmentedBar segments={[
            { value: verifiedEvidence, color: "#16a34a" },
            { value: pendingEvidence, color: "#64748b" },
            { value: needsEvidence.length, color: "#dc2626" },
          ]} />
          <CategoryRow dotColor="#16a34a" label="Verified" value={verifiedEvidence} />
          <CategoryRow dotColor="#64748b" label="Pending Review" value={pendingEvidence} />
          <CategoryRow dotColor="#dc2626" label="Missing Docs" value={missingEvidenceTxns.length} />
          <CategoryRow dotColor="#94a3b8" label="Partial Evidence" value={partialEvidenceTxns.length} />
          <CategoryRow dotColor="#cbd5e1" label="Coverage" value={`${coverage}%`} />
        </CardShell>
      </div>

      <div style={twoColGrid}>
        <CardShell
          title="Evidence Coverage"
          onRefresh={handleRefresh}
        >
          <div style={{ fontSize: 40, fontWeight: 700, color: ACCENT, letterSpacing: "-1px", marginBottom: 16 }}>
            {coverage}%
          </div>
          <div style={{ height: 8, background: "#f1f5f9", borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
            <div style={{
              height: "100%",
              width: `${coverage}%`,
              background: ACCENT,
              borderRadius: 6,
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </CardShell>

        <CardShell
          title="Upload Activity"
          onRefresh={handleRefresh}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100, padding: "8px 0" }}>
            {uploadActivity.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: i === uploadActivity.length - 1 ? CHART_BAR_ACTIVE : CHART_BAR,
                  borderRadius: "4px 4px 0 0",
                  height: `${h}%`,
                  minHeight: 6,
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
            <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
          </div>
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

/* ══════════════════════════════════════════════════════════
   AUDITOR DASHBOARD
   ══════════════════════════════════════════════════════════ */
function AuditorDashboard({ transactions, evidence, user }: { transactions: any[]; evidence: any[]; user: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const highRisk = transactions.filter((t) => (t.riskScore ?? 0) >= 80).length;
  const missingEvidence = transactions.filter((t) => t.evidenceStatus === "MISSING").length;
  const coverage = transactions.length > 0
    ? Math.round((transactions.filter((t) => t.evidenceStatus === "COMPLETE").length / transactions.length) * 100)
    : 0;
  const flaggedIssues = MOCK_REVIEW_QUEUE.filter((i) => i.status === "Open" || i.status === "Escalated").length;
  const auditActivity = [48, 52, 44, 58, 62, 55, 68, 72, 60, 75, 65, 70, 58, 78];

  const handleExport = () => {
    exportDashboardCSV({
      role: "Auditor",
      userName: user?.fullName ?? "",
      orgName: user?.organisationName,
      metrics: [
        { label: "Transactions Reviewed", value: transactions.length },
        { label: "High Risk", value: highRisk },
        { label: "Missing Evidence", value: missingEvidence },
        { label: "Evidence Coverage", value: `${coverage}%` },
      ],
      tables: [
        {
          title: "High Risk Items",
          headers: ["ID", "Name", "Counterparty", "Risk Score"],
          rows: transactions
            .filter((t) => (t.riskScore ?? 0) >= 80)
            .map((t) => [t.id, t.name, t.counterparty, t.riskScore ?? ""]),
        },
        {
          title: "Open Audit Flags",
          headers: ["Type", "Transaction", "Counterparty", "Status", "Due"],
          rows: MOCK_REVIEW_QUEUE
            .filter((i) => i.status === "Open" || i.status === "Escalated")
            .map((i) => [i.type, i.transactionId, i.counterparty, i.status, i.due]),
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
          roleLabel="Auditor"
          onExport={handleExport}
        />

        <div style={metricsRow}>
          <MetricCard
            icon={<Search size={18} />}
            value={transactions.length}
            label="Transactions Reviewed"
            color="#475569"
            onClick={() => router.push("/transactions")}
          />
          <MetricCard
            icon={<AlertOctagon size={18} />}
            value={highRisk}
            label="High Risk"
            trend={`${highRisk} flagged`}
            trendUp={false}
            color="#dc2626"
            onClick={() => router.push("/transactions")}
          />
          <MetricCard
            icon={<FileText size={18} />}
            value={missingEvidence}
            label="Missing Evidence"
            color="#475569"
            onClick={() => router.push("/evidence")}
          />
          <MetricCard
            icon={<BarChart3 size={18} />}
            value={`${coverage}%`}
            label="Evidence Coverage"
            color="#15803d"
            onClick={() => router.push("/reports")}
          />
        </div>

        <div style={threeColGrid}>
          <CardShell
            title="High Risk Items"
            count={`${highRisk} items`}
            onRefresh={handleRefresh}
            onMore={() => router.push("/transactions")}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {transactions.filter((t) => (t.riskScore ?? 0) >= 80).slice(0, 5).map((t) => (
                <ListItem
                  key={t.id}
                  icon={<AlertOctagon size={16} />}
                  iconBg="#fef2f2"
                  iconColor="#dc2626"
                  title={t.name || t.id}
                  subtitle={`Risk score: ${t.riskScore ?? "N/A"}`}
                  rightLabel="High Risk"
                  rightColor="#dc2626"
                  onClick={() => router.push("/transactions")}
                />
              ))}
              {highRisk === 0 && (
                <EmptyState
                  icon={<CheckCircle2 size={24} style={{ color: "#16a34a" }} />}
                  message="No high risk items"
                />
              )}
            </div>
          </CardShell>

          <CardShell
            title="Evidence Trail"
            count={`${evidence.length} files`}
            onRefresh={handleRefresh}
            onMore={() => router.push("/evidence")}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {evidence.slice(0, 5).map((e) => (
                <ListItem
                  key={e.id}
                  icon={<Paperclip size={16} />}
                  iconBg="#f8fafc"
                  iconColor="#475569"
                  title={e.documentName || e.name || e.id}
                  subtitle={e.category || "Document"}
                  rightLabel={e.status || "Pending"}
                  rightColor={e.status === "Verified" ? "#16a34a" : "#d97706"}
                  onClick={() => router.push("/evidence")}
                />
              ))}
              {evidence.length === 0 && (
                <EmptyState
                  icon={<FolderOpen size={24} />}
                  message="No evidence trail"
                />
              )}
            </div>
          </CardShell>

          <CardShell
            title="Audit Metrics"
            onRefresh={handleRefresh}
            onMore={() => router.push("/review-queue")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Open Issues</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: ACCENT }}>{flaggedIssues}</span>
            </div>
            <SegmentedBar segments={[
              { value: transactions.length - highRisk - missingEvidence, color: "#16a34a" },
              { value: missingEvidence, color: "#94a3b8" },
              { value: highRisk, color: "#dc2626" },
            ]} />
            <CategoryRow dotColor="#16a34a" label="Clear" value={transactions.length - highRisk - missingEvidence} />
            <CategoryRow dotColor="#94a3b8" label="Missing Evidence" value={missingEvidence} />
            <CategoryRow dotColor="#dc2626" label="High Risk" value={highRisk} />
            <CategoryRow dotColor="#64748b" label="Coverage" value={`${coverage}%`} />
            <CategoryRow dotColor="#cbd5e1" label="Open Flags" value={flaggedIssues} />
          </CardShell>
        </div>

        <div style={twoColGrid}>
          <CardShell title="Compliance Score" onRefresh={handleRefresh}>
            <div style={{ fontSize: 40, fontWeight: 700, color: ACCENT, letterSpacing: "-1px", marginBottom: 16 }}>
              {coverage}%
            </div>
            <div style={{ height: 8, background: "#f1f5f9", borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ height: "100%", width: `${coverage}%`, background: ACCENT, borderRadius: 6 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </CardShell>

          <CardShell title="Review Activity" onRefresh={handleRefresh}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100, padding: "8px 0" }}>
              {auditActivity.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: i === auditActivity.length - 1 ? CHART_BAR_ACTIVE : CHART_BAR,
                    borderRadius: "4px 4px 0 0",
                    height: `${h}%`,
                    minHeight: 6,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span>
            </div>
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

/* ══════════════════════════════════════════════════════════
   ROOT PAGE
   ══════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user, role } = useAuth();
  const { canViewAdminPanel } = usePermissions();
  const { transactions, evidence, loading } = useDashboardData();
  const router = useRouter();

  useEffect(() => {
    if (canViewAdminPanel) {
      router.replace("/admin/organizations");
    }
  }, [canViewAdminPanel, router]);

  if (canViewAdminPanel) return null;

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "100vh",
        flexDirection: "column",
        gap: 16
      }}>
        <Loader2 size={40} style={{ color: ACCENT, animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>Loading dashboard…</p>
      </div>
    );
  }

  if (role === "MEMBER")  return <MemberDashboard  transactions={transactions} evidence={evidence} user={user} />;
  if (role === "AUDITOR") return <AuditorDashboard transactions={transactions} evidence={evidence} user={user} />;
  return <ClientDashboard transactions={transactions} evidence={evidence} user={user} />;
}

/* ══════════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════════ */
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

const headerEyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#64748b",
  fontWeight: 500,
};

const headerTitle: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: 24,
  fontWeight: 700,
  color: ACCENT,
  letterSpacing: "-0.4px",
};

const headerMeta: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 13,
  color: "#64748b",
};

const headerDate: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: 12,
  color: "#94a3b8",
};

const headerActionBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "9px 16px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: ACCENT,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};

const loadingOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(255,255,255,0.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const iconButton: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  background: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const metricsRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 16,
};

const metricCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  padding: 20,
  border: "1px solid #e2e8f0",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

const threeColGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 16,
};

const twoColGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 16,
};

const cardShell: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  padding: 22,
  border: "1px solid #e2e8f0",
};

const listItemRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 12px",
  borderRadius: 10,
  gap: 12,
  transition: "background 0.15s ease",
};

/* ══════════════════════════════════════════════════════════
   GLOBAL STYLES (add to your globals.css)
   ══════════════════════════════════════════════════════════ */
/*
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
*/
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/security/access-control";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/hooks/useDashboardData";
import { MOCK_REVIEW_QUEUE } from "@/mock/reviewQueue.mock";
import {
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  RefreshCw,
  MoreHorizontal,
  Briefcase,
  AlertTriangle,
  BarChart3,
  FolderOpen,
  Paperclip,
  BookOpen,
  Clock,
  XCircle,
  CheckCircle2,
  Search,
  AlertOctagon,
  FileText,
  Download,
  Settings,
  Eye,
  TrendingUp,
  TrendingDown,
  Filter,
  ChevronRight,
  Loader2,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   GREETING BANNER
   ══════════════════════════════════════════════════════════ */
function GreetingBanner({ color, userName, userEmail, orgId, onExport }: { 
  color: string; 
  userName: string; 
  userEmail: string; 
  orgId?: string;
  onExport: () => void;
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  
  return (
    <div style={{ 
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`, 
      padding: "24px 32px 42px", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      flexWrap: "wrap", 
      gap: 20,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
    }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500, letterSpacing: "0.5px" }}>
          {greeting}
        </p>
        <h1 style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
          {userName}
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 8 }}>
          <span>{userEmail}</span>
          {orgId && <><span style={{ opacity: 0.4 }}>•</span><span>Org {orgId}</span></>}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button style={yearBtn}>
          <Calendar size={14} style={{ marginRight: 8 }} />
          {new Date().getFullYear()}
        </button>
        <button style={exportBtn} onClick={onExport}>
          <Download size={14} style={{ marginRight: 8 }} />
          Export Data
        </button>
      </div>
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
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered 
          ? "0 8px 24px rgba(0,0,0,0.12)" 
          : "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div style={{ position: "absolute", top: 16, right: 16, color: "#94a3b8" }}>
        <ArrowUpRight size={16} />
      </div>
      <div style={{ 
        width: 42, 
        height: 42, 
        borderRadius: 12, 
        background: `${color}15`, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        color, 
        marginBottom: 16,
        transition: "all 0.2s ease"
      }}>
        {icon}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1 }}>
          {value}
        </span>
        {trend && (
          <span style={{
            padding: "3px 10px", 
            borderRadius: 999, 
            fontSize: 11, 
            fontWeight: 700,
            background: trendUp ? "#dbeafe" : "#f1f5f9",
            color: trendUp ? "#2563eb" : "#64748b",
            display: "flex",
            alignItems: "center",
            gap: 2
          }}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>
        )}
      </div>
      <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ADD WIDGET CARD
   ══════════════════════════════════════════════════════════ */
function AddWidgetCard({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      style={{ 
        ...metricCard, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        flexDirection: "column", 
        gap: 10, 
        cursor: "pointer",
        border: `2px dashed ${isHovered ? "#3b82f6" : "#cbd5e1"}`,
        background: isHovered ? "#f8fafc" : "#fff",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div style={{ 
        width: 48, 
        height: 48, 
        borderRadius: "50%", 
        background: isHovered ? "#dbeafe" : "#f1f5f9", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        color: isHovered ? "#2563eb" : "#64748b",
        transition: "all 0.2s ease"
      }}>
        <Plus size={24} />
      </div>
      <span style={{ fontSize: 13, color: isHovered ? "#2563eb" : "#94a3b8", fontWeight: 600 }}>
        Add new widget
      </span>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{title}</h3>
          {count !== undefined && (
            <span style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
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
  const coverage = transactions.length > 0 ? Math.round((evidence.length / transactions.length) * 100) : 0;
  const pending = transactions.filter((t) => t.status === "Pending" || t.status === "Under Review").length;
  const verified = evidence.filter((e) => e.status === "Verified").length;
  const COLOR = "#1e3a8a";

  const handleExport = () => {
    console.log("Exporting data...");
    // Implement export logic
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleAddWidget = () => {
    console.log("Add widget clicked");
    // Implement widget addition logic
  };

  const handleTransactionClick = (transactionId: string) => {
    router.push(`/transactions/${transactionId}`);
  };

  const handleEvidenceClick = (evidenceId: string) => {
    router.push(`/evidence/${evidenceId}`);
  };

  return (
    <div style={pageBg}>
      <GreetingBanner 
        color={COLOR} 
        userName={user?.fullName ?? ""} 
        userEmail={user?.email ?? ""} 
        orgId={user?.organisationId}
        onExport={handleExport}
      />

      {/* METRIC CARDS ROW */}
      <div style={metricsRow}>
        <MetricCard 
          icon={<Briefcase size={20} />} 
          value={transactions.length} 
          label="Total Transactions" 
          trend="3.75%" 
          trendUp={true} 
          color={COLOR}
          onClick={() => router.push("/transactions")}
        />
        <MetricCard 
          icon={<AlertTriangle size={20} />} 
          value={highRisk} 
          label="High Risk" 
          trend="0.02%" 
          trendUp={false} 
          color="#0f172a"
          onClick={() => router.push("/transactions?filter=high-risk")}
        />
        <MetricCard 
          icon={<BarChart3 size={20} />} 
          value={`${coverage}%`} 
          label="Evidence Coverage" 
          trend="1.72%" 
          trendUp={true} 
          color="#2563eb"
          onClick={() => router.push("/evidence")}
        />
        <MetricCard 
          icon={<FolderOpen size={20} />} 
          value={evidence.length} 
          label="Evidence Files" 
          trend="3.72%" 
          trendUp={false} 
          color="#3b82f6"
          onClick={() => router.push("/evidence")}
        />
        <AddWidgetCard onClick={handleAddWidget} />
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
                title={`Transaction #${t.id || i + 1}`} 
                subtitle={t.description || "No description"} 
                rightLabel="High Risk" 
                rightColor="#dc2626"
                onClick={() => handleTransactionClick(t.id)}
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
                iconBg="#dbeafe" 
                iconColor="#2563eb" 
                title={e.fileName || `Evidence #${i + 1}`} 
                subtitle={e.uploadedBy || "Unknown"} 
                rightLabel={e.status || "Pending"} 
                rightColor={e.status === "Verified" ? "#16a34a" : "#d97706"}
                onClick={() => handleEvidenceClick(e.id)}
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
            { value: transactions.length - highRisk - pending, color: "#1e3a8a" },
            { value: pending, color: "#64748b" },
            { value: highRisk, color: "#dc2626" },
          ]} />
          <CategoryRow dotColor="#1e3a8a" label="Verified Transactions" value={transactions.length - highRisk - pending} />
          <CategoryRow dotColor="#64748b" label="Pending Review" value={pending} />
          <CategoryRow dotColor="#dc2626" label="High Risk" value={highRisk} />
          <CategoryRow dotColor="#2563eb" label="Evidence Verified" value={verified} />
          <CategoryRow dotColor="#94a3b8" label="Evidence Missing" value={evidence.filter((e) => e.status === "Missing").length} />
        </CardShell>
      </div>

      {/* BOTTOM 2-COLUMN GRID */}
      <div style={twoColGrid}>
        <CardShell 
          title="Evidence Coverage KPI"
          onRefresh={handleRefresh}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 48, fontWeight: 800, color: "#0f172a", letterSpacing: "-2px" }}>
              {coverage.toFixed(2)}%
            </span>
          </div>
          <div style={{ height: 12, background: "#f1f5f9", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ 
              height: "100%", 
              width: `${coverage}%`, 
              background: `linear-gradient(90deg, ${COLOR} 0%, ${COLOR}cc 100%)`, 
              borderRadius: 8, 
              transition: "width 0.8s ease" 
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
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "12px 0" }}>
            {Array.from({ length: 14 }).map((_, i) => {
              const h = 20 + Math.random() * 70;
              return (
                <div 
                  key={i} 
                  style={{ 
                    flex: 1, 
                    background: `linear-gradient(180deg, ${COLOR} 0%, ${COLOR}88 100%)`, 
                    borderRadius: "6px 6px 0 0", 
                    height: `${h}%`, 
                    minHeight: 8,
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scaleY(1.05)";
                    e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scaleY(1)";
                    e.currentTarget.style.opacity = "1";
                  }}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
          </div>
        </CardShell>
      </div>

      {isLoading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255,255,255,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <Loader2 size={48} style={{ color: COLOR, animation: "spin 1s linear infinite" }} />
        </div>
      )}
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
  const COLOR = "#2563eb";
  const uploadActivity = [35, 42, 28, 55, 48, 62, 58, 70, 45, 52, 68, 74, 60, 80];

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div style={pageBg}>
      <GreetingBanner
        color={COLOR}
        userName={user?.fullName ?? ""}
        userEmail={user?.email ?? ""}
        orgId={user?.organisationId}
        onExport={handleExport}
      />

      <div style={metricsRow}>
        <MetricCard
          icon={<AlertOctagon size={20} />}
          value={openReviewItems.length}
          label="Open Review Items"
          trend={`${openReviewItems.filter((i) => i.risk === "Critical").length} critical`}
          trendUp={false}
          color="#dc2626"
          onClick={() => router.push("/review-queue")}
        />
        <MetricCard
          icon={<XCircle size={20} />}
          value={needsEvidence.length}
          label="Needs Evidence"
          trend={`${missingEvidenceTxns.length} missing`}
          trendUp={false}
          color="#0f172a"
          onClick={() => router.push("/evidence")}
        />
        <MetricCard
          icon={<BookOpen size={20} />}
          value={draftsToComplete}
          label="Transactions In Progress"
          color={COLOR}
          onClick={() => router.push("/transactions")}
        />
        <MetricCard
          icon={<CheckCircle2 size={20} />}
          value={`${coverage}%`}
          label="Evidence Coverage"
          trend={`${verifiedEvidence} verified`}
          trendUp={true}
          color="#16a34a"
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
          <CategoryRow dotColor="#dc2626" label="Transactions Missing Docs" value={missingEvidenceTxns.length} />
          <CategoryRow dotColor="#2563eb" label="Partial Evidence" value={partialEvidenceTxns.length} />
          <CategoryRow dotColor="#94a3b8" label="Coverage" value={`${coverage}%`} />
        </CardShell>
      </div>

      <div style={twoColGrid}>
        <CardShell
          title="Evidence Coverage"
          onRefresh={handleRefresh}
        >
          <div style={{ fontSize: 48, fontWeight: 800, color: "#0f172a", letterSpacing: "-2px", marginBottom: 16 }}>
            {coverage}%
          </div>
          <div style={{ height: 12, background: "#f1f5f9", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
            <div style={{
              height: "100%",
              width: `${coverage}%`,
              background: `linear-gradient(90deg, ${COLOR} 0%, ${COLOR}cc 100%)`,
              borderRadius: 8,
              transition: "width 0.8s ease",
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
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "12px 0" }}>
            {uploadActivity.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: `linear-gradient(180deg, ${COLOR} 0%, ${COLOR}88 100%)`,
                  borderRadius: "6px 6px 0 0",
                  height: `${h}%`,
                  minHeight: 8,
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
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255,255,255,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <Loader2 size={48} style={{ color: COLOR, animation: "spin 1s linear infinite" }} />
        </div>
      )}
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
  const coverage = transactions.length > 0 ? Math.round((evidence.length / transactions.length) * 100) : 0;
  const COLOR = "#3b82f6";

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleAddWidget = () => {
    console.log("Add widget clicked");
  };

  return (
    <div style={pageBg}>
      <GreetingBanner 
        color={COLOR} 
        userName={user?.fullName ?? ""} 
        userEmail={user?.email ?? ""} 
        orgId={user?.organisationId}
        onExport={handleExport}
      />

      <div style={metricsRow}>
        <MetricCard 
          icon={<Search size={20} />} 
          value={transactions.length} 
          label="Transactions" 
          trend="10.3%" 
          trendUp={true} 
          color={COLOR}
          onClick={() => router.push("/transactions")}
        />
        <MetricCard 
          icon={<AlertOctagon size={20} />} 
          value={highRisk} 
          label="High Risk" 
          trend="4.7%" 
          trendUp={false} 
          color="#0f172a"
          onClick={() => router.push("/transactions?filter=high-risk")}
        />
        <MetricCard 
          icon={<FileText size={20} />} 
          value={missingEvidence} 
          label="Missing Evidence" 
          trend="2.1%" 
          trendUp={false} 
          color="#475569"
          onClick={() => router.push("/evidence?status=missing")}
        />
        <MetricCard 
          icon={<BarChart3 size={20} />} 
          value={`${coverage}%`} 
          label="Evidence Coverage" 
          trend="12.8%" 
          trendUp={true} 
          color="#2563eb"
          onClick={() => router.push("/evidence")}
        />
        <AddWidgetCard onClick={handleAddWidget} />
      </div>

      <div style={threeColGrid}>
        <CardShell 
          title="High Risk Items" 
          count={`${highRisk} Items`}
          onRefresh={handleRefresh}
          onMore={() => console.log("More options")}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {transactions.filter((t) => (t.riskScore ?? 0) >= 80).slice(0, 5).map((t, i) => (
              <ListItem 
                key={i} 
                icon={<AlertOctagon size={16} />} 
                iconBg="#fef2f2" 
                iconColor="#dc2626" 
                title={`Transaction #${t.id || i + 1}`} 
                subtitle={`Risk Score: ${t.riskScore || "N/A"}`} 
                rightLabel="High Risk" 
                rightColor="#dc2626"
                onClick={() => router.push(`/transactions/${t.id}`)}
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
          count={`${evidence.length} Files`}
          onRefresh={handleRefresh}
          onMore={() => console.log("More options")}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {evidence.slice(0, 5).map((e, i) => (
              <ListItem 
                key={i} 
                icon={<Paperclip size={16} />} 
                iconBg="#e0f2fe" 
                iconColor="#2563eb" 
                title={e.fileName || `Evidence #${i + 1}`} 
                subtitle={e.uploadedBy || "Unknown"} 
                rightLabel={e.status || "Pending"} 
                rightColor={e.status === "Verified" ? "#16a34a" : "#d97706"}
                onClick={() => router.push(`/evidence/${e.id}`)}
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
          onMore={() => console.log("More options")}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Total Transactions</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{transactions.length}</span>
          </div>
          <SegmentedBar segments={[
            { value: transactions.length - highRisk - missingEvidence, color: "#3b82f6" },
            { value: missingEvidence, color: "#475569" },
            { value: highRisk, color: "#dc2626" },
          ]} />
          <CategoryRow dotColor="#3b82f6" label="Under Review" value={transactions.length - highRisk - missingEvidence} />
          <CategoryRow dotColor="#475569" label="Missing Evidence" value={missingEvidence} />
          <CategoryRow dotColor="#dc2626" label="High Risk" value={highRisk} />
          <CategoryRow dotColor="#2563eb" label="Coverage" value={`${coverage}%`} />
          <CategoryRow dotColor="#94a3b8" label="Flagged Issues" value={0} />
        </CardShell>
      </div>

      <div style={twoColGrid}>
        <CardShell 
          title="Compliance Score"
          onRefresh={handleRefresh}
        >
          <div style={{ fontSize: 48, fontWeight: 800, color: "#0f172a", letterSpacing: "-2px", marginBottom: 16 }}>
            {coverage.toFixed(2)}%
          </div>
          <div style={{ height: 12, background: "#f1f5f9", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ 
              height: "100%", 
              width: `${coverage}%`, 
              background: `linear-gradient(90deg, ${COLOR} 0%, ${COLOR}cc 100%)`, 
              borderRadius: 8,
              transition: "width 0.8s ease"
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </CardShell>

        <CardShell 
          title="Audit Trail"
          onRefresh={handleRefresh}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "12px 0" }}>
            {Array.from({ length: 14 }).map((_, i) => {
              const h = 20 + Math.random() * 70;
              return (
                <div 
                  key={i} 
                  style={{ 
                    flex: 1, 
                    background: `linear-gradient(180deg, ${COLOR} 0%, ${COLOR}88 100%)`, 
                    borderRadius: "6px 6px 0 0", 
                    height: `${h}%`, 
                    minHeight: 8,
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scaleY(1.05)";
                    e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scaleY(1)";
                    e.currentTarget.style.opacity = "1";
                  }}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
          </div>
        </CardShell>
      </div>

      {isLoading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255,255,255,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <Loader2 size={48} style={{ color: COLOR, animation: "spin 1s linear infinite" }} />
        </div>
      )}
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
        <Loader2 size={48} style={{ color: "#2563eb", animation: "spin 1s linear infinite" }} />
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
  background: "#f8fafc",
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};

const yearBtn: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  backdropFilter: "blur(10px)",
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s ease",
};

const exportBtn: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: 12,
  border: "none",
  background: "#fff",
  color: "#0f172a",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s ease",
};

const iconButton: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "none",
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const metricsRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: 20,
  padding: "0 32px",
  marginTop: -24,
  marginBottom: 24,
};

const metricCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
  border: "1px solid #e2e8f0",
  position: "relative",
  transition: "all 0.3s ease",
};

const threeColGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 20,
  padding: "0 32px",
  marginBottom: 20,
};

const twoColGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 20,
  padding: "0 32px 32px",
};

const cardShell: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
  border: "1px solid #e2e8f0",
};

const listItemRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 14px",
  borderRadius: 12,
  gap: 12,
  transition: "all 0.2s ease",
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
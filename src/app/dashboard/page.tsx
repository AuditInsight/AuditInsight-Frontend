"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/security/access-control";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/hooks/useDashboardData";
import { UserRole } from "@/types/user";
import DashboardStats from "@/components/dashboard/DashboardStats";
import EvidenceChart from "@/components/dashboard/EvidenceChart";
import HighRiskTransactions from "@/components/dashboard/HighRiskTransactions";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";
import QuickActions from "@/components/dashboard/QuickActions";

/* ══════════════════════════════════════════════════════════
   GREETING BANNER (replaces TopNav + HeaderSection)
   ══════════════════════════════════════════════════════════ */
function GreetingBanner({ color, userName, userEmail, orgId }: { color: string; userName: string; userEmail: string; orgId?: string }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  return (
    <div style={{ background: "#0d2158", padding: "20px 28px 38px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{greeting}</p>
        <h1 style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>{userName}</h1>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{userEmail}{orgId && ` · Org ${orgId}`}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button style={yearBtn}>📅 {new Date().getFullYear()}</button>
        <button style={exportBtn}>Export Data</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   METRIC CARD (matches reference: icon circle + big number + trend badge)
   ══════════════════════════════════════════════════════════ */
function MetricCard({ icon, value, label, trend, trendUp, color }: {
  icon: string; value: string | number; label: string;
  trend?: string; trendUp?: boolean; color: string;
}) {
  return (
    <div style={metricCard}>
      <div style={{ position: "absolute", top: 14, right: 14, fontSize: 12, color: "#94a3b8", cursor: "pointer" }}>↗</div>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 14 }}>{icon}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1 }}>{value}</span>
        {trend && (
          <span style={{
            padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: trendUp ? "#dcfce7" : "#fee2e2",
            color: trendUp ? "#16a34a" : "#dc2626",
          }}>{trendUp ? "↑" : "↓"} {trend}</span>
        )}
      </div>
      <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ADD WIDGET CARD
   ══════════════════════════════════════════════════════════ */
function AddWidgetCard() {
  return (
    <div style={{ ...metricCard, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, cursor: "pointer", border: "2px dashed #e2e8f0" }}>
      <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#64748b" }}>+</div>
      <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Add new widget</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LIST ITEM (for transactions / evidence lists)
   ══════════════════════════════════════════════════════════ */
function ListItem({ icon, iconBg, title, subtitle, rightLabel, rightColor }: {
  icon: string; iconBg: string; title: string; subtitle: string;
  rightLabel?: string; rightColor?: string;
}) {
  return (
    <div style={listItemRow}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{icon}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
          <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 1 }}>{subtitle}</div>
        </div>
      </div>
      {rightLabel && (
        <span style={{
          padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
          background: `${rightColor}15`, color: rightColor, whiteSpace: "nowrap",
        }}>{rightLabel}</span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROGRESS SEGMENT BAR (matches reference segmented bar)
   ══════════════════════════════════════════════════════════ */
function SegmentedBar({ segments }: { segments: { value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  return (
    <div style={{ display: "flex", height: 10, borderRadius: 6, overflow: "hidden", gap: 3, marginBottom: 16 }}>
      {segments.map((seg, i) => (
        <div key={i} style={{ flex: seg.value, background: seg.color, borderRadius: 3, minWidth: seg.value > 0 ? 8 : 0 }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CATEGORY ROW (for status breakdown)
   ══════════════════════════════════════════════════════════ */
function CategoryRow({ dotColor, label, value }: { dotColor: string; label: string; value: string | number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor }} />
        <span style={{ fontSize: 12.5, color: "#475569", fontWeight: 500 }}>{label}</span>
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a" }}>{value}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CARD SHELL (matches reference white cards with header)
   ═════════════════════════════════════════════════════════ */
function CardShell({ title, count, children, style }: { title: string; count?: string | number; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ ...cardShell, ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{title}</h3>
          {count !== undefined && <span style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>{count}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, color: "#94a3b8", cursor: "pointer" }}>🔄</span>
          <span style={{ fontSize: 14, color: "#94a3b8", cursor: "pointer" }}>⋯</span>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   1. CLIENT (Admin / CEO) dashboard
   ═════════════════════════════════════════════════════════ */
function ClientDashboard({ transactions, evidence, user }: { transactions: any[]; evidence: any[]; user: any }) {
  const router = useRouter();
  const highRisk = transactions.filter((t) => (t.riskScore ?? 0) >= 80 || t.evidenceStatus === "MISSING").length;
  const coverage = transactions.length > 0 ? Math.round((evidence.length / transactions.length) * 100) : 0;
  const pending = transactions.filter((t) => t.status === "Pending" || t.status === "Under Review").length;
  const verified = evidence.filter((e) => e.status === "Verified").length;
  const COLOR = "#1e3a8a";

  return (
    <div style={pageBg}>
      <GreetingBanner color={COLOR} userName={user?.fullName ?? ""} userEmail={user?.email ?? ""} orgId={user?.organisationId} />

      {/* METRIC CARDS ROW */}
      <div style={metricsRow}>
        <MetricCard icon="💼" value={transactions.length} label="Total Transactions" trend="3.75%" trendUp={true} color={COLOR} />
        <MetricCard icon="⚠️" value={highRisk} label="High Risk" trend="0.02%" trendUp={false} color="#b91c1c" />
        <MetricCard icon="📊" value={`${coverage}%`} label="Evidence Coverage" trend="1.72%" trendUp={true} color="#15803d" />
        <MetricCard icon="📁" value={evidence.length} label="Evidence Files" trend="3.72%" trendUp={false} color="#0369a1" />
        <AddWidgetCard />
      </div>

      {/* MIDDLE 3-COLUMN GRID */}
      <div style={threeColGrid}>
        {/* LEFT: High Risk Transactions */}
        <CardShell title="High Risk Transactions" count={`${highRisk} Items`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {transactions.filter((t) => (t.riskScore ?? 0) >= 80 || t.evidenceStatus === "MISSING").slice(0, 5).map((t, i) => (
              <ListItem key={i} icon="⚠️" iconBg="#fee2e2" title={`Transaction #${t.id || i + 1}`} subtitle={t.description || "No description"} rightLabel="High Risk" rightColor="#dc2626" />
            ))}
            {highRisk === 0 && <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No high risk items ✓</div>}
          </div>
        </CardShell>

        {/* CENTER: Recent Evidence */}
        <CardShell title="Recent Evidence" count={`${evidence.length} Files`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {evidence.slice(0, 5).map((e, i) => (
              <ListItem key={i} icon="📎" iconBg="#dbeafe" title={e.fileName || `Evidence #${i + 1}`} subtitle={e.uploadedBy || "Unknown"} rightLabel={e.status || "Pending"} rightColor={e.status === "Verified" ? "#16a34a" : "#d97706"} />
            ))}
            {evidence.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No evidence uploaded yet</div>}
          </div>
        </CardShell>

        {/* RIGHT: Compliance Status */}
        <CardShell title="Compliance Status">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Total Transactions</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{transactions.length}</span>
          </div>
          <SegmentedBar segments={[
            { value: transactions.length - highRisk - pending, color: "#1e3a8a" },
            { value: pending, color: "#d97706" },
            { value: highRisk, color: "#dc2626" },
          ]} />
          <CategoryRow dotColor="#1e3a8a" label="Verified Transactions" value={transactions.length - highRisk - pending} />
          <CategoryRow dotColor="#d97706" label="Pending Review" value={pending} />
          <CategoryRow dotColor="#dc2626" label="High Risk" value={highRisk} />
          <CategoryRow dotColor="#16a34a" label="Evidence Verified" value={verified} />
          <CategoryRow dotColor="#64748b" label="Evidence Missing" value={evidence.filter((e) => e.status === "Missing").length} />
        </CardShell>
      </div>

      {/* BOTTOM 2-COLUMN GRID */}
      <div style={twoColGrid}>
        <CardShell title="Evidence Coverage KPI">
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
            <span style={{ fontSize: 42, fontWeight: 800, color: "#0f172a", letterSpacing: "-1.5px" }}>{coverage.toFixed(2)}%</span>
          </div>
          <div style={{ height: 10, background: "#f1f5f9", borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${coverage}%`, background: `linear-gradient(90deg, ${COLOR} 0%, ${COLOR}cc 100%)`, borderRadius: 6, transition: "width 0.8s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </CardShell>

        <CardShell title="Transaction Overview">
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100, padding: "10px 0" }}>
            {Array.from({ length: 14 }).map((_, i) => {
              const h = 20 + Math.random() * 70;
              return <div key={i} style={{ flex: 1, background: `${COLOR}${Math.round(h * 2.5).toString(16).padStart(2, "0")}`, borderRadius: "4px 4px 0 0", height: `${h}%`, minHeight: 6 }} />;
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
          </div>
        </CardShell>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   2. MEMBER (Accountant) dashboard
   ══════════════════════════════════════════════════════════ */
function MemberDashboard({ transactions, evidence, user }: { transactions: any[]; evidence: any[]; user: any }) {
  const router = useRouter();
  const pending = transactions.filter((t) => t.status === "Pending" || t.status === "Under Review").length;
  const missing = evidence.filter((e) => e.status === "Missing").length;
  const verified = evidence.filter((e) => e.status === "Verified").length;
  const COLOR = "#15803d";

  return (
    <div style={pageBg}>
      <GreetingBanner color={COLOR} userName={user?.fullName ?? ""} userEmail={user?.email ?? ""} orgId={user?.organisationId} />

      <div style={metricsRow}>
        <MetricCard icon="📒" value={transactions.length} label="Total Transactions" trend="15.2%" trendUp={true} color={COLOR} />
        <MetricCard icon="⏳" value={pending} label="Pending Review" trend="5.1%" trendUp={false} color="#b45309" />
        <MetricCard icon="❌" value={missing} label="Missing Evidence" trend="2.3%" trendUp={false} color="#b91c1c" />
        <MetricCard icon="✅" value={verified} label="Verified Evidence" trend="18.7%" trendUp={true} color={COLOR} />
        <AddWidgetCard />
      </div>

      <div style={threeColGrid}>
        <CardShell title="Pending Transactions" count={`${pending} Items`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {transactions.filter((t) => t.status === "Pending" || t.status === "Under Review").slice(0, 5).map((t, i) => (
              <ListItem key={i} icon="⏳" iconBg="#fef3c7" title={`Transaction #${t.id || i + 1}`} subtitle={t.description || "No description"} rightLabel={t.status || "Pending"} rightColor="#d97706" />
            ))}
            {pending === 0 && <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>All caught up ✓</div>}
          </div>
        </CardShell>

        <CardShell title="Evidence Queue" count={`${evidence.length} Files`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {evidence.slice(0, 5).map((e, i) => (
              <ListItem key={i} icon="📎" iconBg="#dcfce7" title={e.fileName || `Evidence #${i + 1}`} subtitle={e.uploadedBy || "Unknown"} rightLabel={e.status || "Pending"} rightColor={e.status === "Verified" ? "#16a34a" : "#d97706"} />
            ))}
            {evidence.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No evidence yet</div>}
          </div>
        </CardShell>

        <CardShell title="Evidence Status">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Total Evidence</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{evidence.length}</span>
          </div>
          <SegmentedBar segments={[
            { value: verified, color: "#15803d" },
            { value: evidence.filter((e) => e.status === "Pending").length, color: "#d97706" },
            { value: missing, color: "#dc2626" },
          ]} />
          <CategoryRow dotColor="#15803d" label="Verified" value={verified} />
          <CategoryRow dotColor="#d97706" label="Pending" value={evidence.filter((e) => e.status === "Pending").length} />
          <CategoryRow dotColor="#dc2626" label="Missing" value={missing} />
          <CategoryRow dotColor="#1e3a8a" label="Total Transactions" value={transactions.length} />
          <CategoryRow dotColor="#64748b" label="Coverage" value={`${transactions.length > 0 ? Math.round((evidence.length / transactions.length) * 100) : 0}%`} />
        </CardShell>
      </div>

      <div style={twoColGrid}>
        <CardShell title="Verification KPI">
          <div style={{ fontSize: 42, fontWeight: 800, color: "#0f172a", letterSpacing: "-1.5px", marginBottom: 12 }}>
            {evidence.length > 0 ? Math.round((verified / evidence.length) * 100) : 0}%
          </div>
          <div style={{ height: 10, background: "#f1f5f9", borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${evidence.length > 0 ? (verified / evidence.length) * 100 : 0}%`, background: `linear-gradient(90deg, ${COLOR} 0%, ${COLOR}cc 100%)`, borderRadius: 6 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </CardShell>

        <CardShell title="Monthly Activity">
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100, padding: "10px 0" }}>
            {Array.from({ length: 14 }).map((_, i) => {
              const h = 20 + Math.random() * 70;
              return <div key={i} style={{ flex: 1, background: `${COLOR}${Math.round(h * 2.5).toString(16).padStart(2, "0")}`, borderRadius: "4px 4px 0 0", height: `${h}%`, minHeight: 6 }} />;
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
          </div>
        </CardShell>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   3. AUDITOR dashboard
   ══════════════════════════════════════════════════════════ */
function AuditorDashboard({ transactions, evidence, user }: { transactions: any[]; evidence: any[]; user: any }) {
  const router = useRouter();
  const highRisk = transactions.filter((t) => (t.riskScore ?? 0) >= 80).length;
  const missingEvidence = transactions.filter((t) => t.evidenceStatus === "MISSING").length;
  const coverage = transactions.length > 0 ? Math.round((evidence.length / transactions.length) * 100) : 0;
  const COLOR = "#b45309";

  return (
    <div style={pageBg}>
      <GreetingBanner color={COLOR} userName={user?.fullName ?? ""} userEmail={user?.email ?? ""} orgId={user?.organisationId} />

      <div style={metricsRow}>
        <MetricCard icon="🔍" value={transactions.length} label="Transactions" trend="10.3%" trendUp={true} color={COLOR} />
        <MetricCard icon="🚨" value={highRisk} label="High Risk" trend="4.7%" trendUp={false} color="#b91c1c" />
        <MetricCard icon="📄" value={missingEvidence} label="Missing Evidence" trend="2.1%" trendUp={false} color="#92400e" />
        <MetricCard icon="" value={`${coverage}%`} label="Evidence Coverage" trend="12.8%" trendUp={true} color="#15803d" />
        <AddWidgetCard />
      </div>

      <div style={threeColGrid}>
        <CardShell title="High Risk Items" count={`${highRisk} Items`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {transactions.filter((t) => (t.riskScore ?? 0) >= 80).slice(0, 5).map((t, i) => (
              <ListItem key={i} icon="🚨" iconBg="#fee2e2" title={`Transaction #${t.id || i + 1}`} subtitle={`Risk Score: ${t.riskScore || "N/A"}`} rightLabel="High Risk" rightColor="#dc2626" />
            ))}
            {highRisk === 0 && <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No high risk items ✓</div>}
          </div>
        </CardShell>

        <CardShell title="Evidence Trail" count={`${evidence.length} Files`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {evidence.slice(0, 5).map((e, i) => (
              <ListItem key={i} icon="📎" iconBg="#ffedd5" title={e.fileName || `Evidence #${i + 1}`} subtitle={e.uploadedBy || "Unknown"} rightLabel={e.status || "Pending"} rightColor={e.status === "Verified" ? "#16a34a" : "#d97706"} />
            ))}
            {evidence.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No evidence trail</div>}
          </div>
        </CardShell>

        <CardShell title="Audit Metrics">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Total Transactions</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{transactions.length}</span>
          </div>
          <SegmentedBar segments={[
            { value: transactions.length - highRisk - missingEvidence, color: "#b45309" },
            { value: missingEvidence, color: "#92400e" },
            { value: highRisk, color: "#dc2626" },
          ]} />
          <CategoryRow dotColor="#b45309" label="Under Review" value={transactions.length - highRisk - missingEvidence} />
          <CategoryRow dotColor="#92400e" label="Missing Evidence" value={missingEvidence} />
          <CategoryRow dotColor="#dc2626" label="High Risk" value={highRisk} />
          <CategoryRow dotColor="#15803d" label="Coverage" value={`${coverage}%`} />
          <CategoryRow dotColor="#64748b" label="Flagged Issues" value={0} />
        </CardShell>
      </div>

      <div style={twoColGrid}>
        <CardShell title="Compliance Score">
          <div style={{ fontSize: 42, fontWeight: 800, color: "#0f172a", letterSpacing: "-1.5px", marginBottom: 12 }}>{coverage.toFixed(2)}%</div>
          <div style={{ height: 10, background: "#f1f5f9", borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${coverage}%`, background: `linear-gradient(90deg, ${COLOR} 0%, ${COLOR}cc 100%)`, borderRadius: 6 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </CardShell>

        <CardShell title="Audit Trail">
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100, padding: "10px 0" }}>
            {Array.from({ length: 14 }).map((_, i) => {
              const h = 20 + Math.random() * 70;
              return <div key={i} style={{ flex: 1, background: `${COLOR}${Math.round(h * 2.5).toString(16).padStart(2, "0")}`, borderRadius: "4px 4px 0 0", height: `${h}%`, minHeight: 6 }} />;
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
          </div>
        </CardShell>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading dashboard…</p>
      </div>
    );
  }

  if (role === "MEMBER")  return <MemberDashboard  transactions={transactions} evidence={evidence} user={user} />;
  if (role === "AUDITOR") return <AuditorDashboard transactions={transactions} evidence={evidence} user={user} />;
  return <ClientDashboard transactions={transactions} evidence={evidence} user={user} />;
}

/* ══════════════════════════════════════════════════════════
   STYLES (matches reference design exactly)
   ══════════════════════════════════════════════════════════ */
const pageBg: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f1f5f9",
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};

const yearBtn: React.CSSProperties = {
  padding: "9px 16px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.12)",
  color: "#fff",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  backdropFilter: "blur(8px)",
};

const exportBtn: React.CSSProperties = {
  padding: "9px 18px",
  borderRadius: 10,
  border: "none",
  background: "#fff",
  color: "#0f172a",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const metricsRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: 16,
  padding: "0 24px",
  marginTop: -20,
  marginBottom: 20,
};

const metricCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
  border: "1px solid #f1f5f9",
  position: "relative",
};

const threeColGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 16,
  padding: "0 24px",
  marginBottom: 16,
};

const twoColGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 16,
  padding: "0 24px 24px",
};

const cardShell: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
  border: "1px solid #f1f5f9",
};

const listItemRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 12px",
  borderRadius: 10,
  gap: 12,
  transition: "background 0.15s",
};
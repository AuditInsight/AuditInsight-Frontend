"use client";

import { useMemo, useState } from "react";
import ReportsToolbar from "@/components/reports/ReportsToolbar";
import ReportsSidebar from "@/components/reports/ReportsSidebar";
import AuditReadinessCard from "@/components/reports/AuditReadinessCard";
import EvidenceBreakdownChart from "@/components/reports/EvidenceBreakdownChart";
import OutstandingIssuesCard from "@/components/reports/OutstandingIssuesCard";
import RiskDistributionChart from "@/components/reports/RiskDistributionChart";
import HighRiskTransactionsTable from "@/components/reports/HighRiskTransactionsTable";
import FraudAlertsTable from "@/components/reports/FraudAlertsTable";
import { theme } from "@/styles/theme";

/*
 * ── REAL API (commented for RBAC UI testing) ──────────────────
 * Previously: getTransactions, getEvidence, getReviewQueue from "@/utils/api"
 * Now managed by useReports hook.
 * ──────────────────────────────────────────────────────────────
 */
import { useReports } from "@/hooks/useReports";
import { usePermissions } from "@/security/access-control";

export default function ReportsPage() {
  const { canViewReports } = usePermissions();
  const [severity, setSeverity] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeReport, setActiveReport] = useState("Audit Readiness");

  const {
    transactionsCount, evidenceCount, linkedEvidencePercent, readiness,
    completeEvidence, pendingEvidence, missingEvidence,
    verificationProblems, complianceIssues, fraudFlags, controlViolations,
    highRiskTransactions, fraudAlerts, reviews,
  } = useReports();

  const filteredReviews = useMemo(
    () => reviews.filter((r) => severity === "All" || r.risk === severity),
    [reviews, severity]
  );

  if (!canViewReports) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <p style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>Access Restricted</p>
          <p style={{ fontSize: 14, marginTop: 6 }}>You do not have permission to view Reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <ReportsToolbar
        severity={severity} setSeverity={setSeverity}
        dateFrom={dateFrom} setDateFrom={setDateFrom}
        dateTo={dateTo} setDateTo={setDateTo}
      />

      <div style={styles.layout}>
        <ReportsSidebar active={activeReport} setActive={setActiveReport} />

        <div style={styles.content}>
          <div style={styles.topGrid}>
            <AuditReadinessCard
              readiness={readiness}
              linkedEvidencePercent={linkedEvidencePercent}
              transactionsCount={transactionsCount}
              evidenceCount={evidenceCount}
            />
            <EvidenceBreakdownChart
              complete={completeEvidence}
              pending={pendingEvidence}
              missing={missingEvidence}
            />
            <OutstandingIssuesCard
              verificationProblems={verificationProblems}
              complianceIssues={complianceIssues}
              fraudFlags={fraudFlags}
              controlViolations={controlViolations}
            />
          </div>

          <RiskDistributionChart reviews={filteredReviews} />

          <div style={styles.tables}>
            <HighRiskTransactionsTable data={highRiskTransactions} />
            <FraudAlertsTable data={fraudAlerts} />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: theme.spacing.lg, background: theme.colors.appBackground, minHeight: "100vh" },
  layout: { display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "start" },
  content: { display: "flex", flexDirection: "column", gap: 20 },
  topGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },
  tables: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
};

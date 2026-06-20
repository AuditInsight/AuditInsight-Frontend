"use client";

import { useMemo, useState } from "react";
import ReportsToolbar from "@/components/reports/ReportsToolbar";
import ReportsSidebar, { DEFAULT_REPORT_TAB, type ReportTabId } from "@/components/reports/ReportsSidebar";
import AuditReadinessCard from "@/components/reports/AuditReadinessCard";
import EvidenceBreakdownChart from "@/components/reports/EvidenceBreakdownChart";
import OutstandingIssuesCard from "@/components/reports/OutstandingIssuesCard";
import RiskDistributionChart from "@/components/reports/RiskDistributionChart";
import HighRiskTransactionsTable from "@/components/reports/HighRiskTransactionsTable";
import FraudAlertsTable from "@/components/reports/FraudAlertsTable";
import EvidenceCompletenessTable from "@/components/reports/EvidenceCompletenessTable";
import ComplianceExposureTable from "@/components/reports/ComplianceExposureTable";
import InternalAuditFindingsTable from "@/components/reports/InternalAuditFindingsTable";
import { theme } from "@/styles/theme";
import { useReports } from "@/hooks/useReports";
import { usePermissions } from "@/security/access-control";
import { MOCK_REVIEW_QUEUE } from "@/mock/reviewQueue.mock";

export default function ReportsPage() {
  const { canViewReports } = usePermissions();
  const [severity, setSeverity] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeReport, setActiveReport] = useState<ReportTabId>(DEFAULT_REPORT_TAB);

  const {
    transactionsCount, evidenceCount, linkedEvidencePercent, readiness,
    completeEvidencePct, pendingEvidencePct, missingEvidencePct,
    incompleteTransactions,
    verificationProblems, complianceIssues, fraudFlags, controlViolations,
    highRiskTransactions, fraudAlerts, complianceExposure, reviews,
  } = useReports();

  const filteredReviews = useMemo(
    () => reviews.filter((r) => severity === "All" || r.risk === severity),
    [reviews, severity]
  );

  const filteredHighRisk = useMemo(
    () => highRiskTransactions.filter((tx) => {
      if (severity === "All") return true;
      const score = tx.riskScore ?? 0;
      if (severity === "Critical") return score >= 80;
      if (severity === "Medium") return score >= 50 && score < 80;
      if (severity === "Low") return score < 50;
      return true;
    }),
    [highRiskTransactions, severity]
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

  const renderReportContent = () => {
    switch (activeReport) {
      case "Audit Readiness Report":
        return (
          <>
            <div style={styles.topGrid}>
              <AuditReadinessCard
                readiness={readiness}
                linkedEvidencePercent={linkedEvidencePercent}
                transactionsCount={transactionsCount}
                evidenceCount={evidenceCount}
              />
              <EvidenceBreakdownChart
                complete={completeEvidencePct}
                pending={pendingEvidencePct}
                missing={missingEvidencePct}
              />
              <OutstandingIssuesCard
                verificationProblems={verificationProblems}
                complianceIssues={complianceIssues}
                fraudFlags={fraudFlags}
                controlViolations={controlViolations}
              />
            </div>
            <RiskDistributionChart reviews={filteredReviews} />
          </>
        );

      case "Evidence Completeness Report":
        return (
          <>
            <div style={styles.twoColGrid}>
              <EvidenceBreakdownChart
                complete={completeEvidencePct}
                pending={pendingEvidencePct}
                missing={missingEvidencePct}
              />
              <AuditReadinessCard
                readiness={readiness}
                linkedEvidencePercent={linkedEvidencePercent}
                transactionsCount={transactionsCount}
                evidenceCount={evidenceCount}
              />
            </div>
            <EvidenceCompletenessTable data={incompleteTransactions} />
          </>
        );

      case "High-Risk Transactions":
        return <HighRiskTransactionsTable data={filteredHighRisk} />;

      case "Compliance Exposure":
        return (
          <>
            <div style={styles.twoColGrid}>
              <OutstandingIssuesCard
                verificationProblems={verificationProblems}
                complianceIssues={complianceIssues}
                fraudFlags={fraudFlags}
                controlViolations={controlViolations}
              />
              <RiskDistributionChart reviews={filteredReviews.filter(
                (r) => r.type === "Compliance Issues" || r.type === "Control Violations"
              )} />
            </div>
            <ComplianceExposureTable data={complianceExposure.filter(
              (r) => severity === "All" || r.risk === severity
            )} />
          </>
        );

      case "Fraud & Duplicate Alerts":
        return (
          <FraudAlertsTable data={fraudAlerts.filter(
            (r) => severity === "All" || r.risk === severity
          )} />
        );

      case "Internal Audit Findings":
        return (
          <InternalAuditFindingsTable data={MOCK_REVIEW_QUEUE.filter(
            (r) => severity === "All" || r.risk === severity
          )} />
        );

      default:
        return null;
    }
  };

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
          <div style={styles.reportHeader}>
            <h2 style={styles.reportTitle}>{activeReport}</h2>
            <p style={styles.reportSubtitle}>Mock data report — filters apply to the active view</p>
          </div>
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: theme.spacing.lg, background: theme.colors.appBackground, minHeight: "100vh" },
  layout: { display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "start" },
  content: { display: "flex", flexDirection: "column", gap: 20 },
  reportHeader: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "18px 22px" },
  reportTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" },
  reportSubtitle: { margin: "6px 0 0", fontSize: 13, color: "#64748b" },
  topGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },
  twoColGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
};

"use client";

import { useEffect, useMemo, useState } from "react";

import ReportsToolbar from "@/components/reports/ReportsToolbar";
import ReportsSidebar from "@/components/reports/ReportsSidebar";

import AuditReadinessCard from "@/components/reports/AuditReadinessCard";
import EvidenceBreakdownChart from "@/components/reports/EvidenceBreakdownChart";
import OutstandingIssuesCard from "@/components/reports/OutstandingIssuesCard";
import RiskDistributionChart from "@/components/reports/RiskDistributionChart";

import HighRiskTransactionsTable from "@/components/reports/HighRiskTransactionsTable";
import FraudAlertsTable from "@/components/reports/FraudAlertsTable";

import { getTransactions, getEvidence, getReviewQueue, type TransactionResponse, type EvidenceResponse, type ReviewQueueResponse, type IssueType } from "@/utils/api";
import type { ReviewItem } from "@/lib/reviewEngine";

import { theme } from "@/styles/theme";

const issueTypeLabel: Record<IssueType, ReviewItem["type"]> = {
  MISSING_EVIDENCE: "Missing Evidence",
  COMPLIANCE_ISSUE: "Compliance Issues",
  RISK_FLAG: "AI / Risk Flags",
  VERIFICATION_PROBLEM: "Verification Problems",
};

const issueRisk: Record<IssueType, ReviewItem["risk"]> = {
  MISSING_EVIDENCE: "Critical",
  COMPLIANCE_ISSUE: "Critical",
  RISK_FLAG: "Critical",
  VERIFICATION_PROBLEM: "Medium",
};

const statusLabel: Record<string, ReviewItem["status"]> = {
  OPEN: "Open",
  RESOLVED: "Resolved",
  ESCALATED: "Escalated",
};

function toReviewItem(item: ReviewQueueResponse): ReviewItem {
  const risk = issueRisk[item.issueType] ?? "Medium";
  return {
    id: item.id,
    type: issueTypeLabel[item.issueType] ?? "System Errors",
    transactionId: item.transactionId,
    amount: "—",
    risk,
    severity: risk,
    due: item.createdAt ? item.createdAt.split("T")[0] : "—",
    status: statusLabel[item.status] ?? "Open",
  };
}

export default function ReportsPage() {
  const [severity, setSeverity] = useState("All");
  const [activeReport, setActiveReport] = useState("Audit Readiness");

  const [txData, setTxData] = useState<TransactionResponse[]>([]);
  const [evData, setEvData] = useState<EvidenceResponse[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orgId = localStorage.getItem("organisationId") ?? undefined;
    Promise.all([
      getTransactions(orgId),
      getEvidence(orgId),
      getReviewQueue(orgId ?? ""),
    ])
      .then(([txRes, evRes, rqRes]) => {
        setTxData(txRes.data ?? []);
        setEvData(evRes.data ?? []);
        setReviews((rqRes.data ?? []).map(toReviewItem));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => severity === "All" || r.risk === severity);
  }, [reviews, severity]);

  const transactionsCount = txData.length;
  const evidenceCount = evData.length;

  const linkedTransactions = txData.filter((tx) =>
    evData.some((ev) => Number(ev.transactionId) === Number(tx.id))
  ).length;

  const linkedEvidencePercent =
    transactionsCount > 0
      ? Math.round((linkedTransactions / transactionsCount) * 100)
      : 0;

  const criticalIssues = filteredReviews.filter((r) => r.risk === "Critical").length;

  const readiness = Math.max(0, Math.min(100, linkedEvidencePercent - criticalIssues * 2));

  const completeEvidence = txData.filter((tx) => tx.evidenceStatus === "COMPLETE").length;
  const pendingEvidence = txData.filter((tx) => tx.evidenceStatus === "PARTIAL").length;
  const missingEvidence = txData.filter((tx) => tx.evidenceStatus === "MISSING").length;

  const verificationProblems = filteredReviews.filter((r) => r.type === "Verification Problems").length;
  const complianceIssues = filteredReviews.filter((r) => r.type === "Compliance Issues").length;
  const fraudFlags = filteredReviews.filter((r) => r.type === "AI / Risk Flags").length;
  const controlViolations = filteredReviews.filter((r) => r.type === "Control Violations").length;

  const highRiskTransactions = txData.filter(
    (tx) => tx.evidenceStatus === "MISSING" || (tx as any).riskScore >= 80
  );

  const fraudAlerts = filteredReviews.filter((r) => r.type === "AI / Risk Flags");

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading reports…</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <ReportsToolbar severity={severity} setSeverity={setSeverity} />

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
  page: {
    padding: theme.spacing.lg,
    background: theme.colors.appBackground,
    minHeight: "100vh",
  },
  layout: { display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "start" },
  content: { display: "flex", flexDirection: "column", gap: 20 },
  topGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },
  tables: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
};

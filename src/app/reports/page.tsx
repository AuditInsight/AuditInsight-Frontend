// app/reports/page.tsx

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

import { transactionsData } from "@/data/transactions.data";
import { evidenceData } from "@/data/evidence.data";

import { buildReviewQueue } from "@/lib/reviewEngine";

import { theme } from "@/styles/theme";

export default function ReportsPage() {
  /* =========================
     FILTER STATE
  ========================= */
  const [severity, setSeverity] =
    useState<string>("All");

  const [activeReport, setActiveReport] =
    useState<string>("Audit Readiness");

  /* =========================
     BUILD REVIEW QUEUE
  ========================= */
  const reviews = useMemo(() => {
    return buildReviewQueue(
      transactionsData,
      evidenceData
    );
  }, []);

  /* =========================
     FILTERED REVIEWS
  ========================= */
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (
        severity !== "All" &&
        r.risk !== severity
      ) {
        return false;
      }

      return true;
    });
  }, [reviews, severity]);

  /* =========================
     AUDIT READINESS METRICS
  ========================= */
  const transactionsCount =
    transactionsData.length;

  const evidenceCount = evidenceData.length;

  const linkedTransactions = transactionsData.filter(
    (tx) =>
      evidenceData.some(
        (ev) =>
          Number(ev.transactionId) ===
          Number(tx.id)
      )
  ).length;

  const linkedEvidencePercent = Math.round(
    (linkedTransactions /
      transactionsCount) *
      100
  );

  const criticalIssues = filteredReviews.filter(
    (r) => r.risk === "Critical"
  ).length;

  const readiness = Math.max(
    0,
    Math.min(
      100,
      linkedEvidencePercent -
        criticalIssues * 2
    )
  );

  /* =========================
     EVIDENCE BREAKDOWN
  ========================= */
  const completeEvidence =
    evidenceData.filter(
      (e) =>
        e.status === "Verified"
    ).length;

  const pendingEvidence =
    evidenceData.filter(
      (e) =>
        e.status === "Pending"
    ).length;

  const missingEvidence =
    transactionsCount -
    linkedTransactions;

  /* =========================
     OUTSTANDING ISSUES
  ========================= */
  const verificationProblems =
    filteredReviews.filter(
      (r) =>
        r.type ===
        "Verification Problems"
    ).length;

  const complianceIssues =
    filteredReviews.filter(
      (r) =>
        r.type ===
        "Compliance Issues"
    ).length;

  const fraudFlags =
    filteredReviews.filter(
      (r) =>
        r.type ===
        "AI / Risk Flags"
    ).length;

  const controlViolations =
    filteredReviews.filter(
      (r) =>
        r.type ===
        "Control Violations"
    ).length;

  /* =========================
     HIGH RISK TRANSACTIONS
  ========================= */
  const highRiskTransactions =
    transactionsData.filter(
      (tx) => tx.riskScore >= 80
    );

  /* =========================
     FRAUD ALERTS
  ========================= */
  const fraudAlerts =
    filteredReviews.filter(
      (r) =>
        r.type ===
        "AI / Risk Flags"
    );

  return (
    <div style={styles.page}>
      {/* =========================
          TOOLBAR
      ========================= */}
      <ReportsToolbar
        severity={severity}
        setSeverity={setSeverity}
      />

      {/* =========================
          LAYOUT
      ========================= */}
      <div style={styles.layout}>
        {/* =========================
            SIDEBAR
        ========================= */}
        <ReportsSidebar
          active={activeReport}
          setActive={setActiveReport}
        />

        {/* =========================
            MAIN CONTENT
        ========================= */}
        <div style={styles.content}>
          {/* =========================
              TOP CARDS
          ========================= */}
          <div style={styles.topGrid}>
            <AuditReadinessCard
              readiness={readiness}
              linkedEvidencePercent={
                linkedEvidencePercent
              }
              transactionsCount={
                transactionsCount
              }
              evidenceCount={evidenceCount}
            />

            <EvidenceBreakdownChart
              complete={completeEvidence}
              pending={pendingEvidence}
              missing={missingEvidence}
            />

            <OutstandingIssuesCard
              verificationProblems={
                verificationProblems
              }
              complianceIssues={
                complianceIssues
              }
              fraudFlags={fraudFlags}
              controlViolations={
                controlViolations
              }
            />
          </div>

          {/* =========================
              CHARTS
          ========================= */}
          <RiskDistributionChart
            reviews={filteredReviews}
          />

          {/* =========================
              TABLES
          ========================= */}
          <div style={styles.tables}>
            <HighRiskTransactionsTable
              data={highRiskTransactions}
            />

            <FraudAlertsTable
              data={fraudAlerts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles: Record<
  string,
  React.CSSProperties
> = {
  page: {
    padding: theme.spacing.lg,
    background:
      theme.colors.appBackground,
    minHeight: "100vh",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 20,
    alignItems: "start",
  },

  content: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  topGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: 20,
  },

  tables: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: 20,
  },
};
"use client";

import { useMemo } from "react";
import { MOCK_TRANSACTIONS } from "@/mock/transactions.mock";
import { MOCK_EVIDENCE } from "@/mock/evidence.mock";
import { MOCK_REVIEW_QUEUE } from "@/mock/reviewQueue.mock";

/*
 * ── REAL API (commented for RBAC UI testing) ──────────────────
 * import { getTransactions, getEvidence, getReviewQueue } from "@/utils/api";
 * ──────────────────────────────────────────────────────────────
 */

export function useReports() {
  const transactions = MOCK_TRANSACTIONS;
  const evidence = MOCK_EVIDENCE;
  const reviews = MOCK_REVIEW_QUEUE;

  const stats = useMemo(() => {
    const transactionsCount = transactions.length;
    const evidenceCount = evidence.length;

    const linkedTransactions = transactions.filter((tx) =>
      evidence.some((ev) => String(ev.transactionId) === String(tx.id))
    ).length;

    const linkedEvidencePercent =
      transactionsCount > 0 ? Math.round((linkedTransactions / transactionsCount) * 100) : 0;

    const criticalIssues = reviews.filter((r) => r.risk === "Critical").length;
    const readiness = Math.max(0, Math.min(100, linkedEvidencePercent - criticalIssues * 2));

    const completeEvidence = transactions.filter((tx) => tx.evidenceStatus === "COMPLETE").length;
    const pendingEvidence = transactions.filter((tx) => tx.evidenceStatus === "PARTIAL").length;
    const missingEvidence = transactions.filter((tx) => tx.evidenceStatus === "MISSING").length;
    const incompleteTransactions = transactions.filter((tx) => tx.evidenceStatus !== "COMPLETE");

    const totalTx = transactionsCount || 1;
    const completeEvidencePct = Math.round((completeEvidence / totalTx) * 100);
    const pendingEvidencePct = Math.round((pendingEvidence / totalTx) * 100);
    const missingEvidencePct = Math.round((missingEvidence / totalTx) * 100);

    const verificationProblems = reviews.filter((r) => r.type === "Verification Problems").length;
    const complianceIssues = reviews.filter((r) => r.type === "Compliance Issues").length;
    const fraudFlags = reviews.filter((r) => r.type === "AI / Risk Flags").length;
    const controlViolations = reviews.filter((r) => r.type === "Control Violations").length;

    const highRiskTransactions = transactions.filter(
      (tx) => tx.evidenceStatus === "MISSING" || (tx.riskScore ?? 0) >= 80
    );
    const fraudAlerts = reviews.filter((r) => r.type === "AI / Risk Flags");
    const complianceExposure = reviews.filter(
      (r) => r.type === "Compliance Issues" || r.type === "Control Violations"
    );

    return {
      transactionsCount, evidenceCount, linkedEvidencePercent, readiness,
      completeEvidence, pendingEvidence, missingEvidence,
      completeEvidencePct, pendingEvidencePct, missingEvidencePct,
      incompleteTransactions,
      verificationProblems, complianceIssues, fraudFlags, controlViolations,
      highRiskTransactions, fraudAlerts, complianceExposure, reviews,
    };
  }, []);

  return { ...stats, loading: false };
}

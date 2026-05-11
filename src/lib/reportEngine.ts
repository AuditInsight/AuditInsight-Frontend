import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { ReviewItem } from "@/lib/reviewEngine";

interface ReportData {
  readinessScore: number;

  totalTransactions: number;
  totalEvidence: number;

  linkedEvidencePercent: number;

  completeEvidence: number;
  pendingEvidence: number;
  missingEvidence: number;

  criticalIssues: number;
  mediumIssues: number;
  lowIssues: number;

  outstandingIssues: number;

  highRiskTransactions: Transaction[];

  fraudFlags: ReviewItem[];
}

export function buildReports(
  transactions: Transaction[],
  evidence: Evidence[],
  reviews: ReviewItem[]
): ReportData {
  const totalTransactions = transactions.length;

  const totalEvidence = evidence.length;

  // =========================
  // LINKED EVIDENCE
  // =========================

  const transactionsWithEvidence =
    transactions.filter((tx) =>
      evidence.some(
        (e) =>
          Number(e.transactionId) === Number(tx.id)
      )
    ).length;

  const linkedEvidencePercent =
    totalTransactions === 0
      ? 0
      : Math.round(
          (transactionsWithEvidence /
            totalTransactions) *
            100
        );

  // =========================
  // EVIDENCE STATUS
  // =========================

  const completeEvidence = evidence.filter(
    (e) => e.status === "Verified"
  ).length;

  const pendingEvidence = evidence.filter(
    (e) => e.status === "Pending"
  ).length;

  const missingEvidence =
    totalTransactions - transactionsWithEvidence;

  // =========================
  // RISK
  // =========================

  const criticalIssues = reviews.filter(
    (r) => r.risk === "Critical"
  ).length;

  const mediumIssues = reviews.filter(
    (r) => r.risk === "Medium"
  ).length;

  const lowIssues = reviews.filter(
    (r) => r.risk === "Low"
  ).length;

  // =========================
  // OUTSTANDING
  // =========================

  const outstandingIssues = reviews.filter(
    (r) => r.status !== "Resolved"
  ).length;

  // =========================
  // HIGH RISK
  // =========================

  const highRiskTransactions =
    transactions.filter(
      (tx) => tx.riskScore >= 80
    );

  // =========================
  // FRAUD FLAGS
  // =========================

  const fraudFlags = reviews.filter(
    (r) => r.type === "AI / Risk Flags"
  );

  // =========================
  // READINESS SCORE
  // =========================

  const readinessScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        linkedEvidencePercent -
          criticalIssues * 2 -
          missingEvidence
      )
    )
  );

  return {
    readinessScore,

    totalTransactions,
    totalEvidence,

    linkedEvidencePercent,

    completeEvidence,
    pendingEvidence,
    missingEvidence,

    criticalIssues,
    mediumIssues,
    lowIssues,

    outstandingIssues,

    highRiskTransactions,

    fraudFlags,
  };
}
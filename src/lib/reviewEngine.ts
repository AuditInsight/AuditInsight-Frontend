import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { findDuplicateIds } from "@/lib/transactionMetrics";

export interface ReviewItem {
  id: string;
  type: "Missing Evidence" | "Duplicate Transaction" | "Verification Problems";
  transactionId: string | number;
  counterparty?: string;
  amount: string;
  risk: "Critical" | "Medium" | "Low";
  severity?: "Critical" | "Medium" | "Low";
  due: string;
  status: "Open" | "In Review" | "Resolved" | "Escalated";
  transactionType?: string;
}

function mapSeverity(risk: ReviewItem["risk"]) {
  return risk;
}

export function buildReviewQueue(
  transactions: Transaction[],
  evidences: Evidence[]
): ReviewItem[] {
  const reviews: ReviewItem[] = [];
  const dupes = findDuplicateIds(transactions);

  transactions.forEach((tx) => {
    const relatedEvidence = evidences.filter((e) => e.transactionId === tx.id);

    if (relatedEvidence.length === 0) {
      const risk: ReviewItem["risk"] = "Critical";
      reviews.push({
        id: `missing-${tx.id}`,
        type: "Missing Evidence",
        transactionId: tx.id,
        counterparty: tx.counterparty,
        amount: `RWF ${tx.amount.toLocaleString()}`,
        risk,
        severity: mapSeverity(risk),
        due: tx.date,
        status: "Open",
        transactionType: tx.type,
      });
    }

    const pendingEvidence = relatedEvidence.some((e) => e.status === "Pending");
    if (pendingEvidence) {
      const risk: ReviewItem["risk"] = "Medium";
      reviews.push({
        id: `verify-${tx.id}`,
        type: "Verification Problems",
        transactionId: tx.id,
        counterparty: tx.counterparty,
        amount: `RWF ${tx.amount.toLocaleString()}`,
        risk,
        severity: mapSeverity(risk),
        due: tx.date,
        status: "In Review",
        transactionType: tx.type,
      });
    }

    if (dupes.has(tx.id)) {
      const risk: ReviewItem["risk"] = "Medium";
      reviews.push({
        id: `duplicate-${tx.id}`,
        type: "Duplicate Transaction",
        transactionId: tx.id,
        counterparty: tx.counterparty,
        amount: `RWF ${tx.amount.toLocaleString()}`,
        risk,
        severity: mapSeverity(risk),
        due: tx.date,
        status: "Open",
        transactionType: tx.type,
      });
    }
  });

  return reviews;
}

import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";

export interface ReviewItem {
  id: string;

  type:
    | "Missing Evidence"
    | "Verification Problems"
    | "Compliance Issues"
    | "Control Violations"
    | "AI / Risk Flags"
    | "System Errors";

  transactionId: number;

  counterparty: string;

  amount: string;

  risk: "Critical" | "Medium" | "Low";

  // ✅ FIX: add severity (no removal, no change to risk)
  severity?: "Critical" | "Medium" | "Low";

  due: string;

  status:
    | "Open"
    | "In Review"
    | "Resolved"
    | "Escalated";

  transactionType?: string;
}

/* =========================
   HELPER (NO STRUCTURE CHANGE)
========================= */
function mapSeverity(risk: "Critical" | "Medium" | "Low") {
  return risk;
}

export function buildReviewQueue(
  transactions: Transaction[],
  evidences: Evidence[]
): ReviewItem[] {
  const reviews: ReviewItem[] = [];

  transactions.forEach((tx) => {
    const relatedEvidence = evidences.filter(
      (e) => Number(e.transactionId) === Number(tx.id)
    );

    /* =========================
       MISSING EVIDENCE
    ========================= */
    if (relatedEvidence.length === 0) {
      const risk: ReviewItem["risk"] = "Critical";

      reviews.push({
        id: `missing-${tx.id}`,
        type: "Missing Evidence",
        transactionId: tx.id,
        counterparty: tx.counterparty,
        amount: `$${tx.amount}`,
        risk,
        severity: mapSeverity(risk), // ✅ FIX ONLY
        due: tx.date,
        status: "Open",
        transactionType: tx.type,
      });
    }

    /* =========================
       VERIFICATION PROBLEMS
    ========================= */
    const pendingEvidence = relatedEvidence.some(
      (e) => e.status === "Pending"
    );

    if (pendingEvidence) {
      const risk: ReviewItem["risk"] = "Medium";

      reviews.push({
        id: `verify-${tx.id}`,
        type: "Verification Problems",
        transactionId: tx.id,
        counterparty: tx.counterparty,
        amount: `$${tx.amount}`,
        risk,
        severity: mapSeverity(risk), // ✅ FIX ONLY
        due: tx.date,
        status: "In Review",
        transactionType: tx.type,
      });
    }

    /* =========================
       AI / RISK FLAGS
    ========================= */
    if (tx.riskScore >= 80) {
      const risk: ReviewItem["risk"] = "Critical";

      reviews.push({
        id: `risk-${tx.id}`,
        type: "AI / Risk Flags",
        transactionId: tx.id,
        counterparty: tx.counterparty,
        amount: `$${tx.amount}`,
        risk,
        severity: mapSeverity(risk), // ✅ FIX ONLY
        due: tx.date,
        status: "Escalated",
        transactionType: tx.type,
      });
    }

    /* =========================
       COMPLIANCE ISSUES
    ========================= */
    if (tx.status === "FLAGGED") {
      const risk: ReviewItem["risk"] = "Critical";

      reviews.push({
        id: `compliance-${tx.id}`,
        type: "Compliance Issues",
        transactionId: tx.id,
        counterparty: tx.counterparty,
        amount: `$${tx.amount}`,
        risk,
        severity: mapSeverity(risk), // ✅ FIX ONLY
        due: tx.date,
        status: "Open",
        transactionType: tx.type,
      });
    }

    /* =========================
       CONTROL VIOLATIONS
    ========================= */
    if (tx.amount > 50000) {
      const risk: ReviewItem["risk"] = "Medium";

      reviews.push({
        id: `control-${tx.id}`,
        type: "Control Violations",
        transactionId: tx.id,
        counterparty: tx.counterparty,
        amount: `$${tx.amount}`,
        risk,
        severity: mapSeverity(risk), // ✅ FIX ONLY
        due: tx.date,
        status: "Open",
        transactionType: tx.type,
      });
    }
  });

  return reviews;
}
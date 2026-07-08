import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { computeTransactionMetrics } from "@/lib/transactionMetrics";

export function computeTransactionStats(
  transactions: Transaction[],
  evidences: Evidence[]
) {
  const metrics = computeTransactionMetrics(transactions, evidences);
  return {
    totalTransactions: metrics.totalTransactions,
    noEvidence: metrics.noEvidence,
    duplicateTransactions: metrics.duplicateTransactions,
    totalEvidence: metrics.totalEvidence,
    completedPercent: metrics.completedPercent,
    completed: metrics.completed,
    pending: metrics.pending,
  };
}



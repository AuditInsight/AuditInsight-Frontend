import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";

export function deriveTransactionStatus(
  txId: string,
  evidence: Evidence[]
): Transaction["status"] {
  return evidence.filter((e) => e.transactionId === txId).length >= 1
    ? "COMPLETED"
    : "PENDING";
}

export function enrichTransactions(
  transactions: Transaction[],
  evidence: Evidence[]
): (Transaction & { evidenceCount: number })[] {
  return transactions.map((t) => {
    const evidenceCount = evidence.filter((e) => e.transactionId === t.id).length;
    return {
      ...t,
      evidenceCount,
      status: deriveTransactionStatus(t.id, evidence),
    };
  });
}

/** Same amount + counterparty within the organisation account */
export function findDuplicateIds(transactions: Transaction[]): Set<string> {
  const seen = new Map<string, string>();
  const dupes = new Set<string>();
  for (const t of transactions) {
    const key = `${t.amount}-${t.counterparty.toLowerCase()}`;
    if (seen.has(key)) {
      dupes.add(t.id);
      dupes.add(seen.get(key)!);
    } else {
      seen.set(key, t.id);
    }
  }
  return dupes;
}

export interface TransactionMetrics {
  totalTransactions: number;
  noEvidence: number;
  duplicateTransactions: number;
  totalEvidence: number;
  completedPercent: number;
  completed: number;
  pending: number;
}

export function computeTransactionMetrics(
  transactions: Transaction[],
  evidence: Evidence[]
): TransactionMetrics {
  const enriched = enrichTransactions(transactions, evidence);
  const dupes = findDuplicateIds(enriched);
  const completed = enriched.filter((t) => t.evidenceCount >= 1).length;
  const total = enriched.length;

  return {
    totalTransactions: total,
    noEvidence: enriched.filter((t) => t.evidenceCount === 0).length,
    duplicateTransactions: dupes.size,
    totalEvidence: evidence.length,
    completedPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    completed,
    pending: total - completed,
  };
}

/** Group transactions by YYYY-MM for chart bars */
export function groupTransactionsByMonth(
  transactions: Transaction[]
): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const t of transactions) {
    const month = t.date.slice(0, 7);
    counts.set(month, (counts.get(month) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([label, count]) => ({ label, count }));
}

/** Group evidence uploads by YYYY-MM */
export function groupEvidenceByMonth(
  evidence: Evidence[]
): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const e of evidence) {
    const month = (e.uploadedAt ?? "").slice(0, 7);
    if (!month) continue;
    counts.set(month, (counts.get(month) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([label, count]) => ({ label, count }));
}

export function formatMonthLabel(ym: string): string {
  const [year, month] = ym.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "short" });
}



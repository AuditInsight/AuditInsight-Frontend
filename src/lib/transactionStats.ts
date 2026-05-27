import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";

export function getTodayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isTransactionOnDate(t: Transaction, isoDate: string): boolean {
  return t.date === isoDate;
}

export function isCreatedOnDate(t: Transaction, isoDate: string): boolean {
  if (!t.createdAt) return false;
  return t.createdAt.startsWith(isoDate);
}

export function daysSince(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - d.getTime()) / 86400000);
}

export function isPastDueApproval(t: Transaction): boolean {
  if (t.status !== "PENDING") return false;
  return daysSince(t.date) > 3;
}

export function isHighRisk(t: Transaction): boolean {
  return t.riskScore >= 80;
}

export function computeTransactionStats(
  transactions: Transaction[],
  evidences: Evidence[]
) {
  const today = getTodayISO();

  const transactionsToday = transactions.filter((t) =>
    isTransactionOnDate(t, today)
  ).length;

  const createdToday = transactions.filter((t) =>
    isCreatedOnDate(t, today)
  ).length;

  const verified = evidences.filter((e) => e.status === "Verified").length;
  const missing = evidences.filter((e) => e.status === "Missing").length;

  const flagged = transactions.filter((t) => t.riskScore > 70).length;
  const highRisk = transactions.filter(isHighRisk).length;

  const overdue = transactions.filter(isPastDueApproval).length;

  return {
    transactionsToday,
    createdToday,
    verified,
    missing,
    flagged,
    highRisk,
    overdue,
  };
}

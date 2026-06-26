// ── Transaction status — only two states ──────────────────────────
// PENDING   → transaction exists but has NO evidence attached
// COMPLETED → transaction has at least ONE evidence file attached
export type TransactionStatus = "PENDING" | "COMPLETED";

export type TransactionSource = "MOBILE_MONEY" | "BANK" | "CASH";
export type TransactionType   = "EXPENSE" | "INCOME";

export interface Transaction {
  id: string;
  organisationId?: string;
  name: string;
  counterparty: string;
  date: string;
  amount: number;
  type: TransactionType;
  paymentMethod: TransactionSource;
  // Derived — computed from evidence count, never stored manually
  status: TransactionStatus;
  // Number of attached evidence files — computed from evidence array
  evidenceCount?: number;
  createdBy?: string;
  createdAt?: string;
  notes?: string;
}

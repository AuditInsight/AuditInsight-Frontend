export type TransactionStatus = "COMPLETED" | "PENDING" | "FLAGGED";

export type TransactionSource = "MOBILE_MONEY" | "BANK" | "CASH";

export type TransactionType = "EXPENSE" | "INCOME";

export type EvidenceStatus = "MISSING" | "PARTIAL" | "COMPLETE";

export interface Transaction {
  // Real API fields
  id: string | number;
  organisationId?: string;
  name?: string;
  date: string;
  amount: number;
  type: TransactionType;
  paymentMethod?: TransactionSource;
  status: TransactionStatus;
  evidenceStatus?: EvidenceStatus;
  createdBy?: string;
  createdAt?: string;

  // Legacy mock-data fields (kept optional for pages not yet migrated)
  counterparty?: string;
  source?: TransactionSource;
  riskScore?: number;
  updatedAt?: string;
}

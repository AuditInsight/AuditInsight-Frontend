export type TransactionStatus =
  | "COMPLETED" | "PENDING" | "FLAGGED"
  | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "LOCKED";

export type TransactionSource = "MOBILE_MONEY" | "BANK" | "CASH";
export type TransactionType   = "EXPENSE" | "INCOME";
export type EvidenceStatus    = "MISSING" | "PARTIAL" | "COMPLETE";

export type RiskFlag =
  | "DUPLICATE"
  | "BELOW_APPROVAL_THRESHOLD"
  | "WEEKEND_POSTING"
  | "ROUND_NUMBER"
  | "AFTER_HOURS"
  | "HIGH_AMOUNT";

export interface Transaction {
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
  approvedBy?: string;
  approvedAt?: string;
  lockedPeriod?: string;       // e.g. "2024-03" — if set, transaction is immutable
  chartOfAccount?: string;     // CoA category e.g. "Office Supplies"
  department?: string;
  riskFlags?: RiskFlag[];
  riskScore?: number;
  notes?: string;

  // Legacy
  counterparty?: string;
  source?: TransactionSource;
  updatedAt?: string;
}

export interface ChartOfAccount {
  code: string;
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "INCOME" | "EXPENSE";
  parent?: string;
}

export interface BulkImportRow {
  date: string;
  name: string;
  counterparty: string;
  amount: number;
  type: TransactionType;
  paymentMethod: TransactionSource;
  chartOfAccount?: string;
  notes?: string;
}

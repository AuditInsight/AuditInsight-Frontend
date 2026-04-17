export type TransactionStatus =
  | "COMPLETED"
  | "PENDING"
  | "FLAGGED";

export type TransactionSource =
  | "MOBILE_MONEY"
  | "BANK"
  | "CASH";

export type TransactionType =
  | "EXPENSE"
  | "INCOME";

export interface Transaction {
  id: number;

  date: string;
  amount: number;
  counterparty: string;

  source: TransactionSource;
  type: TransactionType;
  status: TransactionStatus;

  riskScore: number;
}
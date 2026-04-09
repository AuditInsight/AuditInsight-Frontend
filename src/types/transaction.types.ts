export type TransactionStatus =
  | "New"
  | "Reviewed"
  | "Flagged"
  | "Overdue";

export interface Transaction {
  id: string;              // TXN10651
  date: string;
  amount: number;
  counterparty: string;
  source: "Bank" | "Excel";
  type: string;

  // 🔥 CORE AUDIT FIELDS
  evidenceCoverage: number;  // 0–100%
  riskScore: number;         // 0–100%

  status: TransactionStatus;

  // 🔗 RELATION
  evidenceIds: string[];     // links to documents
}
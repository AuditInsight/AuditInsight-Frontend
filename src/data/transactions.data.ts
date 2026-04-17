import { Transaction } from "@/types/transaction.types";

export const transactionsData: Transaction[] = [
  {
    id: 10651,
    date: "2026-04-01",
    amount: 2500,
    counterparty: "ABC Corp",
    source: "BANK",
    type: "EXPENSE",
    status: "COMPLETED",
    riskScore: 60,
  },
  {
    id: 10652,
    date: "2026-04-02",
    amount: 1200,
    counterparty: "MTN Rwanda",
    source: "MOBILE_MONEY",
    type: "EXPENSE",
    status: "PENDING",
    riskScore: 30,
  },
  {
    id: 10653,
    date: "2026-04-03",
    amount: 5000,
    counterparty: "Gov Project",
    source: "CASH",
    type: "INCOME",
    status: "FLAGGED",
    riskScore: 80,
  },
];
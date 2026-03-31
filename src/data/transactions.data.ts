// 👉 We import the type (shape) of a transaction
import { Transaction } from "@/types/transaction.types";

/*
🧠 What is this?

Transaction[] means:
👉 "This is a LIST (array) of transactions"

Each item inside must follow the Transaction type
*/

// 👉 Fake transactions (like a small database)
export const transactionsData: Transaction[] = [
  {
    id: "TXN1001", // string → text
    date: "2026-03-20", // string (date stored as text for now)
    amount: 8520, // number → money
    counterparty: "AFI Distributors", // string
    source: "Bank", // string
    evidence: 80, // number (percentage)
    riskScore: 90, // number
    status: "Flagged", // must match allowed values
  },

  {
    id: "TXN1002",
    date: "2026-03-15",
    amount: 12850,
    counterparty: "ABC Corp",
    source: "Bank",
    evidence: 65,
    riskScore: 90,
    status: "Overdue",
  },

  {
    id: "TXN1003",
    date: "2026-03-18",
    amount: 12950,
    counterparty: "Global Logistics Ltd",
    source: "Excel",
    evidence: 86,
    riskScore: 70,
    status: "Reviewed",
  },

  {
    id: "TXN1004",
    date: "2026-03-10",
    amount: 29870,
    counterparty: "XYZ Solutions",
    source: "Excel",
    evidence: 55,
    riskScore: 77,
    status: "Flagged",
  },

  {
    id: "TXN1005",
    date: "2026-03-12",
    amount: 15900,
    counterparty: "Office Supplies Co.",
    source: "Bank",
    evidence: 50,
    riskScore: 60,
    status: "Overdue",
  },

  {
    id: "TXN1006",
    date: "2026-03-11",
    amount: 15980,
    counterparty: "Atlas Holdings",
    source: "Excel",
    evidence: 70,
    riskScore: 70,
    status: "Flagged",
  },

  {
    id: "TXN1007",
    date: "2026-03-09",
    amount: 4300,
    counterparty: "DEF Enterprises",
    source: "Excel",
    evidence: 40,
    riskScore: 70,
    status: "Flagged",
  },

  {
    id: "TXN1008",
    date: "2026-03-08",
    amount: 29000,
    counterparty: "J&M Agencies",
    source: "Excel",
    evidence: 94,
    riskScore: 81,
    status: "Missing",
  },
];
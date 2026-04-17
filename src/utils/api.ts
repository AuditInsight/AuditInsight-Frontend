import axios from "axios";

/* =========================
   Axios instance
========================= */
const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   Attach JWT automatically
========================= */
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

/* =========================
   Types
========================= */
export interface Transaction {
  id?: number;
  date: string;
  amount: number;
  counterparty: string;
  type: "INCOME" | "EXPENSE";
  source: "BANK" | "MOBILE_MONEY" | "CASH";
  status: "PENDING" | "COMPLETED" | "FLAGGED";
  riskScore: number;
}

/* =========================
   API calls
========================= */
export const getTransactions = () =>
  API.get<Transaction[]>("/transactions");

export const getTransactionById = (id: number) =>
  API.get<Transaction>(`/transactions/${id}`);

export const createTransaction = (data: Transaction) =>
  API.post<Transaction>("/transactions", data);

export default API;
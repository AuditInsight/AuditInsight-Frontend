import axios from "axios";
import { Transaction } from "@/types/transaction.types";

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


/* =========================
   API calls
========================= */
export const getTransactions = () =>
  API.get<Transaction[]>("/transactions");

export const getTransactionById = (id: number) =>
  API.get<Transaction>(`/transactions/${id}`);

export const createTransaction = (data: Omit<Transaction, "id">) =>
  API.post<Transaction>("/transactions", data);
export default API;
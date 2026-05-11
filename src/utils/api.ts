import axios from "axios";
import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";

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
   TRANSACTIONS API
========================= */
export const getTransactions = () =>
  API.get<Transaction[]>("/transactions");

export const getTransactionById = (id: number) =>
  API.get<Transaction>(`/transactions/${id}`);

export const createTransaction = (
  data: Omit<Transaction, "id">
) => API.post<Transaction>("/transactions", data);

/* =========================
   EVIDENCE API
========================= */

// GET all evidence
export const getEvidence = () =>
  API.get<Evidence[]>("/evidence");

// GET evidence by ID
export const getEvidenceById = (id: number) =>
  API.get<Evidence>(`/evidence/${id}`);

// GET evidence linked to transaction
export const getEvidenceByTransaction = (transactionId: number) =>
  API.get<Evidence[]>(`/evidence/transaction/${transactionId}`);

// CREATE new evidence
export const createEvidence = (
  data: Omit<Evidence, "id" | "uploadedAt">
) => API.post<Evidence>("/evidence", data);

export default API;
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

export const updateTransaction = (
  id: number,
  data: Omit<Transaction, "id">
) => API.put<Transaction>(`/transactions/${id}`, data);

export const deleteTransaction = (id: number) =>
  API.delete(`/transactions/${id}`);

/* =========================
   EVIDENCE API
========================= */

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

export const updateEvidence = (
  id: number,
  data: Partial<Evidence>
) => API.put<Evidence>(`/evidence/${id}`, data);

export const deleteEvidence = (id: number) =>
  API.delete(`/evidence/${id}`);

/* =========================
   UPLOAD FILE EVIDENCE
========================= */

export const uploadEvidence = async (
  file: File,
  data: {
    transactionId: number;
    name: string;
    category: string;
    subCategory: string;
    notes: string;
    amount?: number;
    counterpartyName?: string;
  }
) => {
  const formData = new FormData();

  formData.append("file", file);

  formData.append(
    "transactionId",
    String(data.transactionId)
  );

  formData.append("name", data.name);

  formData.append(
    "category",
    data.category
  );

  formData.append(
    "subCategory",
    data.subCategory
  );

  formData.append("notes", data.notes);

  if (data.amount) {
    formData.append(
      "amount",
      String(data.amount)
    );
  }

  if (data.counterpartyName) {
    formData.append(
      "counterpartyName",
      data.counterpartyName
    );
  }

  return API.post(
    "/evidence/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};
export default API;
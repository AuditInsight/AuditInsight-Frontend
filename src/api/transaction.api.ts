// import axios from "axios";

// /* 🔥 Backend DTO (ONLY API LAYER) */
// export type TransactionDTO = {
//   date: string;
//   amount: number;
//   counterparty: string;
//   type: "INCOME" | "EXPENSE";
//   source: "BANK" | "MOBILE_MONEY" | "CASH";
//   status: "PENDING" | "COMPLETED" | "FLAGGED";
//   riskScore: number;
// };

// export interface TransactionResponse extends TransactionDTO {
//   id: number;
// }

// const API = axios.create({
//   baseURL: "http://localhost:8080/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /* 🔥 GET ALL */
// export const getTransactions = () =>
//   API.get<TransactionResponse[]>("/transactions");

// /* 🔥 GET BY ID */
// export const getTransactionById = (id: number) =>
//   API.get<TransactionResponse>(`/transactions/${id}`);

// /* 🔥 CREATE */
// export const createTransaction = (data: TransactionDTO) =>
//   API.post<TransactionResponse>("/transactions", data);

// export default API;
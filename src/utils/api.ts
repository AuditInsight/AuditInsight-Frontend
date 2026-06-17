import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://auditinsight-backend-springboot-production.up.railway.app/api";

/* =========================
   Axios instance
========================= */
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   Attach JWT automatically
========================= */
API.interceptors.request.use((config) => {
  const isAuthEndpoint = config.url?.startsWith("/auth/");
  if (!isAuthEndpoint && typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* =========================
   AUTH TYPES
========================= */
export type UserRole = "CLIENT" | "AUDITOR" | "ADMIN" | "MEMBER";

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  role: UserRole;
  mustChangePassword: boolean;
}

export interface ResponseMessage {
  status: string;
  message: string;
}

/* =========================
   AUTH API
========================= */

export const loginUser = (username: string, password: string, inviteToken?: string) =>
  API.post<LoginResponse>("/auth/login", { username, password, ...(inviteToken ? { inviteToken } : {}) });

export const signUpUser = (data: {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: UserRole;
}) => API.post<ResponseMessage>("/auth/sign-up", data);

export const verifyOtp = (email: string, otp: string) =>
  API.post<ResponseMessage>("/auth/verify-otp", { email, otp });

export const resendOtp = (email: string) =>
  API.post<ResponseMessage>(`/auth/resend-otp?email=${encodeURIComponent(email)}`);

export const changePassword = (currentPassword: string, newPassword: string) =>
  API.patch<ResponseMessage>("/auth/change-password", { currentPassword, newPassword });

/* =========================
   TRANSACTION TYPES
========================= */
export type TransactionType = "INCOME" | "EXPENSE";
export type PaymentMethod = "BANK" | "MOBILE_MONEY" | "CASH";
export type TransactionStatus = "PENDING" | "COMPLETED";
export type EvidenceStatus = "MISSING" | "PARTIAL" | "COMPLETE";

export interface TransactionResponse {
  id: string;
  organisationId: string;
  name: string;
  date: string;
  amount: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  evidenceStatus: EvidenceStatus;
  createdBy: string;
  createdAt: string;
  evidence: EvidenceResponse[];
}

export interface CreateTransactionRequest {
  organisationId: string;
  name: string;
  date: string;
  amount: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
}

/* =========================
   TRANSACTIONS API
========================= */
export const getTransactions = (organisationId?: string) =>
  API.get<TransactionResponse[]>("/transactions", { params: organisationId ? { organisationId } : {} });

export const getTransactionById = (txnId: string) =>
  API.get<TransactionResponse>(`/transactions/${txnId}`);

export const createTransaction = (data: CreateTransactionRequest) =>
  API.post<TransactionResponse>("/transactions", data);

export const updateTransactionStatus = (txnId: string, status: TransactionStatus) =>
  API.patch<TransactionResponse>(`/transactions/${txnId}`, { status });

/* =========================
   EVIDENCE TYPES
========================= */
export interface EvidenceResponse {
  id: string;
  organisationId: string;
  transactionId: string;
  documentName: string;
  folder: string;
  subfolder: string;
  fileUpload: string;
  fileType: string;
  notes: string;
  uploadedBy: number;
  uploadedAt: string;
}

/* =========================
   EVIDENCE API
========================= */
export const getEvidence = (organisationId?: string) =>
  API.get<EvidenceResponse[]>("/evidence", { params: organisationId ? { organisationId } : {} });

export const getEvidenceById = (evidenceId: string) =>
  API.get<EvidenceResponse>(`/evidence/${evidenceId}`);

export const getEvidenceByTransaction = (transactionId: string) =>
  API.get<EvidenceResponse[]>(`/evidence/transaction/${transactionId}`);

export const uploadEvidence = (
  file: File,
  data: {
    organisationId: string;
    transactionId: string;
    documentName: string;
    folder: string;
    subfolder: string;
    notes?: string;
  }
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("organisationId", data.organisationId);
  formData.append("transactionId", data.transactionId);
  formData.append("documentName", data.documentName);
  formData.append("folder", data.folder);
  formData.append("subfolder", data.subfolder);
  if (data.notes) formData.append("notes", data.notes);

  return API.post<EvidenceResponse>("/evidence", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* =========================
   ORGANISATION TYPES
========================= */
export interface Organisation {
  id: string;
  clientId: string;
  name: string;
  industry: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  defaultCurrency: string;
  createdAt: string;
}

export interface OrganisationResponse extends Organisation {
  message: string;
  organisationId: string;
  currencies: string[];
}

/* =========================
   ORGANISATION API
========================= */
export const getMyOrganisations = () =>
  API.get<Organisation[]>("/organisations");

export const getOrganisation = (orgId: string) =>
  API.get<OrganisationResponse>(`/organisations/${orgId}`);

export const createOrganisation = (data: {
  name: string;
  industry?: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  currencies: string[];
}) => API.post<OrganisationResponse>("/organisations", data);

export const updateOrganisation = (orgId: string, data: {
  name?: string;
  industry?: string;
  fiscalYearStart?: string;
  fiscalYearEnd?: string;
  currencies?: string[];
}) => API.put<OrganisationResponse>(`/organisations/${orgId}`, data);

export interface OrganisationMemberResponse {
  userId: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: UserRole;
  status: "ACTIVE" | "PENDING" | "REVOKED";
  joinedAt: string;
}

export const getOrganisationMembers = (orgId: string) =>
  API.get<OrganisationMemberResponse[]>(`/organisations/${orgId}/members`);

export const inviteMember = (orgId: string, email: string, role: UserRole) =>
  API.post<ResponseMessage>(`/organisations/${orgId}/members/invite`, { email, role });

export const removeMember = (orgId: string, userId: number) =>
  API.delete<ResponseMessage>(`/organisations/${orgId}/members/${userId}`);

/* =========================
   REVIEW QUEUE API
========================= */
export type IssueType = "MISSING_EVIDENCE" | "COMPLIANCE_ISSUE" | "RISK_FLAG" | "VERIFICATION_PROBLEM";
export type ReviewStatus = "OPEN" | "RESOLVED" | "ESCALATED";

export interface ReviewQueueResponse {
  id: string;
  organisationId: string;
  transactionId: string;
  issueType: IssueType;
  description: string;
  status: ReviewStatus;
  flaggedBy: string;
  resolvedBy: number;
  resolutionNote: string;
  createdAt: string;
  resolvedAt: string;
}

export const getReviewQueue = (organisationId: string) =>
  API.get<ReviewQueueResponse[]>("/review-queue", { params: { organisationId } });

export const flagIssue = (data: {
  organisationId: string;
  transactionId: string;
  issueType: IssueType;
  description: string;
}) => API.post<ReviewQueueResponse>("/review-queue", data);

export const resolveIssue = (itemId: string, resolutionNote: string) =>
  API.patch<ReviewQueueResponse>(`/review-queue/${itemId}/resolve`, { resolutionNote });

/* =========================
   PROFILE API
========================= */
export const getClientProfile = () => API.get("/client/profile");
export const getAuditorProfile = () => API.get("/auditor/profile");

/* =========================
   LEGACY STUBS (no-op — these endpoints don't exist in the API)
========================= */
export const deleteTransaction = (_id: unknown) =>
  Promise.reject(new Error("Delete transaction is not supported"));

export const updateTransaction = (_id: unknown, _data: unknown) =>
  Promise.reject(new Error("Use updateTransactionStatus instead"));

export const deleteEvidence = (_id: unknown) =>
  Promise.reject(new Error("Delete evidence is not supported"));

export const updateEvidence = (_id: unknown, _data: unknown): Promise<{ data: EvidenceResponse }> =>
  Promise.reject(new Error("Update evidence is not supported"));

export default API;

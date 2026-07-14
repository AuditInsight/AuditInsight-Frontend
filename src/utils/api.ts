/**
 * api.ts — All backend API calls for AuditInsight.
 * Every function calls the real backend via apiClient (which handles
 * Bearer token injection and the 401 refresh queue automatically).
 */

import { apiClient } from "@/api/client";

// ── Re-export types consumed by the rest of the app ───────────────
export type { BackendRole as UserRole, BackendRole } from "@/types/auth";

/* =========================
   AUTH TYPES
========================= */
export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  refreshToken: string;
  role: string;
  mustChangePassword: boolean;
}

export interface ResponseMessage {
  status: string;
  message: string;
}

/* =========================
   AUTH API
========================= */
export const loginUser = (
  username: string,
  password: string,
  inviteToken?: string
) =>
  apiClient.post<LoginResponse>("/auth/login", {
    username,
    password,
    ...(inviteToken ? { inviteToken } : {}),
  });

export const signUpUser = (data: {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: string;
}) => apiClient.post<ResponseMessage>("/auth/sign-up", data);

export const verifyOtp = (email: string, otp: string) =>
  apiClient.post<ResponseMessage>("/auth/verify-otp", { email, otp });

export const resendOtp = (email: string) =>
  apiClient.post<ResponseMessage>(
    `/auth/resend-otp?email=${encodeURIComponent(email)}`
  );

export const changePassword = (
  currentPassword: string,
  newPassword: string
) =>
  apiClient.patch<ResponseMessage>("/auth/change-password", {
    currentPassword,
    newPassword,
  });

/* =========================
   TRANSACTION TYPES
========================= */
export type TransactionType   = "INCOME" | "EXPENSE";
export type PaymentMethod     = "BANK" | "MOBILE_MONEY" | "CASH";
export type TransactionStatus = "PENDING" | "COMPLETED";
export type EvidenceStatus    = "MISSING" | "PARTIAL" | "COMPLETE";

export interface TransactionResponse {
  id: string;
  organisationId: string;
  name: string;
  counterparty?: string;
  date: string;
  amount: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  evidenceStatus: EvidenceStatus;
  createdBy: string;
  createdAt: string;
  notes?: string;
  evidence: EvidenceResponse[];
}

export interface CreateTransactionRequest {
  organisationId: string;
  name: string;
  counterparty: string;         // required by backend
  date: string;                 // ISO date string e.g. "2024-01-15"
  amount: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  // NGO-only — MUST be included for NGO orgs, MUST NOT be sent for PRIVATE
  donor?: string;
  budgetLine?: string;
}

/* =========================
   TRANSACTIONS API
========================= */
export const getTransactions = (organisationId?: string) =>
  apiClient.get<TransactionResponse[]>("/transactions", {
    params: organisationId ? { organisationId } : {},
  });

export const getTransactionById = (txnId: string) =>
  apiClient.get<TransactionResponse>(`/transactions/${txnId}`);

export const createTransaction = (data: CreateTransactionRequest) =>
  apiClient.post<TransactionResponse>("/transactions", data);

// Backend only supports PATCH /{txnId} for status updates — no full PUT endpoint
export const updateTransactionStatus = (
  txnId: string,
  status: TransactionStatus
) =>
  apiClient.patch<TransactionResponse>(`/transactions/${txnId}`, { status });

export const deleteTransaction = (txnId: string) =>
  apiClient.delete<ResponseMessage>(`/transactions/${txnId}`);

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
  apiClient.get<EvidenceResponse[]>("/evidence", {
    params: organisationId ? { organisationId } : {},
  });

export const getEvidenceById = (evidenceId: string) =>
  apiClient.get<EvidenceResponse>(`/evidence/${evidenceId}`);

export const getEvidenceByTransaction = (transactionId: string) =>
  apiClient.get<EvidenceResponse[]>(`/evidence/transaction/${transactionId}`);

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

  return apiClient.post<EvidenceResponse>("/evidence", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteEvidence = (evidenceId: string) =>
  apiClient.delete<ResponseMessage>(`/evidence/${evidenceId}`);

export const updateEvidence = (
  evidenceId: string,
  data: Partial<Pick<EvidenceResponse, "documentName" | "notes">>
) => apiClient.put<EvidenceResponse>(`/evidence/${evidenceId}`, data);

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

export interface OrganisationMemberResponse {
  userId: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: string;
  status: "ACTIVE" | "PENDING" | "REVOKED";
  joinedAt: string;
}

/* =========================
   ORGANISATION API
========================= */
export const getMyOrganisations = () =>
  apiClient.get<Organisation[]>("/organisations");

export const getOrganisation = (orgId: string) =>
  apiClient.get<OrganisationResponse>(`/organisations/${orgId}`);

export const createOrganisation = (data: {
  name: string;
  industry?: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  currencies: string[];
}) => apiClient.post<OrganisationResponse>("/organisations", data);

export const updateOrganisation = (
  orgId: string,
  data: {
    name?: string;
    industry?: string;
    fiscalYearStart?: string;
    fiscalYearEnd?: string;
    currencies?: string[];
  }
) => apiClient.put<OrganisationResponse>(`/organisations/${orgId}`, data);

export const getOrganisationMembers = (orgId: string) =>
  apiClient.get<OrganisationMemberResponse[]>(
    `/organisations/${orgId}/members`
  );

export const inviteMember = (orgId: string, email: string, role: BackendRole) =>
  apiClient.post<ResponseMessage>(
    `/organisations/${orgId}/members/invite`,
    { email, role }
  );

export const removeMember = (orgId: string, userId: number) =>
  apiClient.delete<ResponseMessage>(
    `/organisations/${orgId}/members/${userId}`
  );

/* =========================
   REVIEW QUEUE TYPES
========================= */
export type IssueType   = "MISSING_EVIDENCE" | "COMPLIANCE_ISSUE" | "RISK_FLAG" | "VERIFICATION_PROBLEM";
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

/* =========================
   REVIEW QUEUE API
========================= */
export const getReviewQueue = (organisationId: string) =>
  apiClient.get<ReviewQueueResponse[]>("/review-queue", {
    params: { organisationId },
  });

export const flagIssue = (data: {
  organisationId: string;
  transactionId: string;
  issueType: IssueType;
  description: string;
}) => apiClient.post<ReviewQueueResponse>("/review-queue", data);

export const resolveIssue = (itemId: string, resolutionNote: string) =>
  apiClient.patch<ReviewQueueResponse>(`/review-queue/${itemId}/resolve`, {
    resolutionNote,
  });

/* =========================
   PROFILE API
========================= */
export const getClientProfile  = () => apiClient.get("/client/profile");
export const getAuditorProfile = () => apiClient.get("/auditor/profile");

export default apiClient;



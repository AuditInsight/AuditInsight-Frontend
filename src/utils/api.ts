/**
 * api.ts — All backend API calls for AuditInsight.
 * Every function calls the real backend via apiClient (which handles
 * Bearer token injection and the 401 refresh queue automatically).
 */

import { apiClient } from "@/api/client";
import type { BackendRole } from "@/types/auth";
import { normalizeOrganisationId } from "@/utils/organisationId";

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

export const updateClientProfile = (data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}) => apiClient.patch<ResponseMessage>("/client/profile", data);

/* =========================
   TRANSACTION TYPES
======================== */
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
  counterparty: string;
  date: string;
  amount: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  donor?: string;
  budgetLine?: string;
}

/* =========================
   TRANSACTIONS API
========================= */
export const getTransactions = (organisationId?: string) => {
  const safeOrgId = normalizeOrganisationId(organisationId);
  return apiClient.get<TransactionResponse[]>("/transactions", {
    params: safeOrgId ? { organisationId: safeOrgId } : {},
  });
};

export const getTransactionById = (txnId: string) =>
  apiClient.get<TransactionResponse>(`/transactions/${txnId}`);

export const createTransaction = (data: CreateTransactionRequest) =>
  apiClient.post<TransactionResponse>("/transactions", data);

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
export const getEvidence = (organisationId?: string) => {
  const safeOrgId = normalizeOrganisationId(organisationId);
  return apiClient.get<EvidenceResponse[]>("/evidence", {
    params: safeOrgId ? { organisationId: safeOrgId } : {},
  });
};

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

  return apiClient.post<EvidenceResponse>("/evidence", formData);
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

export const getOrganisation = (orgId: string) => {
  const safeOrgId = normalizeOrganisationId(orgId);
  if (!safeOrgId) throw new Error("Invalid organisation id.");
  return apiClient.get<OrganisationResponse>(`/organisations/${safeOrgId}`);
};

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

export const getOrganisationMembers = (orgId: string) => {
  const safeOrgId = normalizeOrganisationId(orgId);
  if (!safeOrgId) throw new Error("Invalid organisation id.");
  return apiClient.get<OrganisationMemberResponse[]>(
    `/organisations/${safeOrgId}/members`
  );
};

export const inviteMember = (orgId: string, email: string, role: BackendRole) => {
  const safeOrgId = normalizeOrganisationId(orgId);
  if (!safeOrgId) throw new Error("Invalid organisation id.");
  return apiClient.post<ResponseMessage>(
    `/organisations/${safeOrgId}/members/invite`,
    { email, role }
  );
};

export const removeMember = (orgId: string, userId: number) => {
  const safeOrgId = normalizeOrganisationId(orgId);
  if (!safeOrgId) throw new Error("Invalid organisation id.");
  return apiClient.delete<ResponseMessage>(
    `/organisations/${safeOrgId}/members/${userId}`
  );
};

/* =========================
   REVIEW QUEUE TYPES
========================= */
export type IssueType    = "MISSING_EVIDENCE" | "COMPLIANCE_ISSUE" | "RISK_FLAG" | "VERIFICATION_PROBLEM";
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
export const getReviewQueue = (organisationId?: string) => {
  const safeOrgId = normalizeOrganisationId(organisationId);
  return apiClient.get<ReviewQueueResponse[]>("/review-queue", {
    params: safeOrgId ? { organisationId: safeOrgId } : {},
  });
};

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

/* =========================
   BILLING & PAYMENT TYPES
========================= */
export type PaymentMethodType = "card" | "momo" | "bank_transfer";
export type PaymentProvider = "stripe" | "momo" | "paypal";
export type SubscriptionStatus = "active" | "past_due" | "cancelled" | "trialing";

export interface PaymentMethodResponse {
  id: string;
  type: PaymentMethodType;
  provider: PaymentProvider;
  isDefault: boolean;
  createdAt: string;
}

export interface CardPaymentMethodResponse extends PaymentMethodResponse {
  type: "card";
  provider: "stripe";
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface MOMOPaymentMethodResponse extends PaymentMethodResponse {
  type: "momo";
  provider: "momo";
  phoneNumber: string;
  network: string;
}

export interface SubscriptionResponse {
  id: string;
  organisationId: string;
  plan: string;
  billingCycle: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  preferredPaymentMethod?: string;
}

export interface PaymentIntentResponse {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface ProcessPaymentRequest {
  paymentMethodId: string;
  amount: number;
  currency?: string;
  planId?: string;
  billingCycle?: string;
  description?: string;
}

export interface ProcessMOMOPaymentRequest {
  phoneNumber: string;
  amount: number;
  currency?: string;
  network: "mtn" | "airtel";
  planId?: string;
  billingCycle?: string;
}

/* =========================
   BILLING & PAYMENT API
========================= */

// Get subscription for current organisation
export const getSubscription = () =>
  apiClient.get<SubscriptionResponse>("/billing/subscription");

// Get all payment methods for current organisation
export const getPaymentMethods = () =>
  apiClient.get<(CardPaymentMethodResponse | MOMOPaymentMethodResponse)[]>("/billing/payment-methods");

// Add a new payment method
export const addPaymentMethod = (data: {
  type: PaymentMethodType;
  provider: PaymentProvider;
  token?: string; // For Stripe card tokens
  phoneNumber?: string; // For MOMO
  network?: string; // For MOMO
}) =>
  apiClient.post<CardPaymentMethodResponse | MOMOPaymentMethodResponse>("/billing/payment-methods", data);

// Delete payment method
export const deletePaymentMethod = (methodId: string) =>
  apiClient.delete<ResponseMessage>(`/billing/payment-methods/${methodId}`);

// Set default payment method
export const setDefaultPaymentMethod = (methodId: string) =>
  apiClient.patch<PaymentMethodResponse>(`/billing/payment-methods/${methodId}/default`, {});

// Process payment with card (Stripe)
export const processCardPayment = (data: ProcessPaymentRequest) =>
  apiClient.post<PaymentIntentResponse>("/billing/payments/card", data);

// Process payment with MOMO
export const processMOMOPayment = (data: ProcessMOMOPaymentRequest) =>
  apiClient.post<{ id: string; status: string; checkoutUrl?: string }>("/billing/payments/momo", data);

// Get payment history
export const getPaymentHistory = () =>
  apiClient.get<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    createdAt: string;
  }[]>("/billing/payments");

// Change subscription plan
export const changePlan = (data: {
  planId: string;
  billingCycle: string;
  paymentMethodId: string;
}) =>
  apiClient.post<SubscriptionResponse>("/billing/subscription/change-plan", data);

// Cancel subscription
export const cancelSubscription = (cancelAtPeriodEnd?: boolean) =>
  apiClient.post<SubscriptionResponse>("/billing/subscription/cancel", {
    cancelAtPeriodEnd: cancelAtPeriodEnd ?? true,
  });

export default apiClient;

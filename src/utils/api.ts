import axios from "axios";

/*
 * ════════════════════════════════════════════════════════════════════
 * API CONFIGURATION (CURRENTLY DISABLED FOR MOCK DATA TESTING)
 * ════════════════════════════════════════════════════════════════════
 * To re-enable API calls, uncomment the code below and remove MOCK data
 * usage from hooks and components. The backend is hosted at:
 * https://auditinsight-backend-springboot-production.up.railway.app/api
 * ════════════════════════════════════════════════════════════════════
 */

/*
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://auditinsight-backend-springboot-production.up.railway.app/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
*/

// Temporary stub for development
const API = axios.create({
  baseURL: "http://localhost:3000/api",
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
   AUTH API (COMMENTED - USING MOCK DATA)
========================= */
/*
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
*/

// Mock stubs for auth (using localStorage instead)
export const loginUser = async (username: string, password: string, _inviteToken?: string) => {
  return Promise.resolve({ data: { status: "success", message: "Mock login", token: "mock_token", role: "CLIENT" as const, mustChangePassword: false } });
};

export const signUpUser = async (_data: any) => {
  return Promise.resolve({ data: { status: "success", message: "Mock signup" } });
};

export const verifyOtp = async (_email: string, _otp: string) => {
  return Promise.resolve({ data: { status: "success", message: "Mock OTP verified" } });
};

export const resendOtp = async (_email: string) => {
  return Promise.resolve({ data: { status: "success", message: "Mock OTP sent" } });
};

export const changePassword = async (_currentPassword: string, _newPassword: string) => {
  return Promise.resolve({ data: { status: "success", message: "Mock password changed" } });
};

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
   TRANSACTIONS API (COMMENTED - USING MOCK DATA)
========================= */
/*
export const getTransactions = (organisationId?: string) =>
  API.get<TransactionResponse[]>("/transactions", { params: organisationId ? { organisationId } : {} });

export const getTransactionById = (txnId: string) =>
  API.get<TransactionResponse>(`/transactions/${txnId}`);

export const createTransaction = (data: CreateTransactionRequest) =>
  API.post<TransactionResponse>("/transactions", data);

export const updateTransactionStatus = (txnId: string, status: TransactionStatus) =>
  API.patch<TransactionResponse>(`/transactions/${txnId}`, { status });
*/

// Mock stubs
export const getTransactions = async (_organisationId?: string) => {
  return Promise.resolve({ data: [] });
};

export const getTransactionById = async (_txnId: string) => {
  return Promise.resolve({ data: {} as TransactionResponse });
};

export const createTransaction = async (_data: CreateTransactionRequest) => {
  return Promise.resolve({ data: {} as TransactionResponse });
};

export const updateTransactionStatus = async (_txnId: string, _status: TransactionStatus) => {
  return Promise.resolve({ data: {} as TransactionResponse });
};

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
   EVIDENCE API (COMMENTED - USING MOCK DATA)
========================= */
/*
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
*/

// Mock stubs
export const getEvidence = async (_organisationId?: string) => {
  return Promise.resolve({ data: [] });
};

export const getEvidenceById = async (_evidenceId: string) => {
  return Promise.resolve({ data: {} as EvidenceResponse });
};

export const getEvidenceByTransaction = async (_transactionId: string) => {
  return Promise.resolve({ data: [] });
};

export const uploadEvidence = async (
  _file: File,
  _data: {
    organisationId: string;
    transactionId: string;
    documentName: string;
    folder: string;
    subfolder: string;
    notes?: string;
  }
) => {
  return Promise.resolve({ data: {} as EvidenceResponse });
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
   ORGANISATION API (COMMENTED - USING MOCK DATA)
========================= */
/*
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

export const getOrganisationMembers = (orgId: string) =>
  API.get<OrganisationMemberResponse[]>(`/organisations/${orgId}/members`);

export const inviteMember = (orgId: string, email: string, role: UserRole) =>
  API.post<ResponseMessage>(`/organisations/${orgId}/members/invite`, { email, role });

export const removeMember = (orgId: string, userId: number) =>
  API.delete<ResponseMessage>(`/organisations/${orgId}/members/${userId}`);
*/

// Mock stubs
export const getMyOrganisations = async () => {
  return Promise.resolve({ data: [] });
};

export const getOrganisation = async (_orgId: string) => {
  return Promise.resolve({ data: {} as OrganisationResponse });
};

export const createOrganisation = async (_data: any) => {
  return Promise.resolve({ data: {} as OrganisationResponse });
};

export const updateOrganisation = async (_orgId: string, _data: any) => {
  return Promise.resolve({ data: {} as OrganisationResponse });
};

export const getOrganisationMembers = async (_orgId: string) => {
  return Promise.resolve({ data: [] });
};

export const inviteMember = async (_orgId: string, _email: string, _role: UserRole) => {
  return Promise.resolve({ data: { status: "success", message: "Mock invite sent" } });
};

export const removeMember = async (_orgId: string, _userId: number) => {
  return Promise.resolve({ data: { status: "success", message: "Mock member removed" } });
};

export interface OrganisationMemberResponse {
  userId: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: UserRole;
  status: "ACTIVE" | "PENDING" | "REVOKED";
  joinedAt: string;
}

/* =========================
   REVIEW QUEUE API (COMMENTED - USING MOCK DATA)
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

/*
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
*/

// Mock stubs
export const getReviewQueue = async (_organisationId: string) => {
  return Promise.resolve({ data: [] });
};

export const flagIssue = async (_data: any) => {
  return Promise.resolve({ data: {} as ReviewQueueResponse });
};

export const resolveIssue = async (_itemId: string, _resolutionNote: string) => {
  return Promise.resolve({ data: {} as ReviewQueueResponse });
};

/* =========================
   PROFILE API (COMMENTED - USING MOCK DATA)
========================= */
/*
export const getClientProfile = () => API.get("/client/profile");
export const getAuditorProfile = () => API.get("/auditor/profile");
*/

// Mock stubs
export const getClientProfile = async () => Promise.resolve({ data: {} });
export const getAuditorProfile = async () => Promise.resolve({ data: {} });

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

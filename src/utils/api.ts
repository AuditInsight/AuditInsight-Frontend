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
  transactionId?: string | null;
  documentName: string;
  folder: string;
  subfolder: string;
  fileUpload: string;
  fileType: string;
  notes: string;
  uploadedBy: number;
  uploadedAt: string;
  /** How many people have signed this document; 0 means Preview/Download use the original file. */
  signatureCount?: number;
  /** True when signing places the signature on the pages (PDF, image, or Word/Excel via PDF conversion). */
  placeable?: boolean;
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
    // Omit to upload a standalone document not linked to any transaction
    transactionId?: string;
    documentName: string;
    folder: string;
    subfolder: string;
    notes?: string;
  }
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("organisationId", data.organisationId);
  if (data.transactionId) formData.append("transactionId", data.transactionId);
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
   E-SIGNATURES (optional — anyone in the org can sign a document without being asked)
========================= */

export interface SignatureResponse {
  id: string;
  evidenceId: string;
  signerId: number;
  signerName: string;
  signerTitle?: string | null;
  typedName?: string | null;
  signatureImage?: string | null;
  signedAt: string;
  /** true when someone asked this person to sign; false when they signed on their own */
  requested: boolean;
}

export interface SignatureRequestResponse {
  id: string;
  evidenceId: string;
  documentName: string;
  organisationId: string;
  requestedBy: number;
  requestedByName: string;
  requestedUserId: number;
  requestedUserName: string;
  message?: string | null;
  status: "PENDING" | "SIGNED" | "DECLINED";
  createdAt: string;
  respondedAt?: string | null;
}

export interface EvidenceSignaturesResponse {
  signatures: SignatureResponse[];
  pendingRequests: SignatureRequestResponse[];
  signedByMe: boolean;
  myPendingRequest: SignatureRequestResponse | null;
}

export const getEvidenceSignatures = (evidenceId: string) =>
  apiClient.get<EvidenceSignaturesResponse>(`/evidence/${evidenceId}/signatures`);

/**
 * Where a signature goes on the document: a box on one page (0-based), as fractions (0..1) of the page as
 * displayed, measured from its top-left corner — so it is the same at any zoom level or screen size.
 */
export interface SignaturePlacement {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const signEvidence = (
  evidenceId: string,
  data: {
    fullName?: string;
    title?: string;
    typedName?: string;
    signatureImage?: string;
    /** Omit to add the signature to the "Signatures" block instead of a chosen position. */
    placements?: SignaturePlacement[];
    /** SHA-256 of the signing-base document the signature was placed on. */
    baseSha256?: string;
  }
) => apiClient.post<SignatureResponse>(`/evidence/${evidenceId}/signatures`, data, { timeout: 30_000 });

/** The exact PDF to place a signature on (current signed version, or the original), with its identity. */
export const getSigningBase = async (
  evidenceId: string
): Promise<{ data: ArrayBuffer; version: number; sha256: string | null }> => {
  try {
    const res = await apiClient.get<ArrayBuffer>(`/evidence/${evidenceId}/signing-base`, {
      responseType: "arraybuffer",
      timeout: 60_000,
    });
    return {
      data: res.data,
      version: Number(res.headers["x-document-version"] ?? 0) || 0,
      sha256: (res.headers["x-document-sha256"] as string | undefined) || null,
    };
  } catch (err) {
    // With responseType "arraybuffer" the error body is bytes too — decode it to surface the server's message.
    const data = (err as { response?: { data?: unknown } })?.response?.data;
    let message = "Could not open the document for signing.";
    if (data instanceof ArrayBuffer) {
      try {
        const body = JSON.parse(new TextDecoder().decode(data)) as { error?: string; message?: string };
        message = body.error ?? body.message ?? message;
      } catch {
        // body was not JSON — keep the generic message
      }
    }
    throw new Error(message);
  }
};

export const requestEvidenceSignatures = (
  evidenceId: string,
  data: { userIds?: number[]; emails?: string[]; message?: string }
) => apiClient.post<SignatureRequestResponse[]>(`/evidence/${evidenceId}/signature-requests`, data);

/** Which stored signed version a file is; the same version always has the same bytes and SHA-256. */
export interface SignedVersionInfo {
  version: number | null;
  sha256: string | null;
}

/** Fetches the stored signed PDF, including the server-provided filename and version identity. */
export const getSignedEvidenceFile = async (
  evidenceId: string,
  fallbackName: string
): Promise<{ blob: Blob; fileName: string } & SignedVersionInfo> => {
  try {
    const res = await apiClient.get<Blob>(`/evidence/${evidenceId}/download-signed`, {
      responseType: "blob",
      timeout: 60_000,
    });
    const disposition = String(res.headers["content-disposition"] ?? "");
    const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
    const fileName = match ? decodeURIComponent(match[1]) : `${fallbackName.replace(/\.[^.]+$/, "")}-signed.pdf`;

    const versionHeader = Number(res.headers["x-document-version"]);
    const version = Number.isFinite(versionHeader) && versionHeader > 0 ? versionHeader : null;
    const sha256 = (res.headers["x-document-sha256"] as string | undefined) || null;

    return { blob: res.data, fileName, version, sha256 };
  } catch (err) {
    // With responseType "blob" the error body is a Blob too — read it to surface the server's message.
    const data = (err as { response?: { data?: unknown } })?.response?.data;
    let message = "Could not load the signed document.";
    if (data instanceof Blob) {
      try {
        const body = JSON.parse(await data.text()) as { error?: string; message?: string };
        message = body.error ?? body.message ?? message;
      } catch {
        // body was not JSON — keep the generic message
      }
    }
    throw new Error(message);
  }
};

/**
 * Downloads the document as a PDF with a signature page (signature, name, email, time of each signer)
 * and saves it in the browser. Throws an Error carrying the server's message (e.g. nobody has signed yet).
 */
export const downloadSignedEvidence = async (evidenceId: string, fallbackName: string): Promise<SignedVersionInfo> => {
  const { blob, fileName, version, sha256 } = await getSignedEvidenceFile(evidenceId, fallbackName);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return { version, sha256 };
};

/* =========================
   DOCUMENT INTEGRITY — original files, version history, verification, audit trail
========================= */

/** Reads the server's message out of a failed blob request (the error body is a Blob too). */
async function blobErrorMessage(err: unknown, fallback: string): Promise<string> {
  const data = (err as { response?: { data?: unknown } })?.response?.data;
  if (data instanceof Blob) {
    try {
      const body = JSON.parse(await data.text()) as { error?: string; message?: string };
      return body.error ?? body.message ?? fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

/**
 * The original upload, served by the API (access-checked, integrity-checked and audited) rather than through a
 * public storage link.
 */
export const getOriginalEvidenceFile = async (
  evidenceId: string,
  fallbackName: string
): Promise<{ blob: Blob; fileName: string; sha256: string | null }> => {
  try {
    const res = await apiClient.get<Blob>(`/evidence/${evidenceId}/original`, {
      responseType: "blob",
      timeout: 60_000,
    });
    const disposition = String(res.headers["content-disposition"] ?? "");
    const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
    return {
      blob: res.data,
      fileName: match ? decodeURIComponent(match[1]) : fallbackName,
      sha256: (res.headers["x-document-sha256"] as string | undefined) || null,
    };
  } catch (err) {
    throw new Error(await blobErrorMessage(err, "Could not load the original document."));
  }
};

export interface DocumentVersionsResponse {
  original: { documentName: string; fileType: string; sha256: string | null; uploadedAt: string };
  versions: { versionNo: number; sha256: string; sizeBytes: number; signatureCount: number; createdAt: string }[];
}

export const getEvidenceVersions = (evidenceId: string) =>
  apiClient.get<DocumentVersionsResponse>(`/evidence/${evidenceId}/versions`);

export interface VerificationResponse {
  result: "ORIGINAL" | "SIGNED_VERSION" | "NO_MATCH";
  sha256: string;
  versionNo: number | null;
  latestVersionNo: number | null;
  latest: boolean;
  signers: { name: string; title?: string | null; signedAt: string }[];
  message: string;
}

/** Checks a copy against the stored original and signed versions. The file is only hashed, never stored. */
export const verifyEvidenceCopy = (evidenceId: string, file: File) => {
  const form = new FormData();
  form.append("file", file);
  return apiClient.post<VerificationResponse>(`/evidence/${evidenceId}/verify`, form, { timeout: 60_000 });
};

export type AuditEventType =
  | "DOCUMENT_UPLOADED" | "SIGNATURE_REQUESTED" | "SIGNATURE_DECLINED" | "SIGNED"
  | "VERSION_STORED" | "SIGNED_COPY_ACCESSED" | "ORIGINAL_ACCESSED" | "VERIFICATION";

export interface AuditEventResponse {
  id: string;
  eventType: AuditEventType;
  actorName?: string | null;
  versionNo?: number | null;
  sha256?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  details?: string | null;
  createdAt: string;
}

export const getEvidenceAuditTrail = (evidenceId: string) =>
  apiClient.get<AuditEventResponse[]>(`/evidence/${evidenceId}/audit-trail`);

/** Which file types are signed by placing the signature on the page (Word/Excel only when conversion is set up). */
export const getSigningCapabilities = () =>
  apiClient.get<{ placeableFileTypes: string[]; officeConversion: boolean }>("/signing/capabilities");

export const getPendingSignatureRequests = () =>
  apiClient.get<SignatureRequestResponse[]>("/signature-requests/pending");

export const declineSignatureRequest = (requestId: string) =>
  apiClient.post<SignatureRequestResponse>(`/signature-requests/${requestId}/decline`);

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
  /** The plan chosen during onboarding, kept so checkout can be completed later. */
  subscriptionType?: SubscriptionType;
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
export type SubscriptionType = "MONTHLY" | "SIX_MONTHS" | "ANNUAL";
export type PaymentProvider = "MOMO" | "CARD";
export type PaymentStatus = "PENDING" | "SUCCESSFUL" | "FAILED" | "CANCELLED" | "EXPIRED" | "UNDERPAID";
export type SubscriptionStatus = "TRIAL" | "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface StartMomoCheckoutRequest {
  subscriptionType: SubscriptionType;
  phoneNumber: string;
}

export interface StartCardCheckoutRequest {
  subscriptionType: SubscriptionType;
}

export interface PaymentStatusResponse {
  paymentId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  expectedAmount: number;
  receivedAmount?: number;
  currency: string;
  subscriptionId?: string;
  failureReason?: string;
}

export interface CardCheckoutResponse {
  paymentId: string;
  checkoutUrl: string;
}

export interface SubscriptionResponse {
  id: string;
  organisationId: string;
  subscriptionType?: SubscriptionType;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
}

export interface PlatformAccessResponse {
  freeAccessEnabled: boolean;
}

/* =========================
   BILLING & PAYMENT API
========================= */

// Start MOMO checkout (pawaPay integration)
export const startMomoCheckout = (organisationId: string, data: StartMomoCheckoutRequest) =>
  apiClient.post<PaymentStatusResponse>(`/subscriptions/${organisationId}/checkout/momo`, data);

// Get MOMO payment status
export const getMomoPaymentStatus = (paymentId: string) =>
  apiClient.get<PaymentStatusResponse>(`/subscriptions/payments/${paymentId}/status`);

// Start card checkout (Flutterwave integration)
export const startCardCheckout = (organisationId: string, data: StartCardCheckoutRequest) =>
  apiClient.post<CardCheckoutResponse>(`/subscriptions/${organisationId}/checkout/card`, data);

// Get active subscription for organisation
export const getActiveSubscription = (organisationId: string) =>
  apiClient.get<SubscriptionResponse>(`/subscriptions/${organisationId}/active`);

export const getPlatformAccess = () =>
  apiClient.get<PlatformAccessResponse>("/platform/access");

/* =========================
   WORKSPACE ACCESS
========================= */

/** Why an organisation can (or cannot) use its workspace right now. Decided by the backend. */
export type AccessBasis = "PAID" | "TRIAL" | "EMERGENCY_OVERRIDE" | "PAYMENT_REQUIRED";

export interface PaidPeriod {
  subscriptionType: SubscriptionType | null;
  startDate: string;
  endDate: string;
  source: "PAYMENT" | "ADMIN_COMPLIMENTARY" | "LEGACY";
}

export interface TrialInfo {
  source: "INDIVIDUAL" | "CAMPAIGN";
  durationDays: number;
  startsAt: string;
  endsAt: string;
  current: boolean;
}

export interface AccessResponse {
  hasAccess: boolean;
  basis: AccessBasis;
  accessUntil: string | null;
  currentPaid: PaidPeriod | null;
  /** Paid time bought but not started yet (e.g. bought during a trial). */
  nextPaid: PaidPeriod | null;
  trial: TrialInfo | null;
  emergencyUntil: string | null;
  requestedPlan: SubscriptionType | null;
}

export const getOrganisationAccess = (organisationId: string) =>
  apiClient.get<AccessResponse>(`/subscriptions/${organisationId}/access`);

export interface TrialOffer {
  active: boolean;
  durationDays: number | null;
}

/** Public: whether new sign-ups currently get a free trial (only while a campaign runs). */
export const getTrialOffer = () => apiClient.get<TrialOffer>("/public/trial-offer");

/* =========================
   PLAN CATALOG TYPES
========================= */
export interface PlanResponse {
  code: SubscriptionType;
  durationDays: number;
  amount: number;
  currency: string;
}

/* =========================
   PLAN CATALOG API
========================= */
// The landing page's pricing section calls this for every visitor, logged in or not, and GET /plans
// requires a token. usePlans falls back to the built-in prices on any error, so a 401 here must not
// redirect the visitor to /log-in.
export const getPlans = () => apiClient.get<PlanResponse[]>("/plans", { skipAuthRedirect: true });

export default apiClient;

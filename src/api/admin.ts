/**
 * admin.ts — Platform admin API calls for AuditInsight.
 * Mirrors utils/api.ts's conventions: raw typed apiClient.<verb>() promises,
 * reusing ResponseMessage for simple mutations. apiClient's baseURL already
 * includes /api, so calls here are /admin/... not /api/admin/....
 */

import { apiClient } from "@/api/client";
import type { ResponseMessage } from "@/utils/api";

/* =========================
   ADMIN TYPES
========================= */
export type AdminRole = "CLIENT" | "AUDITOR" | "ADMIN" | "MEMBER";
export type MemberStatus = "ACTIVE" | "PENDING" | "REVOKED";
export type OrganisationType = "PRIVATE" | "NGO";
export type AdminPaymentProvider = "MOMO" | "CARD";
export type AdminPaymentStatus = "PENDING" | "SUCCESSFUL" | "FAILED" | "CANCELLED" | "EXPIRED" | "UNDERPAID";
export type AdminSubscriptionStatus = "TRIAL" | "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED";
export type AdminSubscriptionType = "MONTHLY" | "SIX_MONTHS" | "ANNUAL";

export interface PageResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminUserOrganisationSummary {
  organisationId: string;
  organisationName: string;
  role: AdminRole;
  status: MemberStatus;
}

export interface AdminUserResponse {
  id: number;
  username: string;
  fullName: string;
  role: AdminRole;
  active: boolean;
  verified: boolean;
  authProvider: string;
  createdAt: string;
  organisations: AdminUserOrganisationSummary[];
}

export interface AdminOrganisationResponse {
  id: string;
  name: string;
  industry: OrganisationType;
  countryCode: string;
  defaultCurrency: string;
  createdAt: string;
  memberCount: number;
  subscriptionStatus: AdminSubscriptionStatus | null;
  subscriptionType: AdminSubscriptionType | null;
  subscriptionEndDate: string | null;
}

export interface AdminMemberResponse {
  userId: number;
  username: string;
  fullName: string;
  role: AdminRole;
  status: MemberStatus;
  joinedAt: string;
}

export interface AdminSubscriptionSummary {
  id: string;
  organisationId: string;
  organisationName: string;
  subscriptionType: AdminSubscriptionType;
  status: AdminSubscriptionStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface AdminPaymentResponse {
  id: string;
  subscriptionType: AdminSubscriptionType;
  provider: AdminPaymentProvider;
  status: AdminPaymentStatus;
  expectedAmount: number;
  receivedAmount: number | null;
  currency: string;
  createdAt: string;
}

export interface AdminOrganisationDetailResponse {
  id: string;
  name: string;
  industry: OrganisationType;
  countryCode: string;
  defaultCurrency: string;
  createdAt: string;
  members: AdminMemberResponse[];
  subscriptionHistory: AdminSubscriptionSummary[];
  payments: AdminPaymentResponse[];
}

export interface AdminChangeSubscriptionRequest {
  subscriptionType: AdminSubscriptionType;
  endDate?: string;
  /** Why the paid time is being changed; stored on the period and in the audit log. */
  reason?: string;
}

export interface AdminPlanPriceResponse {
  subscriptionType: AdminSubscriptionType;
  price: number;
  currency: string;
  durationDays: number;
  updatedByUsername: string | null;
  updatedAt: string | null;
}

export interface AdminUpdatePlanPriceRequest {
  price: number;
  durationDays: number;
}

export interface AdminFreeAccessResponse {
  enabled: boolean;
  startsAt: string | null;
  endsAt: string | null;
  updatedAt: string | null;
  reason: string | null;
}

export interface AdminAuditLogResponse {
  id: string;
  adminUsername: string;
  action: string;
  targetType: string;
  targetId: string;
  beforeState: string | null;
  afterState: string | null;
  reason?: string | null;
  createdAt: string;
}

/* =========================
   ADMIN API — USERS
========================= */
export const getAdminUsers = (params: { page?: number; role?: AdminRole; search?: string } = {}) =>
  apiClient.get<PageResult<AdminUserResponse>>("/admin/users", { params });

export const activateUser = (email: string) =>
  apiClient.patch<ResponseMessage>(`/admin/users/${encodeURIComponent(email)}/activate`);

export const deactivateUser = (email: string) =>
  apiClient.patch<ResponseMessage>(`/admin/users/${encodeURIComponent(email)}/deactivate`);

/* =========================
   ADMIN API — ORGANISATIONS
========================= */
export const getAdminOrganisations = (params: { page?: number; search?: string } = {}) =>
  apiClient.get<PageResult<AdminOrganisationResponse>>("/admin/organisations", { params });

export const getAdminOrganisationDetail = (organisationId: string) =>
  apiClient.get<AdminOrganisationDetailResponse>(`/admin/organisations/${organisationId}`);

export const changeOrganisationSubscription = (
  organisationId: string,
  data: AdminChangeSubscriptionRequest
) =>
  apiClient.patch<AdminSubscriptionSummary>(
    `/admin/organisations/${organisationId}/subscription`,
    data
  );

/* =========================
   ADMIN API — SUBSCRIPTIONS
========================= */
export const getAdminSubscriptions = (params: { page?: number; status?: AdminSubscriptionStatus } = {}) =>
  apiClient.get<PageResult<AdminSubscriptionSummary>>("/admin/subscriptions", { params });

/* =========================
   ADMIN API — PLANS
========================= */
export const getAdminPlans = () => apiClient.get<AdminPlanPriceResponse[]>("/admin/plans");

export const updateAdminPlanPrice = (
  subscriptionType: AdminSubscriptionType,
  data: AdminUpdatePlanPriceRequest
) => apiClient.put<AdminPlanPriceResponse>(`/admin/plans/${subscriptionType}`, data);

export const getAdminFreeAccess = () =>
  apiClient.get<AdminFreeAccessResponse>("/admin/free-access");

export const startAdminFreeAccess = (durationDays: number, reason: string) =>
  apiClient.post<AdminFreeAccessResponse>("/admin/free-access/start", { durationDays, reason });

export const endAdminFreeAccess = (reason?: string) =>
  apiClient.post<AdminFreeAccessResponse>("/admin/free-access/end", reason ? { reason } : {});

export interface EmergencyOverrideDependent {
  organisationId: string;
  name: string;
  nextPaidStart: string | null;
}

/** Organisations that would lose access if the emergency override ended now. */
export const getEmergencyOverrideDependents = () =>
  apiClient.get<EmergencyOverrideDependent[]>("/admin/free-access/dependents");

/* =========================
   ADMIN API — TRIALS
========================= */
export type TrialSource = "INDIVIDUAL" | "CAMPAIGN";
export type TrialGrantStatus = "ACTIVE" | "ENDED" | "REVOKED";
export type TrialEventType = "GRANTED" | "EXTENDED" | "SHORTENED" | "REVOKED" | "ENDED" | "PAID_PERIODS_MOVED";

export interface TrialGrant {
  id: string;
  organisationId: string;
  source: TrialSource;
  campaignId: string | null;
  status: TrialGrantStatus;
  durationDays: number;
  startsAt: string;
  endsAt: string;
  reason: string | null;
  createdAt: string;
  revokedAt: string | null;
  revokeReason: string | null;
}

export interface TrialGrantEvent {
  id: string;
  grantId: string;
  eventType: TrialEventType;
  oldEndsAt: string | null;
  newEndsAt: string | null;
  reason: string | null;
  details: string | null;
  createdAt: string;
}

export interface TrialHistory {
  grants: TrialGrant[];
  events: TrialGrantEvent[];
}

export const getOrganisationTrials = (organisationId: string) =>
  apiClient.get<TrialHistory>(`/admin/organisations/${organisationId}/trials`);

export const grantOrganisationTrial = (organisationId: string, days: number, reason: string) =>
  apiClient.post<TrialGrant>(`/admin/organisations/${organisationId}/trials`, { days, reason });

/** Extend or shorten: newEndsAt is a local date-time without zone, e.g. "2026-12-01T17:00:00". */
export const changeOrganisationTrialEnd = (organisationId: string, newEndsAt: string, reason: string) =>
  apiClient.patch<TrialGrant>(`/admin/organisations/${organisationId}/trials/current`, { newEndsAt, reason });

export const revokeOrganisationTrial = (organisationId: string, reason: string) =>
  apiClient.post<TrialGrant>(`/admin/organisations/${organisationId}/trials/current/revoke`, { reason });

export interface TrialCampaign {
  id: string;
  name: string;
  durationDays: number;
  startsAt: string;
  endsAt: string | null;
  enabled: boolean;
  createdAt: string;
}

export interface TrialCampaignView {
  campaign: TrialCampaign;
  grantsIssued: number;
  grantingNow: boolean;
}

export const getTrialCampaigns = () => apiClient.get<TrialCampaignView[]>("/admin/trial-campaigns");

export const createTrialCampaign = (data: {
  name: string;
  durationDays: number;
  startsAt?: string;
  endsAt?: string;
  reason?: string;
}) => apiClient.post<TrialCampaignView>("/admin/trial-campaigns", data);

export const enableTrialCampaign = (campaignId: string, reason: string) =>
  apiClient.post<TrialCampaignView>(`/admin/trial-campaigns/${campaignId}/enable`, { reason });

export const disableTrialCampaign = (campaignId: string, reason: string) =>
  apiClient.post<TrialCampaignView>(`/admin/trial-campaigns/${campaignId}/disable`, { reason });

/* =========================
   ADMIN API — AUDIT LOG
========================= */
export const getAdminAuditLog = (params: { page?: number } = {}) =>
  apiClient.get<PageResult<AdminAuditLogResponse>>("/admin/audit-log", { params });

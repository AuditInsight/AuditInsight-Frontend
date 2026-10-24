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

export interface AdminAuditLogResponse {
  id: string;
  adminUsername: string;
  action: string;
  targetType: string;
  targetId: string;
  beforeState: string | null;
  afterState: string | null;
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

/* =========================
   ADMIN API — AUDIT LOG
========================= */
export const getAdminAuditLog = (params: { page?: number } = {}) =>
  apiClient.get<PageResult<AdminAuditLogResponse>>("/admin/audit-log", { params });

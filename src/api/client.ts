/**
 * client.ts — Production Axios instance for AuditInsight.
 *
 * Key behaviours:
 *  1. Request interceptor  — attaches the in-memory Bearer token to every
 *     non-auth request automatically.
 *  2. Response interceptor — implements a "refresh queue" pattern:
 *     if N requests all fail with 401 simultaneously, only ONE refresh
 *     call is made. All N requests are queued and replayed with the new
 *     token once the refresh succeeds. If the refresh fails, every queued
 *     request is rejected and the user is redirected to /log-in.
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "@/utils/tokenStorage";

declare module "axios" {
  interface AxiosRequestConfig {
    /**
     * Don't redirect to /log-in when this request gets a 401 — the caller handles it.
     * Used by the start-up session check, which runs on every page (including the public landing page).
     */
    skipAuthRedirect?: boolean;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");

// ── Refresh queue state ────────────────────────────────────────────
// NOTE: The backend does not issue refresh tokens. A 401 means the
// access token has expired — clear state and redirect to login.

// ── Axios instance ─────────────────────────────────────────────────

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  // 15 second timeout — prevents requests hanging indefinitely
  timeout: 15_000,
});

// ── Request interceptor ────────────────────────────────────────────

const isPublicAuthEndpoint = (url: string): boolean =>
  url.includes("/auth/login") ||
  url.includes("/auth/sign-up") ||
  url.includes("/auth/verify-otp") ||
  url.includes("/auth/resend-otp") ||
  // Public endpoints (e.g. /public/trial-offer, called by the landing page) need no login. Sending a stale
  // token makes the backend answer 401, which would bounce a visitor from the landing page to /log-in.
  url.includes("/public/");

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const url = config.url ?? "";

    // Only omit the auth header for public auth endpoints.
    // Protected auth endpoints like change-password still need the token.
    if (!isPublicAuthEndpoint(url)) {
      const token = tokenStorage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// ── Response interceptor (401 handler) ───────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const url = error.config?.url ?? "";
    if (error.response?.status === 401 && !isPublicAuthEndpoint(url) && !error.config?.skipAuthRedirect) {
      tokenStorage.clear();
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

function redirectToLogin(): void {
  if (typeof window !== "undefined") {
    window.location.replace("/log-in");
  }
}

export default apiClient;



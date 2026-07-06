/**
 * auth.ts — Canonical auth types for AuditInsight.
 *
 * DESIGN DECISION: We define BackendRole as the raw string the JWT carries,
 * and FrontendRole as the business-logical label the UI uses everywhere.
 * Nothing outside this file (and the mapper below) should ever reference
 * BackendRole directly — the rest of the app is fully decoupled from the
 * backend's naming conventions.
 */

// ── Organisation type — drives which dashboard and nav the user sees ─
export type OrgType = "NGO" | "PRIVATE";

// ── Raw roles as the backend JWT encodes them ──────────────────────
export type BackendRole = "CLIENT" | "MEMBER" | "AUDITOR" | "ADMIN";

// ── Business-logical roles the UI uses everywhere ─────────────────
// DONOR_REPRESENTATIVE is NGO-only — scoped view to a single donor's projects
export type FrontendRole = "ORG_ADMIN" | "ACCOUNTANT" | "AUDITOR" | "SYSTEM_ADMIN" | "DONOR_REPRESENTATIVE";

/**
 * Maps a backend JWT role to the UI-facing business role.
 * Pure function — no side effects, fully testable.
 */
export function mapBackendRoleToFrontend(role: BackendRole): FrontendRole {
  const map: Record<BackendRole, FrontendRole> = {
    CLIENT:  "ORG_ADMIN",
    MEMBER:  "ACCOUNTANT",
    AUDITOR: "AUDITOR",
    ADMIN:   "SYSTEM_ADMIN",
  };
  return map[role];
}

/**
 * Reverse mapper — needed when sending role values back to the API
 * (e.g. invite member endpoint expects the backend role string).
 */
export function mapFrontendRoleToBackend(role: FrontendRole): BackendRole {
  const map: Record<FrontendRole, BackendRole> = {
    ORG_ADMIN:            "CLIENT",
    ACCOUNTANT:           "MEMBER",
    AUDITOR:              "AUDITOR",
    SYSTEM_ADMIN:         "ADMIN",
    DONOR_REPRESENTATIVE: "MEMBER",  // NGO-only role — maps to MEMBER on backend
  };
  return map[role];
}

// ── JWT payload shape (what we decode from the access token) ───────
export interface JwtPayload {
  sub: string;           // user id (as string in JWT standard)
  email: string;
  fullName?: string;     // may be present in JWT; fallback to email if absent
  role: BackendRole;
  organisationId?: string;
  iat: number;           // issued at (unix seconds)
  exp: number;           // expiry  (unix seconds)
}

// ── The canonical user object the entire UI works with ─────────────
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: FrontendRole;           // always the mapped frontend role
  backendRole: BackendRole;     // kept for API calls that need the raw value
  organisationId?: string;
  organisationName?: string;
  orgType?: OrgType;            // NGO or PRIVATE — set after org fetch post-login
  donorScope?: string | null;   // NGO DONOR_REPRESENTATIVE only
  mustChangePassword: boolean;
}

// ── Auth state shape held in context ──────────────────────────────
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  status: AuthStatus;
  user: User | null;
}

// ── API response shapes ────────────────────────────────────────────
export interface LoginRequest {
  username: string;   // backend uses "username" not "email"
  password: string;
  inviteToken?: string;
}

export interface LoginApiResponse {
  status: string;
  message: string;
  token: string;           // access token only — backend does not return a refreshToken
  role: BackendRole;
  mustChangePassword: boolean;
}

// Kept for the 401 interceptor shape; backend has no refresh endpoint currently
export interface RefreshApiResponse {
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;   // backend field name for email
  password: string;
  role: BackendRole;
}

export interface RegisterApiResponse {
  status: string;
  message: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ApiErrorResponse {
  status: string;
  message: string;
  errors?: Record<string, string>;
}

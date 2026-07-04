"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { isAxiosError } from "axios";
import { apiClient } from "@/api/client";
import { tokenStorage } from "@/utils/tokenStorage";
import {
  User,
  AuthState,
  JwtPayload,
  LoginRequest,
  LoginApiResponse,
  RefreshApiResponse,
  FrontendRole,
  mapBackendRoleToFrontend,
} from "@/types/auth";
import { OwnedOrganisation } from "@/types/user";

// ── Context shape — preserves all signatures the app already uses ──

interface AuthContextValue extends AuthState {
  // Legacy shape consumed by existing components
  user: User | null;
  role: FrontendRole | null;
  loading: boolean;

  login: (email: string, password: string, inviteToken?: string) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  logout: () => void;
  completeOnboarding: (orgName: string, orgId: string) => void;
  completePasswordReset: (newPassword?: string) => void;
  switchOrganisation: (orgId: string) => void;
  addOrganisation: (name: string, industry: string) => string;

  // Dev-only — no-op in production
  setMockRole: (role: string) => void;
  completeSignup: () => User | null;
}

const AuthContext = createContext<AuthContextValue>({
  status: "loading",
  user: null,
  role: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: () => {},
  completeOnboarding: () => {},
  completePasswordReset: () => {},
  switchOrganisation: () => {},
  addOrganisation: () => "",
  setMockRole: () => {},
  completeSignup: () => null,
});

// ── Build a User from a decoded JWT ───────────────────────────────

function buildUser(payload: JwtPayload, extra?: Partial<User>): User {
  return {
    id: Number(payload.sub),
    email: payload.email,
    fullName: extra?.fullName ?? payload.email,
    role: mapBackendRoleToFrontend(payload.role),
    backendRole: payload.role,
    organisationId: payload.organisationId ?? extra?.organisationId,
    organisationName: extra?.organisationName,
    mustChangePassword: extra?.mustChangePassword ?? false,
  };
}

// ── Provider ───────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    // Start as 'loading' — prevents flash of unauthenticated content
    status: "loading",
    user: null,
  });

  // Derived convenience fields for legacy consumers
  const user    = state.user;
  const loading = state.status === "loading";
  const role    = state.user?.role ?? null;

  // ── Silent token refresh on mount ─────────────────────────────

  const initializeAuth = useCallback(async () => {
    if (!tokenStorage.hasSession()) {
      setState({ status: "unauthenticated", user: null });
      return;
    }
    try {
      const refreshToken = tokenStorage.getRefreshToken()!;
      const { data } = await apiClient.post<RefreshApiResponse>(
        "/auth/refresh",
        { refreshToken }
      );
      tokenStorage.setTokens(data.token, data.refreshToken);
      const payload = jwtDecode<JwtPayload>(data.token);
      setState({ status: "authenticated", user: buildUser(payload) });
    } catch {
      tokenStorage.clear();
      setState({ status: "unauthenticated", user: null });
    }
  }, []);

  useEffect(() => { initializeAuth(); }, [initializeAuth]);

  // ── login ──────────────────────────────────────────────────────

  const login = useCallback(async (
    email: string,
    password: string,
    inviteToken?: string
  ): Promise<{ success: boolean; error?: string; redirectTo?: string }> => {
    try {
      const req: LoginRequest = {
        username: email.trim().toLowerCase(),
        password,
        ...(inviteToken ? { inviteToken } : {}),
      };
      const { data } = await apiClient.post<LoginApiResponse>("/auth/login", req);
      tokenStorage.setTokens(data.token, data.refreshToken);
      const payload = jwtDecode<JwtPayload>(data.token);
      const newUser = buildUser(payload, { mustChangePassword: data.mustChangePassword });
      setState({ status: "authenticated", user: newUser });

      if (data.mustChangePassword) return { success: true, redirectTo: "/reset-password" };
      if (newUser.role === "SYSTEM_ADMIN") return { success: true, redirectTo: "/admin/organizations" };
      return { success: true, redirectTo: "/dashboard" };
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 423) return { success: false, error: "SUBSCRIPTION_SUSPENDED" };
        if (status === 401 || status === 403) return { success: false, error: "Invalid email or password." };
        const msg = (err.response?.data as { message?: string })?.message;
        return { success: false, error: msg ?? "Something went wrong. Please try again." };
      }
      return { success: false, error: "Unable to reach the server. Check your connection." };
    }
  }, []);

  // ── logout ─────────────────────────────────────────────────────

  const logout = useCallback(() => {
    // Best-effort server-side invalidation
    apiClient.post("/auth/logout").catch(() => {});
    tokenStorage.clear();
    setState({ status: "unauthenticated", user: null });
  }, []);

  // ── completeOnboarding ─────────────────────────────────────────

  const completeOnboarding = useCallback((orgName: string, orgId: string) => {
    setState((prev) => {
      if (!prev.user) return prev;
      return {
        ...prev,
        user: { ...prev.user, organisationId: orgId, organisationName: orgName },
      };
    });
  }, []);

  // ── completePasswordReset ──────────────────────────────────────

  const completePasswordReset = useCallback((_newPassword?: string) => {
    setState((prev) => {
      if (!prev.user) return prev;
      return { ...prev, user: { ...prev.user, mustChangePassword: false } };
    });
  }, []);

  // ── switchOrganisation ─────────────────────────────────────────

  const switchOrganisation = useCallback((orgId: string) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const org = (prev.user as User & { organisations?: OwnedOrganisation[] })
        .organisations?.find((o) => o.id === orgId);
      if (!org) return prev;
      return {
        ...prev,
        user: { ...prev.user, organisationId: org.id, organisationName: org.name },
      };
    });
  }, []);

  // ── addOrganisation ────────────────────────────────────────────

  const addOrganisation = useCallback((name: string, industry: string): string => {
    const newId  = `org-${Date.now().toString(36)}`;
    const newOrg: OwnedOrganisation = { id: newId, name: name.trim(), industry: industry.trim() };
    setState((prev) => {
      if (!prev.user) return prev;
      const u = prev.user as User & { organisations?: OwnedOrganisation[] };
      const orgs = [...(u.organisations ?? []), newOrg];
      return {
        ...prev,
        user: { ...u, organisations: orgs, organisationId: newId, organisationName: newOrg.name },
      };
    });
    return newId;
  }, []);

  // ── Dev no-ops (removed in production) ────────────────────────

  const setMockRole  = useCallback(() => {}, []);
  const completeSignup = useCallback(() => null, []);

  // ── Full-screen loader while initializing ──────────────────────

  if (state.status === "loading") {
    return <AuthLoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        user,
        role,
        loading,
        login,
        logout,
        completeOnboarding,
        completePasswordReset,
        switchOrganisation,
        addOrganisation,
        setMockRole,
        completeSignup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Full-screen loader ─────────────────────────────────────────────

function AuthLoadingScreen() {
  return (
    <div
      style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#f8fafc", zIndex: 9999, gap: 16,
      }}
    >
      <style>{`
        @keyframes ai-spin  { to { transform: rotate(360deg); } }
        @keyframes ai-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        border: "3px solid #e2e8f0", borderTopColor: "#1e3a8a",
        animation: "ai-spin 0.75s linear infinite",
      }} />
      <span style={{
        fontSize: 13, color: "#94a3b8", fontWeight: 500,
        animation: "ai-pulse 1.5s ease-in-out infinite",
      }}>
        Loading AuditInsight…
      </span>
    </div>
  );
}

// ── Hooks ──────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export function useRequiredUser(): User {
  const { user, status } = useAuth();
  if (status !== "authenticated" || !user) {
    throw new Error("useRequiredUser() called outside an authenticated context");
  }
  return user;
}

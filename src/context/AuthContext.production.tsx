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
import { apiClient } from "@/api/client";
import { tokenStorage } from "@/utils/tokenStorage";
import {
  User,
  AuthState,
  JwtPayload,
  LoginRequest,
  LoginApiResponse,
  mapBackendRoleToFrontend,
} from "@/types/auth";

// ── Context shape ──────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<{ redirectTo: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  status: "loading",
  user: null,
  login: async () => ({ redirectTo: "/log-in" }),
  logout: () => {},
});

// ── Helper ─────────────────────────────────────────────────────────

function buildUserFromJwt(payload: JwtPayload): User {
  return {
    id: Number(payload.sub),
    email: payload.email,
    fullName: payload.email, // enriched by /profile call later
    role: mapBackendRoleToFrontend(payload.role),
    backendRole: payload.role,
    organisationId: payload.organisationId,
    mustChangePassword: false,
  };
}

// ── Provider ───────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    // Start as 'loading' to prevent flash of unauthenticated content
    status: "loading",
    user: null,
  });

  /**
   * initializeAuth — runs once on mount.
   * Backend has no refresh token endpoint, so we check if an in-memory
   * access token exists (survives HMR in dev, lost on hard refresh).
   * On hard refresh the user will need to log in again.
   */
  const initializeAuth = useCallback(() => {
    if (tokenStorage.hasSession()) {
      try {
        const token = tokenStorage.getAccessToken()!;
        const payload = jwtDecode<JwtPayload>(token);
        // Check token hasn't expired
        if (payload.exp * 1000 > Date.now()) {
          setState({ status: "authenticated", user: buildUserFromJwt(payload) });
          return;
        }
      } catch {
        // Malformed token — fall through to unauthenticated
      }
    }
    tokenStorage.clear();
    setState({ status: "unauthenticated", user: null });
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // ── login ──────────────────────────────────────────────────────

  const login = useCallback(
    async (credentials: LoginRequest): Promise<{ redirectTo: string }> => {
      const { data } = await apiClient.post<LoginApiResponse>(
        "/auth/login",
        credentials
      );

      // Backend returns only an access token — store it in memory
      tokenStorage.setTokens(data.token);

      const payload = jwtDecode<JwtPayload>(data.token);
      const user: User = {
        ...buildUserFromJwt(payload),
        mustChangePassword: data.mustChangePassword,
      };

      setState({ status: "authenticated", user });

      if (data.mustChangePassword)      return { redirectTo: "/reset-password" };
      if (user.role === "SYSTEM_ADMIN") return { redirectTo: "/admin/organizations" };
      return { redirectTo: "/dashboard" };
    },
    []
  );

  // ── logout ─────────────────────────────────────────────────────

  const logout = useCallback(() => {
    tokenStorage.clear();
    setState({ status: "unauthenticated", user: null });
  }, []);

  // ── Full-screen loader while initializing ──────────────────────

  if (state.status === "loading") {
    return <AuthLoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Loading screen ─────────────────────────────────────────────────

function AuthLoadingScreen() {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", zIndex: 9999, gap: 16 }}>
      <style>{`
        @keyframes ai-spin  { to { transform: rotate(360deg); } }
        @keyframes ai-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#1e3a8a", animation: "ai-spin 0.75s linear infinite" }} />
      <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, animation: "ai-pulse 1.5s ease-in-out infinite" }}>
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

/**
 * Guards.tsx — Route-level access control components.
 *
 * Two guards are provided:
 *
 *  <ProtectedRoute>
 *    Redirects to /log-in if the user is not authenticated.
 *    Shows nothing (null) while auth is still initializing to avoid
 *    a redirect race condition.
 *
 *  <RequireRole allowedRoles={['ORG_ADMIN', 'AUDITOR']}>
 *    Redirects to /403-forbidden if the authenticated user's frontend
 *    role is not in the allowed list.
 *
 * USAGE in Next.js app router (wrap page content, not the layout):
 *
 *   export default function TransactionsPage() {
 *     return (
 *       <ProtectedRoute>
 *         <RequireRole allowedRoles={['ORG_ADMIN', 'ACCOUNTANT']}>
 *           <TransactionsContent />
 *         </RequireRole>
 *       </ProtectedRoute>
 *     );
 *   }
 *
 * DESIGN DECISION — why not middleware?
 *   Next.js middleware runs on the Edge and cannot read in-memory token
 *   storage. These client-side guards are the correct layer for SPA-style
 *   auth checks. For true server-side protection, add a separate middleware
 *   that validates the JWT from a cookie (requires a BFF or cookie-based
 *   token strategy).
 */

"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext.production";
import { FrontendRole } from "@/types/auth";

// ── Normalise the production context shape for guards ──────────────
function useGuardContext(): { isLoading: boolean; isAuthenticated: boolean; role: string | null } {
  const ctx = useAuth();

  const isLoading = ctx.status === "loading";
  const isAuthenticated = ctx.status === "authenticated";

  return {
    isLoading,
    isAuthenticated,
    role: ctx.user?.role ?? null,
  };
}

// ── ProtectedRoute ─────────────────────────────────────────────────

interface ProtectedRouteProps {
  children: ReactNode;
  /** Override the redirect target. Defaults to /log-in */
  loginPath?: string;
}

export function ProtectedRoute({
  children,
  loginPath = "/log-in",
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated } = useGuardContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(loginPath);
    }
  }, [isLoading, isAuthenticated, loginPath, router]);

  if (isLoading || !isAuthenticated) return null;

  return <>{children}</>;
}

// ── RequireRole ────────────────────────────────────────────────────

interface RequireRoleProps {
  children: ReactNode;
  allowedRoles: FrontendRole[];
  /** Override the redirect target. Defaults to /403-forbidden */
  forbiddenPath?: string;
}

export function RequireRole({
  children,
  allowedRoles,
  forbiddenPath = "/403-forbidden",
}: RequireRoleProps) {
  const { isLoading, isAuthenticated, role } = useGuardContext();
  const router = useRouter();

  const isAllowed = isAuthenticated && role !== null && allowedRoles.includes(role as FrontendRole);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !role) {
      router.replace("/log-in");
    } else if (!allowedRoles.includes(role as FrontendRole)) {
      router.replace(forbiddenPath);
    }
  }, [isLoading, isAuthenticated, role, allowedRoles, forbiddenPath, router]);

  if (isLoading || !isAllowed) return null;

  return <>{children}</>;
}



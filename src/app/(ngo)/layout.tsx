"use client";

/**
 * (ngo)/layout.tsx — NGO portal layout shell.
 *
 * Wraps ALL NGO pages: ngo-dashboard and every sub-page
 * (transactions, evidence, compliance, projects, audit,
 *  beneficiaries, review, settings).
 *
 * Access rules:
 *   - Must be authenticated
 *   - orgType must be "NGO" (private company users → /dashboard)
 *   - SYSTEM_ADMIN → /admin/organizations
 *
 * Mounts RBACProvider so every NGO page and component can call
 * useRBAC(), usePermission(), useComponentGate(), useScopedData().
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext.production";
import { RBACProvider } from "@/context/RBACContext";

export default function NGOLayout({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/log-in"); return; }
    if (status !== "authenticated" || !user) return;
    if (user.role === "SYSTEM_ADMIN") { router.replace("/admin/organizations"); return; }
    if (user.orgType !== "NGO")       { router.replace("/dashboard"); return; }
  }, [status, user, router]);

  if (status === "loading" || !user) return null;

  return (
    <RBACProvider>
      {children}
    </RBACProvider>
  );
}



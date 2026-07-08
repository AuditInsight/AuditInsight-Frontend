"use client";

/**
 * (mse)/layout.tsx — Private company (MSE) layout shell.
 *
 * Wraps all private-company pages: dashboard, transactions, evidence,
 * reports, settings, review-queue.
 *
 * Access rules:
 *   - Must be authenticated
 *   - orgType must be "PRIVATE" (NGO users are redirected to /ngo-dashboard)
 *   - SYSTEM_ADMIN is redirected to /admin/organizations
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext.production";
import Header from "@/components/layout/header/Header";
import AppFooter from "@/components/layout/AppFooter";
import { theme } from "@/styles/theme";

export default function MSELayout({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/log-in"); return; }
    if (status !== "authenticated" || !user) return;
    if (user.role === "SYSTEM_ADMIN")  { router.replace("/admin/organizations"); return; }
    if (user.orgType === "NGO")        { router.replace("/ngo-dashboard"); return; }
  }, [status, user, router]);

  if (status === "loading" || !user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: `
          radial-gradient(circle at top left, rgba(15,94,255,0.10), transparent 30%),
          radial-gradient(circle at bottom right, rgba(59,130,246,0.10), transparent 30%),
          ${theme.colors.appBackground}
        `,
      }}
    >
      <Header title="AuditInsight" />
      <main
        style={{
          flex: 1,
          padding: theme.spacing.xl,
          maxWidth: 1500,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>
      <AppFooter />
    </div>
  );
}



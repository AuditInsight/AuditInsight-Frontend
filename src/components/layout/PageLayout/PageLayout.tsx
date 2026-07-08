"use client";

/**
 * PageLayout.tsx — Legacy shell kept for any remaining direct imports.
 *
 * NOTE: As of the route-group restructure, layout is handled by:
 *   (auth)/layout.tsx   — auth pages
 *   (mse)/layout.tsx    — private company pages
 *   (ngo)/layout.tsx    — NGO portal pages
 *   (admin)/layout.tsx  — system admin pages
 *
 * This file is no longer mounted in the root layout.
 */
import { usePathname } from "next/navigation";
import Header from "@/components/layout/header/Header";
import AppFooter from "@/components/layout/AppFooter";
import { theme } from "@/styles/theme";
import { usePasswordResetGuard } from "@/lib/guards";

const PUBLIC_PATHS = [
  "/",
  "/log-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/onboarding",
];

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage =
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/ngo-dashboard");

  usePasswordResetGuard();

  if (isPublicPage) return <>{children}</>;

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


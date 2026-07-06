"use client";

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
  const isPublicPage = PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/ngo-dashboard");
  const isDashboard = pathname === "/dashboard";

  // Enforces forced password reset for invited users (Story 2.1 / 3.1)
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
        position: "relative",
      }}
    >
      <Header title="AuditInsight" />
      <main
        style={{
          flex: 1,
          padding: isDashboard ? 0 : theme.spacing.xl,
          maxWidth: isDashboard ? "100%" : 1500,
          width: "100%",
          margin: isDashboard ? 0 : "0 auto",
          position: "relative",
          zIndex: 2,
          boxSizing: "border-box",
        }}
        className={isDashboard ? "" : "page-padding"}
      >
        {children}
      </main>
      <AppFooter />
    </div>
  );
}

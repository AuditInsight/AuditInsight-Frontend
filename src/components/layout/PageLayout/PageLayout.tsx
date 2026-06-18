"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/header/Header";
import { theme } from "@/styles/theme";

const PUBLIC_PATHS = [
  "/",
  "/log-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/onboarding",
];

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicPage = PUBLIC_PATHS.includes(pathname);
  const isDashboard = pathname === "/dashboard";

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(
            circle at top left,
            rgba(15,94,255,0.10),
            transparent 30%
          ),
          radial-gradient(
            circle at bottom right,
            rgba(59,130,246,0.10),
            transparent 30%
          ),
          ${theme.colors.appBackground}
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Header title="AuditInsight" />

      <main
        style={{
          padding: isDashboard ? 0 : theme.spacing.xl,
          maxWidth: isDashboard ? "100%" : 1500,
          margin: isDashboard ? 0 : "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {children}
      </main>
    </div>
  );
}

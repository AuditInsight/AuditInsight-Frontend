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
];

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicPage = PUBLIC_PATHS.includes(pathname);

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
          padding: theme.spacing.xl,
          maxWidth: 1500,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {children}
      </main>
    </div>
  );
}

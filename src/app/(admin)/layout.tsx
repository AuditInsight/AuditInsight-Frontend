"use client";

/**
 * (admin)/layout.tsx
 * System admin pages. Uses the standard private layout shell
 * (Header + main content area). Only SYSTEM_ADMIN role reaches here.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext.production";
import Header from "@/components/layout/header/Header";
import AppFooter from "@/components/layout/AppFooter";
import { theme } from "@/styles/theme";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/log-in");
    if (status === "authenticated" && user?.role !== "SYSTEM_ADMIN") {
      router.replace("/dashboard");
    }
  }, [status, user, router]);

  if (status === "loading" || !user) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: theme.colors.appBackground }}>
      <Header title="AuditInsight — Admin" />
      <main style={{ flex: 1, padding: theme.spacing.xl, maxWidth: 1500, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {children}
      </main>
      <AppFooter />
    </div>
  );
}



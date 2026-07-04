"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext.production";

// Pages that don't need the password-reset guard
const RESET_EXEMPT = ["/reset-password", "/log-in", "/sign-up", "/verify-otp", "/onboarding", "/forgot-password", "/"];

export function usePasswordResetGuard() {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    if (!user) return;
    if (RESET_EXEMPT.includes(pathname)) return;
    if (user.mustChangePassword) {
      router.replace("/reset-password");
    }
  }, [user, status, pathname, router]);

  return { mustChangePassword: !!user?.mustChangePassword, loading: status === "loading" };
}

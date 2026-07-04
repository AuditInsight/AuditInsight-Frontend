"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext.production";
import { usePermissions } from "@/security/access-control";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/hooks/useDashboardData";
import { TransactionIntegrityDashboard } from "@/components/dashboard/TransactionIntegrityDashboard";
import { Loader2 } from "lucide-react";
import { FrontendRole } from "@/types/auth";

const ROLE_LABEL: Record<FrontendRole, string> = {
  ORG_ADMIN:    "Organisation Admin",
  ACCOUNTANT:   "Accountant",
  AUDITOR:      "Auditor",
  SYSTEM_ADMIN: "Super Admin",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { canViewAdminPanel } = usePermissions();
  const { transactions, evidence, loading } = useDashboardData();
  const router = useRouter();

  useEffect(() => {
    if (canViewAdminPanel) {
      router.replace("/admin/organizations");
    }
  }, [canViewAdminPanel, router]);

  if (canViewAdminPanel) return null;

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", flexDirection: "column", gap: 16,
      }}>
        <Loader2 size={40} style={{ color: "#0f172a", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>Loading dashboard…</p>
      </div>
    );
  }

  return (
    <TransactionIntegrityDashboard
      transactions={transactions}
      evidence={evidence}
      user={user}
      roleLabel={ROLE_LABEL[user?.role ?? "ORG_ADMIN"]}
    />
  );
}

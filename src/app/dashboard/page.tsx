"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/security/access-control";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/hooks/useDashboardData";
import { TransactionIntegrityDashboard } from "@/components/dashboard/TransactionIntegrityDashboard";
import { Loader2 } from "lucide-react";
import { UserRole } from "@/types/user";

const ROLE_LABEL: Record<UserRole, string> = {
  CLIENT: "Organisation Admin",
  MEMBER: "Accountant",
  AUDITOR: "Auditor",
  ADMIN: "Super Admin",
};

export default function DashboardPage() {
  const { user, role } = useAuth();
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
      roleLabel={ROLE_LABEL[(role ?? "CLIENT") as UserRole]}
    />
  );
}

"use client";

import { ProtectedRoute } from "@/components/Guards";
import NGODashboardShell from "@/components/ngo/dashboard/NGODashboardShell";
import NGODashboardOverview from "@/components/ngo/dashboard/NGODashboardOverview";

export default function NGODashboardPage() {
  return (
    <ProtectedRoute>
      <NGODashboardShell>
        <NGODashboardOverview />
      </NGODashboardShell>
    </ProtectedRoute>
  );
}

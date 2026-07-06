"use client";

import { ProtectedRoute } from "@/components/Guards";
import NGODashboard from "@/components/ngo-dashboard/NGODashboard";

export default function NGODashboardPage() {
  return (
    <ProtectedRoute>
      <NGODashboard />
    </ProtectedRoute>
  );
}

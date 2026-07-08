"use client";

import { ProtectedRoute } from "@/components/Guards";
import NGODashboard from "@/components/ngo/NGODashboard";

export default function NGODashboardPage() {
  return (
    <ProtectedRoute>
      <NGODashboard />
    </ProtectedRoute>
  );
}



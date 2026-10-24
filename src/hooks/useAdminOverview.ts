"use client";

import { useState, useEffect, useCallback } from "react";
import { isAxiosError } from "axios";
import {
  getAdminOrganisations,
  getAdminUsers,
  getAdminSubscriptions,
  getAdminAuditLog,
  AdminAuditLogResponse,
} from "@/api/admin";

export interface AdminOverview {
  totalOrganisations: number;
  totalUsers: number;
  activeSubscriptions: number;
  recentAuditLog: AdminAuditLogResponse[];
}

interface UseAdminOverviewReturn {
  overview: AdminOverview | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAdminOverview(): UseAdminOverviewReturn {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [orgsRes, usersRes, subsRes, auditRes] = await Promise.all([
        getAdminOrganisations({ page: 1 }),
        getAdminUsers({ page: 1 }),
        getAdminSubscriptions({ page: 1, status: "ACTIVE" }),
        getAdminAuditLog({ page: 1 }),
      ]);
      setOverview({
        totalOrganisations: orgsRes.data.totalItems,
        totalUsers: usersRes.data.totalItems,
        activeSubscriptions: subsRes.data.totalItems,
        recentAuditLog: auditRes.data.items.slice(0, 5),
      });
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to load platform overview.");
      } else {
        setError("Failed to load platform overview.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { overview, loading, error, refetch: fetchOverview };
}

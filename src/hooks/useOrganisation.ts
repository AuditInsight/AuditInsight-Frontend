"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext.production";
import { apiClient } from "@/api/client";
import { OrganisationApiResponse } from "@/types/tenants";
import { isAxiosError } from "axios";
import { normalizeOrganisationId } from "@/utils/organisationId";

interface UseOrganisationReturn {
  org: OrganisationApiResponse | null;
  orgId: string;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOrganisation(): UseOrganisationReturn {
  const { user } = useAuth();
  const [org, setOrg]         = useState<OrganisationApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchOrg = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<OrganisationApiResponse[]>("/organisations");
      const list = Array.isArray(data) ? data : [];
      const safeOrgId = normalizeOrganisationId(user?.organisationId);
      const safeOrgs = list.filter((o) => normalizeOrganisationId(o.id));
      // Pick the org matching the user's organisationId, or fall back to first valid org.
      const match = safeOrgId
        ? (safeOrgs.find((o) => normalizeOrganisationId(o.id) === safeOrgId) ?? safeOrgs[0] ?? null)
        : (safeOrgs[0] ?? null);
      setOrg(match);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to load organisation.");
      } else {
        setError("Failed to load organisation.");
      }
    } finally {
      setLoading(false);
    }
  }, [user?.organisationId]);

  useEffect(() => {
    if (user) fetchOrg();
  }, [user, fetchOrg]);

  return { org, orgId: org?.id ?? "", loading, error, refetch: fetchOrg };
}

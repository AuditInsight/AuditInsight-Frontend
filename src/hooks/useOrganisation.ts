"use client";

import { useState, useEffect } from "react";
import { Organisation } from "@/utils/api";
import { MOCK_ORGANISATION } from "@/mock/organisation.mock";

/*
 * ── REAL API (commented for RBAC UI testing) ─────────────────────
 * import { getMyOrganisations } from "@/utils/api";
 * ─────────────────────────────────────────────────────────────────
 */

interface UseOrganisationReturn {
  org: Organisation | null;
  orgId: string;
  loading: boolean;
}

export function useOrganisation(): UseOrganisationReturn {
  const [org, setOrg] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * const cached = localStorage.getItem("organisationId");
     * getMyOrganisations()
     *   .then(({ data }) => {
     *     if (data && data.length > 0) {
     *       const selected = cached
     *         ? (data.find((o) => o.id === cached) ?? data[0])
     *         : data[0];
     *       setOrg(selected);
     *       localStorage.setItem("organisationId", selected.id);
     *     }
     *   })
     *   .catch(() => {})
     *   .finally(() => setLoading(false));
     * ─────────────────────────────────────────────────────────────
     */

    // ── MOCK ─────────────────────────────────────────────────────
    setOrg(MOCK_ORGANISATION);
    setLoading(false);
  }, []);

  const orgId = org?.id ?? "";

  return { org, orgId, loading };
}



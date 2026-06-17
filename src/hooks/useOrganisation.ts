"use client";

import { useEffect, useState } from "react";
import { getMyOrganisations, type Organisation } from "@/utils/api";

interface UseOrganisationReturn {
  org: Organisation | null;
  orgId: string;
  loading: boolean;
}

export function useOrganisation(): UseOrganisationReturn {
  const [org, setOrg] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("organisationId");

    getMyOrganisations()
      .then(({ data }) => {
        if (data && data.length > 0) {
          const selected = cached
            ? (data.find((o) => o.id === cached) ?? data[0])
            : data[0];
          setOrg(selected);
          localStorage.setItem("organisationId", selected.id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const orgId = org?.id ?? (typeof window !== "undefined" ? (localStorage.getItem("organisationId") ?? "") : "");

  return { org, orgId, loading };
}

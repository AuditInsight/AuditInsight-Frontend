"use client";

import { useEffect, useState } from "react";
import { getTransactions, getEvidence, type TransactionResponse, type EvidenceResponse } from "@/utils/api";

export function useDashboardData() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [evidence, setEvidence] = useState<EvidenceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orgId = localStorage.getItem("organisationId") ?? undefined;

    Promise.all([
      getTransactions(orgId),
      getEvidence(orgId),
    ])
      .then(([txRes, evRes]) => {
        setTransactions(txRes.data ?? []);
        setEvidence(evRes.data ?? []);
      })
      .catch((err) => console.error("Dashboard fetch error", err))
      .finally(() => setLoading(false));
  }, []);

  return { transactions, evidence, loading };
}

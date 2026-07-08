"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { getTransactions, getEvidence } from "@/utils/api";
import { enrichTransactions, findDuplicateIds } from "@/lib/transactionMetrics";
import { useAuth } from "@/context/AuthContext.production";

export interface EnrichedTransaction extends Transaction {
  evidenceCount: number;
  isDuplicate: boolean;
}

export function useDashboardData() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);
  const [evidence,     setEvidence]     = useState<Evidence[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  useEffect(() => {
    const orgId = user?.organisationId;
    Promise.all([getTransactions(orgId), getEvidence(orgId)])
      .then(([txRes, evRes]) => {
        const ev       = evRes.data ?? [];
        const enriched = enrichTransactions(txRes.data ?? [], ev);
        const dupes    = findDuplicateIds(enriched);
        setTransactions(
          enriched.map((t) => ({ ...t, isDuplicate: dupes.has(t.id) }))
        );
        setEvidence(ev);
      })
      .catch((err) => {
        console.error("useDashboardData error", err);
        setError("Failed to load dashboard data.");
      })
      .finally(() => setLoading(false));
  }, [user?.organisationId]);

  return { transactions, evidence, loading, error };
}



"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { MOCK_TRANSACTIONS } from "@/mock/transactions.mock";
import { MOCK_EVIDENCE } from "@/mock/evidence.mock";
import { enrichTransactions, findDuplicateIds } from "@/lib/transactionMetrics";

/*
 * ── REAL API (commented for RBAC UI testing) ─────────────────────
 * import { getTransactions, getEvidence } from "@/utils/api";
 * ─────────────────────────────────────────────────────────────────
 */

export interface EnrichedTransaction extends Transaction {
  evidenceCount: number;
  isDuplicate: boolean;
}

export function useDashboardData() {
  const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * const orgId = localStorage.getItem("organisationId") ?? undefined;
     * Promise.all([getTransactions(orgId), getEvidence(orgId)])
     *   .then(([txRes, evRes]) => {
     *     const ev = evRes.data ?? [];
     *     const enriched = enrichTransactions(txRes.data ?? [], ev);
     *     const dupes = findDuplicateIds(enriched);
     *     setTransactions(enriched.map(t => ({ ...t, isDuplicate: dupes.has(t.id) })));
     *     setEvidence(ev);
     *   })
     *   .catch((err) => console.error("Dashboard fetch error", err))
     *   .finally(() => setLoading(false));
     * ─────────────────────────────────────────────────────────────
     */

    const ev = MOCK_EVIDENCE;
    const enriched = enrichTransactions(MOCK_TRANSACTIONS, ev);
    const dupes = findDuplicateIds(enriched);
    setTransactions(
      enriched.map((t) => ({
        ...t,
        isDuplicate: dupes.has(t.id),
      }))
    );
    setEvidence(ev);
    setLoading(false);
  }, []);

  return { transactions, evidence, loading };
}

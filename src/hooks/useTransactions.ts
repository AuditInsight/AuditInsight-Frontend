"use client";

import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { MOCK_TRANSACTIONS } from "@/mock/transactions.mock";
import { MOCK_EVIDENCE } from "@/mock/evidence.mock";
import {
  enrichTransactions,
  findDuplicateIds,
} from "@/lib/transactionMetrics";

/*
 * ── REAL API (commented for UI refinement phase) ──────────────────
 * import { getTransactions, createTransaction, updateTransactionStatus, getEvidence } from "@/utils/api";
 * ─────────────────────────────────────────────────────────────────
 */

export interface TransactionWithMeta extends Transaction {
  evidenceCount: number;
  isDuplicate: boolean;
}

function withMeta(
  transactions: Transaction[],
  evidence: Evidence[]
): TransactionWithMeta[] {
  const enriched = enrichTransactions(transactions, evidence);
  const dupes = findDuplicateIds(enriched);
  return enriched.map((t) => ({
    ...t,
    evidenceCount: t.evidenceCount ?? 0,
    isDuplicate: dupes.has(t.id),
  }));
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionWithMeta[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * Promise.all([getTransactions(), getEvidence()])
     *   .then(([txRes, evRes]) => {
     *     const ev = evRes.data ?? [];
     *     setTransactions(withMeta(txRes.data ?? [], ev));
     *     setEvidences(ev);
     *   })
     *   .catch(console.error)
     *   .finally(() => setLoading(false));
     * ─────────────────────────────────────────────────────────────
     */
    const ev = MOCK_EVIDENCE;
    setTransactions(withMeta(MOCK_TRANSACTIONS, ev));
    setEvidences(ev);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const refreshStatuses = useCallback((updatedEvidence: Evidence[]) => {
    setEvidences(updatedEvidence);
    setTransactions((prev) => withMeta(prev, updatedEvidence));
  }, []);

  const addTransaction = (data: Omit<Transaction, "id" | "status" | "evidenceCount">) => {
    const newTx: Transaction = {
      ...data,
      id: `TXN-${String(transactions.length + 1).padStart(4, "0")}`,
      status: "PENDING",
      evidenceCount: 0,
    };
    setTransactions((prev) => withMeta([newTx, ...prev], evidences));
  };

  const updateTransaction = (
    id: string,
    data: Partial<Omit<Transaction, "id" | "status" | "evidenceCount">>
  ) => {
    setTransactions((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...data } : t));
      return withMeta(updated, evidences);
    });
  };

  const deleteTransaction = (id: string) => {
    const updatedEvidence = evidences.filter((e) => e.transactionId !== id);
    setEvidences(updatedEvidence);
    setTransactions((prev) =>
      withMeta(
        prev.filter((t) => t.id !== id),
        updatedEvidence
      )
    );
  };

  const saveEvidence = (saved: Evidence) => {
    if (!saved.transactionId) return;
    const updated = evidences.some((e) => e.id === saved.id)
      ? evidences.map((e) => (e.id === saved.id ? saved : e))
      : [saved, ...evidences];
    refreshStatuses(updated);
  };

  const deleteEvidence = (id: string) => {
    refreshStatuses(evidences.filter((e) => e.id !== id));
  };

  const onEvidenceChange = refreshStatuses;

  return {
    transactions,
    evidences,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    saveEvidence,
    deleteEvidence,
    onEvidenceChange,
  };
}

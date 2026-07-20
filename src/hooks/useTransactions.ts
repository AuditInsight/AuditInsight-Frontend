"use client";

import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import {
  getTransactions,
  getEvidence,
  createTransaction as apiCreateTransaction,
  updateTransactionStatus as apiUpdateStatus,
  deleteTransaction as apiDeleteTransaction,
  CreateTransactionRequest,
} from "@/utils/api";
import { enrichTransactions, findDuplicateIds } from "@/lib/transactionMetrics";
import { useAuth } from "@/context/AuthContext.production";

export interface TransactionWithMeta extends Transaction {
  evidenceCount: number;
  isDuplicate: boolean;
}

function withMeta(transactions: Transaction[], evidence: Evidence[]): TransactionWithMeta[] {
  const enriched = enrichTransactions(transactions, evidence);
  const dupes    = findDuplicateIds(enriched);
  return enriched.map((t) => ({
    ...t,
    evidenceCount: t.evidenceCount ?? 0,
    isDuplicate:   dupes.has(t.id),
  }));
}

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionWithMeta[]>([]);
  const [evidences,    setEvidences]    = useState<Evidence[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const orgId = user?.organisationId;
      const [txRes, evRes] = await Promise.all([
        getTransactions(orgId),
        getEvidence(orgId),
      ]);
      const ev = evRes.data ?? [];
      setEvidences(ev);
      const txns = (txRes.data ?? []).map((t) => ({
        ...t,
        counterparty: t.counterparty ?? "",
      }));
      setTransactions(withMeta(txns, ev));
    } catch (err) {
      console.error("useTransactions load error", err);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, [user?.organisationId]);

  useEffect(() => { load(); }, [load]);

  const refreshStatuses = useCallback((updatedEvidence: Evidence[]) => {
    setEvidences(updatedEvidence);
    setTransactions((prev) => withMeta(prev, updatedEvidence));
  }, []);

  const addTransaction = async (
    data: Omit<Transaction, "id" | "status" | "evidenceCount">
  ) => {
    const isNgo = user?.orgType === "NGO";
    const req: CreateTransactionRequest = {
      organisationId: user?.organisationId ?? "",
      name:          data.name,
      counterparty:  data.counterparty,
      date:          data.date,
      amount:        data.amount,
      type:          data.type,
      paymentMethod: data.paymentMethod,
      // NGO critical rule: include donor + budgetLine only for NGO orgs
      ...(isNgo && { donor: (data as Transaction & { donor?: string }).donor ?? "" }),
      ...(isNgo && { budgetLine: (data as Transaction & { budgetLine?: string }).budgetLine ?? "" }),
    };
    const { data: created } = await apiCreateTransaction(req);
    const newTx: Transaction = {
      id:            created.id,
      name:          created.name,
      counterparty:  created.counterparty ?? "",
      date:          String(created.date),
      amount:        Number(created.amount),
      type:          created.type,
      paymentMethod: created.paymentMethod,
      status:        created.status,
      evidenceCount: 0,
      createdBy:     created.createdBy,
      createdAt:     String(created.createdAt),
      // Preserve NGO fields from the request so the table renders them immediately
      donor:         req.donor,
      budgetLine:    req.budgetLine,
      projectName:   req.name,
    };
    setTransactions((prev) => withMeta([newTx, ...prev], evidences));
  };

  // Backend only supports status updates via PATCH — no full edit endpoint
  const updateTransaction = async (
    id: string,
    data: Partial<Omit<Transaction, "id" | "evidenceCount">>
  ) => {
    if (data.status) {
      await apiUpdateStatus(id, data.status);
    }
    setTransactions((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...data } : t));
      return withMeta(updated, evidences);
    });
  };

  const deleteTransaction = async (id: string) => {
    await apiDeleteTransaction(id);
    const updatedEvidence = evidences.filter((e) => e.transactionId !== id);
    setEvidences(updatedEvidence);
    setTransactions((prev) =>
      withMeta(prev.filter((t) => t.id !== id), updatedEvidence)
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

  return {
    transactions,
    evidences,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    saveEvidence,
    deleteEvidence,
    onEvidenceChange: refreshStatuses,
  };
}



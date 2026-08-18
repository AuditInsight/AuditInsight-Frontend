"use client";

import { useState, useEffect, useCallback } from "react";
import { NGOTransaction } from "@/types/ngo";
import { Transaction } from "@/types/transaction.types";
import {
  getTransactions,
  createTransaction as apiCreateTransaction,
  updateTransactionStatus as apiUpdateStatus,
  deleteTransaction as apiDeleteTransaction,
  CreateTransactionRequest,
} from "@/utils/api";
import { useAuth } from "@/context/AuthContext.production";
import { normalizeOrganisationId } from "@/utils/organisationId";

function toNGOTransaction(t: Transaction): NGOTransaction {
  return {
    id:             t.id,
    organisationId: t.organisationId ?? "",
    projectName:    t.projectName ?? t.name,
    budgetLine:     t.budgetLine ?? "",
    donor:          (t as any).donor ?? "",
    description:    t.name,
    counterparty:   t.counterparty ?? "",
    date:           t.date ?? "",
    amount:         t.amount ?? 0,
    currency:       "RWF",
    paymentMethod:  t.paymentMethod ?? "BANK",
    type:           t.type ?? "EXPENSE",
    status:         t.status === "PENDING" ? "PENDING" : "COMPLETED",
    evidenceCount:  t.evidenceCount ?? 0,
    createdBy:      t.createdBy ?? "",
    createdAt:      t.createdAt ?? "",
    notes:          t.notes,
  };
}

// Global queue to serialize transaction submissions and prevent ID collisions
let submitQueue: Promise<void> = Promise.resolve();

function enqueueSubmit(fn: () => Promise<void>): Promise<void> {
  return new Promise((resolve, reject) => {
    submitQueue = submitQueue.then(() => fn()).then(resolve, reject);
  });
}

export function useNGOTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<NGOTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const orgId = normalizeOrganisationId(user?.organisationId);
    if (!orgId) {
      setTransactions([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await getTransactions(orgId);
      const txns = (res.data ?? []).map((t) => ({
        ...t,
        counterparty: t.counterparty ?? "",
      }));
      setTransactions(txns.map(toNGOTransaction));
    } catch (err) {
      console.error("useNGOTransactions load error", err);
      setError("Failed to load NGO transactions.");
    } finally {
      setLoading(false);
    }
  }, [user?.organisationId]);

  useEffect(() => {
    const orgId = normalizeOrganisationId(user?.organisationId);
    if (!orgId) {
      queueMicrotask(() => {
        setTransactions([]);
        setError(null);
        setLoading(false);
      });
      return;
    }
    load();
  }, [user?.organisationId, load]);

  const addTransaction = async (
    data: Omit<NGOTransaction, "id" | "status" | "evidenceCount" | "createdBy" | "createdAt">
  ) => {
    return enqueueSubmit(async () => {
      const orgId = normalizeOrganisationId(user?.organisationId);
      if (!orgId) {
        throw new Error("Organisation is not selected.");
      }

      const req: CreateTransactionRequest = {
        organisationId: orgId,
        name:           data.projectName,
        counterparty:   data.counterparty,
        date:           data.date,
        amount:         data.amount,
        type:           data.type,
        paymentMethod:  data.paymentMethod,
        budgetLine:     data.budgetLine || "",
        donor:          data.donor || "",
      };

      const { data: created } = await apiCreateTransaction(req);
      const newTx = toNGOTransaction({
        id:            created.id,
        organisationId: created.organisationId?.toString() || "",
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
        budgetLine:    (created as any).budgetLine ?? "",
        projectName:   created.name,
        donor:         (created as any).donor ?? "",
      });
      setTransactions((prev) => [newTx, ...prev]);
    });
  };

  const updateTransaction = async (
    id: string,
    data: Partial<Omit<NGOTransaction, "id" | "evidenceCount">>
  ) => {
    if (data.status) {
      const backendStatus = data.status === "FLAGGED" ? "PENDING" : data.status;
      await apiUpdateStatus(id, backendStatus);
    }
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const deleteTransaction = async (id: string) => {
    await apiDeleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}

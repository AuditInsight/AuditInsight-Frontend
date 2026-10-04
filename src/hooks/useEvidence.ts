"use client";

import { useState, useEffect, useMemo } from "react";
import { Evidence } from "@/types/evidence.types";
import {
  getEvidence,
  getTransactions,
  uploadEvidence as apiUploadEvidence,
  deleteEvidence as apiDeleteEvidence,
} from "@/utils/api";
import { useAuth } from "@/context/AuthContext.production";
import { normalizeOrganisationId } from "@/utils/organisationId";
import { withTransactionInfo } from "@/lib/evidenceEnrich";

export function useEvidence(onEvidenceChange?: (evidence: Evidence[]) => void) {
  const { user } = useAuth();
  const [rawDocuments, setDocuments] = useState<Evidence[]>([]);
  const [txInfo, setTxInfo] = useState<{ id: string; amount: number; counterparty?: string }[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    const orgId = normalizeOrganisationId(user?.organisationId);
    if (!orgId) {
      queueMicrotask(() => {
        setDocuments([]);
        setTxInfo([]);
        setError(null);
        setLoading(false);
      });
      return;
    }

    queueMicrotask(() => {
      setLoading(true);
      Promise.all([getEvidence(orgId), getTransactions(orgId)])
        .then(([{ data }, { data: txns }]) => {
        setTxInfo((txns ?? []).map((t) => ({ id: t.id, amount: Number(t.amount), counterparty: t.counterparty })));
        const mapped: Evidence[] = (data ?? []).map((e) => ({
          id:            e.id,
          transactionId: e.transactionId,
          documentName:  e.documentName,
          folder:        e.folder,
          subfolder:     e.subfolder,
          fileUpload:    e.fileUpload,
          fileType:      e.fileType,
          notes:         e.notes,
          uploadedBy:    String(e.uploadedBy),
          uploadedAt:    e.uploadedAt,
        }));
        setDocuments(mapped);
        })
        .catch((err) => {
          console.error("useEvidence load error", err);
          setError("Failed to load evidence.");
        })
        .finally(() => setLoading(false));
    });
  }, [user?.organisationId]);

  // The evidence API has no amount/counterparty — take them from the linked transaction.
  const documents = useMemo(() => withTransactionInfo(rawDocuments, txInfo), [rawDocuments, txInfo]);

  const saveEvidence = (saved: Evidence) => {
    if (!saved.transactionId) return;
    setDocuments((prev) => {
      const updated = prev.some((e) => e.id === saved.id)
        ? prev.map((e) => (e.id === saved.id ? saved : e))
        : [saved, ...prev];
      onEvidenceChange?.(updated);
      return updated;
    });
  };

  const deleteEvidence = async (id: string) => {
    await apiDeleteEvidence(id);
    setDocuments((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      onEvidenceChange?.(updated);
      return updated;
    });
  };

  const exportCSV = (data: Evidence[]) => {
    const header = ["Evidence ID", "Transaction ID", "Amount", "Counterparty Name", "Upload Date"];
    const rows   = data.map((e) => [
      e.id,
      e.transactionId,
      e.amount ?? "",
      `"${e.counterparty ?? ""}"`,
      e.uploadedAt ? e.uploadedAt.split("T")[0] : "",
    ]);
    const csv  = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `evidence-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { documents, loading, error, saveEvidence, deleteEvidence, exportCSV };
}

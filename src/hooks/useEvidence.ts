"use client";

import { useState, useEffect } from "react";
import { Evidence } from "@/types/evidence.types";
import {
  getEvidence,
  uploadEvidence as apiUploadEvidence,
  deleteEvidence as apiDeleteEvidence,
} from "@/utils/api";
import { useAuth } from "@/context/AuthContext.production";

export function useEvidence(onEvidenceChange?: (evidence: Evidence[]) => void) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Evidence[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getEvidence(user?.organisationId)
      .then(({ data }) => {
        // Map API response to Evidence shape
        const mapped: Evidence[] = (data ?? []).map((e) => ({
          id:            e.id,
          transactionId: e.transactionId,
          documentName:  e.documentName,
          fileType:      e.fileType,
          fileUrl:       e.fileUpload,
          notes:         e.notes,
          uploadedBy:    String(e.uploadedBy),
          uploadedAt:    e.uploadedAt,
          status:        "COMPLETE" as const,
          // amount and counterparty are enriched from the transaction in the UI
        }));
        setDocuments(mapped);
      })
      .catch((err) => {
        console.error("useEvidence load error", err);
        setError("Failed to load evidence.");
      })
      .finally(() => setLoading(false));
  }, [user?.organisationId]);

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
    const header = ["Evidence ID", "Transaction ID", "Amount", "Counterparty Name", "Upload Date", "Status"];
    const rows   = data.map((e) => [
      e.id,
      e.transactionId,
      e.amount ?? "",
      `"${e.counterparty ?? ""}"`,
      e.uploadedAt ? e.uploadedAt.split("T")[0] : "",
      e.status ?? "",
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

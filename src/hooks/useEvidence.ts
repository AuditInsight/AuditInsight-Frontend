"use client";

import { useState, useEffect } from "react";
import { Evidence } from "@/types/evidence.types";
import { MOCK_EVIDENCE } from "@/mock/evidence.mock";

/*
 * ── REAL API (commented for UI refinement phase) ──────────────────
 * import { getEvidence, uploadEvidence } from "@/utils/api";
 * ─────────────────────────────────────────────────────────────────
 */

export function useEvidence(onEvidenceChange?: (evidence: Evidence[]) => void) {
  const [documents, setDocuments] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * getEvidence()
     *   .then((res) => setDocuments(res.data ?? []))
     *   .catch(console.error)
     *   .finally(() => setLoading(false));
     * ─────────────────────────────────────────────────────────────
     */
    setDocuments(MOCK_EVIDENCE);
    setLoading(false);
  }, []);

  const saveEvidence = (saved: Evidence) => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * await uploadEvidence(file, { transactionId, documentName, folder, subfolder, notes });
     * ─────────────────────────────────────────────────────────────
     */
    let updated: Evidence[];
    setDocuments((prev) => {
      const idx = prev.findIndex((e) => e.id === saved.id);
      updated = idx >= 0
        ? prev.map((e) => (e.id === saved.id ? saved : e))
        : [saved, ...prev];
      return updated;
    });
    // Notify parent hook so transaction statuses re-derive
    setTimeout(() => {
      if (onEvidenceChange) {
        setDocuments((current) => { onEvidenceChange(current); return current; });
      }
    }, 0);
  };

  const deleteEvidence = (id: string) => {
    setDocuments((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      if (onEvidenceChange) onEvidenceChange(updated);
      return updated;
    });
  };

  // Export all displayed evidence as CSV
  const exportCSV = (data: Evidence[]) => {
    const header = ["Evidence ID", "Transaction ID", "Document Name", "Amount", "Counterparty", "Upload Date", "Status", "File Type"];
    const rows = data.map((e) => [
      e.id,
      e.transactionId,
      `"${e.documentName}"`,
      e.amount ?? "",
      `"${e.counterparty ?? ""}"`,
      e.uploadedAt ? e.uploadedAt.split("T")[0] : "",
      e.status ?? "",
      e.fileType,
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evidence-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { documents, loading, saveEvidence, deleteEvidence, exportCSV };
}

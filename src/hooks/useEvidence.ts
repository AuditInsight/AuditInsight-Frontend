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
    setDocuments(MOCK_EVIDENCE);
    setLoading(false);
  }, []);

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

  const deleteEvidence = (id: string) => {
    setDocuments((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      onEvidenceChange?.(updated);
      return updated;
    });
  };

  const exportCSV = (data: Evidence[]) => {
    const header = [
      "Evidence ID",
      "Transaction ID",
      "Amount",
      "Counterparty Name",
      "Upload Date",
      "Status",
    ];
    const rows = data.map((e) => [
      e.id,
      e.transactionId,
      e.amount ?? "",
      `"${e.counterparty ?? ""}"`,
      e.uploadedAt ? e.uploadedAt.split("T")[0] : "",
      e.status ?? "",
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

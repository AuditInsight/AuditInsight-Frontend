import { Evidence } from "@/types/evidence.types";

export function evidenceMatchesSearch(
  evidence: Evidence,
  query: string
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const searchable = [
    evidence.id,
    evidence.documentName,
    evidence.folder,
    evidence.subfolder,
    evidence.status,
    evidence.fileType,
    evidence.notes,
    evidence.counterparty,
    evidence.uploadedBy,
    evidence.uploadedAt,
    evidence.transactionId,
    evidence.amount,
    evidence.fileUpload,
  ];

  return searchable.some((value) =>
    String(value ?? "")
      .toLowerCase()
      .includes(q)
  );
}

import { Evidence } from "@/types/evidence.types";

export function evidenceMatchesSearch(
  evidence: Evidence,
  query: string
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const searchable = [
    evidence.id,
    evidence.name,
    evidence.category,
    evidence.subCategory,
    evidence.status,
    evidence.type,
    evidence.notes,
    evidence.counterpartyName,
    evidence.uploadedBy,
    evidence.date,
    evidence.transactionId,
    evidence.amount,
    evidence.url,
  ];

  return searchable.some((value) =>
    String(value ?? "")
      .toLowerCase()
      .includes(q)
  );
}

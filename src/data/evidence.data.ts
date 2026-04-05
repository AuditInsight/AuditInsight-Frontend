import { Evidence } from "@/types/evidence.types";

export const evidenceData: Evidence[] = [
  {
    id: "EVD1",
    name: "Invoice #INV-001",
    category: "Invoice",
    type: "Document",
    url: "#",
    date: "2026-04-01",
    uploadedBy: "John Doe",
    uploadedAt: "2026-04-01T10:00:00Z",
    transactionId: "TXN10651",
    status: "Verified",
  },
  {
    id: "EVD2",
    name: "Receipt Scan",
    category: "Receipt",
    type: "Image",
    url: "#",
    date: "2026-04-01",
    uploadedBy: "Jane Doe",
    uploadedAt: "2026-04-01T12:00:00Z",
    transactionId: "TXN10651",
    status: "Pending",
  },
];
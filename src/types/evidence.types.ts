export interface Evidence {
  id: number;
  name: string;
  category: string;
  subCategory: string;

  type: string;
  url: string;

  date: string;

  uploadedBy: string;
  uploadedAt: string;

  status: "Pending" | "Verified" | "Missing";

  notes?: string;

  /* ✅ NEW RELATION FIELDS */
  transactionId?: number;
  amount?: number;
  counterpartyName?: string;

  fileObject?: File; // ✅ add here
}
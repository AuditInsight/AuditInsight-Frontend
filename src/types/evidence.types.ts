export interface Evidence {
  id: number;
  name: string;
  category: string;
  subCategory: string;

  type: "Document" | "Image" | "PDF";
  url: string;

  date: string;
  uploadedBy: string;
  uploadedAt: string;

  transactionId?: number;

  status: "Verified" | "Pending" | "Missing";

  notes?: string;

  amount?: number; // ✅ ADD THIS
}
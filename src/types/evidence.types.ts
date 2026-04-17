export interface Evidence {
  id: number;
  name: string;
  category: "Invoice" | "Contract" | "Receipt" | "Approval" | "Other";

  type: "Document" | "Image" | "Email";
  url: string;

  amount?: number;
  date: string;

  uploadedBy: string;
  uploadedAt: string;

  // 🔗 RELATION
  transactionId: number;

  // 🔐 AUDIT STATE
  status: "Verified" | "Pending" | "Missing";

  // 🔁 VERSIONING
  versionStatus?: "active" | "superseded";
}
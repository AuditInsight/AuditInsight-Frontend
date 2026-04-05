export interface Evidence {
  id: string;
  name: string;
  category: "Invoice" | "Contract" | "Receipt" | "Approval" | "Other";

  type: "Document" | "Image" | "Email";
  url: string;

  amount?: number;
  date: string;

  uploadedBy: string;
  uploadedAt: string;

  // 🔗 RELATION
  transactionId: string;

  // 🔐 AUDIT STATE
  status: "Verified" | "Pending" | "Missing";

  // 🔁 VERSIONING
  versionStatus?: "active" | "superseded";
}
export interface Evidence {
  id: string | number;
  organisationId?: string;
  transactionId?: string | number;
  linkedTransactionIds?: (string | number)[];  // many-to-many
  documentName?: string;
  folder?: string;
  subfolder?: string;
  fileUpload?: string;
  fileType?: string;
  uploadedBy?: string | number;
  uploadedAt?: string;
  notes?: string;
  version?: number;              // version control — increments on re-upload
  previousVersions?: {           // keeps history of all uploads
    fileUpload: string;
    uploadedAt: string;
    uploadedBy: string | number;
    version: number;
  }[];
  checklistItem?: string;        // e.g. "Receipt", "Boarding Pass", "Invoice"
  checklistRequired?: boolean;

  // Legacy
  name?: string;
  category?: string;
  subCategory?: string;
  type?: string;
  url?: string;
  date?: string;
  status?: "Pending" | "Verified" | "Missing";
  amount?: number;
  counterpartyName?: string;
  fileObject?: File;
}

export interface EvidenceChecklist {
  transactionCategory: string;   // e.g. "Travel Expense"
  requiredItems: string[];        // ["Receipt", "Boarding Pass"]
}

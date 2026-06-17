export interface Evidence {
  // Real API fields
  id: string | number;
  organisationId?: string;
  transactionId?: string | number;
  documentName?: string;
  folder?: string;
  subfolder?: string;
  fileUpload?: string;
  fileType?: string;
  uploadedBy?: string | number;
  uploadedAt?: string;
  notes?: string;

  // Legacy mock-data fields (kept optional for pages not yet migrated)
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

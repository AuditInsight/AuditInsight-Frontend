// ── Evidence — must always be linked to exactly one transaction ────
export interface Evidence {
  id: string;
  organisationId?: string;
  // Required — evidence MUST be linked to a transaction
  transactionId: string;
  documentName: string;
  folder: string;
  subfolder: string;
  fileUpload: string;         // URL (Cloudinary or mock)
  fileType: string;           // pdf | xlsx | png | jpg
  uploadedBy?: string | number;
  uploadedAt?: string;
  notes?: string;
  status?: "Pending" | "Verified";

  // Inherited from the linked transaction (denormalised for display)
  amount?: number;
  counterparty?: string;
}



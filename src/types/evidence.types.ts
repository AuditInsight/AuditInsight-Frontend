// ── Evidence — usually linked to a transaction, but may stand alone ────
export interface Evidence {
  id: string;
  organisationId?: string;
  // Optional — a standalone document (e.g. uploaded purely to be signed) has none
  transactionId?: string | null;
  documentName: string;
  folder: string;
  subfolder: string;
  fileUpload: string;         // URL (Cloudinary or mock)
  fileType: string;           // pdf | xlsx | png | jpg
  uploadedBy?: string | number;
  uploadedAt?: string;
  notes?: string;

  // Inherited from the linked transaction (denormalised for display)
  amount?: number;
  counterparty?: string;
}



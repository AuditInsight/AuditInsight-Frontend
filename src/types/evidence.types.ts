// ── Evidence — usually linked to a transaction, but may stand alone ────
export interface Evidence {
  id: string;
  organisationId?: string;
  // Optional — a standalone document (e.g. uploaded purely to be signed) has none
  transactionId?: string | null;
  documentName: string;
  folder: string;
  subfolder: string;
  fileUpload: string;         // API path that serves the original (never a public storage link); "" when no file
  fileType: string;           // pdf | xlsx | png | jpg
  uploadedBy?: string | number;
  uploadedAt?: string;
  notes?: string;
  // How many people have signed it; when > 0, Preview/Download serve the signed PDF instead of the original
  signatureCount?: number;
  // Signed on the page (PDF, image, or Word/Excel converted to PDF) rather than with a signature certificate
  placeable?: boolean;

  // Inherited from the linked transaction (denormalised for display)
  amount?: number;
  counterparty?: string;
}



"use client";

import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { getSignedEvidenceFile, downloadSignedEvidence } from "@/utils/api";

/**
 * One place that decides which file a Preview / Download button should serve for an evidence document:
 * the signed PDF once anyone has signed it, otherwise the original upload.
 */

type DocumentRef = {
  id: string;
  documentName: string;
  fileUpload: string;
  fileType?: string | null;
  signatureCount?: number;
};

// File types the server can put signatures onto. Anything else (DOCX, XLS, XLSX) gets a separate
// signature certificate PDF instead of the document itself — see SignedDocumentService on the backend.
const STAMPABLE_TYPES = new Set(["pdf", "png", "jpg", "jpeg"]);

export const isStampable = (fileType?: string | null) => STAMPABLE_TYPES.has((fileType ?? "").toLowerCase());

export const isSigned = (doc: { signatureCount?: number }) => (doc.signatureCount ?? 0) > 0;

/** "signed document" for PDFs/images, "signature certificate" for Word/Excel files. */
export const signedOutputName = (fileType?: string | null) =>
  isStampable(fileType) ? "signed document" : "signature certificate";

export const CERTIFICATE_NOTE =
  "Word and Excel files can't have a signature placed on them, so signing produces a separate PDF " +
  "signature certificate listing who signed and when. Keep it together with the original file.";

/** True for file names the server will only be able to sign with a separate certificate. */
export const isCertificateOnlyFile = (fileName?: string | null) => {
  const ext = fileName?.includes(".") ? fileName.split(".").pop() : "";
  return Boolean(ext) && !isStampable(ext);
};

function downloadOriginal(doc: DocumentRef) {
  const a = document.createElement("a");
  a.href = doc.fileUpload;
  a.download = doc.documentName;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.click();
}

/**
 * Preview/download state for a list of documents. Signed documents open in an in-app PDF preview
 * (render it with <SignedDocumentPreviewModal />); unsigned ones open the original file as before.
 */
export function useEvidenceDocumentAccess() {
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Release the blob URL whenever the preview changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  const previewDocument = useCallback(async (doc: DocumentRef) => {
    setError(null);
    if (!isSigned(doc)) {
      window.open(doc.fileUpload, "_blank", "noopener,noreferrer");
      return;
    }
    setBusyId(doc.id);
    try {
      const { blob } = await getSignedEvidenceFile(doc.id, doc.documentName);
      const label = isStampable(doc.fileType) ? "Signed document" : "Signature certificate";
      setPreview({ url: URL.createObjectURL(blob), title: `${label} — ${doc.documentName}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the signed document.");
    } finally {
      setBusyId(null);
    }
  }, []);

  const downloadDocument = useCallback(async (doc: DocumentRef) => {
    setError(null);
    if (!isSigned(doc)) {
      downloadOriginal(doc);
      return;
    }
    setBusyId(doc.id);
    try {
      await downloadSignedEvidence(doc.id, doc.documentName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not download the signed document.");
    } finally {
      setBusyId(null);
    }
  }, []);

  const closePreview = useCallback(() => setPreview(null), []);

  return { preview, busyId, error, previewDocument, downloadDocument, closePreview };
}

/** Human-readable reason a signature could not be saved, using the server's message when it sent one. */
export function signErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { message?: string; error?: string } | undefined;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (!err.response) return "The server could not be reached. Check your connection.";
  }
  return err instanceof Error && err.message ? err.message : "Something went wrong while saving your signature.";
}

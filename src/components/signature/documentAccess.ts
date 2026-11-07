"use client";

import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { getSignedEvidenceFile, downloadSignedEvidence, getOriginalEvidenceFile, type SignedVersionInfo } from "@/utils/api";

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

/**
 * "Signed version v3 · fingerprint 1a2b3c4d5e6f" — identifies the exact stored file. Preview and Download of the
 * same version always show the same fingerprint (the start of the file's SHA-256).
 */
export function describeSignedVersion(info: SignedVersionInfo | null | undefined): string | null {
  if (!info?.version) return null;
  const fingerprint = info.sha256 ? ` · fingerprint ${info.sha256.slice(0, 12)}` : "";
  return `Signed version v${info.version}${fingerprint}`;
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * Preview/download state for a list of documents. Everything is fetched through the API (access-checked,
 * integrity-checked and audited) — never from a public storage link. Signed documents serve the stored signed
 * PDF; unsigned ones the original. Previews open in-app: render them with <SignedDocumentPreviewModal />.
 */
export function useEvidenceDocumentAccess() {
  const [preview, setPreview] = useState<{ url: string; title: string; subtitle: string | null } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // The stored signed version last previewed or downloaded, keyed by document so it never shows on another one.
  const [lastVersion, setLastVersion] = useState<{ docId: string; info: SignedVersionInfo } | null>(null);

  // Release the blob URL whenever the preview changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  /** Download the original upload. */
  const downloadOriginal = useCallback(async (doc: DocumentRef) => {
    setError(null);
    setBusyId(doc.id);
    try {
      const { blob, fileName } = await getOriginalEvidenceFile(doc.id, doc.documentName);
      saveBlob(blob, fileName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not download the original document.");
    } finally {
      setBusyId(null);
    }
  }, []);

  /** Show the original upload in-app (PDFs and images); Word/Excel can't be shown in a browser, so they download. */
  const previewOriginal = useCallback(async (doc: DocumentRef) => {
    if (!isStampable(doc.fileType)) {
      await downloadOriginal(doc);
      return;
    }
    setError(null);
    setBusyId(doc.id);
    try {
      const { blob, sha256 } = await getOriginalEvidenceFile(doc.id, doc.documentName);
      setPreview({
        url: URL.createObjectURL(blob),
        title: `Original — ${doc.documentName}`,
        subtitle: `Original upload (v0)${sha256 ? ` · fingerprint ${sha256.slice(0, 12)}` : ""}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the original document.");
    } finally {
      setBusyId(null);
    }
  }, [downloadOriginal]);

  const previewDocument = useCallback(async (doc: DocumentRef) => {
    setError(null);
    if (!isSigned(doc)) {
      await previewOriginal(doc);
      return;
    }
    setBusyId(doc.id);
    try {
      const { blob, version, sha256 } = await getSignedEvidenceFile(doc.id, doc.documentName);
      const label = isStampable(doc.fileType) ? "Signed document" : "Signature certificate";
      setLastVersion({ docId: doc.id, info: { version, sha256 } });
      setPreview({
        url: URL.createObjectURL(blob),
        title: `${label} — ${doc.documentName}`,
        subtitle: describeSignedVersion({ version, sha256 }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the signed document.");
    } finally {
      setBusyId(null);
    }
  }, [previewOriginal]);

  const downloadDocument = useCallback(async (doc: DocumentRef) => {
    setError(null);
    if (!isSigned(doc)) {
      await downloadOriginal(doc);
      return;
    }
    setBusyId(doc.id);
    try {
      const info = await downloadSignedEvidence(doc.id, doc.documentName);
      setLastVersion({ docId: doc.id, info });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not download the signed document.");
    } finally {
      setBusyId(null);
    }
  }, [downloadOriginal]);

  const closePreview = useCallback(() => setPreview(null), []);

  /** Text naming the stored version last served for this document, or null if none was loaded yet. */
  const versionLabelFor = useCallback(
    (docId: string) => (lastVersion?.docId === docId ? describeSignedVersion(lastVersion.info) : null),
    [lastVersion]
  );

  return {
    preview, busyId, error, previewDocument, downloadDocument, previewOriginal, downloadOriginal, closePreview,
    versionLabelFor,
  };
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

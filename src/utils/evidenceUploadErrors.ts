import { isAxiosError } from "axios";

/**
 * Turns a failed evidence-upload request into a clean, user-facing message —
 * never the backend's raw validation text (e.g. "File type 'docx' is not
 * allowed...") or axios's generic "Request failed with status code 400".
 */
export function friendlyEvidenceUploadError(err: unknown): string {
  if (!isAxiosError(err)) {
    return "We couldn't upload this document. Please check your connection and try again.";
  }

  if (err.code === "ECONNABORTED") {
    return "The upload timed out. Please check your connection and try again.";
  }

  const status = err.response?.status;
  const raw = String(
    (err.response?.data as { error?: string; message?: string } | undefined)?.error ??
      (err.response?.data as { error?: string; message?: string } | undefined)?.message ??
      ""
  ).toLowerCase();

  if (status === 413 || raw.includes("exceeds") || raw.includes("too large")) {
    return "This file is too large to upload. Please choose a file under 10 MB.";
  }
  if (status === 400) {
    if (raw.includes("file type")) {
      return "That file type isn't supported. Please upload a PDF, Word document, spreadsheet, or image.";
    }
    if (raw.includes("folder") || raw.includes("subfolder")) {
      return "Please choose a valid folder and subfolder for this document.";
    }
    if (raw.includes("transaction")) {
      return "We couldn't match this document to that transaction. Please choose another transaction and try again.";
    }
    if (raw.includes("organisation")) {
      return "We couldn't find your organisation. Please refresh the page and try again.";
    }
    return "We couldn't process this upload. Please double-check the details you entered and try again.";
  }
  if (status === 403) {
    return "You don't have permission to upload evidence for this organisation.";
  }
  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }
  if (status && status >= 500) {
    return "Something went wrong on our end. Please try again in a moment.";
  }
  return "We couldn't upload this document. Please try again.";
}

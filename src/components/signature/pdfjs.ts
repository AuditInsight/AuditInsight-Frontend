"use client";

import type { PDFDocumentProxy } from "pdfjs-dist";

/**
 * Loads pdf.js only in the browser, when a document is first opened for signing, and starts its worker from the
 * same package version via the bundler, so the library and worker can never drift apart.
 */
let libPromise: Promise<typeof import("pdfjs-dist")> | null = null;

function loadPdfJs() {
  if (!libPromise) {
    libPromise = import("pdfjs-dist").then((lib) => {
      if (!lib.GlobalWorkerOptions.workerPort) {
        lib.GlobalWorkerOptions.workerPort = new Worker(
          new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
          { type: "module" }
        );
      }
      return lib;
    });
  }
  return libPromise;
}

/** Opens a PDF from bytes. pdf.js takes ownership of the buffer it is given, so it gets a copy. */
export async function openPdf(data: ArrayBuffer): Promise<PDFDocumentProxy> {
  const lib = await loadPdfJs();
  return lib.getDocument({ data: new Uint8Array(data.slice(0)) }).promise;
}

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { theme } from "@/styles/theme";
import { Evidence } from "@/types/evidence.types";
import { useEvidenceDocumentAccess, isSigned, isStampable } from "@/components/signature/documentAccess";
import { SignedDocumentPreviewModal } from "@/components/signature/SignedDocumentPreviewModal";

type FilterDropdownProps = {
  label: string;
  options: string[];
  evidences?: never;

  // ✅ NEW
  onChange?: (value: string) => void;
};

type EvidenceDropdownProps = {
  label?: never;
  options?: never;
  evidences: Evidence[];

  // ✅ NEVER FOR EVIDENCE MODE
  onChange?: never;
};

type Props =
  | FilterDropdownProps
  | EvidenceDropdownProps;

export const EvidenceDropdown = (
  props: Props
) => {
  const [open, setOpen] = useState(false);
  // Signed documents open/download as the signed PDF; unsigned ones as the original file.
  const docs = useEvidenceDocumentAccess();

  /* =========================
     MODE 1: FILTER DROPDOWN
  ========================= */
  if ("options" in props && props.options) {
    return (
      <div style={{ position: "relative" }}>
        <button
          style={button}
          onClick={() => setOpen(!open)}
        >
          {props.label}
          <ChevronDown size={14} />
        </button>

        {open && (
          <div style={dropdown}>
            {props.options.map((opt) => (
              <div
                key={opt}
                style={item}
                onClick={() => {
                  props.onChange?.(opt);

                  setOpen(false);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* =========================
     MODE 2: EVIDENCE DROPDOWN
  ========================= */
  const evidences = props.evidences || [];

  if (evidences.length === 0) {
    return <span>No documents</span>;
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        style={button}
        onClick={() => setOpen(!open)}
      >
        {evidences.length} Document(s)
        <ChevronDown size={14} />
      </button>

      {open && (
        <div style={dropdown}>
          {evidences.map((doc) => {
            const busy = docs.busyId === doc.id;
            const what = !isSigned(doc) ? "" : isStampable(doc.fileType) ? " signed document" : " signature certificate";

            return (
              <div
                key={doc.id}
                style={itemRow}
              >
                {/* 👁 OPEN / PREVIEW */}
                <button
                  style={actionBtn}
                  disabled={busy || !doc.fileUpload}
                  title={`Open${what}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    docs.previewDocument(doc);
                  }}
                >
                  👁 Open
                </button>

                {/* ⬇ DOWNLOAD */}
                <button
                  style={actionBtn}
                  disabled={busy || !doc.fileUpload}
                  title={`Download${what}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    docs.downloadDocument(doc);
                  }}
                >
                  {busy ? "Preparing…" : "⬇ Download"}
                </button>

                {/* 📄 LABEL */}
                <span style={{ flex: 1 }}>
                  {doc.documentName}
                  {isSigned(doc) && <span style={signedTag}> · Signed</span>}
                </span>
              </div>
            );
          })}
          {docs.error && <div style={errorRow}>{docs.error}</div>}
        </div>
      )}
      <SignedDocumentPreviewModal url={docs.preview?.url ?? null} title={docs.preview?.title ?? ""} subtitle={docs.preview?.subtitle} onClose={docs.closePreview} />
    </div>
  );
};

const signedTag: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "#15803d" };
const errorRow: React.CSSProperties = { padding: "8px 10px", fontSize: 12, color: "#b91c1c" };

/* =========================
   STYLES
========================= */

const button: React.CSSProperties = {
  padding: "6px 12px",
  border: `1px solid ${theme.colors.border}`,
  borderRadius: 6,
  background: theme.colors.Surface,
  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  gap: 6,
};

const dropdown: React.CSSProperties = {
  position: "absolute",
  top: "110%",
  left: 0,

  background: theme.colors.Surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: 8,

  width: 220,

  zIndex: 10,

  overflow: "hidden",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)",
};

const item: React.CSSProperties = {
  padding: "10px 12px",
  display: "block",

  color: theme.colors.textPrimary,
  cursor: "pointer",

  borderBottom: `1px solid ${theme.colors.border}`,
};

const itemRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  gap: 8,

  padding: "8px 10px",

  borderBottom: `1px solid ${theme.colors.border}`,
};

const actionBtn: React.CSSProperties = {
  fontSize: 12,
  color: theme.colors.primary,
  cursor: "pointer",
  textDecoration: "underline",

  background: "none",
  border: "none",
  padding: 0,
};



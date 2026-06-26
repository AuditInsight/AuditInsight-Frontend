"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { theme } from "@/styles/theme";
import { Evidence } from "@/types/evidence.types";

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
            const url = doc.fileUpload || "#";

            return (
              <div
                key={doc.id}
                style={itemRow}
              >
                {/* 👁 OPEN / PREVIEW */}
                <button
                  style={actionBtn}
                  onClick={(e) => {
                    e.stopPropagation();

                    window.open(
                      url,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                >
                  👁 Open
                </button>

                {/* ⬇ DOWNLOAD */}
                <a
                  href={url}
                  download={doc.documentName}
                  style={actionBtn}
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  ⬇ Download
                </a>

                {/* 📄 LABEL */}
                <span style={{ flex: 1 }}>
                  {doc.documentName}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

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
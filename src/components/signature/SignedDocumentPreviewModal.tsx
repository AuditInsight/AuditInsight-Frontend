"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { theme } from "@/styles/theme";
import { zIndex } from "@/styles/zIndex";

interface Props {
  /** Blob URL of the signed PDF; nothing renders while it is null. */
  url: string | null;
  title: string;
  /** Optional second line, e.g. which stored signed version this is. */
  subtitle?: string | null;
  onClose: () => void;
}

/** Full-screen in-app viewer for a signed document PDF, shown above any open modal. */
export function SignedDocumentPreviewModal({ url, title, subtitle, onClose }: Props) {
  if (!url || typeof document === "undefined") return null;

  return createPortal(
    <div
      style={overlay}
      onClick={(event) => {
        event.stopPropagation();
        onClose();
      }}
    >
      <div style={modal} onClick={(event) => event.stopPropagation()}>
        <div style={header}>
          <div style={{ minWidth: 0 }}>
            <strong style={heading}>{title}</strong>
            {subtitle && <div style={sub}>{subtitle}</div>}
          </div>
          <button type="button" onClick={onClose} style={closeBtn} aria-label="Close preview">
            <X size={16} />
          </button>
        </div>
        <iframe title={title} src={url} style={frame} />
      </div>
    </div>,
    document.body
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: zIndex.modal + 50,
  background: "rgba(15,23,42,0.65)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const modal: React.CSSProperties = {
  width: "min(1100px, 96vw)",
  height: "min(850px, 92vh)",
  background: "#fff",
  borderRadius: 12,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: "10px 14px",
  borderBottom: `1px solid ${theme.colors.border}`,
  color: theme.colors.textPrimary,
  fontSize: 13,
};

const heading: React.CSSProperties = {
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const sub: React.CSSProperties = {
  marginTop: 2,
  fontSize: 11.5,
  color: theme.colors.textMuted,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const closeBtn: React.CSSProperties = {
  border: "none",
  background: "#f1f5f9",
  borderRadius: 8,
  width: 30,
  height: 30,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.colors.textSecondary,
  flexShrink: 0,
};

const frame: React.CSSProperties = {
  flex: 1,
  width: "100%",
  border: 0,
};

export default SignedDocumentPreviewModal;

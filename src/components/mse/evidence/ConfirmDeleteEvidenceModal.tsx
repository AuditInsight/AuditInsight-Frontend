"use client";

import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";

interface Props {
  isOpen: boolean;
  evidence: Evidence | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function ConfirmDeleteEvidenceModal({
  isOpen,
  evidence,
  onClose,
  onConfirm,
  isDeleting = false,
}: Props) {
  if (!isOpen || !evidence) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={title}>Delete evidence?</h3>
        <p style={message}>
          Are you sure you want to delete &quot;{evidence.documentName}&quot;? This
          action cannot be undone.
        </p>

        <div style={footer}>
          <button
            type="button"
            onClick={onClose}
            style={cancelBtn}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={deleteBtn}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9000,
};

const modal: React.CSSProperties = {
  width: 400,
  maxWidth: "92%",
  background: theme.colors.Surface,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadows.lg,
  border: `1px solid ${theme.colors.border}`,
};

const title: React.CSSProperties = {
  margin: 0,
  marginBottom: theme.spacing.sm,
  fontSize: theme.typography.lg,
  fontWeight: 600,
};

const message: React.CSSProperties = {
  margin: 0,
  fontSize: theme.typography.sm,
  color: theme.colors.textSecondary,
  lineHeight: 1.5,
};

const footer: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing.sm,
  marginTop: theme.spacing.lg,
};

const cancelBtn: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.Surface,
  cursor: "pointer",
};

const deleteBtn: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: theme.radius.md,
  border: "none",
  background: theme.colors.danger,
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

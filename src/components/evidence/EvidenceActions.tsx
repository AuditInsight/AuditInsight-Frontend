"use client";

import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface Props {
  evidence: Evidence;
  onView: (evidence: Evidence) => void;
  onEdit: (evidence: Evidence) => void;
  onDelete: (evidence: Evidence) => void;
}

export function EvidenceActions({
  evidence,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div style={actions} onClick={stop}>
      <button
        type="button"
        title="View"
        style={btn}
        onClick={() => onView(evidence)}
      >
        <Eye size={16} />
      </button>
      <button
        type="button"
        title="Update"
        style={btn}
        onClick={() => onEdit(evidence)}
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        title="Delete"
        style={{ ...btn, color: theme.colors.danger }}
        onClick={() => onDelete(evidence)}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

const actions: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
};

const btn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 6,
  border: "none",
  borderRadius: theme.radius.sm,
  background: "transparent",
  color: theme.colors.textSecondary,
  cursor: "pointer",
};

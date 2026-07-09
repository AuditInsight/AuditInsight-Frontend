"use client";

import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface Props {
  evidence: Evidence;
  onView: (evidence: Evidence) => void;
  onEdit?: (evidence: Evidence) => void;
  onDelete?: (evidence: Evidence) => void;
}

export function EvidenceActions({ evidence, onView, onEdit, onDelete }: Props) {
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div style={actions} onClick={stop}>
      <ActionBtn title="View" color="#1e3a8a" hoverBg="#eff6ff" onClick={() => onView(evidence)}>
        <Eye size={14} />
      </ActionBtn>
      {onEdit && (
        <ActionBtn title="Edit" color="#15803d" hoverBg="#f0fdf4" onClick={() => onEdit(evidence)}>
          <Pencil size={14} />
        </ActionBtn>
      )}
      {onDelete && (
        <ActionBtn title="Delete" color="#dc2626" hoverBg="#fee2e2" onClick={() => onDelete(evidence)}>
          <Trash2 size={14} />
        </ActionBtn>
      )}
    </div>
  );
}

function ActionBtn({
  children, title, color, hoverBg, onClick,
}: {
  children: React.ReactNode;
  title: string;
  color: string;
  hoverBg: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      style={btn}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hoverBg;
        e.currentTarget.style.color = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = theme.colors.textSecondary;
      }}
    >
      {children}
    </button>
  );
}

const actions: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 2,
};

const btn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  padding: 0,
  border: "none",
  borderRadius: 7,
  background: "transparent",
  color: theme.colors.textSecondary,
  cursor: "pointer",
  transition: "all 0.15s",
};

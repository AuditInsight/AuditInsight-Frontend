"use client";

import { Transaction } from "@/types/transaction.types";
import { theme } from "@/styles/theme";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface Props {
  transaction: Transaction;
  onView: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export function TransactionActions({
  transaction,
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
        onClick={() => onView(transaction)}
      >
        <Eye size={16} />
      </button>
      <button
        type="button"
        title="Edit"
        style={{ ...btn, display: onEdit ? "flex" : "none" }}
        onClick={() => onEdit?.(transaction)}
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        title="Delete"
        style={{ ...btn, color: theme.colors.danger, display: onDelete ? "flex" : "none" }}
        onClick={() => onDelete?.(transaction)}
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



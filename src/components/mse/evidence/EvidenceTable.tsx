"use client";

import { Evidence } from "@/types/evidence.types";
import { EvidenceRow } from "./EvidenceRow";
import { theme } from "@/styles/theme";
import { FileX } from "lucide-react";

interface Props {
  data: Evidence[];
  onView: (evidence: Evidence) => void;
  onEdit?: (evidence: Evidence) => void;
  onDelete?: (evidence: Evidence) => void;
}

export const statusStyles = {
  Verified: { background: "#dcfce7", color: "#15803d" },
  Pending:  { background: "#fef3c7", color: "#d97706" },
  Missing:  { background: "#fee2e2", color: "#dc2626" },
};

const COLUMNS = ["Document", "Category", "Amount", "Counterparty", "Date", "Linked Transaction", "Verification", "Actions"];

export const EvidenceTable = ({ data, onView, onEdit, onDelete }: Props) => {
  return (
    <div style={wrapper}>
      <table style={table}>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col} style={th}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} style={emptyCell}>
                <div style={emptyState}>
                  <FileX size={32} color={theme.colors.textMuted} />
                  <span>No documents found</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((e, i) => (
              <EvidenceRow
                key={e.id}
                evidence={e}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                isEven={i % 2 === 0}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const wrapper: React.CSSProperties = {
  overflowX: "auto",
  background: "#fff",
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "11px 16px",
  fontSize: 11.5,
  fontWeight: 700,
  color: theme.colors.textSecondary,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  background: "#f8fafc",
  borderBottom: `1px solid ${theme.colors.border}`,
  whiteSpace: "nowrap",
};

const emptyCell: React.CSSProperties = {
  padding: "48px 16px",
  textAlign: "center",
};

const emptyState: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
  color: theme.colors.textMuted,
  fontSize: 14,
};

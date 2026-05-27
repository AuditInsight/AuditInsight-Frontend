"use client";

import { Evidence } from "@/types/evidence.types";
import { EvidenceRow } from "./EvidenceRow";
import { theme } from "@/styles/theme";

interface Props {
  data: Evidence[];
  onView: (evidence: Evidence) => void;
  onEdit: (evidence: Evidence) => void;
  onDelete: (evidence: Evidence) => void;
}

export const statusStyles = {
  Verified: {
    background: theme.colors.successSoft,
    color: theme.colors.success,
  },

  Pending: {
    background: theme.colors.warningSoft,
    color: theme.colors.warning,
  },

  Missing: {
    background: theme.colors.dangerSoft,
    color: theme.colors.danger,
  },
};

export const EvidenceTable = ({
  data,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div style={wrapper}>
      <table style={table}>
        <thead style={thead}>
          <tr>
            <th style={th}>Document</th>
            <th style={th}>Category</th>
            <th style={th}>Amount</th>
            <th style={th}>Counterparty</th>
            <th style={th}>Date</th>
            <th style={th}>Linked Transaction</th>
            <th style={th}>Verification</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((e) => (
            <EvidenceRow
              key={e.id}
              evidence={e}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const wrapper: React.CSSProperties = {
  overflowX: "auto",
  marginTop: 16,
  background: `
    linear-gradient(
      180deg,
      rgba(255,255,255,0.96),
      rgba(255,255,255,0.92)
    )
  `,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  backdropFilter: "blur(18px)",
  boxShadow: `0 10px 30px rgba(15,23,42,0.04)`,
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
};

const thead: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 3,
  background: `
    linear-gradient(
      180deg,
      rgba(248,250,252,0.95),
      rgba(241,245,249,0.92)
    )
  `,
  backdropFilter: "blur(12px)",
  borderBottom: `1px solid ${theme.colors.border}`,
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "14px 18px",
  fontSize: theme.typography.sm,
  fontWeight: 700,
  color: theme.colors.textSecondary,
  letterSpacing: "-0.01em",
  whiteSpace: "nowrap",
  borderBottom: `1px solid ${theme.colors.border}`,
};
